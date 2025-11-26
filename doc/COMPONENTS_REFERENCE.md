# COMPONENTS REFERENCE · Shared-компоненты

> Справочник переиспользуемых React-компонентов для Inspector Controls.  
> Эти компоненты используются в `edit.js` блоков для построения панелей настроек.

---

## 0. Общие правила

| Правило | Описание |
|---------|----------|
| **Только для Inspector** | Компоненты предназначены для Sidebar редактора, не для фронта |
| **Gutenberg UI** | Используем `@wordpress/components` (`PanelBody`, `Button`, `SelectControl` и др.) |
| **Локализация** | Все строки через `__()` из `@wordpress/i18n` |
| **Импорт** | `import { ComponentName } from '../../components/<folder>/<ComponentName>'` |

---

## 1. Структура директории

```
src/components/
├── adaptive/
│   └── AdaptiveControl.js       # Адаптивные настройки (breakpoints)
├── animation/
│   └── Animation.js             # Настройки анимации
├── background/
│   └── BackgroundSettingsPanel.js  # Панель настроек фона
├── block-meta/
│   └── BlockMetaFields.js       # Мета-поля блока (class, data, id)
├── colors/
│   └── ColorTypeControl.js      # Выбор типа цвета (solid/soft/pale/gradient)
├── gap/
│   └── GapControl.js            # Настройки gap/gutter
├── heading/
│   ├── HeadingContentControl.js # Контент заголовка
│   └── HeadingTypographyControl.js # Типографика заголовка
├── layout/
│   └── PositioningControl.js    # Позиционирование (align, justify, position)
├── section/
│   ├── ContainerSettingsPanel.js # Настройки контейнера
│   └── SectionSettingsPanel.js  # Настройки секции
└── spacing/
    └── SpacingControl.js        # Настройки отступов (padding/margin)
```

---

## 2. BackgroundSettingsPanel

**Путь:** `src/components/background/BackgroundSettingsPanel.js`

**Назначение:** Панель настроек фона (цвет, изображение, паттерн, видео).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления атрибутов |
| `allowVideo` | boolean | `false` | Разрешить видео-фон |
| `imageSizes` | array | `[]` | Доступные размеры изображений |
| `backgroundImageSize` | string | — | Текущий размер изображения |
| `renderImagePicker` | function | — | Кастомный рендер выбора изображения |
| `renderPatternPicker` | function | — | Кастомный рендер выбора паттерна |
| `imageSizeLabel` | string | `""` | Лейбл размера изображения |
| `patternSizeLabel` | string | `""` | Лейбл размера паттерна |

### Ожидаемые атрибуты

```javascript
{
  backgroundType,        // 'none' | 'color' | 'image' | 'pattern' | 'video'
  backgroundColor,       // string (цвет из палитры)
  backgroundColorType,   // 'solid' | 'soft' | 'pale' | 'gradient'
  backgroundGradient,    // string (градиент)
  backgroundImageId,     // number
  backgroundImageUrl,    // string
  backgroundPatternUrl,  // string
  backgroundSize,        // '' | 'bg-auto' | 'bg-cover' | 'bg-full'
  backgroundOverlay,     // '' | 'bg-overlay' | 'bg-overlay-300' | 'bg-overlay-400'
}
```

### Использование

```javascript
import { BackgroundSettingsPanel } from '../../components/background/BackgroundSettingsPanel';

// В edit.js
<PanelBody title={__('Background', 'codeweber-blocks')}>
  <BackgroundSettingsPanel
    attributes={attributes}
    setAttributes={setAttributes}
    allowVideo={true}
    imageSizes={imageSizes}
    backgroundImageSize={backgroundImageSize}
  />
</PanelBody>
```

---

## 3. ColorTypeControl

**Путь:** `src/components/colors/ColorTypeControl.js`

**Назначение:** Переключатель типа цвета (solid, soft, pale, gradient).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `label` | string | — | Лейбл контрола |
| `value` | string | — | Текущее значение |
| `onChange` | function | — | Callback при изменении |

### Использование

```javascript
import { ColorTypeControl } from '../../components/colors/ColorTypeControl';

<ColorTypeControl
  label={__('Color Type', 'codeweber-blocks')}
  value={backgroundColorType}
  onChange={(value) => setAttributes({ backgroundColorType: value })}
/>
```

---

## 4. SpacingControl

**Путь:** `src/components/spacing/SpacingControl.js`

**Назначение:** Настройки отступов по breakpoint-ам.

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |
| `prefix` | string | `"spacing"` | Префикс атрибутов |

### Ожидаемые атрибуты

```javascript
{
  spacingType,   // 'padding' | 'margin'
  spacingXs,     // string (p-*, m-*, py-*, etc.)
  spacingSm,
  spacingMd,
  spacingLg,
  spacingXl,
  spacingXxl,
}
```

