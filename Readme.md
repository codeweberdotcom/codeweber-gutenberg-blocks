# CodeWeber Gutenberg Elements · Документация

> **Версия плагина:** 0.1.0
> **Требования:** WordPress ≥ 6.1, PHP ≥ 7.4, Node.js ≥ 18
> **Тема:** `codeweber` (обязательно)

---

## ⚠️ Обязательные правила

| Правило | Описание |
|---------|----------|
| **Только тема `codeweber`** | Плагин работает исключительно с темой `codeweber` (Bootstrap). |
| **Стили темы в приоритете** | Используем классы Bootstrap/темы (`btn`, `row`, `col-*`, `card`). Кастомные стили — по согласованию. |
| **Gutenberg-компоненты** | `@wordpress/components` допустимы **только** в Inspector/Sidebar. На фронте — запрещены. |
| **Документация темы** | <https://sandbox.elemisthemes.com/index.html> |

---

## 📚 Структура документации

| Документ | Назначение | Для кого |
|----------|------------|----------|
| **[PLUGIN_OVERVIEW.md](PLUGIN_OVERVIEW.md)** | Архитектура, карта файлов, жизненный цикл | Все разработчики |
| **[BLOCKS_REFERENCE.md](BLOCKS_REFERENCE.md)** | Справочник всех блоков, атрибуты, примеры | Работа с блоками |
| **[COMPONENTS_REFERENCE.md](COMPONENTS_REFERENCE.md)** | Shared-компоненты для Inspector | Создание UI настроек |
| **[API_REFERENCE.md](API_REFERENCE.md)** | REST API, PHP-хуки, константы | Backend-интеграции |
| **[GUTENBERG_BLOCK_STANDARDS.md](GUTENBERG_BLOCK_STANDARDS.md)** | Требования к блокам, чек-листы | Создание/изменение блоков |
| **[QUICK_START.md](QUICK_START.md)** | Быстрый старт, окружение, команды | Новые разработчики |
| **[DEV_WORKFLOW.md](DEV_WORKFLOW.md)** | Полный цикл: анализ → план → реализация → релиз | Все задачи |
| **[REFACTORING_GUIDE.md](REFRACTORING_GUIDE.md)** | Чек-лист рефакторинга и миграций | Крупные изменения |
| **[ICON_COMPONENT.md](doc/ICON_COMPONENT.md)** | Документация Icon Component | Работа с иконками |

---

## 🚀 Быстрый старт

```bash
# 1. Установка зависимостей
cd wp-content/plugins/codeweber-gutenberg-blocks
npm install

# 2. Разработка (hot-reload)
npm run start

# 3. Production-сборка
npm run build

# 4. Проверка кода
npm run lint:js && npm run lint:css
```

**Подробнее:** [QUICK_START.md](QUICK_START.md)

---

## 🧱 Блоки плагина

| Блок | Name | Описание |
|------|------|----------|
| **Section** | `codeweber-blocks/section` | Секция с фоном (цвет, изображение, видео) |
| **Column** | `codeweber-blocks/column` | Bootstrap-колонка с фоном |
| **Columns** | `codeweber-blocks/columns` | Контейнер колонок с row-cols |
| **Button** | `codeweber-blocks/button` | Кнопка/ссылка с иконками и lightbox |
| **Heading-Subtitle** | `codeweber-gutenberg-blocks/heading-subtitle` | Заголовок + подзаголовок + параграф |
| **Icon** | `codeweber-blocks/icon` | Универсальная иконка (Font, SVG, Custom) |
| **Paragraph** | `codeweber-blocks/paragraph` | Параграф с расширенными настройками типографики |
| **Card** | `codeweber-blocks/card` | Контейнер-карточка с InnerBlocks и настройками тени, скруглений |
| **Feature** | `codeweber-blocks/feature` | Feature-блок с Icon, Title, Paragraph, Button. Два варианта layout |
| **Image** | `codeweber-blocks/image` | Универсальный блок для изображений: Single/Grid/Swiper, hover-эффекты, overlay, lightbox |

