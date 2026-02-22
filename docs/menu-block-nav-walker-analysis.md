# Анализ: Nav Walker для блока Menu

## 1. Текущая реализация

### 1.1 Режимы вывода

| Режим | Как реализовано | Использует Walker? |
|-------|------------------|--------------------|
| **Custom** (свои пункты) | Кастомный PHP: `$itemsToRender`, плоский список | Нет (Walker не применим — нет WP меню) |
| **WP Menu, horizontal** | `wp_nav_menu()` + `WP_Bootstrap_Navwalker` (тема) | Да |
| **WP Menu, vertical, без collapse** | `wp_nav_menu()` с простыми аргументами (без Walker) | Нет |
| **WP Menu, vertical, collapse** | Кастомный PHP: дерево из `wp_get_nav_menu_items()`, `$render_menu_collapse` | Нет |
| **WP Menu, Mega Menu** | Кастомный PHP: `$render_mega_menu_level` | Нет |
| **Fallback** (нет Walker) | То же, что vertical/collapse или простой список | Нет |

### 1.2 Настройки блока (атрибуты)

Из `block.json` и сайдбара:

- **Режим и меню:** `mode`, `wpMenuId`, `menuId`, `menuData`
- **Структура:** `depth`, `orientation`, `useCollapse`
- **Цвет/тема:** `theme` (default / dark / light / inverse), `textColor`, `bulletColor`, `bulletBg`
- **Списки:** `listType` (none / unordered / icon), `iconClass`, `menuClass`, `itemClass`, `linkClass`
- **Mega Menu:** `enableMegaMenu`, `columns`
- **Прочее:** `enableWidget`, `enableTitle`, `title`, `titleTag`, `titleClass`, `titleColor`, и т.д.

Часть из них влияет только на классы и разметку (в т.ч. для collapse).

---

## 2. Возможности wp_nav_menu и Walker

### 2.1 Что передаётся в Walker

- `wp_nav_menu( $args )` — все ключи массива `$args` попадают в объект `$args` в методах Walker’а.
- В `start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 )` и в `start_lvl`/`end_lvl` доступен один и тот же `$args`.
- Стандартные ключи: `menu`, `container`, `menu_class`, `menu_id`, `depth`, `walker`, `items_wrap`, и т.д.
- **Любые свои ключи** (например `theme`, `item_class`, `link_class`, `use_collapse`, `instance_suffix`) можно передать в `$args` и читать в Walker’е.

Итого: все настройки блока можно передать в `wp_nav_menu()` и использовать внутри своего Walker’а.

### 2.2 Глубина (depth)

- В `wp_nav_menu( array( 'depth' => 2 ) )` глубина уже обрабатывается ядром: подуровни не выводятся после заданного уровня.
- В Walker’е в `start_el` и `start_lvl` приходит текущий `$depth`.
- Ограничение вложенности и «показывать только N уровней» реализуемы и через стандартный аргумент, и при необходимости через свою логику в Walker’е.

---

## 3. Реализуемость функционала через Walker

### 3.1 Классы и тема (цвет)

- **menu_class** — стандартный аргумент, WordPress сам выставляет класс у корневого `<ul>`. Дополнительные классы (flex, list-unstyled и т.д.) можно добавить сюда же.
- **item_class, link_class** — не стандартны; передаём как `$args->item_class`, `$args->link_class` и в `start_el` добавляем к классам `<li>` и `<a>`.
- **theme / textColor** — передаём как `$args->theme` или `$args->text_theme_class` и в `start_el` добавляем нужный класс к ссылке (например `text-white`, `text-dark`).

Всё это в Walker’е делается без проблем.

### 3.2 listType, иконки, буллеты

- **listType**, **iconClass**, **bulletColor**, **bulletBg** можно передать через `$args`.
- В `start_el` при `listType === 'icon'` выводить перед ссылкой `<span><i class="..."></i></span>`.
- Классы для списка (unordered-list, icon-list, bullet-*, bullet-bg и т.д.) задаются через `menu_class` или через свой формат обёртки в `start_lvl` (например, класс на `<ul>` подуровня).

Реализуемо полностью.

### 3.3 Collapse (Bootstrap, data-bs-parent)

Текущее поведение:

