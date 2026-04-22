# Floating Navigator Block

**Block name:** `codeweber-blocks/floating-navigator`  
**Type:** Dynamic (server-side render via `render.php`)  
**Files:** `src/blocks/floating-navigator/`

---

## Purpose

A fixed-position floating widget that shows a popup list of anchor links pointing to named sections of the current page. Clicking a link smoothly scrolls to the target section, accounting for the sticky navbar height. The active section is highlighted automatically as the user scrolls.

---

## File Structure

```
src/blocks/floating-navigator/
├── block.json      — block registration, attributes
├── index.js        — registerBlockType
├── edit.js         — Editor UI + Inspector Controls
├── editor.scss     — editor-only styles
├── render.php      — frontend HTML + inline JS
└── style.scss      — frontend styles
```

`render.php` is copied to `build/blocks/floating-navigator/` by the `copy-php` script during `npm run build`.

---

## Attributes

| Attribute | Type | Default | Allowed values / notes |
|---|---|---|---|
| `items` | `array` | `[]` | Array of `{ anchor, label }` objects. Order = display order |
| `position` | `string` | `right-bottom` | `right-bottom`, `right-top`, `left-bottom`, `left-top` |
| `buttonTypeDesktop` | `string` | `button` | `icon`, `button` (icon-only or icon+text) |
| `buttonTypeTablet` | `string` | `icon` | `icon`, `button` |
| `buttonTypeMobile` | `string` | `icon` | `icon`, `button` |
| `buttonText` | `string` | `Navigation` | Visible only when type = `button` |
| `buttonIcon` | `string` | `list-ul` | Unicons icon name without the `uil-` prefix |
| `buttonIconType` | `string` | `font` | Always `font` (SVG types not used here) |
| `buttonSize` | `string` | `md` | `sm`, `md`, `lg`, `elg` → maps to theme `btn-sm` / `btn-lg` / `btn-elg` |
| `buttonRotate` | `boolean` | `false` | Rotates button 90° using `writing-mode: vertical-rl` |
| `buttonColor` | `string` | `primary` | Any theme button color slug (`primary`, `secondary`, `dark`, etc.) |
| `popupTitle` | `string` | `Contents` | Section heading inside the popup. Empty string = no heading |
| `popupBgColor` | `string` | `white` | Theme color slug for popup background |
| `popupBgColorType` | `string` | `solid` | `solid` → `bg-{color}`, `soft` → `bg-soft-{color}`, `pale` → `bg-pale-{color}` |
| `offsetXDesktop` | `number` | `24` | Horizontal offset from viewport edge in px (desktop) |
| `offsetYDesktop` | `number` | `24` | Vertical offset from viewport edge in px (desktop) |
| `offsetXTablet` | `number` | `16` | Same for tablet (≤ 991px) |
| `offsetYTablet` | `number` | `16` | |
| `offsetXMobile` | `number` | `12` | Same for mobile (≤ 575px) |
| `offsetYMobile` | `number` | `12` | |

---

## Frontend HTML Structure

```html
<div
  id="cwgb-fn-{hash}"
  class="cwgb-floating-nav"
  data-position="right-bottom"
  data-btn-type-desktop="button"
  data-btn-type-tablet="icon"
  data-btn-type-mobile="icon"
  data-btn-size="md"
  data-rotate="true"          <!-- only if buttonRotate=true -->
  style="--fn-offset-x-desktop:24px; --fn-offset-y-desktop:24px; ..."
  aria-label="Page navigation"
>
  <button
    class="cwgb-floating-nav__trigger btn btn-primary rounded-pill has-ripple btn-lg"
    aria-expanded="false"
    aria-haspopup="true"
    aria-controls="cwgb-fn-{hash}-popup"
    type="button"
  >
    <i class="uil uil-list-ul"></i>
    <span class="cwgb-floating-nav__trigger-text">Navigation</span>
  </button>

  <div
    id="cwgb-fn-{hash}-popup"
    class="cwgb-floating-nav__popup shadow-lg rounded-3 py-2 bg-white"
    aria-hidden="true"
    role="navigation"
  >
    <div class="cwgb-floating-nav__popup-title fs-15 text-uppercase border-bottom px-4 py-3 mb-1">
      Contents
    </div>
    <a
      href="#section-id"
      class="cwgb-floating-nav__item nav-link text-reset px-6 py-2"
      data-anchor="section-id"
    >Section label</a>
  </div>
</div>
```

