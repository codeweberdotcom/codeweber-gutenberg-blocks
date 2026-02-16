<?php
/**
 * Card Block - Инициализация
 * Добавляет класс скругления из Redux (getThemeCardImageRadius) при «Радиус границы» = по умолчанию.
 * Аналогично блоку Accordion.
 *
 * @package CodeWeber Gutenberg Blocks
 */

if (!defined('ABSPATH')) {
	exit;
}

add_filter('render_block', 'codeweber_card_apply_default_border_radius', 10, 2);

function codeweber_card_apply_default_border_radius($block_content, $block) {
	if (!isset($block['blockName']) || $block['blockName'] !== 'codeweber-blocks/card') {
		return $block_content;
	}

	$attrs = $block['attrs'] ?? [];
	$cardType = $attrs['cardType'] ?? 'card';
	$enableCard = isset($attrs['enableCard']) ? $attrs['enableCard'] : true;
	$borderRadius = $attrs['borderRadius'] ?? '';

	if ($cardType !== 'card' || !$enableCard || $borderRadius !== '') {
		return $block_content;
	}

	$radius_class = function_exists('getThemeCardImageRadius') ? getThemeCardImageRadius() : '';
	if (empty($radius_class)) {
		return $block_content;
	}

	return preg_replace(
		'/(<div\s+[^>]*?class=")([^"]*)(")/s',
		'$1$2 ' . esc_attr(trim($radius_class)) . '$3',
		$block_content,
		1
	);
}
