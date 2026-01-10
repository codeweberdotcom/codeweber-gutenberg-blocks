import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';

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

export const Banner27 = ({ attributes, isEditor = false }) => {
	const { backgroundType, backgroundImageUrl, sectionClass } = attributes;

	// Placeholder фоновое изображение
	const placeholderBgUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/bg37.jpg`
			: './assets/img/photos/bg37.jpg'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/bg37.jpg';

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = [
			'wrapper',
			'image-wrapper',
			'bg-cover',
			'bg-image',
			'bg-xs-none',
			'bg-gray',
		];

		// Добавляем дополнительные классы из sectionClass, если они есть
		if (sectionClass) {
			classes.push(sectionClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	// Получаем URL фонового изображения для data-image-src
	const getBackgroundImageSrc = () => {
		return backgroundImageUrl || placeholderBgUrl;
	};

	// Функция для получения стилей секции
	const getSectionStyles = () => {
		const styles = {};
		const bgUrl = getBackgroundImageSrc();
		if (isEditor && bgUrl) {
			styles.backgroundImage = `url(${bgUrl})`;
		}
		return Object.keys(styles).length > 0 ? styles : undefined;
	};

	if (isEditor) {
		return (
			<section
				className={getSectionClasses()}
				style={getSectionStyles()}
				data-image-src={getBackgroundImageSrc()}
			>
				<div className="container pt-17 pb-15 py-sm-17 py-xxl-20">
					<div className="row">
						<div className="col-sm-6 col-xxl-5 text-center text-sm-start">
							<InnerBlocks
								allowedBlocks={ALLOWED_CODEWEBER_BLOCKS}
								templateLock={false}
							/>
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
			data-image-src={getBackgroundImageSrc()}
		>
			<div className="container pt-17 pb-15 py-sm-17 py-xxl-20">
				<div className="row">
					<div className="col-sm-6 col-xxl-5 text-center text-sm-start">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</section>
	);
};
