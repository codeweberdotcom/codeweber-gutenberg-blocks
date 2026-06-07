/**
 * Counters Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
	ButtonGroup,
	Button,
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

import { getCountersTemplates, getColumnColConfig } from './templates';

const ALLOWED_BLOCKS = ['codeweber-blocks/columns'];

const COLUMN_OPTIONS = [
	{ label: '1', value: 1 },
	{ label: '2', value: 2 },
	{ label: '3', value: 3 },
	{ label: '4', value: 4 },
	{ label: '6', value: 6 },
];

// Add/remove a single class from a space-separated class string.
const toggleClass = (classStr, cls, on) => {
	const set = (classStr || '')
		.split(/\s+/)
		.filter(Boolean)
		.filter((c) => c !== cls);
	if (on) {
		set.push(cls);
	}
	return set.join(' ');
};

const CountersEdit = ({ attributes, setAttributes, clientId }) => {
	const { selectedTemplate, enableMasonry, colorScheme, columnsCount, itemsCount } =
		attributes;

	const { replaceInnerBlocks, updateBlockAttributes, insertBlocks, removeBlocks } =
		useDispatch('core/block-editor');
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId) || [],
		[clientId]
	);

	const hasInitialized = useRef(false);
	const templates = getCountersTemplates();

	const currentTemplate = templates.find((t) => t.id === selectedTemplate);
	const supportsMasonry = !!currentTemplate?.supportsMasonry;

	// The single columns block that holds all column -> counter children.
	const columnsBlock = innerBlocks[0] || null;

	// Build the columns -> column -> counter structure from a template.
	const buildGrid = (template, { masonry, scheme, columns, items }) => {
		if (!template) return;

		const useMasonry = masonry && !!template.supportsMasonry;
		const colConfig = getColumnColConfig(columns);

		// Color is applied per-counter (textWhite), NOT on the row: text-white on
		// the columns row inherits to everything and overrides per-counter colors.
		let columnsClass = template.columnsConfig.columnsClass;
		columnsClass = toggleClass(columnsClass, 'isotope', useMasonry);
		columnsClass = toggleClass(columnsClass, 'text-white', false);

		const columnsAttrs = {
			...template.columnsConfig,
			columnsClass,
			columnsCount: columns,
		};

		const src = template.counters;
		const columnBlocks = [];
		for (let i = 0; i < items; i++) {
			const base = src[i % src.length];
			columnBlocks.push(
				createBlock(
					'codeweber-blocks/column',
					{ ...colConfig, columnClass: useMasonry ? 'item' : '' },
					[
						createBlock('codeweber-blocks/counter', {
							...base,
							textWhite: scheme === 'dark',
						}),
					]
				)
			);
		}

		const block = createBlock(
			'codeweber-blocks/columns',
			columnsAttrs,
			columnBlocks
		);

		replaceInnerBlocks(clientId, [block], false);
	};

	// Initialize once with the current template's own defaults.
	useEffect(() => {
		if (hasInitialized.current || innerBlocks.length > 0) {
			return;
		}
		hasInitialized.current = true;
		if (!currentTemplate) return;

		const scheme = currentTemplate.defaultColorScheme || 'light';
		const columns = currentTemplate.defaultColumns;
		const items = currentTemplate.counters.length;
		const masonry = enableMasonry && supportsMasonry;

		setAttributes({
			colorScheme: scheme,
			columnsCount: columns,
			itemsCount: items,
			enableMasonry: masonry,
		});
		buildGrid(currentTemplate, { masonry, scheme, columns, items });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId, innerBlocks.length]);

	const handleTemplateChange = (templateId) => {
		const template = templates.find((t) => t.id === templateId);
		if (!template) return;

		const masonry = enableMasonry && !!template.supportsMasonry;
		const scheme = template.defaultColorScheme || 'light';
		const columns = template.defaultColumns;
		const items = template.counters.length;

		setAttributes({
			selectedTemplate: templateId,
			enableMasonry: masonry,
			colorScheme: scheme,
			columnsCount: columns,
			itemsCount: items,
		});
		buildGrid(template, { masonry, scheme, columns, items });
	};

	const handleMasonryChange = (value) => {
		const masonry = value && supportsMasonry;
		setAttributes({ enableMasonry: masonry });
		if (currentTemplate) {
			buildGrid(currentTemplate, {
				masonry,
				scheme: colorScheme,
				columns: columnsCount,
				items: itemsCount,
			});
		}
	};

	// --- Incremental updates (preserve user edits) ---

	const handleColorSchemeChange = (scheme) => {
		setAttributes({ colorScheme: scheme });
		if (!columnsBlock) return;

		// Make sure no stray text-white lingers on the row (older grids).
		const cleaned = toggleClass(
			columnsBlock.attributes.columnsClass,
			'text-white',
			false
		);
		if (cleaned !== columnsBlock.attributes.columnsClass) {
			updateBlockAttributes(columnsBlock.clientId, {
				columnsClass: cleaned,
			});
		}

		columnsBlock.innerBlocks.forEach((col) => {
			const counter = col.innerBlocks[0];
			if (counter) {
				updateBlockAttributes(counter.clientId, {
					textWhite: scheme === 'dark',
				});
			}
		});
	};

	const handleColumnsCountChange = (count) => {
		setAttributes({ columnsCount: count });
		if (!columnsBlock) return;

		updateBlockAttributes(columnsBlock.clientId, { columnsCount: count });
		const colConfig = getColumnColConfig(count);
		columnsBlock.innerBlocks.forEach((col) => {
			updateBlockAttributes(col.clientId, colConfig);
		});
	};

	const handleItemsCountChange = (count) => {
		setAttributes({ itemsCount: count });
		if (!columnsBlock || !currentTemplate) return;

		const current = columnsBlock.innerBlocks.length;
		if (count === current) return;

		if (count > current) {
			const useMasonry = enableMasonry && supportsMasonry;
			const colConfig = getColumnColConfig(columnsCount);
			const src = currentTemplate.counters;
			const toAdd = [];
			for (let i = current; i < count; i++) {
				const base = src[i % src.length];
				toAdd.push(
					createBlock(
						'codeweber-blocks/column',
						{ ...colConfig, columnClass: useMasonry ? 'item' : '' },
						[
							createBlock('codeweber-blocks/counter', {
								...base,
								textWhite: colorScheme === 'dark',
							}),
						]
					)
				);
			}
			insertBlocks(toAdd, current, columnsBlock.clientId, false);
		} else {
			const toRemove = columnsBlock.innerBlocks
				.slice(count)
				.map((c) => c.clientId);
			removeBlocks(toRemove, false);
		}
	};

	const blockProps = useBlockProps({ className: 'counters-wrapper' });

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Counters', 'codeweber-gutenberg-blocks')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Template', 'codeweber-gutenberg-blocks')}
						value={selectedTemplate}
						options={templates.map((t) => ({
							value: t.id,
							label: t.label,
						}))}
						onChange={handleTemplateChange}
						help={__(
							'Switching template rebuilds the counters grid.',
							'codeweber-gutenberg-blocks'
						)}
						__nextHasNoMarginBottom
					/>

					<div style={{ marginTop: '16px' }}>
						<p className="components-base-control__label" style={{ marginBottom: '8px' }}>
							{__('Color Scheme', 'codeweber-gutenberg-blocks')}
						</p>
						<ButtonGroup>
							<Button
								variant={colorScheme !== 'dark' ? 'primary' : 'secondary'}
								onClick={() => handleColorSchemeChange('light')}
							>
								{__('Light', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								variant={colorScheme === 'dark' ? 'primary' : 'secondary'}
								onClick={() => handleColorSchemeChange('dark')}
							>
								{__('Dark', 'codeweber-gutenberg-blocks')}
							</Button>
						</ButtonGroup>
						<p className="components-base-control__help" style={{ marginTop: '8px' }}>
							{__('Dark = white text for dark backgrounds.', 'codeweber-gutenberg-blocks')}
						</p>
					</div>

					<div style={{ marginTop: '16px' }}>
						<SelectControl
							label={__('Columns', 'codeweber-gutenberg-blocks')}
							value={columnsCount}
							options={COLUMN_OPTIONS}
							onChange={(value) =>
								handleColumnsCountChange(Number(value))
							}
							__nextHasNoMarginBottom
						/>
					</div>

					<div style={{ marginTop: '16px' }}>
						<RangeControl
							label={__('Items', 'codeweber-gutenberg-blocks')}
							value={itemsCount}
							min={1}
							max={12}
							onChange={(value) => handleItemsCountChange(value)}
							__nextHasNoMarginBottom
						/>
					</div>

					{supportsMasonry && (
						<div style={{ marginTop: '16px' }}>
							<ToggleControl
								label={__(
									'Masonry (isotope)',
									'codeweber-gutenberg-blocks'
								)}
								checked={enableMasonry}
								onChange={handleMasonryChange}
								help={__(
									'Staggered masonry layout on the frontend. The editor shows a regular grid.',
									'codeweber-gutenberg-blocks'
								)}
							/>
						</div>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default CountersEdit;
