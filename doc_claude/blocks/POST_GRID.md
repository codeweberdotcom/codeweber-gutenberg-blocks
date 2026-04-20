# Post Grid Block

Динамический блок (`codeweber-blocks/post-grid`), который выводит посты любого CPT в виде сетки или swiper-карусели. Рендерит каждую карточку через систему шаблонов темы `cw_render_post_card()` — блок не содержит собственной HTML-разметки карточек, только управление запросом, layout и runtime-фильтрацией.

## Где живёт

| Путь | Назначение |
|------|-----------|
| `src/blocks/post-grid/block.json` | Источник правды (атрибуты) |
| `src/blocks/post-grid/edit.js` | Editor UI, загрузка постов через REST |
| `src/blocks/post-grid/render.php` | Server-side рендер, fallback для WC-продуктов |
| `src/blocks/post-grid/save.js` | `return null` — динамический блок |
| `src/blocks/post-grid/view.js` | Front-end: swiper init, filter bar AJAX, theme effect re-init |
| `src/blocks/post-grid/sidebar.js` | TabPanel: Main / Layout / Title / Display / Filter / Settings |
| `src/blocks/post-grid/controls/MainControl.js` | PostType, Template, PostsPerPage, ImageSize, Sort, Lift |
| `src/blocks/post-grid/controls/LayoutControl.js` | Display mode, grid, swiper, load-more, border-radius |
| `src/blocks/post-grid/controls/TitleControl.js` | Tag, color, size, weight, transform, custom class |
| `src/blocks/post-grid/controls/DisplayControl.js` | Show Title/Date/Category/Comments/Excerpt + lengths + Overlay Card Options |
| `src/blocks/post-grid/controls/FilterControl.js` | Runtime filter-bar settings |
| `src/blocks/post-grid/style.scss`, `editor.scss` | Стили (минимально; фронт — Bootstrap темы) |
| `src/components/post-grid-item/PostGridItemRender.js` | Клиентский рендер карточки в editor preview (зеркалирует PHP-шаблоны) |
| `src/components/post-grid-template/PostGridTemplateControl.js` | Dropdown шаблонов — читает REST из темы |

Плагин целиком отсылает к реестру и шаблонам темы:

| В теме codeweber | Роль |
|---|---|
| `functions/post-card-templates.php` | `cw_render_post_card()` — диспетчер шаблонов |
| `functions/post-cards-registry.php` | Registry `post_type → [templates]`, используется REST-эндпоинтом |
| `templates/post-cards/<cpt>/*.php` | Сами шаблоны карточек |

---

## Inspector — 6 табов

### Main
Базовая конфигурация выборки и внешнего вида.

- **Post Type + Taxonomies** — компонент `PostTypeTaxonomyControl`. Выбор CPT и initial taxonomy restrictions (через `selectedTaxonomies`).
- **Template** — `PostGridTemplateControl`, список из REST `/codeweber-gutenberg-blocks/v1/post-card-templates?post_type=…` (возвращает записи реестра темы).
- **Enable Links** (условно для `clients`) — оборачивать клиентскую карточку в `<a href="…">` по `company_url`.
- **Posts Per Page** — `RangeControl` 1–50.
- **Image Size** — из опций темы.
- **Sort** — `PostSortControl` (orderby + order).
- **Lift hover effect** — toggle; ставит `simpleEffect = 'lift'`. На фронте прокидывается в `template_args.enable_lift`.

### Layout
Визуальный layout сетки или slider.

- **Display Mode**: `grid` или `swiper`.
- **Grid Type**: `classic` (col-*-* на каждой карточке) или `columns-grid` (row-cols-*-* на контейнере).
- **Columns** + responsive (xs/sm/md/lg/xl/xxl) + **Row Cols** в режиме columns-grid.
- **Gap** — вертикальный/горизонтальный/общий, из темы или кастом. Responsive.
- **Border Radius** — `BorderRadiusControl` из темы.
- **Swiper** (если display mode `swiper`) — полный набор: effect, items per view responsive, margin, loop, autoplay, nav/dots/drag стили, centered, watch overflow, wrapper/slide class.
- **Load More** (только grid) — initial count, load more count, text, type (button/link), button size/style.

### Title
Управление тегом/размером/весом/цветом/трансформацией заголовка карточки через compose-класс.

