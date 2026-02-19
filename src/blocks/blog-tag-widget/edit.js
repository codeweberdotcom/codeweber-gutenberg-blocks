/**
 * Blog Tag Widget Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, SelectControl, Button, ButtonGroup } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { colors } from '../../utilities/colors';

const ORDERBY_OPTIONS = [
	{ value: 'name', label: __('Name', 'codeweber-gutenberg-blocks') },
	{ value: 'count', label: __('Count', 'codeweber-gutenberg-blocks') },
	{ value: 'slug', label: __('Slug', 'codeweber-gutenberg-blocks') },
];

const ORDER_OPTIONS = [
	{ value: 'ASC', label: __('ASC', 'codeweber-gutenberg-blocks') },
	{ value: 'DESC', label: __('DESC', 'codeweber-gutenberg-blocks') },
];

const BlogTagWidgetEdit = ({ attributes, setAttributes }) => {
	const { orderby, order, number, tagStyle, tagColor, tagColorType } = attributes;
	const blockProps = useBlockProps({ className: 'wp-block-codeweber-blocks-blog-tag-widget' });

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Blog Tag Widget', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					{/* Type: btn (Type 1) | badge (Type 2) */}
					<div className="component-sidebar-title" style={{ marginBottom: '8px' }}>
						<label>{__('Style', 'codeweber-gutenberg-blocks')}</label>
					</div>
					<ButtonGroup style={{ marginBottom: '16px' }}>
						<Button
							isPrimary={(tagStyle || 'btn') === 'btn'}
							onClick={() => setAttributes({ tagStyle: 'btn' })}
						>
							{__('Type 1 (btn)', 'codeweber-gutenberg-blocks')}
						</Button>
						<Button
							isPrimary={(tagStyle || 'btn') === 'badge'}
							onClick={() => setAttributes({ tagStyle: 'badge' })}
						>
							{__('Type 2 (badge)', 'codeweber-gutenberg-blocks')}
						</Button>
					</ButtonGroup>

					{/* Colors */}
					<div className="component-sidebar-title" style={{ marginBottom: '8px' }}>
						<label>{__('Colors', 'codeweber-gutenberg-blocks')}</label>
					</div>
					<SelectControl
						label={__('Color', 'codeweber-gutenberg-blocks')}
						value={tagColor ?? 'ash'}
						options={colors.map((c) => ({ label: c.label, value: c.value }))}
						onChange={(value) => setAttributes({ tagColor: value ?? 'ash' })}
					/>
					<div style={{ marginTop: '8px', marginBottom: '16px' }}>
						<ButtonGroup>
							{[
								{ label: __('Solid', 'codeweber-gutenberg-blocks'), value: 'solid' },
								{ label: __('Soft', 'codeweber-gutenberg-blocks'), value: 'soft' },
								{ label: __('Pale', 'codeweber-gutenberg-blocks'), value: 'pale' },
							].map((opt) => (
								<Button
									key={opt.value}
									isPrimary={(tagColorType || 'soft') === opt.value}
									onClick={() => setAttributes({ tagColorType: opt.value })}
								>
									{opt.label}
								</Button>
							))}
						</ButtonGroup>
					</div>

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
						label={__('Number of tags', 'codeweber-gutenberg-blocks')}
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
					block="codeweber-blocks/blog-tag-widget"
					attributes={attributes}
				/>
			</div>
		</>
	);
};

export default BlogTagWidgetEdit;
