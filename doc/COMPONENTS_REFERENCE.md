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
├── angled/
│   ├── AngledControl.js         # Скошенные разделители (dividers)
│   └── index.js
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
├── spacing/
│   └── SpacingControl.js        # Настройки отступов (padding/margin)
└── waves/
    ├── WavesControl.js          # Волнистые разделители (dividers)
    └── index.js
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

## 14. AngledControl

**Путь:** `src/components/angled/AngledControl.js`

**Назначение:** Управление скошенными разделителями секции (angled dividers).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `angledEnabled` | boolean | — | Включен ли angled divider |
| `angledUpper` | string | — | Верхний угол: `''`, `'upper-start'`, `'upper-end'` |
| `angledLower` | string | — | Нижний угол: `''`, `'lower-start'`, `'lower-end'` |
| `onAngledEnabledChange` | function | — | Callback при переключении |
| `onAngledUpperChange` | function | — | Callback при изменении верхнего угла |
| `onAngledLowerChange` | function | — | Callback при изменении нижнего угла |

### Генерируемые классы

```html
<!-- При angledUpper="upper-start" и angledLower="lower-end" -->
<section class="wrapper angled upper-start lower-end bg-soft-primary">
```

### Использование

```javascript
import { AngledControl } from '../../components/angled/AngledControl';

<PanelBody title={__('Angles', 'codeweber-blocks')}>
  <AngledControl
    angledEnabled={angledEnabled}
    angledUpper={angledUpper}
    angledLower={angledLower}
    onAngledEnabledChange={(value) => setAttributes({ angledEnabled: value })}
    onAngledUpperChange={(value) => setAttributes({ angledUpper: value })}
    onAngledLowerChange={(value) => setAttributes({ angledLower: value })}
  />
</PanelBody>
```

### Документация темы