- **Title Tag** — `h1`–`h6`, `p`, `div`, `span`, `display-1`…`display-6` (последние рендерятся как `<h2 class="display-N">`).
- **Title Color** + **Color Type** (`solid` / `soft` / `pale`) → `text-{color}` / `text-soft-{color}` / `text-pale-{color}`.
- **Title Size** — из `createSizeOptions()` темы: display-1..6, h1..6, fs-1..6, fs-13..200.
- **Title Weight** — `fw-light` / `normal` / `medium` / `semibold` / `bold` / `extrabold` / `black` / `bolder`.
- **Title Transform** — `text-uppercase` / `lowercase` / `capitalize`.
- **Title Class** — произвольные классы, дописываются в конец.

Все части склеиваются в `cwgb_post_grid_compose_title_class($attributes)`. Результат уходит в `$display['title_class']` для шаблона — **полностью заменяет** дефолтные классы шаблона при непустом значении.

Если выбран цвет — добавляется маркер `cwgb-title-color`. CSS плагина пробрасывает цвет на вложенный `<a class="link-dark">` внутри заголовка (см. `style.scss`).

### Display
Видимость элементов карточки + длины.

- **Show Title / Date / Category / Comments / Excerpt** — 5 toggles.
- **Title Length** (0 = без ограничения; default 56).
- **Excerpt Length** (в словах, default 20).
- **Overlay Card Options** — показывается только для `overlay-5`, `overlay-5-primary`:
  - **Show Hover Arrow** — отключает `.hover_card_button_hide` в правом верхнем углу.
  - **Read More Label** — `none` / `view` / `more` / `read`. Рендерится как `<span class="hover more me-4">Подробнее</span>` внутри figcaption (не `<a>` — карточка уже обёрнута в anchor).

Display tab скрыт для `clients`.

### Filter
Runtime-фильтр **над** сеткой — AJAX-фильтрация по таксономии.

- **Enable Filter Bar** — основной toggle.
- **Filter Taxonomy** — select из таксономий CPT (REST `/taxonomies/{post_type}`).
- **Filter Style**:
  - `default` — `<ul class="filter isotope-filter">` + `<li><a class="filter-item">…</a></li>` (как на archive-projects).
  - `btn-xs` — `<div><a class="filter-item btn btn-xs">…</a></div>`.
  - `btn-sm` — то же с `btn-sm`.
  - `badge` — `<div><a class="filter-item badge rounded-pill">…</a></div>`.
- **Active Color Type** — `solid` / `soft` / `pale`.
- **Active Color** — палитра темы. Префикс модификатора зависит от стиля:
  - `default`: `text-{color}`
  - `btn-xs`/`btn-sm`: `btn-{color}`
  - `badge`: `bg-{color}` (+ `text-white`)
- **Inherit Text Color (text-reset)** — добавляет Bootstrap `.text-reset` к контейнеру фильтра (для тёмных/inverse-секций).
- **"All" Button Label** — текст reset-кнопки.

### Settings
- **Text Inverse** — добавляет `text-inverse` к wrapper'у блока (для тёмных фонов).
- **BlockMetaFields** — Block Class / Block Data / Block ID.

---

## Атрибуты — сгруппированная справка

### Query
`postType`, `postsPerPage`, `orderBy`, `order`, `imageSize`, `selectedTaxonomies` (dict: `slug → [term_ids]`).

### Display mode
`displayMode` (`grid`/`swiper`), `gridType`, `borderRadius`.

### Grid columns & gaps
`gridColumns`, `gridColumnsXs..Xxl`, `gridRowCols`, `gridRowColsSm..Xxl`, `gridGap`, `gridGapXs..Xxl`, `gridGapType`, `gridGapX*`, `gridGapY*`.

### Swiper
Большой блок: `swiperEffect`, `swiperItems*` (responsive), `swiperSpeed`, `swiperAutoplay*`, `swiperAutoHeight`, `swiperWatchOverflow`, `swiperMargin`, `swiperLoop`, `swiperNav`, `swiperDots`, `swiperDrag`, `swiperReverse`, `swiperUpdateResize`, `swiperNavStyle`, `swiperNavPosition`, `swiperDotsStyle`, `swiperContainerType`, `swiperItemsAuto`, `swiperCentered`, `swiperWrapperClass`, `swiperSlideClass`.

### Load More
`loadMoreEnable`, `loadMoreInitialCount`, `loadMoreLoadMoreCount`, `loadMoreText` (preset key), `loadMoreType` (button/link), `loadMoreButtonSize`, `loadMoreButtonStyle` (solid/outline).

