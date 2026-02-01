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

export const CTA2 = ({ attributes, isEditor = false }) => {
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

	// Функция для получения классов секции (не используется как верхний элемент в CTA2)
	const getSectionClasses = () => {
		const classes = ['wrapper', 'bg-light'];
		const bgClasses = generateBackgroundClasses(attributes);
		classes.push(...bgClasses);
		if (sectionClass) classes.push(sectionClass);
		return classes.filter(Boolean).join(' ');
	};

	// Классы карточки: применяем настройки бэкграунда к card через generateBackgroundClasses
	const getCardClasses = () => {
		const classes = ['card'];
		const bgClasses = generateBackgroundClasses(attributes);
		classes.push(...bgClasses);
		// Дефолтный оверлей для типа image, если не выбран
		if (backgroundType === 'image' && !backgroundOverlay) {
			classes.push('bg-overlay', 'bg-overlay-400');
		}
		if (blockClass) classes.push(blockClass);
		if (cardClass) classes.push(cardClass);
		return classes.filter(Boolean).join(' ');
	};

	const getCardBodyClasses = () => {
		const base = 'card-body p-6 p-md-11 d-lg-flex flex-row align-items-lg-center justify-content-md-between text-center text-lg-start';
		return cardBodyClass ? `${base} ${cardBodyClass}`.trim() : base;
	};

	const wrapperProps = getBlockWrapperProps(attributes);

	// Картинка фона только при типе "Image"
	const defaultImageUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg3.jpg`
			: '/wp-content/themes/codeweber/dist/assets/img/photos/bg3.jpg'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/bg3.jpg';
	const imageSrc = backgroundType === 'image' ? (backgroundImageUrl || defaultImageUrl) : '';

	// Inline-стили карточки для редактора (только при фоне типа Image)
	const getCardStyles = () => {
		if (backgroundType !== 'image' || !imageSrc) return undefined;
		const styles = {
			backgroundImage: `url(${imageSrc})`,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
		};
		if (backgroundSize === 'bg-cover') styles.backgroundSize = 'cover';
		else if (backgroundSize === 'bg-full') styles.backgroundSize = '100% 100%';
		else styles.backgroundSize = 'auto';
		return styles;
	};

	if (isEditor) {
		return (
			<div
				className={getCardClasses()}
				style={getCardStyles()}
				{...(imageSrc ? { 'data-image-src': imageSrc } : {})}
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
		<div
			className={getCardClasses()}
			{...(imageSrc ? { 'data-image-src': imageSrc } : {})}
			{...wrapperProps}
		>
			<div className={getCardBodyClasses()}>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

