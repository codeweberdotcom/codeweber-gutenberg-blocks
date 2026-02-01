<?php
/**
 * Social Icons Block - Server-side render
 *
 * Theme mode: uses social_links() from Codeweber theme (get_option('socials_urls')).
 * Custom mode: renders from block attributes (items with icon, url, label).
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array $attributes Block attributes.
 */

if (!defined('ABSPATH')) {
	exit;
}

if (!isset($attributes) || !is_array($attributes)) {
	$attributes = [];
}

$data_source          = isset($attributes['dataSource']) ? $attributes['dataSource'] : 'theme';
$style_type           = isset($attributes['styleType']) ? $attributes['styleType'] : 'type1';
$size                 = isset($attributes['size']) ? $attributes['size'] : 'md';
$button_color         = isset($attributes['buttonColor']) ? $attributes['buttonColor'] : 'primary';
$button_style         = isset($attributes['buttonStyle']) ? $attributes['buttonStyle'] : 'solid';
$button_form          = isset($attributes['buttonForm']) ? $attributes['buttonForm'] : 'circle';
$nav_class            = isset($attributes['navClass']) ? $attributes['navClass'] : '';
$theme_enabled_slugs  = isset($attributes['themeEnabledSlugs']) && is_array($attributes['themeEnabledSlugs']) ? $attributes['themeEnabledSlugs'] : [];
$items                = isset($attributes['items']) ? $attributes['items'] : [];
$block_class  = isset($attributes['blockClass']) ? $attributes['blockClass'] : '';
$block_id     = isset($attributes['blockId']) ? $attributes['blockId'] : '';
$block_data   = isset($attributes['blockData']) ? $attributes['blockData'] : '';

$wrapper_attrs = [];
if ($block_class) {
	$wrapper_attrs['class'] = esc_attr($block_class);
}
if ($block_id) {
	$wrapper_attrs['id'] = esc_attr($block_id);
}
if ($block_data) {
	foreach (array_map('trim', explode(',', $block_data)) as $pair) {
		$eq = strpos($pair, '=');
		if ($eq !== false) {
			$k = trim(substr($pair, 0, $eq));
			$v = trim(substr($pair, $eq + 1));
			if ($k !== '') {
				$wrapper_attrs['data-' . $k] = esc_attr($v);
			}
		}
	}
}

$output = '';

