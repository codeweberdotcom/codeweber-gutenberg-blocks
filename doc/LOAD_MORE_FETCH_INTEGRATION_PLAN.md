# План интеграции системы Fetch с компонентом Load More

## Общая информация

**Цель:** Заменить REST API на систему Fetch для компонента Load More  
**Дата создания:** 2025-01-06  
**Приоритет:** Высокий

---

## Текущее состояние

### Текущая реализация Load More

**Backend:**
- Использует WordPress REST API (`/wp-json/codeweber-gutenberg-blocks/v1/load-more`)
- Класс `LoadMoreAPI` в `inc/LoadMoreAPI.php`
- Методы: `load_more_image_simple()`, `load_more_post_grid()`

**Frontend:**
- JavaScript в `includes/js/load-more.js`
- Использует Fetch API напрямую
- Отправляет JSON запросы к REST API

### Система Fetch

**Backend:**
- Использует WordPress Admin AJAX (`admin-ajax.php`)
- Обработчик `handle_fetch_action()` в `functions/fetch/fetch-handler.php`
- Маршрутизация по `actionType`

**Frontend:**
- JavaScript в `functions/fetch/assets/js/fetch-handler.js`
- Автоматическая обработка элементов с `data-fetch`
- Использует FormData для отправки

---

## Цели интеграции

1. ✅ Заменить REST API на систему Fetch
2. ✅ Сохранить всю существующую функциональность
3. ✅ Обеспечить обратную совместимость
4. ✅ Упростить код и использовать единую систему AJAX
5. ✅ Сохранить переинициализацию компонентов темы

---

## План реализации

### Этап 1: Доработка системы Fetch (Backend)

#### 1.1. Создание функции loadMoreItems

**Файл:** `wp-content/themes/codeweber/functions/fetch/loadMoreItems.php`

**Задачи:**
- [ ] Создать функцию `loadMoreItems($params)` в namespace `Codeweber\Functions\Fetch`
- [ ] Адаптировать логику из `LoadMoreAPI::load_more_items()`
- [ ] Поддержать оба типа блоков: `image-simple` и `post-grid`
- [ ] Вернуть структуру ответа в формате Fetch: `['status' => 'success', 'data' => [...]]`

**Структура функции:**
```php
namespace Codeweber\Functions\Fetch;

function loadMoreItems($params) {
    // Получаем параметры
    $block_id = $params['block_id'] ?? '';
    $block_type = $params['block_type'] ?? '';
    $offset = isset($params['offset']) ? (int) $params['offset'] : 0;
    $count = isset($params['count']) ? (int) $params['count'] : 6;
    $block_attributes_json = $params['block_attributes'] ?? '';
    
    // Валидация
    if (!$block_id) {
        return [
            'status' => 'error',
            'message' => 'Block ID is required'
        ];
    }
    
    // Загружаем LoadMoreAPI класс из плагина
    // Вызываем соответствующий метод
    // Возвращаем результат в формате Fetch
}
```

**Зависимости:**
- Использовать методы из `LoadMoreAPI` класса плагина
- Или перенести логику в тему (если нужно)

#### 1.2. Регистрация функции в fetch-handler.php

**Файл:** `wp-content/themes/codeweber/functions/fetch/fetch-handler.php`

**Задачи:**
- [ ] Добавить `require_once` для `loadMoreItems.php`
- [ ] Добавить обработку `actionType === 'loadMoreItems'` в `handle_fetch_action()`

**Изменения:**
```php
require_once __DIR__ . '/loadMoreItems.php';

function handle_fetch_action() {
    $actionType = $_POST['actionType'] ?? null;
    $params = json_decode(stripslashes($_POST['params'] ?? '[]'), true);
    
    // ... существующие обработчики ...
    
    if ($actionType === 'loadMoreItems') {
        $response = loadMoreItems($params);
        wp_send_json($response);
    }
    
    // ...
}
```

#### 1.3. Адаптация структуры ответа

