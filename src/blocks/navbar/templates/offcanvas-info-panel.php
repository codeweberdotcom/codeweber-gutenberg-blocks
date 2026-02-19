<?php
/**
 * Offcanvas Info panel body (block-based header).
 * Same structure as theme codeweber; uses Redux/theme data when available.
 *
 * @package CodeWeber Gutenberg Blocks
 * @var string $offcanvas_target_id  ID without # (e.g. offcanvas-info).
 * @var array  $offcanvas_element_ids    Ordered list of element ids to output (description, phones, map, ...).
 * @var string $offcanvas_theme          'light' or 'dark' for panel theme.
 * @var array  $offcanvas_employee_user_ids Optional. IDs of users to show in "employee" block (from Header Widgets).
 */
if (!defined('ABSPATH')) {
	exit;
}

global $opt_name;
$logo_fn = function_exists('get_custom_logo_type') ? 'get_custom_logo_type' : null;
$logo_fb = has_custom_logo() ? get_custom_logo() : '<span class="site-title">' . esc_html(get_bloginfo('name')) . '</span>';

require __DIR__ . '/offcanvas-info-data.php';

// Block-level overrides for social icons (from Header Widgets Offcanvas Info)
if (isset($offcanvas_social_overrides) && is_array($offcanvas_social_overrides) && !empty($offcanvas_social_overrides)) {
	$config = array_merge($config, $offcanvas_social_overrides);
}
$clean_number_fn = function_exists('cleanNumber') ? 'cleanNumber' : function ($s) { return preg_replace('/[^0-9+]/', '', $s); };

$id_attr = esc_attr($offcanvas_target_id);
if (!isset($offcanvas_theme) || !in_array($offcanvas_theme, ['light', 'dark'], true)) {
	$offcanvas_theme = 'light';
}
$is_dark = ($offcanvas_theme === 'dark');
$offcanvas_panel_class = $is_dark ? 'offcanvas offcanvas-end text-inverse offcanvas-dark' : 'offcanvas offcanvas-end offcanvas-light';
$btn_close_class = $is_dark ? 'btn-close btn-close-white' : 'btn-close';
$title_class = $is_dark ? 'text-white' : 'text-body';
if (!isset($offcanvas_employee_staff_ids) || !is_array($offcanvas_employee_staff_ids)) {
	$offcanvas_employee_staff_ids = [];
}
$offcanvas_employee_show_department = !empty($offcanvas_employee_show_department);

