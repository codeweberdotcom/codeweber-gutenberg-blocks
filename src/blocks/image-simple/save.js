import { useBlockProps } from '@wordpress/block-editor';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';

export default function Save({ attributes }) {
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
		blockId,
		blockData,
	} = attributes;

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
					borderRadius={borderRadius}
					enableLightbox={enableLightbox}
					lightboxGallery={lightboxGallery}
					isEditor={false}
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
								isEditor={false}
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
									isEditor={false}
								/>
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}

