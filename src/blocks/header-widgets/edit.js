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
	SelectControl,
} from '@wordpress/components';
import { IconPicker } from '../../components/icon/IconPicker';
import { useState, useEffect, useRef } from '@wordpress/element';
import { chevronUp, chevronDown } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';

const SEARCH_EXCLUDED_POST_TYPES = ['attachment', 'wp_block', 'wp_template', 'wp_template_part', 'wp_navigation', 'nav_menu_item', 'wp_global_styles', 'wp_font_family', 'wp_font_face', 'html_blocks', 'modal', 'header', 'footer', 'page-header', 'codeweber_form', 'cw_image_hotspot'];
const SEARCH_EXCLUDED_NAME_PATTERNS = ['элементы меню', 'меню навигации', 'модальные окна', 'modal', 'html блоки', 'html blocks', 'формы', 'forms', 'image hotspot', 'hotspot', 'hotspots'];

const ELEMENT_LABELS = {
	'search': __('Search', 'codeweber-gutenberg-blocks'),
	'offcanvas-info': __('Offcanvas Info', 'codeweber-gutenberg-blocks'),
	'custom-offcanvas': __('Custom Offcanvas', 'codeweber-gutenberg-blocks'),
	'offcanvas-toggle': __('Custom Offcanvas', 'codeweber-gutenberg-blocks'), // legacy
};

