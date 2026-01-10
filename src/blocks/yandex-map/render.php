<?php
/**
 * Yandex Map - Server-side render
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

// Проверяем наличие класса Yandex Maps
if (!class_exists('Codeweber_Yandex_Maps')) {
	echo '<div class="alert alert-warning">' . __('Yandex Maps class is not available.', 'codeweber-gutenberg-blocks') . '</div>';
	return;
}

// Получаем экземпляр класса
$yandex_maps = Codeweber_Yandex_Maps::get_instance();

// Проверяем наличие API ключа
if (!$yandex_maps->has_api_key()) {
	echo '<div class="alert alert-warning">' . __('Yandex Maps API key is not configured.', 'codeweber-gutenberg-blocks') . '</div>';
	return;
}

// Извлекаем атрибуты с значениями по умолчанию
$data_source = isset($attributes['dataSource']) ? $attributes['dataSource'] : 'offices';
$center = isset($attributes['center']) ? $attributes['center'] : ['lat' => 55.76, 'lng' => 37.64];
$zoom = isset($attributes['zoom']) ? (int) $attributes['zoom'] : 10;
$height = isset($attributes['height']) ? (int) $attributes['height'] : 500;
$map_type = isset($attributes['mapType']) ? $attributes['mapType'] : 'yandex#map';
$border_radius = isset($attributes['borderRadius']) ? (int) $attributes['borderRadius'] : 8;
$enable_scroll_zoom = isset($attributes['enableScrollZoom']) ? (bool) $attributes['enableScrollZoom'] : true;
$enable_drag = isset($attributes['enableDrag']) ? (bool) $attributes['enableDrag'] : true;
$enable_dbl_click_zoom = isset($attributes['enableDblClickZoom']) ? (bool) $attributes['enableDblClickZoom'] : true;
$auto_fit_bounds = isset($attributes['autoFitBounds']) ? (bool) $attributes['autoFitBounds'] : true;
$search_control = isset($attributes['searchControl']) ? (bool) $attributes['searchControl'] : false;
$geolocation_control = isset($attributes['geolocationControl']) ? (bool) $attributes['geolocationControl'] : false;
$route_button = isset($attributes['routeButton']) ? (bool) $attributes['routeButton'] : false;
$show_sidebar = isset($attributes['showSidebar']) ? (bool) $attributes['showSidebar'] : false;
$sidebar_position = isset($attributes['sidebarPosition']) ? $attributes['sidebarPosition'] : 'left';
$sidebar_title = isset($attributes['sidebarTitle']) ? $attributes['sidebarTitle'] : '';
$show_filters = isset($attributes['showFilters']) ? (bool) $attributes['showFilters'] : false;
$filter_by_city = isset($attributes['filterByCity']) ? (bool) $attributes['filterByCity'] : false;
$filter_by_category = isset($attributes['filterByCategory']) ? (bool) $attributes['filterByCategory'] : false;
$clusterer = isset($attributes['clusterer']) ? (bool) $attributes['clusterer'] : false;
$clusterer_preset = isset($attributes['clustererPreset']) ? $attributes['clustererPreset'] : 'islands#invertedVioletClusterIcons';
$marker_type = isset($attributes['markerType']) ? $attributes['markerType'] : 'default';
$marker_preset = isset($attributes['markerPreset']) ? $attributes['markerPreset'] : 'islands#redDotIcon';
$marker_color = isset($attributes['markerColor']) ? $attributes['markerColor'] : '#FF0000';
$marker_auto_open_balloon = isset($attributes['markerAutoOpenBalloon']) ? (bool) $attributes['markerAutoOpenBalloon'] : false;
$balloon_max_width = isset($attributes['balloonMaxWidth']) ? (int) $attributes['balloonMaxWidth'] : 300;
$balloon_close_button = isset($attributes['balloonCloseButton']) ? (bool) $attributes['balloonCloseButton'] : true;
$balloon_fields = isset($attributes['balloonFields']) && is_array($attributes['balloonFields']) 
	? $attributes['balloonFields'] 
	: array(
		'showCity' => true,
		'showAddress' => true,
		'showPhone' => true,
		'showWorkingHours' => true,
		'showLink' => true,
		'showDescription' => false,
	);
$sidebar_fields = isset($attributes['sidebarFields']) && is_array($attributes['sidebarFields']) 
	? $attributes['sidebarFields'] 
	: array(
		'showCity' => true,
		'showAddress' => false,
		'showPhone' => false,
		'showWorkingHours' => true,
		'showDescription' => true,
	);

// Генерируем уникальный ID для карты
$block_id = isset($attributes['blockId']) && !empty($attributes['blockId']) 
	? $attributes['blockId'] 
	: 'gutenberg-map-' . uniqid();
$map_id = 'yandex-map-' . $block_id;

// Подготовка маркеров
$markers = [];

if ($data_source === 'offices') {
	// Режим: Офисы из CPT
	$offices_query = isset($attributes['officesQuery']) ? $attributes['officesQuery'] : [];
	$posts_per_page = isset($offices_query['postsPerPage']) ? (int) $offices_query['postsPerPage'] : -1;
	$order_by = isset($offices_query['orderBy']) ? $offices_query['orderBy'] : 'title';
	$order = isset($offices_query['order']) ? $offices_query['order'] : 'asc';
	$selected_cities = isset($offices_query['selectedCities']) && is_array($offices_query['selectedCities']) ? $offices_query['selectedCities'] : [];
	$selected_categories = isset($offices_query['selectedCategories']) && is_array($offices_query['selectedCategories']) ? $offices_query['selectedCategories'] : [];
	
	$args = array(
		'post_type' => 'offices',
		'posts_per_page' => $posts_per_page,
		'post_status' => 'publish',
		'orderby' => $order_by,
		'order' => $order,
	);
	
	// Фильтрация по городам
	if (!empty($selected_cities)) {
		$args['meta_query'][] = array(
			'key' => '_office_city',
			'value' => $selected_cities,
			'compare' => 'IN',
		);
	}
	
	// Фильтрация по категориям (если есть таксономия)
	if (!empty($selected_categories)) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => 'office_category', // Предполагаемая таксономия
				'field' => 'term_id',
				'terms' => array_map('intval', $selected_categories),
				'operator' => 'IN',
			),
		);
	}
	
	$offices = new WP_Query($args);
	
	if ($offices->have_posts()) {
		while ($offices->have_posts()) {
			$offices->the_post();
			$post_id = get_the_ID();
			
			$latitude = get_post_meta($post_id, '_office_latitude', true);
			$longitude = get_post_meta($post_id, '_office_longitude', true);
			
			// Пропускаем офисы без координат
			if (empty($latitude) || empty($longitude)) {
				continue;
			}
			
			// Получаем адрес - используем _office_full_address, если пусто, формируем из частей
			$full_address = get_post_meta($post_id, '_office_full_address', true);
			if (empty($full_address)) {
				$address_parts = array();
				$street = get_post_meta($post_id, '_office_street', true);
				$city_meta = get_post_meta($post_id, '_office_city', true);
				$region = get_post_meta($post_id, '_office_region', true);
				$country = get_post_meta($post_id, '_office_country', true);
				$postal_code = get_post_meta($post_id, '_office_postal_code', true);
				
				if ($street) $address_parts[] = $street;
				if ($city_meta) $address_parts[] = $city_meta;
				if ($region) $address_parts[] = $region;
				if ($country) $address_parts[] = $country;
				if ($postal_code) $address_parts[] = $postal_code;
				
				$full_address = implode(', ', $address_parts);
			}
			
			$markers[] = array(
				'id' => $post_id,
				'latitude' => floatval($latitude),
				'longitude' => floatval($longitude),
				'title' => get_the_title(),
				'address' => $full_address,
				'phone' => get_post_meta($post_id, '_office_phone', true),
				'workingHours' => get_post_meta($post_id, '_office_working_hours', true),
				'city' => get_post_meta($post_id, '_office_city', true),
				'link' => get_permalink($post_id),
				'description' => get_post_meta($post_id, '_office_description', true),
			);
		}
		wp_reset_postdata();
	}
} else {
	// Режим: Кастомные маркеры
	$custom_markers = isset($attributes['customMarkers']) && is_array($attributes['customMarkers']) ? $attributes['customMarkers'] : [];
	
	foreach ($custom_markers as $marker) {
		if (!isset($marker['coords']['lat']) || !isset($marker['coords']['lng'])) {
			continue;
		}
		
		$markers[] = array(
			'id' => isset($marker['id']) ? $marker['id'] : uniqid('marker-'),
			'latitude' => floatval($marker['coords']['lat']),
			'longitude' => floatval($marker['coords']['lng']),
			'title' => isset($marker['title']) ? $marker['title'] : '',
			'address' => isset($marker['address']) ? $marker['address'] : '',
			'phone' => isset($marker['phone']) ? $marker['phone'] : '',
			'workingHours' => isset($marker['workingHours']) ? $marker['workingHours'] : '',
			'city' => isset($marker['city']) ? $marker['city'] : '',
			'link' => isset($marker['link']) ? $marker['link'] : '',
			'description' => isset($marker['description']) ? $marker['description'] : '',
		);
	}
}

// Определяем центр карты
$map_center = array(
	floatval($center['lat']),
	floatval($center['lng'])
);

// Если есть маркеры и autoFitBounds включен, используем первый маркер как центр
if (!empty($markers) && $auto_fit_bounds) {
	$map_center = array(
		$markers[0]['latitude'],
		$markers[0]['longitude']
	);
}

// Настройки карты для PHP класса
$map_settings = array(
	'map_id' => $map_id,
	'center' => $map_center,
	'zoom' => $zoom,
	'height' => $height,
	'width' => '100%',
	'border_radius' => $border_radius,
	'map_type' => $map_type,
	'enable_scroll_zoom' => $enable_scroll_zoom,
	'enable_drag' => $enable_drag,
	'enable_dbl_click_zoom' => $enable_dbl_click_zoom,
	'enable_multi_touch' => true,
	'search_control' => $search_control,
	'geolocation_control' => $geolocation_control,
	'route_button' => $route_button,
	'show_sidebar' => $show_sidebar,
	'sidebar_position' => $sidebar_position,
	'sidebar_title' => $sidebar_title,
	'show_filters' => $show_filters,
	'filter_by_city' => $filter_by_city,
	'filter_by_category' => $filter_by_category,
	'clusterer' => $clusterer,
	'clusterer_preset' => $clusterer_preset,
	'marker_type' => $marker_type,
	'marker_preset' => $marker_preset,
	'marker_color' => $marker_color,
	'marker_auto_open_balloon' => $marker_auto_open_balloon,
	'balloon_max_width' => $balloon_max_width,
	'balloon_close_button' => $balloon_close_button,
	'balloon_fields' => $balloon_fields,
	'sidebar_fields' => $sidebar_fields,
	'auto_fit_bounds' => $auto_fit_bounds,
);

// Блок обертка
$block_class = isset($attributes['blockClass']) ? $attributes['blockClass'] : '';
$wrapper_classes = 'cwgb-yandex-map-block';
if (!empty($block_class)) {
	$wrapper_classes .= ' ' . esc_attr($block_class);
}

$wrapper_attributes = get_block_wrapper_attributes(array(
	'class' => $wrapper_classes,
	'data-block-id' => esc_attr($block_id),
));


// Рендерим карту
echo '<div ' . $wrapper_attributes . '>';
echo $yandex_maps->render_map($map_settings, $markers);
echo '</div>';

?>
