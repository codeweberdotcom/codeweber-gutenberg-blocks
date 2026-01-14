import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';

export const CTA4 = ({ attributes, isEditor = false }) => {
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
			'mb-14',
		];

		if (backgroundOverlay) {
			classes.push(backgroundOverlay);
		} else {
			classes.push('bg-overlay', 'bg-overlay-300');
		}

		return classes.filter(Boolean).join(' ');
	};

	// Используем backgroundImageUrl из атрибутов, если оно задано, иначе используем изображение по умолчанию из темы
	const defaultImageUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg16.png`
			: '/wp-content/themes/codeweber/dist/assets/img/photos/bg16.png'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/bg16.png';
	
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
				<div className="card-body p-10 p-xl-12">
					<InnerBlocks
						templateLock={false}
					/>
				</div>
			</div>
		);
	}

	return (
		<section className={getSectionClasses()}>
			<div className={`container pb-13 pb-md-15 ${containerClass || ''}`}>
				<div
					className={getCardClasses()}
					data-image-src={imageSrc}
				>
					<div className="card-body p-10 p-xl-12">
						<div className="row text-center">
							<div className="col-xl-11 col-xxl-9 mx-auto">
								<InnerBlocks.Content />
							</div>
							{/* /column */}
						</div>
						{/* /.row */}
					</div>
					{/*/.card-body */}
				</div>
				{/*/.card */}
			</div>
			{/* /.container */}
		</section>
	);
};

