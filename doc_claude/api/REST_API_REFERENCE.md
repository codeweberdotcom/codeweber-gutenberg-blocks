# REST API Reference

## Namespace: `codeweber-gutenberg-blocks/v1`

All endpoints are registered in `Plugin::init()` via `rest_api_init` actions.

Base URL: `{site_url}/wp-json/codeweber-gutenberg-blocks/v1/`

---

### GET `/image-sizes`

Returns all registered WordPress image sizes, optionally filtered by post type.

**File:** `Plugin::register_image_sizes_endpoint()`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_type` | string | No | Filter sizes allowed for this post type |

**Response:** Array of `{ value, label, width, height }`

**Auth:** Public (`__return_true`)

**Used by:** Image/Media block inspector to populate size selector

---

### GET `/taxonomies/{post_type}`

Returns all taxonomies and their terms for a given post type.

**File:** `Plugin::register_taxonomies_endpoint()`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_type` | string | Yes | Post type slug |

**Response:** Array of `{ slug, rest_base, name, singular_name, terms: [{ id, slug, name, count }] }`

**Auth:** Public

**Used by:** Accordion, Post Grid blocks to populate taxonomy filter controls

---

### GET `/post-card-templates`

Returns available card templates for a given post type or source mode. The list is sourced from the theme's registry (`codeweber_get_post_card_templates_for()` in `functions/post-cards-registry.php`).

**File:** `Plugin::register_post_card_templates_endpoint()`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_type` | string | No | Post type slug (defaults to `post`) |
| `source_type` | string | No | `taxonomy` → returns `taxonomy` registry entry (overlay-5, overlay-5-primary) |

**Response:** Array of `{ value, label, description, supports: string[] }`

**Auth:** `edit_posts`

**Empty response when:** the theme's registry is not loaded (function `codeweber_get_post_card_templates_for` is undefined). In that case the consumer should fall back to a minimal local list.

**Used by:** Post Grid block's `PostGridTemplateControl` — fetches on `postType`/`sourceType` change and auto-selects the first template if the saved value is no longer in the list.

**Example:**
```
GET /wp-json/codeweber-gutenberg-blocks/v1/post-card-templates?post_type=clients
GET /wp-json/codeweber-gutenberg-blocks/v1/post-card-templates?source_type=taxonomy

[
    { "value": "client-simple", "label": "Client Simple", "description": "...", "supports": ["image"] },
    { "value": "client-grid",   "label": "Client Grid",   "description": "...", "supports": ["image"] },
    { "value": "client-card",   "label": "Client Card",   "description": "...", "supports": ["image"] }
]
```

See **[POST_CARDS_SYSTEM.md](../../../../themes/codeweber/doc_claude/templates/POST_CARDS_SYSTEM.md#templates-registry)** in the theme for the registry structure and how to extend it.

---

### GET `/accordion-posts`

Returns posts for accordion block in "Post" mode (mirrors render.php WP_Query).

**File:** `Plugin::register_accordion_posts_endpoint()`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_type` | string | Yes | Post type slug |
| `selected_taxonomies` | string (JSON) | No | Taxonomy filter, e.g. `{"category":[1,2]}` |
| `orderby` | string | No | `date`, `title`, `menu_order` (default: `date`) |
| `order` | string | No | `asc`/`desc` (default: `desc`) |

**Response:** Array of `{ id, title, content }` (max 10 posts)

**Auth:** Public

---

### GET `/archive-url`

Returns archive URL for a post type or taxonomy term.

**File:** `Plugin::register_archive_urls_endpoint()`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | `post_type` or `taxonomy` |
| `post_type` | string | Conditional | Required if type=post_type |
| `taxonomy` | string | Conditional | Required if type=taxonomy |
| `term_id` | integer | Conditional | Required if type=taxonomy |

**Response:** `{ url: "https://..." }`

**Auth:** Public

---

### GET `/logos`

Returns dark and light logo URLs from Redux theme options.

**File:** `Plugin::register_logos_endpoint()`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `post_id` | integer | No | Check for per-page custom logos |

**Response:** `{ dark: "url", light: "url" }`

**Auth:** Public

**Used by:** Navbar, logo blocks in editor preview

---

### GET `/contacts`

Returns contacts data from theme Redux options.

**File:** `Plugin::register_contacts_endpoint()`

**Response:** Contacts array from Redux `redux_demo` option

**Auth:** Public

---

### GET `/social-icons-preview`

Returns social icons configuration for editor preview (mirrors frontend output).

**File:** `Plugin::register_social_icons_preview_endpoint()`

**Auth:** Public

---

### GET `/tables-documents`

Returns documents list (CSV files from Documents CPT) for tables block.

**File:** `Plugin::register_tables_documents_endpoint()`

**Auth:** Public

---

### GET `/navbar-preview`

Returns rendered navbar HTML for editor preview.

**File:** `Plugin::register_navbar_preview_endpoint()`

**Auth:** Public

---

### GET `/shortcode-render`

Renders a WordPress shortcode server-side for editor preview.

**File:** `Plugin::register_shortcode_render_endpoint()`

**Auth:** Requires edit permissions (mutation operation)

---

### GET `/sidebars`

Returns list of registered WordPress sidebars/widget areas.

**File:** `Plugin::register_sidebars_endpoint()`

**Auth:** Public

---

## Namespace: `codeweber-gutenberg-blocks/v1` (StyleAPI)

Registered in `StyleAPI::register_routes()` called from `Plugin::init()`.

### GET `/style`

Returns CSS class names for button shape and card radius based on Redux theme settings.

**File:** `inc/StyleAPI.php`

**Auth:** Public

**Used by:** Button and Card blocks to preview theme-consistent styles in editor

---

## Namespace: `codeweber-gutenberg-blocks/v1` (LoadMoreAPI)

Registered in `LoadMoreAPI` class, initialized via `Plugin::initLoadMoreAPI()`.

### POST `/load-more`

Loads more posts for the post-grid block.

**File:** `inc/LoadMoreAPI.php`

**Auth:** Requires `wp_rest` nonce

**Used by:** `includes/js/load-more.js` on frontend

---

## Namespace: `codeweber-gutenberg-blocks/v1` (VideoThumbnailAPI)

### GET `/video-thumbnail`

Returns thumbnail URL for a video (YouTube, Vimeo, RuTube, VK).

**File:** `inc/VideoThumbnailAPI.php`

**Auth:** Public

---

## Settings REST API

**File:** `settings/options_page/restapi.php` (loaded directly in `plugin.php`)

Endpoints for plugin settings page. Namespace may differ from above.