- У пунктов с детьми: обёртка `div.menu-collapse-row`, ссылка, кнопка `.btn-collapse` с `data-bs-toggle="collapse"`, `data-bs-target="#…"`.
- Подменю в `div.collapse` с уникальным `id` и `data-bs-parent="#…"`.
- Один открытый блок на уровень (accordion), путь до текущей страницы раскрыт по умолчанию.

В Walker’е:

- **start_el:** для пункта с детьми (`$args->has_children` или проверка по `$item`) выводим обёртку, ссылку и кнопку. ID для collapse формируем как `menu-collapse-item-{item_id}-{instance_suffix}`; `instance_suffix` передаём в `$args` (см. ниже).
- **start_lvl:** вместо простого `<ul>` выводим `<div class="collapse" id="..." data-bs-parent="..."><ul>`. ID и `data-bs-parent` берём из «текущего» пункта: в Walker’е нужно хранить в свойстве класса ID родительского пункта и общий `wrapper_id` (тоже из `$args`), чтобы выставить `data-bs-parent`.
- **Раскрытие по умолчанию:** у WordPress в классах пункта есть `current-menu-ancestor` / `current-menu-item`. В `start_el` для пункта с детьми проверяем `$item->current_item_ancestor || $item->current` и при true добавляем класс `show` к следующему `div.collapse` и `aria-expanded="true"` у кнопки. Логику «раскрыть путь до current» можно полностью перенести в Walker.
- **Уникальность ID на странице:** перед вызовом `wp_nav_menu()` увеличиваем статический счётчик и передаём его в `$args->instance_suffix`. В Walker’е все `id` и `data-bs-target`/`data-bs-parent` строим с этим суффиксом.

Вывод: текущий функционал collapse (включая вложенность и путь до current) в Walker’е реализуем.

### 3.4 Mega Menu

- Сейчас: отдельная функция `$render_mega_menu_level`, своя разметка (колонки, dropdown-mega и т.д.).
- В теме уже есть `WP_Bootstrap_Navwalker` с поддержкой Mega Menu (dropdown-mega, контент из html_blocks и т.д.).
- Варианты:
  - Оставить Mega Menu в кастомном рендере блока (как сейчас) и не трогать Walker темы.
  - Либо расширить один Walker (темы или новый общий) опцией «mega» и дублировать/адаптировать логику. Это уже более тяжёлая доработка и риск поломать хедер.

Рекомендация: в первом шаге Walker для блока делать только под vertical + collapse (и простой vertical list); Mega Menu оставить на текущем кастомном рендере.

### 3.5 Режим Custom (свои пункты)

- Источник данных — массив `items` из атрибутов блока, а не WP меню.
- `wp_nav_menu()` всегда работает с зарегистрированным меню (или с `items` через свой механизм, что для блока не используется).
- Walker не может «подменить» источник данных на массив из блока без костылей (создание временного меню и т.п.).

Вывод: режим Custom и дальше рендерить кастомным PHP, без Walker’а.

---

## 4. Ограничения и риски

### 4.1 Два типа разметки

- **Горизонтальное меню (navbar):** dropdown’ы, `dropdown-toggle`, `dropdown-menu`, в теме — `WP_Bootstrap_Navwalker`.
- **Вертикальное collapse:** ссылка + кнопка, `div.collapse`, `data-bs-parent`, accordion.

Разметка и логика разные. Варианты:

- **Отдельный Walker для блока** (рекомендуется): класс только под vertical (список + collapse), все настройки блока в `$args`. Горизонтальное по-прежнему через `WP_Bootstrap_Navwalker` темы.
- **Один Walker с режимом:** один класс с параметром типа `output_mode` / `layout` (navbar | vertical | collapse). Сложнее поддерживать и тестировать.

### 4.2 Фильтры WordPress

- `nav_menu_css_class`, `nav_menu_link_attributes`, `nav_menu_item_args` и др. вызываются и при использовании Walker’а.
- Тема уже вешает на них логику (например, `codeweber_add_active_class_to_anchor`, `codeweber_remove_active_class_from_li`). Нужно либо не ломать эту логику в новом Walker’е, либо явно учитывать её (например, не дублировать класс active там, где это делает тема).

### 4.3 Подсветка current

