import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';
import { getImageUrl } from '../../../utilities/image-url';

export const Banner4 = ({ attributes, isEditor = false }) => {
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
		const classes = [
			'wrapper',
			'position-relative',
			'min-vh-70',
			'd-lg-flex',
			'align-items-center',
		];

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

	// Placeholder изображение - about16.jpg
	const placeholderUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/about16.jpg`
			: './assets/img/photos/about16.jpg'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/about16.jpg';

	// Рендерим фоновое изображение справа
	const renderBackgroundImage = () => {
		const imageUrl = hasImage
			? getImageUrl(imagesToRender[0], imageSize)
			: placeholderUrl;

		if (isEditor) {
			return (
				<div
					className="rounded-4-lg-start col-lg-6 order-lg-2 position-lg-absolute top-0 end-0 image-wrapper bg-image bg-cover h-100 min-vh-50"
					style={{ backgroundImage: `url(${imageUrl})` }}
				></div>
			);
		}

		return (
			<div
				className="rounded-4-lg-start col-lg-6 order-lg-2 position-lg-absolute top-0 end-0 image-wrapper bg-image bg-cover h-100 min-vh-50"
				data-image-src={imageUrl}
			></div>
		);
	};

	if (isEditor) {
		return (
			<section className={getSectionClasses()} style={getSectionStyles()}>
				{renderBackgroundImage()}
				{/* /column */}
				<div className="container">
					<div className="row">
						<div className="col-lg-6">
							<div className="mt-10 mt-md-11 mt-lg-n10 px-10 px-md-11 ps-lg-0 pe-lg-13 text-center text-lg-start">
								<InnerBlocks templateLock={false} />
							</div>
							{/* /div */}
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
			{renderBackgroundImage()}
			{/* /column */}
			<div className="container">
				<div className="row">
					<div className="col-lg-6">
						<div className="mt-10 mt-md-11 mt-lg-n10 px-10 px-md-11 ps-lg-0 pe-lg-13 text-center text-lg-start">
							<InnerBlocks.Content />
						</div>
						{/* /div */}
					</div>
					{/* /column */}
				</div>
				{/* /.row */}
			</div>
			{/* /.container */}
		</section>
	);
};
