<?php
/**
 * Plugin Name:       Codeweber Gutenberg Elements
 * Description:       An addon for Codeweber theme.
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            Codeweber
 * Author URI:        https://naviddev.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       codeweber-gutenberg-blocks
 * Domain Path:       /languages
 */

 namespace Codeweber\Blocks;

 if (!defined('ABSPATH')) {
   header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
   exit;
 }

 define('GUTENBERG_BLOCKS_VERSION', '0.1.0');
 define('GUTENBERG_BLOCKS_URL', plugin_dir_url( __FILE__ ));
 define('GUTENBERG_BLOCKS_INC_URL', GUTENBERG_BLOCKS_URL . 'includes/');

 /**
	* Loads PSR-4-style plugin classes.
	*/
 function classloader($class) {
	 static $ns_offset;
	 if (strpos($class, __NAMESPACE__ . '\\') === 0) {
		 if ($ns_offset === NULL) {
			 $ns_offset = strlen(__NAMESPACE__) + 1;
		 }
		 include __DIR__ . '/inc/' . strtr(substr($class, $ns_offset), '\\', '/') . '.php';
	 }
 }
 spl_autoload_register(__NAMESPACE__ . '\classloader');



add_action('plugins_loaded', __NAMESPACE__ . '\Plugin::loadTextDomain');
add_action('plugins_loaded', __NAMESPACE__ . '\Plugin::initVideoThumbnailAPI');
add_action('plugins_loaded', __NAMESPACE__ . '\Plugin::initLoadMoreAPI');
add_action('init', function() {
	new ImageHotspotCPT();
}, 5); // Регистрируем раньше, чтобы CPT был доступен
add_action('init', __NAMESPACE__ . '\Plugin::perInit', 0);
add_action('init', __NAMESPACE__ . '\Plugin::init', 20);
//add_action('admin_init', __NAMESPACE__ . '\Admin::init');

// Подключаем REST API для опций и телефонов (подключаем рано, чтобы REST API зарегистрировался)
require_once plugin_dir_path(__FILE__) . 'settings/options_page/restapi.php';

// Загрузка переводов для JavaScript
	add_action('init', function() {
	$blocks = [
		'accordion', 'banners', 'button', 'card', 'column', 'columns', 'feature',
		'heading-subtitle', 'icon', 'image-simple', 'paragraph', 'section',
		'label-plus', 'yandex-map', 'swiper'
	];

	foreach ($blocks as $block) {
		$handle = 'codeweber-blocks-' . $block . '-editor-script';
		wp_set_script_translations(
			$handle,
			'codeweber-gutenberg-blocks',
			plugin_dir_path(__FILE__) . 'languages'
		);
	}
}, 999);

// Настройка Loco Translate
add_filter('loco_plugins_data', function($data) {
	$plugin_file = plugin_basename(__FILE__);

	// Регистрируем наш плагин в Loco
	if (!isset($data[$plugin_file])) {
		$data[$plugin_file] = [
			'Name' => 'Codeweber Gutenberg Elements',
			'TextDomain' => 'codeweber-gutenberg-blocks',
			'DomainPath' => '/languages',
		];
	}

	return $data;
});

// Автоматическая генерация POT файла перед синхронизацией в Loco Translate
// Это гарантирует, что строки из JS/JSX файлов будут в POT файле
add_action('loco_extract_before', function($project) {
	// Проверяем, что это наш плагин
	if ($project && method_exists($project, 'getDomain')) {
		$domain = $project->getDomain();
		if ($domain && $domain->getName() === 'codeweber-gutenberg-blocks') {
			$plugin_dir = plugin_dir_path(__FILE__);
			$pot_script = $plugin_dir . 'generate-pot.js';
			
			// Запускаем скрипт генерации POT файла перед синхронизацией
			if (file_exists($pot_script)) {
				$command = 'cd ' . escapeshellarg($plugin_dir) . ' && node generate-pot.js 2>&1';
				exec($command, $output, $return_var);
				
				// Логируем результат (только в режиме отладки)
				if (defined('WP_DEBUG') && WP_DEBUG) {
					if ($return_var === 0) {
						error_log('Loco Translate: POT file generated successfully before sync');
					} else {
						error_log('Loco Translate: POT generation failed: ' . implode("\n", $output));
					}
				}
			}
		}
	}
}, 10, 1);

// Автоматическая компиляция переводов после сохранения в Loco Translate
add_filter('loco_file_written', function($path) {
	// После сохранения переводов регенерируем MO и JSON файлы
	if (strpos($path, 'codeweber-gutenberg-blocks') !== false && strpos($path, '.po') !== false) {
		$plugin_dir = plugin_dir_path(__FILE__);
		// Запускаем компиляцию переводов
		exec("cd " . escapeshellarg($plugin_dir) . " && node compile-translations.js 2>&1", $output);
	}
	return $path;
});
