# How to Add a New Block

Step-by-step recipe for adding a new block to the plugin.

## Before You Start

Decide:
- **Block name:** `codeweber-blocks/<name>` (kebab-case, e.g. `my-widget`)
- **Type:** static (JS save) or dynamic (PHP render)?
- **Category:** `codeweber-gutenberg-elements` (default)

---

## Step 1: Create Block Source Folder

```
src/blocks/<name>/
├── block.json
├── index.js
├── edit.js
├── save.js         (or render.php if dynamic)
├── style.scss
└── editor.scss
```

---

## Step 2: `block.json`

```json
{
  "apiVersion": 3,
  "name": "codeweber-blocks/<name>",
  "version": "0.1.0",
  "title": "My Block",
  "category": "codeweber-gutenberg-elements",
  "icon": "block-default",
  "description": "Short description of what the block does.",
  "supports": {
    "html": false,
    "customClassName": true,
    "anchor": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "default": ""
    }
  },
  "textdomain": "codeweber-gutenberg-blocks",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

---

## Step 3: `index.js`

```js
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';

registerBlockType(metadata, {
  edit: Edit,
  save: Save,
});
```

For dynamic blocks replace `save: Save` with `save: () => null`.

---

## Step 4: `edit.js` (static block example)

```jsx
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
  const { title } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Settings', 'codeweber-gutenberg-blocks')}>
          <TextControl
            label={__('Title', 'codeweber-gutenberg-blocks')}
            value={title}
            onChange={(val) => setAttributes({ title: val })}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <RichText
          tagName="h3"
          value={title}
          onChange={(val) => setAttributes({ title: val })}
          placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
        />
      </div>
    </>
  );
}
```

---

## Step 5: `save.js`

For **static blocks:**
```jsx
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { title } = attributes;
  return (
    <div {...useBlockProps.save()}>
      <RichText.Content tagName="h3" value={title} />
    </div>
  );
}
```

For **dynamic blocks** (uses render.php):
```js
export default function Save() {
  return null;
}
```

---

## Step 6: `render.php` (dynamic blocks only)

```php
<?php
// Available: $attributes, $content, $block

$title = esc_html($attributes['title'] ?? '');
$wrapper_attributes = get_block_wrapper_attributes();
?>
<div <?php echo $wrapper_attributes; ?>>
  <h3><?php echo $title; ?></h3>
</div>
```

---

## Step 7: Register in `inc/Plugin.php`

Add the block name to the `getBlocksName()` array:

```php
public static function getBlocksName(): array {
  return [
    // ... existing blocks ...
    '<name>',   // ← add here
  ];
}
```

For dynamic blocks, `render.php` is automatically loaded if it exists in `build/blocks/<name>/`.

---

## Step 8: Register render.php copy in `package.json`

For **dynamic blocks only**, add the block name to the `copy-php` script in `package.json`:

```json
"copy-php": "node -e \"...const blocks = [..., '<name>']; blocks.forEach(block => {...})\""
```

---

## Step 9: Build and Test

```bash
npm run build
```

Verify:
- `build/blocks/<name>/` exists with compiled files
- Block appears in Gutenberg block inserter under "Codeweber Gutenberg Elements"
- For dynamic blocks: `build/blocks/<name>/render.php` exists

---

## Final Checklist

- [ ] `src/blocks/<name>/block.json` created with correct `name`, `category`, `textdomain`
- [ ] `index.js`, `edit.js`, `save.js` (or `render.php`) created
- [ ] Block name added to `Plugin::getBlocksName()`
- [ ] Dynamic block: name added to `copy-php` in `package.json`
- [ ] `npm run build` passes without errors
- [ ] `npm run lint:js` — no errors
- [ ] Block renders correctly in editor and frontend
- [ ] All user-facing strings wrapped in `__()` with domain `codeweber-gutenberg-blocks`
- [ ] Update `doc_claude/blocks/BLOCKS_CATALOG.md`
