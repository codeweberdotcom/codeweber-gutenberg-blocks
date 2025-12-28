import { InnerBlocks } from '@wordpress/block-editor';
import { getImageUrl } from '../../../utilities/image-url';
import { 
	SwiperSlider, 
	SwiperSlide, 
	getSwiperConfigFromAttributes,
} from '../../../components/swiper/SwiperSlider';

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

export const Banner15 = ({ attributes, isEditor = false, clientId = '' }) => {
	const {
		images,
		imageSize,
		swiperEffect,
		swiperSpeed,
		swiperItems,
		swiperMargin,
		swiperLoop,
		swiperAutoplay,
		swiperAutoplayTime,
		swiperNav,
		swiperDots,
		videoUrl,
	} = attributes;

	const imagesToRender = images || [];
	const hasImage = imagesToRender && imagesToRender.length > 0;
	
	// Placeholder фоновые изображения для слайдов
	const placeholderBgImages = [
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg7.jpg`
				: './assets/img/photos/bg7.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/bg7.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg8.jpg`
				: './assets/img/photos/bg8.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/bg8.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg9.jpg`
				: './assets/img/photos/bg9.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/bg9.jpg',
	];

	// Конфигурация Swiper для этого баннера
	const swiperConfig = {
		effect: swiperEffect || 'slide',
		speed: swiperSpeed || 500,
		items: swiperItems || '1',
		itemsXs: '1',
		itemsMd: '1',
		itemsXl: '1',
		margin: swiperMargin || '0',
		loop: swiperLoop !== undefined ? swiperLoop : false,
		autoplay: swiperAutoplay !== undefined ? swiperAutoplay : true,
		autoplayTime: swiperAutoplayTime || 5000,
		nav: swiperNav !== undefined ? swiperNav : true,
		dots: swiperDots !== undefined ? swiperDots : true,
		dotsStyle: '',
		navStyle: '',
		navPosition: '',
	};

	// Генерируем уникальный ключ для Swiper
	const swiperUniqueKey = `swiper-banner15-${clientId}-${imagesToRender.length}`;

	// Классы для контента каждого слайда (варианты расположения)
	const slideContentClasses = [
		'col-md-10 offset-md-1 col-lg-7 offset-lg-0 col-xl-6 col-xxl-5 text-center text-lg-start justify-content-center align-self-center align-items-start',
		'col-md-11 col-lg-8 col-xl-7 col-xxl-6 mx-auto text-center justify-content-center align-self-center',
		'col-md-10 offset-md-1 col-lg-7 offset-lg-5 col-xl-6 offset-xl-6 col-xxl-5 offset-xxl-6 text-center text-lg-start justify-content-center align-self-center align-items-start',
	];

	// Рендерим Swiper со слайдами
	const renderSwiper = () => {
		// Используем imagesToRender или placeholder изображения
		const slideImages = hasImage ? imagesToRender : placeholderBgImages.map((url, index) => ({ 
			url, 
			alt: `Slide ${index + 1}`,
			id: 0 
		}));

		// Всегда минимум 3 слайда (если меньше, добавляем placeholder)
		let slidesToRender = slideImages;
		if (slidesToRender.length < 3) {
			slidesToRender = [
				...slidesToRender,
				...placeholderBgImages.slice(slidesToRender.length).map((url, index) => ({ 
					url, 
					alt: `Slide ${slidesToRender.length + index + 1}`,
					id: 0 
				}))
			].slice(0, 3);
		}

		return (
			<SwiperSlider 
				config={swiperConfig} 
				className="swiper-hero dots-over"
				{...(isEditor && { uniqueKey: swiperUniqueKey })}
			>
				{slidesToRender.map((image, index) => {
					const imageUrl = hasImage && image.id ? getImageUrl(image, imageSize) : image.url;
					const contentClasses = slideContentClasses[index % slideContentClasses.length];
					const isVideoSlide = !hasImage && index === 1 && videoUrl;

					return (
						<SwiperSlide key={`banner15-slide-${index}-${swiperUniqueKey}`}>
							<div 
								className="h-100 bg-overlay bg-overlay-400 bg-dark"
								style={{ 
									backgroundImage: `url(${imageUrl})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat'
								}}
							>
								<div className="container h-100">
									<div className="row h-100">
										<div className={contentClasses}>
											{isEditor && index === 0 ? (
												<InnerBlocks allowedBlocks={ALLOWED_CODEWEBER_BLOCKS} templateLock={false} />
											) : !isEditor ? (
												<InnerBlocks.Content />
											) : null}
											{isVideoSlide && (
												<div className="animate__animated animate__slideInUp animate__delay-3s">
													<a 
														href={videoUrl} 
														className="btn btn-circle btn-white btn-play ripple mx-auto mb-5" 
														data-glightbox
													>
														<i className="icn-caret-right"></i>
													</a>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</SwiperSlide>
					);
				})}
			</SwiperSlider>
		);
	};

	// Для Banner15 нет обёртки section, это просто swiper-container
	return renderSwiper();
};

