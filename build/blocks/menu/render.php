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
$theme = isset($attributes['theme']) ? $attributes['theme'] : 'default';
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
$enableMegaMenu = isset($attributes['enableMegaMenu']) ? (bool) $attributes['enableMegaMenu'] : false;
$enableTitle = isset($attributes['enableTitle']) ? (bool) $attributes['enableTitle'] : false;
$title = isset($attributes['title']) ? $attributes['title'] : '';
$titleTag = isset($attributes['titleTag']) ? $attributes['titleTag'] : 'h4';
$titleClass = isset($attributes['titleClass']) ? $attributes['titleClass'] : '';
$titleColor = isset($attributes['titleColor']) ? $attributes['titleColor'] : '';
$titleColorType = isset($attributes['titleColorType']) ? $attributes['titleColorType'] : 'solid';
$titleSize = isset($attributes['titleSize']) ? $attributes['titleSize'] : '';
$titleWeight = isset($attributes['titleWeight']) ? $attributes['titleWeight'] : '';
$titleTransform = isset($attributes['titleTransform']) ? $attributes['titleTransform'] : '';
$useCollapse = isset($attributes['useCollapse']) ? (bool) $attributes['useCollapse'] : false;

// Подготавливаем данные для рендеринга
$itemsToRender = [];
$wpMenuItemsTree = [];

