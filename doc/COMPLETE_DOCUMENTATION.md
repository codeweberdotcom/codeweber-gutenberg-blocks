# Полная документация всех изменений

**Период:** 05 декабря 2024  
**Плагин:** CodeWeber Gutenberg Blocks v0.1.0

---

## 📚 Оглавление

1. [Обзор изменений](#обзор-изменений)
2. [Media Block - Видео интеграция](#media-block---видео-интеграция)
3. [Button Block - Видео в лайтбоксе](#button-block---видео-в-лайтбоксе)
4. [Gallery Block - Новый блок](#gallery-block---новый-блок)
5. [Новые компоненты](#новые-компоненты)
6. [Backend изменения](#backend-изменения)
7. [Frontend изменения](#frontend-изменения)

---

## Обзор изменений

### Основные достижения:

1. ✅ **Автозагрузка постеров** для VK и Rutube видео
2. ✅ **Универсальные компоненты** для видео URL
3. ✅ **Единая архитектура** для Media и Button блоков
4. ✅ **Новый Gallery блок** с массовой загрузкой изображений
5. ✅ **Исправление aspect-ratio** только для видео
6. ✅ **JavaScript фикс** для GLightbox ссылок

### Статистика:

- **Создано файлов:** 11
- **Изменено файлов:** 13
- **Строк кода:** ~1200
- **Строк документации:** ~1500
- **Новых блоков:** 1 (Gallery)
- **Новых компонентов:** 2 (VideoURLControl, videoUrlParsers)

---

## Media Block - Видео интеграция

### Изменённые файлы:

1. **`src/blocks/media/controls/MediaControl.js`**
2. **`src/blocks/media/style.scss`**
3. **`src/blocks/media/editor.scss`**

### Новые возможности:

#### 1. Автозагрузка постеров

**Что сделано:**
- ✅ Постер загружается автоматически при изменении Video Type
- ✅ Постер загружается при изменении Video URL
- ✅ Индикатор "Загрузка постера..." с анимацией
- ✅ Margin-bottom 15px под кнопкой и индикатором

**Код:**
```javascript
useEffect(() => {
    if ((videoType === 'vk' || videoType === 'rutube') && !isLoadingPoster) {
        handleAutoLoadPoster();
    }
}, [videoType, videoVkId, videoRutubeId]);
```

#### 2. Замена на VideoURLControl

**Было:**
```javascript
<TextareaControl
    label="VK Video URL or ID"
    value={videoVkId}
    onChange={(value) => setAttributes({ videoVkId: value })}
/>
```

**Стало:**
```javascript
<VideoURLControl
    videoType="vk"
    value={videoVkId}
    onChange={(value) => setAttributes({ videoVkId: value })}
    autoloadPoster={true}
    onPosterLoad={(posterData) => {
        setAttributes({
            videoPoster: {
                url: posterData.url,
                alt: videoType === 'vk' ? 'VK Video Poster' : 'Rutube Video Poster'
            }
        });
        setIsLoadingPoster(false);
    }}
    enhanceQuality={true}
    forLightbox={false}
/>
```

#### 3. Унификация высоты постеров

**CSS (только для видео!):**
```scss
figure:has(.video-play-btn) a > img {
    aspect-ratio: 16 / 9;
    object-fit: cover;
}
```

**Применяется:**
- ✅ К видео с кнопкой play
- ❌ НЕ к обычным изображениям

---

## Button Block - Видео в лайтбоксе

### Изменённые файлы:

1. **`src/blocks/button/save.js`**
2. **`src/blocks/button/edit.js`**
3. **`src/utilities/link_type.js`**

### Новые возможности:

#### 1. Структура как в Media блоке

**HTML структура:**
```html
<!-- Скрытый iframe -->
<div id="vkvideo-1733456789012-abc123" style="display:none">
    <iframe src="https://vkvideo.ru/video_ext.php?oid=-123&id=456&hd=2&autoplay=1"></iframe>
</div>

<!-- Ссылка на якорь -->
<a href="#vkvideo-1733456789012-abc123" 
   class="btn btn-primary" 
   data-glightbox="width: auto;">
    Button Text
</a>
```

#### 2. Функция generateVideoId

**Код:**
```javascript
const generateVideoId = (linkUrl, linkType) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 11);
    const typePrefix = linkType || 'video';
    return `${typePrefix}-${timestamp}-${randomStr}`;
};
```

#### 3. Интеграция VideoURLControl

**В link_type.js:**
```javascript
<VideoURLControl
    videoType="vk"
    value={VKID}
    onChange={handleVKIDChange}
    multiline={false}
    enhanceQuality={true}
    forLightbox={true}
/>
```

#### 4. Предотвращение клика в редакторе

**edit.js:**
```javascript
const onClickHandler = isEditor ? (e) => {
    e.preventDefault();
    e.stopPropagation();
} : undefined;

data-glightbox={!isEditor && glightboxAttr ? glightboxAttr : undefined}
```

---

## Gallery Block - Новый блок

### Созданные файлы:

1. **`src/blocks/gallery/block.json`**
2. **`src/blocks/gallery/edit.js`**
3. **`src/blocks/gallery/save.js`**
4. **`src/blocks/gallery/index.js`**
5. **`src/blocks/gallery/editor.scss`**
6. **`src/blocks/gallery/style.scss`**

### Функционал:

#### 1. Автоматическая генерация

При создании блока:
- ✅ Создаётся 1 Columns блок
- ✅ В нём 9 Column блоков
- ✅ В каждом Column - Media блок с demo изображением
- ✅ Сетка по умолчанию: 9 колонок (row-cols-md-9)

#### 2. ImageControl - Загрузка изображений

**Возможности:**
- 📤 Массовая загрузка через Media Library
- 📏 Выбор размера из WordPress API
- 🔄 Изменение порядка (Move Up/Down)
- 🗑️ Удаление изображений
- 👁️ Превью с thumbnail

**Процесс загрузки:**
1. Нажать "Add Images"
2. Выбрать несколько изображений в Media Library
3. Изображения автоматически попадают в `images` атрибут
4. `useEffect` создаёт Media блоки для каждого изображения

**Код синхронизации:**
```javascript
useEffect(() => {
    if (images && images.length > 0) {
        const columnBlocks = images.map((image, index) => {
            const mediaBlock = createBlock('codeweber-blocks/media', {
                mediaType: 'image',
                mediaUrl: image.url,
                mediaAlt: image.alt || `Gallery Image ${index + 1}`,
                mediaImageSize: galleryImageSize,
                mediaId: image.id,
                showPlayIcon: false,
                videoLightbox: galleryEnableLightbox,
            });

            return createBlock('codeweber-blocks/column', {}, [mediaBlock]);
        });

        const columnsBlock = createBlock('codeweber-blocks/columns', {
            columnsType: 'columns-grid',
            columnsRowColsMd: columnsRowColsMd,
            // + все другие columnsRowCols*
        }, columnBlocks);

        replaceInnerBlocks(clientId, [columnsBlock], false);
    }
}, [images]);
```

#### 3. GridControl - Адаптивные колонки

**Настройки:**
```javascript
<GridControl
    attributes={attributes}
    setAttributes={setAttributes}
    attributePrefix="columns"
    showRowCols={true}
    showGap={false}
    showSpacing={false}
    rowColsLabel={__('Columns Per Row', 'codeweber-blocks')}
/>
```

**Результат:**
- Все брейкпоинты: XS, SM, MD, LG, XL, XXL
- Значения от 1 до 12 колонок
- Автоматическая адаптивность

#### 4. Синхронизация размера изображения

**Процесс:**
1. ImageControl меняет `imageSize`
2. `useEffect` синхронизирует с `galleryImageSize`
3. Другой `useEffect` обновляет `mediaImageSize` во всех Media блоках

**Код:**
```javascript
// Синхронизация imageSize → galleryImageSize
useEffect(() => {
    if (imageSize && imageSize !== galleryImageSize) {
        setAttributes({ galleryImageSize: imageSize });
    }
}, [imageSize]);

// Синхронизация galleryImageSize → все Media блоки
useEffect(() => {
    // Обновление mediaImageSize во всех media блоках
}, [imageSize, galleryImageSize]);
```

---

## Новые компоненты

### 1. VideoURLControl

**Файл:** `src/components/video-url/VideoURLControl.js`

**Описание:** Универсальный компонент для ввода видео URL с парсингом и автозагрузкой постеров.

**Props:**
```javascript
{
    videoType: 'vk' | 'rutube' | 'youtube' | 'vimeo',
    value: string,
    onChange: function,
    autoloadPoster: boolean,      // Загружать постер автоматически
    onPosterLoad: function,        // Callback с данными постера
    multiline: boolean,            // TextareaControl vs TextControl
    enhanceQuality: boolean,       // Добавить hd=2 для VK
    forLightbox: boolean          // Добавить autoplay=1
}
```

**Используется в:**
- Media Block (MediaControl.js)
- Button Block (link_type.js)

### 2. videoUrlParsers

**Файл:** `src/utilities/videoUrlParsers.js`

**Функции:**
- `parseVKVideoURL(url, forLightbox)` - Парсинг VK URL
- `parseRutubeVideoURL(url, forLightbox)` - Парсинг Rutube URL
- `parseYouTubeVideoURL(url)` - Парсинг YouTube URL
- `parseVimeoVideoURL(url)` - Парсинг Vimeo URL

**Обрабатываемые форматы:**

**VK:**
- iframe код
- Прямая ссылка (vkvideo.ru, vk.com/video)
- Embed URL (video_ext.php)
- ID формат (-123_456)
- Параметры (oid=-123&id=456)

**Rutube:**
- iframe код
- Embed URL (/play/embed/ID)
- Обычная ссылка (/video/ID)
- Чистый ID

---

## Backend изменения

### 1. VideoThumbnailAPI.php

**Изменения:**

1. **Убрана строгая проверка домена VK:**
```php
// Было: только vkvideo.ru и vk.com
// Стало: любые CDN (mycdn.me и др.)
if (!str_contains($thumbnail_url, 'http')) {
    continue; // Пропускаем невалидные URL
}
```

2. **Декодирование HTML entities:**
```php
$thumbnail_url = html_entity_decode($thumbnail_url);
// &amp; → &
```

3. **Логирование для отладки:**
```php
error_log('VK Thumbnail URL: ' . $thumbnail_url);
error_log('VK og:image:width: ' . $width);
error_log('VK og:image:height: ' . $height);
```

### 2. Plugin.php

**Изменения:**

1. **Добавлен Gallery блок:**
```php
return [
    'button',
    // ...
    'gallery',  // Новый!
];
```

2. **Подключение frontend JS:**
```php
add_action('wp_enqueue_scripts', __CLASS__ . '::gutenbergBlocksExternalLibraries');
```

3. **Исправлен путь:**
```php
GUTENBERG_BLOCKS_INC_URL . 'js/pluign.js'  // было plugin.js
```

---

## Frontend изменения

### 1. includes/js/pluign.js

**Новый файл!**

**Функционал:**
- Поиск всех ссылок с `data-glightbox`
- Удаление `target="_blank"` и `rel="noopener"` для iframe/video ссылок
- Логирование исправлений в консоль

**Код:**
```javascript
function fixGLightboxLinks() {
    const glightboxLinks = document.querySelectorAll('a[data-glightbox]');
    
    glightboxLinks.forEach(link => {
        const glightboxAttr = link.getAttribute('data-glightbox');
        
        if (glightboxAttr && glightboxAttr.includes('type: iframe')) {
            link.removeAttribute('target');
            link.removeAttribute('rel');
            console.log('🔧 Fixed GLightbox link:', link.href);
        }
    });
}
```

**Когда запускается:**
- DOMContentLoaded
- window.load (с задержкой 300ms)

---

## Схема работы Gallery Block

### Workflow:

```
1. Пользователь добавляет Gallery Block
   ↓
2. useEffect создаёт demo структуру (9 изображений)
   ↓
3. Пользователь нажимает "Add Images"
   ↓
4. ImageControl открывает Media Library
   ↓
5. Пользователь выбирает изображения (множественный выбор)
   ↓
6. handleSelectImages загружает полные данные через REST API
   ↓
7. setAttributes({ images: [...] })
   ↓
8. useEffect(images) пересоздаёт Column + Media блоки
   ↓
9. replaceInnerBlocks обновляет структуру
   ↓
10. Изображения появляются в галерее
```

### Синхронизация:

```
ImageControl (imageSize) → useEffect → galleryImageSize
                                          ↓
                                    useEffect → всем Media блокам
                                                 ↓
                                            mediaImageSize обновлён
```

---

## Решённые проблемы

### 1. VK постеры с mycdn.me

**Проблема:** VK использует CDN Одноклассников  
**Решение:** Убрана проверка домена

### 2. &amp; в URL

**Проблема:** HTML entities не декодировались  
**Решение:** `html_entity_decode()`

### 3. Rutube /video/ не работал

**Проблема:** Парсер искал только /embed/  
**Решение:** Добавлена поддержка обоих форматов

### 4. target="_blank" у видео-кнопок

**Проблема:** WordPress добавлял автоматически  
**Решение:** JavaScript фикс + скрытый iframe

### 5. Кнопка кликабельна в редакторе

**Проблема:** GLightbox инициализировался  
**Решение:** Условные атрибуты + preventDefault

### 6. aspect-ratio для всех изображений

**Проблема:** Применялся к обычным фото  
**Решение:** Селектор `:has(.video-play-btn)`

### 7. Разные размеры видео постеров

**Проблема:** VK/Rutube давали разные пропорции  
**Решение:** `aspect-ratio: 16/9` + `object-fit: cover`

---

## Примеры использования

### Пример 1: Media Block с VK видео

```javascript
// Шаги:
1. Добавить Media Block
2. Выбрать Video Type → VK Video
3. Вставить URL: https://vkvideo.ru/video-123_456
4. Постер загрузится автоматически
5. На фронтенде: видео открывается в лайтбоксе
```

### Пример 2: Button с Rutube видео

```javascript
// Шаги:
1. Добавить Button Block
2. В Link Type выбрать Rutube
3. Вставить URL: https://rutube.ru/video/ID
4. Настроить стиль кнопки
5. Сохранить
6. На фронтенде: кнопка открывает видео моментально
```

### Пример 3: Gallery с 12 фотографиями

```javascript
// Шаги:
1. Добавить Gallery Block
2. Нажать "Add Images"
3. Выбрать 12 фотографий
4. Выбрать Image Size: Medium
5. Установить Columns: MD = 4, LG = 6
6. Enable Lightbox: ON
7. Сохранить

// Результат:
- Mobile: 1 колонка (автоматически)
- Tablet (MD): 4 колонки
- Desktop (LG): 6 колонок
- Lightbox включен
```

---

## API Reference

### REST Endpoints

#### VK Thumbnail
```
GET /wp-json/gutenberg-blocks/v1/vk-thumbnail?video_id=oid=-123&id=456
```

**Response:**
```json
{
    "thumbnail_url": "https://i.mycdn.me/...",
    "width": 1280,
    "height": 720
}
```

#### Rutube Thumbnail
```
GET /wp-json/gutenberg-blocks/v1/rutube-thumbnail?video_id=VIDEO_ID
```

**Response:**
```json
{
    "thumbnail_url": "https://pic.rutubelist.ru/...",
    "width": 1920,
    "height": 1080
}
```

---

## Файловая структура

### Созданные файлы:

```
wp-content/plugins/codeweber-gutenberg-blocks/
├── src/
│   ├── blocks/
│   │   └── gallery/                    ⭐ НОВЫЙ БЛОК
│   │       ├── block.json
│   │       ├── edit.js
│   │       ├── save.js
│   │       ├── index.js
│   │       ├── editor.scss
│   │       └── style.scss
│   ├── components/
│   │   └── video-url/                  ⭐ НОВЫЙ КОМПОНЕНТ
│   │       └── VideoURLControl.js
│   └── utilities/
│       └── videoUrlParsers.js          ⭐ НОВАЯ УТИЛИТА
├── includes/
│   └── js/
│       └── pluign.js                   ✏️ ОБНОВЛЁН
├── inc/
│   ├── VideoThumbnailAPI.php           ✏️ ОБНОВЛЁН
│   └── Plugin.php                      ✏️ ОБНОВЛЁН
└── doc/
    ├── VIDEO_INTEGRATION.md            📄 НОВАЯ ДОКУМЕНТАЦИЯ
    ├── GALLERY_BLOCK.md                📄 НОВАЯ ДОКУМЕНТАЦИЯ
    ├── GALLERY_QUICK_START.md          📄 НОВАЯ ДОКУМЕНТАЦИЯ
    ├── HOTFIX_ASPECT_RATIO.md          📄 НОВАЯ ДОКУМЕНТАЦИЯ
    ├── COMPLETE_DOCUMENTATION.md       📄 ЭТОТ ФАЙЛ
    └── CHANGELOG.md                    ✏️ ОБНОВЛЁН
```

### Изменённые файлы:

```
src/
├── blocks/
│   ├── media/
│   │   ├── controls/MediaControl.js    ✏️
│   │   ├── style.scss                  ✏️
│   │   └── editor.scss                 ✏️
│   └── button/
│       ├── save.js                     ✏️
│       └── edit.js                     ✏️
├── utilities/
│   └── link_type.js                    ✏️
└── index.js                            ✏️
```

---

## Тестирование

### Чек-лист Media Block:

- [x] VK видео загружается из iframe
- [x] VK видео загружается из URL
- [x] VK постер загружается автоматически
- [x] Rutube видео загружается из /video/ и /embed/
- [x] Rutube постер загружается автоматически
- [x] Индикатор "Загрузка постера..." отображается
- [x] Кнопка Auto-load имеет отступ 15px
- [x] Постеры видео имеют aspect-ratio 16/9
- [x] Обычные изображения сохраняют пропорции
- [x] Видео открывается в лайтбоксе

### Чек-лист Button Block:

- [x] VK кнопка создаёт скрытый iframe
- [x] Rutube кнопка создаёт скрытый iframe
- [x] Ссылка ведёт на #video-xxx
- [x] data-glightbox="width: auto;"
- [x] НЕТ target="_blank" на фронтенде
- [x] Видео открывается мгновенно
- [x] Кнопка не кликабельна в редакторе
- [x] JavaScript фикс работает (консоль показывает "🔧 Fixed")

### Чек-лист Gallery Block:

- [x] Блок появляется в списке
- [x] Создаётся сетка 9 колонок по умолчанию
- [x] Demo изображения загружаются
- [x] Кнопка "Add Images" работает
- [x] Можно выбрать множественные изображения
- [x] ImageSizeControl загружает размеры из WordPress
- [x] Изменение размера применяется ко всем
- [x] GridControl работает (все брейкпоинты)
- [x] Enable Lightbox переключается
- [x] Можно удалять изображения
- [x] Можно менять порядок (Move Up/Down)
- [x] Сохранение работает корректно

---

## Технические детали

### Dependencies:

**WordPress Core:**
- @wordpress/block-editor
- @wordpress/components
- @wordpress/data
- @wordpress/blocks
- @wordpress/i18n
- @wordpress/element

**Hooks:**
- `useBlockProps`
- `useEffect`
- `useSelect`
- `useDispatch`
- `useState`

**Custom Hooks:**
- `useImageSizes` (из components/image-size)

### Browser Support:

- **:has() selector** - Chrome 105+, Firefox 121+, Safari 15.4+
- **aspect-ratio** - Chrome 88+, Firefox 89+, Safari 15+
- **Grid/Flexbox** - Все современные браузеры

---

## Migration Guide

### Обновление существующих постов:

1. **Media блоки** - будут работать автоматически
2. **Button блоки с видео** - ТРЕБУЮТ пересохранения поста
3. **Gallery блоки** - новые, миграция не требуется

### Пересохранение постов:

```
1. Открыть пост в редакторе
2. Нажать "Update"
3. Очистить кеш (Ctrl+F5 на фронтенде)
```

---

## Производительность

### Оптимизации:

- ✅ Lazy loading блоков
- ✅ Кеширование в `useEffect` через dependencies
- ✅ Debounce не требуется (React batch updates)
- ✅ Minimal re-renders

### Рекомендации:

- Используйте Medium размер для галерей
- Оптимизируйте изображения перед загрузкой
- Включайте lazy loading для больших галерей
- Используйте WebP формат когда возможно

---

## Дальнейшие улучшения

### Запланировано:

1. **Gallery Block:**
   - [ ] Drag & Drop для изменения порядка
   - [ ] Фильтры/категории
   - [ ] Анимации hover
   - [ ] Настройка Gap

2. **Video Integration:**
   - [ ] Кеширование постеров (WordPress transients)
   - [ ] Предпросмотр в редакторе
   - [ ] Поддержка TikTok, Twitch

3. **Общее:**
   - [ ] Unit тесты
   - [ ] E2E тесты
   - [ ] Performance профилирование

---

## Troubleshooting

### Постер не загружается

**Проверьте:**
1. Console → ошибки API
2. Network tab → статус запроса
3. Формат URL → попробуйте разные варианты

### Видео не открывается

**Проверьте:**
1. Пересохранён ли пост
2. Консоль → "🔧 Fixed GLightbox link"
3. HTML → нет target="_blank"
4. GLightbox подключен в теме

### Gallery не создаётся

**Проверьте:**
1. Плагин активен
2. `npm run build` выполнен
3. Нет конфликтов с другими плагинами

---

**Последнее обновление:** 05.12.2024  
**Версия:** 0.1.0




