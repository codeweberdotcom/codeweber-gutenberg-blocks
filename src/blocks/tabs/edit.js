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
import { TabsSidebar } from './sidebar';
import { IconPicker } from '../../components/icon/IconPicker';

const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading', 'core/image', 'core/list', 'core/quote', 'core/code', 'core/preformatted', 'core/pullquote', 'core/verse', 'core/table', 'core/columns', 'core/group'];

const TabsEdit = ({ attributes, setAttributes, clientId }) => {
	const { tabStyle, activeTab, items, tabsId, tabsClass, tabsData } = attributes;
	const previousClientIdRef = useRef(clientId);
	const [iconPickerOpen, setIconPickerOpen] = useState(null); // itemId -> isOpen
	
	// Get inner blocks for current tab
	const { getBlocks } = useSelect((select) => ({
		getBlocks: select('core/block-editor').getBlocks,
	}));
	
	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	
	// Initialize innerBlocks storage for each tab
	useEffect(() => {
		if (!items || items.length === 0) return;
		
		const innerBlocksByTab = attributes.innerBlocksByTab || {};
		let needsUpdate = false;
		const updatedInnerBlocks = { ...innerBlocksByTab };
		
		// Ensure each tab has an entry
		items.forEach((item) => {
			if (!updatedInnerBlocks[item.id]) {
				updatedInnerBlocks[item.id] = [];
				needsUpdate = true;
			}
		});
		
		// Remove entries for deleted tabs
		Object.keys(updatedInnerBlocks).forEach((tabId) => {
			if (!items.find(item => item.id === tabId)) {
				delete updatedInnerBlocks[tabId];
				needsUpdate = true;
			}
		});
		
		if (needsUpdate) {
			setAttributes({ innerBlocksByTab: updatedInnerBlocks });
		}
	}, [items]);
	
	// Load innerBlocks for active tab on mount and when activeTab changes
	useEffect(() => {
		if (!items || items.length === 0 || activeTab >= items.length) return;
		
		const activeTabId = items[activeTab].id;
		const innerBlocksByTab = attributes.innerBlocksByTab || {};
		const tabInnerBlocks = innerBlocksByTab[activeTabId] || [];
		
		// Only replace if current blocks are different
		const currentBlocks = getBlocks(clientId);
		if (JSON.stringify(currentBlocks) !== JSON.stringify(tabInnerBlocks)) {
			replaceInnerBlocks(clientId, tabInnerBlocks, false);
			previousInnerBlocksRef.current = tabInnerBlocks;
		}
	}, [activeTab, items, clientId, attributes.innerBlocksByTab]);
	
	// Save current innerBlocks when they change
	const previousInnerBlocksRef = useRef([]);
	useEffect(() => {
		if (!items || items.length === 0 || activeTab >= items.length) return;
		
		const currentBlocks = getBlocks(clientId);
		const blocksChanged = JSON.stringify(currentBlocks) !== JSON.stringify(previousInnerBlocksRef.current);
		
		if (blocksChanged) {
			const activeTabId = items[activeTab].id;
			const innerBlocksByTab = attributes.innerBlocksByTab || {};
			const updatedInnerBlocks = {
				...innerBlocksByTab,
				[activeTabId]: currentBlocks,
			};
			setAttributes({ innerBlocksByTab: updatedInnerBlocks });
			previousInnerBlocksRef.current = currentBlocks;
		}
	}, [activeTab, items, clientId, attributes.innerBlocksByTab]);
	
	// Save current innerBlocks when switching tabs
	const handleTabSwitch = (newActiveTab) => {
		if (newActiveTab === activeTab || newActiveTab >= items.length) return;
		
		// Save current innerBlocks to previous tab
		const currentBlocks = getBlocks(clientId);
		const activeTabId = items[activeTab].id;
		const innerBlocksByTab = attributes.innerBlocksByTab || {};
		const updatedInnerBlocks = {
			...innerBlocksByTab,
			[activeTabId]: currentBlocks,
		};
		
		// Load innerBlocks for new tab
		const newTabId = items[newActiveTab].id;
		const newTabInnerBlocks = updatedInnerBlocks[newTabId] || [];
		
		setAttributes({ 
			innerBlocksByTab: updatedInnerBlocks,
			activeTab: newActiveTab,
		});
		
		replaceInnerBlocks(clientId, newTabInnerBlocks, false);
		previousInnerBlocksRef.current = newTabInnerBlocks;
	};

	// Generate unique tabs ID based on clientId
	useEffect(() => {
		const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
		const expectedTabsId = `tabs-${clientIdPrefix}`;
		
		if (tabsId !== expectedTabsId) {
			setAttributes({ tabsId: expectedTabsId });
		}
	}, [clientId, tabsId, setAttributes]);

	// Ensure all item IDs are unique and contain clientId
	useEffect(() => {
		if (!items || items.length === 0) {
			previousClientIdRef.current = clientId;
			return;
		}
		
		const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
		const clientIdChanged = previousClientIdRef.current !== clientId;
		const hasInvalidIds = items.some(item => !item.id || !item.id.includes(clientIdPrefix));
		
		if (!clientIdChanged && !hasInvalidIds) {
			return;
		}
		
		const baseTime = Date.now();
		const updatedItems = items.map((item, index) => {
			if (!item.id || !item.id.includes(clientIdPrefix)) {
				const randomSuffix = Math.floor(Math.random() * 1000);
				return {
					...item,
					id: `tab-${clientIdPrefix}-${baseTime}-${index}-${randomSuffix}`,
				};
			}
			return item;
		});
		
		setAttributes({ items: updatedItems });
		previousClientIdRef.current = clientId;
	}, [clientId, items, setAttributes]);

	// Ensure first tab is active by default
	useEffect(() => {
		if (activeTab !== 0 && items.length > 0) {
			setAttributes({ activeTab: 0 });
		}
	}, []);

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
			id: `tab-${clientIdPrefix}-${Date.now()}`,
			title: __('New Tab', 'codeweber-gutenberg-blocks'),
			icon: '',
		};
		setAttributes({ items: [...items, newItem] });
	};

	const removeItem = (index) => {
		if (items.length === 1) return; // Don't allow removing the last tab
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
		// If removed tab was active, switch to first tab
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
		
		// Update activeTab if needed
		if (activeTab === index) {
			setAttributes({ activeTab: targetIndex });
		} else if (activeTab === targetIndex) {
			setAttributes({ activeTab: index });
		}
	};

	const switchTab = (index) => {
		setAttributes({ activeTab: index });
	};

	// Get tabs classes
	const getTabsClasses = () => {
		const classes = ['nav', 'nav-tabs'];
		if (tabStyle === 'basic') {
			classes.push('nav-tabs-basic');
		} else if (tabStyle === 'pills') {
			classes.push('nav-pills');
		}
		if (tabsClass) {
			classes.push(tabsClass);
		}
		return classes.join(' ');
	};

	// Get tab content classes
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

	// Get icon name from class
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

			<div {...blockProps} {...(tabsData ? { 'data-codeweber': tabsData } : {})}>
				{/* Tabs Navigation */}
				<ul className={getTabsClasses()} role="tablist">
					{items.map((item, index) => (
						<li key={item.id} className="nav-item">
							<a
								className={`nav-link ${index === activeTab ? 'active' : ''}`}
								href={`#${item.id}`}
								role="tab"
								aria-selected={index === activeTab}
								aria-controls={item.id}
								onClick={(e) => {
									e.preventDefault();
									switchTab(index);
								}}
								style={{ cursor: 'pointer' }}
							>
								{item.icon && (
									<span
										onClick={(e) => {
											e.stopPropagation();
											setIconPickerOpen(item.id);
										}}
										style={{ cursor: 'pointer', marginRight: item.title ? '0.5rem' : '0' }}
										title={__('Click to change icon', 'codeweber-gutenberg-blocks')}
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
										style={{ cursor: 'pointer', marginRight: item.title ? '0.5rem' : '0', opacity: 0.5 }}
										title={__('Click to add icon', 'codeweber-gutenberg-blocks')}
									>
										<i className="uil uil-plus" style={{ fontSize: '0.8rem' }}></i>
									</span>
								)}
								<RichText
									tagName="span"
									value={item.title}
									onChange={(value) => updateItem(index, 'title', value)}
									placeholder={__('Tab title...', 'codeweber-gutenberg-blocks')}
									withoutInteractiveFormatting
									onClick={(e) => e.stopPropagation()}
								/>
							</a>
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
								style={{ display: isActive ? 'block' : 'none' }}
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

				{/* Item Controls - Show on hover */}
				{items.map((item, index) => (
					<div
						key={`controls-${item.id}`}
						style={{
							position: 'absolute',
							top: '-18px',
							right: `${8 + (items.length - index - 1) * 120}px`,
							display: 'flex',
							gap: '4px',
							opacity: 0.7,
							zIndex: 10,
						}}
					>
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
							disabled={items.length === 1}
							title={__('Remove', 'codeweber-gutenberg-blocks')}
						>
							×
						</Button>
					</div>
				))}

				{/* Icon Pickers for each tab */}
				{items.map((item, index) => (
					<IconPicker
						key={`icon-picker-${item.id}`}
						isOpen={iconPickerOpen === item.id}
						onClose={() => setIconPickerOpen(null)}
						onSelect={(result) => {
							const iconClass = result.iconName ? `uil uil-${result.iconName}` : '';
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
