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
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

import { getCountersTemplates } from './templates';

const ALLOWED_BLOCKS = ['codeweber-blocks/columns'];

const CountersEdit = ({ attributes, setAttributes, clientId }) => {
	const { selectedTemplate } = attributes;

	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId) || [],
		[clientId]
	);

	const hasInitialized = useRef(false);
	const templates = getCountersTemplates();

	// Build the columns -> column -> counter structure from a template.
	const applyTemplate = (template) => {
		if (!template) return;

		const { columnsConfig, columnConfig, counters } = template;

		const columnBlocks = counters.map((counterAttrs) =>
			createBlock('codeweber-blocks/column', { ...columnConfig }, [
				createBlock('codeweber-blocks/counter', counterAttrs),
			])
		);

		const columnsBlock = createBlock(
			'codeweber-blocks/columns',
			columnsConfig,
			columnBlocks
		);

		replaceInnerBlocks(clientId, [columnsBlock], false);
	};

	// Initialize with the default template once.
	useEffect(() => {
		if (hasInitialized.current || innerBlocks.length > 0) {
			return;
		}
		const template = templates.find((t) => t.id === selectedTemplate);
		if (template) {
			applyTemplate(template);
		}
		hasInitialized.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId, innerBlocks.length]);

	const handleTemplateChange = (templateId) => {
		setAttributes({ selectedTemplate: templateId });
		const template = templates.find((t) => t.id === templateId);
		if (template) {
			applyTemplate(template);
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
