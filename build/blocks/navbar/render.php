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
$logo_width_attr   = isset($attributes['logoWidth']) ? trim($attributes['logoWidth']) : '';

$home_link = $home_link_attr !== '' ? esc_url($home_link_attr) : home_url('/');
$menu_loc  = $menu_loc_attr !== '' ? $menu_loc_attr : apply_filters('codeweber_navbar_menu_location', 'header_1');
$menu_loc1 = $menu_loc1_attr !== '' ? $menu_loc1_attr : apply_filters('codeweber_navbar_menu_location_right', 'header');

$center_nav = in_array($header_model, ['1', '5'], true);

// Build wrapper classes (header)
$wrapper_classes = ['wrapper'];
$header_bg_attr = isset($attributes['headerBackground']) ? trim($attributes['headerBackground']) : '';
$header_bg_style = isset($attributes['headerBackgroundStyle']) && $attributes['headerBackgroundStyle'] === 'soft' ? 'soft' : 'solid';
$allowed_bg = ['primary', 'dark', 'light', 'yellow', 'orange', 'red', 'pink', 'fuchsia', 'violet', 'purple', 'blue', 'aqua', 'sky', 'green', 'leaf', 'ash', 'navy', 'grape', 'muted', 'white', 'pinterest', 'dewalt', 'facebook', 'telegram', 'frost'];
if ($header_bg_attr !== '' && in_array($header_bg_attr, $allowed_bg, true)) {
	$wrapper_classes[] = $header_bg_style === 'soft' ? 'bg-soft-' . $header_bg_attr : 'bg-' . $header_bg_attr;
}
if ($wrapper_class_attr) {
	$wrapper_classes[] = $wrapper_class_attr;
}
if ($sticky_navbar) {
	$wrapper_classes[] = 'navbar-sticky';
}
if ($block_class_attr) {
	$wrapper_classes[] = $block_class_attr;
}
$wrapper_class = implode(' ', $wrapper_classes);

// Header background class for nav (extended template): bg-* or bg-soft-*
$header_bg_class = '';
if ($header_bg_attr !== '' && in_array($header_bg_attr, $allowed_bg, true)) {
	$header_bg_class = $header_bg_style === 'soft' ? 'bg-soft-' . $header_bg_attr : 'bg-' . $header_bg_attr;
}

// Nav color classes: navbar-light/dark; when transparent on top — no navbar-bg-* (theme uses transparent overlay)
$offcanvas_class = $offcanvas_theme === 'dark' ? 'offcanvas-dark' : 'offcanvas-light';
if ($transparent_on_top) {
	$nav_color_class = $navbar_color === 'dark' ? 'navbar-dark' : 'navbar-light';
} else {
	$nav_color_class = $navbar_color === 'dark' ? 'navbar-dark navbar-bg-dark' : 'navbar-light navbar-bg-light';
}
$nav_class = trim($nav_color_class . ' ' . $nav_class_attr);
if ($transparent_on_top) {
	$nav_class = trim($nav_class . ' transparent position-absolute');
}

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

// Logo wrapper class: default = no class (or w-100 for classic/fancy), or w-1..w-15
$logo_brand_class = 'navbar-brand';
if ($logo_width_attr === '') {
	if (in_array($template_slug, ['classic', 'fancy'], true)) {
		$logo_brand_class .= ' w-100';
	}
} elseif (preg_match('/^w-(1[0-5]|[1-9])$/', $logo_width_attr)) {
	$logo_brand_class .= ' ' . $logo_width_attr;
}

