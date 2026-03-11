# Utilities Reference

Pure helper functions and data constants in `src/utilities/`. Used in both `edit.js` and `save.js`.

Import path: `../../utilities/<filename>`

---

## Quick Reference

| File | Exports | Use for |
|------|---------|---------|
| `class-generators.js` | 14 functions | Generate Bootstrap/theme CSS classes from attributes |
| `colors.js` | `colors` array | 28 color options for SelectControl/ComboboxControl |
| `shadows.js` | `shadowOptions`, `generateShadowClass` | Shadow SelectControl options |
| `border-radius.js` | `borderRadiusOptions`, `positionOptions` | Border radius options |
| `gradient_colors.js` | `gradientcolors` | Gradient class options |
| `shapes.js` | `shapes` | Decorative shape options |
| `icon_sizes.js` | 7 arrays | Icon size/style/color/type option arrays |
| `font_icon.js` | `fontIcons` | Font icon list (Unicons) |
| `svg_icons.js` | `svgIconsLineal`, `svgIconsSolid`, `allSvgIcons`, `getSvgIconPath` | SVG icon catalog |
| `image-url.js` | `getImageUrl`, `getImageDimensions` | Extract URL/dimensions from image object |
| `lightbox.js` | `getLightboxAttributes`, `initLightbox`, `getLightboxUrl`, `getLightboxType`, `generateGalleryId` | Lightbox integration |
| `plyr.js` | `initPlyr`, `destroyPlyr` | Video player init (used in `edit.js`) |
| `videoUrlParsers.js` | 4 `parse*` functions | Parse video URLs/embeds to clean IDs |
| `link_type.js` | `LinkTypeSelector` | Universal link type component |

---

## class-generators.js

The most-used utility. Converts block attributes into CSS class strings for use in `save.js` and `render.php`.

```js
import {
  generateColorClass,
  generateTypographyClasses,
  generateBackgroundClasses,
  generateTextColorClass,
  generateTextAlignClass,
  generateAlignItemsClass,
  generateJustifyContentClass,
  generatePositionClass,
  generateLeadClass,
  generateSpacingClasses,
  generateAlignmentClasses,
  validateColor,
  validateSize,
  validateTag,
} from '../../utilities/class-generators';
```

### `generateColorClass(color, colorType, prefix)`

```js
generateColorClass('primary', 'solid', 'text')  // → 'text-primary'
generateColorClass('primary', 'soft', 'text')   // → 'text-soft-primary'
generateColorClass('primary', 'pale', 'bg')     // → 'bg-pale-primary'
generateColorClass('primary', 'gradient', 'bg') // → 'bg-primary' (gradient handled separately)
```

`prefix` defaults to `'text'`. Use `'bg'` for backgrounds, `'btn'` for buttons.

---

### `generateTypographyClasses(attrs, prefix)`

Returns an array of classes for a heading/text element.

```js
// For attrs = { titleSize: 'fs-lg', titleWeight: 'fw-bold', titleTransform: 'text-uppercase', titleTag: 'display-4' }
generateTypographyClasses(attrs, 'title')
// → ['display-4', 'fs-lg', 'fw-bold', 'text-uppercase']
```

Handles `display-*` tags as classes. Use `prefix = 'title'`, `'subtitle'`, or a custom prefix matching your attributes.

---

### `generateBackgroundClasses(attrs)`

Returns array of wrapper classes for section/card background.

```js
// backgroundType: 'color', backgroundColor: 'primary', backgroundColorType: 'soft'
generateBackgroundClasses(attrs)  // → ['bg-soft-primary']

// backgroundType: 'image', backgroundSize: 'bg-cover', backgroundOverlay: 'bg-overlay bg-overlay-500'
generateBackgroundClasses(attrs)  // → ['image-wrapper', 'bg-image', 'bg-cover', 'bg-overlay', 'bg-overlay-500']

// backgroundType: 'video'
generateBackgroundClasses(attrs)  // → ['video-wrapper', ...]
```

**Important:** Apply these classes to the outer wrapper. Add `data-image-src={backgroundImageUrl}` separately for JS initialization.

---

### `generateSpacingClasses(attrs)`

Generates `pt-*`, `pb-*`, `ps-*`, `pe-*`, `mt-*`, `mb-*` from individual spacing attributes.

