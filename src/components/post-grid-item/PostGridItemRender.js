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
	if (template === 'card' || template === 'card-alt') {
		figureClasses.push('card-img-top');
	} else if (effectType === 'overlay') {
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

	if (template === 'card' || template === 'card-alt') {
		// Card template
		return (
			<article>
				<div className="card shadow-lg">
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
						<div className="post-footer">
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

