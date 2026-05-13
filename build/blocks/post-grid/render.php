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

// Убеждаемся, что текстовый домен загружен для переводов
$plugin_file = dirname(dirname(dirname(dirname(__FILE__)))) . '/plugin.php';
if (file_exists($plugin_file)) {
	$plugin_dir = plugin_dir_path($plugin_file);
	$plugin_basename = basename($plugin_dir);
	// Загружаем переводы принудительно
	load_plugin_textdomain('codeweber-gutenberg-blocks', false, $plugin_basename . '/languages/');
}

$display_mode = isset($attributes['displayMode']) ? $attributes['displayMode'] : 'grid';
$post_type = isset($attributes['postType']) ? $attributes['postType'] : 'post';
$posts_per_page = isset($attributes['postsPerPage']) ? (int) $attributes['postsPerPage'] : 6;
$order_by = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date';
$order = isset($attributes['order']) ? $attributes['order'] : 'desc';
$image_size = isset($attributes['imageSize']) ? $attributes['imageSize'] : 'full';
$grid_type = isset($attributes['gridType']) ? $attributes['gridType'] : 'classic';
$border_radius = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 'rounded';
$block_class = isset($attributes['blockClass']) ? $attributes['blockClass'] : '';
$block_id = isset($attributes['blockId']) ? $attributes['blockId'] : '';
$block_data = isset($attributes['blockData']) ? $attributes['blockData'] : '';
$template = isset($attributes['template']) ? $attributes['template'] : 'default';
$selected_taxonomies = isset($attributes['selectedTaxonomies']) ? $attributes['selectedTaxonomies'] : [];
$source_type = isset($attributes['sourceType']) ? $attributes['sourceType'] : 'post';

// Title tag and classes from block (with allowed values)
// display-* передаём в шаблон как title-size-класс (см. compose_title_class), а тегом ставим h2.
$allowed_title_tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span'];
$title_tag_raw = isset($attributes['titleTag']) ? $attributes['titleTag'] : 'h3';
if (strpos($title_tag_raw, 'display-') === 0) {
	$title_tag = 'h2';
} else {
	$title_tag = in_array($title_tag_raw, $allowed_title_tags, true) ? $title_tag_raw : 'h3';
}

// Собрать итоговый title_class: size + weight + transform + color + custom.
// Возвращает пустую строку если ничего не задано — шаблон использует свой дефолт.
if (!function_exists('cwgb_post_grid_compose_title_class')) {
	function cwgb_post_grid_compose_title_class($attributes) {
		$parts = [];

		$tag = isset($attributes['titleTag']) ? $attributes['titleTag'] : '';
		if ($tag && strpos($tag, 'display-') === 0) {
			$parts[] = $tag;
		}

		foreach (['titleSize', 'titleWeight', 'titleTransform'] as $key) {
			if (!empty($attributes[$key])) {
				$parts[] = $attributes[$key];
			}
		}

		$color = isset($attributes['titleColor']) ? $attributes['titleColor'] : '';
		$color_type = isset($attributes['titleColorType']) ? $attributes['titleColorType'] : 'solid';
		if ($color) {
			if ($color_type === 'soft') {
				$parts[] = 'text-soft-' . $color;
			} elseif ($color_type === 'pale') {
				$parts[] = 'text-pale-' . $color;
			} else {
				$parts[] = 'text-' . $color;
			}
			// Маркер — чтобы CSS пробросил цвет через наследование на вложенный <a class="link-dark">.
			$parts[] = 'cwgb-title-color';
		}

		if (!empty($attributes['titleClass'])) {
			$parts[] = $attributes['titleClass'];
		}

		return trim(implode(' ', array_filter($parts)));
	}
}

$title_class = sanitize_text_field(cwgb_post_grid_compose_title_class($attributes));

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

// Projects-only: preview image by image_tag (из галереи проекта).
$projects_filter_image_tag = 0;
if ($post_type === 'projects' && !empty($attributes['filterByImageTag'])) {
	$projects_filter_image_tag = isset($attributes['filterImageTagId']) ? (int) $attributes['filterImageTagId'] : 0;
}

// Filter bar — читается в общем разделе чтобы можно было найти активный term из GET-параметра при переходе.
$enable_filter = !empty($attributes['enableFilter']);
$filter_taxonomy = isset($attributes['filterTaxonomy']) ? sanitize_key($attributes['filterTaxonomy']) : '';
$filter_style = isset($attributes['filterStyle']) ? $attributes['filterStyle'] : 'default';
$filter_active_color = isset($attributes['filterActiveColor']) ? sanitize_key($attributes['filterActiveColor']) : '';
$filter_active_color_type = isset($attributes['filterActiveColorType']) ? $attributes['filterActiveColorType'] : 'solid';
$filter_all_label = isset($attributes['filterAllLabel']) && $attributes['filterAllLabel'] !== ''
	? $attributes['filterAllLabel']
	: __('All', 'codeweber-gutenberg-blocks');
$filter_terms = [];
$filter_active_term = isset($_GET['cwgb_filter']) ? (int) $_GET['cwgb_filter'] : 0;
if ($enable_filter && $filter_taxonomy && taxonomy_exists($filter_taxonomy)) {
	$filter_terms = get_terms([
		'taxonomy' => $filter_taxonomy,
		'hide_empty' => true,
	]);
	if (is_wp_error($filter_terms)) {
		$filter_terms = [];
	}
}

// Helper: классы для одного элемента фильтр-бара в зависимости от стиля.
// Возвращает ['base' => [базовые классы], 'active' => [классы активного состояния]].
if (!function_exists('cwgb_post_grid_filter_item_classes')) {
	function cwgb_post_grid_filter_item_classes($style, $color, $color_type) {
		$base = [];
		$active = ['active'];

		// Префикс цветовой модификатор (btn-primary / text-primary / bg-primary).
		$color_mod = '';
		if ($color) {
			$prefix_map = [
				'default' => 'text',
				'btn-xs'  => 'btn',
				'btn-sm'  => 'btn',
				'badge'   => 'bg',
			];
			$prefix = isset($prefix_map[$style]) ? $prefix_map[$style] : 'text';
			if ($color_type === 'soft') {
				$color_mod = $prefix . '-soft-' . $color;
			} elseif ($color_type === 'pale') {
				$color_mod = $prefix . '-pale-' . $color;
			} else {
				$color_mod = $prefix . '-' . $color;
			}
		}

		switch ($style) {
			case 'btn-xs':
				$base = ['btn', 'btn-xs'];
				$active[] = $color_mod ?: 'btn-primary';
				break;
			case 'btn-sm':
				$base = ['btn', 'btn-sm'];
				$active[] = $color_mod ?: 'btn-primary';
				break;
			case 'badge':
				$base = ['badge', 'rounded-pill'];
				$active[] = $color_mod ?: 'bg-primary';
				$active[] = 'text-white';
				break;
			case 'default':
			default:
				// filter-item добавляется в разметке глобально (для JS-селектора),
				// дополнительных базовых классов не требуется.
				if ($color_mod) {
					$active[] = $color_mod;
				}
				break;
		}

		return ['base' => $base, 'active' => $active];
	}
}

// Load More
$load_more_enable = isset($attributes['loadMoreEnable']) ? $attributes['loadMoreEnable'] : false;
$load_more_initial_count = isset($attributes['loadMoreInitialCount']) ? (int) $attributes['loadMoreInitialCount'] : 6;
$load_more_load_more_count = isset($attributes['loadMoreLoadMoreCount']) ? (int) $attributes['loadMoreLoadMoreCount'] : 6;
$load_more_text_key = isset($attributes['loadMoreText']) ? $attributes['loadMoreText'] : 'show-more';
$load_more_type = isset($attributes['loadMoreType']) ? $attributes['loadMoreType'] : 'button';
$load_more_button_size = isset($attributes['loadMoreButtonSize']) ? $attributes['loadMoreButtonSize'] : '';
$load_more_button_style = isset($attributes['loadMoreButtonStyle']) ? $attributes['loadMoreButtonStyle'] : 'solid';

