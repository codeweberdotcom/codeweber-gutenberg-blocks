# Lightbox Utility Usage Guide

## Overview

The `lightbox.js` utility provides reusable functions for working with GLightbox across multiple blocks.

Located at: `src/utilities/lightbox.js`

---

## Functions

### 1. `getLightboxAttributes(enableLightbox, galleryName, type, description)`

Generates data attributes for HTML elements to enable lightbox functionality.

**Parameters:**
- `enableLightbox` (boolean) - Enable/disable lightbox
- `galleryName` (string, optional) - Gallery name for grouping images
- `type` (string, default: 'image') - Lightbox type: 'image', 'video', 'youtube', 'vimeo', 'inline'
- `description` (string, optional) - Description/title for lightbox

**Returns:** Object with data attributes

**Example:**
```javascript
import { getLightboxAttributes } from '../../utilities/lightbox';

const attrs = getLightboxAttributes(true, 'my-gallery', 'image', 'Beautiful sunset');
// Returns: { 
//   'data-glightbox': 'image', 
//   'data-gallery': 'my-gallery',
//   'data-glightbox-title': 'Beautiful sunset'
// }

// Use in JSX:
<a href={imageUrl} {...attrs}>
  <img src={imageUrl} alt="..." />
</a>
```

---

### 2. `initLightbox(selector)`

Initializes GLightbox for elements on the page.

**Parameters:**
- `selector` (string, optional) - CSS selector for specific elements

**Returns:** boolean - Success status

**Example:**
```javascript
import { initLightbox } from '../../utilities/lightbox';

// Initialize for all lightbox elements
initLightbox();

// Initialize for specific gallery
initLightbox('[data-gallery="my-gallery"]');

// Use in useEffect for editor
useEffect(() => {
  const timer = setTimeout(() => {
    if (enableLightbox) {
      initLightbox();
    }
  }, 100);
  
  return () => clearTimeout(timer);
}, [enableLightbox, images]);
```

---

### 3. `getLightboxUrl(url, type)`

Formats URLs for different media types (YouTube, Vimeo, etc.).

**Parameters:**
- `url` (string) - Media URL or ID
- `type` (string) - Media type: 'youtube', 'vimeo', 'video', 'image'

**Returns:** string - Formatted URL

**Example:**
```javascript
import { getLightboxUrl } from '../../utilities/lightbox';

// YouTube video ID to URL
const youtubeUrl = getLightboxUrl('dQw4w9WgXcQ', 'youtube');
// Returns: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

// Vimeo video ID to URL
const vimeoUrl = getLightboxUrl('123456789', 'vimeo');
// Returns: 'https://vimeo.com/123456789'

// Already formatted URLs pass through
const imageUrl = getLightboxUrl('https://example.com/image.jpg', 'image');
// Returns: 'https://example.com/image.jpg'
```

---

### 4. `getLightboxType(url)`

Auto-detects media type from URL pattern.

**Parameters:**
- `url` (string) - Media URL

**Returns:** string - Detected type: 'youtube', 'vimeo', 'video', 'image'

**Example:**
```javascript
import { getLightboxType } from '../../utilities/lightbox';

getLightboxType('https://www.youtube.com/watch?v=abc123');
// Returns: 'youtube'

getLightboxType('https://vimeo.com/123456');
// Returns: 'vimeo'

getLightboxType('https://example.com/video.mp4');
// Returns: 'video'

getLightboxType('https://example.com/photo.jpg');
// Returns: 'image'
```

---

### 5. `generateGalleryId(prefix)`

Generates unique gallery IDs.

**Parameters:**
- `prefix` (string, default: 'gallery') - Prefix for ID

**Returns:** string - Unique gallery ID

**Example:**
```javascript
import { generateGalleryId } from '../../utilities/lightbox';

const galleryId = generateGalleryId('my-gallery');
// Returns: 'my-gallery-1234567890-abc123xyz'

// Use as default value in block attributes
const galleryName = attributes.galleryName || generateGalleryId();
```

---

## Usage in Blocks

### Image Block (Already Implemented)

```javascript
// edit.js
import { initLightbox } from '../../utilities/lightbox';

useEffect(() => {
  const timer = setTimeout(() => {
    if (enableLightbox) {
      initLightbox();
    }
  }, 100);
  
  return () => clearTimeout(timer);
}, [enableLightbox]);

// ImageRender.js
import { getLightboxAttributes } from '../../utilities/lightbox';

const lightboxAttrs = getLightboxAttributes(
  enableLightbox, 
  lightboxGallery, 
  'image'
);

return (
  <figure>
    <a href={image.url} {...lightboxAttrs}>
      <img src={image.url} alt={image.alt} />
    </a>
  </figure>
);
```

---

### Button Block (Example Implementation)

Add lightbox support to Button block for opening images/videos:

```javascript
// button/edit.js
import { getLightboxAttributes } from '../../utilities/lightbox';

// In block attributes, add:
// enableLightbox: { type: 'boolean', default: false }
// lightboxType: { type: 'string', default: 'image' }
// lightboxGallery: { type: 'string', default: '' }

const Edit = ({ attributes, setAttributes }) => {
  const { 
    LinkUrl, 
    enableLightbox, 
    lightboxType,
    lightboxGallery 
  } = attributes;
  
  const lightboxAttrs = enableLightbox 
    ? getLightboxAttributes(true, lightboxGallery, lightboxType)
    : {};
  
  return (
    <a 
      href={LinkUrl} 
      className="btn btn-primary"
      {...lightboxAttrs}
    >
      Button Text
    </a>
  );
};
```

---

### Custom Gallery Block (Example)

Create a custom gallery with lightbox:

```javascript
import { getLightboxAttributes, generateGalleryId } from '../../utilities/lightbox';

const Gallery = ({ images, galleryName }) => {
  // Generate unique gallery ID if not provided
  const finalGalleryName = galleryName || generateGalleryId('custom-gallery');
  
  return (
    <div className="gallery">
      {images.map((image, index) => {
        const attrs = getLightboxAttributes(
          true,
          finalGalleryName,
          'image',
          image.caption
        );
        
        return (
          <a 
            key={index}
            href={image.url}
            {...attrs}
          >
            <img src={image.thumb} alt={image.alt} />
          </a>
        );
      })}
    </div>
  );
};
```

---

## Notes

- GLightbox library must be loaded by the theme
- The utility automatically falls back to direct GLightbox initialization if `window.theme.initLightbox` is not available
- Gallery names should be unique to prevent mixing images from different galleries
- Use `data-gallery` attribute to group multiple images into one lightbox gallery

---

## Migration from Old Code

**Before:**
```javascript
const getLightboxAttributes = () => {
  if (!enableLightbox) return {};
  
  const attrs = { 'data-glightbox': 'image' };
  if (lightboxGallery) {
    attrs['data-gallery'] = lightboxGallery;
  }
  return attrs;
};

if (typeof window.theme.initLightbox === 'function') {
  window.theme.initLightbox();
}
```

**After:**
```javascript
import { getLightboxAttributes, initLightbox } from '../../utilities/lightbox';

const lightboxAttrs = getLightboxAttributes(enableLightbox, lightboxGallery, 'image');

initLightbox();
```

---

## Browser Compatibility

Works with modern browsers that support:
- ES6+ JavaScript
- Data attributes
- GLightbox library

---

## License

Part of CodeWeber Gutenberg Blocks plugin.










