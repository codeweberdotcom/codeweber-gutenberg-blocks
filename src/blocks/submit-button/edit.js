/**
 * Submit Button Block Edit Component
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
// BlockMetaFields is imported from form block's utilities
// For now, we'll use simple TextControls for advanced settings

export default function Edit({ attributes, setAttributes }) {
	const {
		buttonText,
		buttonClass,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	const blockProps = useBlockProps({
		className: `submit-button-preview ${blockClass || ''}`,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Button Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<TextControl
						label={__('Button Text', 'codeweber-gutenberg-blocks')}
						value={buttonText}
						onChange={(value) => setAttributes({ buttonText: value })}
					/>
					<TextControl
						label={__('Button Classes', 'codeweber-gutenberg-blocks')}
						value={buttonClass}
						onChange={(value) => setAttributes({ buttonClass: value })}
						help={__('Bootstrap classes: btn btn-primary', 'codeweber-gutenberg-blocks')}
					/>
				</PanelBody>
				<PanelBody title={__('Advanced', 'codeweber-gutenberg-blocks')} initialOpen={false}>
					<TextControl
						label={__('Block Class', 'codeweber-gutenberg-blocks')}
						value={blockClass}
						onChange={(value) => setAttributes({ blockClass: value })}
					/>
					<TextControl
						label={__('Block Data', 'codeweber-gutenberg-blocks')}
						value={blockData}
						onChange={(value) => setAttributes({ blockData: value })}
					/>
					<TextControl
						label={__('Block ID', 'codeweber-gutenberg-blocks')}
						value={blockId}
						onChange={(value) => setAttributes({ blockId: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="form-submit-wrapper mt-4">
					<button
						type="button"
						className={buttonClass || 'btn btn-primary'}
						disabled
					>
						<i className="uil uil-send fs-13"></i>
						{buttonText || __('Send Message', 'codeweber-gutenberg-blocks')}
					</button>
				</div>
			</div>
		</>
	);
}

