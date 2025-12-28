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

export const Banner32 = ({ attributes, isEditor = false }) => {
	return (
		<section className="wrapper gradient-8 bg-lines">
			<div className="container pt-17 pt-md-19 pb-21 pb-lg-23 text-center">
				<div className="row">
					<div className="col-lg-10 col-xl-9 col-xxl-8 mx-auto">
						{isEditor ? (
							<InnerBlocks allowedBlocks={ALLOWED_CODEWEBER_BLOCKS} templateLock={false} />
						) : (
							<InnerBlocks.Content />
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

