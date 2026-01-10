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

export const Banner7 = ({ attributes, isEditor = false }) => {
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

		// Если sectionClass содержит bg-gradient-primary, используем sectionClass напрямую
		if (sectionClass && sectionClass.includes('bg-gradient-primary')) {
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

	// Placeholder изображение - i12.png
	const placeholderUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/illustrations/i12.png`
			: './assets/img/illustrations/i12.png'
		: '/wp-content/themes/codeweber/dist/assets/img/illustrations/i12.png';

	// Рендерим изображение внизу
	const renderBottomImage = () => {
		const imageUrl = hasImage
			? getImageUrl(imagesToRender[0], imageSize)
			: placeholderUrl;
		const imageAlt = hasImage ? imagesToRender[0].alt || '' : '';

		// Для placeholder добавляем srcset для ретина-дисплеев
		const placeholderSrcset = !hasImage
			? isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/illustrations/i12@2x.png 2x`
					: './assets/img/illustrations/i12@2x.png 2x'
				: '/wp-content/themes/codeweber/dist/assets/img/illustrations/i12@2x.png 2x'
			: undefined;

		return (
			<div className="row mt-12">
				<div className="col-lg-8 mx-auto">
					<figure>
						<img
							className="img-fluid"
							src={imageUrl}
							srcSet={placeholderSrcset}
							alt={imageAlt}
							decoding="async"
						/>
					</figure>
				</div>
			</div>
		);
	};

	if (isEditor) {
		return (
			<section className={getSectionClasses()} style={getSectionStyles()}>
				<div className="container py-14 pt-md-15 pb-md-18">
					<div className="row text-center">
						<div className="col-lg-9 col-xxl-7 mx-auto">
							<InnerBlocks
								allowedBlocks={ALLOWED_CODEWEBER_BLOCKS}
								templateLock={false}
							/>
						</div>
						{/* /column */}
					</div>
					{/* /.row */}
					{renderBottomImage()}
				</div>
				{/* /.container */}
			</section>
		);
	}

	return (
		<section
			className={getSectionClasses()}
			style={getSectionStyles()}
			{...(backgroundType === 'image' &&
				backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
		>
			<div className="container py-14 pt-md-15 pb-md-18">
				<div className="row text-center">
					<div className="col-lg-9 col-xxl-7 mx-auto">
						<InnerBlocks.Content />
					</div>
					{/* /column */}
				</div>
				{/* /.row */}
				{renderBottomImage()}
			</div>
			{/* /.container */}
		</section>
	);
};
