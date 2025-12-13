# Swiper Component Usage Guide

## Overview

Universal Swiper slider component for creating carousels and sliders with any content.

Located at: `src/components/swiper/SwiperSlider.js`

---

## Components

### 1. `SwiperSlider`

Main container component for Swiper slider.

**Props:**
- `children` (Array) - Slide content (array of `SwiperSlide` components)
- `config` (Object) - Swiper configuration object
- `className` (string, optional) - Additional CSS classes
- `uniqueKey` (string, optional) - Unique key for forcing React re-render

**Example:**
```javascript
import { SwiperSlider, SwiperSlide } from '../../components/swiper/SwiperSlider';

const config = {
  effect: 'slide',
  items: '3',
  autoplay: true,
  nav: true,
  dots: true,
};

<SwiperSlider config={config} uniqueKey="my-slider">
  <SwiperSlide>
    <img src="image1.jpg" alt="Slide 1" />
  </SwiperSlide>
  <SwiperSlide>
    <img src="image2.jpg" alt="Slide 2" />
  </SwiperSlide>
  <SwiperSlide>
    <img src="image3.jpg" alt="Slide 3" />
  </SwiperSlide>
</SwiperSlider>
```

---

### 2. `SwiperSlide`

Wrapper component for individual slide content.

**Props:**
- `children` (React.ReactNode) - Slide content
- `className` (string, optional) - Additional CSS classes

**Example:**
```javascript
import { SwiperSlide } from '../../components/swiper/SwiperSlider';

<SwiperSlide className="custom-slide">
  <div className="card">
    <h3>Slide Title</h3>
    <p>Slide content</p>
  </div>
</SwiperSlide>
```

---

## Utility Functions

### 1. `getSwiperConfigFromAttributes(attributes)`

Generates Swiper configuration object from block attributes.

**Parameters:**
- `attributes` (Object) - Block attributes containing swiper settings

**Returns:** Object - Swiper configuration

**Example:**
```javascript
import { getSwiperConfigFromAttributes } from '../../components/swiper/SwiperSlider';

const swiperConfig = getSwiperConfigFromAttributes(attributes);
// Returns: {
//   effect: 'slide',
//   speed: 500,
//   items: '3',
//   itemsXs: '1',
//   ...
// }
```

---

### 2. `getSwiperContainerClasses(config)`

Generates CSS classes for Swiper container.

**Parameters:**
- `config` (Object) - Swiper configuration with styling options

**Returns:** string - Space-separated class names

**Example:**
```javascript
import { getSwiperContainerClasses } from '../../components/swiper/SwiperSlider';

const classes = getSwiperContainerClasses({
  containerType: 'container-fluid',
  navStyle: 'nav-dark',
  navPosition: 'nav-start',
  dotsStyle: 'dots-over',
});
// Returns: "swiper-container container-fluid nav-dark nav-start dots-over"
```

---

### 3. `getSwiperDataAttributes(config)`

Generates data attributes for Swiper initialization.

**Parameters:**
- `config` (Object) - Swiper configuration

**Returns:** Object - Data attributes object

**Example:**
```javascript
import { getSwiperDataAttributes } from '../../components/swiper/SwiperSlider';

const dataAttrs = getSwiperDataAttributes({
  effect: 'fade',
  speed: 800,
  items: '3',
  autoplay: true,
  loop: true,
  nav: true,
  dots: true,
});

// Use in JSX:
<div {...dataAttrs}>...</div>
// Renders as:
// <div data-effect="fade" data-speed="800" data-items="3" 
//      data-autoplay="true" data-loop="true" data-nav="true" 
//      data-dots="true">...</div>
```

---

### 4. `initSwiper(selector)`

Initializes Swiper for elements on the page.

**Parameters:**
- `selector` (string, optional) - CSS selector for specific elements

**Returns:** boolean - Success status

**Example:**
```javascript
import { initSwiper } from '../../components/swiper/SwiperSlider';

// Initialize all Swiper instances
initSwiper();

// Initialize specific slider
initSwiper('.my-custom-slider');

// Use in useEffect for editor
useEffect(() => {
  const timer = setTimeout(() => {
    if (displayMode === 'swiper') {
      initSwiper();
    }
  }, 300);
  
  return () => clearTimeout(timer);
}, [displayMode, swiperEffect]);
```

