# Image Hover Control Usage Guide

## Overview

Universal component for managing image hover effects based on Sandbox theme.

Documentation: https://sandbox.elemisthemes.com/docs/elements/image-hover.html

Located at: `src/components/image-hover/ImageHoverControl.js`

---

## Components

### 1. `ImageHoverControl`

UI control panel for managing hover effects.

**Props:**
- `attributes` (Object) - Block attributes
- `setAttributes` (Function) - Function to update attributes

**Required Attributes:**
```javascript
// Add to your block.json:
{
  "attributes": {
    "simpleEffect": {
      "type": "string",
      "default": "none"
    },
    "effectType": {
      "type": "string",
      "default": "none"
    },
    "tooltipStyle": {
      "type": "string",
      "default": "itooltip-dark"
    },
    "overlayStyle": {
      "type": "string",
      "default": "overlay-1"
    },
    "overlayGradient": {
      "type": "string",
      "default": "gradient-1"
    },
    "overlayColor": {
      "type": "boolean",
      "default": false
    },
    "cursorStyle": {
      "type": "string",
      "default": "cursor-dark"
    }
  }
}
```

**Example:**
```javascript
import { ImageHoverControl } from '../../components/image-hover';

export default function Edit({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <ImageHoverControl 
        attributes={attributes} 
        setAttributes={setAttributes} 
      />
    </InspectorControls>
  );
}
```

---

### 2. `getImageHoverClasses(attributes)`

Generates CSS classes from hover settings.

**Parameters:**
- `attributes` (Object) - Block attributes

**Returns:** string - Space-separated class names

**Example:**
```javascript
import { getImageHoverClasses } from '../../components/image-hover';

const hoverClasses = getImageHoverClasses(attributes);
// Returns: "hover-scale overlay overlay-3 overlay-gradient-1"

<figure className={`${hoverClasses} rounded`.trim()}>
  <a href={image.url}>
    <img src={image.url} alt={image.alt} />
  </a>
</figure>
```

---

### 3. `getTooltipTitle(image, effectType)`

Generates HTML for tooltip title attribute.

**Parameters:**
- `image` (Object) - Image object with title, caption, description
- `effectType` (string) - Current effect type

**Returns:** string - HTML string for tooltip

**Example:**
```javascript
import { getTooltipTitle } from '../../components/image-hover';

const tooltipTitle = getTooltipTitle(image, effectType);
// Returns: "<h5 class="mb-1">Image Title</h5><p class="mb-0">Description</p>"

<figure 
  className="itooltip itooltip-dark"
  title={tooltipTitle}
>
  <a href={image.url}>
    <img src={image.url} alt={image.alt} />
  </a>
</figure>
```

---

## Effect Types

### Simple Effects (Mutually Exclusive)

Only ONE can be active at a time:

#### 1. **None**
```html
<figure class="rounded">
  <a href="#"><img src="image.jpg" alt="" /></a>
</figure>
```

#### 2. **Lift**
```html
<figure class="lift rounded">
  <a href="#"><img src="image.jpg" alt="" /></a>
</figure>
```

#### 3. **Hover Scale**
```html
<figure class="hover-scale rounded">
  <a href="#"><img src="image.jpg" alt="" /></a>
</figure>
```

---

### Dependent Effects (Mutually Exclusive)

Only ONE can be active at a time:

#### 1. **Tooltip**

**Styles:** `itooltip-dark`, `itooltip-light`, `itooltip-primary`

```html
<figure class="itooltip itooltip-dark hover-scale rounded" 
        title='<h5 class="mb-1">Some Title</h5><p class="mb-0">Description</p>'>
  <a href="#"><img src="image.jpg" alt="" /></a>
</figure>
```

#### 2. **Overlay**

**Overlay 1 (Basic):**
```html
<figure class="overlay overlay-1 hover-scale rounded">
  <a href="#"><img src="image.jpg" alt="" /></a>
  <figcaption>
    <h5 class="from-top mb-0">Some Title</h5>
  </figcaption>
</figure>
```

**Overlay 2 (Color):**
```html
<figure class="overlay overlay-2 hover-scale color rounded">
  <a href="#"><img src="image.jpg" alt="" /></a>
  <figcaption>
    <h5 class="from-top mb-1">Some Title</h5>
    <p class="from-bottom">Description</p>
  </figcaption>
</figure>
```

**Overlay 3 (Gradient):**
```html
<figure class="overlay overlay-3 overlay-gradient-1 hover-scale rounded">
  <a href="#"><img src="image.jpg" alt="" /></a>
  <figcaption>
    <h5 class="from-left mb-1">Some Title</h5>
    <p class="from-left mb-0">Description</p>
  </figcaption>
</figure>
```

