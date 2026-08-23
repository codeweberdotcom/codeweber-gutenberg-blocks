# Blocks Catalog

Total: **49 blocks** in `src/blocks/`. Namespace: `codeweber-blocks/`.

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
| `lists` | D | Styled unordered/ordered list. Inspector is tabbed: **Content** (source, list type, columns, items, text colour), **Icon** (icon picker, icon colour, bullet background), **Block** (UL Class → `listClass`, LI Class → `itemClass`, block data and id). `itemClass` applies to every list type and stacks with `text-line`. In Post mode the source comes from the shared `PostSourceControl`: posts by query, posts hand-picked (`manualMode` / `manualItems`, order preserved), taxonomy terms by query (`sourceTaxonomy`, `taxonomyHideEmpty`, `taxonomyOrderBy`, `taxonomyOrder`) or terms hand-picked (`manualTermMode` / `manualTermItems`). |
| `divider` | S | Horizontal divider with style options |
| `spacer` | S | Responsive vertical spacer using Bootstrap py-* classes |
| `icon` | S | Single icon from icon library |

---

## Media

| Block | Type | Description |
|-------|------|-------------|
| `image-simple` | S | Image gallery/carousel with hover effects, lightbox, load-more, swiper; imageSize auto-refreshes missing sizes on change |
| `media` | S | Media block with video/image support |
| `banners` | S | Full-width banner with overlay and CTA |
| `swiper` | D | Swiper.js carousel/slider; supports Grid multi-row layout (swiperRows/swiperFill + per-breakpoint rows → data-rows/data-fill) |

---

## Cards & Features

| Block | Type | Description |
|-------|------|-------------|
| `card` | S | Bootstrap card with image, text, buttons |
| `feature` | S | Single feature item. 4 layouts: Feature 1 (vertical), Feature 2 (horizontal, `imageMobileLayout`/`imageDesktopLayout` controls), Feature 3 (icon+title inline), Feature 4 (image InnerBlock + text, `imageMobileLayout`/`imageDesktopLayout` controls) |
| `features` | S | Features grid container |
| `counter` | S | Single animated counter (`.counter` / counterUp). 4 layouts: Counter 1 (icon-left card), Counter 2 (svg icon on top, centered), Counter 3 (number + label, centered), Counter 4 (number + h6 subtitle + ratings). Optional icon, card wrapper, and absolute positioning (`positionType` + top/bottom/left/right offsets + z-index) for floating banner cards |
| `counters` | S | Counters grid container (InnerBlocks: columns → column → counter). 4 templates: Cards (icon-left, col-md-6), SVG icons (centered, col-md-4), Plain (large, dark bg, col-6/col-lg-3), Ratings (col-md-6). Switching template rebuilds the grid |
| `cta` | S | Call-to-action block |
| `switcher` | D | Segmented link switcher for splitting a site into audiences (B2B / B2C, rent / sale). Two styles: **pill** (`nav-pills` on a `bg-{color} rounded-pill` capsule — the theme already paints the active pill white with a shadow) and **segmented** (`btn-group` of `btn-soft-{color}` + `btn-outline-ash`). Items are `{ id, label, url }` pairs edited in the inspector. `activeMode: auto` matches each item's URL path against the page being viewed (host, query and trailing slash ignored; longest match wins, so `/business/pricing` still highlights `/business`), falling back to `activeIndex` when nothing matches; `manual` always highlights `activeIndex`. Size presets sm/md/lg drive `px-*`/`py-*`/`fs-*`. Dynamic because the editor cannot know which page will render it. |
| `label-plus` | S | Floating label with 3 display types: **card** (floating Bootstrap card with icon + counter/title + label, absolute-positioned with bottom/right offsets), **badge** (`<span class="badge bg-{color} rounded-pill">`), **button** (button-style `<span>` without link, rendered via `getClassNames()` from the button block — supports solid/icon types, all button styles/sizes/shapes via `ButtonStyleControls`). Type selected via RadioControl in the Content inspector tab. Card type: `cardAbsolute` toggles `position-absolute` (off = normal flow, Bottom/Right hidden); `enableIcon` / `enableTitle` / `enableText` switch the three parts off; typography for title (`counterText`) and paragraph (`labelText`) comes from the Title block's `HeadingTypographyControl` (tag, color, size, weight, transform, extra class) via a Typography tab. `titleClass` / `textClass` default to the previously hardcoded `h3 mb-0 text-nowrap` and `fs-14 lh-sm mb-0 text-nowrap`, so blocks saved earlier keep validating — drop `h3` from the title's extra class if a chosen Size has to win. |

---

## Posts & Blog

