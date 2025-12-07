# GridControl Component

Универсальный компонент для настройки адаптивных Bootstrap сеток с поддержкой `row-cols`, `gap` и `spacing`.

## Особенности

✅ **Адаптивные колонки** - `row-cols-*` для всех breakpoints  
✅ **Адаптивные gap** - `g-*`, `gx-*`, `gy-*` с выбором направления  
✅ **Адаптивные spacing** - `p-*`, `m-*` с выбором типа  
✅ **Гибкая конфигурация** - включайте только нужные секции  
✅ **Переиспользуемый** - работает с любым префиксом атрибутов  
✅ **Совместимость** - использует `ResponsiveControl` под капотом

---

## Установка

```javascript
import { GridControl, getGridClasses } from '../../components/grid-control';
```

---

## Базовое использование

### 1. Добавить атрибуты в block.json

```javascript
import { createGridAttributes } from '../../components/grid-control';

// В block.json:
{
  "attributes": {
    ...createGridAttributes('grid', {
      rowCols: '3',      // Дефолт: 3 колонки
      gapMd: '5',        // Дефолт: gap-md-5
    }),
    // ... другие атрибуты
  }
}
```

Или вручную:

```json
{
  "gridRowCols": { "type": "string", "default": "3" },
  "gridRowColsSm": { "type": "string", "default": "" },
  "gridRowColsMd": { "type": "string", "default": "" },
  "gridRowColsLg": { "type": "string", "default": "" },
  "gridRowColsXl": { "type": "string", "default": "" },
  "gridRowColsXxl": { "type": "string", "default": "" },
  "gridGapType": { "type": "string", "default": "general" },
  "gridGapXs": { "type": "string", "default": "" },
  "gridGapSm": { "type": "string", "default": "" },
  "gridGapMd": { "type": "string", "default": "5" },
  "gridGapLg": { "type": "string", "default": "" },
  "gridGapXl": { "type": "string", "default": "" },
  "gridGapXxl": { "type": "string", "default": "" }
}
```

### 2. Использовать в edit.js

```javascript
import { GridControl } from '../../components/grid-control';

export default function Edit({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <PanelBody title="Layout">
        <GridControl
          attributes={attributes}
          setAttributes={setAttributes}
          attributePrefix="grid"
          showRowCols={true}
          showGap={true}
          showSpacing={false}
        />
      </PanelBody>
    </InspectorControls>
  );
}
```

### 3. Генерировать классы в save.js

```javascript
import { getGridClasses } from '../../components/grid-control';

export default function Save({ attributes }) {
  const containerClasses = getGridClasses(attributes, 'grid');
  
  return (
    <div className={containerClasses}>
      {/* Контент */}
    </div>
  );
}
```

---

## API

### GridControl Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `attributes` | `object` | required | Объект атрибутов блока |
| `setAttributes` | `function` | required | Функция setAttributes |
| `attributePrefix` | `string` | `'grid'` | Префикс атрибутов |
| `showRowCols` | `boolean` | `true` | Показывать настройки колонок |
| `showGap` | `boolean` | `true` | Показывать настройки gap |
| `showSpacing` | `boolean` | `false` | Показывать настройки spacing |
| `rowColsLabel` | `string` | auto | Кастомный label для row-cols |
| `gapLabel` | `string` | auto | Кастомный label для gap |
| `spacingLabel` | `string` | auto | Кастомный label для spacing |

### getGridClasses(attrs, prefix, options)

Генерирует строку CSS классов для grid контейнера.

**Параметры:**
- `attrs` (object) - объект атрибутов
- `prefix` (string) - префикс атрибутов (например, 'grid', 'columns')
- `options` (object) - опции:
  - `includeRow` (boolean) - включать класс 'row' (default: true)
  - `fallbackRowCols` (string) - fallback для row-cols
  - `additionalClasses` (array) - дополнительные классы

**Возвращает:** `string`

**Пример:**
```javascript
getGridClasses(attributes, 'grid')
// => "row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3 g-md-5"

getGridClasses(attributes, 'grid', {
  includeRow: false,
  additionalClasses: ['custom-class']
})
// => "row-cols-2 row-cols-md-3 g-3 custom-class"
```

### createGridAttributes(prefix, defaults)

Создает объект атрибутов для block.json.

**Параметры:**
- `prefix` (string) - префикс атрибутов
- `defaults` (object) - дефолтные значения

**Возвращает:** `object`

---

## Примеры использования

### Пример 1: Простая сетка (только колонки)

```javascript
// В блоке Image Simple
<GridControl
  attributes={attributes}
  setAttributes={setAttributes}
  attributePrefix="grid"
  showRowCols={true}
  showGap={false}
  showSpacing={false}
/>

// Генерация классов:
const classes = getGridClasses(attributes, 'grid');
// => "row row-cols-3 row-cols-md-4"
```

### Пример 2: Сетка с gap (Image Simple)

```javascript
<GridControl
  attributes={attributes}
  setAttributes={setAttributes}
  attributePrefix="grid"
  showRowCols={true}
  showGap={true}
  showSpacing={false}
  rowColsLabel={__('Images Per Row', 'codeweber-gutenberg-blocks')}
  gapLabel={__('Spacing', 'codeweber-gutenberg-blocks')}
/>

// Генерация классов:
const classes = getGridClasses(attributes, 'grid');
// => "row row-cols-3 row-cols-md-4 g-3 g-md-5"
```

### Пример 3: Полная сетка (Columns)

```javascript
<GridControl
  attributes={attributes}
  setAttributes={setAttributes}
  attributePrefix="columns"
  showRowCols={true}
  showGap={true}
  showSpacing={true}
/>

// Генерация классов:
const classes = getGridClasses(attributes, 'columns');
// => "row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3 g-md-5 p-2 p-lg-4"
```

