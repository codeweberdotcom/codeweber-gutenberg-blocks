import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { BannersSidebar } from './sidebar';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { generateBackgroundClasses, generateTextColorClass } from '../../utilities/class-generators';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';
import { 
	SwiperSlider, 
	SwiperSlide, 
	getSwiperConfigFromAttributes,
} from '../../components/swiper/SwiperSlider';
import { getRowColsClasses, getGapClasses } from '../../components/grid-control';

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

const BannersEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		bannerType,
		imageType,
		imagePosition = 'left',
		imageId,
		imageUrl,
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
		backgroundImageId,
		backgroundImageUrl,
		backgroundType,
		backgroundSize,
		sectionClass,
		videoUrl,
		displayMode = 'single',
		gridType,
		gridColumns,
		gridRowCols,
		loadMoreEnable,
		loadMoreInitialCount,
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

	// #region agent log
	fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'banners/edit.js:87',message:'BannersEdit render',data:{displayMode,imageType,imagesLength:images?.length,gridType,imageRenderType},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
	// #endregion

	const blockProps = useBlockProps({
		className: `banners-block banner-${bannerType}`,
	});

	const { replaceInnerBlocks } = useDispatch(blockEditorStore);
	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId) || [],
		[clientId]
	);

	// Функция для получения шаблона блоков
	const getTemplateBlocks = () => {
		return [
			['codeweber-gutenberg-blocks/heading-subtitle', {
				enableTitle: true,
				enableSubtitle: false,
				enableText: true,
				title: 'We bring solutions to make life easier for our customers.',
				text: 'We have considered our solutions to support every stage of your growth.',
				titleSize: 'display-1',
				textClass: 'lead fs-lg mb-7',
			}],
			['codeweber-blocks/button', {
				ButtonContent: 'Get Started',
				ButtonSize: '',
			}],
		];
	};

	// Применяем шаблон при первом создании блока, если блоки пусты
	const hasAppliedTemplateRef = useRef(false);
	useEffect(() => {
		if (innerBlocks.length === 0 && !hasAppliedTemplateRef.current) {
			const template = getTemplateBlocks();
			const templateBlocks = createBlocksFromInnerBlocksTemplate(template);
			replaceInnerBlocks(clientId, templateBlocks, false);
			hasAppliedTemplateRef.current = true;
		}
	}, [innerBlocks.length, clientId, replaceInnerBlocks]);

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

	// Генерируем уникальный ключ для Swiper
	const swiperUniqueKey = `swiper-${swiperEffect}-${swiperSpeed}-${swiperItems}-${swiperItemsXs}-${swiperItemsMd}-${swiperItemsXl}-${attributes.swiperMargin || '30'}-${swiperLoop}-${swiperAutoplay}-${swiperNav}-${swiperDots}-${hoverEffectsKey}-${clientId}`;

	// Banner 34 - based on provided HTML
	const renderBanner34 = () => {
		const renderImageColumn = () => {
			const positionClass = imagePosition === 'right' ? 'end-0' : 'start-0';
			const wrapperClasses = `col-lg-6 position-lg-absolute top-0 ${positionClass} h-100 d-flex align-items-center justify-content-center`;
			
			// Используем массив images для обоих режимов
			const imagesToRender = images || [];

			// Если изображений нет, показываем placeholder
			if ((imageType === 'image-simple' || imageType === 'background') && (!imagesToRender || imagesToRender.length === 0)) {
				// Путь к placeholder изображению из темы
				const placeholderUrl = window.location?.origin 
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about32.jpg`
					: './assets/img/photos/about32.jpg';

				return (
					<div className={wrapperClasses}>
						<div 
							className="image-wrapper bg-image bg-cover h-100 w-100"
							data-image-src={placeholderUrl}
							style={{ backgroundImage: `url(${placeholderUrl})` }}
						></div>
					</div>
				);
			}

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
								isEditor={true}
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
											isEditor={true}
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
								uniqueKey={`${swiperUniqueKey}-${imageSize}`}
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
											isEditor={true}
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

		const contentColumnClasses = imagePosition === 'right' ? 'col-lg-6' : 'col-lg-6 offset-lg-6';
		const contentPaddingClasses = imagePosition === 'right' ? 'py-12 py-lg-16 pe-lg-12 py-xxl-18 pe-xxl-16 ps-lg-0' : 'py-12 py-lg-16 ps-lg-12 py-xxl-18 ps-xxl-16 pe-lg-0';

		return (
		<section className={`${getSectionClasses()} bg-gray position-relative min-vh-60 d-lg-flex align-items-center`} style={getSectionStyles()}>
			{renderImageColumn()}
			<div className="container position-relative">
				{videoUrl && (
					<a href={videoUrl} className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-none d-lg-flex" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3 }} data-glightbox data-gallery="desktop-video">
						<i className="icn-caret-right"></i>
					</a>
				)}
				<div className="row gx-0">
					<div className={contentColumnClasses}>
						<div className={`${contentPaddingClasses} position-relative`}>
							<InnerBlocks
								allowedBlocks={ALLOWED_CODEWEBER_BLOCKS}
								templateLock={false}
							/>
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

	return (
		<>
			<InspectorControls>
				<BannersSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div {...blockProps}>
				{renderBanner()}
			</div>
		</>
	);
};

export default BannersEdit;

