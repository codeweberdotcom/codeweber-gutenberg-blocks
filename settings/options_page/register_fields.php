<?php

namespace Naviddev\GutenbergBlocks;

if (!defined('ABSPATH')) {
	exit; // Защита от прямого доступа
}

function register_page_settings()
{
	// Путь к JSON файлу с полями
	$json_file = plugin_dir_path(__FILE__) . 'fields.json';

	// Читаем и декодируем JSON файл
	if (file_exists($json_file)) {
		$fields = json_decode(file_get_contents($json_file), true);

		// Проверяем, что JSON распознан корректно
		if (json_last_error() === JSON_ERROR_NONE) {
			// Регистрация каждого поля из JSON файла
			foreach ($fields as $field_key => $field_label) {
				// Если $field_label - массив, преобразуем его в строку
				if (is_array($field_label)) {
					$field_label = implode(', ', $field_label); // Преобразуем массив в строку
				}

				// Переводим метку с помощью __() функции
				$translated_label = __($field_label, 'codeweber-blocks');

				// Регистрируем поле с переведенной меткой
				register_setting('page_settings_group', $field_key, [
					'type' => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				]);

				// Выводим переведенную метку в форму (если требуется)
				add_settings_section(
					$field_key . '_section', // уникальный идентификатор для секции
					$translated_label, // переведенная метка
					null, // описание секции (не нужно в данном случае)
					'page_settings' // страница, на которой будет отображаться
				);
			}
		} else {
			error_log('Ошибка при чтении JSON: ' . json_last_error_msg());
		}
	} else {
		error_log('JSON файл не найден по пути: ' . $json_file);
	}
}

add_action('admin_init', 'Naviddev\GutenbergBlocks\register_page_settings');


