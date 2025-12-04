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
		swiperNav,
		swiperDots,
		swiperMargin,
		swiperItemsXl,
		swiperItemsMd,
		swiperItemsXs,
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
		const colClasses = {
			'1': 'col-md-12',
			'2': 'col-md-6',
			'3': 'col-md-4',
			'4': 'col-md-3',
			'6': 'col-md-2',
		};
		return colClasses[gridColumns] || 'col-md-4';
	};

	// Функция для получения атрибутов Swiper
	const getSwiperAttrs = () => {
		return {
			'data-margin': swiperMargin,
			'data-nav': swiperNav,
			'data-dots': swiperDots,
			'data-items-xl': swiperItemsXl,
			'data-items-md': swiperItemsMd,
			'data-items-xs': swiperItemsXs,
		};
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

