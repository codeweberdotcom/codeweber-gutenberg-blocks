<?php
/**
 * Header Widgets Block - Render
 * Outputs list of <li class="nav-item"> elements for navbar
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array $attributes Block attributes.
 */

if (!defined('ABSPATH')) {
	exit;
}

$items = isset($attributes['items']) && is_array($attributes['items']) ? $attributes['items'] : [];

// Sort by order, filter enabled, only valid types (offcanvas-toggle = legacy, maps to custom-offcanvas)
$valid_types = ['search', 'offcanvas-info', 'custom-offcanvas', 'offcanvas-toggle'];
$enabled = array_filter($items, function ($it) use ($valid_types) {
	return !empty($it['enabled']) && in_array($it['type'] ?? '', $valid_types, true);
});
usort($enabled, function ($a, $b) {
	return ($a['order'] ?? 0) - ($b['order'] ?? 0);
});

$html = '';
$custom_offcanvas_index = 0;
foreach ($enabled as $item) {
	$type = $item['type'] ?? '';
	$item_class = 'nav-item';
	if (!empty($item['navbarItemClass'])) {
		$item_class .= ' ' . esc_attr($item['navbarItemClass']);
	}

	if ($type === 'search') {
		$search_display = $item['searchDisplayType'] ?? 'offcanvas';
		$icon_class = $item['iconClass'] ?? 'uil uil-search';
		$placeholder = isset($item['placeholder']) && $item['placeholder'] !== '' ? $item['placeholder'] : __('Type keyword', 'codeweber-gutenberg-blocks');
		$posts_per_page = $item['postsPerPage'] ?? '8';
		$post_types = $item['postTypes'] ?? 'post';
		$search_content = $item['searchContent'] ?? 'false';
		$show_excerpt = $item['showExcerpt'] ?? 'false';
		$taxonomy = $item['taxonomy'] ?? '';
		$term = $item['term'] ?? '';
		$include_taxonomies = $item['includeTaxonomies'] ?? 'false';
		$form_id = isset($item['formId']) && $item['formId'] !== '' ? $item['formId'] : 'search-form-hw-' . uniqid('');
		$form_class = $item['formClass'] ?? '';
		$form_wrap = trim('position-relative ' . $form_class);
		$input_id = $form_id . '-input';
		$form_radius = function_exists('getThemeFormRadius') ? getThemeFormRadius() : ' rounded';
		$form_inner = '<div class="' . esc_attr($form_wrap) . '"><form class="search-form" id="' . esc_attr($form_id) . '">'
			. '<input type="text" id="' . esc_attr($input_id) . '" class="search-form form-control' . esc_attr($form_radius) . '" placeholder="' . esc_attr($placeholder) . '" autocomplete="off"'
			. ' data-posts-per-page="' . esc_attr($posts_per_page) . '"'
			. ' data-post-types="' . esc_attr($post_types) . '"'
			. ' data-search-content="' . esc_attr($search_content) . '"'
			. ' data-taxonomy="' . esc_attr($taxonomy) . '"'
			. ' data-term="' . esc_attr($term) . '"'
			. ' data-include-taxonomies="' . esc_attr($include_taxonomies) . '"'
			. ' data-show-excerpt="' . esc_attr($show_excerpt) . '"></form></div>';

		if ($search_display === 'dropdown') {
			$dropdown_min = isset($item['dropdownMinWidth']) && $item['dropdownMinWidth'] !== '' ? $item['dropdownMinWidth'] : '320';
			$dropdown_min = is_numeric($dropdown_min) ? (int) $dropdown_min . 'px' : $dropdown_min;
			$dropdown_block = '<div class="dropdown cwgb-search-block">'
				. '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="' . esc_attr__('Search', 'codeweber-gutenberg-blocks') . '"><i class="' . esc_attr($icon_class) . '"></i></a>'
				. '<div class="dropdown-menu dropdown-menu-end p-0" style="min-width:' . esc_attr($dropdown_min) . ';">' . $form_inner . '</div></div>';
			$html .= '<li class="' . $item_class . '">' . $dropdown_block . '</li>';
		} elseif ($search_display === 'inline') {
			$html .= '<li class="' . $item_class . '"><div class="cwgb-search-block inline">' . $form_inner . '</div></li>';
		} else {
			$aria_label = !empty($item['ariaLabel']) ? $item['ariaLabel'] : __('Search', 'codeweber-gutenberg-blocks');
			$link = '<a class="nav-link" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-search" aria-label="' . esc_attr($aria_label) . '"><i class="' . esc_attr($icon_class) . '"></i></a>';
			$html .= '<li class="' . $item_class . '">' . $link . '</li>';
		}
	} elseif (in_array($type, ['offcanvas-info', 'custom-offcanvas', 'offcanvas-toggle'], true)) {
		$icon_class = $item['iconClass'] ?? 'uil uil-info-circle';
		$aria_label = !empty($item['ariaLabel']) ? $item['ariaLabel'] : __('Toggle info', 'codeweber-gutenberg-blocks');
		// Инфо в оффканвасе → #offcanvas-info; Свой оффканвас → #offcanvas-custom (или offcanvas-custom-2, … при нескольких)
		if (($type === 'custom-offcanvas' || $type === 'offcanvas-toggle')) {
			$target = isset($item['customOffcanvasTarget']) && (string) $item['customOffcanvasTarget'] !== '' ? trim($item['customOffcanvasTarget']) : '';
			if ($target === '') {
				$custom_offcanvas_index++;
				$target = $custom_offcanvas_index === 1 ? 'offcanvas-custom' : 'offcanvas-custom-' . $custom_offcanvas_index;
			}
		} else {
			$target = isset($item['offcanvasTarget']) && (string) $item['offcanvasTarget'] !== '' ? trim($item['offcanvasTarget']) : 'offcanvas-info';
		}
		if (strpos($target, '#') === 0) {
			$target = substr($target, 1);
		}
		$link = '<a class="nav-link" href="#" data-bs-toggle="offcanvas" data-bs-target="#' . esc_attr($target) . '" aria-label="' . esc_attr($aria_label) . '"><i class="' . esc_attr($icon_class) . '"></i></a>';
		$html .= '<li class="' . $item_class . '">' . $link . '</li>';
	}
}

echo $html;