- Сейчас в кастомном рендере используется своя проверка URL и флаг `current` в дереве.
- В Walker’е достаточно полагаться на стандартные классы и свойства `$item->current`, `$item->current_item_ancestor` и классы из `nav_menu_css_class`.

Это упрощает код и оставляет подсветку в рамках API меню.

---

## 5. Рекомендации

### 5.1 Имеет ли смысл делать Walker

**Да**, для режима **WP Menu + vertical (с collapse и без)**:

- Все настройки блока (глубина, тема, классы, иконки, collapse) можно передать через `$args` и обработать в одном месте.
- Разметка collapse и уникальные ID реализуемы в Walker’е без потери функционала.
- Единый путь через `wp_nav_menu()` упрощает поддержку и даёт совместимость с фильтрами и плагинами меню.

**Не переносить в Walker (пока):**

- Режим **Custom** — оставить кастомный вывод по `items`.
- **Mega Menu** — оставить текущий кастомный рендер или выносить в отдельный этап после стабилизации vertical Walker’а.

### 5.2 Предлагаемая архитектура

1. **Новый класс Walker’а** (в плагине), например `CodeWeber_Menu_Block_Vertical_Walker`, расширяющий `Walker_Nav_Menu`.
2. **Аргументы при вызове** (псевдокод):

```php
$nav_args = array(
    'menu'            => $wpMenuId,
    'depth'           => $depth,
    'container'       => 'nav',
    'container_class' => 'menu-collapse-nav',
    'container_id'    => $collapse_wrapper_id,
    'menu_class'      => $collapse_list_str,
    'menu_id'         => '',
    'walker'          => new CodeWeber_Menu_Block_Vertical_Walker( array(
        'use_collapse'      => $useCollapse,
        'theme_class'       => $textThemeClass,
        'item_class'        => $itemClass,
        'link_class'        => $linkClass,
        'list_type'         => $listType,
        'icon_class'        => $iconClass,
        'instance_suffix'   => $collapse_instance_suffix,
        'wrapper_id'        => $collapse_wrapper_id,
    ) ),
    'fallback_cb'     => false,
    'echo'             => false,
);
$menuContent = wp_nav_menu( $nav_args );
```

3. В Walker’е:
   - в `start_el` — вывод `li`, при наличии детей и `use_collapse`: обёртка, ссылка, кнопка; иначе только ссылка; добавление `item_class`, `link_class`, `theme_class`, иконок по `list_type`/`icon_class`;
   - в `start_lvl` / `end_lvl` — при `use_collapse` оборачивать подменю в `div.collapse` с нужным `id` и `data-bs-parent`, иначе только `ul`;
   - хранить в свойствах объекта текущий родительский `item` ID и `wrapper_id` для корректных `data-bs-parent` и раскрытия по current.

4. **Горизонтальное меню** не трогать — по-прежнему `WP_Bootstrap_Navwalker` темы.
5. **Custom и Mega Menu** — без изменений, кастомный PHP.

### 5.3 Объём работ (оценка)

- Реализация `CodeWeber_Menu_Block_Vertical_Walker` с поддержкой всех перечисленных настроек и collapse: **средний** объём (несколько часов).
- Поддержка простого vertical list через тот же Walker (без collapse): **малый** объём.
- Тесты: несколько меню на странице, вложенность, текущая страница, смена темы/классов в блоке.
- Документация и, при необходимости, отключение старого кастомного рендера для vertical после включения Walker’а по опции или по умолчанию.

---

## 6. Краткий вывод

| Вопрос | Ответ |
|--------|--------|
| Можно ли перенести функционал блока (vertical + collapse, настройки) в Nav Walker? | **Да.** |
| Все настройки блока (цвет, глубина, классы, иконки, collapse) можно прокинуть в Walker? | **Да**, через аргументы `wp_nav_menu()`. |
| Режим Custom и Mega Menu тоже переводить на Walker? | **Нет** в первом шаге: Custom по природе не WP меню; Mega Menu логичнее оставить в текущем рендере или выносить отдельно. |
| Рекомендация | Ввести отдельный **CodeWeber_Menu_Block_Vertical_Walker** для WP Menu + vertical (список и collapse), передавать в него все нужные настройки блока и оставить текущую реализацию для Custom и Mega Menu. |