**Задачи:**
- [ ] Преобразовать формат ответа из REST API в формат Fetch
- [ ] Сохранить все данные: `html`, `has_more`, `offset`

**Формат ответа Fetch:**
```php
return [
    'status' => 'success',
    'data' => [
        'html' => $html,
        'has_more' => $has_more,
        'offset' => $offset
    ]
];
```

---

### Этап 2: Доработка JavaScript (Frontend)

#### 2.1. Создание универсального Fetch обработчика для Load More

**Файл:** `wp-content/themes/codeweber/functions/fetch/assets/js/fetch-load-more.js`

**Задачи:**
- [ ] Создать специализированный обработчик для Load More
- [ ] Поддержать существующие data-атрибуты: `data-block-id`, `data-block-type`, etc.
- [ ] Сохранить логику переинициализации компонентов темы
- [ ] Сохранить прокрутку к новому контенту

**Структура:**
```javascript
(function() {
    'use strict';
    
    function initLoadMoreFetch() {
        const loadMoreButtons = document.querySelectorAll('.cwgb-load-more-btn');
        
        loadMoreButtons.forEach(button => {
            // Проверка инициализации
            if (button.dataset.initialized === 'true') {
                return;
            }
            
            button.dataset.initialized = 'true';
            
            button.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Получаем параметры из контейнера
                const container = button.closest('.cwgb-load-more-container');
                // ... логика загрузки через Fetch ...
            });
        });
    }
    
    // Инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoadMoreFetch);
    } else {
        initLoadMoreFetch();
    }
})();
```

#### 2.2. Интеграция с существующим load-more.js

**Вариант A: Замена (рекомендуется)**
- [ ] Заменить логику в `load-more.js` на использование Fetch системы
- [ ] Удалить прямые вызовы REST API
- [ ] Использовать `fetch_vars.ajaxurl` вместо `cwgbLoadMore.restUrl`

**Вариант B: Гибридный подход**
- [ ] Добавить проверку наличия Fetch системы
- [ ] Использовать Fetch если доступна, иначе REST API (fallback)

**Рекомендуется Вариант A** для единообразия.

#### 2.3. Сохранение функциональности

**Обязательно сохранить:**
- [ ] Состояние загрузки (disabled, loading text)
- [ ] Обработку ошибок
- [ ] Вставку HTML в контейнер `.cwgb-load-more-items`
- [ ] Обновление offset в data-атрибутах
- [ ] Скрытие кнопки при `has_more === false`
- [ ] Переинициализацию компонентов темы (`reinitializeTheme()`)
- [ ] Прокрутку к новому контенту

---

### Этап 3: Адаптация структуры данных

#### 3.1. Преобразование параметров запроса

**Текущий формат (REST API):**
```javascript
{
    block_id: "block-id",
    block_type: "post-grid",
    block_attributes: "{...}", // JSON string
    offset: 6,
    count: 6,
    post_id: 123
}
```

**Новый формат (Fetch):**
```javascript
{
    block_id: "block-id",
    block_type: "post-grid",
    block_attributes: "{...}", // JSON string
    offset: 6,
    count: 6,
    post_id: 123
}
```

**Изменения:** Формат остается тем же, меняется только способ отправки.

#### 3.2. Преобразование ответа

**Текущий формат (REST API):**
```json
{
    "success": true,
    "data": {
        "html": "...",
        "has_more": true,
        "offset": 12
    }
}
```

**Новый формат (Fetch):**
```json
{
    "status": "success",
    "data": {
        "html": "...",
        "has_more": true,
        "offset": 12
    }
}
```

**Адаптация:** Изменить проверку `data.success` на `result.status === 'success'`

---

### Этап 4: Обновление подключений

#### 4.1. Обновление enqueues.php (плагин)

**Файл:** `wp-content/plugins/codeweber-gutenberg-blocks/inc/Plugin.php`

**Задачи:**
- [ ] Убедиться, что `fetch-handler.js` подключен (или подключить)
- [ ] Удалить или оставить `cwgbLoadMore` локализацию (для fallback)
- [ ] Проверить зависимости скриптов

