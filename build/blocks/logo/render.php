<?php
/**
 * Logo Block - Server-side render
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

// Убеждаемся, что текстовый домен загружен для переводов
$plugin_path = dirname(dirname(dirname(dirname(__FILE__))));
load_plugin_textdomain('codeweber-gutenberg-blocks', false, basename($plugin_path) . '/languages/');

// Получаем атрибуты
$logo_type = isset($attributes['logoType']) ? $attributes['logoType'] : 'both';
$logo_size = isset($attributes['logoSize']) ? $attributes['logoSize'] : '';
$block_class = isset($attributes['blockClass']) ? $attributes['blockClass'] : '';
$block_id = isset($attributes['blockId']) ? $attributes['blockId'] : '';
$block_data = isset($attributes['blockData']) ? $attributes['blockData'] : '';
$block_align = isset($attributes['blockAlign']) ? $attributes['blockAlign'] : '';
$enable_link = isset($attributes['enableLink']) ? (bool) $attributes['enableLink'] : true;
$logo_url = isset($attributes['logoUrl']) ? $attributes['logoUrl'] : '';
$animation_enabled = isset($attributes['animationEnabled']) ? (bool) $attributes['animationEnabled'] : false;
$animation_type = isset($attributes['animationType']) ? $attributes['animationType'] : '';
$animation_duration = isset($attributes['animationDuration']) ? intval($attributes['animationDuration']) : 1000;
$animation_delay = isset($attributes['animationDelay']) ? intval($attributes['animationDelay']) : 0;

// Проверяем наличие функции get_custom_logo_type
if (!function_exists('get_custom_logo_type')) {
	// Если функция не существует, подключаем файл
	$redux_logos_file = get_template_directory() . '/functions/integrations/redux_framework/redux_custom_logos.php';
	if (file_exists($redux_logos_file)) {
		require_once $redux_logos_file;
	}
}

// Получаем HTML логотипа
$logo_html = '';
if (function_exists('get_custom_logo_type')) {
	// Используем функцию из темы
	$logo_html = get_custom_logo_type($logo_type);
} else {
	// Fallback: получаем логотипы напрямую из Redux
	global $opt_name;
	$options = get_option($opt_name ?: 'redux_demo');

	$post_id = get_the_ID();
	$custom_dark_logo = get_post_meta($post_id, 'custom-logo-dark-header', true);
	$custom_light_logo = get_post_meta($post_id, 'custom-logo-light-header', true);

	$default_logos = array(
		'light' => get_template_directory_uri() . '/dist/assets/img/logo-light.png',
		'dark'  => get_template_directory_uri() . '/dist/assets/img/logo-dark.png',
	);

	$dark_logo = !empty($custom_dark_logo['url'])
		? $custom_dark_logo['url']
		: (!empty($options['opt-dark-logo']['url']) ? $options['opt-dark-logo']['url'] : $default_logos['dark']);

	$light_logo = !empty($custom_light_logo['url'])
		? $custom_light_logo['url']
		: (!empty($options['opt-light-logo']['url']) ? $options['opt-light-logo']['url'] : $default_logos['light']);

	if ($logo_type === 'dark') {
		$logo_html = sprintf('<img class="logo-dark" src="%s" alt="">', esc_url($dark_logo));
	} elseif ($logo_type === 'light') {
		$logo_html = sprintf('<img class="logo-light" src="%s" alt="">', esc_url($light_logo));
	} else {
		// both
		$logo_html = sprintf(
			'<img class="logo-dark" src="%s" alt="">' . "\n" . '<img class="logo-light" src="%s" alt="">',
			esc_url($dark_logo),
			esc_url($light_logo)
		);
	}
}

// Применяем размер, если указан
if ($logo_size) {
	$size_style = ' style="width: ' . esc_attr($logo_size) . '; height: auto;"';
	$logo_html = str_replace('<img', '<img' . $size_style, $logo_html);
}

// Формируем классы блока
$wrapper_classes = ['cwgb-logo-block'];
if ($block_align) {
	$wrapper_classes[] = 'text-' . esc_attr($block_align);
}
if ($block_class) {
	$wrapper_classes[] = esc_attr($block_class);
}

// Парсим data-атрибуты
$data_attrs = [];
if ($block_data) {
	$pairs = explode(',', $block_data);
	foreach ($pairs as $pair) {
		$parts = explode('=', trim($pair));
		if (count($parts) === 2) {
			$key = trim($parts[0]);
			$value = trim($parts[1]);
			if ($key && $value) {
				$data_attrs['data-' . esc_attr($key)] = esc_attr($value);
			}
		}
	}
}

// Формируем атрибуты обертки
$wrapper_attrs = [];
if ($block_id) {
	$wrapper_attrs['id'] = esc_attr($block_id);
}
foreach ($data_attrs as $key => $value) {
	$wrapper_attrs[$key] = $value;
}

// Добавляем атрибуты анимации
if ($animation_enabled && $animation_type) {
	$wrapper_attrs['data-cue'] = esc_attr($animation_type);
	$wrapper_attrs['data-duration'] = esc_attr($animation_duration);
	$wrapper_attrs['data-delay'] = esc_attr($animation_delay);
}

$wrapper_attrs_string = '';
foreach ($wrapper_attrs as $key => $value) {
	if ($value) {
		$wrapper_attrs_string .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
	}
}

// Получаем URL ссылки
$link_url = $logo_url ? $logo_url : home_url('/');

// Если ссылка включена, оборачиваем логотип в <a>
if ($enable_link) {
	$logo_html = '<a href="' . esc_url($link_url) . '">' . $logo_html . '</a>';
}

?>
<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>"<?php echo $wrapper_attrs_string; ?>>
	<?php echo $logo_html; ?>
</div>


