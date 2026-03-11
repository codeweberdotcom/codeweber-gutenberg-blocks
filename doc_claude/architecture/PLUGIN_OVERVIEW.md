# Plugin Architecture

## Entry Point: `plugin.php`

```
plugin.php
├── Constants: GUTENBERG_BLOCKS_VERSION, GUTENBERG_BLOCKS_URL, GUTENBERG_BLOCKS_INC_URL
├── PSR-4 autoloader: Codeweber\Blocks\ → inc/
├── Action hooks
└── Direct requires: settings restapi, card/init.php, button/init.php
```

### Constants

| Constant | Value |
|----------|-------|
| `GUTENBERG_BLOCKS_VERSION` | `'0.3.0'` |
| `GUTENBERG_BLOCKS_URL` | plugin directory URL |
| `GUTENBERG_BLOCKS_INC_URL` | URL + `'includes/'` |

### PSR-4 Autoloader

```php
namespace Codeweber\Blocks;
// Codeweber\Blocks\Plugin   → inc/Plugin.php
// Codeweber\Blocks\StyleAPI → inc/StyleAPI.php
```

---

## Lifecycle (Hooks)

```
plugins_loaded
├── Plugin::loadTextDomain()
├── Plugin::initVideoThumbnailAPI()   → new VideoThumbnailAPI()
└── Plugin::initLoadMoreAPI()         → new LoadMoreAPI()

init (priority 0)
└── Plugin::perInit()
    ├── add_action('init', gutenbergBlocksInit)          — register blocks from build/
    ├── add_action('enqueue_block_editor_assets', enqueueEditorGlobalStyles)
    ├── add_filter('block_editor_settings_all', addEditorGlobalStylesToSettings)
    ├── add_filter('allowed_block_types_all', filterHeaderWidgetsBlocksByPostType)
    ├── add_action('wp_enqueue_scripts', gutenbergBlocksExternalLibraries)
    └── add_filter('pre_render_block', ...) × 13         — intercept dynamic blocks

init (priority 5)
└── new ImageHotspotCPT()             — register CPT for Image Hotspot block

init (priority 20)
└── Plugin::init()
    ├── add_filter('block_categories_all', gutenbergBlocksRegisterCategory)
    └── add_action('rest_api_init', ...) × 12            — register REST endpoints
```

---

## Main Class: `inc/Plugin.php`

**Namespace:** `Codeweber\Blocks`

### Constants

| Constant | Value |
|----------|-------|
| `PREFIX` | `'codeweber-gutenberg-blocks'` |
| `L10N` | `self::PREFIX` |

### Key Static Methods

| Method | Description |
|--------|-------------|
| `perInit()` | Registers core init hooks |
| `init()` | Registers block categories and REST endpoints |
| `gutenbergBlocksInit()` | Registers all 47 blocks from `build/blocks/` |
| `gutenbergBlocksRegisterCategory()` | Adds 3 Gutenberg categories |
| `gutenbergBlocksExternalLibraries()` | Enqueues frontend scripts (load-more.js) |
| `enqueueEditorGlobalStyles()` | Global editor styles for all blocks |
| `filterHeaderWidgetsBlocksByPostType()` | Restricts header-widgets block to CPT `header` only |
| `getBlocksName()` | Returns array of all 47 block names |
| `getBaseUrl()` | Plugin URL (no trailing slash) |
| `getBasePath()` | Absolute filesystem path to plugin folder |

### Block Categories

| Slug | Label |
|------|-------|
| `codeweber-gutenberg-blocks` | Codeweber Gutenberg Blocks |
| `codeweber-gutenberg-elements` | Codeweber Gutenberg Elements |
| `codeweber-gutenberg-widgets` | Widgets Codeweber Gutenberg |

---

## Block Registration

`Plugin::gutenbergBlocksInit()` iterates `getBlocksName()` and calls `register_block_type()` from `build/blocks/<name>/`.

**Special cases during registration:**
- `blog-*-widget` — gets `render_callback` pointing to `build/blocks/*/render.php`
- `tabulator` — `tabulator-editor` script added as dependency
- `avatar` — placeholder image URL localized as `cwgbAvatarPlaceholderUrl`
- `search` — public post types list localized as `cwgbSearchPostTypes`
- `button` — theme button shape CSS class localized as `cwgbButtonThemeShape`

---

## Additional Classes in `inc/`

| Class | Purpose |
|-------|---------|
| `StyleAPI` | REST endpoint for styles (button/card border-radius from Redux) |
| `VideoThumbnailAPI` | REST API for video thumbnail previews |
| `LoadMoreAPI` | REST API for "Load More" functionality |
| `ImageHotspotCPT` | Custom Post Type for image hotspot block |

---

## Global JS Data

| Variable | Context | Contents |
|----------|---------|---------|
| `window.codeweberBlocksData.pluginUrl` | editor | Plugin URL |
| `cwgbLoadMore` | frontend | `restUrl`, `nonce`, translations |
| `cwgbAvatarPlaceholderUrl` | editor | Placeholder avatar image URL |
| `cwgbSearchPostTypes` | editor | List of public post types |
| `cwgbButtonThemeShape` | editor | Button shape CSS class from theme |
