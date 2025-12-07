import { __ } from '@wordpress/i18n';
import { SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { ImageSizeControl } from '../../../components/image-size';
import { PostSortControl } from '../../../components/post-sort';
import { PostGridTemplateControl } from '../../../components/post-grid-template';
import { TaxonomyFilterControl } from '../../../components/taxonomy-filter';

export const MainControl = ({ attributes, setAttributes }) => {
	const { postType, postsPerPage, imageSize, orderBy, order, template, enableLink, selectedTaxonomies } = attributes;
	const [postTypes, setPostTypes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Загружаем все типы записей через REST API
	useEffect(() => {
		const fetchPostTypes = async () => {
			try {
				const types = await apiFetch({ path: '/wp/v2/types' });
				const postTypeOptions = Object.keys(types)
					.filter(key => {
						// Исключаем системные типы
						const excluded = ['attachment', 'wp_block', 'wp_template', 'wp_template_part', 'wp_navigation'];
						return !excluded.includes(key);
					})
					.map(key => ({
						label: types[key].name || key,
						value: key,
					}));
				
				setPostTypes(postTypeOptions);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching post types:', error);
				setIsLoading(false);
			}
		};

		fetchPostTypes();
	}, []);

	return (
		<>
			<SelectControl
				label={__('Post Type', 'codeweber-gutenberg-blocks')}
				value={postType}
				options={isLoading ? [{ label: __('Loading...', 'codeweber-gutenberg-blocks'), value: '' }] : postTypes}
				onChange={(value) => setAttributes({ postType: value })}
				help={__('Select the post type to display', 'codeweber-gutenberg-blocks')}
			/>

			{postType && (
				<div style={{ marginTop: '16px' }}>
					<TaxonomyFilterControl
						postType={postType}
						selectedTaxonomies={selectedTaxonomies || {}}
						onChange={(value) => setAttributes({ selectedTaxonomies: value })}
					/>
				</div>
			)}

			<div style={{ marginTop: '16px' }}>
				<PostGridTemplateControl
					value={template || (postType === 'clients' ? 'client-simple' : 'default')}
					onChange={(value) => setAttributes({ template: value })}
					postType={postType || 'post'}
				/>
				{postType === 'clients' && (
					<div style={{ marginTop: '16px' }}>
						<ToggleControl
							label={__('Enable Links', 'codeweber-gutenberg-blocks')}
							checked={enableLink || false}
							onChange={(value) => setAttributes({ enableLink: value })}
							help={__('Enable links to client posts (disabled by default)', 'codeweber-gutenberg-blocks')}
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
				help={__('Number of posts to display', 'codeweber-gutenberg-blocks')}
			/>
			
			<div style={{ marginTop: '16px' }}>
				<ImageSizeControl
					value={imageSize || 'full'}
					onChange={(value) => setAttributes({ imageSize: value })}
					label={__('Image Size', 'codeweber-gutenberg-blocks')}
					help={__('Select the size for featured images.', 'codeweber-gutenberg-blocks')}
					postType={postType}
				/>
			</div>
			
			<div style={{ marginTop: '16px' }}>
				<PostSortControl
					orderBy={orderBy || 'date'}
					order={order || 'desc'}
					onOrderByChange={(value) => setAttributes({ orderBy: value })}
					onOrderChange={(value) => setAttributes({ order: value })}
				/>
			</div>
		</>
	);
};


