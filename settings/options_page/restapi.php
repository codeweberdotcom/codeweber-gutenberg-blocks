<?php
// Регистрируем REST API маршрут
add_action('rest_api_init', function () {
	register_rest_route('wp/v2', '/options', [
		'methods' => 'GET',
		'callback' => 'get_custom_option',
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

	// Добавляем данные телефонов
	foreach ($options as $key => $default_value) {
		if ($key === 'phones' && is_array($default_value)) {
			$phones = [];
			foreach ($default_value as $phone_key => $phone_default) {
				$phone_value = get_option($phone_key, $phone_default);
				$phones[$phone_key] = $phone_value;
			}
			$result['phones'] = $phones;
		} else {
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


