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
	} = attributes;

	const previousModeRef = useRef(mode);
	const previousWpMenuIdRef = useRef(wpMenuId);
	const [isLoadingMenu, setIsLoadingMenu] = useState(false);
	const [wpMenus, setWpMenus] = useState([]);

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

					// Transform menu items to list items (with parent for depth filtering)
					const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
					const transformedItems = menuItems.map((item, index) => ({
						id: `item-${clientIdPrefix}-${item.id}-${Date.now()}-${index}`,
						text:
							item.title?.rendered ||
							item.title ||
							__('Untitled', 'codeweber-gutenberg-blocks'),
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
		classes.push((orientation || 'horizontal') === 'vertical' ? 'flex-column' : 'flex-row');

		return classes.join(' ');
	};

	// Filter items by depth for wp-menu mode (depth 0 = all levels)
	const getItemsForDisplay = () => {
		if (mode !== 'wp-menu' || !items?.length) return items || [];
		const depthLimit = typeof depth === 'number' ? depth : 0;
		if (depthLimit === 0) return items;

		const getItemDepth = (item, visited = new Set()) => {
			const parentId = parseInt(item.parent, 10);
			if (!parentId) return 1;
			if (visited.has(parentId)) return 1;
			visited.add(parentId);
			const parentItem = items.find((i) => parseInt(i.wpId, 10) === parentId);
			if (!parentItem) return 1;
			return 1 + getItemDepth(parentItem, visited);
		};

		return items.filter((item) => getItemDepth(item) <= depthLimit);
	};

	const displayItems = getItemsForDisplay();

	const blockProps = useBlockProps({
		id: menuId || undefined,
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

		// Add theme color class only if no custom color is set
		if (!hasColorClass) {
			if (theme === 'dark') {
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
			{(mode === 'wp-menu'
				? displayItems.length > 0 && !isLoadingMenu
				: true) && (
				<ul className={getListClasses()}>
					{displayItems.map((item, displayIndex) => {
						const actualIndex = items.findIndex((i) => i.id === item.id);
						const liThemeClass = theme === 'dark' ? 'text-white' : 'text-dark';
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
													value={item.text}
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
											{item.text}
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
							<span
								className={
									theme === 'dark'
										? 'text-white'
										: 'text-dark'
								}
							>
								{mode === 'custom' ? (
									<>
										<a
											href={item.url || '#'}
											className={[
												theme === 'dark'
													? 'text-white'
													: 'text-dark',
												linkClass || '',
											]
												.filter(Boolean)
												.join(' ')}
											style={{ pointerEvents: 'none' }}
										>
											<RichText
												tagName="span"
												value={item.text}
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
										className={[
											theme === 'dark'
												? 'text-white'
												: 'text-dark',
											linkClass || '',
										]
											.filter(Boolean)
											.join(' ')}
										style={{ pointerEvents: 'none' }}
									>
										{item.text}
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
