# ResponsiveControl Component

Универсальный компонент для создания адаптивных настроек с breakpoints.

## Особенности

✅ Два варианта UI: `dropdown` и `select`  
✅ Поддержка всех Bootstrap breakpoints (XS, SM, MD, LG, XL, XXL)  
✅ Гибкая конфигурация опций  
✅ Встроенные пресеты для популярных случаев  
✅ Tooltip подсказки  
✅ Единообразный стиль

---

## Варианты UI

### 1. Dropdown (кнопки с выпадающими списками)
Используется в **Image Simple** для Items Per View

```jsx
<ResponsiveControl
  label="Items Per View"
  variant="dropdown"
  breakpoints={breakpoints}
  onChange={onChange}
/>
```

### 2. Select (выпадающие списки)
Используется в **Columns** для адаптивных колонок

```jsx
<ResponsiveControl
  label="Columns"
  variant="select"
  breakpoints={breakpoints}
  onChange={onChange}
/>
```

---

## Базовое использование

### Вариант 1: Ручная конфигурация

```jsx
import { ResponsiveControl } from '../../components/responsive-control';

<ResponsiveControl
  label={__('Items Per View', 'codeweber-gutenberg-blocks')}
  variant="dropdown"
  breakpoints={[
    {
      key: 'default',
      label: 'D',
      value: swiperItems,
      attribute: 'swiperItems',
      options: ['1', '2', '3', '4', '5', '6'],
      defaultLabel: null,
    },
    {
      key: 'xs',
      label: 'XS',
      value: swiperItemsXs,
      attribute: 'swiperItemsXs',
      options: ['', '1', '2', '3', '4'],
      defaultLabel: 'Auto',
    },
    // ... другие breakpoints
  ]}
  onChange={(attribute, value) => setAttributes({ [attribute]: value })}
  tooltip={__('Set items per breakpoint', 'codeweber-gutenberg-blocks')}
/>
```

### Вариант 2: Использование хелпера

```jsx
import { ResponsiveControl, createBreakpointsConfig } from '../../components/responsive-control';

<ResponsiveControl
  {...createBreakpointsConfig({
    type: 'items',
    attributes: attributes,
    attributePrefix: 'swiperItems',
    onChange: setAttributes,
    variant: 'dropdown',
  })}
/>
```

### Вариант 3: Использование пресета

```jsx
import { ResponsiveControl, createSwiperItemsConfig } from '../../components/responsive-control';

<ResponsiveControl
  {...createSwiperItemsConfig(attributes, setAttributes)}
/>
```

---

## API

### ResponsiveControl Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Заголовок контрола |
| `breakpoints` | `array` | required | Массив breakpoints |
| `variant` | `string` | `'dropdown'` | `'dropdown'` или `'select'` |
| `onChange` | `function` | required | Callback для изменений |
| `tooltip` | `string` | - | Текст подсказки |
| `showLabels` | `boolean` | `true` | Показывать ли лейблы (для select) |

### Breakpoint Object

```javascript
{
  key: 'xs',              // Уникальный ключ
  label: 'XS',            // Подпись (короткая для dropdown, полная для select)
  value: '2',             // Текущее значение
  attribute: 'swiperItemsXs', // Имя атрибута
  options: ['', '1', '2', '3'], // Массив опций
  defaultLabel: 'Auto',   // Подпись для пустого значения
}
```

### createBreakpointsConfig Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `string` | `'items'` | `'items'`, `'columns'`, или `'custom'` |
| `attributes` | `object` | required | Объект атрибутов блока |
| `attributePrefix` | `string` | required | Префикс атрибутов |
| `onChange` | `function` | required | setAttributes |
| `variant` | `string` | `'dropdown'` | `'dropdown'` или `'select'` |
| `label` | `string` | auto | Заголовок |
| `tooltip` | `string` | - | Подсказка |
| `defaults` | `object` | `{}` | Дефолтные значения |
| `customOptions` | `object` | `{}` | Кастомные опции |

---

## Примеры использования

### 1. Swiper Items Per View (Image Simple)

```jsx
import { ResponsiveControl, createSwiperItemsConfig } from '../../components/responsive-control';

// В компоненте:
<ResponsiveControl
  {...createSwiperItemsConfig(attributes, setAttributes)}
/>
```

### 2. Columns Row Cols (Columns Block)

```jsx
import { ResponsiveControl, createColumnsConfig } from '../../components/responsive-control';

// В компоненте:
<ResponsiveControl
  {...createColumnsConfig(attributes, setAttributes, 'select')}
/>
```

### 3. Кастомная конфигурация

```jsx
import { ResponsiveControl, createBreakpointsConfig } from '../../components/responsive-control';

<ResponsiveControl
  {...createBreakpointsConfig({
    type: 'custom',
    attributes: attributes,
    attributePrefix: 'myCustom',
    onChange: setAttributes,
    variant: 'dropdown',
    label: __('Custom Settings', 'codeweber-gutenberg-blocks'),
    tooltip: __('Custom breakpoint settings', 'codeweber-gutenberg-blocks'),
    customOptions: {
      default: ['option1', 'option2', 'option3'],
      xs: ['', 'option1', 'option2'],
      md: ['', 'option1', 'option2', 'option3'],
    },
  })}
/>
```

