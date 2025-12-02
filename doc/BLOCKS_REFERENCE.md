# BLOCKS REFERENCE · Справочник блоков

> Полный справочник всех Gutenberg-блоков плагина `codeweber-gutenberg-blocks`.  
> Для AI-агентов: используйте этот документ для понимания структуры, атрибутов и зависимостей блоков.

---

## 0. Общие сведения

| Параметр | Значение |
|----------|----------|
| **Категория** | `codeweber-gutenberg-blocks` |
| **Namespace** | `codeweber-blocks/` (layout) или `codeweber-gutenberg-blocks/` (UI) |
| **API Version** | 2 |
| **Text Domain** | `codeweber-blocks` |

### Структура файлов блока

```
src/blocks/<block-name>/
├── block.json      # Метаданные, атрибуты, supports
├── index.js        # Регистрация блока
├── edit.js         # Компонент редактора (Inspector Controls)
├── save.js         # Компонент сохранения (статический HTML)
├── style.scss      # Стили фронта
├── editor.scss     # Стили редактора
└── utils.js        # Утилиты (опционально)
```

---

## 1. Section

**Назначение:** Секция страницы с поддержкой фона (цвет, изображение, паттерн, видео) и контейнера.

| Поле | Значение |
|------|----------|
| **Name** | `codeweber-blocks/section` |
| **Icon** | `layout` |
| **Supports** | `customClassName`, `anchor`, `innerBlocks` |
| **Файлы** | `src/blocks/section/` |

### Атрибуты

| Атрибут | Тип | Default | Описание |
|---------|-----|---------|----------|
| `backgroundType` | string | `"none"` | Тип фона: `none`, `color`, `image`, `pattern`, `video` |
| `backgroundColor` | string | `"primary"` | Цвет фона (из палитры темы) |
| `backgroundColorType` | string | `"solid"` | Тип цвета: `solid`, `soft`, `pale`, `gradient` |
| `backgroundGradient` | string | `"gradient-1"` | Градиент (если `backgroundColorType === 'gradient'`) |
| `backgroundImageId` | number | `0` | ID изображения из медиатеки |
| `backgroundImageUrl` | string | `""` | URL изображения |
| `backgroundImageSize` | string | `""` | Размер изображения (thumbnail, medium, large, full) |
| `backgroundSize` | string | `""` | CSS background-size: `bg-auto`, `bg-cover`, `bg-full` |
| `backgroundVideoId` | number | `0` | ID видео |
| `backgroundVideoUrl` | string | `""` | URL видео |
| `backgroundOverlay` | string | `""` | Оверлей: `bg-overlay`, `bg-overlay-300`, `bg-overlay-400` |
| `backgroundPatternUrl` | string | `""` | URL паттерна |
| `textColor` | string | `"none"` | Цвет текста секции |
| `containerType` | string | `"container"` | Тип контейнера: `container`, `container-fluid`, `container-card` |
| `containerClass` | string | `"py-14 py-md-16"` | Дополнительные классы контейнера |
| `containerAlignItems` | string | `""` | Flexbox align-items |
| `containerJustifyContent` | string | `""` | Flexbox justify-content |
| `containerTextAlign` | string | `""` | Выравнивание текста |
| `containerPosition` | string | `""` | CSS position |
| `sectionFrame` | boolean | `false` | Рамка секции |
| `overflowHidden` | boolean | `false` | overflow: hidden |
| `positionRelative` | boolean | `false` | position: relative |
| `minHeight` | string | `""` | Минимальная высота |
| `sectionClass` | string | `""` | Кастомные классы секции |
| `sectionData` | string | `""` | data-атрибуты |
| `sectionId` | string | `""` | HTML ID |
| `spacingType` | string | `"padding"` | Тип отступов: `padding` или `margin` |
| `spacingXs`...`spacingXxl` | string | `""` | Отступы по breakpoint-ам |
| `angledEnabled` | boolean | `false` | Включить скошенный разделитель |
| `angledUpper` | string | `""` | Верхний угол: `upper-start`, `upper-end` |
| `angledLower` | string | `""` | Нижний угол: `lower-start`, `lower-end` |
| `waveTopEnabled` | boolean | `false` | Включить верхнюю волну |
| `waveTopType` | string | `""` | Тип верхней волны: `wave-1`...`wave-5` |
| `waveBottomEnabled` | boolean | `false` | Включить нижнюю волну |
| `waveBottomType` | string | `""` | Тип нижней волны: `wave-1`...`wave-5` |