### Template / Card
`template`, `titleTag`, `titleColor`, `titleColorType`, `titleSize`, `titleWeight`, `titleTransform`, `titleClass`, `enableLink` (clients), `simpleEffect` (`none`/`lift`).

### Display toggles
`showTitle`, `showDate`, `showCategory`, `showComments`, `showExcerpt`, `titleLength`, `excerptLength`, `showCardArrow`, `cardReadMore` (`none`/`view`/`more`/`read`).

### Filter bar
`enableFilter`, `filterTaxonomy`, `filterStyle`, `filterActiveColor`, `filterActiveColorType`, `filterTextReset`, `filterAllLabel`.

### Wrapper
`blockClass`, `blockData`, `blockId`, `textInverse`.

---

## Display modes

### Grid
- Contenu: `<div class="cwgb-load-more-items row …">` → карточки через `cw_render_post_card()`.
- Две подмоды: `classic` (col-*-* на каждой карточке) и `columns-grid` (row-cols-*-* на контейнере + `<div class="col">` на карточках).
- Load More: добавочные посты грузит `LoadMoreAPI.php` (`?action=...` REST endpoint) — независимо от filter bar.

### Swiper
- Contenu: `<div class="swiper-container … [data-…]"><div class="swiper"><div class="swiper-wrapper">`.
- Тема сама вешает Swiper.js через `window.theme.swiperSlider()` на все `.swiper-container`.
- В swiper-режиме НЕ добавляется обёртка `col-*` — только `<div class="swiper-slide">`.

---

## Per-CPT поведение

| CPT | Директория шаблонов | Особенности |
|---|---|---|
| `post` | `post/` | default / card / card-content / slider / default-clickable / overlay-5 / overlay-5-primary |
| `clients` | `clients/` | client-simple / client-grid / client-card — только лого, заголовки/даты отключены; можно обернуть в `<a href=company_url>` |
| `testimonials` | `testimonials/` | default / card / blockquote / icon / horizontal — поля `_testimonial_*` через `register_rest_field` в admin |
| `staff` | `staff/` | default / card / circle / circle_center / circle_center_alt / horizontal — соц-иконки, avatar_size, bg_color |
| `documents` | `documents/` | card / card_download — кнопка AJAX-скачивания, иконка документа |
| `faq` | `faq/` | default — в excerpt попадает `post_content` (не стандартный excerpt) |
| `services` | `services/` | overlay-5 / overlay-5-primary — **без даты**, категория в правом верхнем углу, meta `_service_short_description` — предпочитается excerpt'у |
| `product` (WooCommerce) | `templates/woocommerce/cards/` | shop-card / shop-compact / shop-list / shop2 — путь подменяется фильтром `codeweber_post_card_template_path` |
| любой CPT без registry entry | `post/` | fallback через `codeweber_get_post_card_templates_for()` в `post-cards-registry.php` |

### Специфичный проброс в render.php

Для каждого CPT в `render_post_grid_item()` формируется свой `$display_settings` + `$template_args`:

- **clients** — `show_title=false`, особый `image_size='codeweber_clients_300-200'`, `enable_link` из атрибута.
- **testimonials** — спец-флаги `show_rating`, `show_company`, `bg_color`, `shadow`, `enable_lift` по `simpleEffect==='lift'`.
- **documents** — `hover_classes='overlay overlay-5'`, `show_category=false`, `show_comments=false`.
- **staff** — `image_size='codeweber_staff'`, `show_description`, `show_social`, `avatar_size`, `enable_lift`, `bg_color`.
- **faq** — `excerpt_length=80` для показа ответа.
- **post (и прочие без спец-обработки)** — hover_classes зависят от шаблона:
  - `overlay-5` → `overlay overlay-5`
  - `overlay-5-primary` → `overlay overlay-5 color` (primary-цветной оверлей)
  - `slider` / `card-content` → + `hover-scale`
  - прочие → `overlay overlay-1`
  - `default-clickable` → `enable_lift=true` всегда (шаблон требует).

`title_tag` и `title_class` идут из compose-helper для всех CPT единообразно (включая staff и documents — хардкоды h2/h4 убраны).

---

## Filter bar — архитектура

### Разметка (render.php)

Зависит от `$filter_style`:

