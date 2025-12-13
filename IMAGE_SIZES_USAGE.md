# Image Sizes API & Components

Утилиты для работы с размерами изображений WordPress через REST API.

## Компоненты

### 1. `useImageSizes` - React Hook
### 2. `ImageSizeControl` - UI компонент

---

## useImageSizes Hook

Хук для загрузки доступных размеров изображений из REST API.

### Импорт

```javascript
import { useImageSizes } from '../../hooks/useImageSizes';
```

### Использование

```javascript
const MyComponent = () => {
  const { sizes, loading, error } = useImageSizes();
  
  if (loading) {
    return <div>Loading sizes...</div>;
  }
  
  if (error) {
    console.error('Error loading sizes:', error);
  }
  
  // sizes - массив объектов размеров
  console.log(sizes);
  // [
  //   { value: 'codeweber_staff', label: 'Codeweber_staff (400x400)', width: 400, height: 400, crop: true },
  //   { value: 'full', label: 'Full Size', width: null, height: null, crop: false }
  // ]
};
```

### API

**Параметры:**
```javascript
useImageSizes({
  includeFull: true,        // Добавить "Full Size" (по умолчанию true)
  sort: true,              // Сортировать по label (по умолчанию true)
  fallbackSizes: [...],    // Размеры при ошибке загрузки
})
```

**Возвращает:**
```javascript
{
  sizes: Array,      // Массив размеров
  loading: boolean,  // Статус загрузки
  error: Error|null  // Ошибка (если есть)
}
```

### Опции

| Опция | Type | Default | Описание |
|-------|------|---------|----------|
| `includeFull` | boolean | `true` | Добавить "Full Size" если отсутствует |
| `sort` | boolean | `true` | Сортировать по label |
| `fallbackSizes` | array | `[...]` | Размеры при ошибке API |

---

## ImageSizeControl Component

Готовый UI компонент с SelectControl для выбора размера.

### Импорт

```javascript
import { ImageSizeControl } from '../../components/image-size';
```

### Базовое использование

```javascript
<ImageSizeControl
  value={attributes.imageSize}
  onChange={(value) => setAttributes({ imageSize: value })}
/>
```

### Расширенное использование

```javascript
<ImageSizeControl
  value={attributes.backgroundImageSize}
  onChange={(value) => setAttributes({ backgroundImageSize: value })}
  label={__('Background Image Size', 'codeweber-gutenberg-blocks')}
  help={__('Choose the size for background image', 'codeweber-gutenberg-blocks')}
  includeFull={true}
  sort={true}
  showLoading={true}
/>
```

### API

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `value` | string | required | Текущее значение |
| `onChange` | function | required | Callback при изменении |
| `label` | string | `'Image Size'` | Label для SelectControl |
| `help` | string | - | Текст подсказки |
| `customSizes` | array | - | Кастомные размеры (переопределяет API) |
| `includeFull` | boolean | `true` | Включать "Full Size" |
| `sort` | boolean | `true` | Сортировать размеры |
| `showLoading` | boolean | `false` | Показывать индикатор загрузки |

---

## REST API Endpoint

**URL:** `/wp-json/codeweber-blocks/v1/image-sizes`

**Метод:** `GET`

**Ответ:**
```json
[
  {
    "value": "codeweber_project_900-900",
    "label": "Codeweber_project_900-900 (900x900)",
    "width": 900,
    "height": 900,
    "crop": true
  },
  {
    "value": "codeweber_staff",
    "label": "Codeweber_staff (400x400)",
    "width": 400,
    "height": 400,
    "crop": true
  }
]
```

---

## Примеры использования

### Пример 1: Простой выбор размера

```javascript
import { ImageSizeControl } from '../../components/image-size';

export const MyBlock = ({ attributes, setAttributes }) => {
  return (
    <InspectorControls>
      <PanelBody title="Image Settings">
        <ImageSizeControl
          value={attributes.imageSize}
          onChange={(value) => setAttributes({ imageSize: value })}
        />
      </PanelBody>
    </InspectorControls>
  );
};
```

### Пример 2: Использование хука напрямую