### Button classes by type

| Desktop type | Button classes |
|---|---|
| `icon` | `btn btn-{color} btn-circle has-ripple [btn-sm/btn-lg/btn-elg]` |
| `button` | `btn btn-{color} rounded-pill has-ripple [btn-sm/btn-lg/btn-elg]` |

Size `md` adds no extra class (default `btn` sizing).

### Popup background class

| `popupBgColorType` | Class |
|---|---|
| `solid` | `bg-{color}` |
| `soft` | `bg-soft-{color}` |
| `pale` | `bg-pale-{color}` |

---

## CSS Custom Properties

Defined as inline `style` on the wrapper `div`. Used only for responsive positioning:

| Property | Description |
|---|---|
| `--fn-offset-x-desktop` | Horizontal edge offset, desktop |
| `--fn-offset-y-desktop` | Vertical edge offset, desktop |
| `--fn-offset-x-tablet` | Horizontal edge offset, tablet (≤ 991px) |
| `--fn-offset-y-tablet` | Vertical edge offset, tablet |
| `--fn-offset-x-mobile` | Horizontal edge offset, mobile (≤ 575px) |
| `--fn-offset-y-mobile` | Vertical edge offset, mobile |

---

## CSS Classes Summary

| Class | Element | Notes |
|---|---|---|
| `.cwgb-floating-nav` | Wrapper | `position: fixed`, z-index 1050. Reads `--fn-offset-*` vars |
| `.cwgb-floating-nav__trigger` | Button | Only `position: relative; z-index: 2` — all other styles from theme `btn` |
| `.cwgb-floating-nav__trigger-text` | Span | Shown/hidden via CSS data-attr selectors per breakpoint |
| `.cwgb-floating-nav__popup` | Popup div | `position: absolute`, opacity/transform animation |
| `.cwgb-floating-nav__popup.is-open` | Popup (open state) | `opacity: 1`, `pointer-events: auto` |
| `.cwgb-floating-nav__popup-title` | Heading row | Styling via Bootstrap/theme utility classes in HTML |
| `.cwgb-floating-nav__item` | Anchor links | `nav-link text-reset` from theme; `.active` adds `box-shadow: inset 3px 0 0 var(--bs-primary)` |

---

## Styling Architecture

**Rule**: use theme/Bootstrap classes wherever possible; custom CSS only when unavoidable.

### Uses theme classes (no custom CSS needed)
- Button shape: `btn-circle` (circle) or `rounded-pill` (pill)
- Button size: `btn-sm`, `btn-lg`, `btn-elg`
- Button color: `btn-{color}`
- Ripple: `has-ripple`
- Button flex/align/whitespace: inherited from theme `btn`
- Button hover shadow: theme `btn:hover` rule
- Popup shadow/rounding: `shadow-lg rounded-3`
- Popup background: `bg-{color}`, `bg-soft-{color}`, `bg-pale-{color}`
- Popup padding: `py-2`
- Title styles: `fs-15 text-uppercase border-bottom px-4 py-3 mb-1`
- Link styles: `nav-link text-reset px-6 py-2`

### Custom CSS (unavoidable)
| Rule | Why |
|---|---|
| `position: fixed` on wrapper | Fixed positioning — no utility class |
| Popup `position: absolute`, animation | Popup show/hide with opacity + transform — no utility equivalent |
| `writing-mode: vertical-rl; transform: rotate(180deg)` | Button rotation — no Bootstrap equivalent |
| `padding: 1rem 0.67em` on rotated pill | `writing-mode` turns horizontal padding into visual width; must tighten to correct pill proportions |
| Shape overrides in tablet/mobile media queries | Shape class set for desktop in HTML; breakpoints must override via data-attr CSS selectors |
| Text visibility via data-attr selectors | `display: none/inline` controlled by data-attributes across 3 breakpoints — impossible with utility classes alone |

