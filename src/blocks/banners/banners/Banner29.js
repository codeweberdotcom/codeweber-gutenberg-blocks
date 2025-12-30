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

export const Banner29 = ({ attributes, isEditor = false }) => {
	const {
		images,
		imageSize,
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		sectionClass,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper', 'image-wrapper', 'bg-full', 'bg-image', 'bg-overlay', 'bg-overlay-light-600'];
		
		if (sectionClass) {
			classes.push(sectionClass);
		}
		
		return classes.filter(Boolean).join(' ');
	};

	// Placeholder фоновое изображение
	const placeholderBgUrl = isEditor 
		? (window.location?.origin 
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg23.png`
			: './assets/img/photos/bg23.png')
		: '/wp-content/themes/codeweber/dist/assets/img/photos/bg23.png';

	// Получаем URL фонового изображения для data-image-src
	const getBackgroundImageSrc = () => {
		return backgroundImageUrl || placeholderBgUrl;
	};

	// Функция для получения стилей секции
	const getSectionStyles = () => {
		const styles = {};
		const bgUrl = getBackgroundImageSrc();
		if (isEditor && bgUrl) {
			styles.backgroundImage = `url(${bgUrl})`;
		}
		return Object.keys(styles).length > 0 ? styles : undefined;
	};

	const imagesToRender = images || [];
	const hasImage = imagesToRender && imagesToRender.length > 0;
	
	// Placeholder изображение справа
	const placeholderRightImageUrl = isEditor 
		? (window.location?.origin 
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/devices3.png`
			: './assets/img/photos/devices3.png')
		: '/wp-content/themes/codeweber/dist/assets/img/photos/devices3.png';

	// Рендерим изображение справа
	const renderRightImage = () => {
		const imageUrl = hasImage ? getImageUrl(imagesToRender[0], imageSize) : placeholderRightImageUrl;
		const imageAlt = hasImage ? (imagesToRender[0].alt || '') : '';

		// Для placeholder добавляем srcset для ретина-дисплеев
		const placeholderSrcset = !hasImage 
			? (isEditor 
				? (window.location?.origin 
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/devices3@2x.png 2x`
					: './assets/img/photos/devices3@2x.png 2x')
				: '/wp-content/themes/codeweber/dist/assets/img/photos/devices3@2x.png 2x')
			: undefined;

		return (
			<div className="col-lg-6 ms-auto mb-n20 mb-xxl-n22">
				<figure>
					<img 
						src={imageUrl} 
						srcSet={placeholderSrcset}
						alt={imageAlt} 
						decoding="async"
					/>
				</figure>
			</div>
		);
	};

	// SVG divider
	const renderDivider = () => {
		return (
			<div className="overflow-hidden" style={{ zIndex: 1 }}>
				<div className="divider text-light mx-n2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
						<g fill="currentColor">
							<polygon points="1440 100 0 100 0 85 1440 0 1440 100" />
						</g>
					</svg>
				</div>
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
				<div className="container pt-16 pt-md-18 pb-9">
					<div className="row gx-0 gy-10 align-items-center text-center text-lg-start">
						<div className="col-lg-6 col-xxl-5 position-relative">
							<img 
								src={isEditor 
									? (window.location?.origin 
										? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/svg/doodle1.svg`
										: './assets/img/svg/doodle1.svg')
									: '/wp-content/themes/codeweber/dist/assets/img/svg/doodle1.svg'
								}
								className="h-9 position-absolute d-none d-lg-block" 
								style={{ top: '-9%', left: '-6%' }} 
								alt="" 
							/>
							<img 
								src={isEditor 
									? (window.location?.origin 
										? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/svg/doodle2.svg`
										: './assets/img/svg/doodle2.svg')
									: '/wp-content/themes/codeweber/dist/assets/img/svg/doodle2.svg'
								}
								className="h-15 position-absolute d-none d-lg-block" 
								style={{ bottom: '9%', right: '-22%' }} 
								alt="" 
							/>
							<InnerBlocks allowedBlocks={ALLOWED_CODEWEBER_BLOCKS} templateLock={false} />
						</div>
						{renderRightImage()}
					</div>
				</div>
				{renderDivider()}
			</section>
		);
	}

	return (
		<section
			className={getSectionClasses()}
			style={getSectionStyles()}
			data-image-src={getBackgroundImageSrc()}
		>
			<div className="container pt-16 pt-md-18 pb-9">
				<div className="row gx-0 gy-10 align-items-center text-center text-lg-start">
					<div className="col-lg-6 col-xxl-5 position-relative">
						<img 
							src="/wp-content/themes/codeweber/dist/assets/img/svg/doodle1.svg"
							className="h-9 position-absolute d-none d-lg-block" 
							style={{ top: '-9%', left: '-6%' }} 
							alt="" 
						/>
						<img 
							src="/wp-content/themes/codeweber/dist/assets/img/svg/doodle2.svg"
							className="h-15 position-absolute d-none d-lg-block" 
							style={{ bottom: '9%', right: '-22%' }} 
							alt="" 
						/>
						<InnerBlocks.Content />
					</div>
					{renderRightImage()}
				</div>
			</div>
			{renderDivider()}
		</section>
	);
};



