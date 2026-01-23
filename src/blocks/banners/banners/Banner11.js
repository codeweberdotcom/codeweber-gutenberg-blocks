import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';
import { getImageUrl } from '../../../utilities/image-url';
import {
	SwiperSlider,
	SwiperSlide,
	getSwiperConfigFromAttributes,
} from '../../../components/swiper/SwiperSlider';

export const Banner11 = ({ attributes, isEditor = false, clientId = '' }) => {
	const {
		images,
		imageSize,
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		sectionClass,
		videoUrl,
		swiperEffect,
		swiperSpeed,
		swiperItems,
		swiperMargin,
		swiperLoop,
		swiperNav,
		swiperDots,
		swiperDotsStyle,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = [
			'wrapper',
			'image-wrapper',
			'bg-image',
			'bg-overlay',
			'bg-overlay-400',
			'bg-content',
			'text-white',
		];

		if (sectionClass) {
			classes.push(sectionClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	const imagesToRender = images || [];
	const hasImage = imagesToRender && imagesToRender.length > 0;

	// Placeholder фоновое изображение
	const placeholderBgUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg4.jpg`
			: './assets/img/photos/bg4.jpg'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/bg4.jpg';

	// Функция для получения стилей секции
	const getSectionStyles = () => {
		const styles = {};
		const bgUrl = backgroundImageUrl || placeholderBgUrl;
		if (isEditor && bgUrl) {
			styles.backgroundImage = `url(${bgUrl})`;
		}
		return Object.keys(styles).length > 0 ? styles : undefined;
	};

	// Получаем URL фонового изображения для data-image-src
	const getBackgroundImageSrc = () => {
		return backgroundImageUrl || placeholderBgUrl;
	};

	// Placeholder изображения для swiper
	const placeholderImages = [
		{
			url: isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about21.jpg`
					: './assets/img/photos/about21.jpg'
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about21.jpg',
			srcset: isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about21@2x.jpg 2x`
					: './assets/img/photos/about21@2x.jpg 2x'
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about21@2x.jpg 2x',
		},
		{
			url: isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about22.jpg`
					: './assets/img/photos/about22.jpg'
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about22.jpg',
			srcset: isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about22@2x.jpg 2x`
					: './assets/img/photos/about22@2x.jpg 2x'
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about22@2x.jpg 2x',
		},
		{
			url: isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about23.jpg`
					: './assets/img/photos/about23.jpg'
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about23.jpg',
			srcset: isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about23@2x.jpg 2x`
					: './assets/img/photos/about23@2x.jpg 2x'
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about23@2x.jpg 2x',
		},
	];

	// Конфигурация Swiper для этого баннера
	const swiperConfig = {
		effect: swiperEffect || 'slide',
		speed: swiperSpeed || 500,
		items: swiperItems || '1',
		itemsXs: '1',
		itemsMd: '1',
		itemsXl: '1',
		margin: swiperMargin || '5',
		loop: swiperLoop !== undefined ? swiperLoop : false,
		nav: swiperNav !== undefined ? swiperNav : true,
		dots: swiperDots !== undefined ? swiperDots : true,
		dotsStyle: swiperDotsStyle || 'dots-over',
		navStyle: '',
		navPosition: '',
	};

	// Генерируем уникальный ключ для Swiper
	const swiperUniqueKey = `swiper-banner11-${clientId}-${imagesToRender.length}`;

	// Рендерим Swiper с изображениями
	const renderSwiper = () => {
		const imagesForSwiper = hasImage ? imagesToRender : placeholderImages;

		return (
			<div className="col-lg-5 offset-lg-1">
				<SwiperSlider
					config={swiperConfig}
					className="dots-over shadow-lg"
					{...(isEditor && { uniqueKey: swiperUniqueKey })}
				>
					{imagesForSwiper.map((image, index) => {
						const imageUrl = hasImage
							? getImageUrl(image, imageSize)
							: image.url;
						const imageAlt = hasImage ? image.alt || '' : '';
						const imageSrcset = hasImage ? undefined : image.srcset;

						// Для второго изображения (индекс 1) добавляем видео кнопку, если есть videoUrl
						const showVideoButton =
							!isEditor && videoUrl && index === 1;

						return (
							<SwiperSlide
								key={`banner11-slide-${index}-${swiperUniqueKey}`}
							>
								{showVideoButton && (
									<a
										href={videoUrl}
										className="btn btn-circle btn-white btn-play ripple mx-auto mb-5 position-absolute"
										style={{
											top: '50%',
											left: '50%',
											transform: 'translate(-50%,-50%)',
											zIndex: 3,
										}}
										data-glightbox
										data-gallery="hero"
									>
										<i className="icn-caret-right"></i>
									</a>
								)}
								<img
									src={imageUrl}
									srcSet={imageSrcset}
									alt={imageAlt}
									className="rounded"
									decoding="async"
								/>
							</SwiperSlide>
						);
					})}
				</SwiperSlider>
			</div>
		);
	};

	if (isEditor) {
		return (
			<section
				className={getSectionClasses()}
				style={getSectionStyles()}
				data-image-src={getBackgroundImageSrc()}
			>
				<div
					className="container pt-18 pb-16"
					style={{ zIndex: 5, position: 'relative' }}
				>
					<div className="row gx-0 gy-12 align-items-center">
						<div className="col-md-10 offset-md-1 offset-lg-0 col-lg-6 content text-center text-lg-start">
							<InnerBlocks templateLock={false} />
						</div>
						{renderSwiper()}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			className={getSectionClasses()}
			style={getSectionStyles()}
			data-image-src={getBackgroundImageSrc()}
		>
			<div
				className="container pt-18 pb-16"
				style={{ zIndex: 5, position: 'relative' }}
			>
				<div className="row gx-0 gy-12 align-items-center">
					<div className="col-md-10 offset-md-1 offset-lg-0 col-lg-6 content text-center text-lg-start">
						<InnerBlocks.Content />
					</div>
					{renderSwiper()}
				</div>
			</div>
		</section>
	);
};