```html
<!-- default -->
<ul class="cwgb-post-grid-filter filter isotope-filter mb-6 [text-reset]"
    data-cwgb-filter-for="{blockId}"
    data-cwgb-filter-taxonomy="{slug}"
    data-cwgb-filter-style="default">
    <li><a class="filter-item active" data-cwgb-filter-term="0">All</a></li>
    <li><a class="filter-item" data-cwgb-filter-term="42">Term</a></li>
</ul>

<!-- btn-xs / btn-sm / badge -->
<div class="cwgb-post-grid-filter mb-6 d-flex flex-wrap gap-2 align-items-center [text-reset]"
     data-cwgb-filter-for="{blockId}" …>
    <a class="filter-item btn btn-xs active btn-primary" data-cwgb-filter-term="0">All</a>
    <a class="filter-item btn btn-xs"                    data-cwgb-filter-term="42">Term</a>
</div>
```

- Для `default` стиля тема автоматически снимает буллеты через `.filter:not(.basic-filter) ul { list-style: none; padding: 0 }` в `_type.scss`.
- Класс `.list-unstyled` НЕ используется сознательно — тема имеет глобальное правило `.list-unstyled li a.active { color: #9c886f !important }`, которое перекрывает активные цвета кнопок.
- `filter-item` остаётся на каждом `<a>` для JS-селектора.

### Query (render.php)

```php
if ($enable_filter && $filter_taxonomy && $filter_active_term > 0) {
    $runtime_selected_taxonomies[$filter_taxonomy] = [$filter_active_term];
}
```

Активный term из `$_GET['cwgb_filter']` **переопределяет** ограничение по той же таксономии в `selectedTaxonomies` (избегаем конфликт initial vs runtime).

### Результаты wrapper

```html
<div class="cwgb-post-grid-results" data-cwgb-results-for="{blockId}">
    <!-- swiper или grid с карточками -->
</div>
```

JS клиент подменяет только `innerHTML` этого контейнера при клике фильтра.

### REST endpoint

`POST /wp-json/codeweber-gutenberg-blocks/v1/post-grid/filter` — принимает:

```json
{
    "attributes": { … полный attributes блока … },
    "term_id": 42
}
```

Callback:
1. Кладёт `term_id` в `$_GET['cwgb_filter']`.
2. Вызывает `render_block(['blockName' => 'codeweber-blocks/post-grid', 'attrs' => $attributes])`.
3. Восстанавливает `$_GET['cwgb_filter']`.
4. Возвращает `{html}` (целый HTML блока, включая filter bar и results).

Используется `render_block()` API специально, чтобы НЕ дублировать логику рендера.

### Client (view.js)

```js
on click .filter-item:
    attrs = JSON.parse(wrapper.dataset.blockAttributes);
    attrs.blockId = blockId;  // синхронизация! см. gotchas
    POST /post-grid/filter { attributes, term_id }
    → parse response → find .cwgb-post-grid-results → replace innerHTML
    → re-init theme effects: imageHoverOverlay, iTooltip, rippleEffect, swiperSlider
```

---

## REST endpoints (плагин)

| Endpoint | Method | Назначение |
|---|---|---|
| `/codeweber-gutenberg-blocks/v1/post-card-templates?post_type=X` | GET | Список шаблонов для CPT из реестра темы (для Template-селектора) |
| `/codeweber-gutenberg-blocks/v1/taxonomies/{post_type}` | GET | Таксономии CPT + термины (для FilterControl) |
| `/codeweber-gutenberg-blocks/v1/post-grid/filter` | POST | Runtime-фильтрация, возвращает HTML блока |

Смотри `inc/Plugin.php` — `register_post_card_templates_endpoint`, `register_taxonomies_endpoint`, `register_post_grid_filter_endpoint`.

---

## Editor preview

`PostGridItemRender.js` рендерит карточки в редакторе без обращения к PHP. Логика веток совпадает с render.php, в частности:

- `composeTitleClass(attrs)` — зеркало `cwgb_post_grid_compose_title_class()` в PHP.
- `liftClass` — `lift` применяется на `<article>` / `<div class="card">` (root), а не на `<figure>`.
- Overlay-5 / overlay-5-primary — одинаковая структура с `bottom-overlay`, `mt-auto` на заголовке, `hover_card_button_hide`, read-more label.
- Services: `shortDescription` из REST-meta `_service_short_description` используется вместо excerpt когда есть.

Editor preview **не** рендерит filter bar интерактивно — только показывает таксономию в placeholder-плашке. Пользователь видит эффект на фронте.

---

## Gotchas & conventions

### blockId генерация

```php
if (empty($block_id)) {
    $block_id = 'cwgb-post-grid-' . substr(md5(json_encode($key_attrs) . get_the_ID()), 0, 8);
}
```