### Использование

```html
<!-- Секция с цветным фоном -->
<section class="wrapper bg-soft-primary">
  <div class="container py-14 py-md-16">
    <!-- InnerBlocks -->
  </div>
</section>

<!-- Секция с изображением и оверлеем -->
<section class="wrapper image-wrapper bg-image bg-cover bg-overlay">
  <div class="container py-14 py-md-16">
    <!-- InnerBlocks -->
  </div>
</section>

<!-- Секция со скошенным разделителем (Angled) -->
<section class="wrapper angled upper-start lower-end bg-soft-primary">
  <div class="container py-14 py-md-16">
    <!-- InnerBlocks -->
  </div>
</section>

<!-- Секция с волнистыми разделителями (Waves) -->
<section class="wrapper bg-primary">
  <div class="divider text-light divider-top">
    <svg xmlns="..." viewBox="..." style="transform: rotate(180deg)">
      <path fill="currentColor" d="..."/>
    </svg>
  </div>
  <div class="container py-14 py-md-16">
    <!-- InnerBlocks -->
  </div>
  <div class="divider text-light">
    <svg xmlns="..." viewBox="...">
      <path fill="currentColor" d="..."/>
    </svg>
  </div>
</section>
```

---

## 2. Column

**Назначение:** Bootstrap-колонка с поддержкой фона и адаптивных размеров.

| Поле | Значение |
|------|----------|
| **Name** | `codeweber-blocks/column` |
| **Icon** | `column` |
| **Supports** | `customClassName`, `anchor`, `innerBlocks` |
| **Файлы** | `src/blocks/column/` |

### Атрибуты

| Атрибут | Тип | Default | Описание |
|---------|-----|---------|----------|
| `columnColXs` | string | `"3"` | Ширина на xs (col-*) |
| `columnColSm` | string | `""` | Ширина на sm (col-sm-*) |
| `columnColMd` | string | `""` | Ширина на md (col-md-*) |
| `columnColLg` | string | `""` | Ширина на lg (col-lg-*) |
| `columnColXl` | string | `""` | Ширина на xl (col-xl-*) |
| `columnColXxl` | string | `""` | Ширина на xxl (col-xxl-*) |
| `backgroundType` | string | `"none"` | Тип фона (как в Section) |
| `backgroundColor` | string | `"primary"` | Цвет фона |
| `backgroundColorType` | string | `"solid"` | Тип цвета |
| `backgroundGradient` | string | `"gradient-1"` | Градиент |
| `backgroundImageId` | number | `0` | ID изображения |
| `backgroundImageUrl` | string | `""` | URL изображения |
| `backgroundSize` | string | `""` | background-size |
| `backgroundOverlay` | string | `""` | Оверлей |
| `backgroundPatternUrl` | string | `""` | URL паттерна |
| `backgroundVideoId` | number | `0` | ID видео |
| `backgroundVideoUrl` | string | `""` | URL видео |
| `columnAlignItems` | string | `""` | align-items-* |
| `columnJustifyContent` | string | `""` | justify-content-* |
| `columnTextAlign` | string | `""` | text-* |
| `columnPosition` | string | `""` | position-* |
| `columnClass` | string | `""` | Кастомные классы |
| `columnData` | string | `""` | data-атрибуты |
| `columnId` | string | `""` | HTML ID |
| `spacingType` | string | `"padding"` | Тип отступов |
| `spacingXs`...`spacingXxl` | string | `""` | Отступы по breakpoint-ам |

### Использование

```html
<div class="col-md-6 col-lg-4">
  <!-- InnerBlocks -->
</div>
```

---

## 3. Columns

**Назначение:** Контейнер колонок с настройками row-cols и gap.

