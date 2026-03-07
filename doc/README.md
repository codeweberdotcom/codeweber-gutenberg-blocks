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

### Основные документы

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

### Планы, отчёты и доп. материалы (doc/)

| Документ | Назначение |
|----------|------------|
| [COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md) | Сводка изменений (декабрь 2024) |
| [VIDEO_INTEGRATION.md](VIDEO_INTEGRATION.md) | Интеграция видео в блоках |
| [HOTFIX_ASPECT_RATIO.md](HOTFIX_ASPECT_RATIO.md) | Исправление aspect-ratio |
| [ICON_COMPONENT.md](ICON_COMPONENT.md) | Компонент иконок |
| [LOAD_MORE_ANALYSIS_REPORT.md](LOAD_MORE_ANALYSIS_REPORT.md) | Отчёт по Load More |
| [LOAD_MORE_COMPONENT.md](LOAD_MORE_COMPONENT.md) | Компонент Load More |
| [LOAD_MORE_FETCH_IMPLEMENTATION.md](LOAD_MORE_FETCH_IMPLEMENTATION.md) | Реализация Load More (fetch) |
| [LOAD_MORE_FETCH_INTEGRATION_PLAN.md](LOAD_MORE_FETCH_INTEGRATION_PLAN.md) | План интеграции Load More |
| [LOAD_MORE_FETCH_INTEGRATION_PLAN_SUMMARY.md](LOAD_MORE_FETCH_INTEGRATION_PLAN_SUMMARY.md) | Краткое резюме плана |
| [POST_CARD_TEMPLATES_PLAN.md](POST_CARD_TEMPLATES_PLAN.md) | План шаблонов карточек записей |

### Анализы и разборы (docs/)

В папке **`docs/`** (рядом с плагином) лежат технические разборы и анализы:

| Документ | Назначение |
|----------|------------|
| [../docs/menu-collapse-icon-like-accordion.md](../docs/menu-collapse-icon-like-accordion.md) | Иконка меню collapse «как в аккордеоне» |

> **Примечание:** Руководство по использованию Nav Walker темы (WP_Bootstrap_Navwalker, CodeWeber_Menu_Collapse_Walker): `wp-content/themes/codeweber/doc/NAV_WALKER_USAGE.md`.

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
| **Heading-Subtitle** | `codeweber-gutenberg-blocks/heading-subtitle` | Заголовок + подзаголовок |

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

**Подробнее:** [COMPONENTS_REFERENCE.md](COMPONENTS_REFERENCE.md)

---

## 🎨 Стандарты UI Sidebar

| Элемент | CSS-класс | Размер | Стиль |
|---------|-----------|--------|-------|
| **Кнопки панелей** | `.components-panel__body-toggle` | **14px** | без uppercase, фон `#e0e0e0` |
| **Заголовки полей** | `.component-sidebar-title label` | **13px** | без uppercase, `font-weight: 500` |

> Стили определены в `src/blocks/section/editor.scss`

**Подробнее:** [GUTENBERG_BLOCK_STANDARDS.md](GUTENBERG_BLOCK_STANDARDS.md#41-стандарты-стилей-sidebar-inspector-controls)

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
├── doc/                    # Документация (основная + планы/отчёты)
└── docs/                   # Анализы и разборы (меню, walker и т.д.)
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

**Куда класть новые документы:**

| Тип | Папка | Примеры |
|-----|--------|---------|
| Справочники, гайды, стандарты | `doc/` | BLOCKS_REFERENCE, QUICK_START, GUTENBERG_BLOCK_STANDARDS |
| Планы, отчёты, описания фич | `doc/` | LOAD_MORE_*, POST_CARD_TEMPLATES_PLAN, VIDEO_INTEGRATION |
| Технические разборы, анализы кода | `docs/` | menu-collapse-icon-like-accordion (анализ nav walker — в теме `codeweber/doc/`) |

---

> **Последнее обновление:** 2025-11-26