---

### 5. `destroySwiper(selector)`

Destroys Swiper instances (cleanup before re-initialization).

**Parameters:**
- `selector` (string, optional) - CSS selector for specific elements

**Returns:** boolean - Success status

**Example:**
```javascript
import { destroySwiper } from '../../components/swiper/SwiperSlider';

// Destroy all Swiper instances
destroySwiper();

// Destroy specific slider
destroySwiper('.my-slider .swiper');

// Use in useEffect cleanup
useEffect(() => {
  destroySwiper('.cwgb-image-block .swiper');
  
  const timer = setTimeout(() => {
    initSwiper();
  }, 100);
  
  return () => {
    clearTimeout(timer);
    destroySwiper('.cwgb-image-block .swiper');
  };
}, [/* dependencies */]);
```

---

## Configuration Object

The Swiper configuration object supports all standard Swiper options:

```javascript
const config = {
  // Effect & Speed
  effect: 'slide',          // slide, fade, cube, coverflow, flip
  speed: 500,               // Transition speed in ms
  
  // Items per View (Responsive)
  items: '3',               // Default (XL+)
  itemsXs: '1',             // <576px
  itemsSm: '',              // ≥576px
  itemsMd: '2',             // ≥768px
  itemsLg: '',              // ≥992px
  itemsXl: '3',             // ≥1200px
  itemsXxl: '',             // ≥1400px
  itemsAuto: false,         // Auto width slides
  
  // Spacing & Behavior
  margin: '30',             // Space between slides (px)
  loop: false,              // Infinite loop
  centered: false,          // Center active slide
  autoHeight: false,        // Auto height adjustment
  watchOverflow: false,     // Disable if not enough slides
  updateResize: true,       // Update on window resize
  drag: true,               // Enable mouse/touch drag
  reverse: false,           // Reverse direction
  
  // Autoplay
  autoplay: false,          // Enable autoplay
  autoplayTime: 5000,       // Autoplay delay (ms)
  
  // Navigation
  nav: true,                // Show navigation arrows
  dots: true,               // Show pagination dots
  
  // Styling
  containerType: '',        // container, container-fluid, etc.
  navStyle: 'nav-dark',     // nav-dark, nav-light
  navPosition: '',          // nav-start, nav-center, etc.
  dotsStyle: 'dots-over',   // dots-over, dots-light, dots-dark
};
```

---

## Complete Example: Image Gallery Slider

```javascript
import { SwiperSlider, SwiperSlide, getSwiperConfigFromAttributes } from '../../components/swiper/SwiperSlider';
import { useEffect } from '@wordpress/element';
import { initSwiper, destroySwiper } from '../../components/swiper/SwiperSlider';

export default function Edit({ attributes, setAttributes, clientId }) {
  const { displayMode, images, /* ...other swiper attributes */ } = attributes;
  
  // Get Swiper configuration from block attributes
  const swiperConfig = getSwiperConfigFromAttributes(attributes);
  
  // Initialize Swiper when needed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Cleanup old instances
    destroySwiper('.my-block .swiper');
    
    const timer = setTimeout(() => {
      if (displayMode === 'swiper') {
        initSwiper();
        console.log('✅ Swiper initialized');
      }
    }, 300);
    
    return () => {
      clearTimeout(timer);
      destroySwiper('.my-block .swiper');
    };
  }, [displayMode, attributes.swiperEffect /* ...other deps */]);
  
  const blockProps = useBlockProps({
    className: 'my-block',
  });
  
  return (
    <div {...blockProps}>
      {displayMode === 'swiper' && (
        <SwiperSlider 
          config={swiperConfig}
          uniqueKey={`swiper-${attributes.swiperEffect}-${clientId}`}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image.url} alt={image.alt || ''} />
            </SwiperSlide>
          ))}
        </SwiperSlider>
      )}
    </div>
  );
}
```

---

## Complete Example: Card Carousel

