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

$data_source    = $attributes['dataSource'] ?? 'custom';
$center         = $attributes['center'] ?? [ 'lat' => 55.76, 'lng' => 37.64 ];
$zoom           = (int) ( $attributes['zoom'] ?? 12 );
$height         = (int) ( $attributes['height'] ?? 450 );
$tile_layer     = $attributes['tileLayer'] ?? 'osm';
$border_radius  = sanitize_html_class( $attributes['borderRadius'] ?? '' );
$scroll_zoom    = (bool) ( $attributes['enableScrollZoom'] ?? false );
$drag           = (bool) ( $attributes['enableDrag'] ?? true );
$auto_fit       = (bool) ( $attributes['autoFitBounds'] ?? true );
$clustering     = (bool) ( $attributes['clustering'] ?? false );
$marker_color   = $attributes['markerColor'] ?? '#0d6efd';
$marker_type    = sanitize_text_field( $attributes['markerType'] ?? 'dot-label' );
$popup_fields   = $attributes['popupFields'] ?? [
	'showTitle'       => true,
	'showAddress'     => true,
	'showPhone'       => true,
	'showDescription' => false,
	'showLink'        => true,
	'showStaff'       => false,
];

// Animation attributes.
$animation_type     = sanitize_html_class( $attributes['animationType'] ?? '' );
$animation_duration = (int) ( $attributes['animationDuration'] ?? 700 );
$animation_delay    = (int) ( $attributes['animationDelay'] ?? 0 );

$block_id    = ! empty( $attributes['blockId'] ) ? $attributes['blockId'] : 'osm-' . substr( md5( uniqid( '', true ) ), 0, 8 );
$map_id      = 'osm-map-' . $block_id;
$block_class = ! empty( $attributes['blockClass'] ) ? ' ' . esc_attr( $attributes['blockClass'] ) : '';

// Build wrapper class with Bootstrap border-radius.
$wrapper_class = 'cwgb-osm-block' . $block_class;
if ( $border_radius ) {
	$wrapper_class .= ' overflow-hidden ' . $border_radius;
}

// Animation data attributes.
$animation_attrs = '';
if ( $animation_type ) {
	$animation_attrs  = ' data-cue="' . esc_attr( $animation_type ) . '"';
	$animation_attrs .= ' data-duration="' . esc_attr( $animation_duration ) . '"';
	if ( $animation_delay > 0 ) {
		$animation_attrs .= ' data-delay="' . esc_attr( $animation_delay ) . '"';
	}
}

$markers = [];

