# Blocks Catalog

Total: **47 blocks** in `src/blocks/`. Namespace: `codeweber-blocks/`.

Legend: `S` = static (JS save) | `D` = dynamic (PHP render.php)

---

## Layout

| Block | Type | Description |
|-------|------|-------------|
| `section` | S | Full-width section wrapper with background, spacing, overlay |
| `column` | S | Single column inside columns block |
| `columns` | S | Multi-column layout container |
| `group-button` | S | Horizontal group of buttons |
| `social-wrapper` | S | Social icons wrapper container |

---

## Content

| Block | Type | Description |
|-------|------|-------------|
| `heading-subtitle` | S | Heading with optional subtitle and decorator |
| `paragraph` | S | Enhanced paragraph with typography options |
| `blockquote` | S | Styled blockquote |
| `dropcap` | S | Paragraph with decorative drop cap |
| `code` | S | Syntax-highlighted code block (Prism.js) |
| `lists` | D | Styled unordered/ordered list |
| `divider` | S | Horizontal divider with style options |
| `icon` | S | Single icon from icon library |

---

## Media

| Block | Type | Description |
|-------|------|-------------|
| `image-simple` | S | Image with optional caption and link |
| `media` | S | Media block with video/image support |
| `banners` | S | Full-width banner with overlay and CTA |
| `swiper` | D | Swiper.js carousel/slider |

---

## Cards & Features

| Block | Type | Description |
|-------|------|-------------|
| `card` | S | Bootstrap card with image, text, buttons |
| `feature` | S | Single feature item with icon and text |
| `features` | S | Features grid container |
| `cta` | S | Call-to-action block |
| `label-plus` | S | Label/badge with optional plus icon |

---

## Posts & Blog

| Block | Type | Description |
|-------|------|-------------|
| `post-grid` | S | Post grid with Load More support |
| `blog-post-widget` | D | Sidebar widget: recent posts |
| `blog-category-widget` | D | Sidebar widget: post categories |
| `blog-tag-widget` | D | Sidebar widget: post tags |
| `blog-year-widget` | D | Sidebar widget: posts by year |
| `accordion` | D | Bootstrap accordion — custom items or posts from CPT |

---

## Navigation

| Block | Type | Description |
|-------|------|-------------|
| `navbar` | D | Full navigation bar (Bootstrap navbar) |
| `top-header` | D | Top bar above navbar (contacts, social icons, etc.) |
| `header-widgets` | D | Widget area inside header CPT (restricted to CPT `header`) |
| `menu` | D | WordPress menu rendered with Bootstrap nav-walker |
| `search` | D | Ajax search form |

---

## Forms

| Block | Type | Description |
|-------|------|-------------|
| `form` | D | Form container (CodeWeber Forms integration) |
| `form-field` | D | Form field: text, email, phone (mask / useThemeMask), file (FilePond), select, rating, consents_block, etc. |
| `submit-button` | S | Form submit button |
| `button` | S | Button with many types: solid, outline, social, circle, video |

---

## Interactive

| Block | Type | Description |
|-------|------|-------------|
| `tabs` | S | Bootstrap tabs |

---

## Data & Tables

| Block | Type | Description |
|-------|------|-------------|
| `tables` | D | Table block: manual input or CSV from Documents CPT |
| `tabulator` | D | Interactive Tabulator.js data table |

---

## Integrations & Utility

| Block | Type | Description |
|-------|------|-------------|
| `yandex-map` | D | Yandex Maps embed with hotspot support |
| `contacts` | D | Contacts from theme Redux options |
| `social-icons` | D | Social icons from theme Redux options |
| `logo` | S | Logo from theme Redux options |
| `avatar` | D | User/staff avatar (D only for user/staff modes) |
| `html-blocks` | D | Render HTML Block CPT content |
| `shortcode-render` | D | WordPress shortcode renderer |
| `widget` | S | WordPress widget area |

---

## WooCommerce

| Block | Type | Description |
|-------|------|-------------|
| `wc-filter-panel` | D | WooCommerce filter panel: price slider, categories, attributes, rating, stock. PJAX-integrated. See [WC_FILTER_PANEL.md](WC_FILTER_PANEL.md) |

---

## Block Count by Type

| Type | Count |
|------|-------|
| Static (S) | ~25 |
| Dynamic (D) | ~22 |
| **Total** | **47** |
