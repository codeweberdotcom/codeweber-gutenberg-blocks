# Hotfix: aspect-ratio только для видео

**Дата:** 05 декабря 2024  
**Файл:** `src/blocks/media/style.scss`

---

## Проблема

После внедрения унификации высоты видео постеров, `aspect-ratio: 16/9` применялся **ко всем изображениям** в Media блоке, включая обычные фотографии (тип "Image").

### Было (неправильно):

```scss
figure {
    a > img {
        aspect-ratio: 16 / 9; // ❌ Применялось ко всем изображениям!
    }
}
```

**Результат:** Все обычные изображения растягивались/сжимались до пропорции 16:9, что искажало их.

---

## Решение

Использован CSS селектор `:has(.video-play-btn)` для применения стилей **только к видео**.

### Стало (правильно):

```scss
figure {
    // ✅ Применяется ТОЛЬКО когда есть кнопка play (т.е. это видео)
    &:has(.video-play-btn) a > img {
        width: 100%;
        height: auto;
        object-fit: cover;
        aspect-ratio: 16 / 9;
        display: block;
    }
}
```

---

## Логика работы

### Когда применяется aspect-ratio:

1. Media блок с типом **"Video"** (любое видео: VK, Rutube, YouTube, Vimeo)
2. Включена опция **"Show Play Icon"** (по умолчанию ON)
3. В HTML присутствует `<button class="video-play-btn">`

**HTML структура видео:**

```html
<figure class="position-relative">
    <a href="#video-xxx" data-glightbox="width: auto;">
        <img src="..." alt="...">  <!-- ✅ aspect-ratio: 16/9 применится -->
        <button class="video-play-btn">...</button>  <!-- Триггер для селектора -->
    </a>
</figure>
```

### Когда НЕ применяется:

1. Media блок с типом **"Image"** (обычное изображение)
2. Нет кнопки play

**HTML структура изображения:**

```html
<figure>
    <img src="..." alt="...">  <!-- ✅ Сохраняет оригинальные пропорции -->
</figure>
```

---

## Browser Support

Селектор `:has()` поддерживается в:

- ✅ Chrome 105+ (август 2022)
- ✅ Firefox 121+ (декабрь 2023)
- ✅ Safari 15.4+ (март 2022)
- ✅ Edge 105+ (сентябрь 2022)

**Fallback:** Если браузер не поддерживает `:has()`, стили просто не применятся, и видео постеры будут иметь разную высоту (не критично).

**Альтернатива для старых браузеров (если нужно):**

```scss
// Добавить класс на figure через JavaScript
figure.has-video-player a > img {
    aspect-ratio: 16 / 9;
}
```

---

## Тестирование

### Тест 1: Видео блок ✅

1. Создать Media блок
2. Выбрать Video Type = VK/Rutube/YouTube
3. Добавить URL видео
4. Проверить на фронтенде: постер должен быть 16:9

**Ожидаемый CSS:**

```css
.cwgb-media-block figure:has(.video-play-btn) a > img {
    aspect-ratio: 16 / 9;
}
```

### Тест 2: Обычное изображение ✅

1. Создать Media блок
2. Выбрать Media Type = Image
3. Загрузить изображение (например, портрет 3:4)
4. Проверить на фронтенде: изображение сохраняет оригинальные пропорции

**Ожидаемый результат:** CSS с `aspect-ratio` НЕ применяется.

### Тест 3: Смешанный контент ✅

1. Создать страницу с:
   - Media блок (Image) - портрет 3:4
   - Media блок (VK Video) - 16:9
   - Media блок (Image) - ландшафт 21:9
   - Media блок (Rutube Video) - 16:9

2. Проверить на фронтенде:
   - Изображения: оригинальные пропорции
   - Видео: все 16:9

---

## Файлы изменены

- ✅ `src/blocks/media/style.scss` - добавлен `:has(.video-play-btn)`
- ✅ `build/blocks/media/style-index.css` - скомпилированный CSS
- ✅ `doc/VIDEO_INTEGRATION.md` - обновлена документация
- ✅ `CHANGELOG.md` - добавлена запись о фиксе

---

## Команда для применения

```bash
cd wp-content/plugins/codeweber-gutenberg-blocks
npm run build
```

---

**Статус:** ✅ Исправлено и задокументировано


