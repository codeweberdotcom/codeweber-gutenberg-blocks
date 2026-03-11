---
name: lint
description: Проверить JS и CSS плагина codeweber-gutenberg-blocks через линтеры
---

Запусти линтеры плагина Codeweber Gutenberg Blocks.

Из директории `wp-content/plugins/codeweber-gutenberg-blocks/`:

## Шаг 1: Линтинг JS/JSX

```bash
npm run lint:js
```

Ошибки уровня `error` — блокируют коммит, нужно исправить.
Предупреждения уровня `warning` — желательно исправить.

## Шаг 2: Линтинг CSS/SCSS

```bash
npm run lint:css
```

## Итог

Выведи:
- Количество ошибок и предупреждений по каждому линтеру
- Конкретные файлы и строки с ошибками (если есть)
- Вердикт: можно коммитить / нужно исправить
