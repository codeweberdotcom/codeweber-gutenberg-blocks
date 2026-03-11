# Inspector Components

Shared React components in `src/components/`. Used exclusively in block `edit.js` (Inspector/Sidebar).
**Never use these on the frontend** — frontend uses Bootstrap classes only.

Import path: `../../components/<name>/<ComponentName>`

---

## Quick Reference

| Component | Directory | Controls |
|-----------|-----------|----------|
| `BackgroundSettingsPanel` | `background/` | BG type: none/color/image/pattern/video, overlay |
| `AnimationControl` | `animation/` | ScrollCue animation: type, duration, delay, interval |
| `SpacingControl` | `spacing/` | Responsive padding/margin (Bootstrap p/m classes) |
| `AdaptiveControl` | `adaptive/` | Responsive column widths (col-xs to col-xxl) |
| `GapControl` | `gap/` | Responsive gap/gx/gy between grid items |
| `GridControl` | `grid-control/` | Combined: row-cols + gap + spacing |
| `PositioningControl` | `layout/` | text-align, align-items, justify-content, position |
| `SectionSettingsPanel` | `section/` | Section tag, text color, min-height, overflow |
| `AngledControl` | `angled/` | Diagonal dividers (upper/lower angles) |
| `WavesControl` | `waves/` | SVG wave dividers (5 styles, top/bottom) |
| `BorderSettingsPanel` | `borders/` | Border radius, shadow, border position/color/width |
| `BorderRadiusControl` | `border-radius/` | Simple border-radius SelectControl |
| `ShadowControl` | `shadow/` | Box shadow SelectControl |
| `ColorTypeControl` | `colors/` | Color type: solid/soft/pale/gradient |
| `HeadingContentControl` | `heading/` | Title, subtitle, paragraph RichText fields |
| `HeadingTypographyControl` | `heading/` | Typography (color, size, weight, transform, tag) |
| `ParagraphControl` | `paragraph/` | Text RichText + typography |
| `TagControl` | `tag/` | Semantic HTML tag picker (h1-h6, p, div, span) |
| `CodeRender` | `code/` | Syntax-highlighted code block renderer |
| `IconControl` | `icon/` | Icon picker: font/SVG/custom, wrapper, colors |
| `IconRender` | `icon/` | Icon frontend renderer (edit.js + save.js) |
| `InlineSvg` | `icon/` | Async inline SVG loader for editor |
| `ImageControl` | `image/` | Gallery manager: add/sort/delete images |
| `ImageRender` | `image/` | Image with hover effects, overlays, lightbox |
| `ImageSizeControl` | `image-size/` | WordPress image size SelectControl |
| `ImageHoverControl` | `image-hover/` | Hover effect picker (lift, overlay, tooltip...) |
| `LightboxControl` | `lightbox/` | Lightbox toggle + gallery group name |
| `VideoURLControl` | `video-url/` | Video URL input (YT/Vimeo/VK/Rutube) |
| `ImageUpload` | `media-upload/` | Media library picker with preview |
| `BlockMetaFields` | `block-meta/` | Custom class, data attributes, ID fields |
| `ResponsiveControl` | `responsive-control/` | Responsive dropdown/select per breakpoint |
| `LoadMoreControl` | `load-more/` | "Load More" button settings |
| `PostTypeTaxonomyControl` | `post-type-taxonomy/` | Post type + taxonomy filter |
| `TaxonomyFilterControl` | `taxonomy-filter/` | Taxonomy checkboxes (loads from REST) |
| `PostSortControl` | `post-sort/` | orderBy + order selects |
| `PostGridTemplateControl` | `post-grid-template/` | Template picker per post type |
| `PostGridItemRender` | `post-grid-item/` | Renders individual post cards |
| `SwiperSlider` | `swiper/` | Swiper config helpers |

---

## Layout & Spacing

### `AdaptiveControl`

Responsive column widths across all 6 Bootstrap breakpoints.