```js
// attrs = { paddingTop: '3', paddingBottom: '5', marginTop: '2' }
generateSpacingClasses(attrs)  // → ['pt-3', 'pb-5', 'mt-2']
```

---

### `generateAlignmentClasses(attrs)`

Generates flex + alignment classes. Automatically adds `d-flex flex-column` when `alignItems` or `justifyContent` are set.

```js
// attrs = { alignItems: 'align-items-center', justifyContent: 'justify-content-between', align: 'center' }
generateAlignmentClasses(attrs)
// → ['d-flex', 'flex-column', 'text-center', 'align-items-center', 'justify-content-between']
```

---

### Single-value helpers

| Function | Example in | Example out |
|----------|-----------|-------------|
| `generateTextColorClass(tc)` | `'text-primary'` | `'text-primary'` (pass-through) |
| `generateTextAlignClass(a)` | `'center'` | `'text-center'` |
| `generateAlignItemsClass(ai)` | `'align-items-center'` | `'align-items-center'` (pass-through) |
| `generateJustifyContentClass(jc)` | `'justify-content-end'` | `'justify-content-end'` (pass-through) |
| `generatePositionClass(p)` | `'position-relative'` | `'position-relative'` (pass-through) |
| `generateLeadClass(lead, tag)` | `true, 'p'` | `'lead'` |

---

### Validation helpers

```js
validateColor('primary', ['primary', 'dark', 'light'])  // → true
validateSize('lg', ['sm', 'md', 'lg'])                  // → true
validateTag('h2', ['h1', 'h2', 'h3', 'p', 'div'])      // → true
// Empty string always returns true (optional field)
```

---

## colors.js

28 color options for use in any SelectControl or ComboboxControl.

```js
import { colors } from '../../utilities/colors';
// → [{label: 'Primary', value: 'primary'}, {label: 'Dark', value: 'dark'}, ...]
```

**Full color list:** `primary`, `dark`, `light`, `yellow`, `orange`, `red`, `pink`, `fuchsia`,
`violet`, `purple`, `blue`, `aqua`, `sky`, `green`, `leaf`, `ash`, `navy`, `grape`,
`muted`, `white`, `pinterest`, `dewalt`, `facebook`, `telegram`, `frost` + a few more social.

---

## shadows.js

```js
import { shadowOptions, generateShadowClass } from '../../utilities/shadows';

// shadowOptions: [{value: '', label: 'None'}, {value: 'shadow-sm', label: 'Small'}, ...]
// generateShadowClass('shadow-lg') → 'shadow-lg'
```

---

## border-radius.js

```js
import { borderRadiusOptions, positionOptions } from '../../utilities/border-radius';
```

**`borderRadiusOptions`** — Bootstrap + theme values:
`rounded-0`, `rounded-1`, `rounded-2`, `rounded`, `rounded-3`, `rounded-4`, `rounded-5`,
`rounded-xl` (theme: 0.8rem), `rounded-pill`, `rounded-circle`.

**`positionOptions`** — side application: All Sides, Top, Bottom, Start, End.

---

## gradient_colors.js

```js
import { gradientcolors } from '../../utilities/gradient_colors';
// [{value: 'bg-gradient-primary', label: 'Primary Gradient'}, ...]
```

Use with `BackgroundSettingsPanel` when `backgroundColorType === 'gradient'`.

---

## shapes.js

```js
import { shapes } from '../../utilities/shapes';
// Decorative background shape options
```

---

## icon_sizes.js

All option arrays for `IconControl`.

```js
import {
  iconSvgSizes,      // xs | sm | md | lg  (for SVG icons)
  svgIconStyles,     // lineal | solid | solid-mono | solid-duo
  iconColors,        // same as colors + 'none'
  iconDuoColors,     // second color for solid-duo
  iconFontSizes,     // fs-24, fs-28, fs-32...
  iconTypes,         // none | font | svg | custom
  iconWrapperStyles, // '' | btn | btn-circle
  iconBtnSizes,      // '' | btn-sm | btn-lg
  iconBtnVariants,   // soft | outline | solid | gradient
} from '../../utilities/icon_sizes';
```

---

## font_icon.js

Full Unicons font icon list.

```js
import { fontIcons } from '../../utilities/font_icon';
// [{value: 'home', label: 'Home'}, ...]  — used by IconPicker
```

