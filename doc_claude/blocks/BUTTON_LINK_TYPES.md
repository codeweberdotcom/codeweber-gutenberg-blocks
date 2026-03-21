# Button Block — Типы ссылок и data-атрибуты

Полный справочник по типам ссылок блока `codeweber-blocks/button` и генерируемым ими HTML data-атрибутам.

**Источник правды:** `src/utilities/link_type.js` (логика), `src/blocks/button/save.js` (рендер).

---

## Содержание

1. [Обзор всех типов](#1-обзор-всех-типов)
2. [Модальные окна](#2-модальные-окна-data-bs-togglemodal)
3. [Скачивание документа](#3-скачивание-документа-data-bs-toggledownload)
4. [Видео-лайтбокс (GLightbox)](#4-видео-лайтбокс-glightbox)
5. [Медиа-лайтбокс (GLightbox)](#5-медиа-лайтбокс-glightbox)
6. [Обычные ссылки](#6-обычные-ссылки)
7. [Ручная настройка data-атрибутов](#7-ручная-настройка-data-атрибутов)

---

## 1. Обзор всех типов

| `LinkType` | Описание | Механизм |
|-----------|----------|----------|
| `external` | Внешняя ссылка | `href` + `target="_blank"` |
| `post` | Запись / страница / CPT | `href` → URL записи |
| `archive` | Архив CPT или таксономии | `href` → URL архива |
| `phone` | Телефон | `href="tel:..."` |
| `cf7` | Contact Form 7 в модале | `data-bs-toggle="modal"` + `data-value="cf7-{id}"` |
| `cf` | CodeWeber Form в модале | `data-bs-toggle="modal"` + `data-value="cf-{id}"` |
| `modal` | CPT Modals в модале | `data-bs-toggle="modal"` + `data-value="modal-{id}"` |
| `html` | HTML Block в модале | `data-bs-toggle="modal"` + `data-value="html-{id}"` |
| `document` (download) | Скачать документ (CPT) | `data-bs-toggle="download"` + `data-value="doc-{id}"` |
| `document` (email) | Отправить документ на email | `data-bs-toggle="modal"` + `data-value="doc-{id}"` |
| `youtube` | YouTube-видео в лайтбоксе | `data-glightbox="youtube"` + скрытый iframe |
| `vimeo` | Vimeo-видео в лайтбоксе | `data-glightbox="vimeo"` + скрытый iframe |
| `rutube` | Rutube-видео в лайтбоксе | `data-glightbox="video"` + скрытый iframe |
| `vk` | VK-видео в лайтбоксе | `data-glightbox="video"` + скрытый iframe |
| `pdf` | PDF в лайтбоксе | `data-glightbox="height: 100vh"` + прямой URL |
| `image` | Изображение в лайтбоксе | `data-glightbox="image"` + прямой URL |
| `html5video` | HTML5-видео в лайтбоксе | `data-glightbox="html5video"` + прямой URL |

---

## 2. Модальные окна (`data-bs-toggle="modal"`)

Все modal-типы используют единый механизм `restapi.js`:
клик → `createModal()` → skeleton → `fetch(wp/v2/modal/{dataValue})` → рендер.

### CF7 (Contact Form 7)

Выбрать форму CF7 из выпадающего списка.

**Генерируемые атрибуты:**
```html
<a href="javascript:void(0)"
   data-bs-toggle="modal"
   data-bs-target="#modal"
   data-value="cf7-{CF7ID}">
  Текст кнопки
</a>
```

**Skeleton:** форменный (поля + кнопка)
**Инициализация после открытия:** `wpcf7.init(form)` в `shown.bs.modal`

---

### CF (CodeWeber Form)

Выбрать форму CodeWeber из выпадающего списка.

**Генерируемые атрибуты:**
```html
<a href="javascript:void(0)"
   data-bs-toggle="modal"
   data-bs-target="#modal"
   data-value="cf-{CodeweberFormID}">
  Текст кнопки
</a>
```

**Skeleton:** форменный
**Инициализация после открытия:** `MutationObserver` в `form-submit-universal.js` — автоматически

---

### Modal (CPT Modals)

Выбрать запись из CPT `modals`.

**Генерируемые атрибуты:**
```html
<a href="javascript:void(0)"
   data-bs-toggle="modal"
   data-bs-target="#modal"
   data-value="modal-{ModalID}">
  Текст кнопки
</a>
```

**Skeleton:** контентный
**Размер модала:** задаётся в настройках поста CPT `modals` (поле `modal_size`), не в блоке
**Поддержка prefetch:** да (если `ENABLE_CACHE = true` в `restapi.js`)

---

### HTML (HTML Block CPT)

Выбрать запись из CPT `html_blocks`.

**Генерируемые атрибуты:**
```html
<a href="javascript:void(0)"
   data-bs-toggle="modal"
   data-bs-target="#modal"
   data-value="html-{HtmlID}">
  Текст кнопки
</a>
```

**Skeleton:** контентный

---

### Document → Email

Выбрать документ из CPT `documents`, действие «Email».
Открывает модал с формой запроса email для отправки документа.

**Генерируемые атрибуты:**
```html
<a href="javascript:void(0)"
   data-bs-toggle="modal"
   data-bs-target="#modal"
   data-value="doc-{DocumentID}">
  Получить документ
</a>
```

**Skeleton:** контентный
**Инициализация после открытия:** `initDocumentEmailForm()` в `shown.bs.modal`

---

## 3. Скачивание документа (`data-bs-toggle="download"`)

### Document → Download

Выбрать документ из CPT `documents`, действие «Download».
Обработчик в `restapi.js` перехватывает клик, делает `fetch` к API и инициирует скачивание файла.

**Генерируемые атрибуты:**
```html
<a href="javascript:void(0)"
   data-bs-toggle="download"
   data-value="doc-{DocumentID}">
  Скачать документ
</a>
```

> **Важно:** `data-bs-toggle="download"` — **не** Bootstrap-модал. Это кастомный обработчик в `restapi.js`. Модальное окно не открывается.

**Форматы `data-value` для скачивания:**

| Значение | CPT | Endpoint |
|---------|-----|---------|
| `doc-{id}` | `documents` | REST-запрос к API документов |
| `staff-{id}` | `staff` | REST-запрос к API сотрудников |
| `vac-{id}` | `vacancies` | REST-запрос к API вакансий |

---

## 4. Видео-лайтбокс (GLightbox)

Видео-типы используют скрытый `<iframe>` в DOM. Кнопка получает `href="#video-{uid}"` (якорь на iframe). GLightbox открывает iframe в лайтбоксе.

**Принцип:**
```html
<!-- Скрытый iframe (перед кнопкой в DOM) -->
<div id="video-{uid}" style="display:none">
  <iframe src="{VideoURL}" allowfullscreen ...></iframe>
</div>

<!-- Кнопка -->
<a href="#video-{uid}"
   data-glightbox="width: auto;"
   class="btn ...">
  Смотреть видео
</a>
```

### YouTube

```html
<a href="#video-{uid}"
   data-glightbox="width: auto;"
   data-gallery="youtube">
  Смотреть
</a>
```

**В редакторе:** вставить URL вида `https://www.youtube.com/watch?v=...` или `https://youtu.be/...`

### Vimeo

```html
<a href="#video-{uid}"
   data-glightbox="width: auto;"
   data-gallery="vimeo">
  Смотреть
</a>
```

### Rutube

```html
<a href="#video-{uid}"
   data-glightbox="width: auto;">
  Смотреть
</a>
```

**В редакторе:** вставить URL страницы Rutube — парсер `parseRutubeVideoURL()` извлечёт embed-URL.

### VK Video

```html
<a href="#video-{uid}"
   data-glightbox="width: auto;">
  Смотреть
</a>
```

**В редакторе:** вставить URL страницы VK — парсер `parseVKVideoURL()` извлечёт embed-URL.

---

## 5. Медиа-лайтбокс (GLightbox)

Медиа-типы используют прямой URL файла в `href`. GLightbox открывает файл по URL.

### PDF

```html
<a href="{pdf_url}"
   data-glightbox="height: 100vh"
   data-gallery="pdf">
  Открыть PDF
</a>
```

**В редакторе:** загрузить или выбрать PDF из медиатеки WordPress.
> Открывает PDF в лайтбоксе на полную высоту экрана. Если нужно только скачать — используйте тип `document` (download).

### Image

```html
<a href="{image_url}"
   data-glightbox="image"
   data-gallery="image">
  Открыть изображение
</a>
```

**В редакторе:** загрузить или выбрать изображение из медиатеки.

### HTML5 Video

```html
<a href="{video_url}"
   data-glightbox="html5video"
   data-gallery="html5video">
  Смотреть видео
</a>
```

**В редакторе:** загрузить или выбрать видеофайл (mp4, webm и т.д.) из медиатеки.

---

## 6. Обычные ссылки

### External (внешняя ссылка)

```html
<a href="https://example.com"
   target="_blank"
   rel="noopener noreferrer">
  Перейти
</a>
```

> `target="_blank"` добавляется **только** для `LinkType=external` и только если нет `data-glightbox` и `data-bs-toggle`.

### Post / Page / CPT

```html
<a href="/services/web-development/">
  Подробнее
</a>
```

**В редакторе:** выбрать тип записи → выбрать конкретную запись из списка.

### Archive

```html
<a href="/services/">
  Все услуги
</a>
```

**В редакторе:** выбрать тип архива (CPT или таксономия).

### Phone

```html
<!-- Ручной ввод -->
<a href="tel:+74951234567">+7 (495) 123-45-67</a>

<!-- Из настроек темы (Redux → Contacts) -->
<a href="tel:+74951234567">+7 (495) 123-45-67</a>
```

**В редакторе:** выбрать источник — «Custom» (ввести вручную) или «Contacts» (из Redux-настроек темы).

---

## 7. Ручная настройка data-атрибутов

Блок Button поддерживает произвольные data-атрибуты через поля в Inspector → «Button Settings».

### Button Data (blockData)

Формат: `key=value, key2=value2`

```
tracking-id=btn-hero-cta, section=hero
```

Генерирует:
```html
<a data-tracking-id="btn-hero-cta" data-section="hero" ...>
```

### DataValue

Произвольное значение `data-value`. Используется совместно с `DataBsToggle="modal"` для нестандартных модалов.

Пример для testimonial-формы:
```
DataValue = add-testimonial
DataBsToggle = modal
DataBsTarget = modal
```

Генерирует:
```html
<a href="javascript:void(0)"
   data-bs-toggle="modal"
   data-bs-target="#modal"
   data-value="add-testimonial">
  Оставить отзыв
</a>
```

**Skeleton:** форменный (т.к. `data-value === 'add-testimonial'` в `getModalSkeleton()`)

### DataGlightbox / DataGallery

Произвольные значения для GLightbox. Позволяют группировать элементы в галерею.

```
DataGlightbox = type: image; description: Фото офиса
DataGallery = office-photos
```

---

## Связанные документы

- **[MODAL_SYSTEM.md](../../themes/codeweber/doc_claude/api/MODAL_SYSTEM.md)** — архитектура модальных окон, жизненный цикл, `data-value` форматы
- **[BLOCKS_CATALOG.md](BLOCKS_CATALOG.md)** — краткое описание всех блоков
- **[DYNAMIC_BLOCKS.md](DYNAMIC_BLOCKS.md)** — динамические блоки (render.php)
