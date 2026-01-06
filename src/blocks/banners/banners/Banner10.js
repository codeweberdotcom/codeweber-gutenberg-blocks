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

export const Banner10 = ({ attributes, isEditor = false }) => {
	const {
		images,
		imageSize,
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		sectionClass,
	} = attributes;

	// Функция для получения классов первой секции
	const getFirstSectionClasses = () => {
		const classes = ['wrapper'];
		
		// Если sectionClass содержит bg-light, используем sectionClass напрямую
		if (sectionClass && sectionClass.includes('bg-light')) {
			classes.push(sectionClass);
		} else {
			// Иначе добавляем bg-light по умолчанию
			classes.push('bg-light');
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
	
	// Placeholder изображение - about15.jpg
	const placeholderUrl = isEditor 
		? (window.location?.origin 
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about15.jpg`
			: './assets/img/photos/about15.jpg')
		: '/wp-content/themes/codeweber/dist/assets/img/photos/about15.jpg';

	// Рендерим изображение во второй секции
	const renderBottomImage = () => {
		const imageUrl = hasImage ? getImageUrl(imagesToRender[0], imageSize) : placeholderUrl;
		const imageAlt = hasImage ? (imagesToRender[0].alt || '') : '';

		// Для placeholder добавляем srcset для ретина-дисплеев
		const placeholderSrcset = !hasImage 
			? (isEditor 
				? (window.location?.origin 
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about15@2x.jpg 2x`
					: './assets/img/photos/about15@2x.jpg 2x')
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about15@2x.jpg 2x')
			: undefined;

		return (
			<section className="wrapper bg-dark">
				<div className="container pt-14 pt-md-16 pb-9 pb-md-11">
					<figure className="rounded mt-md-n21 mt-lg-n23 mb-14">
						<img 
							src={imageUrl}
							srcSet={placeholderSrcset}
							alt={imageAlt}
							decoding="async"
						/>
					</figure>
				</div>
			</section>
		);
	};

	if (isEditor) {
		return (
			<>
				<section className={getFirstSectionClasses()} style={getSectionStyles()}>
					<div className="container pt-11 pt-md-13 pb-11 pb-md-19 pb-lg-22 text-center">
						<div className="row">
							<div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto">
								<InnerBlocks allowedBlocks={ALLOWED_CODEWEBER_BLOCKS} templateLock={false} />
							</div>
						</div>
					</div>
				</section>
				{renderBottomImage()}
			</>
		);
	}

	return (
		<>
			<section
				className={getFirstSectionClasses()}
				style={getSectionStyles()}
				{...(backgroundType === 'image' && backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
			>
				<div className="container pt-11 pt-md-13 pb-11 pb-md-19 pb-lg-22 text-center">
					<div className="row">
						<div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto">
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</section>
			{renderBottomImage()}
		</>
	);
};






