```jsx
import AdaptiveControl from '../../components/adaptive/AdaptiveControl';

<AdaptiveControl
  columnColXs={attributes.columnColXs}
  columnColSm={attributes.columnColSm}
  columnColMd={attributes.columnColMd}
  columnColLg={attributes.columnColLg}
  columnColXl={attributes.columnColXl}
  columnColXxl={attributes.columnColXxl}
  onChange={(key, value) => setAttributes({ [key]: value })}
/>
```

Writes: `columnColXs/Sm/Md/Lg/Xl/Xxl` — Bootstrap `col-*` classes.

---

### `SpacingControl`

Responsive Bootstrap padding/margin per breakpoint.

```jsx
import SpacingControl from '../../components/spacing/SpacingControl';

<SpacingControl
  spacingType="padding"        // 'padding' | 'margin'
  spacingXs={attributes.paddingXs}
  spacingSm={attributes.paddingSm}
  spacingMd={attributes.paddingMd}
  spacingLg={attributes.paddingLg}
  spacingXl={attributes.paddingXl}
  spacingXxl={attributes.paddingXxl}
  onChange={(attr, value) => setAttributes({ [attr]: value })}
/>
```

Generates: `p-2`, `p-sm-3`, `m-md-0` etc. Values 0–25.

---

### `GapControl`

Gap between grid items across breakpoints.

```jsx
import GapControl from '../../components/gap/GapControl';

<GapControl
  columnsGapType={attributes.columnsGapType}  // 'general' | 'x' | 'y'
  columnsGapXs={attributes.columnsGapXs}
  columnsGapSm={attributes.columnsGapSm}
  columnsGapMd={attributes.columnsGapMd}
  columnsGapLg={attributes.columnsGapLg}
  columnsGapXl={attributes.columnsGapXl}
  columnsGapXxl={attributes.columnsGapXxl}
  onChange={(key, value) => setAttributes({ [key]: value })}
/>
```

Generates: `g-2`, `gx-sm-3`, `gy-md-0` etc. Values 0–10.

---

### `GridControl`

Combines row-cols + gap + spacing in one panel. Use `attributePrefix` to namespace attributes.

```jsx
import GridControl from '../../components/grid-control/GridControl';

<GridControl
  attributes={attributes}
  setAttributes={setAttributes}
  attributePrefix="grid"
  showRowCols={true}
  showGap={true}
  showSpacing={false}
/>
```

Writes prefixed attributes: `gridRowCols*`, `gridGapType`, `gridGap*`.

---

### `PositioningControl`

Flexbox alignment and CSS position.

```jsx
import PositioningControl from '../../components/layout/PositioningControl';

<PositioningControl
  title="Alignment"
  alignItems={attributes.alignItems}
  onAlignItemsChange={(val) => setAttributes({ alignItems: val })}
  justifyContent={attributes.justifyContent}
  onJustifyContentChange={(val) => setAttributes({ justifyContent: val })}
  textAlign={attributes.textAlign}
  onTextAlignChange={(val) => setAttributes({ textAlign: val })}
  showPosition={false}
  noPanel={false}
/>
```

Classes: `align-items-*`, `justify-content-*`, `text-start/center/end`, `position-*`.

---

## Visual & Section Styling

### `BackgroundSettingsPanel`

Full background control: color, image, pattern, video + overlay.

```jsx
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';

<BackgroundSettingsPanel
  attributes={attributes}
  setAttributes={setAttributes}
  allowVideo={false}
  backgroundImageSize={attributes.backgroundImageSize}
  availableImageSizes={['full', 'large', 'medium']}
/>
```

**Attributes:** `backgroundType`, `backgroundColor`, `backgroundColorType`, `backgroundGradient`,
`backgroundImageId`, `backgroundImageUrl`, `backgroundPatternUrl`, `backgroundSize`,
`backgroundOverlay`, `backgroundVideoId`, `backgroundVideoUrl`.

---

### `SectionSettingsPanel`

