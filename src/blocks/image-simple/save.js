import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';
import {
	SwiperSlider,
	SwiperSlide,
	getSwiperConfigFromAttributes,
} from '../../components/swiper/SwiperSlider';
import {
	getRowColsClasses,
	getGapClasses,
} from '../../components/grid-control';

export default function Save({ attributes }) {
	const {
		displayMode,
		images,
		imageSize,
		gridType,
		gridColumns,
		gridRowCols,
		gridRowColsSm,
		gridRowColsMd,
		gridRowColsLg,
		gridRowColsXl,
		gridRowColsXxl,
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
		// Image Hover атрибуты
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
		blockClass,
		blockId,
		blockData,
		// Load More атрибуты
		loadMoreEnable,
		loadMoreInitialCount,
		loadMoreLoadMoreCount,
		loadMoreText,
		loadMoreType,
		loadMoreButtonSize,
		loadMoreButtonStyle,
		imageRenderType = 'img',
	} = attributes;

	// Функция для получения классов контейнера
	const getContainerClasses = () => {
		if (displayMode === 'grid') {
			const currentGridType = gridType || 'classic';

			if (currentGridType === 'columns-grid') {
				// Columns Grid: используем row-cols и новые gap атрибуты
				const rowColsClasses = getRowColsClasses(
					attributes,
					'grid',
					gridColumns
				);
				const gapClasses = getGapClasses(attributes, 'grid');

				// Fallback на старые атрибуты gridGapX и gridGapY для обратной совместимости
				let gapClassesStr = gapClasses.join(' ');
				if (!gapClassesStr && (gridGapX || gridGapY)) {
					// Используем старые атрибуты
					const oldGapClasses = [];
					if (gridGapY) oldGapClasses.push(`gy-${gridGapY}`);
					if (gridGapX) oldGapClasses.push(`gx-${gridGapX}`);
					gapClassesStr = oldGapClasses.join(' ');
				}

				return `row ${gapClassesStr} ${rowColsClasses.join(' ')}`;
			} else {
				// Classic Grid: только row и gap классы, БЕЗ row-cols-*
				// Управление колонками происходит через col-* классы в самих элементах
				// Используем getGapClasses для новых gap атрибутов, с fallback на старые
				const gapClasses = getGapClasses(attributes, 'grid');
				let gapClassesStr = gapClasses.join(' ');

				// Fallback на старые атрибуты gridGapX и gridGapY для обратной совместимости
				if (!gapClassesStr && (gridGapX || gridGapY)) {
					const oldGapClasses = [];
					if (gridGapY) oldGapClasses.push(`gy-${gridGapY}`);
					if (gridGapX) oldGapClasses.push(`gx-${gridGapX}`);
					gapClassesStr = oldGapClasses.join(' ');
				}

				// Classic Grid: только row + gap, без row-cols-*
				return `row ${gapClassesStr}`.trim();
			}
		}
		return '';
	};

	// Функция для генерации классов col-* из gridColumns* атрибутов (для Classic Grid)
	// В классической сетке Bootstrap значение напрямую используется как ширина колонки (1-12)
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

		// Base (default) - без префикса
		if (colsDefault) {
			colClasses.push(`col-${colsDefault}`);
		}

		// XS - без префикса (как и default)
		if (colsXs) {
			colClasses.push(`col-${colsXs}`);
		}

		// SM и выше - с префиксами
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

	if (images.length === 0) {
		return null;
	}

	// Для режима background убираем обертку на фронтенде для всех режимов
	const shouldRemoveWrapper = imageRenderType === 'background';

	// Создаем blockProps только если нужна обертка
	const blockProps = shouldRemoveWrapper
		? null
		: useBlockProps.save({
				className: `cwgb-image-simple-block ${blockClass}`,
				...(blockId && { id: blockId }),
				...getDataAttributes(),
			});

	// Рендерим контент для разных режимов
	const renderContent = () => {
		if (displayMode === 'single') {
			// Режим Single
			return (
				<ImageSimpleRender
					image={images[0]}
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
					isEditor={false}
				/>
			);
		} else if (displayMode === 'grid') {
			// Режим Grid
			return (
				// Режим Grid с поддержкой Load More
				(() => {
					// Определяем, нужно ли ограничивать количество изображений
					const shouldLimitImages =
						loadMoreEnable && loadMoreInitialCount > 0;
					const initialImages = shouldLimitImages
						? images.slice(0, loadMoreInitialCount)
						: images;
					const hasMoreImages =
						shouldLimitImages &&
						images.length > loadMoreInitialCount;

					// Если Load More включен, оборачиваем в контейнер
					if (loadMoreEnable) {
						// Сохраняем все атрибуты блока в data-атрибуте для использования в AJAX
						const blockDataJson = JSON.stringify({
							images: images,
							imageSize,
							gridType,
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
							gridColumns,
							gridColumnsXs: attributes.gridColumnsXs,
							gridColumnsSm: attributes.gridColumnsSm,
							gridColumnsMd: attributes.gridColumnsMd,
							gridColumnsLg: attributes.gridColumnsLg,
							gridColumnsXl: attributes.gridColumnsXl,
							gridColumnsXxl: attributes.gridColumnsXxl,
						});

						return (
							<div
								className="cwgb-load-more-container"
								data-block-id={blockId || 'image-simple-block'}
								data-block-type="image-simple"
								data-current-offset={loadMoreInitialCount}
								data-load-count={loadMoreLoadMoreCount || 6}
								data-post-id=""
								data-block-attributes={blockDataJson}
							>
								<div
									className={`cwgb-load-more-items ${getContainerClasses()}`}
								>
									{initialImages.map((image, index) => (
										<div
											key={index}
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
												lightboxGallery={
													lightboxGallery
												}
												simpleEffect={simpleEffect}
												effectType={effectType}
												tooltipStyle={tooltipStyle}
												overlayStyle={overlayStyle}
												overlayGradient={
													overlayGradient
												}
												overlayColor={overlayColor}
												cursorStyle={cursorStyle}
												imageRenderType={
													imageRenderType
												}
												isEditor={false}
											/>
										</div>
									))}
								</div>

								{hasMoreImages &&
									(() => {
										// Предустановленные тексты для кнопки/ссылки Load More
										const loadMoreTexts = {
											'show-more': __(
												'Show More',
												'codeweber-gutenberg-blocks'
											),
											'load-more': __(
												'Load More',
												'codeweber-gutenberg-blocks'
											),
											'show-more-items': __(
												'Show More Items',
												'codeweber-gutenberg-blocks'
											),
											'more-posts': __(
												'More Posts',
												'codeweber-gutenberg-blocks'
											),
											'view-all': __(
												'View All',
												'codeweber-gutenberg-blocks'
											),
											'show-all': __(
												'Show All',
												'codeweber-gutenberg-blocks'
											),
										};

										const loadMoreTextKey =
											loadMoreText || 'show-more';
										const loadMoreTextValue =
											loadMoreTexts[loadMoreTextKey] ||
											loadMoreTexts['show-more'];
										const loadMoreElementType =
											loadMoreType || 'button';
										const loadingText = __(
											'Loading...',
											'codeweber-gutenberg-blocks'
										);

										// Строим класс кнопки
										const buttonClasses = [
											'btn',
											'cwgb-load-more-btn',
										];

										// Добавляем стиль кнопки (solid или outline)
										if (loadMoreButtonStyle === 'outline') {
											buttonClasses.push(
												'btn-outline-primary'
											);
										} else {
											buttonClasses.push('btn-primary');
										}

										// Добавляем размер кнопки
										if (loadMoreButtonSize) {
											buttonClasses.push(
												loadMoreButtonSize
											);
										}

										const buttonClassName =
											buttonClasses.join(' ');

										return (
											<div className="text-center mt-5">
												{loadMoreElementType ===
												'link' ? (
													<a
														href="#"
														className="hover cwgb-load-more-btn"
														data-load-more="true"
														data-loading-text={
															loadingText
														}
													>
														{loadMoreTextValue}
													</a>
												) : (
													<button
														className={
															buttonClassName
														}
														type="button"
														data-loading-text={
															loadingText
														}
													>
														{loadMoreTextValue}
													</button>
												)}
											</div>
										);
									})()}
							</div>
						);
					}

					// Если Load More отключен, отображаем все изображения как обычно
					return (
						<div className={getContainerClasses()}>
							{images.map((image, index) => (
								<div
									key={index}
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
										imageRenderType={imageRenderType}
										isEditor={false}
									/>
								</div>
							))}
						</div>
					);
				})()
			);
		} else if (displayMode === 'swiper') {
			// Режим Swiper - используем компонент SwiperSlider
			// Для background режима добавляем h-100 к swiper-container и swiper
			const swiperClassName =
				imageRenderType === 'background' ? 'h-100' : '';
			const swiperContainerClassName =
				imageRenderType === 'background' ? 'h-100' : '';

			return (
				<SwiperSlider
					config={swiperConfig}
					className={swiperContainerClassName}
					swiperClassName={swiperClassName}
				>
					{images.map((image, index) => (
						<SwiperSlide key={index}>
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
								isEditor={false}
							/>
						</SwiperSlide>
					))}
				</SwiperSlider>
			);
		}
		return null;
	};

	const content = renderContent();

	// Если нужно убрать обертку (background режим), возвращаем контент напрямую
	if (shouldRemoveWrapper) {
		return content;
	}

	// Иначе возвращаем с оберткой
	return <div {...blockProps}>{content}</div>;
}
