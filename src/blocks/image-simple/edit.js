import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { ImageSimpleSidebar } from './sidebar';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';
import { 
	SwiperSlider, 
	SwiperSlide, 
	getSwiperConfigFromAttributes,
	initSwiper,
	destroySwiper 
} from '../../components/swiper/SwiperSlider';
import { initLightbox } from '../../utilities/lightbox';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		displayMode,
		images,
		gridColumns,
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
		blockClass,
	} = attributes;

	const blockProps = useBlockProps({
		className: `cwgb-image-simple-block ${blockClass}`,
		'data-block': clientId,
	});

	// Переинициализация Swiper при изменении настроек
	useEffect(() => {
		if (typeof window === 'undefined' || !window.theme) return;

		// Cleanup: уничтожаем все экземпляры Swiper перед реинициализацией
		// Cleanup: используем утилиту для очистки Swiper
		destroySwiper('.cwgb-image-simple-block .swiper');

		const timer = setTimeout(() => {
			try {
				// Swiper Slider - используем утилиту
				if (displayMode === 'swiper' && initSwiper()) {
					console.log('✅ Swiper reinitialized (image-simple)');
				}
				
				// Lightbox (GLightbox) - используем утилиту
				if (enableLightbox && initLightbox()) {
					console.log('✅ GLightbox reinitialized (image-simple)');
				}
			} catch (error) {
				console.warn('⚠️ Theme initialization failed (image-simple):', error);
			}
		}, 300);

		return () => {
			clearTimeout(timer);
			destroySwiper('.cwgb-image-simple-block .swiper');
		};
	}, [
		displayMode,
		enableLightbox,
		// Все Swiper параметры для полной реинициализации
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

	// Функция для получения классов контейнера
	const getContainerClasses = () => {
		if (displayMode === 'grid') {
			return `row gy-${gridGapY} gx-${gridGapX}`;
		}
		return '';
	};

	// Функция для получения классов колонок в grid
	const getColumnClasses = () => {
		const colMap = {
			'2': 'col-md-6',
			'3': 'col-md-4',
			'4': 'col-md-3',
			'5': 'col-md-2',
			'6': 'col-md-2',
			'7': 'col-md-1',
			'8': 'col-md-1',
			'9': 'col-md-1',
			'10': 'col-md-1',
			'11': 'col-md-1',
			'12': 'col-md-1',
		};
		return colMap[gridColumns] || 'col-md-4';
	};

	// Получаем конфигурацию Swiper из атрибутов (используем утилиту)
	const swiperConfig = getSwiperConfigFromAttributes(attributes);

	return (
		<>
			<ImageSimpleSidebar attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				{images.length === 0 ? (
					<div className="cwgb-image-placeholder">
						<img 
							src="/wp-content/plugins/codeweber-gutenberg-blocks/placeholder.jpg" 
							alt={__('Placeholder', 'codeweber-gutenberg-blocks')}
							className="placeholder-image"
						/>
					</div>
				) : displayMode === 'single' ? (
					// Режим Single
					<ImageSimpleRender
						image={images[0]}
						borderRadius={borderRadius}
						enableLightbox={enableLightbox}
						lightboxGallery={lightboxGallery}
						isEditor={true}
					/>
				) : displayMode === 'grid' ? (
					// Режим Grid
					<div className={getContainerClasses()}>
						{images.map((image, index) => (
							<div key={index} className={getColumnClasses()}>
								<ImageSimpleRender
									image={image}
									borderRadius={borderRadius}
									enableLightbox={enableLightbox}
									lightboxGallery={lightboxGallery}
									isEditor={true}
								/>
							</div>
						))}
					</div>
				) : displayMode === 'swiper' ? (
					// Режим Swiper - используем компонент SwiperSlider
					<SwiperSlider 
						config={swiperConfig} 
						uniqueKey={`swiper-${swiperEffect}-${clientId}`}
					>
						{images.map((image, index) => (
							<SwiperSlide key={index}>
								<ImageSimpleRender
									image={image}
									borderRadius={borderRadius}
									enableLightbox={enableLightbox}
									lightboxGallery={lightboxGallery}
									isEditor={true}
								/>
							</SwiperSlide>
						))}
					</SwiperSlider>
				) : null}
			</div>
		</>
	);
}

