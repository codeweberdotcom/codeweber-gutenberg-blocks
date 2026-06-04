import { InnerBlocks } from '@wordpress/block-editor';
import { resolveMinHeightClass } from '../utils/minHeight';

export const Banner32 = ({ attributes, isEditor = false }) => {
	return (
		<section className={`wrapper gradient-8 bg-lines ${resolveMinHeightClass(attributes.minHeight, '')}`.trim()}>
			<div className="container pt-17 pt-md-19 pb-21 pb-lg-23 text-center">
				<div className="row">
					<div className="col-lg-10 col-xl-9 col-xxl-8 mx-auto">
						{isEditor ? (
							<InnerBlocks templateLock={false} />
						) : (
							<InnerBlocks.Content />
						)}
					</div>
				</div>
			</div>
		</section>
	);
};
