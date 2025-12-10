<?php
if (!defined('ABSPATH')) {
	exit; // Защита от прямого доступа
}

// Регистрируем REST API маршруты
add_action('rest_api_init', function () {
	// Общий endpoint для опций
	register_rest_route('wp/v2', '/options', [
		'methods' => 'GET',
		'callback' => 'get_custom_option',
		'permission_callback' => '__return_true'
	]);
	
	// Отдельный endpoint для получения телефонов из Redux
	register_rest_route('wp/v2', '/phones', [
		'methods' => 'GET',
		'callback' => 'get_redux_phones_api',
		'permission_callback' => '__return_true'
	]);
});

// Функция для получения кастомных опций
function get_custom_option()
{
	// Чтение JSON-файла
	$json_file = plugin_dir_path(__FILE__) . 'fields.json';
	$json_data = file_get_contents($json_file);

	// Декодирование JSON в массив
	$options = json_decode($json_data, true);

	// Проверяем, успешно ли декодирован JSON
	if ($options === null) {
		return new WP_Error('json_error', __('JSON decoding error', 'codeweber-gutenberg-blocks'), ['status' => 500]);
	}

	// Массив для результатов
	$result = [];

	// Добавляем данные телефонов из Redux
	$result['phones'] = get_redux_phones();
	
	// Добавляем остальные опции
	foreach ($options as $key => $default_value) {
		if ($key !== 'phones') {
			$value = get_option($key, $default_value);
			$result[$key] = $value;
		}
	}

	// Получаем CF7 формы
	$cf7_forms = get_cf7_forms();

	// Логируем данные о CF7 формах
	error_log(print_r($cf7_forms, true));

	// Добавляем формы CF7 в итоговый результат
	$result['cf7_forms'] = $cf7_forms;

	// Получаем модальные окна
	$modals = get_modals();

	// Добавляем модальные окна в итоговый результат
	$result['modals'] = $modals;

	// Возвращаем результат
	return $result;
}

// Функция для получения форм CF7
function get_cf7_forms()
{
	// Массив для хранения форм
	$cf7_forms = [];

	// WP_Query для получения всех форм CF7
	$args = [
		'post_type' => 'wpcf7_contact_form',
		'posts_per_page' => -1,
	];

	$query = new WP_Query($args);

	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$form_id = get_the_ID();
			$form_title = get_the_title();
			// Добавляем форму в массив
			$cf7_forms[$form_id] = $form_title;
		}
		wp_reset_postdata();
	}

	return $cf7_forms;
}

// Функция для получения модальных окон
function get_modals()
{
	// Массив для хранения модальных окон
	$modals = [];

	// WP_Query для получения всех записей типа modal
	$args = [
		'post_type' => 'modal',
		'posts_per_page' => -1,
	];

	$query = new WP_Query($args);

	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$modal_id = get_the_ID();  // Используем ID записи как ключ
			$modal_title = get_the_title();
			// Добавляем модальное окно в массив с ID как ключ
			$modals[$modal_id] = $modal_title;
		}
		wp_reset_postdata();
	}

	return $modals;
}

/**
 * REST API callback для получения телефонов
 * 
 * @return array Массив телефонов
 */
function get_redux_phones_api()
{
	$phones = get_redux_phones();
	return $phones;
}

/**
 * Получить все заполненные телефоны из Redux
 * 
 * @return array Массив телефонов в формате ['phone_01' => '+74951234567', ...]
 */
function get_redux_phones()
{
	// Проверяем, доступен ли Redux
	if (!class_exists('Redux')) {
		return [];
	}

	global $opt_name;
	
	// Если $opt_name не определен, используем значение по умолчанию из темы
	if (empty($opt_name)) {
		$opt_name = 'redux_demo';
	}
	
	// Массив для хранения заполненных телефонов
	$phones = [];
	
	// Список полей телефонов в Redux
	$phone_fields = ['phone_01', 'phone_02', 'phone_03', 'phone_04', 'phone_05'];
	
	// Получаем каждый телефон из Redux
	foreach ($phone_fields as $phone_field) {
		$phone_value = Redux::get_option($opt_name, $phone_field);
		
		// Добавляем только если телефон заполнен
		if (!empty($phone_value) && trim($phone_value) !== '') {
			$phone_raw = trim($phone_value);
			
			// Очищаем номер телефона, удаляя все символы кроме цифр
			try {
				if (function_exists('cleanNumber')) {
					$phone_cleaned = cleanNumber($phone_raw);
				} else {
					// Если функция недоступна, используем простую очистку
					$phone_cleaned = preg_replace('/\D/', '', $phone_raw);
				}
				
				// Добавляем только если очистка прошла успешно
				if (!empty($phone_cleaned)) {
					$phones[$phone_field] = $phone_cleaned;
				}
			} catch (Exception $e) {
				// В случае ошибки добавляем исходное значение
				error_log('Error cleaning phone number: ' . $e->getMessage());
				$phones[$phone_field] = $phone_raw;
			}
		}
	}
	
	return $phones;
}


