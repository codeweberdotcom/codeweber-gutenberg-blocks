import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { BannerSidebar } from './sidebar';
import { __ } from '@wordpress/i18n';
import { generateBackgroundClasses, generateTextColorClass } from '../../utilities/class-generators';

const BannerEdit = ({ attributes, setAttributes }) => {
	const {
		layout,
		title,
		subtitle,
		paragraph,
		buttonText,
		buttonText2,
		buttonUrl,
		buttonUrl2,
		buttonClass,
		buttonClass2,
		imageId,
		imageUrl,
		imageAlt,
		backgroundImageId,
		backgroundImageUrl,
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundSize,
		sectionClass,
		containerClass,
		textAlign,
		titleTag,
		subtitleTag,
		videoUrl,
	} = attributes;

	const blockProps = useBlockProps({
		className: `banner-block banner-${layout}`,
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

	const renderLayout1 = () => (
		<section className={`${getSectionClasses()} bg-light position-relative min-vh-70 d-lg-flex align-items-center`} style={getSectionStyles()}>
			{imageUrl && (
				<div className="rounded-4-lg-start col-lg-6 order-lg-2 position-lg-absolute top-0 end-0 image-wrapper bg-image bg-cover h-100 min-vh-50" style={{ backgroundImage: `url(${imageUrl})` }}></div>
			)}
			<div className="container">
				<div className="row">
					<div className="col-lg-6">
						<div className="mt-10 mt-md-11 mt-lg-n10 px-10 px-md-11 ps-lg-0 pe-lg-13 text-center text-lg-start">
							<RichText
								tagName={titleTag || 'h1'}
								value={title}
								onChange={(value) => setAttributes({ title: value })}
								placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
								className="display-1 mb-5"
								allowedFormats={[]}
							/>
							<RichText
								tagName="p"
								value={paragraph}
								onChange={(value) => setAttributes({ paragraph: value })}
								placeholder={__('Enter paragraph...', 'codeweber-gutenberg-blocks')}
								className="lead fs-25 lh-sm mb-7 pe-md-10"
								allowedFormats={[]}
							/>
							<div className="d-flex justify-content-center justify-content-lg-start">
								{buttonText && (
									<span>
										<a href={buttonUrl || '#'} className={buttonClass || 'btn btn-lg btn-primary rounded-pill me-2'}>
											{buttonText}
										</a>
									</span>
								)}
								{buttonText2 && (
									<span>
										<a href={buttonUrl2 || '#'} className={buttonClass2 || 'btn btn-lg btn-outline-primary rounded-pill'}>
											{buttonText2}
										</a>
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);

	const renderLayout2 = () => (
		<>
			<section className={`${getSectionClasses()} bg-light`} style={getSectionStyles()}>
				<div className={`container pt-11 pt-md-13 pb-11 pb-md-19 pb-lg-22 ${textAlign || 'text-center'}`}>
					<div className="row">
						<div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto">
							{subtitle && (
								<RichText
									tagName={subtitleTag || 'h2'}
									value={subtitle}
									onChange={(value) => setAttributes({ subtitle: value })}
									placeholder={__('Enter subtitle...', 'codeweber-gutenberg-blocks')}
									className="fs-16 text-uppercase ls-xl text-dark mb-4"
									allowedFormats={[]}
								/>
							)}
							<RichText
								tagName={titleTag || 'h1'}
								value={title}
								onChange={(value) => setAttributes({ title: value })}
								placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
								className="display-1 fs-60 mb-4 px-md-15 px-lg-0"
								allowedFormats={[]}
							/>
							<RichText
								tagName="p"
								value={paragraph}
								onChange={(value) => setAttributes({ paragraph: value })}
								placeholder={__('Enter paragraph...', 'codeweber-gutenberg-blocks')}
								className="lead fs-24 lh-sm mb-7 mx-md-13 mx-lg-10"
								allowedFormats={[]}
							/>
							{buttonText && (
								<div>
									<a href={buttonUrl || '#'} className="btn btn-lg btn-primary rounded mb-5">
										{buttonText}
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
			{imageUrl && (
				<section className="wrapper bg-dark">
					<div className="container pt-14 pt-md-16 pb-9 pb-md-11">
						<figure className="rounded mt-md-n21 mt-lg-n23 mb-14">
							<img src={imageUrl} alt={imageAlt || ''} srcSet={imageUrl ? `${imageUrl} 2x` : ''} />
						</figure>
					</div>
				</section>
			)}
		</>
	);

	const renderLayout3 = () => (
		<section className={`${getSectionClasses()} bg-soft-primary`} style={getSectionStyles()}>
			<div className="container pt-10 pt-md-14 pb-14 pb-md-0">
				<div className="row gx-md-8 gx-lg-12 gy-3 gy-lg-0 mb-13">
					<div className="col-lg-6">
						<RichText
							tagName={titleTag || 'h1'}
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
							className="display-1 fs-66 lh-xxs mb-0"
							allowedFormats={[]}
						/>
					</div>
					<div className="col-lg-6">
						<RichText
							tagName="p"
							value={paragraph}
							onChange={(value) => setAttributes({ paragraph: value })}
							placeholder={__('Enter paragraph...', 'codeweber-gutenberg-blocks')}
							className="lead fs-25 my-3"
							allowedFormats={[]}
						/>
						{buttonText && (
							<a href={buttonUrl || '#'} className="more hover">
								{buttonText}
							</a>
						)}
					</div>
				</div>
				{imageUrl && (
					<div className="position-relative">
						<figure className="rounded mb-md-n20">
							<img src={imageUrl} alt={imageAlt || ''} srcSet={imageUrl ? `${imageUrl} 2x` : ''} />
						</figure>
					</div>
				)}
			</div>
		</section>
	);

	const renderLayout4 = () => (
		<section className={`${getSectionClasses()} bg-gray`} style={getSectionStyles()}>
			<div className={`container pt-12 pt-md-16 ${textAlign || 'text-center'}`}>
				<div className="row">
					<div className="col-lg-8 col-xxl-7 mx-auto text-center">
						{subtitle && (
							<RichText
								tagName={subtitleTag || 'h2'}
								value={subtitle}
								onChange={(value) => setAttributes({ subtitle: value })}
								placeholder={__('Enter subtitle...', 'codeweber-gutenberg-blocks')}
								className="fs-16 text-uppercase ls-xl text-dark mb-4"
								allowedFormats={[]}
							/>
						)}
						<RichText
							tagName={titleTag || 'h1'}
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
							className="display-1 fs-58 mb-7"
							allowedFormats={[]}
						/>
						<div className="d-flex justify-content-center">
							{buttonText && (
								<span>
									<a href={buttonUrl || '#'} className={buttonClass || 'btn btn-lg btn-primary rounded-pill me-2'}>
										{buttonText}
									</a>
								</span>
							)}
							{buttonText2 && (
								<span>
									<a href={buttonUrl2 || '#'} className={buttonClass2 || 'btn btn-lg btn-outline-primary rounded-pill'}>
										{buttonText2}
									</a>
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
			{backgroundImageUrl && (
				<figure className="position-absolute" style={{ bottom: 0, left: 0, zIndex: 2 }}>
					<img src={backgroundImageUrl} alt="" />
				</figure>
			)}
		</section>
	);

	const renderLayout5 = () => (
		<section className={`${getSectionClasses()} image-wrapper bg-cover bg-image bg-xs-none bg-gray`} style={getSectionStyles()}>
			<div className="container pt-17 pb-15 py-sm-17 py-xxl-20">
				<div className="row">
					<div className="col-sm-6 col-xxl-5 text-center text-sm-start">
						<RichText
							tagName={titleTag || 'h2'}
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
							className="display-1 fs-56 mb-4 mt-0 mt-lg-5 ls-xs pe-xl-5 pe-xxl-0"
							allowedFormats={[]}
						/>
						<RichText
							tagName="p"
							value={paragraph}
							onChange={(value) => setAttributes({ paragraph: value })}
							placeholder={__('Enter paragraph...', 'codeweber-gutenberg-blocks')}
							className="lead fs-23 lh-sm mb-7 pe-lg-5 pe-xl-5 pe-xxl-0"
							allowedFormats={[]}
						/>
						{buttonText && (
							<div>
								<a href={buttonUrl || '#'} className="btn btn-lg btn-primary rounded">
									{buttonText}
								</a>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);

	const renderLayout6 = () => (
		<section className={`${getSectionClasses()} bg-gray position-relative min-vh-60 d-lg-flex align-items-center`} style={getSectionStyles()}>
			{imageUrl && (
				<div className="col-lg-6 position-lg-absolute top-0 start-0 image-wrapper bg-image bg-cover h-100" style={{ backgroundImage: `url(${imageUrl})` }}></div>
			)}
			<div className="container position-relative">
				<div className="row gx-0">
					<div className="col-lg-6 offset-lg-6">
						<div className="py-12 py-lg-16 ps-lg-12 py-xxl-18 ps-xxl-16 pe-lg-0 position-relative">
							<RichText
								tagName={titleTag || 'h1'}
								value={title}
								onChange={(value) => setAttributes({ title: value })}
								placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
								className="display-1 ls-xs fs-52 mb-4"
								allowedFormats={[]}
							/>
							<RichText
								tagName="p"
								value={paragraph}
								onChange={(value) => setAttributes({ paragraph: value })}
								placeholder={__('Enter paragraph...', 'codeweber-gutenberg-blocks')}
								className="lead fs-25 lh-sm mb-7"
								allowedFormats={[]}
							/>
							{buttonText && (
								<div>
									<a href={buttonUrl || '#'} className="btn btn-lg btn-primary rounded mb-2">
										{buttonText}
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);

	const renderLayout7 = () => (
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
							<RichText
								tagName={titleTag || 'h1'}
								value={title}
								onChange={(value) => setAttributes({ title: value })}
								placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
								className="display-1 ls-xs fs-52 mb-4"
								allowedFormats={[]}
							/>
							<RichText
								tagName="p"
								value={paragraph}
								onChange={(value) => setAttributes({ paragraph: value })}
								placeholder={__('Enter paragraph...', 'codeweber-gutenberg-blocks')}
								className="lead fs-25 lh-sm mb-7"
								allowedFormats={[]}
							/>
							{buttonText && (
								<div>
									<a href={buttonUrl || '#'} className="btn btn-lg btn-primary rounded mb-2">
										{buttonText}
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);

	const renderLayout = () => {
		switch (layout) {
			case 'layout1':
				return renderLayout1();
			case 'layout2':
				return renderLayout2();
			case 'layout3':
				return renderLayout3();
			case 'layout4':
				return renderLayout4();
			case 'layout5':
				return renderLayout5();
			case 'layout6':
				return renderLayout6();
			case 'layout7':
				return renderLayout7();
			default:
				return renderLayout1();
		}
	};

	return (
		<>
			<InspectorControls>
				<BannerSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div {...blockProps}>
				{renderLayout()}
			</div>
		</>
	);
};

export default BannerEdit;






