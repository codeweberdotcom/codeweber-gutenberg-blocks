import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { ImageSimpleSidebar } from './sidebar';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';

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
		borderRadius,
		enableLightbox,
		lightboxGallery,
		blockClass,
	} = attributes;

	const blockProps = useBlockProps({
		className: `cwgb-image-simple-block ${blockClass}`,
		'data-block': clientId,
	});

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

	// Функция для получения атрибутов Swiper
	const getSwiperAttrs = () => {
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
	};

	return (
		<>
			<ImageSimpleSidebar attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				{images.length === 0 ? (
					<div className="cwgb-image-placeholder">
						<img 
							src="/wp-content/plugins/codeweber-gutenberg-blocks/placeholder.jpg" 
							alt={__('Placeholder', 'codeweber-blocks')}
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
					// Режим Swiper
					<div className="swiper-container" {...getSwiperAttrs()}>
						<div className="swiper-wrapper">
							{images.map((image, index) => (
								<div key={index} className="swiper-slide">
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
					</div>
				) : null}
			</div>
		</>
	);
}

