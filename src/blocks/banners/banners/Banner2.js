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

export const Banner2 = ({ attributes, isEditor = false }) => {
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
		const classes = ['wrapper'];
		
		// Если sectionClass содержит bg-light, используем sectionClass напрямую
		if (sectionClass && sectionClass.includes('bg-light')) {
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

	const imagesToRender = images || [];
	const hasImage = imagesToRender && imagesToRender.length > 0;
	
	// Placeholder изображение - about7.jpg
	const placeholderUrl = isEditor 
		? (window.location?.origin 
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about7.jpg`
			: './assets/img/photos/about7.jpg')
		: '/wp-content/themes/codeweber/dist/assets/img/photos/about7.jpg';

	// Рендерим изображение
	const renderImage = () => {
		// Определяем изображение для рендеринга
		const image = hasImage ? imagesToRender[0] : null;
		const imageUrl = image ? getImageUrl(image, imageSize) : placeholderUrl;
		const imageAlt = image ? (image.alt || '') : '';

		// Для placeholder добавляем srcset для ретина-дисплеев
		const placeholderSrcset = !hasImage 
			? (isEditor 
				? (window.location?.origin 
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about7@2x.jpg 2x`
					: './assets/img/photos/about7@2x.jpg 2x')
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about7@2x.jpg 2x')
			: undefined;

		return (
			<div className="col-md-8 offset-md-2 col-lg-6 offset-lg-1 position-relative order-lg-2">
				<div className="shape bg-dot primary rellax w-17 h-19" data-rellax-speed="1" style={{ top: '-1.7rem', left: '-1.5rem' }}></div>
				<div className="shape rounded bg-soft-primary rellax d-md-block" data-rellax-speed="0" style={{ bottom: '-1.8rem', right: '-0.8rem', width: '85%', height: '90%' }}></div>
				<figure className="rounded">
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

	if (isEditor) {
		return (
			<section className={getSectionClasses()} style={getSectionStyles()}>
				<div className="container pt-8 pt-md-14">
					<div className="row gx-lg-0 gx-xl-8 gy-10 gy-md-13 gy-lg-0 mb-7 mb-md-10 mb-lg-16 align-items-center">
						{renderImage()}
						{/* /column */}
						<div className="col-lg-5 mt-lg-n10 text-center text-lg-start">
							<InnerBlocks allowedBlocks={ALLOWED_CODEWEBER_BLOCKS} templateLock={false} />
						</div>
						{/* /column */}
					</div>
					{/* /.row */}
				</div>
				{/* /.container */}
			</section>
		);
	}

	return (
		<section
			className={getSectionClasses()}
			style={getSectionStyles()}
			{...(backgroundType === 'image' && backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
		>
			<div className="container pt-8 pt-md-14">
				<div className="row gx-lg-0 gx-xl-8 gy-10 gy-md-13 gy-lg-0 mb-7 mb-md-10 mb-lg-16 align-items-center">
					{renderImage()}
					{/* /column */}
					<div className="col-lg-5 mt-lg-n10 text-center text-lg-start">
						<InnerBlocks.Content />
					</div>
					{/* /column */}
				</div>
				{/* /.row */}
			</div>
			{/* /.container */}
		</section>
	);
};




