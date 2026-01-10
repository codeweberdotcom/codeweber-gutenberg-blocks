import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';
import { ImageSimpleRender } from '../../../components/image/ImageSimpleRender';
import {
	SwiperSlider,
	SwiperSlide,
	getSwiperConfigFromAttributes,
} from '../../../components/swiper/SwiperSlider';
import {
	getRowColsClasses,
	getGapClasses,
} from '../../../components/grid-control';

// Все блоки Codeweber Gutenberg Blocks (исключая сам banners, чтобы избежать рекурсии)
const ALLOWED_CODEWEBER_BLOCKS = [
	'codeweber-blocks/accordion',
	'codeweber-blocks/avatar',
	'codeweber-blocks/banner',
	'codeweber-blocks/button',
	'codeweber-blocks/section',
	'codeweber-blocks/column',
	'codeweber-blocks/columns',
	'codeweber-gutenberg-blocks/heading-subtitle',
	'codeweber-blocks/icon',
	'codeweber-blocks/lists',
	'codeweber-blocks/media',
	'codeweber-blocks/paragraph',
	'codeweber-blocks/card',
	'codeweber-blocks/feature',
	'codeweber-blocks/image-simple',
	'codeweber-blocks/post-grid',
	'codeweber-blocks/tabs',
	'codeweber-blocks/label-plus',
	'codeweber-blocks/form',
	'codeweber-blocks/form-field',
	'codeweber-blocks/submit-button',
	'codeweber-blocks/divider',
];

