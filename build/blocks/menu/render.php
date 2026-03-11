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

// Получаем атрибуты
$mode = isset($attributes['mode']) ? $attributes['mode'] : 'custom';
$wpMenuId = isset($attributes['wpMenuId']) ? intval($attributes['wpMenuId']) : 0;
$taxonomySlug = isset($attributes['taxonomySlug']) ? sanitize_key($attributes['taxonomySlug']) : '';
$taxonomyHideEmpty = isset($attributes['taxonomyHideEmpty'])
	? filter_var($attributes['taxonomyHideEmpty'], FILTER_VALIDATE_BOOLEAN)
	: false;
$depth = isset($attributes['depth']) ? max(1, intval($attributes['depth'])) : 1;
$orientation = isset($attributes['orientation']) ? $attributes['orientation'] : 'horizontal';
$theme = isset($attributes['theme']) ? $attributes['theme'] : 'light';
$listType = isset($attributes['listType']) ? $attributes['listType'] : 'none';
$bulletColor = isset($attributes['bulletColor']) ? $attributes['bulletColor'] : 'primary';
$bulletBg = isset($attributes['bulletBg']) ? (bool) $attributes['bulletBg'] : false;
$iconClass = isset($attributes['iconClass']) ? $attributes['iconClass'] : 'uil uil-arrow-right';
$textColor = isset($attributes['textColor']) ? $attributes['textColor'] : '';
$items = isset($attributes['items']) ? $attributes['items'] : [];
$menuClass = isset($attributes['menuClass']) ? $attributes['menuClass'] : 'list-unstyled mb-0';
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
$useCollapse = isset($attributes['useCollapse']) ? (bool) $attributes['useCollapse'] : true;
$collapseListType = isset($attributes['collapseListType']) ? preg_replace('/[^1-5]/', '', (string) $attributes['collapseListType']) : '1';
if ( $collapseListType === '' ) {
	$collapseListType = '1';
}
$containerClass = isset($attributes['containerClass']) ? trim((string) $attributes['containerClass']) : '';
$topLevelClass = isset($attributes['topLevelClass']) ? trim((string) $attributes['topLevelClass']) : '';
$topLevelClassStart = isset($attributes['topLevelClassStart']) ? trim((string) $attributes['topLevelClassStart']) : '';
$topLevelClassEnd = isset($attributes['topLevelClassEnd']) ? trim((string) $attributes['topLevelClassEnd']) : '';

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
		// Текущий пункт меню: по object_id и типу объекта (как в ядре WP), а не по сравнению URL
		// (сравнение URL после strtok(..., '?') давало совпадение всем пунктам на одном домене)
		$queried_id = (int) get_queried_object_id();
		$by_parent = [];
		foreach ($menu_items as $menu_item) {
			$is_current = false;
			if ( ! empty( $menu_item->type ) && (int) $menu_item->object_id > 0 ) {
				if ( $menu_item->type === 'post_type' && is_singular() ) {
					$is_current = ( (int) $menu_item->object_id === $queried_id );
				} elseif ( $menu_item->type === 'taxonomy' ) {
					$obj = get_queried_object();
					$is_current = ( $obj && isset( $obj->term_id ) && (int) $menu_item->object_id === (int) $obj->term_id );
				}
			}
			if ( ! $is_current && $menu_item->type === 'custom' && ! empty( $menu_item->url ) ) {
				$current_request_url = set_url_scheme( ( is_ssl() ? 'https://' : 'http://' ) . ( isset( $_SERVER['HTTP_HOST'] ) ? $_SERVER['HTTP_HOST'] : '' ) . ( isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '' ) );
				$item_url = set_url_scheme( $menu_item->url );
				$is_current = ( rtrim( $item_url, '/' ) === rtrim( $current_request_url, '/' ) );
			}
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
} elseif ($mode === 'taxonomy' && $taxonomySlug !== '' && taxonomy_exists($taxonomySlug)) {
	// Режим "Taxonomy" — дерево из терминов выбранной таксономии. hide_empty: true = скрывать термины без записей.
	$all_terms = get_terms(array(
		'taxonomy'    => $taxonomySlug,
		'hide_empty'  => (bool) $taxonomyHideEmpty,
		'orderby'     => 'name',
		'order'       => 'ASC',
		'number'      => 0,
		'count'       => false,
		'pad_counts'  => false,
	));
	if (!is_wp_error($all_terms)) {
		$queried_term_id = 0;
		$obj = get_queried_object();
		if ($obj && isset($obj->term_id)) {
			$queried_term_id = (int) $obj->term_id;
		}
		$by_parent = array();
		foreach ($all_terms as $term) {
			$parent_id = (int) $term->parent;
			if (!isset($by_parent[$parent_id])) {
				$by_parent[$parent_id] = array();
			}
			$term_link = get_term_link($term);
			$url = (is_wp_error($term_link)) ? '#' : $term_link;
			$by_parent[$parent_id][] = array(
				'id'      => 'term-' . $term->term_id,
				'text'    => $term->name,
				'url'     => $url,
				'wp_id'   => $term->term_id,
				'current' => ($queried_term_id > 0 && (int) $term->term_id === $queried_term_id),
			);
		}
		// Порядок внутри каждого уровня — по имени (родительские и дочерние термины уже разнесены по уровням)
		foreach ($by_parent as $pid => $siblings) {
			usort($by_parent[$pid], function ($a, $b) {
				return strcasecmp($a['text'], $b['text']);
			});
		}
		$wpMenuItemsTree = $by_parent;
		foreach ($all_terms as $term) {
			$term_link = get_term_link($term);
			$itemsToRender[] = array(
				'id'   => 'term-' . $term->term_id,
				'text' => $term->name,
				'url'  => (is_wp_error($term_link)) ? '#' : $term_link,
			);
		}
	}
} else {
	// Режим "Custom" (вручную) — строим дерево для той же collapse-вёрстки (один уровень или по parent)
	$itemsToRender = $items;
	$by_parent_custom = array();
	foreach ($items as $idx => $item) {
		$it = is_object($item) ? (array) $item : $item;
		$parent_id = isset($it['parent']) ? (int) $it['parent'] : 0;
		if (!isset($by_parent_custom[$parent_id])) {
			$by_parent_custom[$parent_id] = array();
		}
		$by_parent_custom[$parent_id][] = array(
			'id'    => isset($it['id']) ? $it['id'] : 'item-' . ($idx + 1),
			'text'  => isset($it['text']) ? $it['text'] : '',
			'url'   => isset($it['url']) ? $it['url'] : '#',
			'wp_id' => isset($it['wpId']) ? (int) $it['wpId'] : ($idx + 1),
			'current' => false,
		);
	}
	$wpMenuItemsTree = $by_parent_custom;
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

// Theme: только light (navbar-light) и dark (navbar-dark). Цвет ссылок задаётся темой (.navbar-light/.navbar-dark .nav-link), text-dark/text-white не добавляем.
$theme_effective = ($theme === 'dark') ? 'dark' : 'light';
$textThemeClass = '';

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
$render_menu_level = function ($by_parent, $parent_id, $current_lvl, $depth_limit, $listClasses, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass, $subListClasses = null) use (&$render_menu_level) {
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
			$listClassStr = (($current_lvl >= 1) && $subListClasses !== null)
				? (is_array($subListClasses) ? implode(' ', $subListClasses) : $subListClasses)
				: (is_array($listClasses) ? implode(' ', $listClasses) : $listClasses);
			$html .= '<ul class="' . esc_attr($listClassStr) . '">';
			$html .= $render_menu_level($by_parent, $item['wp_id'], $current_lvl + 1, $depth_limit, $listClasses, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass, $subListClasses);
			$html .= '</ul>';
		}
		$html .= '</li>';
	}
	return $html;
};

