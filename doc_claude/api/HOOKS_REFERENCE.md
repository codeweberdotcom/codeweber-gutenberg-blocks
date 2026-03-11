# Hooks Reference

## WordPress Filters Used by Plugin

### `pre_render_block`

Intercepts block rendering before WordPress processes it. Used for all dynamic blocks.

**Signature:** `apply_filters('pre_render_block', null, $parsed_block)`

**Plugin adds 13 handlers:**

| Handler method | Block intercepted |
|---------------|------------------|
| `pre_render_accordion_block` | `codeweber-blocks/accordion` |
| `pre_render_lists_block` | `codeweber-blocks/lists` |
| `pre_render_menu_block` | `codeweber-blocks/menu` |
| `pre_render_avatar_block` | `codeweber-blocks/avatar` (user/staff mode only) |
| `pre_render_file_field` | `codeweber-blocks/form-field` (file type) |
| `pre_render_form_field_inline_button` | `codeweber-blocks/form-field` (inline button) |
| `pre_render_html_blocks_block` | `codeweber-blocks/html-blocks` |
| `pre_render_shortcode_render_block` | `codeweber-blocks/shortcode-render` |
| `pre_render_contacts_block` | `codeweber-blocks/contacts` |
| `pre_render_social_icons_block` | `codeweber-blocks/social-icons` |
| `pre_render_tables_block` | `codeweber-blocks/tables` |
| `pre_render_navbar_block` | `codeweber-blocks/navbar` |
| `pre_render_top_header_block` | `codeweber-blocks/top-header` |

---

### `allowed_block_types_all`

Restricts which blocks are available in the editor based on post type.

**Plugin handler:** `Plugin::filterHeaderWidgetsBlocksByPostType()`

**Effect:** `codeweber-blocks/header-widgets` is only available when editing CPT `header`. Removed from all other post types.

---

### `block_categories_all`

Adds custom block categories to Gutenberg.

**Plugin handler:** `Plugin::gutenbergBlocksRegisterCategory()`

**Adds:**
- `codeweber-gutenberg-blocks`
- `codeweber-gutenberg-elements`
- `codeweber-gutenberg-widgets`

---

### `block_editor_settings_all`

Injects global editor CSS into iframed editor (WP 6.3+).

**Plugin handler:** `Plugin::addEditorGlobalStylesToSettings()`

**Injects:** Contents of `includes/css/editor-global.css`

---

### `block_type_metadata_settings`

Translates block `title` and `description` from `block.json`.

**Plugin handler:** `Plugin::translate_block_metadata()`

**Only for:** Blocks with name starting `codeweber-blocks/`

---

### `loco_plugins_data`

Registers the plugin with Loco Translate for translation management.

---

### `loco_extract_before`

Triggers POT file regeneration before Loco Translate sync.

---

### `loco_file_written`

Triggers translation compilation after Loco Translate saves a `.po` file.

---

## Plugin Actions

### `plugins_loaded`

- `Plugin::loadTextDomain()` — loads text domain
- `Plugin::initVideoThumbnailAPI()` — initializes VideoThumbnailAPI
- `Plugin::initLoadMoreAPI()` — initializes LoadMoreAPI

### `init` (priority 0)

- `Plugin::perInit()` — registers all action/filter hooks

### `init` (priority 5)

- `new ImageHotspotCPT()` — registers image hotspot CPT

### `init` (priority 20)

- `Plugin::init()` — registers block categories, REST endpoints

### `init` (priority 999)

- JS translation setup for listed blocks

### `enqueue_block_editor_assets`

- `Plugin::enqueueEditorGlobalStyles()` — global editor styles, ScrollCue, Prism.js

### `wp_enqueue_scripts`

- `Plugin::gutenbergBlocksExternalLibraries()` — `load-more.js`, `pluign.js`

### `rest_api_init`

- 12 REST endpoints registered (see REST_API_REFERENCE.md)
