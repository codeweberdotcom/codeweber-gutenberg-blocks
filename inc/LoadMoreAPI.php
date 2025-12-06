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
}

