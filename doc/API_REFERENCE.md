# API REFERENCE · REST API и PHP-хуки

> Справочник по REST API эндпоинтам, PHP-хукам и интеграциям плагина.

---

## 0. Обзор

| Тип | Количество | Описание |
|-----|------------|----------|
| REST API | 1 эндпоинт | Получение размеров изображений |
| PHP Actions | 3 | Инициализация, загрузка переводов |
| PHP Filters | 1 | Регистрация категории блоков |
| Options API | Страница настроек | Глобальные опции плагина |

---

## 1. REST API

### 1.1 GET /image-sizes

**Endpoint:** `/wp-json/codeweber-gutenberg-blocks/v1/image-sizes`

**Описание:** Возвращает список зарегистрированных размеров изображений WordPress.

**Метод:** `GET`

**Авторизация:** Публичный доступ (`permission_callback: '__return_true'`)

**Ответ:**

```json
[
  {
    "value": "thumbnail",
    "label": "Thumbnail (150x150)",
    "width": 150,
    "height": 150,
    "crop": true
  },
  {
    "value": "medium",
    "label": "Medium (300x300)",
    "width": 300,
    "height": 300
  },
  {
    "value": "large",
    "label": "Large (1024x1024)",
    "width": 1024,
    "height": 1024
  },
  {
    "value": "full",
    "label": "Full",
    "width": null,
    "height": null
  }
]
```

**Использование в JS:**

```javascript
import apiFetch from '@wordpress/api-fetch';

const fetchImageSizes = async () => {
  try {
    const sizes = await apiFetch({
      path: '/codeweber-gutenberg-blocks/v1/image-sizes',
    });
    return sizes;
  } catch (error) {
    console.error('Failed to fetch image sizes:', error);
    return [];
  }
};
```

**PHP-реализация:**

```php
// inc/Plugin.php

public static function register_image_sizes_endpoint() {
    register_rest_route('codeweber-gutenberg-blocks/v1', '/image-sizes', [
        'methods' => 'GET',
        'callback' => __CLASS__ . '::get_image_sizes_callback',
        'permission_callback' => '__return_true',
    ]);
}

public static function get_image_sizes_callback() {
    $image_sizes = [];
    $registered_sizes = get_intermediate_image_sizes();

    foreach ($registered_sizes as $size_key) {
        $size_data = [
            'value' => $size_key,
            'label' => ucfirst($size_key),
            'width' => null,
            'height' => null,
        ];

        // Get size details
        if (isset($GLOBALS['_wp_additional_image_sizes'][$size_key])) {
            $size_info = $GLOBALS['_wp_additional_image_sizes'][$size_key];
            $size_data['width'] = $size_info['width'];
            $size_data['height'] = $size_info['height'];
            $size_data['crop'] = $size_info['crop'];
        } elseif (in_array($size_key, ['thumbnail', 'medium', 'large'])) {
            $size_data['width'] = get_option($size_key . '_size_w');
            $size_data['height'] = get_option($size_key . '_size_h');
        }

        if ($size_data['width'] && $size_data['height']) {
            $size_data['label'] = sprintf('%s (%dx%d)', ucfirst($size_key), $size_data['width'], $size_data['height']);
        }

        $image_sizes[] = $size_data;
    }

    return new \WP_REST_Response($image_sizes, 200);
}
```

---

## 2. PHP Actions

### 2.1 plugins_loaded

**Hook:** `plugins_loaded`

**Callback:** `Codeweber\Blocks\Plugin::loadTextDomain`

**Описание:** Загрузка текстового домена для локализации.

```php
add_action('plugins_loaded', __NAMESPACE__ . '\Plugin::loadTextDomain');
```

### 2.2 init (priority 0)

**Hook:** `init`

**Priority:** `0`

**Callback:** `Codeweber\Blocks\Plugin::perInit`

**Описание:** Ранняя инициализация — добавление хука для регистрации блоков.

```php
add_action('init', __NAMESPACE__ . '\Plugin::perInit', 0);

public static function perInit(): void {
    add_action('init', __CLASS__ . '::gutenbergBlocksInit');
}
```

### 2.3 init (priority 20)

**Hook:** `init`

**Priority:** `20`

**Callback:** `Codeweber\Blocks\Plugin::init`

**Описание:** Основная инициализация — регистрация категории блоков и REST API.