HTML tag and section-level settings.

```jsx
import { SectionSettingsPanel } from '../../components/section/SectionSettingsPanel';

<SectionSettingsPanel
  sectionTag={attributes.sectionTag}
  textColor={attributes.textColor}
  sectionFrame={attributes.sectionFrame}
  overflowHidden={attributes.overflowHidden}
  positionRelative={attributes.positionRelative}
  minHeight={attributes.minHeight}
  onSectionTagChange={(val) => setAttributes({ sectionTag: val })}
  onTextColorChange={(val) => setAttributes({ textColor: val })}
/>
```

---

### `AngledControl`

Diagonal section dividers.

```jsx
import AngledControl from '../../components/angled/AngledControl';

<AngledControl
  angledEnabled={attributes.angledEnabled}
  angledUpper={attributes.angledUpper}   // '' | 'upper-start' | 'upper-end'
  angledLower={attributes.angledLower}   // '' | 'lower-start' | 'lower-end'
  onAngledEnabledChange={(val) => setAttributes({ angledEnabled: val })}
  onAngledUpperChange={(val) => setAttributes({ angledUpper: val })}
  onAngledLowerChange={(val) => setAttributes({ angledLower: val })}
/>
```

---

### `WavesControl`

SVG wave dividers for sections.

```jsx
import WavesControl from '../../components/waves/WavesControl';
import { WAVE_SVGS } from '../../components/waves/WavesControl';

<WavesControl attributes={attributes} setAttributes={setAttributes} />
```

Exports `WAVE_SVGS` for use in `save.js` to render wave markup.

---

### `BorderSettingsPanel`

Combined border/shadow panel.

```jsx
import BorderSettingsPanel from '../../components/borders/BorderSettingsPanel';

<BorderSettingsPanel
  borderRadius={attributes.borderRadius}
  shadow={attributes.shadow}
  borderPosition={attributes.borderPosition}
  borderColor={attributes.borderColor}
  borderColorType={attributes.borderColorType}
  borderWidth={attributes.borderWidth}
  onBorderRadiusChange={(val) => setAttributes({ borderRadius: val })}
  onShadowChange={(val) => setAttributes({ shadow: val })}
  showBorder={true}
  showShadow={true}
  showBorderRadius={true}
/>
```

---

### `BorderRadiusControl` / `ShadowControl`

Simple single-attribute selects.

```jsx
import BorderRadiusControl from '../../components/border-radius/BorderRadiusControl';
import ShadowControl from '../../components/shadow/ShadowControl';

<BorderRadiusControl value={attributes.borderRadius} onChange={(v) => setAttributes({ borderRadius: v })} />
<ShadowControl value={attributes.shadow} onChange={(v) => setAttributes({ shadow: v })} />
```

---

### `AnimationControl`

ScrollCue scroll animation settings.

```jsx
import AnimationControl from '../../components/animation/Animation';

<AnimationControl attributes={attributes} setAttributes={setAttributes} />
```

**Attributes:** `animationEnabled`, `animationType`, `animationDuration`, `animationDelay`,
`animationInterval` (negative values allowed for staggered children).

Types: `fadeIn`, `slideInLeft/Right/Down/Up`, `zoomIn/Out`, `rotateIn`, `bounceIn`, `flipInX/Y`.

---

## Colors & Typography

### `ColorTypeControl`

Button group for color type variants.

```jsx
import ColorTypeControl from '../../components/colors/ColorTypeControl';

<ColorTypeControl
  value={attributes.colorType}
  onChange={(val) => setAttributes({ colorType: val })}
  // default options: solid | soft | pale | gradient
/>
```

---

### `HeadingContentControl`

RichText fields for title + subtitle + paragraph.

```jsx
import HeadingContentControl from '../../components/heading/HeadingContentControl';

<HeadingContentControl
  attributes={attributes}
  setAttributes={setAttributes}
  hideSubtitle={false}
  hideText={true}
/>
```

