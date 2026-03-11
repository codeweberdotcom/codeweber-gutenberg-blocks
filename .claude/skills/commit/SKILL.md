---
name: commit
description: Создать git-коммит изменений плагина codeweber-gutenberg-blocks
argument-hint: [описание задачи — опционально]
---

Создай git-коммит для изменений в плагине codeweber-gutenberg-blocks.

Правила репозитория:
- Репозиторий находится в `wp-content/plugins/codeweber-gutenberg-blocks/`
- Коммитить `build/` вместе с исходниками — он версионируется
- Не коммитить: `node_modules/`, `*.log`

Шаги:
1. Запусти `git status` и `git diff --stat` — посмотри что изменено
2. Проанализируй изменения и составь сообщение коммита:
   - Первая строка: краткое описание (до 72 символов)
   - Тип: feat / fix / refactor / docs / security / style
   - Если передан аргумент `$ARGUMENTS` — используй его как основу сообщения
3. Покажи предлагаемое сообщение и список файлов
4. Добавь файлы и создай коммит

Формат сообщения: `тип: краткое описание`
Пример: `feat: add load-more support to post-grid block`