```php
add_action('init', __NAMESPACE__ . '\Plugin::init', 20);

public static function init(): void {
    // Регистрация категории
    add_filter('block_categories_all', __CLASS__ . '::gutenbergBlocksRegisterCategory', 10, 2);
    
    // Регистрация REST API
    add_action('rest_api_init', __CLASS__ . '::register_image_sizes_endpoint');
}
```

---

## 3. PHP Filters

### 3.1 block_categories_all

**Filter:** `block_categories_all` (WP ≥ 5.7) / `block_categories` (WP < 5.7)

**Callback:** `Codeweber\Blocks\Plugin::gutenbergBlocksRegisterCategory`

**Описание:** Регистрация категории блоков "Codeweber Gutenberg Blocks".

```php
public static function gutenbergBlocksRegisterCategory($categories, $post): array {
    return [
        [
            'slug'  => 'codeweber-gutenberg-blocks',
            'title' => __('Codeweber Gutenberg Blocks', Plugin::L10N),
        ],
        ...$categories,
    ];
}
```

**Результат:** Категория отображается первой в списке блоков редактора.

---

## 4. Регистрация блоков

### 4.1 Список блоков

```php
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
```

### 4.2 Регистрация

```php
public static function gutenbergBlocksInit(): void {
    foreach (self::getBlocksName() as $block_name) {
        register_block_type(self::getBasePath() . '/build/blocks/' . $block_name);
    }
}
```

**Важно:** Блоки регистрируются автоматически на основе `block.json` из папки `build/blocks/`.

### 4.3 Добавление нового блока

1. Добавить имя блока в массив `getBlocksName()`:

```php
public static function getBlocksName(): array {
    return [
        'button',
        'section',
        'row',
        'column',
        'columns',
        'heading-subtitle',
        'new-block',  // Добавить сюда
    ];
}
```

2. Создать структуру блока в `src/blocks/new-block/`
3. Выполнить `npm run build`

---

## 5. Страница настроек

### 5.1 Структура

```
settings/
├── options_page/
│   ├── options.php           # Регистрация меню и страницы
│   ├── functions.php         # Вспомогательные функции
│   ├── register_fields.php   # Регистрация полей
│   ├── fields.json           # Конфигурация полей
│   ├── class-options-tabs.php # Класс вкладок
│   ├── restapi.php           # REST API для настроек
│   └── pages/
│       ├── page_2.php
│       ├── page_3.php
│       └── page_4.php
└── api/
    └── restapi.js            # JS для REST-запросов
```

### 5.2 Регистрация страницы

```php
// settings/options_page/options.php

namespace Naviddev\GutenbergBlocks;

function add_settings_page() {
    add_menu_page(
        'Настройки плагина',           // Название страницы
        'Настройки плагина',           // Название в меню
        'manage_options',              // Права доступа
        'gutenberg_blocks_settings',   // Слаг страницы
        __NAMESPACE__ . '\settings_page', // Callback
        'dashicons-admin-generic'      // Иконка
    );
}
add_action('admin_menu', __NAMESPACE__ . '\add_settings_page');
```

### 5.3 Вкладки настроек

```php
// settings/options_page/class-options-tabs.php

namespace Naviddev\GutenbergBlocks;

class Options_Tabs {
    public static function create_tabs() {
        // Рендер вкладок
    }
}
```

### 5.4 Использование настроек

```php
// Получение опции
$option_value = get_option('gutenberg_blocks_option_name', 'default_value');

// Сохранение опции
update_option('gutenberg_blocks_option_name', $new_value);
```

---

## 6. Константы

| Константа | Определение | Описание |
|-----------|-------------|----------|
| `GUTENBERG_BLOCKS_VERSION` | `'0.1.0'` | Версия плагина |
| `GUTENBERG_BLOCKS_URL` | `plugin_dir_url(__FILE__)` | URL до корня плагина |
| `GUTENBERG_BLOCKS_INC_URL` | `GUTENBERG_BLOCKS_URL . 'includes/'` | URL до includes/ |

### Использование

```php
// Подключение скрипта
wp_enqueue_script(
    'gutenberg-blocks-lib',
    GUTENBERG_BLOCKS_INC_URL . 'js/plugin.js',
    [],
    GUTENBERG_BLOCKS_VERSION,
    true
);
```

---

## 7. Класс Plugin

### 7.1 Константы класса