**Подробнее:** [BLOCKS_REFERENCE.md](BLOCKS_REFERENCE.md)

---

## 🔧 Shared-компоненты

| Компонент | Назначение |
|-----------|------------|
| `BackgroundSettingsPanel` | Настройки фона |
| `ColorTypeControl` | Выбор типа цвета |
| `SpacingControl` | Отступы по breakpoint-ам |
| `PositioningControl` | Позиционирование (align, justify) |
| `GapControl` | Gap/Gutter |
| `Animation` | Настройки анимации |
| `BlockMetaFields` | Мета-поля (class, data, id) |
| `IconControl` | Универсальные настройки иконки ([документация](doc/ICON_COMPONENT.md)) |
| `ParagraphControl` | Настройки параграфа (text, color, typography) |
| `TagControl` | Выбор HTML тега (h1-h6, p, div, span, display-*) |
| `BorderRadiusControl` | Управление скруглением углов (rounded, rounded-xl, etc) |
| `ShadowControl` | Управление тенями (shadow-sm, shadow-lg, shadow-xl, etc) |

**Подробнее:** [COMPONENTS_REFERENCE.md](COMPONENTS_REFERENCE.md)

---

## 🔌 API

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/wp-json/codeweber-gutenberg-blocks/v1/image-sizes` | GET | Размеры изображений |

**Подробнее:** [API_REFERENCE.md](API_REFERENCE.md)

---

## 📁 Структура плагина

```
codeweber-gutenberg-blocks/
├── plugin.php              # Точка входа
├── inc/Plugin.php          # Основной класс
├── src/
│   ├── blocks/             # Gutenberg-блоки
│   ├── components/         # Shared-компоненты
│   └── utilities/          # Утилиты
├── build/                  # Скомпилированные ассеты
├── settings/               # Страница настроек
├── languages/              # Переводы
└── doc/                    # Документация
```

**Подробнее:** [PLUGIN_OVERVIEW.md](PLUGIN_OVERVIEW.md)

---

## 🤖 Для AI-агентов

### Навигация по задачам

| Задача | Документ | Раздел |
|--------|----------|--------|
| Понять архитектуру | `PLUGIN_OVERVIEW.md` | §2-3 |
| Добавить новый блок | `BLOCKS_REFERENCE.md` | §7 |
| Изменить атрибут блока | `BLOCKS_REFERENCE.md` | §1-6 |
| Создать компонент Inspector | `COMPONENTS_REFERENCE.md` | §14 |
| Добавить REST endpoint | `API_REFERENCE.md` | §9.2 |
| Проверить стандарты | `GUTENBERG_BLOCK_STANDARDS.md` | §0-8 |
| Выполнить рефакторинг | `REFACTORING_GUIDE.md` | Весь документ |
| Работать с иконками | `doc/ICON_COMPONENT.md` | Весь документ |

### Ключевые файлы

| Файл | Назначение |
|------|------------|
| `plugin.php` | Точка входа, автозагрузчик |
| `inc/Plugin.php` | Регистрация блоков, REST API, категории |
| `src/index.js` | JS-точка входа, lazy-load блоков |
| `src/blocks/<name>/block.json` | Метаданные и атрибуты блока |
| `src/blocks/<name>/edit.js` | UI редактора |
| `src/blocks/<name>/save.js` | HTML-вывод |
| `src/utilities/class-generators.js` | Генерация CSS-классов |
| `src/utilities/colors.js` | Палитра цветов темы |
| `src/components/icon/` | Компоненты иконок ([документация](doc/ICON_COMPONENT.md)) |

### Контекст для модификаций

1. **Стили:** Приоритет — классы темы `codeweber` (Bootstrap). Проверять в <https://sandbox.elemisthemes.com/index.html>.
2. **Gutenberg-компоненты:** Только в Inspector. На фронте — HTML + классы темы.
3. **Атрибуты:** Живут в `block.json`. При изменении — добавлять `deprecated` миграцию.
4. **Локализация:** Все строки через `__()` / `sprintf()` из `@wordpress/i18n`.
5. **Сборка:** После изменений — `npm run build`. Папка `build/` в Git.

---

## 📝 Обновление документации

При добавлении новых модулей, блоков или компонентов:

1. Обновить соответствующий справочник (`BLOCKS_REFERENCE.md`, `COMPONENTS_REFERENCE.md`, `API_REFERENCE.md`).
2. Добавить ссылку в этот файл, если создан новый документ.
3. Обновить секцию «Для AI-агентов» при изменении ключевых файлов.

---

## 📦 Feature Block

### Обзор
Универсальный блок для отображения Features (иконка + заголовок + описание + кнопка) с тремя вариантами верстки.

### Особенности
- **Три варианта layout:**
  - Feature 1 (вертикальный) — элементы расположены вертикально
  - Feature 2 (горизонтальный) — иконка слева, контент справа
  - Feature 3 (иконка + заголовок в строке) — иконка и заголовок на одной строке, параграф и кнопка под ними
- **Автоматическое переключение настроек** при смене layout
- **Интеграция компонентов:** Icon, Title, Paragraph, Button, Card
- **Полная настройка** типографики, цветов, стилей

### Табы
1. **Feature** — выбор варианта (Feature 1 / Feature 2)
2. **Icon** — настройки иконки (IconControl)
3. **Title** — настройки заголовка и параграфа (HeadingContentControl + HeadingTypographyControl без Subtitle)
4. **Button** — настройки кнопки (текст, URL, цвет, классы)
5. **Card** — настройки карточки (Card, Border Radius, Shadow, Spacing, Background)

### Дефолтные значения
```javascript
// Icon
iconName: 'phone-volume'
iconColor: 'yellow'
iconWrapper: true
iconWrapperStyle: 'btn'
iconBtnSize: 'btn-lg'
iconBtnVariant: 'soft'
iconWrapperClass: 'pe-none mb-5'