**Attributes:** `enableTitle`, `title`, `titleTag`, `enableSubtitle`, `subtitle`, `subtitleTag`,
`subtitleLineType`, `enableText`, `text`.

---

### `HeadingTypographyControl`

Tabbed typography panel (Title / Subtitle / Paragraph tabs).

```jsx
import HeadingTypographyControl from '../../components/heading/HeadingTypographyControl';

<HeadingTypographyControl attributes={attributes} setAttributes={setAttributes} />
```

Each tab: color type + color, font size, weight, transform, additional class, HTML tag.

---

### `ParagraphControl`

Text RichText + typography, with prefix for attribute namespacing.

```jsx
import ParagraphControl from '../../components/paragraph/ParagraphControl';
import { paragraphAttributes } from '../../components/paragraph/ParagraphControl';

// In edit.js:
<ParagraphControl attributes={attributes} setAttributes={setAttributes} prefix="intro" label="Intro Text" />

// In block.json (or attribute definitions), use helper:
// paragraphAttributes('intro') returns attribute definitions for intro* fields
```

Writes: `{prefix}Text`, `{prefix}TextColor`, `{prefix}TextColorType`, `{prefix}TextSize`,
`{prefix}TextWeight`, `{prefix}TextTransform`, `{prefix}TextClass`.

---

### `TagControl`

Semantic HTML tag picker.

```jsx
import { TagControl } from '../../components/tag/TagControl';

<TagControl
  value={attributes.titleTag}
  onChange={(val) => setAttributes({ titleTag: val })}
  type="heading"    // 'heading' | 'subtitle' | 'text'
/>
```

Heading options: `h1`–`h6`, `div`, `display-1`–`display-6`. Text options: `p`, `div`, `span`.

---

## Icons

### `IconControl`

Full icon inspector: font/SVG/custom type, picker, colors, wrapper button.

```jsx
import IconControl from '../../components/icon/IconControl';

<IconControl
  attributes={attributes}
  setAttributes={setAttributes}
  prefix="icon"       // '' for no prefix, 'icon' for iconType/iconName attrs, 'second' for secondIconType etc.
  allowSvg={true}
  allowFont={true}
  showWrapper={true}
  initialOpen={false}
/>
```

**Prefixed attributes written:** `{prefix}IconType`, `{prefix}IconName`, `{prefix}SvgIcon`,
`{prefix}SvgStyle`, `{prefix}IconSize`, `{prefix}IconFontSize`, `{prefix}IconColor`,
`{prefix}IconColor2`, `{prefix}IconWrapper`, `{prefix}IconWrapperStyle`, `{prefix}IconBtnSize`,
`{prefix}IconBtnVariant`, `{prefix}IconWrapperClass`, `{prefix}IconGradientColor`,
`{prefix}CustomSvgUrl`, `{prefix}CustomSvgId`.

Use `prefix="second"` for a second icon in the same block.

---

### `IconRender` / `IconRenderSave`

Use `IconRender` in `edit.js` (loads SVG inline), `IconRenderSave` in `save.js`.

```jsx
import IconRender from '../../components/icon/IconRender';

<IconRender
  iconType={attributes.iconType}
  iconName={attributes.iconName}
  svgIcon={attributes.svgIcon}
  svgStyle={attributes.svgStyle}
  iconSize={attributes.iconSize}
  iconColor={attributes.iconColor}
  iconWrapper={attributes.iconWrapper}
  iconWrapperStyle={attributes.iconWrapperStyle}
  isEditor={true}
/>
```

Font icons render as `<i class="uil uil-{name}">`. SVG icons render as inline SVG in editor,
`<img class="svg-inject">` in save.

---

## Images & Media

### `ImageControl`

Gallery manager for multi-image blocks.

```jsx
import ImageControl from '../../components/image/ImageControl';

<ImageControl
  images={attributes.images}
  setAttributes={setAttributes}
  imageSize={attributes.imageSize}
/>
```

