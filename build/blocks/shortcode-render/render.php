<?php
/**
 * Shortcode Render block – frontend and editor output.
 *
 * @package CodeWeber Gutenberg Blocks
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

if (!defined('ABSPATH')) {
	exit;
}

// Атрибуты из разных источников (как в html-blocks)
if (!isset($attributes) && isset($parsed_block['attrs'])) {
	$attributes = $parsed_block['attrs'];
}
if (!isset($attributes) && isset($block) && is_object($block)) {
	if (method_exists($block, 'get_attributes')) {
		$attributes = $block->get_attributes();
	} elseif (property_exists($block, 'attributes')) {
		$attributes = $block->attributes;
	}
}
if (!isset($attributes) || !is_array($attributes)) {
	$attributes = [];
}

$shortcode = isset($attributes['shortcode']) ? trim((string) $attributes['shortcode']) : '';
if ($shortcode === '' && isset($block) && is_object($block) && !empty($block->attributes['shortcode'])) {
	$shortcode = trim((string) $block->attributes['shortcode']);
}

if ($shortcode === '') {
	if (current_user_can('edit_posts')) {
		echo '<p class="codeweber-shortcode-render-empty">';
		esc_html_e('Enter a shortcode in the block settings.', 'codeweber-gutenberg-blocks');
		echo '</p>';
	}
	return;
}

echo '<div class="wp-block-codeweber-blocks-shortcode-render">';
echo do_shortcode($shortcode);
echo '</div>';
