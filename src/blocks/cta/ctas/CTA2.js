import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';

export const CTA2 = ({ attributes, isEditor = false }) => {
	const {
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		backgroundOverlay,
		sectionClass,
		containerClass,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper', 'bg-light'];

		const bgClasses = generateBackgroundClasses(attributes);
		classes.push(...bgClasses);

		if (sectionClass) {
			classes.push(sectionClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	// Функция для получения классов карточки
	const getCardClasses = () => {
		const classes = [
			'card',
			'image-wrapper',
			'bg-full',
			'bg-image',
		];

		if (backgroundOverlay) {
			classes.push(backgroundOverlay);
		} else {
			classes.push('bg-overlay', 'bg-overlay-400');
		}

		return classes.filter(Boolean).join(' ');
	};

	// Используем backgroundImageUrl из атрибутов, если оно задано, иначе используем изображение по умолчанию из темы
	const defaultImageUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg3.jpg`
			: '/wp-content/themes/codeweber/dist/assets/img/photos/bg3.jpg'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/bg3.jpg';
	
	const imageSrc = backgroundImageUrl || defaultImageUrl;

	// Функция для получения стилей карточки (для редактора)
	const getCardStyles = () => {
		const styles = {};
		if (imageSrc) {
			styles.backgroundImage = `url(${imageSrc})`;
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

	if (isEditor) {
		return (
			<div
				className={getCardClasses()}
				style={getCardStyles()}
			>
				<div className="card-body p-6 p-md-11 d-lg-flex flex-row align-items-lg-center justify-content-md-between text-center text-lg-start">
					<InnerBlocks
						templateLock={false}
					/>
				</div>
			</div>
		);
	}

	return (
		<div
			className={getCardClasses()}
			data-image-src={imageSrc}
		>
			<div className="card-body p-6 p-md-11 d-lg-flex flex-row align-items-lg-center justify-content-md-between text-center text-lg-start">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

