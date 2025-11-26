# PLUGIN OVERVIEW · Архитектура и структура

> **Версия:** 0.1.0  
> **Namespace:** `Codeweber\Blocks`  
> **Text Domain:** `codeweber-gutenberg-blocks`  
> **Требования:** WordPress ≥ 6.1, PHP ≥ 7.4, Node.js ≥ 18

---

## 0. Ключевые правила

| Правило | Описание |
|---------|----------|
| **Только тема `codeweber`** | Плагин работает исключительно с темой `codeweber` (Bootstrap). |
| **Стили темы в приоритете** | Используем классы Bootstrap/темы (`btn`, `row`, `col-*`, `card`). Кастомные стили — по согласованию. |
| **Gutenberg-компоненты** | `@wordpress/components` допустимы **только** в Inspector/Sidebar. На фронте — запрещены. |
| **Документация темы** | <https://sandbox.elemisthemes.com/index.html> |

---

## 1. Назначение плагина

Плагин расширяет редактор Gutenberg набором блоков, адаптированных под дизайн-систему темы `codeweber`:

- **Layout-блоки:** Section, Row, Column, Columns — Bootstrap-сетка в Gutenberg.
- **UI-блоки:** Button, Heading-Subtitle — готовые компоненты с настройками цвета, размера, иконок.
- **Shared-компоненты:** переиспользуемые панели настроек (Background, Spacing, Animation и др.).
- **Страница настроек:** админ-панель для глобальных опций плагина.

---

## 2. Карта файлов и директорий

```
codeweber-gutenberg-blocks/
├── plugin.php                 # Точка входа, автозагрузчик, хуки
├── package.json               # npm-зависимости, скрипты сборки
├── generate-json.js           # Генерация JSON для локализации
├── generate-pot.js            # Генерация POT-файла переводов
│
├── inc/
│   └── Plugin.php             # Основной класс: регистрация блоков, категории, REST API
│
├── src/                       # Исходники (компилируются в build/)
│   ├── index.js               # Точка входа JS, lazy-load блоков
│   ├── blocks/                # Gutenberg-блоки
│   │   ├── button/
│   │   ├── section/
│   │   ├── row/
│   │   ├── column/
│   │   ├── columns/
│   │   └── heading-subtitle/
│   ├── components/            # Shared-компоненты для Inspector
│   │   ├── adaptive/
│   │   ├── animation/
│   │   ├── background/
│   │   ├── block-meta/
│   │   ├── colors/
│   │   ├── gap/
│   │   ├── heading/
│   │   ├── layout/
│   │   ├── section/
│   │   └── spacing/
│   └── utilities/             # Утилиты: генераторы классов, цвета, иконки
│       ├── class-generators.js
│       ├── colors.js
│       ├── gradient_colors.js
│       ├── font_icon.js
│       ├── font_icon_social.js
│       ├── link_type.js
│       └── shapes.js
│
├── build/                     # Скомпилированные ассеты (в Git)
│   └── blocks/
│
├── settings/                  # Страница настроек плагина
│   ├── options_page/
│   │   ├── options.php        # Регистрация меню и страницы
│   │   ├── functions.php      # Вспомогательные функции
│   │   ├── register_fields.php
│   │   ├── fields.json
│   │   ├── class-options-tabs.php
│   │   ├── restapi.php
│   │   └── pages/
│   │       ├── page_2.php
│   │       ├── page_3.php
│   │       └── page_4.php
│   └── api/
│       └── restapi.js         # JS для REST-запросов настроек
│
├── includes/
│   └── js/
│       └── plugin.js          # Внешние библиотеки (enqueue)
│
├── languages/                 # Переводы (PO/MO/JSON)
│
└── doc/                       # Документация (вы здесь)
```

---

## 3. Жизненный цикл плагина

### 3.1 Инициализация (PHP)

```
plugins_loaded
  └─ Plugin::loadTextDomain()      # Загрузка переводов

init (priority 0)
  └─ Plugin::perInit()
       └─ add_action('init', gutenbergBlocksInit)

init (priority 20)
  └─ Plugin::init()
       ├─ add_filter(block_categories_all, gutenbergBlocksRegisterCategory)
       └─ add_action(rest_api_init, register_image_sizes_endpoint)
```

### 3.2 Регистрация блоков

```php
// inc/Plugin.php
public static function getBlocksName(): array {
    return [
        'button',
        'section',
        'row',
        'column',
        'columns',
        'heading-subtitle',
    ];
}

public static function gutenbergBlocksInit(): void {
    foreach (self::getBlocksName() as $block_name) {
        register_block_type(self::getBasePath() . '/build/blocks/' . $block_name);
    }
}
```

### 3.3 Категория блоков

Все блоки плагина регистрируются в категории `codeweber-gutenberg-blocks` и отображаются в редакторе под названием **«Codeweber Gutenberg Blocks»**.

