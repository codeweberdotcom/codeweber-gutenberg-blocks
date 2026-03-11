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
    ob_start();
    extract(['attributes' => $attributes, 'content' => $content, 'block' => $block], EXTR_SKIP);
    require $render_path;
    return ob_get_clean();
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
3. Calls `ob_start()`, `require $render_path`, `ob_get_clean()`
4. Returns rendered HTML

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
           ob_start();
           require $render_path;
           return ob_get_clean();
       }
       return $pre_render;
   }
   ```

6. Run `npm run build`