```javascript
import { SwiperSlider, SwiperSlide } from '../../components/swiper/SwiperSlider';

const CarouselBlock = () => {
  const config = {
    effect: 'slide',
    items: '3',
    itemsXs: '1',
    itemsMd: '2',
    itemsXl: '3',
    margin: '30',
    loop: true,
    autoplay: true,
    autoplayTime: 5000,
    nav: true,
    dots: true,
    navStyle: 'nav-dark',
    dotsStyle: 'dots-over',
  };
  
  const cards = [
    { title: 'Card 1', content: 'Content 1' },
    { title: 'Card 2', content: 'Content 2' },
    { title: 'Card 3', content: 'Content 3' },
  ];
  
  return (
    <SwiperSlider config={config}>
      {cards.map((card, index) => (
        <SwiperSlide key={index}>
          <div className="card">
            <div className="card-body">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </SwiperSlider>
  );
};
```

---

## Block Attributes for Swiper

If you want to use Swiper in your custom block, add these attributes to `block.json`:

```json
{
  "attributes": {
    "displayMode": {
      "type": "string",
      "default": "single"
    },
    "swiperEffect": {
      "type": "string",
      "default": "slide"
    },
    "swiperItems": {
      "type": "string",
      "default": "3"
    },
    "swiperItemsXs": {
      "type": "string",
      "default": "1"
    },
    "swiperItemsMd": {
      "type": "string",
      "default": "2"
    },
    "swiperItemsXl": {
      "type": "string",
      "default": "3"
    },
    "swiperSpeed": {
      "type": "number",
      "default": 500
    },
    "swiperAutoplay": {
      "type": "boolean",
      "default": false
    },
    "swiperAutoplayTime": {
      "type": "number",
      "default": 5000
    },
    "swiperMargin": {
      "type": "string",
      "default": "30"
    },
    "swiperLoop": {
      "type": "boolean",
      "default": false
    },
    "swiperNav": {
      "type": "boolean",
      "default": true
    },
    "swiperDots": {
      "type": "boolean",
      "default": true
    },
    "swiperNavStyle": {
      "type": "string",
      "default": "nav-dark"
    },
    "swiperDotsStyle": {
      "type": "string",
      "default": "dots-over"
    }
  }
}
```

---

## Swiper Effects

Available effects:
- `slide` - Default sliding effect
- `fade` - Fade transition
- `cube` - 3D cube effect
- `coverflow` - Coverflow effect
- `flip` - 3D flip effect

---

## Navigation Styles

**navStyle:**
- `nav-dark` - Dark arrows
- `nav-light` - Light arrows

**navPosition:**
- `nav-start` - Left alignment
- `nav-center` - Center alignment (default)
- `nav-end` - Right alignment

**dotsStyle:**
- `dots-over` - Dots overlay on slider
- `dots-light` - Light dots
- `dots-dark` - Dark dots

---

## Notes

- Swiper library must be loaded by the theme (`window.theme.swiperSlider`)
- The component automatically handles initialization and cleanup
- Use `uniqueKey` prop to force Swiper re-initialization when settings change
- All data attributes are automatically generated from config object
- Responsive breakpoints follow Bootstrap 5 standards

---

## Migration from Old Code

**Before:**
```javascript
const getSwiperContainerClasses = () => {
  const classes = ['swiper-container'];
  if (swiperNavStyle) classes.push(swiperNavStyle);
  // ... many more lines
  return classes.join(' ');
};

const getSwiperDataAttributes = () => {
  const attrs = {};
  attrs['data-effect'] = swiperEffect;
  // ... many more lines
  return attrs;
};

<div className={getSwiperContainerClasses()} {...getSwiperDataAttributes()}>
  <div className="swiper">
    <div className="swiper-wrapper">
      {items.map((item, index) => (
        <div key={index} className="swiper-slide">
          {item.content}
        </div>
      ))}
    </div>
  </div>
</div>
```

**After:**
```javascript
import { 
  SwiperSlider, 
  SwiperSlide, 
  getSwiperConfigFromAttributes 
} from '../../components/swiper/SwiperSlider';

const swiperConfig = getSwiperConfigFromAttributes(attributes);

<SwiperSlider config={swiperConfig}>
  {items.map((item, index) => (
    <SwiperSlide key={index}>
      {item.content}
    </SwiperSlide>
  ))}
</SwiperSlider>
```

---

## Browser Compatibility

Works with modern browsers that support:
- ES6+ JavaScript
- Swiper.js library (loaded by theme)
- Data attributes

---

## License

Part of CodeWeber Gutenberg Blocks plugin.







