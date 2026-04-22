<?php
/**
 * WC Filter Panel Block — Server-side render.
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

if ( ! function_exists( 'sanitize_html_class_list' ) ) {
	function sanitize_html_class_list( $classes ) {
		return implode( ' ', array_map( 'sanitize_html_class', explode( ' ', $classes ) ) );
	}
}

if ( ! function_exists( 'cw_render_filter_items' ) ) {
	echo '<p class="cwgb-notice">' . esc_html__( 'Для отображения фильтров активируйте тему CodeWeber.', 'codeweber-gutenberg-blocks' ) . '</p>';
	return;
}

$anchor = isset( $attributes['anchor'] ) ? trim( (string) $attributes['anchor'] ) : '';
$items  = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : [];

$panel_atts = [
	'section_style'      => in_array( $attributes['sectionStyle'] ?? 'plain', [ 'plain', 'accordion' ], true )
		? $attributes['sectionStyle'] : 'plain',
	'sections_open'      => isset( $attributes['sectionsOpen'] ) ? (bool) $attributes['sectionsOpen'] : true,
	'wrapper_class'      => isset( $attributes['wrapperClass'] ) ? sanitize_html_class_list( $attributes['wrapperClass'] ) : 'mb-4',
	'heading_tag'        => in_array( $attributes['headingTag'] ?? 'h4', [ 'h2', 'h3', 'h4', 'h5', 'h6', 'p' ], true )
		? $attributes['headingTag'] : 'h4',
	'heading_class'      => isset( $attributes['headingClass'] ) ? esc_attr( $attributes['headingClass'] ) : 'widget-title mb-3',
	'checkbox_size'      => in_array( $attributes['checkboxSize'] ?? '', [ '', 'sm' ], true )
		? $attributes['checkboxSize'] : '',
	'checkbox_item_class' => isset( $attributes['checkboxItemClass'] ) ? esc_attr( $attributes['checkboxItemClass'] ) : '',
	'radio_size'         => in_array( $attributes['radioSize'] ?? '', [ '', 'sm' ], true )
		? $attributes['radioSize'] : '',
	'radio_item_class'   => isset( $attributes['radioItemClass'] ) ? esc_attr( $attributes['radioItemClass'] ) : '',
	'button_size'        => in_array( $attributes['buttonSize'] ?? 'btn-sm', [ '', 'btn-xs', 'btn-sm', 'btn-lg' ], true )
		? $attributes['buttonSize'] : 'btn-sm',
	'button_style'       => in_array( $attributes['buttonStyle'] ?? 'outline', [ 'solid', 'outline', 'soft' ], true )
		? $attributes['buttonStyle'] : 'outline',
	'button_color'       => sanitize_html_class( $attributes['buttonColor'] ?? 'secondary' ),
	'button_extra_class' => isset( $attributes['buttonExtraClass'] ) ? esc_attr( $attributes['buttonExtraClass'] ) : '',
	'button_shape'       => ( function() use ( $attributes ) {
		$raw = $attributes['buttonShape'] ?? 'theme';
		if ( 'theme' === $raw ) {
			return class_exists( '\Codeweber_Options' ) ? trim( \Codeweber_Options::style( 'button' ) ) : 'rounded-pill';
		}
		return in_array( $raw, [ '', 'rounded-0', 'rounded-xl', 'rounded-pill' ], true ) ? $raw : '';
	} )(),
	'reset_label'        => isset( $attributes['resetLabel'] ) ? sanitize_text_field( $attributes['resetLabel'] ) : '',
	'slider_size'        => in_array( $attributes['sliderSize'] ?? 'lg', [ 'lg', 'md', 'sm' ], true )
		? $attributes['sliderSize'] : 'lg',
	'badge_size'         => in_array( $attributes['badgeSize'] ?? '', [ '', 'badge-lg' ], true )
		? ( $attributes['badgeSize'] ?? '' ) : '',
	'badge_shape'        => ( function() use ( $attributes ) {
		$raw = $attributes['badgeShape'] ?? 'rounded-pill';
		if ( 'theme' === $raw ) {
			return class_exists( '\Codeweber_Options' ) ? trim( \Codeweber_Options::style( 'button' ) ) : 'rounded-pill';
		}
		return in_array( $raw, [ '', 'rounded-0', 'rounded', 'rounded-pill' ], true ) ? $raw : 'rounded-pill';
	} )(),
	'badge_color'        => sanitize_html_class( $attributes['badgeColor'] ?? 'primary' ),
	'badge_extra_class'  => isset( $attributes['badgeExtraClass'] ) ? esc_attr( $attributes['badgeExtraClass'] ) : '',
	'navbar_scheme'      => in_array( $attributes['navbarScheme'] ?? 'navbar-light', [ 'navbar-light', 'navbar-dark' ], true )
		? $attributes['navbarScheme'] : 'navbar-light',
];

ob_start();
cw_render_filter_items( $items, $panel_atts );
$panel_html = ob_get_clean();

if ( '' !== trim( $panel_html ) ) {
	$wrapper_extra = [ 'class' => 'cwgb-wc-filter-panel' ];
	if ( $anchor ) {
		$wrapper_extra['id'] = $anchor;
	}
	$wrapper_attributes = get_block_wrapper_attributes( $wrapper_extra );
	echo '<div ' . $wrapper_attributes . '>'; // phpcs:ignore WordPress.Security.EscapeOutput
	echo $panel_html; // phpcs:ignore WordPress.Security.EscapeOutput
	echo '</div>';
}