export const Banner14 = ({ attributes, isEditor = false, clientId = '' }) => {
	const {
		images,
		imageSize,
		borderRadius,
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		sectionClass,
		enableLightbox,
		lightboxGallery,
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
		displayMode = 'single',
		gridType,
		gridColumns,
		swiperEffect,
		swiperSpeed,
		swiperItems,
		swiperItemsXs,
		swiperItemsMd,
		swiperItemsXl,
		swiperMargin,
		swiperLoop,
		swiperAutoplay,
		swiperNav,
		swiperDots,
		imageRenderType = 'img',
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper'];
		classes.push(...generateBackgroundClasses(attributes));
		if (sectionClass) {
			classes.push(sectionClass);
		}
		return classes.filter(Boolean).join(' ');
	};

	// Функция для получения стилей секции
	const getSectionStyles = () => {
		const styles = {};
		if (backgroundType === 'image' && backgroundImageUrl) {
			styles.backgroundImage = `url(${backgroundImageUrl})`;
			styles.backgroundRepeat = 'no-repeat';
			if (backgroundSize === 'bg-cover') {
				styles.backgroundSize = 'cover';
			} else if (backgroundSize === 'bg-full') {
				styles.backgroundSize = '100% 100%';
			} else {
				styles.backgroundSize = 'auto';
			}
			styles.backgroundPosition = 'center';
		}
		return Object.keys(styles).length > 0 ? styles : undefined;
	};

	const imagesToRender = images || [];
	const hasImage = imagesToRender && imagesToRender.length > 0;

	// Placeholder изображение
	const placeholderUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about18.jpg`
			: './assets/img/photos/about18.jpg'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/about18.jpg';

	// Получаем конфигурацию Swiper из атрибутов
	const swiperConfig = getSwiperConfigFromAttributes(attributes);

	// Генерируем уникальный ключ для hover эффектов
	const hoverEffectsKey = `${simpleEffect}-${effectType}-${tooltipStyle}-${overlayStyle}-${overlayGradient}-${overlayColor}-${cursorStyle}`;

	// Генерируем уникальный ключ для Swiper
	const swiperUniqueKey = `swiper-${swiperEffect}-${swiperSpeed}-${swiperItems}-${swiperItemsXs}-${swiperItemsMd}-${swiperItemsXl}-${swiperMargin || '30'}-${swiperLoop}-${swiperAutoplay}-${swiperNav}-${swiperDots}-${hoverEffectsKey}-${clientId}`;

	// Функция для получения классов контейнера Grid
	const getContainerClasses = () => {
		if (displayMode === 'grid') {
			const currentGridType = gridType || 'classic';

			if (currentGridType === 'columns-grid') {
				const rowColsClasses = getRowColsClasses(
					attributes,
					'grid',
					gridColumns
				);
				const gapClasses = getGapClasses(attributes, 'grid');
				let gapClassesStr = gapClasses.join(' ');
				if (
					!gapClassesStr &&
					(attributes.gridGapX || attributes.gridGapY)
				) {
					const oldGapClasses = [];
					if (attributes.gridGapY)
						oldGapClasses.push(`gy-${attributes.gridGapY}`);
					if (attributes.gridGapX)
						oldGapClasses.push(`gx-${attributes.gridGapX}`);
					gapClassesStr = oldGapClasses.join(' ');
				}
				return `row ${gapClassesStr} ${rowColsClasses.join(' ')}`;
			} else {
				const gapClasses = getGapClasses(attributes, 'grid');
				let gapClassesStr = gapClasses.join(' ');
				if (
					!gapClassesStr &&
					(attributes.gridGapX || attributes.gridGapY)
				) {
					const oldGapClasses = [];
					if (attributes.gridGapY)
						oldGapClasses.push(`gy-${attributes.gridGapY}`);
					if (attributes.gridGapX)
						oldGapClasses.push(`gx-${attributes.gridGapX}`);
					gapClassesStr = oldGapClasses.join(' ');
				}
				return `row ${gapClassesStr}`.trim();
			}
		}
		return '';
	};

	// Функция для генерации классов col-* из gridColumns* атрибутов (для Classic Grid)
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

		if (colsDefault) {
			colClasses.push(`col-${colsDefault}`);
		}
		if (colsXs) {
			colClasses.push(`col-${colsXs}`);
		}
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

	// Рендерим изображение/изображения
	const renderImage = () => {
		// Если изображений нет, показываем placeholder
		if (!hasImage) {
			return (
				<div className="mb-md-n20">
					<ImageSimpleRender
						image={{
							url: placeholderUrl,
							alt: '',
						}}
						imageSize={imageSize}
						borderRadius={borderRadius || 'rounded'}
						enableLightbox={false}
						imageRenderType={imageRenderType}
						isEditor={isEditor}
					/>
				</div>
			);
		}

		// Рендерим в зависимости от displayMode
		if (displayMode === 'single') {
			return (
				<div className="mb-md-n20">
					<ImageSimpleRender
						image={imagesToRender[0]}
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
						imageRenderType={imageRenderType}
						isEditor={isEditor}
					/>
				</div>
			);
		} else if (displayMode === 'grid') {
			return (
				<div className={`${getContainerClasses()} mb-md-n20`}>
					{imagesToRender.map((image, index) => (
						<div
							key={`banner-image-${index}-${hoverEffectsKey}-${imageSize}`}
							className={
								gridType === 'classic' ? getColClasses() : ''
							}
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
								imageRenderType={imageRenderType}
								isEditor={isEditor}
							/>
						</div>
					))}
				</div>
			);
		} else if (displayMode === 'swiper') {
			const swiperContainerClassName = `w-100 mb-md-n20 ${imageRenderType === 'background' ? 'h-100' : ''}`;
			const swiperClassName =
				imageRenderType === 'background' ? 'h-100' : '';

			return (
				<SwiperSlider
					config={swiperConfig}
					className={swiperContainerClassName}
					swiperClassName={swiperClassName}
					{...(isEditor && {
						uniqueKey: `${swiperUniqueKey}-${imageSize}`,
					})}
				>
					{imagesToRender.map((image, index) => (
						<SwiperSlide
							key={`banner-swiper-${index}-${hoverEffectsKey}-${imageSize}`}
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
								imageRenderType={imageRenderType}
								isEditor={isEditor}
							/>
						</SwiperSlide>
					))}
				</SwiperSlider>
			);
		}

		return null;
	};

	if (isEditor) {
		return (
			<section className={getSectionClasses()} style={getSectionStyles()}>
				<div className="container pt-10 pt-md-14 pb-14 pb-md-0">
					<div className="row gx-md-8 gx-lg-12 gy-3 gy-lg-0 mb-13">
						<div className="col-lg-6">
							<InnerBlocks
								allowedBlocks={ALLOWED_CODEWEBER_BLOCKS}
								templateLock={false}
							/>
						</div>
						{/* /column */}
					</div>
					{/* /.row */}
					<div className="position-relative">
						<div
							className="shape bg-dot primary rellax w-17 h-21"
							data-rellax-speed="1"
							style={{ top: '-2.5rem', right: '-2.7rem' }}
						></div>
						{renderImage()}
					</div>
				</div>
				{/* /.container */}
			</section>
		);
	}

	return (
		<section
			className={getSectionClasses()}
			style={getSectionStyles()}
			{...(backgroundType === 'image' &&
				backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
		>
			<div className="container pt-10 pt-md-14 pb-14 pb-md-0">
				<div className="row gx-md-8 gx-lg-12 gy-3 gy-lg-0 mb-13">
					<div className="col-lg-6">
						<InnerBlocks.Content />
					</div>
					{/* /column */}
				</div>
				{/* /.row */}
				<div className="position-relative">
					<div
						className="shape bg-dot primary rellax w-17 h-21"
						data-rellax-speed="1"
						style={{ top: '-2.5rem', right: '-2.7rem' }}
					></div>
					{renderImage()}
				</div>
			</div>
			{/* /.container */}
		</section>
	);
};
