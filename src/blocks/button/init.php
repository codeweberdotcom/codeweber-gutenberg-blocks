<?php
/**
 * Button Block - Инициализация
 * Форма кнопки "Theme": подставляет класс из getThemeButton() на фронте.
 *
 * @package CodeWeber Gutenberg Blocks
 */

if (!defined('ABSPATH')) {
	exit;
}

add_filter('render_block', 'codeweber_button_apply_theme_shape', 10, 2);

/**
 * Для кнопок с data-button-shape="theme" подставляет текущий класс из getThemeButton().
 * В контенте может быть любой класс формы (rounded-0, rounded-pill, rounded-xl) — заменяем на актуальный из темы.
 */
function codeweber_button_apply_theme_shape($block_content, $block) {
	if (!isset($block['blockName']) || $block['blockName'] !== 'codeweber-blocks/button') {
		return $block_content;
	}
	if (strpos($block_content, 'data-button-shape="theme"') === false) {
		return $block_content;
	}
	$theme_class = function_exists('getThemeButton') ? trim(getThemeButton()) : 'rounded-pill';
	if ($theme_class === '') {
		$theme_class = 'rounded-pill';
	}
	$theme_class_esc = esc_attr($theme_class);
	// Убрать любой класс формы и подставить класс темы (в блоке одна кнопка)
	$block_content = preg_replace(
		'/\s(rounded-0|rounded-pill|rounded-xl)(?=\s|")/',
		' ' . $theme_class_esc,
		$block_content,
		1
	);
	// Если в контенте был сохранён класс темы без совпадения (например пустой rounded) — добавить класс в class
	if (strpos($block_content, $theme_class_esc) === false) {
		$block_content = preg_replace(
			'/(<a\s[^>]*class=")([^"]*)("[^>]*data-button-shape="theme")/s',
			'$1$2 ' . $theme_class_esc . '$3',
			$block_content,
			1
		);
	}
	$block_content = str_replace(' data-button-shape="theme"', '', $block_content);
	return $block_content;
}
