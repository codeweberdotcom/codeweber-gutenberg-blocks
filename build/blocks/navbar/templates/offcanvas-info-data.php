<?php
/**
 * Shared Redux/theme data for offcanvas info (panel and simple template).
 * No output. Expects global $opt_name.
 *
 * @package CodeWeber Gutenberg Blocks
 */
if (!defined('ABSPATH')) {
	exit;
}

global $opt_name;

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
$offcanvas_employee_user_id = 0;
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
	$offcanvas_employee_user_id = (int) Redux::get_option($opt_name, 'offcanvas_employee_user_id', 0);
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
		$line1 = isset($address_data['box1']) ? trim((string) $address_data['box1']) : '';
		$line2 = isset($address_data['box2']) ? trim((string) $address_data['box2']) : '';
		$line3 = isset($address_data['box3']) ? trim((string) $address_data['box3']) : '';
		$street = isset($address_data['box4']) ? trim((string) $address_data['box4']) : '';
		$house = isset($address_data['box5']) ? trim((string) $address_data['box5']) : '';
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
	$req_text = Redux::get_option($opt_name, 'company-requisites');
	if (empty($req_text)) { $req_text = Redux::get_option($opt_name, 'requisites'); }
	if (empty($req_text)) { $req_text = Redux::get_option($opt_name, 'company_requisites'); }
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
