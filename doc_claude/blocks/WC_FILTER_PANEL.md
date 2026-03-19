# WC Filter Panel Block

`codeweber-blocks/wc-filter-panel` — динамический блок Gutenberg для вывода панели фильтров WooCommerce. Интегрируется с PJAX-навигацией магазина темы CodeWeber.

**Тип:** Dynamic (render.php)
**Зависимость:** тема CodeWeber (функция `cw_render_filter_items`)
**Тема-документация:** [`doc_claude/integrations/WC_FILTERS.md`](../../themes/codeweber/doc_claude/integrations/WC_FILTERS.md) *(в папке темы)*

---

## Архитектура

```
Editor (Gutenberg)
  └─ edit.js         → повторитель секций + Inspector Controls
  └─ save.js         → null (динамический блок)

Frontend
  └─ render.php      → читает $attributes, вызывает cw_render_filter_items()
  └─ cw_render_filter_items() → подключает шаблоны темы (filter-*.php)
  └─ shop-pjax.js    → PJAX-переходы + toggleLimitFilter() для show/hide more
```

`render.php` сам не рендерит HTML — он только собирает `$panel_atts` и делегирует теме. Если тема неактивна, выводится заглушка.

---

## Типы элементов (`type`)

Повторитель поддерживает три типа строк:

| `type` | Описание |
|--------|----------|
| `filter` | Фильтр по конкретному критерию |
| `reset_button` | Кнопка «Сбросить фильтры» |
| `active_chips` | Блок активных фильтров (чипы) |

---

## Типы фильтров (`filterType`)

Доступны только для `type = filter`:

| `filterType` | Описание | Поддерживаемые `displayMode` |
|-------------|----------|------------------------------|
| `price` | Ценовой диапазон (слайдер) | — (всегда слайдер) |
| `categories` | Категории WooCommerce | checkbox, radio, list, button, badge |
| `tags` | Метки WooCommerce | checkbox, radio, list, button, badge |
| `attributes` | Атрибут WC (таксономия) | checkbox, radio, list, button, badge, **color, image** |
| `rating` | Фильтр по рейтингу | checkbox, radio, list, button, badge |
| `stock` | Фильтр по наличию | checkbox, radio, list, button, badge |

---

## Режимы отображения (`displayMode`)

| `displayMode` | Описание | Шаблон темы |
|--------------|----------|-------------|
| `checkbox` | Чекбоксы с лейблами | `filter-attribute.php` / `filter-category.php` |
| `radio` | Радиокнопки | то же |
| `list` | Ссылки-строки | то же |
| `button` | Bootstrap-кнопки | то же |
| `badge` | Bootstrap-метки (`badge`) | то же |
| `color` | Цветовые свотчи | только `filter-attribute.php` |
| `image` | Свотчи-изображения | только `filter-attribute.php` |

---

## Атрибуты элемента повторителя

### Общие (все `filterType`)

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| `id` | string | auto | Уникальный идентификатор строки |
| `type` | string | `filter` | Тип элемента: filter / reset_button / active_chips |
| `filterType` | string | `categories` | Что фильтруем |
| `label` | string | — | Заголовок секции |
| `displayMode` | string | `checkbox` | Режим отображения |
| `enabled` | boolean | `true` | Включить/выключить секцию |
| `itemClass` | string | `''` | CSS-класс для обёртки секции |
| `limitType` | string | `none` | Ограничение списка: none / count / height |
| `limitValue` | number | `5` | Количество (count) или высота px (height) |
| `showMoreText` | string | `''` | Текст ссылки «Показать ещё» |
| `showLessText` | string | `''` | Текст ссылки «Скрыть» |

