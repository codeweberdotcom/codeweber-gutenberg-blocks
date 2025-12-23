import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';
import { ImageSimpleRender } from '../../../components/image/ImageSimpleRender';
import { 
	SwiperSlider, 
	SwiperSlide, 
	getSwiperConfigFromAttributes,
} from '../../../components/swiper/SwiperSlider';
import { getRowColsClasses, getGapClasses } from '../../../components/grid-control';

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

export const Banner3 = ({ attributes, isEditor = false, clientId = '' }) => {
	const {
		videoUrl,
		images,
		imageSize,
		borderRadius,
		enableLightbox,
		lightboxGallery,
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		sectionClass,
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
		const classes = ['wrapper', 'angled', 'lower-start'];
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

	// Функция для получения классов контейнера Grid
	const getContainerClasses = () => {
		if (displayMode === 'grid') {
			const currentGridType = gridType || 'classic';
			
			if (currentGridType === 'columns-grid') {
				const rowColsClasses = getRowColsClasses(attributes, 'grid', gridColumns);
				const gapClasses = getGapClasses(attributes, 'grid');
				let gapClassesStr = gapClasses.join(' ');
				if (!gapClassesStr && (attributes.gridGapX || attributes.gridGapY)) {
					const oldGapClasses = [];
					if (attributes.gridGapY) oldGapClasses.push(`gy-${attributes.gridGapY}`);
					if (attributes.gridGapX) oldGapClasses.push(`gx-${attributes.gridGapX}`);
					gapClassesStr = oldGapClasses.join(' ');
				}
				return `row ${gapClassesStr} ${rowColsClasses.join(' ')}`;
			} else {
				const gapClasses = getGapClasses(attributes, 'grid');
				let gapClassesStr = gapClasses.join(' ');
				if (!gapClassesStr && (attributes.gridGapX || attributes.gridGapY)) {
					const oldGapClasses = [];
					if (attributes.gridGapY) oldGapClasses.push(`gy-${attributes.gridGapY}`);
					if (attributes.gridGapX) oldGapClasses.push(`gx-${attributes.gridGapX}`);
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

	// Получаем конфигурацию Swiper из атрибутов
	const swiperConfig = getSwiperConfigFromAttributes(attributes);

	// Генерируем уникальный ключ для hover эффектов
	const hoverEffectsKey = `${simpleEffect}-${effectType}-${tooltipStyle}-${overlayStyle}-${overlayGradient}-${overlayColor}-${cursorStyle}`;

	// Генерируем уникальный ключ для Swiper
	const swiperUniqueKey = `swiper-${swiperEffect}-${swiperSpeed}-${swiperItems}-${swiperItemsXs}-${swiperItemsMd}-${swiperItemsXl}-${swiperMargin || '30'}-${swiperLoop}-${swiperAutoplay}-${swiperNav}-${swiperDots}-${hoverEffectsKey}-${clientId}`;

	const imagesToRender = images || [];
	
	// Placeholder изображение
	const placeholderUrl = isEditor 
		? (window.location?.origin 
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about13.jpg`
			: './assets/img/photos/about13.jpg')
		: '/wp-content/themes/codeweber/dist/assets/img/photos/about13.jpg';

	// Рендерим изображение/изображения
	const renderImage = () => {
		// Если изображений нет, показываем placeholder
		if (!imagesToRender || imagesToRender.length === 0) {
			return (
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
			);
		}

		// Рендерим в зависимости от displayMode
		if (displayMode === 'single') {
			return (
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
			);
		} else if (displayMode === 'grid') {
			return (
				<div className={getContainerClasses()}>
					{imagesToRender.map((image, index) => (
						<div 
							key={`banner-image-${index}-${hoverEffectsKey}-${imageSize}`}
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
								imageRenderType={imageRenderType}
								isEditor={isEditor}
							/>
						</div>
					))}
				</div>
			);
		} else if (displayMode === 'swiper') {
			return (
				<SwiperSlider 
					config={swiperConfig} 
					className="w-100"
					{...(isEditor && { uniqueKey: `${swiperUniqueKey}-${imageSize}` })}
				>
					{imagesToRender.map((image, index) => (
						<SwiperSlide key={`banner-swiper-${index}-${hoverEffectsKey}-${imageSize}`}>
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
				<div className="container pt-7 pt-md-11 pb-8">
					<div className="row gx-0 gy-10 align-items-center">
						<div className="col-lg-6">
							<InnerBlocks allowedBlocks={ALLOWED_CODEWEBER_BLOCKS} templateLock={false} />
						</div>
						{/* /column */}
						<div className="col-lg-5 offset-lg-1 mb-n18">
							<div className="position-relative">
								{videoUrl && (
									<a 
										href={videoUrl} 
										className="btn btn-circle btn-primary btn-play ripple mx-auto mb-6 position-absolute" 
										style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3 }} 
										data-glightbox
										{...(isEditor && { onClick: (e) => e.preventDefault() })}
									>
										<i className="icn-caret-right"></i>
									</a>
								)}
								{renderImage()}
							</div>
							{/* /div */}
						</div>
						{/* /column */}
					</div>
					{/* /.row */}
				</div>
				{/* /.container */}
			</section>
		);
	}

	return (
		<section
			className={getSectionClasses()}
			style={getSectionStyles()}
			{...(backgroundType === 'image' && backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
		>
			<div className="container pt-7 pt-md-11 pb-8">
				<div className="row gx-0 gy-10 align-items-center">
					<div className="col-lg-6">
						<InnerBlocks.Content />
					</div>
					{/* /column */}
					<div className="col-lg-5 offset-lg-1 mb-n18">
						<div className="position-relative">
							{videoUrl && (
								<a 
									href={videoUrl} 
									className="btn btn-circle btn-primary btn-play ripple mx-auto mb-6 position-absolute" 
									style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3 }} 
									data-glightbox
								>
									<i className="icn-caret-right"></i>
								</a>
							)}
							{renderImage()}
						</div>
						{/* /div */}
					</div>
					{/* /column */}
				</div>
				{/* /.row */}
			</div>
			{/* /.container */}
		</section>
	);
};

