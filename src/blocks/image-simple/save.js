import { useBlockProps } from '@wordpress/block-editor';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';
import { 
	SwiperSlider, 
	SwiperSlide, 
	getSwiperConfigFromAttributes 
} from '../../components/swiper/SwiperSlider';

export default function Save({ attributes }) {
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
				// Режим Swiper - используем компонент SwiperSlider
				<SwiperSlider config={swiperConfig}>
					{images.map((image, index) => (
						<SwiperSlide key={index}>
							<ImageSimpleRender
								image={image}
								borderRadius={borderRadius}
								enableLightbox={enableLightbox}
								lightboxGallery={lightboxGallery}
								isEditor={false}
							/>
						</SwiperSlide>
					))}
				</SwiperSlider>
			) : null}
		</div>
	);
}

