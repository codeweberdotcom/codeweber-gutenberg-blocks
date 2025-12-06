import { __ } from '@wordpress/i18n';
import { SelectControl, RangeControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { ImageSizeControl } from '../../../components/image-size';
import { PostSortControl } from '../../../components/post-sort';

export const MainControl = ({ attributes, setAttributes }) => {
	const { postType, postsPerPage, imageSize, orderBy, order } = attributes;
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

