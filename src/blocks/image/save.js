import { useBlockProps } from '@wordpress/block-editor';
import { ImageRenderSave } from '../../components/image/ImageRender';

export default function save({ attributes }) {
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
		hoverEffect,
		enableEffect,
		effectType,
		overlayType,
		overlayGradient,
		overlayColor,
		tooltipType,
		cursor,
		iconName,
		iconColor,
		captionType,
		captionBg,
		captionPosition,
		captionPadding,
		captionFontSize,
		borderRadius,
		enableLightbox,
		lightboxGallery,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	// Функция для получения классов контейнера
	const getContainerClasses = () => {
		if (displayMode === 'grid') {
			return `row gy-${gridGapY} gx-${gridGapX}`;
		}
		return '';
	};

	// Функция для получения классов колонки
	const getColumnClasses = () => {
		if (displayMode === 'grid') {
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
		}
		return '';
	};

	// Функция для получения data-атрибутов swiper  
	const getSwiperDataAttributes = () => {
		if (displayMode === 'swiper') {
			const attrs = {};
			
			// Transition
			if (swiperEffect) attrs['data-effect'] = swiperEffect;
			if (swiperSpeed) attrs['data-speed'] = swiperSpeed;
			
			// Items per view
			if (swiperItems) attrs['data-items'] = swiperItems;
			if (swiperItemsXs) attrs['data-items-xs'] = swiperItemsXs;
			if (swiperItemsSm) attrs['data-items-sm'] = swiperItemsSm;
			if (swiperItemsMd) attrs['data-items-md'] = swiperItemsMd;
			if (swiperItemsLg) attrs['data-items-lg'] = swiperItemsLg;
			if (swiperItemsXl) attrs['data-items-xl'] = swiperItemsXl;
			if (swiperItemsXxl) attrs['data-items-xxl'] = swiperItemsXxl;
			
			// Spacing & Behavior
			if (swiperMargin) attrs['data-margin'] = swiperMargin;
			if (swiperLoop) attrs['data-loop'] = swiperLoop;
			if (swiperAutoHeight) attrs['data-autoheight'] = swiperAutoHeight;
			if (swiperWatchOverflow) attrs['data-watchoverflow'] = swiperWatchOverflow;
			if (swiperUpdateResize !== undefined) attrs['data-updateresize'] = swiperUpdateResize;
			
			// Autoplay
			if (swiperAutoplay) {
				attrs['data-autoplay'] = swiperAutoplay;
				if (swiperAutoplayTime) attrs['data-autoplaytime'] = swiperAutoplayTime;
				if (swiperReverse) attrs['data-reverse'] = swiperReverse;
			}
			
			// Navigation
			if (swiperNav !== undefined) attrs['data-nav'] = swiperNav;
			if (swiperDots !== undefined) attrs['data-dots'] = swiperDots;
			if (swiperDrag !== undefined) attrs['data-drag'] = swiperDrag;
			
			return attrs;
		}
		return {};
	};

	// Функция для парсинга data-атрибутов блока
	const getBlockDataAttributes = () => {
		if (!blockData) return {};
		
		const dataAttrs = {};
		const pairs = blockData.split(',').map(pair => pair.trim());
		
		pairs.forEach(pair => {
			const [key, value] = pair.split(':').map(s => s.trim());
			if (key && value) {
				dataAttrs[`data-${key}`] = value;
			}
		});
		
		return dataAttrs;
	};

	const blockProps = useBlockProps.save({
		className: blockClass || undefined,
		id: blockId || undefined,
		...getBlockDataAttributes(),
	});

	// Если нет изображений, не выводим ничего
	if (!images || images.length === 0) {
		return null;
	}

	// Рендер изображений
	const renderImages = () => {
		if (displayMode === 'single') {
			// Single image
			return (
				<ImageRenderSave
					image={images[0]}
					hoverEffect={hoverEffect}
					enableEffect={enableEffect}
					effectType={effectType}
					overlayType={overlayType}
					overlayGradient={overlayGradient}
					overlayColor={overlayColor}
					tooltipType={tooltipType}
					cursor={cursor}
					iconName={iconName}
					iconColor={iconColor}
					captionType={captionType}
					captionBg={captionBg}
					captionPosition={captionPosition}
					captionPadding={captionPadding}
					captionFontSize={captionFontSize}
					borderRadius={borderRadius}
					enableLightbox={enableLightbox}
					lightboxGallery={lightboxGallery}
				/>
			);
		}

		if (displayMode === 'grid') {
			// Grid gallery
			return (
				<div className={getContainerClasses()}>
					{images.map((image, index) => (
						<div key={index} className={getColumnClasses()}>
							<ImageRenderSave
								image={image}
								hoverEffect={hoverEffect}
								enableEffect={enableEffect}
								effectType={effectType}
								overlayType={overlayType}
								overlayGradient={overlayGradient}
								overlayColor={overlayColor}
								tooltipType={tooltipType}
								cursor={cursor}
								iconName={iconName}
								iconColor={iconColor}
								captionType={captionType}
								captionBg={captionBg}
								captionPosition={captionPosition}
								captionPadding={captionPadding}
								captionFontSize={captionFontSize}
								borderRadius={borderRadius}
								enableLightbox={enableLightbox}
								lightboxGallery={lightboxGallery}
							/>
						</div>
					))}
				</div>
			);
		}

		if (displayMode === 'swiper') {
			// Swiper carousel
			return (
				<div className="swiper-container" {...getSwiperDataAttributes()}>
					<div className="swiper">
						<div className="swiper-wrapper">
							{images.map((image, index) => (
								<div key={index} className="swiper-slide">
									<ImageRenderSave
										image={image}
										hoverEffect={hoverEffect}
										enableEffect={enableEffect}
										effectType={effectType}
										overlayType={overlayType}
										overlayGradient={overlayGradient}
										overlayColor={overlayColor}
										tooltipType={tooltipType}
										cursor={cursor}
										iconName={iconName}
										iconColor={iconColor}
										captionType={captionType}
										captionBg={captionBg}
										captionPosition={captionPosition}
										captionPadding={captionPadding}
										captionFontSize={captionFontSize}
										borderRadius={borderRadius}
										enableLightbox={enableLightbox}
										lightboxGallery={lightboxGallery}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			);
		}

		return null;
	};

	return <div {...blockProps}>{renderImages()}</div>;
}