/**
 * Проверяет, есть ли в поддереве пункта (включая вложенные уровни) текущая страница (current).
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
 * Разметка ul/li как в хедере. Рекурсивно для всех уровней: пункты с детьми (Typography и т.д.) тоже получают collapse.
 * Раскрываем весь путь до текущей страницы: если current в поддереве — collapse получает show на любом уровне вложенности.
 *
 * @param int    $current_lvl     Текущий уровень вложенности (1 = верхний).
 * @param string $instance_suffix Уникальный суффикс экземпляра (чтобы несколько меню на странице не конфликтовали).
 */
$render_menu_collapse = function ($by_parent, $parent_id, $depth_limit, $listClasses, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass, $wrapper_id, $current_lvl = 1, $instance_suffix = '', $topLevelClass = '', $topLevelClassStart = '', $topLevelClassEnd = '') use (&$render_menu_collapse, &$render_menu_level, &$has_current_in_subtree) {
	$children = isset($by_parent[$parent_id]) ? $by_parent[$parent_id] : [];
	if (empty($children)) {
		return '';
	}
	$listClassStr = is_array($listClasses) ? implode(' ', $listClasses) : $listClasses;
	$html = '';
	$last_idx = count($children) - 1;
		foreach ($children as $idx => $item) {
		$has_children = ($depth_limit === 0 || $current_lvl < $depth_limit) && isset($item['wp_id']) && !empty($by_parent[$item['wp_id']]);
		$item_id = isset($item['wp_id']) ? (int) $item['wp_id'] : 0;
		// Уникальный ID для collapse: основан на уникальном wrapper_id конкретного экземпляра меню
		$collapse_id = $wrapper_id . '-item-' . $item_id;
		$is_current = !empty($item['current']);
		// Раскрывать collapse по пути до текущей страницы (как в Navwalker: current-menu-parent — виден контекст).
		$expand = $has_children && $has_current_in_subtree($by_parent, $item['wp_id']);
		// Верхний уровень: первый — top_level_class_start, последний — top_level_class_end (если заданы), иначе top_level_class
		$top_class = [];
		if ($current_lvl === 1) {
			if ($idx === 0 && $topLevelClassStart !== '') {
				$top_class = explode(' ', trim($topLevelClassStart));
			} elseif ($idx === $last_idx && $topLevelClassEnd !== '') {
				$top_class = explode(' ', trim($topLevelClassEnd));
			} elseif ($topLevelClass !== '') {
				$top_class = explode(' ', trim($topLevelClass));
			}
		}
		$li_classes = array_filter(array_merge(['nav-item', 'parent-collapse-item'], $current_lvl === 1 ? ['parent-item'] : [], $top_class, $itemClass ? explode(' ', trim($itemClass)) : [], $is_current ? ['current-menu-item'] : [], $has_children ? ['collapse-has-children'] : []));

		$html .= '<li class="' . esc_attr(implode(' ', $li_classes)) . '">';
		if ($has_children) {
			// Как в хедере: сначала ссылка на страницу пункта, затем кнопка раскрытия collapse
			$a_classes = array_filter(array_merge(['nav-link', 'd-block', 'flex-grow-1'], $textThemeClass ? [$textThemeClass] : [], $linkClass ? explode(' ', trim($linkClass)) : [], $is_current ? ['current-menu-item'] : []));
			$aria_current = $is_current ? ' aria-current="page"' : '';
			$html .= '<div class="menu-collapse-row d-flex align-items-center justify-content-between">';
			$html .= '<a href="' . esc_url($item['url']) . '" class="' . esc_attr(implode(' ', $a_classes)) . '"' . $aria_current . '>' . esc_html($item['text']) . '</a>';
			$btn_classes = array_filter(array_merge(['btn-collapse', 'w-5', 'h-5'], $textThemeClass ? [$textThemeClass] : []));
			$html .= '<button type="button" class="' . esc_attr(implode(' ', $btn_classes)) . '" data-bs-toggle="collapse" data-bs-target="#' . esc_attr($collapse_id) . '" aria-expanded="' . ($expand ? 'true' : 'false') . '" aria-controls="' . esc_attr($collapse_id) . '" aria-label="' . esc_attr__( 'Expand submenu', 'codeweber-gutenberg-blocks' ) . '">';
			$html .= '<span class="toggle_block" aria-hidden="true"><i class="uil uil-angle-down sidebar-catalog-icon"></i></span>';
			$html .= '</button>';
			$html .= '</div>';
			$html .= '<div class="collapse' . ($expand ? ' show' : '') . '" id="' . esc_attr($collapse_id) . '" data-bs-parent="#' . esc_attr($wrapper_id) . '">';
			$html .= '<ul class="' . esc_attr($listClassStr) . '">';
			// Вложенный уровень: рекурсивно collapse (Typography и др. родители тоже с кнопкой раскрытия)
			$html .= $render_menu_collapse($by_parent, $item['wp_id'], $depth_limit, $listClasses, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass, $collapse_id, $current_lvl + 1, $instance_suffix, $topLevelClass, $topLevelClassStart, $topLevelClassEnd);
			$html .= '</ul>';
			$html .= '</div>';
		} else {
			$a_classes = array_filter(array_merge(['nav-link', 'd-block'], $textThemeClass ? [$textThemeClass] : [], $linkClass ? explode(' ', trim($linkClass)) : [], $is_current ? ['current-menu-item'] : []));
			$aria_current = $is_current ? ' aria-current="page"' : '';
			$html .= '<a href="' . esc_url($item['url']) . '" class="' . esc_attr(implode(' ', $a_classes)) . '"' . $aria_current . '>' . esc_html($item['text']) . '</a>';
		}
		$html .= '</li>';
	}
	return $html;
};

