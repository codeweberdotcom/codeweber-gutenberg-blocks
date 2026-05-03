# Yandex Map v3 Block — Migration Plan

## Зачем новый блок

Yandex Maps API 2.1 (`api-maps.yandex.ru/2.1/`) не поддерживает официально:
- `customMapStyle` (только внутренняя недокументированная опция)
- Тёмную тему (`lightness` в stylers игнорируется)
- Любую надёжную кастомизацию цветов тайлов

API v3 (`js.api.maps.yandex.ru/3.0/`) имеет нативно:
- `theme: 'dark'` — встроенная тёмная тема
- `customization: [...]` — полный JSON-стайлинг с `tags`, `elements`, `stylers`
- Современная архитектура (компонентная, async/await)

**Стратегия:** создать новый блок `yandex-map-v3` параллельно. Старый `yandex-map` (v2) остаётся нетронутым. После полного тестирования v3 — старый блок помечается `deprecated`.

---

## Ключевые отличия API v3 от v2

| Аспект | v2 | v3 |
|--------|----|----|
| Namespace | `ymaps` | `ymaps3` |
| Инициализация | `new ymaps.Map(el, {center, zoom})` | `new YMap(el, {location: {center, zoom}})` |
| **Порядок координат** | `[latitude, longitude]` | `[longitude, latitude]` ← ВАЖНО |
| Тайлы | встроены в `YMap` | `new YMapDefaultSchemeLayer({theme})` |
| Маркер | `new ymaps.Placemark([lat,lng], props, opts)` | `new YMapMarker({coordinates:[lng,lat]}, domEl)` |
| Кластер | `new ymaps.Clusterer(opts)` | `@yandex/ymaps3-clusterer@0.0.1` (отдельный пакет) |
| Баллун | `openBalloon()` | Кастомный DOM через `YMapPopup` или `YMapHint` |
| Контролы | `controls: ['zoomControl']` в опциях Map | отдельные компоненты `YMapZoomControl` и т.д. |
| Тёмная тема | не поддерживается | `YMapDefaultSchemeLayer({ theme: 'dark' })` |
| Кастом стиль | `map.options.set('customMapStyle', json)` (ненадёжно) | `YMapDefaultSchemeLayer({ customization: json })` |
| Скрипт | `api-maps.yandex.ru/2.1/?apikey=KEY&lang=ru_RU` | `js.api.maps.yandex.ru/3.0/?apikey=KEY&lang=ru_RU` |
| Готовность API | `ymaps.ready(fn)` | `await ymaps3.ready` (Promise) |

---

## Структура файлов нового блока

```
src/blocks/yandex-map-v3/
├── block.json          # Атрибуты, регистрация
├── index.js            # registerBlockType
├── edit.js             # Editor UI (ServerSideRender)
├── sidebar.js          # Inspector Controls
├── render.php          # Server-side render (dynamic block)
├── style.scss          # Frontend стили
├── editor.scss         # Editor-only стили
└── assets/
    └── yandex-map-v3.js  # Frontend JS инициализация (v3 API)
```

В `inc/Plugin.php` — зарегистрировать `render_callback` и enqueue для `yandex-map-v3.js`.

---

## Атрибуты block.json (Фаза 1)

```json
{
  "center":          { "type": "object",  "default": {"lat": 55.76, "lng": 37.64} },
  "zoom":            { "type": "number",  "default": 10 },
  "height":          { "type": "number",  "default": 500 },
  "borderRadius":    { "type": "number",  "default": 8 },
  "mapType":         { "type": "string",  "default": "normal" },
  "colorScheme":     { "type": "string",  "default": "light" },
  "customStyleJson": { "type": "string",  "default": "" },
  "dataSource":      { "type": "string",  "default": "offices" },
  "officesQuery":    { "type": "object",  "default": {...} },
  "customMarkers":   { "type": "array",   "default": [] },
  "markerColor":     { "type": "string",  "default": "#FF0000" },
  "balloonFields":   { "type": "object",  "default": {...} },
  "enableScrollZoom":{ "type": "boolean", "default": true },
  "enableDrag":      { "type": "boolean", "default": true },
  "blockClass":      { "type": "string",  "default": "" },
  "blockId":         { "type": "string",  "default": "" }
}
```

