/**
 * Accordion Block - Edit Component
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
import { AccordionSidebar } from './sidebar';
import { IconPicker } from '../../components/icon/IconPicker';

const AccordionEdit = ({ attributes, setAttributes, clientId }) => {
	const { accordionStyle, allowMultiple, items, accordionId, iconPosition, iconType, firstItemOpen, mode, postType, selectedTaxonomies } = attributes;
	const previousItemsLengthRef = useRef(items?.length || 0);
	const previousFirstItemOpenRef = useRef(firstItemOpen);
	const previousClientIdRef = useRef(clientId);
	const previousModeRef = useRef(mode);
	const [hoveredItemIndex, setHoveredItemIndex] = useState(null);
	const [iconPickerOpen, setIconPickerOpen] = useState(null); // itemId -> isOpen
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);
	const previousPostTypeRef = useRef(postType);
	const previousSelectedTaxonomiesRef = useRef(JSON.stringify(selectedTaxonomies || {}));

	// Generate unique accordion ID based on clientId (always regenerate to ensure uniqueness)
	useEffect(() => {
		// Always generate ID based on clientId to ensure uniqueness even when block is duplicated
		const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
		const expectedAccordionId = `accordion-${clientIdPrefix}`;
		
		// Always update if ID doesn't match current clientId
		if (accordionId !== expectedAccordionId) {
			setAttributes({ accordionId: expectedAccordionId });
		}
	}, [clientId, accordionId, setAttributes]);

	// Ensure all item IDs are unique and contain clientId
	useEffect(() => {
		if (!items || items.length === 0) {
			previousClientIdRef.current = clientId;
			return;
		}
		
		const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
		
		// Check if clientId changed or if any item ID doesn't contain current clientId prefix
		const clientIdChanged = previousClientIdRef.current !== clientId;
		const hasInvalidIds = items.some(item => !item.id || !item.id.includes(clientIdPrefix));
		
		// Only update if clientId changed or IDs are invalid
		if (!clientIdChanged && !hasInvalidIds) {
			return; // All IDs are valid and clientId hasn't changed
		}
		
		// Regenerate IDs for items that don't match current clientId
		const baseTime = Date.now();
		const updatedItems = items.map((item, index) => {
			if (!item.id || !item.id.includes(clientIdPrefix)) {
				// Use baseTime + index + random to ensure uniqueness
				const randomSuffix = Math.floor(Math.random() * 1000);
				return {
					...item,
					id: `item-${clientIdPrefix}-${baseTime}-${index}-${randomSuffix}`,
				};
			}
			return item;
		});
		
		setAttributes({ items: updatedItems });
		previousClientIdRef.current = clientId;
	}, [clientId, items, setAttributes]);

	// Fetch posts from API when mode is 'post'
	// В режиме Post ВСЕГДА загружаем данные через REST API, игнорируя сохраненные items
	useEffect(() => {
		console.log('[Accordion] useEffect triggered:', { mode, postType, selectedTaxonomies });
		
		if (mode !== 'post' || !postType) {
			console.log('[Accordion] Skipping fetch - mode is not post or postType is empty');
			previousModeRef.current = mode;
			previousPostTypeRef.current = postType;
			previousSelectedTaxonomiesRef.current = JSON.stringify(selectedTaxonomies || {});
			return;
		}

		// Проверяем, изменились ли postType или selectedTaxonomies
		const postTypeChanged = previousPostTypeRef.current !== postType;
		const taxonomiesChanged = previousSelectedTaxonomiesRef.current !== JSON.stringify(selectedTaxonomies || {});
		const modeChangedToPost = previousModeRef.current !== mode && mode === 'post';

		console.log('[Accordion] Change detection:', {
			postTypeChanged,
			taxonomiesChanged,
			modeChangedToPost,
			previousPostType: previousPostTypeRef.current,
			currentPostType: postType,
			previousMode: previousModeRef.current,
			currentMode: mode
		});

		// В режиме Post ВСЕГДА загружаем свежие данные через REST API при каждом монтировании компонента
		// Это гарантирует, что редактор всегда показывает актуальные данные из базы,
		// даже если есть сохраненные items (которые могут быть устаревшими)
		// 
		// Игнорируем сохраненные items, так как они могут быть устаревшими
		// Загружаем данные при:
		// 1. Первой загрузке (previousPostTypeRef.current пустой)
		// 2. Изменении режима на Post
		// 3. Изменении postType
		// 4. Изменении таксономий
		// 5. ИЛИ всегда в режиме Post (для актуальности данных)
		
		// В режиме Post ВСЕГДА загружаем данные при каждом монтировании компонента
		// Это гарантирует, что редактор всегда показывает актуальные данные из базы,
		// даже если есть сохраненные items (которые могут быть устаревшими)
		// 
		// Игнорируем сохраненные items, так как они могут быть устаревшими
		// Загружаем данные при:
		// 1. Первой загрузке (previousPostTypeRef.current пустой)
		// 2. Изменении режима на Post
		// 3. Изменении postType
		// 4. Изменении таксономий
		// 5. ИЛИ всегда в режиме Post (для актуальности данных)
		
		// В режиме Post ВСЕГДА загружаем данные при каждом монтировании компонента
		// Это гарантирует, что редактор всегда показывает актуальные данные из базы,
		// даже если есть сохраненные items (которые могут быть устаревшими)
		// Игнорируем сохраненные items, так как они могут быть устаревшими
		console.log('[Accordion] Post mode - always fetching fresh data from database (ignoring saved items)');

		const fetchPosts = async () => {
			console.log('[Accordion] Starting to fetch posts for:', postType);
			setIsLoadingPosts(true);
			try {
				// Используем наш кастомный endpoint, который использует WP_Query (как в render.php)
				const apiPath = `/codeweber-gutenberg-blocks/v1/accordion-posts?post_type=${postType}&selected_taxonomies=${encodeURIComponent(JSON.stringify(selectedTaxonomies || {}))}`;
				console.log('[Accordion] Fetching from WP_Query endpoint:', apiPath);
				
				const fetchedPosts = await apiFetch({
					path: apiPath,
				});
				
				console.log('[Accordion] Fetched posts:', fetchedPosts?.length || 0);
				console.log('[Accordion] First post sample:', fetchedPosts?.[0]);
				
				// Если получили ошибку или пустой массив
				if (!Array.isArray(fetchedPosts)) {
					console.error('[Accordion] API returned non-array:', fetchedPosts);
					throw new Error('API returned invalid response');
				}

				// Генерируем items из постов (данные уже обработаны на сервере через WP_Query)
				const clientIdPrefix = clientId.replace(/[^a-z0-9]/gi, '');
				const baseTime = Date.now();
				const generatedItems = fetchedPosts.map((post, index) => {
					return {
						id: `item-${clientIdPrefix}-${baseTime}-${index}-${post.id}`,
						title: post.title || __('Untitled', 'codeweber-gutenberg-blocks'),
						content: post.content || __('No content available', 'codeweber-gutenberg-blocks'),
						icon: '',
						isOpen: firstItemOpen && index === 0,
					};
				});

				console.log('[Accordion] Generated items:', generatedItems.length);
				setAttributes({ items: generatedItems });
				previousModeRef.current = mode;
				previousPostTypeRef.current = postType;
				previousSelectedTaxonomiesRef.current = JSON.stringify(selectedTaxonomies || {});
			} catch (error) {
				console.error('[Accordion] Error fetching posts:', error);
			} finally {
				setIsLoadingPosts(false);
			}
		};

		fetchPosts();
	}, [mode, postType, selectedTaxonomies, clientId, firstItemOpen, setAttributes]);

	// Ensure first item open (others closed) when option enabled
	useEffect(() => {
		if (!firstItemOpen || !items?.length) {
			previousFirstItemOpenRef.current = firstItemOpen;
			previousItemsLengthRef.current = items?.length || 0;
			return;
		}
		
		// Only update if items length changed or firstItemOpen toggled
		const itemsLengthChanged = previousItemsLengthRef.current !== items.length;
		const firstItemOpenToggled = previousFirstItemOpenRef.current !== firstItemOpen;
		
		if (!itemsLengthChanged && !firstItemOpenToggled) {
			// Check if already in correct state
			const needsUpdate = items.some((item, idx) => item.isOpen !== (idx === 0));
			if (!needsUpdate) return;
		}
		
		const updated = items.map((item, idx) => ({
			...item,
			isOpen: idx === 0,
		}));
		
		setAttributes({ items: updated });
		previousItemsLengthRef.current = items.length;
		previousFirstItemOpenRef.current = firstItemOpen;
	}, [firstItemOpen, items, setAttributes]);

	const updateItem = (index, field, value) => {
		const newItems = [...items];
		newItems[index] = {
			...newItems[index],
			[field]: value,
		};
		setAttributes({ items: newItems });
	};

	const addItem = () => {
		const newItem = {
			id: `item-${Date.now()}`,
			title: __('New Item', 'codeweber-gutenberg-blocks'),
			content: __('Add your content here...', 'codeweber-gutenberg-blocks'),
			icon: '',
			isOpen: false,
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

	const toggleItem = (index) => {
		if (!allowMultiple) {
			// Close all other items
			const newItems = items.map((item, i) => ({
				...item,
				isOpen: i === index ? !item.isOpen : false,
			}));
			setAttributes({ items: newItems });
		} else {
			// Toggle only this item
			updateItem(index, 'isOpen', !items[index].isOpen);
		}
	};

	// Get accordion classes
	const getAccordionClasses = () => {
		const classes = ['accordion', 'accordion-wrapper'];
		// Добавляем класс только для правой позиции (по умолчанию иконка слева)
		if (iconPosition === 'right') {
			classes.push('icon-right');
		}
		// Тип иконок
		if (iconType === 'type-2') classes.push('type-2');
		else if (iconType === 'type-3') classes.push('type-3');
		else classes.push('type-1');
		return classes.join(' ');
	};

	// Get item classes
	const getItemClasses = (item, index) => {
		const classes = ['card', 'accordion-item'];
		if (accordionStyle === 'simple') {
			classes.push('plain');
		} else if (accordionStyle === 'icon') {
			classes.push('icon');
		}
		return classes.join(' ');
	};

	// Get button classes
	const getButtonClasses = (item, index) => {
		const classes = ['accordion-button'];
		if (!item.isOpen) {
			classes.push('collapsed');
		}
		return classes.join(' ');
	};

	// Get collapse classes
	const getCollapseClasses = (item, index) => {
		const classes = ['accordion-collapse', 'collapse'];
		if (item.isOpen) {
			classes.push('show');
		}
		return classes.join(' ');
	};

	const blockProps = useBlockProps({
		className: getAccordionClasses(),
		id: accordionId,
	});

	return (
		<>
			<InspectorControls>
				<AccordionSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
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
				{/* В режиме Post показываем items только если они загружены, в режиме Custom - всегда */}
				{(mode === 'post' ? (items.length > 0 && !isLoadingPosts) : true) && items.map((item, index) => {
					const headingId = `heading-${item.id}`;
					const collapseId = `collapse-${item.id}`;

					const isHovered = hoveredItemIndex === index;
					
					return (
						<div 
							key={item.id} 
							className={`${getItemClasses(item, index)} accordion-item-wrapper p-0${accordionStyle === 'simple' ? ' mt-0' : ''}`} 
							style={{ width: '100%', maxWidth: '100%', position: 'relative' }}
							onMouseEnter={() => setHoveredItemIndex(index)}
							onMouseLeave={() => setHoveredItemIndex(null)}
						>
							<div className="card-header" id={headingId}>
								<button
									className={getButtonClasses(item, index)}
									type="button"
									data-bs-toggle="collapse"
									data-bs-target={`#${collapseId}`}
									aria-expanded={item.isOpen}
									aria-controls={collapseId}
									onClick={(e) => {
										e.preventDefault();
										toggleItem(index);
									}}
									style={{ pointerEvents: 'auto', cursor: 'pointer' }}
								>
									{accordionStyle === 'icon' && (
										<span 
											className="icon"
											onClick={mode === 'custom' ? (e) => {
												e.stopPropagation();
												setIconPickerOpen(item.id);
											} : undefined}
											style={{ cursor: mode === 'custom' ? 'pointer' : 'default' }}
											title={mode === 'custom' ? __('Click to change icon', 'codeweber-gutenberg-blocks') : ''}
										>
											<i className={item.icon || 'uil uil-plus'}></i>
										</span>
									)}
									{mode === 'custom' ? (
										<RichText
											tagName="span"
											value={item.title}
											onChange={(value) => updateItem(index, 'title', value)}
											placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
											withoutInteractiveFormatting
										/>
									) : (
										// В режиме Post - только чтение, как на фронтенде
										<span>{item.title}</span>
									)}
								</button>
							</div>
							
							{/* Item Controls - Absolute positioned, visible on hover - только в режиме Custom */}
							{mode === 'custom' && (
							<div 
								className="accordion-item-controls"
								style={{
									position: 'absolute',
									top: '-18px',
									right: '8px',
									left: 'auto',
									bottom: 'auto',
									display: 'flex',
									gap: '4px',
									alignItems: 'center',
									opacity: isHovered ? 1 : 0,
									visibility: isHovered ? 'visible' : 'hidden',
									transition: 'opacity 0.2s ease, visibility 0.2s ease',
									background: '#fff',
									padding: '4px',
									borderRadius: '4px',
									boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
									zIndex: 10,
									pointerEvents: isHovered ? 'auto' : 'none',
									margin: 0,
									width: 'auto',
									height: 'auto'
								}}
							>
								<div
									role="button"
									tabIndex={0}
									className={`accordion-control-btn ${index === 0 ? 'disabled' : ''}`}
									onClick={(e) => {
										e.stopPropagation();
										if (index !== 0) moveItem(index, 'up');
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											e.stopPropagation();
											if (index !== 0) moveItem(index, 'up');
										}
									}}
									aria-label={__('Move up', 'codeweber-gutenberg-blocks')}
									title={__('Move up', 'codeweber-gutenberg-blocks')}
								>
									<span className="dashicons dashicons-arrow-up-alt2"></span>
								</div>
								<div
									role="button"
									tabIndex={0}
									className={`accordion-control-btn ${index === items.length - 1 ? 'disabled' : ''}`}
									onClick={(e) => {
										e.stopPropagation();
										if (index !== items.length - 1) moveItem(index, 'down');
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											e.stopPropagation();
											if (index !== items.length - 1) moveItem(index, 'down');
										}
									}}
									aria-label={__('Move down', 'codeweber-gutenberg-blocks')}
									title={__('Move down', 'codeweber-gutenberg-blocks')}
								>
									<span className="dashicons dashicons-arrow-down-alt2"></span>
								</div>
								<div
									role="button"
									tabIndex={0}
									className={`accordion-control-btn accordion-control-delete ${items.length === 1 ? 'disabled' : ''}`}
									onClick={(e) => {
										e.stopPropagation();
										if (items.length !== 1) removeItem(index);
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											e.stopPropagation();
											if (items.length !== 1) removeItem(index);
										}
									}}
									aria-label={__('Remove', 'codeweber-gutenberg-blocks')}
									title={__('Remove', 'codeweber-gutenberg-blocks')}
								>
									<span className="dashicons dashicons-trash"></span>
								</div>
							</div>
							)}
							<div
								id={collapseId}
								className={getCollapseClasses(item, index)}
								aria-labelledby={headingId}
								{...(allowMultiple ? {} : { 'data-bs-parent': `#${accordionId}` })}
							>
							<div className="card-body">
								{mode === 'custom' ? (
									<RichText
										tagName="p"
										value={item.content}
										onChange={(value) => updateItem(index, 'content', value)}
										placeholder={__(
											'Enter content...',
											'codeweber-gutenberg-blocks'
										)}
									/>
								) : (
									// В режиме Post - только чтение, как на фронтенде
									<p>{item.content}</p>
								)}
							</div>
							</div>
						</div>
					);
				})}

				{/* Add Item Button - только в режиме Custom */}
				{mode === 'custom' && (
					<div style={{ marginTop: '16px' }}>
						<Button isPrimary onClick={addItem}>
							{__('+ Add Accordion Item', 'codeweber-gutenberg-blocks')}
						</Button>
					</div>
				)}

				{/* Icon Pickers for each item - только в режиме Custom */}
				{mode === 'custom' && items.map((item, index) => {
					// Извлекаем имя иконки из класса (например, "uil uil-windows" -> "windows")
					const getIconName = (iconClass) => {
						if (!iconClass) return '';
						const match = iconClass.match(/uil-([^\s]+)/);
						return match ? match[1] : '';
					};

					return (
						<IconPicker
							key={`icon-picker-${item.id}`}
							isOpen={iconPickerOpen === item.id}
							onClose={() => setIconPickerOpen(null)}
							onSelect={(result) => {
								// Извлекаем iconName и сохраняем как класс иконки
								const iconClass = result.iconName ? `uil uil-${result.iconName}` : '';
								updateItem(index, 'icon', iconClass);
							}}
							selectedIcon={getIconName(item.icon)}
							selectedType="font"
							initialTab="font"
							allowFont={true}
							allowSvgLineal={false}
							allowSvgSolid={false}
						/>
					);
				})}
			</div>
		</>
	);
};

export default AccordionEdit;