### 4. Полностью ручная конфигурация

```jsx
import { ResponsiveControl } from '../../components/responsive-control';

<ResponsiveControl
  label={__('Gap Size', 'codeweber-gutenberg-blocks')}
  variant="select"
  breakpoints={[
    {
      key: 'default',
      label: __('Gap (base)', 'codeweber-gutenberg-blocks'),
      value: attributes.gapDefault,
      attribute: 'gapDefault',
      options: [
        { value: '0', label: __('None', 'codeweber-gutenberg-blocks') },
        { value: '1', label: __('Small', 'codeweber-gutenberg-blocks') },
        { value: '3', label: __('Medium', 'codeweber-gutenberg-blocks') },
        { value: '5', label: __('Large', 'codeweber-gutenberg-blocks') },
      ],
    },
    {
      key: 'md',
      label: __('Gap MD (≥768px)', 'codeweber-gutenberg-blocks'),
      value: attributes.gapMd,
      attribute: 'gapMd',
      options: [
        { value: '', label: __('Inherit', 'codeweber-gutenberg-blocks') },
        { value: '0', label: __('None', 'codeweber-gutenberg-blocks') },
        { value: '1', label: __('Small', 'codeweber-gutenberg-blocks') },
        { value: '3', label: __('Medium', 'codeweber-gutenberg-blocks') },
        { value: '5', label: __('Large', 'codeweber-gutenberg-blocks') },
      ],
    },
  ]}
  onChange={(attribute, value) => setAttributes({ [attribute]: value })}
  tooltip={__('Responsive gap settings', 'codeweber-gutenberg-blocks')}
/>
```

---

## Структура атрибутов

Компонент работает с атрибутами в формате:

```javascript
{
  // Для prefix = 'swiperItems':
  swiperItems: '3',      // default
  swiperItemsXs: '1',    // xs
  swiperItemsSm: '',     // sm (пусто = Auto)
  swiperItemsMd: '2',    // md
  swiperItemsLg: '',     // lg (пусто = Auto)
  swiperItemsXl: '3',    // xl
  swiperItemsXxl: '',    // xxl (пусто = Auto)
}
```

Убедитесь, что в `block.json` есть соответствующие атрибуты:

```json
{
  "swiperItems": {
    "type": "string",
    "default": "3"
  },
  "swiperItemsXs": {
    "type": "string",
    "default": "1"
  }
  // ... и т.д.
}
```

---

## Пресеты опций

### Items (для слайдеров)
```javascript
default: ['1', '2', '3', '4', '5', '6']
xs: ['', '1', '2', '3', '4']
sm: ['', '1', '2', '3', '4']
md: ['', '1', '2', '3', '4', '5']
lg: ['', '1', '2', '3', '4', '5', '6']
xl: ['', '1', '2', '3', '4', '5', '6']
xxl: ['', '1', '2', '3', '4', '5', '6']
```

### Columns (для сеток)
```javascript
[
  { value: '', label: 'Default' },
  { value: 'auto', label: 'Auto' },
  { value: '1', label: '1 column' },
  { value: '2', label: '2 columns' },
  { value: '3', label: '3 columns' },
  { value: '4', label: '4 columns' },
  { value: '5', label: '5 columns' },
  { value: '6', label: '6 columns' },
]
```

---

## Migration Guide

### Из ItemsPerViewTabs (Image Simple)

**БЫЛО:**
```jsx
const ItemsPerViewTabs = () => {
  const breakpoints = [
    { key: 'D', label: 'D', value: swiperItems, onChange: ..., options: [...] },
    // ...
  ];
  return (/* JSX */);
};

<ItemsPerViewTabs />
```

**СТАЛО:**
```jsx
import { ResponsiveControl, createSwiperItemsConfig } from '../../components/responsive-control';

<ResponsiveControl
  {...createSwiperItemsConfig(attributes, setAttributes)}
/>
```

### Из RowColsSelect (Columns)

**БЫЛО:**
```jsx
<RowColsSelect label="Columns (base)" value={columnsRowCols} onChange={...} />
<RowColsSelect label="Columns SM" value={columnsRowColsSm} onChange={...} />
// ... для каждого breakpoint
```

**СТАЛО:**
```jsx
import { ResponsiveControl, createColumnsConfig } from '../../components/responsive-control';

<ResponsiveControl
  {...createColumnsConfig(attributes, setAttributes, 'select')}
/>
```

---

## Расширение

Для добавления новых типов настроек:

1. Добавьте пресет в `helpers.js` в `PRESET_OPTIONS`
2. Создайте хелпер-функцию (по аналогии с `createSwiperItemsConfig`)
3. Экспортируйте из `index.js`

---

## Стилизация

Компонент использует inline стили для максимальной совместимости. Для кастомизации можно обернуть в `div` с классом:

```jsx
<div className="my-custom-responsive-control">
  <ResponsiveControl {...props} />
</div>
```

