# Changelog

Все значимые изменения в этом проекте будут задокументированы в этом файле.

---

## [0.3.0] - 2024-12-05

### 🎉 Added

#### Gallery Block (NEW!)
- **Новый блок `codeweber-blocks/gallery`** - галерея изображений с lightbox
- Автоматическая генерация 9 изображений при создании
- Сетка по умолчанию 3 колонки (настраивается: 2/3/4/6)
- Синхронизация размера изображений во всех дочерних Media блоках
- Переключатель Lightbox для всей галереи
- Demo изображения (placeholder) при создании
- Полная документация (`doc/GALLERY_BLOCK.md`)

#### Новые компоненты
- **`VideoURLControl`** (`src/components/video-url/VideoURLControl.js`) - Универсальный компонент для ввода видео URL с автозагрузкой постеров
- **`videoUrlParsers.js`** (`src/utilities/videoUrlParsers.js`) - Централизованные утилиты для парсинга VK, Rutube, YouTube, Vimeo URL

#### Media Block
- Автоматическая загрузка постера при изменении Video Type (VK/Rutube)
- Индикатор "Загрузка постера..." с анимацией спиннера
- Margin-bottom 15px для кнопки "Auto-load Poster" и индикатора загрузки
- Единообразная высота всех постеров видео (`aspect-ratio: 16/9`)

#### Button Block
- Поддержка видео VK/Rutube/YouTube/Vimeo в лайтбоксе
- Создание скрытого iframe для видео (как в Media блоке)
- Якорные ссылки `#video-xxx` вместо прямых URL
- Генерация уникальных ID для каждого видео

#### Frontend
- JavaScript фикс (`includes/js/pluign.js`) для удаления `target="_blank"` у GLightbox ссылок
- Логирование исправлений в консоль браузера

#### Документация
- Полная документация интеграции (`doc/VIDEO_INTEGRATION.md`)
- Примеры использования всех компонентов
- Troubleshooting секция

### 🔧 Changed

#### Media Block
- `MediaControl.js`: Заменён `TextareaControl` на `VideoURLControl` для VK и Rutube
- Удалены старые функции `handleVKIDChange` и `handleRutubeIDChange`
- Использование `videoUrlParsers.js` для парсинга URL

#### Button Block
- `save.js`: Полная переработка логики вывода видео-кнопок
- `edit.js`: Предотвращение клика по кнопке в редакторе
- Убран `target="_blank"` для GLightbox/видео ссылок

#### Utilities
- `link_type.js`: Интеграция `VideoURLControl` для всех видео-платформ
- Упрощение обработчиков изменений URL

#### Backend
- `VideoThumbnailAPI.php`: Убрана строгая проверка домена VK постеров
- Добавлен `html_entity_decode()` для корректной обработки `&amp;` в URL
- Добавлено логирование для отладки API запросов

#### Plugin Core
- `Plugin.php`: Добавлен хук `wp_enqueue_scripts` для фронтенд JS
- Исправлен путь к файлу с `js/plugin.js` на `js/pluign.js`

### 🐛 Fixed

- **Media Block**: `aspect-ratio: 16/9` применялся ко всем изображениям (исправлено - теперь только для видео)
- **Media Block**: Постер не обновлялся при изменении Video Type
- **Media Block**: VK постеры загружались с неправильного домена (`mycdn.me`)
- **Media Block**: Rutube постер не загружался для URL с `/video/`
- **Media Block**: `&amp;` в VK URL вызывал 400 ошибку
- **Button Block**: Кнопка открывала новую вкладку вместо лайтбокса
- **Button Block**: Кнопка была кликабельной в редакторе WordPress
- **Button Block**: Долгая загрузка Rutube видео в лайтбоксе
- **Button Block**: `target="_blank"` оставался даже после изменений
- **Frontend**: Разная высота постеров видео на странице

### 📝 Technical Details

#### Затронутые файлы:

**Новые:**
- `src/components/video-url/VideoURLControl.js`
- `src/utilities/videoUrlParsers.js`
- `src/blocks/gallery/` (новый блок целиком)
- `doc/VIDEO_INTEGRATION.md`
- `doc/GALLERY_BLOCK.md`
- `doc/HOTFIX_ASPECT_RATIO.md`
- `CHANGELOG.md`

**Изменённые:**
- `src/blocks/media/controls/MediaControl.js`
- `src/blocks/media/style.scss`
- `src/blocks/media/editor.scss`
- `src/blocks/button/save.js`
- `src/blocks/button/edit.js`
- `src/utilities/link_type.js`
- `src/index.js` (добавлен Gallery блок)
- `inc/VideoThumbnailAPI.php`
- `inc/Plugin.php` (добавлен Gallery в список блоков)
- `includes/js/pluign.js`

#### API Changes:

**REST API Endpoints** (без изменений):
- `GET /wp-json/gutenberg-blocks/v1/vk-thumbnail`
- `GET /wp-json/gutenberg-blocks/v1/rutube-thumbnail`

**Новые функции:**
- `parseVKVideoURL(url, forLightbox)`
- `parseRutubeVideoURL(url, forLightbox)`
- `parseYouTubeVideoURL(url)`
- `parseVimeoVideoURL(url)`
- `generateVideoId(linkUrl, linkType)`

#### Удалённые функции:
- `handleVKIDChange()` в `MediaControl.js` (заменён на `VideoURLControl`)
- `handleRutubeIDChange()` в `MediaControl.js` (заменён на `VideoURLControl`)

### 🔒 Security

- Добавлена санитизация URL через `html_entity_decode()`
- Валидация видео ID перед отправкой API запросов

### 🎨 Styling

- Добавлена CSS анимация спиннера (`@keyframes spin`)
- Унифицированы стили постеров **только для видео** (`aspect-ratio: 16/9` с `:has(.video-play-btn)`)
- Добавлены отступы для улучшения UX

### 🧪 Testing

- Протестированы все форматы VK URL (iframe, прямая ссылка, ID)
- Протестированы все форматы Rutube URL (`/video/`, `/embed/`)
- Протестирована автозагрузка постеров
- Протестирована работа GLightbox на фронтенде

---

## [0.1.0] - Previous

### Initial Release
- Базовая функциональность Media и Button блоков
- Поддержка YouTube и Vimeo
- GLightbox интеграция

---

## Формат

Этот changelog следует принципам [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

### Типы изменений:
- **Added** - новый функционал
- **Changed** - изменения существующего функционала
- **Deprecated** - функционал, который скоро будет удалён
- **Removed** - удалённый функционал
- **Fixed** - исправления багов
- **Security** - исправления уязвимостей