### Пример 4: Кастомная интеграция

```javascript
// Только gap и spacing, без row-cols
<GridControl
  attributes={attributes}
  setAttributes={setAttributes}
  attributePrefix="section"
  showRowCols={false}
  showGap={true}
  showSpacing={true}
/>

// Генерация классов без 'row':
const classes = getGridClasses(attributes, 'section', {
  includeRow: false,
  additionalClasses: ['container']
});
// => "container g-4 p-3"
```

---

## Генерируемые атрибуты

При использовании `attributePrefix="grid"` создаются следующие атрибуты:

### Row Cols (если `showRowCols={true}`):
- `gridRowCols` - базовое количество колонок
- `gridRowColsSm` - для SM breakpoint
- `gridRowColsMd` - для MD breakpoint
- `gridRowColsLg` - для LG breakpoint
- `gridRowColsXl` - для XL breakpoint
- `gridRowColsXxl` - для XXL breakpoint

### Gap (если `showGap={true}`):
- `gridGapType` - тип gap: 'general', 'x', 'y'
- `gridGapXs` - gap для XS
- `gridGapSm` - gap для SM
- `gridGapMd` - gap для MD
- `gridGapLg` - gap для LG
- `gridGapXl` - gap для XL
- `gridGapXxl` - gap для XXL

### Spacing (если `showSpacing={true}`):
- `gridSpacingType` - тип: 'padding', 'margin'
- `gridSpacingXs` - spacing для XS
- `gridSpacingSm` - spacing для SM
- `gridSpacingMd` - spacing для MD
- `gridSpacingLg` - spacing для LG
- `gridSpacingXl` - spacing для XL
- `gridSpacingXxl` - spacing для XXL

---

## Интеграция в существующие блоки

### Columns Block

**До:**
```javascript
// Множество отдельных компонентов
<ResponsiveControl {...createColumnsConfig(...)} />
<GapControl ... />
<SpacingControl ... />
```

**После:**
```javascript
// Один универсальный компонент
<GridControl
  attributes={attributes}
  setAttributes={setAttributes}
  attributePrefix="columns"
  showRowCols={true}
  showGap={true}
  showSpacing={true}
/>
```

### Image Simple Block

**До:**
```javascript
{displayMode === 'grid' && (
  <>
    <SelectControl label="Grid Columns" .../>
    <SelectControl label="Grid Gap X" .../>
    <SelectControl label="Grid Gap Y" .../>
  </>
)}
```

**После:**
```javascript
{displayMode === 'grid' && (
  <GridControl
    attributes={attributes}
    setAttributes={setAttributes}
    attributePrefix="grid"
    showRowCols={true}
    showGap={true}
    showSpacing={false}
  />
)}
```

---

## UI в редакторе

### С showRowCols={true}:
```
┌─── Columns Per Row ───┐
│ [D 3▼] [SM ▼] [MD 4▼] │
│ [LG ▼] [XL ▼] [XXL ▼] │
└────────────────────────┘
```

### С showGap={true}:
```
▼ Gap Settings
  Gap Type: [General (Both) ▼]
  ┌─── Gap Size ───┐
  │ [D 3▼] [XS ▼] [SM ▼] │
  │ [MD 5▼] [LG ▼] [XL ▼] │
  └──────────────────────┘
```

### С showSpacing={true}:
```
▼ Spacing Settings
  Spacing Type: [Padding ▼]
  ┌─── Spacing Size ───┐
  │ [D 2▼] [XS ▼] [SM ▼] │
  │ [MD ▼] [LG 4▼] [XL ▼] │
  └──────────────────────┘
```

---

## Миграция старых блоков

Если у вас есть старые блоки с другой структурой атрибутов:

```javascript
// Создать функцию миграции в edit.js
useEffect(() => {
  const { gridColumns, gridGapX, gridGapY } = attributes;
  
  // Если есть старые атрибуты, но нет новых
  if (gridColumns && !attributes.gridRowCols) {
    setAttributes({
      gridRowCols: gridColumns,
      gridGapType: 'general',
      gridGapMd: gridGapY || '5',
    });
  }
}, []);
```

---

## Производительность

- ✅ **Легковесный** - использует существующий `ResponsiveControl`
- ✅ **Оптимизированный** - генерация классов без лишних вычислений
- ✅ **Кешируемый** - функции helpers чистые и мемоизируемые

---

## Совместимость

- ✅ Bootstrap 5.x
- ✅ WordPress 6.0+
- ✅ Gutenberg API v2/v3
- ✅ React 17+

---

## Troubleshooting

### Проблема: Атрибуты не сохраняются

**Решение:** Убедитесь, что атрибуты добавлены в `block.json`:

```json
{
  "attributes": {
    "gridRowCols": { "type": "string", "default": "" },
    ...
  }
}
```

### Проблема: Классы не генерируются

**Решение:** Проверьте префикс атрибутов:

```javascript
// Префикс должен совпадать:
<GridControl attributePrefix="grid" ... />
getGridClasses(attributes, 'grid')  // ✅

<GridControl attributePrefix="grid" ... />
getGridClasses(attributes, 'columns')  // ❌
```

### Проблема: Gap не применяется

**Решение:** Проверьте, что контейнер имеет класс `row`:

```javascript
getGridClasses(attributes, 'grid', { includeRow: true })  // ✅
```

---

## Расширение

Для добавления кастомных настроек используйте дополнительные классы:

```javascript
const classes = getGridClasses(attributes, 'grid', {
  additionalClasses: [
    'custom-grid',
    attributes.customClass,
    attributes.isFullWidth ? 'w-100' : '',
  ],
});
```


