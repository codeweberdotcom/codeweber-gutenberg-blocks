<?php
/**
 * Offcanvas Info panel body (block-based header).
 * Same structure as theme codeweber; uses Redux/theme data when available.
 *
 * @package CodeWeber Gutenberg Blocks
 * @var string $offcanvas_target_id  ID without # (e.g. offcanvas-info).
 * @var array  $offcanvas_element_ids Ordered list of element ids to output (description, phones, map, ...).
 * @var string $offcanvas_theme      'light' or 'dark' for panel theme.
 */
if (!defined('ABSPATH')) {
	exit;
}

global $opt_name;
$logo_fn = function_exists('get_custom_logo_type') ? 'get_custom_logo_type' : null;
$logo_fb = has_custom_logo() ? get_custom_logo() : '<span class="site-title">' . esc_html(get_bloginfo('name')) . '</span>';

// Theme/Redux data (codeweber)
$company_description = '';
$phone1 = '';
$phone2 = '';
$email = '';
$full_address = '';
$actual_address = '';
$legal_address = '';
$requisites_html = '';
$coordinates = '';
$yandex_api_key = '';
$zoom_level = '10';
$config = [
	'social-type'                 => 'type1',
	'social-button-size-offcanvas' => 'md',
	'social-button-style-offcanvas' => 'circle',
];
if (!empty($opt_name) && class_exists('Redux')) {
	$company_description = Redux::get_option($opt_name, 'text-about-company');
	$phone1 = Redux::get_option($opt_name, 'phone_01');
	$phone2 = Redux::get_option($opt_name, 'phone_02');
	$email = Redux::get_option($opt_name, 'e-mail');
	$yandex_api_key = Redux::get_option($opt_name, 'yandexapi');
	$coordinates = Redux::get_option($opt_name, 'yandex_coordinates');
	$zoom_level = Redux::get_option($opt_name, 'yandex_zoom');
	$si = Redux::get_option($opt_name, 'social-icon-type');
	$config['social-type'] = 'type' . (is_numeric($si) ? $si : 1);
	$config['social-button-size-offcanvas'] = Redux::get_option($opt_name, 'social-button-size-offcanvas', 'md');
	$config['social-button-style-offcanvas'] = Redux::get_option($opt_name, 'social-button-style-offcanvas', 'circle');
	// Форматирование части адреса: не дублировать "д." если уже есть "дом", "стр." если "строение", "оф." если "офис"
	$addr_part = function ($val, $prefix) {
		$v = trim((string) $val);
		if ($v === '') return '';
		$v_lower = mb_strtolower($v);
		if ($prefix === 'д. ' && preg_match('/\b(дом|д\.)\s*/u', $v_lower)) return $v;
		if ($prefix === 'стр. ' && preg_match('/\b(строение|стр\.|корп\.)\s*/u', $v_lower)) return $v;
		if ($prefix === 'оф. ' && preg_match('/\b(офис|оф\.)\s*/u', $v_lower)) return $v;
		return $prefix . $v;
	};
	$address_data = Redux::get_option($opt_name, 'fact-company-adress');
	if (is_array($address_data)) {
		// Формат: индекс, страна, город, ул. …, д. …, стр. …, оф. …, N этаж
		$line1 = isset($address_data['box1']) ? trim((string) $address_data['box1']) : '';
		$line2 = isset($address_data['box2']) ? trim((string) $address_data['box2']) : '';
		$line3 = isset($address_data['box3']) ? trim((string) $address_data['box3']) : '';
		$street = isset($address_data['box4']) ? trim((string) $address_data['box4']) : '';
		$house = isset($address_data['box5']) ? trim((string) $address_data['box5']) : '';
		// Если есть box8 — считаем box6=строение, box7=офис, box8=этаж; иначе box6=офис, box7=этаж
		$has_box8 = isset($address_data['box8']) && (string) $address_data['box8'] !== '';
		$building = $has_box8 && isset($address_data['box6']) ? trim((string) $address_data['box6']) : '';
		$office = $has_box8 && isset($address_data['box7']) ? trim((string) $address_data['box7']) : (isset($address_data['box6']) ? trim((string) $address_data['box6']) : '');
		$floor = $has_box8 && isset($address_data['box8']) ? trim((string) $address_data['box8']) : (isset($address_data['box7']) ? trim((string) $address_data['box7']) : '');
		$street_parts = [];
		if ($street !== '') $street_parts[] = (strpos($street, 'ул.') === 0 ? $street : 'ул. ' . $street);
		if ($house !== '') $street_parts[] = $addr_part($house, 'д. ');
		if ($building !== '') $street_parts[] = $addr_part($building, 'стр. ');
		if ($office !== '') $street_parts[] = $addr_part($office, 'оф. ');
		if ($floor !== '') $street_parts[] = (is_numeric($floor) ? $floor . ' этаж' : $floor);
		$line4 = implode(', ', $street_parts);
		$addr_lines = array_filter([$line1, $line2, $line3, $line4]);
		if (!empty($addr_lines)) {
			$full_address = implode('<br>', $addr_lines);
		}
	}
	// Alternative: separate address fields (fact-*)
	if ((string) $full_address === '' && !empty($opt_name) && class_exists('Redux')) {
		$postal = Redux::get_option($opt_name, 'fact-postal');
		$country = Redux::get_option($opt_name, 'fact-country');
		$city = Redux::get_option($opt_name, 'fact-city');
		$street = Redux::get_option($opt_name, 'fact-street');
		$house = Redux::get_option($opt_name, 'fact-house');
		$building = Redux::get_option($opt_name, 'fact-building');
		$office = Redux::get_option($opt_name, 'fact-office');
		$floor = Redux::get_option($opt_name, 'fact-floor');
		$street_parts = [];
		if ((string) $street !== '') $street_parts[] = (strpos($street, 'ул.') === 0 ? $street : 'ул. ' . $street);
		if ((string) $house !== '') $street_parts[] = $addr_part($house, 'д. ');
		if ((string) $building !== '') $street_parts[] = $addr_part($building, 'стр. ');
		if ((string) $office !== '') $street_parts[] = $addr_part($office, 'оф. ');
		if ((string) $floor !== '') $street_parts[] = (is_numeric($floor) ? $floor . ' этаж' : $floor);
		$street_line = implode(', ', $street_parts);
		$addr_lines = array_filter([
			$postal !== '' ? $postal : null,
			$country !== '' ? $country : null,
			$city !== '' ? $city : null,
			$street_line !== '' ? $street_line : null,
		]);
		if (!empty($addr_lines)) {
			$full_address = implode('<br>', $addr_lines);
		}
	}
	// Актуальный адрес: отдельное поле или как фактический
	$actual_raw = Redux::get_option($opt_name, 'actual-company-address');
	if (is_array($actual_raw)) {
		$line1 = isset($actual_raw['box1']) ? trim((string) $actual_raw['box1']) : '';
		$line2 = isset($actual_raw['box2']) ? trim((string) $actual_raw['box2']) : '';
		$line3 = isset($actual_raw['box3']) ? trim((string) $actual_raw['box3']) : '';
		$street = isset($actual_raw['box4']) ? trim((string) $actual_raw['box4']) : '';
		$house = isset($actual_raw['box5']) ? trim((string) $actual_raw['box5']) : '';
		$has_box8 = isset($actual_raw['box8']) && (string) $actual_raw['box8'] !== '';
		$building = $has_box8 && isset($actual_raw['box6']) ? trim((string) $actual_raw['box6']) : '';
		$office = $has_box8 && isset($actual_raw['box7']) ? trim((string) $actual_raw['box7']) : (isset($actual_raw['box6']) ? trim((string) $actual_raw['box6']) : '');
		$floor = $has_box8 && isset($actual_raw['box8']) ? trim((string) $actual_raw['box8']) : (isset($actual_raw['box7']) ? trim((string) $actual_raw['box7']) : '');
		$street_parts = [];
		if ($street !== '') $street_parts[] = (strpos($street, 'ул.') === 0 ? $street : 'ул. ' . $street);
		if ($house !== '') $street_parts[] = $addr_part($house, 'д. ');
		if ($building !== '') $street_parts[] = $addr_part($building, 'стр. ');
		if ($office !== '') $street_parts[] = $addr_part($office, 'оф. ');
		if ($floor !== '') $street_parts[] = (is_numeric($floor) ? $floor . ' этаж' : $floor);
		$line4 = implode(', ', $street_parts);
		$addr_lines = array_filter([$line1, $line2, $line3, $line4]);
		if (!empty($addr_lines)) {
			$actual_address = implode('<br>', $addr_lines);
		}
	} elseif (is_string($actual_raw) && trim($actual_raw) !== '') {
		$actual_address = trim($actual_raw);
	}
	if ((string) $actual_address === '' && (string) $full_address !== '') {
		$actual_address = $full_address;
	}
	// Юридический адрес: legal-company-address (массив/текст) или поля темы Codeweber juri-*
	$legal_raw = Redux::get_option($opt_name, 'legal-company-address');
	if (is_array($legal_raw)) {
		$line1 = isset($legal_raw['box1']) ? trim((string) $legal_raw['box1']) : '';
		$line2 = isset($legal_raw['box2']) ? trim((string) $legal_raw['box2']) : '';
		$line3 = isset($legal_raw['box3']) ? trim((string) $legal_raw['box3']) : '';
		$street = isset($legal_raw['box4']) ? trim((string) $legal_raw['box4']) : '';
		$house = isset($legal_raw['box5']) ? trim((string) $legal_raw['box5']) : '';
		$has_box8 = isset($legal_raw['box8']) && (string) $legal_raw['box8'] !== '';
		$building = $has_box8 && isset($legal_raw['box6']) ? trim((string) $legal_raw['box6']) : '';
		$office = $has_box8 && isset($legal_raw['box7']) ? trim((string) $legal_raw['box7']) : (isset($legal_raw['box6']) ? trim((string) $legal_raw['box6']) : '');
		$floor = $has_box8 && isset($legal_raw['box8']) ? trim((string) $legal_raw['box8']) : (isset($legal_raw['box7']) ? trim((string) $legal_raw['box7']) : '');
		$street_parts = [];
		if ($street !== '') $street_parts[] = (strpos($street, 'ул.') === 0 ? $street : 'ул. ' . $street);
		if ($house !== '') $street_parts[] = $addr_part($house, 'д. ');
		if ($building !== '') $street_parts[] = $addr_part($building, 'стр. ');
		if ($office !== '') $street_parts[] = $addr_part($office, 'оф. ');
		if ($floor !== '') $street_parts[] = (is_numeric($floor) ? $floor . ' этаж' : $floor);
		$line4 = implode(', ', $street_parts);
		$addr_lines = array_filter([$line1, $line2, $line3, $line4]);
		if (!empty($addr_lines)) {
			$legal_address = implode('<br>', $addr_lines);
		}
	} elseif (is_string($legal_raw) && trim($legal_raw) !== '') {
		$legal_address = trim($legal_raw);
	}
	if ((string) $legal_address === '') {
		// Тема Codeweber: juri-postal, juri-country, juri-region, juri-city, juri-street, juri-house, juri-office
		$juri_postal = Redux::get_option($opt_name, 'juri-postal');
		$juri_country = Redux::get_option($opt_name, 'juri-country');
		$juri_region = Redux::get_option($opt_name, 'juri-region');
		$juri_city = Redux::get_option($opt_name, 'juri-city');
		$juri_street = Redux::get_option($opt_name, 'juri-street');
		$juri_house = Redux::get_option($opt_name, 'juri-house');
		$juri_office = Redux::get_option($opt_name, 'juri-office');
		$juri_parts = [];
		if ((string) $juri_postal !== '') $juri_parts[] = trim((string) $juri_postal);
		if ((string) $juri_country !== '') $juri_parts[] = trim((string) $juri_country);
		if ((string) $juri_region !== '' && (string) $juri_city !== '') $juri_parts[] = trim((string) $juri_region) . ', ' . trim((string) $juri_city);
		elseif ((string) $juri_city !== '') $juri_parts[] = trim((string) $juri_city);
		elseif ((string) $juri_region !== '') $juri_parts[] = trim((string) $juri_region);
		$street_parts = [];
		if ((string) $juri_street !== '') $street_parts[] = (strpos($juri_street, 'ул.') === 0 ? $juri_street : 'ул. ' . trim((string) $juri_street));
		if ((string) $juri_house !== '') $street_parts[] = $addr_part(trim((string) $juri_house), 'д. ');
		if ((string) $juri_office !== '') $street_parts[] = $addr_part(trim((string) $juri_office), 'оф. ');
		if (!empty($street_parts)) $juri_parts[] = implode(', ', $street_parts);
		if (!empty($juri_parts)) {
			$legal_address = implode('<br>', $juri_parts);
		}
	}
	// Реквизиты: текст целиком или структурированные поля (несколько вариантов ключей Redux)
	$req_text = Redux::get_option($opt_name, 'company-requisites');
	if (empty($req_text)) {
		$req_text = Redux::get_option($opt_name, 'requisites');
	}
	if (empty($req_text)) {
		$req_text = Redux::get_option($opt_name, 'company_requisites');
	}
	if (is_array($req_text)) {
		$req_text = isset($req_text['textarea']) ? $req_text['textarea'] : implode("\n", array_filter(array_map('trim', $req_text)));
	}
	if (is_string($req_text) && trim($req_text) !== '') {
		$requisites_html = nl2br(esc_html(trim($req_text)));
	} else {
		$inn = Redux::get_option($opt_name, 'fact-inn');
		if ($inn === '' || $inn === null) { $inn = Redux::get_option($opt_name, 'inn'); }
		$kpp = Redux::get_option($opt_name, 'fact-kpp');
		if ($kpp === '' || $kpp === null) { $kpp = Redux::get_option($opt_name, 'kpp'); }
		$ogrn = Redux::get_option($opt_name, 'fact-ogrn');
		if ($ogrn === '' || $ogrn === null) { $ogrn = Redux::get_option($opt_name, 'ogrn'); }
		$okpo = Redux::get_option($opt_name, 'fact-okpo');
		if ($okpo === '' || $okpo === null) { $okpo = Redux::get_option($opt_name, 'okpo'); }
		$legal_name = Redux::get_option($opt_name, 'fact-legal-name');
		if ($legal_name === '' || $legal_name === null) { $legal_name = Redux::get_option($opt_name, 'company_name'); }
		$bank_name = Redux::get_option($opt_name, 'fact-bank-name');
		if ($bank_name === '' || $bank_name === null) { $bank_name = Redux::get_option($opt_name, 'bank_name'); }
		if ($bank_name === '' || $bank_name === null) { $bank_name = Redux::get_option($opt_name, 'bank-name'); }
		$bank_account = Redux::get_option($opt_name, 'fact-bank-account');
		if ($bank_account === '' || $bank_account === null) { $bank_account = Redux::get_option($opt_name, 'bank_account'); }
		if ($bank_account === '' || $bank_account === null) { $bank_account = Redux::get_option($opt_name, 'bank-settlement-account'); }
		$corr_account = Redux::get_option($opt_name, 'fact-correspondent-account');
		if ($corr_account === '' || $corr_account === null) { $corr_account = Redux::get_option($opt_name, 'correspondent_account'); }
		if ($corr_account === '' || $corr_account === null) { $corr_account = Redux::get_option($opt_name, 'bank-corr-account'); }
		$bik = Redux::get_option($opt_name, 'fact-bik');
		if ($bik === '' || $bik === null) { $bik = Redux::get_option($opt_name, 'bik'); }
		if ($bik === '' || $bik === null) { $bik = Redux::get_option($opt_name, 'bank-bic'); }
		$bank_tin = Redux::get_option($opt_name, 'bank-bank-tin');
		$bank_kpp = Redux::get_option($opt_name, 'bank-bank-kpp');
		$bank_addr = Redux::get_option($opt_name, 'bank-bank-address');
		$req_parts = [];
		if ((string) $legal_name !== '') $req_parts[] = esc_html((string) $legal_name);
		if ((string) $inn !== '') $req_parts[] = 'ИНН ' . esc_html((string) $inn);
		if ((string) $kpp !== '') $req_parts[] = 'КПП ' . esc_html((string) $kpp);
		if ((string) $ogrn !== '') $req_parts[] = 'ОГРН ' . esc_html((string) $ogrn);
		if ((string) $okpo !== '') $req_parts[] = 'ОКПО ' . esc_html((string) $okpo);
		if ((string) $bank_name !== '') $req_parts[] = esc_html((string) $bank_name);
		if ((string) $bank_account !== '') $req_parts[] = 'р/с ' . esc_html((string) $bank_account);
		if ((string) $corr_account !== '') $req_parts[] = 'к/с ' . esc_html((string) $corr_account);
		if ((string) $bik !== '') $req_parts[] = 'БИК ' . esc_html((string) $bik);
		if ((string) $bank_tin !== '') $req_parts[] = 'ИНН банка ' . esc_html((string) $bank_tin);
		if ((string) $bank_kpp !== '') $req_parts[] = 'КПП банка ' . esc_html((string) $bank_kpp);
		if ((string) $bank_addr !== '') $req_parts[] = esc_html((string) $bank_addr);
		if (!empty($req_parts)) {
			$requisites_html = implode('<br>', $req_parts);
		}
	}
}
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
?>
<div class="<?php echo esc_attr($offcanvas_panel_class); ?>" id="<?php echo $id_attr; ?>" data-bs-scroll="true">
	<div class="offcanvas-header">
		<a href="<?php echo esc_url(home_url('/')); ?>"><?php echo $logo_fn ? $logo_fn($is_dark ? 'dark' : 'light') : $logo_fb; ?></a>
		<button type="button" class="<?php echo esc_attr($btn_close_class); ?>" data-bs-dismiss="offcanvas" aria-label="<?php esc_attr_e('Close', 'codeweber'); ?>"></button>
	</div>
	<div class="offcanvas-body">
		<?php
		foreach ($offcanvas_element_ids as $key) {
			switch ($key) {
				case 'description':
					if ((string) $company_description !== '') {
						echo '<div class="widget mb-8"><p class="lead">' . wp_kses_post($company_description) . '</p></div>';
					}
					break;
				case 'phones':
					if ((string) $phone1 !== '' || (string) $phone2 !== '' || (string) $email !== '') {
						echo '<div class="widget mb-8"><div><div class="mb-1 h5 ' . esc_attr($title_class) . '">' . esc_html__('Phone', 'codeweber') . '</div>';
						if ((string) $phone1 !== '') echo '<a class="d-block" href="tel:' . esc_attr(call_user_func($clean_number_fn, $phone1)) . '">' . wp_kses_post($phone1) . '</a>';
						if ((string) $phone2 !== '') echo '<a class="d-block" href="tel:' . esc_attr(call_user_func($clean_number_fn, $phone2)) . '">' . wp_kses_post($phone2) . '</a>';
						echo '</div></div>';
						echo '<div class="widget mb-8"><div><div class="mb-1 h5 ' . esc_attr($title_class) . '">' . esc_html__('E-mail', 'codeweber') . '</div>';
						if ((string) $email !== '') echo '<a class="d-block" href="mailto:' . esc_attr($email) . '">' . wp_kses_post($email) . '</a>';
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
						$map_id = 'cwgb-offcanvas-map-' . $id_attr;
						?>
						<div class="widget mb-8">
							<div class="widget-title <?php echo esc_attr($title_class); ?> mb-3 h4"><?php esc_html_e('On Map', 'codeweber'); ?></div>
							<div id="<?php echo esc_attr($map_id); ?>" style="width: 100%; height: 200px;"></div>
						</div>
						<script src="https://api-maps.yandex.ru/2.1/?apikey=<?php echo esc_attr($yandex_api_key); ?>&lang=ru_RU"></script>
						<script>
							document.addEventListener("DOMContentLoaded", function() {
								if (typeof ymaps !== "undefined") {
									ymaps.ready(function() {
										var coords = "<?php echo esc_js($coordinates); ?>".split(",").map(function(c) { return parseFloat(c.trim()); });
										var map = new ymaps.Map("<?php echo esc_js($map_id); ?>", { center: coords, zoom: parseInt("<?php echo esc_js($zoom_level); ?>") || 10 });
										map.geoObjects.add(new ymaps.Placemark(coords));
									});
								}
							});
						</script>
						<?php
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
				case 'widget_offcanvas_1':
					if (is_active_sidebar('header-widget-1')) {
						echo '<div class="widget mb-8">';
						dynamic_sidebar('header-widget-1');
						echo '</div>';
					}
					break;
				case 'widget_offcanvas_2':
					if (is_active_sidebar('header-widget-2')) {
						echo '<div class="widget mb-8">';
						dynamic_sidebar('header-widget-2');
						echo '</div>';
					}
					break;
				case 'widget_offcanvas_3':
					if (is_active_sidebar('header-widget-3')) {
						echo '<div class="widget mb-8">';
						dynamic_sidebar('header-widget-3');
						echo '</div>';
					}
					break;
				default:
					// no output
					break;
			}
		}
		?>
	</div>
</div>