---

## 4. Константы и глобальные переменные

| Константа | Значение | Описание |
|-----------|----------|----------|
| `GUTENBERG_BLOCKS_VERSION` | `0.1.0` | Версия плагина |
| `GUTENBERG_BLOCKS_URL` | `plugin_dir_url(__FILE__)` | URL до корня плагина |
| `GUTENBERG_BLOCKS_INC_URL` | `GUTENBERG_BLOCKS_URL . 'includes/'` | URL до includes/ |

---

## 5. REST API эндпоинты

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/wp-json/codeweber-gutenberg-blocks/v1/image-sizes` | Список зарегистрированных размеров изображений |

**Пример ответа:**

```json
[
  { "value": "thumbnail", "label": "Thumbnail (150x150)", "width": 150, "height": 150 },
  { "value": "medium", "label": "Medium (300x300)", "width": 300, "height": 300 },
  { "value": "large", "label": "Large (1024x1024)", "width": 1024, "height": 1024 }
]
```

---

## 6. Зависимости

### 6.1 npm (package.json)

| Пакет | Версия | Назначение |
|-------|--------|------------|
| `@wordpress/scripts` | ^25.4.0 | Сборка, линтинг, dev-server |
| `@wordpress/blocks` | ^12.4.0 | API регистрации блоков |
| `@wordpress/block-editor` | ^11.4.0 | Компоненты редактора |
| `@wordpress/components` | ^23.4.0 | UI-компоненты (только Inspector) |
| `@wordpress/i18n` | ^4.27.0 | Локализация |

### 6.2 PHP

- WordPress ≥ 6.1
- PHP ≥ 7.4
- Тема `codeweber` (обязательно)

---

## 7. Сборка и скрипты

| Команда | Описание |
|---------|----------|
| `npm install` | Установка зависимостей |
| `npm run start` | Dev-режим с hot-reload |
| `npm run build` | Production-сборка |
| `npm run lint:js` | Проверка JS/JSX |
| `npm run lint:css` | Проверка SCSS |
| `npm run format` | Форматирование Prettier |
| `npm run plugin-zip` | Создание ZIP-архива |

---

## 8. Локализация

- **Text Domain:** `codeweber-gutenberg-blocks`
- **Файлы:** `languages/naviddev-gutenberg-blocks-*.po/mo/json`
- **Генерация:** `node generate-pot.js` → `wp i18n make-json build/blocks`

---

## 9. Связанные документы

| Документ | Описание |
|----------|----------|
| `QUICK_START.md` | Быстрый старт, окружение, чек-листы |
| `DEV_WORKFLOW.md` | Полный цикл разработки |
| `GUTENBERG_BLOCK_STANDARDS.md` | Требования к блокам |
| `BLOCKS_REFERENCE.md` | Справочник по всем блокам |
| `COMPONENTS_REFERENCE.md` | Справочник по shared-компонентам |
| `API_REFERENCE.md` | REST API и PHP-хуки |
| `REFACTORING_GUIDE.md` | Чек-лист рефакторинга |

---

## 10. Для AI-агентов

### 10.1 Быстрый поиск

- **Добавить новый блок:** см. `BLOCKS_REFERENCE.md` → раздел «Создание нового блока».
- **Изменить настройки блока:** `src/blocks/<block-name>/block.json` (атрибуты), `edit.js` (Inspector).
- **Добавить REST endpoint:** `inc/Plugin.php` → `register_image_sizes_endpoint()` как пример.
- **Добавить страницу настроек:** `settings/options_page/`.

### 10.2 Контекст для модификаций

При работе с плагином учитывайте:

1. **Стили:** Всегда использовать классы темы `codeweber` (Bootstrap). Проверять в <https://sandbox.elemisthemes.com/index.html>.
2. **Gutenberg-компоненты:** Только в Inspector. На фронте — HTML + классы темы.
3. **Атрибуты:** Живут в `block.json`. При изменении — добавлять `deprecated` миграцию.
4. **Локализация:** Все строки через `__()` / `sprintf()` из `@wordpress/i18n`.
5. **Сборка:** После изменений — `npm run build`. Папка `build/` в Git.

### 10.3 Типичные задачи

| Задача | Файлы для изменения |
|--------|---------------------|
| Добавить атрибут в блок | `src/blocks/<name>/block.json`, `edit.js`, `save.js` |
| Добавить панель в Inspector | `src/blocks/<name>/edit.js`, возможно `src/components/` |
| Создать shared-компонент | `src/components/<name>/`, затем импорт в блоках |
| Добавить утилиту | `src/utilities/<name>.js` |
| Добавить REST endpoint | `inc/Plugin.php` или `settings/api/restapi.js` |
| Добавить перевод | `languages/*.po`, затем `generate-pot.js` |

