# CLAUDE.md — Codeweber Gutenberg Blocks Plugin

Instructions for Claude Code when working with the Gutenberg blocks plugin.

## Plugin Overview

**Codeweber Gutenberg Elements** — an addon for the CodeWeber theme. Adds 47 custom Gutenberg blocks built on Bootstrap 5.

- **Version:** 0.3.0
- **PHP namespace:** `Codeweber\Blocks\`
- **Block namespace:** `codeweber-blocks/`
- **CSS prefixes:** `cwgb-`, `codeweber-`
- **Text domain:** `codeweber-gutenberg-blocks`

## Commands

```bash
npm run build        # Production build; build/ is committed to git
npm run start        # Development mode with hot reload
npm run lint:js      # JS/JSX linting — errors block commit
npm run lint:css     # SCSS linting
npm run format       # Prettier
npm run i18n:update  # Regenerate POT + compile translations
```

**`build/` is versioned in git.** Always run `npm run build` before committing.

## Git Rules

**MANDATORY before any code changes:**

1. Check `git status`
2. If there are uncommitted changes — **ask the user to commit** and wait for confirmation
3. Only after the commit (or explicit user refusal) proceed with changes

This rule applies always: bug fixes, new features, refactoring, block modifications — any file changes.

## Key Rules

- **Frontend — Bootstrap classes only.** Do not write custom styles for anything covered by Bootstrap 5 / the theme.
- **`@wordpress/components` — Inspector/Sidebar only,** never on the frontend.
- **Each block has its own folder** `src/blocks/<name>/` with `block.json` as the source of truth.
- **Dynamic blocks** require `render.php` in `src/blocks/<name>/` — it is copied to `build/` during build.
- **When changing block attributes** — add a `deprecated` entry in `index.js`.

## Plugin Documentation

Task-oriented documentation in `doc_claude/`.

| Task | File |
|------|------|
| Architecture, Plugin.php, hooks | `doc_claude/architecture/PLUGIN_OVERVIEW.md` |
| File structure | `doc_claude/architecture/FILE_STRUCTURE.md` |
| npm commands, build, lint | `doc_claude/development/DEV_WORKFLOW.md` |
| Coding conventions | `doc_claude/development/CODING_STANDARDS.md` |
| Add a new block | `doc_claude/development/NEW_BLOCK_GUIDE.md` |
| Shared Inspector components (35) | `doc_claude/development/INSPECTOR_COMPONENTS.md` |
| Utility functions (class-generators, colors, icons...) | `doc_claude/development/UTILITIES_REFERENCE.md` |
| Catalog of all 47 blocks | `doc_claude/blocks/BLOCKS_CATALOG.md` |
| Dynamic blocks (render.php) | `doc_claude/blocks/DYNAMIC_BLOCKS.md` |
| Button block: all LinkTypes, data-attributes, modal/video/download | `doc_claude/blocks/BUTTON_LINK_TYPES.md` |
| REST API endpoints | `doc_claude/api/REST_API_REFERENCE.md` |
| Plugin hooks | `doc_claude/api/HOOKS_REFERENCE.md` |
| Theme integration | `doc_claude/integrations/THEME_INTEGRATION.md` |
| Security: escaping, sanitization, REST permissions | `doc_claude/security/SECURITY_CHECKLIST.md` |
