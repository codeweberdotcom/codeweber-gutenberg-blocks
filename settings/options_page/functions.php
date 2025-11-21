<?php

/**
 * Генерирует HTML для текстового поля с меткой и значением из JSON.
 *
 * @param string $name Имя поля для хранения и отображения в базе данных.
 * @return string HTML-код для текстового поля.
 */
function generate_text_field($name)
{
	// Путь к файлу fields.json
	$fields_json_path = plugin_dir_path(__FILE__) . 'fields.json';

	// Читаем данные из JSON
	$fields_data = json_decode(file_get_contents($fields_json_path), true);

	// Получаем значение метки из JSON для данного поля
	// Для перевода обернули метку в __()
	$label = isset($fields_data[$name]) ? __($fields_data[$name], 'codeweber-blocks') : ucfirst(str_replace('_', ' ', $name));

	// Получаем значение из базы данных по имени поля
	$value = esc_attr(get_option($name, ''));

	// Формируем HTML для label и input с использованием переведенной метки
	$input_html = "
        <label for=\"$name\">$label</label>
        <input name=\"$name\" id=\"$name\" type=\"text\" class=\"form-control mt-1 px-3 py-1\" value=\"$value\" placeholder=\"$label\">
    ";

	return $input_html;
}


