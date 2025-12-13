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
		swiperWrapperClass,
		swiperSlideClass,
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
		loadMoreText = 'show-more',
		loadMoreType = 'button',
		loadMoreButtonSize,
		loadMoreButtonStyle = 'solid',
		template = 'default',
		enableLink = false,
		selectedTaxonomies = {},
	} = attributes;

	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const blockProps = useBlockProps({
		className: `cwgb-post-grid-block ${blockClass}`,
		'data-block': clientId,
	});

	// Автоматически меняем template и imageSize при смене postType на clients или testimonials
	useEffect(() => {
		if (postType === 'clients') {
			const updates = {};
			// Если template не является client шаблоном, меняем на client-simple
			if (!template || !template.startsWith('client-')) {
				updates.template = 'client-simple';
			}
			// Если imageSize = 'full' или пустой, меняем на codeweber_clients_300-200
			if (imageSize === 'full' || !imageSize) {
				updates.imageSize = 'codeweber_clients_300-200';
			}
			if (Object.keys(updates).length > 0) {
				setAttributes(updates);
			}
		} else if (postType === 'testimonials') {
			const updates = {};
			// Если template не является testimonial шаблоном, меняем на default
			if (!template || (!template.startsWith('testimonial-') && !['default', 'card', 'blockquote', 'icon'].includes(template))) {
				updates.template = 'default';
			}
			if (Object.keys(updates).length > 0) {
				setAttributes(updates);
			}
		} else if (postType === 'documents') {
			const updates = {};
			// Для documents используем document-card по умолчанию, если шаблон не установлен
			// Поддерживаем оба шаблона: document-card и document-card-download
			if (!template || (template !== 'document-card' && template !== 'document-card-download')) {
				updates.template = 'document-card';
			}
			if (Object.keys(updates).length > 0) {
				setAttributes(updates);
			}
		} else if (postType === 'faq') {
			const updates = {};
			// Для FAQ используем default по умолчанию, если шаблон не установлен
			if (!template || template !== 'default') {
				updates.template = 'default';
			}
			if (Object.keys(updates).length > 0) {
				setAttributes(updates);
			}
		} else if (postType === 'staff') {
			const updates = {};
			// Для staff используем default по умолчанию, если шаблон не установлен
			// Поддерживаем шаблоны: default, card, circle, circle_center, circle_center_alt
			if (!template || !['default', 'card', 'circle', 'circle_center', 'circle_center_alt'].includes(template)) {
				updates.template = 'default';
			}
			if (Object.keys(updates).length > 0) {
				setAttributes(updates);
			}
		} else if (postType && postType !== 'clients' && postType !== 'testimonials' && postType !== 'documents' && postType !== 'faq' && postType !== 'staff') {
			// Если переключились с clients, testimonials, documents, faq или staff на другой тип, меняем template на default
			if (template && (template.startsWith('client-') || template.startsWith('testimonial-') || template === 'document-card' || template === 'document-card-download' || ['card', 'blockquote', 'icon'].includes(template))) {
				setAttributes({ template: 'default' });
			}
		}
	}, [postType]);

	// Загружаем посты через REST API
	useEffect(() => {
		if (!postType) return;

		const fetchPosts = async () => {
			setIsLoading(true);
			try {
				const orderByParam = orderBy || 'date';
				const orderParam = order || 'desc';
				
				// Получаем правильный REST API endpoint для типа записи
				// Сначала пытаемся получить rest_base из типа записи
				let endpoint = postType;
				try {
					const postTypeData = await apiFetch({
						path: `/wp/v2/types/${postType}`,
					});
					// Используем rest_base если он есть, иначе используем postType
					if (postTypeData && postTypeData.rest_base) {
						endpoint = postTypeData.rest_base;
					} else {
						// Fallback для стандартных типов
						if (postType === 'post') {
							endpoint = 'posts';
						}
					}
				} catch (error) {
					// Если не удалось получить данные типа, используем fallback
					console.warn('Post Grid: Could not fetch post type data, using fallback:', error);
					if (postType === 'post') {
						endpoint = 'posts';
					}
				}
				
				// Формируем параметры для фильтрации по таксономиям
				let queryParams = `per_page=${postsPerPage || 6}&orderby=${orderByParam}&order=${orderParam}&_embed`;
				
				// Добавляем фильтры по таксономиям
				// WordPress REST API использует rest_base таксономии для фильтрации
				// Нужно загрузить таксономии, чтобы получить их rest_base
				if (selectedTaxonomies && Object.keys(selectedTaxonomies).length > 0) {
					try {
						// Загружаем информацию о таксономиях для получения rest_base
						const taxonomiesData = await apiFetch({
							path: `/codeweber-gutenberg-blocks/v1/taxonomies/${postType}`,
						});
						
						// Создаем маппинг slug -> rest_base
						const taxonomyMap = {};
						if (taxonomiesData && Array.isArray(taxonomiesData)) {
							taxonomiesData.forEach((tax) => {
								taxonomyMap[tax.slug] = tax.rest_base || tax.slug;
							});
						}
						
						// Добавляем параметры фильтрации
						Object.keys(selectedTaxonomies).forEach((taxonomySlug) => {
							const termIds = selectedTaxonomies[taxonomySlug];
							if (termIds && termIds.length > 0) {
								// Используем rest_base из маппинга, или slug как fallback
								const restBase = taxonomyMap[taxonomySlug] || taxonomySlug;
								
								// Для стандартных таксономий используем известные имена
								// WordPress REST API использует множественное число для стандартных таксономий
								let paramName = restBase;
								if (taxonomySlug === 'post_tag') {
									paramName = 'tags';
								} else if (taxonomySlug === 'category') {
									paramName = 'categories';
								}
								
								// Преобразуем termIds в массив чисел для правильной передачи
								const termIdsArray = termIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
								if (termIdsArray.length > 0) {
									queryParams += `&${paramName}=${termIdsArray.join(',')}`;
								}
							}
						});
					} catch (error) {
						console.error('Error fetching taxonomies for filtering:', error);
					}
				}
				
				// Для testimonials добавляем _embed для получения метаполей и связанных данных
				if (postType === 'testimonials') {
					queryParams += '&_embed=1';
				} else {
					queryParams += '&_embed=wp:featuredmedia';
				}
				
				const fetchedPosts = await apiFetch({
					path: `/wp/v2/${endpoint}?${queryParams}`,
				});

				console.log('Post Grid: Fetched posts:', fetchedPosts);
				console.log('Post Grid: Post type:', postType);
				console.log('Post Grid: Endpoint used:', endpoint);
				console.log('Post Grid: Posts count:', fetchedPosts?.length || 0);
				
				// Проверяем, что получили массив
				if (!Array.isArray(fetchedPosts)) {
					console.error('Post Grid: Expected array but got:', typeof fetchedPosts, fetchedPosts);
					setPosts([]);
					setIsLoading(false);
					return;
				}

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
					// Получаем URL плагина из window (если передан) или используем относительный путь
					let placeholderUrl = '/wp-content/plugins/codeweber-gutenberg-blocks/placeholder.jpg';
					if (window.codeweberBlocksData?.pluginUrl) {
						const pluginUrl = window.codeweberBlocksData.pluginUrl;
						placeholderUrl = pluginUrl.endsWith('/') ? `${pluginUrl}placeholder.jpg` : `${pluginUrl}/placeholder.jpg`;
					} else if (window.location && window.location.origin) {
						placeholderUrl = `${window.location.origin}/wp-content/plugins/codeweber-gutenberg-blocks/placeholder.jpg`;
					}
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
					
					// Для типа записи clients при включенном enableLink используем company_url из метаполя
					let linkUrl = post.link || '';
					if (postType === 'clients' && enableLink && post.company_url) {
						linkUrl = post.company_url;
					}
					
					// Для documents получаем URL файла документа из метаполя
					let documentFileUrl = '';
					if (postType === 'documents') {
						documentFileUrl = post._document_file || post.meta?._document_file || '';
					}
					
					// Для testimonials получаем дополнительные данные из метаполей
					let testimonialData = {};
					if (postType === 'testimonials') {
						// Получаем данные testimonials из meta (через REST API поля)
						// Метаполя регистрируются через register_rest_field и доступны напрямую
						const testimonialText = post._testimonial_text || post.meta?._testimonial_text || '';
						
						// Автор
						const authorType = post._testimonial_author_type || post.meta?._testimonial_author_type || 'custom';
						let authorName = '';
						let authorRole = '';
						let avatarUrl = '';
						
						if (authorType === 'user') {
							const userId = post._testimonial_author_user_id || post.meta?._testimonial_author_user_id;
							if (userId) {
								// Для пользователей используем данные из _embedded если доступны
								const embedded = post._embedded || {};
								if (embedded['author'] && embedded['author'][0]) {
									const user = embedded['author'][0];
									authorName = user.name || '';
									authorRole = post._testimonial_author_role || post.meta?._testimonial_author_role || '';
									avatarUrl = user.avatar_urls?.['96'] || '';
								} else {
									authorName = titleText; // Fallback на заголовок поста
									authorRole = post._testimonial_author_role || post.meta?._testimonial_author_role || '';
								}
							}
						} else {
							authorName = post._testimonial_author_name || post.meta?._testimonial_author_name || titleText;
							authorRole = post._testimonial_author_role || post.meta?._testimonial_author_role || '';
							const avatarId = post._testimonial_avatar || post.meta?._testimonial_avatar;
							if (avatarId) {
								// Пытаемся получить URL аватара из _embedded
								const embedded = post._embedded || {};
								if (embedded['wp:attachment'] && Array.isArray(embedded['wp:attachment'])) {
									const avatarMedia = embedded['wp:attachment'].find(item => item.id === parseInt(avatarId));
									if (avatarMedia) {
										avatarUrl = avatarMedia.source_url || '';
									}
								}
							}
						}
						
						// Рейтинг
						const rating = parseInt(post._testimonial_rating || post.meta?._testimonial_rating || '5');
						const ratingClass = ['', 'one', 'two', 'three', 'four', 'five'][rating] || 'five';
						
						// Компания
						const company = post._testimonial_company || post.meta?._testimonial_company || '';
						
						testimonialData = {
							text: testimonialText || excerptText, // Используем excerpt если нет текста
							authorName: authorName,
							authorRole: authorRole,
							company: company,
							rating: rating,
							ratingClass: ratingClass,
							avatarUrl: avatarUrl || finalImageUrl, // Используем featured image если нет аватара
						};
					}
					
					// Для staff получаем дополнительные данные из метаполей
					let staffData = {};
					if (postType === 'staff') {
						const staffPosition = post._staff_position || post.meta?._staff_position || '';
						const staffCompany = post._staff_company || post.meta?._staff_company || '';
						const staffName = post._staff_name || post.meta?._staff_name || '';
						const staffSurname = post._staff_surname || post.meta?._staff_surname || '';
						
						staffData = {
							position: staffPosition,
							company: staffCompany,
							meta: {
								_staff_position: staffPosition,
								_staff_company: staffCompany,
								_staff_name: staffName,
								_staff_surname: staffSurname,
							},
						};
					}
					
					const postData = {
						id: imageId || post.id,
						url: finalImageUrl, // Всегда должен быть заполнен
						sizes: imageSizes,
						alt: imageAlt,
						title: titleText,
						caption: '',
						description: excerptText,
						linkUrl: linkUrl,
						documentFile: documentFileUrl, // URL файла документа для documents
						...testimonialData, // Добавляем данные testimonials если есть
						...staffData, // Добавляем данные staff если есть
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
	}, [postType, postsPerPage, orderBy, order, selectedTaxonomies, enableLink]);

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

	// Переинициализация Swiper при изменении настроек и загрузке постов
	useEffect(() => {
		if (typeof window === 'undefined' || !window.theme) return;
		if (isLoading || posts.length === 0) return; // Не инициализируем во время загрузки или если нет постов

		const blockElement = document.querySelector(`.cwgb-post-grid-block[data-block="${clientId}"]`);
		if (!blockElement) return;

		if (displayMode === 'swiper') {
			destroySwiper('.cwgb-post-grid-block .swiper');
		}

		const timer = setTimeout(() => {
			try {
				if (displayMode === 'swiper' && initSwiper()) {
					console.log('✅ Swiper reinitialized (post-grid)');
				}
				
				// Очистка старых span.bg перед реинициализацией overlay
				const oldBgSpans = blockElement.querySelectorAll('.overlay > a > span.bg, .overlay > span > span.bg');
				oldBgSpans.forEach(span => span.remove());
				
				// Overlay для effectType === 'overlay'
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
			if (displayMode === 'swiper') {
				destroySwiper('.cwgb-post-grid-block .swiper');
			}
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
		clientId,
		posts, // Добавляем posts для переинициализации при загрузке новых записей
		isLoading, // Добавляем isLoading для контроля состояния загрузки
		template, // Добавляем template для переинициализации при изменении шаблона
	]);

	// Инициализация overlay для шаблонов, которые используют классы overlay (overlay-5, document-card и т.д.)
	useEffect(() => {
		if (typeof window === 'undefined' || !window.theme) return;
		if (isLoading || posts.length === 0) return; // Не инициализируем во время загрузки или если нет постов

		// Шаблоны, которые используют классы overlay
		const overlayTemplates = ['overlay-5', 'document-card', 'document-card-download'];
		
		// Проверяем, используется ли один из overlay шаблонов
		if (!overlayTemplates.includes(template)) {
			return;
		}

		const timer = setTimeout(() => {
			try {
				// Очистка старых span.bg перед реинициализацией overlay
				// Ограничиваем поиск только внутри текущего блока
				const blockElement = document.querySelector(`.cwgb-post-grid-block[data-block="${clientId}"]`);
				if (blockElement) {
					const oldBgSpans = blockElement.querySelectorAll('.overlay > a > span.bg, .overlay > span > span.bg');
					oldBgSpans.forEach(span => span.remove());

					// Очистка старых ripple элементов перед реинициализацией
					const oldRipples = blockElement.querySelectorAll('.a-ripple');
					oldRipples.forEach(ripple => ripple.remove());

					// Сбрасываем флаг инициализации ripple для кнопок внутри блока
					const rippleButtons = blockElement.querySelectorAll('.has-ripple');
					rippleButtons.forEach(button => {
						// Удаляем старые обработчики событий, если они были сохранены
						if (button._rippleHandler) {
							button.removeEventListener('click', button._rippleHandler);
							button.removeEventListener('mouseenter', button._rippleHandler);
							delete button._rippleHandler;
						}
						// Сбрасываем флаг инициализации
						delete button.dataset.rippleInitialized;
					});

					// Инициализируем overlay для элементов внутри блока
					const overlayElements = blockElement.querySelectorAll('.overlay > a, .overlay > span');
					overlayElements.forEach(overlay => {
						// Проверяем, есть ли уже span.bg
						if (!overlay.querySelector('span.bg')) {
							const overlayBg = document.createElement('span');
							overlayBg.className = 'bg';
							overlay.appendChild(overlayBg);
						}
					});

					// Инициализируем ripple эффект для кнопок внутри блока
					if (typeof window.custom?.rippleEffect === 'function') {
						window.custom.rippleEffect();
					}
				} else if (typeof window.theme?.imageHoverOverlay === 'function') {
					// Fallback: если блок не найден, используем стандартную функцию
					window.theme.imageHoverOverlay();
				}
			} catch (error) {
				console.error('Overlay initialization failed (post-grid):', error);
			}
		}, 300);

		return () => {
			clearTimeout(timer);
		};
	}, [
		template,
		posts,
		isLoading,
		clientId,
		imageSize,
		borderRadius,
		postType,
	]);

	// Получаем конфигурацию Swiper из атрибутов
	let swiperConfig = getSwiperConfigFromAttributes(attributes);
	
	// Убираем классы навигации и точек для всех шаблонов, если они не используются
	if (!swiperNav) {
		swiperConfig = { ...swiperConfig, navStyle: '', navPosition: '' };
	}
	if (!swiperDots) {
		swiperConfig = { ...swiperConfig, dotsStyle: '' };
	}

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

	// Предустановленные тексты для кнопки/ссылки Load More
	const loadMoreTexts = {
		'show-more': __('Show More', 'codeweber-gutenberg-blocks'),
		'load-more': __('Load More', 'codeweber-gutenberg-blocks'),
		'show-more-items': __('Show More Items', 'codeweber-gutenberg-blocks'),
		'more-posts': __('More Posts', 'codeweber-gutenberg-blocks'),
		'view-all': __('View All', 'codeweber-gutenberg-blocks'),
		'show-all': __('Show All', 'codeweber-gutenberg-blocks'),
	};
	
	const loadMoreTextValue = loadMoreTexts[loadMoreText] || loadMoreTexts['show-more'];
	const hasMorePosts = loadMoreEnable && displayMode === 'grid' && loadMoreInitialCount > 0 && posts.length > loadMoreInitialCount;

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
								className={gridType === 'classic' ? getColClasses() : (gridType === 'columns-grid' ? 'col' : '')}
							>
								{['default', 'card', 'card-content', 'slider', 'default-clickable', 'overlay-5', 'client-simple', 'client-grid', 'client-card', 'blockquote', 'icon', 'document-card', 'document-card-download', 'circle', 'circle_center', 'circle_center_alt'].includes(template) || (postType === 'testimonials' && ['default', 'card', 'blockquote', 'icon'].includes(template)) || (postType === 'documents' && ['document-card', 'document-card-download'].includes(template)) || (postType === 'faq' && template === 'default') || (postType === 'staff' && ['default', 'card', 'circle', 'circle_center', 'circle_center_alt'].includes(template)) ? (
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
										enableLink={enableLink || false}
										postType={postType}
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
						{hasMorePosts && (() => {
							// Строим класс кнопки
							const buttonClasses = ['btn', 'cwgb-load-more-btn'];
							
							// Добавляем стиль кнопки (solid или outline)
							if (loadMoreButtonStyle === 'outline') {
								buttonClasses.push('btn-outline-primary');
							} else {
								buttonClasses.push('btn-primary');
							}
							
							// Добавляем размер кнопки
							if (loadMoreButtonSize) {
								buttonClasses.push(loadMoreButtonSize);
							}
							
							const buttonClassName = buttonClasses.join(' ');
							
							return (
								<div className="text-center pt-5 w-100">
									{loadMoreType === 'link' ? (
										<a 
											href="#" 
											className="hover cwgb-load-more-btn" 
											onClick={(e) => e.preventDefault()}
											style={{ pointerEvents: 'none', cursor: 'default' }}
										>
											{loadMoreTextValue}
										</a>
									) : (
										<button 
											className={buttonClassName}
											type="button"
										onClick={(e) => e.preventDefault()}
										disabled
										style={{ pointerEvents: 'none', cursor: 'default' }}
									>
										{loadMoreTextValue}
									</button>
									)}
							</div>
						);
						})()}
					</div>
				) : displayMode === 'swiper' ? (
					<SwiperSlider 
						config={swiperConfig} 
						className={template === 'client-simple' ? `clients ${blockClass || ''}`.trim() : (blockClass || '')}
						wrapperClassName={swiperWrapperClass || ''}
						uniqueKey={`${swiperUniqueKey}-${imageSize}-${template}`}
					>
						{posts.map((post, index) => (
							<SwiperSlide 
								key={`${post.id}-${index}-${hoverEffectsKey}-${imageSize}-${template}`}
								className={template === 'client-simple' ? 'px-5' : ''}
								slideClassName={swiperSlideClass || ''}
							>
								{['default', 'card', 'card-content', 'slider', 'default-clickable', 'overlay-5', 'client-simple', 'client-grid', 'client-card', 'blockquote', 'icon', 'document-card', 'document-card-download', 'circle', 'circle_center', 'circle_center_alt'].includes(template) || (postType === 'testimonials' && ['default', 'card', 'blockquote', 'icon'].includes(template)) || (postType === 'documents' && ['document-card', 'document-card-download'].includes(template)) || (postType === 'faq' && template === 'default') || (postType === 'staff' && ['default', 'card', 'circle', 'circle_center', 'circle_center_alt'].includes(template)) ? (
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
										enableLink={enableLink || false}
										postType={postType}
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