// --- Offices preset ---
if ( $data_source === 'offices' && post_type_exists( 'offices' ) ) {
	$show_staff     = ! empty( $popup_fields['showStaff'] );
	$cpt_query      = $attributes['cptQuery'] ?? [];
	$posts_per_page = isset( $cpt_query['postsPerPage'] ) ? (int) $cpt_query['postsPerPage'] : -1;

	$query = new WP_Query( [
		'post_type'      => 'offices',
		'posts_per_page' => $posts_per_page > 0 ? $posts_per_page : -1,
		'post_status'    => 'publish',
		'orderby'        => 'title',
		'order'          => 'ASC',
	] );

	if ( $query->have_posts() ) {
		while ( $query->have_posts() ) {
			$query->the_post();
			$post_id = get_the_ID();
			$lat     = get_post_meta( $post_id, '_office_latitude', true );
			$lng     = get_post_meta( $post_id, '_office_longitude', true );

			if ( empty( $lat ) || empty( $lng ) ) {
				continue;
			}

			// City label from towns taxonomy.
			$city       = '';
			$town_terms = wp_get_post_terms( $post_id, 'towns', [ 'fields' => 'names' ] );
			if ( ! empty( $town_terms ) && ! is_wp_error( $town_terms ) ) {
				$city = $town_terms[0];
			}

			// Address: prefer street, fallback to full address.
			$address = get_post_meta( $post_id, '_office_street', true );
			if ( ! $address ) {
				$address = get_post_meta( $post_id, '_office_full_address', true );
			}

			// Staff members.
			$staff = [];
			if ( $show_staff ) {
				$staff_ids = get_post_meta( $post_id, '_office_staff', true );
				if ( is_array( $staff_ids ) ) {
					foreach ( $staff_ids as $sid ) {
						$sid = (int) $sid;
						if ( ! $sid ) {
							continue;
						}
						$s_name = trim(
							get_post_meta( $sid, '_staff_name', true ) . ' ' .
							get_post_meta( $sid, '_staff_surname', true )
						);
						if ( ! $s_name ) {
							$s_name = get_the_title( $sid );
						}
						$s_pos   = esc_html( get_post_meta( $sid, '_staff_position', true ) );
						$s_photo = '';
						$thumb   = (int) get_post_thumbnail_id( $sid );
						if ( $thumb ) {
							$img = wp_get_attachment_image_src( $thumb, [ 48, 48 ] );
							if ( $img ) {
								$s_photo = esc_url( $img[0] );
							}
						}
						$staff[] = [
							'name'     => esc_html( $s_name ),
							'position' => $s_pos,
							'photo'    => $s_photo,
						];
					}
				}
			}

			$markers[] = [
				'id'          => $post_id,
				'lat'         => floatval( $lat ),
				'lng'         => floatval( $lng ),
				'title'       => get_the_title(),
				'label'       => $city,
				'address'     => esc_html( $address ),
				'phone'       => esc_html( get_post_meta( $post_id, '_office_phone', true ) ),
				'description' => wp_kses_post( get_post_meta( $post_id, '_office_description', true ) ),
				'link'        => get_permalink( $post_id ),
				'color'       => $marker_color,
				'staff'       => $staff,
			];
		}
		wp_reset_postdata();
	}

// --- Staff preset ---
} elseif ( $data_source === 'staff' && post_type_exists( 'staff' ) ) {
	$cpt_query      = $attributes['cptQuery'] ?? [];
	$posts_per_page = isset( $cpt_query['postsPerPage'] ) ? (int) $cpt_query['postsPerPage'] : -1;

	$query = new WP_Query( [
		'post_type'      => 'staff',
		'posts_per_page' => $posts_per_page > 0 ? $posts_per_page : -1,
		'post_status'    => 'publish',
		'orderby'        => 'title',
		'order'          => 'ASC',
	] );

	if ( $query->have_posts() ) {
		while ( $query->have_posts() ) {
			$query->the_post();
			$post_id = get_the_ID();
			$lat     = get_post_meta( $post_id, '_staff_latitude', true );
			$lng     = get_post_meta( $post_id, '_staff_longitude', true );

			if ( empty( $lat ) || empty( $lng ) ) {
				continue;
			}

			$name = trim(
				get_post_meta( $post_id, '_staff_name', true ) . ' ' .
				get_post_meta( $post_id, '_staff_surname', true )
			);
			if ( ! $name ) {
				$name = get_the_title();
			}

			$photo = '';
			$thumb = (int) get_post_thumbnail_id( $post_id );
			if ( $thumb ) {
				$img = wp_get_attachment_image_src( $thumb, 'thumbnail' );
				if ( $img ) {
					$photo = esc_url( $img[0] );
				}
			}

			$markers[] = [
				'id'          => $post_id,
				'lat'         => floatval( $lat ),
				'lng'         => floatval( $lng ),
				'title'       => esc_html( $name ),
				'label'       => esc_html( $name ),
				'address'     => '',
				'phone'       => esc_html( get_post_meta( $post_id, '_staff_phone', true ) ),
				'description' => esc_html( get_post_meta( $post_id, '_staff_position', true ) ),
				'link'        => get_permalink( $post_id ),
				'color'       => $marker_color,
				'photo'       => $photo,
				'staff'       => [],
			];
		}
		wp_reset_postdata();
	}

// --- Any CPT (manual config) ---
} elseif ( $data_source === 'cpt' ) {
	$cpt_query      = $attributes['cptQuery'] ?? [];
	$post_type      = sanitize_key( $cpt_query['postType'] ?? 'offices' );
	$posts_per_page = isset( $cpt_query['postsPerPage'] ) ? (int) $cpt_query['postsPerPage'] : -1;
	$order_by       = sanitize_text_field( $cpt_query['orderBy'] ?? 'title' );
	$order          = sanitize_text_field( $cpt_query['order'] ?? 'asc' );
	$lat_field      = sanitize_text_field( $cpt_query['latField'] ?? '_office_latitude' );
	$lng_field      = sanitize_text_field( $cpt_query['lngField'] ?? '_office_longitude' );
	$address_field  = sanitize_text_field( $cpt_query['addressField'] ?? '' );
	$phone_field    = sanitize_text_field( $cpt_query['phoneField'] ?? '' );
	$desc_field     = sanitize_text_field( $cpt_query['descriptionField'] ?? '' );

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
					'label'       => '',
					'address'     => $address_field ? esc_html( get_post_meta( $post_id, $address_field, true ) ) : '',
					'phone'       => $phone_field ? esc_html( get_post_meta( $post_id, $phone_field, true ) ) : '',
					'description' => $desc_field ? wp_kses_post( get_post_meta( $post_id, $desc_field, true ) ) : '',
					'link'        => get_permalink( $post_id ),
					'color'       => $marker_color,
					'staff'       => [],
				];
			}
			wp_reset_postdata();
		}
	}

