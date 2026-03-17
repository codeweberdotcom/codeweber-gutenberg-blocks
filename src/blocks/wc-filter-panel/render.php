<?php
/**
 * WC Filter Panel Block — Server-side render.
 *
 * Delegates to cw_render_filter_items() defined in the CodeWeber theme.
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'cw_render_filter_items' ) ) {
	echo '<p class="cwgb-notice">' . esc_html__( 'Для отображения фильтров активируйте тему CodeWeber.', 'codeweber-gutenberg-blocks' ) . '</p>';
	return;
}

$items = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : [];

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'cwgb-wc-filter-panel' ] );

echo '<div ' . $wrapper_attributes . '>'; // phpcs:ignore WordPress.Security.EscapeOutput
echo '<div class="cw-filter-panel">';
cw_render_filter_items( $items );
echo '</div>';
echo '</div>';
