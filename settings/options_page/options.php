<?php

namespace Naviddev\GutenbergBlocks;


// Подключаем файл страницы опций
require_once plugin_dir_path(__FILE__) . 'functions.php';

//Подключаем регистрацию полей
require_once plugin_dir_path(__FILE__) . 'register_fields.php';


//Подключаем класс регистрации табов страницы
require_once plugin_dir_path(__FILE__) . 'class-options-tabs.php';


//Подключаем кастомный Restapi
require_once plugin_dir_path(__FILE__) . 'restapi.php';


if (!defined('ABSPATH')) {
	exit; // Защита от прямого доступа
}

// Регистрация страницы настроек в меню
function add_settings_page()
{
	add_menu_page(
		'Настройки плагина',    // Название страницы
		'Настройки плагина',    // Название в меню
		'manage_options',       // Права доступа
		'gutenberg_blocks_settings', // Слаг страницы
		__NAMESPACE__ . '\settings_page', // Функция для отображения страницы
		'dashicons-admin-generic' // Иконка для меню
	);
}
add_action('admin_menu', __NAMESPACE__ . '\add_settings_page');



// Функция для вывода контента на странице настроек
function settings_page()
{
?>
	<div class="wrap">
		<h1>Настройки плагина Gutenberg Blocks</h1>
		<?php
		// Вызов класса для отображения вкладок
		\Naviddev\GutenbergBlocks\Options_Tabs::create_tabs();
		?>
	</div>
<?php
}


