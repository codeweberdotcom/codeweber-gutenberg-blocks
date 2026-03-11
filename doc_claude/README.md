# Codeweber Gutenberg Blocks — Developer Documentation

Task-oriented documentation. Each file answers the question "how to do X".

## Quick Start

```bash
cd wp-content/plugins/codeweber-gutenberg-blocks
npm install
npm run build   # production build
npm run start   # development mode
```

## Navigation

### Architecture
- [PLUGIN_OVERVIEW.md](architecture/PLUGIN_OVERVIEW.md) — entry point, Plugin.php, lifecycle ★
- [FILE_STRUCTURE.md](architecture/FILE_STRUCTURE.md) — what is where

### Development
- [DEV_WORKFLOW.md](development/DEV_WORKFLOW.md) — commands, build, lint, i18n
- [CODING_STANDARDS.md](development/CODING_STANDARDS.md) — coding conventions
- [NEW_BLOCK_GUIDE.md](development/NEW_BLOCK_GUIDE.md) — add a new block ★★
- [INSPECTOR_COMPONENTS.md](development/INSPECTOR_COMPONENTS.md) — all 35 shared Inspector components ★
- [UTILITIES_REFERENCE.md](development/UTILITIES_REFERENCE.md) — all src/utilities/ functions

### Blocks
- [BLOCKS_CATALOG.md](blocks/BLOCKS_CATALOG.md) — catalog of all 47 blocks
- [DYNAMIC_BLOCKS.md](blocks/DYNAMIC_BLOCKS.md) — blocks with render.php

### API
- [REST_API_REFERENCE.md](api/REST_API_REFERENCE.md) — all endpoints
- [HOOKS_REFERENCE.md](api/HOOKS_REFERENCE.md) — plugin hooks

### Integrations
- [THEME_INTEGRATION.md](integrations/THEME_INTEGRATION.md) — theme connection

### Security
- [SECURITY_CHECKLIST.md](security/SECURITY_CHECKLIST.md) — escaping, sanitization, REST permissions ★
