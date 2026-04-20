# Menu Block — Горизонтальная и вертикальная раскладки

Блок `codeweber-blocks/menu` — динамический блок меню. Рендерится полностью на PHP через `pre_render_block` (в `inc/Plugin.php::pre_render_menu_block()`), поэтому `save.js` на фронте никогда не отображается — только используется для валидации сохранённого контента в редакторе.

**Файлы блока:**

- `src/blocks/menu/block.json` — источник правды для атрибутов
- `src/blocks/menu/edit.js` — редактор + превью
- `src/blocks/menu/save.js` — заглушка для редактора (фронт не использует)
- `src/blocks/menu/deprecated.js` — устаревшие save-функции
- `src/blocks/menu/render.php` — серверный рендер (копируется в `build/blocks/menu/render.php` при сборке)
- `src/blocks/menu/index.js` — регистрация
- `src/blocks/menu/sidebar.js` — Inspector Controls

---

## 1. Атрибут `orientation`

| Значение | Поведение | Обёртка `<ul>` |
|----------|-----------|----------------|
| `horizontal` (default) | Меню в одну линию от `md` и шире, столбиком на мобильных | `navbar-nav flex-md-row` |
| `vertical` | Всегда столбиком | `navbar-nav` (без `flex-md-row`) |

**Почему `flex-md-row`, а не `flex-row`:**

- Bootstrap `.navbar-nav` по умолчанию `flex-direction: column`
- Горизонтальным становится только внутри `.navbar-expand-*` — вне этого контекста нужно явно задавать
- Брейкпоинт `md` = «меню столбиком на телефонах, строкой на планшетах и выше»

## 2. Режимы источника данных (`mode`)

| Режим | Источник | Горизонтальный рендер |
|-------|----------|----------------------|
| `custom` | Ручные пункты из атрибута `items` | `$render_menu_horizontal` (кастомный walker в render.php) |
| `wp-menu` | WordPress меню по `wpMenuId` | `WP_Bootstrap_Navwalker` с классом `navbar-nav flex-md-row` |
| `taxonomy` | Термины таксономии | `$render_menu_horizontal` (тот же walker, что и для `custom`) |

Все три режима уходят в одну ветку, если `orientation === 'horizontal'` и нет `enableMegaMenu`.

## 3. Разметка горизонтального меню

### Верхний уровень (открывается вниз)

```html
<ul class="navbar-nav flex-md-row">
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#">Пункт</a>
    <ul class="dropdown-menu">
      <!-- вложенность: .dropdown-item + .dropdown-submenu.dropend -->
    </ul>
  </li>
</ul>
```

### Вложенные (открываются вправо)

```html
<li class="dropdown-submenu dropend">
  <a class="dropdown-item dropdown-toggle" href="#">Вложенный</a>
  <ul class="dropdown-menu">...</ul>
</li>
```

## 4. CSS-поддержка (в теме codeweber)

Падддинг у `.nav-link` вне контекста `.navbar-expand-*` — добавлен в `wp-content/themes/codeweber/src/assets/scss/theme/_nav.scss`:

```scss
.navbar-nav.flex-md-row .nav-link {
  padding-right: var(--#{$prefix}navbar-nav-link-padding-x, .5rem);
  padding-left: var(--#{$prefix}navbar-nav-link-padding-x, .5rem);
}
```

Fallback `.5rem` нужен потому, что `--bs-navbar-nav-link-padding-x` определён только на `.navbar`, а горизонтальное меню блока рендерится без `.navbar`-обёртки.

**Важно:** стилей для фронта внутри блока нет — всё оформление идёт через тему. Это соответствует правилу «На фронте — только классы Bootstrap».

## 5. Inspector Controls: Menu Style

Опция «Menu Style» (типы 1–5 оформления пунктов) в `sidebar.js` показывается **только при `orientation === 'vertical'`** — эти стили рассчитаны на вертикальные меню (сайдбары), в горизонтальных они не применяются.

```jsx
{(mode === 'custom' || mode === 'taxonomy' || mode === 'wp-menu') &&
  (orientation || 'horizontal') === 'vertical' && (
    {/* Menu Style picker */}
)}
```

## 6. Deprecated entries

Блок содержит `deprecated.js` с одной устаревшей версией:

- **v1** — использовал `flex-row` вместо `flex-md-row` в save.js (horizontal-ориентация)

Требования к deprecated-entry:

1. **Обязательно `attributes: metadata.attributes`** — иначе WP не сможет декодировать атрибуты из старой HTML-разметки и upgrade падает с `TypeError: can't access property "map", c is undefined`
2. `(items || []).map(...)` — защита от `undefined` (атрибуты могут прийти частично)
3. Копия старого `save`, отличающаяся только изменённым классом

## 7. Почему save.js не виден на фронте

`inc/Plugin.php::pre_render_menu_block()` фильтрует через `pre_render_block` и всегда возвращает результат `render.php`, игнорируя сохранённую в БД HTML. Но Gutenberg в редакторе **всё равно валидирует сохранённую HTML против текущего `save()`** — поэтому при изменении `save.js` нужен `deprecated` entry, иначе старые блоки покажут «Block validation failed».