// Theme mode: get socials from theme, optionally filter by themeEnabledSlugs
if ($data_source === 'theme') {
	$socials_raw = get_option('socials_urls');
	if (is_array($socials_raw)) {
		$socials_filtered = $socials_raw;
		if (!empty($theme_enabled_slugs)) {
			$socials_filtered = array_intersect_key($socials_raw, array_flip($theme_enabled_slugs));
		}
		$socials_filtered = array_filter($socials_filtered, function ($u) {
			return $u !== '' && $u !== null;
		});
		if (!empty($socials_filtered)) {
			// Build same HTML as theme social_links() with icon mapping
			$size_classes = [
				'lg' => ['fs-60', 'btn-lg'],
				'md' => ['fs-45', 'btn-md'],
				'sm' => ['', 'btn-sm'],
			];
			$btn_size_class  = isset($size_classes[ $size ][1]) ? $size_classes[ $size ][1] : 'btn-md';
			$btn_form_class  = ($button_form === 'block') ? 'btn-block' : 'btn-circle';
			$nav_class_base  = 'nav social gap-2';
			if ($style_type === 'type2') {
				$nav_class_base .= ' social-muted';
			} elseif ($style_type === 'type4') {
				$nav_class_base .= ' social-white';
			} elseif ($style_type === 'type7') {
				$nav_class_base = 'nav gap-2 social-white';
			}
			if ($nav_class) {
				$nav_class_base .= ' ' . $nav_class;
			}
			if ($style_type === 'type8' || $style_type === 'type9') {
				$nav_class_base = 'nav gap-2' . ($nav_class ? ' ' . $nav_class : '');
			}
			$output = '<nav class="' . esc_attr(trim($nav_class_base)) . '">';
			foreach ($socials_filtered as $social => $url) {
				$original_social = $social;
				switch ($social) {
					case 'telegram':
						$social = 'telegram-alt';
						break;
					case 'rutube':
						$social = 'rutube-1';
						break;
					case 'github':
						$social = 'github-alt';
						break;
					case 'ok':
						$social = 'ok-1';
						break;
					case 'vkmusic':
						$social = 'vk-music';
						break;
					case 'tik-tok':
						$social = 'tiktok';
						break;
					case 'googledrive':
						$social = 'google-drive';
						break;
					case 'googleplay':
						$social = 'google-play';
						break;
					case 'odnoklassniki':
						$social = 'square-odnoklassniki';
						break;
				}
				$icon_class = 'uil uil-' . esc_attr($social);
				$label      = $original_social;
				$btnlabel   = (stripos($label, 'vk') === 0) ? strtoupper(substr($label, 0, 2)) . substr($label, 2) : ucfirst($label);
				if ($style_type === 'type1') {
					$output .= '<a href="' . esc_url($url) . '" class="btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple ' . esc_attr($btn_size_class) . ' btn-' . esc_attr($social) . '" target="_blank" rel="noopener"><i class="' . $icon_class . '"></i></a>';
				} elseif ($style_type === 'type5') {
					$output .= '<a href="' . esc_url($url) . '" class="btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple ' . esc_attr($btn_size_class) . ' btn-dark" target="_blank" rel="noopener"><i class="' . $icon_class . '"></i></a>';
				} elseif ($style_type === 'type2' || $style_type === 'type3' || $style_type === 'type4') {
					$output .= '<a href="' . esc_url($url) . '" class="lh-1 has-ripple" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
				} elseif ($style_type === 'type6') {
					$output .= '<a role="button" href="' . esc_url($url) . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '" class="btn btn-icon btn-sm border btn-icon-start btn-white justify-content-between w-100 fs-16 lh-1 has-ripple"><i class="fs-20 ' . $icon_class . '"></i>' . esc_html($btnlabel) . '</a>';
				} elseif ($style_type === 'type7') {
					$output .= '<a role="button" href="' . esc_url($url) . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '" class="btn btn-icon btn-sm btn-icon-start btn-' . esc_attr($original_social) . ' justify-content-between w-100 lh-1 has-ripple"><i class="fs-20 ' . $icon_class . '"></i>' . esc_html($btnlabel) . '</a>';
				} elseif ($style_type === 'type8') {
					$btn_color = !empty($button_color) ? esc_attr($button_color) : 'primary';
					$btn_style = ($button_style === 'outline') ? 'outline' : 'solid';
					$btn_class = ($btn_style === 'outline') ? 'btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple btn-outline-' . $btn_color . ' ' . esc_attr($btn_size_class) : 'btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple btn-' . $btn_color . ' ' . esc_attr($btn_size_class);
					$output .= '<a href="' . esc_url($url) . '" class="' . $btn_class . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
				} elseif ($style_type === 'type9') {
					$btn_class = 'btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple btn-outline-primary ' . esc_attr($btn_size_class);
					$output .= '<a href="' . esc_url($url) . '" class="' . $btn_class . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
				} else {
					$output .= '<a href="' . esc_url($url) . '" class="lh-1 has-ripple" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
				}
			}
			$output .= '</nav>';
		}
	}
	// Fallback: no filter or empty list — use theme social_links() if available
	if ($output === '' && function_exists('social_links')) {
		$output = social_links($nav_class, $style_type, $size, $button_color, $button_style, $button_form);
	}
}

