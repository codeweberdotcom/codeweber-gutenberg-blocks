<?php
/**
 * OpenStreet Map Block - Server-side render
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

$data_source   = $attributes['dataSource'] ?? 'custom';
$center        = $attributes['center'] ?? [ 'lat' => 55.76, 'lng' => 37.64 ];
$zoom          = (int) ( $attributes['zoom'] ?? 12 );
$height        = (int) ( $attributes['height'] ?? 450 );
$tile_layer    = $attributes['tileLayer'] ?? 'osm';
$border_radius = (int) ( $attributes['borderRadius'] ?? 8 );
$scroll_zoom   = (bool) ( $attributes['enableScrollZoom'] ?? false );
$drag          = (bool) ( $attributes['enableDrag'] ?? true );
$auto_fit      = (bool) ( $attributes['autoFitBounds'] ?? true );
$clustering    = (bool) ( $attributes['clustering'] ?? false );
$marker_color  = $attributes['markerColor'] ?? '#0d6efd';
$popup_fields  = $attributes['popupFields'] ?? [
	'showTitle'       => true,
	'showAddress'     => true,
	'showPhone'       => true,
	'showDescription' => false,
	'showLink'        => true,
];

$block_id  = ! empty( $attributes['blockId'] ) ? $attributes['blockId'] : 'osm-' . substr( md5( uniqid( '', true ) ), 0, 8 );
$map_id    = 'osm-map-' . $block_id;
$block_class = ! empty( $attributes['blockClass'] ) ? ' ' . esc_attr( $attributes['blockClass'] ) : '';

// Build markers array.
$markers = [];

if ( $data_source === 'cpt' ) {
	$cpt_query       = $attributes['cptQuery'] ?? [];
	$post_type       = sanitize_key( $cpt_query['postType'] ?? 'offices' );
	$posts_per_page  = isset( $cpt_query['postsPerPage'] ) ? (int) $cpt_query['postsPerPage'] : -1;
	$order_by        = sanitize_text_field( $cpt_query['orderBy'] ?? 'title' );
	$order           = sanitize_text_field( $cpt_query['order'] ?? 'asc' );
	$lat_field       = sanitize_text_field( $cpt_query['latField'] ?? '_office_latitude' );
	$lng_field       = sanitize_text_field( $cpt_query['lngField'] ?? '_office_longitude' );
	$address_field   = sanitize_text_field( $cpt_query['addressField'] ?? '' );
	$phone_field     = sanitize_text_field( $cpt_query['phoneField'] ?? '' );
	$desc_field      = sanitize_text_field( $cpt_query['descriptionField'] ?? '' );

	if ( $post_type && post_type_exists( $post_type ) ) {
		$query = new WP_Query( [
			'post_type'      => $post_type,
			'posts_per_page' => $posts_per_page > 0 ? $posts_per_page : -1,
			'post_status'    => 'publish',
			'orderby'        => $order_by,
			'order'          => $order,
		] );

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_id = get_the_ID();
				$lat     = get_post_meta( $post_id, $lat_field, true );
				$lng     = get_post_meta( $post_id, $lng_field, true );

				if ( empty( $lat ) || empty( $lng ) ) {
					continue;
				}

				$markers[] = [
					'id'          => $post_id,
					'lat'         => floatval( $lat ),
					'lng'         => floatval( $lng ),
					'title'       => get_the_title(),
					'address'     => $address_field ? esc_html( get_post_meta( $post_id, $address_field, true ) ) : '',
					'phone'       => $phone_field ? esc_html( get_post_meta( $post_id, $phone_field, true ) ) : '',
					'description' => $desc_field ? wp_kses_post( get_post_meta( $post_id, $desc_field, true ) ) : '',
					'link'        => get_permalink( $post_id ),
					'color'       => $marker_color,
				];
			}
			wp_reset_postdata();
		}
	}
} else {
	// Custom markers.
	$custom_markers = $attributes['customMarkers'] ?? [];
	foreach ( $custom_markers as $marker ) {
		$lat = floatval( $marker['coords']['lat'] ?? 0 );
		$lng = floatval( $marker['coords']['lng'] ?? 0 );
		if ( ! $lat && ! $lng ) {
			continue;
		}
		$markers[] = [
			'id'          => $marker['id'] ?? uniqid( 'osm-' ),
			'lat'         => $lat,
			'lng'         => $lng,
			'title'       => esc_html( $marker['title'] ?? '' ),
			'address'     => esc_html( $marker['address'] ?? '' ),
			'phone'       => esc_html( $marker['phone'] ?? '' ),
			'description' => wp_kses_post( $marker['description'] ?? '' ),
			'link'        => esc_url( $marker['link'] ?? '' ),
			'color'       => esc_attr( $marker['color'] ?? $marker_color ),
		];
	}
}

$map_center = [
	floatval( $center['lat'] ),
	floatval( $center['lng'] ),
];

$settings = [
	'center'      => $map_center,
	'zoom'        => $zoom,
	'tileLayer'   => $tile_layer,
	'scrollZoom'  => $scroll_zoom,
	'drag'        => $drag,
	'autoFit'     => $auto_fit,
	'clustering'  => $clustering,
	'popupFields' => $popup_fields,
	'markers'     => $markers,
];

$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => 'cwgb-osm-block' . $block_class,
] );

?>
<div <?php echo $wrapper_attributes; ?> data-block-id="<?php echo esc_attr( $block_id ); ?>">
	<div
		id="<?php echo esc_attr( $map_id ); ?>"
		class="cwgb-osm-map"
		data-osm-settings="<?php echo esc_attr( wp_json_encode( $settings ) ); ?>"
		style="height:<?php echo esc_attr( $height ); ?>px;border-radius:<?php echo esc_attr( $border_radius ); ?>px;overflow:hidden;"
	></div>
</div>
