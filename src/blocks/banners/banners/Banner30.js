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

export const Banner30 = ({ attributes, isEditor = false }) => {
	const { backgroundImageUrl } = attributes;

	// Placeholder фоновое изображение
	const placeholderBgUrl = isEditor
		? window.location?.origin
			? `${window.location.origin}/wp-content/themes/codeweber/dist/assets/img/photos/blurry.png`
			: './assets/img/photos/blurry.png'
		: '/wp-content/themes/codeweber/dist/assets/img/photos/blurry.png';

	// Получаем URL фонового изображения
	const getBackgroundImageSrc = () => {
		return backgroundImageUrl || placeholderBgUrl;
	};

	if (isEditor) {
		return (
			<section className="wrapper overflow-hidden">
				<div className="container pt-19 pt-md-21 text-center position-relative">
					<div
						className="position-absolute"
						style={{
							top: '-15%',
							left: '50%',
							transform: 'translateX(-50%)',
						}}
					>
						<img
							src={getBackgroundImageSrc()}
							alt=""
							decoding="async"
						/>
					</div>
					<div className="row position-relative">
						<div className="col-lg-8 col-xxl-7 mx-auto position-relative">
							<div
								className="position-absolute shape grape w-5 d-none d-lg-block"
								style={{ top: '-5%', left: '-15%' }}
							>
								<img
									src="/wp-content/themes/codeweber/dist/assets/img/svg/pie.svg"
									className="svg-inject icon-svg w-100 h-100"
									alt=""
								/>
							</div>
							<div
								className="position-absolute shape violet w-10 d-none d-lg-block"
								style={{ bottom: '30%', left: '-20%' }}
							>
								<img
									src="/wp-content/themes/codeweber/dist/assets/img/svg/scribble.svg"
									className="svg-inject icon-svg w-100 h-100"
									alt=""
								/>
							</div>
							<div
								className="position-absolute shape fuchsia w-6 d-none d-lg-block"
								style={{
									top: '0%',
									right: '-25%',
									transform: 'rotate(70deg)',
								}}
							>
								<img
									src="/wp-content/themes/codeweber/dist/assets/img/svg/tri.svg"
									className="svg-inject icon-svg w-100 h-100"
									alt=""
								/>
							</div>
							<div
								className="position-absolute shape yellow w-6 d-none d-lg-block"
								style={{ bottom: '25%', right: '-17%' }}
							>
								<img
									src="/wp-content/themes/codeweber/dist/assets/img/svg/circle.svg"
									className="svg-inject icon-svg w-100 h-100"
									alt=""
								/>
							</div>
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
		<section className="wrapper overflow-hidden">
			<div className="container pt-19 pt-md-21 text-center position-relative">
				<div
					className="position-absolute"
					style={{
						top: '-15%',
						left: '50%',
						transform: 'translateX(-50%)',
					}}
				>
					<img
						src={getBackgroundImageSrc()}
						alt=""
						decoding="async"
					/>
				</div>
				<div className="row position-relative">
					<div className="col-lg-8 col-xxl-7 mx-auto position-relative">
						<div
							className="position-absolute shape grape w-5 d-none d-lg-block"
							style={{ top: '-5%', left: '-15%' }}
						>
							<img
								src="/wp-content/themes/codeweber/dist/assets/img/svg/pie.svg"
								className="svg-inject icon-svg w-100 h-100"
								alt=""
							/>
						</div>
						<div
							className="position-absolute shape violet w-10 d-none d-lg-block"
							style={{ bottom: '30%', left: '-20%' }}
						>
							<img
								src="/wp-content/themes/codeweber/dist/assets/img/svg/scribble.svg"
								className="svg-inject icon-svg w-100 h-100"
								alt=""
							/>
						</div>
						<div
							className="position-absolute shape fuchsia w-6 d-none d-lg-block"
							style={{
								top: '0%',
								right: '-25%',
								transform: 'rotate(70deg)',
							}}
						>
							<img
								src="/wp-content/themes/codeweber/dist/assets/img/svg/tri.svg"
								className="svg-inject icon-svg w-100 h-100"
								alt=""
							/>
						</div>
						<div
							className="position-absolute shape yellow w-6 d-none d-lg-block"
							style={{ bottom: '25%', right: '-17%' }}
						>
							<img
								src="/wp-content/themes/codeweber/dist/assets/img/svg/circle.svg"
								className="svg-inject icon-svg w-100 h-100"
								alt=""
							/>
						</div>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</section>
	);
};
