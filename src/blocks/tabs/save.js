/**
 * Tabs Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { serialize } from '@wordpress/blocks';

const TabsSave = ({ attributes }) => {
	const { tabStyle, items, tabsId, tabsClass, tabsData, innerBlocksByTab } = attributes;

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
		if (index === 0) {
			classes.push('show', 'active');
		}
		return classes.join(' ');
	};

	const blockProps = useBlockProps.save({
		className: tabsClass || '',
		id: tabsId || undefined,
		...(tabsData ? { 'data-codeweber': tabsData } : {}),
	});

	return (
		<div {...blockProps}>
			{/* Tabs Navigation */}
			<ul className={getTabsClasses()} role="tablist">
				{items.map((item, index) => (
					<li key={item.id} className="nav-item">
						<a
							className={`nav-link ${index === 0 ? 'active' : ''}`}
							data-bs-toggle="tab"
							href={`#${item.id}`}
							role="tab"
							aria-selected={index === 0}
							aria-controls={item.id}
						>
							{item.icon && (
								<i className={item.icon} style={{ marginRight: item.title ? '0.5rem' : '0' }}></i>
							)}
							{item.title}
						</a>
					</li>
				))}
			</ul>

			{/* Tab Content */}
			<div className="tab-content">
				{items.map((item, index) => {
					const tabInnerBlocks = innerBlocksByTab?.[item.id] || [];
					const serializedContent = tabInnerBlocks.length > 0 ? serialize(tabInnerBlocks) : '';
					
					return (
						<div
							key={item.id}
							className={getTabContentClasses(index)}
							id={item.id}
							role="tabpanel"
							aria-labelledby={`tab-${item.id}`}
							dangerouslySetInnerHTML={{ __html: serializedContent }}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default TabsSave;