Image object structure: `{ id, url, sizes, alt, title, caption, description, linkUrl }`.

---

### `ImageRender` / `ImageRenderSave`

Single image with effects, overlays, lightbox. Use `ImageRender` in `edit.js`, `ImageRenderSave` in `save.js`.

```jsx
import ImageRender from '../../components/image/ImageRender';

<ImageRender
  image={image}
  effectType={attributes.effectType}     // 'overlay' | 'tooltip' | 'caption' | 'icon' | ''
  overlayType={attributes.overlayType}   // 'overlay-1'...'overlay-4'
  enableLightbox={attributes.enableLightbox}
  borderRadius={attributes.borderRadius}
  isEditor={true}
/>
```

---

### `ImageSizeControl`

WordPress image size dropdown.

```jsx
import ImageSizeControl from '../../components/image-size/ImageSizeControl';

<ImageSizeControl
  value={attributes.imageSize}
  onChange={(val) => setAttributes({ imageSize: val })}
  postType="post"
/>
```

---

### `ImageHoverControl`

Hover effect picker for images.

```jsx
import ImageHoverControl from '../../components/image-hover/ImageHoverControl';
import { getImageHoverClasses } from '../../components/image-hover/ImageHoverControl';

<ImageHoverControl attributes={attributes} setAttributes={setAttributes} />

// In render:
const hoverClasses = getImageHoverClasses(attributes);
```

Simple: `lift`, `hover-scale`. Advanced: `overlay-1`–`overlay-4`, `tooltip`.

---

### `LightboxControl`

```jsx
import LightboxControl from '../../components/lightbox/LightboxControl';

<LightboxControl attributes={attributes} setAttributes={setAttributes} />
```

Attributes: `enableLightbox` (boolean), `lightboxGallery` (string — gallery group name).

---

### `VideoURLControl`

Video URL input with auto-parsing from embed codes.

```jsx
import VideoURLControl from '../../components/video-url/VideoURLControl';

<VideoURLControl
  videoType="youtube"    // 'youtube' | 'vimeo' | 'vk' | 'rutube'
  value={attributes.videoUrl}
  onChange={(url, meta) => setAttributes({ videoUrl: url })}
  autoloadPoster={true}
  onPosterLoad={(posterUrl) => setAttributes({ posterUrl })}
/>
```

---

### `ImageUpload` / `VideoUpload`

Media library pickers with full metadata.

```jsx
import { ImageUpload } from '../../components/media-upload/ImageUpload';

<ImageUpload
  image={attributes.image}
  onChange={(mediaObj) => setAttributes({ image: mediaObj })}
  label="Background Image"
  showPreview={true}
/>
```

`onChange` receives: `{ id, url, sizes, alt, title, caption, description }`.

---

## Responsive Controls

### `ResponsiveControl`

Generic responsive control (dropdown or select) across all breakpoints.

```jsx
import ResponsiveControl, {
  createSwiperItemsConfig,
  createColumnsConfig,
  createColumnWidthConfig,
} from '../../components/responsive-control/ResponsiveControl';

// Using preset helper (recommended):
const config = createSwiperItemsConfig(attributes, setAttributes);
<ResponsiveControl {...config} />

// Manual:
<ResponsiveControl
  label="Items per row"
  variant="select"      // 'select' | 'dropdown'
  breakpoints={[
    { key: 'xs', label: 'XS', value: attributes.itemsXs, attribute: 'itemsXs', options: [...] },
    { key: 'sm', label: 'SM', value: attributes.itemsSm, attribute: 'itemsSm', options: [...] },
    // md, lg, xl, xxl
  ]}
  onChange={(attr, value) => setAttributes({ [attr]: value })}
/>
```

**Preset helpers:**
- `createSwiperItemsConfig` — items per slide, 1–12
- `createColumnsConfig` — row-cols, 1–6
- `createColumnWidthConfig` — col-1 to col-12

---

## Posts & Data

### `PostTypeTaxonomyControl`

