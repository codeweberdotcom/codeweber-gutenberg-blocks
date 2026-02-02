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
$depth = isset($attributes['depth']) ? intval($attributes['depth']) : 0;
$orientation = isset($attributes['orientation']) ? $attributes['orientation'] : 'horizontal';
$theme = isset($attributes['theme']) ? $attributes['theme'] : 'light';
$listType = isset($attributes['listType']) ? $attributes['listType'] : 'none';
$bulletColor = isset($attributes['bulletColor']) ? $attributes['bulletColor'] : 'primary';
$bulletBg = isset($attributes['bulletBg']) ? (bool) $attributes['bulletBg'] : false;
$iconClass = isset($attributes['iconClass']) ? $attributes['iconClass'] : 'uil uil-arrow-right';
$textColor = isset($attributes['textColor']) ? $attributes['textColor'] : '';
$items = isset($attributes['items']) ? $attributes['items'] : [];
$menuClass = isset($attributes['menuClass']) ? $attributes['menuClass'] : 'list-unstyled text-reset mb-0';
$menuId = isset($attributes['menuId']) ? $attributes['menuId'] : '';
$menuData = isset($attributes['menuData']) ? $attributes['menuData'] : '';
$itemClass = isset($attributes['itemClass']) ? $attributes['itemClass'] : '';
$linkClass = isset($attributes['linkClass']) ? $attributes['linkClass'] : '';
$enableWidget = isset($attributes['enableWidget']) ? (bool) $attributes['enableWidget'] : false;
$enableTitle = isset($attributes['enableTitle']) ? (bool) $attributes['enableTitle'] : false;
$title = isset($attributes['title']) ? $attributes['title'] : '';
$titleTag = isset($attributes['titleTag']) ? $attributes['titleTag'] : 'h4';
$titleClass = isset($attributes['titleClass']) ? $attributes['titleClass'] : '';
$titleColor = isset($attributes['titleColor']) ? $attributes['titleColor'] : '';
$titleColorType = isset($attributes['titleColorType']) ? $attributes['titleColorType'] : 'solid';
$titleSize = isset($attributes['titleSize']) ? $attributes['titleSize'] : '';
$titleWeight = isset($attributes['titleWeight']) ? $attributes['titleWeight'] : '';
$titleTransform = isset($attributes['titleTransform']) ? $attributes['titleTransform'] : '';

// Подготавливаем данные для рендеринга
$itemsToRender = [];
$wpMenuItemsTree = [];

