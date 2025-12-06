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
		gridType,
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
			const currentGridType = gridType || 'classic';
			
			if (currentGridType === 'columns-grid') {
				// Columns Grid: используем row-cols и новые gap атрибуты
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
			} else {
				// Classic Grid: только row и gap классы, БЕЗ row-cols-*
				// Управление колонками происходит через col-* классы в самих элементах
				// Используем getGapClasses для новых gap атрибутов, с fallback на старые
				const gapClasses = getGapClasses(attributes, 'grid');
				let gapClassesStr = gapClasses.join(' ');
				
				// Fallback на старые атрибуты gridGapX и gridGapY для обратной совместимости
				if (!gapClassesStr && (gridGapX || gridGapY)) {
					const oldGapClasses = [];
					if (gridGapY) oldGapClasses.push(`gy-${gridGapY}`);
					if (gridGapX) oldGapClasses.push(`gx-${gridGapX}`);
					gapClassesStr = oldGapClasses.join(' ');
				}
				
				// Classic Grid: только row + gap, без row-cols-*
				return `row ${gapClassesStr}`.trim();
			}
		}
		return '';
	};

	// Функция для генерации классов col-* из gridColumns* атрибутов (для Classic Grid)
	// В классической сетке Bootstrap значение напрямую используется как ширина колонки (1-12)
	const getColClasses = () => {
		if (displayMode !== 'grid' || gridType !== 'classic') {
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
		
		// Base (default) - без префикса
		if (colsDefault) {
			colClasses.push(`col-${colsDefault}`);
		}
		
		// XS - без префикса (как и default)
		if (colsXs) {
			colClasses.push(`col-${colsXs}`);
		}
		
		// SM и выше - с префиксами
		if (colsSm) {
			colClasses.push(`col-sm-${colsSm}`);
		}
		if (colsMd) {
			colClasses.push(`col-md-${colsMd}`);
		}
		if (colsLg) {
			colClasses.push(`col-lg-${colsLg}`);
		}
		if (colsXl) {
			colClasses.push(`col-xl-${colsXl}`);
		}
		if (colsXxl) {
			colClasses.push(`col-xxl-${colsXxl}`);
		}
		
		return colClasses.join(' ');
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
						<div 
							key={index}
							className={gridType === 'classic' ? getColClasses() : ''}
						>
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