| Поле | Значение |
|------|----------|
| **Name** | `codeweber-blocks/columns` |
| **Icon** | `columns` |
| **Supports** | `customClassName`, `anchor` |
| **Файлы** | `src/blocks/columns/` |

### Атрибуты

| Атрибут | Тип | Default | Описание |
|---------|-----|---------|----------|
| `columnsType` | string | `"classic"` | Тип колонок |
| `columnsGutterX` | string | `""` | Горизонтальный gutter |
| `columnsGutterY` | string | `""` | Вертикальный gutter |
| `columnsCount` | number | `2` | Количество колонок |
| `columnsRowCols` | string | `""` | row-cols-* (xs) |
| `columnsRowColsSm`...`columnsRowColsXxl` | string | `""` | row-cols по breakpoint-ам |
| `columnsAlignItems` | string | `""` | align-items-* |
| `columnsJustifyContent` | string | `""` | justify-content-* |
| `columnsTextAlign` | string | `""` | text-* |
| `columnsPosition` | string | `""` | position-* |
| `columnsClass` | string | `""` | Кастомные классы |
| `columnsData` | string | `""` | data-атрибуты |
| `columnsId` | string | `""` | HTML ID |
| `columnsGapType` | string | `"general"` | Тип gap |
| `columnsGapXs`...`columnsGapXxl` | string | `""` | Gap по breakpoint-ам |
| `columnsSpacingType` | string | `"padding"` | Тип отступов |
| `columnsSpacingXs`...`columnsSpacingXxl` | string | `""` | Отступы по breakpoint-ам |

### Использование

```html
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 gx-lg-8 gy-10">
  <!-- Column blocks -->
</div>
```

---

## 4. Button

**Назначение:** Кнопка/ссылка с поддержкой стилей темы, иконок, lightbox, модалок.

| Поле | Значение |
|------|----------|
| **Name** | `codeweber-blocks/button` |
| **Icon** | `button` |
| **Supports** | `customClassName`, `anchor` |
| **Файлы** | `src/blocks/button/` |

### Атрибуты

| Атрибут | Тип | Default | Описание |
|---------|-----|---------|----------|
| `ButtonContent` | string | `"Large Button"` | Текст кнопки |
| `ButtonClass` | string | `"btn btn-lg btn-primary"` | CSS-классы кнопки |
| `ButtonSize` | string | `"btn-sm"` | Размер: `btn-sm`, `btn-lg` |
| `ButtonColor` | string | `"primary"` | Цвет кнопки |
| `ButtonGradientColor` | string | `"gradient gradient-1"` | Градиент |
| `ButtonStyle` | string | `"solid"` | Стиль: `solid`, `outline`, `soft` |
| `ButtonType` | string | `"solid"` | Тип кнопки |
| `ButtonShape` | string | `"rounded-0"` | Форма: `rounded-0`, `rounded`, `rounded-pill` |
| `ButtonIconPosition` | string | `"left"` | Позиция иконки |
| `IconClass` | string | `"uil-angle-right"` | Класс иконки |
| `SocialIconClass` | string | `"facebook"` | Класс соц. иконки |
| `SocialIconStyle` | string | `"style_1"` | Стиль соц. иконки |
| `LeftIcon` | string | `""` | Иконка слева |
| `RightIcon` | string | `""` | Иконка справа |
| `LinkType` | string | `"external"` | Тип ссылки: `external`, `page`, `post`, `anchor`, `phone`, `modal`, `cf7`, `youtube`, `vimeo`, `rutube`, `vk`, `document` |
| `LinkUrl` | string | `"javascript:void(0)"` | URL ссылки |
| `PageId` | string | `""` | ID страницы |
| `PostId` | string | `""` | ID записи |
| `CF7ID` | string | `""` | ID формы Contact Form 7 |
| `ModalID` | string | `""` | ID модального окна |
| `HtmlID` | string | `""` | HTML ID элемента |
| `YoutubeLink` | string | `""` | Ссылка YouTube |
| `VimeoID` | string | `""` | ID Vimeo |
| `RutubeID` | string | `""` | ID Rutube |
| `VKID` | string | `""` | ID VK Video |
| `DocumentID` | string | `""` | ID документа |
| `Anchor` | string | `""` | Якорь |
| `DataValue` | string | `""` | data-value |
| `DataGlightbox` | string | `""` | data-glightbox |
| `DataGlightboxTitle` | string | `""` | Заголовок lightbox |
| `DataGallery` | string | `""` | Галерея lightbox |
| `DataBsToggle` | string | `""` | Bootstrap toggle |
| `DataBsTarget` | string | `""` | Bootstrap target |
| `PhoneType` | string | `"сustom"` | Тип телефона |
| `PhoneNumber` | string | `""` | Номер телефона |
| `LinkColor` | string | `"more"` | Цвет ссылки |
| `HoverType` | string | `"hover"` | Тип hover |
| `LinkTextColor` | string | `""` | Цвет текста ссылки |

