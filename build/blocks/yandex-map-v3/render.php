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

// API key via theme's Yandex Maps class
if ( ! class_exists( 'Codeweber_Yandex_Maps' ) ) {
	echo '<div class="alert alert-warning">' . esc_html__( 'Yandex Maps class is not available.', 'codeweber-gutenberg-blocks' ) . '</div>';
	return;
}

$yandex_maps = Codeweber_Yandex_Maps::get_instance();

if ( ! $yandex_maps->has_api_key() ) {
	echo '<div class="alert alert-warning">' . esc_html__( 'Yandex Maps API key is not configured.', 'codeweber-gutenberg-blocks' ) . '</div>';
	return;
}

$api_key = $yandex_maps->get_api_key();

// Attributes
$data_source  = isset( $attributes['dataSource'] ) ? $attributes['dataSource'] : 'offices';
$center       = isset( $attributes['center'] ) ? $attributes['center'] : array( 'lat' => 55.76, 'lng' => 37.64 );
$zoom         = isset( $attributes['zoom'] ) ? (int) $attributes['zoom'] : 10;
$height       = isset( $attributes['height'] ) ? (int) $attributes['height'] : 500;
$map_type     = isset( $attributes['mapType'] ) ? $attributes['mapType'] : 'normal';
$color_scheme = isset( $attributes['colorScheme'] ) ? $attributes['colorScheme'] : 'light';
$custom_style = isset( $attributes['customStyleJson'] ) ? $attributes['customStyleJson'] : '';
$border_radius    = isset( $attributes['borderRadius'] ) ? (int) $attributes['borderRadius'] : 8;
$enable_scroll_zoom = isset( $attributes['enableScrollZoom'] ) ? (bool) $attributes['enableScrollZoom'] : true;
$enable_drag      = isset( $attributes['enableDrag'] ) ? (bool) $attributes['enableDrag'] : true;
$auto_fit_bounds  = isset( $attributes['autoFitBounds'] ) ? (bool) $attributes['autoFitBounds'] : true;
$marker_color     = isset( $attributes['markerColor'] ) ? $attributes['markerColor'] : '#FF0000';
$balloon_fields   = isset( $attributes['balloonFields'] ) && is_array( $attributes['balloonFields'] )
	? $attributes['balloonFields']
	: array(
		'showCity'         => true,
		'showAddress'      => true,
		'showPhone'        => true,
		'showWorkingHours' => true,
		'showLink'         => true,
		'showDescription'  => false,
	);

// Unique map ID
$block_id = isset( $attributes['blockId'] ) && ! empty( $attributes['blockId'] )
	? $attributes['blockId']
	: 'cwgb-map-v3-' . uniqid();

// Build markers
// IMPORTANT: v3 API uses [longitude, latitude] — inverted vs v2!
$markers = array();

if ( $data_source === 'offices' ) {
	$offices_query    = isset( $attributes['officesQuery'] ) ? $attributes['officesQuery'] : array();
	$posts_per_page   = isset( $offices_query['postsPerPage'] ) ? (int) $offices_query['postsPerPage'] : -1;
	$order_by         = isset( $offices_query['orderBy'] ) ? $offices_query['orderBy'] : 'title';
	$order            = isset( $offices_query['order'] ) ? $offices_query['order'] : 'asc';
	$selected_cities  = isset( $offices_query['selectedCities'] ) && is_array( $offices_query['selectedCities'] )
		? array_filter( array_map( 'sanitize_text_field', $offices_query['selectedCities'] ) )
		: array();
	$selected_cats    = isset( $offices_query['selectedCategories'] ) && is_array( $offices_query['selectedCategories'] )
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
				// v3: [longitude, latitude]
				'coords'       => array( floatval( $longitude ), floatval( $latitude ) ),
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
			// v3: [longitude, latitude]
			'coords'       => array( floatval( $marker['coords']['lng'] ), floatval( $marker['coords']['lat'] ) ),
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

// Map center — v3: [longitude, latitude]
$map_center = array( floatval( $center['lng'] ), floatval( $center['lat'] ) );

// Auto-fit: use first marker's coords as center
if ( $auto_fit_bounds && ! empty( $markers ) ) {
	$map_center = $markers[0]['coords'];
}

$map_data = array(
	'id'              => $block_id,
	'center'          => $map_center,
	'zoom'            => $zoom,
	'mapType'         => $map_type,
	'colorScheme'     => $color_scheme,
	'customStyle'     => $custom_style,
	'markerColor'     => $marker_color,
	'markers'         => $markers,
	'balloon'         => $balloon_fields,
	'enableScrollZoom' => $enable_scroll_zoom,
	'enableDrag'       => $enable_drag,
	'autoFitBounds'    => $auto_fit_bounds,
);

// Enqueue Yandex Maps v3 API (registered in Plugin.php) and frontend script
wp_enqueue_script( 'yandex-maps-api-v3' );
wp_enqueue_script( 'cwgb-yandex-map-v3' );

// Wrapper
$block_class      = isset( $attributes['blockClass'] ) ? $attributes['blockClass'] : '';
$wrapper_classes  = 'cwgb-yandex-map-v3-block';
if ( ! empty( $block_class ) ) {
	$wrapper_classes .= ' ' . esc_attr( $block_class );
}

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class'        => $wrapper_classes,
	'data-block-id' => esc_attr( $block_id ),
) );

echo '<div ' . $wrapper_attributes . '>';
echo '<div id="' . esc_attr( $block_id ) . '" class="cwgb-yandex-map-v3-container"'
	. ' data-map-v3="' . esc_attr( wp_json_encode( $map_data ) ) . '"'
	. ' style="height:' . esc_attr( $height ) . 'px; border-radius:' . esc_attr( $border_radius ) . 'px;"'
	. '></div>';
echo '</div>';