#### 4.2. Проверка подключения Fetch системы

**Файл:** `wp-content/themes/codeweber/functions/enqueues.php`

**Задачи:**
- [ ] Убедиться, что `fetch-handler.js` подключается
- [ ] Проверить, что `fetch_vars` локализованы
- [ ] Убедиться, что скрипт загружается до `load-more.js`

---

### Этап 5: Миграция и обратная совместимость

#### 5.1. Стратегия миграции

**Подход:**
1. Добавить новую функциональность параллельно со старой
2. Добавить флаг для переключения между системами
3. Постепенно мигрировать на Fetch
4. Удалить старый код после тестирования

#### 5.2. Обратная совместимость

**Задачи:**
- [ ] Сохранить старый REST API endpoint (на время миграции)
- [ ] Добавить проверку наличия Fetch системы
- [ ] Fallback на REST API если Fetch недоступна
- [ ] Логирование для отладки

**Код проверки:**
```javascript
// Проверка наличия Fetch системы
if (typeof fetch_vars !== 'undefined' && fetch_vars.ajaxurl) {
    // Используем Fetch
} else {
    // Fallback на REST API
}
```

---

### Этап 6: Тестирование

#### 6.1. Функциональное тестирование

**Тесты для Image Simple:**
- [ ] Загрузка изображений с правильным offset
- [ ] Корректное отображение HTML
- [ ] Обновление offset
- [ ] Скрытие кнопки при отсутствии элементов
- [ ] Переинициализация GLightbox
- [ ] Переинициализация Image Hover Overlay

**Тесты для Post Grid:**
- [ ] Загрузка постов с правильным offset
- [ ] Фильтрация по таксономиям
- [ ] Корректное отображение HTML
- [ ] Использование функции `cw_render_post_card()` из темы
- [ ] Обновление offset
- [ ] Скрытие кнопки при отсутствии постов
- [ ] Переинициализация всех компонентов темы

#### 6.2. Тестирование производительности

**Проверки:**
- [ ] Время отклика запросов
- [ ] Размер передаваемых данных
- [ ] Количество HTTP запросов
- [ ] Использование памяти

#### 6.3. Тестирование совместимости

**Проверки:**
- [ ] Работа в разных браузерах
- [ ] Работа с отключенным JavaScript (graceful degradation)
- [ ] Работа с кэшированием
- [ ] Работа с несколькими блоками на странице

---

### Этап 7: Документация и очистка

#### 7.1. Обновление документации

**Файлы для обновления:**
- [ ] `doc/LOAD_MORE_COMPONENT.md` - обновить информацию об AJAX
- [ ] `doc/LOAD_MORE_ANALYSIS_REPORT.md` - добавить информацию о Fetch
- [ ] `doc/AJAX_FUNCTIONS_REPORT.md` - добавить пример Load More

#### 7.2. Очистка кода

**После успешного тестирования:**
- [ ] Удалить старый REST API endpoint (опционально)
- [ ] Удалить неиспользуемый код
- [ ] Удалить fallback логику (если не нужна)
- [ ] Очистить комментарии и отладочный код

---

## Детальный план файлов

### Новые файлы

1. **`wp-content/themes/codeweber/functions/fetch/loadMoreItems.php`**
   - Функция `loadMoreItems($params)`
   - Интеграция с `LoadMoreAPI` классом плагина

### Изменяемые файлы

1. **`wp-content/themes/codeweber/functions/fetch/fetch-handler.php`**
   - Добавить require для `loadMoreItems.php`
   - Добавить обработку `loadMoreItems` в `handle_fetch_action()`

2. **`wp-content/plugins/codeweber-gutenberg-blocks/includes/js/load-more.js`**
   - Заменить REST API запросы на Fetch систему
   - Использовать `fetch_vars.ajaxurl` вместо `cwgbLoadMore.restUrl`
   - Изменить формат ответа с `success/data` на `status/data`
   - Сохранить всю остальную логику

