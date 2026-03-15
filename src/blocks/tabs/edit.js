/**
 * Tabs Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { serialize, parse } from '@wordpress/blocks';
import { TabsSidebar } from './sidebar';
import { IconPicker } from '../../components/icon/IconPicker';

const ALLOWED_BLOCKS = [
	// Core WordPress blocks
	'core/paragraph',
	'core/heading',
	'core/image',
	'core/list',
	'core/quote',
	'core/code',
	'core/preformatted',
	'core/pullquote',
	'core/verse',
	'core/table',
	'core/columns',
	'core/group',
	'core/spacer',
	'core/separator',
	'core/embed',
	'core/video',
	'core/audio',
	'core/file',
	'core/gallery',
	'core/cover',
	'core/media-text',
	'core/buttons',
	'core/shortcode',
	// Codeweber blocks
	'codeweber-blocks/accordion',
	'codeweber-blocks/button',
	'codeweber-blocks/section',
	'codeweber-blocks/column',
	'codeweber-blocks/columns',
	'codeweber-blocks/heading-subtitle',
	'codeweber-blocks/icon',
	'codeweber-blocks/lists',
	'codeweber-blocks/media',
	'codeweber-blocks/paragraph',
	'codeweber-blocks/card',
	'codeweber-blocks/feature',
	'codeweber-blocks/image-simple',
	'codeweber-blocks/post-grid',
	'codeweber-blocks/tabs',
];

/**
 * Convert innerBlocksByTab value to an array of block objects.
 * Handles both new format (HTML string) and old format (array of block objects).
 */
const getBlocksFromTabContent = (tabContent) => {
	if (!tabContent) return [];
	if (typeof tabContent === 'string') {
		try {
			return parse(tabContent);
		} catch (e) {
			return [];
		}
	}
	if (Array.isArray(tabContent)) {
		// Old format: array of block objects stored directly
		return tabContent;
	}
	return [];
};

const TabsEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		tabStyle,
		tabRounded,
		tabAlignment,
		tabBackground,
		activeTab,
		items,
		tabsId,
		tabsClass,
		tabsData,
	} = attributes;

	const [iconPickerOpen, setIconPickerOpen] = useState(null);

	const { getBlocks } = useSelect((select) => ({
		getBlocks: select('core/block-editor').getBlocks,
	}));

	const currentBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId),
		[clientId]
	);

	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	// Generate stable tabsId once on first render (not based on clientId)
	useEffect(() => {
		if (!tabsId) {
			const randomId = Math.random().toString(36).substr(2, 9);
			setAttributes({ tabsId: `tabs-${randomId}` });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Ensure items have stable IDs (not based on clientId)
	useEffect(() => {
		if (!items || items.length === 0) return;
		const needsIds = items.some((item) => !item.id);
		if (!needsIds) return;

		const updatedItems = items.map((item, index) => {
			if (!item.id) {
				const randomId = Math.random().toString(36).substr(2, 9);
				return { ...item, id: `tab-${randomId}-${index}` };
			}
			return item;
		});
		setAttributes({ items: updatedItems });
	}, [items, setAttributes]);

	// Initialize innerBlocksByTab entries for any new tabs
	useEffect(() => {
		if (!items || items.length === 0) return;

		const innerBlocksByTab = attributes.innerBlocksByTab || {};
		let needsUpdate = false;
		const updatedInnerBlocks = { ...innerBlocksByTab };

		items.forEach((item) => {
			if (!(item.id in updatedInnerBlocks)) {
				updatedInnerBlocks[item.id] = '';
				needsUpdate = true;
			}
		});

		// Remove entries for deleted tabs
		Object.keys(updatedInnerBlocks).forEach((tabId) => {
			if (!items.find((item) => item.id === tabId)) {
				delete updatedInnerBlocks[tabId];
				needsUpdate = true;
			}
		});

		if (needsUpdate) {
			setAttributes({ innerBlocksByTab: updatedInnerBlocks });
		}
	}, [items]); // eslint-disable-line react-hooks/exhaustive-deps

	// Load innerBlocks for active tab on mount and when activeTab changes
	const previousActiveTabRef = useRef(activeTab);
	const previousInnerBlocksRef = useRef([]);
	const saveTimeoutRef = useRef(null);
	const isInitialLoadRef = useRef(true);

	useEffect(() => {
		if (!items || items.length === 0 || activeTab >= items.length) return;

		if (previousActiveTabRef.current !== activeTab) {
			const activeTabId = items[activeTab].id;
			const innerBlocksByTab = attributes.innerBlocksByTab || {};

			// Save current tab's blocks before switching
			if (
				previousActiveTabRef.current >= 0 &&
				previousActiveTabRef.current < items.length
			) {
				const previousTabId = items[previousActiveTabRef.current].id;
				const currentBlocksList = getBlocks(clientId);
				const updatedInnerBlocks = {
					...innerBlocksByTab,
					[previousTabId]: serialize(currentBlocksList),
				};
				setAttributes({ innerBlocksByTab: updatedInnerBlocks });
			}

			// Load new tab's blocks
			const newTabContent = innerBlocksByTab[activeTabId];
			const newTabBlocks = getBlocksFromTabContent(newTabContent);
			replaceInnerBlocks(clientId, newTabBlocks, false);
			previousInnerBlocksRef.current = newTabBlocks;
			previousActiveTabRef.current = activeTab;
			isInitialLoadRef.current = true;
		}
	}, [activeTab, items, clientId, replaceInnerBlocks]); // eslint-disable-line react-hooks/exhaustive-deps

	// Auto-save current innerBlocks when they change (debounced)
	useEffect(() => {
		if (!items || items.length === 0 || activeTab >= items.length) return;

		if (isInitialLoadRef.current) {
			isInitialLoadRef.current = false;
			previousInnerBlocksRef.current = currentBlocks || [];
			return;
		}

		const blocksChanged =
			JSON.stringify(currentBlocks) !==
			JSON.stringify(previousInnerBlocksRef.current);

		if (blocksChanged && currentBlocks) {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
			saveTimeoutRef.current = setTimeout(() => {
				const activeTabId = items[activeTab].id;
				const innerBlocksByTab = attributes.innerBlocksByTab || {};
				const blocksToSave = getBlocks(clientId);
				const updatedInnerBlocks = {
					...innerBlocksByTab,
					[activeTabId]: serialize(blocksToSave),
				};
				setAttributes({ innerBlocksByTab: updatedInnerBlocks });
				previousInnerBlocksRef.current = blocksToSave;
			}, 500);
		}

		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [currentBlocks]); // eslint-disable-line react-hooks/exhaustive-deps

	// Save current innerBlocks immediately when switching tabs
	const handleTabSwitch = (newActiveTab) => {
		if (newActiveTab === activeTab || newActiveTab >= items.length) return;

		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
			saveTimeoutRef.current = null;
		}

		const currentBlocksList = getBlocks(clientId);
		const activeTabId = items[activeTab].id;
		const innerBlocksByTab = attributes.innerBlocksByTab || {};
		const updatedInnerBlocks = {
			...innerBlocksByTab,
			[activeTabId]: serialize(currentBlocksList),
		};

		const newTabId = items[newActiveTab].id;
		const newTabContent = updatedInnerBlocks[newTabId];
		const newTabBlocks = getBlocksFromTabContent(newTabContent);

		setAttributes({
			innerBlocksByTab: updatedInnerBlocks,
			activeTab: newActiveTab,
		});

		replaceInnerBlocks(clientId, newTabBlocks, false);
		previousInnerBlocksRef.current = newTabBlocks;
		previousActiveTabRef.current = newActiveTab;
	};

	// Ensure first tab is active by default
	useEffect(() => {
		if (activeTab !== 0 && items.length > 0) {
			setAttributes({ activeTab: 0 });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const updateItem = (index, field, value) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		setAttributes({ items: newItems });
	};

	const addItem = () => {
		const randomId = Math.random().toString(36).substr(2, 9);
		const newItem = {
			id: `tab-${randomId}-${Date.now()}`,
			title: __('New Tab', 'codeweber-gutenberg-blocks'),
			icon: '',
		};
		setAttributes({ items: [...items, newItem] });
	};

	const removeItem = (index) => {
		if (items.length === 1) return;
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
		if (activeTab === index) {
			setAttributes({ activeTab: 0 });
		} else if (activeTab > index) {
			setAttributes({ activeTab: activeTab - 1 });
		}
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

		if (activeTab === index) {
			setAttributes({ activeTab: targetIndex });
		} else if (activeTab === targetIndex) {
			setAttributes({ activeTab: index });
		}
	};

	const switchTab = (index) => {
		handleTabSwitch(index);
	};

	// Get tabs classes
	const getTabsClasses = () => {
		const classes = ['nav', 'nav-tabs'];

		if (tabStyle === 'basic') {
			classes.push('nav-tabs-basic');
		} else if (tabStyle === 'pills') {
			classes.push('nav-pills');
		} else if (tabStyle === 'fanny') {
			classes.push('nav-tabs-fanny');
			classes.push('width-auto');

			if (tabRounded) {
				if (tabRounded === 'theme') {
					const themeClass =
						typeof window !== 'undefined' &&
						window.cwgbTabsThemeRounded
							? (window.cwgbTabsThemeRounded.class || '').trim()
							: '';
					if (themeClass) {
						classes.push(`tab-${themeClass}`);
						classes.push(themeClass);
					}
				} else {
					classes.push(`tab-${tabRounded}`);
					classes.push(tabRounded);
				}
			}

			if (tabAlignment === 'center') {
				classes.push('mx-auto');
			} else if (tabAlignment === 'right') {
				classes.push('ms-auto');
			}

			if (tabBackground === true) {
				classes.push('bg-white', 'p-1', 'shadow-xl');
			}
		}

		if (tabsClass) {
			classes.push(tabsClass);
		}
		return classes.join(' ');
	};

	const getTabContentClasses = (index) => {
		const classes = ['tab-pane', 'fade'];
		if (index === activeTab) {
			classes.push('show', 'active');
		}
		return classes.join(' ');
	};

	const blockProps = useBlockProps({
		className: tabsClass || '',
		id: tabsId,
	});

	const getIconName = (iconClass) => {
		if (!iconClass) return '';
		const match = iconClass.match(/uil-([^\s]+)/);
		return match ? match[1] : '';
	};

	return (
		<>
			<InspectorControls>
				<TabsSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div
				{...blockProps}
				{...(tabsData ? { 'data-codeweber': tabsData } : {})}
			>
				{/* Tabs Navigation */}
				<ul className={getTabsClasses()} role="tablist">
					{items.map((item, index) => (
						<li
							key={item.id}
							className="nav-item"
							style={{ position: 'relative' }}
						>
							{/* Item Controls */}
							<div
								className="tabs-item-controls"
								style={{
									position: 'absolute',
									top: '-18px',
									right: '8px',
									display: 'flex',
									gap: '4px',
									opacity: 0.7,
									zIndex: 10,
								}}
							>
								<Button
									isSmall
									onClick={(e) => {
										e.stopPropagation();
										moveItem(index, 'up');
									}}
									disabled={index === 0}
									title={__(
										'Move left',
										'codeweber-gutenberg-blocks'
									)}
								>
									←
								</Button>
								<Button
									isSmall
									onClick={(e) => {
										e.stopPropagation();
										moveItem(index, 'down');
									}}
									disabled={index === items.length - 1}
									title={__(
										'Move right',
										'codeweber-gutenberg-blocks'
									)}
								>
									→
								</Button>
								<Button
									isSmall
									isDestructive
									onClick={(e) => {
										e.stopPropagation();
										removeItem(index);
									}}
									disabled={items.length === 1}
									title={__(
										'Remove',
										'codeweber-gutenberg-blocks'
									)}
								>
									×
								</Button>
							</div>

							<button
								type="button"
								className={`nav-link ${index === activeTab ? 'active' : ''}`}
								role="tab"
								aria-selected={index === activeTab}
								aria-controls={item.id}
								onClick={(e) => {
									const target = e.target;
									const isRichText =
										target.closest(
											'[contenteditable="true"]'
										) || target.closest('.rich-text');
									const isIcon =
										target.closest('i') ||
										target.closest('span[title*="icon"]');
									const isControls = target.closest(
										'.tabs-item-controls'
									);

									if (!isRichText && !isIcon && !isControls) {
										e.preventDefault();
										switchTab(index);
									}
								}}
								onMouseDown={(e) => {
									const target = e.target;
									const isRichText =
										target.closest(
											'[contenteditable="true"]'
										) || target.closest('.rich-text');
									const isIcon =
										target.closest('i') ||
										target.closest('span[title*="icon"]');
									const isControls = target.closest(
										'.tabs-item-controls'
									);

									if (!isRichText && !isIcon && !isControls) {
										e.preventDefault();
									}
								}}
								style={{
									cursor: 'pointer',
									border: 'none',
									background: 'transparent',
									width: '100%',
									textAlign: 'left',
								}}
							>
								{item.icon && (
									<span
										onClick={(e) => {
											e.stopPropagation();
											setIconPickerOpen(item.id);
										}}
										onMouseDown={(e) =>
											e.stopPropagation()
										}
										style={{
											cursor: 'pointer',
											marginRight: item.title
												? '0.5rem'
												: '0',
										}}
										title={__(
											'Click to change icon',
											'codeweber-gutenberg-blocks'
										)}
									>
										<i className={item.icon}></i>
									</span>
								)}
								{!item.icon && (
									<span
										onClick={(e) => {
											e.stopPropagation();
											setIconPickerOpen(item.id);
										}}
										onMouseDown={(e) =>
											e.stopPropagation()
										}
										style={{
											cursor: 'pointer',
											marginRight: item.title
												? '0.5rem'
												: '0',
											opacity: 0.5,
										}}
										title={__(
											'Click to add icon',
											'codeweber-gutenberg-blocks'
										)}
									>
										<i
											className="uil uil-plus"
											style={{ fontSize: '0.8rem' }}
										></i>
									</span>
								)}
								<RichText
									tagName="span"
									value={item.title}
									onChange={(value) =>
										updateItem(index, 'title', value)
									}
									placeholder={__(
										'Tab title...',
										'codeweber-gutenberg-blocks'
									)}
									withoutInteractiveFormatting
									onClick={(e) => e.stopPropagation()}
									onMouseDown={(e) => e.stopPropagation()}
								/>
							</button>
						</li>
					))}
				</ul>

				{/* Tab Content */}
				<div className="tab-content">
					{items.map((item, index) => {
						const isActive = index === activeTab;

						return (
							<div
								key={item.id}
								className={getTabContentClasses(index)}
								id={item.id}
								role="tabpanel"
								aria-labelledby={`tab-${item.id}`}
								style={{
									display: isActive ? 'block' : 'none',
									pointerEvents: isActive ? 'auto' : 'none',
									position: 'relative',
									zIndex: isActive ? 1 : 0,
								}}
							>
								{isActive && (
									<InnerBlocks
										allowedBlocks={ALLOWED_BLOCKS}
										templateLock={false}
									/>
								)}
							</div>
						);
					})}
				</div>

				{/* Add Tab Button */}
				<div style={{ marginTop: '16px' }}>
					<Button isPrimary onClick={addItem}>
						{__('+ Add Tab', 'codeweber-gutenberg-blocks')}
					</Button>
				</div>

				{/* Icon Pickers */}
				{items.map((item, index) => (
					<IconPicker
						key={`icon-picker-${item.id}`}
						isOpen={iconPickerOpen === item.id}
						onClose={() => setIconPickerOpen(null)}
						onSelect={(result) => {
							const iconClass = result.iconName
								? `uil uil-${result.iconName}`
								: '';
							updateItem(index, 'icon', iconClass);
						}}
						selectedIcon={getIconName(item.icon)}
						selectedType="font"
						initialTab="font"
						allowFont={true}
						allowSvgLineal={false}
						allowSvgSolid={false}
					/>
				))}
			</div>
		</>
	);
};

export default TabsEdit;
