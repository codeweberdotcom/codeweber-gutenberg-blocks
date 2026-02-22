<?php
/**
 * Offcanvas Info — Simple template: one line per element, separated by <br>.
 * Used only for the Navbar block mobile offcanvas footer. Header Widgets "Инфо в оффканвасе" keeps offcanvas-info-panel.php.
 *
 * Expects: $offcanvas_element_ids, $offcanvas_theme, $offcanvas_social_overrides (optional), $offcanvas_target_id (for map id).
 *
 * @package CodeWeber Gutenberg Blocks
 */
if (!defined('ABSPATH')) {
	exit;
}

require __DIR__ . '/offcanvas-info-data.php';

if (isset($offcanvas_social_overrides) && is_array($offcanvas_social_overrides) && !empty($offcanvas_social_overrides)) {
	$config = array_merge($config, $offcanvas_social_overrides);
}
$clean_number_fn = function_exists('cleanNumber') ? 'cleanNumber' : function ($s) { return preg_replace('/[^0-9+]/', '', $s); };
$is_dark = (isset($offcanvas_theme) && $offcanvas_theme === 'dark');
$social_class = $is_dark ? 'nav social social-white mt-4' : 'nav social mt-4';
$id_attr = isset($offcanvas_target_id) ? esc_attr($offcanvas_target_id) : 'offcanvas-info';

