---
name: block
description: Создать новый Gutenberg-блок в плагине codeweber-gutenberg-blocks — по всем паттернам проекта
argument-hint: "название блока, например: my-widget или Price Card"
---

Создай новый Gutenberg-блок в плагине `codeweber-gutenberg-blocks`: `$ARGUMENTS`

> **Правило:** всё — на **английском**. Русский — только в `languages/ru_RU.po`.

Перед началом прочитай:
- `doc_claude/development/CODING_STANDARDS.md`
- `doc_claude/blocks/BLOCKS_CATALOG.md` — проверь на дубли

---

## Шаг 1: Коммит текущего состояния

`git status` — если есть незакоммиченные изменения, коммит перед началом.

---

## Шаг 2: Уточняющие вопросы

### Основное

| Вопрос | Влияет на |
|--------|-----------|
| Что делает блок? (назначение) | Выбор атрибутов, тип рендера |
| **Static** (markup в БД) или **Dynamic** (PHP render)? | `save.js` vs `render.php` |
| Категория | `codeweber-gutenberg-elements` (default) / `codeweber-gutenberg-blocks` / `codeweber-gutenberg-widgets` |
| Нужен ли InnerBlocks (вложенные блоки)? | `useInnerBlocksProps`, `InnerBlocks` |

### Атрибуты

Перечисли поля блока. Для каждого:
- Тип (`string`, `number`, `boolean`, `array`, `object`)
- Default-значение
- Пример: `{ title: string, showIcon: boolean, items: array }`

Именование атрибутов:
- PascalCase: `ButtonContent`, `LinkUrl`, `ImageSize`
- Булевы: `isEnabled`, `showTitle`, `allowMultiple`
- Массивы: default `[]`, объекты: default `{}`

### Inspector-панель

Проверь список готовых компонентов — `doc_claude/development/INSPECTOR_COMPONENTS.md`.
Спроси: нужны ли из них:
- `SpacingControl` — отступы Bootstrap p/m
- `BackgroundSettingsPanel` — фон (цвет / картинка / видео)
- `AnimationControl` — ScrollCue анимации
- `BorderSettingsPanel` — скругления, тени
- `ColorTypeControl` — цвет: solid / soft / pale / gradient
- `ImageUpload` / `ImageControl` — картинки
- `IconControl` / `IconRender` — иконки
- `AdaptiveControl` — адаптивные колонки
- Другие из каталога

### Стили

- Bootstrap-классов хватает → `style.scss` пустой (добавь комментарий `// Bootstrap only`)
- Нужны кастомные стили → используй префикс `cwgb-` или `codeweber-`

---

## Шаг 3: План

**Блок:** `codeweber-blocks/<name>`
**Тип:** Static / Dynamic — объясни почему
**Категория:** `codeweber-gutenberg-elements`

Файлы:

| Файл | Путь |
|------|------|
| `block.json` | `src/blocks/<name>/block.json` |
| `index.js` | `src/blocks/<name>/index.js` |
| `edit.js` | `src/blocks/<name>/edit.js` |
| `save.js` | `src/blocks/<name>/save.js` *(static)* |
| `render.php` | `src/blocks/<name>/render.php` *(dynamic)* |
| `style.scss` | `src/blocks/<name>/style.scss` |
| `editor.scss` | `src/blocks/<name>/editor.scss` |
| `Plugin.php` | `inc/Plugin.php` — добавить в `getBlocksName()` |
| `package.json` | `package.json` — добавить в `copy-php` *(только dynamic)* |

**Дождись подтверждения пользователя.**

---

## Шаг 4: Реализация

### 4.1 `src/blocks/<name>/block.json`

```json
{
  "apiVersion": 3,
  "name": "codeweber-blocks/<name>",
  "version": "0.1.0",
  "title": "<Title>",
  "category": "codeweber-gutenberg-elements",
  "icon": "block-default",
  "description": "<Short description>",
  "supports": {
    "html": false,
    "customClassName": true,
    "anchor": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "default": ""
    }
  },
  "textdomain": "codeweber-gutenberg-blocks",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

---

### 4.2 `src/blocks/<name>/index.js`

```js
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import Edit from './edit';
import Save from './save'; // или: import { Save } from './save';

registerBlockType( metadata, {
    edit: Edit,
    save: Save, // dynamic: save: () => null
} );
```

---

### 4.3 `src/blocks/<name>/edit.js`

```jsx
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
// Готовые компоненты (если нужны):
// import SpacingControl from '../../components/spacing/SpacingControl';
// import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';

