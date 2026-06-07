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
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

import { getCountersTemplates } from './templates';

const ALLOWED_BLOCKS = ['codeweber-blocks/columns'];

const CountersEdit = ({ attributes, setAttributes, clientId }) => {
	const { selectedTemplate, enableMasonry } = attributes;

	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId) || [],
		[clientId]
	);

	const hasInitialized = useRef(false);
	const templates = getCountersTemplates();

	const currentTemplate = templates.find((t) => t.id === selectedTemplate);
	const supportsMasonry = !!currentTemplate?.supportsMasonry;

	// Build the columns -> column -> counter structure from a template.
	const applyTemplate = (template, masonry = false) => {
		if (!template) return;

		const { columnsConfig, columnConfig, counters } = template;
		const useMasonry = masonry && !!template.supportsMasonry;

		// Masonry: row gets .isotope, each column gets .item
		const columnsAttrs = useMasonry
			? {
					...columnsConfig,
					columnsClass: `${columnsConfig.columnsClass} isotope`,
				}
			: columnsConfig;
		const columnAttrs = useMasonry
			? { ...columnConfig, columnClass: 'item' }
			: columnConfig;

		const columnBlocks = counters.map((counterAttrs) =>
			createBlock('codeweber-blocks/column', { ...columnAttrs }, [
				createBlock('codeweber-blocks/counter', counterAttrs),
			])
		);

		const columnsBlock = createBlock(
			'codeweber-blocks/columns',
			columnsAttrs,
			columnBlocks
		);

		replaceInnerBlocks(clientId, [columnsBlock], false);
	};

	// Initialize with the default template once.
	useEffect(() => {
		if (hasInitialized.current || innerBlocks.length > 0) {
			return;
		}
		if (currentTemplate) {
			applyTemplate(currentTemplate, enableMasonry);
		}
		hasInitialized.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId, innerBlocks.length]);

	const handleTemplateChange = (templateId) => {
		const template = templates.find((t) => t.id === templateId);
		const masonry = enableMasonry && !!template?.supportsMasonry;
		setAttributes({ selectedTemplate: templateId, enableMasonry: masonry });
		if (template) {
			applyTemplate(template, masonry);
		}
	};

	const handleMasonryChange = (value) => {
		setAttributes({ enableMasonry: value });
		if (currentTemplate) {
			applyTemplate(currentTemplate, value);
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
