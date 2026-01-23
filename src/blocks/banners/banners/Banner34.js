import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';
import { ImageSimpleRender } from '../../../components/image/ImageSimpleRender';
import { getImageUrl } from '../../../utilities/image-url';
import {
	SwiperSlider,
	SwiperSlide,
	getSwiperConfigFromAttributes,
} from '../../../components/swiper/SwiperSlider';
import {
	getRowColsClasses,
	getGapClasses,
} from '../../../components/grid-control';

// Функция для преобразования абсолютного URL в относительный путь
const getRelativeUrl = (url) => {
	if (!url) return '';
	try {
		const urlObj = new URL(url);
		return urlObj.pathname + urlObj.search + urlObj.hash;
	} catch (e) {
		// Если это уже относительный путь, возвращаем как есть
		if (url.startsWith('/') || url.startsWith('./')) {
			return url;
		}
		// Если не удалось распарсить, возвращаем исходный URL
		return url;
	}
};

export const Banner34 = ({ attributes, isEditor = false, clientId = '' }) => {
	const {
		imageType,
		imagePosition = 'left',
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
		videoUrl,
		modalVideoUrl,
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
		imageColumnClass,
		contentColumnRightWrapperClass,
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

	// Получаем конфигурацию Swiper из атрибутов
	const swiperConfig = getSwiperConfigFromAttributes(attributes);

	// Генерируем уникальный ключ для hover эффектов
	const hoverEffectsKey = `${simpleEffect}-${effectType}-${tooltipStyle}-${overlayStyle}-${overlayGradient}-${overlayColor}-${cursorStyle}`;

	// Генерируем уникальный ключ для Swiper
	const swiperUniqueKey = `swiper-${swiperEffect}-${swiperSpeed}-${swiperItems}-${swiperItemsXs}-${swiperItemsMd}-${swiperItemsXl}-${swiperMargin || '30'}-${swiperLoop}-${swiperAutoplay}-${swiperNav}-${swiperDots}-${hoverEffectsKey}-${clientId}`;

	const renderImageColumn = () => {
		const positionClass = imagePosition === 'right' ? 'end-0' : 'start-0';
		// Если задан imageColumnClass, используем его, иначе стандартные классы
		const wrapperClasses = imageColumnClass
			? imageColumnClass.trim()
			: `col-lg-6 position-lg-absolute top-0 ${positionClass} h-100 d-flex align-items-center justify-content-center`;

		// Используем массив images для обоих режимов
		const imagesToRender = images || [];

		// Если изображений нет, показываем placeholder
		if (
			(imageType === 'image-simple' || imageType === 'background') &&
			(!imagesToRender || imagesToRender.length === 0)
		) {
			// Путь к placeholder изображению из темы
			const placeholderUrl = isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about32.jpg`
					: './assets/img/photos/about32.jpg'
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about32.jpg';

			return (
				<div className={wrapperClasses}>
					<div
						className="image-wrapper bg-image bg-cover h-100 w-100"
						data-image-src={placeholderUrl}
						{...(isEditor && {
							style: {
								backgroundImage: `url(${placeholderUrl})`,
							},
						})}
					>
						{modalVideoUrl && (
							<a
								href={getRelativeUrl(modalVideoUrl)}
								className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-lg-none"
								style={{
									top: '50%',
									left: '50%',
									transform: 'translate(-50%,-50%)',
									zIndex: 3,
								}}
								data-glightbox
								data-gallery="mobile-video"
							>
								<i className="icn-caret-right"></i>
							</a>
						)}
					</div>
				</div>
			);
		}

		if (
			(imageType === 'image-simple' || imageType === 'background') &&
			imagesToRender &&
			imagesToRender.length > 0
		) {
			// Для режима background рендерим напрямую без ImageSimpleRender (и в редакторе, и на фронтенде)
			if (imageType === 'background') {
				// Рендерим в зависимости от displayMode
				if (displayMode === 'single') {
					const imageUrl = getImageUrl(imagesToRender[0], imageSize);
					return (
						<div className={wrapperClasses}>
							<div
								className={`image-wrapper bg-image bg-cover h-100 w-100 ${borderRadius || ''}`.trim()}
								data-image-src={imageUrl}
								{...(isEditor && {
									style: {
										backgroundImage: `url(${imageUrl})`,
									},
								})}
							>
								{modalVideoUrl && (
									<a
										href={getRelativeUrl(modalVideoUrl)}
										className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-lg-none"
										style={{
											top: '50%',
											left: '50%',
											transform: 'translate(-50%,-50%)',
											zIndex: 3,
										}}
										data-glightbox
										data-gallery="mobile-video"
									>
										<i className="icn-caret-right"></i>
									</a>
								)}
							</div>
						</div>
					);
				} else if (displayMode === 'grid') {
					return (
						<div className={wrapperClasses}>
							<div className={getContainerClasses()}>
								{imagesToRender.map((image, index) => {
									const imageUrl = getImageUrl(
										image,
										imageSize
									);
									return (
										<div
											key={`banner-image-${index}-${imageSize}`}
											className={
												gridType === 'classic'
													? getColClasses()
													: ''
											}
										>
											<div
												className={`image-wrapper bg-image bg-cover h-100 w-100 ${borderRadius || ''}`.trim()}
												data-image-src={imageUrl}
												{...(isEditor && {
													style: {
														backgroundImage: `url(${imageUrl})`,
													},
												})}
											></div>
										</div>
									);
								})}
							</div>
						</div>
					);
				} else if (displayMode === 'swiper') {
					const swiperClassName = 'h-100';
					const swiperContainerClassName = 'h-100 w-100';

					return (
						<div className={wrapperClasses}>
							<SwiperSlider
								config={swiperConfig}
								className={swiperContainerClassName}
								swiperClassName={swiperClassName}
								{...(isEditor && {
									uniqueKey: `${swiperUniqueKey}-${imageSize}`,
								})}
							>
								{imagesToRender.map((image, index) => {
									const imageUrl = getImageUrl(
										image,
										imageSize
									);
									return (
										<SwiperSlide
											key={`banner-swiper-${index}-${imageSize}`}
										>
											<div
												className={`image-wrapper bg-image bg-cover h-100 w-100 ${borderRadius || ''}`.trim()}
												data-image-src={imageUrl}
												{...(isEditor && {
													style: {
														backgroundImage: `url(${imageUrl})`,
													},
												})}
											></div>
										</SwiperSlide>
									);
								})}
							</SwiperSlider>
						</div>
					);
				}
			}

			// Для image-simple используем ImageSimpleRender
			const renderType = imageRenderType;

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
							isEditor={isEditor}
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
									className={
										gridType === 'classic'
											? getColClasses()
											: ''
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
										imageRenderType={renderType}
										isEditor={isEditor}
									/>
								</div>
							))}
						</div>
					</div>
				);
			} else if (displayMode === 'swiper') {
				const swiperClassName =
					imageType === 'background' || imageType === 'image-simple'
						? 'h-100'
						: '';
				const swiperContainerClassName =
					imageType === 'background' || imageType === 'image-simple'
						? 'h-100 w-100'
						: 'w-100';

				return (
					<div className={wrapperClasses}>
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
										imageRenderType={renderType}
										isEditor={isEditor}
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

	const contentColumnClasses =
		imagePosition === 'right' ? 'col-lg-6' : 'col-lg-6 offset-lg-6';
	// Если задан contentColumnRightWrapperClass, используем его, иначе стандартные классы wrapper'а
	const contentPaddingClasses = contentColumnRightWrapperClass
		? contentColumnRightWrapperClass.trim()
		: imagePosition === 'right'
			? 'py-12 py-lg-16 pe-lg-12 py-xxl-18 pe-xxl-16 ps-lg-0'
			: 'py-12 py-lg-16 ps-lg-12 py-xxl-18 ps-xxl-16 pe-lg-0';

	if (isEditor) {
		return (
			<section
				className={`${getSectionClasses()} position-relative min-vh-60 d-lg-flex align-items-center`}
				style={getSectionStyles()}
			>
				{renderImageColumn()}
				<div className="container position-relative">
					{modalVideoUrl && (
						<a
							href={getRelativeUrl(modalVideoUrl)}
							className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-none d-lg-flex"
							style={{
								top: '50%',
								left: '50%',
								transform: 'translate(-50%,-50%)',
								zIndex: 3,
							}}
							data-glightbox
							data-gallery="desktop-video"
						>
							<i className="icn-caret-right"></i>
						</a>
					)}
					<div className="row gx-0">
						<div className={contentColumnClasses}>
							<div
								className={`${contentPaddingClasses} position-relative`}
							>
								<InnerBlocks templateLock={false} />
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			className={`${getSectionClasses()} position-relative min-vh-60 d-lg-flex align-items-center`}
			style={getSectionStyles()}
			{...(backgroundType === 'image' &&
				backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
		>
			{renderImageColumn()}
			<div className="container position-relative">
				{modalVideoUrl && (
					<a
						href={getRelativeUrl(modalVideoUrl)}
						className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-none d-lg-flex"
						style={{
							top: '50%',
							left: '50%',
							transform: 'translate(-50%,-50%)',
							zIndex: 3,
						}}
						data-glightbox
						data-gallery="desktop-video"
					>
						<i className="icn-caret-right"></i>
					</a>
				)}
				<div className="row gx-0">
					<div className={contentColumnClasses}>
						<div
							className={`${contentPaddingClasses} position-relative`}
						>
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