```php
class Plugin {
    const PREFIX = 'codeweber-gutenberg-blocks';
    const L10N = self::PREFIX;
}
```

### 7.2 Статические методы

| Метод | Описание |
|-------|----------|
| `perInit()` | Ранняя инициализация |
| `init()` | Основная инициализация |
| `getBlocksName()` | Список имён блоков |
| `gutenbergBlocksInit()` | Регистрация блоков |
| `gutenbergBlocksRegisterCategory($categories, $post)` | Регистрация категории |
| `gutenbergBlocksExternalLibraries()` | Подключение внешних библиотек |
| `register_image_sizes_endpoint()` | Регистрация REST endpoint |
| `get_image_sizes_callback()` | Callback для REST endpoint |
| `loadTextDomain()` | Загрузка переводов |
| `getBaseUrl()` | URL плагина |
| `getBasePath()` | Путь к плагину |

---

## 8. Локализация

### 8.1 Текстовый домен

```php
const L10N = 'codeweber-gutenberg-blocks';
```

### 8.2 Загрузка переводов

```php
public static function loadTextDomain(): void {
    load_plugin_textdomain(
        static::L10N,
        false,
        static::L10N . '/languages/'
    );
}
```

### 8.3 Файлы переводов

```
languages/
├── naviddev-gutenberg-blocks.pot          # Шаблон переводов
├── naviddev-gutenberg-blocks-ru_RU.po     # Русский перевод (исходник)
├── naviddev-gutenberg-blocks-ru_RU.mo     # Русский перевод (скомпилированный)
├── naviddev-gutenberg-blocks-ru_RU.l10n.php # PHP-формат
└── naviddev-gutenberg-blocks-ru_RU-*.json # JSON для JS
```

### 8.4 Генерация переводов

```bash
# Генерация POT
node generate-pot.js

# Генерация JSON для JS
wp i18n make-json build/blocks
```

---

## 9. Для AI-агентов

### 9.1 Быстрый поиск

| Задача | Где искать |
|--------|------------|
| Добавить REST endpoint | `inc/Plugin.php` → `register_rest_route()` |
| Добавить блок | `inc/Plugin.php` → `getBlocksName()` |
| Изменить категорию | `inc/Plugin.php` → `gutenbergBlocksRegisterCategory()` |
| Добавить опцию | `settings/options_page/` |
| Добавить перевод | `languages/*.po` → `generate-pot.js` |

### 9.2 Типичные задачи

#### Добавить новый REST endpoint

```php
// В inc/Plugin.php

// 1. Добавить регистрацию в init()
public static function init(): void {
    // ...existing code...
    add_action('rest_api_init', __CLASS__ . '::register_my_endpoint');
}

// 2. Добавить метод регистрации
public static function register_my_endpoint() {
    register_rest_route('codeweber-gutenberg-blocks/v1', '/my-endpoint', [
        'methods' => 'GET',
        'callback' => __CLASS__ . '::my_endpoint_callback',
        'permission_callback' => function() {
            return current_user_can('edit_posts');
        },
    ]);
}

// 3. Добавить callback
public static function my_endpoint_callback(\WP_REST_Request $request) {
    $data = [/* ... */];
    return new \WP_REST_Response($data, 200);
}
```

#### Добавить динамический блок с render_callback

```php
// В inc/Plugin.php

// 1. Изменить gutenbergBlocksInit()
public static function gutenbergBlocksInit(): void {
    foreach (self::getBlocksName() as $block_name) {
        $args = [];
        
        // Для динамических блоков
        if ($block_name === 'my-dynamic-block') {
            $args['render_callback'] = __CLASS__ . '::render_my_dynamic_block';
        }
        
        register_block_type(
            self::getBasePath() . '/build/blocks/' . $block_name,
            $args
        );
    }
}

// 2. Добавить render_callback
public static function render_my_dynamic_block($attributes, $content) {
    ob_start();
    ?>
    <div class="my-dynamic-block">
        <?php echo esc_html($attributes['title']); ?>
    </div>
    <?php
    return ob_get_clean();
}
```

### 9.3 Проверка работоспособности

```bash
# Проверить REST API
curl http://localhost/wp-json/codeweber-gutenberg-blocks/v1/image-sizes

# Проверить регистрацию блоков (в консоли браузера)
wp.blocks.getBlockTypes().filter(b => b.name.startsWith('codeweber'))
```