// --- Custom markers ---
} else {
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
			'label'       => '',
			'address'     => esc_html( $marker['address'] ?? '' ),
			'phone'       => esc_html( $marker['phone'] ?? '' ),
			'description' => wp_kses_post( $marker['description'] ?? '' ),
			'link'        => esc_url( $marker['link'] ?? '' ),
			'color'       => esc_attr( $marker['color'] ?? $marker_color ),
			'staff'       => [],
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
	'markerType'  => $marker_type,
	'popupFields' => $popup_fields,
	'markers'     => $markers,
];

// Enqueue Leaflet scripts (go to footer — safe after wp_head).
static $leaflet_enqueued = false;
if ( ! $leaflet_enqueued ) {
	$leaflet_enqueued = true;
	$lv = '1.9.4';
	$cv = '1.5.3';
	wp_enqueue_style( 'leaflet', "https://unpkg.com/leaflet@{$lv}/dist/leaflet.css", [], $lv );
	wp_enqueue_style( 'leaflet-markercluster', "https://unpkg.com/leaflet.markercluster@{$cv}/dist/MarkerCluster.css", [ 'leaflet' ], $cv );
	wp_enqueue_style( 'leaflet-markercluster-default', "https://unpkg.com/leaflet.markercluster@{$cv}/dist/MarkerCluster.Default.css", [ 'leaflet-markercluster' ], $cv );
	wp_enqueue_script( 'leaflet', "https://unpkg.com/leaflet@{$lv}/dist/leaflet.js", [], $lv, true );
	wp_enqueue_script( 'leaflet-markercluster', "https://unpkg.com/leaflet.markercluster@{$cv}/dist/leaflet.markercluster.js", [ 'leaflet' ], $cv, true );
	wp_enqueue_script(
		'codeweber-osm-init',
		GUTENBERG_BLOCKS_URL . 'assets/js/openstreet-map.js',
		[ 'leaflet', 'leaflet-markercluster' ],
		GUTENBERG_BLOCKS_VERSION,
		true
	);
}

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => $wrapper_class ] );

?>
<div <?php echo $wrapper_attributes; ?> data-block-id="<?php echo esc_attr( $block_id ); ?>"<?php echo $animation_attrs; ?>>
	<div
		id="<?php echo esc_attr( $map_id ); ?>"
		class="cwgb-osm-map"
		data-osm-settings="<?php echo esc_attr( wp_json_encode( $settings ) ); ?>"
		style="height:<?php echo esc_attr( $height ); ?>px;"
	></div>
</div>