---

## svg_icons.js

SVG icon catalog (lineal and solid styles).

```js
import {
  svgIconsLineal,    // [{value: 'star', label: 'Star'}, ...]
  svgIconsSolid,     // solid-style icons
  allSvgIcons,       // combined list
  getSvgIconPath,    // (name, style) => '/path/to/icon.svg'
} from '../../utilities/svg_icons';

// Get path for rendering:
const path = getSvgIconPath('star', 'lineal');
// → '/wp-content/plugins/codeweber-gutenberg-blocks/assets/svg/lineal/star.svg'
```

---

## image-url.js

Extract image URL or dimensions from the image object stored in block attributes.

```js
import { getImageUrl, getImageDimensions } from '../../utilities/image-url';

// image = { url: '...', sizes: { large: { url: '...', width: 800, height: 600 }, ... } }

const url = getImageUrl(image, 'large');
// → uses image.sizes.large.url, falls back to image.url if size missing

const { width, height } = getImageDimensions(image, 'large');
// → { width: 800, height: 600 }
```

---

## lightbox.js

Handles Glightbox integration for image/video lightboxes.

```js
import {
  getLightboxAttributes,
  initLightbox,
  getLightboxUrl,
  getLightboxType,
  generateGalleryId,
} from '../../utilities/lightbox';

// Generate data-* attributes for an anchor tag:
const attrs = getLightboxAttributes(image.url, 'image', galleryId);
// → { 'data-glightbox': '...', 'data-gallery': galleryId, ... }

// Generate unique gallery group name:
const galleryId = generateGalleryId('slider');  // → 'gallery-slider-abc123'

// Detect lightbox type from URL:
const type = getLightboxType(url);  // → 'image' | 'video' | 'youtube' | 'vimeo'

// Clean URL for lightbox (adds autoplay for video):
const cleanUrl = getLightboxUrl(url, 'youtube');

// Init Glightbox on a container (used in editor):
initLightbox('.wp-block-codeweber-blocks-gallery');
```

---

## plyr.js

Plyr video player initialization (used in `edit.js` for video block previews).

```js
import { initPlyr, destroyPlyr } from '../../utilities/plyr';

// In useEffect inside edit.js:
useEffect(() => {
  initPlyr('.player');
  return () => destroyPlyr('.player');
}, [videoUrl]);
```

---

## videoUrlParsers.js

Parse video embed codes or URLs to normalized embed URLs.

```js
import {
  parseVKVideoURL,
  parseRutubeVideoURL,
  parseYouTubeVideoURL,
  parseVimeoVideoURL,
} from '../../utilities/videoUrlParsers';

// Accepts: full URL, short URL, or iframe embed code
const embedUrl = parseYouTubeVideoURL('https://youtu.be/dQw4w9WgXcQ');
// → 'https://www.youtube.com/embed/dQw4w9WgXcQ'

const embedUrl = parseVKVideoURL('https://vk.com/video...');
// → normalized VK embed URL

// parseRutubeVideoURL(input, addAutoplay = true)
```

Used internally by `VideoURLControl` — normally you do not need to call these directly.

---

## link_type.js

`LinkTypeSelector` is a full Inspector component (not a pure utility), but lives in utilities.

```js
import { LinkTypeSelector } from '../../utilities/link_type';

<LinkTypeSelector attributes={attributes} setAttributes={setAttributes} />
```

Supports link types: external URL, internal post/page, CF7 form, CodeWeber form, modal window,
HTML block, document with action, VK/YouTube/Vimeo/Rutube video, phone (tel/WhatsApp),
archive page, Bootstrap data attributes (modal toggle, etc.).

Writes link-related attributes to block: `linkType`, `linkUrl`, `linkTarget`, `linkPostId`,
`linkFormId`, `linkModalId`, `linkVideoType`, `linkVideoUrl`, `linkPhone`, `linkAction` etc.

---

## Usage in save.js vs render.php

In `save.js` (static blocks), import and call directly:

```js
import { generateColorClass, generateBackgroundClasses } from '../../utilities/class-generators';

const bgClasses = generateBackgroundClasses(attributes).join(' ');
```

In `render.php` (dynamic blocks), replicate class logic in PHP — utilities are JS-only.
Use the same Bootstrap class naming conventions manually or via a shared PHP helper if available.
