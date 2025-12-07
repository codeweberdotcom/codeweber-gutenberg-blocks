<?php
/**
 * Load More API
 * 
 * Provides REST API endpoint for AJAX-based content loading
 * 
 * @package CodeWeber Gutenberg Blocks
 */

namespace Codeweber\Blocks;

class LoadMoreAPI {
	public function __construct() {
		add_action('rest_api_init', [$this, 'register_routes']);
	}

	public function register_routes() {
		// Load More endpoint
		register_rest_route('codeweber-gutenberg-blocks/v1', '/load-more', [
			'methods' => 'POST',
			'callback' => [$this, 'load_more_items'],
			'permission_callback' => '__return_true',
			'args' => [
				'block_id' => [
					'required' => true,
					'sanitize_callback' => 'sanitize_text_field'
				],
				'block_type' => [
					'required' => false,
					'sanitize_callback' => 'sanitize_text_field'
				],
				'block_attributes' => [
					'required' => false,
					'sanitize_callback' => 'sanitize_text_field'
				],
				'offset' => [
					'required' => true,
					'sanitize_callback' => 'absint'
				],
				'count' => [
					'required' => true,
					'sanitize_callback' => 'absint'
				],
				'post_id' => [
					'required' => false,
					'sanitize_callback' => 'absint'
				]
			]
		]);
	}

	/**
	 * Load more items via AJAX
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function load_more_items($request) {
		$block_id = $request->get_param('block_id');
		$block_type = $request->get_param('block_type');
		$offset = $request->get_param('offset');
		$count = $request->get_param('count');
		$post_id = $request->get_param('post_id');
		$block_attributes_json = $request->get_param('block_attributes');

		// Логирование для отладки
		error_log('LoadMoreAPI: block_id=' . $block_id . ', block_type=' . $block_type . ', offset=' . $offset . ', count=' . $count);
		error_log('LoadMoreAPI: block_attributes_json length=' . strlen($block_attributes_json));

		if (!$block_id) {
			return new \WP_Error('missing_block_id', 'Block ID is required', ['status' => 400]);
		}

		// Если это блок Image Simple
		if ($block_type === 'image-simple' && $block_attributes_json) {
			$result = $this->load_more_image_simple($block_attributes_json, $offset, $count);
			// Возвращаем как WP_REST_Response с правильной структурой
			return new \WP_REST_Response([
				'success' => $result['success'] ?? true,
				'data' => $result['data'] ?? $result
			], 200);
		}
		
		// Если это блок Post Grid
		if ($block_type === 'post-grid' && $block_attributes_json) {
			$result = $this->load_more_post_grid($block_attributes_json, $offset, $count);
			// Возвращаем как WP_REST_Response с правильной структурой
			return new \WP_REST_Response([
				'success' => $result['success'] ?? true,
				'data' => $result['data'] ?? $result
			], 200);
		}
		
		// Для других типов блоков - заглушка
		$response = [
			'success' => true,
			'data' => [
				'html' => '',
				'has_more' => false,
				'offset' => $offset + $count
			]
		];
		return new \WP_REST_Response($response, 200);
	}

	/**
	 * Load more images for Image Simple block
	 * 
	 * @param string $block_attributes_json JSON string with block attributes
	 * @param int $offset Current offset
	 * @param int $count Number of items to load
	 * @return array
	 */
	private function load_more_image_simple($block_attributes_json, $offset, $count) {
		// block_attributes_json приходит как строка JSON из JavaScript
		// Может быть уже закодирован в URL или нет, в зависимости от того, как передается
		$attributes = null;
		
		// Пробуем декодировать как обычный JSON
		$attributes = json_decode($block_attributes_json, true);
		
		// Если не удалось, пробуем с urldecode
		if (!$attributes || json_last_error() !== JSON_ERROR_NONE) {
			$decoded = urldecode($block_attributes_json);
			$attributes = json_decode($decoded, true);
		}
		
		// Если все еще не удалось, пробуем stripslashes (на случай экранирования)
		if (!$attributes || json_last_error() !== JSON_ERROR_NONE) {
			$attributes = json_decode(stripslashes($block_attributes_json), true);
		}
		
		error_log('LoadMoreAPI: JSON decode error - ' . json_last_error_msg());
		error_log('LoadMoreAPI: Decoded attributes - ' . (is_array($attributes) ? 'OK, images count: ' . (isset($attributes['images']) ? count($attributes['images']) : 0) : 'FAILED'));
		
		if (!$attributes || !isset($attributes['images']) || !is_array($attributes['images'])) {
			error_log('LoadMoreAPI: Invalid attributes or no images. Attributes type: ' . gettype($attributes));
			return [
				'success' => false,
				'message' => 'Invalid block attributes or no images found. JSON error: ' . json_last_error_msg(),
				'data' => [
					'html' => '',
					'has_more' => false,
					'offset' => $offset
				]
			];
		}

		$images = $attributes['images'];
		$total_images = count($images);
		
		// Получаем срез изображений
		$items_to_load = array_slice($images, $offset, $count);
		$has_more = ($offset + $count) < $total_images;
		
		// Генерируем HTML для новых изображений
		$html = '';
		$grid_type = $attributes['gridType'] ?? 'classic';
		
		// Генерируем классы col-* для Classic Grid
		$col_classes = '';
		if ($grid_type === 'classic') {
			$col_classes_array = [];
			if (!empty($attributes['gridColumns'])) {
				$col_classes_array[] = 'col-' . esc_attr($attributes['gridColumns']);
			}
			if (!empty($attributes['gridColumnsXs'])) {
				$col_classes_array[] = 'col-' . esc_attr($attributes['gridColumnsXs']);
			}
			if (!empty($attributes['gridColumnsSm'])) {
				$col_classes_array[] = 'col-sm-' . esc_attr($attributes['gridColumnsSm']);
			}
			if (!empty($attributes['gridColumnsMd'])) {
				$col_classes_array[] = 'col-md-' . esc_attr($attributes['gridColumnsMd']);
			}
			if (!empty($attributes['gridColumnsLg'])) {
				$col_classes_array[] = 'col-lg-' . esc_attr($attributes['gridColumnsLg']);
			}
			if (!empty($attributes['gridColumnsXl'])) {
				$col_classes_array[] = 'col-xl-' . esc_attr($attributes['gridColumnsXl']);
			}
			if (!empty($attributes['gridColumnsXxl'])) {
				$col_classes_array[] = 'col-xxl-' . esc_attr($attributes['gridColumnsXxl']);
			}
			$col_classes = implode(' ', $col_classes_array);
		}
		
		foreach ($items_to_load as $index => $image) {
			$wrapper_class = $grid_type === 'classic' ? $col_classes : '';
			$html .= '<div' . ($wrapper_class ? ' class="' . esc_attr($wrapper_class) . '"' : '') . '>';
			$html .= $this->render_image_simple_item($image, $attributes);
			$html .= '</div>';
		}
		
		return [
			'success' => true,
			'data' => [
				'html' => $html,
				'has_more' => $has_more,
				'offset' => $offset + count($items_to_load)
			]
		];
	}

