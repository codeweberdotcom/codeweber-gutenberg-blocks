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
import { getRowColsClasses, getGapClasses } from '../../components/grid-control';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		displayMode,
		images,
		imageSize,
		gridColumns,
		gridRowCols,
		gridRowColsSm,
		gridRowColsMd,
		gridRowColsLg,
		gridRowColsXl,
		gridRowColsXxl,
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
		// Image Hover атрибуты
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
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
				// Очистка старых span.bg перед реинициализацией overlay
				const oldBgSpans = document.querySelectorAll('.cwgb-image-simple-block .overlay > a > span.bg, .cwgb-image-simple-block .overlay > span > span.bg');
				oldBgSpans.forEach(span => span.remove());
				
				// Swiper Slider - используем утилиту
				if (displayMode === 'swiper' && initSwiper()) {
					console.log('✅ Swiper reinitialized (image-simple)');
				}
				
				// Overlay (imageHoverOverlay) - добавляет <span class="bg"></span>
				if (effectType === 'overlay' && typeof window.theme?.imageHoverOverlay === 'function') {
					window.theme.imageHoverOverlay();
					console.log('✅ Overlay reinitialized (image-simple)');
				}
				
				// Tooltip (iTooltip)
				if (effectType === 'tooltip' && typeof window.theme?.iTooltip === 'function') {
					window.theme.iTooltip();
					console.log('✅ iTooltip reinitialized (image-simple)');
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
		imageSize, // Размер изображений - для переинициализации при смене
		// Все Hover эффекты для полной реинициализации
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
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
			// Используем row-cols для адаптивности
			const rowColsClasses = getRowColsClasses(attributes, 'grid', gridColumns);
			const gapClasses = getGapClasses(attributes, 'grid');
			
			// Fallback на старые атрибуты gridGapX и gridGapY для обратной совместимости
			let gapClassesStr = gapClasses.join(' ');
			if (!gapClassesStr && (gridGapX || gridGapY)) {
				// Используем старые атрибуты
				const oldGapClasses = [];
				if (gridGapY) oldGapClasses.push(`gy-${gridGapY}`);
				if (gridGapX) oldGapClasses.push(`gx-${gridGapX}`);
				gapClassesStr = oldGapClasses.join(' ');
			}
			
			return `row ${gapClassesStr} ${rowColsClasses.join(' ')}`;
		}
		return '';
	};

	// Получаем конфигурацию Swiper из атрибутов (используем утилиту)
	const swiperConfig = getSwiperConfigFromAttributes(attributes);

	// Генерируем уникальный ключ для hover эффектов (для двойной переинициализации)
	const hoverEffectsKey = `${simpleEffect}-${effectType}-${tooltipStyle}-${overlayStyle}-${overlayGradient}-${overlayColor}-${cursorStyle}`;

	// Генерируем уникальный ключ для полной переинициализации при изменении любых параметров
	const swiperUniqueKey = `swiper-${swiperEffect}-${swiperSpeed}-${swiperItems}-${swiperItemsXs}-${swiperItemsMd}-${swiperItemsXl}-${swiperMargin}-${swiperLoop}-${swiperAutoplay}-${swiperNav}-${swiperDots}-${hoverEffectsKey}-${clientId}`;

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
					// Режим Single - добавляем key с hover эффектами и imageSize для полной переинициализации
					<div key={`single-${hoverEffectsKey}-${imageSize}`}>
						<ImageSimpleRender
							image={images[0]}
							imageSize={imageSize}
							borderRadius={borderRadius}
							enableLightbox={enableLightbox}
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
					</div>
				) : displayMode === 'grid' ? (
					// Режим Grid - добавляем key с hover эффектами и imageSize для полной переинициализации
					<div className={getContainerClasses()} key={`grid-${hoverEffectsKey}-${imageSize}`}>
						{images.map((image, index) => (
							<div key={`${index}-${hoverEffectsKey}-${imageSize}`}>
								<ImageSimpleRender
									image={image}
									imageSize={imageSize}
									borderRadius={borderRadius}
									enableLightbox={enableLightbox}
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
							</div>
						))}
					</div>
				) : displayMode === 'swiper' ? (
					// Режим Swiper - используем компонент SwiperSlider
					<SwiperSlider 
						config={swiperConfig} 
						uniqueKey={`${swiperUniqueKey}-${imageSize}`}
					>
						{images.map((image, index) => (
							<SwiperSlide key={`${index}-${hoverEffectsKey}-${imageSize}`}>
								<ImageSimpleRender
									image={image}
									imageSize={imageSize}
									borderRadius={borderRadius}
									enableLightbox={enableLightbox}
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
							</SwiperSlide>
						))}
					</SwiperSlider>
				) : null}
			</div>
		</>
	);
}