// Custom HTML after logo link: only when enabled and content not empty; then add d-flex to wrapper
$logo_html_enabled = !empty($attributes['logoHtmlEnabled']);
$logo_html_raw     = isset($attributes['logoHtml']) ? trim($attributes['logoHtml']) : '';
$logo_custom_html  = ($logo_html_enabled && $logo_html_raw !== '') ? $logo_html_raw : '';
if ($logo_custom_html !== '') {
	$logo_brand_class .= ' d-flex align-items-center';
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

// Collect afterNavHtml, search template, and Header Widgets offcanvas panels (each has its own logic)
$after_nav_html_parts = [];
$has_search_enabled = false;
/** Configs for Header Widgets Offcanvas Info panels: each item = own target, own element list, own theme (no shared offcanvas with Navbar) */
$header_widgets_offcanvas_panels = [];

// Navbar block: own Mobile Menu list — used only for the navbar mobile offcanvas footer (its own logic)
$mobile_elements_raw = $attributes['mobileMenuElements'] ?? null;
$mobile_elements = [];
if (is_array($mobile_elements_raw)) {
	$mobile_elements = array_values($mobile_elements_raw);
} elseif (is_object($mobile_elements_raw)) {
	$mobile_elements = array_values((array) $mobile_elements_raw);
}
$mobile_ids = [];
foreach ($mobile_elements as $el) {
	$enabled = isset($el['enabled']) ? (bool) $el['enabled'] : false;
	if ($enabled && !empty($el['id'])) {
		$mobile_ids[] = (string) $el['id'];
	}
}
$navbar_mobile_configured = !empty($mobile_elements);

foreach ($parsed_block['innerBlocks'] ?? [] as $inner_block) {
	if (($inner_block['blockName'] ?? '') !== 'codeweber-blocks/header-widgets') {
		continue;
	}
	$items = $inner_block['attrs']['items'] ?? [];
	if (!is_array($items)) {
		continue;
	}
	$valid_types = ['search', 'offcanvas-info', 'custom-offcanvas', 'offcanvas-toggle'];
	// Collect Header Widgets Offcanvas Info panels (each with its own target and element list)
	foreach ($items as $it) {
		if (!empty($it['enabled']) && ($it['type'] ?? '') === 'search') {
			$has_search_enabled = true;
		}
		if (!empty($it['enabled']) && ($it['type'] ?? '') === 'offcanvas-info') {
			$target = isset($it['offcanvasTarget']) && (string) $it['offcanvasTarget'] !== '' ? trim($it['offcanvasTarget']) : '#offcanvas-info';
			if (strpos($target, '#') === 0) {
				$target = substr($target, 1);
			}
			$panel_theme = isset($it['offcanvasInfoTheme']) && $it['offcanvasInfoTheme'] === 'dark' ? 'dark' : 'light';
			$panel_social = [];
			if (!empty($it['socialType'])) {
				$panel_social['social-type'] = $it['socialType'];
			}
			if (!empty($it['socialButtonSize'])) {
				$panel_social['social-button-size-offcanvas'] = $it['socialButtonSize'];
			}
			if (!empty($it['socialButtonStyle'])) {
				$panel_social['social-button-style-offcanvas'] = $it['socialButtonStyle'];
			}
			$elements_raw = $it['offcanvasElements'] ?? null;
			$elements = is_array($elements_raw) ? array_values($elements_raw) : [];
			$panel_ids = [];
			foreach ($elements as $el) {
				$enabled_el = isset($el['enabled']) ? (bool) $el['enabled'] : false;
				if ($enabled_el && !empty($el['id'])) {
					$panel_ids[] = (string) $el['id'];
				}
			}
			if (empty($panel_ids)) {
				$panel_ids = ['description', 'phones', 'email', 'map', 'socials'];
			}
			$employee_staff_ids = isset($it['offcanvasEmployeeStaffIds']) && is_array($it['offcanvasEmployeeStaffIds'])
				? array_map('intval', array_filter($it['offcanvasEmployeeStaffIds']))
				: [];
			$employee_show_department = !empty($it['offcanvasEmployeeShowDepartment']);
			$header_widgets_offcanvas_panels[] = [
				'target_id' => $target,
				'theme'     => $panel_theme,
				'element_ids' => $panel_ids,
				'social_overrides' => $panel_social,
				'employee_staff_ids' => $employee_staff_ids,
				'employee_show_department' => $employee_show_department,
			];
		}
	}
	$enabled = array_filter($items, function ($it) use ($valid_types) {
		$it_enabled = isset($it['enabled']) ? (bool) $it['enabled'] : false;
		if (!$it_enabled || ($it['type'] ?? '') === 'search' || !in_array($it['type'] ?? '', $valid_types, true)) {
			return false;
		}
		$type = $it['type'] ?? '';
		if ($type === 'custom-offcanvas' || $type === 'offcanvas-toggle') {
			return !empty(trim($it['offcanvasHeaderHtml'] ?? '')) || !empty(trim($it['offcanvasBodyHtml'] ?? ''));
		}
		// offcanvas-info: include if enabled (toggle can be generated; panel content from $offcanvas_info_*)
		if ($type === 'offcanvas-info') {
			return true;
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
			$after_nav_html_parts[] = wp_kses_post($it['afterNavHtml'] ?? '');
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

// 1) Navbar: own offcanvas footer content — only from Navbar Mobile Menu list (its own logic)
$offcanvas_info_in_nav_html = '';
if ($navbar_mobile_configured && !empty($mobile_ids)) {
	ob_start();
	$offcanvas_target_id = 'offcanvas-info';
	$offcanvas_element_ids = $mobile_ids;
	$offcanvas_theme = isset($attributes['mobileMenuOffcanvasTheme']) && $attributes['mobileMenuOffcanvasTheme'] === 'dark' ? 'dark' : 'light';
	$offcanvas_social_overrides = [];
	if (!empty($attributes['mobileMenuSocialType'])) {
		$offcanvas_social_overrides['social-type'] = $attributes['mobileMenuSocialType'];
	}
	if (!empty($attributes['mobileMenuSocialSize'])) {
		$offcanvas_social_overrides['social-button-size-offcanvas'] = $attributes['mobileMenuSocialSize'];
	}
	if (!empty($attributes['mobileMenuSocialStyle'])) {
		$offcanvas_social_overrides['social-button-style-offcanvas'] = $attributes['mobileMenuSocialStyle'];
	}
	require $plugin_dir . 'templates/offcanvas-info-simple.php';
	$offcanvas_info_in_nav_html = ob_get_clean();
}

// 2) Header Widgets: own offcanvas panel(s) — each Offcanvas Info item has its own target and element list (its own logic)
foreach ($header_widgets_offcanvas_panels as $panel) {
	ob_start();
	$offcanvas_target_id = $panel['target_id'];
	$offcanvas_element_ids = $panel['element_ids'];
	$offcanvas_theme = $panel['theme'];
	$offcanvas_social_overrides = isset($panel['social_overrides']) ? $panel['social_overrides'] : [];
	$offcanvas_employee_staff_ids = isset($panel['employee_staff_ids']) && is_array($panel['employee_staff_ids']) ? $panel['employee_staff_ids'] : [];
	$offcanvas_employee_show_department = !empty($panel['employee_show_department']);
	require $plugin_dir . 'templates/offcanvas-info-panel.php';
	$after_nav_html .= ob_get_clean();
}

// Extended (7,8): second row bar class (theme uses bg-white / bg-dark)
$extended_bar_class = '';
if (in_array($template_slug, ['extended', 'extended-center-logo'], true)) {
	$extended_bar_class = ($navbar_color === 'dark') ? 'bg-dark' : 'bg-white';
}

// Social icons from Redux (theme settings): same as Social Icons block (default true when attr missing, e.g. old saved blocks)
$navbar_social_html = '';
$social_from_theme = isset($attributes['socialFromTheme']) ? (bool) $attributes['socialFromTheme'] : true;
if ($social_from_theme && class_exists('Codeweber\Blocks\Plugin')) {
	$social_style   = isset($attributes['socialStyleType']) && is_string($attributes['socialStyleType']) ? $attributes['socialStyleType'] : 'type2';
	$social_size    = isset($attributes['socialSize']) && is_string($attributes['socialSize']) ? $attributes['socialSize'] : 'sm';
	$social_color   = isset($attributes['socialButtonColor']) && is_string($attributes['socialButtonColor']) ? $attributes['socialButtonColor'] : 'primary';
	$social_bs      = isset($attributes['socialButtonStyle']) && $attributes['socialButtonStyle'] === 'outline' ? 'outline' : 'solid';
	$social_form    = isset($attributes['socialButtonForm']) && $attributes['socialButtonForm'] === 'block' ? 'block' : 'circle';
	$social_nav_cl  = isset($attributes['socialNavClass']) && trim((string) $attributes['socialNavClass']) !== '' ? trim((string) $attributes['socialNavClass']) : 'justify-content-end text-end';
	// Extended center logo (navbar-8): no justify/text-end on social nav, match theme sample
	if ($template_slug === 'extended-center-logo') {
		$social_nav_cl = '';
	}
	$social_slugs   = isset($attributes['socialThemeEnabledSlugs']) && is_array($attributes['socialThemeEnabledSlugs']) ? $attributes['socialThemeEnabledSlugs'] : [];
	$navbar_social_html = \Codeweber\Blocks\Plugin::render_social_from_theme($social_style, $social_size, $social_color, $social_bs, $social_form, $social_nav_cl, $social_slugs);
}

// Variables passed to template
$template_vars = [
	'home_link'                    => $home_link,
	'logo_variant'                 => $logo_variant,
	'logo_mobile'                  => $logo_mobile,
	'logo_brand_class'              => $logo_brand_class,
	'logo_custom_html'              => $logo_custom_html,
	'menu_loc'                     => $menu_loc,
	'menu_loc1'                    => $menu_loc1,
	'menu_depth'                   => $menu_depth,
	'center_nav'                   => $center_nav,
	'wrapper_class'                => $wrapper_class,
	'header_bg_class'              => $header_bg_class,
	'nav_class'                    => $nav_class,
	'offcanvas_class'              => $offcanvas_class,
	'navbar_collapse_wrapper_class' => $navbar_collapse_wrapper_class,
	'extended_bar_class'           => $extended_bar_class,
	'navbar_other_inner_blocks'    => $navbar_other_inner_blocks,
	'navbar_social_html'           => $navbar_social_html,
	'after_nav_html'               => $after_nav_html,
	'offcanvas_info_in_nav_html'    => $offcanvas_info_in_nav_html,
	'for_editor_preview'           => isset($for_editor_preview) ? $for_editor_preview : false,
	'block_id_attr'                => $block_id_attr,
];

if (file_exists($template_path)) {
	extract($template_vars, EXTR_SKIP);
	require $template_path;
} else {
	echo '<!-- Navbar block: template not found (' . esc_attr($template_slug) . ') -->';
}
