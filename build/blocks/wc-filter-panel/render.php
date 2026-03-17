<?php
/**
 * WC Filter Panel Block — Server-side render.
 *
 * Delegates to cw_render_filter_block() defined in the CodeWeber theme.
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

if ( ! function_exists( 'cw_render_filter_block' ) ) {
	echo '<p class="cwgb-notice">' . esc_html__( 'Для отображения фильтров активируйте тему CodeWeber.', 'codeweber-gutenberg-blocks' ) . '</p>';
	return;
}

// Map block attributes to cw_render_filter_block() format
$filter_atts = [
	'show_price'      => ! empty( $attributes['showPrice'] ),
	'show_categories' => ! empty( $attributes['showCategories'] ),
	'attributes'      => isset( $attributes['attributes'] ) && is_array( $attributes['attributes'] )
		? array_filter( array_map( 'sanitize_key', $attributes['attributes'] ) )
		: [],
	'show_rating'     => ! empty( $attributes['showRating'] ),
	'show_stock'      => ! empty( $attributes['showStock'] ),
	'display_mode'    => in_array( $attributes['displayMode'] ?? '', [ 'checkbox', 'list', 'button' ], true )
		? $attributes['displayMode']
		: 'checkbox',
	'show_count'      => isset( $attributes['showCount'] ) ? (bool) $attributes['showCount'] : true,
	'title'           => isset( $attributes['title'] ) ? sanitize_text_field( $attributes['title'] ) : '',
];

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'cwgb-wc-filter-panel' ] );

echo '<div ' . $wrapper_attributes . '>'; // phpcs:ignore WordPress.Security.EscapeOutput
cw_render_filter_block( $filter_atts );
echo '</div>';
