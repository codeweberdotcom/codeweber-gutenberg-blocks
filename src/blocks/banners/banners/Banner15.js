import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';

export const Banner15 = ({ attributes, isEditor = false, clientId = '' }) => {
	const {
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		sectionClass,
		columnClass,
		videoUrl,
		backgroundVideoUrl,
	} = attributes;

	// Placeholder фоновое изображение
	const placeholderBgUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg7.jpg`
			: './assets/img/photos/bg7.jpg'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/bg7.jpg';

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = [
			'wrapper',
			'px-0',
			'mt-0',
			'min-vh-80',
		];

		// Добавляем классы фона из атрибутов (включая bg-image, bg-overlay и т.д.)
		const bgClasses = generateBackgroundClasses(attributes);
		classes.push(...bgClasses);

		// Добавляем дополнительные классы из sectionClass, если они есть
		if (sectionClass) {
			classes.push(sectionClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	// Получаем URL фонового изображения для data-image-src (только для типа image)
	const getBackgroundImageSrc = () => {
		if (backgroundType === 'image' && backgroundImageUrl) {
			return backgroundImageUrl;
		}
		return null;
	};

	// Функция для получения стилей секции
	const getSectionStyles = () => {
		const styles = {};
		
		// Применяем стили только для типа 'image'
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
		} else if (backgroundType === 'pattern' && attributes.backgroundPatternUrl) {
			// Для паттерна
			styles.backgroundImage = `url(${attributes.backgroundPatternUrl})`;
			styles.backgroundRepeat = 'repeat';
			styles.backgroundPosition = 'center';
		} else if (backgroundType === 'color') {
			// Для цвета применяем через inline стили
			if (attributes.backgroundColorType === 'solid' && attributes.backgroundColor) {
				styles.backgroundColor = attributes.backgroundColor;
			} else if (attributes.backgroundColorType === 'gradient' && attributes.backgroundGradient) {
				styles.backgroundImage = attributes.backgroundGradient;
			}
		}
		// Для типа 'none' стили не применяются
		
		return Object.keys(styles).length > 0 ? styles : undefined;
	};

	// Классы для контента
	const contentClasses = columnClass || 
		'col-md-10 offset-md-1 col-lg-7 offset-lg-0 col-xl-6 col-xxl-5 text-center text-lg-start justify-content-center align-self-center align-items-start';

	const renderContent = () => (
		<div className="container h-100">
			<div className="row h-100">
				<div className={contentClasses}>
					{isEditor ? (
						<InnerBlocks
							templateLock={false}
						/>
					) : (
						<InnerBlocks.Content />
					)}
					{videoUrl && (
						<div className="animate__animated animate__slideInUp animate__delay-3s">
							<a
								href={videoUrl}
								className="btn btn-circle btn-white btn-play ripple mx-auto mb-5"
								data-glightbox
							>
								<i className="icn-caret-right"></i>
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	);

	if (isEditor) {
		return (
			<section
				className={getSectionClasses()}
				style={getSectionStyles()}
				{...(getBackgroundImageSrc() && { 'data-image-src': getBackgroundImageSrc() })}
			>
				{backgroundType === 'video' && backgroundVideoUrl ? (
					<>
						<video
							poster={
								backgroundVideoUrl
									? `${window.location?.origin || ''}/wp-content/themes/codeweber/dist/assets/img/photos/movie2.jpg`
									: undefined
							}
							src={backgroundVideoUrl}
							autoPlay
							loop
							playsInline
							muted
							style={{ width: '100%', height: 'auto' }}
						></video>
						<div className="video-content">
							{renderContent()}
						</div>
					</>
				) : (
					renderContent()
				)}
			</section>
		);
	}

	return (
		<section
			className={getSectionClasses()}
			style={getSectionStyles()}
			{...(getBackgroundImageSrc() && { 'data-image-src': getBackgroundImageSrc() })}
		>
			{backgroundType === 'video' && backgroundVideoUrl ? (
				<>
					<video
						poster={
							backgroundVideoUrl
								? '/wp-content/themes/codeweber/dist/assets/img/photos/movie2.jpg'
								: undefined
						}
						src={backgroundVideoUrl}
						autoPlay
						loop
						playsInline
						muted
					></video>
					<div className="video-content">
						{renderContent()}
					</div>
				</>
			) : (
				renderContent()
			)}
		</section>
	);
};
