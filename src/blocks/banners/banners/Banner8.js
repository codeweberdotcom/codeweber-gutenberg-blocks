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

export const Banner8 = ({ attributes, isEditor = false }) => {
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

	// Placeholder изображение - co3.png
	const placeholderUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/co3.png`
			: './assets/img/photos/co3.png'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/co3.png';

	// Рендерим изображение с карточкой
	const renderImageColumn = () => {
		const imageUrl = hasImage
			? getImageUrl(imagesToRender[0], imageSize)
			: placeholderUrl;
		const imageAlt = hasImage ? imagesToRender[0].alt || '' : '';

		// Для placeholder добавляем srcset для ретина-дисплеев
		const placeholderSrcset = !hasImage
			? isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/co3@2x.png 2x`
					: './assets/img/photos/co3@2x.png 2x'
				: '/wp-content/themes/codeweber/dist/assets/img/photos/co3@2x.png 2x'
			: undefined;

		return (
			<div className="col-lg-6 order-lg-2 d-flex position-relative">
				<img
					className="img-fluid ms-auto mx-auto me-lg-8"
					src={imageUrl}
					srcSet={placeholderSrcset}
					alt={imageAlt}
					decoding="async"
				/>
				<div>
					<div
						className="card shadow-lg position-absolute"
						style={{ bottom: '10%', right: '-3%' }}
					>
						<div className="card-body py-4 px-5">
							<div className="d-flex flex-row align-items-center">
								<div>
									<div className="icon btn btn-circle btn-md btn-soft-primary pe-none mx-auto me-3">
										<i className="uil uil-users-alt"></i>
									</div>
								</div>
								<div>
									<h3 className="counter mb-0 text-nowrap">
										25000+
									</h3>
									<p className="fs-14 lh-sm mb-0 text-nowrap">
										Happy Clients
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	if (isEditor) {
		return (
			<section className={getSectionClasses()} style={getSectionStyles()}>
				<div className="container">
					<div className="card bg-soft-primary rounded-4 mt-2 mb-13 mb-md-17">
						<div className="card-body p-md-10 py-xl-11 px-xl-15">
							<div className="row gx-lg-8 gx-xl-0 gy-10 align-items-center">
								{renderImageColumn()}
								<div className="col-lg-6 text-center text-lg-start">
									<InnerBlocks
										allowedBlocks={ALLOWED_CODEWEBER_BLOCKS}
										templateLock={false}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
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
			<div className="container">
				<div className="card bg-soft-primary rounded-4 mt-2 mb-13 mb-md-17">
					<div className="card-body p-md-10 py-xl-11 px-xl-15">
						<div className="row gx-lg-8 gx-xl-0 gy-10 align-items-center">
							{renderImageColumn()}
							<div className="col-lg-6 text-center text-lg-start">
								<InnerBlocks.Content />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