---

## JavaScript Behavior

Inline `<script>` injected by `render.php`. Scoped to `#cwgb-fn-{hash}` to avoid conflicts when multiple instances exist on the same page.

### Open / Close

- **Trigger click**: toggle popup `.is-open` + `aria-expanded`
- **Outside click** (`document` listener): closes popup
- **Escape key**: closes popup
- Popup does NOT close when clicking a nav item (smooth scroll happens, popup stays open)

### Smooth Scroll

Uses `getElementById(anchor)` — NOT `querySelector('#anchor')` — because CSS selectors fail for IDs that start with a digit.

Scroll offset accounts for sticky navbar:
```js
function getHeaderHeight() {
    var navbar = document.querySelector('.navbar-clone.navbar-stick, .navbar.fixed');
    return navbar ? navbar.offsetHeight + 20 : 20;
}
scroll({ top: target.offsetTop - getHeaderHeight(), behavior: 'smooth' });
```

### Active Section Tracking

Uses `getBoundingClientRect().top` on scroll (RAF-throttled), NOT IntersectionObserver.

**Why not IntersectionObserver**: theme.js also tracks `.nav-link.scroll` elements and sets its own `.active` class, which conflicts. The block's items deliberately do NOT have the `.scroll` class to avoid this conflict.

**Logic**: iterate anchors in order; last anchor whose `top <= navbarHeight + 40` = current active section. Updates `link.classList` (`.active`) and `aria-current` attribute.

```js
// Active item uses primary color inset shadow (CSS):
// .cwgb-floating-nav__item.active { box-shadow: inset 3px 0 0 var(--bs-primary); }
```

### unique_id

Generated from `md5(json_encode($attributes))` — changes if any attribute changes. Ensures multiple blocks on the same page don't conflict. Also used as `id` on the popup for `aria-controls`.

---

## Editor (Inspector Controls)

Three panels:

### Content panel
- Auto-discovers all blocks on the page that have an `anchor` attribute (via `useSelect` → `core/block-editor`)
- Checkbox per block → adds/removes from `items`
- TextControl for custom label (pre-filled from block's `content`/`text`/`title` attribute, stripped of HTML)
- Up/down reorder buttons + trash button per selected item
- Shows placeholder message if no anchored blocks exist

### Appearance panel
- Position: SelectControl (4 options)
- Button icon: IconPicker component (Unicons font only)
- Button size: ButtonGroup (S/M/L/XL)
- Button type per device: TabPanel (Desktop/Tablet/Mobile) with SelectControl
- Button text: TextControl (shown only when any breakpoint = `button`)
- Rotate 90°: ToggleControl
- Button color: SelectControl (8 Bootstrap semantic colors)

### Popup panel
- Popup title: TextControl (empty = no title rendered)
- Background type: ColorTypeControl (solid/soft/pale)
- Background color: SelectControl (all theme colors from `utilities/colors`)

### Offsets panel
- TabPanel per breakpoint (Desktop/Tablet/Mobile)
- RangeControl X: 0–120px
- RangeControl Y: 0–200px

---

## Anchor ID Gotcha

Anchor IDs that start with a digit (e.g. `1`, `2`) are valid HTML but invalid CSS selectors. `document.querySelector('#1')` throws. Always use `document.getElementById(id)` — already done in the block's JS.

**Recommendation**: use text-based IDs (`s1`, `s2`, `intro`, `services`) to avoid any edge cases with other libraries.

---

## Popup Direction Logic

| Condition | Popup opens |
|---|---|
| Default (`*-bottom`) | Above trigger, centered horizontally |
| `*-top` positions | Below trigger |
| `left-*` positions | Anchored to left edge of button |
| `data-rotate="true"` + `right-*` | To the **left** of the button |
| `data-rotate="true"` + `left-*` | To the **right** of the button |
