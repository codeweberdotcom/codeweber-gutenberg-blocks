import { __ } from '@wordpress/i18n';
import { ImageSimpleRender } from '../image/ImageSimpleRender';
import { getImageUrl } from '../../utilities/image-url';

export const PostGridItemRender = ({
	post,
	template = 'default',
	imageSize,
	borderRadius,
	simpleEffect,
	effectType,
	tooltipStyle,
	overlayStyle,
	overlayGradient,
	overlayColor,
	cursorStyle,
	isEditor = false,
	enableLink = false,
	postType = 'post',
}) => {
	const postLink = post.linkUrl || '#';
	const postTitle = post.title || '';
	const postDescription = post.description || '';
	const imageUrl = getImageUrl(post, imageSize);
	
	// Ограничиваем заголовок до 56 символов
	let titleLimited = postTitle ? postTitle.replace(/<[^>]*>/g, '') : '';
	titleLimited = titleLimited.replace(/\s+/g, ' ').trim();
	if (titleLimited.length > 56) {
		titleLimited = titleLimited.substring(0, 56) + '...';
	}
	
	// Ограничиваем описание до 50 символов
	let descriptionLimited = postDescription ? postDescription.replace(/<[^>]*>/g, '') : '';
	descriptionLimited = descriptionLimited.replace(/\s+/g, ' ').trim();
	if (descriptionLimited.length > 50) {
		descriptionLimited = descriptionLimited.substring(0, 50) + '...';
	}

	// Формируем классы для figure
	const figureClasses = [];
	if (effectType === 'overlay') {
		figureClasses.push('overlay');
		if (overlayStyle) figureClasses.push(overlayStyle);
		if (overlayGradient) figureClasses.push(overlayGradient);
		if (overlayColor) figureClasses.push('overlay-color');
	}
	if (simpleEffect && simpleEffect !== 'none') {
		figureClasses.push(simpleEffect);
	}
	if (borderRadius) {
		figureClasses.push(borderRadius);
	}
	if (template === 'card' || template === 'card-content') {
		figureClasses.push('card-img-top');
	} else if (effectType === 'overlay' || template === 'slider') {
		figureClasses.push('hover-scale');
	}
	
	const figureClassString = figureClasses.join(' ');

	// Figcaption для overlay
	const renderFigcaption = () => {
		if (effectType === 'overlay') {
			if (overlayStyle === 'overlay-1' || overlayStyle === 'overlay-4') {
				return (
					<figcaption>
						<h5 className="from-top mb-0">Read More</h5>
					</figcaption>
				);
			}
		}
		return null;
	};

	if (template === 'card') {
		// Card template
		return (
			<article className="h-100 mb-6">
				<div className="card shadow-lg d-flex flex-column h-100">
					<figure className={figureClassString}>
						<a href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
							<img src={imageUrl} alt={post.alt || postTitle} />
						</a>
						{renderFigcaption()}
					</figure>
					<div className="card-body p-6">
						<div className="post-header">
							<div className="post-category">
								<a href={isEditor ? '#' : postLink} className="hover" rel="category" onClick={isEditor ? (e) => e.preventDefault() : undefined}>
									{__('Category', 'codeweber-gutenberg-blocks')}
								</a>
							</div>
							<h2 className="post-title h3 mt-1 mb-3">
								<a className="link-dark" href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
									{titleLimited}
								</a>
							</h2>
						</div>
						<div className="post-footer mt-auto">
							<ul className="post-meta d-flex mb-0">
								<li className="post-date">
									<i className="uil uil-calendar-alt"></i>
									<span>{__('Date', 'codeweber-gutenberg-blocks')}</span>
								</li>
								<li className="post-comments">
									<a href={isEditor ? '#' : (postLink + '#comments')} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
										<i className="uil uil-comment"></i>
										{__('0', 'codeweber-gutenberg-blocks')}
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</article>
		);
	} else if (template === 'card-content') {
		// Card Content template
		const excerptLimited = descriptionLimited.length > 116 ? descriptionLimited.substring(0, 116) + '...' : descriptionLimited;
		return (
			<article className="h-100 mb-6">
				<div className="card d-flex flex-column h-100">
					<figure className={figureClassString + ' hover-scale'}>
						<a href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
							<img src={imageUrl} alt={post.alt || postTitle} />
							<span className="bg"></span>
						</a>
						{renderFigcaption()}
					</figure>
					<div className="card-body">
						<div className="post-header">
							<div className="post-category text-line">
								<a href={isEditor ? '#' : postLink} className="hover" rel="category" onClick={isEditor ? (e) => e.preventDefault() : undefined}>
									{__('Category', 'codeweber-gutenberg-blocks')}
								</a>
							</div>
							<h2 className="post-title h3 mt-1 mb-3">
								<a className="link-dark" href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
									{titleLimited}
								</a>
							</h2>
						</div>
						{excerptLimited && (
							<div className="post-content">
								<p className="mb-0">{excerptLimited}</p>
							</div>
						)}
					</div>
					<div className="card-footer mt-auto">
						<ul className="post-meta d-flex mb-0">
							<li className="post-date">
								<i className="uil uil-calendar-alt"></i>
								<span>{__('Date', 'codeweber-gutenberg-blocks')}</span>
							</li>
							<li className="post-comments">
								<a href={isEditor ? '#' : (postLink + '#comments')} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
									<i className="uil uil-comment"></i>
									{__('0', 'codeweber-gutenberg-blocks')}
								</a>
							</li>
						</ul>
					</div>
				</div>
			</article>
		);
	} else if (template === 'default-clickable') {
		// Default Clickable template
		return (
			<article className="h-100">
				<a href={isEditor ? '#' : postLink} className="card-link d-block text-decoration-none d-flex flex-column h-100 lift" onClick={isEditor ? (e) => e.preventDefault() : undefined}>
					<figure className={borderRadius + ' mb-5'}>
						<img src={imageUrl} alt={post.alt || postTitle} />
					</figure>
					<div className="post-header p-4">
						<div className="post-category text-line">
							<span className="hover" rel="category">
								{__('Category', 'codeweber-gutenberg-blocks')}
							</span>
						</div>
						<h2 className="post-title h3 mt-1 mb-3">
							<span className="link-dark">{titleLimited}</span>
						</h2>
					</div>
					<div className="post-footer p-4 mt-auto">
						<ul className="post-meta">
							<li className="post-date">
								<i className="uil uil-calendar-alt"></i>
								<span>{__('Date', 'codeweber-gutenberg-blocks')}</span>
							</li>
							<li className="post-comments">
								<span>
									<i className="uil uil-comment"></i>
									{__('0', 'codeweber-gutenberg-blocks')}
								</span>
							</li>
						</ul>
					</div>
				</a>
			</article>
		);
	} else if (template === 'slider') {
		// Slider template
		const excerptLimited = descriptionLimited.length > 116 ? descriptionLimited.substring(0, 116) + '...' : descriptionLimited;
		return (
			<article>
				<div className="post-col">
					<figure className={'post-figure ' + figureClassString + ' hover-scale mb-5'}>
						<a href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
							<img src={imageUrl} alt={post.alt || postTitle} className="post-image" />
							<div className="caption-wrapper p-7">
								<div className="caption bg-matte-color mt-auto label-u text-neutral-50 px-4 py-2">
									{__('Category', 'codeweber-gutenberg-blocks')}
								</div>
							</div>
							<span className="bg"></span>
						</a>
						{renderFigcaption()}
					</figure>
					<div className="post-body mt-4">
						<div className="post-meta d-flex mb-3 fs-16 justify-content-between">
							<span className="post-date">{__('Date', 'codeweber-gutenberg-blocks')}</span>
							<a href={isEditor ? '#' : (postLink + '#comments')} className="post-comments" onClick={isEditor ? (e) => e.preventDefault() : undefined}>
								<i className="uil uil-comment"></i>
								{__('0', 'codeweber-gutenberg-blocks')}
							</a>
						</div>
						<h3 className="post-title h4" title={postTitle}>
							<a className="link-dark" href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
								{titleLimited}
							</a>
						</h3>
						{excerptLimited && (
							<div className="body-l-l mb-4 post-excerpt">
								{excerptLimited}
							</div>
						)}
						<a href={isEditor ? '#' : postLink} className="hover-4 link-body label-s text-charcoal-blue me-4 post-read-more" onClick={isEditor ? (e) => e.preventDefault() : undefined}>
							{__('Read more', 'codeweber-gutenberg-blocks')}
						</a>
					</div>
				</div>
			</article>
		);
	} else if (template === 'overlay-5') {
		// Overlay-5 template
		const excerptLimited = descriptionLimited.length > 116 ? descriptionLimited.substring(0, 113) + '...' : descriptionLimited;
		const overlay5Classes = `overlay overlay-5 hover-scale ${borderRadius || 'rounded'}`;
		
		return (
			<article>
				<figure className={overlay5Classes}>
					<a href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
						<div className="bottom-overlay post-meta fs-16 justify-content-between position-absolute zindex-1 d-flex flex-column h-100 w-100 p-5">
							<div className="d-flex w-100 justify-content-end">
								<span className="post-date badge bg-primary rounded-pill">{__('Date', 'codeweber-gutenberg-blocks')}</span>
							</div>
							<h2 className="h5 mb-0">{titleLimited}</h2>
						</div>
						<img src={imageUrl} alt={post.alt || postTitle} />
					</a>
					<figcaption className="p-5">
						<div className="post-body h-100 d-flex flex-column justify-content-between from-left">
							{excerptLimited && (
								<p className="mb-3">{excerptLimited}</p>
							)}
							<div className="d-block">
								<a href={isEditor ? '#' : postLink} className="hover-4 link-body label-s text-charcoal-blue me-4 post-read-more" onClick={isEditor ? (e) => e.preventDefault() : undefined}>
									{__('Read more', 'codeweber-gutenberg-blocks')}
								</a>
							</div>
						</div>
					</figcaption>
				</figure>
			</article>
		);
	} else if (template === 'client-simple') {
		// Client Simple template - для Swiper (без figure, просто img)
		return (
			<>
				{enableLink && postLink ? (
					<a href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
						<img src={imageUrl} alt={post.alt || postTitle} />
					</a>
				) : (
					<img src={imageUrl} alt={post.alt || postTitle} />
				)}
			</>
		);
	} else if (template === 'client-grid') {
		// Client Grid template
		return (
			<figure className="px-3 px-md-0 px-xxl-2">
				{enableLink && postLink ? (
					<a href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
						<img src={imageUrl} alt={post.alt || postTitle} />
					</a>
				) : (
					<img src={imageUrl} alt={post.alt || postTitle} />
				)}
			</figure>
		);
	} else if (template === 'client-card') {
		// Client Card template
		return (
			<div className="card shadow-lg h-100 p-0 align-items-center">
				<div className="card-body align-items-center d-flex px-3 py-6 p-md-8">
					<figure className="px-md-3 px-xl-0 px-xxl-3 mb-0">
						{enableLink && postLink ? (
							<a href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
								<img src={imageUrl} alt={post.alt || postTitle} />
							</a>
						) : (
							<img src={imageUrl} alt={post.alt || postTitle} />
						)}
					</figure>
				</div>
			</div>
		);
	} else {
		// Default template
		return (
			<article>
				<figure className={figureClassString + ' mb-5'}>
					<a href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
						<img src={imageUrl} alt={post.alt || postTitle} />
					</a>
					{renderFigcaption()}
				</figure>
				<div className="post-header">
					<div className="post-category text-line">
						<a href={isEditor ? '#' : postLink} className="hover" rel="category" onClick={isEditor ? (e) => e.preventDefault() : undefined}>
							{__('Category', 'codeweber-gutenberg-blocks')}
						</a>
					</div>
					<h2 className="post-title h3 mt-1 mb-3">
						<a className="link-dark" href={isEditor ? '#' : postLink} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
							{titleLimited}
						</a>
					</h2>
				</div>
				<div className="post-footer">
					<ul className="post-meta">
						<li className="post-date">
							<i className="uil uil-calendar-alt"></i>
							<span>{__('Date', 'codeweber-gutenberg-blocks')}</span>
						</li>
						<li className="post-comments">
							<a href={isEditor ? '#' : (postLink + '#comments')} onClick={isEditor ? (e) => e.preventDefault() : undefined}>
								<i className="uil uil-comment"></i>
								{__('0', 'codeweber-gutenberg-blocks')}
							</a>
						</li>
					</ul>
				</div>
			</article>
		);
	}
};

