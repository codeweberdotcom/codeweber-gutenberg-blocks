# File Structure

```
codeweber-gutenberg-blocks/
│
├── plugin.php                    # Entry point, PSR-4 autoloader, action hooks
│
├── inc/                          # PHP classes (PSR-4: Codeweber\Blocks\)
│   ├── Plugin.php                # Main class (~2200 lines)
│   ├── StyleAPI.php              # REST: button/card style (radius from Redux)
│   ├── VideoThumbnailAPI.php     # REST: video thumbnail preview
│   ├── LoadMoreAPI.php           # REST: load-more functionality
│   └── ImageHotspotCPT.php       # CPT for image hotspot block
│
├── src/                          # Source files (not committed without build)
│   ├── blocks/                   # 47 blocks (see BLOCKS_CATALOG.md)
│   │   └── <name>/
│   │       ├── block.json        # Block metadata ★ source of truth
│   │       ├── index.js          # registerBlockType
│   │       ├── edit.js           # Editor UI + Inspector Controls
│   │       ├── save.js           # Static save (or null for dynamic)
│   │       ├── render.php        # PHP render (dynamic blocks only)
│   │       ├── sidebar.js        # Inspector Controls (if extracted)
│   │       ├── style.scss        # Frontend styles
│   │       └── editor.scss       # Editor-only styles
│   ├── components/               # 35 reusable Inspector components
│   ├── utilities/                # 15 utilities (icons, links, colors, etc.)
│   └── hooks/                    # React hooks
│
├── build/                        # ★ Compiled output — COMMITTED TO GIT
│   └── blocks/
│       └── <name>/
│           ├── index.js          # Compiled editor script
│           ├── index.css         # Compiled editor styles
│           ├── style-index.css   # Compiled frontend styles
│           ├── render.php        # Copied from src/ (dynamic blocks only)
│           └── block.json        # Copied from src/
│
├── includes/                     # Global scripts/styles (not block-specific)
│   ├── css/
│   │   └── editor-global.css     # Global editor styles for all blocks
│   └── js/
│       ├── pluign.js             # Global frontend script (typo in filename)
│       ├── load-more.js          # Load More JS (depends on theme fetch-handler)
│       ├── filepond-init.js      # FilePond initialization for file fields
│       └── scrollcue-editor-init.js  # ScrollCue init in editor
│
├── assets/
│   ├── filepond/                 # FilePond library (file upload UI)
│   └── vendor/
│       └── tabulator/            # Tabulator Tables library
│
├── settings/                     # Plugin settings page
│   ├── api/                      # REST API for settings
│   └── options_page/
│       └── restapi.php           # REST endpoints for options + phones
│
├── languages/                    # Translation files (.po, .mo, .json)
├── lib/                          # Additional libraries
├── scripts/                      # Build scripts (copy-navbar-templates.js)
│
├── package.json                  # npm config + all commands
├── generate-pot.js               # POT file generator
└── compile-translations.js       # Translation compiler
```

## src/ vs build/ Rule

| | `src/` | `build/` |
|-|--------|---------|
| Contents | Source (JSX, SCSS) | Compiled code |
| Edit directly | Yes | No (auto-generated) |
| In git | Yes | **Yes** (required) |
| How to update | Edit source | `npm run build` |

## Finding a Block

For block `<name>`:
1. Source: `src/blocks/<name>/`
2. After build: `build/blocks/<name>/`
3. PHP registers from: `build/blocks/<name>/` (via `block.json`)
