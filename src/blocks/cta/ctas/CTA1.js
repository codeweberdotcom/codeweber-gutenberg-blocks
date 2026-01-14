import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';

export const CTA1 = ({ attributes, isEditor = false }) => {
	const {
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		sectionClass,
		containerClass,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = [
			'wrapper',
			'image-wrapper',
			'bg-auto',
			'no-overlay',
			'bg-image',
			'text-center',
			'py-14',
			'py-md-16',
			'bg-map',
		];

		const bgClasses = generateBackgroundClasses(attributes);
		classes.push(...bgClasses);

		if (sectionClass) {
			classes.push(sectionClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	// Используем backgroundImageUrl из атрибутов, если оно задано, иначе используем изображение по умолчанию из темы
	const defaultImageUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/map.png`
			: '/wp-content/themes/codeweber/dist/assets/img/map.png'
		: '/wp-content/themes/codeweber/dist/assets/img/map.png';
	
	const imageSrc = backgroundImageUrl || defaultImageUrl;

	// Функция для получения стилей секции (для редактора)
	const getSectionStyles = () => {
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
				className={getSectionClasses()}
				style={getSectionStyles()}
			>
				<InnerBlocks
					templateLock={false}
				/>
			</div>
		);
	}

	return (
		<section
			className={getSectionClasses()}
			data-image-src={imageSrc}
		>
			<div className={`container py-0 py-md-18 ${containerClass || ''}`}>
				<div className="row">
					<div className="col-lg-6 col-xl-5 mx-auto">
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

