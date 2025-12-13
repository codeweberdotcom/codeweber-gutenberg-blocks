# Translation Files

## Structure

- `codeweber-gutenberg-blocks.pot` - Translation template (all translatable strings)
- `codeweber-gutenberg-blocks-ru_RU.po` - Russian translations (edit this)
- `codeweber-gutenberg-blocks-ru_RU.mo` - Compiled for PHP (auto-generated)
- `codeweber-gutenberg-blocks-ru_RU-{hash}.json` - For JavaScript blocks (auto-generated)

## How to Update Translations

### Method 1: Using Loco Translate (WordPress Plugin)

1. Go to **Loco Translate** → **Plugins** → **Codeweber Blocks**
2. Select **Russian (ru_RU)**
3. **DO NOT click "Sync"** - it may remove strings
4. Translate strings directly in the interface
5. Click **Save**
6. Run: `npm run i18n:compile` to generate JSON files

### Method 2: Manual Editing (Recommended)

1. Edit `codeweber-gutenberg-blocks-ru_RU.po` in your preferred PO editor (Poedit, VS Code, etc.)
2. Add translations to `msgstr` fields
3. Save the file
4. Run compilation:
   ```bash
   cd wp-content/plugins/codeweber-gutenberg-blocks
   npm run i18n:compile
   ```

## NPM Commands

```bash
# Update POT file (template) from source code
npm run i18n:pot

# Compile PO to MO + create JSON files
npm run i18n:compile

# Do both (update template + compile)
npm run i18n:update
```

## Files Auto-Generated (DO NOT EDIT MANUALLY)

- `*.mo` files
- `*.json` files  
- After editing `.po` file, always run `npm run i18n:compile`







