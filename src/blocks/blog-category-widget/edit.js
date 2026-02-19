/**
 * Blog Category Widget Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';

const ORDERBY_OPTIONS = [
	{ value: 'name', label: __('Name', 'codeweber-gutenberg-blocks') },
	{ value: 'count', label: __('Count', 'codeweber-gutenberg-blocks') },
	{ value: 'slug', label: __('Slug', 'codeweber-gutenberg-blocks') },
];

const ORDER_OPTIONS = [
	{ value: 'ASC', label: __('ASC', 'codeweber-gutenberg-blocks') },
	{ value: 'DESC', label: __('DESC', 'codeweber-gutenberg-blocks') },
];

const BlogCategoryWidgetEdit = ({ attributes, setAttributes }) => {
	const { showCount, orderby, order, number } = attributes;
	const blockProps = useBlockProps({ className: 'wp-block-codeweber-blocks-blog-category-widget' });

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Blog Category Widget', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<ToggleControl
						label={__('Show post count', 'codeweber-gutenberg-blocks')}
						checked={showCount !== false}
						onChange={(value) => setAttributes({ showCount: value })}
					/>
					<SelectControl
						label={__('Order by', 'codeweber-gutenberg-blocks')}
						value={orderby ?? 'name'}
						options={ORDERBY_OPTIONS}
						onChange={(value) => setAttributes({ orderby: value ?? 'name' })}
					/>
					<SelectControl
						label={__('Order', 'codeweber-gutenberg-blocks')}
						value={order ?? 'ASC'}
						options={ORDER_OPTIONS}
						onChange={(value) => setAttributes({ order: value ?? 'ASC' })}
					/>
					<RangeControl
						label={__('Number of categories', 'codeweber-gutenberg-blocks')}
						help={__('0 = show all.', 'codeweber-gutenberg-blocks')}
						value={number ?? 0}
						onChange={(value) => setAttributes({ number: value ?? 0 })}
						min={0}
						max={50}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ServerSideRender
					block="codeweber-blocks/blog-category-widget"
					attributes={attributes}
				/>
			</div>
		</>
	);
};

export default BlogCategoryWidgetEdit;