`get_the_ID()` возвращает разные значения на initial render (id страницы) и в REST callback (0). Поэтому **клиент синхронизирует `blockId`** перед отправкой REST-запроса:

```js
attrs.blockId = blockId;  // из data-block-id на wrapper'е
```

### $simple_effect в render_post_grid_item()

В теле функции `render_post_grid_item()` у неё свой scope — `$simple_effect` из верхнего уровня туда не долетает. Внутри читается локально: `$item_simple_effect = $attributes['simpleEffect'] ?? 'none'`.

### Hover re-init после filter swap

Theme's overlay effects требуют JS-инициализации (добавление `<span class="bg">`, привязка hover-handlers). После `results.innerHTML = newResults.innerHTML` view.js вызывает:

- `window.theme.imageHoverOverlay()` — добавляет span.bg
- `window.theme.iTooltip()` — тултипы
- `window.custom.rippleEffect()` — ripple на кнопках
- `window.theme.swiperSlider()` — swiper

Все вызовы под `typeof … === 'function'` — safe.

### selectedTaxonomies vs filterTaxonomy

- `selectedTaxonomies` (Main tab) — **initial pool**: жёсткое ограничение выдачи.
- `filterTaxonomy` (Filter tab) — **UI filter** для посетителя поверх pool.

Если обе настройки ссылаются на одну таксономию и user клацнул активный term — runtime overrides initial (`$runtime_selected_taxonomies[$filter_taxonomy] = [$active]`).

### Bottom-overlay z-index

Тема даёт `.bottom-overlay > * { z-index: 3 }` (ранее было `0`, что клало заголовок ПОД gradient `::after` с z-index 2). Если добавляете кастомный контент в bottom-overlay — он автоматически поверх градиента.

### text-start

`<figure class="overlay">` получает `text-align: center` от темы. Шаблоны overlay-5 внутри — не нуждаются в ручном `text-start`, тема сама переопределяет `.overlay-5 { text-align: left }` и `.bottom-overlay > *` наследуют нормально.

### Shop-*(WC) template col-wrap

Для `product` + `shop*` шаблонов карточка уже содержит `col-*` обёртку. Render.php пропускает внешний col-wrap и передаёт col-классы внутрь через `global $cw_shop_col_class`.

### display-* title tag

Когда `titleTag` = `display-1`..`display-6` — фактический тег **`<h2>`**, а значение `display-N` идёт в class через compose (чтобы семантика осталась заголовком, а размер — display).

---

## Эволюция блока (high-level)

Ключевые изменения, сделанные поверх оригинального блока:

1. **Удаление мёртвых атрибутов** — `enableLightbox`, `lightboxGallery`, `effectType`, `tooltipStyle`, `overlayStyle`, `overlayGradient`, `overlayColor`, `cursorStyle`, `enableHoverScale`. Удалён fallback-рендерер в render.php. Effects-таб убран; остался toggle `Lift hover effect`.
2. **Card Display panel** — show/hide title, date, category, comments, excerpt + lengths (прежде хардкод).
3. **Title tab** — полный набор типографики (tag, color, color type, size, weight, transform, custom class). Compose в единый class через `cwgb_post_grid_compose_title_class()`.
4. **Display tab** — вынесен из Main, скрыт для clients.
5. **post/overlay-5 редизайн** — `lift` на card-обёртку, justify-content-between → mt-auto для корректного позиционирования при скрытой дате, `card-interactive` + `hover_card_button_hide` стрелка, опциональный read-more label в figcaption, убран второй `<a>` (было 2 ссылки на один URL).
6. **overlay-5-primary** — новый вариант: клон overlay-5 с `.color` классом (primary-цветной overlay).
7. **services CPT** — собственная registry entry, `services/overlay-5` и `services/overlay-5-primary` без даты, категория в top-right, meta `_service_short_description` (отдельный metabox внизу edit-screen).
8. **Filter bar** — новый таб, 4 стиля (default/btn-xs/btn-sm/badge), активный цвет (solid/soft/pale), text-reset toggle, AJAX через `render_block()`-reuse.
9. **Theme fixes сопутствующие** — `.bottom-overlay > *` z-index 0→3, post/overlay-5 layout, помощники `helpers.php` для short_description.

Полный журнал — в git log: `git log --oneline -- src/blocks/post-grid/` (плагин) и `git log --oneline -- templates/post-cards/post/ functions/post-cards-registry.php` (тема).
