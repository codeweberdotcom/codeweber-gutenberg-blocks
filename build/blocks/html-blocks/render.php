<?php
/**
 * Html Blocks Block - Server-side render
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

if (!defined('ABSPATH')) {
    exit;
}

// Получаем атрибуты из разных источников
if (!isset($attributes) && isset($parsed_block['attrs'])) {
    $attributes = $parsed_block['attrs'];
}
if (!isset($attributes) && is_object($block)) {
    if (method_exists($block, 'get_attributes')) {
        $attributes = $block->get_attributes();
    } elseif (property_exists($block, 'attributes')) {
        $attributes = $block->attributes;
    }
}
if (!isset($attributes)) {
    $attributes = [];
}

$selected_block_id = isset($attributes['selectedBlockId']) ? intval($attributes['selectedBlockId']) : 0;
$block_class = isset($attributes['blockClass']) ? esc_attr($attributes['blockClass']) : '';
$block_id = isset($attributes['blockId']) ? esc_attr($attributes['blockId']) : '';
$block_data = isset($attributes['blockData']) ? esc_attr($attributes['blockData']) : '';
$anchor = isset($attributes['anchor']) ? trim((string) $attributes['anchor']) : '';

// Если блок не выбран, ничего не выводим
if (!$selected_block_id || $selected_block_id === 0) {
    return;
}

// Получаем пост из CPT html_blocks
$html_block_post = get_post($selected_block_id);

// Проверяем, что пост существует и это правильный тип
if (!$html_block_post || $html_block_post->post_type !== 'html_blocks' || $html_block_post->post_status !== 'publish') {
    return;
}

// Получаем контент поста без обработки (выводим HTML как есть).
// Raw output is intentional: html_blocks CPT is admin-controlled and designed
// for embedding arbitrary HTML (tracking codes, custom scripts, embeds).
// WordPress already filters post_content on save based on user capability
// (users without unfiltered_html have scripts stripped automatically).
$content = $html_block_post->post_content;

$html_id = $anchor ?: $block_id;
if ( $html_id || $block_class ) {
	$wrapper_open = '<div';
	if ( $html_id ) {
		$wrapper_open .= ' id="' . esc_attr( $html_id ) . '"';
	}
	if ( $block_class ) {
		$wrapper_open .= ' class="' . esc_attr( $block_class ) . '"';
	}
	$wrapper_open .= '>';
	echo $wrapper_open; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts
	echo wp_unslash( $content );
	echo '</div>';
} else {
	echo wp_unslash( $content );
}
