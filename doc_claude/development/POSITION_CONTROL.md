# PositionControl — responsive positioning, z-index and scale

Shared Inspector component that takes a block out of the flow and places it
manually: position type, z-index, `top/right/bottom/left` offsets and `scale`
per breakpoint, plus Bootstrap visibility classes.

It automates the pattern the theme demos use by hand:

```html
<img class="position-absolute d-none d-lg-block" style="top: -9%; left: -6%; z-index: 2">
```

**Directory:** `src/components/position/`

| File | Purpose |
|------|---------|
| `PositionControl.js` | Inspector UI |
| `helpers.js` | `getPositionClasses()`, `getPositionStyle()`, sanitizers, constants |
| `style.scss` | Frontend CSS: custom-property cascade across breakpoints |
| `editor.scss` | Dashed outline on hover in the editor |
| `index.js` | Public exports |

**Used by:** `image-simple`.

---

## Breakpoints

Theme breakpoints (`_variables.scss`), not the Bootstrap defaults — note `xxxl`:

| Key | Slug | Min width |
|-----|------|-----------|
| `''` | — | Base (all screens) |
| `Sm` | `sm` | 576px |
| `Md` | `md` | 768px |
| `Lg` | `lg` | 992px |
| `Xl` | `xl` | 1200px |
| `Xxl` | `xxl` | 1400px |
| `Xxxl` | `xxxl` | 1921px |

Empty fields inherit the nearest smaller breakpoint (mobile-first).

---

## Attributes

44 attributes with the `pos` prefix (the prefix is configurable via the
`prefix` prop, but every consumer so far uses `pos`).

| Attribute | Type | Default | Meaning |
|-----------|------|---------|---------|
| `posEnabled` | boolean | `false` | Master toggle. When off, nothing is emitted |
| `posType` | string | `absolute` | `absolute` / `relative` / `fixed` / `sticky` → `position-*` |
| `posZIndex` | string | `''` | Inline `z-index`, clamped to −100…9999 |
| `posOrigin` | string | `''` | `transform-origin` (whitelisted values) |
| `posCenterX` | boolean | `false` | `translate(-50%, …)` — pair with `left: 50%` |
| `posCenterY` | boolean | `false` | `translate(…, -50%)` — pair with `top: 50%` |
| `posVisibleFrom` | string | `''` | Breakpoint slug → `d-none d-{bp}-{display}` |
| `posVisibleDisplay` | string | `block` | `block` / `inline-block` / `flex` / `inline-flex` / `grid` |
| `posHiddenFrom` | string | `''` | Breakpoint slug → `d-{bp}-none` |
| `posTop{Bp}` | string | `''` | Offset, e.g. `10%`, `-2rem`, `0`, `auto` |
| `posRight{Bp}` | string | `''` | Same |
| `posBottom{Bp}` | string | `''` | Same |
| `posLeft{Bp}` | string | `''` | Same |
| `posScale{Bp}` | string | `''` | Scale in percent, 10–300 in the UI |

`{Bp}` is one of `''`, `Sm`, `Md`, `Lg`, `Xl`, `Xxl`, `Xxxl` — e.g. `posTopLg`,
`posScaleXxl`.

A bare number without a unit is treated as pixels. Anything that is not a valid
CSS length is dropped.

---

## Output

Classes + inline CSS custom properties. No `<style>` tags, no dynamic CSS.

```html
<div class="cwgb-image-simple-block position-absolute cwgb-position cwgb-position--transform d-none d-lg-block"
     style="--cwgb-pos-top:10%; --cwgb-pos-left:-5%; --cwgb-pos-scale-lg:0.8; z-index:3">
```

`style.scss` resolves the variables per breakpoint:

```css
.cwgb-position { top: var(--cwgb-pos-top, auto); /* … */ }

@media (min-width: 992px) {
  .cwgb-position {
    top: var(--cwgb-pos-top-lg, var(--cwgb-pos-top-md, var(--cwgb-pos-top-sm, var(--cwgb-pos-top, auto))));
  }
}
```

`cwgb-position--transform` is added only when scale or centering is in play, so
blocks without them do not get a needless stacking context.

---

## Usage

### Sidebar

```jsx
import { PositionControl } from '../../components/position';

<PanelBody title={__('Position', 'codeweber-gutenberg-blocks')} initialOpen={false}>
  <PositionControl attributes={attributes} setAttributes={setAttributes} />
</PanelBody>
```

### edit.js

Visibility classes are skipped in the editor — `d-none` would hide the block in
the canvas:

```jsx
import { getPositionClasses, getPositionStyle } from '../../components/position';

const positionClasses = getPositionClasses(attributes, 'pos', { skipVisibility: true });
const positionStyle = getPositionStyle(attributes);

const blockProps = useBlockProps({
  className: `my-block ${positionClasses}`.replace(/\s+/g, ' ').trim(),
  ...(positionStyle && { style: positionStyle }),
});
```

### save.js

```jsx
const positionClasses = getPositionClasses(attributes);
const positionStyle = getPositionStyle(attributes);

const blockProps = useBlockProps.save({
  className: `my-block ${positionClasses}`.replace(/\s+/g, ' ').trim(),
  ...(positionStyle && { style: positionStyle }),
});
```

Spread `style` conditionally — an unconditional `style` attribute would end up
in the markup of every block that has positioning switched off.

### style.scss / editor.scss of the block

```scss
@import '../../components/position/style.scss';   // in style.scss
@import '../../components/position/editor.scss';  // in editor.scss
```

### block.json

Add the 44 attributes. The scaffold script used for `image-simple` lives in the
session scratchpad; it is trivial to regenerate — 9 shared attributes plus
`Top/Right/Bottom/Left/Scale` × 7 breakpoints, all strings defaulting to `''`
except `posType` (`absolute`), `posVisibleDisplay` (`block`) and the three
booleans.

---

## Gotchas

- **The parent must be positioned.** `position-absolute` measures from the
  nearest positioned ancestor. In the theme that is usually a wrapper with
  `position-relative`; the sidebar shows this as a hint.
- **No `deprecated` entry needed** when adding the attributes to an existing
  block: with `posEnabled: false` the class list and attributes are unchanged.
  Gutenberg compares `class` as a token list, so extra/absent whitespace from
  `.replace(/\s+/g, ' ').trim()` does not invalidate old content.
- **Editor is WYSIWYG for position and scale, but not for visibility.** An
  absolutely positioned block leaves the flow in the editor too and can be hard
  to click — select it from the List View. A dashed outline appears on hover.
- **Custom properties inherit.** `style.scss` resets every `--cwgb-pos-*` to
  `initial` on `.cwgb-position`, so a nested positioned block does not pick up
  its parent's offsets. Inline values still win (inline beats a class rule).
- **`image-simple` in Background render mode** normally drops its wrapper; with
  `posEnabled` the wrapper is kept, otherwise there is nothing to position.
- **`post-grid/style.scss` imports `image-simple/style.scss` inside a
  selector**, so the position CSS is also emitted nested under
  `.cwgb-post-grid-block`. Same declarations, higher specificity — harmless.
- **Bootstrap utilities win.** `position-absolute` carries `!important`, so it
  overrides `position: relative` from the block's own editor styles.
