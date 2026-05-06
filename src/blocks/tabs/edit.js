/**
 * Tabs Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { createBlock, parse } from '@wordpress/blocks';
import { TabsSidebar } from './sidebar';

// Stable references — must be outside the component so the array identity
// never changes between renders. A new array on every render tricks Gutenberg
// into thinking the template changed and resets inner blocks to the template.
const TABS_ALLOWED_BLOCKS = ['codeweber-blocks/tab-panel'];
const TABS_TEMPLATE = [
	['codeweber-blocks/tab-panel', { tabTitle: 'Tab 1' }],
	['codeweber-blocks/tab-panel', { tabTitle: 'Tab 2' }],
];

const TabsEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		tabStyle,
		tabRounded,
		tabAlignment,
		tabBackground,
		tabsId,
		tabsClass,
		tabsData,
	} = attributes;

	// Generate stable tabsId once
	useEffect(() => {
		if (!tabsId) {
			const randomId = Math.random().toString(36).substr(2, 9);
			setAttributes({ tabsId: `tabs-${randomId}` });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Get inner tab-panel blocks for nav rendering
	const innerBlocks = useSelect(
		(s) => s('core/block-editor').getBlocks(clientId),
		[clientId]
	);

	const { insertBlock, replaceInnerBlocks } = useDispatch('core/block-editor');

	// One-time migration: old format (items + innerBlocksByTab) → inner blocks
	useEffect(() => {
		const oldItems = (attributes.items || []).filter((item) => item.id && item.id !== '');
		if (oldItems.length === 0) return;

		const currentBlocks = select('core/block-editor').getBlocks(clientId);
		if (currentBlocks.length > 0) return;

		const oldInnerBlocksByTab = attributes.innerBlocksByTab || {};

		const blocksToInsert = oldItems.map((item) => {
			const tabContent = oldInnerBlocksByTab[item.id] || '';
			let innerInnerBlocks = [];
			if (typeof tabContent === 'string' && tabContent.trim()) {
				try {
					innerInnerBlocks = parse(tabContent);
				} catch (e) {
					innerInnerBlocks = [];
				}
			} else if (Array.isArray(tabContent)) {
				innerInnerBlocks = tabContent;
			}
			return createBlock(
				'codeweber-blocks/tab-panel',
				{
					tabTitle: item.title || 'Tab',
					tabIcon: item.icon || '',
				},
				innerInnerBlocks
			);
		});

		replaceInnerBlocks(clientId, blocksToInsert, false);
		setAttributes({ items: [], innerBlocksByTab: {}, activeTab: 0 });
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const addTab = () => {
		const newBlock = createBlock('codeweber-blocks/tab-panel', {
			tabTitle: __('New Tab', 'codeweber-gutenberg-blocks'),
		});
		insertBlock(newBlock, innerBlocks.length, clientId, false);
	};

	const getNavClasses = () => {
		const classes = ['nav', 'nav-tabs'];

		if (tabStyle === 'basic') {
			classes.push('nav-tabs-basic');
		} else if (tabStyle === 'pills') {
			classes.push('nav-pills');
		} else if (tabStyle === 'fanny') {
			classes.push('nav-tabs-fanny', 'width-auto');

			if (tabRounded) {
				if (tabRounded === 'theme') {
					const themeClass =
						typeof window !== 'undefined' && window.cwgbTabsThemeRounded
							? (window.cwgbTabsThemeRounded.class || '').trim()
							: '';
					if (themeClass) {
						classes.push(`tab-${themeClass}`, themeClass);
					}
				} else {
					classes.push(`tab-${tabRounded}`, tabRounded);
				}
			}

			if (tabAlignment === 'center') classes.push('mx-auto');
			else if (tabAlignment === 'right') classes.push('ms-auto');

			if (tabBackground) classes.push('bg-white', 'p-1', 'shadow-xl');
		}

		if (tabsClass) classes.push(tabsClass);
		return classes.join(' ');
	};

	const blockProps = useBlockProps({
		className: tabsClass || '',
		id: tabsId,
	});

	const { activeTab } = attributes;

	return (
		<>
			<InspectorControls>
				<TabsSidebar attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>

			<div
				{...blockProps}
				{...(tabsData ? { 'data-codeweber': tabsData } : {})}
			>
				{/* Tab Navigation — clickable, switches active panel in editor */}
				<ul className={getNavClasses()} role="tablist">
					{innerBlocks.map((block, index) => (
						<li key={block.clientId} className="nav-item" role="presentation">
							<button
								type="button"
								className={`nav-link ${index === activeTab ? 'active' : ''}`}
								onClick={() => setAttributes({ activeTab: index })}
								style={{ border: 'none', background: 'none' }}
							>
								{block.attributes.tabIcon && (
									<i
										className={block.attributes.tabIcon}
										style={{ marginRight: '0.4rem' }}
									/>
								)}
								{block.attributes.tabTitle || `Tab ${index + 1}`}
							</button>
						</li>
					))}
					<li className="nav-item" style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
						<Button
							isSmall
							variant="secondary"
							onClick={addTab}
						>
							{__('+ Add Tab', 'codeweber-gutenberg-blocks')}
						</Button>
					</li>
				</ul>

				{/* Tab Content — one panel visible at a time */}
				<div className="tab-content">
					<InnerBlocks
						allowedBlocks={TABS_ALLOWED_BLOCKS}
						template={TABS_TEMPLATE}
						templateLock={false}
						renderAppender={false}
					/>
				</div>
			</div>
		</>
	);
};

export default TabsEdit;
