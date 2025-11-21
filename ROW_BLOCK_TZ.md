# Техническое задание: блок Row

## Цели
1. Повторить структуру `div.row` из темы `codeweber` (Bootstrap и дополнительные utility-классы).
2. Дать автоуправление gutter/cols/позиционированием и классы `row-cols-*`, сохраняя гибкость добавления декоративных классов (например, `row-grid`, `process-wrapper`).
3. Упростить повторное использование в будущем через общие компоненты (`PositioningControl`, `Attributes`).

## Структура блока
- Имя: `codeweber-blocks/row` (API v2).  
- Поддержка: `supports.html: false`, `supports.customClassName: true`, `supports.anchor: true`.  
- `edit.js` и `save.js` рендерят `<div class="row ${classNames}">` + `InnerBlocks`.  
- Ожидается, что блок будет вставляться внутри Section/Container.  

## Атрибуты
| Ключ | Описание |
| --- | --- |
| `rowType` | `classic` или `columns-grid`. Устанавливает режим сетки. |
| `rowGutterX` / `rowGutterY` | Гаттеры: `gx-*`, `gy-*`. |
| `rowCols` | `row-cols-*` (включая responsive). |
| `rowAlignItems`, `rowJustifyContent`, `rowTextAlign`, `rowPosition` | Утилиты позиционирования (обрабатываются `PositioningControl`). |
| `rowClass` | Произвольные классы, например `row-grid`, `mb-10`. |
| `rowData` | Строка `key=value,key2=value2` → парсер добавляет `data-*` и `aria-*`. |
| `rowId` | `id` без `#`. |

## Inspector Controls
1. **Grid Type (новый компонент — две кнопки)**: `Classic grid` и `Columns grid` (работает с `rowType`).  При выборе `columns-grid` по умолчанию добавляется `row-cols-1`, но пользователь может сменить `rowCols`.  
2. **Gutters X / Y**: кнопки `gx-0…gx-5`, `gx-lg-8`, `gy-*`, `none`.  
3. **Row Columns**: список `row-cols-1…row-cols-6`, `row-cols-md-*`, `row-cols-xl-*`.  
4. **Positioning Control** (готовый компонент): текстовое выравнивание, `align-items`, `justify-content` (автоматически `d-flex`), `position`.  
5. **Attributes** (`BlockMetaFields`/`AttributesControl`): `Row Class`, `Row Data`, `Row ID`.  

## Классы и утилиты
- Новый helper `getRowClassNames(attrs)` собирает строку: `row`, `rowClass`, `rowCols`, `gx/gy`, `align-items/*`, `justify-content/*`, `text-*`, `position-*`. Если `rowType === 'columns-grid'`, обязательно добавляет `row-cols-1` (или указанное `rowCols`). Если выбрано `rowJustifyContent`, вставляет `d-flex`.  
- При `rowData` парсятся пары `key=value`, добавляются только валидные `data-*`/`aria-*`.  
- `rowId` нормализуется (удаляет `#`).

## Render (save/edit)
- `edit.js`: `useBlockProps({ className: `row ${getRowClassNames(attrs)}` })`.  
- `save.js`: такое же `div.row` с `InnerBlocks.Content`, `data-*` и `id`.  
- Любые значения `rowClass` и `rowType` должны попадать в итоговый HTML.  

## Дополнительно
1. Убедиться, что Row можно вставлять только в Section (если нужно — через `useInnerBlocksProps` или verifications).  
2. Представить шаблон: `<InnerBlocks template={[ ['core/columns', {}] ]} />`.  
3. Добавить документацию `ROW_BLOCK_TZ.md` (эта и есть).  
4. Тестировать: `row-cols`, `gx/gy`, `justify` → `d-flex`, `rowData/rowId`, `rowType` переключается между “классической” и “columns-grid” сеткой.