	/**
	 * Render single image item for Image Simple block
	 * 
	 * @param array $image Image data
	 * @param array $attributes Block attributes
	 * @return string HTML
	 */
	private function render_image_simple_item($image, $attributes) {
		if (empty($image['url'])) {
			return '';
		}

		$image_size = $attributes['imageSize'] ?? 'full';
		$image_url = $this->get_image_url($image, $image_size);
		$image_alt = esc_attr($image['alt'] ?? '');
		
		$border_radius = $attributes['borderRadius'] ?? 'rounded';
		$enable_lightbox = $attributes['enableLightbox'] ?? true;
		$lightbox_gallery = $attributes['lightboxGallery'] ?? 'gallery-1';
		$effect_type = $attributes['effectType'] ?? 'none';
		
		// Получаем классы hover эффектов
		$hover_classes = $this->get_image_hover_classes($attributes);
		$figure_classes = trim($hover_classes . ' ' . $border_radius);
		
		// Lightbox атрибуты согласно документации Sandbox
		// Правильный формат: <a href="#" data-glightbox data-gallery="g1">
		$lightbox_attrs = '';
		if ($enable_lightbox) {
			$lightbox_attrs = ' data-glightbox';
			if ($lightbox_gallery) {
				$lightbox_attrs .= ' data-gallery="' . esc_attr($lightbox_gallery) . '"';
			}
		}
		
		// href должен всегда содержать URL изображения для GLightbox
		// Если linkUrl не указан или пустой, используем полный URL изображения (full size)
		$link_url = !empty($image['linkUrl']) && trim($image['linkUrl']) !== '' ? $image['linkUrl'] : '';
		$href = $link_url ? $link_url : $image['url']; // Используем полный URL изображения для lightbox
		
		$html = '<figure class="' . esc_attr($figure_classes) . '">';
		$html .= '<a href="' . esc_url($href) . '"' . $lightbox_attrs . '>';
		$html .= '<img src="' . esc_url($image_url) . '" alt="' . $image_alt . '" />';
		$html .= '</a>';
		
		// Overlay варианты
		if ($effect_type === 'overlay') {
			$overlay_style = $attributes['overlayStyle'] ?? 'overlay-1';
			
			if ($overlay_style === 'overlay-4') {
				$html .= '<figcaption><div class="from-top mb-0 h2"><span class="mt-5">+</span></div></figcaption>';
			} elseif ($overlay_style === 'overlay-2' || $overlay_style === 'overlay-3') {
				$title = $image['title'] ?? $image['caption'] ?? '';
				$description = $image['description'] ?? '';
				if ($title || $description) {
					$from_class = $overlay_style === 'overlay-2' ? 'from-top' : 'from-left';
					$html .= '<figcaption>';
					if ($title) {
						$html .= '<h5 class="' . $from_class . ' mb-1">' . esc_html($title) . '</h5>';
					}
					if ($description) {
						$html .= '<p class="' . ($overlay_style === 'overlay-2' ? 'from-bottom' : 'from-left') . ' mb-0">' . esc_html($description) . '</p>';
					}
					$html .= '</figcaption>';
				}
			} elseif ($image['title'] || $image['caption']) {
				$html .= '<figcaption><h5 class="from-top mb-0">' . esc_html($image['title'] ?? $image['caption']) . '</h5></figcaption>';
			}
		}
		
		// Tooltip
		if ($effect_type === 'tooltip') {
			$tooltip_title = $this->get_tooltip_title($image, $effect_type);
			if ($tooltip_title) {
				$html = str_replace('<figure', '<figure title="' . esc_attr($tooltip_title) . '"', $html);
			}
		}
		
		$html .= '</figure>';
		
		return $html;
	}

