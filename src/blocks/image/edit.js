import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { ImageSidebar } from './sidebar';
import { ImageRender } from '../../components/image/ImageRender';

export default function Edit({ attributes, setAttributes }) {
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
		overlayType,
		overlayGradient,
		overlayColor,
		tooltipType,
		cursor,
		captionType,
		captionBg,
		captionPosition,
		borderRadius,
		enableLightbox,
		lightboxGallery,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	const blockProps = useBlockProps({
		className: `cwgb-image-block ${blockClass}`,
	});

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

	// Рендер изображений
	const renderImages = () => {
		if (!images || images.length === 0) {
			return (
				<div className="cwgb-image-placeholder">
					<p>{__('No images selected. Use sidebar to add images.', 'codeweber-blocks')}</p>
				</div>
			);
		}

		if (displayMode === 'single') {
			// Single image
			return (
				<ImageRender
					image={images[0]}
					hoverEffect={hoverEffect}
					overlayType={overlayType}
					overlayGradient={overlayGradient}
					overlayColor={overlayColor}
					tooltipType={tooltipType}
					cursor={cursor}
					captionType={captionType}
					captionBg={captionBg}
					captionPosition={captionPosition}
					borderRadius={borderRadius}
					enableLightbox={enableLightbox}
					lightboxGallery={lightboxGallery}
					isEditor={true}
				/>
			);
		}

		if (displayMode === 'grid') {
			// Grid gallery
			return (
				<div className={getContainerClasses()}>
					{images.map((image, index) => (
						<div key={index} className={getColumnClasses()}>
							<ImageRender
								image={image}
								hoverEffect={hoverEffect}
								overlayType={overlayType}
								overlayGradient={overlayGradient}
								overlayColor={overlayColor}
								tooltipType={tooltipType}
								cursor={cursor}
								captionType={captionType}
								captionBg={captionBg}
								captionPosition={captionPosition}
								borderRadius={borderRadius}
								enableLightbox={enableLightbox}
								lightboxGallery={lightboxGallery}
								isEditor={true}
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
									<ImageRender
										image={image}
										hoverEffect={hoverEffect}
										overlayType={overlayType}
										overlayGradient={overlayGradient}
										overlayColor={overlayColor}
										tooltipType={tooltipType}
										cursor={cursor}
										captionType={captionType}
										captionBg={captionBg}
										captionPosition={captionPosition}
										borderRadius={borderRadius}
										enableLightbox={enableLightbox}
										lightboxGallery={lightboxGallery}
										isEditor={true}
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

	return (
		<>
			<InspectorControls>
				<ImageSidebar attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>
			<div {...blockProps}>{renderImages()}</div>
		</>
	);
}

