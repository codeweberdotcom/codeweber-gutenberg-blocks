# Development Workflow

## npm Commands

```bash
npm run build          # Production build (wp-scripts + copy-php)
npm run start          # Development mode with hot reload
npm run lint:js        # Lint JS/JSX (errors block commit)
npm run lint:css       # Lint SCSS
npm run format         # Apply Prettier formatting
npm run format:clean   # Clean empty lines + Prettier
npm run i18n:update    # Regenerate POT + compile translations
npm run i18n:pot       # Only: generate POT from source
npm run i18n:compile   # Only: compile .po → .mo + .json
npm run plugin-zip     # Create plugin ZIP
```

## Build Process

`npm run build` does two things:

1. **`wp-scripts build`** — compiles all `src/blocks/*/index.js` → `build/blocks/*/`
2. **`npm run copy-php`** — copies `render.php` from `src/blocks/<name>/` to `build/blocks/<name>/` for dynamic blocks

### Blocks with render.php (copied during build):
`accordion`, `avatar`, `blog-category-widget`, `blog-post-widget`, `blog-tag-widget`, `blog-year-widget`, `form`, `form-field`, `yandex-map`, `html-blocks`, `swiper`, `menu`, `lists`, `contacts`, `search`, `social-icons`, `tables`, `tabulator`, `navbar`, `top-header`, `header-widgets`, `shortcode-render`

Additionally, `scripts/copy-navbar-templates.js` copies navbar template files.

## Development Mode

```bash
npm run start
```

Watches `src/blocks/` for changes and recompiles automatically. **Does NOT copy `render.php`** — run `npm run build` if you change PHP render files.

## Linting

```bash
npm run lint:js    # ESLint with @wordpress/eslint-plugin config
npm run lint:css   # Stylelint with @wordpress/stylelint-config/scss
```

**Errors (level `error`) block commit.** Warnings are advisory.

Fix all errors before committing:
```bash
npm run lint:js -- --fix   # Auto-fix JS
npm run lint:css -- --fix  # Auto-fix CSS
```

## i18n / Translations

```bash
npm run i18n:update
```

1. `generate-pot.js` — scans source files → generates `languages/codeweber-gutenberg-blocks.pot`
2. `compile-translations.js` — compiles `.po` → `.mo` + `.json` (for JS)

**Loco Translate integration:** When saving translations in Loco Translate admin, POT is auto-regenerated and translations auto-compiled via `plugin.php` hooks.

## Commit Checklist

Before every commit:
1. `npm run build` — always
2. `npm run lint:js` — no errors
3. `npm run lint:css` — no errors
4. Include `build/` in the commit
