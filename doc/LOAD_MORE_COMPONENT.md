# Load More Component

Универсальный компонент для AJAX-подгрузки элементов с кнопкой "Показать еще".

## Описание

Компонент `LoadMoreControl` предоставляет настройки для управления AJAX-подгрузкой контента:
- Количество элементов, отображаемых изначально
- Включение/отключение кнопки "Показать еще"
- Текст кнопки
- Количество элементов, загружаемых при клике

После загрузки новых элементов автоматически вызывается `theme.init()` для переинициализации всех компонентов темы.

## Использование в блоке

### 1. Импорт компонента

```javascript
import { LoadMoreControl } from '../../components/load-more';
```

### 2. Добавление атрибутов в block.json

```json
{
  "attributes": {
    "loadMoreEnable": {
      "type": "boolean",
      "default": false
    },
    "loadMoreInitialCount": {
      "type": "number",
      "default": 6
    },
    "loadMoreLoadMoreCount": {
      "type": "number",
      "default": 6
    },
    "loadMoreText": {
      "type": "string",
      "default": "Показать еще"
    }
  }
}
```

### 3. Использование в редакторе (edit.js)

```javascript
import { LoadMoreControl } from '../../components/load-more';

export default function Edit({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <PanelBody title={__('Load More', 'codeweber-gutenberg-blocks')}>
        <LoadMoreControl 
          attributes={attributes} 
          setAttributes={setAttributes}
          attributePrefix="loadMore"
        />
      </PanelBody>
    </InspectorControls>
  );
}
```

### 4. Использование на фронтенде (save.js)

```javascript
export default function save({ attributes }) {
  const {
    loadMoreEnable,
    loadMoreInitialCount,
    loadMoreLoadMoreCount,
    loadMoreText,
  } = attributes;
  
  // Ограничиваем количество элементов для начального отображения
  const initialItems = items.slice(0, loadMoreInitialCount);
  const remainingItems = items.slice(loadMoreInitialCount);
  
  return (
    <div 
      className="cwgb-load-more-container"
      data-block-id={clientId}
      data-current-offset={loadMoreInitialCount}
      data-load-count={loadMoreLoadMoreCount}
      data-post-id={postId}
    >
      <div className="cwgb-load-more-items">
        {initialItems.map((item, index) => (
          <ItemComponent key={index} item={item} />
        ))}
      </div>
      
      {loadMoreEnable && remainingItems.length > 0 && (
        <button 
          className="btn btn-primary cwgb-load-more-btn"
          data-loading-text="Загрузка..."
        >
          {loadMoreText}
        </button>
      )}
    </div>
  );
}
```

## Структура HTML

Компонент ожидает следующую структуру HTML на фронтенде:

```html
<div 
  class="cwgb-load-more-container"
  data-block-id="block-id"
  data-current-offset="6"
  data-load-count="6"
  data-post-id="123"
>
  <div class="cwgb-load-more-items">
    <!-- Начальные элементы -->
  </div>
  
  <button class="btn btn-primary cwgb-load-more-btn" data-loading-text="Загрузка...">
    Показать еще
  </button>
</div>
```

## REST API Endpoint

Компонент использует REST API endpoint:

```
POST /wp-json/codeweber-gutenberg-blocks/v1/load-more
```

### Параметры запроса:

- `block_id` (string, required) - ID блока
- `offset` (integer, required) - Смещение для загрузки
- `count` (integer, required) - Количество элементов для загрузки
- `post_id` (integer, optional) - ID поста

### Ответ:

```json
{
  "success": true,
  "data": {
    "html": "<div>...</div>",
    "has_more": true,
    "offset": 12
  }
}
```

## Переинициализация theme.init()

После успешной загрузки новых элементов автоматически вызывается `theme.init()` для переинициализации всех компонентов темы:

- Isotope
- Image Hover Overlay
- Swiper Slider
- Tooltips
- Popovers
- Modals
- Lightbox
- И другие компоненты

## Кастомизация LoadMoreAPI

Для кастомизации логики загрузки элементов отредактируйте файл `inc/LoadMoreAPI.php`:

```php
public function load_more_items($request) {
    $block_id = $request->get_param('block_id');
    $offset = $request->get_param('offset');
    $count = $request->get_param('count');
    
    // Ваша логика загрузки элементов
    // Например, загрузка постов, изображений и т.д.
    
    $html = ''; // HTML новых элементов
    $has_more = false; // Есть ли еще элементы
    
    return [
        'success' => true,
        'data' => [
            'html' => $html,
            'has_more' => $has_more,
            'offset' => $offset + $count
        ]
    ];
}
```

## Примеры использования

### Пример 1: Загрузка постов

```php
public function load_more_items($request) {
    $offset = $request->get_param('offset');
    $count = $request->get_param('count');
    
    $posts = get_posts([
        'posts_per_page' => $count,
        'offset' => $offset,
        'post_type' => 'post',
    ]);
    
    $html = '';
    foreach ($posts as $post) {
        $html .= '<article>' . $post->post_title . '</article>';
    }
    
    $has_more = count($posts) === $count;
    
    return [
        'success' => true,
        'data' => [
            'html' => $html,
            'has_more' => $has_more,
            'offset' => $offset + $count
        ]
    ];
}
```

### Пример 2: Загрузка изображений из галереи

```php
public function load_more_items($request) {
    $block_id = $request->get_param('block_id');
    $offset = $request->get_param('offset');
    $count = $request->get_param('count');
    
    // Получаем изображения из атрибутов блока
    $block = parse_blocks(get_the_content())[$block_id];
    $images = $block['attrs']['images'] ?? [];
    
    $items = array_slice($images, $offset, $count);
    
    $html = '';
    foreach ($items as $image) {
        $html .= '<figure><img src="' . $image['url'] . '" alt="' . $image['alt'] . '"></figure>';
    }
    
    $has_more = ($offset + $count) < count($images);
    
    return [
        'success' => true,
        'data' => [
            'html' => $html,
            'has_more' => $has_more,
            'offset' => $offset + $count
        ]
    ];
}
```






