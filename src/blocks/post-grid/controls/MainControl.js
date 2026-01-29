import { __ } from '@wordpress/i18n';
import {
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { ImageSizeControl } from '../../../components/image-size';
import { PostSortControl } from '../../../components/post-sort';
import { PostGridTemplateControl } from '../../../components/post-grid-template';
import { PostTypeTaxonomyControl } from '../../../components/post-type-taxonomy/PostTypeTaxonomyControl';

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
	} = attributes;

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
					value={
						template ||
						(postType === 'clients'
							? 'client-simple'
							: postType === 'documents'
								? 'document-card'
								: postType === 'faq'
									? 'default'
									: 'default')
					}
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
		</>
	);
};
