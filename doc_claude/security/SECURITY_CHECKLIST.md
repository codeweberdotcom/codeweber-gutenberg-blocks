# Security Checklist

Security rules for the Codeweber Gutenberg Blocks plugin. Apply when writing or reviewing PHP code.

---

## Quick Checklist

Before committing PHP changes, verify:

- [ ] All `$_GET`/`$_POST`/`$_SERVER` inputs are sanitized
- [ ] All HTML output is escaped with the right function
- [ ] `ABSPATH` check at the top of every `render.php`
- [ ] REST endpoints: `permission_callback` is appropriate for the endpoint's sensitivity
- [ ] External API responses: URL validated with `esc_url_raw()`, strings with `sanitize_text_field()`
- [ ] WP_Query arrays: `array_map('sanitize_text_field', ...)` or `array_map('absint', ...)`
- [ ] No `error_log()` with sensitive data in production paths

---

## Escaping Output

| Context | Function | Use for |
|---------|----------|---------|
| Plain text in HTML | `esc_html()` | Post titles, meta values, labels |
| HTML attribute value | `esc_attr()` | `class=`, `data-*`, `id=`, `alt=` |
| URL in `href`/`src` | `esc_url()` | Frontend links and image src |
| URL stored/returned | `esc_url_raw()` | REST API responses, DB storage |
| JavaScript string | `esc_js()` | Inline `onclick`, `wp_localize_script` values |
| Trusted HTML content | `wp_kses_post()` | User-generated content with safe HTML tags |
| Raw admin HTML | `wp_unslash()` | Admin-controlled CPT content (see below) |
| i18n string | `esc_html__()` / `esc_html_e()` | Translated strings output to HTML |

### Special cases

**`html_blocks` CPT** — outputs raw `post_content` intentionally:
```php
echo wp_unslash( $content );
// Safe: WordPress filters post_content on save based on unfiltered_html capability.
// Users without unfiltered_html have scripts stripped automatically on save.
```

**`shortcode-render` block** — uses `do_shortcode()` without whitelist:
```php
echo do_shortcode( $shortcode );
// Safe: shortcode is set from Gutenberg block attributes — requires edit_posts capability.
// Same trust level as WordPress core [shortcode] block.
```

---

## Sanitizing Input

### Block attributes in render.php

Attributes come from post content (set by editors). Always cast/sanitize before use:

```php
// Integers
$zoom    = isset($attributes['zoom'])   ? (int) $attributes['zoom']   : 10;
$height  = isset($attributes['height']) ? (int) $attributes['height'] : 500;

// Booleans
$enabled = isset($attributes['enabled']) ? (bool) $attributes['enabled'] : false;

// Strings — use sanitize_text_field() for plain strings
$title = isset($attributes['title']) ? sanitize_text_field( $attributes['title'] ) : '';

// URLs
$url = isset($attributes['url']) ? esc_url_raw( $attributes['url'] ) : '';

// Arrays of strings (e.g. selected cities for meta_query)
$cities = isset($attributes['selectedCities']) && is_array($attributes['selectedCities'])
    ? array_filter( array_map( 'sanitize_text_field', $attributes['selectedCities'] ) )
    : [];

// Arrays of IDs (e.g. taxonomy term IDs)
$term_ids = isset($attributes['selectedCategories']) && is_array($attributes['selectedCategories'])
    ? array_filter( array_map( 'absint', $attributes['selectedCategories'] ) )
    : [];
```

### REST API request params

Use `sanitize_callback` in `register_rest_route()` args:

```php
register_rest_route('codeweber-gutenberg-blocks/v1', '/my-endpoint', [
    'methods'             => 'GET',
    'callback'            => [$this, 'my_callback'],
    'permission_callback' => '__return_true',
    'args' => [
        'post_id' => [
            'required'          => true,
            'sanitize_callback' => 'absint',
            'validate_callback' => function($v) { return $v > 0; },
        ],
        'search' => [
            'sanitize_callback' => 'sanitize_text_field',
        ],
    ],
]);
```

