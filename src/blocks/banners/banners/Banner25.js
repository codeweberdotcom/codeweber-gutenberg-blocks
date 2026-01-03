import { generateBackgroundClasses } from '../../../utilities/class-generators';
import { getImageUrl } from '../../../utilities/image-url';
import { 
	SwiperSlider, 
	SwiperSlide, 
	getSwiperConfigFromAttributes,
} from '../../../components/swiper/SwiperSlider';

export const Banner25 = ({ attributes, isEditor = false, clientId = '' }) => {
	const {
		images,
		imageSize,
		sectionClass,
		swiperEffect,
		swiperSpeed,
		swiperItems,
		swiperItemsXs,
		swiperItemsMd,
		swiperItemsLg,
		swiperMargin,
		swiperDots,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper'];
		
		// Если sectionClass содержит bg-gray, используем sectionClass напрямую
		if (sectionClass && sectionClass.includes('bg-gray')) {
			classes.push(sectionClass);
		} else {
			// Иначе добавляем стандартные классы фона
			const bgClasses = generateBackgroundClasses(attributes);
			classes.push(...bgClasses);
			if (sectionClass) {
				classes.push(sectionClass);
			}
		}
		
		return classes.filter(Boolean).join(' ');
	};

	const imagesToRender = images || [];
	const hasImage = imagesToRender && imagesToRender.length > 0;
	
	// Placeholder изображения для слайдов (tb1.jpg - tb7.jpg)
	const placeholderImages = [
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/tb1.jpg`
				: './assets/img/photos/tb1.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/tb1.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/tb2.jpg`
				: './assets/img/photos/tb2.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/tb2.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/tb3.jpg`
				: './assets/img/photos/tb3.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/tb3.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/tb4.jpg`
				: './assets/img/photos/tb4.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/tb4.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/tb5.jpg`
				: './assets/img/photos/tb5.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/tb5.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/tb6.jpg`
				: './assets/img/photos/tb6.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/tb6.jpg',
		isEditor 
			? (window.location?.origin 
				? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/tb7.jpg`
				: './assets/img/photos/tb7.jpg')
			: '/wp-content/themes/codeweber/dist/assets/img/photos/tb7.jpg',
	];

	// Конфигурация Swiper для этого баннера
	const swiperConfig = {
		effect: swiperEffect || 'slide',
		speed: swiperSpeed || 500,
		items: swiperItems || '1',
		itemsXs: swiperItemsXs || '1',
		itemsMd: swiperItemsMd || '1',
		itemsLg: swiperItemsLg || '2',
		margin: swiperMargin || '30',
		loop: false,
		centered: false,
		nav: false,
		dots: swiperDots !== undefined ? swiperDots : true,
		dotsStyle: '',
		navStyle: '',
		navPosition: '',
	};

	// Генерируем уникальный ключ для Swiper
	const swiperUniqueKey = `swiper-banner25-${clientId}-${imagesToRender.length}`;

	// Рендерим Swiper с изображениями
	const renderSwiper = () => {
		// Используем imagesToRender или placeholder изображения
		const slideImages = hasImage ? imagesToRender : placeholderImages.map((url, index) => ({ 
			url, 
			alt: `Slide ${index + 1}`,
			id: 0 
		}));

		// Если нет изображений, используем все 7 placeholder
		const slidesToRender = slideImages.length > 0 ? slideImages : placeholderImages.map((url, index) => ({ 
			url, 
			alt: `Slide ${index + 1}`,
			id: 0 
		}));

		return (
			<SwiperSlider 
				config={swiperConfig} 
				className="blog grid-view mb-16"
				{...(isEditor && { uniqueKey: swiperUniqueKey })}
			>
				{slidesToRender.map((image, index) => {
					const imageUrl = hasImage ? getImageUrl(image, imageSize) : image.url;
					const imageAlt = hasImage ? (image.alt || '') : '';

					return (
						<SwiperSlide key={`banner25-slide-${index}-${swiperUniqueKey}`}>
							<figure className="overlay caption caption-overlay rounded mb-0">
								<a href="#">
									<img 
										src={imageUrl} 
										alt={imageAlt} 
										decoding="async"
									/>
								</a>
								<figcaption>
									<span className="badge badge-lg bg-white text-uppercase mb-3">Places</span>
									<h2 className="post-title h3 mt-1 mb-3">
										<a href="./blog-post.html">The Best Moments in Venice</a>
									</h2>
									<ul className="post-meta text-white mb-0">
										<li className="post-date">
											<i className="uil uil-calendar-alt"></i>
											<span>8 Aug 2022</span>
										</li>
										<li className="post-author">
											<a href="#">
												<i className="uil uil-user"></i>
												<span>By Sandbox</span>
											</a>
										</li>
										<li className="post-comments">
											<a href="#">
												<i className="uil uil-comment"></i>
												3<span> Comments</span>
											</a>
										</li>
									</ul>
								</figcaption>
							</figure>
						</SwiperSlide>
					);
				})}
			</SwiperSlider>
		);
	};

	return (
		<section className={getSectionClasses()}>
			<div className="container pt-10 pb-14 pb-md-16">
				{renderSwiper()}
			</div>
		</section>
	);
};








