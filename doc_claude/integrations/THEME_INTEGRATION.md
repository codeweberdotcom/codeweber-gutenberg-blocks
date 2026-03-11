# Theme Integration

The plugin is tightly coupled with the CodeWeber theme. It depends on theme assets, Redux options, and CPTs.

## Bootstrap 5

The plugin does **not** bundle Bootstrap. It uses Bootstrap classes from the theme.

**How it works:**
- Theme enqueues Bootstrap CSS/JS on the frontend
- Plugin blocks use Bootstrap classes in `save.js` and `render.php`
- Editor uses theme Bootstrap via `enqueueEditorGlobalStyles()`

**Rule:** All layout and UI in blocks must use Bootstrap classes (`btn`, `row`, `col-*`, `card`, etc.)

---

## Redux Theme Options

The plugin reads theme settings via `get_option('redux_demo')`.

| What | Used in | How |
|------|---------|-----|
| Dark/Light logos | Logo block, Navbar block | `Plugin::get_logos_callback()` via REST `/logos` |
| Contacts | Contacts block | `Plugin::register_contacts_endpoint()` via REST |
| Social icons | Social Icons block | REST endpoint |
| Button radius | Button block preview | `StyleAPI::register_routes()` via REST `/style` |
| Card radius | Card block preview | `StyleAPI::register_routes()` via REST `/style` |

**Access pattern (PHP):**
```php
global $opt_name;
$options = get_option($opt_name ?: 'redux_demo');
$dark_logo = $options['opt-dark-logo']['url'] ?? '';
```

---

## Theme CPTs

The plugin relies on CPTs registered by the theme:

| CPT slug | Used by |
|----------|---------|
| `header` | `header-widgets` block (restricted to this CPT only) |
| `html_blocks` | `html-blocks` block renders content from this CPT |
| `document` | `tables` block loads CSV files from this CPT |
| `modal` | Excluded from Search block post types |
| `footer`, `page-header`, `codeweber_form` | Excluded from Search block |

---

## Theme JavaScript

The plugin's `load-more.js` optionally depends on the theme's `fetch-handler`:

```php
// Plugin::gutenbergBlocksExternalLibraries()
$dependencies = [];
if (wp_script_is('fetch-handler', 'registered')) {
    $dependencies[] = 'fetch-handler';
}
wp_enqueue_script('codeweber-blocks-load-more', ..., $dependencies, ...);
```

This means the Load More REST endpoint can route through the theme's fetch system when available.

---

## Theme Assets Used in Editor

The plugin loads theme assets in the editor for accurate preview:

```php
// Plugin::enqueueEditorGlobalStyles()
$prism_js_path = get_theme_file_path('src/assets/js/vendor/prism.js');
$prism_css_path = get_theme_file_path('src/assets/css/vendor/prism.css');
```

Prism.js is loaded from the **theme's** `src/` directory for `code` and `card` blocks in editor.

---

## Theme Functions Called by Plugin

| Function | Used in | Purpose |
|----------|---------|---------|
| `getThemeButton()` | Plugin.php | Get theme button shape CSS class for Button block |
| `codeweber_get_allowed_image_sizes()` | Plugin.php | Filter image sizes by post type |
| `brk_get_dist_file_url()` | (indirectly) | Asset URL resolution pattern |

These functions are defined in the theme. The plugin checks `function_exists()` before calling.

---

## Avatar Placeholder

The plugin uses a placeholder image from the theme's `dist/`:

```php
// When registering avatar block
wp_localize_script($script_handle, 'cwgbAvatarPlaceholderUrl', [
    'url' => get_template_directory_uri() . '/dist/assets/img/avatar-placeholder.jpg',
]);
```

---

## Theme Staff CPT

The `avatar` block supports `avatarType = 'staff'` which reads from the theme's `staff` CPT (registered in `functions/cpt/cpt-staff.php`).