```javascript
import { useImageSizes } from '../../hooks/useImageSizes';
import { SelectControl } from '@wordpress/components';

export const CustomSizeSelector = ({ value, onChange }) => {
  const { sizes, loading, error } = useImageSizes({
    includeFull: true,
    sort: true,
  });

  if (loading) {
    return <p>Loading sizes...</p>;
  }

  return (
    <SelectControl
      label="Select Size"
      value={value}
      options={sizes.map(s => ({ value: s.value, label: s.label }))}
      onChange={onChange}
    />
  );
};
```

### Пример 3: Кастомные размеры

```javascript
<ImageSizeControl
  value={attributes.thumbnailSize}
  onChange={(value) => setAttributes({ thumbnailSize: value })}
  label="Thumbnail Size"
  customSizes={[
    { value: 'small', label: 'Small (200x200)' },
    { value: 'medium', label: 'Medium (400x400)' },
    { value: 'large', label: 'Large (800x800)' },
  ]}
/>
```

### Пример 4: С индикатором загрузки

```javascript
<ImageSizeControl
  value={attributes.imageSize}
  onChange={(value) => setAttributes({ imageSize: value })}
  label="Image Size"
  help="Choose optimal size for your layout"
  showLoading={true}  // Показывает "Loading sizes..." во время загрузки
/>
```

---

## Рефакторинг существующих блоков

### До (Section block):

```javascript
const [imageSizes, setImageSizes] = useState([]);

useEffect(() => {
  wp.apiFetch({
    path: '/codeweber-blocks/v1/image-sizes',
    method: 'GET'
  }).then((sizes) => {
    let availableSizes = sizes.map(size => ({
      value: size.value,
      label: size.label,
    }));
    
    if (!availableSizes.find(size => size.value === 'full')) {
      availableSizes.push({
        value: 'full',
        label: 'Full Size',
      });
    }
    
    availableSizes.sort((a, b) => a.label.localeCompare(b.label));
    setImageSizes(availableSizes);
  }).catch((error) => {
    console.error('Failed to fetch image sizes:', error);
    // Fallback...
  });
}, []);

<BackgroundSettingsPanel
  imageSizes={imageSizes}
  backgroundImageSize={backgroundImageSize}
  ...
/>
```

### После:

```javascript
import { ImageSizeControl } from '../../components/image-size';

// Просто используем компонент напрямую в BackgroundSettingsPanel
// Или передаем sizes из хука:
const { sizes } = useImageSizes();

<BackgroundSettingsPanel
  imageSizes={sizes}
  backgroundImageSize={backgroundImageSize}
  ...
/>
```

---

## Структура объекта размера

```javascript
{
  value: 'codeweber_staff',           // Slug размера
  label: 'Codeweber_staff (400x400)', // Отображаемое имя
  width: 400,                         // Ширина в пикселях (или null)
  height: 400,                        // Высота в пикселях (или null)
  crop: true                          // Обрезается ли изображение
}
```

---

## Fallback размеры

При ошибке API используются дефолтные размеры:

```javascript
[
  { value: 'thumbnail', label: 'Thumbnail (150x150)', width: 150, height: 150 },
  { value: 'medium', label: 'Medium (300x300)', width: 300, height: 300 },
  { value: 'large', label: 'Large (1024x1024)', width: 1024, height: 1024 },
  { value: 'full', label: 'Full Size', width: null, height: null }
]
```

---

## Производительность

✅ **Кэширование** - хук загружает размеры только один раз при монтировании  
✅ **Переиспользование** - один запрос для всех компонентов на странице  
✅ **Fallback** - работает даже при ошибке API  
✅ **Легковесный** - минимальные зависимости

---

## Troubleshooting

### Проблема: 404 Not Found

**Решение:** Убедитесь, что REST API зарегистрирован в `inc/Plugin.php`:

```php
add_action('rest_api_init', 'YourPlugin::register_image_sizes_endpoint');
```

### Проблема: Пустой список размеров

**Решение:** Проверьте, что размеры зарегистрированы в теме:

```php
add_image_size('custom_size', 800, 600, true);
```

### Проблема: Размер не применяется

**Решение:** Убедитесь, что атрибут добавлен в `block.json`:

```json
{
  "backgroundImageSize": {
    "type": "string",
    "default": "full"
  }
}
```