### Использование

```html
<!-- Solid кнопка -->
<a href="#" class="btn btn-primary rounded-pill">Click me</a>

<!-- Outline кнопка -->
<a href="#" class="btn btn-outline-primary rounded">Learn More</a>

<!-- Кнопка с иконкой -->
<a href="#" class="btn btn-soft-primary">
  <i class="uil uil-arrow-right"></i> Next
</a>

<!-- Lightbox кнопка -->
<a href="https://youtube.com/watch?v=xxx" class="btn btn-circle btn-primary" data-glightbox>
  <i class="icn-caret-right"></i>
</a>
```

---

## 5. Heading-Subtitle

**Назначение:** Заголовок и подзаголовок с расширенными настройками типографики.

| Поле | Значение |
|------|----------|
| **Name** | `codeweber-gutenberg-blocks/heading-subtitle` |
| **Icon** | `heading` |
| **Supports** | `customClassName`, `anchor` |
| **Файлы** | `src/blocks/heading-subtitle/` |

### Атрибуты

| Атрибут | Тип | Default | Описание |
|---------|-----|---------|----------|
| `enableTitle` | boolean | `true` | Показывать заголовок |
| `enableSubtitle` | boolean | `true` | Показывать подзаголовок |
| `title` | string | `""` | Текст заголовка |
| `subtitle` | string | `""` | Текст подзаголовка |
| `order` | string | `"subtitle-first"` | Порядок: `subtitle-first`, `title-first` |
| `titleTag` | string | `"h1"` | HTML-тег заголовка: `h1`-`h6`, `display-1`-`display-6` |
| `subtitleTag` | string | `"p"` | HTML-тег подзаголовка: `p`, `span`, `h1`-`h6` |
| `titleColor` | string | `""` | Цвет заголовка |
| `titleColorType` | string | `"solid"` | Тип цвета заголовка |
| `subtitleColor` | string | `""` | Цвет подзаголовка |
| `subtitleColorType` | string | `"solid"` | Тип цвета подзаголовка |
| `align` | string | `"left"` | Выравнивание текста |
| `alignItems` | string | `""` | align-items-* |
| `justifyContent` | string | `""` | justify-content-* |
| `position` | string | `""` | position-* |
| `titleSize` | string | `""` | Размер заголовка (fs-*) |
| `subtitleSize` | string | `""` | Размер подзаголовка |
| `titleWeight` | string | `""` | Насыщенность заголовка (fw-*) |
| `subtitleWeight` | string | `""` | Насыщенность подзаголовка |
| `titleTransform` | string | `""` | text-transform заголовка |
| `subtitleTransform` | string | `""` | text-transform подзаголовка |
| `subtitleLine` | boolean | `true` | Линия под подзаголовком |
| `lead` | string | `""` | Класс lead для подзаголовка |
| `titleClass` | string | `""` | Кастомные классы заголовка |
| `titleData` | string | `""` | data-атрибуты заголовка |
| `titleId` | string | `""` | ID заголовка |
| `subtitleClass` | string | `""` | Кастомные классы подзаголовка |
| `subtitleData` | string | `""` | data-атрибуты подзаголовка |
| `subtitleId` | string | `""` | ID подзаголовка |
| `animationEnabled` | boolean | `false` | Включить анимацию |
| `animationType` | string | `""` | Тип анимации |
| `animationDuration` | number | `600` | Длительность анимации (ms) |
| `animationDelay` | number | `0` | Задержка анимации (ms) |
| `spacingType` | string | `"padding"` | Тип отступов |
| `spacingXs`...`spacingXxl` | string | `""` | Отступы по breakpoint-ам |