if ($mode === 'wp-menu' && $wpMenuId > 0) {
	// Режим "WP Menu" - используем wp_nav_menu с WP_Bootstrap_Navwalker (если доступен)
	// или fallback на кастомный рендер
	$itemsToRender = []; // для fallback
	$menu_items = wp_get_nav_menu_items($wpMenuId);
	if ($menu_items && !is_wp_error($menu_items)) {
		// Exclude invalid/deleted items (trash status, non-existent objects)
		$menu_items = array_filter($menu_items, function ($item) {
			return empty($item->_invalid);
		});
		$menu_items = array_values($menu_items);

		foreach ($menu_items as $menu_item) {
			$itemsToRender[] = array(
				'id' => 'menu-item-' . $menu_item->ID,
				'text' => $menu_item->title,
				'url' => $menu_item->url,
			);
		}
		// Текущий URL для подсветки активного пункта (Mega Menu и fallback)
		$current_request_url = set_url_scheme( ( is_ssl() ? 'https://' : 'http://' ) . ( isset( $_SERVER['HTTP_HOST'] ) ? $_SERVER['HTTP_HOST'] : '' ) . ( isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '' ) );
		$current_request_url = trailingslashit( strtok( $current_request_url, '?' ) );
		// Строим дерево для fallback
		$by_parent = [];
		foreach ($menu_items as $menu_item) {
			$item_url = $menu_item->url ? trailingslashit( strtok( $menu_item->url, '?' ) ) : '';
			$is_current = ( $item_url !== '' && $current_request_url !== '' && $item_url === $current_request_url );
			$parent_id = (int) $menu_item->menu_item_parent;
			if (!isset($by_parent[$parent_id])) {
				$by_parent[$parent_id] = [];
			}
			$by_parent[$parent_id][] = array(
				'id' => 'menu-item-' . $menu_item->ID,
				'text' => $menu_item->title,
				'url' => $menu_item->url,
				'wp_id' => $menu_item->ID,
				'current' => $is_current,
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

if ($enableMegaMenu) {
	// Mega Menu: list-unstyled, cc-2/cc-3 по количеству колонок, pb-lg-1
	$columns = isset($attributes['columns']) ? (int) $attributes['columns'] : 1;
	$listClasses = ['list-unstyled', 'pb-lg-1'];
	if ($columns === 2) {
		$listClasses[] = 'cc-2';
	} elseif ($columns === 3) {
		$listClasses[] = 'cc-3';
	}
} else {
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

	if ($listType !== 'none' && $bulletColor && $bulletColor !== 'none') {
		$listClasses[] = 'bullet-' . esc_attr($bulletColor);
	}

	if ($listType === 'icon' && $bulletBg) {
		$listClasses[] = 'bullet-bg';
		if ($bulletColor && $bulletColor !== 'none') {
			$listClasses[] = 'bullet-soft-' . esc_attr($bulletColor);
		}
	}

	if ($textColor) {
		$listClasses[] = 'text-' . esc_attr($textColor);
	}

	$listClasses[] = 'd-flex';
	if ($orientation === 'vertical') {
		$listClasses[] = 'flex-column';
	} else {
		$listClasses[] = 'flex-row';
	}
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

// Theme: default/inverse — не добавляем цвет к элементам; inverse ещё задаёт класс text-inverse для футера
if ($theme === 'inverse') {
	$GLOBALS['codeweber_footer_use_text_inverse'] = true;
}
$textThemeClass = ($theme === 'dark') ? 'text-white' : (($theme === 'light') ? 'text-dark' : '');

/**
 * Mega Menu: рендер с классами как у wp_nav_menu (menu-item, current-menu-item) для подсветки активного пункта.
 */
$render_mega_menu_level = function ($by_parent, $parent_id, $depth_limit, $current_lvl, $listClasses, $itemThemeClass, $itemClass) use (&$render_mega_menu_level) {
	$children = isset($by_parent[$parent_id]) ? $by_parent[$parent_id] : [];
	if (empty($children)) {
		return '';
	}
	$show_children = ($depth_limit === 0 || $current_lvl < $depth_limit);
	$html = '';
	foreach ($children as $item) {
		$li_classes = array_filter( array( 'menu-item', 'menu-item-' . ( isset( $item['wp_id'] ) ? (int) $item['wp_id'] : 0 ), $itemClass ) );
		if ( ! empty( $item['current'] ) ) {
			$li_classes[] = 'current-menu-item';
		}
		$liClassAttr = ' class="' . esc_attr( implode( ' ', $li_classes ) ) . '"';
		$li_id = isset( $item['id'] ) ? ' id="' . esc_attr( $item['id'] ) . '"' : '';
		$html .= '<li' . $li_id . $liClassAttr . '>';
		$aClasses = array_filter( array_merge( array( 'dropdown-item', $itemThemeClass ), array() ) );
		$a_attr = ' class="' . esc_attr( implode( ' ', $aClasses ) ) . '" href="' . esc_url( $item['url'] ) . '"';
		if ( ! empty( $item['current'] ) ) {
			$a_attr .= ' aria-current="page"';
		}
		$html .= '<a' . $a_attr . '>' . esc_html( $item['text'] ) . '</a>';
		if ($show_children && isset($item['wp_id']) && isset($by_parent[$item['wp_id']]) && !empty($by_parent[$item['wp_id']])) {
			$listClassStr = is_array($listClasses) ? implode(' ', $listClasses) : $listClasses;
			$html .= '<ul class="' . esc_attr($listClassStr) . '">';
			$html .= $render_mega_menu_level($by_parent, $item['wp_id'], $depth_limit, $current_lvl + 1, $listClasses, $itemThemeClass, $itemClass);
			$html .= '</ul>';
		}
		$html .= '</li>';
	}
	return $html;
};

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
		$is_current = !empty($item['current']);
		$li_classes = array_filter(array_merge($itemClass ? explode(' ', trim($itemClass)) : [], $is_current ? ['current-menu-item'] : []));
		$itemClassAttr = !empty($li_classes) ? ' class="' . esc_attr(implode(' ', $li_classes)) . '"' : '';
		$html .= '<li' . $itemClassAttr . '>';
		if ($listType === 'icon') {
			$html .= '<span><i class="' . esc_attr($iconClass) . '"></i></span>';
		}
		$aClasses = array_filter(array_merge([$textThemeClass], $linkClass ? explode(' ', trim($linkClass)) : [], $is_current ? ['current-menu-item'] : []));
		$aClassAttr = !empty($aClasses) ? ' class="' . esc_attr(implode(' ', $aClasses)) . '"' : '';
		$aria_current = $is_current ? ' aria-current="page"' : '';
		$html .= '<a href="' . esc_url($item['url']) . '"' . $aClassAttr . $aria_current . '>' . esc_html($item['text']) . '</a>';
		if ($show_children && isset($item['wp_id']) && isset($by_parent[$item['wp_id']]) && !empty($by_parent[$item['wp_id']])) {
			$listClassStr = is_array($listClasses) ? implode(' ', $listClasses) : $listClasses;
			$html .= '<ul class="' . esc_attr($listClassStr) . '">';
			$html .= $render_menu_level($by_parent, $item['wp_id'], $current_lvl + 1, $depth_limit, $listClasses, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass);
			$html .= '</ul>';
		}
		$html .= '</li>';
	}
	return $html;
};

/**
 * Проверяет, есть ли в поддереве пункта (включая вложенные уровни) текущая страница (current).
 * Используется для авто-раскрытия collapse, если активный пункт внутри.
 */
$has_current_in_subtree = function ($by_parent, $parent_id) use (&$has_current_in_subtree) {
	$children = isset($by_parent[$parent_id]) ? $by_parent[$parent_id] : [];
	foreach ($children as $item) {
		if (!empty($item['current'])) {
			return true;
		}
		if (isset($item['wp_id']) && !empty($by_parent[$item['wp_id']]) && $has_current_in_subtree($by_parent, $item['wp_id'])) {
			return true;
		}
	}
	return false;
};

/**
 * Рендер меню в виде Bootstrap Collapse (подменю раскрываются по клику, один открыт — остальные закрыты).
 * Разметка ul/li как в хедере. Если текущая страница внутри подменю — collapse раскрыт по умолчанию (show).
 */
$render_menu_collapse = function ($by_parent, $parent_id, $depth_limit, $listClasses, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass, $wrapper_id) use (&$render_menu_collapse, &$render_menu_level, &$has_current_in_subtree) {
	$children = isset($by_parent[$parent_id]) ? $by_parent[$parent_id] : [];
	if (empty($children)) {
		return '';
	}
	$listClassStr = is_array($listClasses) ? implode(' ', $listClasses) : $listClasses;
	$html = '';
	foreach ($children as $item) {
		$has_children = ($depth_limit === 0 || 1 < $depth_limit) && isset($item['wp_id']) && !empty($by_parent[$item['wp_id']]);
		$item_id = isset($item['wp_id']) ? (int) $item['wp_id'] : 0;
		$collapse_id = 'menu-collapse-item-' . $item_id;
		$is_current = !empty($item['current']);
		$expand = $has_children && $has_current_in_subtree($by_parent, $item['wp_id']);
		$li_classes = array_filter(array_merge(['parent-collapse-item'], $itemClass ? explode(' ', trim($itemClass)) : [], $is_current ? ['current-menu-item'] : [], $has_children ? ['collapse-has-children'] : []));

		$html .= '<li class="' . esc_attr(implode(' ', $li_classes)) . '">';
		if ($has_children) {
			// Как в хедере: сначала ссылка на страницу пункта, затем кнопка раскрытия collapse
			$a_classes = array_filter(array_merge(['nav-link', 'text-reset', 'd-block', 'flex-grow-1'], $textThemeClass ? [$textThemeClass] : [], $linkClass ? explode(' ', trim($linkClass)) : [], $is_current ? ['current-menu-item'] : []));
			$aria_current = $is_current ? ' aria-current="page"' : '';
			$html .= '<div class="d-flex align-items-center justify-content-between">';
			$html .= '<a href="' . esc_url($item['url']) . '" class="' . esc_attr(implode(' ', $a_classes)) . '"' . $aria_current . '>' . esc_html($item['text']) . '</a>';
			$btn_classes = array_filter(array_merge(['btn', 'btn-link', 'text-decoration-none', 'd-flex', 'align-items-center', 'px-1', 'border-0', 'flex-shrink-0'], $textThemeClass ? [$textThemeClass] : []));
			$html .= '<button type="button" class="' . esc_attr(implode(' ', $btn_classes)) . '" data-bs-toggle="collapse" data-bs-target="#' . esc_attr($collapse_id) . '" aria-expanded="' . ($expand ? 'true' : 'false') . '" aria-controls="' . esc_attr($collapse_id) . '" aria-label="' . esc_attr__( 'Expand submenu', 'codeweber-gutenberg-blocks' ) . '">';
			$html .= '<i class="uil uil-angle-down sidebar-catalog-icon"></i>';
			$html .= '</button>';
			$html .= '</div>';
			$html .= '<div class="collapse' . ($expand ? ' show' : '') . '" id="' . esc_attr($collapse_id) . '" data-bs-parent="#' . esc_attr($wrapper_id) . '">';
			$html .= '<ul class="' . esc_attr($listClassStr) . ' ps-3 mb-2">';
			$html .= $render_menu_level($by_parent, $item['wp_id'], 2, $depth_limit, $listClassStr, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass);
			$html .= '</ul>';
			$html .= '</div>';
		} else {
			$a_classes = array_filter(array_merge(['nav-link', 'text-reset', 'd-block'], $textThemeClass ? [$textThemeClass] : [], $linkClass ? explode(' ', trim($linkClass)) : [], $is_current ? ['current-menu-item'] : []));
			$aria_current = $is_current ? ' aria-current="page"' : '';
			$html .= '<a href="' . esc_url($item['url']) . '" class="' . esc_attr(implode(' ', $a_classes)) . '"' . $aria_current . '>' . esc_html($item['text']) . '</a>';
		}
		$html .= '</li>';
	}
	return $html;
};

$menuContent = '';
$hasTopLevelItems = !empty($wpMenuItemsTree) && isset($wpMenuItemsTree[0]) && !empty($wpMenuItemsTree[0]);
$listClassStr = implode(' ', $listClasses);

if ($enableMegaMenu) {
	// Mega Menu: list-unstyled cc-2 pb-lg-1, dropdown-item
	if ($mode === 'wp-menu' && $wpMenuId > 0 && $hasTopLevelItems) {
		$menuContent = '<ul class="' . esc_attr($listClassStr) . '">';
		$menuContent .= $render_mega_menu_level($wpMenuItemsTree, 0, $depth, 1, $listClasses, $textThemeClass, $itemClass);
		$menuContent .= '</ul>';
	} elseif (!empty($itemsToRender)) {
		$menuContent = '<ul class="' . esc_attr($listClassStr) . '">';
		foreach ($itemsToRender as $item) {
			$liClassAttr = $itemClass ? ' class="' . esc_attr($itemClass) . '"' : '';
			$aClasses = 'dropdown-item ' . esc_attr($textThemeClass);
			$menuContent .= '<li' . $liClassAttr . '><a class="' . $aClasses . '" href="' . esc_url($item['url']) . '">' . esc_html($item['text']) . '</a></li>';
		}
		$menuContent .= '</ul>';
	} else {
		$menuContent = '<p>' . esc_html__('No menu items found.', 'codeweber-gutenberg-blocks') . '</p>';
	}
} elseif ($mode === 'wp-menu' && $wpMenuId > 0 && $orientation === 'vertical' && !$enableMegaMenu && $useCollapse && $depth > 1 && $hasTopLevelItems) {
	// Вертикальное меню с Bootstrap Collapse (подменю по клику), разметка ul/li как в хедере (без text-reset у списка)
	$collapse_wrapper_id = 'menu-collapse-' . $wpMenuId . '-' . ( $menuId ? preg_replace('/[^a-z0-9_-]/i', '-', $menuId) : 'block' );
	$collapse_list_classes = array_values(array_filter(is_array($listClasses) ? $listClasses : explode(' ', trim($listClassStr)), function ($c) { $c = trim($c); return $c !== '' && $c !== 'text-reset'; }));
	$collapse_list_str = implode(' ', $collapse_list_classes);
	$menuContent = '<nav id="' . esc_attr($collapse_wrapper_id) . '" class="menu-collapse-nav"><ul class="' . esc_attr($collapse_list_str) . '">';
	$menuContent .= $render_menu_collapse($wpMenuItemsTree, 0, $depth, $collapse_list_classes, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass, $collapse_wrapper_id);
	$menuContent .= '</ul></nav>';
} elseif ($mode === 'wp-menu' && $wpMenuId > 0 && $orientation === 'vertical' && !$enableMegaMenu) {
	// Вертикальное меню: wp_nav_menu без Walker, list-unstyled — подсветка .list-unstyled li.current-menu-item > a из темы (как у шорткода [vertical_menu])
	$vertical_menu_class = $menuClass ? $menuClass : 'list-unstyled mb-0';
	$nav_args = array(
		'menu'            => $wpMenuId,
		'depth'           => $depth,
		'container'       => 'nav',
		'container_class' => 'vertical-menu-wrapper',
		'menu_class'      => $vertical_menu_class,
		'menu_id'         => $menuId ?: 'menu-block-' . $wpMenuId,
		'fallback_cb'     => false,
		'echo'            => false,
	);
	$menuContent = wp_nav_menu($nav_args);
	if (empty(trim(strip_tags($menuContent)))) {
		$menuContent = '<p>' . esc_html__('No menu items found.', 'codeweber-gutenberg-blocks') . '</p>';
	}
} elseif ($mode === 'wp-menu' && $wpMenuId > 0 && class_exists('WP_Bootstrap_Navwalker') && $orientation !== 'vertical') {
	// wp_nav_menu + Walker только для горизонтального меню (navbar-nav)
	$bootstrap_menu_class = 'navbar-nav';
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
	$add_theme_to_nav_link = function ($atts, $item, $args, $depth) use ($theme) {
		if ($theme === 'default' || $theme === 'inverse') {
			return $atts;
		}
		$themeClass = ($theme === 'dark') ? 'text-white' : 'text-dark';
		$atts['class'] = isset($atts['class']) ? $atts['class'] . ' ' . $themeClass : $themeClass;
		return $atts;
	};
	add_filter('nav_menu_link_attributes', $add_theme_to_nav_link, 10, 4);
	ob_start();
	wp_nav_menu($nav_args);
	remove_filter('nav_menu_link_attributes', $add_theme_to_nav_link, 10);
	$menuContent = ob_get_clean();
	if (empty(trim(strip_tags($menuContent)))) {
		$menuContent = '<p>' . esc_html__('No menu items found.', 'codeweber-gutenberg-blocks') . '</p>';
	}
} elseif ($mode === 'wp-menu' && $wpMenuId > 0 && $hasTopLevelItems) {
	// Fallback: кастомный рендер (если Walker недоступен)
	if ($useCollapse && $depth > 1) {
		$collapse_wrapper_id = 'menu-collapse-' . $wpMenuId . '-' . ( $menuId ? preg_replace('/[^a-z0-9_-]/i', '-', $menuId) : 'block' );
		$collapse_list_classes = array_values(array_filter(is_array($listClasses) ? $listClasses : explode(' ', trim($listClassStr)), function ($c) { $c = trim($c); return $c !== '' && $c !== 'text-reset'; }));
		$collapse_list_str = implode(' ', $collapse_list_classes);
		$menuContent = '<nav id="' . esc_attr($collapse_wrapper_id) . '" class="menu-collapse-nav"><ul class="' . esc_attr($collapse_list_str) . '">';
		$menuContent .= $render_menu_collapse($wpMenuItemsTree, 0, $depth, $collapse_list_classes, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass, $collapse_wrapper_id);
		$menuContent .= '</ul></nav>';
	} else {
		$menuContent = '<ul class="' . esc_attr($listClassStr) . '">';
		$menuContent .= $render_menu_level($wpMenuItemsTree, 0, 1, $depth, $listClassStr, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass);
		$menuContent .= '</ul>';
	}
} elseif (empty($itemsToRender)) {
	$menuContent = '<p>' . esc_html__('No menu items found.', 'codeweber-gutenberg-blocks') . '</p>';
} else {
	// Custom mode или fallback — плоский список
	$menuContent = '<ul class="' . esc_attr($listClassStr) . '">';
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
$titleClasses = [];
if ($enableWidget) {
	$titleClasses[] = 'widget-title';
}
if ($enableMegaMenu) {
	$titleClasses[] = 'dropdown-header';
}

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

// Add theme color class only if no custom color is set (default/inverse — не добавляем)
if (!$hasColorClass) {
	if ($theme === 'dark') {
		$titleClasses[] = 'text-white';
	} elseif ($theme === 'light') {
		$titleClasses[] = 'text-dark';
	}
}

// Typography classes (mega menu: force h6 size)
if ($enableMegaMenu) {
	$titleClasses[] = 'h6';
} elseif ($titleSize) {
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
	$effectiveTitleTag = $enableMegaMenu ? 'div' : $titleTag;
	$titleClassAttr = implode(' ', array_filter($titleClasses));
	$titleHtml = '<' . esc_attr($effectiveTitleTag) . ' class="' . esc_attr($titleClassAttr) . '">' . esc_html($title) . '</' . esc_attr($effectiveTitleTag) . '>';
}

$hasWrapperAttrs = trim($wrapperAttrsString . $dataAttrsString) !== '';
$blockContent = $enableWidget
	? '<div class="widget">' . $titleHtml . $menuContent . '</div>'
	: $titleHtml . $menuContent;

if ($hasWrapperAttrs) {
	echo '<div' . $wrapperAttrsString . $dataAttrsString . '>' . $blockContent . '</div>';
} else {
	echo $blockContent;
}
