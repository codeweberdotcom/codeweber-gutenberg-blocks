# План интеграции Fetch с Load More - Краткая версия

## Суть задачи

Заменить REST API на систему Fetch для компонента Load More, используя единую AJAX систему темы.

---

## Основные этапы

### 1. Backend (PHP) - 2-3 часа
- ✅ Создать `functions/fetch/loadMoreItems.php`
- ✅ Зарегистрировать в `fetch-handler.php`
- ✅ Адаптировать логику из `LoadMoreAPI`

### 2. Frontend (JavaScript) - 3-4 часа
- ✅ Заменить REST API запросы на Fetch
- ✅ Использовать `fetch_vars.ajaxurl`
- ✅ Сохранить всю функциональность

### 3. Тестирование - 4-6 часов
- ✅ Image Simple блок
- ✅ Post Grid блок
- ✅ Переинициализация компонентов

### 4. Завершение - 1-2 часа
- ✅ Документация
- ✅ Очистка кода

**Общее время: 14-20 часов**

---

## Ключевые изменения

### Backend
```php
// Новый файл: functions/fetch/loadMoreItems.php
function loadMoreItems($params) {
    // Логика из LoadMoreAPI
    return ['status' => 'success', 'data' => [...]];
}
```

### Frontend
```javascript
// Заменить:
fetch('/wp-json/codeweber-gutenberg-blocks/v1/load-more', {...})

// На:
const formData = new FormData();
formData.append('action', 'fetch_action');
formData.append('actionType', 'loadMoreItems');
formData.append('params', JSON.stringify(params));
fetch(fetch_vars.ajaxurl, { method: 'POST', body: formData })
```

---

## Преимущества

1. ✅ Единая система AJAX для всего сайта
2. ✅ Упрощение кода и поддержки
3. ✅ Расширяемость для новых блоков
4. ✅ Сохранение всей функциональности

---

## Риски

- ⚠️ Нарушение работы существующих блоков → Тестирование
- ⚠️ Проблемы производительности → Оптимизация
- ⚠️ Конфликты → Graceful degradation

---

## Критерии успеха

✅ Все функции работают  
✅ Используется Fetch система  
✅ Нет регрессий  
✅ Код чище  

---

**Полный план:** `LOAD_MORE_FETCH_INTEGRATION_PLAN.md`

