import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';
import { getImageUrl } from '../../../utilities/image-url';

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

export const Banner23 = ({ attributes, isEditor = false, clientId = '' }) => {
	const {
		images,
		imageSize,
		swiperMargin,
		swiperLoop,
		swiperAutoplay,
		swiperAutoplayTime,
		swiperNav,
		swiperDots,
		swiperItems,
		backgroundType,
		backgroundImageUrl,
		sectionClass,
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

	// Используем images для основных изображений
	// Для thumbs используем те же изображения, но с другим размером (thumbnail)
	const imagesToRender = images || [];
	
	// Получаем конфигурацию для основного слайдера
	const mainSwiperConfig = {
		margin: swiperMargin || '0',
		autoplay: swiperAutoplay || true,
		autoplayTime: swiperAutoplayTime || 5000,
		nav: swiperNav !== undefined ? swiperNav : true,
		dots: swiperDots !== undefined ? swiperDots : false,
		items: swiperItems || '1',
		thumbs: true, // Включаем thumbs
	};

	// Генерируем уникальный ключ для Swiper
	const swiperUniqueKey = `swiper-banner23-${clientId}-${imagesToRender.length}`;

	if (isEditor) {
		return (
			<section className={getSectionClasses()}>
				<div 
					className="swiper-container swiper-thumbs-container swiper-fullscreen nav-dark"
					data-margin={mainSwiperConfig.margin}
					data-autoplay={mainSwiperConfig.autoplay}
					data-autoplaytime={mainSwiperConfig.autoplayTime}
					data-nav={mainSwiperConfig.nav}
					data-dots={mainSwiperConfig.dots}
					data-items={mainSwiperConfig.items}
					data-thumbs={mainSwiperConfig.thumbs}
					{...(isEditor && { 'data-unique-key': swiperUniqueKey })}
				>
					<div className="swiper">
						<div className="swiper-wrapper">
							{imagesToRender.length > 0 ? (
								imagesToRender.map((image, index) => {
									const imageUrl = getImageUrl(image, imageSize || 'full');
									return (
										<div 
											key={`banner23-main-slide-${index}-${clientId}`}
											className="swiper-slide bg-overlay bg-overlay-400 bg-dark bg-image"
											data-image-src={imageUrl}
											{...(isEditor && { style: { backgroundImage: `url(${imageUrl})` } })}
										></div>
									);
								})
							) : (
								// Placeholder если нет изображений
								<div 
									className="swiper-slide bg-overlay bg-overlay-400 bg-dark bg-image"
									data-image-src="/wp-content/themes/codeweber/dist/assets/img/photos/bg28.jpg"
									{...(isEditor && { style: { backgroundImage: 'url(/wp-content/themes/codeweber/dist/assets/img/photos/bg28.jpg)' } })}
								></div>
							)}
						</div>
						{/*/.swiper-wrapper */}
					</div>
					{/* /.swiper */}
					
					{/* Thumbs Swiper */}
					<div className="swiper swiper-thumbs">
						<div className="swiper-wrapper">
							{imagesToRender.length > 0 ? (
								imagesToRender.map((image, index) => {
									// Используем thumbnail размер для миниатюр
									const thumbUrl = getImageUrl(image, 'thumbnail');
									return (
										<div 
											key={`banner23-thumb-slide-${index}-${clientId}`}
											className="swiper-slide"
										>
											<img src={thumbUrl} alt={image.alt || ''} />
										</div>
									);
								})
							) : (
								// Placeholder для thumbs
								<div className="swiper-slide">
									<img src="/wp-content/themes/codeweber/dist/assets/img/photos/bg28-th.jpg" alt="" />
								</div>
							)}
						</div>
						{/*/.swiper-wrapper */}
					</div>
					{/* /.swiper */}
					
					{/* Static Content */}
					<div className="swiper-static">
						<div className="container h-100 d-flex align-items-center justify-content-center">
							<div className="row">
								<div className="col-lg-8 mx-auto mt-n10 text-center">
									<InnerBlocks allowedBlocks={ALLOWED_CODEWEBER_BLOCKS} templateLock={false} />
								</div>
								{/* /column */}
							</div>
							{/* /.row */}
						</div>
						{/* /.container */}
					</div>
					{/* /.swiper-static */}
				</div>
				{/* /.swiper-container */}
			</section>
		);
	}

	return (
		<section className={getSectionClasses()}>
			<div 
				className="swiper-container swiper-thumbs-container swiper-fullscreen nav-dark"
				data-margin={mainSwiperConfig.margin}
				data-autoplay={mainSwiperConfig.autoplay}
				data-autoplaytime={mainSwiperConfig.autoplayTime}
				data-nav={mainSwiperConfig.nav}
				data-dots={mainSwiperConfig.dots}
				data-items={mainSwiperConfig.items}
				data-thumbs={mainSwiperConfig.thumbs}
			>
				<div className="swiper">
					<div className="swiper-wrapper">
						{imagesToRender.length > 0 ? (
							imagesToRender.map((image, index) => {
								const imageUrl = getImageUrl(image, imageSize || 'full');
								return (
									<div 
										key={`banner23-main-slide-${index}`}
										className="swiper-slide bg-overlay bg-overlay-400 bg-dark bg-image"
										data-image-src={imageUrl}
									></div>
								);
							})
						) : (
							// Placeholder если нет изображений
							<div 
								className="swiper-slide bg-overlay bg-overlay-400 bg-dark bg-image"
								data-image-src="/wp-content/themes/codeweber/dist/assets/img/photos/bg28.jpg"
							></div>
						)}
					</div>
					{/*/.swiper-wrapper */}
				</div>
				{/* /.swiper */}
				
				{/* Thumbs Swiper */}
				<div className="swiper swiper-thumbs">
					<div className="swiper-wrapper">
						{imagesToRender.length > 0 ? (
							imagesToRender.map((image, index) => {
								// Используем thumbnail размер для миниатюр
								const thumbUrl = getImageUrl(image, 'thumbnail');
								return (
									<div 
										key={`banner23-thumb-slide-${index}`}
										className="swiper-slide"
									>
										<img src={thumbUrl} alt={image.alt || ''} />
									</div>
								);
							})
						) : (
							// Placeholder для thumbs
							<div className="swiper-slide">
								<img src="/wp-content/themes/codeweber/dist/assets/img/photos/bg28-th.jpg" alt="" />
							</div>
						)}
					</div>
					{/*/.swiper-wrapper */}
				</div>
				{/* /.swiper */}
				
				{/* Static Content */}
				<div className="swiper-static">
					<div className="container h-100 d-flex align-items-center justify-content-center">
						<div className="row">
							<div className="col-lg-8 mx-auto mt-n10 text-center">
								<InnerBlocks.Content />
							</div>
							{/* /column */}
						</div>
						{/* /.row */}
					</div>
					{/* /.container */}
				</div>
				{/* /.swiper-static */}
			</div>
			{/* /.swiper-container */}
		</section>
	);
};