/** Default offcanvas panel elements (same as Redux "Order items in side menu") */
const DEFAULT_OFFCANVAS_ELEMENTS = [
	{ id: 'description', label: __('Description', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'phones', label: __('Phones', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'email', label: __('Email', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'map', label: __('Map', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'socials', label: __('Socials', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'menu', label: __('Menu', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'employee', label: __('Сотрудник', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'actual_address', label: __('Address', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'legal_address', label: __('Legal address', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'requisites', label: __('Requisites', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'widget_offcanvas_1', label: __('Widget 1', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'widget_offcanvas_2', label: __('Widget 2', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'widget_offcanvas_3', label: __('Widget 3', 'codeweber-gutenberg-blocks'), enabled: false },
];

// Legacy offcanvas element id (old theme used this for map); show "Map" in UI
const LEGACY_MAP_ID = String.fromCharCode(103, 97, 112);
/** Display label for map/gap element in sidebar - literal so a bad .po never shows "Gap" */
const MAP_DISPLAY_LABEL = 'Map';
const isMapOffcanvasElement = (el) => {
	if (!el || typeof el !== 'object') return false;
	const id = String(el.id ?? '').trim().toLowerCase();
	const lbl = String(el.label ?? '').trim().toLowerCase();
	return id === LEGACY_MAP_ID || id === 'map' || lbl === LEGACY_MAP_ID || (lbl && lbl.includes(LEGACY_MAP_ID));
};

/** Normalize offcanvas list for display: show "Map" for legacy map element in sidebar */
const normalizeOffcanvasForDisplay = (list) => {
	if (!Array.isArray(list)) return list;
	return list.map((el) => {
		const id = String(el.id ?? '').trim().toLowerCase();
		const lbl = String(el.label ?? '').trim().toLowerCase();
		if (id === LEGACY_MAP_ID || lbl === LEGACY_MAP_ID || id.includes(LEGACY_MAP_ID) || (lbl && lbl.includes(LEGACY_MAP_ID))) {
			return { ...el, id: 'map', label: __('Map', 'codeweber-gutenberg-blocks') };
		}
		return { ...el };
	});
};

// Элементы, которые больше не показываем в списке (устаревшие или неверно попавшие в сохранённые данные)
const OFFCANVAS_ELEMENT_IDS_HIDDEN = new Set(['address', 'offcanvas-info']);

const getOffcanvasElements = (item) => {
	let list = Array.isArray(item.offcanvasElements) && item.offcanvasElements.length > 0
		? normalizeOffcanvasForDisplay(item.offcanvasElements)
		: [];
	list = (list || []).filter((el) => !OFFCANVAS_ELEMENT_IDS_HIDDEN.has(String(el.id || '').toLowerCase()));
	const ids = new Set(list.map((el) => String(el.id || '').toLowerCase()));
	const missing = DEFAULT_OFFCANVAS_ELEMENTS.filter((d) => !ids.has(String(d.id || '').toLowerCase()));
	if (missing.length > 0) {
		list = [...list, ...missing.map((el) => ({ ...el }))];
	}
	if (list.length === 0) {
		return DEFAULT_OFFCANVAS_ELEMENTS.map((el) => ({ ...el }));
	}
	return list;
};

/** Display label for offcanvas element: show "Map" for legacy map element, "Address" for actual_address (sidebar) */
const getOffcanvasElementLabel = (el) => {
	if (!el || typeof el !== 'object') return '';
	const id = String(el.id ?? '').trim().toLowerCase();
	const label = String(el.label ?? '').trim().toLowerCase();
	if (id === LEGACY_MAP_ID || id.includes(LEGACY_MAP_ID) || label === LEGACY_MAP_ID || (label && label.includes(LEGACY_MAP_ID))) {
		return __('Map', 'codeweber-gutenberg-blocks');
	}
	if (id === 'actual_address') {
		return __('Address', 'codeweber-gutenberg-blocks');
	}
	const out = el.label || el.id || '';
	return (out && String(out).trim().toLowerCase() === LEGACY_MAP_ID) ? __('Map', 'codeweber-gutenberg-blocks') : out;
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
	const [searchPostTypeOptions, setSearchPostTypeOptions] = useState([]);
	const [draggedOffcanvasElem, setDraggedOffcanvasElem] = useState(null);
	const [staffForEmployee, setStaffForEmployee] = useState([]);

	useEffect(() => {
		apiFetch({ path: '/wp/v2/staff?per_page=100&status=publish' })
			.then((posts) => {
				if (!Array.isArray(posts)) {
					setStaffForEmployee([]);
					return;
				}
				setStaffForEmployee(
					posts.map((p) => {
						const name = [p._staff_name, p._staff_surname].filter(Boolean).join(' ').trim();
						const label = name || (p.title && (p.title.rendered || p.title.raw)) || String(p.id);
						return { id: p.id, name: label };
					})
				);
			})
			.catch(() => setStaffForEmployee([]));
	}, []);

	useEffect(() => {
		if (typeof window.cwgbSearchPostTypes !== 'undefined' && window.cwgbSearchPostTypes.postTypes?.length) {
			setSearchPostTypeOptions(window.cwgbSearchPostTypes.postTypes);
			return;
		}
		apiFetch({ path: '/wp/v2/types' }).then((types) => {
			const options = Object.keys(types)
				.filter((key) => {
					if (SEARCH_EXCLUDED_POST_TYPES.includes(key)) return false;
					const name = (types[key].name || '').toLowerCase();
					if (SEARCH_EXCLUDED_NAME_PATTERNS.some((p) => name.includes(p.toLowerCase()))) return false;
					return true;
				})
				.map((key) => ({ label: types[key].name || key, value: key }));
			setSearchPostTypeOptions(options.length ? options : [{ label: 'Post', value: 'post' }]);
		}).catch(() => setSearchPostTypeOptions([{ label: 'Post', value: 'post' }]));
	}, []);

	const blockProps = useBlockProps({
		className: 'header-widgets-editor',
		style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' },
	});

	// Ensure unique IDs (run once per block to avoid update loops)
	const hasFixedIdsRef = useRef(false);
	useEffect(() => {
		if (!items?.length || hasFixedIdsRef.current) return;
		hasFixedIdsRef.current = true;
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

	// Migrate legacy offcanvas element to "map" once per mount to avoid update loops
	const hasMigratedLegacyRef = useRef(false);
	useEffect(() => {
		if (!items?.length || hasMigratedLegacyRef.current) return;
		const updated = items.map((item) => {
			if (!Array.isArray(item.offcanvasElements) || !item.offcanvasElements.length) return item;
			let itemChanged = false;
			let migrated = item.offcanvasElements.map((el) => {
				const id = String(el.id ?? '').trim().toLowerCase();
				const lbl = String(el.label ?? '').trim().toLowerCase();
				if (id === LEGACY_MAP_ID || lbl === LEGACY_MAP_ID || id.includes(LEGACY_MAP_ID) || (lbl && lbl.includes(LEGACY_MAP_ID))) {
					itemChanged = true;
					return { id: 'map', label: __('Map', 'codeweber-gutenberg-blocks'), enabled: !!el.enabled };
				}
				return el;
			});
			const before = migrated.length;
			migrated = migrated.filter((el) => !OFFCANVAS_ELEMENT_IDS_HIDDEN.has(String(el.id ?? '').toLowerCase()));
			if (migrated.length !== before) itemChanged = true;
			return itemChanged ? { ...item, offcanvasElements: migrated } : item;
		});
		const hasChanges = updated.some((it, i) => it !== items[i]);
		if (hasChanges) {
			hasMigratedLegacyRef.current = true;
			setAttributes({ items: updated });
		}
	}, [items, setAttributes]);

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

	const offcanvasElements = (item) => getOffcanvasElements(item);
	const moveOffcanvasElement = (itemId, elemIndex, direction) => {
		const item = items.find((it) => it.id === itemId);
		if (!item) return;
		const list = [...getOffcanvasElements(item)];
		const newIdx = elemIndex + direction;
		if (newIdx < 0 || newIdx >= list.length) return;
		[list[elemIndex], list[newIdx]] = [list[newIdx], list[elemIndex]];
		updateItem(itemId, { offcanvasElements: list });
	};
	const toggleOffcanvasElement = (itemId, elemId, enabled) => {
		const item = items.find((it) => it.id === itemId);
		if (!item) return;
		const list = getOffcanvasElements(item).map((el) =>
			el.id === elemId ? { ...el, enabled } : el
		);
		updateItem(itemId, { offcanvasElements: list });
	};
	const reorderOffcanvasElements = (itemId, fromIndex, toIndex) => {
		if (fromIndex === toIndex) return;
		const item = items.find((it) => it.id === itemId);
		if (!item) return;
		const list = [...getOffcanvasElements(item)];
		const [removed] = list.splice(fromIndex, 1);
		list.splice(toIndex, 0, removed);
		updateItem(itemId, { offcanvasElements: list });
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
											<SelectControl
												label={__('Search display', 'codeweber-gutenberg-blocks')}
												value={item.searchDisplayType || 'offcanvas'}
												options={[
													{ value: 'offcanvas', label: __('Offcanvas', 'codeweber-gutenberg-blocks') },
													{ value: 'dropdown', label: __('Dropdown', 'codeweber-gutenberg-blocks') },
													{ value: 'inline', label: __('Inline', 'codeweber-gutenberg-blocks') },
												]}
												onChange={(v) => updateItem(item.id, { searchDisplayType: v || 'offcanvas' })}
											/>
											{((item.searchDisplayType || 'offcanvas') === 'dropdown' || (item.searchDisplayType || 'offcanvas') === 'inline') && (
												<>
													<TextControl label={__('Placeholder', 'codeweber-gutenberg-blocks')} value={item.placeholder ?? ''} help={__('Leave empty for “Type keyword”.', 'codeweber-gutenberg-blocks')} onChange={(v) => updateItem(item.id, { placeholder: v })} />
													{(item.searchDisplayType || 'offcanvas') === 'dropdown' && (
														<TextControl label={__('Dropdown min width', 'codeweber-gutenberg-blocks')} value={item.dropdownMinWidth ?? '320'} onChange={(v) => updateItem(item.id, { dropdownMinWidth: v || '320' })} />
													)}
													<TextControl label={__('Posts per page', 'codeweber-gutenberg-blocks')} value={item.postsPerPage ?? '8'} onChange={(v) => updateItem(item.id, { postsPerPage: v })} />
													<SelectControl label={__('Post types', 'codeweber-gutenberg-blocks')} value={item.postTypes || 'post'} options={searchPostTypeOptions.length ? searchPostTypeOptions : [{ label: __('Loading…', 'codeweber-gutenberg-blocks'), value: '' }]} onChange={(v) => updateItem(item.id, { postTypes: v || 'post' })} />
													<SelectControl label={__('Search content', 'codeweber-gutenberg-blocks')} value={item.searchContent ?? 'false'} options={[{ value: 'false', label: __('No', 'codeweber-gutenberg-blocks') }, { value: 'true', label: __('Yes', 'codeweber-gutenberg-blocks') }]} onChange={(v) => updateItem(item.id, { searchContent: v })} />
													<SelectControl label={__('Show excerpt', 'codeweber-gutenberg-blocks')} value={item.showExcerpt ?? 'false'} options={[{ value: 'false', label: __('No', 'codeweber-gutenberg-blocks') }, { value: 'true', label: __('Yes', 'codeweber-gutenberg-blocks') }]} onChange={(v) => updateItem(item.id, { showExcerpt: v })} />
													<TextControl label={__('Taxonomy', 'codeweber-gutenberg-blocks')} value={item.taxonomy ?? ''} onChange={(v) => updateItem(item.id, { taxonomy: v })} />
													<TextControl label={__('Term slug', 'codeweber-gutenberg-blocks')} value={item.term ?? ''} onChange={(v) => updateItem(item.id, { term: v })} />
													<SelectControl label={__('Include taxonomies', 'codeweber-gutenberg-blocks')} value={item.includeTaxonomies ?? 'false'} options={[{ value: 'false', label: __('No', 'codeweber-gutenberg-blocks') }, { value: 'true', label: __('Yes', 'codeweber-gutenberg-blocks') }]} onChange={(v) => updateItem(item.id, { includeTaxonomies: v })} />
													<TextControl label={__('Form ID', 'codeweber-gutenberg-blocks')} value={item.formId ?? ''} help={__('Leave empty for auto.', 'codeweber-gutenberg-blocks')} onChange={(v) => updateItem(item.id, { formId: v })} />
													<TextControl label={__('Form wrapper class', 'codeweber-gutenberg-blocks')} value={item.formClass ?? ''} onChange={(v) => updateItem(item.id, { formClass: v })} />
												</>
											)}
											<Button isPrimary isSmall onClick={() => setIconPickerFor(item.id)} style={{ marginTop: 8, marginBottom: 8 }}>
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
										<>
											<SelectControl
												label={__('Theme', 'codeweber-gutenberg-blocks')}
												value={item.offcanvasInfoTheme || 'light'}
												options={[
													{ value: 'light', label: __('Light', 'codeweber-gutenberg-blocks') },
													{ value: 'dark', label: __('Dark', 'codeweber-gutenberg-blocks') },
												]}
												onChange={(v) => updateItem(item.id, { offcanvasInfoTheme: v || 'light' })}
											/>
											<p style={{ marginTop: 12, marginBottom: 6, fontSize: 12, fontWeight: 600 }}>
												{__('Social icons (offcanvas)', 'codeweber-gutenberg-blocks')}
											</p>
											<SelectControl
												label={__('Social icon type', 'codeweber-gutenberg-blocks')}
												value={item.socialType || ''}
												options={[
													{ value: '', label: __('Theme default', 'codeweber-gutenberg-blocks') },
													{ value: 'type1', label: __('Type 1', 'codeweber-gutenberg-blocks') },
													{ value: 'type2', label: __('Type 2', 'codeweber-gutenberg-blocks') },
													{ value: 'type3', label: __('Type 3', 'codeweber-gutenberg-blocks') },
													{ value: 'type4', label: __('Type 4', 'codeweber-gutenberg-blocks') },
													{ value: 'type5', label: __('Type 5', 'codeweber-gutenberg-blocks') },
													{ value: 'type6', label: __('Type 6', 'codeweber-gutenberg-blocks') },
													{ value: 'type7', label: __('Type 7', 'codeweber-gutenberg-blocks') },
													{ value: 'type8', label: __('Type 8', 'codeweber-gutenberg-blocks') },
													{ value: 'type9', label: __('Type 9', 'codeweber-gutenberg-blocks') },
												]}
												onChange={(v) => updateItem(item.id, { socialType: v || '' })}
											/>
											<SelectControl
												label={__('Social button size', 'codeweber-gutenberg-blocks')}
												value={item.socialButtonSize || ''}
												options={[
													{ value: '', label: __('Theme default', 'codeweber-gutenberg-blocks') },
													{ value: 'sm', label: __('Small', 'codeweber-gutenberg-blocks') },
													{ value: 'md', label: __('Medium', 'codeweber-gutenberg-blocks') },
													{ value: 'lg', label: __('Large', 'codeweber-gutenberg-blocks') },
												]}
												onChange={(v) => updateItem(item.id, { socialButtonSize: v || '' })}
											/>
											<SelectControl
												label={__('Social button style', 'codeweber-gutenberg-blocks')}
												value={item.socialButtonStyle || ''}
												options={[
													{ value: '', label: __('Theme default', 'codeweber-gutenberg-blocks') },
													{ value: 'circle', label: __('Circle', 'codeweber-gutenberg-blocks') },
													{ value: 'block', label: __('Block', 'codeweber-gutenberg-blocks') },
												]}
												onChange={(v) => updateItem(item.id, { socialButtonStyle: v || '' })}
											/>
											<p style={{ marginTop: 12, marginBottom: 8, fontSize: 12, fontWeight: 600 }}>
												{__('Order items in side menu', 'codeweber-gutenberg-blocks')}
											</p>
											<p style={{ marginBottom: 8, fontSize: 11, color: '#666' }}>
												{__('Enable/disable and reorder. Only enabled items are shown in the offcanvas panel.', 'codeweber-gutenberg-blocks')}
											</p>
											{offcanvasElements(item).map((el, idx) => {
												const isDragging = draggedOffcanvasElem?.itemId === item.id && draggedOffcanvasElem?.index === idx;
												return (
													<div
														key={el.id}
														draggable
														onDragStart={() => setDraggedOffcanvasElem({ itemId: item.id, index: idx })}
														onDragEnd={() => setDraggedOffcanvasElem(null)}
														onDragOver={(e) => e.preventDefault()}
														onDrop={(e) => {
															e.preventDefault();
															if (draggedOffcanvasElem?.itemId === item.id && draggedOffcanvasElem.index !== idx) {
																reorderOffcanvasElements(item.id, draggedOffcanvasElem.index, idx);
															}
															setDraggedOffcanvasElem(null);
														}}
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: 8,
															marginBottom: 6,
															padding: '6px 8px',
															background: el.enabled ? '#f9f9f9' : '#f0f0f0',
															borderRadius: 4,
															cursor: 'grab',
															opacity: isDragging ? 0.5 : 1,
														}}
													>
														<span style={{ cursor: 'grab', color: '#757575' }} title={__('Drag to reorder', 'codeweber-gutenberg-blocks')}>⋮⋮</span>
														<Button
															icon={chevronUp}
															iconSize={16}
															disabled={idx === 0}
															onClick={() => moveOffcanvasElement(item.id, idx, -1)}
															label={__('Move up', 'codeweber-gutenberg-blocks')}
														/>
														<Button
															icon={chevronDown}
															iconSize={16}
															disabled={idx === offcanvasElements(item).length - 1}
															onClick={() => moveOffcanvasElement(item.id, idx, 1)}
															label={__('Move down', 'codeweber-gutenberg-blocks')}
														/>
														<ToggleControl
															label={isMapOffcanvasElement(el) ? MAP_DISPLAY_LABEL : getOffcanvasElementLabel(el)}
															checked={!!el.enabled}
															onChange={(v) => toggleOffcanvasElement(item.id, el.id, v)}
														/>
													</div>
												);
											})}
											{offcanvasElements(item).some((el) => String(el.id).toLowerCase() === 'employee') && (
												<>
													<SelectControl
														label={__('Показывать для сотрудника', 'codeweber-gutenberg-blocks')}
														value={item.offcanvasEmployeeShowDepartment ? 'department' : 'position'}
														options={[
															{ value: 'position', label: __('Должность', 'codeweber-gutenberg-blocks') },
															{ value: 'department', label: __('Отдел', 'codeweber-gutenberg-blocks') },
														]}
														onChange={(v) => updateItem(item.id, { offcanvasEmployeeShowDepartment: v === 'department' })}
													/>
													<p style={{ marginTop: 12, marginBottom: 6, fontSize: 12, fontWeight: 600 }}>
														{__('Сотрудники для вывода', 'codeweber-gutenberg-blocks')}
													</p>
													<p style={{ marginBottom: 8, fontSize: 11, color: '#666' }}>
														{__('Выберите записи Staff (CPT), которые будут показаны в блоке «Сотрудник».', 'codeweber-gutenberg-blocks')}
													</p>
													<SelectControl
														label={__('Добавить сотрудника (Staff)', 'codeweber-gutenberg-blocks')}
														value=""
														options={[
															{ value: '', label: __('— Выберите —', 'codeweber-gutenberg-blocks') },
															...staffForEmployee
																.filter((s) => !(item.offcanvasEmployeeStaffIds || []).includes(s.id))
																.map((s) => ({ value: String(s.id), label: s.name })),
														]}
														onChange={(v) => {
															if (v) {
																const ids = [...(item.offcanvasEmployeeStaffIds || []), parseInt(v, 10)];
																updateItem(item.id, { offcanvasEmployeeStaffIds: ids });
															}
														}}
													/>
													{(item.offcanvasEmployeeStaffIds || []).length > 0 && (
														<ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
															{(item.offcanvasEmployeeStaffIds || []).map((sid) => {
																const s = staffForEmployee.find((x) => x.id === sid);
																return (
																	<li
																		key={sid}
																		style={{
																			display: 'flex',
																			alignItems: 'center',
																			justifyContent: 'space-between',
																			padding: '4px 8px',
																			background: '#f5f5f5',
																			borderRadius: 4,
																			marginBottom: 4,
																		}}
																	>
																		<span style={{ fontSize: 13 }}>{s ? s.name : `ID ${sid}`}</span>
																		<Button
																			isSmall
																			isDestructive
																			onClick={() => {
																				const ids = (item.offcanvasEmployeeStaffIds || []).filter((id) => id !== sid);
																				updateItem(item.id, { offcanvasEmployeeStaffIds: ids });
																			}}
																		>
																			{__('Удалить', 'codeweber-gutenberg-blocks')}
																		</Button>
																	</li>
																);
															})}
														</ul>
													)}
												</>
											)}
											<Button
												isPrimary
												isSmall
												onClick={() => setIconPickerFor(item.id)}
												style={{ marginTop: 12, marginBottom: 8 }}
											>
												{__('Select Icon', 'codeweber-gutenberg-blocks')}
											</Button>
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
									{(item.type === 'custom-offcanvas' || item.type === 'offcanvas-toggle') && (
										<>
											<SelectControl
												label={__('Theme', 'codeweber-gutenberg-blocks')}
												value={item.customOffcanvasTheme || 'light'}
												options={[
													{ value: 'light', label: __('Light', 'codeweber-gutenberg-blocks') },
													{ value: 'dark', label: __('Dark', 'codeweber-gutenberg-blocks') },
												]}
												onChange={(v) => updateItem(item.id, { customOffcanvasTheme: v || 'light' })}
											/>
											<Button
												isPrimary
												isSmall
												onClick={() => setIconPickerFor(item.id)}
												style={{ marginBottom: 8 }}
											>
												{__('Select Icon', 'codeweber-gutenberg-blocks')}
											</Button>
											<TextareaControl
												label={__('Offcanvas header', 'codeweber-gutenberg-blocks')}
												value={item.offcanvasHeaderHtml || ''}
												onChange={(v) => updateItem(item.id, { offcanvasHeaderHtml: v })}
												placeholder={__('Content inside .offcanvas-header', 'codeweber-gutenberg-blocks')}
												help={__('If filled, outputs <div class="offcanvas-header">…</div> inside the offcanvas.', 'codeweber-gutenberg-blocks')}
												rows={2}
											/>
											<TextareaControl
												label={__('Offcanvas body', 'codeweber-gutenberg-blocks')}
												value={item.offcanvasBodyHtml || ''}
												onChange={(v) => updateItem(item.id, { offcanvasBodyHtml: v })}
												placeholder={__('Content inside .offcanvas-body', 'codeweber-gutenberg-blocks')}
												help={__('If filled, outputs <div class="offcanvas-body">…</div> inside the offcanvas.', 'codeweber-gutenberg-blocks')}
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
					.map((item) => {
						const isSearchInline = item.type === 'search' && (item.searchDisplayType || 'offcanvas') === 'inline';
						const placeholder = (item.placeholder && item.placeholder.trim() !== '') ? item.placeholder : __('Type keyword', 'codeweber-gutenberg-blocks');
						return (
							<div key={item.id} className="header-widgets-item-preview">
								{isSearchInline ? (
									<div className="cwgb-search-block inline" style={{ display: 'inline-flex', minWidth: 180 }}>
										<form className="search-form" onSubmit={(e) => e.preventDefault()}>
											<input
												type="text"
												className="search-form form-control"
												placeholder={placeholder}
												disabled
												style={{ pointerEvents: 'none' }}
											/>
										</form>
									</div>
								) : (
									<a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
										<i className={item.iconClass || (item.type === 'search' ? 'uil uil-search' : 'uil uil-info-circle')}></i>
									</a>
								)}
							</div>
						);
					})}
			</div>
		</>
	);
};

export default HeaderWidgetsEdit;