// Предустановленные тексты для кнопки/ссылки
$load_more_texts = [
	'show-more' => __('Show More', 'codeweber-gutenberg-blocks'),
	'load-more' => __('Load More', 'codeweber-gutenberg-blocks'),
	'show-more-items' => __('Show More Items', 'codeweber-gutenberg-blocks'),
	'more-posts' => __('More Posts', 'codeweber-gutenberg-blocks'),
	'view-all' => __('View All', 'codeweber-gutenberg-blocks'),
	'show-all' => __('Show All', 'codeweber-gutenberg-blocks'),
];

$load_more_text = isset($load_more_texts[$load_more_text_key]) ? $load_more_texts[$load_more_text_key] : $load_more_texts['show-more'];

// Helper function to get container classes
if (!function_exists('get_post_grid_container_classes')) {
	function get_post_grid_container_classes($attributes, $grid_type) {
		$gridGapX = $attributes['gridGapX'] ?? '';
		$gridGapY = $attributes['gridGapY'] ?? '';
		$gridGapType = $attributes['gridGapType'] ?? 'general';
		
		$classes = ['row'];
		
		// Gap classes
		$gap_classes = [];
		if ($gridGapType === 'theme') {
			$theme_gap = class_exists('Codeweber_Options') ? Codeweber_Options::style('grid-gap') : '';
			if ($theme_gap) {
				foreach (explode(' ', $theme_gap) as $cls) {
					if ($cls) $gap_classes[] = $cls;
				}
			}
		} elseif ($gridGapType === 'general' || $gridGapType === 'x' || $gridGapType === 'y') {
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

if ( $source_type !== 'taxonomy' ) :

	// Manual selection mode: query only the explicitly chosen posts in their saved order.
	$manual_mode    = ! empty( $attributes['manualMode'] );
	$manual_posts_raw = isset( $attributes['manualPosts'] ) && is_array( $attributes['manualPosts'] )
		? $attributes['manualPosts']
		: [];
	$manual_post_ids = array_values( array_filter(
		array_map( function ( $item ) {
			return isset( $item['id'] ) ? (int) $item['id'] : 0;
		}, $manual_posts_raw ),
		function ( $id ) { return $id > 0; }
	) );

	$manual_items = isset( $attributes['manualItems'] ) && is_array( $attributes['manualItems'] )
		? $attributes['manualItems']
		: [];
	$manual_items_mode = $manual_mode && ! empty( $manual_items );

	if ( $manual_items_mode ) {
		$load_more_enable = false;
	} elseif ( $manual_mode && ! empty( $manual_post_ids ) ) {
		$args = array(
			'post_type'           => $post_type,
			'posts_per_page'      => count( $manual_post_ids ),
			'post_status'         => 'publish',
			'post__in'            => $manual_post_ids,
			'orderby'             => 'post__in',
			'ignore_sticky_posts' => 1,
		);
		$load_more_enable = false;
		// Apply active filter term on top of post__in — returns intersection.
		if ( $enable_filter && $filter_taxonomy && $filter_active_term > 0 ) {
			$args['tax_query'] = [ [
				'taxonomy' => $filter_taxonomy,
				'field'    => 'term_id',
				'terms'    => [ $filter_active_term ],
				'operator' => 'IN',
			] ];
		}
	} else {
		// Query posts
		// Если Load More включен, запрашиваем только initialCount постов для начальной загрузки
		// Остальные посты будут загружаться через AJAX
		// Иначе используем стандартный posts_per_page
		$query_posts_per_page = $load_more_enable
			? $load_more_initial_count
			: $posts_per_page;

		$args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $query_posts_per_page,
			'post_status'    => 'publish',
			'orderby'        => $order_by,
			'order'          => $order,
		);

		// Runtime-фильтр: если фильтр-бар включён и выбран активный term, он переопределяет
		// ограничение по filter_taxonomy из selectedTaxonomies (иначе initial и runtime конфликтуют).
		$runtime_selected_taxonomies = $selected_taxonomies;
		if ( $enable_filter && $filter_taxonomy && $filter_active_term > 0 ) {
			if ( ! is_array( $runtime_selected_taxonomies ) ) {
				$runtime_selected_taxonomies = [];
			}
			$runtime_selected_taxonomies[ $filter_taxonomy ] = [ $filter_active_term ];
		}

		// Добавляем фильтрацию по таксономиям, если выбраны термины
		if ( ! empty( $runtime_selected_taxonomies ) && is_array( $runtime_selected_taxonomies ) ) {
			$tax_query = array( 'relation' => 'AND' );

			foreach ( $runtime_selected_taxonomies as $taxonomy_slug => $term_ids ) {
				if ( ! empty( $term_ids ) && is_array( $term_ids ) ) {
					$tax_query[] = array(
						'taxonomy' => $taxonomy_slug,
						'field'    => 'term_id',
						'terms'    => array_map( 'intval', $term_ids ),
						'operator' => 'IN',
					);
				}
			}

			if ( count( $tax_query ) > 1 ) {
				$args['tax_query'] = $tax_query;
			}
		}
	}

$query = $manual_items_mode ? null : new WP_Query($args);

// In manual mode, restrict filter terms to only those present in the selected posts.
if ( $manual_mode && $enable_filter && $filter_taxonomy && taxonomy_exists( $filter_taxonomy ) ) {
	$restrict_ids = $manual_items_mode
		? array_values( array_filter(
			array_map( function ( $i ) {
				return ( isset( $i['type'] ) && $i['type'] === 'post' && isset( $i['id'] ) ) ? (int) $i['id'] : 0;
			}, $manual_items ),
			function ( $id ) { return $id > 0; }
		) )
		: $manual_post_ids;
	if ( ! empty( $restrict_ids ) ) {
		$manual_filter_terms = get_terms( [
			'taxonomy'   => $filter_taxonomy,
			'hide_empty' => false,
			'object_ids' => $restrict_ids,
		] );
		$filter_terms = is_wp_error( $manual_filter_terms ) ? [] : $manual_filter_terms;
	}
}

else :
	$manual_mode       = false;
	$manual_items_mode = false;
	$load_more_enable  = false;
	$enable_filter     = false;
	$query             = null;
endif;

// Block wrapper attributes
$text_inverse = !empty($attributes['textInverse']);
$wrapper_classes = 'cwgb-post-grid-block ' . $block_class . ($text_inverse ? ' text-inverse' : '');
$wrapper_data_attrs = [
	'data-block-id' => $block_id,
	'data-block-type' => 'post-grid',
	'data-block-attributes' => esc_attr(json_encode($attributes)),
	'data-post-id' => get_the_ID(),
];

// Добавляем Load More классы и атрибуты ТОЛЬКО для grid режима и когда Load More включен
// В режиме swiper эти атрибуты НИКОГДА не добавляются
if ($display_mode !== 'swiper' && $display_mode === 'grid' && $load_more_enable === true) {
	$wrapper_classes .= ' cwgb-load-more-container';
	$wrapper_data_attrs['data-current-offset'] = $load_more_initial_count;
	$wrapper_data_attrs['data-load-count'] = $load_more_load_more_count;
}

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
$posts_to_show = $manual_items_mode ? [] : ( $query ? $query->posts : [] );

// Проверяем, есть ли еще посты для загрузки
$has_more = ! $manual_items_mode && $load_more_enable && $query && $query->found_posts > $load_more_initial_count;

// Helper function to get image URL
if (!function_exists('get_post_image_url')) {
	function get_post_image_url($post, $image_size = 'full') {
		$thumbnail_id = get_post_thumbnail_id($post->ID);
		if (!$thumbnail_id) {
			// Используем placeholder если изображения нет
			return GUTENBERG_BLOCKS_URL . 'placeholder.jpg';
		}

		$image = wp_get_attachment_image_src($thumbnail_id, $image_size);
		return $image ? $image[0] : GUTENBERG_BLOCKS_URL . 'placeholder.jpg';
	}
}

// Projects-only: найти первое изображение в _project_gallery с указанным image_tag.
// Возвращает attachment ID или null. Читает и учитывает только реально attach'нутые вложения.
if (!function_exists('cwgb_projects_find_image_by_tag')) {
	function cwgb_projects_find_image_by_tag($post_id, $term_id) {
		$term_id = (int) $term_id;
		if ($term_id <= 0) {
			return null;
		}
		$gallery_ids = get_post_meta($post_id, '_project_gallery', true);
		if (empty($gallery_ids) || !is_array($gallery_ids)) {
			return null;
		}
		foreach ($gallery_ids as $attachment_id) {
			$attachment_id = (int) $attachment_id;
			if ($attachment_id <= 0) {
				continue;
			}
			if (has_term($term_id, 'image_tag', $attachment_id)) {
				return $attachment_id;
			}
		}
		return null;
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
		$items_xxxl = $attributes['swiperItemsXxxl'] ?? '';
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
			if ($items_xxxl) $attrs['data-items-xxxl'] = $items_xxxl;
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

		// Title tag: display-* рендерится как <h2 class="display-*"> (класс добавит compose_title_class).
		$allowed_title_tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span'];
		$title_tag_raw = isset($attributes['titleTag']) ? $attributes['titleTag'] : 'h3';
		if (strpos($title_tag_raw, 'display-') === 0) {
			$title_tag = 'h2';
		} else {
			$title_tag = in_array($title_tag_raw, $allowed_title_tags, true) ? $title_tag_raw : 'h3';
		}
		// Итоговый title_class = size + weight + transform + color + custom — та же логика что и в верхнем скоупе.
		$title_class = sanitize_text_field(cwgb_post_grid_compose_title_class($attributes));

		// Загружаем новую систему шаблонов из темы, если доступна
		$post_card_templates_path = get_template_directory() . '/functions/post-card-templates.php';
		if (file_exists($post_card_templates_path) && !function_exists('cw_render_post_card')) {
			require_once $post_card_templates_path;
		}
		
		// Используем новую систему шаблонов из темы, если доступна
		if (function_exists('cw_render_post_card')) {
			// Убеждаемся, что $post является объектом WP_Post
			if (!is_object($post) || !isset($post->ID)) {
				if (is_numeric($post)) {
					$post = get_post($post);
				} else {
					$post = get_post($post);
				}
			}
			if (!$post || !isset($post->ID)) {
				return '';
			}
			
			$post_type = get_post_type($post->ID);

			// Для WooCommerce товаров пропускаем невидимые (password-protected,
			// hidden, draft и т.п.) — иначе шаблон shop-card возвращает пусто,
			// и блок падает в post-fallback.
			if ($post_type === 'product' && function_exists('wc_get_product')) {
				$wc_product = wc_get_product($post->ID);
				if (!$wc_product || !$wc_product->is_visible()) {
					return '';
				}
			}

			// Специальная обработка для clients
			if ($post_type === 'clients') {
				// Упрощенные настройки для clients
				$display_settings = [
					'show_title' => false,
					'show_date' => false,
					'show_category' => false,
					'show_comments' => false,
					'title_length' => 0,
					'excerpt_length' => 0,
					'title_tag' => $title_tag,
					'title_class' => $title_class,
				];

				$template_args = [
					'image_size' => $image_size,
					'enable_link' => isset($attributes['enableLink']) ? (bool) $attributes['enableLink'] : false,
				];
			} elseif ($post_type === 'testimonials') {
				// Специальная обработка для testimonials
				$display_settings = [
					'show_title' => false,
					'show_date' => false,
					'show_category' => false,
					'show_comments' => false,
					'title_length' => 0,
					'excerpt_length' => 0,
					'title_tag' => $title_tag,
					'title_class' => $title_class,
				];
				
				// Определяем шаблон для testimonials
				// Если шаблон начинается с "testimonial-", используем его
				// Иначе используем default для testimonials
				$testimonial_template = 'default';
				if (strpos($template, 'testimonial-') === 0) {
					$testimonial_template = str_replace('testimonial-', '', $template);
				} elseif (in_array($template, ['default', 'card', 'blockquote', 'icon'])) {
					// Если указан один из стандартных шаблонов testimonials, используем его
					$testimonial_template = $template;
				}
				
				// Проверяем, включен ли lift эффект
				$simple_effect = isset($attributes['simpleEffect']) ? $attributes['simpleEffect'] : 'none';
				$enable_lift = ($simple_effect === 'lift');
				
				$template_args = [
					'image_size' => $image_size,
					'show_rating' => isset($attributes['showRating']) ? (bool) $attributes['showRating'] : true,
					'show_company' => isset($attributes['showCompany']) ? (bool) $attributes['showCompany'] : false,
					'bg_color' => isset($attributes['bgColor']) ? $attributes['bgColor'] : '', // Для card шаблона
					'shadow' => isset($attributes['shadow']) ? (bool) $attributes['shadow'] : true, // Для blockquote шаблона
					'enable_lift' => $enable_lift, // Передаем enable_lift для добавления класса lift
				];
				
				// Используем шаблон testimonials
				$html = cw_render_post_card($post, $testimonial_template, $display_settings, $template_args);
			} elseif ($post_type === 'documents') {
				// Специальная обработка для documents
				// Поддерживаем оба шаблона: document-card и document-card-download
				$display_settings = [
					'show_title' => true,
					'show_date' => true,
					'show_category' => false,
					'show_comments' => false,
					'title_length' => 56,
					'excerpt_length' => 40,
					'title_tag' => $title_tag,
					'title_class' => $title_class,
				];
				
				// Настройки шаблона для documents (overlay-5 стиль)
				$template_args = [
					'image_size' => $image_size,
					'hover_classes' => 'overlay overlay-5',
					'border_radius' => isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 'rounded',
					'show_figcaption' => true,
				];
				
				// Определяем шаблон для documents (document-card или document-card-download)
				$document_template = ($template === 'document-card-download') ? 'card_download' : 'card';
				$html = cw_render_post_card($post, $document_template, $display_settings, $template_args);
				
				// Если функция вернула не пустую строку, используем её
				if (!empty($html) && trim($html) !== '') {
					// Добавляем обертку для grid режима (не swiper)
					if (!$is_swiper) {
						// Для classic grid добавляем обертку с col-* классами
						if ($grid_type === 'classic' && !empty($col_classes)) {
							$html = '<div class="' . esc_attr($col_classes) . '">' . $html . '</div>';
						}
						// Для columns-grid добавляем обертку с классом col (row-cols-* работает на контейнере)
						elseif ($grid_type === 'columns-grid') {
							$html = '<div class="col">' . $html . '</div>';
						}
					}
					
					return $html;
				}
			} elseif ($post_type === 'faq') {
				// Специальная обработка для FAQ
				$display_settings = [
					'show_title' => true,
					'show_date' => false,
					'show_category' => false,
					'show_comments' => false,
					'title_length' => 0,
					'excerpt_length' => 80, // Показываем ответ FAQ
					'title_tag' => $title_tag,
					'title_class' => $title_class,
				];
				
				$template_args = [
					'image_size' => $image_size,
				];
				
				// Используем шаблон default для FAQ
				$html = cw_render_post_card($post, 'default', $display_settings, $template_args);
				
				// Если функция вернула не пустую строку, используем её
				if (!empty($html) && trim($html) !== '') {
					// Добавляем обертку для grid режима (не swiper)
					if (!$is_swiper) {
						// Для classic grid добавляем обертку с col-* классами
						if ($grid_type === 'classic' && !empty($col_classes)) {
							$html = '<div class="' . esc_attr($col_classes) . '">' . $html . '</div>';
						}
						// Для columns-grid добавляем обертку с классом col (row-cols-* работает на контейнере)
						elseif ($grid_type === 'columns-grid') {
							$html = '<div class="col">' . $html . '</div>';
						}
					}
					
					return $html;
				}
				
				// Если функция вернула пустую строку, продолжаем с fallback ниже
			} elseif ($post_type === 'staff') {
				// Специальная обработка для staff
				$display_settings = [
					'show_title' => true,
					'show_date' => false,
					'show_category' => false,
					'show_comments' => false,
					'title_length' => 0,
					'excerpt_length' => 0,
					'title_tag' => $title_tag,
					'title_class' => $title_class,
				];

				// Определяем шаблон для staff
				// Если шаблон начинается с "staff-", используем его
				// Иначе используем default для staff
				$staff_template = 'default';
				if (strpos($template, 'staff-') === 0) {
					$staff_template = str_replace('staff-', '', $template);
				} elseif (in_array($template, ['default', 'card', 'circle', 'circle_center', 'circle_center_alt'])) {
					// Если указан один из стандартных шаблонов staff, используем его
					$staff_template = $template;
				}
				
				// Проверяем, включен ли lift эффект
				$simple_effect = isset($attributes['simpleEffect']) ? $attributes['simpleEffect'] : 'none';
				$enable_lift = ($simple_effect === 'lift');
				
				// Для circle шаблона всегда используем w-15, для circle_center и circle_center_alt - w-20
				$avatar_size = 'w-15';
				if (in_array($staff_template, ['circle_center', 'circle_center_alt'])) {
					$avatar_size = 'w-20';
				}
				if (isset($attributes['avatarSize']) && !empty($attributes['avatarSize'])) {
					$avatar_size = $attributes['avatarSize'];
				}
				
				// Для staff по умолчанию enable_link = true (если явно не установлено false)
				// Для circle и circle_center шаблонов всегда включаем ссылку на всей карточке
				// Для circle_center_alt ссылка на изображении
				$enable_link_staff = true;
				if (!in_array($staff_template, ['circle', 'circle_center', 'circle_center_alt']) && isset($attributes['enableLink'])) {
					$enable_link_staff = (bool) $attributes['enableLink'];
				}
				
				// Для circle_center_alt по умолчанию показываем социальные иконки
				$show_social_staff = false;
				if ($staff_template === 'circle_center_alt') {
					$show_social_staff = true; // По умолчанию для circle_center_alt
					if (isset($attributes['showSocial'])) {
						$show_social_staff = (bool) $attributes['showSocial'];
					}
				} else {
					$show_social_staff = isset($attributes['showSocial']) ? (bool) $attributes['showSocial'] : false;
				}
				
				$template_args = [
					'image_size' => $image_size,
					'show_description' => isset($attributes['showDescription']) ? (bool) $attributes['showDescription'] : false,
					'show_social' => $show_social_staff,
					'enable_link' => $enable_link_staff, // Для circle шаблона всегда true
					'enable_lift' => $enable_lift,
					'avatar_size' => $avatar_size, // Для circle шаблона всегда w-15 по умолчанию
					'bg_color' => isset($attributes['bgColor']) ? $attributes['bgColor'] : '', // Для card шаблона
				];
				
				// Используем шаблон staff
				$html = cw_render_post_card($post, $staff_template, $display_settings, $template_args);
				
				// Если функция вернула не пустую строку, используем её
				if (!empty($html) && trim($html) !== '') {
					// Добавляем обертку для grid режима (не swiper)
					if (!$is_swiper) {
						// Для classic grid добавляем обертку с col-* классами
						if ($grid_type === 'classic' && !empty($col_classes)) {
							$html = '<div class="' . esc_attr($col_classes) . '">' . $html . '</div>';
						}
						// Для columns-grid добавляем обертку с классом col (row-cols-* работает на контейнере)
						elseif ($grid_type === 'columns-grid') {
							$html = '<div class="col">' . $html . '</div>';
						}
					}
					
					return $html;
				}
				
				// Если функция вернула пустую строку, продолжаем с fallback ниже
			} elseif ($post_type === 'offices') {
				$display_settings = [
					'show_title'          => array_key_exists('showTitle', $attributes) ? (bool) $attributes['showTitle'] : true,
					'show_date'           => false,
					'show_category'       => false,
					'show_comments'       => false,
					'title_length'        => isset($attributes['titleLength']) ? (int) $attributes['titleLength'] : 0,
					'excerpt_length'      => 0,
					'title_tag'           => $title_tag,
					'title_class'         => $title_class,
					'show_office_address'      => array_key_exists('showOfficeAddress',      $attributes) ? (bool) $attributes['showOfficeAddress']      : true,
					'show_office_phone'        => array_key_exists('showOfficePhone',        $attributes) ? (bool) $attributes['showOfficePhone']        : true,
					'show_office_email'        => array_key_exists('showOfficeEmail',        $attributes) ? (bool) $attributes['showOfficeEmail']        : true,
					'show_office_hours'        => array_key_exists('showOfficeHours',        $attributes) ? (bool) $attributes['showOfficeHours']        : true,
					'show_office_description'  => array_key_exists('showOfficeDescription',  $attributes) ? (bool) $attributes['showOfficeDescription']  : true,
					'show_office_map'          => array_key_exists('showOfficeMap',          $attributes) ? (bool) $attributes['showOfficeMap']          : true,
					'office_map_style'         => isset($attributes['officeMapStyle']) ? sanitize_key($attributes['officeMapStyle']) : 'button',
				];

				$template_args = [
					'image_size' => $image_size,
				];

				$html = cw_render_post_card($post, $template, $display_settings, $template_args);

				if (!empty($html) && trim($html) !== '') {
					if (!$is_swiper) {
						if ($grid_type === 'classic' && !empty($col_classes)) {
							$html = '<div class="' . esc_attr($col_classes) . '">' . $html . '</div>';
						} elseif ($grid_type === 'columns-grid') {
							$html = '<div class="col">' . $html . '</div>';
						}
					}
					return $html;
				}
			} else {
				// Настройки отображения для обычных постов — читаются из атрибутов блока
				$display_settings = [
					'show_title'     => array_key_exists('showTitle', $attributes)    ? (bool) $attributes['showTitle']    : true,
					'show_date'      => array_key_exists('showDate', $attributes)     ? (bool) $attributes['showDate']     : true,
					'show_category'  => array_key_exists('showCategory', $attributes) ? (bool) $attributes['showCategory'] : true,
					'show_comments'  => array_key_exists('showComments', $attributes) ? (bool) $attributes['showComments'] : true,
					'show_excerpt'        => array_key_exists('showExcerpt', $attributes)  ? (bool) $attributes['showExcerpt']  : false,
					'excerpt_hide_mobile' => ! empty( $attributes['excerptHideMobile'] ),
					'title_length'        => isset($attributes['titleLength'])   ? (int) $attributes['titleLength']   : 56,
					'excerpt_length'      => isset($attributes['excerptLength']) ? (int) $attributes['excerptLength'] : 20,
					'title_tag'           => $title_tag,
					'title_class'         => $title_class,
				];

				// Hover-классы для фигуры (зависят только от шаблона)
				$hover_classes = 'overlay overlay-1';
				if ( strpos( $template, 'overlay-5-primary' ) !== false ) {
					$hover_classes = 'overlay overlay-5 color';
				} elseif ( strpos( $template, 'overlay-5' ) !== false ) {
					$hover_classes = 'overlay overlay-5';
				}
				if ($template === 'slider' || $template === 'card-content') {
					$hover_classes .= ' hover-scale';
				}

				// default-clickable исторически всегда lift; для остальных — управляется simpleEffect
				$item_simple_effect = isset($attributes['simpleEffect']) ? $attributes['simpleEffect'] : 'none';
				$enable_lift = ($template === 'default-clickable')
					? true
					: ($item_simple_effect === 'lift');

				$template_args = [
					'image_size'           => $image_size,
					'hover_classes'        => $hover_classes,
					'border_radius'        => isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 'rounded',
					'show_figcaption'      => true,
					'enable_lift'          => $enable_lift,
					'show_card_arrow'      => array_key_exists('showCardArrow', $attributes) ? (bool) $attributes['showCardArrow'] : true,
					'card_read_more'       => isset($attributes['cardReadMore']) ? $attributes['cardReadMore'] : 'more',
				];
			}
			
			// Для product+shop* шаблонов карточка уже содержит col-обёртку
			// (class="project item col-..."). Передаём col-классы Post Grid внутрь
			// через global $cw_shop_col_class и пропускаем внешний col-wrap.
			// Покрывает: shop-card, shop-compact, shop-list, shop2, и любые shopN в будущем.
			$is_wc_shop_template = ($post_type === 'product' && strpos($template, 'shop') === 0);
			if ($is_wc_shop_template && !empty($col_classes)) {
				$GLOBALS['cw_shop_col_class'] = $col_classes;
			}

			// Alt title: override post title with HTML-capable meta field when toggle is on.
			$use_alt_title    = ! empty( $attributes['useAltTitle'] );
			$alt_title_filter = null;
			if ( $use_alt_title && isset( $post->ID ) ) {
				$alt_title_val = get_post_meta( $post->ID, '_alt_title', true );
				if ( ! empty( $alt_title_val ) ) {
					$pid              = $post->ID;
					$atv              = wp_kses_post( $alt_title_val );
					$alt_title_filter = function ( $title, $id ) use ( $pid, $atv ) {
						return ( (int) $id === $pid ) ? $atv : $title;
					};
					add_filter( 'the_title', $alt_title_filter, 99, 2 );
					$display_settings['use_html_title'] = true;
					$display_settings['title_length']   = 0;
				}
			}

			// В режиме Swiper (slider) НИКОГДА не добавляем col-* классы
			$html = cw_render_post_card($post, $template, $display_settings, $template_args);

			if ( $alt_title_filter ) {
				remove_filter( 'the_title', $alt_title_filter, 99 );
			}

			if ($is_wc_shop_template) {
				unset($GLOBALS['cw_shop_col_class']);
			}

			// Если функция вернула не пустую строку, используем её
			if (!empty($html) && trim($html) !== '') {
				// Добавляем обертку для grid режима (не swiper, и не для WC-shop шаблонов)
				if (!$is_swiper && !$is_wc_shop_template) {
					// Для classic grid добавляем обертку с col-* классами
					if ($grid_type === 'classic' && !empty($col_classes)) {
						$html = '<div class="' . esc_attr($col_classes) . '">' . $html . '</div>';
					}
					// Для columns-grid добавляем обертку с классом col (row-cols-* работает на контейнере)
					elseif ($grid_type === 'columns-grid') {
						$html = '<div class="col">' . $html . '</div>';
					}
				}

				return $html;
			}
		}

		return '';
	}
}

// Term image URL — uses 'thumbnail_id' meta key (WooCommerce standard; same key for custom taxonomies).
if ( ! function_exists( 'cwgb_get_term_image_url' ) ) {
	function cwgb_get_term_image_url( $term_id, $image_size = 'full' ) {
		$thumbnail_id = (int) get_term_meta( $term_id, 'thumbnail_id', true );
		if ( $thumbnail_id > 0 ) {
			$image = wp_get_attachment_image_src( $thumbnail_id, $image_size );
			if ( $image ) return $image[0];
		}
		return GUTENBERG_BLOCKS_URL . 'placeholder.jpg';
	}
}

// Term card renderer.
if ( ! function_exists( 'cwgb_render_term_card' ) ) {
	function cwgb_render_term_card( $term, $attributes, $image_size, $grid_type, $col_classes, $is_swiper, $title_tag, $title_class ) {
		$term_link = get_term_link( $term );
		if ( is_wp_error( $term_link ) ) return '';

		$border_radius  = isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 'rounded';
		$show_title     = array_key_exists( 'showTitle', $attributes ) ? (bool) $attributes['showTitle'] : true;
		$show_excerpt   = ! empty( $attributes['showExcerpt'] );
		$show_count     = ! empty( $attributes['showTermCount'] );
		$excerpt_length = isset( $attributes['excerptLength'] ) ? (int) $attributes['excerptLength'] : 0;
		$title_length   = isset( $attributes['titleLength'] ) ? (int) $attributes['titleLength'] : 0;

		$image_url  = cwgb_get_term_image_url( $term->term_id, $image_size );
		$term_name  = $term->name;
		if ( $title_length > 0 && mb_strlen( $term_name ) > $title_length ) {
			$term_name = mb_substr( $term_name, 0, $title_length ) . '…';
		}

		$figure_cls = trim( $border_radius . ' overlay overlay-1 mb-0' );
		$tc_attr    = $title_class
			? ' class="from-top mb-1 ' . esc_attr( $title_class ) . '"'
			: ' class="from-top mb-1"';

		$description = '';
		if ( $show_excerpt && ! empty( $term->description ) ) {
			$desc = strip_tags( $term->description );
			if ( $excerpt_length > 0 ) {
				$words = explode( ' ', $desc );
				if ( count( $words ) > $excerpt_length ) {
					$desc = implode( ' ', array_slice( $words, 0, $excerpt_length ) ) . '&hellip;';
				}
			}
			$description = wp_kses_post( $desc );
		}

		$html  = '<figure class="' . esc_attr( $figure_cls ) . '">';
		$html .= '<a href="' . esc_url( $term_link ) . '">';
		$html .= '<img src="' . esc_url( $image_url ) . '" alt="' . esc_attr( $term_name ) . '" decoding="async" />';

		$has_caption = $show_title || $description || $show_count;
		if ( $has_caption ) {
			$html .= '<figcaption>';
			if ( $show_title ) {
				$html .= '<' . esc_attr( $title_tag ) . $tc_attr . '>' . esc_html( $term_name ) . '</' . esc_attr( $title_tag ) . '>';
			}
			if ( $description ) {
				$html .= '<p class="from-bottom mb-0">' . $description . '</p>';
			}
			if ( $show_count ) {
				/* translators: %d: number of posts in taxonomy term */
				$html .= '<p class="from-bottom mb-0 small">' . esc_html( sprintf( _n( '%d item', '%d items', $term->count, 'codeweber-gutenberg-blocks' ), $term->count ) ) . '</p>';
			}
			$html .= '</figcaption>';
		}

		$html .= '</a></figure>';

		if ( ! $is_swiper ) {
			if ( $grid_type === 'classic' && ! empty( $col_classes ) ) {
				$html = '<div class="' . esc_attr( $col_classes ) . '">' . $html . '</div>';
			} elseif ( $grid_type === 'columns-grid' ) {
				$html = '<div class="col">' . $html . '</div>';
			}
		}

		return $html;
	}
}

// ============ TAXONOMY MODE RENDER ============
if ( $source_type === 'taxonomy' ) {
	$source_taxonomy     = isset( $attributes['sourceTaxonomy'] ) ? sanitize_key( $attributes['sourceTaxonomy'] ) : '';
	$taxonomy_parent     = isset( $attributes['taxonomyParent'] ) ? (int) $attributes['taxonomyParent'] : 0;
	$taxonomy_hide_empty = isset( $attributes['taxonomyHideEmpty'] ) ? (bool) $attributes['taxonomyHideEmpty'] : true;
	$taxonomy_order_by   = isset( $attributes['taxonomyOrderBy'] ) ? sanitize_key( $attributes['taxonomyOrderBy'] ) : 'name';
	$taxonomy_order_val  = isset( $attributes['taxonomyOrder'] ) ? strtoupper( sanitize_key( $attributes['taxonomyOrder'] ) ) : 'ASC';
	$manual_term_mode    = ! empty( $attributes['manualTermMode'] );
	$manual_term_items   = isset( $attributes['manualTermItems'] ) ? (array) $attributes['manualTermItems'] : [];

	$term_template    = isset( $attributes['template'] ) ? $attributes['template'] : 'overlay-5';
	$use_theme_render = function_exists( 'cw_render_term_card' );

	$term_display_settings = [
		'show_title'          => array_key_exists( 'showTitle', $attributes ) ? (bool) $attributes['showTitle'] : true,
		'show_excerpt'        => ! empty( $attributes['showExcerpt'] ),
		'excerpt_hide_mobile' => ! empty( $attributes['excerptHideMobile'] ),
		'excerpt_length'      => isset( $attributes['excerptLength'] ) ? (int) $attributes['excerptLength'] : 0,
		'title_length'        => isset( $attributes['titleLength'] ) ? (int) $attributes['titleLength'] : 0,
		'title_tag'           => $title_tag,
		'title_class'         => $title_class,
		'use_alt_title'       => ! empty( $attributes['useAltTitle'] ),
	];
	$term_template_args = [
		'image_size'      => $image_size,
		'border_radius'   => isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 'rounded',
		'show_card_arrow' => array_key_exists( 'showCardArrow', $attributes ) ? (bool) $attributes['showCardArrow'] : true,
		'card_read_more'  => isset( $attributes['cardReadMore'] ) ? $attributes['cardReadMore'] : 'none',
		'enable_lift'     => isset( $attributes['simpleEffect'] ) && $attributes['simpleEffect'] === 'lift',
		'show_term_count' => ! empty( $attributes['showTermCount'] ),
	];

	// Helper: render one term card (HTML without col-wrap).
	$render_one_term = function( $term ) use ( $use_theme_render, $term_template, $term_display_settings, $term_template_args, $attributes, $image_size, $grid_type, $col_classes, $title_tag, $title_class ) {
		if ( $use_theme_render ) {
			return cw_render_term_card( $term, $term_template, $term_display_settings, $term_template_args );
		}
		return cwgb_render_term_card( $term, $attributes, $image_size, $grid_type, $col_classes, false, $title_tag, $title_class );
	};

	// Helper: wrap card in col/swiper-slide.
	$wrap_term_card = function( $card_html, $is_swiper, $swiper_slide_cls = '' ) use ( $grid_type, $col_classes ) {
		if ( empty( $card_html ) ) return '';
		if ( $is_swiper ) {
			$sc = 'swiper-slide' . ( $swiper_slide_cls ? ' ' . esc_attr( $swiper_slide_cls ) : '' );
			return '<div class="' . esc_attr( $sc ) . '">' . $card_html . '</div>';
		}
		if ( $grid_type === 'classic' && ! empty( $col_classes ) ) {
			return '<div class="' . esc_attr( $col_classes ) . '">' . $card_html . '</div>';
		}
		if ( $grid_type === 'columns-grid' ) {
			return '<div class="col">' . $card_html . '</div>';
		}
		return $card_html;
	};

	echo '<div ' . $wrapper_attributes . '>';

	// ── Manual term selection ──────────────────────────────────────────────
	if ( $manual_term_mode ) {
		if ( empty( $manual_term_items ) ) {
			echo '<p>' . esc_html__( 'No terms selected. Add terms in block settings.', 'codeweber-gutenberg-blocks' ) . '</p>';
			echo '</div>';
			return;
		}

		if ( $display_mode === 'swiper' ) {
			$swiper_container_classes = get_swiper_container_classes( $attributes );
			$swiper_data_attrs        = get_swiper_data_attributes( $attributes );
			$swiper_data_attrs_str    = '';
			foreach ( $swiper_data_attrs as $key => $value ) {
				$swiper_data_attrs_str .= ' ' . esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
			}
			$items_auto       = ! empty( $attributes['swiperItemsAuto'] );
			$wrapper_cls_sw   = $items_auto ? 'swiper-wrapper ticker' : 'swiper-wrapper';
			$swiper_slide_cls = isset( $attributes['swiperSlideClass'] ) ? $attributes['swiperSlideClass'] : '';

			echo '<div class="' . esc_attr( trim( $swiper_container_classes ) ) . '"' . $swiper_data_attrs_str . '>';
			echo '<div class="swiper"><div class="' . esc_attr( $wrapper_cls_sw ) . '">';
			foreach ( $manual_term_items as $item ) {
				$item_type = isset( $item['type'] ) ? $item['type'] : 'term';
				if ( $item_type === 'html' ) {
					$html_post = get_post( (int) $item['id'] );
					if ( $html_post && $html_post->post_status === 'publish' ) {
						echo '<div class="swiper-slide">' . do_blocks( $html_post->post_content ) . '</div>';
					}
				} else {
					$item_taxonomy = isset( $item['taxonomy'] ) ? sanitize_key( $item['taxonomy'] ) : '';
					$term          = $item_taxonomy ? get_term( (int) $item['id'], $item_taxonomy ) : null;
					if ( $term && ! is_wp_error( $term ) ) {
						echo $wrap_term_card( $render_one_term( $term ), true, $swiper_slide_cls );
					}
				}
			}
			echo '</div></div></div>';
		} else {
			echo '<div class="cwgb-load-more-items ' . esc_attr( $grid_classes ) . '">';
			foreach ( $manual_term_items as $item ) {
				$item_type = isset( $item['type'] ) ? $item['type'] : 'term';
				if ( $item_type === 'html' ) {
					$html_post = get_post( (int) $item['id'] );
					if ( $html_post && $html_post->post_status === 'publish' ) {
						echo do_blocks( $html_post->post_content );
					}
				} else {
					$item_taxonomy = isset( $item['taxonomy'] ) ? sanitize_key( $item['taxonomy'] ) : '';
					$term          = $item_taxonomy ? get_term( (int) $item['id'], $item_taxonomy ) : null;
					if ( $term && ! is_wp_error( $term ) ) {
						echo $wrap_term_card( $render_one_term( $term ), false );
					}
				}
			}
			echo '</div>';
		}

		echo '</div>'; // close wrapper
		return;
	}

	// ── Auto query mode ───────────────────────────────────────────────────
	if ( ! $source_taxonomy || ! taxonomy_exists( $source_taxonomy ) ) {
		echo '<p>' . esc_html__( 'Please select a taxonomy in block settings.', 'codeweber-gutenberg-blocks' ) . '</p>';
		echo '</div>';
		return;
	}

	$term_args = [
		'taxonomy'   => $source_taxonomy,
		'number'     => $posts_per_page,
		'hide_empty' => $taxonomy_hide_empty,
		'orderby'    => $taxonomy_order_by,
		'order'      => $taxonomy_order_val,
	];
	if ( $taxonomy_parent > 0 ) {
		$term_args['parent'] = $taxonomy_parent;
	}

	$terms = get_terms( $term_args );

	if ( is_wp_error( $terms ) || empty( $terms ) ) {
		echo '<p>' . esc_html__( 'No terms found.', 'codeweber-gutenberg-blocks' ) . '</p>';
		echo '</div>';
		return;
	}

	if ( $display_mode === 'swiper' ) {
		$swiper_container_classes = get_swiper_container_classes( $attributes );
		$swiper_data_attrs        = get_swiper_data_attributes( $attributes );
		$swiper_data_attrs_str    = '';
		foreach ( $swiper_data_attrs as $key => $value ) {
			$swiper_data_attrs_str .= ' ' . esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
		}
		$items_auto       = ! empty( $attributes['swiperItemsAuto'] );
		$wrapper_cls_sw   = $items_auto ? 'swiper-wrapper ticker' : 'swiper-wrapper';
		$swiper_slide_cls = isset( $attributes['swiperSlideClass'] ) ? $attributes['swiperSlideClass'] : '';

		echo '<div class="' . esc_attr( trim( $swiper_container_classes ) ) . '"' . $swiper_data_attrs_str . '>';
		echo '<div class="swiper"><div class="' . esc_attr( $wrapper_cls_sw ) . '">';
		foreach ( $terms as $term ) {
			echo $wrap_term_card( $render_one_term( $term ), true, $swiper_slide_cls );
		}
		echo '</div></div></div>';
	} else {
		echo '<div class="cwgb-load-more-items ' . esc_attr( $grid_classes ) . '">';
		foreach ( $terms as $term ) {
			echo $wrap_term_card( $render_one_term( $term ), false );
		}
		echo '</div>';
	}

	echo '</div>'; // close wrapper
	return;
}
// ============ END TAXONOMY MODE RENDER ============

?>

<div <?php echo $wrapper_attributes; ?>>
	<?php if ($enable_filter && !empty($filter_terms)) :
		$filter_item_classes = cwgb_post_grid_filter_item_classes($filter_style, $filter_active_color, $filter_active_color_type);
		$base_item_class = implode(' ', $filter_item_classes['base']);
		$active_item_class = implode(' ', $filter_item_classes['active']);

		// Разметка зависит от стиля:
		// - default: <ul class="filter isotope-filter"> — тема сама обнулит bullets/padding
		//   и применит типографику через .filter:not(.basic-filter).
		// - остальные: <div class="d-flex flex-wrap gap-2"> с прямыми <a> детьми,
		//   чтобы не триггерить list-стили темы (включая сломанный
		//   .list-unstyled li a.active { color: #9c886f !important }).
		$is_default_style = ($filter_style === 'default');

		if ($is_default_style) {
			$container_classes = ['cwgb-post-grid-filter', 'filter', 'isotope-filter', 'mb-6'];
		} else {
			$container_classes = ['cwgb-post-grid-filter', 'mb-6', 'd-flex', 'flex-wrap', 'gap-2', 'align-items-center'];
		}

		if (!empty($attributes['filterTextReset'])) {
			$container_classes[] = 'text-reset';
		}

		$common_data_attrs = sprintf(
			'data-cwgb-filter-for="%s" data-cwgb-filter-taxonomy="%s" data-cwgb-filter-style="%s"',
			esc_attr($block_id),
			esc_attr($filter_taxonomy),
			esc_attr($filter_style)
		);

		$render_filter_item = function ($label, $term_id, $is_active) use ($base_item_class, $active_item_class) {
			$cls = trim('filter-item ' . $base_item_class . ($is_active ? ' ' . $active_item_class : ''));
			return '<a href="#" class="' . esc_attr($cls) . '" data-cwgb-filter-term="' . esc_attr($term_id) . '">' . esc_html($label) . '</a>';
		};
		?>
		<?php if ($is_default_style) : ?>
			<ul class="<?php echo esc_attr(implode(' ', $container_classes)); ?>" <?php echo $common_data_attrs; ?>>
				<li><?php echo $render_filter_item($filter_all_label, 0, $filter_active_term === 0); ?></li>
				<?php foreach ($filter_terms as $term) : ?>
					<li><?php echo $render_filter_item($term->name, $term->term_id, $filter_active_term === (int) $term->term_id); ?></li>
				<?php endforeach; ?>
			</ul>
		<?php else : ?>
			<div class="<?php echo esc_attr(implode(' ', $container_classes)); ?>" <?php echo $common_data_attrs; ?>>
				<?php echo $render_filter_item($filter_all_label, 0, $filter_active_term === 0); ?>
				<?php foreach ($filter_terms as $term) : ?>
					<?php echo $render_filter_item($term->name, $term->term_id, $filter_active_term === (int) $term->term_id); ?>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	<?php endif; ?>

	<div class="cwgb-post-grid-results" data-cwgb-results-for="<?php echo esc_attr($block_id); ?>">
	<?php if ($manual_items_mode) : ?>
		<div class="cwgb-load-more-items <?php echo esc_attr($grid_classes); ?>">
			<?php foreach ($manual_items as $item) :
				$item_type = isset($item['type']) ? $item['type'] : 'post';
				if ($item_type === 'html') :
					$html_post_id = isset($item['id']) ? (int) $item['id'] : 0;
					if ($html_post_id > 0) :
						$html_post = get_post($html_post_id);
						if ($html_post && $html_post->post_status === 'publish') :
						echo do_blocks( $html_post->post_content );
					endif;
					endif;
				else :
					$item_post_id = isset($item['id']) ? (int) $item['id'] : 0;
					if ($item_post_id <= 0) continue;
					// Skip post if active filter term doesn't match.
					if ( $filter_active_term > 0 && $filter_taxonomy && ! has_term( $filter_active_term, $filter_taxonomy, $item_post_id ) ) continue;
					$item_post = get_post($item_post_id);
					if (!$item_post || $item_post->post_status !== 'publish') continue;
					setup_postdata($item_post);
					$item_image_url = get_post_image_url($item_post, $image_size);
					$item_html = render_post_grid_item($item_post, $attributes, $item_image_url, $image_size, $grid_type, $col_classes);
					wp_reset_postdata();
					if (!empty($item_html) && trim($item_html) !== '') {
						echo $item_html;
					}
				endif;
			endforeach; ?>
		</div>
	<?php elseif ($query && $query->have_posts() && !empty($query->posts)) : ?>
		<?php if ($display_mode === 'swiper') : ?>
			<?php
			// Swiper mode
			$swiper_container_classes = get_swiper_container_classes($attributes);
			$swiper_data_attrs = get_swiper_data_attributes($attributes);
			
			// Для шаблона client-simple добавляем класс clients
			if ($template === 'client-simple') {
				$swiper_container_classes .= ' clients';
			}
			
			// Убираем классы навигации и точек для всех шаблонов, если они не используются
			$swiper_nav = isset($attributes['swiperNav']) ? $attributes['swiperNav'] : true;
			$swiper_dots = isset($attributes['swiperDots']) ? $attributes['swiperDots'] : true;
			
			// Разбиваем классы на массив
			$classes_array = explode(' ', $swiper_container_classes);
			$filtered_classes = [];
			
			foreach ($classes_array as $class) {
				$class = trim($class);
				if (empty($class)) continue;
				
				// Пропускаем классы навигации, если nav выключен
				if (!$swiper_nav && in_array($class, ['nav-dark', 'nav-color'])) {
					continue;
				}
				
				// Пропускаем классы точек, если dots выключен
				if (!$swiper_dots && in_array($class, ['dots-light', 'dots-start', 'dots-over', 'dots-closer'])) {
					continue;
				}
				
				$filtered_classes[] = $class;
			}
			
			$swiper_container_classes = implode(' ', $filtered_classes);
			
			// Add settings from Settings tab to swiper-container
			if (!empty($settings_attrs['class'])) {
				$swiper_container_classes .= ' ' . $settings_attrs['class'];
			}
			
			$swiper_data_attrs_str = '';
			foreach ($swiper_data_attrs as $key => $value) {
				$swiper_data_attrs_str .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
			}
			
			// Добавляем id и data-атрибуты из настроек (для client-simple не добавляем ID)
			$swiper_settings_str = '';
			if ($template !== 'client-simple' && !empty($settings_attrs['id'])) {
				$swiper_settings_str .= ' id="' . $settings_attrs['id'] . '"';
			}
			if (!empty($settings_attrs['data-block-data'])) {
				$swiper_settings_str .= ' data-block-data="' . $settings_attrs['data-block-data'] . '"';
			}
			
			// Add ticker class to wrapper for continuous scrolling when itemsAuto is enabled
			$items_auto = isset($attributes['swiperItemsAuto']) ? $attributes['swiperItemsAuto'] : false;
			$wrapper_classes = $items_auto ? 'swiper-wrapper ticker' : 'swiper-wrapper';
			
			// Add swiper-wrapper class from Settings tab
			$swiper_wrapper_class = isset($attributes['swiperWrapperClass']) ? $attributes['swiperWrapperClass'] : '';
			if (!empty($swiper_wrapper_class)) {
				$wrapper_classes .= ' ' . esc_attr($swiper_wrapper_class);
			}
			
			// Get swiper-slide class from Settings tab
			$swiper_slide_class = isset($attributes['swiperSlideClass']) ? $attributes['swiperSlideClass'] : '';
			?>
			<div class="<?php echo esc_attr(trim($swiper_container_classes)); ?>"<?php echo $swiper_data_attrs_str . $swiper_settings_str; ?>>
				<div class="swiper">
					<div class="<?php echo esc_attr($wrapper_classes); ?>">
						<?php foreach ($query->posts as $post) : setup_postdata($post); ?>
							<?php
							// Projects: override thumbnail через первое подходящее из _project_gallery.
							$projects_override_thumb_id = null;
							$projects_thumb_filter_cb = null;
							if ($projects_filter_image_tag > 0) {
								$projects_override_thumb_id = cwgb_projects_find_image_by_tag($post->ID, $projects_filter_image_tag);
								if ($projects_override_thumb_id) {
									$_captured_pid = (int) $post->ID;
									$_captured_tid = (int) $projects_override_thumb_id;
									$projects_thumb_filter_cb = function ($value, $object_id, $meta_key, $single) use ($_captured_pid, $_captured_tid) {
										if ((int) $object_id === $_captured_pid && $meta_key === '_thumbnail_id') {
											return $_captured_tid;
										}
										return $value;
									};
									add_filter('get_post_metadata', $projects_thumb_filter_cb, 10, 4);
								}
							}

							// get_post_image_url всегда возвращает URL (либо изображение, либо placeholder)
							$image_url = get_post_image_url($post, $image_size);

							$slide_class = 'swiper-slide';
							if ($template === 'client-simple') {
								$slide_class .= ' px-5';
							}
							// Add swiper-slide class from Settings tab
							if (!empty($swiper_slide_class)) {
								$slide_class .= ' ' . esc_attr($swiper_slide_class);
							}
							?>
							<?php
							$item_html = render_post_grid_item($post, $attributes, $image_url, $image_size, $grid_type, $col_classes, true);
							if ($projects_thumb_filter_cb) {
								remove_filter('get_post_metadata', $projects_thumb_filter_cb, 10);
							}
							if (!empty($item_html) && trim($item_html) !== '') :
							?>
							<div class="<?php echo esc_attr($slide_class); ?>">
								<?php echo $item_html; ?>
							</div>
							<?php endif; ?>
						<?php endforeach; wp_reset_postdata(); ?>
					</div>
				</div>
			</div>
		<?php else : ?>
			<div class="cwgb-load-more-items <?php echo esc_attr($grid_classes); ?>">
				<?php foreach ($posts_to_show as $post) : setup_postdata($post); ?>
					<?php
					// Projects: override thumbnail через первое подходящее из _project_gallery.
					$projects_override_thumb_id = null;
					$projects_thumb_filter_cb = null;
					if ($projects_filter_image_tag > 0) {
						$projects_override_thumb_id = cwgb_projects_find_image_by_tag($post->ID, $projects_filter_image_tag);
						if ($projects_override_thumb_id) {
							$_captured_pid = (int) $post->ID;
							$_captured_tid = (int) $projects_override_thumb_id;
							$projects_thumb_filter_cb = function ($value, $object_id, $meta_key, $single) use ($_captured_pid, $_captured_tid) {
								if ((int) $object_id === $_captured_pid && $meta_key === '_thumbnail_id') {
									return $_captured_tid;
								}
								return $value;
							};
							add_filter('get_post_metadata', $projects_thumb_filter_cb, 10, 4);
						}
					}

					// get_post_image_url всегда возвращает URL (либо изображение, либо placeholder)
					$image_url = get_post_image_url($post, $image_size);

					$item_html = render_post_grid_item($post, $attributes, $image_url, $image_size, $grid_type, $col_classes);

					if ($projects_thumb_filter_cb) {
						remove_filter('get_post_metadata', $projects_thumb_filter_cb, 10);
					}

					if (!empty($item_html) && trim($item_html) !== '') {
						echo $item_html;
					}
					?>
				<?php endforeach; wp_reset_postdata(); ?>
			</div>
			
			<?php if ($load_more_enable && $has_more) : 
				// Получаем переведенный текст для Loading
				$loading_text = __('Loading...', 'codeweber-gutenberg-blocks');
				
				// Получаем класс скругления кнопки из темы
				$button_radius_class = class_exists('Codeweber_Options') ? Codeweber_Options::style('button') : '';
				
				// Строим класс кнопки
				$button_classes = ['btn', 'cwgb-load-more-btn'];
				
				// Добавляем стиль кнопки (solid или outline)
				if ($load_more_button_style === 'outline') {
					$button_classes[] = 'btn-outline-primary';
				} else {
					$button_classes[] = 'btn-primary';
				}
				
				// Добавляем размер кнопки
				if (!empty($load_more_button_size)) {
					$button_classes[] = esc_attr($load_more_button_size);
				}
				
				// Добавляем класс скругления из темы
				if (!empty($button_radius_class)) {
					$button_classes[] = esc_attr(trim($button_radius_class));
				}
				
				$button_class_string = implode(' ', $button_classes);
			?>
				<div class="text-center mt-5">
					<?php if ($load_more_type === 'link') : ?>
						<a href="#" class="hover cwgb-load-more-btn" data-load-more="true" data-loading-text="<?php echo esc_attr($loading_text); ?>">
							<?php echo esc_html($load_more_text); ?>
						</a>
					<?php else : ?>
						<button class="<?php echo esc_attr($button_class_string); ?>" type="button" data-loading-text="<?php echo esc_attr($loading_text); ?>">
							<?php echo esc_html($load_more_text); ?>
						</button>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		<?php endif; ?>
	<?php elseif (!$manual_items_mode) : ?>
		<p><?php esc_html_e('No posts found.', 'codeweber-gutenberg-blocks'); ?></p>
	<?php endif; ?>
	</div><!-- /.cwgb-post-grid-results -->
</div>
<?php
// Register Schema.org data for the theme's SEO module.
if ( ! empty( $posts_to_show ) && function_exists( 'codeweber_schema_add_block_data' ) && function_exists( 'codeweber_schema_type_for_post_type' ) ) {
	$schema_type = codeweber_schema_type_for_post_type( $post_type );

	if ( $schema_type && $post_type === 'faq' ) {
		// FAQPage for FAQ posts.
		$schema_items = [];
		foreach ( $posts_to_show as $p ) {
			$schema_items[] = [
				'title'   => get_the_title( $p ),
				'content' => $p->post_content,
			];
		}
		codeweber_schema_add_block_data( 'faq', $schema_items );
	} elseif ( $schema_type ) {
		// ItemList for other CPTs.
		$list_items = [];
		foreach ( $posts_to_show as $p ) {
			$list_items[] = [
				'title' => get_the_title( $p ),
				'url'   => get_permalink( $p ),
			];
		}
		codeweber_schema_add_block_data( 'itemlist', [
			'schema_type' => $schema_type,
			'items'       => $list_items,
		] );
	}
}
?>
