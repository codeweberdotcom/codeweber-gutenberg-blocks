import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';

const getBlockWrapperProps = (attributes) => {
	const { blockClass, blockId, blockData } = attributes;
	const id = blockId ? String(blockId).replace(/^#/, '') : undefined;
	const dataAttrs = {};
	if (blockData && typeof blockData === 'string') {
		blockData.split(',').forEach((pair) => {
			const eq = pair.indexOf('=');
			if (eq > 0) {
				const key = pair.slice(0, eq).trim();
				const value = pair.slice(eq + 1).trim();
				if (key) dataAttrs[`data-${key}`] = value;
			}
		});
	}
	return { id, ...dataAttrs };
};

export const CTA4 = ({ attributes, isEditor = false }) => {
	const {
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		backgroundOverlay,
		sectionClass,
		containerClass,
		cardClass,
		cardBodyClass,
		blockClass,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper', 'bg-light'];

		const bgClasses = generateBackgroundClasses(attributes);
		classes.push(...bgClasses);

		if (sectionClass) {
			classes.push(sectionClass);
		}
		if (blockClass) classes.push(blockClass);

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
		if (cardClass) classes.push(cardClass);

		return classes.filter(Boolean).join(' ');
	};

	const getCardBodyClasses = () => {
		const base = 'card-body p-10 p-xl-12';
		return cardBodyClass ? `${base} ${cardBodyClass}`.trim() : base;
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

	const wrapperProps = getBlockWrapperProps(attributes);

	if (isEditor) {
		return (
			<div
				className={getCardClasses()}
				style={getCardStyles()}
				{...wrapperProps}
			>
				<div className={getCardBodyClasses()}>
					<InnerBlocks
						templateLock={false}
					/>
				</div>
			</div>
		);
	}

	return (
		<section className={getSectionClasses()} {...wrapperProps}>
			<div className={`container pb-13 pb-md-15 ${containerClass || ''}`}>
				<div
					className={getCardClasses()}
					data-image-src={imageSrc}
				>
					<div className={getCardBodyClasses()}>
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

