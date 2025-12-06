# Документация: Интеграция видео VK/Rutube в блоки Media и Button

**Дата:** 05 декабря 2024  
**Версия плагина:** 0.1.0

---

## 📋 Содержание

1. [Обзор изменений](#обзор-изменений)
2. [Новые компоненты и утилиты](#новые-компоненты-и-утилиты)
3. [Изменённые файлы](#изменённые-файлы)
4. [API и функции](#api-и-функции)
5. [Решённые проблемы](#решённые-проблемы)
6. [Примеры использования](#примеры-использования)

---

## Обзор изменений

### Основные улучшения

1. **Автоматическая загрузка постеров** при изменении типа видео в Media блоке
2. **Универсальный компонент** `VideoURLControl` для ввода видео URL
3. **Централизованные парсеры** URL для всех видео-платформ
4. **Единообразная работа** Media и Button блоков с видео
5. **Фикс проблемы** с `target="_blank"` у GLightbox ссылок

### Затронутые блоки

- **Media Block** (`codeweber-blocks/media`)
- **Button Block** (`codeweber-blocks/button`)

### Поддерживаемые платформы

- ✅ **VK Video** (vkvideo.ru)
- ✅ **Rutube** (rutube.ru)
- ✅ **YouTube** (youtube.com)
- ✅ **Vimeo** (vimeo.com)

---

## Новые компоненты и утилиты

### 1. `VideoURLControl` Component

**Путь:** `src/components/video-url/VideoURLControl.js`

**Описание:** Переиспользуемый React компонент для ввода URL видео с опциональной автозагрузкой постера.

**Props:**

| Prop | Тип | Обязательный | По умолчанию | Описание |
|------|-----|--------------|--------------|----------|
| `videoType` | `string` | Да | - | Тип видео: 'vk', 'rutube', 'youtube', 'vimeo' |
| `value` | `string` | Да | - | Текущее значение URL |
| `onChange` | `function` | Да | - | Callback при изменении URL |
| `autoloadPoster` | `boolean` | Нет | `false` | Включить автозагрузку постера |
| `onPosterLoad` | `function` | Нет | - | Callback с данными постера `{url, width, height}` |
| `multiline` | `boolean` | Нет | `false` | Многострочный ввод (TextareaControl) |
| `enhanceQuality` | `boolean` | Нет | `false` | Добавить параметры качества (hd=2 для VK) |
| `forLightbox` | `boolean` | Нет | `false` | Добавить autoplay=1 для лайтбокса |

**Пример использования:**

```jsx
import VideoURLControl from '../../components/video-url/VideoURLControl';

<VideoURLControl
    videoType="vk"
    value={videoVkId}
    onChange={(value) => setAttributes({ videoVkId: value })}
    autoloadPoster={true}
    onPosterLoad={(posterData) => {
        setAttributes({
            videoPoster: {
                url: posterData.url,
                alt: 'Video poster'
            }
        });
    }}
    enhanceQuality={true}
    forLightbox={true}
/>
```

---

### 2. `videoUrlParsers.js` Utilities

**Путь:** `src/utilities/videoUrlParsers.js`

**Описание:** Централизованные функции для парсинга URL видео с различных платформ.

#### Функции:

##### `parseVKVideoURL(url, forLightbox = false)`

Парсит VK Video URL и возвращает embed URL.

**Параметры:**
- `url` (string) - URL или iframe код VK Video
- `forLightbox` (boolean) - Добавить параметры для лайтбокса

**Возвращает:** `string` - Embed URL

**Обрабатывает форматы:**
- iframe код: `<iframe src="..."></iframe>`
- Прямая ссылка: `https://vkvideo.ru/video-123456_789012`
- Embed URL: `https://vkvideo.ru/video_ext.php?oid=-123&id=456`
- ID формат: `-123456_789012`
- Параметры: `oid=-123&id=456`

**Добавляемые параметры (forLightbox=true):**
- `autoplay=1` - автоплей
- `hd=2` - HD качество
- `allowFullscreen=true` - полный экран
- `fullscreen=true` - полноэкранный режим

**Пример:**

```javascript
import { parseVKVideoURL } from '../utilities/videoUrlParsers';

const embedUrl = parseVKVideoURL(
    'https://vkvideo.ru/video-82217805_456243357',
    true
);
// Результат: 'https://vkvideo.ru/video_ext.php?oid=-82217805&id=456243357&hd=2&autoplay=1&allowFullscreen=true&fullscreen=true'
```

##### `parseRutubeVideoURL(url, forLightbox = false)`

Парсит Rutube URL и возвращает embed URL.

**Параметры:**
- `url` (string) - URL или iframe код Rutube
- `forLightbox` (boolean) - Добавить autoplay=1

**Возвращает:** `string` - Embed URL

**Обрабатывает форматы:**
- iframe код: `<iframe src="..."></iframe>`
- Embed URL: `https://rutube.ru/play/embed/VIDEO_ID`
- Обычная ссылка: `https://rutube.ru/video/VIDEO_ID`
- ID: `VIDEO_ID`

**Пример:**

```javascript
import { parseRutubeVideoURL } from '../utilities/videoUrlParsers';

const embedUrl = parseRutubeVideoURL(
    'https://rutube.ru/video/699bbd7d7cd0e8f5292ce8bdc5bf3264',
    true
);
// Результат: 'https://rutube.ru/play/embed/699bbd7d7cd0e8f5292ce8bdc5bf3264?autoplay=1'
```

##### `parseYouTubeVideoURL(url)`

Извлекает YouTube video ID.

**Обрабатывает форматы:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

##### `parseVimeoVideoURL(url)`

Извлекает Vimeo video ID.

**Обрабатывает форматы:**
- `https://vimeo.com/VIDEO_ID`
- `https://player.vimeo.com/video/VIDEO_ID`

---

## Изменённые файлы

### Media Block

#### 1. `src/blocks/media/controls/MediaControl.js`

**Изменения:**

- ✅ Заменён `TextareaControl` на `VideoURLControl` для VK и Rutube
- ✅ Добавлен автоматический вызов загрузки постера при изменении `videoType`
- ✅ Добавлен индикатор "Загрузка постера..." с анимацией
- ✅ Margin-bottom 15px для кнопки "Auto-load Poster" и индикатора
- ✅ Удалены старые функции `handleVKIDChange` и `handleRutubeIDChange`
- ✅ Использование `videoUrlParsers.js` для парсинга URL

**Ключевые изменения:**

```javascript
// Автозагрузка постера при изменении типа видео
useEffect(() => {
    if ((videoType === 'vk' || videoType === 'rutube') && 
        !isLoadingPoster) {
        handleAutoLoadPoster();
    }
}, [videoType, videoVkId, videoRutubeId]);

// Индикатор загрузки
{isLoadingPoster && (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '15px'
    }}>
        <span className="spinner" />
        <span>Загрузка постера...</span>
    </div>
)}
```

#### 2. `src/blocks/media/style.scss`

**Изменения:**

- ✅ Добавлен `aspect-ratio: 16/9` **только для постеров видео**
- ✅ Унификация высоты всех постеров видео
- ✅ Использован селектор `:has(.video-play-btn)` для применения только к видео

```scss
figure {
    // Применяется ТОЛЬКО к видео (когда есть кнопка play)
    &:has(.video-play-btn) a > img {
        width: 100%;
        height: auto;
        object-fit: cover;
        aspect-ratio: 16 / 9; // Стандартное соотношение для видео
        display: block;
    }
}
```

**Важно:** Стили НЕ применяются к обычным изображениям (тип "Image" в Media блоке).

#### 3. `src/blocks/media/editor.scss`

**Изменения:**

- ✅ Добавлена CSS анимация спиннера

```scss
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.spinner {
    animation: spin 1s linear infinite;
    // ...
}
```

---

### Button Block

#### 1. `src/blocks/button/save.js`

**Изменения:**

- ✅ Добавлена функция `generateVideoId()` для генерации уникальных ID
- ✅ Логика создания скрытого `<div>` с iframe для видео
- ✅ Изменение `href` на якорную ссылку `#video-xxx` для видео
- ✅ Изменение `data-glightbox` на `"width: auto;"` для видео
- ✅ Полный контроль над атрибутами (без `useBlockProps.save()` на `<a>`)
- ✅ Убран `target="_blank"` для GLightbox/видео ссылок

**Структура вывода для видео:**

```jsx
// Скрытый iframe
<div id="vkvideo-1234567890-abc123" style={{ display: 'none' }}>
    <iframe
        src="https://vkvideo.ru/video_ext.php?..."
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write;"
        frameBorder="0"
        allowFullScreen
        style={{ width: '100%', height: '100%', aspectRatio: '16/9' }}
    />
</div>

// Ссылка на якорь
<a 
    href="#vkvideo-1234567890-abc123" 
    className="btn ..." 
    data-glightbox="width: auto;"
>
    Button Content
</a>
```

**Логика определения видео:**

```javascript
const isVideoLink = LinkType === 'vkvideo' || LinkType === 'rutube' || 
                    LinkType === 'youtube' || LinkType === 'vimeo' ||
                    (hasGlightbox && DataGlightbox.includes('type: iframe'));
```

#### 2. `src/blocks/button/edit.js`

**Изменения:**

- ✅ Убран `data-glightbox` в редакторе (только на фронтенде)
- ✅ Добавлен `event.stopPropagation()` для предотвращения клика в редакторе
- ✅ `href="#"` в редакторе для видео-кнопок

---

### Utilities

#### `src/utilities/link_type.js`

**Изменения:**

- ✅ Интеграция `VideoURLControl` для YouTube, Vimeo, Rutube, VK
- ✅ Обновлён `handleLinkTypeChange` для правильной установки `DataGlightbox`
- ✅ Упрощены `handleRutubeIDChange` и `handleVKIDChange` с использованием парсеров

**Пример для VK:**

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

---

### Backend (PHP)

#### 1. `inc/VideoThumbnailAPI.php`

**Изменения:**

- ✅ Убрана строгая проверка домена для VK постеров (разрешены CDN вроде `mycdn.me`)
- ✅ Добавлен `html_entity_decode()` для корректной обработки `&amp;` в URL
- ✅ Добавлено логирование для отладки (можно отключить в продакшене)

**Эндпоинты:**

- `GET /wp-json/gutenberg-blocks/v1/vk-thumbnail?video_id=VIDEO_ID`
- `GET /wp-json/gutenberg-blocks/v1/rutube-thumbnail?video_id=VIDEO_ID`

**Возвращаемые данные:**

```json
{
    "thumbnail_url": "https://...",
    "width": 1280,
    "height": 720
}
```

#### 2. `inc/Plugin.php`

**Изменения:**

- ✅ Добавлен хук `wp_enqueue_scripts` для подключения `pluign.js` на фронтенде
- ✅ Исправлен путь к файлу с `js/plugin.js` на `js/pluign.js`

```php
add_action('wp_enqueue_scripts', __CLASS__ . '::gutenbergBlocksExternalLibraries');
```

---

### Frontend JavaScript

#### `includes/js/pluign.js`

**Описание:** JavaScript фикс для удаления `target="_blank"` у GLightbox ссылок на фронтенде.

**Функционал:**

1. Поиск всех ссылок с `data-glightbox`
2. Проверка, что это iframe/video ссылка
3. Удаление `target` и `rel` атрибутов
4. Логирование исправлений в консоль

**Когда запускается:**

- При `DOMContentLoaded`
- При `window.load` (с задержкой 300ms)

**Код:**

```javascript
function fixGLightboxLinks() {
    const glightboxLinks = document.querySelectorAll('a[data-glightbox]');
    
    glightboxLinks.forEach(link => {
        const glightboxAttr = link.getAttribute('data-glightbox');
        
        if (glightboxAttr && (
            glightboxAttr.includes('type: iframe') ||
            glightboxAttr.includes('video') ||
            // ...
        )) {
            link.removeAttribute('target');
            link.removeAttribute('rel');
            console.log('🔧 Fixed GLightbox link:', link.href);
        }
    });
}
```

---

## API и функции

### REST API Endpoints

#### VK Thumbnail

```
GET /wp-json/gutenberg-blocks/v1/vk-thumbnail
```

**Параметры:**
- `video_id` (string, required) - ID видео VK в формате `oid=-123&id=456`

**Ответ:**
```json
{
    "thumbnail_url": "https://i.mycdn.me/...",
    "width": 1280,
    "height": 720
}
```

**Ошибки:**
- `400` - Missing video_id parameter
- `500` - Failed to fetch video data / No thumbnail found

#### Rutube Thumbnail

```
GET /wp-json/gutenberg-blocks/v1/rutube-thumbnail
```

**Параметры:**
- `video_id` (string, required) - ID видео Rutube (хеш)

**Ответ:**
```json
{
    "thumbnail_url": "https://pic.rutubelist.ru/...",
    "width": 1920,
    "height": 1080
}
```

---

### JavaScript Functions

#### `generateVideoId(linkUrl, linkType)`

**Расположение:** `src/blocks/button/save.js`

**Описание:** Генерирует уникальный ID для видео элемента.

**Параметры:**
- `linkUrl` (string) - URL видео
- `linkType` (string) - Тип ссылки ('vkvideo', 'rutube', etc.)

**Возвращает:** `string` - Уникальный ID в формате `{type}-{timestamp}-{random}`

**Пример:**
```javascript
generateVideoId('https://vkvideo.ru/...', 'vkvideo')
// → "vkvideo-1733456789012-x8g4k2p1a"
```

---

## Решённые проблемы

### Проблема 1: Постер не обновлялся при изменении Video Type

**Причина:** `useEffect` имел условие `!videoPoster.url`, которое блокировало обновление.

**Решение:** Убрано условие, добавлена зависимость от `videoType`.

```javascript
useEffect(() => {
    if ((videoType === 'vk' || videoType === 'rutube') && !isLoadingPoster) {
        handleAutoLoadPoster();
    }
}, [videoType, videoVkId, videoRutubeId]);
```

---

### Проблема 2: VK постеры загружались с `mycdn.me` (Odnoklassniki)

**Причина:** VK использует CDN Одноклассников для хранения видео.

**Решение:** Убрана строгая проверка домена, разрешены любые CDN.

```php
// Декодируем HTML entities (&amp; → &)
$thumbnail_url = html_entity_decode($thumbnail_url);
```

---

### Проблема 3: Rutube постер не загружался для URL с `/video/`

**Причина:** Парсер искал только `/embed/` в URL.

**Решение:** Добавлена поддержка обоих форматов.

```javascript
if (url.pathname.includes('/embed/')) {
    rutubeId = url.pathname.split('/embed/')[1];
} else if (url.pathname.includes('/video/')) {
    rutubeId = url.pathname.split('/video/')[1].split('/')[0];
}
```

---

### Проблема 4: `&amp;` в VK URL вызывал 400 ошибку

**Причина:** HTML entities не декодировались перед отправкой запроса.

**Решение:** Добавлен `html_entity_decode()` в PHP.

```php
$thumbnail_url = html_entity_decode($thumbnail_url);
```

---

### Проблема 5: Button блок открывал новую вкладку вместо лайтбокса

**Причина:** 
1. WordPress автоматически добавлял `target="_blank"` через `useBlockProps.save()`
2. `data-glightbox="type: iframe"` не работал корректно

**Решение:**
1. Создание скрытого iframe + якорная ссылка (как в Media блоке)
2. JavaScript фикс для удаления `target="_blank"` на фронтенде
3. Изменение структуры вывода без `useBlockProps.save()` на `<a>`

**До:**
```html
<a href="https://vkvideo.ru/..." 
   data-glightbox="type: iframe; width: 90vw; height: 90vh;" 
   target="_blank">
```

**После:**
```html
<div id="vkvideo-xxx" style="display:none">
    <iframe src="https://vkvideo.ru/..."></iframe>
</div>
<a href="#vkvideo-xxx" data-glightbox="width: auto;">
```

---

### Проблема 6: Button был кликабельным в редакторе

**Причина:** GLightbox инициализировался в редакторе.

**Решение:**
```javascript
// edit.js
const onClickHandler = isEditor ? (e) => {
    e.preventDefault();
    e.stopPropagation();
} : undefined;

data-glightbox={!isEditor && glightboxAttr ? glightboxAttr : undefined}
```

---

### Проблема 7: Разная высота постеров видео

**Причина:** Постеры имели разные пропорции.

**Решение:** Добавлен `aspect-ratio: 16/9` в CSS **только для видео** (используя `:has(.video-play-btn)`).

```scss
figure:has(.video-play-btn) a > img {
    aspect-ratio: 16 / 9;
    object-fit: cover;
}
```

**Важно:** Не применяется к обычным изображениям в Media блоке.

---

## Примеры использования

### Пример 1: Media Block с автозагрузкой постера VK

1. Создать Media блок
2. Выбрать "Video Type" → "VK Video"
3. Вставить URL или iframe код VK видео в поле "VK Video URL or ID"
4. Постер загрузится автоматически
5. (Опционально) Нажать "Auto-load Poster from Provider" для перезагрузки

**Результат на фронтенде:**

```html
<div class="wp-block-codeweber-blocks-media cwgb-media-block">
    <div id="video-abc123" style="display:none">
        <iframe src="https://vkvideo.ru/video_ext.php?oid=-82217805&id=456243357&hd=2"></iframe>
    </div>
    <figure class="position-relative">
        <a href="#video-abc123" data-glightbox="width: auto;">
            <img src="https://i.mycdn.me/..." alt="Video Title">
            <button type="button" class="video-play-btn">...</button>
        </a>
    </figure>
</div>
```

---

### Пример 2: Button Block с Rutube видео

1. Создать Button блок
2. В сайдбаре выбрать "Link Type" → "Rutube"
3. Вставить Rutube URL в поле "Rutube Video URL or ID"
4. Настроить стиль кнопки
5. Сохранить пост

**Результат на фронтенде:**

```html
<div id="rutube-1733456789012-x8g4k2p1a" style="display:none">
    <iframe src="https://rutube.ru/play/embed/699bbd7d...?autoplay=1"></iframe>
</div>
<a href="#rutube-1733456789012-x8g4k2p1a" 
   class="btn btn-primary" 
   data-glightbox="width: auto;">
    <span class="button-content">Watch Video</span>
</a>
```

---

### Пример 3: Программное использование парсеров

```javascript
import { parseVKVideoURL, parseRutubeVideoURL } from '../utilities/videoUrlParsers';

// VK
const vkEmbed = parseVKVideoURL(
    '<iframe src="https://vkvideo.ru/video_ext.php?oid=-123&id=456"></iframe>',
    true // for lightbox
);
console.log(vkEmbed);
// → "https://vkvideo.ru/video_ext.php?oid=-123&id=456&hd=2&autoplay=1&allowFullscreen=true&fullscreen=true"

// Rutube
const rutubeEmbed = parseRutubeVideoURL('699bbd7d...', true);
console.log(rutubeEmbed);
// → "https://rutube.ru/play/embed/699bbd7d...?autoplay=1"
```

---

## Тестирование

### Чек-лист для тестирования

#### Media Block

- [ ] VK видео загружается из iframe кода
- [ ] VK видео загружается из прямой ссылки
- [ ] VK видео загружается из ID формата
- [ ] Rutube видео загружается из `/video/` URL
- [ ] Rutube видео загружается из `/embed/` URL
- [ ] Постер автоматически загружается при изменении Video Type
- [ ] Индикатор "Загрузка постера..." отображается
- [ ] Кнопка "Auto-load Poster" имеет отступ 15px снизу
- [ ] Все постеры имеют одинаковую высоту (16:9)
- [ ] Видео открывается в лайтбоксе по клику

#### Button Block

- [ ] VK кнопка создаёт скрытый iframe
- [ ] Rutube кнопка создаёт скрытый iframe
- [ ] Ссылка ведёт на якорь `#video-xxx`
- [ ] `data-glightbox="width: auto;"` присутствует
- [ ] НЕТ `target="_blank"` и `rel="noopener"` на фронтенде
- [ ] Видео открывается мгновенно в лайтбоксе
- [ ] Кнопка не кликабельна в редакторе
- [ ] После пересохранения поста HTML обновляется

#### JavaScript Fix

- [ ] Консоль показывает "🔧 Fixed GLightbox link"
- [ ] `target` и `rel` удаляются на фронтенде
- [ ] Работает для динамически добавленных элементов

---

## Известные ограничения

1. **VK API:** Требует публичный доступ к видео
2. **Rutube API:** Может иметь rate limiting
3. **Постеры:** Качество зависит от платформы (VK может давать низкое разрешение)
4. **Browser caching:** После изменений нужно очистить кеш браузера (Ctrl+F5)

---

## Будущие улучшения

### Возможные доработки:

1. **Кеширование постеров** в WordPress (transients API)
2. **Предпросмотр видео** в редакторе без открытия лайтбокса
3. **Массовая загрузка постеров** для всех видео на странице
4. **Поддержка других платформ:** Dailymotion, Twitch, TikTok
5. **Настройки качества** постера (low/medium/high)
6. **Fallback изображение** если постер не загрузился
7. **Локализация** сообщений об ошибках

---

## Troubleshooting

### Постер не загружается

**Проверьте:**

1. Консоль браузера на наличие ошибок
2. Network tab - успешен ли запрос к REST API
3. Доступность видео (не заблокировано, не удалено)
4. Формат URL (попробуйте разные варианты)

**Лог в консоли:**
```
VK videoId not valid - попробуйте другой формат URL
Rutube videoId not valid - проверьте ID видео
```

### Видео не открывается в лайтбоксе

**Проверьте:**

1. Пересохранён ли пост после изменений
2. Очищен ли кеш браузера (Ctrl+F5)
3. Нет ли ошибок в консоли
4. Присутствует ли `data-glightbox` в HTML
5. Удалён ли `target="_blank"` (должен удалиться автоматически)

### Button открывает новую вкладку

**Решение:**

1. Проверьте консоль - должно быть "🔧 Fixed GLightbox link"
2. Очистите кеш браузера
3. Проверьте, что файл `pluign.js` загружается в Network tab
4. Пересохраните пост

---

## Контакты и поддержка

**Документация:** `/doc/VIDEO_INTEGRATION.md`  
**API Reference:** `/doc/API_REFERENCE.md`

---

**Последнее обновление:** 05.12.2024