$first = true;
foreach ($offcanvas_element_ids as $key) {
	$out = '';
	switch ($key) {
		case 'description':
			if ((string) $company_description !== '') {
				$out = wp_kses_post($company_description);
			}
			break;
		case 'phones':
			if ((string) $phone1 !== '' || (string) $phone2 !== '') {
				$parts = [];
				if ((string) $phone1 !== '') {
					$parts[] = '<a href="tel:' . esc_attr(call_user_func($clean_number_fn, $phone1)) . '">' . wp_kses_post($phone1) . '</a>';
				}
				if ((string) $phone2 !== '') {
					$parts[] = '<a href="tel:' . esc_attr(call_user_func($clean_number_fn, $phone2)) . '">' . wp_kses_post($phone2) . '</a>';
				}
				$out = implode(' <br> ', $parts);
			}
			break;
		case 'email':
			if ((string) $email !== '') {
				$out = '<a href="mailto:' . esc_attr($email) . '">' . wp_kses_post($email) . '</a>';
			}
			break;
		case 'address':
			break;
		case 'actual_address':
			if ((string) $actual_address !== '') {
				$out = '<address>' . wp_kses_post($actual_address) . '</address>';
			}
			break;
		case 'legal_address':
			if ((string) $legal_address !== '') {
				$out = '<address>' . wp_kses_post($legal_address) . '</address>';
			}
			break;
		case 'requisites':
			if ((string) $requisites_html !== '') {
				$out = '<div class="requisites">' . wp_kses_post($requisites_html) . '</div>';
			}
			break;
		case 'menu':
			$locations = get_nav_menu_locations();
			if (!empty($locations['offcanvas'])) {
				ob_start();
				wp_nav_menu([
					'theme_location' => 'offcanvas',
					'depth'          => 1,
					'container'      => '',
					'menu_class'     => 'list-unstyled',
				]);
				$out = ob_get_clean();
			}
			break;
		case 'gap':
		case 'map':
			if (!empty($coordinates) && !empty($yandex_api_key)) {
				// Используем карту темы (codeweber) — тот же вывод и инициализация с wrapper, что и у блока карты
				if (class_exists('Codeweber_Yandex_Maps')) {
					$yandex_maps = Codeweber_Yandex_Maps::get_instance();
					if (method_exists($yandex_maps, 'render_map') && $yandex_maps->has_api_key()) {
						$coords_arr = array_map('floatval', array_map('trim', explode(',', $coordinates)));
						$center = (count($coords_arr) >= 2) ? array($coords_arr[0], $coords_arr[1]) : array(55.76, 37.64);
						$zoom_val = (int) $zoom_level;
						if ($zoom_val < 1) {
							$zoom_val = 10;
						}
						$map_id = 'cwgb-offcanvas-map-simple-' . str_replace(array('.', ' '), '', uniqid('', true));
						$card_radius_class = function_exists('getThemeCardImageRadius') ? getThemeCardImageRadius() : 'rounded';
						$border_radius_px = 8;
						if (strpos($card_radius_class, 'rounded-0') !== false) {
							$border_radius_px = 0;
						} elseif (strpos($card_radius_class, 'rounded-xl') !== false) {
							$border_radius_px = 12;
						}
						$args = array(
							'map_id'   => $map_id,
							'center'   => $center,
							'zoom'     => $zoom_val,
							'height'   => 200,
							'width'    => '100%',
							'border_radius' => $border_radius_px,
							'show_sidebar' => false,
							'show_route'   => false,
							'auto_fit_bounds' => false,
							'lazy_load'     => false,
						);
						$markers = array(array(
							'latitude'  => $center[0],
							'longitude' => $center[1],
							'title'     => '',
						));
						$out = $yandex_maps->render_map($args, $markers);
					}
				}
				// Fallback: инлайн-карта, если класс темы недоступен
				if ($out === '' && !empty($coordinates) && !empty($yandex_api_key)) {
					$map_id = 'cwgb-offcanvas-map-simple-' . str_replace(array('.', ' '), '', uniqid('', true));
					$zoom_val = (int) $zoom_level;
					if ($zoom_val < 1) {
						$zoom_val = 10;
					}
					$api_url = 'https://api-maps.yandex.ru/2.1/?apikey=' . esc_attr($yandex_api_key) . '&lang=ru_RU';
					$out = '<div id="' . esc_attr($map_id) . '" style="width: 100%; height: 200px;"></div>';
					$out .= '<script>(function() {
	var mapId = ' . wp_json_encode($map_id) . ';
	var coordsStr = ' . wp_json_encode($coordinates) . ';
	var zoom = ' . $zoom_val . ';
	var apiUrl = ' . wp_json_encode($api_url) . ';
	var initialized = false;
	var mapInstance = null;
	function initOne() {
		if (initialized) return;
		if (typeof ymaps === "undefined") return;
		ymaps.ready(function() {
			if (initialized) return;
			var el = document.getElementById(mapId);
			if (!el) return;
			try {
				var coords = coordsStr.split(",").map(function(c) { return parseFloat(c.trim()); });
				mapInstance = new ymaps.Map(mapId, { center: coords, zoom: zoom });
				mapInstance.geoObjects.add(new ymaps.Placemark(coords));
				initialized = true;
			} catch (err) {}
		});
	}
	function fitMapIfNeeded() {
		if (mapInstance && mapInstance.container && mapInstance.container.fitToViewport) {
			try { mapInstance.container.fitToViewport(); } catch (e) {}
		}
	}
	function run() {
		if (typeof ymaps !== "undefined") { initOne(); return; }
		if (document.querySelector(\'script[src*="api-maps.yandex.ru"]\')) {
			var t = setInterval(function() { if (typeof ymaps !== "undefined") { clearInterval(t); initOne(); } }, 50);
			return;
		}
		var s = document.createElement("script"); s.src = apiUrl;
		s.onload = initOne;
		s.onerror = function() {};
		document.head.appendChild(s);
	}
	function scheduleRun() {
		var el = document.getElementById(mapId);
		var offcanvas = el && el.closest ? el.closest(".offcanvas") : null;
		function doRun() {
			if (initialized) return;
			setTimeout(function() { run(); }, 50);
		}
		if (offcanvas) {
			function onOffcanvasShown() {
				doRun();
				setTimeout(fitMapIfNeeded, 100);
			}
			offcanvas.addEventListener("shown.bs.offcanvas", function onShown() {
				offcanvas.removeEventListener("shown.bs.offcanvas", onShown);
				onOffcanvasShown();
			});
			if (offcanvas.classList && offcanvas.classList.contains("show")) {
				onOffcanvasShown();
			} else if (typeof MutationObserver !== "undefined") {
				var obs = new MutationObserver(function() {
					if (offcanvas.classList && offcanvas.classList.contains("show")) {
						obs.disconnect();
						onOffcanvasShown();
					}
				});
				obs.observe(offcanvas, { attributes: true, attributeFilter: ["class"] });
			}
			setTimeout(function() { doRun(); setTimeout(fitMapIfNeeded, 300); }, 150);
		} else {
			if (document.readyState === "loading") {
				document.addEventListener("DOMContentLoaded", run);
			} else {
				run();
			}
		}
	}
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", scheduleRun);
	} else {
		scheduleRun();
	}
})();</script>';
				}
			}
			break;
		case 'socials':
			if (function_exists('social_links')) {
				$out = '<nav class="' . esc_attr($social_class) . '">';
				$out .= social_links('', $config['social-type'], $config['social-button-size-offcanvas'], 'primary', 'solid', $config['social-button-style-offcanvas']);
				$out .= '</nav>';
			}
			break;
		case 'employee':
			$staff_ids_simple = (isset($offcanvas_employee_staff_ids) && is_array($offcanvas_employee_staff_ids) && !empty($offcanvas_employee_staff_ids))
				? array_map('intval', array_filter($offcanvas_employee_staff_ids))
				: [];
			if (empty($staff_ids_simple) && post_type_exists('staff')) {
				$first_staff = get_posts(array('post_type' => 'staff', 'post_status' => 'publish', 'posts_per_page' => 1, 'fields' => 'ids'));
				if (!empty($first_staff)) {
					$staff_ids_simple = array((int) $first_staff[0]);
				}
			}
			$get_initials = function ($name) {
				$words = array_filter(explode(' ', trim($name)));
				if (empty($words)) return 'AB';
				if (count($words) === 1) return strtoupper(substr($words[0], 0, 2));
				return strtoupper(substr($words[0], 0, 1) . substr(end($words), 0, 1));
			};
			$out = '';
			$first_done = false;
			foreach ($staff_ids_simple as $staff_id) {
				if ($staff_id <= 0) continue;
				$post = get_post($staff_id);
				if (!$post || $post->post_type !== 'staff' || $post->post_status !== 'publish') continue;
				$staff_name = trim((string) get_post_meta($staff_id, '_staff_name', true) . ' ' . (string) get_post_meta($staff_id, '_staff_surname', true));
				if ($staff_name === '') {
					$staff_name = get_the_title($staff_id);
				}
				$job_title = get_post_meta($staff_id, '_staff_position', true);
				$terms = get_the_terms($staff_id, 'departments');
				if ($terms && !is_wp_error($terms) && (string) $job_title === '') {
					$first = reset($terms);
					$job_title = $first->name;
				}
				$staff_phone = get_post_meta($staff_id, '_staff_phone', true);
				if ((string) $staff_phone === '') {
					$staff_phone = get_post_meta($staff_id, '_staff_job_phone', true);
				}
				$staff_link = get_permalink($staff_id);
				$thumb_id = get_post_thumbnail_id($staff_id);
				if ($first_done) {
					$out .= '<div class="d-flex align-items-center mt-4">';
				} else {
					$out .= '<div class="d-flex align-items-center">';
					$first_done = true;
				}
				$out .= '<figure class="user-avatar">';
				if ($thumb_id) {
					$avatar_src = wp_get_attachment_image_src($thumb_id, 'thumbnail');
					if ($avatar_src) {
						$out .= '<img class="rounded-circle" alt="' . esc_attr($staff_name) . '" src="' . esc_url($avatar_src[0]) . '">';
					} else {
						$placeholder_url = get_template_directory_uri() . '/dist/assets/img/avatar-placeholder.jpg';
						$out .= '<img class="rounded-circle" alt="' . esc_attr($staff_name) . '" src="' . esc_url($placeholder_url) . '">';
					}
				} else {
					$placeholder_url = get_template_directory_uri() . '/dist/assets/img/avatar-placeholder.jpg';
					$out .= '<img class="rounded-circle" alt="' . esc_attr($staff_name) . '" src="' . esc_url($placeholder_url) . '">';
				}
				$out .= '</figure><div>';
				$out .= '<div class="h6 mb-1 lh-1"><a href="' . esc_url($staff_link) . '" class="link-dark">' . esc_html($staff_name) . '</a></div>';
				if ((string) $job_title !== '') {
					$out .= '<div class="post-meta fs-15 lh-1 mb-1">' . esc_html($job_title) . '</div>';
				}
				if ((string) $staff_phone !== '') {
					$out .= '<div class="post-meta fs-15 lh-1"><a href="tel:' . esc_attr(call_user_func($clean_number_fn, $staff_phone)) . '">' . esc_html($staff_phone) . '</a></div>';
				}
				$out .= '</div></div>';
			}
			break;
		case 'widget_offcanvas_1':
			if (is_active_sidebar('widget-offcanvas-1')) {
				ob_start();
				dynamic_sidebar('widget-offcanvas-1');
				$out = ob_get_clean();
			}
			break;
		case 'widget_offcanvas_2':
			if (is_active_sidebar('widget-offcanvas-2')) {
				ob_start();
				dynamic_sidebar('widget-offcanvas-2');
				$out = ob_get_clean();
			}
			break;
		case 'widget_offcanvas_3':
			if (is_active_sidebar('widget-offcanvas-3')) {
				ob_start();
				dynamic_sidebar('widget-offcanvas-3');
				$out = ob_get_clean();
			}
			break;
		default:
			break;
	}
	if ($out !== '') {
		if (!$first) {
			echo '<br>';
		}
		echo $out;
		$first = false;
	}
}