### Использование

```javascript
import { SpacingControl } from '../../components/spacing/SpacingControl';

<PanelBody title={__('Spacing', 'codeweber-blocks')}>
  <SpacingControl
    attributes={attributes}
    setAttributes={setAttributes}
    prefix="spacing"
  />
</PanelBody>
```

---

## 5. PositioningControl

**Путь:** `src/components/layout/PositioningControl.js`

**Назначение:** Настройки позиционирования (align-items, justify-content, text-align, position).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |
| `prefix` | string | — | Префикс атрибутов (`row`, `column`, `container`) |

### Ожидаемые атрибуты

```javascript
{
  [prefix]AlignItems,      // align-items-*
  [prefix]JustifyContent,  // justify-content-*
  [prefix]TextAlign,       // text-*
  [prefix]Position,        // position-*
}
```

### Использование

```javascript
import { PositioningControl } from '../../components/layout/PositioningControl';

<PanelBody title={__('Positioning', 'codeweber-blocks')}>
  <PositioningControl
    attributes={attributes}
    setAttributes={setAttributes}
    prefix="row"
  />
</PanelBody>
```

---

## 6. GapControl

**Путь:** `src/components/gap/GapControl.js`

**Назначение:** Настройки gutter/gap для Row и Columns.

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |
| `prefix` | string | — | Префикс атрибутов (`row`, `columns`) |

### Ожидаемые атрибуты

```javascript
{
  [prefix]GutterX,  // gx-*
  [prefix]GutterY,  // gy-*
  // или для columns:
  [prefix]GapType,  // 'general' | 'responsive'
  [prefix]GapXs,
  [prefix]GapSm,
  [prefix]GapMd,
  [prefix]GapLg,
  [prefix]GapXl,
  [prefix]GapXxl,
}
```

### Использование

```javascript
import { GapControl } from '../../components/gap/GapControl';

<PanelBody title={__('Gap', 'codeweber-blocks')}>
  <GapControl
    attributes={attributes}
    setAttributes={setAttributes}
    prefix="row"
  />
</PanelBody>
```

---

## 7. AdaptiveControl

**Путь:** `src/components/adaptive/AdaptiveControl.js`

**Назначение:** Универсальный контрол для адаптивных настроек по breakpoint-ам.

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `label` | string | — | Лейбл контрола |
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |
| `attrPrefix` | string | — | Префикс атрибутов |
| `options` | array | — | Опции для SelectControl |

### Использование

```javascript
import { AdaptiveControl } from '../../components/adaptive/AdaptiveControl';

<AdaptiveControl
  label={__('Column Width', 'codeweber-blocks')}
  attributes={attributes}
  setAttributes={setAttributes}
  attrPrefix="columnCol"
  options={[
    { label: 'Auto', value: '' },
    { label: '1/12', value: '1' },
    { label: '2/12', value: '2' },
    // ...
    { label: '12/12', value: '12' },
  ]}
/>
```

---

## 8. Animation

**Путь:** `src/components/animation/Animation.js`

**Назначение:** Настройки анимации при появлении элемента.

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |

### Ожидаемые атрибуты

```javascript
{
  animationEnabled,   // boolean
  animationType,      // string (тип анимации)
  animationDuration,  // number (ms)
  animationDelay,     // number (ms)
}
```

### Использование

```javascript
import { Animation } from '../../components/animation/Animation';

<PanelBody title={__('Animation', 'codeweber-blocks')}>
  <Animation
    attributes={attributes}
    setAttributes={setAttributes}
  />
</PanelBody>
```

---

## 9. BlockMetaFields

**Путь:** `src/components/block-meta/BlockMetaFields.js`

**Назначение:** Мета-поля блока (дополнительные классы, data-атрибуты, ID).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |
| `prefix` | string | — | Префикс атрибутов (`section`, `row`, `column`, `title`, `subtitle`) |

### Ожидаемые атрибуты

```javascript
{
  [prefix]Class,  // string (дополнительные CSS-классы)
  [prefix]Data,   // string (data-атрибуты)
  [prefix]Id,     // string (HTML ID)
}
```

### Использование

```javascript
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

<PanelBody title={__('Advanced', 'codeweber-blocks')}>
  <BlockMetaFields
    attributes={attributes}
    setAttributes={setAttributes}
    prefix="section"
  />
</PanelBody>
```

---

## 10. HeadingContentControl

**Путь:** `src/components/heading/HeadingContentControl.js`

**Назначение:** Контент заголовка/подзаголовка (текст, включение/выключение).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |

### Использование