3. **`wp-content/plugins/codeweber-gutenberg-blocks/inc/Plugin.php`** (опционально)
   - Проверить зависимости скриптов
   - Убедиться в правильном порядке загрузки

### Файлы для удаления (после миграции)

1. **`wp-content/plugins/codeweber-gutenberg-blocks/inc/LoadMoreAPI.php`** (опционально)
   - Можно оставить для использования методов внутри темы
   - Или перенести методы в тему

---

## Риски и митигация

### Риск 1: Нарушение работы существующих блоков

**Митигация:**
- Тщательное тестирование на всех типах блоков
- Постепенная миграция с возможностью отката
- Сохранение старого кода на время тестирования

### Риск 2: Проблемы с производительностью

**Митигация:**
- Сравнение производительности до и после
- Оптимизация запросов
- Кэширование где возможно

### Риск 3: Проблемы с безопасностью

**Митигация:**
- Сохранение всех проверок nonce
- Валидация всех входных данных
- Sanitization всех выходных данных

### Риск 4: Конфликты с другими плагинами

**Митигация:**
- Использование уникальных префиксов
- Проверка наличия функций перед использованием
- Graceful degradation

---

## Временная оценка

### Этап 1: Доработка Fetch (Backend)
- **Время:** 2-3 часа
- **Сложность:** Средняя

### Этап 2: Доработка JavaScript
- **Время:** 3-4 часа
- **Сложность:** Средняя-Высокая

### Этап 3: Адаптация структуры данных
- **Время:** 1 час
- **Сложность:** Низкая

### Этап 4: Обновление подключений
- **Время:** 1 час
- **Сложность:** Низкая

### Этап 5: Миграция и совместимость
- **Время:** 2-3 часа
- **Сложность:** Средняя

### Этап 6: Тестирование
- **Время:** 4-6 часов
- **Сложность:** Средняя

### Этап 7: Документация и очистка
- **Время:** 1-2 часа
- **Сложность:** Низкая

**Общее время:** 14-20 часов

---

## Порядок выполнения

### Фаза 1: Подготовка (Этапы 1-2)
1. Создать функцию `loadMoreItems()` в Fetch системе
2. Зарегистрировать обработчик
3. Адаптировать JavaScript для использования Fetch

### Фаза 2: Интеграция (Этапы 3-4)
1. Адаптировать структуру данных
2. Обновить подключения скриптов
3. Проверить работу на тестовой среде

### Фаза 3: Тестирование (Этап 6)
1. Функциональное тестирование
2. Тестирование производительности
3. Тестирование совместимости

### Фаза 4: Завершение (Этапы 5, 7)
1. Обеспечить обратную совместимость
2. Обновить документацию
3. Очистить код

---

## Критерии успеха

✅ Все существующие функции Load More работают  
✅ Используется система Fetch вместо REST API  
✅ Сохранена переинициализация компонентов темы  
✅ Нет регрессий в функциональности  
✅ Код чище и проще в поддержке  
✅ Документация обновлена  

---

## Дополнительные улучшения (опционально)

### Улучшение 1: Универсальный обработчик

Создать универсальный обработчик, который автоматически определяет тип блока и вызывает нужную функцию.

### Улучшение 2: Кэширование

Добавить кэширование результатов запросов для улучшения производительности.

### Улучшение 3: Infinite Scroll

Добавить опцию автоматической загрузки при прокрутке (infinite scroll) как альтернативу кнопке.

### Улучшение 4: Прогресс-бар

Добавить визуальный индикатор прогресса загрузки.

---

## Заключение

План интеграции системы Fetch с компонентом Load More предусматривает постепенную миграцию с сохранением всей функциональности и обеспечением обратной совместимости. Основные преимущества:

1. **Единая система AJAX** - все AJAX запросы через одну систему
2. **Упрощение кода** - меньше дублирования
3. **Лучшая поддержка** - один подход для всех AJAX операций
4. **Расширяемость** - легко добавлять новые типы блоков

Рекомендуется выполнять миграцию поэтапно с тщательным тестированием на каждом этапе.