### Для filterType: categories / tags / attributes

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| `taxonomy` | string | `''` | Slug таксономии (только для `attributes`) |
| `queryType` | string | `or` | or / and |
| `showCount` | boolean | `true` | Показывать счётчик товаров |
| `countUnfiltered` | boolean | `false` | Всегда показывать общее кол-во (без учёта фильтров) |
| `singleSelect` | boolean | `false` | Один выбор (radio-режим для URL) |
| `emptyBehavior` | string | `disable` | Поведение пустых терминов (см. ниже) |
| `checkboxColumns` | number | `1` | Колонки для checkbox/radio |

### Для displayMode: color / image (только attributes)

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| `swatchColumns` | number | `0` | 0 = flex-wrap, N = CSS grid N колонок |
| `swatchShape` | string | `default` | default / theme / rounded / rounded-0 |
| `swatchItemClass` | string | `''` | CSS-класс для каждого свотча |

### Для displayMode: badge

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| `badgeItemClass` | string | `''` | CSS-класс для каждой метки (per-item) |

---

## Поведение пустых терминов (`emptyBehavior`)

| Значение | Поведение |
|----------|-----------|
| `default` | Показывать все термины (count = 0 допустим) |
| `hide` | Скрывать термины с 0 товаров |
| `disable` | Делать неактивными (opacity, no link) — **по умолчанию** |
| `disable_clickable` | Внешне неактивные, но ссылка активна |
| `hide_block` | Скрыть всю секцию если все термины пусты |

Для `color` и `image` режимов неактивные термины получают класс `cw-swatch--unavailable` — CSS рисует красную диагональную линию и обводку `$primary`.

---

## Ограничение списка (`limitType`)

| Значение | Описание | JS в теме |
|----------|----------|-----------|
| `none` | Без ограничений | — |
| `count` | Показать N элементов, остальные скрыть | `toggleLimitFilter()` |
| `height` | Ограничить по высоте в px | `toggleLimitFilter()` |

Кнопка «Показать ещё» рендерится как `<a href="#">` (ссылка, не button).

---

## Глобальные атрибуты блока (таб «Оформление»)

### Структура секций

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| `sectionStyle` | string | `plain` | plain (открытые) / accordion (collapse) |
| `sectionsOpen` | boolean | `true` | Секции открыты по умолчанию |
| `wrapperClass` | string | `widget` | CSS-класс корневого `<div>` |
| `headingTag` | string | `h4` | Тег заголовка секции |
| `headingClass` | string | `widget-title mb-3` | CSS-класс заголовка |

### Чекбоксы и радиокнопки

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| `checkboxSize` | string | `''` | '' = стандарт / sm = маленькие |
| `checkboxItemClass` | string | `''` | CSS-класс для каждого `form-check` |
| `radioSize` | string | `''` | '' = стандарт / sm = маленькие |
| `radioItemClass` | string | `''` | CSS-класс для каждого `form-check` |

### Кнопки

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| `buttonSize` | string | `btn-sm` | '' / btn-xs / btn-sm / btn-lg |
| `buttonStyle` | string | `outline` | solid / outline / soft |
| `buttonShape` | string | `theme` | theme / '' / rounded-xl / rounded-0 / rounded-pill |
| `buttonColor` | string | `secondary` | Bootstrap color token |
| `buttonExtraClass` | string | `''` | Дополнительный CSS-класс кнопок |

`theme` берёт скругление из Redux → `Codeweber_Options::style('button')`.

### Метки (badge)

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| `badgeSize` | string | `''` | '' = Default / badge-lg = Large |
| `badgeShape` | string | `rounded-pill` | theme / rounded-0 / rounded / rounded-pill |
| `badgeColor` | string | `primary` | Bootstrap color token (пустое = без `bg-*`) |
| `badgeExtraClass` | string | `''` | Дополнительный CSS-класс меток |

`theme` берёт скругление из Redux → `Codeweber_Options::style('button')`.

### Прочее

| Атрибут | Тип | По умолчанию | Описание |
|---------|-----|--------------|----------|
| `resetLabel` | string | `''` | Текст кнопки сброса |
| `sliderSize` | string | `lg` | Размер ценового слайдера: lg / md / sm |

