import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { BannersSidebar } from './sidebar';
import { __ } from '@wordpress/i18n';
import { generateBackgroundClasses, generateTextColorClass } from '../../utilities/class-generators';

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

const BannersEdit = ({ attributes, setAttributes }) => {
	const {
		bannerType,
		imageId,
		imageUrl,
		imageAlt,
		backgroundImageId,
		backgroundImageUrl,
		backgroundType,
		backgroundSize,
		sectionClass,
		videoUrl,
	} = attributes;

	const blockProps = useBlockProps({
		className: `banners-block banner-${bannerType}`,
	});

	const getSectionClasses = () => {
		const classes = ['wrapper'];
		classes.push(...generateBackgroundClasses(attributes));
		if (sectionClass) {
			classes.push(sectionClass);
		}
		return classes.filter(Boolean).join(' ');
	};

	const getSectionStyles = () => {
		const styles = {};
		if (backgroundType === 'image' && backgroundImageUrl) {
			styles.backgroundImage = `url(${backgroundImageUrl})`;
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

	// Banner 34 - based on provided HTML
	const renderBanner34 = () => (
		<section className={`${getSectionClasses()} bg-gray position-relative min-vh-60 d-lg-flex align-items-center`} style={getSectionStyles()}>
			{imageUrl && (
				<div className="col-lg-6 position-lg-absolute top-0 start-0 image-wrapper bg-image bg-cover h-100" style={{ backgroundImage: `url(${imageUrl})` }}>
					{videoUrl && (
						<a href={videoUrl} className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-lg-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3 }} data-glightbox data-gallery="mobile-video">
							<i className="icn-caret-right"></i>
						</a>
					)}
				</div>
			)}
			<div className="container position-relative">
				{videoUrl && (
					<a href={videoUrl} className="btn btn-circle btn-primary btn-play ripple mx-auto position-absolute d-none d-lg-flex" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3 }} data-glightbox data-gallery="desktop-video">
						<i className="icn-caret-right"></i>
					</a>
				)}
				<div className="row gx-0">
					<div className="col-lg-6 offset-lg-6">
						<div className="py-12 py-lg-16 ps-lg-12 py-xxl-18 ps-xxl-16 pe-lg-0 position-relative">
							<InnerBlocks
								allowedBlocks={ALLOWED_CODEWEBER_BLOCKS}
								templateLock={false}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);

	const renderBanner = () => {
		switch (bannerType) {
			case 'banner-34':
				return renderBanner34();
			default:
				return renderBanner34();
		}
	};

	return (
		<>
			<InspectorControls>
				<BannersSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div {...blockProps}>
				{renderBanner()}
			</div>
		</>
	);
};

export default BannersEdit;