// Счётчик экземпляров для уникальных ID collapse-меню на странице
$next_collapse_instance = static function() {
	static $count = 0;
	return ++$count;
};

$menuContent = '';
$hasTopLevelItems = !empty($wpMenuItemsTree) && isset($wpMenuItemsTree[0]) && !empty($wpMenuItemsTree[0]);
$useTreeSource = ($mode === 'wp-menu' && $wpMenuId > 0) || ($mode === 'taxonomy' && $taxonomySlug !== '') || ($mode === 'custom' && !empty($items));
$treeSourceId = ($mode === 'wp-menu' && $wpMenuId > 0) ? (string) $wpMenuId : ($mode === 'taxonomy' && $taxonomySlug !== '' ? 'tax-' . $taxonomySlug : 'custom');
$listClassStr = implode(' ', $listClasses);

if ($enableMegaMenu) {
	// Mega Menu: list-unstyled cc-2 pb-lg-1, dropdown-item
	if ($useTreeSource && $hasTopLevelItems) {
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
} elseif ($useTreeSource && $orientation === 'vertical' && !$enableMegaMenu && ($useCollapse || $mode === 'custom') && $hasTopLevelItems) {
	// Вертикальное меню: тип 4 — простой список (list-unstyled menu-list-type-4); типы 1–3 — collapse.
	$collapse_instance_suffix = (string) $next_collapse_instance();
	$collapse_wrapper_id = 'menu-collapse-' . $treeSourceId . '-' . ( $menuId ? preg_replace('/[^a-z0-9_-]/i', '-', $menuId) : 'block' ) . '-' . $collapse_instance_suffix;

	if ( $collapseListType === '4' ) {
		$type4_list_class = 'list-unstyled menu-list-type-4';
		$type4_sub_class = 'list-unstyled menu-type-4-sub';
		$nav_class_4 = 'navbar-vertical ' . ( $theme_effective === 'dark' ? 'navbar-dark' : 'navbar-light' );
		if ( $containerClass !== '' ) {
			$nav_class_4 .= ' ' . esc_attr( $containerClass );
		}
		$menuContent = '<nav id="' . esc_attr( $collapse_wrapper_id ) . '" class="' . esc_attr( trim( $nav_class_4 ) ) . '"><ul class="' . esc_attr( $type4_list_class ) . '">';
		$menuContent .= $render_menu_level( $wpMenuItemsTree, 0, 1, $depth, $type4_list_class, '', $linkClass, $iconClass, $listType, $textThemeClass, $type4_sub_class );
		$menuContent .= '</ul></nav>';
	} elseif ( $collapseListType === '5' && $mode === 'wp-menu' && $wpMenuId > 0 && class_exists( 'CodeWeber_Vertical_Dropdown_Walker' ) ) {
		// Type 5: vertical menu with dropdown to the right (WP Menu only, theme Walker).
		$nav_class_5 = 'navbar-vertical navbar-vertical-dropdown ' . ( $theme_effective === 'dark' ? 'navbar-dark' : 'navbar-light' );
		if ( $containerClass !== '' ) {
			$nav_class_5 .= ' ' . esc_attr( $containerClass );
		}
		$menuContent = wp_nav_menu( array(
			'menu'            => $wpMenuId,
			'depth'           => $depth,
			'container'       => 'nav',
			'container_class' => $nav_class_5,
			'container_id'    => $collapse_wrapper_id,
			'menu_class'      => 'navbar-nav flex-column',
			'fallback_cb'     => 'WP_Bootstrap_Navwalker::fallback',
			'walker'          => new CodeWeber_Vertical_Dropdown_Walker(),
			'echo'            => false,
			'item_spacing'    => 'discard',
		) );
		if ( empty( trim( strip_tags( $menuContent ) ) ) ) {
			$menuContent = '<p>' . esc_html__( 'No menu items found.', 'codeweber-gutenberg-blocks' ) . '</p>';
		}
	} else {
		$collapse_list_classes = array( 'navbar-nav', 'list-unstyled', 'menu-collapse-' . $collapseListType );
		$collapse_list_str = implode(' ', $collapse_list_classes);
		$nav_class = 'navbar-vertical menu-collapse-nav ' . ( $theme_effective === 'dark' ? 'navbar-dark' : 'navbar-light' );
		if ( $containerClass !== '' ) {
			$nav_class .= ' ' . esc_attr( $containerClass );
		}
		$menuContent = '<nav id="' . esc_attr($collapse_wrapper_id) . '" class="' . esc_attr( $nav_class ) . '"><ul class="' . esc_attr($collapse_list_str) . '">';
		$menuContent .= $render_menu_collapse($wpMenuItemsTree, 0, $depth, $collapse_list_classes, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass, $collapse_wrapper_id, 1, $collapse_instance_suffix, $topLevelClass, $topLevelClassStart, $topLevelClassEnd);
		$menuContent .= '</ul></nav>';
	}
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
	$add_theme_to_nav_link = function ($atts) {
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
} elseif ($useTreeSource && $hasTopLevelItems) {
	// Fallback: кастомный рендер (для таксономии, Custom или если Walker недоступен)
	if ($useCollapse || $mode === 'custom') {
		$collapse_instance_suffix_fb = (string) $next_collapse_instance();
		$collapse_wrapper_id = 'menu-collapse-' . $treeSourceId . '-' . ( $menuId ? preg_replace('/[^a-z0-9_-]/i', '-', $menuId) : 'block' ) . '-' . $collapse_instance_suffix_fb;

		if ( $collapseListType === '4' ) {
			$type4_list_class_fb = 'list-unstyled menu-list-type-4';
			$type4_sub_class_fb = 'list-unstyled menu-type-4-sub';
			$nav_class_4_fb = 'navbar-vertical ' . ( $theme_effective === 'dark' ? 'navbar-dark' : 'navbar-light' );
			if ( $containerClass !== '' ) {
				$nav_class_4_fb .= ' ' . esc_attr( $containerClass );
			}
			$menuContent = '<nav id="' . esc_attr( $collapse_wrapper_id ) . '" class="' . esc_attr( trim( $nav_class_4_fb ) ) . '"><ul class="' . esc_attr( $type4_list_class_fb ) . '">';
			$menuContent .= $render_menu_level( $wpMenuItemsTree, 0, 1, $depth, $type4_list_class_fb, '', $linkClass, $iconClass, $listType, $textThemeClass, $type4_sub_class_fb );
			$menuContent .= '</ul></nav>';
		} else {
			$collapse_list_classes_fb = array( 'navbar-nav', 'list-unstyled', 'menu-collapse-' . $collapseListType );
			$collapse_list_str_fb = implode(' ', $collapse_list_classes_fb);
			$nav_class_fb = 'navbar-vertical menu-collapse-nav ' . ( $theme_effective === 'dark' ? 'navbar-dark' : 'navbar-light' );
			if ( $containerClass !== '' ) {
				$nav_class_fb .= ' ' . esc_attr( $containerClass );
			}
			$menuContent = '<nav id="' . esc_attr($collapse_wrapper_id) . '" class="' . esc_attr( $nav_class_fb ) . '"><ul class="' . esc_attr($collapse_list_str_fb) . '">';
			$menuContent .= $render_menu_collapse($wpMenuItemsTree, 0, $depth, $collapse_list_classes_fb, $itemClass, $linkClass, $iconClass, $listType, $textThemeClass, $collapse_wrapper_id, 1, $collapse_instance_suffix_fb, $topLevelClass, $topLevelClassStart, $topLevelClassEnd);
			$menuContent .= '</ul></nav>';
		}
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

// Add theme color class only if no custom color is set
if (!$hasColorClass) {
	if ($theme_effective === 'dark') {
		$titleClasses[] = 'text-white';
	} else {
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
