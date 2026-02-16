<?php
/**
 * Navbar Block - Server-side render
 *
 * Standalone templates (no Redux). Logo from theme only.
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

$navbar_type = isset($attributes['navbarType']) ? $attributes['navbarType'] : 'navbar-1';

$model_map = [
	'navbar-1' => '1',
	'navbar-2' => '2',
	'navbar-3' => '3',
	'navbar-4' => '4',
	'navbar-5' => '5',
	'navbar-6' => '6',
	'navbar-7' => '7',
	'navbar-8' => '8',
];

$header_model = isset($model_map[$navbar_type]) ? $model_map[$navbar_type] : '1';

$template_map = [
	'1' => 'classic',
	'2' => 'classic',
	'3' => 'center-logo',
	'4' => 'fancy',
	'5' => 'fancy',
	'6' => 'fancy-center-logo',
	'7' => 'extended',
	'8' => 'extended-center-logo',
];

$template_slug = isset($template_map[$header_model]) ? $template_map[$header_model] : 'classic';

// Attributes with fallbacks
$menu_loc_attr  = isset($attributes['menuLocation']) ? $attributes['menuLocation'] : '';
$menu_loc1_attr = isset($attributes['menuLocationRight']) ? $attributes['menuLocationRight'] : '';
$menu_depth     = isset($attributes['menuDepth']) ? absint($attributes['menuDepth']) : 4;
$home_link_attr = isset($attributes['homeLink']) ? trim($attributes['homeLink']) : '';
$navbar_color   = isset($attributes['navbarColor']) && in_array($attributes['navbarColor'], ['light', 'dark'], true)
	? $attributes['navbarColor'] : 'light';
$logo_color_attr    = isset($attributes['logoColor']) ? $attributes['logoColor'] : 'auto';
$center_bar_attr    = isset($attributes['centerBarTheme']) ? $attributes['centerBarTheme'] : 'auto';
$offcanvas_theme = isset($attributes['mobileOffcanvasTheme']) && in_array($attributes['mobileOffcanvasTheme'], ['light', 'dark'], true)
	? $attributes['mobileOffcanvasTheme'] : 'light';
$sticky_navbar   = !empty($attributes['stickyNavbar']);
$transparent_on_top = !empty($attributes['transparentOnTop']);
$wrapper_class_attr = isset($attributes['wrapperClass']) ? trim($attributes['wrapperClass']) : '';
$nav_class_attr    = isset($attributes['navClass']) ? trim($attributes['navClass']) : '';
$block_class_attr  = isset($attributes['blockClass']) ? trim($attributes['blockClass']) : '';
$block_id_attr     = isset($attributes['blockId']) ? trim($attributes['blockId']) : '';

$home_link = $home_link_attr !== '' ? esc_url($home_link_attr) : home_url('/');
$menu_loc  = $menu_loc_attr !== '' ? $menu_loc_attr : apply_filters('codeweber_navbar_menu_location', 'header_1');
$menu_loc1 = $menu_loc1_attr !== '' ? $menu_loc1_attr : apply_filters('codeweber_navbar_menu_location_right', 'header');

$center_nav = in_array($header_model, ['1', '5'], true);

// Build wrapper classes (header)
$wrapper_classes = ['wrapper'];
if ($wrapper_class_attr) {
	$wrapper_classes[] = $wrapper_class_attr;
}
if ($sticky_navbar) {
	$wrapper_classes[] = 'navbar-sticky';
}
if ($transparent_on_top) {
	$wrapper_classes[] = 'navbar-transparent-on-top';
}
$wrapper_class = implode(' ', $wrapper_classes);

// Nav color classes: navbar-light/dark, navbar-bg-light/dark
$nav_color_class = $navbar_color === 'dark' ? 'navbar-dark navbar-bg-dark' : 'navbar-light navbar-bg-light';
$offcanvas_class = $offcanvas_theme === 'dark' ? 'offcanvas-dark' : 'offcanvas-light';
$nav_class = trim($nav_color_class . ' ' . $nav_class_attr);

// Logo variants for get_custom_logo_type() as in Codeweber theme:
// 'light' = dark logo (for light navbar bg), 'dark' = light logo (for dark navbar bg), 'both' = both logos
$logo_color_effective = in_array($logo_color_attr, ['light', 'dark', 'both'], true) ? $logo_color_attr : 'auto';
if ($logo_color_effective === 'auto') {
	$logo_variant  = $navbar_color === 'dark' ? 'dark' : 'light';
	$logo_mobile   = $offcanvas_theme === 'dark' ? 'dark' : 'light';
} else {
	$logo_variant  = $logo_color_effective;
	$logo_mobile   = $logo_color_effective;
}

// Fancy types (4,5,6): center bar where logo and menu sit - has its own background
$is_fancy = in_array($template_slug, ['fancy', 'fancy-center-logo'], true);
$center_bar_effective = in_array($center_bar_attr, ['light', 'dark'], true) ? $center_bar_attr : $navbar_color;
$navbar_collapse_wrapper_class = '';
if ($is_fancy) {
	if ($center_bar_effective === 'dark') {
		$navbar_collapse_wrapper_class = 'bg-dark navbar-dark';
		// For fancy, logo in center bar follows center bar theme
		if ($logo_color_effective === 'auto') {
			$logo_variant = 'dark'; // light logo on dark bar
		}
	} else {
		$navbar_collapse_wrapper_class = 'bg-light navbar-light';
		if ($logo_color_effective === 'auto') {
			$logo_variant = 'light'; // dark logo on light bar
		}
	}
}

$plugin_dir   = plugin_dir_path(__FILE__);
$template_path = $plugin_dir . 'templates/' . $template_slug . '.php';

// Render inner blocks for navbar-other
// header-widgets outputs <li>...</li> directly; other blocks wrapped in <li class="nav-item">
$render_navbar_inner = function ($blocks) use (&$render_navbar_inner) {
	$html = '';
	if (!is_array($blocks)) {
		return $html;
	}
	foreach ($blocks as $inner_block) {
		$block_name = $inner_block['blockName'] ?? '';
		$block_html = (new \WP_Block($inner_block))->render();
		if (empty($block_html)) {
			continue;
		}
		if ($block_name === 'codeweber-blocks/header-widgets') {
			// header-widgets outputs full <li>...</li> already
			$html .= $block_html;
		} else {
			$item_class = 'nav-item';
			$attrs = $inner_block['attrs'] ?? [];
			if (!empty($attrs['navbarItemClass'])) {
				$item_class .= ' ' . esc_attr($attrs['navbarItemClass']);
			}
			$html .= '<li class="' . $item_class . '">' . $block_html . '</li>';
		}
	}
	return $html;
};
$navbar_other_inner_blocks = $render_navbar_inner($parsed_block['innerBlocks'] ?? []);

// Collect afterNavHtml, search template, and offcanvas-info panel from header-widgets blocks
$after_nav_html_parts = [];
$has_search_enabled = false;
$offcanvas_info_target = '';
$offcanvas_info_element_ids = [];
$offcanvas_info_theme = 'light';
foreach ($parsed_block['innerBlocks'] ?? [] as $inner_block) {
	if (($inner_block['blockName'] ?? '') !== 'codeweber-blocks/header-widgets') {
		continue;
	}
	$items = $inner_block['attrs']['items'] ?? [];
	if (!is_array($items)) {
		continue;
	}
	$valid_types = ['search', 'offcanvas-info', 'custom-offcanvas', 'offcanvas-toggle'];
	foreach ($items as $it) {
		if (!empty($it['enabled']) && ($it['type'] ?? '') === 'search') {
			$has_search_enabled = true;
		}
		// First enabled offcanvas-info: use its config for the panel
		if (empty($offcanvas_info_element_ids) && !empty($it['enabled']) && ($it['type'] ?? '') === 'offcanvas-info') {
			$target = isset($it['offcanvasTarget']) && (string) $it['offcanvasTarget'] !== '' ? trim($it['offcanvasTarget']) : '#offcanvas-info';
			if (strpos($target, '#') === 0) {
				$target = substr($target, 1);
			}
			$offcanvas_info_target = $target;
			$offcanvas_info_theme = isset($it['offcanvasInfoTheme']) && $it['offcanvasInfoTheme'] === 'dark' ? 'dark' : 'light';
			$offcanvas_social_overrides = [];
			if (!empty($it['socialType'])) {
				$offcanvas_social_overrides['social-type'] = $it['socialType'];
			}
			if (!empty($it['socialButtonSize'])) {
				$offcanvas_social_overrides['social-button-size-offcanvas'] = $it['socialButtonSize'];
			}
			if (!empty($it['socialButtonStyle'])) {
				$offcanvas_social_overrides['social-button-style-offcanvas'] = $it['socialButtonStyle'];
			}
			$elements = isset($it['offcanvasElements']) && is_array($it['offcanvasElements']) ? $it['offcanvasElements'] : [];
			foreach ($elements as $el) {
				if (!empty($el['enabled']) && !empty($el['id'])) {
					$offcanvas_info_element_ids[] = $el['id'];
				}
			}
			// Default order if none saved (same as Redux: description, phones, map, socials)
			if (empty($offcanvas_info_element_ids)) {
				$offcanvas_info_element_ids = ['description', 'phones', 'map', 'socials'];
			}
		}
	}
	$enabled = array_filter($items, function ($it) use ($valid_types) {
		if (empty($it['enabled']) || ($it['type'] ?? '') === 'search' || !in_array($it['type'] ?? '', $valid_types, true)) {
			return false;
		}
		$type = $it['type'] ?? '';
		if ($type === 'custom-offcanvas' || $type === 'offcanvas-toggle') {
			return !empty(trim($it['offcanvasHeaderHtml'] ?? '')) || !empty(trim($it['offcanvasBodyHtml'] ?? ''));
		}
		return !empty(trim($it['afterNavHtml'] ?? ''));
	});
	usort($enabled, function ($a, $b) {
		return ($a['order'] ?? 0) - ($b['order'] ?? 0);
	});
	$custom_offcanvas_index = 0;
	foreach ($enabled as $it) {
		$type = $it['type'] ?? '';
		if ($type === 'custom-offcanvas' || $type === 'offcanvas-toggle') {
			$body_html = trim($it['offcanvasBodyHtml'] ?? '');
			$custom_theme = isset($it['customOffcanvasTheme']) && $it['customOffcanvasTheme'] === 'dark' ? 'dark' : 'light';
			$custom_offcanvas_classes = $custom_theme === 'dark' ? 'offcanvas offcanvas-end text-inverse offcanvas-dark' : 'offcanvas offcanvas-end offcanvas-light';
			$custom_btn_close_class = $custom_theme === 'dark' ? 'btn-close btn-close-white' : 'btn-close';
			$inner = '';
			// Всегда выводим offcanvas-header с кнопкой закрытия (контент поля — по желанию)
			$inner .= '<div class="offcanvas-header">' . wp_kses_post($it['offcanvasHeaderHtml'] ?? '') . '<button type="button" class="' . esc_attr($custom_btn_close_class) . '" data-bs-dismiss="offcanvas" aria-label="' . esc_attr__('Close', 'codeweber-gutenberg-blocks') . '"></button></div>';
			if ($body_html !== '') {
				$inner .= '<div class="offcanvas-body">' . wp_kses_post($it['offcanvasBodyHtml']) . '</div>';
			}
			$custom_id = isset($it['customOffcanvasTarget']) && (string) $it['customOffcanvasTarget'] !== '' ? trim($it['customOffcanvasTarget']) : '';
			if (strpos($custom_id, '#') === 0) {
				$custom_id = substr($custom_id, 1);
			}
			if ($custom_id === '') {
				$custom_offcanvas_index++;
				$custom_id = $custom_offcanvas_index === 1 ? 'offcanvas-custom' : 'offcanvas-custom-' . $custom_offcanvas_index;
			}
			$after_nav_html_parts[] = '<div class="' . esc_attr($custom_offcanvas_classes) . '" id="' . esc_attr($custom_id) . '" data-bs-scroll="true">' . $inner . '</div>';
		} else {
			$after_nav_html_parts[] = wp_kses_post($it['afterNavHtml']);
		}
	}
}
// When Search is enabled: prepend offcanvas-search template (theme template, overridable in child)
if ($has_search_enabled) {
	ob_start();
	get_template_part('templates/header/offcanvas-search');
	$search_template = ob_get_clean();
	$after_nav_html = $search_template . implode('', $after_nav_html_parts);
} else {
	$after_nav_html = implode('', $after_nav_html_parts);
}
// Offcanvas Info panel (block-driven, same layout as Redux theme)
if ($offcanvas_info_target !== '' && !empty($offcanvas_info_element_ids)) {
	ob_start();
	$offcanvas_target_id = $offcanvas_info_target;
	$offcanvas_element_ids = $offcanvas_info_element_ids;
	$offcanvas_theme = $offcanvas_info_theme;
	$offcanvas_social_overrides = isset($offcanvas_social_overrides) ? $offcanvas_social_overrides : [];
	require $plugin_dir . 'templates/offcanvas-info-panel.php';
	$after_nav_html .= ob_get_clean();
}

// Variables passed to template
$template_vars = [
	'home_link'                    => $home_link,
	'logo_variant'                 => $logo_variant,
	'logo_mobile'                  => $logo_mobile,
	'menu_loc'                     => $menu_loc,
	'menu_loc1'                    => $menu_loc1,
	'menu_depth'                   => $menu_depth,
	'center_nav'                   => $center_nav,
	'wrapper_class'                => $wrapper_class,
	'nav_class'                    => $nav_class,
	'offcanvas_class'              => $offcanvas_class,
	'navbar_collapse_wrapper_class' => $navbar_collapse_wrapper_class,
	'navbar_other_inner_blocks'    => $navbar_other_inner_blocks,
	'after_nav_html'               => $after_nav_html,
	'for_editor_preview'           => isset($for_editor_preview) ? $for_editor_preview : false,
];

if (file_exists($template_path)) {
	$block_wrapper_attrs = ['class' => 'wp-block-codeweber-blocks-navbar'];
	if ($block_class_attr) {
		$block_wrapper_attrs['class'] .= ' ' . esc_attr($block_class_attr);
	}
	if ($block_id_attr) {
		$block_wrapper_attrs['id'] = esc_attr($block_id_attr);
	}
	$attrs_str = '';
	foreach ($block_wrapper_attrs as $k => $v) {
		$attrs_str .= ' ' . esc_attr($k) . '="' . esc_attr($v) . '"';
	}
	echo '<div' . $attrs_str . '>';
	extract($template_vars, EXTR_SKIP);
	require $template_path;
	echo '</div>';
} else {
	echo '<!-- Navbar block: template not found (' . esc_attr($template_slug) . ') -->';
}