	/**
	 * Get image URL for specific size
	 * 
	 * @param array $image Image data
	 * @param string $size Image size
	 * @return string Image URL
	 */
	private function get_image_url($image, $size) {
		if ($size === 'full' || empty($image['sizes'])) {
			return $image['url'];
		}
		
		// Проверяем наличие нужного размера
		if (isset($image['sizes'][$size]['url'])) {
			return $image['sizes'][$size]['url'];
		}
		
		// Fallback на оригинальный URL
		return $image['url'];
	}

	/**
	 * Get hover effect classes
	 * 
	 * @param array $attributes Block attributes
	 * @return string Classes string
	 */
	private function get_image_hover_classes($attributes) {
		$classes = [];
		
		$simple_effect = $attributes['simpleEffect'] ?? 'none';
		$effect_type = $attributes['effectType'] ?? 'none';
		$tooltip_style = $attributes['tooltipStyle'] ?? '';
		$overlay_style = $attributes['overlayStyle'] ?? '';
		$overlay_gradient = $attributes['overlayGradient'] ?? '';
		$overlay_color = $attributes['overlayColor'] ?? false;
		$cursor_style = $attributes['cursorStyle'] ?? '';
		
		if ($simple_effect !== 'none') {
			$classes[] = $simple_effect;
		}
		
		if ($effect_type === 'tooltip' && $tooltip_style) {
			$classes[] = $tooltip_style;
		}
		
		if ($effect_type === 'overlay') {
			// Добавляем базовый класс overlay (как в JavaScript версии)
			$classes[] = 'overlay';
			
			if ($overlay_style) {
				$classes[] = $overlay_style;
			}
			
			// Overlay-2 with color
			if ($overlay_style === 'overlay-2' && $overlay_color) {
				$classes[] = 'color';
			}
			
			// Overlay-3 with gradient
			if ($overlay_style === 'overlay-3' && $overlay_gradient) {
				$classes[] = 'overlay-' . $overlay_gradient;
			}
		}
		
		if ($effect_type === 'cursor' && $cursor_style) {
			$classes[] = $cursor_style;
		}
		
		return implode(' ', $classes);
	}

	/**
	 * Get tooltip title
	 * 
	 * @param array $image Image data
	 * @param string $effect_type Effect type
	 * @return string Tooltip title
	 */
	private function get_tooltip_title($image, $effect_type) {
		if ($effect_type !== 'tooltip') {
			return '';
		}
		
		return $image['title'] ?? $image['caption'] ?? $image['alt'] ?? '';
	}

