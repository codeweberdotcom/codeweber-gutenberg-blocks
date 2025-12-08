<?php

namespace Naviddev\GutenbergBlocks;

if (!defined('ABSPATH')) {
	exit; // Защита от прямого доступа
}

/**
 * Класс для создания вкладок (табеков) на странице настроек
 */
class Options_Tabs
{
	/**
	 * Сканирует папку страниц и создает вкладки
	 */
	public static function create_tabs()
	{
		// Путь к папке с шаблонами страниц
		$pages_dir = plugin_dir_path(__FILE__) . '../options_page/pages/';

		// Проверим, существует ли папка с шаблонами
		if (is_dir($pages_dir)) {
			$pages = scandir($pages_dir);
			$tabs = [];
			$content = '';

			foreach ($pages as $page) {
				// Пропускаем текущие и родительские директории
				if ($page == '.' || $page == '..') {
					continue;
				}

				// Создаем ссылку для вкладки
				$tabs[] = basename($page, '.php');

				// Считываем содержимое файла страницы
				$content .= self::load_page_content($pages_dir . $page);
			}

			// Выводим вкладки и контент
			self::render_tabs($tabs, $content, $pages_dir);
		}
	}

	/**
	 * Загружает содержимое страницы из файла
	 *
	 * @param string $file_path Путь к файлу шаблона страницы
	 * @return string Контент страницы
	 */
	private static function load_page_content($file_path)
	{
		ob_start();
		include $file_path;
		return ob_get_clean();
	}

	/**
	 * Отображает вкладки с контентом
	 *
	 * @param array $tabs Массив названий вкладок
	 * @param string $content Контент страниц
	 * @param string $pages_dir Путь к папке с шаблонами страниц
	 */
	private static function render_tabs($tabs, $content, $pages_dir)
	{
?>
		<ul class="nav nav-tabs nav-pills nav-tab-wrapper">
			<?php
			// Генерируем вкладки
			foreach ($tabs as $index => $tab) {
				// Извлекаем заголовок вкладки из комментария в файле
				$tab_title = self::get_tab_title_from_file($pages_dir . $tab . '.php');
				// Оборачиваем заголовок вкладки в функцию перевода
				$translated_tab_title = __($tab_title, 'codeweber-blocks');
			?>
				<li class="nav-item">
					<a href="#tab-<?php echo $tab; ?>" data-bs-toggle="tab" class="nav-link nav-tab ms-0" id="tab-link-<?php echo $tab; ?>">
						<?php echo esc_html($translated_tab_title); ?>
					</a>
				</li>
			<?php
			}
			?>
		</ul>

		<div class="tab-content">
			<?php
			// Генерируем контент вкладок
			foreach ($tabs as $index => $tab) {
			?>
				<div id="tab-<?php echo $tab; ?>" class="tab-pane card card-body">
					<?php
					// Загружаем контент для каждой вкладки
					echo self::load_page_content(plugin_dir_path(__FILE__) . '../options_page/pages/' . $tab . '.php');
					?>
				</div>
			<?php
			}
			?>
		</div>
		<script>
			document.addEventListener("DOMContentLoaded", function() {
				const tabs = document.querySelectorAll('.nav-tab');
				const panes = document.querySelectorAll('.tab-pane');

				tabs.forEach(function(tab, index) {
					tab.addEventListener('click', function(e) {
						e.preventDefault();

						tabs.forEach(function(t) {
							t.classList.remove('nav-tab-active');
						});
						tab.classList.add('nav-tab-active');

						panes.forEach(function(pane) {
							pane.style.display = 'none';
						});
						document.getElementById('tab-' + tab.id.replace('tab-link-', '')).style.display = 'block';
					});
				});

				// Активируем первую вкладку по умолчанию
				tabs[0].classList.add('nav-tab-active');
				panes[0].style.display = 'block';
			});
		</script>
<?php
	}

	/**
	 * Извлекает заголовок вкладки из комментария в файле
	 *
	 * @param string $file_path Путь к файлу страницы
	 * @return string Заголовок вкладки
	 */
	private static function get_tab_title_from_file($file_path)
	{
		$file_content = file_get_contents($file_path);
		preg_match('/\/\/\s*Tab\s*Title:\s*(.*)/', $file_content, $matches);
		return isset($matches[1]) ? trim($matches[1]) : __('Untitled', 'codeweber-gutenberg-blocks');
	}
}