### `$_SERVER` superglobals

Always `wp_unslash()` + sanitize before use:

```php
$host = isset( $_SERVER['HTTP_HOST'] )
    ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) )
    : '';
$uri  = isset( $_SERVER['REQUEST_URI'] )
    ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) )
    : '';
```

### External API responses

Sanitize all data received from external services (VK, Rutube, etc.):

```php
return [
    'thumbnail_url' => esc_url_raw( $data['thumbnail_url'] ),
    'title'         => sanitize_text_field( $data['title'] ?? '' ),
    'description'   => sanitize_text_field( $data['description'] ?? '' ),
];
```

---

## REST API Permissions

### Decision table

| Endpoint returns | `permission_callback` | Reason |
|------------------|-----------------------|--------|
| Public published content (posts, images, taxonomies) | `'__return_true'` | Accessible to anonymous visitors by design |
| Plugin/theme options, contacts, phone numbers | `'__return_true'` | Public site data used on frontend |
| Admin settings (write operations) | `function() { return current_user_can('manage_options'); }` | Admin-only |
| Editor operations | `function() { return current_user_can('edit_posts'); }` | Logged-in editors |

### Current endpoints and their permission level

| Endpoint | Method | Permission | Reason |
|----------|--------|------------|--------|
| `/load-more` | POST | `__return_true` | Loads public posts for anonymous visitors |
| `/rutube-thumbnail/{id}` | GET | `__return_true` | Used in editor by any logged-in user |
| `/vk-thumbnail` | GET | `__return_true` | Used in editor by any logged-in user |
| `/image-sizes` | GET | `__return_true` | Used in block editor |
| `/taxonomies/{post_type}` | GET | `__return_true` | Public taxonomy data |
| `/options` | GET | `__return_true` | Public site data (phones, forms) |
| `/style` | GET | `__return_true` | Public style data |

---

## Direct File Access

Every `render.php` must start with:

```php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

Every standalone PHP file in `inc/` and `settings/` is protected because they are loaded only via WordPress autoloader or `require_once` from `plugin.php`.

---

## WP_Query Safety

WordPress uses `$wpdb->prepare()` internally for meta_query and tax_query — SQL injection is not possible through WP_Query itself. However, sanitize inputs before passing them to queries for defense in depth:

```php
// meta_query with array of city names
if ( ! empty( $selected_cities ) ) {
    $args['meta_query'][] = [
        'key'     => '_office_city',
        'value'   => $selected_cities,   // already sanitize_text_field'd
        'compare' => 'IN',
    ];
}

// tax_query with term IDs
if ( ! empty( $term_ids ) ) {
    $args['tax_query'][] = [
        'taxonomy' => 'office_category',
        'field'    => 'term_id',
        'terms'    => $term_ids,          // already absint'd
        'operator' => 'IN',
    ];
}
```

---

## Nonces

### REST API (JavaScript)
The plugin creates a nonce in `wp_localize_script`:
```php
'nonce' => wp_create_nonce( 'wp_rest' )
```

The WP REST API automatically validates `X-WP-Nonce` header for **authenticated** requests. Public endpoints (`__return_true`) do not require nonce — this is correct and standard WordPress behavior.

### AJAX (non-REST)
If ever using `admin-ajax.php`, always verify:
```php
check_ajax_referer( 'my_action_nonce', 'nonce' );
```

---

## Known Intentional Patterns

These patterns may look like issues but are **intentional and documented**:

| Pattern | Location | Why it's OK |
|---------|----------|-------------|
| `echo wp_unslash($content)` | `html-blocks/render.php` | CPT for raw HTML embeds; WP filters on save |
| `do_shortcode($shortcode)` without whitelist | `shortcode-render/render.php` | Block attrs require `edit_posts`; same as core shortcode block |
| `permission_callback: '__return_true'` on all REST routes | `inc/Plugin.php`, `LoadMoreAPI.php` | All endpoints serve public content |
| `extract($vars, EXTR_SKIP)` | `inc/Plugin.php` (render loop) | Path not user-controlled; vars scoped to render |