**Available Gradients:** gradient-1 through gradient-7

**Overlay 4 (Plus Sign):**
```html
<figure class="overlay overlay-4 hover-scale rounded">
  <a href="#"><img src="image.jpg" alt="" /></a>
  <figcaption>
    <div class="from-top mb-0 h5">
      <span class="mt-5">+</span>
    </div>
  </figcaption>
</figure>
```

#### 3. **Cursor**

**Styles:** `cursor-dark`, `cursor-light`, `cursor-primary`

```html
<figure class="hover-scale cursor-dark rounded">
  <a href="#"><img src="image.jpg" alt="" /></a>
</figure>
```

---

## Complete Example

```javascript
import { InspectorControls } from '@wordpress/block-editor';
import { ImageHoverControl, getImageHoverClasses, getTooltipTitle } from '../../components/image-hover';

export default function Edit({ attributes, setAttributes }) {
  const {
    image,
    borderRadius,
    effectType,
    // ... other attributes
  } = attributes;

  const hoverClasses = getImageHoverClasses(attributes);
  const tooltipTitle = getTooltipTitle(image, effectType);

  return (
    <>
      <InspectorControls>
        <ImageHoverControl 
          attributes={attributes} 
          setAttributes={setAttributes} 
        />
      </InspectorControls>

      <div className="wp-block-my-image">
        {effectType === 'tooltip' ? (
          <figure 
            className={`${hoverClasses} ${borderRadius}`.trim()}
            title={tooltipTitle}
          >
            <a href={image.url}>
              <img src={image.url} alt={image.alt} />
            </a>
          </figure>
        ) : effectType === 'overlay' ? (
          <figure className={`${hoverClasses} ${borderRadius}`.trim()}>
            <a href={image.url}>
              <img src={image.url} alt={image.alt} />
            </a>
            {/* Overlay requires figcaption - see overlay examples above */}
            <figcaption>
              <h5 className="from-top mb-0">{image.title}</h5>
            </figcaption>
          </figure>
        ) : (
          <figure className={`${hoverClasses} ${borderRadius}`.trim()}>
            <a href={image.url}>
              <img src={image.url} alt={image.alt} />
            </a>
          </figure>
        )}
      </div>
    </>
  );
}
```

---

## Effect Combinations

### ✅ Valid Combinations

Simple Effect + Advanced Effect (one each):
```
lift + tooltip       ✅
lift + overlay       ✅
lift + cursor        ✅
hover-scale + tooltip   ✅
hover-scale + overlay   ✅
hover-scale + cursor    ✅
```

### ❌ Invalid Combinations

Cannot combine multiple effects of the same type:
```
lift + hover-scale     ❌ (both Simple)
tooltip + overlay      ❌ (both Advanced)
overlay + cursor       ❌ (both Advanced)
tooltip + cursor       ❌ (both Advanced)
```

---

## Attributes Reference

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `simpleEffect` | string | 'none' | Simple effect: none, lift, hover-scale |
| `effectType` | string | 'none' | Advanced effect type: none, tooltip, overlay, cursor |
| `tooltipStyle` | string | 'itooltip-dark' | Tooltip style |
| `overlayStyle` | string | 'overlay-1' | Overlay style (1-4) |
| `overlayGradient` | string | 'gradient-1' | Gradient for overlay-3 (1-7) |
| `overlayColor` | boolean | false | Primary color for overlay-2 |
| `cursorStyle` | string | 'cursor-dark' | Cursor style |

---

## CSS Classes Reference

### Independent (Simple)
- `lift` - Lifts element on hover
- `hover-scale` - Scales element on hover

### Dependent (Tooltip)
- `itooltip` - Base tooltip class
- `itooltip-dark` - Dark tooltip
- `itooltip-light` - Light tooltip
- `itooltip-primary` - Primary color tooltip

### Dependent (Overlay)
- `overlay` - Base overlay class
- `overlay-1` - Basic overlay
- `overlay-2` - Color overlay (+ `color` for primary)
- `overlay-3` - Gradient overlay (+ `overlay-gradient-1` through `overlay-gradient-7`)
- `overlay-4` - Icon overlay

### Dependent (Cursor)
- `cursor-dark` - Dark cursor icon
- `cursor-light` - Light cursor icon
- `cursor-primary` - Primary cursor icon

---

## Browser Compatibility

Works with modern browsers that support:
- CSS transforms and transitions
- iTooltip library (for tooltips)
- Sandbox theme styles

---

## License

Part of CodeWeber Gutenberg Blocks plugin.
Based on Sandbox theme by Elemis.

