import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { ImageSizeControl } from '../../../components/image-size';
import { PostSortControl } from '../../../components/post-sort';
import { PostGridTemplateControl } from '../../../components/post-grid-template';
import { PostTypeTaxonomyControl } from '../../../components/post-type-taxonomy/PostTypeTaxonomyControl';
import { SchemaTypeNotice } from '../../../components/schema-type';

export const MainControl = ({ attributes, setAttributes }) => {
	const {
		postType,
		postsPerPage,
		imageSize,
		orderBy,
		order,
		template,
		titleTag,
		titleClass,
		enableLink,
		selectedTaxonomies,
		simpleEffect,
		showTitle,
		showDate,
		showCategory,
		showComments,
		showExcerpt,
		titleLength,
		excerptLength,
	} = attributes;

	// Card Display panel hidden for clients (logos only — no titles/dates).
	const showCardDisplayPanel = postType !== 'clients';

	const titleTagOptions = [
		{ value: 'h1', label: 'H1' },
		{ value: 'h2', label: 'H2' },
		{ value: 'h3', label: 'H3' },
		{ value: 'h4', label: 'H4' },
		{ value: 'h5', label: 'H5' },
		{ value: 'h6', label: 'H6' },
		{ value: 'p', label: __('Paragraph', 'codeweber-gutenberg-blocks') },
		{ value: 'div', label: 'div' },
		{ value: 'span', label: 'span' },
	];

	return (
		<>
			<PostTypeTaxonomyControl
				postType={postType}
				selectedTaxonomies={selectedTaxonomies}
				onPostTypeChange={(value) => setAttributes({ postType: value })}
				onTaxonomyChange={(value) =>
					setAttributes({ selectedTaxonomies: value })
				}
			/>

			<SchemaTypeNotice mode="post" postType={postType || ''} />

			<div style={{ marginTop: '16px' }}>
				<SelectControl
					label={__('Title Tag', 'codeweber-gutenberg-blocks')}
					value={titleTag || 'h3'}
					options={titleTagOptions}
					onChange={(value) => setAttributes({ titleTag: value })}
					help={__(
						'HTML tag for post/card title.',
						'codeweber-gutenberg-blocks'
					)}
				/>
			</div>

			<div style={{ marginTop: '16px' }}>
				<TextControl
					label={__('Title Classes', 'codeweber-gutenberg-blocks')}
					value={titleClass || ''}
					onChange={(value) => setAttributes({ titleClass: value })}
					help={__(
						'Additional CSS classes for the title (space-separated).',
						'codeweber-gutenberg-blocks'
					)}
					placeholder="e.g. mt-1 mb-3"
				/>
			</div>

			<div style={{ marginTop: '16px' }}>
				<PostGridTemplateControl
					value={template}
					onChange={(value) => setAttributes({ template: value })}
					postType={postType || 'post'}
				/>
				{postType === 'clients' && (
					<div style={{ marginTop: '16px' }}>
						<ToggleControl
							label={__(
								'Enable Links',
								'codeweber-gutenberg-blocks'
							)}
							checked={enableLink || false}
							onChange={(value) =>
								setAttributes({ enableLink: value })
							}
							help={__(
								'Enable links to client posts (disabled by default)',
								'codeweber-gutenberg-blocks'
							)}
						/>
					</div>
				)}
			</div>

			<RangeControl
				label={__('Posts Per Page', 'codeweber-gutenberg-blocks')}
				value={postsPerPage}
				onChange={(value) => setAttributes({ postsPerPage: value })}
				min={1}
				max={50}
				initialPosition={6}
				help={__(
					'Number of posts to display',
					'codeweber-gutenberg-blocks'
				)}
			/>

			<div style={{ marginTop: '16px' }}>
				<ImageSizeControl
					value={imageSize || 'full'}
					onChange={(value) => setAttributes({ imageSize: value })}
					label={__('Image Size', 'codeweber-gutenberg-blocks')}
					help={__(
						'Select the size for featured images.',
						'codeweber-gutenberg-blocks'
					)}
					postType={postType}
				/>
			</div>

			<div style={{ marginTop: '16px' }}>
				<PostSortControl
					orderBy={orderBy || 'date'}
					order={order || 'desc'}
					onOrderByChange={(value) =>
						setAttributes({ orderBy: value })
					}
					onOrderChange={(value) => setAttributes({ order: value })}
				/>
			</div>

			<div style={{ marginTop: '16px' }}>
				<ToggleControl
					label={__('Lift hover effect', 'codeweber-gutenberg-blocks')}
					checked={simpleEffect === 'lift'}
					onChange={(value) =>
						setAttributes({ simpleEffect: value ? 'lift' : 'none' })
					}
					help={__(
						'Card lifts on hover.',
						'codeweber-gutenberg-blocks'
					)}
				/>
			</div>

			{showCardDisplayPanel && (
				<PanelBody
					title={__('Card Display', 'codeweber-gutenberg-blocks')}
					initialOpen={false}
					className="cwgb-card-display-panel"
				>
					<ToggleControl
						label={__('Show Title', 'codeweber-gutenberg-blocks')}
						checked={showTitle !== false}
						onChange={(value) =>
							setAttributes({ showTitle: value })
						}
					/>
					<ToggleControl
						label={__('Show Date', 'codeweber-gutenberg-blocks')}
						checked={showDate !== false}
						onChange={(value) => setAttributes({ showDate: value })}
					/>
					<ToggleControl
						label={__('Show Category', 'codeweber-gutenberg-blocks')}
						checked={showCategory !== false}
						onChange={(value) =>
							setAttributes({ showCategory: value })
						}
					/>
					<ToggleControl
						label={__('Show Comments', 'codeweber-gutenberg-blocks')}
						checked={showComments !== false}
						onChange={(value) =>
							setAttributes({ showComments: value })
						}
					/>
					<ToggleControl
						label={__('Show Excerpt', 'codeweber-gutenberg-blocks')}
						checked={!!showExcerpt}
						onChange={(value) =>
							setAttributes({ showExcerpt: value })
						}
					/>
					<RangeControl
						label={__('Title Length', 'codeweber-gutenberg-blocks')}
						value={
							typeof titleLength === 'number' ? titleLength : 56
						}
						onChange={(value) =>
							setAttributes({ titleLength: value })
						}
						min={0}
						max={200}
						step={1}
						help={__(
							'Maximum title characters (0 = no limit).',
							'codeweber-gutenberg-blocks'
						)}
					/>
					<RangeControl
						label={__('Excerpt Length', 'codeweber-gutenberg-blocks')}
						value={
							typeof excerptLength === 'number'
								? excerptLength
								: 20
						}
						onChange={(value) =>
							setAttributes({ excerptLength: value })
						}
						min={0}
						max={100}
						step={1}
						help={__(
							'Maximum excerpt words (0 = no limit).',
							'codeweber-gutenberg-blocks'
						)}
					/>
				</PanelBody>
			)}
		</>
	);
};
