/**
 * Dropcap Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { DropcapSidebar } from './sidebar';

const Edit = ({ attributes, setAttributes }) => {
	const { content, style, color, colorType, circleBgType } = attributes;
	const blockProps = useBlockProps({
		className: 'has-dropcap',
		'data-dropcap-style': style || 'simple',
		'data-dropcap-color': color || 'dark',
		'data-dropcap-color-type': colorType || 'solid',
		'data-dropcap-circle-bg': circleBgType || 'pale',
	});

	return (
		<>
			<InspectorControls>
				<DropcapSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<RichText
				{...blockProps}
				tagName="p"
				value={content}
				onChange={(value) => setAttributes({ content: value || '' })}
				placeholder={__(
					'Enter paragraph text…',
					'codeweber-gutenberg-blocks'
				)}
				multiline={false}
			/>
		</>
	);
};

export default Edit;
