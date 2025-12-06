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
$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'cwgb-post-grid-block cwgb-load-more-container ' . $block_class,
	'id' => $block_id ? esc_attr($block_id) : '',
	'data-block-id' => $block_id,
	'data-block-type' => 'post-grid',
	'data-block-attributes' => esc_attr(json_encode($attributes)),
	'data-current-offset' => $load_more_initial_count,
	'data-load-count' => $load_more_load_more_count,
	'data-post-id' => get_the_ID(),
]);

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

// Helper function to render post item based on template
if (!function_exists('render_post_grid_item')) {
	function render_post_grid_item($post, $attributes, $image_url, $image_size, $grid_type, $col_classes) {
		$template = isset($attributes['template']) ? $attributes['template'] : 'default';
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
		
		if ($template === 'card' || $template === 'card-alt') {
			// Card template
			$html .= '<div class="' . esc_attr($grid_type === 'classic' ? $col_classes : '') . '">';
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
			$html .= '</div>';
		} else {
			// Default template
			$html .= '<div class="' . esc_attr($grid_type === 'classic' ? $col_classes : '') . '">';
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
			$html .= '</div>';
		}
		
		return $html;
	}
}

?>

<div <?php echo $wrapper_attributes; ?>>
	<?php if ($query->have_posts()) : ?>
		<div class="cwgb-load-more-items <?php echo esc_attr($grid_classes); ?>">
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
	<?php else : ?>
		<p><?php esc_html_e('No posts found.', 'codeweber-gutenberg-blocks'); ?></p>
	<?php endif; ?>
</div>