**Не в Фазе 1** (добавим позже): clustering, sidebar, route button, geolocation.

### mapType values (v3)
- `normal` — обычная карта (было `yandex#map` в v2)
- `satellite` — спутник
- `hybrid` — гибрид

### colorScheme values (v3)
- `light` — стандартная (по умолчанию)
- `dark` — нативная тёмная тема через `theme: 'dark'`
- `grayscale` — через customization JSON
- `pale` — через customization JSON
- `sepia` — через customization JSON
- `custom` — пользовательский JSON в `customStyleJson`

---

## PHP: render.php

```php
// 1. Считать атрибуты
// 2. Подготовить маркеры (офисы из CPT или кастомные)
//    ВАЖНО: v3 использует [longitude, latitude], а не [lat, lng]!
// 3. Передать данные через data-атрибут на контейнер
// 4. Вывести контейнер с уникальным ID

$map_data = [
    'id'          => $map_id,
    'center'      => [$center['lng'], $center['lat']], // v3: [lng, lat]
    'zoom'        => $zoom,
    'mapType'     => $map_type,
    'colorScheme' => $color_scheme,
    'customStyle' => $custom_style_json,
    'markers'     => $markers,          // каждый: ['coords'=>[lng,lat], ...]
    'balloon'     => $balloon_fields,
    'behavior'    => [...],
];

echo '<div class="cwgb-yandex-map-v3-block" 
           data-map-v3="' . esc_attr(wp_json_encode($map_data)) . '"
           style="height:' . $height . 'px; border-radius:' . $border_radius . 'px;"
      ></div>';
```

Контейнер использует `data-map-v3` (отличается от `data-map-config` у v2) — чтобы два скрипта не конфликтовали.

---

## JS: yandex-map-v3.js (Frontend)