[Sandbox Dividers](https://sandbox.elemisthemes.com/docs/elements/dividers.html)

---

## 15. WavesControl

**Путь:** `src/components/waves/WavesControl.js`

**Назначение:** Управление волнистыми разделителями секции (wave dividers).

### Props

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `waveTopEnabled` | boolean | — | Включена ли верхняя волна |
| `waveTopType` | string | — | Тип верхней волны: `'wave-1'`...`'wave-5'` |
| `waveBottomEnabled` | boolean | — | Включена ли нижняя волна |
| `waveBottomType` | string | — | Тип нижней волны: `'wave-1'`...`'wave-5'` |
| `onWaveTopEnabledChange` | function | — | Callback при переключении верхней волны |
| `onWaveTopTypeChange` | function | — | Callback при изменении типа верхней волны |
| `onWaveBottomEnabledChange` | function | — | Callback при переключении нижней волны |
| `onWaveBottomTypeChange` | function | — | Callback при изменении типа нижней волны |

### Генерируемая разметка

```html
<section class="wrapper bg-primary">
  <!-- Top wave (rotated 180deg) -->
  <div class="divider text-light divider-top">
    <svg xmlns="..." viewBox="..." style="transform: rotate(180deg)">
      <path fill="currentColor" d="..."/>
    </svg>
  </div>
  
  <div class="container">...</div>
  
  <!-- Bottom wave -->
  <div class="divider text-light">
    <svg xmlns="..." viewBox="...">
      <path fill="currentColor" d="..."/>
    </svg>
  </div>
</section>
```

### Доступные волны

| Тип | Описание |
|-----|----------|
| `wave-1` | Плавная дуга |
| `wave-2` | Выпуклая дуга |
| `wave-3` | Сложная волна с несколькими изгибами |
| `wave-4` | Волнистая линия |
| `wave-5` | Ассиметричная волна |

### Использование

```javascript
import { WavesControl } from '../../components/waves/WavesControl';

<PanelBody title={__('Waves', 'codeweber-blocks')}>
  <WavesControl
    waveTopEnabled={waveTopEnabled}
    waveTopType={waveTopType}
    waveBottomEnabled={waveBottomEnabled}
    waveBottomType={waveBottomType}
    onWaveTopEnabledChange={(value) => setAttributes({ waveTopEnabled: value })}
    onWaveTopTypeChange={(value) => setAttributes({ waveTopType: value })}
    onWaveBottomEnabledChange={(value) => setAttributes({ waveBottomEnabled: value })}
    onWaveBottomTypeChange={(value) => setAttributes({ waveBottomType: value })}
  />
</PanelBody>
```

### Документация темы

[Sandbox Dividers](https://sandbox.elemisthemes.com/docs/elements/dividers.html)

---

## 16. Создание нового компонента

### 16.1 Шаги

1. **Создать директорию:** `src/components/<component-name>/`
2. **Создать файл:** `<ComponentName>.js`
3. **Экспортировать:** `export const ComponentName = ...` или `export default`
4. **Импортировать в блоках:** `import { ComponentName } from '../../components/<folder>/<ComponentName>'`
5. **Документировать:** добавить раздел в этот файл

### 16.2 Шаблон компонента

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

### 16.3 Чек-лист нового компонента

- [ ] Файл в `src/components/<folder>/`
- [ ] Экспорт компонента
- [ ] Локализация всех строк через `__()`
- [ ] JSDoc с описанием props
- [ ] Документация в этом файле
- [ ] Импорт и использование в блоке

---

## 17. IconControl (Icon Picker)

**Путь:** `src/components/icon/`

**Назначение:** Универсальный компонент для выбора и отображения иконок (Font Icons, SVG Icons, кастомные SVG).

### Структура

```
src/components/icon/
├── IconControl.js      # Inspector Control для настроек
├── IconPicker.js       # Модальное окно выбора иконки
├── IconRender.js       # Компонент рендеринга иконки
├── editor.scss         # Стили редактора
└── index.js            # Экспорты
```

### Поддерживаемые типы иконок

| Тип | Описание | Пример |
|-----|----------|--------|
| `font` | Unicons Font Icons (1260+ иконок) | `<i class="uil uil-check"></i>` |
| `svg` | SVG иконки (lineal/solid) | `<img src="..." class="svg-inject icon-svg">` |
| `custom` | Кастомные SVG из Media Library | Загрузка своих SVG |

### SVG стили

| Стиль | Класс | Описание |
|-------|-------|----------|
| `lineal` | `icon-svg` | Контурные иконки |
| `solid` | `icon-svg` | Заполненные иконки |
| `solid-mono` | `icon-svg solid-mono text-{color}` | Одноцветные заполненные |
| `solid-duo` | `icon-svg solid-duo text-{color1}-{color2}` | Двухцветные (градиент) |

### Атрибуты

Используйте функцию `iconAttributes(prefix)` для генерации атрибутов:

```javascript
import { iconAttributes } from '../../components/icon';

// В block.json или registerBlockType
attributes: {
  ...iconAttributes('icon'),  // iconIconType, iconIconName, etc.
  ...iconAttributes('leftIcon'),  // leftIconIconType, etc.
}
```

| Атрибут | Тип | Default | Описание |
|---------|-----|---------|----------|
| `iconType` | string | `'none'` | Тип: `'none'`, `'font'`, `'svg'`, `'custom'` |
| `iconName` | string | `''` | Имя Font иконки (без `uil-`) |
| `svgIcon` | string | `''` | Имя SVG иконки |
| `svgStyle` | string | `'lineal'` | Стиль SVG |
| `iconSize` | string | `'md'` | Размер SVG: `'xs'`-`'xxl'` |
| `iconFontSize` | string | `''` | Размер Font: `'fs-24'`, `'fs-28'`, etc. |
| `iconColor` | string | `''` | Цвет из палитры |
| `iconColor2` | string | `''` | Второй цвет для `solid-duo` |
| `iconClass` | string | `''` | Дополнительные классы (margin) |
| `iconWrapper` | boolean | `false` | Обернуть в `div.icon` |
| `iconWrapperClass` | string | `''` | Классы обёртки |
| `customSvgUrl` | string | `''` | URL кастомного SVG |
| `customSvgId` | number | `null` | ID в Media Library |

### Props IconControl

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `attributes` | object | — | Атрибуты блока |
| `setAttributes` | function | — | Функция обновления |
| `prefix` | string | `''` | Префикс атрибутов |
| `label` | string | `'Иконка'` | Заголовок панели |
| `allowSvg` | boolean | `true` | Разрешить SVG иконки |
| `allowFont` | boolean | `true` | Разрешить Font иконки |
| `allowCustom` | boolean | `true` | Разрешить кастомные SVG |
| `showWrapper` | boolean | `true` | Показать чекбокс обёртки |
| `showMargin` | boolean | `true` | Показать выбор отступа |
| `initialOpen` | boolean | `false` | Панель открыта по умолчанию |

### Использование в edit.js

```javascript
import { InspectorControls } from '@wordpress/block-editor';
import { IconControl, IconRender } from '../../components/icon';

const Edit = ({ attributes, setAttributes }) => {
  const { iconType, iconName, svgIcon, svgStyle, iconSize, iconFontSize, iconColor, iconWrapper } = attributes;

  return (
    <>
      <InspectorControls>
        <IconControl
          attributes={attributes}
          setAttributes={setAttributes}
          prefix=""
          label="Иконка"
        />
      </InspectorControls>

      <div className="my-block">
        <IconRender
          iconType={iconType}
          iconName={iconName}
          svgIcon={svgIcon}
          svgStyle={svgStyle}
          iconSize={iconSize}
          iconFontSize={iconFontSize}
          iconColor={iconColor}
          wrapper={iconWrapper}
        />
        <span>Контент блока</span>
      </div>
    </>
  );
};
```

### Использование в save.js

```javascript
import { IconRenderSave } from '../../components/icon';

const Save = ({ attributes }) => {
  const { iconType, iconName, svgIcon, svgStyle, iconSize, iconFontSize, iconColor, iconWrapper } = attributes;

  return (
    <div className="my-block">
      <IconRenderSave
        iconType={iconType}
        iconName={iconName}
        svgIcon={svgIcon}
        svgStyle={svgStyle}
        iconSize={iconSize}
        iconFontSize={iconFontSize}
        iconColor={iconColor}
        wrapper={iconWrapper}
      />
      <span>Контент блока</span>
    </div>
  );
};
```

### Примеры вывода HTML

**Font Icon:**
```html
<i class="uil uil-check fs-28 text-primary me-4"></i>
```

**Font Icon с обёрткой:**
```html
<div class="icon text-primary fs-28 me-6 mt-n1">
  <i class="uil uil-phone-volume"></i>
</div>
```

**SVG Lineal:**
```html
<img src="/wp-content/themes/codeweber/assets/img/icons/lineal/target.svg" 
     class="svg-inject icon-svg icon-svg-sm text-primary me-4" alt="">
```

**SVG Solid Mono:**
```html
<img src="/wp-content/themes/codeweber/assets/img/icons/solid/lamp.svg" 
     class="svg-inject icon-svg icon-svg-xs solid-mono text-fuchsia" alt="">
```

**SVG Solid Duo:**
```html
<img src="/wp-content/themes/codeweber/assets/img/icons/solid/puzzle.svg" 
     class="svg-inject icon-svg icon-svg-md solid-duo text-grape-fuchsia" alt="">
```

### Документация темы

- [Font Icons (Unicons)](https://sandbox.elemisthemes.com/docs/styleguide/icons-font.html)
- [SVG Icons](https://sandbox.elemisthemes.com/docs/styleguide/icons-svg.html)
- [Features Blocks](https://sandbox.elemisthemes.com/docs/blocks/features.html)

---

## 18. Для AI-агентов

### 18.1 Быстрый поиск

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
| Скошенные разделители | `AngledControl` |
| Волнистые разделители | `WavesControl` |
| **Иконки** | `IconControl` + `IconRender` |

### 18.2 Зависимости компонентов

```
BackgroundSettingsPanel
  └── ColorTypeControl
  └── colors.js
  └── gradient_colors.js

HeadingTypographyControl
  └── ColorTypeControl
  └── colors.js

IconControl
  └── IconPicker
  └── IconRender
  └── font_icon.js
  └── svg_icons.js
  └── icon_sizes.js
```

### 18.3 Утилиты для компонентов

| Утилита | Путь | Описание |
|---------|------|----------|
| `colors` | `src/utilities/colors.js` | Палитра цветов темы |
| `gradientcolors` | `src/utilities/gradient_colors.js` | Градиенты темы |
| `generateColorClass` | `src/utilities/class-generators.js` | Генерация CSS-класса цвета |
| `generateBackgroundClasses` | `src/utilities/class-generators.js` | Генерация классов фона |
| `font_icon` | `src/utilities/font_icon.js` | Иконки (Unicons) |
| `font_icon_social` | `src/utilities/font_icon_social.js` | Социальные иконки |
| `svg_icons` | `src/utilities/svg_icons.js` | SVG иконки (lineal/solid) |
| `icon_sizes` | `src/utilities/icon_sizes.js` | Размеры и цвета иконок |
| `shapes` | `src/utilities/shapes.js` | SVG-формы |
| `link_type` | `src/utilities/link_type.js` | Типы ссылок |