// Body content (reused for full panel and for inline output inside navbar offcanvas)
ob_start();
foreach ($offcanvas_element_ids as $key) {
			switch ($key) {
				case 'description':
					if ((string) $company_description !== '') {
						echo '<div class="widget mb-8"><p>' . wp_kses_post($company_description) . '</p></div>';
					}
					break;
				case 'phones':
					if ((string) $phone1 !== '' || (string) $phone2 !== '') {
						echo '<div class="widget mb-8"><div><div class="mb-1 h5 ' . esc_attr($title_class) . '">' . esc_html__('Phone', 'codeweber') . '</div>';
						if ((string) $phone1 !== '') echo '<a class="d-block" href="tel:' . esc_attr(call_user_func($clean_number_fn, $phone1)) . '">' . wp_kses_post($phone1) . '</a>';
						if ((string) $phone2 !== '') echo '<a class="d-block" href="tel:' . esc_attr(call_user_func($clean_number_fn, $phone2)) . '">' . wp_kses_post($phone2) . '</a>';
						echo '</div></div>';
					}
					break;
				case 'email':
					if ((string) $email !== '') {
						echo '<div class="widget mb-8"><div><div class="mb-1 h5 ' . esc_attr($title_class) . '">' . esc_html__('E-mail', 'codeweber') . '</div>';
						echo '<a class="d-block" href="mailto:' . esc_attr($email) . '">' . wp_kses_post($email) . '</a>';
						echo '</div></div>';
					}
					break;
				case 'address':
					// Убрано: оставлен только actual_address (Актуальный адрес)
					break;
				case 'actual_address':
					if ((string) $actual_address !== '') {
						echo '<div class="widget mb-8"><div class="align-self-start justify-content-start"><div class="mb-1 h5 ' . esc_attr($title_class) . '">' . esc_html__('Address', 'codeweber-gutenberg-blocks') . '</div><address>' . wp_kses_post($actual_address) . '</address></div></div>';
					}
					break;
				case 'legal_address':
					echo '<div class="widget mb-8"><div class="align-self-start justify-content-start"><div class="mb-1 h5 ' . esc_attr($title_class) . '">' . esc_html__('Legal address', 'codeweber-gutenberg-blocks') . '</div><address>' . ((string) $legal_address !== '' ? wp_kses_post($legal_address) : '') . '</address></div></div>';
					break;
				case 'requisites':
					echo '<div class="widget mb-8"><div class="align-self-start justify-content-start"><div class="mb-1 h5 ' . esc_attr($title_class) . '">' . esc_html__('Requisites', 'codeweber-gutenberg-blocks') . '</div><div class="requisites">' . ((string) $requisites_html !== '' ? wp_kses_post($requisites_html) : '') . '</div></div></div>';
					break;
				case 'menu':
					echo '<div class="widget mb-8">';
					$locations = get_nav_menu_locations();
					if (!empty($locations['offcanvas'])) {
						$menu = wp_get_nav_menu_object($locations['offcanvas']);
						if ($menu) echo '<div class="widget-title ' . esc_attr($title_class) . ' mb-3 h4">' . esc_html($menu->name) . '</div>';
					}
					wp_nav_menu([
						'theme_location' => 'offcanvas',
						'depth'          => 1,
						'container'      => '',
						'menu_class'     => 'list-unstyled',
					]);
					echo '</div>';
					break;
				case 'gap': // legacy id, same as map
				case 'map':
					if (!empty($coordinates) && !empty($yandex_api_key)) {
						$map_html = '';
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
								$map_id = 'cwgb-offcanvas-map-' . str_replace(array('.', ' '), '', uniqid('', true));
								$args = array(
									'map_id'   => $map_id,
									'center'   => $center,
									'zoom'     => $zoom_val,
									'height'   => 200,
									'width'    => '100%',
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
								$map_html = $yandex_maps->render_map($args, $markers);
							}
						}
						if ($map_html !== '') {
							echo '<div class="widget mb-8">';
							echo '<div class="widget-title ' . esc_attr($title_class) . ' mb-3 h4">' . esc_html__('On Map', 'codeweber') . '</div>';
							echo $map_html;
							echo '</div>';
						} else {
							// Fallback: инлайн-карта, если класс темы недоступен
							$map_id = 'cwgb-offcanvas-map-' . str_replace(array('.', ' '), '', uniqid('', true));
							$zoom_val = (int) $zoom_level;
							if ($zoom_val < 1) {
								$zoom_val = 10;
							}
							$api_url = 'https://api-maps.yandex.ru/2.1/?apikey=' . esc_attr($yandex_api_key) . '&lang=ru_RU';
							?>
							<div class="widget mb-8">
								<div class="widget-title <?php echo esc_attr($title_class); ?> mb-3 h4"><?php esc_html_e('On Map', 'codeweber'); ?></div>
								<div id="<?php echo esc_attr($map_id); ?>" style="width: 100%; height: 200px;"></div>
							</div>
							<script>(function() {
	var mapId = <?php echo wp_json_encode($map_id); ?>;
	var coordsStr = <?php echo wp_json_encode($coordinates); ?>;
	var zoom = <?php echo $zoom_val; ?>;
	var apiUrl = <?php echo wp_json_encode($api_url); ?>;
	var initialized = false;
	function initOne() {
		if (initialized) return;
		if (typeof ymaps === "undefined") return;
		ymaps.ready(function() {
			if (initialized) return;
			var el = document.getElementById(mapId);
			if (!el) return;
			try {
				var coords = coordsStr.split(",").map(function(c) { return parseFloat(c.trim()); });
				var map = new ymaps.Map(mapId, { center: coords, zoom: zoom });
				map.geoObjects.add(new ymaps.Placemark(coords));
				initialized = true;
			} catch (err) {}
		});
	}
	function run() {
		if (typeof ymaps !== "undefined") { initOne(); return; }
		if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
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
		if (offcanvas) {
			offcanvas.addEventListener("shown.bs.offcanvas", function onShown() {
				offcanvas.removeEventListener("shown.bs.offcanvas", onShown);
				run();
			});
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
})();</script>
							<?php
						}
					}
					break;
				case 'socials':
					if (function_exists('social_links')) {
						echo '<div class="widget mb-8">';
						echo '<div class="widget-title ' . esc_attr($title_class) . ' mb-3 h4">' . esc_html__('Social Media', 'codeweber') . '</div>';
						echo '<div class="offcanvas-social-wrap">';
						echo social_links('', $config['social-type'], $config['social-button-size-offcanvas'], 'primary', 'solid', $config['social-button-style-offcanvas']);
						echo '</div>';
						echo '</div>';
					}
					break;
				case 'employee':
					$staff_ids_to_show = array_map('intval', array_filter($offcanvas_employee_staff_ids));
					$get_initials = function ($name) {
						$words = array_filter(explode(' ', trim($name)));
						if (empty($words)) return 'AB';
						if (count($words) === 1) return strtoupper(substr($words[0], 0, 2));
						return strtoupper(substr($words[0], 0, 1) . substr(end($words), 0, 1));
					};
					$link_class = $is_dark ? 'link-light' : 'link-dark';
					if (!empty($staff_ids_to_show)) {
						echo '<div class="widget mb-8">';
						foreach ($staff_ids_to_show as $staff_id) {
							if ($staff_id <= 0) continue;
							$post = get_post($staff_id);
							if (!$post || $post->post_type !== 'staff' || $post->post_status !== 'publish') continue;
							$staff_name = trim((string) get_post_meta($staff_id, '_staff_name', true) . ' ' . (string) get_post_meta($staff_id, '_staff_surname', true));
							if ($staff_name === '') {
								$staff_name = get_the_title($staff_id);
							}
							if ($offcanvas_employee_show_department && taxonomy_exists('departments')) {
								$terms = get_the_terms($staff_id, 'departments');
								$job_title = '';
								if ($terms && !is_wp_error($terms)) {
									$first = reset($terms);
									$job_title = $first->name;
								}
								if ((string) $job_title === '') {
									$job_title = get_post_meta($staff_id, '_staff_position', true);
								}
							} else {
								$job_title = get_post_meta($staff_id, '_staff_position', true);
							}
							$staff_phone = get_post_meta($staff_id, '_staff_phone', true);
							if ((string) $staff_phone === '') {
								$staff_phone = get_post_meta($staff_id, '_staff_job_phone', true);
							}
							$staff_link = get_permalink($staff_id);
							$thumb_id = get_post_thumbnail_id($staff_id);
							echo '<div class="d-flex align-items-center' . (count($staff_ids_to_show) > 1 ? ' mb-4' : '') . '">';
							echo '<figure class="user-avatar">';
							if ($thumb_id) {
								$avatar_src = wp_get_attachment_image_src($thumb_id, 'thumbnail');
								if ($avatar_src) {
									echo '<img class="rounded-circle" alt="' . esc_attr($staff_name) . '" src="' . esc_url($avatar_src[0]) . '">';
								} else {
									$placeholder_url = get_template_directory_uri() . '/dist/assets/img/avatar-placeholder.jpg';
									echo '<img class="rounded-circle" alt="' . esc_attr($staff_name) . '" src="' . esc_url($placeholder_url) . '">';
								}
							} else {
								$placeholder_url = get_template_directory_uri() . '/dist/assets/img/avatar-placeholder.jpg';
								echo '<img class="rounded-circle" alt="' . esc_attr($staff_name) . '" src="' . esc_url($placeholder_url) . '">';
							}
							echo '</figure><div>';
							echo '<div class="h6 mb-1 lh-1"><a href="' . esc_url($staff_link) . '" class="' . esc_attr($link_class) . '">' . esc_html($staff_name) . '</a></div>';
							if ((string) $job_title !== '') {
								echo '<div class="post-meta fs-15 lh-1 mb-1">' . esc_html($job_title) . '</div>';
							}
							if ((string) $staff_phone !== '') {
								echo '<div class="post-meta fs-15 lh-1"><a href="tel:' . esc_attr(call_user_func($clean_number_fn, $staff_phone)) . '">' . esc_html($staff_phone) . '</a></div>';
							}
							echo '</div></div>';
						}
						echo '</div>';
					}
					break;
				case 'widget_offcanvas_1':
					if (is_active_sidebar('widget-offcanvas-1')) {
						echo '<div class="widget mb-8">';
						dynamic_sidebar('widget-offcanvas-1');
						echo '</div>';
					}
					break;
				case 'widget_offcanvas_2':
					if (is_active_sidebar('widget-offcanvas-2')) {
						echo '<div class="widget mb-8">';
						dynamic_sidebar('widget-offcanvas-2');
						echo '</div>';
					}
					break;
				case 'widget_offcanvas_3':
					if (is_active_sidebar('widget-offcanvas-3')) {
						echo '<div class="widget mb-8">';
						dynamic_sidebar('widget-offcanvas-3');
						echo '</div>';
					}
					break;
				default:
					// no output
					break;
			}
		}
$offcanvas_body_content = ob_get_clean();
?>
<div class="<?php echo esc_attr($offcanvas_panel_class); ?>" id="<?php echo $id_attr; ?>" data-bs-scroll="true">
	<div class="offcanvas-header">
		<a href="<?php echo esc_url(home_url('/')); ?>"><?php echo $logo_fn ? $logo_fn($is_dark ? 'dark' : 'light') : $logo_fb; ?></a>
		<button type="button" class="<?php echo esc_attr($btn_close_class); ?>" data-bs-dismiss="offcanvas" aria-label="<?php esc_attr_e('Close', 'codeweber'); ?>"></button>
	</div>
	<div class="offcanvas-body">
		<?php echo $offcanvas_body_content; ?>
	</div>
</div>
