/**
 * Blog Year Widget Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';

const ORDER_OPTIONS = [
	{ value: 'DESC', label: __('Newest first', 'codeweber-gutenberg-blocks') },
	{ value: 'ASC', label: __('Oldest first', 'codeweber-gutenberg-blocks') },
];

const BlogYearWidgetEdit = ({ attributes, setAttributes }) => {
	const { number, order } = attributes;
	const blockProps = useBlockProps({ className: 'wp-block-codeweber-blocks-blog-year-widget' });

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Blog Year Widget', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<RangeControl
						label={__('Number of months', 'codeweber-gutenberg-blocks')}
						value={number ?? 12}
						onChange={(value) => setAttributes({ number: value ?? 12 })}
						min={1}
						max={48}
					/>
					<SelectControl
						label={__('Order', 'codeweber-gutenberg-blocks')}
						value={order ?? 'DESC'}
						options={ORDER_OPTIONS}
						onChange={(value) => setAttributes({ order: value ?? 'DESC' })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ServerSideRender
					block="codeweber-blocks/blog-year-widget"
					attributes={attributes}
				/>
			</div>
		</>
	);
};

export default BlogYearWidgetEdit;
