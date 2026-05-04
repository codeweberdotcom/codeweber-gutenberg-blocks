<?php
/**
 * Yandex Map v3 - Server-side render
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

if ( ! class_exists( '\Codeweber_Yandex_Maps' ) ) {
	echo '<div class="alert alert-warning">' . esc_html__( 'Yandex Maps class is not available.', 'codeweber-gutenberg-blocks' ) . '</div>';
	return;
}

$yandex_maps = \Codeweber_Yandex_Maps::get_instance();

if ( ! $yandex_maps->has_api_key() ) {
	echo '<div class="alert alert-warning">' . esc_html__( 'Yandex Maps API key is not configured.', 'codeweber-gutenberg-blocks' ) . '</div>';
	return;
}

// ── Attributes ──────────────────────────────────────────────────────────────

$data_source    = isset( $attributes['dataSource'] ) ? $attributes['dataSource'] : 'offices';
$center_attr    = isset( $attributes['center'] ) ? $attributes['center'] : array( 'lat' => 55.76, 'lng' => 37.64 );
$zoom           = isset( $attributes['zoom'] ) ? (int) $attributes['zoom'] : 10;
$height         = isset( $attributes['height'] ) ? (int) $attributes['height'] : 500;
$map_type       = isset( $attributes['mapType'] ) ? $attributes['mapType'] : 'normal';
$color_scheme   = isset( $attributes['colorScheme'] ) ? $attributes['colorScheme'] : 'light';
$custom_style   = isset( $attributes['customStyleJson'] ) ? $attributes['customStyleJson'] : '';
$border_radius  = isset( $attributes['borderRadius'] ) ? (int) $attributes['borderRadius'] : 8;
$scroll_zoom    = isset( $attributes['enableScrollZoom'] ) ? (bool) $attributes['enableScrollZoom'] : true;
$enable_drag    = isset( $attributes['enableDrag'] ) ? (bool) $attributes['enableDrag'] : true;
$auto_fit       = isset( $attributes['autoFitBounds'] ) ? (bool) $attributes['autoFitBounds'] : true;
$marker_color   = isset( $attributes['markerColor'] ) ? $attributes['markerColor'] : '#FF0000';

$balloon_fields = isset( $attributes['balloonFields'] ) && is_array( $attributes['balloonFields'] )
	? $attributes['balloonFields']
	: array(
		'showCity'         => true,
		'showAddress'      => true,
		'showPhone'        => true,
		'showWorkingHours' => true,
		'showLink'         => true,
		'showDescription'  => false,
	);

$show_sidebar     = isset( $attributes['showSidebar'] ) ? (bool) $attributes['showSidebar'] : false;
$sidebar_position = isset( $attributes['sidebarPosition'] ) ? $attributes['sidebarPosition'] : 'left';
$sidebar_title    = isset( $attributes['sidebarTitle'] ) ? $attributes['sidebarTitle'] : '';
$show_filters     = isset( $attributes['showFilters'] ) ? (bool) $attributes['showFilters'] : false;
$filter_by_city   = isset( $attributes['filterByCity'] ) ? (bool) $attributes['filterByCity'] : false;
$filter_by_cat    = isset( $attributes['filterByCategory'] ) ? (bool) $attributes['filterByCategory'] : false;
$sidebar_fields   = isset( $attributes['sidebarFields'] ) && is_array( $attributes['sidebarFields'] )
	? $attributes['sidebarFields']
	: array(
		'showCity'         => true,
		'showAddress'      => false,
		'showPhone'        => false,
		'showWorkingHours' => true,
		'showDescription'  => true,
	);

$block_class = isset( $attributes['blockClass'] ) ? $attributes['blockClass'] : '';
$block_id    = isset( $attributes['blockId'] ) && ! empty( $attributes['blockId'] )
	? $attributes['blockId']
	: 'cwgb-map-v3-' . uniqid();

// ── Build markers ────────────────────────────────────────────────────────────

$markers = array();

if ( $data_source === 'offices' ) {
	$offices_query   = isset( $attributes['officesQuery'] ) ? $attributes['officesQuery'] : array();
	$posts_per_page  = isset( $offices_query['postsPerPage'] ) ? (int) $offices_query['postsPerPage'] : -1;
	$order_by        = isset( $offices_query['orderBy'] ) ? $offices_query['orderBy'] : 'title';
	$order           = isset( $offices_query['order'] ) ? $offices_query['order'] : 'asc';
	$selected_cities = isset( $offices_query['selectedCities'] ) && is_array( $offices_query['selectedCities'] )
		? array_filter( array_map( 'sanitize_text_field', $offices_query['selectedCities'] ) )
		: array();
	$selected_cats   = isset( $offices_query['selectedCategories'] ) && is_array( $offices_query['selectedCategories'] )
		? array_filter( array_map( 'absint', $offices_query['selectedCategories'] ) )
		: array();

	$args = array(
		'post_type'      => 'offices',
		'posts_per_page' => $posts_per_page,
		'post_status'    => 'publish',
		'orderby'        => $order_by,
		'order'          => $order,
	);

	if ( ! empty( $selected_cities ) ) {
		$args['meta_query'][] = array(
			'key'     => '_office_city',
			'value'   => $selected_cities,
			'compare' => 'IN',
		);
	}

	if ( ! empty( $selected_cats ) ) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => 'office_category',
				'field'    => 'term_id',
				'terms'    => array_map( 'intval', $selected_cats ),
				'operator' => 'IN',
			),
		);
	}

	$offices = new WP_Query( $args );

	if ( $offices->have_posts() ) {
		while ( $offices->have_posts() ) {
			$offices->the_post();
			$post_id   = get_the_ID();
			$latitude  = get_post_meta( $post_id, '_office_latitude', true );
			$longitude = get_post_meta( $post_id, '_office_longitude', true );

			if ( empty( $latitude ) || empty( $longitude ) ) {
				continue;
			}

			$street          = get_post_meta( $post_id, '_office_street', true );
			$display_address = $street ?: get_post_meta( $post_id, '_office_full_address', true );

			$markers[] = array(
				'id'           => $post_id,
				'latitude'     => floatval( $latitude ),
				'longitude'    => floatval( $longitude ),
				'title'        => get_the_title(),
				'address'      => $display_address,
				'phone'        => get_post_meta( $post_id, '_office_phone', true ),
				'workingHours' => get_post_meta( $post_id, '_office_working_hours', true ),
				'city'         => get_post_meta( $post_id, '_office_city', true ),
				'link'         => get_permalink( $post_id ),
				'description'  => get_post_meta( $post_id, '_office_description', true ),
			);
		}
		wp_reset_postdata();
	}
} else {
	$custom_markers = isset( $attributes['customMarkers'] ) && is_array( $attributes['customMarkers'] )
		? $attributes['customMarkers']
		: array();

	foreach ( $custom_markers as $marker ) {
		if ( ! isset( $marker['coords']['lat'] ) || ! isset( $marker['coords']['lng'] ) ) {
			continue;
		}
		$markers[] = array(
			'id'           => isset( $marker['id'] ) ? $marker['id'] : uniqid( 'marker-' ),
			'latitude'     => floatval( $marker['coords']['lat'] ),
			'longitude'    => floatval( $marker['coords']['lng'] ),
			'title'        => isset( $marker['title'] ) ? $marker['title'] : '',
			'address'      => isset( $marker['address'] ) ? $marker['address'] : '',
			'phone'        => isset( $marker['phone'] ) ? $marker['phone'] : '',
			'workingHours' => isset( $marker['workingHours'] ) ? $marker['workingHours'] : '',
			'city'         => isset( $marker['city'] ) ? $marker['city'] : '',
			'link'         => isset( $marker['link'] ) ? $marker['link'] : '',
			'description'  => isset( $marker['description'] ) ? $marker['description'] : '',
		);
	}
}

// ── Editor placeholder (REST context = ServerSideRender preview) ─────────────

if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
	$marker_count = count( $markers );
	$scheme_label = esc_html( $color_scheme );
	$wrapper_attr = get_block_wrapper_attributes( array( 'class' => 'cwgb-yandex-map-v3-block' . ( $block_class ? ' ' . esc_attr( $block_class ) : '' ) ) );
	echo '<div ' . $wrapper_attr . '>';
	echo '<div style="'
		. 'height:' . esc_attr( $height ) . 'px;'
		. 'border-radius:' . esc_attr( $border_radius ) . 'px;'
		. 'background:#e8eaed;'
		. 'display:flex;flex-direction:column;align-items:center;justify-content:center;'
		. 'color:#666;font-family:sans-serif;gap:8px;">'
		. '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5">'
		. '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>'
		. '<circle cx="12" cy="9" r="2.5"/>'
		. '</svg>'
		. '<span style="font-size:13px;font-weight:600;">Yandex Map v3</span>'
		. '<span style="font-size:12px;color:#999;">'
		. esc_html( sprintf( '%s · %dpx · %d markers', $scheme_label, $height, $marker_count ) )
		. '</span>'
		. '</div>';
	echo '</div>';
	return;
}

// ── Frontend render via theme's render_map() ─────────────────────────────────

$map_args = array(
	'api_version'         => 3,
	'map_id'              => $block_id,
	// center as [lat, lng] — render_map swaps to [lng, lat] for v3
	'center'              => array( floatval( $center_attr['lat'] ), floatval( $center_attr['lng'] ) ),
	'zoom'                => $zoom,
	'height'              => $height,
	'map_type'            => $map_type,
	'border_radius'       => $border_radius,
	'enable_scroll_zoom'  => $scroll_zoom,
	'enable_drag'         => $enable_drag,
	'auto_fit_bounds'     => $auto_fit,
	'marker_type'         => 'custom',
	'marker_color'        => $marker_color,
	'balloon_fields'      => $balloon_fields,
	'show_sidebar'        => $show_sidebar,
	'sidebar_position'    => $sidebar_position,
	'sidebar_title'       => $sidebar_title,
	'show_filters'        => $show_filters,
	'filter_by_city'      => $filter_by_city,
	'filter_by_category'  => $filter_by_cat,
	'sidebar_fields'      => $sidebar_fields,
	'color_scheme'        => $color_scheme,
	'color_scheme_custom' => $custom_style,
);

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class'         => 'cwgb-yandex-map-v3-block' . ( $block_class ? ' ' . esc_attr( $block_class ) : '' ),
	'data-block-id' => esc_attr( $block_id ),
) );

echo '<div ' . $wrapper_attributes . '>';
echo $yandex_maps->render_map( $map_args, $markers );
echo '</div>';
