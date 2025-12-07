import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { PostGridSidebar } from './sidebar';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';
import { PostGridItemRender } from '../../components/post-grid-item';
import { 
	SwiperSlider, 
	SwiperSlide, 
	getSwiperConfigFromAttributes,
	initSwiper,
	destroySwiper 
} from '../../components/swiper/SwiperSlider';
import { initLightbox } from '../../utilities/lightbox';
import { getRowColsClasses, getGapClasses } from '../../components/grid-control';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		displayMode = 'grid',
		postType,
		postsPerPage,
		orderBy,
		order,
		imageSize,
		gridType,
		gridColumns,
		gridRowCols,
		gridGapX,
		gridGapY,
		swiperEffect,
		swiperItems,
		swiperItemsXs,
		swiperItemsSm,
		swiperItemsMd,
		swiperItemsLg,
		swiperItemsXl,
		swiperItemsXxl,
		swiperSpeed,
		swiperAutoplay,
		swiperAutoplayTime,
		swiperAutoHeight,
		swiperWatchOverflow,
		swiperMargin,
		swiperLoop,
		swiperNav,
		swiperDots,
		swiperDrag,
		swiperReverse,
		swiperUpdateResize,
		swiperNavStyle,
		swiperNavPosition,
		swiperDotsStyle,
		swiperContainerType,
		swiperItemsAuto,
		swiperCentered,
		borderRadius,
		enableLightbox,
		lightboxGallery,
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
		blockClass,
		loadMoreEnable,
		loadMoreInitialCount,
		template = 'default',
	} = attributes;

	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const blockProps = useBlockProps({
		className: `cwgb-post-grid-block ${blockClass}`,
		'data-block': clientId,
	});

	// Загружаем посты через REST API
	useEffect(() => {
		if (!postType) return;

		const fetchPosts = async () => {
			setIsLoading(true);
			try {
				const orderByParam = orderBy || 'date';
				const orderParam = order || 'desc';
				// Исправляем endpoint для типа 'post' - должно быть 'posts' (множественное число)
				const endpoint = postType === 'post' ? 'posts' : postType;
				const fetchedPosts = await apiFetch({
					path: `/wp/v2/${endpoint}?per_page=${postsPerPage || 6}&orderby=${orderByParam}&order=${orderParam}&_embed`,
				});

				console.log('Post Grid: Fetched posts:', fetchedPosts);
				console.log('Post Grid: Post type:', postType);
				console.log('Post Grid: Posts count:', fetchedPosts?.length || 0);

				// Преобразуем посты в формат изображений для ImageSimpleRender
				const postsAsImages = fetchedPosts.map((post) => {
					// Получаем featured image из _embedded
					const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
					const imageUrl = featuredMedia?.source_url || '';
					const imageId = featuredMedia?.id || 0;
					const imageAlt = featuredMedia?.alt_text || post.title?.rendered || '';
					
					// Получаем размеры изображения
					const imageSizes = featuredMedia?.media_details?.sizes || {};
					
					// Если нет featured image, используем placeholder
					const placeholderUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
					const finalImageUrl = imageUrl || placeholderUrl;
					
					// Обрабатываем заголовок: убираем HTML-теги и ограничиваем до 56 символов
					let titleText = post.title?.rendered || '';
					const titleTempDiv = document.createElement('div');
					titleTempDiv.innerHTML = titleText;
					titleText = titleTempDiv.textContent || titleTempDiv.innerText || '';
					titleText = titleText.replace(/\s+/g, ' '); // Заменяем множественные пробелы на один
					titleText = titleText.trim();
					if (titleText.length > 56) {
						titleText = titleText.substring(0, 56) + '...';
					}
					
					// Обрабатываем excerpt: убираем HTML-теги и ограничиваем до 50 символов
					let excerptText = post.excerpt?.rendered || '';
					// Создаем временный элемент для декодирования HTML-сущностей
					const tempDiv = document.createElement('div');
					tempDiv.innerHTML = excerptText;
					excerptText = tempDiv.textContent || tempDiv.innerText || '';
					excerptText = excerptText.replace(/\s+/g, ' '); // Заменяем множественные пробелы на один
					excerptText = excerptText.trim();
					if (excerptText.length > 50) {
						excerptText = excerptText.substring(0, 50) + '...';
					}
					
					const postData = {
						id: imageId || post.id,
						url: finalImageUrl, // Всегда должен быть заполнен
						sizes: imageSizes,
						alt: imageAlt,
						title: titleText,
						caption: '',
						description: excerptText,
						linkUrl: post.link || '',
					};

					console.log('Post Grid: Post data:', postData);
					console.log('Post Grid: Post URL:', postData.url);
					console.log('Post Grid: Has URL?', !!postData.url);
					return postData;
				}).filter(post => post && post.url); // Фильтруем только посты с URL

				console.log('Post Grid: Posts as images:', postsAsImages);
				console.log('Post Grid: Filtered posts count:', postsAsImages.length);

				setPosts(postsAsImages);
			} catch (error) {
				console.error('Post Grid: Error fetching posts:', error);
				console.error('Post Grid: Error details:', error.message, error.code);
				setPosts([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPosts();
	}, [postType, postsPerPage, orderBy, order]);

	// Функция для получения классов контейнера
	const getContainerClasses = () => {
		const currentGridType = gridType || 'classic';
		
		if (currentGridType === 'columns-grid') {
			// Columns Grid: используем row-cols и новые gap атрибуты
			const rowColsClasses = getRowColsClasses(attributes, 'grid', gridColumns);
			const gapClasses = getGapClasses(attributes, 'grid');
			
			// Fallback на старые атрибуты gridGapX и gridGapY для обратной совместимости
			let gapClassesStr = gapClasses.join(' ');
			if (!gapClassesStr && (gridGapX || gridGapY)) {
				const oldGapClasses = [];
				if (gridGapY) oldGapClasses.push(`gy-${gridGapY}`);
				if (gridGapX) oldGapClasses.push(`gx-${gridGapX}`);
				gapClassesStr = oldGapClasses.join(' ');
			}
			
			return `row ${gapClassesStr} ${rowColsClasses.join(' ')}`;
		} else {
			// Classic Grid: только row и gap классы
			const gapClasses = getGapClasses(attributes, 'grid');
			let gapClassesStr = gapClasses.join(' ');
			
			if (!gapClassesStr && (gridGapX || gridGapY)) {
				const oldGapClasses = [];
				if (gridGapY) oldGapClasses.push(`gy-${gridGapY}`);
				if (gridGapX) oldGapClasses.push(`gx-${gridGapX}`);
				gapClassesStr = oldGapClasses.join(' ');
			}
			
			return `row ${gapClassesStr}`.trim();
		}
	};

	// Функция для генерации классов col-* из gridColumns* атрибутов (для Classic Grid)
	const getColClasses = () => {
		if (gridType !== 'classic') {
			return '';
		}
		
		const colClasses = [];
		const {
			gridColumns: colsDefault,
			gridColumnsXs: colsXs,
			gridColumnsSm: colsSm,
			gridColumnsMd: colsMd,
			gridColumnsLg: colsLg,
			gridColumnsXl: colsXl,
			gridColumnsXxl: colsXxl,
		} = attributes;
		
		if (colsDefault) colClasses.push(`col-${colsDefault}`);
		if (colsXs) colClasses.push(`col-${colsXs}`);
		if (colsSm) colClasses.push(`col-sm-${colsSm}`);
		if (colsMd) colClasses.push(`col-md-${colsMd}`);
		if (colsLg) colClasses.push(`col-lg-${colsLg}`);
		if (colsXl) colClasses.push(`col-xl-${colsXl}`);
		if (colsXxl) colClasses.push(`col-xxl-${colsXxl}`);
		
		return colClasses.join(' ');
	};

	// Переинициализация Swiper при изменении настроек
	useEffect(() => {
		if (typeof window === 'undefined' || !window.theme) return;
		if (displayMode !== 'swiper') return;

		destroySwiper('.cwgb-post-grid-block .swiper');

		const timer = setTimeout(() => {
			try {
				if (displayMode === 'swiper' && initSwiper()) {
					console.log('✅ Swiper reinitialized (post-grid)');
				}
				
				if (effectType === 'overlay' && typeof window.theme?.imageHoverOverlay === 'function') {
					window.theme.imageHoverOverlay();
				}
				
				if (effectType === 'tooltip' && typeof window.theme?.iTooltip === 'function') {
					window.theme.iTooltip();
				}
				
				if (enableLightbox) {
					initLightbox();
				}
			} catch (error) {
				// Silently handle theme initialization errors
			}
		}, 300);

		return () => {
			clearTimeout(timer);
			destroySwiper('.cwgb-post-grid-block .swiper');
		};
	}, [
		displayMode,
		enableLightbox,
		imageSize,
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
		swiperEffect,
		swiperSpeed,
		swiperItems,
		swiperItemsXs,
		swiperItemsSm,
		swiperItemsMd,
		swiperItemsLg,
		swiperItemsXl,
		swiperItemsXxl,
		swiperItemsAuto,
		swiperMargin,
		swiperLoop,
		swiperCentered,
		swiperAutoHeight,
		swiperWatchOverflow,
		swiperUpdateResize,
		swiperAutoplay,
		swiperAutoplayTime,
		swiperReverse,
		swiperNav,
		swiperDots,
		swiperDrag,
		swiperNavStyle,
		swiperNavPosition,
		swiperDotsStyle,
		swiperContainerType,
		clientId
	]);

	// Получаем конфигурацию Swiper из атрибутов
	const swiperConfig = getSwiperConfigFromAttributes(attributes);

	// Генерируем уникальный ключ для hover эффектов
	const hoverEffectsKey = useMemo(() => 
		`${simpleEffect}-${effectType}-${tooltipStyle}-${overlayStyle}-${overlayGradient}-${overlayColor}-${cursorStyle}`,
		[simpleEffect, effectType, tooltipStyle, overlayStyle, overlayGradient, overlayColor, cursorStyle]
	);

	// Генерируем уникальный ключ для Swiper (включаем все параметры для перерендеринга при изменении)
	const swiperUniqueKey = useMemo(() => 
		`swiper-${swiperEffect}-${swiperSpeed}-${swiperItems}-${swiperItemsXs}-${swiperItemsSm}-${swiperItemsMd}-${swiperItemsLg}-${swiperItemsXl}-${swiperItemsXxl}-${swiperItemsAuto}-${swiperMargin}-${swiperLoop}-${swiperCentered}-${swiperAutoHeight}-${swiperWatchOverflow}-${swiperUpdateResize}-${swiperDrag}-${swiperReverse}-${swiperAutoplay}-${swiperAutoplayTime}-${swiperNav}-${swiperDots}-${swiperNavStyle}-${swiperNavPosition}-${swiperDotsStyle}-${swiperContainerType}-${hoverEffectsKey}-${clientId}`,
		[
			swiperEffect, swiperSpeed, swiperItems, swiperItemsXs, swiperItemsSm, swiperItemsMd,
			swiperItemsLg, swiperItemsXl, swiperItemsXxl, swiperItemsAuto, swiperMargin, swiperLoop,
			swiperCentered, swiperAutoHeight, swiperWatchOverflow, swiperUpdateResize, swiperDrag,
			swiperReverse, swiperAutoplay, swiperAutoplayTime, swiperNav, swiperDots, swiperNavStyle,
			swiperNavPosition, swiperDotsStyle, swiperContainerType, hoverEffectsKey, clientId
		]
	);

	return (
		<>
			<PostGridSidebar attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				{isLoading ? (
					<div className="cwgb-post-grid-placeholder" style={{ padding: '20px', textAlign: 'center' }}>
						{__('Loading posts...', 'codeweber-gutenberg-blocks')}
					</div>
				) : posts.length === 0 ? (
					<div className="cwgb-post-grid-placeholder" style={{ padding: '20px', textAlign: 'center' }}>
						{__('No posts found. Please select a post type and ensure there are published posts.', 'codeweber-gutenberg-blocks')}
					</div>
				) : displayMode === 'grid' ? (
					<div className={`${getContainerClasses()} ${blockClass || ''}`.trim()} key={`grid-${hoverEffectsKey}-${imageSize}`}>
						{(loadMoreEnable 
							? posts.slice(0, loadMoreInitialCount || posts.length)
							: posts
						).map((post, index) => (
							<div 
								key={`${post.id}-${index}-${hoverEffectsKey}-${imageSize}`}
								className={gridType === 'classic' ? getColClasses() : ''}
							>
								{['default', 'card', 'card-content', 'slider', 'default-clickable', 'overlay-5'].includes(template) ? (
									<PostGridItemRender
										post={post}
										template={template}
										imageSize={imageSize}
										borderRadius={borderRadius}
										simpleEffect={simpleEffect}
										effectType={effectType}
										tooltipStyle={tooltipStyle}
										overlayStyle={overlayStyle}
										overlayGradient={overlayGradient}
										overlayColor={overlayColor}
										cursorStyle={cursorStyle}
										isEditor={true}
									/>
								) : (
									<ImageSimpleRender
										image={post}
										imageSize={imageSize}
										borderRadius={borderRadius}
										enableLightbox={false}
										lightboxGallery={lightboxGallery}
										simpleEffect={simpleEffect}
										effectType={effectType}
										tooltipStyle={tooltipStyle}
										overlayStyle={overlayStyle}
										overlayGradient={overlayGradient}
										overlayColor={overlayColor}
										cursorStyle={cursorStyle}
										isEditor={true}
									/>
								)}
							</div>
						))}
						{loadMoreEnable && posts.length > (loadMoreInitialCount || posts.length) && (
							<div style={{ 
								width: '100%', 
								textAlign: 'center', 
								marginTop: '20px',
								padding: '8px',
								backgroundColor: '#f0f0f0',
								borderRadius: '4px',
								fontSize: '12px',
								color: '#666'
							}}>
								{__('Load More будет работать на фронтенде', 'codeweber-gutenberg-blocks')}
							</div>
						)}
					</div>
				) : displayMode === 'swiper' ? (
					<SwiperSlider 
						config={swiperConfig} 
						className={blockClass || ''}
						uniqueKey={`${swiperUniqueKey}-${imageSize}-${template}`}
					>
						{posts.map((post, index) => (
							<SwiperSlide key={`${post.id}-${index}-${hoverEffectsKey}-${imageSize}-${template}`}>
								{['default', 'card', 'card-content', 'slider', 'default-clickable', 'overlay-5'].includes(template) ? (
									<PostGridItemRender
										post={post}
										template={template}
										imageSize={imageSize}
										borderRadius={borderRadius}
										simpleEffect={simpleEffect}
										effectType={effectType}
										tooltipStyle={tooltipStyle}
										overlayStyle={overlayStyle}
										overlayGradient={overlayGradient}
										overlayColor={overlayColor}
										cursorStyle={cursorStyle}
										isEditor={true}
									/>
								) : (
									<ImageSimpleRender
										image={post}
										imageSize={imageSize}
										borderRadius={borderRadius}
										enableLightbox={false}
										lightboxGallery={lightboxGallery}
										simpleEffect={simpleEffect}
										effectType={effectType}
										tooltipStyle={tooltipStyle}
										overlayStyle={overlayStyle}
										overlayGradient={overlayGradient}
										overlayColor={overlayColor}
										cursorStyle={cursorStyle}
										isEditor={true}
									/>
								)}
							</SwiperSlide>
						))}
					</SwiperSlider>
				) : null}
			</div>
		</>
	);
}

