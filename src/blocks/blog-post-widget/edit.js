/**
 * Blog Post Widget Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PanelBody, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';

const SOURCE_OPTIONS = [
	{ value: 'latest', label: __('Latest posts', 'codeweber-gutenberg-blocks') },
	{ value: 'random', label: __('Random', 'codeweber-gutenberg-blocks') },
];

const ORDERBY_OPTIONS = [
	{ value: 'date', label: __('Date', 'codeweber-gutenberg-blocks') },
	{ value: 'title', label: __('Title', 'codeweber-gutenberg-blocks') },
	{ value: 'comment_count', label: __('Comment count', 'codeweber-gutenberg-blocks') },
];

const ORDER_OPTIONS = [
	{ value: 'ASC', label: __('ASC', 'codeweber-gutenberg-blocks') },
	{ value: 'DESC', label: __('DESC', 'codeweber-gutenberg-blocks') },
];

function getYearOptions() {
	const currentYear = new Date().getFullYear();
	const years = [{ value: '', label: __('All years', 'codeweber-gutenberg-blocks') }];
	for (let y = currentYear; y >= currentYear - 20; y--) {
		years.push({ value: String(y), label: String(y) });
	}
	return years;
}

const BlogPostWidgetEdit = ({ attributes, setAttributes }) => {
	const { postsPerPage, showDate, showComments, titleLength, source, orderby, order, categoryId, tagId, year } = attributes;
	const blockProps = useBlockProps({ className: 'wp-block-codeweber-blocks-blog-post-widget' });

	const { categories, tags } = useSelect((select) => {
		const { getEntityRecords } = select('core');
		return {
			categories: getEntityRecords('taxonomy', 'category', { per_page: -1, orderby: 'name', order: 'asc' }) || [],
			tags: getEntityRecords('taxonomy', 'post_tag', { per_page: -1, orderby: 'name', order: 'asc' }) || [],
		};
	}, []);

	const categoryOptions = [
		{ value: 0, label: __('All categories', 'codeweber-gutenberg-blocks') },
		...(categories.map((c) => ({ value: c.id, label: c.name }))),
	];
	const tagOptions = [
		{ value: 0, label: __('All tags', 'codeweber-gutenberg-blocks') },
		...(tags.map((t) => ({ value: t.id, label: t.name }))),
	];
	const yearOptions = getYearOptions();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Blog Post Widget', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<RangeControl
						label={__('Number of posts', 'codeweber-gutenberg-blocks')}
						value={postsPerPage ?? 3}
						onChange={(value) => setAttributes({ postsPerPage: value ?? 3 })}
						min={1}
						max={12}
					/>
					<SelectControl
						label={__('Source', 'codeweber-gutenberg-blocks')}
						value={source ?? 'latest'}
						options={SOURCE_OPTIONS}
						onChange={(value) => setAttributes({ source: value ?? 'latest' })}
					/>
					{source === 'latest' && (
						<>
							<SelectControl
								label={__('Order by', 'codeweber-gutenberg-blocks')}
								value={orderby ?? 'date'}
								options={ORDERBY_OPTIONS}
								onChange={(value) => setAttributes({ orderby: value ?? 'date' })}
							/>
							<SelectControl
								label={__('Order', 'codeweber-gutenberg-blocks')}
								value={order ?? 'DESC'}
								options={ORDER_OPTIONS}
								onChange={(value) => setAttributes({ order: value ?? 'DESC' })}
							/>
						</>
					)}
					<SelectControl
						label={__('Category', 'codeweber-gutenberg-blocks')}
						value={categoryId ?? 0}
						options={categoryOptions}
						onChange={(value) => setAttributes({ categoryId: value ? Number(value) : 0 })}
					/>
					<SelectControl
						label={__('Tag', 'codeweber-gutenberg-blocks')}
						value={tagId ?? 0}
						options={tagOptions}
						onChange={(value) => setAttributes({ tagId: value ? Number(value) : 0 })}
					/>
					<SelectControl
						label={__('Year', 'codeweber-gutenberg-blocks')}
						value={year ?? ''}
						options={yearOptions}
						onChange={(value) => setAttributes({ year: value ?? '' })}
					/>
					<ToggleControl
						label={__('Show date', 'codeweber-gutenberg-blocks')}
						checked={showDate !== false}
						onChange={(value) => setAttributes({ showDate: value })}
					/>
					<ToggleControl
						label={__('Show comments', 'codeweber-gutenberg-blocks')}
						checked={showComments !== false}
						onChange={(value) => setAttributes({ showComments: value })}
					/>
					<RangeControl
						label={__('Title length', 'codeweber-gutenberg-blocks')}
						help={__('0 = no limit. Max characters for the post title.', 'codeweber-gutenberg-blocks')}
						value={titleLength ?? 50}
						onChange={(value) => setAttributes({ titleLength: value ?? 50 })}
						min={0}
						max={200}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ServerSideRender
					block="codeweber-blocks/blog-post-widget"
					attributes={attributes}
				/>
			</div>
		</>
	);
};

export default BlogPostWidgetEdit;
