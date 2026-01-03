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

const MenuEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		mode,
		wpMenuId,
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
		const hasInvalidIds = items.some(item => !item.id || !item.id.includes(clientIdPrefix));

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
		const modeChangedToWpMenu = previousModeRef.current !== mode && mode === 'wp-menu';

		if (menuIdChanged || modeChangedToWpMenu) {
			const fetchMenuItems = async () => {
				setIsLoadingMenu(true);
				try {
					const menuItems = await apiFetch({
						path: `/wp/v2/menu-items?menus=${wpMenuId}&per_page=100`,
					});

					// Transform menu items to list items
					const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
					const transformedItems = menuItems.map((item, index) => ({
						id: `item-${clientIdPrefix}-${item.id}-${Date.now()}-${index}`,
						text: item.title?.rendered || item.title || __('Untitled', 'codeweber-gutenberg-blocks'),
						url: item.url || item.meta?.menu_item_url || '#',
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

		// Bullet color
		if (bulletColor && bulletColor !== 'none') {
			classes.push(`bullet-${bulletColor}`);
		}

		// Bullet background (only for icon-list)
		if (listType === 'icon' && bulletBg) {
			classes.push('bullet-bg');
			// Add soft color class if bulletColor is set
			if (bulletColor && bulletColor !== 'none') {
				classes.push(`bullet-soft-${bulletColor}`);
			}
		}

		// Text color
		if (textColor) {
			classes.push(`text-${textColor}`);
		}

		return classes.join(' ');
	};

	const blockProps = useBlockProps({
		className: theme === 'dark' ? 'menu-dark' : 'menu-light',
		id: menuId || undefined,
	});

	// Parse data attributes
	const getDataAttributes = () => {
		if (!menuData) return {};
		const dataAttrs = {};
		const pairs = menuData.split(',');
		pairs.forEach(pair => {
			const [key, value] = pair.split('=').map(s => s.trim());
			if (key && value) {
				dataAttrs[`data-${key}`] = value;
			}
		});
		return dataAttrs;
	};

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
				{isLoadingMenu && (
					<div style={{ padding: '20px', textAlign: 'center' }}>
						{__('Loading menu...', 'codeweber-gutenberg-blocks')}
					</div>
				)}
				{!isLoadingMenu && items.length === 0 && mode === 'wp-menu' && (
					<div style={{ padding: '20px', textAlign: 'center' }}>
						{__('No menu items found. Please select a WordPress menu.', 'codeweber-gutenberg-blocks')}
					</div>
				)}
				{(mode === 'wp-menu' ? (items.length > 0 && !isLoadingMenu) : true) && (
					<ul className={getListClasses()}>
						{items.map((item, index) => (
							<li key={item.id} style={{ position: 'relative' }}>
								{listType === 'icon' && (
									<span><i className={iconClass || 'uil uil-arrow-right'}></i></span>
								)}
								<span>
									{mode === 'custom' ? (
										<>
											<a href={item.url || '#'} style={{ pointerEvents: 'none' }}>
												<RichText
													tagName="span"
													value={item.text}
													onChange={(value) => updateItem(index, 'text', value)}
													placeholder={__('Enter menu item...', 'codeweber-gutenberg-blocks')}
													withoutInteractiveFormatting
												/>
											</a>
											<div className="menu-item-controls" style={{
												position: 'absolute',
												right: '10px',
												top: '-18px',
												display: 'flex',
												gap: '4px',
												zIndex: 10,
											}}>
												<Button
													isSmall
													onClick={() => moveItem(index, 'up')}
													disabled={index === 0}
													title={__('Move up', 'codeweber-gutenberg-blocks')}
												>
													↑
												</Button>
												<Button
													isSmall
													onClick={() => moveItem(index, 'down')}
													disabled={index === items.length - 1}
													title={__('Move down', 'codeweber-gutenberg-blocks')}
												>
													↓
												</Button>
												<Button
													isSmall
													isDestructive
													onClick={() => removeItem(index)}
													title={__('Remove', 'codeweber-gutenberg-blocks')}
												>
													×
												</Button>
											</div>
										</>
									) : (
										<a href={item.url || '#'}>{item.text}</a>
									)}
								</span>
							</li>
						))}
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
			</div>
		</>
	);
};

export default MenuEdit;

