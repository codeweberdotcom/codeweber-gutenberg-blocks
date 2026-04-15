/**
 * Menu Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { MenuSidebar } from './sidebar';
import {
	generateColorClass,
	generateTypographyClasses,
} from '../../utilities/class-generators';

const MenuEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		mode,
		wpMenuId,
		taxonomySlug,
		taxonomyRestBase,
		taxonomyHideEmpty,
		depth,
		orientation,
		theme,
		listType,
		bulletColor,
		bulletBg,
		iconClass,
		textColor,
		items,
		menuClass,
		menuId,
		menuData,
		itemClass,
		linkClass,
		containerClass,
		topLevelClass,
		topLevelClassStart,
		topLevelClassEnd,
		enableWidget,
		enableMegaMenu,
		columns,
		enableTitle,
		title,
		titleTag,
		titleClass,
		titleColor,
		titleColorType,
		titleSize,
		titleWeight,
		titleTransform,
		useCollapse,
		collapseListType,
	} = attributes;

	const previousModeRef = useRef(mode);
	const previousWpMenuIdRef = useRef(wpMenuId);
	const [isLoadingMenu, setIsLoadingMenu] = useState(false);
	const [wpMenus, setWpMenus] = useState([]);
	const [wpTaxonomies, setWpTaxonomies] = useState([]);

	// Ensure item.text is always a string (API may return { rendered: "..." } for HTML menu items)
	const safeItemText = (item) => {
		const t = item?.text;
		if (typeof t === 'string') return t;
		if (t && typeof t === 'object' && 'rendered' in t) return t.rendered != null ? String(t.rendered) : '';
		return '';
	};

	// Fetch WordPress menus on mount
	useEffect(() => {
		const fetchMenus = async () => {
			try {
				const menus = await apiFetch({
					path: '/wp/v2/menus',
				});
				setWpMenus(menus || []);
			} catch (error) {
				console.error('Error fetching menus:', error);
				setWpMenus([]);
			}
		};
		fetchMenus();
	}, []);

	// Fetch public taxonomies on mount (for Taxonomy data source)
	useEffect(() => {
		const fetchTaxonomies = async () => {
			try {
				const taxonomies = await apiFetch({
					path: '/wp/v2/taxonomies?context=edit',
				});
				const list = Object.entries(taxonomies || {}).map(([slug, tax]) => ({
					slug,
					name: tax.name || slug,
					rest_base: tax.rest_base || slug,
					types: Array.isArray(tax.types) ? tax.types : [],
				}));
				setWpTaxonomies(list);
			} catch (error) {
				console.error('Error fetching taxonomies:', error);
				setWpTaxonomies([]);
			}
		};
		fetchTaxonomies();
	}, []);

	// Ensure all item IDs are unique and contain clientId
	useEffect(() => {
		if (!items || items.length === 0) {
			return;
		}

		const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
		const hasInvalidIds = items.some(
			(item) => !item.id || !item.id.includes(clientIdPrefix)
		);

		if (!hasInvalidIds) {
			return;
		}

		const baseTime = Date.now();
		const updatedItems = items.map((item, index) => {
			if (!item.id || !item.id.includes(clientIdPrefix)) {
				const randomSuffix = Math.floor(Math.random() * 1000);
				return {
					...item,
					id: `item-${clientIdPrefix}-${baseTime}-${index}-${randomSuffix}`,
				};
			}
			return item;
		});

		setAttributes({ items: updatedItems });
	}, [clientId, items, setAttributes]);

	// Fetch WordPress menu items when mode is 'wp-menu'
	useEffect(() => {
		if (mode !== 'wp-menu' || !wpMenuId) {
			previousModeRef.current = mode;
			previousWpMenuIdRef.current = wpMenuId;
			return;
		}

		const menuIdChanged = previousWpMenuIdRef.current !== wpMenuId;
		const modeChangedToWpMenu =
			previousModeRef.current !== mode && mode === 'wp-menu';

		if (menuIdChanged || modeChangedToWpMenu) {
			const fetchMenuItems = async () => {
				setIsLoadingMenu(true);
				try {
					const menuItems = await apiFetch({
						path: `/wp/v2/menu-items?menus=${wpMenuId}&per_page=100`,
					});

					// Exclude invalid items (menu-item-invalid: Некорректно)
					// REST API returns 'invalid', status trash/draft
					const validItems = (Array.isArray(menuItems) ? menuItems : []).filter(
						(item) =>
							item.status !== 'trash' &&
							item.status !== 'draft' &&
							!item.invalid &&
							!item._invalid
					);

					// Transform menu items to list items (with parent for depth filtering)
					// title can be object { rendered: "..." } for HTML menu items - always extract string
					const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
					const getItemText = (item) => {
						const t = item.title;
						if (typeof t === 'string') return t;
						if (t && typeof t === 'object' && 'rendered' in t) return t.rendered != null ? String(t.rendered) : '';
						return __('Untitled', 'codeweber-gutenberg-blocks');
					};
					const transformedItems = validItems.map((item, index) => ({
						id: `item-${clientIdPrefix}-${item.id}-${Date.now()}-${index}`,
						text: getItemText(item),
						url: item.url || item.meta?.menu_item_url || '#',
						parent: parseInt(item.meta?.menu_item_parent ?? item.parent ?? 0, 10),
						wpId: item.id,
					}));

					setAttributes({ items: transformedItems });
					setIsLoadingMenu(false);
				} catch (error) {
					console.error('Error fetching menu items:', error);
					setAttributes({ items: [] });
					setIsLoadingMenu(false);
				}
			};

			fetchMenuItems();
			previousModeRef.current = mode;
			previousWpMenuIdRef.current = wpMenuId;
		}
	}, [mode, wpMenuId, clientId, setAttributes]);

	// Fetch taxonomy terms when mode is 'taxonomy' for editor preview (учитываем Hide empty terms)
	const lastFetchedTaxonomyKeyRef = useRef(null);
	useEffect(() => {
		if (mode !== 'taxonomy' || !taxonomySlug) {
			if (mode !== 'taxonomy') lastFetchedTaxonomyKeyRef.current = null;
			return;
		}
		const hideEmpty = taxonomyHideEmpty === true;
		const fetchKey = `${taxonomySlug}-${hideEmpty}`;
		if (lastFetchedTaxonomyKeyRef.current === fetchKey) return;
		lastFetchedTaxonomyKeyRef.current = fetchKey;
		const fetchTerms = async () => {
			try {
				const restBase =
					taxonomyRestBase ||
					(taxonomySlug === 'category' ? 'categories' : taxonomySlug === 'post_tag' ? 'tags' : taxonomySlug);
				// hide_empty=1 скрывает пустые термины, 0 — показывать все (как get_terms на фронте)
				const terms = await apiFetch({
					path: `/wp/v2/${restBase}?per_page=100&_fields=id,name,slug,parent,link&hide_empty=${hideEmpty ? 1 : 0}`,
				});
				const list = Array.isArray(terms) ? terms : [];
				const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
				const transformedItems = list.map((term, index) => ({
					id: `term-${clientIdPrefix}-${term.id}-${index}`,
					text: term.name || term.slug || '',
					url: term.link || '#',
					parent: parseInt(term.parent ?? 0, 10),
					wpId: term.id,
				}));
				setAttributes({ items: transformedItems });
			} catch (error) {
				console.error('Error fetching taxonomy terms:', error);
				setAttributes({ items: [] });
			}
		};
		fetchTerms();
	}, [mode, taxonomySlug, taxonomyRestBase, taxonomyHideEmpty, clientId, setAttributes]);

	const updateItem = (index, field, value) => {
		const newItems = [...items];
		newItems[index] = {
			...newItems[index],
			[field]: value,
		};
		setAttributes({ items: newItems });
	};

	const addItem = () => {
		const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
		const newItem = {
			id: `item-${clientIdPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
			text: __('New menu item', 'codeweber-gutenberg-blocks'),
			url: '#',
		};
		setAttributes({ items: [...items, newItem] });
	};

	const removeItem = (index) => {
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
	};

	const moveItem = (index, direction) => {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === items.length - 1)
		) {
			return;
		}

		const newItems = [...items];
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		[newItems[index], newItems[targetIndex]] = [
			newItems[targetIndex],
			newItems[index],
		];
		setAttributes({ items: newItems });
	};

	// Get list classes
	const getListClasses = () => {
		if (enableMegaMenu) {
			const cols = columns ?? 1;
			const ccClass = cols === 2 ? 'cc-2' : cols === 3 ? 'cc-3' : '';
			return ['list-unstyled', ccClass, 'pb-lg-1'].filter(Boolean).join(' ');
		}

		const classes = [];

		// Base classes from menuClass attribute
		if (menuClass) {
			classes.push(...menuClass.split(' '));
		}

		if (listType === 'unordered') {
			classes.push('unordered-list');
		} else if (listType === 'icon') {
			classes.push('icon-list');
		}

		if (listType !== 'none' && bulletColor && bulletColor !== 'none') {
			classes.push(`bullet-${bulletColor}`);
		}

		if (listType === 'icon' && bulletBg) {
			classes.push('bullet-bg');
			if (bulletColor && bulletColor !== 'none') {
				classes.push(`bullet-soft-${bulletColor}`);
			}
		}

		if (textColor) {
			classes.push(`text-${textColor}`);
		}

		classes.push('d-flex');
		classes.push((orientation || 'horizontal') === 'vertical' ? 'flex-column' : 'flex-md-row');

		return classes.join(' ');
	};

	// Collapse mode: 1|2|3 = navbar-nav + list-unstyled + menu-collapse-N; 4 = simple list (list-unstyled menu-list-type-4)
	const getCollapseListClasses = () => {
		if (collapseListType === '4') {
			return 'list-unstyled menu-list-type-4';
		}
		const type = collapseListType === '2' || collapseListType === '3' ? collapseListType : '1';
		return `navbar-nav list-unstyled menu-collapse-${type}`;
	};

	const getCollapseSubListClasses = () => {
		if (collapseListType === '4') {
			return 'list-unstyled menu-type-4-sub';
		}
		return getCollapseListClasses();
	};

	// Tree by parent for collapse markup (same structure as render.php). Custom items без parent — один уровень.
	const buildByParent = (itemsList) => {
		const by = {};
		(itemsList || []).forEach((item, idx) => {
			const p = parseInt(item.parent, 10) || 0;
			if (!by[p]) by[p] = [];
			by[p].push({ ...item, wp_id: item.wpId ?? item.id ?? idx + 1 });
		});
		return by;
	};

	// Type 4: simple list (no collapse), mirrors render.php $render_menu_level for collapseListType 4
	const renderSimpleLevel = (byParent, parentId, depthLimit, currentLevel, listClassStr, subListClassStr, linkClass, textThemeClass) => {
		const children = byParent[parentId] || [];
		const nestedUlClass = subListClassStr || listClassStr;
		return children.map((item) => {
			const hasChildren =
				(depthLimit === 0 || currentLevel < depthLimit) &&
				(byParent[item.wp_id]?.length > 0);
			const linkClasses = [textThemeClass, linkClass].filter(Boolean).join(' ');
			return (
				<li key={item.id}>
					<a href={item.url || '#'} className={linkClasses || undefined} style={{ pointerEvents: 'none' }}>
						{safeItemText(item)}
					</a>
					{hasChildren && (
						<ul className={nestedUlClass}>
							{renderSimpleLevel(byParent, item.wp_id, depthLimit, currentLevel + 1, listClassStr, subListClassStr, linkClass, textThemeClass)}
						</ul>
					)}
				</li>
			);
		});
	};

	// Recursive collapse level (mirrors render.php $render_menu_collapse)
	const renderCollapseLevel = (
		byParent,
		parentId,
		depthLimit,
		currentLevel,
		listClassStr,
		itemClass,
		linkClass,
		textThemeClass,
		wrapperId,
		instanceSuffix,
		topLevelClass,
		topLevelClassStart,
		topLevelClassEnd
	) => {
		const children = byParent[parentId] || [];
		return children.map((item, index) => {
			const hasChildren =
				(depthLimit === 0 || currentLevel < depthLimit) &&
				(byParent[item.wp_id]?.length > 0);
			const collapseId = `menu-collapse-item-${item.wp_id}${instanceSuffix ? '-' + instanceSuffix : ''}`;
			const linkClasses = [
				'nav-link',
				'd-block',
				hasChildren && 'flex-grow-1',
				textThemeClass,
				linkClass,
			]
				.filter(Boolean)
				.join(' ');
			// Верхний уровень: первый — top_level_class_start, последний — top_level_class_end, иначе top_level_class
			const isFirstTop = currentLevel === 1 && index === 0;
			const isLastTop = currentLevel === 1 && index === children.length - 1;
			const topClass =
				currentLevel === 1
					? isFirstTop && topLevelClassStart
						? topLevelClassStart
						: isLastTop && topLevelClassEnd
							? topLevelClassEnd
							: topLevelClass
					: '';
			const liClasses = [
				'nav-item',
				'parent-collapse-item',
				currentLevel === 1 && 'parent-item',
				topClass,
				itemClass,
				hasChildren && 'collapse-has-children',
			]
				.filter(Boolean)
				.join(' ');

			if (hasChildren) {
				return (
					<li key={item.id} className={liClasses}>
						<div className="menu-collapse-row d-flex align-items-center justify-content-between">
							<a
								href={item.url || '#'}
								className={linkClasses}
								style={{ pointerEvents: 'none' }}
							>
								{safeItemText(item)}
							</a>
							<button
								type="button"
								className={`btn-collapse w-5 h-5 ${textThemeClass || ''}`}
								data-bs-toggle="collapse"
								data-bs-target={`#${collapseId}`}
								aria-expanded="false"
								aria-controls={collapseId}
								aria-label={__(
									'Expand submenu',
									'codeweber-gutenberg-blocks'
								)}
							>
								<span className="toggle_block" aria-hidden="true">
									<i className="uil uil-angle-down sidebar-catalog-icon" />
								</span>
							</button>
						</div>
						<div
							className="collapse"
							id={collapseId}
							data-bs-parent={`#${wrapperId}`}
						>
							<ul className={listClassStr}>
								{renderCollapseLevel(
									byParent,
									item.wp_id,
									depthLimit,
									currentLevel + 1,
									listClassStr,
									itemClass,
									linkClass,
									textThemeClass,
									wrapperId,
									instanceSuffix,
									topLevelClass,
									topLevelClassStart,
									topLevelClassEnd
								)}
							</ul>
						</div>
					</li>
				);
			}
			return (
				<li key={item.id} className={liClasses}>
					<a
						href={item.url || '#'}
						className={linkClasses}
						style={{ pointerEvents: 'none' }}
					>
						{safeItemText(item)}
					</a>
				</li>
			);
		});
	};

	// Type 5: vertical dropdown (dropend) — как на фронте: nav-link/dropdown-item, dropdown-toggle, dropdown-menu
	const renderDropdownLevel = (byParent, parentId, depthLimit, currentLevel, textThemeClass, linkClass) => {
		const children = byParent[parentId] || [];
		return children.map((item) => {
			const hasChildren =
				(depthLimit === 0 || currentLevel < depthLimit) &&
				(byParent[item.wp_id]?.length > 0);
			const isTopLevel = currentLevel === 1;
			const linkLabel = isTopLevel ? 'nav-link' : 'dropdown-item';
			const linkClasses = [
				linkLabel,
				hasChildren && 'dropdown-toggle',
				textThemeClass,
				linkClass,
			]
				.filter(Boolean)
				.join(' ');
			const liClasses = [
				'nav-item',
				isTopLevel && 'parent-item',
				hasChildren && 'dropdown dropend',
				!isTopLevel && hasChildren && 'dropdown-submenu',
			]
				.filter(Boolean)
				.join(' ');

			if (hasChildren) {
				return (
					<li key={item.id} className={liClasses}>
						<a
							href={item.url || '#'}
							className={linkClasses}
							data-bs-toggle="dropdown"
							aria-expanded="false"
							style={{
								pointerEvents: 'none',
								justifyContent: 'space-between',
							}}
						>
							{safeItemText(item)}
						</a>
						<ul className="dropdown-menu rounded-0">
							{renderDropdownLevel(
								byParent,
								item.wp_id,
								depthLimit,
								currentLevel + 1,
								textThemeClass,
								linkClass
							)}
						</ul>
					</li>
				);
			}
			return (
				<li key={item.id} className={liClasses}>
					<a
						href={item.url || '#'}
						className={linkClasses}
						style={{ pointerEvents: 'none' }}
					>
						{safeItemText(item)}
					</a>
				</li>
			);
		});
	};

	// Horizontal dropdown level: top-level dropdown вниз, вложенные — dropend вправо
	const renderHorizontalLevel = (byParent, parentId, depthLimit, currentLevel, textThemeClass, linkClass) => {
		const children = byParent[parentId] || [];
		return children.map((item) => {
			const hasChildren =
				(depthLimit === 0 || currentLevel < depthLimit) &&
				(byParent[item.wp_id]?.length > 0);
			const isTopLevel = currentLevel === 1;
			const linkLabel = isTopLevel ? 'nav-link' : 'dropdown-item';
			const linkClasses = [
				linkLabel,
				hasChildren && 'dropdown-toggle',
				textThemeClass,
				linkClass,
			]
				.filter(Boolean)
				.join(' ');
			const liClasses = [
				'nav-item',
				hasChildren && (isTopLevel ? 'dropdown' : 'dropdown dropdown-submenu dropend'),
			]
				.filter(Boolean)
				.join(' ');

			if (hasChildren) {
				return (
					<li key={item.id} className={liClasses}>
						<a
							href={item.url || '#'}
							className={linkClasses}
							data-bs-toggle="dropdown"
							aria-expanded="false"
							style={{ pointerEvents: 'none' }}
						>
							{safeItemText(item)}
						</a>
						<ul className="dropdown-menu">
							{renderHorizontalLevel(
								byParent,
								item.wp_id,
								depthLimit,
								currentLevel + 1,
								textThemeClass,
								linkClass
							)}
						</ul>
					</li>
				);
			}
			return (
				<li key={item.id} className={liClasses}>
					<a
						href={item.url || '#'}
						className={linkClasses}
						style={{ pointerEvents: 'none' }}
					>
						{safeItemText(item)}
					</a>
				</li>
			);
		});
	};

	// Tree order (depth-first) for items with parent — для таксономий и WP Menu
	const getItemsInTreeOrder = (itemsList) => {
		if (!itemsList?.length) return [];
		const byParent = {};
		itemsList.forEach((item) => {
			const p = parseInt(item.parent, 10) || 0;
			if (!byParent[p]) byParent[p] = [];
			byParent[p].push(item);
		});
		// sort each level by name
		Object.keys(byParent).forEach((k) => {
			byParent[k].sort((a, b) =>
				(a.text || '').localeCompare(b.text || '', undefined, { sensitivity: 'base' })
			);
		});
		const out = [];
		const visit = (parentId) => {
			(byParent[parentId] || []).forEach((item) => {
				out.push(item);
				visit(parseInt(item.wpId, 10));
			});
		};
		visit(0);
		return out;
	};

	// Filter items by depth for wp-menu / taxonomy (depth 0 = all levels), return in tree order
	const getItemsForDisplay = () => {
		if (!items?.length) return items || [];
		const isTreeSource = mode === 'wp-menu' || mode === 'taxonomy';
		const depthLimit = typeof depth === 'number' ? depth : 0;

		const getItemDepth = (item, visited = new Set()) => {
			const parentId = parseInt(item.parent, 10);
			if (!parentId) return 1;
			if (visited.has(parentId)) return 1;
			visited.add(parentId);
			const parentItem = items.find((i) => parseInt(i.wpId, 10) === parentId);
			if (!parentItem) return 1;
			return 1 + getItemDepth(parentItem, visited);
		};

		const ordered = isTreeSource ? getItemsInTreeOrder(items) : items;
		if (depthLimit === 0) return ordered;
		return ordered.filter((item) => getItemDepth(item) <= depthLimit);
	};

	const displayItems = getItemsForDisplay();

	const themeClass =
		(theme || 'light') === 'dark' ? 'menu-dark' : 'menu-light';
	const blockProps = useBlockProps({
		id: menuId || undefined,
		className: themeClass,
	});

	// Parse data attributes
	const getDataAttributes = () => {
		if (!menuData) return {};
		const dataAttrs = {};
		const pairs = menuData.split(',');
		pairs.forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttrs[`data-${key}`] = value;
			}
		});
		return dataAttrs;
	};

	// Generate title classes
	const getTitleClasses = () => {
		const classes = [];
		if (enableWidget) classes.push('widget-title');
		if (enableMegaMenu) classes.push('dropdown-header');

		// Color classes
		let hasColorClass = false;
		if (titleColor) {
			const colorClass = generateColorClass(
				titleColor,
				titleColorType,
				'text'
			);
			if (colorClass) {
				classes.push(colorClass);
				hasColorClass = true;
			}
		}

		// Add theme color class only if no custom color is set (default/inverse — не добавляем)
		if (!hasColorClass) {
			if ((theme || 'light') === 'dark') {
				classes.push('text-white');
			} else {
				classes.push('text-dark');
			}
		}

		// Typography classes (mega menu: force h6 size)
		const typographyAttrs = enableMegaMenu
			? { ...attributes, titleSize: 'h6' }
			: attributes;
		const typographyClasses = generateTypographyClasses(
			typographyAttrs,
			'title'
		);
		classes.push(...typographyClasses);

		// Custom class
		if (titleClass) {
			classes.push(titleClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	// Превью collapse: WP Menu (depth >= 1) или Taxonomy с иерархией. При depth 0 в редакторе collapse не показываем.
	const depthNum = typeof depth === 'number' ? depth : 1;
	const isHorizontal = (orientation || 'horizontal') === 'horizontal' && !enableMegaMenu;
	// Горизонтальный превью: navbar-nav с dropdown-подменю
	const showHorizontalPreview = isHorizontal && items.length > 0 && (
		(mode === 'wp-menu' && wpMenuId && depthNum >= 1 && !isLoadingMenu) ||
		(mode === 'taxonomy' && taxonomySlug) ||
		(mode === 'custom')
	);
	// В редакторе collapse-вёрстка: только для вертикального режима
	const showCollapsePreview =
		!isHorizontal && (
			(mode === 'wp-menu' &&
				useCollapse &&
				wpMenuId &&
				depthNum >= 1 &&
				!isLoadingMenu &&
				items.length > 0) ||
			(mode === 'taxonomy' && taxonomySlug && items.length > 0) ||
			(mode === 'custom' && items.length > 0)
		);

	const treeSourceId =
		mode === 'wp-menu' && wpMenuId
			? String(wpMenuId)
			: mode === 'taxonomy' && taxonomySlug
				? `tax-${taxonomySlug}`
				: mode === 'custom'
					? 'custom'
					: 'block';
	const collapseWrapperId =
		showCollapsePreview
			? `menu-collapse-${treeSourceId}-${clientId.replace(/-/g, '').slice(0, 12)}`
			: '';
	// Цвет задаётся темой .navbar-light/.navbar-dark .nav-link, классы text-dark/text-white не добавляем
	const textThemeClass = '';

	const menuContent = (
		<>
			{isLoadingMenu && (
				<div style={{ padding: '20px', textAlign: 'center' }}>
					{__('Loading menu...', 'codeweber-gutenberg-blocks')}
				</div>
			)}
			{!isLoadingMenu && items.length === 0 && mode === 'wp-menu' && (
				<div style={{ padding: '20px', textAlign: 'center' }}>
					{__(
						'No menu items found. Please select a WordPress menu.',
						'codeweber-gutenberg-blocks'
					)}
				</div>
			)}
			{!isLoadingMenu && items.length === 0 && mode === 'taxonomy' && taxonomySlug && (
				<div style={{ padding: '20px', textAlign: 'center' }}>
					{__(
						'No terms found. Select another taxonomy or add terms.',
						'codeweber-gutenberg-blocks'
					)}
				</div>
			)}
			{showHorizontalPreview && (
				<ul className="navbar-nav flex-md-row">
					{renderHorizontalLevel(
						buildByParent(items),
						0,
						typeof depth === 'number' ? depth : 0,
						1,
						textThemeClass,
						linkClass || ''
					)}
				</ul>
			)}
			{showCollapsePreview && (
				<nav
					id={collapseWrapperId}
					className={
						collapseListType === '5'
							? [
									'navbar-vertical',
									'navbar-vertical-dropdown',
									(theme || 'light') === 'dark' && 'navbar-dark',
									(theme || 'light') === 'light' && 'navbar-light',
									containerClass || '',
							  ]
									.filter(Boolean)
									.join(' ')
							: collapseListType === '4'
							? [
									'navbar-vertical',
									(theme || 'light') === 'dark' && 'navbar-dark',
									(theme || 'light') === 'light' && 'navbar-light',
									containerClass || '',
							  ]
									.filter(Boolean)
									.join(' ')
							: [
									'navbar-vertical',
									'menu-collapse-nav',
									(theme || 'light') === 'dark' && 'navbar-dark',
									(theme || 'light') === 'light' && 'navbar-light',
									containerClass || '',
							  ]
									.filter(Boolean)
									.join(' ')
					}
				>
					<ul
						className={
							collapseListType === '5'
								? 'navbar-nav flex-column'
								: getCollapseListClasses()
						}
					>
						{collapseListType === '5'
							? renderDropdownLevel(
									buildByParent(items),
									0,
									typeof depth === 'number' ? depth : 0,
									1,
									textThemeClass,
									linkClass || ''
							  )
							: collapseListType === '4'
							? renderSimpleLevel(
									buildByParent(items),
									0,
									typeof depth === 'number' ? depth : 0,
									1,
									getCollapseListClasses(),
									getCollapseSubListClasses(),
									linkClass || '',
									textThemeClass
							  )
							: renderCollapseLevel(
									buildByParent(items),
									0,
									typeof depth === 'number' ? depth : 0,
									1,
									getCollapseListClasses(),
									itemClass || '',
									linkClass || '',
									textThemeClass,
									collapseWrapperId,
									'editor',
									topLevelClass || '',
									topLevelClassStart || '',
									topLevelClassEnd || ''
							  )}
					</ul>
				</nav>
			)}
			{!showCollapsePreview && !showHorizontalPreview && (mode === 'wp-menu'
				? displayItems.length > 0 && !isLoadingMenu && depthNum >= 1
				: true) && (
				<ul className={getListClasses()}>
					{displayItems.map((item, displayIndex) => {
						const actualIndex = items.findIndex((i) => i.id === item.id);
						const liThemeClass = '';
						const liClasses = [liThemeClass, itemClass || ''].filter(Boolean).join(' ');
						if (enableMegaMenu) {
							return (
								<li key={item.id} className={liClasses} style={mode === 'custom' ? { position: 'relative' } : undefined}>
									{mode === 'custom' ? (
										<>
											<a
												href={item.url || '#'}
												className="dropdown-item"
												style={{ pointerEvents: 'none' }}
											>
												<RichText
													tagName="span"
													value={safeItemText(item)}
													onChange={(value) =>
														updateItem(
															actualIndex >= 0 ? actualIndex : displayIndex,
															'text',
															value
														)
													}
													placeholder={__(
														'Enter menu item...',
														'codeweber-gutenberg-blocks'
													)}
													withoutInteractiveFormatting
												/>
											</a>
											<div
												className="menu-item-controls"
												style={{
													position: 'absolute',
													right: '10px',
													top: '-18px',
													display: 'flex',
													gap: '4px',
													zIndex: 10,
												}}
											>
												<Button
													isSmall
													onClick={() =>
														moveItem(actualIndex >= 0 ? actualIndex : displayIndex, 'up')
													}
													disabled={actualIndex <= 0}
													title={__('Move up', 'codeweber-gutenberg-blocks')}
												>
													↑
												</Button>
												<Button
													isSmall
													onClick={() =>
														moveItem(actualIndex >= 0 ? actualIndex : displayIndex, 'down')
													}
													disabled={
														actualIndex >= items.length - 1 || actualIndex < 0
													}
													title={__('Move down', 'codeweber-gutenberg-blocks')}
												>
													↓
												</Button>
												<Button
													isSmall
													isDestructive
													onClick={() =>
														removeItem(actualIndex >= 0 ? actualIndex : displayIndex)
													}
													title={__('Remove', 'codeweber-gutenberg-blocks')}
												>
													×
												</Button>
											</div>
										</>
									) : (
										<a href={item.url || '#'} className="dropdown-item">
											{safeItemText(item)}
										</a>
									)}
								</li>
							);
						}
						return (
						<li
							key={item.id}
							className={liClasses}
							style={{ position: 'relative' }}
						>
							{listType === 'icon' && (
								<span>
									<i
										className={
											iconClass || 'uil uil-arrow-right'
										}
									></i>
								</span>
							)}
							<span className="">
								{mode === 'custom' ? (
									<>
										<a
											href={item.url || '#'}
											className={[ linkClass || '' ]
												.filter(Boolean)
												.join(' ')}
											style={{ pointerEvents: 'none' }}
										>
											<RichText
												tagName="span"
												value={safeItemText(item)}
												onChange={(value) =>
													updateItem(
														actualIndex >= 0 ? actualIndex : displayIndex,
														'text',
														value
													)
												}
												placeholder={__(
													'Enter menu item...',
													'codeweber-gutenberg-blocks'
												)}
												withoutInteractiveFormatting
											/>
										</a>
										<div
											className="menu-item-controls"
											style={{
												position: 'absolute',
												right: '10px',
												top: '-18px',
												display: 'flex',
												gap: '4px',
												zIndex: 10,
											}}
										>
											<Button
												isSmall
												onClick={() =>
													moveItem(actualIndex >= 0 ? actualIndex : displayIndex, 'up')
												}
												disabled={actualIndex <= 0}
												title={__(
													'Move up',
													'codeweber-gutenberg-blocks'
												)}
											>
												↑
											</Button>
											<Button
												isSmall
												onClick={() =>
													moveItem(actualIndex >= 0 ? actualIndex : displayIndex, 'down')
												}
												disabled={
													actualIndex >= items.length - 1 || actualIndex < 0
												}
												title={__(
													'Move down',
													'codeweber-gutenberg-blocks'
												)}
											>
												↓
											</Button>
											<Button
												isSmall
												isDestructive
												onClick={() =>
													removeItem(actualIndex >= 0 ? actualIndex : displayIndex)
												}
												title={__(
													'Remove',
													'codeweber-gutenberg-blocks'
												)}
											>
												×
											</Button>
										</div>
									</>
								) : (
									<a
										href={item.url || '#'}
										className={[ linkClass || '' ]
											.filter(Boolean)
											.join(' ')}
										style={{ pointerEvents: 'none' }}
									>
										{safeItemText(item)}
									</a>
								)}
							</span>
						</li>
					);
					})}
				</ul>
			)}
			{mode === 'custom' && (
				<Button
					isPrimary
					onClick={addItem}
					style={{ marginTop: '16px' }}
				>
					{__('+ Add Menu Item', 'codeweber-gutenberg-blocks')}
				</Button>
			)}
		</>
	);

	return (
		<>
			<InspectorControls>
				<MenuSidebar
					attributes={attributes}
					setAttributes={setAttributes}
					wpMenus={wpMenus}
					wpTaxonomies={wpTaxonomies}
				/>
			</InspectorControls>

			<div {...blockProps} {...getDataAttributes()}>
				{enableWidget ? (
					<div className="widget">
						{enableTitle && (
							<RichText
								tagName={enableMegaMenu ? 'div' : (titleTag || 'h4')}
								value={title}
								onChange={(value) =>
									setAttributes({ title: value })
								}
								placeholder={__(
									'Enter title...',
									'codeweber-gutenberg-blocks'
								)}
								className={getTitleClasses()}
							/>
						)}
						{menuContent}
					</div>
				) : (
					<>
						{enableTitle && (
							<RichText
								tagName={enableMegaMenu ? 'div' : (titleTag || 'h4')}
								value={title}
								onChange={(value) =>
									setAttributes({ title: value })
								}
								placeholder={__(
									'Enter title...',
									'codeweber-gutenberg-blocks'
								)}
								className={getTitleClasses()}
							/>
						)}
						{menuContent}
					</>
				)}
			</div>
		</>
	);
};

export default MenuEdit;