if ($mode === 'wp-menu' && $wpMenuId > 0) {
	// Режим "WP Menu" - используем wp_nav_menu с WP_Bootstrap_Navwalker (если доступен)
	// или fallback на кастомный рендер
	$itemsToRender = []; // для fallback
	$menu_items = wp_get_nav_menu_items($wpMenuId);
	if ($menu_items && !is_wp_error($menu_items)) {
		foreach ($menu_items as $menu_item) {
			$itemsToRender[] = array(
				'id' => 'menu-item-' . $menu_item->ID,
				'text' => $menu_item->title,
				'url' => $menu_item->url,
			);
		}
		// Строим дерево для fallback
		$by_parent = [];
		foreach ($menu_items as $menu_item) {
			$parent_id = (int) $menu_item->menu_item_parent;
			if (!isset($by_parent[$parent_id])) {
				$by_parent[$parent_id] = [];
			}
			$by_parent[$parent_id][] = array(
				'id' => 'menu-item-' . $menu_item->ID,
				'text' => $menu_item->title,
				'url' => $menu_item->url,
				'wp_id' => $menu_item->ID,
			);
		}
		$wpMenuItemsTree = $by_parent;
	}
} else {
	// Режим "Custom" - используем сохраненные items (плоский список)
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
// Если listType === 'none', не добавляем никаких классов списка

// Bullet color (только если не 'none' и listType не 'none')
if ($listType !== 'none' && $bulletColor && $bulletColor !== 'none') {
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

// Orientation: vertical = flex-column, horizontal = flex-row
$listClasses[] = 'd-flex';
if ($orientation === 'vertical') {
	$listClasses[] = 'flex-column';
} else {
	$listClasses[] = 'flex-row';
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
if ($menuId) {
	$wrapperAttrs['id'] = esc_attr($menuId);
}
$wrapperAttrsString = '';
foreach ($wrapperAttrs as $key => $value) {
	if ($value) {
		$wrapperAttrsString .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
	}
}

// Theme class for text color
$textThemeClass = ($theme === 'dark') ? 'text-white' : 'text-dark';

/**
 * Fallback: рекурсивно рендерит элементы меню (когда WP_Bootstrap_Navwalker недоступен).
 */
$render_menu_level = function ($by_parent, $parent_id, $current_lvl, $depth_limit, $listClasses, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass) use (&$render_menu_level) {
	$children = isset($by_parent[$parent_id]) ? $by_parent[$parent_id] : [];
	if (empty($children)) {
		return '';
	}
	$show_children = ($depth_limit === 0 || $current_lvl < $depth_limit);
	$html = '';
	foreach ($children as $item) {
		$itemClassAttr = $itemClass ? ' class="' . esc_attr($itemClass) . '"' : '';
		$html .= '<li' . $itemClassAttr . '>';
		if ($listType === 'icon') {
			$html .= '<span><i class="' . esc_attr($iconClass) . '"></i></span>';
		}
		$html .= '<span class="' . esc_attr($textThemeClass) . '">';
		$aClasses = array_filter(array_merge([$textThemeClass], $linkClass ? explode(' ', trim($linkClass)) : []));
		$aClassAttr = !empty($aClasses) ? ' class="' . esc_attr(implode(' ', $aClasses)) . '"' : '';
		$html .= '<a href="' . esc_url($item['url']) . '"' . $aClassAttr . '>' . esc_html($item['text']) . '</a>';
		$html .= '</span>';
		if ($show_children && isset($item['wp_id']) && isset($by_parent[$item['wp_id']]) && !empty($by_parent[$item['wp_id']])) {
			$html .= '<ul class="' . esc_attr($listClasses) . '">';
			$html .= $render_menu_level($by_parent, $item['wp_id'], $current_lvl + 1, $depth_limit, $listClasses, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass);
			$html .= '</ul>';
		}
		$html .= '</li>';
	}
	return $html;
};

$menuContent = '';
$hasTopLevelItems = !empty($wpMenuItemsTree) && isset($wpMenuItemsTree[0]) && !empty($wpMenuItemsTree[0]);

if ($mode === 'wp-menu' && $wpMenuId > 0 && class_exists('WP_Bootstrap_Navwalker')) {
	// Используем wp_nav_menu с WP_Bootstrap_Navwalker (Bootstrap dropdown, data-bs-toggle)
	// Для navbar: только navbar-nav (без list-unstyled, d-flex и т.д.)
	$bootstrap_menu_class = 'navbar-nav';
	if ($orientation === 'vertical') {
		$bootstrap_menu_class .= ' flex-column';
	}
	$nav_args = array(
		'menu'            => $wpMenuId,
		'depth'           => $depth,
		'container'       => false,
		'menu_class'      => $bootstrap_menu_class,
		'menu_id'         => $menuId ?: 'menu-block-' . $wpMenuId,
		'fallback_cb'     => 'WP_Bootstrap_Navwalker::fallback',
		'walker'          => new WP_Bootstrap_Navwalker(),
		'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
		'item_spacing'    => 'discard',
	);
	ob_start();
	wp_nav_menu($nav_args);
	$menuContent = ob_get_clean();
	if (empty(trim(strip_tags($menuContent)))) {
		$menuContent = '<p>' . esc_html__('No menu items found.', 'codeweber-gutenberg-blocks') . '</p>';
	}
} elseif ($mode === 'wp-menu' && $wpMenuId > 0 && $hasTopLevelItems) {
	// Fallback: кастомный рендер (если Walker недоступен)
	$listClassStr = implode(' ', $listClasses);
	$menuContent = '<ul class="' . esc_attr($listClassStr) . '">';
	$menuContent .= $render_menu_level($wpMenuItemsTree, 0, 1, $depth, $listClassStr, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass);
	$menuContent .= '</ul>';
} elseif (empty($itemsToRender)) {
	$menuContent = '<p>' . esc_html__('No menu items found.', 'codeweber-gutenberg-blocks') . '</p>';
} else {
	// Custom mode или fallback — плоский список
	$menuContent = '<ul class="' . esc_attr(implode(' ', $listClasses)) . '">';
	foreach ($itemsToRender as $item) {
		$itemClassAttr = $itemClass ? ' class="' . esc_attr($itemClass) . '"' : '';
		$menuContent .= '<li' . $itemClassAttr . '>';
		if ($listType === 'icon') {
			$menuContent .= '<span><i class="' . esc_attr($iconClass) . '"></i></span>';
		}
		$menuContent .= '<span class="' . esc_attr($textThemeClass) . '">';
		$aClasses = array_filter(array_merge([$textThemeClass], $linkClass ? explode(' ', trim($linkClass)) : []));
		$aClassAttr = !empty($aClasses) ? ' class="' . esc_attr(implode(' ', $aClasses)) . '"' : '';
		$menuContent .= '<a href="' . esc_url($item['url']) . '"' . $aClassAttr . '>' . esc_html($item['text']) . '</a>';
		$menuContent .= '</span>';
		$menuContent .= '</li>';
	}
	$menuContent .= '</ul>';
}

// Generate title classes
$titleClasses = ['widget-title'];

// Color classes
$hasColorClass = false;
if ($titleColor) {
	$colorPrefix = 'text';
	if ($titleColorType === 'soft') {
		$titleClasses[] = $colorPrefix . '-soft-' . esc_attr($titleColor);
		$hasColorClass = true;
	} elseif ($titleColorType === 'pale') {
		$titleClasses[] = $colorPrefix . '-pale-' . esc_attr($titleColor);
		$hasColorClass = true;
	} else {
		$titleClasses[] = $colorPrefix . '-' . esc_attr($titleColor);
		$hasColorClass = true;
	}
}

// Add theme color class only if no custom color is set
if (!$hasColorClass) {
	if ($theme === 'dark') {
		$titleClasses[] = 'text-white';
	} else {
		$titleClasses[] = 'text-dark';
	}
}

// Typography classes
if ($titleSize) {
	$titleClasses[] = esc_attr($titleSize);
}
if ($titleWeight) {
	$titleClasses[] = esc_attr($titleWeight);
}
if ($titleTransform) {
	$titleClasses[] = esc_attr($titleTransform);
}

// Custom class
if ($titleClass) {
	$titleClasses[] = esc_attr($titleClass);
}

$titleHtml = '';
if ($enableTitle && $title) {
	$titleClassAttr = implode(' ', array_filter($titleClasses));
	$titleHtml = '<' . esc_attr($titleTag) . ' class="' . esc_attr($titleClassAttr) . '">' . esc_html($title) . '</' . esc_attr($titleTag) . '>';
}
?>
<div<?php echo $wrapperAttrsString . $dataAttrsString; ?>>
	<?php if ($enableWidget) : ?>
		<div class="widget">
			<?php echo $titleHtml; ?>
			<?php echo $menuContent; ?>
		</div>
	<?php else : ?>
		<?php echo $menuContent; ?>
	<?php endif; ?>
</div>
