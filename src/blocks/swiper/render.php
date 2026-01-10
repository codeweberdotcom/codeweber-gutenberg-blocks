<?php
/**
 * Swiper Block - Server-side render
 * 
 * @package CodeWeber Gutenberg Blocks
 * 
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

if (!defined('ABSPATH')) {
	exit;
}

// Get attributes
$swiperMargin = isset($attributes['swiperMargin']) ? $attributes['swiperMargin'] : '30';
$swiperNav = isset($attributes['swiperNav']) ? (bool) $attributes['swiperNav'] : true;
$swiperDots = isset($attributes['swiperDots']) ? (bool) $attributes['swiperDots'] : true;
$swiperItemsXl = isset($attributes['swiperItemsXl']) ? $attributes['swiperItemsXl'] : '3';
$swiperItemsMd = isset($attributes['swiperItemsMd']) ? $attributes['swiperItemsMd'] : '2';
$swiperItemsXs = isset($attributes['swiperItemsXs']) ? $attributes['swiperItemsXs'] : '1';
$swiperItems = isset($attributes['swiperItems']) ? $attributes['swiperItems'] : '3';
$swiperItemsSm = isset($attributes['swiperItemsSm']) ? $attributes['swiperItemsSm'] : '';
$swiperItemsLg = isset($attributes['swiperItemsLg']) ? $attributes['swiperItemsLg'] : '';
$swiperItemsXxl = isset($attributes['swiperItemsXxl']) ? $attributes['swiperItemsXxl'] : '';
$swiperEffect = isset($attributes['swiperEffect']) ? $attributes['swiperEffect'] : 'slide';
$swiperSpeed = isset($attributes['swiperSpeed']) ? (int) $attributes['swiperSpeed'] : 500;
$swiperLoop = isset($attributes['swiperLoop']) ? (bool) $attributes['swiperLoop'] : false;
$swiperAutoplay = isset($attributes['swiperAutoplay']) ? (bool) $attributes['swiperAutoplay'] : false;
$swiperAutoplayTime = isset($attributes['swiperAutoplayTime']) ? (int) $attributes['swiperAutoplayTime'] : 5000;
$swiperContainerType = isset($attributes['swiperContainerType']) ? $attributes['swiperContainerType'] : '';
$swiperNavStyle = isset($attributes['swiperNavStyle']) ? $attributes['swiperNavStyle'] : 'nav-dark';
$swiperNavPosition = isset($attributes['swiperNavPosition']) ? $attributes['swiperNavPosition'] : '';
$swiperDotsStyle = isset($attributes['swiperDotsStyle']) ? $attributes['swiperDotsStyle'] : 'dots-over';
$swiperClass = isset($attributes['swiperClass']) ? $attributes['swiperClass'] : '';
$swiperId = isset($attributes['swiperId']) ? $attributes['swiperId'] : '';
$swiperData = isset($attributes['swiperData']) ? $attributes['swiperData'] : '';

// Build container classes
$containerClasses = ['swiper-container', 'mb-10'];
if ($swiperContainerType) {
	$containerClasses[] = $swiperContainerType;
}
if ($swiperNavStyle) {
	$containerClasses[] = $swiperNavStyle;
}
if ($swiperNavPosition) {
	$containerClasses[] = $swiperNavPosition;
}
if ($swiperDotsStyle) {
	$containerClasses[] = $swiperDotsStyle;
}
if ($swiperClass) {
	$containerClasses[] = $swiperClass;
}

// Build data attributes
$dataAttrs = [];
$dataAttrs['data-margin'] = esc_attr($swiperMargin);
$dataAttrs['data-nav'] = $swiperNav ? 'true' : 'false';
$dataAttrs['data-dots'] = $swiperDots ? 'true' : 'false';
$dataAttrs['data-items-xl'] = esc_attr($swiperItemsXl);
$dataAttrs['data-items-md'] = esc_attr($swiperItemsMd);
$dataAttrs['data-items-xs'] = esc_attr($swiperItemsXs);
$dataAttrs['data-items'] = esc_attr($swiperItems);
if ($swiperItemsSm) {
	$dataAttrs['data-items-sm'] = esc_attr($swiperItemsSm);
}
if ($swiperItemsLg) {
	$dataAttrs['data-items-lg'] = esc_attr($swiperItemsLg);
}
if ($swiperItemsXxl) {
	$dataAttrs['data-items-xxl'] = esc_attr($swiperItemsXxl);
}
if ($swiperEffect) {
	$dataAttrs['data-effect'] = esc_attr($swiperEffect);
}
$dataAttrs['data-speed'] = esc_attr($swiperSpeed);
$dataAttrs['data-loop'] = $swiperLoop ? 'true' : 'false';
$dataAttrs['data-autoplay'] = $swiperAutoplay ? 'true' : 'false';
if ($swiperAutoplay) {
	$dataAttrs['data-autoplaytime'] = esc_attr($swiperAutoplayTime);
}

// Build wrapper attributes
$wrapperAttrs = 'class="' . esc_attr(implode(' ', $containerClasses)) . '"';
if ($swiperId) {
	$wrapperAttrs .= ' id="' . esc_attr($swiperId) . '"';
}
if ($swiperData) {
	$wrapperAttrs .= ' data-codeweber="' . esc_attr($swiperData) . '"';
}
foreach ($dataAttrs as $key => $value) {
	$wrapperAttrs .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
}
?>

<div <?php echo $wrapperAttrs; ?>>
	<div class="swiper">
		<div class="swiper-wrapper">
			<?php
			// Render inner blocks and wrap each in swiper-slide
			if (!empty($block->parsed_block['innerBlocks'])) {
				foreach ($block->parsed_block['innerBlocks'] as $innerBlock) {
					echo '<div class="swiper-slide">';
					echo render_block($innerBlock);
					echo '</div>';
				}
			} elseif (!empty($content)) {
				// Fallback: if innerBlocks not available, try to parse content
				// This handles cases where content is saved but innerBlocks structure is missing
				$parsed_blocks = parse_blocks($content);
				foreach ($parsed_blocks as $parsed_block) {
					if (!empty($parsed_block['blockName'])) {
						echo '<div class="swiper-slide">';
						echo render_block($parsed_block);
						echo '</div>';
					}
				}
			}
			?>
		</div>
	</div>
</div>
