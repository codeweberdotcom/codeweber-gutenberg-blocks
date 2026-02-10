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
foreach ($enabled as $item) {
	$type = $item['type'] ?? '';
	$item_class = 'nav-item';
	if (!empty($item['navbarItemClass'])) {
		$item_class .= ' ' . esc_attr($item['navbarItemClass']);
	}

	if (in_array($type, ['search', 'offcanvas-info', 'custom-offcanvas', 'offcanvas-toggle'], true)) {
		$icon_class = $item['iconClass'] ?? ($type === 'search' ? 'uil uil-search' : 'uil uil-info-circle');
		$target = $item['offcanvasTarget'] ?? ($type === 'search' ? '#offcanvas-search' : '#offcanvas-info');
		if (strpos($target, '#') !== 0) {
			$target = '#' . $target;
		}
		$aria_label = !empty($item['ariaLabel']) ? $item['ariaLabel'] : ($type === 'search' ? __('Search', 'codeweber-gutenberg-blocks') : __('Toggle info', 'codeweber-gutenberg-blocks'));
		$link = '<a class="nav-link" href="#" data-bs-toggle="offcanvas" data-bs-target="' . esc_attr($target) . '" aria-label="' . esc_attr($aria_label) . '"><i class="' . esc_attr($icon_class) . '"></i></a>';
		$html .= '<li class="' . $item_class . '">' . $link . '</li>';
	}
}

echo $html;