// Custom mode: render from items
if ($data_source === 'custom' && !empty($items)) {
	$size_classes = [
		'lg' => ['fs-60', 'btn-lg'],
		'md' => ['fs-45', 'btn-md'],
		'sm' => ['', 'btn-sm'],
	];
	$btn_size_class = isset($size_classes[ $size ][1]) ? $size_classes[ $size ][1] : 'btn-md';
	$btn_form_class = ($button_form === 'block') ? 'btn-block' : 'btn-circle';

	$nav_class_base = 'nav social gap-2';
	if ($style_type === 'type2') {
		$nav_class_base .= ' social-muted';
	} elseif ($style_type === 'type4') {
		$nav_class_base .= ' social-white';
	} elseif ($style_type === 'type7') {
		$nav_class_base = 'nav gap-2 social-white';
	}
	if ($nav_class) {
		$nav_class_base .= ' ' . $nav_class;
	}

	if ($style_type === 'type8' || $style_type === 'type9') {
		$nav_class_base = 'nav gap-2' . ($nav_class ? ' ' . $nav_class : '');
	}

	$output = '<nav class="' . esc_attr(trim($nav_class_base)) . '">';

	foreach ($items as $item) {
		if (empty($item) || (!isset($item['url']) && !isset($item['icon']))) {
			continue;
		}
		$url   = isset($item['url']) ? $item['url'] : '#';
		$icon  = isset($item['icon']) ? $item['icon'] : 'link';
		$label = isset($item['label']) ? $item['label'] : $icon;
		$icon_class = 'uil uil-' . esc_attr($icon);
		$btnlabel   = ucfirst($label);

		if ($style_type === 'type1') {
			$output .= '<a href="' . esc_url($url) . '" class="btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple ' . esc_attr($btn_size_class) . ' btn-' . esc_attr($icon) . '" target="_blank" rel="noopener"><i class="' . $icon_class . '"></i></a>';
		} elseif ($style_type === 'type5') {
			$output .= '<a href="' . esc_url($url) . '" class="btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple ' . esc_attr($btn_size_class) . ' btn-dark" target="_blank" rel="noopener"><i class="' . $icon_class . '"></i></a>';
		} elseif ($style_type === 'type2' || $style_type === 'type3' || $style_type === 'type4') {
			$output .= '<a href="' . esc_url($url) . '" class="lh-1 has-ripple" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
		} elseif ($style_type === 'type6') {
			$output .= '<a role="button" href="' . esc_url($url) . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '" class="btn btn-icon btn-sm border btn-icon-start btn-white justify-content-between w-100 fs-16 lh-1 has-ripple"><i class="fs-20 ' . $icon_class . '"></i>' . esc_html($btnlabel) . '</a>';
		} elseif ($style_type === 'type7') {
			$output .= '<a role="button" href="' . esc_url($url) . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '" class="btn btn-icon btn-sm btn-icon-start btn-' . esc_attr($icon) . ' justify-content-between w-100 lh-1 has-ripple"><i class="fs-20 ' . $icon_class . '"></i>' . esc_html($btnlabel) . '</a>';
		} elseif ($style_type === 'type8') {
			$btn_color = !empty($button_color) ? esc_attr($button_color) : 'primary';
			$btn_style = ($button_style === 'outline') ? 'outline' : 'solid';
			if ($btn_style === 'outline') {
				$btn_class = 'btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple btn-outline-' . $btn_color . ' ' . esc_attr($btn_size_class);
			} else {
				$btn_class = 'btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple btn-' . $btn_color . ' ' . esc_attr($btn_size_class);
			}
			$output .= '<a href="' . esc_url($url) . '" class="' . $btn_class . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
		} elseif ($style_type === 'type9') {
			$btn_class = 'btn ' . esc_attr($btn_form_class) . ' lh-1 has-ripple btn-outline-primary ' . esc_attr($btn_size_class);
			$output .= '<a href="' . esc_url($url) . '" class="' . $btn_class . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
		} else {
			$output .= '<a href="' . esc_url($url) . '" class="lh-1 has-ripple" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
		}
	}

	$output .= '</nav>';
}

if ($output === '' && $data_source === 'theme') {
	$output = '<!-- Social Icons: theme social_links() not available or no links in theme settings -->';
}

if ($output !== '' && $output !== '<!-- Social Icons: theme social_links() not available or no links in theme settings -->') {
	$tag = 'div';
	$attr_string = '';
	foreach ($wrapper_attrs as $key => $val) {
		$attr_string .= ' ' . $key . '="' . $val . '"';
	}
	echo '<' . $tag . $attr_string . '>';
	echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts
	echo '</' . $tag . '>';
} elseif (strpos($output, '<!--') === 0) {
	echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- comment
}
