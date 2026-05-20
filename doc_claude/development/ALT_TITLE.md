# Alternative Title (Alt Title) — Meta Field & Block Integration

Система альтернативного заголовка позволяет задать для любой записи HTML-заголовок с поддержкой переносов строк и базовых тегов оформления. Применяется когда нужен заголовок с `<br>` или выделением, например в карточках грида.

---

## Метаполе `_alt_title`

### Регистрация

Файл: `inc/AltTitleMeta.php`, класс `AltTitleMeta`.

```php
const META_KEY = '_alt_title';
```

Метаполе регистрируется через `register_post_meta('')` — пустая строка в качестве типа поста означает **все типы записей**. Аналогично `register_term_meta('')` регистрирует его для всех таксономий.

Параметры:

| Параметр | Значение |
|---|---|
| `type` | `string` |
| `single` | `true` |
| `show_in_rest` | `true` |
| `sanitize_callback` | `wp_kses_post` |
| `auth_callback` | `current_user_can('edit_post', $id)` |

### Поддерживаемые HTML-теги

`wp_kses_post` разрешает весь «постовый» набор, но практически ценны:

- `<br>` — перенос строки в заголовке
- `<strong>` / `<b>` — жирный текст
- `<em>` / `<i>` — курсив
- `<span class="…">` — произвольный класс (например, для цвета)

Теги `<script>`, `<iframe>`, `<form>` и всё потенциально опасное отсекается.

### Интерфейс редактирования

#### Записи (post types)

Метабокс **Alternative Title** выводится в sidebar (position `side`, priority `default`) для всех публичных типов записей кроме `attachment`. Поле — `<textarea>`, сохранение с nonce `_alt_title_nonce`.

#### Таксономии (terms)

Поле **Alternative Title** выводится:
- в форме редактирования существующего терма (хук `{taxonomy}_edit_form_fields`)
- в форме добавления нового терма (хук `{taxonomy}_add_form_fields`)

Охватывает все публичные таксономии сайта (кроме `nav_menu`).

---

## Поддержка в блоках плагина

Три блока поддерживают атрибут `useAltTitle`:

| Блок | Атрибут | Таб / место |
|---|---|---|
| Post Grid | `useAltTitle` | Title tab → последний ToggleControl |
| Lists | `useAltTitle` | Inspector Panel → после **Enable Links** |
| Accordion | `useAltTitle` | Inspector Panel → после **PostSortControl** |

Во всех трёх случаях тогл виден только когда источник — **Posts** (`mode === 'post'`), не термины и не ручной текст.

### Post Grid

Атрибут объявлен в `src/blocks/post-grid/block.json`:

```json
"useAltTitle": { "type": "boolean", "default": false }
```

**Render.php** (`src/blocks/post-grid/render.php`):

Перед вызовом `cw_render_post_card()` устанавливает временный `the_title` фильтр, привязанный к конкретному `post->ID`:

```php
$alt_title_filter = function ( $title, $id ) use ( $pid, $atv ) {
    return ( (int) $id === $pid ) ? $atv : $title;
};
add_filter( 'the_title', $alt_title_filter, 99, 2 );
$display_settings['use_html_title'] = true;
$display_settings['title_length']   = 0;
// ... cw_render_post_card() ...
remove_filter( 'the_title', $alt_title_filter, 99 );
```

Почему через `the_title` фильтр: `cw_render_post_card()` вызывает `cw_get_post_card_data()` внутри, которая получает заголовок через `get_the_title()`. Нет прямого способа переопределить его снаружи — фильтр единственное правильное место.

**Важно:** `title_length = 0` форсируется при alt title, чтобы `mb_substr()` в шаблоне не обрезал HTML-теги посередине.

### Lists

Атрибут объявлен в `src/blocks/lists/block.json`.

**Render.php** (`src/blocks/lists/render.php`) читает мета напрямую в цикле:

```php
if ($use_alt_title) {
    $alt = get_post_meta($postId, '_alt_title', true);
    if (!empty($alt)) {
        $postTitle = wp_kses_post($alt);
    }
}
```

Вывод: `($use_alt_title && $mode === 'post') ? wp_kses_post($item['text']) : esc_html($item['text'])`.

### Accordion

Аналогично Lists — читается через `get_post_meta()`, вывод кнопки аккордиона через `wp_kses_post()` при активном тогле.

---

## Поддержка в теме (шаблоны карточек)

Флаг `use_html_title` передаётся в `$display_settings`. Если он `true` — шаблон использует `wp_kses_post($title)` вместо `esc_html($title)`.

Шаблоны, поддерживающие `use_html_title`:

| Файл | CPT |
|---|---|
| `templates/post-cards/post/default.php` | post |
| `templates/post-cards/post/card.php` | post |
| `templates/post-cards/post/card-content.php` | post |
| `templates/post-cards/post/default-clickable.php` | post |
| `templates/post-cards/post/slider.php` | post |
| `templates/post-cards/post/overlay-5.php` | post |
| `templates/post-cards/post/overlay-5-primary.php` | post |
| `templates/post-cards/services/overlay-5.php` | services |
| `templates/post-cards/services/overlay-5-primary.php` | services |
| `templates/post-cards/projects/overlay-5-primary.php` | projects |

В `templates/post-cards/helpers.php` функция `cw_get_post_card_display_settings()` имеет `'use_html_title' => false` в дефолтах — обратная совместимость гарантирована.

**Slider:** HTML-атрибут `title=""` не поддерживает HTML-теги. В `post/slider.php` вместо `esc_attr($post_data['title'])` используется `esc_attr(wp_strip_all_tags($post_data['title']))`.

---

## Потенциальные расширения

- Taxonomy mode в Post Grid (`sourceType === 'taxonomy'`) — alt title для термов читается из `register_term_meta`, но блок **не реализует** это пока. Шаблоны карточек термов (`cw_render_term_card()`) не проверяют `use_html_title`.
- Блоки `clients`, `testimonials`, `staff`, `documents`, `faq` — имеют ранние `return;` в render.php Post Grid до общего `useAltTitle`-кода. При необходимости нужно добавить логику в каждую ветку отдельно.
