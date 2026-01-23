import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';
import { getImageUrl } from '../../../utilities/image-url';

export const Banner16 = ({ attributes, isEditor = false }) => {
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

	// Placeholder изображение
	const placeholderUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about17.jpg`
			: './assets/img/photos/about17.jpg'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/about17.jpg';

	// Рендерим изображение с маской и карточкой
	const renderImageColumn = () => {
		const image = hasImage ? imagesToRender[0] : null;
		const imageUrl = image ? getImageUrl(image, imageSize) : placeholderUrl;
		const imageAlt = image ? image.alt || '' : '';

		// Для placeholder добавляем srcset для ретина-дисплеев
		const placeholderSrcset = !hasImage
			? isEditor
				? window.location?.origin
					? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about17@2x.jpg 2x`
					: './assets/img/photos/about17@2x.jpg 2x'
				: '/wp-content/themes/codeweber/dist/assets/img/photos/about17@2x.jpg 2x'
			: undefined;

		return (
			<div className="col-md-8 col-lg-5 d-flex position-relative mx-auto">
				<div className="img-mask mask-1">
					<img
						src={imageUrl}
						srcSet={placeholderSrcset}
						alt={imageAlt}
						decoding="async"
					/>
				</div>
				<div
					className="card shadow-lg position-absolute"
					style={{ bottom: '10%', right: '2%' }}
				>
					<div className="card-body py-4 px-5">
						<div className="d-flex flex-row align-items-center">
							<div>
								<img
									src={
										isEditor
											? window.location?.origin
												? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/icons/lineal/check.svg`
												: './assets/img/icons/lineal/check.svg'
											: '/wp-content/themes/codeweber/dist/assets/img/icons/lineal/check.svg'
									}
									className="svg-inject icon-svg icon-svg-sm text-primary mx-auto me-3"
									alt=""
								/>
							</div>
							<div>
								<h3 className="counter mb-0 text-nowrap">
									250+
								</h3>
								<p className="fs-14 lh-sm mb-0 text-nowrap">
									Projects Done
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	if (isEditor) {
		return (
			<section className={getSectionClasses()}>
				<div className="container pt-12 pt-md-14 pb-14 pb-md-16">
					<div className="row gy-10 gy-md-13 gy-lg-0 align-items-center">
						{renderImageColumn()}
						<div className="col-lg-6 offset-lg-1 col-xxl-5 text-center text-lg-start">
							<InnerBlocks templateLock={false} />
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className={getSectionClasses()}>
			<div className="container pt-12 pt-md-14 pb-14 pb-md-16">
				<div className="row gy-10 gy-md-13 gy-lg-0 align-items-center">
					{renderImageColumn()}
					<div className="col-lg-6 offset-lg-1 col-xxl-5 text-center text-lg-start">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</section>
	);
};