// Title
title: '24/7 Support'
titleTag: 'h4'

// Paragraph
paragraph: 'Nulla vitae elit libero, a pharetra augue...'
paragraphTag: 'p'
paragraphClass: 'mb-3'

// Button
buttonText: 'Learn More'
buttonUrl: '#'
buttonColor: 'yellow'
buttonClass: 'more hover'
```

### Автоматическое переключение layout

**Feature 1 (вертикальный):**
- Icon: `btn-block`, `btn-soft-yellow`, wrapper `pe-none mb-5`
- Button: `link-yellow`

**Feature 2 (горизонтальный):**
- Icon: `btn-circle`, `btn-primary`, wrapper `me-5`
- Button: без цвета
- Layout: `d-flex flex-row`

**Feature 3 (иконка + заголовок в строке):**
- Icon: `btn-circle`, `btn-soft-primary`, wrapper `pe-none me-5`
- Title: класс `mb-1`
- Button: `link-yellow`
- Layout: иконка и заголовок в `d-flex flex-row align-items-center mb-4`

### HTML-структура

**Feature 1:**
```html
<div class="wp-block-codeweber-blocks-feature">
  <div class="icon btn btn-block btn-soft-yellow btn-lg pe-none mb-5">
    <i class="uil uil-phone-volume"></i>
  </div>
  <h4>24/7 Support</h4>
  <p class="mb-3">Nulla vitae elit libero...</p>
  <a href="#" class="more hover link-yellow">Learn More</a>
</div>
```

**Feature 2:**
```html
<div class="wp-block-codeweber-blocks-feature d-flex flex-row">
  <div>
    <div class="icon btn btn-circle btn-primary me-5">
      <i class="uil uil-phone-volume"></i>
    </div>
  </div>
  <div>
    <h4>24/7 Support</h4>
    <p class="mb-2">Nulla vitae elit libero...</p>
    <a href="#" class="more hover">Learn More</a>
  </div>
</div>
```

**Feature 3:**
```html
<div class="wp-block-codeweber-blocks-feature">
  <div class="d-flex flex-row align-items-center mb-4">
    <div class="icon btn btn-circle btn-lg btn-soft-primary pe-none me-5">
      <i class="uil uil-phone-volume"></i>
    </div>
    <h4 class="mb-1">24/7 Support</h4>
  </div>
  <p class="mb-3">Nulla vitae elit libero pharetra augue dapibus.</p>
  <a href="#" class="more hover link-yellow">Learn More</a>
