# Coding Standards

## Block File Structure (Required)

Every block must have these files in `src/blocks/<name>/`:

| File | Purpose | Required |
|------|---------|----------|
| `block.json` | Block metadata — source of truth | ✅ |
| `index.js` | `registerBlockType(metadata, { edit, save })` | ✅ |
| `edit.js` | Editor UI component | ✅ |
| `save.js` | Static save function (or `null` for dynamic) | ✅ |
| `style.scss` | Frontend styles | ✅ |
| `editor.scss` | Editor-only styles | recommended |
| `render.php` | PHP render (dynamic blocks only) | if dynamic |
| `sidebar.js` | Inspector Controls (if extracted from edit.js) | optional |

## block.json Rules

```json
{
  "apiVersion": 3,
  "name": "codeweber-blocks/<block-name>",
  "category": "codeweber-gutenberg-elements",
  "textdomain": "codeweber-gutenberg-blocks",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

- `name` must start with `codeweber-blocks/`
- `category` must be one of: `codeweber-gutenberg-blocks`, `codeweber-gutenberg-elements`, `codeweber-gutenberg-widgets`
- `textdomain` must be `codeweber-gutenberg-blocks`

## CSS / Styling Rules

```
✅ Use Bootstrap 5 classes: btn, row, col-*, card, container, d-flex, gap-*, etc.
✅ Prefix custom classes: cwgb- or codeweber-
❌ Do NOT write custom styles for anything Bootstrap already covers
❌ Do NOT import Bootstrap in block SCSS (it comes from the theme)
```

Example:
```scss
// ✅ Correct — custom behavior only
.cwgb-button-wrapper {
  position: relative;
}

// ❌ Wrong — Bootstrap already handles this
.my-button {
  display: inline-block;
  padding: 8px 16px;
}
```

## JavaScript Rules

```
✅ @wordpress/components — only in Inspector Controls / Sidebar
✅ @wordpress/block-editor — for BlockControls, InspectorControls, useBlockProps
✅ Shared components from src/components/ — reuse, don't duplicate
❌ @wordpress/components — never on frontend (save.js)
❌ No external CSS frameworks in block JS
```

## Inspector Controls Pattern

```jsx
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

// In edit.js — correct pattern
export default function Edit({ attributes, setAttributes }) {
  return (
    <>
      <InspectorControls>
        <PanelBody title="Settings">
          {/* Inspector controls here */}
        </PanelBody>
      </InspectorControls>
      <div {...useBlockProps()}>
        {/* Block content here */}
      </div>
    </>
  );
}
```

## Attribute Naming

- PascalCase for attributes: `ButtonContent`, `LinkUrl`, `ImageSize`
- Boolean attributes: `isEnabled`, `showTitle`, `allowMultiple`
- Array attributes default to `[]`, object attributes to `{}`

## Backward Compatibility

**When changing existing attributes:**
```js
// index.js — always add deprecated entry
registerBlockType(metadata, {
  edit: Edit,
  save: Save,
  deprecated: [
    {
      attributes: { /* old attributes */ },
      save: OldSave,
    }
  ],
});
```

## PHP (render.php)

Variables available in render.php:
- `$attributes` — block attributes array
- `$content` — inner blocks HTML
- `$block` — WP_Block instance

```php
<?php
// Always available:
// $attributes, $content, $block

$title = esc_html($attributes['title'] ?? '');
?>
<div class="cwgb-my-block">
  <?php echo $title; ?>
</div>
```

Security rules in render.php:
- Always `esc_html()` for text output
- Always `esc_url()` for URLs
- Always `esc_attr()` for HTML attributes
- Never output raw `$attributes` values

## i18n

```js
import { __ } from '@wordpress/i18n';

// Correct
__('Button text', 'codeweber-gutenberg-blocks')

// Wrong — hardcoded string
'Button text'
```

In PHP:
```php
__('Text', 'codeweber-gutenberg-blocks')
esc_html__('Text', 'codeweber-gutenberg-blocks')
```
