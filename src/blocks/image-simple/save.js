import { useBlockProps } from '@wordpress/block-editor';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';
import { 
	SwiperSlider, 
	SwiperSlide, 
	getSwiperConfigFromAttributes 
} from '../../components/swiper/SwiperSlider';
import { getRowColsClasses, getGapClasses } from '../../components/grid-control';

export default function Save({ attributes }) {
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
		blockId,
		blockData,
	} = attributes;

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

	// Parse data attributes
	const getDataAttributes = () => {
		const dataAttrs = {};
		if (blockData) {
			blockData.split(',').forEach((pair) => {
				const [key, value] = pair.split('=').map((s) => s.trim());
				if (key && value) {
					dataAttrs[`data-${key}`] = value;
				}
			});
		}
		return dataAttrs;
	};

	const blockProps = useBlockProps.save({
		className: `cwgb-image-simple-block ${blockClass}`,
		...(blockId && { id: blockId }),
		...getDataAttributes(),
	});

	if (images.length === 0) {
		return null;
	}

	return (
		<div {...blockProps}>
			{displayMode === 'single' ? (
				// Режим Single
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
					isEditor={false}
				/>
			) : displayMode === 'grid' ? (
				// Режим Grid
				<div className={getContainerClasses()}>
					{images.map((image, index) => (
						<div key={index}>
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
								isEditor={false}
							/>
						</div>
					))}
				</div>
			) : displayMode === 'swiper' ? (
				// Режим Swiper - используем компонент SwiperSlider
				<SwiperSlider config={swiperConfig}>
					{images.map((image, index) => (
						<SwiperSlide key={index}>
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
								isEditor={false}
							/>
						</SwiperSlide>
					))}
				</SwiperSlider>
			) : null}
		</div>
	);
}