---

## render.php → panel_atts

`render.php` формирует массив `$panel_atts` и передаёт его в `cw_render_filter_items()`:

```php
cw_render_filter_items( $items, $panel_atts );
```

Ключи `$panel_atts`:

```
section_style, sections_open, wrapper_class, heading_tag, heading_class,
checkbox_size, checkbox_item_class, radio_size, radio_item_class,
button_size, button_style, button_shape, button_color, button_extra_class,
badge_size, badge_shape, badge_color, badge_extra_class,
reset_label, slider_size
```

Функция `sanitize_html_class_list()` определяется в начале `render.php` с защитой `function_exists`.

---

## JavaScript (тема: shop-pjax.js)

### Инициализация фильтров

```js
initLimitFilter()  // вызывается при загрузке и после PJAX
```

При клике на «Показать ещё / Скрыть» вызывается `toggleLimitFilter(el)`.

### Атрибуты data-*

| Атрибут | Где | Значение |
|---------|-----|----------|
| `data-limit-type` | `.cw-filter-limit` | `count` или `height` |
| `data-limit-value` | `.cw-filter-limit` | число |
| `data-show-more-text` | `.cw-filter-limit` | текст ссылки |
| `data-show-less-text` | `.cw-filter-limit` | текст ссылки |
| `data-cw-limit-init` | `.cw-filter-limit` | флаг инициализации |

---

## CSS-классы (тема: _woo-filters.scss)

| Класс | Описание |
|-------|----------|
| `.cw-swatch` | Базовый свотч (color / image) |
| `.cw-swatch--image` | Свотч с фоновым изображением |
| `.cw-swatch--unavailable` | Недоступный свотч: красная диагональная линия + обводка `$primary` |
| `.cw-filter-limit` | Контейнер с ограничением по count/height |
| `.cw-filter-show-more` | Ссылка «Показать ещё» |

---

## Зависимости от темы

Блок **не работает** без темы CodeWeber. При отсутствии функции `cw_render_filter_items` выводится заглушка:

```
«Для отображения фильтров активируйте тему CodeWeber.»
```

**Функции темы, используемые блоком:**

| Функция | Файл темы | Назначение |
|---------|-----------|------------|
| `cw_render_filter_items()` | `functions/woocommerce-filters.php` | Главная функция рендера |
| `cw_get_category_filter_terms()` | то же | Категории + счётчики |
| `cw_get_tag_filter_terms()` | то же | Метки + счётчики |
| `cw_get_attribute_filter_terms()` | то же | Атрибуты WC + счётчики |
| `cw_get_term_swatch_data()` | то же | Данные свотча (цвет/изображение) |
| `Codeweber_Options::style('button')` | `redux-framework/` | Скругление из настроек темы |

---

## Шаблоны фильтров (тема)

| Файл | Для filterType |
|------|---------------|
| `templates/woocommerce/filters/filter-panel.php` | Обёртка секции |
| `templates/woocommerce/filters/filter-category.php` | categories, tags |
| `templates/woocommerce/filters/filter-attribute.php` | attributes |
| `templates/woocommerce/filters/filter-price.php` | price |
| `templates/woocommerce/filters/filter-rating.php` | rating |
| `templates/woocommerce/filters/filter-stock.php` | stock |
| `templates/woocommerce/filters/filter-active.php` | active_chips |

---

## Типичные ошибки

### `Cannot redeclare sanitize_html_class_list()`
Функция должна быть объявлена **в начале** `render.php` (до первого использования) с защитой `if ( ! function_exists(...) )`. PHP не поднимает функции внутри `if`.

### Пустой экран в редакторе / не валидный JSON
Вложенные `ob_start()` внутри `cw_render_filter_items()` могут утечь в stdout. Проверить drain-паттерн в `Plugin.php` → `pre_render_wc_filter_panel_block()`.