	/**
	 * Load more posts for Post Grid block
	 * 
	 * @param string $block_attributes_json JSON string with block attributes
	 * @param int $offset Current offset
	 * @param int $count Number of items to load
	 * @return array
	 */
	private function load_more_post_grid($block_attributes_json, $offset, $count) {
		// Декодируем атрибуты
		$attributes = json_decode($block_attributes_json, true);
		
		// Если не удалось, пробуем с urldecode
		if (!$attributes || json_last_error() !== JSON_ERROR_NONE) {
			$decoded = urldecode($block_attributes_json);
			$attributes = json_decode($decoded, true);
		}
		
		// Если все еще не удалось, пробуем stripslashes
		if (!$attributes || json_last_error() !== JSON_ERROR_NONE) {
			$attributes = json_decode(stripslashes($block_attributes_json), true);
		}
		
		if (!$attributes) {
			error_log('LoadMoreAPI Post Grid: Invalid attributes. JSON error: ' . json_last_error_msg());
			return [
				'success' => false,
				'message' => 'Invalid block attributes. JSON error: ' . json_last_error_msg(),
				'data' => [
					'html' => '',
					'has_more' => false,
					'offset' => $offset
				]
			];
		}

		// Получаем параметры запроса
		$post_type = $attributes['postType'] ?? 'post';
		$posts_per_page = isset($attributes['postsPerPage']) ? (int) $attributes['postsPerPage'] : 6;
		$order_by = $attributes['orderBy'] ?? 'date';
		$order = $attributes['order'] ?? 'desc';
		$image_size = $attributes['imageSize'] ?? 'full';
		$grid_type = $attributes['gridType'] ?? 'classic';
		$border_radius = $attributes['borderRadius'] ?? 'rounded';
		$effect_type = $attributes['effectType'] ?? 'none';
		$overlay_style = $attributes['overlayStyle'] ?? 'overlay-1';
		$selected_taxonomies = $attributes['selectedTaxonomies'] ?? [];

		// Запрос постов
		$args = array(
			'post_type' => $post_type,
			'posts_per_page' => $posts_per_page,
			'post_status' => 'publish',
			'orderby' => $order_by,
			'order' => $order,
			'offset' => $offset,
		);

		// Добавляем фильтрацию по таксономиям, если выбраны термины
		if (!empty($selected_taxonomies) && is_array($selected_taxonomies)) {
			$tax_query = array('relation' => 'AND');
			
			foreach ($selected_taxonomies as $taxonomy_slug => $term_ids) {
				if (!empty($term_ids) && is_array($term_ids)) {
					$tax_query[] = array(
						'taxonomy' => $taxonomy_slug,
						'field' => 'term_id',
						'terms' => array_map('intval', $term_ids),
						'operator' => 'IN',
					);
				}
			}
			
			if (count($tax_query) > 1) { // Если есть хотя бы одна таксономия с терминами
				$args['tax_query'] = $tax_query;
			}
		}

		$query = new \WP_Query($args);
		
		if (!$query->have_posts()) {
			return [
				'success' => true,
				'data' => [
					'html' => '',
					'has_more' => false,
					'offset' => $offset
				]
			];
		}

		// Генерируем классы
		$grid_classes = $this->get_post_grid_container_classes($attributes, $grid_type);
		$col_classes = $this->get_post_grid_col_classes($attributes, $grid_type);
		$hover_classes = $this->get_post_hover_classes($attributes);
		
		// Генерируем HTML используя функцию render_post_grid_item из render.php
		$html = '';
		foreach ($query->posts as $post) {
			setup_postdata($post);
			
			$image_url = $this->get_post_image_url($post, $image_size);
			if (!$image_url) {
				continue;
			}
			
			// Используем ту же логику рендеринга, что и в render.php
			$html .= $this->render_post_grid_item_ajax($post, $attributes, $image_url, $image_size, $grid_type, $col_classes);
		}
		wp_reset_postdata();

		$has_more = ($offset + count($query->posts)) < $query->found_posts;

		return [
			'success' => true,
			'data' => [
				'html' => $html,
				'has_more' => $has_more,
				'offset' => $offset + count($query->posts)
			]
		];
	}