</div>
```

### Модификации компонентов
Для работы блока Feature были модифицированы компоненты:
- **HeadingContentControl** — добавлен проп `hideSubtitle` для скрытия настроек Subtitle
- **HeadingTypographyControl** — добавлен проп `hideSubtitle` для скрытия таба Subtitle

---

## Image Block

### Обзор
Универсальный блок для работы с изображениями, поддерживающий три режима отображения:
- **Single** — одно изображение
- **Grid** — сетка изображений (2/3/4 колонки)
- **Swiper** — карусель с настройками навигации

### Возможности
✅ **Режимы отображения:**
- Single image
- Grid gallery (2, 3, 4 колонки)
- Swiper carousel (с навигацией и пагинацией)

✅ **Hover эффекты:**
- `lift` — поднятие при наведении
- `hover-scale` — масштабирование при наведении

✅ **Overlay эффекты:**
- `overlay-1` — базовый overlay
- `overlay-2` — цветной overlay (+ опция `color` для primary)
- `overlay-3` — градиентный overlay (7 вариантов градиентов)

✅ **Дополнительно:**
- iTooltip (dark/light/primary)
- Cursor styles (dark/light/primary)
- Border radius (все классы Bootstrap 5)
- Lightbox (GLightbox) с группировкой
- Caption для overlay

### Табы
1. **Images** — добавление/удаление/сортировка изображений
2. **Layout** — выбор режима (Single/Grid/Swiper) + настройки сетки/карусели
3. **Effects** — hover, overlay, tooltip, cursor, border radius
4. **Lightbox** — включение lightbox + gallery name
5. **Settings** — класс, data-атрибуты, ID

### HTML-структуры

**Single Image:**
```html
<div class="wp-block-codeweber-blocks-image">
  <figure class="hover-scale rounded">
    <a href="image.jpg" data-glightbox="image" data-gallery="gallery-1">
      <img src="image.jpg" alt="Description" />
    </a>
  </figure>
</div>
```

**Grid Gallery (3 колонки):**
```html
<div class="wp-block-codeweber-blocks-image">
  <div class="row gy-5 gx-md-5">
    <div class="col-md-4">
      <figure class="overlay overlay-1 hover-scale rounded">
        <a href="image1.jpg" data-glightbox data-gallery="gallery-1">
          <img src="image1.jpg" alt="" />
        </a>
        <span class="bg"></span>
        <figcaption>
          <h5 class="from-top mb-0">Caption</h5>
        </figcaption>
      </figure>
    </div>
    <!-- ... другие колонки ... -->
  </div>
</div>
```

**Swiper Carousel:**
```html
<div class="wp-block-codeweber-blocks-image">
  <div class="swiper-container" data-margin="30" data-nav="true" data-dots="true" data-items-xl="3" data-items-md="2" data-items-xs="1">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <figure class="rounded">
            <a href="image1.jpg" data-glightbox data-gallery="gallery-1">
              <img src="image1.jpg" alt="" />
            </a>
          </figure>
        </div>
        <!-- ... другие слайды ... -->
      </div>
    </div>
  </div>
</div>
```

### Этапы реализации
- ✅ **Этап 1 (MVP):** Single/Grid/Swiper режимы, базовые эффекты, lightbox
- ⏳ **Этап 2:** Расширенные overlay эффекты, tooltip, cursor styles
- ⏳ **Этап 3:** Модальное окно для редактирования отдельных изображений с полной интеграцией `LinkTypeSelector`

**Текущий статус:** Этап 1 (MVP) завершен ✅

### Компоненты
- **ImageControl** — управление списком изображений (добавление, удаление, сортировка)
- **ImageRender** — рендеринг изображения с эффектами
- **LayoutControl** — настройки режима отображения
- **EffectsControl** — настройки эффектов
- **LightboxControl** — настройки lightbox

---

> **Последнее обновление:** 2025-12-03
