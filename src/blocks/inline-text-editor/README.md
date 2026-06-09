# Inline Text Editor block

A removable, self-contained feature that lets logged-in editors change the text
of Codeweber blocks **on the frontend**, via a Bootstrap offcanvas drawer.

## How it works

1. Place the **Inline Text Editor** block once on a page or in the footer.
   It outputs nothing for visitors.
2. For users who `current_user_can('edit_post', <current post>)`, `render.php`
   prints a floating button + a Bootstrap `offcanvas` drawer.
3. `view.js` (loaded only when the block is on the page) opens the drawer,
   fetches the editable texts, and saves changes.
4. `inc/InlineTextEditor.php` provides:
   - REST routes `GET|POST /wp-json/codeweber-gutenberg-blocks/v1/inline-editor/{post_id}`
     (permission: `edit_post`).
   - A `render_block` filter that tags editable blocks with `data-cw-edit-index`
     so the drawer can swap them in place after saving (no reload).
5. Edits are persisted by rewriting the block markup in `post_content`
   (`parse_blocks` → DOM rewrite with an optimistic-lock guard →
   `serialize_blocks` → `wp_update_post`).

Supported blocks are listed in `InlineTextEditor::registry()`. Currently:
`heading-subtitle` (title / subtitle / text). Extend the registry to add more.

## Removing the feature (nothing else depends on it)

1. Delete `src/blocks/inline-text-editor/` and `build/blocks/inline-text-editor/`.
2. Delete `inc/InlineTextEditor.php`.
3. In `plugin.php`, remove the line:
   `add_action('init', __NAMESPACE__ . '\InlineTextEditor::boot');`
4. In `inc/Plugin.php`, remove `'inline-text-editor'` from `getBlocksName()`.
5. In `package.json`, remove `'inline-text-editor'` from the `copy-php` array.
6. In `doc_claude/blocks/BLOCKS_CATALOG.md`, remove the catalog row.

Any text already saved to posts stays valid — edits are written as normal block
markup, so removing the editor leaves all content intact.
