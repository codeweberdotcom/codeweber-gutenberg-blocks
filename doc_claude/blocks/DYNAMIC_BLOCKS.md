# Dynamic Blocks (render.php)

Dynamic blocks render their output server-side via PHP. The save function returns `null`.

## How It Works

```
Editor saves: null (no HTML in post_content)
Frontend request → WordPress calls render.php → returns HTML

Variables available in render.php:
  $attributes  — block attributes array
  $content     — inner blocks HTML string
  $block       — WP_Block instance
```

## Two Rendering Mechanisms

### 1. Direct render_callback (blog widgets)

Used for: `blog-post-widget`, `blog-category-widget`, `blog-tag-widget`, `blog-year-widget`

Registered in `Plugin::gutenbergBlocksInit()`:
```php
$block_args['render_callback'] = function ($attributes, $content, $block) use ($render_path) {
    extract(['attributes' => $attributes, 'content' => $content, 'block' => $block], EXTR_SKIP);
    // Drain-pattern: handles nested ob_start() inside render.php without leaking buffers
    $base_level = ob_get_level();
    ob_start();
    require $render_path;
    $parts = [];
    while (ob_get_level() > $base_level) {
        array_unshift($parts, ob_get_clean());
    }
    return implode('', $parts);
};
register_block_type($blocks_path . $block_name, $block_args);
```

### 2. `pre_render_block` filter (most dynamic blocks)

Used for blocks that need to intercept rendering before WordPress processes them.

Registered in `Plugin::perInit()`:
```php
add_filter('pre_render_block', __CLASS__ . '::pre_render_accordion_block', 10, 2);
// ... 13 similar filters
```

Each `pre_render_*` method:
1. Checks if `$parsed_block['blockName']` matches
2. Loads `build/blocks/<name>/render.php`
3. Calls `ob_start()`, `require $render_path`, drains all ob-levels, returns HTML
4. Returns rendered HTML

> **⚠️ Nested ob_start() warning** — some render.php files (especially `navbar`) call
> WordPress functions (`wp_nav_menu`, `dynamic_sidebar`, etc.) that trigger hooks which
> internally call `ob_start()` without a matching `ob_get_clean()`. A plain `ob_get_clean()`
> only captures the innermost buffer — the outer level leaks raw HTML into stdout, corrupting
> the REST API response (editor shows blank preview; saving posts fails with "not valid JSON").
>
> **Always use the drain-pattern** (see below) instead of a bare `ob_get_clean()`.

## List of Dynamic Blocks

| Block | Mechanism | render.php path |
|-------|-----------|----------------|
| `accordion` | pre_render_block | `build/blocks/accordion/render.php` |
| `avatar` | pre_render_block (user/staff only) | `build/blocks/avatar/render.php` |
| `blog-category-widget` | render_callback | `build/blocks/blog-category-widget/render.php` |
| `blog-post-widget` | render_callback | `build/blocks/blog-post-widget/render.php` |
| `blog-tag-widget` | render_callback | `build/blocks/blog-tag-widget/render.php` |
| `blog-year-widget` | render_callback | `build/blocks/blog-year-widget/render.php` |
| `contacts` | pre_render_block | `build/blocks/contacts/render.php` |
| `form` | pre_render_block (inferred) | `build/blocks/form/render.php` |
| `form-field` | pre_render_block (file fields) | `build/blocks/form-field/render.php` |
| `header-widgets` | (dynamic via CPT) | `build/blocks/header-widgets/render.php` |
| `html-blocks` | pre_render_block | `build/blocks/html-blocks/render.php` |
| `lists` | pre_render_block | `build/blocks/lists/render.php` |
| `menu` | pre_render_block | `build/blocks/menu/render.php` |
| `navbar` | pre_render_block | `build/blocks/navbar/render.php` |
| `search` | (dynamic) | `build/blocks/search/render.php` |
| `shortcode-render` | pre_render_block | `build/blocks/shortcode-render/render.php` |
| `social-icons` | pre_render_block | `build/blocks/social-icons/render.php` |
| `swiper` | (dynamic) | `build/blocks/swiper/render.php` |
| `tables` | pre_render_block | `build/blocks/tables/render.php` |
| `tabulator` | (dynamic) | `build/blocks/tabulator/render.php` |
| `top-header` | pre_render_block | `build/blocks/top-header/render.php` |
| `wc-filter-panel` | render_callback | `build/blocks/wc-filter-panel/render.php` |
| `yandex-map` | (dynamic) | `build/blocks/yandex-map/render.php` |

## Adding a New Dynamic Block

1. Create `src/blocks/<name>/save.js` returning `null`:
   ```js
   export default function Save() { return null; }
   ```

2. Create `src/blocks/<name>/render.php` with PHP output

3. Add block name to `copy-php` list in `package.json`

4. Add to `Plugin::perInit()` — new `pre_render_block` filter:
   ```php
   add_filter('pre_render_block', __CLASS__ . '::pre_render_<name>_block', 10, 2);
   ```

5. Add method to `Plugin.php`:
   ```php
   public static function pre_render_<name>_block($pre_render, $parsed_block) {
       if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/<name>') {
           return $pre_render;
       }
       $render_path = self::getBasePath() . '/build/blocks/<name>/render.php';
       if (file_exists($render_path)) {
           $attributes = $parsed_block['attrs'] ?? [];
           $content = $parsed_block['innerHTML'] ?? '';
           $block_instance = new \WP_Block($parsed_block);
           extract(['attributes' => $attributes, 'content' => $content, 'block' => $block_instance], EXTR_SKIP);
           // Use drain-pattern to handle nested ob_start() calls inside render.php
           // (e.g. wp_nav_menu hooks). A plain ob_get_clean() leaks the outer buffer
           // into stdout, corrupting REST API responses.
           $base_level = ob_get_level();
           ob_start();
           require $render_path;
           $parts = [];
           while (ob_get_level() > $base_level) {
               array_unshift($parts, ob_get_clean());
           }
           return implode('', $parts);
       }
       return $pre_render;
   }
   ```

6. Run `npm run build`
