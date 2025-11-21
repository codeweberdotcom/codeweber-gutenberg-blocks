<?php
// Tab Title: Contacts

namespace Naviddev\GutenbergBlocks;

if (!defined('ABSPATH')) {
	exit; // Защита от прямого доступа
}

// Путь к JSON файлу с полями
$json_file = plugin_dir_path(__FILE__) . '../fields.json';

// Читаем и декодируем JSON файл
$fields = [];
if (file_exists($json_file)) {
	$fields = json_decode(file_get_contents($json_file), true);

	// Проверяем, что JSON распознан корректно
	if (json_last_error() !== JSON_ERROR_NONE) {
		$fields = [];
		error_log('Ошибка при чтении JSON: ' . json_last_error_msg());
	}
}

// Динамическое создание переменных
foreach ($fields as $field_key => $field_label) {
	${$field_key} = get_option($field_key, ''); // Создание переменной с именем ключа
}
?>

<h2><?php echo __('Contacts', 'codeweber-blocks'); ?></h2>

<a target="_blank" href="<?php echo esc_url(get_site_url() . '/wp-json/wp/v2/options'); ?>"><?php echo __('Link to RestApi data', 'codeweber-blocks'); ?></a>

<form method="post" action="options.php">
	<?php
	// Выводим поля для сохранения
	settings_fields('page_settings_group'); // Группа настроек
	do_settings_sections('page_settings_group'); // Для секций, если нужно
	?>

	<div class="form-table">
		<!-- Поле для Названия компании -->

		<div class="row">

			<div class="col-9">
				<div class="card card-body border">
					<h3><?php echo __('Company', 'codeweber-blocks'); ?></h3>
					<div class="mb-4">
						<?php echo generate_text_field('company_name'); ?>
					</div>
					<div class="mb-4">
						<?php echo generate_text_field('email'); ?>
					</div>
				</div>
			</div>

			<div class="col-3">
				<div class="card card-body border">
					<h3><?php echo __('Phones', 'codeweber-blocks'); ?></h3>
					<div class="mb-4">
						<?php echo generate_text_field('phone_number'); ?>
					</div>
					<div class="mb-4">
						<?php echo generate_text_field('phone_number_2'); ?>
					</div>
					<div class="mb-4">
						<?php echo generate_text_field('phone_number_3'); ?>
					</div>
				</div>
			</div>

		</div>
	</div>

	<p class="submit">
		<input type="submit" name="submit" id="submit" class="btn btn-blue btn-sm" value="<?php echo esc_attr(__('Сохранить изменения', 'codeweber-blocks')); ?>">
	</p>
</form>