	/**
	 * Get post grid container classes
	 */
	private function get_post_grid_container_classes($attributes, $grid_type) {
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

	/**
	 * Get post grid col classes
	 */
	private function get_post_grid_col_classes($attributes, $grid_type) {
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

	/**
	 * Get post hover classes
	 */
	private function get_post_hover_classes($attributes) {
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

	/**
	 * Get post image URL
	 */
	private function get_post_image_url($post, $image_size = 'full') {
		$thumbnail_id = get_post_thumbnail_id($post->ID);
		if (!$thumbnail_id) {
			return '';
		}
		
		$image = wp_get_attachment_image_src($thumbnail_id, $image_size);
		return $image ? $image[0] : '';
	}

	/**
	 * Render post figcaption
	 */
	private function render_post_figcaption($overlay_style, $post_title, $post_excerpt) {
		$html = '';
		
		if ($overlay_style === 'overlay-4') {
			$html = '<figcaption><div class="from-top mb-0 h2"><span class="mt-5">+</span></div></figcaption>';
		} elseif ($overlay_style === 'overlay-2') {
			if ($post_title || $post_excerpt) {
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
				
				$html = '<figcaption>';
				$html .= '<h5 class="from-top mb-1">' . esc_html($title_limited) . '</h5>';
				if ($excerpt_limited) {
					$html .= '<p class="from-bottom mb-0">' . esc_html($excerpt_limited) . '</p>';
				}
				$html .= '</figcaption>';
			}
		} elseif ($overlay_style === 'overlay-3') {
			if ($post_title || $post_excerpt) {
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
				
				$html = '<figcaption>';
				$html .= '<h5 class="from-left mb-1">' . esc_html($title_limited) . '</h5>';
				if ($excerpt_limited) {
					$html .= '<p class="from-left mb-0">' . esc_html($excerpt_limited) . '</p>';
				}
				$html .= '</figcaption>';
			}
		} else {
			if ($post_title) {
				// Ограничиваем заголовок до 56 символов
				$title_limited = strip_tags($post_title);
				$title_limited = str_replace('&nbsp;', ' ', $title_limited);
				$title_limited = trim($title_limited);
				if (mb_strlen($title_limited) > 56) {
					$title_limited = mb_substr($title_limited, 0, 56) . '...';
				}
				$html = '<figcaption><h5 class="from-top mb-0">' . esc_html($title_limited) . '</h5></figcaption>';
			}
		}
		
		return $html;
	}

	/**
	 * Render post grid item for AJAX (same logic as render.php)
	 */
	private function render_post_grid_item_ajax($post, $attributes, $image_url, $image_size, $grid_type, $col_classes, $is_swiper = false) {
		$template = isset($attributes['template']) ? $attributes['template'] : 'default';
		
		// Загружаем новую систему шаблонов из темы, если доступна
		$post_card_templates_path = get_template_directory() . '/functions/post-card-templates.php';
		if (file_exists($post_card_templates_path) && !function_exists('cw_render_post_card')) {
			require_once $post_card_templates_path;
		}
		
		// Используем новую систему шаблонов из темы, если доступна
		if (function_exists('cw_render_post_card')) {
			$post_type = get_post_type($post->ID);
			
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
					'title_tag' => 'h2',
					'title_class' => '',
				];
				
				// Размер изображения по умолчанию для clients
				if ($image_size === 'full' || empty($image_size)) {
					$image_size = 'codeweber_clients_300-200';
				}
				
				$template_args = [
					'image_size' => $image_size,
					'enable_link' => isset($attributes['enableLink']) ? (bool) $attributes['enableLink'] : false,
				];
			} else {
				// Настройки отображения для обычных постов
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
			}
			
			// В режиме Swiper (slider) НИКОГДА не добавляем col-* классы
			$html = cw_render_post_card($post, $template, $display_settings, $template_args);
			// Добавляем обертку с col-* классами только для grid режима (не swiper) и только для classic grid
			// Для client шаблонов также не добавляем col-* в swiper режиме
			if (!$is_swiper && $grid_type === 'classic' && !empty($col_classes)) {
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
		
		$hover_classes = $this->get_post_hover_classes($attributes);
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
			// В режиме Swiper не добавляем col-* классы
			if (!$is_swiper && $grid_type === 'classic' && !empty($col_classes)) {
				$html .= '<div class="' . esc_attr($col_classes) . '">';
			}
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
			// В режиме Swiper не добавляем col-* классы
			if (!$is_swiper && $grid_type === 'classic' && !empty($col_classes)) {
				$html .= '<div class="' . esc_attr($col_classes) . '">';
			}
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
			// В режиме Swiper не закрываем div с col-* классами
			if (!$is_swiper && $grid_type === 'classic' && !empty($col_classes)) {
				$html .= '</div>';
			}
		}
		
		return $html;
	}
}

