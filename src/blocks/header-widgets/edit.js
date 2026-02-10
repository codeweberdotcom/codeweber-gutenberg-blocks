/**
 * Header Widgets Block - Edit Component
 * Single block with enable/disable and reorderable elements
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	Button,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { IconPicker } from '../../components/icon/IconPicker';
import { useState, useEffect } from '@wordpress/element';
import { chevronUp, chevronDown } from '@wordpress/icons';

const ELEMENT_LABELS = {
	'search': __('Search', 'codeweber-gutenberg-blocks'),
	'offcanvas-info': __('Offcanvas Info', 'codeweber-gutenberg-blocks'),
	'custom-offcanvas': __('Custom Offcanvas', 'codeweber-gutenberg-blocks'),
	'offcanvas-toggle': __('Custom Offcanvas', 'codeweber-gutenberg-blocks'), // legacy
};

const getIconName = (iconClass) => {
	if (!iconClass) return 'info-circle';
	const match = iconClass.match(/uil-([^\s]+)/);
	return match ? match[1] : 'info-circle';
};

const HeaderWidgetsEdit = ({ attributes, setAttributes, clientId }) => {
	const { items } = attributes;
	const [iconPickerFor, setIconPickerFor] = useState(null);
	const [expandedItem, setExpandedItem] = useState(null);

	const blockProps = useBlockProps({
		className: 'header-widgets-editor',
		style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
	});

	// Ensure unique IDs
	useEffect(() => {
		if (!items?.length) return;
		const prefix = clientId.replace(/[^a-z0-9]/gi, '').slice(0, 8);
		let changed = false;
		const updated = items.map((item, i) => {
			if (!item.id || !item.id.includes(prefix)) {
				changed = true;
				return { ...item, id: `hw-${prefix}-${i}-${Date.now()}` };
			}
			return item;
		});
		if (changed) setAttributes({ items: updated });
	}, [clientId, items, setAttributes]);

	const VALID_TYPES = ['search', 'offcanvas-info', 'custom-offcanvas', 'offcanvas-toggle'];
	const sortedItems = [...(items || [])]
		.filter((item) => VALID_TYPES.includes(item.type))
		.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

	const moveItem = (index, direction) => {
		const newIdx = index + direction;
		if (newIdx < 0 || newIdx >= sortedItems.length) return;
		const arr = [...sortedItems];
		[arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
		const updated = arr.map((item, i) => ({ ...item, order: i }));
		setAttributes({ items: updated });
	};

	const toggleEnabled = (itemId, enabled) => {
		setAttributes({
			items: items.map((it) =>
				it.id === itemId ? { ...it, enabled } : it
			),
		});
	};

	const updateItem = (itemId, updates) => {
		setAttributes({
			items: items.map((it) =>
				it.id === itemId ? { ...it, ...updates } : it
			),
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Header Widgets', 'codeweber-gutenberg-blocks')} initialOpen={true} className="header-widgets-inspector">
					<p style={{ marginBottom: 12, fontSize: 12, color: '#666' }}>
						{__('Enable/disable and reorder elements.', 'codeweber-gutenberg-blocks')}
					</p>
					{sortedItems.map((item, index) => (
						<div
							key={item.id}
							style={{
								marginBottom: 12,
								padding: 10,
								border: '1px solid #ddd',
								borderRadius: 4,
								background: item.enabled ? '#fff' : '#f5f5f5',
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
								<Button
									icon={chevronUp}
									iconSize={18}
									disabled={index === 0}
									onClick={() => moveItem(index, -1)}
									label={__('Move up', 'codeweber-gutenberg-blocks')}
								/>
								<Button
									icon={chevronDown}
									iconSize={18}
									disabled={index === sortedItems.length - 1}
									onClick={() => moveItem(index, 1)}
									label={__('Move down', 'codeweber-gutenberg-blocks')}
								/>
								<ToggleControl
									label={ELEMENT_LABELS[item.type] || item.type}
									checked={!!item.enabled}
									onChange={(v) => toggleEnabled(item.id, v)}
								/>
								<Button
									isSmall
									variant="secondary"
									onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
								>
									{expandedItem === item.id ? __('Less', 'codeweber-gutenberg-blocks') : __('More', 'codeweber-gutenberg-blocks')}
								</Button>
							</div>
							{expandedItem === item.id && (
								<div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #eee' }}>
									{item.type === 'search' && (
										<>
											<Button
												isPrimary
												isSmall
												onClick={() => setIconPickerFor(item.id)}
												style={{ marginBottom: 8 }}
											>
												{__('Select Icon', 'codeweber-gutenberg-blocks')}
											</Button>
											<IconPicker
												isOpen={iconPickerFor === item.id}
												onClose={() => setIconPickerFor(null)}
												onSelect={(result) => {
													const cls = result.iconName ? `uil uil-${result.iconName}` : 'uil uil-search';
													updateItem(item.id, { iconClass: cls });
													setIconPickerFor(null);
												}}
												selectedIcon={getIconName(item.iconClass)}
												selectedType="font"
												initialTab="font"
												allowFont={true}
												allowSvgLineal={false}
												allowSvgSolid={false}
											/>
										</>
									)}
									{item.type === 'offcanvas-info' && (
										<TextareaControl
											label={__('HTML after nav', 'codeweber-gutenberg-blocks')}
											value={item.afterNavHtml || ''}
											onChange={(v) => updateItem(item.id, { afterNavHtml: v })}
											placeholder={__('HTML output after </nav><!-- /.navbar -->', 'codeweber-gutenberg-blocks')}
											help={__('Output after closing </nav>. Multiple items output in order.', 'codeweber-gutenberg-blocks')}
											rows={4}
										/>
									)}
									{(item.type === 'custom-offcanvas' || item.type === 'offcanvas-toggle') && (
										<>
											<Button
												isPrimary
												isSmall
												onClick={() => setIconPickerFor(item.id)}
												style={{ marginBottom: 8 }}
											>
												{__('Select Icon', 'codeweber-gutenberg-blocks')}
											</Button>
											<TextControl
												label={__('Offcanvas Target', 'codeweber-gutenberg-blocks')}
												value={item.offcanvasTarget || '#offcanvas-info'}
												onChange={(v) => updateItem(item.id, { offcanvasTarget: v })}
											/>
											<TextareaControl
												label={__('HTML after nav', 'codeweber-gutenberg-blocks')}
												value={item.afterNavHtml || ''}
												onChange={(v) => updateItem(item.id, { afterNavHtml: v })}
												placeholder={__('HTML output after </nav><!-- /.navbar -->', 'codeweber-gutenberg-blocks')}
												help={__('Output after closing </nav>. Multiple items output in order.', 'codeweber-gutenberg-blocks')}
												rows={4}
											/>
											<IconPicker
												isOpen={iconPickerFor === item.id}
												onClose={() => setIconPickerFor(null)}
												onSelect={(result) => {
													const cls = result.iconName ? `uil uil-${result.iconName}` : 'uil uil-info-circle';
													updateItem(item.id, { iconClass: cls });
													setIconPickerFor(null);
												}}
												selectedIcon={getIconName(item.iconClass)}
												selectedType="font"
												initialTab="font"
												allowFont={true}
												allowSvgLineal={false}
												allowSvgSolid={false}
											/>
										</>
									)}
								</div>
							)}
						</div>
					))}
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{sortedItems
					.filter((item) => item.enabled)
					.map((item) => (
						<div key={item.id} className="header-widgets-item-preview">
							<a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
								<i className={item.iconClass || (item.type === 'search' ? 'uil uil-search' : 'uil uil-info-circle')}></i>
							</a>
						</div>
					))}
			</div>
		</>
	);
};

export default HeaderWidgetsEdit;