export default function Edit( { attributes, setAttributes } ) {
    const { title } = attributes;
    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Settings', 'codeweber-gutenberg-blocks' ) }>
                    <TextControl
                        label={ __( 'Title', 'codeweber-gutenberg-blocks' ) }
                        value={ title }
                        onChange={ ( val ) => setAttributes( { title: val } ) }
                    />
                </PanelBody>
            </InspectorControls>
            <div { ...blockProps }>
                <RichText
                    tagName="h3"
                    value={ title }
                    onChange={ ( val ) => setAttributes( { title: val } ) }
                    placeholder={ __( 'Enter title...', 'codeweber-gutenberg-blocks' ) }
                />
            </div>
        </>
    );
}
```

> `@wordpress/components` — **только в InspectorControls**. На фронте — Bootstrap классы.

---

### 4.4a `src/blocks/<name>/save.js` — статический блок

```jsx
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    const { title } = attributes;
    return (
        <div { ...useBlockProps.save() }>
            <RichText.Content tagName="h3" value={ title } />
        </div>
    );
}
```

---

### 4.4b `src/blocks/<name>/render.php` — динамический блок

```php
<?php
// Доступны: $attributes, $content, $block
$title              = esc_html( $attributes['title'] ?? '' );
$wrapper_attributes = get_block_wrapper_attributes();
?>
<div <?php echo $wrapper_attributes; ?>>
    <h3><?php echo $title; ?></h3>
</div>
```

И `save.js` возвращает `null`:
```js
export default function Save() { return null; }
```

**Безопасность в render.php:**
```php
// Всегда экранировать
$text = esc_html( $attributes['text'] ?? '' );
$url  = esc_url( $attributes['url'] ?? '' );
$attr = esc_attr( $attributes['class'] ?? '' );
$html = wp_kses_post( $attributes['content'] ?? '' ); // если HTML
```

---

### 4.5 `src/blocks/<name>/style.scss`

```scss
// Bootstrap only — no custom styles needed
// .cwgb-<name> { } // используй cwgb- или codeweber- если нужны кастомные стили
```

### 4.6 `src/blocks/<name>/editor.scss`

```scss
// Editor-only styles
```

---

### 4.7 Регистрация в `inc/Plugin.php`

Найди метод `getBlocksName()` и добавь название блока в массив:

```php
public static function getBlocksName(): array {
    return [
        // ... существующие блоки ...
        '<name>',  // ← добавить
    ];
}
```

---

### 4.8 Dynamic-блок: добавить в `copy-php` в `package.json`

Найди в `package.json` строку `"copy-php"` и добавь `'<name>'` в массив блоков:

```json
"copy-php": "node -e \"...const blocks = [..., '<name>']; ..."
```

---

### 4.9 Атрибуты изменились? → Добавить deprecation

Если изменяешь атрибуты или разметку существующего блока:

```js
// В index.js
registerBlockType( metadata, {
    edit: Edit,
    save: Save,
    deprecated: [
        {
            attributes: { /* старые атрибуты */ },
            save( { attributes } ) {
                // старый save
            },
            migrate( attributes ) {
                // трансформация к новым атрибутам
                return attributes;
            },
        },
    ],
} );
```

---

## Шаг 5: Lint

```bash
npm run lint:js     # ошибки блокируют коммит
npm run lint:css    # ошибки блокируют коммит
```

Авто-фикс: `npm run lint:js -- --fix`

---

## Шаг 6: Build

```bash
npm run build
```

Проверь:
- `build/blocks/<name>/` существует
- Блок появляется в инсертере под категорией `codeweber-gutenberg-elements`
- Dynamic: `build/blocks/<name>/render.php` скопирован

---

## Шаг 7: Проверка чеклиста

- [ ] `block.json`: `apiVersion: 3`, `name: codeweber-blocks/<name>`, `textdomain: codeweber-gutenberg-blocks`
- [ ] `Plugin::getBlocksName()` — имя добавлено
- [ ] Dynamic: имя в `copy-php` + `build/blocks/<name>/render.php` существует
- [ ] `@wordpress/components` — только в Inspector
- [ ] Фронт: только Bootstrap классы
- [ ] Все строки в `__( 'Text', 'codeweber-gutenberg-blocks' )`
- [ ] `render.php`: все выводы через `esc_html()` / `esc_url()` / `esc_attr()`
- [ ] При изменении атрибутов — `deprecated` добавлен
- [ ] `npm run lint:js` — нет ошибок
- [ ] `npm run build` — успешно

---

## Шаг 8: i18n

```bash
npm run i18n:update
```

---

## Шаг 9: Обновить каталог

Добавь блок в `doc_claude/blocks/BLOCKS_CATALOG.md`:

```
| `<name>` | <Title> | <Category> | <S/D> | <Description> |
```

Где S = static, D = dynamic.

---

## Шаг 10: Коммит

```
feat: add block <name> (<Title>)
```

Включи все файлы: `src/blocks/<name>/`, `build/blocks/<name>/`, `inc/Plugin.php`, `package.json` (если dynamic), `doc_claude/blocks/BLOCKS_CATALOG.md`, `languages/`.