Post type selector + taxonomy filter combined.

```jsx
import PostTypeTaxonomyControl from '../../components/post-type-taxonomy/PostTypeTaxonomyControl';

<PostTypeTaxonomyControl
  postType={attributes.postType}
  selectedTaxonomies={attributes.selectedTaxonomies}
  onPostTypeChange={(val) => setAttributes({ postType: val, selectedTaxonomies: {} })}
  onTaxonomyChange={(val) => setAttributes({ selectedTaxonomies: val })}
/>
```

Loads post types from `/wp/v2/types`, taxonomies from `/codeweber-gutenberg-blocks/v1/taxonomies/{postType}`.

---

### `PostSortControl`

```jsx
import PostSortControl from '../../components/post-sort/PostSortControl';

<PostSortControl
  orderBy={attributes.orderBy}
  order={attributes.order}
  onOrderByChange={(val) => setAttributes({ orderBy: val })}
  onOrderChange={(val) => setAttributes({ order: val })}
/>
```

`orderBy` options: `date`, `title`, `modified`, `comment_count`, `rand`, `id`, `author`, `menu_order`.

---

### `PostGridTemplateControl`

Template picker based on post type.

```jsx
import PostGridTemplateControl from '../../components/post-grid-template/PostGridTemplateControl';

<PostGridTemplateControl
  value={attributes.template}
  onChange={(val) => setAttributes({ template: val })}
  postType={attributes.postType}
/>
```

Templates vary by post type: `card`, `default`, `slider`, `overlay-5`, `testimonials`, `staff`, `faq`, `clients`, `documents`.

---

### `LoadMoreControl`

"Load More" button settings.

```jsx
import LoadMoreControl from '../../components/load-more/LoadMoreControl';

<LoadMoreControl
  attributes={attributes}
  setAttributes={setAttributes}
  attributePrefix="loadMore"
/>
```

Writes: `loadMoreEnable`, `loadMoreInitialCount`, `loadMoreLoadMoreCount`, `loadMoreText`,
`loadMoreType`, `loadMoreButtonSize`, `loadMoreButtonStyle`.

---

## Utility Components

### `BlockMetaFields`

Custom class, data attributes, and ID for any block.

```jsx
import BlockMetaFields from '../../components/block-meta/BlockMetaFields';

<BlockMetaFields
  attributes={attributes}
  setAttributes={setAttributes}
  fieldKeys={{ classKey: 'sectionClass', dataKey: 'sectionData', idKey: 'sectionId' }}
/>
```

---

### `CodeRender`

Renders syntax-highlighted code block (used in editor preview).

```jsx
import CodeRender from '../../components/code/CodeRender';

<CodeRender content={attributes.content} language="html" copyLabel="Copy" backgroundColor="dark" />
```

Uses `.code-wrapper`, `.btn-clipboard` markup matching theme's ClipboardJS integration.

---

### `SwiperSlider` helpers

```jsx
import {
  getSwiperContainerClasses,
  getSwiperDataAttributes,
} from '../../components/swiper/SwiperSlider';

const classes = getSwiperContainerClasses(attributes);
const dataAttrs = getSwiperDataAttributes(attributes);
```

---

## Key Patterns

### Multiple icons in one block

Use `prefix` to separate two icon sets:

```jsx
<IconControl attributes={attributes} setAttributes={setAttributes} prefix="" label="Primary Icon" />
<IconControl attributes={attributes} setAttributes={setAttributes} prefix="second" label="Secondary Icon" />
// Writes: iconType, iconName... AND secondIconType, secondIconName...
```

### edit.js vs save.js components

| For | In edit.js | In save.js |
|-----|-----------|-----------|
| Icons | `IconRender` (isEditor=true) | `IconRenderSave` |
| Images with effects | `ImageRender` (isEditor=true) | `ImageRenderSave` |
| Simple images | `ImageSimpleRender` (isEditor=true) | `ImageSimpleRenderSave` |
