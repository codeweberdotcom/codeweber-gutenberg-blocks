import { InnerBlocks } from '@wordpress/block-editor';

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

export const Banner20 = ({ attributes, isEditor = false }) => {
	const {
		videoUrl,
		backgroundImageUrl,
		sectionClass,
	} = attributes;

	// Placeholder для видео и poster
	const placeholderVideoUrl = '/wp-content/themes/codeweber/dist/assets/media/movie2.mp4';
	const placeholderPosterUrl = isEditor 
		? (window.location?.origin 
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/movie2.jpg`
			: './assets/img/photos/movie2.jpg')
		: '/wp-content/themes/codeweber/dist/assets/img/photos/movie2.jpg';

	// Получаем URL видео и poster
	const videoSrc = videoUrl || placeholderVideoUrl;
	const posterSrc = backgroundImageUrl || placeholderPosterUrl;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['video-wrapper', 'bg-overlay', 'bg-overlay-gradient', 'px-0', 'mt-0', 'min-vh-80'];
		
		if (sectionClass) {
			classes.push(sectionClass);
		}
		
		return classes.filter(Boolean).join(' ');
	};

	if (isEditor) {
		return (
			<section className={getSectionClasses()}>
				<video 
					poster={posterSrc} 
					src={videoSrc}
					autoPlay
					loop
					playsInline
					muted
					style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1 }}
				/>
				<div className="video-content">
					<div className="container text-center">
						<div className="row">
							<div className="col-lg-8 col-xl-6 text-center text-white mx-auto">
								<InnerBlocks allowedBlocks={ALLOWED_CODEWEBER_BLOCKS} templateLock={false} />
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className={getSectionClasses()}>
			<video 
				poster={posterSrc} 
				src={videoSrc}
				autoPlay
				loop
				playsInline
				muted
			/>
			<div className="video-content">
				<div className="container text-center">
					<div className="row">
						<div className="col-lg-8 col-xl-6 text-center text-white mx-auto">
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

