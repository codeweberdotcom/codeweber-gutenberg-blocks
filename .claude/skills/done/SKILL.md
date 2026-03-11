---
name: done
description: Завершить задачу в плагине — build + lint + commit + update-docs
argument-hint: [описание выполненной задачи — опционально]
---

Выполни финальные шаги для завершения задачи в плагине codeweber-gutenberg-blocks.

## Шаг 1: Сборка

Запусти `npm run build` из директории плагина.
Если сборка упала — остановись и сообщи об ошибке. Дальше не продолжай.

## Шаг 2: Линтинг

Запусти `npm run lint:js` и `npm run lint:css`.
Если есть ошибки уровня `error` — остановись и сообщи. Дальше не продолжай.

## Шаг 3: Проверка изменённых файлов

Запусти `git diff --name-only` и `git status`.

## Шаг 4: Обновление документации

Определи какие файлы `doc_claude/` нужно обновить по изменённому коду:

| Изменённый файл | Документ для обновления |
|----------------|------------------------|
| `src/blocks/*/` | `doc_claude/blocks/BLOCKS_CATALOG.md` |
| `inc/Plugin.php` (новый endpoint) | `doc_claude/api/REST_API_REFERENCE.md` |
| `inc/Plugin.php` (новый хук) | `doc_claude/api/HOOKS_REFERENCE.md` |
| `src/components/` | `doc_claude/development/CODING_STANDARDS.md` |
| `plugin.php` | `doc_claude/architecture/PLUGIN_OVERVIEW.md` |

Обнови соответствующие документы.

## Шаг 5: Коммит

Составь сообщение на основе:
- Аргумента `$ARGUMENTS` (если передан)
- Анализа изменений

Создай коммит со всеми изменениями включая `build/` и обновлённую документацию.

## Итоговый отчёт

Выведи:
- Что сделано
- Что скомпилировано
- Какие документы обновлены
- Hash коммита
