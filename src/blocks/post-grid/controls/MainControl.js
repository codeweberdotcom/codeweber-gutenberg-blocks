import { __ } from '@wordpress/i18n';
import {
	RangeControl,
	SelectControl,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { ImageSizeControl } from '../../../components/image-size';
import { PostSortControl } from '../../../components/post-sort';
import { PostGridTemplateControl } from '../../../components/post-grid-template';
import { PostTypeTaxonomyControl } from '../../../components/post-type-taxonomy/PostTypeTaxonomyControl';
import { SchemaTypeNotice } from '../../../components/schema-type';

// Image Tag picker for projects — fetches terms from the 'image_tag' taxonomy.
const ProjectImageTagSection = ({
	filterByImageTag,
	filterImageTagId,
	setAttributes,
}) => {
	const [terms, setTerms] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;
		if (!filterByImageTag) return;
		setIsLoading(true);
		apiFetch({
			path: addQueryArgs('/wp/v2/image_tag', { per_page: 100 }),
		})
			.then((data) => {
				if (cancelled) return;
				setTerms(Array.isArray(data) ? data : []);
				setIsLoading(false);
			})
			.catch(() => {
				if (cancelled) return;
				setTerms([]);
				setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [filterByImageTag]);

	const options = [
		{
			value: 0,
			label: __('— Select tag —', 'codeweber-gutenberg-blocks'),
		},
		...terms.map((t) => ({ value: t.id, label: t.name })),
	];

	return (
		<div
			style={{
				marginTop: '16px',
				paddingTop: '16px',
				borderTop: '1px solid #e0e0e0',
			}}
		>
			<div
				style={{
					fontSize: '11px',
					fontWeight: '500',
					textTransform: 'uppercase',
					color: '#757575',
					marginBottom: '12px',
				}}
			>
				{__('Projects Options', 'codeweber-gutenberg-blocks')}
			</div>

			<ToggleControl
				label={__(
					'Preview image by tag',
					'codeweber-gutenberg-blocks'
				)}
				checked={!!filterByImageTag}
				onChange={(value) =>
					setAttributes({ filterByImageTag: value })
				}
				help={__(
					'Pick the first image from the project gallery that has the selected Image Tag. Falls back to featured image if no match.',
					'codeweber-gutenberg-blocks'
				)}
			/>

			{filterByImageTag &&
				(isLoading ? (
					<Spinner />
				) : (
					<SelectControl
						label={__(
							'Image Tag',
							'codeweber-gutenberg-blocks'
						)}
						value={Number(filterImageTagId) || 0}
						options={options}
						onChange={(value) =>
							setAttributes({
								filterImageTagId: parseInt(value, 10) || 0,
							})
						}
					/>
				))}
		</div>
	);
};

export const MainControl = ({ attributes, setAttributes }) => {
	const {
		postType,
		postsPerPage,
		imageSize,
		orderBy,
		order,
		template,
		enableLink,
		selectedTaxonomies,
		simpleEffect,
		filterByImageTag,
		filterImageTagId,
	} = attributes;

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

			{postType === 'projects' && (
				<ProjectImageTagSection
					filterByImageTag={filterByImageTag}
					filterImageTagId={filterImageTagId}
					setAttributes={setAttributes}
				/>
			)}

			<SchemaTypeNotice mode="post" postType={postType || ''} />

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
		</>
	);
};
