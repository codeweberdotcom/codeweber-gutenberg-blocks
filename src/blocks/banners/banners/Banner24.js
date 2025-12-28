import { getImageUrl } from '../../../utilities/image-url';
import { 
	SwiperSlider, 
	SwiperSlide,
} from '../../../components/swiper/SwiperSlider';

export const Banner24 = ({ attributes, isEditor = false, clientId = '' }) => {
	const {
		images,
		imageSize,
		sectionClass,
		swiperEffect,
		swiperSpeed,
		swiperItems,
		swiperItemsXs,
		swiperItemsMd,
		swiperItemsXl,
		swiperItemsXxl,
		swiperMargin,
		swiperLoop,
		swiperCentered,
		swiperNav,
		swiperDots,
		enableLightbox,
		lightboxGallery,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper', 'bg-gray'];
		
		// Добавляем дополнительные классы из sectionClass, если они есть
		if (sectionClass) {
			classes.push(sectionClass);
		}
		
		return classes.filter(Boolean).join(' ');
	};

	const imagesToRender = images || [];
	const hasImage = imagesToRender && imagesToRender.length > 0;
	
	// Placeholder изображения для слайдов
	const placeholderImages = [
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/cf1.jpg`
				: './assets/img/photos/cf1.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/cf1.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/cf2.jpg`
				: './assets/img/photos/cf2.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/cf2.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/cf3.jpg`
				: './assets/img/photos/cf3.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/cf3.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/cf4.jpg`
				: './assets/img/photos/cf4.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/cf4.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/cf5.jpg`
				: './assets/img/photos/cf5.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/cf5.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/cf6.jpg`
				: './assets/img/photos/cf6.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/cf6.jpg',
	];

	// Конфигурация Swiper для этого баннера
	const swiperConfig = {
		effect: swiperEffect || 'slide',
		speed: swiperSpeed || 500,
		items: swiperItems || '1',
		itemsXs: swiperItemsXs || '1',
		itemsMd: swiperItemsMd || '1',
		itemsXl: swiperItemsXl || '2',
		itemsXxl: swiperItemsXxl || '2',
		margin: swiperMargin || '30',
		loop: swiperLoop !== undefined ? swiperLoop : true,
		centered: swiperCentered !== undefined ? swiperCentered : true,
		nav: swiperNav !== undefined ? swiperNav : true,
		dots: swiperDots !== undefined ? swiperDots : true,
		dotsStyle: '',
		navStyle: '',
		navPosition: '',
	};

	// Генерируем уникальный ключ для Swiper
	const swiperUniqueKey = `swiper-banner24-${clientId}-${imagesToRender.length}`;

	// Рендерим Swiper с изображениями
	const renderSwiper = () => {
		// Используем imagesToRender или placeholder изображения
		const slideImages = hasImage ? imagesToRender : placeholderImages.map((url, index) => ({ 
			url, 
			alt: `Slide ${index + 1}`,
			id: 0 
		}));

		// Если нет изображений, используем минимум 6 placeholder
		const slidesToRender = slideImages.length > 0 ? slideImages : placeholderImages.map((url, index) => ({ 
			url, 
			alt: `Slide ${index + 1}`,
			id: 0 
		}));

		return (
			<SwiperSlider 
				config={swiperConfig} 
				className=""
				swiperClassName="overflow-visible"
				{...(isEditor && { uniqueKey: swiperUniqueKey })}
			>
				{slidesToRender.map((image, index) => {
					const imageUrl = hasImage ? getImageUrl(image, imageSize) : image.url;
					const imageAlt = hasImage ? (image.alt || '') : '';
					const showLightbox = !isEditor && (enableLightbox !== false);

					return (
						<SwiperSlide key={`banner24-slide-${index}-${swiperUniqueKey}`}>
							<figure className="rounded">
								<img 
									src={imageUrl} 
									alt={imageAlt} 
									decoding="async"
								/>
								{showLightbox && (
									<a 
										className="item-link" 
										href={imageUrl}
										data-glightbox 
										data-gallery={lightboxGallery || "gallery-group"}
									>
										<i className="uil uil-focus-add"></i>
									</a>
								)}
							</figure>
						</SwiperSlide>
					);
				})}
			</SwiperSlider>
		);
	};

	return (
		<section className={getSectionClasses()}>
			<div className="overflow-hidden">
				<div className="container-fluid px-xl-0 pt-6 pb-10">
					{renderSwiper()}
				</div>
			</div>
		</section>
	);
};

