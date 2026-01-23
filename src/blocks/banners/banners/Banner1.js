import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';
import { getImageUrl } from '../../../utilities/image-url';

export const Banner1 = ({ attributes, isEditor = false }) => {
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
		// и не добавляем стандартные классы фона (чтобы не конфликтовали)
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

	// Placeholder изображение
	const placeholderUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/illustrations/i2.png`
			: './assets/img/illustrations/i2.png'
		: '/wp-content/themes/codeweber/dist/assets/img/illustrations/i2.png';

	// Рендерим изображение
	const renderImage = () => {
		// Определяем изображение для рендеринга
		const image = hasImage ? imagesToRender[0] : null;
		const imageUrl = image ? getImageUrl(image, imageSize) : placeholderUrl;
		const imageAlt = image ? image.alt || '' : '';

		// Для placeholder добавляем srcset для ретина-дисплеев
		const placeholderSrcset = !hasImage
			? isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/illustrations/i2@2x.png 2x`
					: './assets/img/illustrations/i2@2x.png 2x'
				: '/wp-content/themes/codeweber/dist/assets/img/illustrations/i2@2x.png 2x'
			: undefined;

		// Для этого баннера всегда используем простой img с классом w-auto
		return (
			<figure>
				<img
					className="w-auto"
					src={imageUrl}
					srcSet={placeholderSrcset}
					alt={imageAlt}
					decoding="async"
				/>
			</figure>
		);
	};

	if (isEditor) {
		return (
			<section className={getSectionClasses()} style={getSectionStyles()}>
				<div className="container pt-10 pt-md-14 pb-8 text-center">
					<div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
						<div className="col-lg-7">{renderImage()}</div>
						{/* /column */}
						<div className="col-md-10 offset-md-1 offset-lg-0 col-lg-5 text-center text-lg-start">
							<InnerBlocks templateLock={false} />
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
			{...(backgroundType === 'image' &&
				backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
		>
			<div className="container pt-10 pt-md-14 pb-8 text-center">
				<div className="row gx-lg-8 gx-xl-12 gy-10 align-items-center">
					<div className="col-lg-7">{renderImage()}</div>
					{/* /column */}
					<div className="col-md-10 offset-md-1 offset-lg-0 col-lg-5 text-center text-lg-start">
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