### Использование

```html
<p class="text-uppercase text-primary text-line mb-2">Our Services</p>
<h2 class="display-4 mb-3">What We Do</h2>
```

---

## 6. Создание нового блока

### 6.1 Шаги

1. **Создать директорию:** `src/blocks/<block-name>/`
2. **Создать `block.json`:** метаданные, атрибуты, supports
3. **Создать `index.js`:** регистрация блока
4. **Создать `edit.js`:** компонент редактора
5. **Создать `save.js`:** компонент сохранения
6. **Создать стили:** `style.scss`, `editor.scss`
7. **Зарегистрировать в PHP:** добавить имя в `Plugin::getBlocksName()`
8. **Добавить в JS-загрузчик:** `src/index.js`
9. **Обновить документацию:** этот файл

### 6.2 Шаблон block.json

```json
{
    "apiVersion": 2,
    "name": "codeweber-blocks/<block-name>",
    "version": "0.1.0",
    "title": "Block Title",
    "category": "codeweber-gutenberg-blocks",
    "icon": "icon-name",
    "description": "Block description.",
    "supports": {
        "html": false,
        "customClassName": true,
        "anchor": true
    },
    "attributes": {
        "exampleAttr": {
            "type": "string",
            "default": ""
        }
    },
    "textdomain": "codeweber-blocks",
    "editorScript": "file:./index.js",
    "editorStyle": "file:./index.css",
    "style": "file:./style-index.css"
}
```

### 6.3 Шаблон index.js

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
    edit: Edit,
    save,
});
```

### 6.4 Чек-лист нового блока

- [ ] `block.json` с корректными атрибутами
- [ ] `index.js` с регистрацией
- [ ] `edit.js` с Inspector Controls
- [ ] `save.js` с выводом HTML
- [ ] Стили используют классы темы (Bootstrap)
- [ ] Локализация через `__()`
- [ ] Добавлен в `Plugin::getBlocksName()`
- [ ] Добавлен в `src/index.js`
- [ ] Документация в этом файле

---

## 7. Для AI-агентов

### 7.1 Быстрый поиск

| Задача | Где искать |
|--------|------------|
| Изменить атрибут блока | `src/blocks/<name>/block.json` |
| Изменить UI редактора | `src/blocks/<name>/edit.js` |
| Изменить HTML-вывод | `src/blocks/<name>/save.js` |
| Добавить панель настроек | `src/components/` → импорт в `edit.js` |
| Изменить классы | `src/utilities/class-generators.js` |
| Изменить палитру цветов | `src/utilities/colors.js` |

### 7.2 Связи между блоками

```
Section
  └── Columns
        └── Column
              └── [любые блоки]
```

### 7.3 Общие атрибуты

Многие блоки используют одинаковые группы атрибутов:

| Группа | Атрибуты | Используется в |
|--------|----------|----------------|
| **Background** | `backgroundType`, `backgroundColor`, `backgroundColorType`, `backgroundGradient`, `backgroundImageId`, `backgroundImageUrl`, `backgroundSize`, `backgroundOverlay`, `backgroundPatternUrl` | Section, Column |
| **Spacing** | `spacingType`, `spacingXs`...`spacingXxl` | Section, Column, Columns, Heading-Subtitle |
| **Positioning** | `*AlignItems`, `*JustifyContent`, `*TextAlign`, `*Position` | Все layout-блоки |
| **Meta** | `*Class`, `*Data`, `*Id` | Все блоки |
| **Angled** | `angledEnabled`, `angledUpper`, `angledLower` | Section |
| **Waves** | `waveTopEnabled`, `waveTopType`, `waveBottomEnabled`, `waveBottomType` | Section |

