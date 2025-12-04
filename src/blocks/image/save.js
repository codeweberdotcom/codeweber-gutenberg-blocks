import { useBlockProps } from '@wordpress/block-editor';
import { ImageRenderSave } from '../../components/image/ImageRender';

export default function save({ attributes }) {
	const {
		displayMode,
		images,
		gridColumns,
		gridGapX,
		gridGapY,
		swiperNav,
		swiperDots,
		swiperMargin,
		swiperItemsXl,
		swiperItemsMd,
		swiperItemsXs,
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
			};
			return colMap[gridColumns] || 'col-md-4';
		}
		return '';
	};

	// Функция для получения data-атрибутов swiper
	const getSwiperDataAttributes = () => {
		if (displayMode === 'swiper') {
			return {
				'data-margin': swiperMargin,
				'data-nav': swiperNav ? 'true' : 'false',
				'data-dots': swiperDots ? 'true' : 'false',
				'data-items-xl': swiperItemsXl,
				'data-items-md': swiperItemsMd,
				'data-items-xs': swiperItemsXs,
			};
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

