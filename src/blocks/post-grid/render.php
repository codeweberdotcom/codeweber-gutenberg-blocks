<?php
/**
 * Post Grid - Server-side render
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

$display_mode = isset($attributes['displayMode']) ? $attributes['displayMode'] : 'grid';
$post_type = isset($attributes['postType']) ? $attributes['postType'] : 'post';
$posts_per_page = isset($attributes['postsPerPage']) ? (int) $attributes['postsPerPage'] : 6;
$order_by = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date';
$order = isset($attributes['order']) ? $attributes['order'] : 'desc';
$image_size = isset($attributes['imageSize']) ? $attributes['imageSize'] : 'full';
$grid_type = isset($attributes['gridType']) ? $attributes['gridType'] : 'classic';
$border_radius = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 'rounded';
$enable_lightbox = isset($attributes['enableLightbox']) ? $attributes['enableLightbox'] : true;
$lightbox_gallery = isset($attributes['lightboxGallery']) ? $attributes['lightboxGallery'] : 'gallery-1';
$block_class = isset($attributes['blockClass']) ? $attributes['blockClass'] : '';
$block_id = isset($attributes['blockId']) ? $attributes['blockId'] : '';
$block_data = isset($attributes['blockData']) ? $attributes['blockData'] : '';
$template = isset($attributes['template']) ? $attributes['template'] : 'default';

// Генерируем уникальный ID для блока, если он не задан (необходимо для Load More)
if (empty($block_id)) {
	// Используем стабильный хеш от ключевых атрибутов блока для генерации уникального ID
	// Исключаем blockId, blockClass, blockData из хеша для стабильности
	$key_attributes = [
		'postType' => $post_type,
		'postsPerPage' => $posts_per_page,
		'orderBy' => $order_by,
		'order' => $order,
		'imageSize' => $image_size,
		'gridType' => $grid_type,
		'template' => $template,
	];
	$block_id = 'cwgb-post-grid-' . substr(md5(json_encode($key_attributes) . get_the_ID()), 0, 8);
}

// Hover effects
$simple_effect = isset($attributes['simpleEffect']) ? $attributes['simpleEffect'] : 'none';
$effect_type = isset($attributes['effectType']) ? $attributes['effectType'] : 'none';
$tooltip_style = isset($attributes['tooltipStyle']) ? $attributes['tooltipStyle'] : 'itooltip-dark';
$overlay_style = isset($attributes['overlayStyle']) ? $attributes['overlayStyle'] : 'overlay-1';
$overlay_gradient = isset($attributes['overlayGradient']) ? $attributes['overlayGradient'] : 'gradient-1';
$overlay_color = isset($attributes['overlayColor']) ? $attributes['overlayColor'] : false;
$cursor_style = isset($attributes['cursorStyle']) ? $attributes['cursorStyle'] : 'cursor-dark';

// Load More
$load_more_enable = isset($attributes['loadMoreEnable']) ? $attributes['loadMoreEnable'] : false;
$load_more_initial_count = isset($attributes['loadMoreInitialCount']) ? (int) $attributes['loadMoreInitialCount'] : 6;
$load_more_load_more_count = isset($attributes['loadMoreLoadMoreCount']) ? (int) $attributes['loadMoreLoadMoreCount'] : 6;
$load_more_text = isset($attributes['loadMoreText']) ? $attributes['loadMoreText'] : 'Показать еще';

// Helper function to get container classes
if (!function_exists('get_post_grid_container_classes')) {
	function get_post_grid_container_classes($attributes, $grid_type) {
		$gridGapX = $attributes['gridGapX'] ?? '';
		$gridGapY = $attributes['gridGapY'] ?? '';
		$gridGapType = $attributes['gridGapType'] ?? 'general';
		
		$classes = ['row'];
		
		// Gap classes
		$gap_classes = [];
		if ($gridGapType === 'general' || $gridGapType === 'x' || $gridGapType === 'y') {
			$gap = $attributes['gridGap'] ?? '';
			if ($gap) $gap_classes[] = "g-{$gap}";
			$gapMd = $attributes['gridGapMd'] ?? '';
			if ($gapMd) $gap_classes[] = "g-md-{$gapMd}";
		}
		if ($gridGapType === 'x' || $gridGapType === 'general') {
			$gapX = $attributes['gridGapX'] ?? '';
			if ($gapX) $gap_classes[] = "gx-{$gapX}";
			$gapXMd = $attributes['gridGapXMd'] ?? '';
			if ($gapXMd) $gap_classes[] = "gx-md-{$gapXMd}";
		}
		if ($gridGapType === 'y' || $gridGapType === 'general') {
			$gapY = $attributes['gridGapY'] ?? '';
			if ($gapY) $gap_classes[] = "gy-{$gapY}";
			$gapYMd = $attributes['gridGapYMd'] ?? '';
			if ($gapYMd) $gap_classes[] = "gy-md-{$gapYMd}";
		}
		
		// Fallback to old attributes
		if (empty($gap_classes) && ($gridGapX || $gridGapY)) {
			if ($gridGapY) $gap_classes[] = "gy-{$gridGapY}";
			if ($gridGapX) $gap_classes[] = "gx-{$gridGapX}";
		}
		
		$classes = array_merge($classes, $gap_classes);
		
		// Row-cols classes for columns-grid
		if ($grid_type === 'columns-grid') {
			$rowCols = $attributes['gridRowCols'] ?? '';
			if ($rowCols) $classes[] = "row-cols-{$rowCols}";
			$rowColsMd = $attributes['gridRowColsMd'] ?? '';
			if ($rowColsMd) $classes[] = "row-cols-md-{$rowColsMd}";
		}
		
		return implode(' ', array_filter($classes));
	}
}

// Helper function to get col classes
if (!function_exists('get_post_grid_col_classes')) {
	function get_post_grid_col_classes($attributes, $grid_type) {
		if ($grid_type !== 'classic') {
			return '';
		}
		
		$classes = [];
		$colsDefault = $attributes['gridColumns'] ?? '';
		$colsMd = $attributes['gridColumnsMd'] ?? '';
		
		if ($colsDefault) $classes[] = "col-{$colsDefault}";
		if ($colsMd) $classes[] = "col-md-{$colsMd}";
		
		return implode(' ', $classes);
	}
}

$grid_classes = get_post_grid_container_classes($attributes, $grid_type);
$col_classes = get_post_grid_col_classes($attributes, $grid_type);

	// Query posts
	$args = array(
		'post_type' => $post_type,
		'posts_per_page' => $posts_per_page,
		'post_status' => 'publish',
		'orderby' => $order_by,
		'order' => $order,
	);

$query = new WP_Query($args);

// Block wrapper attributes
// Базовые классы и атрибуты для внешнего контейнера
$wrapper_classes = 'cwgb-post-grid-block';
$wrapper_data_attrs = [
	'data-block-id' => $block_id,
	'data-block-type' => 'post-grid',
	'data-block-attributes' => esc_attr(json_encode($attributes)),
	'data-post-id' => get_the_ID(),
];

// Добавляем Load More классы и атрибуты ТОЛЬКО для grid режима и когда Load More включен
// В режиме swiper эти атрибуты НИКОГДА не добавляются
// Явная проверка: только grid режим И только когда Load More включен
if ($display_mode !== 'swiper' && $display_mode === 'grid' && $load_more_enable === true) {
	$wrapper_classes .= ' cwgb-load-more-container';
	$wrapper_data_attrs['data-current-offset'] = $load_more_initial_count;
	$wrapper_data_attrs['data-load-count'] = $load_more_load_more_count;
}
// В режиме swiper или когда Load More отключен - эти атрибуты НЕ добавляются

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => trim($wrapper_classes),
] + $wrapper_data_attrs);

// Подготовка атрибутов для применения к swiper-container (в режиме slider) или row (в режиме grid)
$settings_attrs = [];
if ($block_id) {
	$settings_attrs['id'] = esc_attr($block_id);
}
if ($block_class) {
	$settings_attrs['class'] = esc_attr($block_class);
}
if ($block_data) {
	$settings_attrs['data-block-data'] = esc_attr($block_data);
}

// Determine which posts to show initially
$posts_to_show = $load_more_enable 
	? array_slice($query->posts, 0, $load_more_initial_count)
	: $query->posts;

$has_more = $load_more_enable && count($query->posts) > $load_more_initial_count;

// Helper function to get image URL
if (!function_exists('get_post_image_url')) {
	function get_post_image_url($post, $image_size = 'full') {
		$thumbnail_id = get_post_thumbnail_id($post->ID);
		if (!$thumbnail_id) {
			return '';
		}
		
		$image = wp_get_attachment_image_src($thumbnail_id, $image_size);
		return $image ? $image[0] : '';
	}
}

// Helper function to get hover classes
if (!function_exists('get_post_hover_classes')) {
	function get_post_hover_classes($attributes) {
	$classes = [];
	
	$simple_effect = $attributes['simpleEffect'] ?? 'none';
	$effect_type = $attributes['effectType'] ?? 'none';
	$tooltip_style = $attributes['tooltipStyle'] ?? 'itooltip-dark';
	$overlay_style = $attributes['overlayStyle'] ?? 'overlay-1';
	$overlay_gradient = $attributes['overlayGradient'] ?? 'gradient-1';
	$overlay_color = $attributes['overlayColor'] ?? false;
	$cursor_style = $attributes['cursorStyle'] ?? 'cursor-dark';
	
	if ($simple_effect !== 'none') {
		$classes[] = $simple_effect;
	}
	
	if ($effect_type === 'overlay') {
		$classes[] = 'overlay';
		if ($overlay_style) {
			$classes[] = $overlay_style;
		}
		if ($overlay_gradient) {
			$classes[] = $overlay_gradient;
		}
		if ($overlay_color) {
			$classes[] = 'overlay-color';
		}
	} elseif ($effect_type === 'tooltip') {
		$classes[] = 'itooltip';
		if ($tooltip_style) {
			$classes[] = $tooltip_style;
		}
	} elseif ($effect_type === 'cursor') {
		if ($cursor_style) {
			$classes[] = $cursor_style;
		}
	}
	
		return implode(' ', $classes);
	}
}

// Helper function to get Swiper container classes
if (!function_exists('get_swiper_container_classes')) {
	function get_swiper_container_classes($attributes) {
		$classes = ['swiper-container'];
		
		// Add swiper-auto class for continuous scrolling when itemsAuto is enabled
		$items_auto = isset($attributes['swiperItemsAuto']) ? $attributes['swiperItemsAuto'] : false;
		if ($items_auto) {
			$classes[] = 'swiper-auto';
		}
		
		$container_type = $attributes['swiperContainerType'] ?? '';
		$nav_style = $attributes['swiperNavStyle'] ?? '';
		$nav_position = $attributes['swiperNavPosition'] ?? '';
		$dots_style = $attributes['swiperDotsStyle'] ?? '';
		
		if ($container_type) {
			$classes[] = $container_type;
		}
		if ($nav_style) {
			$classes[] = $nav_style;
		}
		if ($nav_position) {
			$positions = explode(' ', $nav_position);
			$classes = array_merge($classes, $positions);
		}
		if ($dots_style) {
			$classes[] = $dots_style;
		}
		
		return implode(' ', $classes);
	}
}

// Helper function to get Swiper data attributes
if (!function_exists('get_swiper_data_attributes')) {
	function get_swiper_data_attributes($attributes) {
		$attrs = [];
		
		$effect = $attributes['swiperEffect'] ?? 'slide';
		$speed = isset($attributes['swiperSpeed']) ? (int) $attributes['swiperSpeed'] : 500;
		$items = $attributes['swiperItems'] ?? '3';
		$items_xs = $attributes['swiperItemsXs'] ?? '1';
		$items_sm = $attributes['swiperItemsSm'] ?? '';
		$items_md = $attributes['swiperItemsMd'] ?? '2';
		$items_lg = $attributes['swiperItemsLg'] ?? '';
		$items_xl = $attributes['swiperItemsXl'] ?? '3';
		$items_xxl = $attributes['swiperItemsXxl'] ?? '';
		$items_auto = isset($attributes['swiperItemsAuto']) ? $attributes['swiperItemsAuto'] : false;
		$margin = isset($attributes['swiperMargin']) ? (int) $attributes['swiperMargin'] : 30;
		$loop = isset($attributes['swiperLoop']) ? $attributes['swiperLoop'] : false;
		$centered = isset($attributes['swiperCentered']) ? $attributes['swiperCentered'] : false;
		$auto_height = isset($attributes['swiperAutoHeight']) ? $attributes['swiperAutoHeight'] : false;
		$watch_overflow = isset($attributes['swiperWatchOverflow']) ? $attributes['swiperWatchOverflow'] : false;
		$update_resize = isset($attributes['swiperUpdateResize']) ? $attributes['swiperUpdateResize'] : true;
		$drag = isset($attributes['swiperDrag']) ? $attributes['swiperDrag'] : true;
		$reverse = isset($attributes['swiperReverse']) ? $attributes['swiperReverse'] : false;
		$autoplay = isset($attributes['swiperAutoplay']) ? $attributes['swiperAutoplay'] : false;
		$autoplay_time = isset($attributes['swiperAutoplayTime']) ? (int) $attributes['swiperAutoplayTime'] : 5000;
		$nav = isset($attributes['swiperNav']) ? $attributes['swiperNav'] : true;
		$dots = isset($attributes['swiperDots']) ? $attributes['swiperDots'] : true;
		
		if ($effect) {
			$attrs['data-effect'] = $effect;
		}
		$attrs['data-speed'] = (string) $speed;
		
		$attrs['data-items-auto'] = $items_auto ? 'true' : 'false';
		if (!$items_auto) {
			if ($items) $attrs['data-items'] = $items;
			if ($items_xs) $attrs['data-items-xs'] = $items_xs;
			if ($items_sm) $attrs['data-items-sm'] = $items_sm;
			if ($items_md) $attrs['data-items-md'] = $items_md;
			if ($items_lg) $attrs['data-items-lg'] = $items_lg;
			if ($items_xl) $attrs['data-items-xl'] = $items_xl;
			if ($items_xxl) $attrs['data-items-xxl'] = $items_xxl;
		}
		
		$attrs['data-margin'] = (string) $margin;
		$attrs['data-loop'] = $loop ? 'true' : 'false';
		$attrs['data-centered'] = $centered ? 'true' : 'false';
		$attrs['data-autoheight'] = $auto_height ? 'true' : 'false';
		$attrs['data-watchoverflow'] = $watch_overflow ? 'true' : 'false';
		$attrs['data-resizeupdate'] = $update_resize ? 'true' : 'false';
		$attrs['data-drag'] = $drag ? 'true' : 'false';
		$attrs['data-reverse'] = $reverse ? 'true' : 'false';
		$attrs['data-autoplay'] = $autoplay ? 'true' : 'false';
		if ($autoplay) {
			$attrs['data-autoplaytime'] = (string) $autoplay_time;
		}
		$attrs['data-nav'] = $nav ? 'true' : 'false';
		$attrs['data-dots'] = $dots ? 'true' : 'false';
		
		return $attrs;
	}
}

// Helper function to render post item based on template
if (!function_exists('render_post_grid_item')) {
	function render_post_grid_item($post, $attributes, $image_url, $image_size, $grid_type, $col_classes, $is_swiper = false) {
		$template = isset($attributes['template']) ? $attributes['template'] : 'default';
		
		// Загружаем новую систему шаблонов из темы, если доступна
		$post_card_templates_path = get_template_directory() . '/functions/post-card-templates.php';
		if (file_exists($post_card_templates_path) && !function_exists('cw_render_post_card')) {
			require_once $post_card_templates_path;
		}
		
		// Используем новую систему шаблонов из темы, если доступна
		if (function_exists('cw_render_post_card')) {
			// Настройки отображения
			$display_settings = [
				'show_title' => true,
				'show_date' => true,
				'show_category' => true,
				'show_comments' => true,
				'title_length' => 56,
				'excerpt_length' => 0,
				'title_tag' => 'h2',
				'title_class' => '',
			];
			
			// Для card-content и slider включаем excerpt
			if ($template === 'card-content' || $template === 'slider') {
				$display_settings['excerpt_length'] = 20;
			}
			// Для overlay-5 используем больше слов для обрезки до 116 символов
			if ($template === 'overlay-5') {
				$display_settings['excerpt_length'] = 40;
			}
			
			// Настройки шаблона
			$hover_classes = 'overlay overlay-1';
			// Для overlay-5 используем overlay-5
			if ($template === 'overlay-5') {
				$hover_classes = 'overlay overlay-5';
			}
			// Добавляем hover-scale для соответствующих шаблонов
			if ($template === 'slider' || $template === 'card-content') {
				$hover_classes .= ' hover-scale';
			}
			
			$template_args = [
				'image_size' => $image_size,
				'hover_classes' => $hover_classes,
				'border_radius' => isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 'rounded',
				'show_figcaption' => true,
				'enable_hover_scale' => ($template === 'default' && isset($attributes['enableHoverScale']) && $attributes['enableHoverScale']) ? true : false,
				'enable_lift' => ($template === 'default-clickable') ? true : false,
			];
			
			$html = cw_render_post_card($post, $template, $display_settings, $template_args);
			
			// Добавляем обертку с col-классами только если не swiper режим
			if (!$is_swiper && !empty($col_classes) && $grid_type === 'classic') {
				$html = '<div class="' . esc_attr($col_classes) . '">' . $html . '</div>';
			}
			
			return $html;
		}
		
		// Fallback на старую систему, если новая недоступна
		$post_link = get_permalink($post->ID);
		$post_title = get_the_title($post->ID);
		$post_excerpt = get_the_excerpt($post->ID);
		$post_date = get_the_date('d M Y', $post->ID);
		$post_categories = get_the_category($post->ID);
		$post_comments_count = get_comments_number($post->ID);
		
		$hover_classes = get_post_hover_classes($attributes);
		$border_radius = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 'rounded';
		$effect_type = isset($attributes['effectType']) ? $attributes['effectType'] : 'none';
		$overlay_style = isset($attributes['overlayStyle']) ? $attributes['overlayStyle'] : 'overlay-1';
		
		// Ограничиваем заголовок до 56 символов
		$title_limited = $post_title ? strip_tags($post_title) : '';
		$title_limited = str_replace('&nbsp;', ' ', $title_limited);
		$title_limited = trim($title_limited);
		if (mb_strlen($title_limited) > 56) {
			$title_limited = mb_substr($title_limited, 0, 56) . '...';
		}
		
		// Ограничиваем описание до 50 символов
		$excerpt_limited = $post_excerpt ? strip_tags($post_excerpt) : '';
		$excerpt_limited = str_replace('&nbsp;', ' ', $excerpt_limited);
		$excerpt_limited = trim($excerpt_limited);
		if (mb_strlen($excerpt_limited) > 50) {
			$excerpt_limited = mb_substr($excerpt_limited, 0, 50) . '...';
		}
		
		$html = '';
		
		if ($template === 'card') {
			// Card template
			$col_wrapper = (!$is_swiper && $grid_type === 'classic' && !empty($col_classes)) ? '<div class="' . esc_attr($col_classes) . '">' : '';
			$html .= $col_wrapper;
			$html .= '<article>';
			$html .= '<div class="card shadow-lg">';
			
			// Figure with overlay
			$figure_classes = trim($hover_classes . ' ' . $border_radius);
			$figure_classes .= ' card-img-top';
			$html .= '<figure class="' . esc_attr($figure_classes) . '">';
			$html .= '<a href="' . esc_url($post_link) . '">';
			$html .= '<img src="' . esc_url($image_url) . '" alt="' . esc_attr($post_title) . '" />';
			$html .= '</a>';
			
			// Figcaption for overlay
			if ($effect_type === 'overlay') {
				if ($overlay_style === 'overlay-1' || $overlay_style === 'overlay-4') {
					$html .= '<figcaption><h5 class="from-top mb-0">Read More</h5></figcaption>';
				}
			}
			
			$html .= '</figure>';
			
			// Card body
			$html .= '<div class="card-body p-6">';
			$html .= '<div class="post-header">';
			
			// Category
			if (!empty($post_categories)) {
				$html .= '<div class="post-category">';
				$html .= '<a href="' . esc_url(get_category_link($post_categories[0]->term_id)) . '" class="hover" rel="category">';
				$html .= esc_html($post_categories[0]->name);
				$html .= '</a>';
				$html .= '</div>';
			}
			
			// Title
			$html .= '<h2 class="post-title h3 mt-1 mb-3">';
			$html .= '<a class="link-dark" href="' . esc_url($post_link) . '">';
			$html .= esc_html($title_limited);
			$html .= '</a>';
			$html .= '</h2>';
			$html .= '</div>';
			
			// Post footer
			$html .= '<div class="post-footer">';
			$html .= '<ul class="post-meta d-flex mb-0">';
			$html .= '<li class="post-date"><i class="uil uil-calendar-alt"></i><span>' . esc_html($post_date) . '</span></li>';
			$html .= '<li class="post-comments"><a href="' . esc_url($post_link . '#comments') . '"><i class="uil uil-comment"></i>' . esc_html($post_comments_count) . '</a></li>';
			$html .= '</ul>';
			$html .= '</div>';
			$html .= '</div>'; // card-body
			$html .= '</div>'; // card
			$html .= '</article>';
			if ($col_wrapper) {
				$html .= '</div>'; // col wrapper
			}
		} else {
			// Default template
			$col_wrapper = (!$is_swiper && $grid_type === 'classic' && !empty($col_classes)) ? '<div class="' . esc_attr($col_classes) . '">' : '';
			$html .= $col_wrapper;
			$html .= '<article>';
			
			// Figure with overlay
			$figure_classes = trim($hover_classes . ' ' . $border_radius);
			if ($effect_type === 'overlay') {
				$figure_classes .= ' hover-scale';
			}
			$html .= '<figure class="' . esc_attr($figure_classes) . ' mb-5">';
			$html .= '<a href="' . esc_url($post_link) . '">';
			$html .= '<img src="' . esc_url($image_url) . '" alt="' . esc_attr($post_title) . '" />';
			$html .= '</a>';
			
			// Figcaption for overlay
			if ($effect_type === 'overlay') {
				if ($overlay_style === 'overlay-1' || $overlay_style === 'overlay-4') {
					$html .= '<figcaption><h5 class="from-top mb-0">Read More</h5></figcaption>';
				}
			}
			
			$html .= '</figure>';
			
			// Post header
			$html .= '<div class="post-header">';
			
			// Category
			if (!empty($post_categories)) {
				$html .= '<div class="post-category text-line">';
				$html .= '<a href="' . esc_url(get_category_link($post_categories[0]->term_id)) . '" class="hover" rel="category">';
				$html .= esc_html($post_categories[0]->name);
				$html .= '</a>';
				$html .= '</div>';
			}
			
			// Title
			$html .= '<h2 class="post-title h3 mt-1 mb-3">';
			$html .= '<a class="link-dark" href="' . esc_url($post_link) . '">';
			$html .= esc_html($title_limited);
			$html .= '</a>';
			$html .= '</h2>';
			$html .= '</div>';
			
			// Post footer
			$html .= '<div class="post-footer">';
			$html .= '<ul class="post-meta">';
			$html .= '<li class="post-date"><i class="uil uil-calendar-alt"></i><span>' . esc_html($post_date) . '</span></li>';
			$html .= '<li class="post-comments"><a href="' . esc_url($post_link . '#comments') . '"><i class="uil uil-comment"></i>' . esc_html($post_comments_count) . '</a></li>';
			$html .= '</ul>';
			$html .= '</div>';
			$html .= '</article>';
			if ($col_wrapper) {
				$html .= '</div>'; // col wrapper
			}
		}
		
		return $html;
	}
}

?>

<div <?php echo $wrapper_attributes; ?>>
	<?php if ($query->have_posts()) : ?>
		<?php if ($display_mode === 'swiper') : ?>
			<?php
			// Swiper mode
			$swiper_container_classes = get_swiper_container_classes($attributes);
			$swiper_data_attrs = get_swiper_data_attributes($attributes);
			
			// Добавляем настройки из таба "Настройки" к swiper-container
			if (!empty($settings_attrs['class'])) {
				$swiper_container_classes .= ' ' . $settings_attrs['class'];
			}
			
			$swiper_data_attrs_str = '';
			foreach ($swiper_data_attrs as $key => $value) {
				$swiper_data_attrs_str .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
			}
			
			// Добавляем id и data-атрибуты из настроек
			$swiper_settings_str = '';
			if (!empty($settings_attrs['id'])) {
				$swiper_settings_str .= ' id="' . $settings_attrs['id'] . '"';
			}
			if (!empty($settings_attrs['data-block-data'])) {
				$swiper_settings_str .= ' data-block-data="' . $settings_attrs['data-block-data'] . '"';
			}
			?>
			<?php
			// Add ticker class to wrapper for continuous scrolling when itemsAuto is enabled
			$items_auto = isset($attributes['swiperItemsAuto']) ? $attributes['swiperItemsAuto'] : false;
			$wrapper_classes = $items_auto ? 'swiper-wrapper ticker' : 'swiper-wrapper';
			?>
			<div class="<?php echo esc_attr(trim($swiper_container_classes)); ?>"<?php echo $swiper_data_attrs_str . $swiper_settings_str; ?>>
				<div class="swiper">
					<div class="<?php echo esc_attr($wrapper_classes); ?>">
						<?php foreach ($posts_to_show as $post) : setup_postdata($post); ?>
							<?php
							$image_url = get_post_image_url($post, $image_size);
							if (!$image_url) continue;
							?>
							<div class="swiper-slide">
								<?php 
								// В режиме swiper передаем флаг is_swiper=true, чтобы не добавлялась обертка с col_classes
								echo render_post_grid_item($post, $attributes, $image_url, $image_size, $grid_type, '', true);
								?>
							</div>
						<?php endforeach; wp_reset_postdata(); ?>
					</div>
				</div>
			</div>
		<?php else : ?>
			<?php // Grid mode ?>
			<?php
			// Добавляем настройки из таба "Настройки" к элементу row
			$row_classes = 'cwgb-load-more-items ' . $grid_classes;
			if (!empty($settings_attrs['class'])) {
				$row_classes .= ' ' . $settings_attrs['class'];
			}
			
			$row_attrs_str = '';
			if (!empty($settings_attrs['id'])) {
				$row_attrs_str .= ' id="' . $settings_attrs['id'] . '"';
			}
			if (!empty($settings_attrs['data-block-data'])) {
				$row_attrs_str .= ' data-block-data="' . $settings_attrs['data-block-data'] . '"';
			}
			?>
			<div class="<?php echo esc_attr(trim($row_classes)); ?>"<?php echo $row_attrs_str; ?>>
				<?php foreach ($posts_to_show as $post) : setup_postdata($post); ?>
					<?php
					$image_url = get_post_image_url($post, $image_size);
					if (!$image_url) continue;
					
					echo render_post_grid_item($post, $attributes, $image_url, $image_size, $grid_type, $col_classes);
					?>
				<?php endforeach; wp_reset_postdata(); ?>
			</div>
			
			<?php if ($load_more_enable && $has_more) : ?>
				<div style="text-align: center; margin-top: 20px;">
					<button class="btn btn-primary cwgb-load-more-btn" type="button">
						<?php echo esc_html($load_more_text); ?>
					</button>
				</div>
			<?php endif; ?>
		<?php endif; ?>
	<?php else : ?>
		<p><?php esc_html_e('No posts found.', 'codeweber-gutenberg-blocks'); ?></p>
	<?php endif; ?>
</div>