```javascript
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';

<PanelBody title={__('Content', 'codeweber-blocks')}>
  <HeadingContentControl
    attributes={attributes}
    setAttributes={setAttributes}
  />
</PanelBody>
```

---

## 11. HeadingTypographyControl

**Путь:** `src/components/heading/HeadingTypographyControl.js`

**Назначение:** Типографика заголовка/подзаголовка (тег, размер, вес, transform).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |
| `prefix` | string | — | Префикс: `title` или `subtitle` |

### Использование

```javascript
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';

<PanelBody title={__('Title Typography', 'codeweber-blocks')}>
  <HeadingTypographyControl
    attributes={attributes}
    setAttributes={setAttributes}
    prefix="title"
  />
</PanelBody>
```

---

## 12. ContainerSettingsPanel

**Путь:** `src/components/section/ContainerSettingsPanel.js`

**Назначение:** Настройки контейнера секции (тип, классы, позиционирование).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |

### Использование

```javascript
import { ContainerSettingsPanel } from '../../components/section/ContainerSettingsPanel';

<PanelBody title={__('Container', 'codeweber-blocks')}>
  <ContainerSettingsPanel
    attributes={attributes}
    setAttributes={setAttributes}
  />
</PanelBody>
```

---

## 13. SectionSettingsPanel

**Путь:** `src/components/section/SectionSettingsPanel.js`

**Назначение:** Общие настройки секции (frame, overflow, position, minHeight).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |

### Использование

```javascript
import { SectionSettingsPanel } from '../../components/section/SectionSettingsPanel';

<PanelBody title={__('Section Settings', 'codeweber-blocks')}>
  <SectionSettingsPanel
    attributes={attributes}
    setAttributes={setAttributes}
  />
</PanelBody>
```

---

## 14. Создание нового компонента

### 14.1 Шаги

1. **Создать директорию:** `src/components/<component-name>/`
2. **Создать файл:** `<ComponentName>.js`
3. **Экспортировать:** `export const ComponentName = ...` или `export default`
4. **Импортировать в блоках:** `import { ComponentName } from '../../components/<folder>/<ComponentName>'`
5. **Документировать:** добавить раздел в этот файл

### 14.2 Шаблон компонента

```javascript
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

/**
 * MyComponent - описание назначения
 *
 * @param {Object} props
 * @param {Object} props.attributes - Атрибуты блока
 * @param {Function} props.setAttributes - Функция обновления атрибутов
 */
export const MyComponent = ({ attributes, setAttributes }) => {
  const { myAttr } = attributes;

  return (
    <>
      <SelectControl
        label={__('My Option', 'codeweber-blocks')}
        value={myAttr}
        options={[
          { label: __('Option 1', 'codeweber-blocks'), value: 'opt1' },
          { label: __('Option 2', 'codeweber-blocks'), value: 'opt2' },
        ]}
        onChange={(value) => setAttributes({ myAttr: value })}
      />
    </>
  );
};

export default MyComponent;
```

### 14.3 Чек-лист нового компонента

- [ ] Файл в `src/components/<folder>/`
- [ ] Экспорт компонента
- [ ] Локализация всех строк через `__()`
- [ ] JSDoc с описанием props
- [ ] Документация в этом файле
- [ ] Импорт и использование в блоке

---

## 15. Для AI-агентов

### 15.1 Быстрый поиск

| Задача | Компонент |
|--------|-----------|
| Настройки фона | `BackgroundSettingsPanel` |
| Выбор цвета | `ColorTypeControl` + `colors.js` |
| Отступы | `SpacingControl` |
| Позиционирование | `PositioningControl` |
| Gap/Gutter | `GapControl` |
| Анимация | `Animation` |
| Мета-поля | `BlockMetaFields` |
| Типографика | `HeadingTypographyControl` |

### 15.2 Зависимости компонентов

```
BackgroundSettingsPanel
  └── ColorTypeControl
  └── colors.js
  └── gradient_colors.js

HeadingTypographyControl
  └── ColorTypeControl
  └── colors.js
```

### 15.3 Утилиты для компонентов

| Утилита | Путь | Описание |
|---------|------|----------|
| `colors` | `src/utilities/colors.js` | Палитра цветов темы |
| `gradientcolors` | `src/utilities/gradient_colors.js` | Градиенты темы |
| `generateColorClass` | `src/utilities/class-generators.js` | Генерация CSS-класса цвета |
| `generateBackgroundClasses` | `src/utilities/class-generators.js` | Генерация классов фона |
| `font_icon` | `src/utilities/font_icon.js` | Иконки (Unicons) |
| `font_icon_social` | `src/utilities/font_icon_social.js` | Социальные иконки |
| `shapes` | `src/utilities/shapes.js` | SVG-формы |
| `link_type` | `src/utilities/link_type.js` | Типы ссылок |

