<?php
/**
 * Tab Panel Block - Server-side render
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner blocks rendered HTML.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tabs_id  = isset( $block->context['codeweber/tabsId'] ) ? $block->context['codeweber/tabsId'] : 'tabs';
$panel_id = isset( $attributes['panelId'] ) && $attributes['panelId']
	? $attributes['panelId']
	: ( 'panel-' . uniqid() );

$panel_id_html = $tabs_id . '-' . $panel_id;

// Determine if this is the first panel within this tabs block (active).
static $panel_counters = [];
$count                       = isset( $panel_counters[ $tabs_id ] ) ? $panel_counters[ $tabs_id ] : 0;
$is_active                   = ( 0 === $count );
$panel_counters[ $tabs_id ]  = $count + 1;

$classes = 'tab-pane fade' . ( $is_active ? ' active show' : '' );

echo '<div'
	. ' class="' . esc_attr( $classes ) . '"'
	. ' id="' . esc_attr( $panel_id_html ) . '"'
	. ' role="tabpanel"'
	. ' aria-labelledby="tab-' . esc_attr( $panel_id_html ) . '"'
	. '>';
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is rendered block markup
echo $content;
echo '</div>';
