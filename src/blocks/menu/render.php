<?php
/**
 * Menu Block - Server-side render
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
$mode = isset($attributes['mode']) ? $attributes['mode'] : 'custom';
$wpMenuId = isset($attributes['wpMenuId']) ? intval($attributes['wpMenuId']) : 0;
$theme = isset($attributes['theme']) ? $attributes['theme'] : 'light';
$listType = isset($attributes['listType']) ? $attributes['listType'] : 'unordered';
$bulletColor = isset($attributes['bulletColor']) ? $attributes['bulletColor'] : 'primary';
$bulletBg = isset($attributes['bulletBg']) ? (bool) $attributes['bulletBg'] : false;
$iconClass = isset($attributes['iconClass']) ? $attributes['iconClass'] : 'uil uil-arrow-right';
$textColor = isset($attributes['textColor']) ? $attributes['textColor'] : '';
$items = isset($attributes['items']) ? $attributes['items'] : [];
$menuClass = isset($attributes['menuClass']) ? $attributes['menuClass'] : 'list-unstyled text-reset mb-0';
$menuId = isset($attributes['menuId']) ? $attributes['menuId'] : '';
$menuData = isset($attributes['menuData']) ? $attributes['menuData'] : '';

// Подготавливаем данные для рендеринга
$itemsToRender = [];

if ($mode === 'wp-menu' && $wpMenuId > 0) {
	// Режим "WP Menu" - загружаем элементы меню WordPress
	$menu_items = wp_get_nav_menu_items($wpMenuId);
	
	if ($menu_items && !is_wp_error($menu_items)) {
		foreach ($menu_items as $menu_item) {
			$itemsToRender[] = array(
				'id' => 'menu-item-' . $menu_item->ID,
				'text' => $menu_item->title,
				'url' => $menu_item->url,
			);
		}
	}
} else {
	// Режим "Custom" - используем сохраненные items
	$itemsToRender = $items;
}

// Формируем классы для списка
$listClasses = [];

// Base classes from menuClass attribute
if ($menuClass) {
	$menuClassArray = explode(' ', $menuClass);
	foreach ($menuClassArray as $class) {
		$class = trim($class);
		if ($class) {
			$listClasses[] = esc_attr($class);
		}
	}
}

if ($listType === 'unordered') {
	$listClasses[] = 'unordered-list';
} elseif ($listType === 'icon') {
	$listClasses[] = 'icon-list';
}

// Bullet color
if ($bulletColor && $bulletColor !== 'none') {
	$listClasses[] = 'bullet-' . esc_attr($bulletColor);
}

// Bullet background (only for icon-list)
if ($listType === 'icon' && $bulletBg) {
	$listClasses[] = 'bullet-bg';
	if ($bulletColor && $bulletColor !== 'none') {
		$listClasses[] = 'bullet-soft-' . esc_attr($bulletColor);
	}
}

// Text color
if ($textColor) {
	$listClasses[] = 'text-' . esc_attr($textColor);
}

// Parse data attributes
$dataAttrs = [];
if ($menuData) {
	$pairs = explode(',', $menuData);
	foreach ($pairs as $pair) {
		$parts = explode('=', trim($pair));
		if (count($parts) === 2) {
			$key = trim($parts[0]);
			$value = trim($parts[1]);
			if ($key && $value) {
				$dataAttrs['data-' . esc_attr($key)] = esc_attr($value);
			}
		}
	}
}

// Build data attributes string
$dataAttrsString = '';
foreach ($dataAttrs as $key => $value) {
	$dataAttrsString .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
}

// Wrapper attributes
$wrapperAttrs = [];
$wrapperClasses = [];
if ($theme === 'dark') {
	$wrapperClasses[] = 'menu-dark';
} else {
	$wrapperClasses[] = 'menu-light';
}
if ($menuId) {
	$wrapperAttrs['id'] = esc_attr($menuId);
}
$wrapperAttrsString = '';
if (!empty($wrapperClasses)) {
	$wrapperAttrsString .= ' class="' . esc_attr(implode(' ', $wrapperClasses)) . '"';
}
foreach ($wrapperAttrs as $key => $value) {
	if ($value) {
		$wrapperAttrsString .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
	}
}

?>
<div<?php echo $wrapperAttrsString . $dataAttrsString; ?>>
	<?php if (empty($itemsToRender)) : ?>
		<p><?php esc_html_e('No menu items found.', 'codeweber-gutenberg-blocks'); ?></p>
	<?php else : ?>
		<ul class="<?php echo esc_attr(implode(' ', $listClasses)); ?>">
			<?php foreach ($itemsToRender as $item) : ?>
				<li>
					<?php if ($listType === 'icon') : ?>
						<span><i class="<?php echo esc_attr($iconClass); ?>"></i></span>
					<?php endif; ?>
					<span>
						<a href="<?php echo esc_url($item['url']); ?>"><?php echo esc_html($item['text']); ?></a>
					</span>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</div>

