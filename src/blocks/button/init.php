<?php
/**
 * Button Block - Инициализация
 * Форма кнопки "Theme": подставляет класс из Codeweber_Options::style('button') на фронте.
 *
 * @package CodeWeber Gutenberg Blocks
 */

if (!defined('ABSPATH')) {
	exit;
}

add_filter('render_block', 'codeweber_button_apply_theme_shape', 10, 2);

/**
 * Для кнопок с data-button-shape="theme" подставляет текущий класс из Codeweber_Options::style('button').
 * В контенте может быть любой класс формы (rounded-0, rounded-pill, rounded-xl) — заменяем на актуальный из темы.
 * Если тема возвращает пустую строку (стиль "Rounded" = стандартный Bootstrap border-radius) — удаляем placeholder-класс.
 */
function codeweber_button_apply_theme_shape($block_content, $block) {
	if (!isset($block['blockName']) || $block['blockName'] !== 'codeweber-blocks/button') {
		return $block_content;
	}
	if (strpos($block_content, 'data-button-shape="theme"') === false) {
		return $block_content;
	}
	$theme_class = class_exists('Codeweber_Options') ? trim(Codeweber_Options::style('button')) : '';

	if ($theme_class !== '') {
		$theme_class_esc = esc_attr($theme_class);
		// Убрать placeholder-класс формы и подставить класс темы
		$block_content = preg_replace(
			'/\s(rounded-0|rounded-pill|rounded-xl)(?=\s|")/',
			' ' . $theme_class_esc,
			$block_content,
			1
		);
		// Если в контенте не было placeholder-класса — добавить класс темы в class
		if (strpos($block_content, $theme_class_esc) === false) {
			$block_content = preg_replace(
				'/(<a\s[^>]*class=")([^"]*)("[^>]*data-button-shape="theme")/s',
				'$1$2 ' . $theme_class_esc . '$3',
				$block_content,
				1
			);
		}
	} else {
		// Тема "Rounded" (пустая строка) — удалить placeholder-класс, Bootstrap применит стандартный border-radius
		$block_content = preg_replace(
			'/\s(rounded-0|rounded-pill|rounded-xl)(?=\s|")/',
			'',
			$block_content,
			1
		);
	}

	$block_content = str_replace(' data-button-shape="theme"', '', $block_content);
	return $block_content;
}
