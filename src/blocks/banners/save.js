import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../utilities/class-generators';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';
import { 
	SwiperSlider, 
	SwiperSlide, 
	getSwiperConfigFromAttributes,
} from '../../components/swiper/SwiperSlider';
import { getRowColsClasses, getGapClasses } from '../../components/grid-control';

const BannersSave = ({ attributes }) => {
	const {
		bannerType,
		imageType,
		imageUrl,
		imageId,
		imageAlt,
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
		backgroundImageUrl,
		backgroundType,
		backgroundSize,
		sectionClass,
		videoUrl,
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

	const getSectionClasses = () => {
		const classes = ['wrapper'];
		classes.push(...generateBackgroundClasses(attributes));
		if (sectionClass) {
			classes.push(sectionClass);
		}
		return classes.filter(Boolean).join(' ');
	};

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

	// Banner 34 - based on provided HTML
	const renderBanner34 = () => {
		const renderLeftColumn = () => {
			const wrapperClasses = "col-lg-6 position-lg-absolute top-0 start-0 h-100 d-flex align-items-center justify-content-center";
			
			// Используем массив images для обоих режимов
			const imagesToRender = images || [];

			if ((imageType === 'image-simple' || imageType === 'background') && imagesToRender && imagesToRender.length > 0) {
				// Для режима background всегда используем imageRenderType='background'
				const renderType = imageType === 'background' ? 'background' : imageRenderType;
				
				// Рендерим в зависимости от displayMode
				if (displayMode === 'single') {
					return (
						<div className={wrapperClasses}>
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
								imageRenderType={renderType}
								isEditor={false}
							/>
						</div>
					);
				} else if (displayMode === 'grid') {
					return (
						<div className={wrapperClasses}>
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
											imageRenderType={renderType}
											isEditor={false}
										/>
									</div>
								))}
							</div>
						</div>
					);
				} else if (displayMode === 'swiper') {
					const swiperClassName = (imageType === 'background' || imageType === 'image-simple') ? 'h-100' : '';
					const swiperContainerClassName = (imageType === 'background' || imageType === 'image-simple') ? 'h-100 w-100' : 'w-100';

					return (
						<div className={wrapperClasses}>
							<SwiperSlider 
								config={swiperConfig} 
								className={swiperContainerClassName}
								swiperClassName={swiperClassName}
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
											imageRenderType={renderType}
											isEditor={false}
										/>
									</SwiperSlide>
								))}
							</SwiperSlider>
						</div>
					);
				}
			}
			
			return null;
		};

		return (
		<section
			className={`${getSectionClasses()} bg-gray position-relative min-vh-60 d-lg-flex align-items-center`}
			style={getSectionStyles()}
			{...(backgroundType === 'image' && backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
		>
			{renderLeftColumn()}
			<div className="container position-relative">
				{videoUrl && (
					<a href={videoUrl} className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-none d-lg-flex" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3 }} data-glightbox data-gallery="desktop-video">
						<i className="icn-caret-right"></i>
					</a>
				)}
				<div className="row gx-0">
					<div className="col-lg-6 offset-lg-6">
						<div className="py-12 py-lg-16 ps-lg-12 py-xxl-18 ps-xxl-16 pe-lg-0 position-relative">
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		</section>
		);
	};

	const renderBanner = () => {
		switch (bannerType) {
			case 'banner-34':
				return renderBanner34();
			default:
				return renderBanner34();
		}
	};

	return renderBanner();
};

export default BannersSave;

