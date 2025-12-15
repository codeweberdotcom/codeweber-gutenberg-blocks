/**
 * Lists Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { ListsSidebar } from './sidebar';

const ListsEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		mode,
		listType,
		bulletColor,
		bulletBg,
		iconClass,
		textColor,
		items,
		postType,
		selectedTaxonomies,
		enableLinks,
		postsPerPage,
		orderBy,
		order,
		listClass,
		listId,
		listData,
	} = attributes;

	const previousModeRef = useRef(mode);
	const previousPostTypeRef = useRef(postType);
	const previousSelectedTaxonomiesRef = useRef(JSON.stringify(selectedTaxonomies || {}));
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);

	// Ensure all item IDs are unique and contain clientId
	useEffect(() => {
		if (!items || items.length === 0) {
			return;
		}

		const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
		const hasInvalidIds = items.some(item => !item.id || !item.id.includes(clientIdPrefix));

		if (!hasInvalidIds) {
			return;
		}

		const baseTime = Date.now();
		const updatedItems = items.map((item, index) => {
			if (!item.id || !item.id.includes(clientIdPrefix)) {
				const randomSuffix = Math.floor(Math.random() * 1000);
				return {
					...item,
					id: `item-${clientIdPrefix}-${baseTime}-${index}-${randomSuffix}`,
				};
			}
			return item;
		});

		setAttributes({ items: updatedItems });
	}, [clientId, items, setAttributes]);

	// Fetch posts from API when mode is 'post'
	useEffect(() => {
		if (mode !== 'post' || !postType) {
			previousModeRef.current = mode;
			previousPostTypeRef.current = postType;
			previousSelectedTaxonomiesRef.current = JSON.stringify(selectedTaxonomies || {});
			return;
		}

		const postTypeChanged = previousPostTypeRef.current !== postType;
		const taxonomiesChanged = previousSelectedTaxonomiesRef.current !== JSON.stringify(selectedTaxonomies || {});
		const modeChangedToPost = previousModeRef.current !== mode && mode === 'post';

		// Always fetch fresh data in Post mode
		const fetchPosts = async () => {
			setIsLoadingPosts(true);
			try {
				// Get post type info to determine REST API endpoint
				let endpoint = `posts`;
				try {
					const postTypeInfo = await apiFetch({
						path: `/wp/v2/types/${postType}`,
					});
					if (postTypeInfo && postTypeInfo.rest_base) {
						endpoint = postTypeInfo.rest_base;
					}
				} catch (error) {
					console.warn('Could not fetch post type info, using default endpoint');
				}

				// Build query params
				const queryParams = new URLSearchParams({
					per_page: postsPerPage || 10,
					orderby: orderBy || 'date',
					order: order || 'desc',
					_status: 'publish',
				});

				// Add taxonomy filters
				if (selectedTaxonomies && Object.keys(selectedTaxonomies).length > 0) {
					Object.entries(selectedTaxonomies).forEach(([taxonomy, termIds]) => {
						if (termIds && termIds.length > 0) {
							queryParams.append(taxonomy, termIds.join(','));
						}
					});
				}

				const fetchedPosts = await apiFetch({
					path: `/wp/v2/${endpoint}?${queryParams.toString()}`,
				});

				// Transform posts to list items
				const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
				const transformedItems = fetchedPosts.map((post, index) => ({
					id: `item-${clientIdPrefix}-${post.id}-${Date.now()}-${index}`,
					text: post.title?.rendered || post.title || __('Untitled', 'codeweber-gutenberg-blocks'),
					url: post.link || '',
				}));

				setAttributes({ items: transformedItems });
				setIsLoadingPosts(false);
			} catch (error) {
				console.error('Error fetching posts:', error);
				setAttributes({ items: [] });
				setIsLoadingPosts(false);
			}
		};

		fetchPosts();
		previousModeRef.current = mode;
		previousPostTypeRef.current = postType;
		previousSelectedTaxonomiesRef.current = JSON.stringify(selectedTaxonomies || {});
	}, [mode, postType, selectedTaxonomies, postsPerPage, orderBy, order, clientId, setAttributes]);

	const updateItem = (index, field, value) => {
		const newItems = [...items];
		newItems[index] = {
			...newItems[index],
			[field]: value,
		};
		setAttributes({ items: newItems });
	};

	const addItem = () => {
		const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
		const newItem = {
			id: `item-${clientIdPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
			text: __('New list item', 'codeweber-gutenberg-blocks'),
		};
		setAttributes({ items: [...items, newItem] });
	};

	const removeItem = (index) => {
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
	};

	const moveItem = (index, direction) => {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === items.length - 1)
		) {
			return;
		}

		const newItems = [...items];
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		[newItems[index], newItems[targetIndex]] = [
			newItems[targetIndex],
			newItems[index],
		];
		setAttributes({ items: newItems });
	};

	// Get list classes
	const getListClasses = () => {
		const classes = [];
		
		if (listType === 'unordered') {
			classes.push('unordered-list');
		} else if (listType === 'icon') {
			classes.push('icon-list');
		}

		// Bullet color
		if (bulletColor && bulletColor !== 'none') {
			classes.push(`bullet-${bulletColor}`);
		}

		// Bullet background (only for icon-list)
		if (listType === 'icon' && bulletBg) {
			classes.push('bullet-bg');
			// Add soft color class if bulletColor is set
			if (bulletColor && bulletColor !== 'none') {
				classes.push(`bullet-soft-${bulletColor}`);
			}
		}

		// Text color
		if (textColor) {
			classes.push(`text-${textColor}`);
		}

		// Custom class
		if (listClass) {
			classes.push(listClass);
		}

		return classes.join(' ');
	};

	const blockProps = useBlockProps({
		className: '',
		id: listId || undefined,
	});

	// Parse data attributes
	const getDataAttributes = () => {
		if (!listData) return {};
		const dataAttrs = {};
		const pairs = listData.split(',');
		pairs.forEach(pair => {
			const [key, value] = pair.split('=').map(s => s.trim());
			if (key && value) {
				dataAttrs[`data-${key}`] = value;
			}
		});
		return dataAttrs;
	};

	return (
		<>
			<InspectorControls>
				<ListsSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps} {...getDataAttributes()}>
				{isLoadingPosts && (
					<div style={{ padding: '20px', textAlign: 'center' }}>
						{__('Loading posts...', 'codeweber-gutenberg-blocks')}
					</div>
				)}
				{!isLoadingPosts && items.length === 0 && mode === 'post' && (
					<div style={{ padding: '20px', textAlign: 'center' }}>
						{__('No posts found. Please select a post type and check your filters.', 'codeweber-gutenberg-blocks')}
					</div>
				)}
				{(mode === 'post' ? (items.length > 0 && !isLoadingPosts) : true) && (
					<ul className={getListClasses()}>
						{items.map((item, index) => (
							<li key={item.id} style={{ position: 'relative' }}>
								{listType === 'icon' && (
									<span><i className={iconClass || 'uil uil-arrow-right'}></i></span>
								)}
								<span>
									{mode === 'custom' ? (
										<>
											<RichText
												tagName="span"
												value={item.text}
												onChange={(value) => updateItem(index, 'text', value)}
												placeholder={__('Enter list item...', 'codeweber-gutenberg-blocks')}
												withoutInteractiveFormatting
											/>
											<div className="lists-item-controls" style={{
												position: 'absolute',
												right: '10px',
												top: '-18px',
												display: 'flex',
												gap: '4px',
												zIndex: 10,
											}}>
												<Button
													isSmall
													onClick={() => moveItem(index, 'up')}
													disabled={index === 0}
													title={__('Move up', 'codeweber-gutenberg-blocks')}
												>
													↑
												</Button>
												<Button
													isSmall
													onClick={() => moveItem(index, 'down')}
													disabled={index === items.length - 1}
													title={__('Move down', 'codeweber-gutenberg-blocks')}
												>
													↓
												</Button>
												<Button
													isSmall
													isDestructive
													onClick={() => removeItem(index)}
													title={__('Remove', 'codeweber-gutenberg-blocks')}
												>
													×
												</Button>
											</div>
										</>
									) : (
										enableLinks && item.url ? (
											<a href={item.url}>{item.text}</a>
										) : (
											<span>{item.text}</span>
										)
									)}
								</span>
							</li>
						))}
					</ul>
				)}
				{mode === 'custom' && (
					<Button
						isPrimary
						onClick={addItem}
						style={{ marginTop: '16px' }}
					>
						{__('+ Add List Item', 'codeweber-gutenberg-blocks')}
					</Button>
				)}
			</div>
		</>
	);
};

export default ListsEdit;