| Block | Type | Description |
|-------|------|-------------|
| `blog` | S | Blog article layout wrapper — dropdown selects template built from inner blocks (text-only, image-left/right, slider-left/right, quote, callout) |
| `post-grid` | S | Post grid with Load More support |
| `blog-post-widget` | D | Sidebar widget: recent posts |
| `blog-category-widget` | D | Sidebar widget: post categories |
| `blog-tag-widget` | D | Sidebar widget: post tags |
| `blog-year-widget` | D | Sidebar widget: posts by year |
| `accordion` | D | Bootstrap accordion — custom items or posts from CPT. In Post mode `contentSource` picks the item text: **full** (default — shortcodes run, formatting kept via wp_kses_post + wpautop), **excerpt**, or **trim** to `contentLength` characters on a word boundary. Truncating used to cut shortcodes in half, and do_shortcode then swallowed the markup from the broken bracket to the next closing one — dropping neighbouring items on the frontend. Shared helper: `Plugin::accordion_prepare_content()`, used by both render.php and the editor's accordion-posts endpoint. |

---

## Navigation

| Block | Type | Description |
|-------|------|-------------|
| `navbar` | D | Full navigation bar (Bootstrap navbar). Menu picking has two modes per side (`menuSource` / `menuSourceRight`): **Theme location** — `menuLocation` / `menuLocationRight`, listed live from `/wp/v2/menu-locations` with the assigned menu shown in the label; **Specific menu** — `menuId` / `menuIdRight` from `/wp/v2/menus`, the only way to output a menu assigned to no location. render.php passes `$menu_obj` / `$menu_obj1` to the templates, which hand them to `wp_nav_menu()` as `menu` — it outranks `theme_location` and is ignored when empty, so blocks saved before this keep using their location. Reading both endpoints needs `edit_theme_options`; without it the stored value is preserved as an option rather than dropped. |
| `top-header` | D | Top bar above navbar (contacts, social icons, etc.) |
| `header-widgets` | D | Widget area inside header CPT (restricted to CPT `header`) |
| `menu` | D | Menu (custom/wp-menu/taxonomy), horizontal (`flex-md-row`) / vertical — см. `MENU_BLOCK.md` |
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
| `tabs` | D | Bootstrap tabs (render.php via `"render"` in block.json) |

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
| `yandex-map-v3` | D | Yandex Maps API v3 — native dark theme, custom color schemes, sidebar, filters. `dataSource`: `offices` (offices CPT), `mkd_object` (residential buildings CPT — queries `_mkd_latitude`/`_mkd_longitude`/`_mkd_address`/`_mkd_floors`), `custom` (inline markers). See block sidebar for per-source query controls. |
| `contacts` | D | Contacts from theme Redux options |
| `social-icons` | D | Social icons from theme Redux options |
| `logo` | D | Logo from theme Redux options |
| `avatar` | D | User/staff avatar (D only for user/staff modes) |
| `html-blocks` | D | Render HTML Block CPT content |
| `shortcode-render` | D | WordPress shortcode renderer |
| `widget` | S | WordPress widget area |
| `inline-text-editor` | D | Frontend inline text editor — Bootstrap offcanvas drawer (editors only) to edit Codeweber block texts on the current page; rewrites `post_content` via REST. Self-contained/removable. See block `README.md` |

---

## WooCommerce

| Block | Type | Description |
|-------|------|-------------|
| `wc-filter-panel` | D | WooCommerce filter panel: price slider, categories, attributes, rating, stock. PJAX-integrated. See [WC_FILTER_PANEL.md](WC_FILTER_PANEL.md) |

---

## Footer & Utility

| Block | Type | Description |
|-------|------|-------------|
| `copyright` | D | Copyright and developer credit for footer. Auto year via PHP date('Y'). Two sections (copyright / developer link) with color, alignment, inline/stacked layout. |

---

## Block Count by Type

| Type | Count |
|------|-------|
| Static (S) | ~24 |
| Dynamic (D) | ~25 |
| **Total** | **49** |

---

## Anchor Attribute — Important Note for Dynamic Blocks

WordPress 6.8+ registers the `anchor` attribute (from `supports.anchor: true`) with `source: "attribute"`, which means the value is **not serialized in the block comment** — only in the saved HTML. For dynamic blocks (render.php), there is no saved HTML, so `$parsed_block['attrs']['anchor']` is always empty without explicit declaration.

**Fix applied**: All dynamic blocks with `supports.anchor: true` explicitly declare `anchor` in `block.json` without `source`:
```json
"anchor": { "type": "string", "default": "" }
```
This overrides WordPress auto-registration and ensures anchor IS serialized in the block comment, making it available to render.php via `$attributes['anchor']`.
