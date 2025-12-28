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

export const Banner18 = ({ attributes, isEditor = false }) => {
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

	// Placeholder фоновое изображение для карточки
	const placeholderBgUrl = isEditor 
		? (window.location?.origin 
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg22.png`
			: './assets/img/photos/bg22.png')
		: '/wp-content/themes/codeweber/dist/assets/img/photos/bg22.png';

	// Placeholder изображение справа
	const placeholderRightImageUrl = isEditor 
		? (window.location?.origin 
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/illustrations/3d6.png`
			: './assets/img/illustrations/3d6.png')
		: '/wp-content/themes/codeweber/dist/assets/img/illustrations/3d6.png';

	const imagesToRender = images || [];
	const hasRightImage = imagesToRender && imagesToRender.length > 0;

	// Рендерим изображение справа
	const renderRightImage = () => {
		const imageUrl = hasRightImage ? getImageUrl(imagesToRender[0], imageSize) : placeholderRightImageUrl;
		const imageAlt = hasRightImage ? (imagesToRender[0].alt || '') : '';

		// Для placeholder добавляем srcset для ретина-дисплеев
		const placeholderSrcset = !hasRightImage 
			? (isEditor 
				? (window.location?.origin 
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/illustrations/3d6@2x.png 2x`
					: './assets/img/illustrations/3d6@2x.png 2x')
				: '/wp-content/themes/codeweber/dist/assets/img/illustrations/3d6@2x.png 2x')
			: undefined;

		return (
			<div className="col-lg-6">
				<img 
					className="img-fluid mb-n18" 
					src={imageUrl} 
					srcSet={placeholderSrcset}
					alt={imageAlt} 
					decoding="async"
				/>
			</div>
		);
	};

	// Получаем URL фонового изображения для карточки
	const getCardBackgroundImageSrc = () => {
		return backgroundImageUrl || placeholderBgUrl;
	};

	// Функция для получения стилей карточки
	const getCardStyles = () => {
		const styles = {};
		const bgUrl = getCardBackgroundImageSrc();
		if (isEditor && bgUrl) {
			styles.backgroundImage = `url(${bgUrl})`;
		}
		return Object.keys(styles).length > 0 ? styles : undefined;
	};

	if (isEditor) {
		return (
			<section className={getSectionClasses()}>
				<div className="container-card">
					<div 
						className="card image-wrapper bg-full bg-image bg-overlay bg-overlay-light-500 mt-2 mb-5"
						style={getCardStyles()}
						data-image-src={getCardBackgroundImageSrc()}
					>
						<div className="card-body py-14 px-0">
							<div className="container">
								<div className="row gx-md-8 gx-xl-12 gy-10 align-items-center text-center text-lg-start">
									<div className="col-lg-6">
										<InnerBlocks allowedBlocks={ALLOWED_CODEWEBER_BLOCKS} templateLock={false} />
									</div>
									{renderRightImage()}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className={getSectionClasses()}>
			<div className="container-card">
				<div 
					className="card image-wrapper bg-full bg-image bg-overlay bg-overlay-light-500 mt-2 mb-5"
					style={getCardStyles()}
					data-image-src={getCardBackgroundImageSrc()}
				>
					<div className="card-body py-14 px-0">
						<div className="container">
							<div className="row gx-md-8 gx-xl-12 gy-10 align-items-center text-center text-lg-start">
								<div className="col-lg-6">
									<InnerBlocks.Content />
								</div>
								{renderRightImage()}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