```js
(function() {
    async function initMap(container) {
        const config = JSON.parse(container.dataset.mapV3);
        await ymaps3.ready;

        const {
            YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer,
            YMapMarker, YMapListener, YMapControls
        } = ymaps3;
        const { YMapZoomControl } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');

        // Создаём карту
        const map = new YMap(container, {
            location: { center: config.center, zoom: config.zoom },
            behaviors: buildBehaviors(config),
        });

        // Слой тайлов
        const schemeOptions = buildScheme(config); // theme / customization
        map.addChild(new YMapDefaultSchemeLayer(schemeOptions));
        map.addChild(new YMapDefaultFeaturesLayer());

        // Контролы
        map.addChild(new YMapControls({ position: 'right' })
            .addChild(new YMapZoomControl()));

        // Маркеры
        config.markers.forEach(m => addMarker(map, m, config));
    }

    function buildScheme(config) {
        const presets = {
            light:     { theme: 'light' },
            dark:      { theme: 'dark' },
            grayscale: { customization: [{ stylers: [{ saturation: -1 }] }] },
            pale:      { customization: [{ stylers: [{ saturation: -0.5 }, { lightness: 0.3 }] }] },
            sepia:     { customization: [{ tags: { any: ['water'] }, stylers: [{ color: '#c9a87a' }] }, ...] },
        };
        if (config.colorScheme === 'custom' && config.customStyle) {
            try { return { customization: JSON.parse(config.customStyle) }; } catch(e) {}
        }
        return presets[config.colorScheme] || { theme: 'light' };
    }

    function addMarker(map, markerData, config) {
        const el = document.createElement('div');
        el.className = 'cwgb-map-v3-marker';
        el.style.cssText = `width:14px;height:14px;background:${config.markerColor};
                            border:2px solid #fff;border-radius:50%;cursor:pointer;`;
        const marker = new ymaps3.YMapMarker(
            { coordinates: markerData.coords },
            el
        );
        map.addChild(marker);
        // TODO: balloon on click (Phase 2)
    }

    // Инициализация при загрузке страницы
    document.querySelectorAll('[data-map-v3]').forEach(el => initMap(el));
})();
```

---

## PHP: регистрация скрипта v3 API

В `inc/Plugin.php` (или в отдельном хуке темы):

```php
// Загрузить v3 API только если есть блок на странице
add_action('wp_enqueue_scripts', function() {
    if (!is_admin()) {
        $api_key = class_exists('Redux') 
            ? Redux::get_option('redux_demo', 'yandexapi') 
            : '';
        if ($api_key) {
            wp_register_script(
                'yandex-maps-api-v3',
                'https://js.api.maps.yandex.ru/3.0/?apikey=' . urlencode($api_key) . '&lang=ru_RU',
                [], null, false
            );
        }
    }
});
```

Скрипт регистрируется, но подключается только если блок присутствует (через `viewScript` в `block.json` или через `wp_enqueue_script` в `render.php`).

---

## Inspector Controls (sidebar.js)

**Вкладка Main:**
- Data Source (select: offices / custom)
- Map Center (CoordinateControl — переиспользуем из v2)
- Zoom (RangeControl)
- Height (RangeControl)
- Map Type (select: normal / satellite / hybrid)
- Color Scheme (select: light / dark / grayscale / pale / sepia / custom)
- Custom Style JSON (textarea, visible only when scheme = 'custom')
- Border Radius (RangeControl)

**Вкладка Markers:**
- Marker Color (ColorPicker)
- If offices: OfficesQueryControl (переиспользуем из v2)
- If custom: MarkerRepeaterControl (переиспользуем из v2, но инвертируем lat/lng при сохранении!)

**Вкладка Advanced:**
- Enable Scroll Zoom (toggle)
- Enable Drag (toggle)
- Block Meta (BlockMetaFields)

---

## Критический момент: координаты

В v2: `[latitude, longitude]` — т.е. `[55.76, 37.64]`
В v3: `[longitude, latitude]` — т.е. `[37.64, 55.76]`

**Это нужно учесть в:**
- `render.php` — при передаче `center` и координат маркеров
- `sidebar.js` — CoordinateControl отображает как lat/lng (удобно), но в PHP инвертируем
- `MarkerRepeaterControl` — при сохранении координат маркеров

---

## Фазы реализации

### Фаза 1 (текущая задача)
- [ ] Создать `src/blocks/yandex-map-v3/` со всеми файлами
- [ ] `block.json` с атрибутами Фазы 1
- [ ] `render.php` — подготовка данных + вывод контейнера
- [ ] `yandex-map-v3.js` — инициализация карты + color scheme + маркеры (без баллунов)
- [ ] `sidebar.js` — Main + Markers + Advanced вкладки
- [ ] `edit.js` — ServerSideRender как у v2
- [ ] Зарегистрировать в `inc/Plugin.php`
- [ ] Сборка `npm run build`

### Фаза 2
- [ ] Баллуны при клике на маркер (кастомный DOM-попап)
- [ ] Поиск/выбор координат через мини-карту в MarkerRepeaterControl
- [ ] Кластеризация через `@yandex/ymaps3-clusterer`

### Фаза 3
- [ ] Сайдбар со списком офисов
- [ ] Полный migration guide — как перенести контент со старого блока

### После завершения Фазы 3
- [ ] Добавить `deprecated` в старый блок `yandex-map` (v2)
- [ ] Документация для редакторов

---

## Риски и решения

| Риск | Решение |
|------|---------|
| Оба блока на одной странице — конфликт скриптов | `data-map-v3` vs `data-map-config` — разные атрибуты, разные скрипты |
| Разные API-ключи v2/v3 | Один ключ работает для обоих API у Яндекса |
| MarkerRepeaterControl инвертирует координаты | Инвертировать при сохранении в render.php, сохранять в block.json как lat/lng |
| v3 не умеет ничего из Фазы 1 кроме base+markers | Этого достаточно для тестирования dark theme — главной цели |

---

## Rollback

Старый блок `yandex-map` (v2) НЕ изменяется в процессе миграции. Если v3 блок окажется нерабочим:
1. Просто не использовать новый блок
2. `npm run build` без v3-блока (удалить папку и пересобрать)
3. Все существующие страницы с v2-блоком продолжают работать

---

## Оценка трудозатрат Фазы 1

| Задача | Оценка |
|--------|--------|
| block.json + edit.js + index.js | 30 мин |
| render.php (данные + маркеры из офисов) | 2 ч |
| yandex-map-v3.js (карта + схемы + маркеры) | 3 ч |
| sidebar.js (3 вкладки) | 2 ч |
| Plugin.php регистрация | 30 мин |
| Тестирование + отладка | 2 ч |
| **Итого Фаза 1** | **~10 ч** |
