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
	let imageUrl = getImageUrl(post, imageSize);

	// Если изображения нет, используем placeholder
	if (!imageUrl) {
		let placeholderUrl =
			'/wp-content/plugins/codeweber-gutenberg-blocks/placeholder.jpg';
		if (window.codeweberBlocksData?.pluginUrl) {
			const pluginUrl = window.codeweberBlocksData.pluginUrl;
			placeholderUrl = pluginUrl.endsWith('/')
				? `${pluginUrl}placeholder.jpg`
				: `${pluginUrl}/placeholder.jpg`;
		} else if (window.location && window.location.origin) {
			placeholderUrl = `${window.location.origin}/wp-content/plugins/codeweber-gutenberg-blocks/placeholder.jpg`;
		}
		imageUrl = placeholderUrl;
	}

	// Ограничиваем заголовок до 56 символов
	let titleLimited = postTitle ? postTitle.replace(/<[^>]*>/g, '') : '';
	titleLimited = titleLimited.replace(/\s+/g, ' ').trim();
	if (titleLimited.length > 56) {
		titleLimited = titleLimited.substring(0, 56) + '...';
	}

	// Ограничиваем описание до 50 символов
	let descriptionLimited = postDescription
		? postDescription.replace(/<[^>]*>/g, '')
		: '';
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

	// Проверяем FAQ ПЕРВЫМ, чтобы избежать конфликта имен шаблонов
	if (postType === 'faq') {
		// FAQ templates
		const faqTitle = postTitle || '';
		const faqContent = postDescription || post.content || '';

		// Ограничиваем текст ответа
		let contentLimited = faqContent.replace(/<[^>]*>/g, '');
		contentLimited = contentLimited.replace(/\s+/g, ' ').trim();
		if (contentLimited.length > 80) {
			contentLimited = contentLimited.substring(0, 80) + '...';
		}

		if (template === 'default') {
			// FAQ Default template
			return (
				<div className="d-flex flex-row">
					<div>
						<span className="icon btn btn-sm btn-circle btn-primary pe-none me-5">
							<i className="uil uil-comment-exclamation"></i>
						</span>
					</div>
					<div>
						{faqTitle && <h4 className="mb-0">{faqTitle}</h4>}
						{contentLimited && (
							<p className="mb-0">{contentLimited}</p>
						)}
					</div>
				</div>
			);
		}
	}

	// Проверяем testimonials ПЕРВЫМ, чтобы избежать конфликта имен шаблонов
	if (postType === 'testimonials') {
		// Testimonials templates
		const testimonialText =
			post.text || post.meta?._testimonial_text || postDescription || '';
		const authorName =
			post.authorName || post.meta?._testimonial_author_name || '';
		const authorRole =
			post.authorRole || post.meta?._testimonial_author_role || '';
		const company = post.company || post.meta?._testimonial_company || '';
		const rating =
			post.rating || parseInt(post.meta?._testimonial_rating || '5');
		const ratingClass =
			post.ratingClass ||
			['', 'one', 'two', 'three', 'four', 'five'][rating] ||
			'five';
		const avatarUrl = post.avatarUrl || imageUrl;

		// Ограничиваем текст отзыва
		let textLimited = testimonialText.replace(/<[^>]*>/g, '');
		textLimited = textLimited.replace(/\s+/g, ' ').trim();
		if (textLimited.length > 150) {
			textLimited = textLimited.substring(0, 150) + '...';
		}

		if (template === 'card') {
			// Testimonial Card template (Sandbox style with colored backgrounds)
			const bgColors = [
				'bg-pale-yellow',
				'bg-pale-red',
				'bg-pale-leaf',
				'bg-pale-blue',
			];
			const colorIndex = (post.id || 0) % bgColors.length;
			const bgColor = bgColors[colorIndex];

			return (
				<div className={`card ${bgColor}`}>
					<div className="card-body">
						<blockquote className="icon mb-0">
							<p>
								{textLimited ||
									testimonialText ||
									__(
										'Testimonial text',
										'codeweber-gutenberg-blocks'
									)}
							</p>
							<div className="blockquote-details">
								<div className="info p-0">
									{authorName && (
										<h5 className="mb-1">{authorName}</h5>
									)}
									{authorRole && (
										<p className="mb-0">{authorRole}</p>
									)}
									{company && (
										<p className="mb-0 text-muted small">
											{company}
										</p>
									)}
								</div>
							</div>
						</blockquote>
					</div>
				</div>
			);
		} else if (template === 'blockquote') {
			// Testimonial Blockquote template
			return (
				<div className="card shadow-lg">
					<div className="card-body">
						{rating > 0 && (
							<span
								className={`ratings ${ratingClass} mb-3`}
							></span>
						)}
						<blockquote className="icon mb-0">
							<p>
								{textLimited ||
									testimonialText ||
									__(
										'Testimonial text',
										'codeweber-gutenberg-blocks'
									)}
							</p>
							<div className="blockquote-details">
								{avatarUrl ? (
									<div className="d-flex align-items-center">
										<figure className="user-avatar">
											<img
												className="rounded-circle"
												src={avatarUrl}
												alt={authorName || postTitle}
											/>
										</figure>
										<div>
											{authorName && (
												<div className="h6 mb-0">
													{authorName}
												</div>
											)}
											{authorRole && (
												<span className="post-meta fs-15">
													{authorRole}
												</span>
											)}
											{company && (
												<span className="post-meta fs-15 text-muted">
													{company}
												</span>
											)}
										</div>
									</div>
								) : (
									<div className="info p-0">
										{authorName && (
											<h5 className="mb-1">
												{authorName}
											</h5>
										)}
										{authorRole && (
											<p className="mb-0">{authorRole}</p>
										)}
										{company && (
											<p className="mb-0 text-muted small">
												{company}
											</p>
										)}
									</div>
								)}
							</div>
						</blockquote>
					</div>
				</div>
			);
		} else if (template === 'icon') {
			// Testimonial Icon template (simple blockquote with icon, without rating)
			return (
				<div className="card">
					<div className="card-body">
						<blockquote className="icon mb-0">
							<p>
								{textLimited ||
									testimonialText ||
									__(
										'Testimonial text',
										'codeweber-gutenberg-blocks'
									)}
							</p>
							<div className="blockquote-details">
								{avatarUrl ? (
									<div className="d-flex align-items-center">
										<figure className="user-avatar">
											<img
												className="rounded-circle"
												src={avatarUrl}
												alt={authorName || postTitle}
											/>
										</figure>
										<div>
											{authorName && (
												<div className="h6 mb-0">
													{authorName}
												</div>
											)}
											{authorRole && (
												<span className="post-meta fs-15">
													{authorRole}
												</span>
											)}
											{company && (
												<span className="post-meta fs-15 text-muted">
													{company}
												</span>
											)}
										</div>
									</div>
								) : (
									<div className="info">
										{authorName && (
											<h5 className="mb-1">
												{authorName}
											</h5>
										)}
										{authorRole && (
											<p className="mb-0">{authorRole}</p>
										)}
										{company && (
											<p className="mb-0 text-muted small">
												{company}
											</p>
										)}
									</div>
								)}
							</div>
						</blockquote>
					</div>
				</div>
			);
		} else {
			// Testimonial Default template
			return (
				<div className="card h-100">
					<div className="card-body">
						{rating > 0 && (
							<span
								className={`ratings ${ratingClass} mb-3`}
							></span>
						)}
						<blockquote className="icon mb-0">
							<p>
								{textLimited ||
									testimonialText ||
									__(
										'Testimonial text',
										'codeweber-gutenberg-blocks'
									)}
							</p>
							<div className="blockquote-details">
								{avatarUrl ? (
									<div className="d-flex align-items-center">
										<figure className="user-avatar">
											<img
												className="rounded-circle"
												src={avatarUrl}
												alt={authorName || postTitle}
											/>
										</figure>
										<div>
											{authorName && (
												<div className="h6 mb-0">
													{authorName}
												</div>
											)}
											{authorRole && (
												<span className="post-meta fs-15">
													{authorRole}
												</span>
											)}
											{company && (
												<span className="post-meta fs-15 text-muted">
													{company}
												</span>
											)}
										</div>
									</div>
								) : (
									<div className="info">
										{authorName && (
											<h5 className="mb-1">
												{authorName}
											</h5>
										)}
										{authorRole && (
											<p className="mb-0">{authorRole}</p>
										)}
										{company && (
											<p className="mb-0 text-muted small">
												{company}
											</p>
										)}
									</div>
								)}
							</div>
						</blockquote>
					</div>
				</div>
			);
		}
	}

	// Проверяем staff post type
	if (postType === 'staff') {
		const staffName = post.title || post.meta?._staff_name || '';
		const staffSurname = post.meta?._staff_surname || '';
		const fullName =
			staffName && staffSurname
				? `${staffName} ${staffSurname}`
				: staffName || postTitle;
		// Проверяем и прямое свойство post.position, и meta._staff_position
		const position = post.position || post.meta?._staff_position || '';
		// Проверяем и прямое свойство post.company, и meta._staff_company
		const company = post.company || post.meta?._staff_company || '';
		const description = post.description || '';

		if (template === 'circle') {
			// Staff Circle template - соответствует circle.php
			const cardRadius = borderRadius || '';
			const cardClasses = `card h-100 lift${cardRadius ? ' ' + cardRadius : ''}`;
			const avatarSize = 'w-15';

			// Badge класс для компании
			let badgeClass = 'badge badge-lg bg-gray-300 mb-0 rounded-pill';
			// В редакторе не можем вызвать getThemeButton, используем rounded-pill по умолчанию
			badgeClass += ' rounded-pill';

			const cardContent = (
				<div className={cardClasses}>
					<div className="card-body">
						{imageUrl && (
							<img
								className={`rounded-circle ${avatarSize} mb-4`}
								src={imageUrl}
								srcSet={`${imageUrl} 2x`}
								alt={post.alt || fullName}
							/>
						)}
						{fullName && <h3 className="h4 mb-1">{fullName}</h3>}
						{position && (
							<div className="meta mb-1">{position}</div>
						)}
						{company && <div className={badgeClass}>{company}</div>}
						{description && (
							<p className="mb-2">
								{descriptionLimited || description}
							</p>
						)}
					</div>
				</div>
			);

			// В редакторе не оборачиваем в ссылку
			if (isEditor) {
				return cardContent;
			}

			// На фронтенде оборачиваем в ссылку
			return (
				<a
					href={postLink}
					className="text-decoration-none link-body h-100 d-block"
				>
					{cardContent}
				</a>
			);
		} else if (template === 'card') {
			// Staff Card template
			const bgColors = [
				'bg-soft-blue',
				'bg-soft-red',
				'bg-soft-green',
				'bg-soft-violet',
			];
			const colorIndex = (post.id || post.ID || 0) % bgColors.length;
			const bgColor = bgColors[colorIndex];
			const cardRadius = borderRadius || '';

			return (
				<>
					{enableLink ? (
						<a
							href={isEditor ? '#' : postLink}
							className="text-decoration-none link-body"
							onClick={
								isEditor ? (e) => e.preventDefault() : undefined
							}
						>
							<div className={`position-relative`}>
								<div
									className={`shape rounded ${bgColor} rellax d-md-block`}
									style={{
										bottom: '-0.75rem',
										right: '-0.75rem',
										width: '98%',
										height: '98%',
										zIndex: 0,
									}}
								></div>
								<div
									className={`card h-100 lift${cardRadius ? ' ' + cardRadius : ''}`}
								>
									{imageUrl && (
										<figure
											className={`card-img-top${cardRadius ? ' ' + cardRadius : ''}`}
										>
											<img
												className={`img-fluid${cardRadius ? ' ' + cardRadius : ''}`}
												src={imageUrl}
												srcSet={`${imageUrl} 2x`}
												alt={post.alt || fullName}
											/>
										</figure>
									)}
									<div className="card-body px-6 py-5">
										{fullName && (
											<h4 className="mb-1">{fullName}</h4>
										)}
										{position && (
											<p className="mb-0">{position}</p>
										)}
									</div>
								</div>
							</div>
						</a>
					) : (
						<div className={`position-relative`}>
							<div
								className={`shape rounded ${bgColor} rellax d-md-block`}
								style={{
									bottom: '-0.75rem',
									right: '-0.75rem',
									width: '98%',
									height: '98%',
									zIndex: 0,
								}}
							></div>
							<div
								className={`card h-100 lift${cardRadius ? ' ' + cardRadius : ''}`}
							>
								{imageUrl && (
									<figure
										className={`card-img-top${cardRadius ? ' ' + cardRadius : ''}`}
									>
										<img
											className={`img-fluid${cardRadius ? ' ' + cardRadius : ''}`}
											src={imageUrl}
											srcSet={`${imageUrl} 2x`}
											alt={post.alt || fullName}
										/>
									</figure>
								)}
								<div className="card-body px-6 py-5">
									{fullName && (
										<h4 className="mb-1">{fullName}</h4>
									)}
									{position && (
										<p className="mb-0">{position}</p>
									)}
								</div>
							</div>
						</div>
					)}
				</>
			);
		} else if (template === 'circle_center') {
			// Staff Circle Center template - соответствует circle_center.php
			const cardRadius = borderRadius || '';
			const cardClasses = `card h-100 lift${cardRadius ? ' ' + cardRadius : ''}`;
			const avatarSize = 'w-20';

			// Badge класс для компании
			let badgeClass = 'badge badge-lg bg-gray-300 mb-0 rounded-pill';
			badgeClass += ' rounded-pill';

			const cardContent = (
				<div className={cardClasses}>
					<div className="card-body">
						{imageUrl && (
							<img
								className={`rounded-circle mx-auto ${avatarSize} mb-4`}
								src={imageUrl}
								srcSet={`${imageUrl} 2x`}
								alt={post.alt || fullName}
							/>
						)}
						{fullName && <h3 className="h4 mb-1">{fullName}</h3>}
						{position && (
							<div className="meta mb-1">{position}</div>
						)}
						{company && <div className={badgeClass}>{company}</div>}
						{description && (
							<p className="mb-2">
								{descriptionLimited || description}
							</p>
						)}
					</div>
				</div>
			);

			// В редакторе не оборачиваем в ссылку
			if (isEditor) {
				return cardContent;
			}

			// На фронтенде оборачиваем в ссылку
			return (
				<a
					href={postLink}
					className="text-decoration-none link-body h-100 d-block"
				>
					{cardContent}
				</a>
			);
		} else if (template === 'circle_center_alt') {
			// Staff Circle Center Alt template - соответствует circle_center_alt.php
			const avatarSize = 'w-20';

			// Badge класс для компании
			let badgeClass = 'badge badge-lg bg-gray-300 mb-0 rounded-pill';
			badgeClass += ' rounded-pill';

			const cardContent = (
				<div className="text-center">
					{imageUrl && (
						<>
							{!isEditor && (
								<a href={postLink} className="d-inline-block">
									<img
										className={`rounded-circle mx-auto lift ${avatarSize} mb-4`}
										src={imageUrl}
										srcSet={`${imageUrl} 2x`}
										alt={post.alt || fullName}
									/>
								</a>
							)}
							{isEditor && (
								<img
									className={`rounded-circle mx-auto lift ${avatarSize} mb-4`}
									src={imageUrl}
									srcSet={`${imageUrl} 2x`}
									alt={post.alt || fullName}
								/>
							)}
						</>
					)}
					{fullName && <h3 className="h4 mb-1">{fullName}</h3>}
					{position && <div className="meta mb-1">{position}</div>}
					{company && <div className={badgeClass}>{company}</div>}
					{description && (
						<p className="mb-2">
							{descriptionLimited || description}
						</p>
					)}
					{/* Социальные иконки отображаются только на фронтенде через PHP шаблон */}
					{isEditor && (
						<div className="mt-3 mb-5">
							<nav className="nav social social-muted justify-content-center text-center mb-0">
								<a href="#">
									<i className="uil uil-twitter"></i>
								</a>
								<a href="#">
									<i className="uil uil-facebook-f"></i>
								</a>
								<a href="#">
									<i className="uil uil-instagram"></i>
								</a>
							</nav>
						</div>
					)}
				</div>
			);

			return cardContent;
		} else {
			// Staff Default template
			const cardRadius = borderRadius || '';
			const cardClasses = `card h-100${cardRadius ? ' ' + cardRadius : ''}`;

			return (
				<>
					{enableLink ? (
						<a
							href={isEditor ? '#' : postLink}
							className="text-decoration-none link-body h-100 d-block"
							onClick={
								isEditor ? (e) => e.preventDefault() : undefined
							}
						>
							<div className={cardClasses}>
								{imageUrl && (
									<figure
										className={`card-img-top${cardRadius ? ' ' + cardRadius : ''}`}
									>
										<img
											className={`img-fluid${cardRadius ? ' ' + cardRadius : ''}`}
											src={imageUrl}
											srcSet={`${imageUrl} 2x`}
											alt={post.alt || fullName}
										/>
									</figure>
								)}
								<div className="card-body px-6 py-5">
									{fullName && (
										<h4 className="mb-1">{fullName}</h4>
									)}
									{position && (
										<p className="mb-0">{position}</p>
									)}
								</div>
							</div>
						</a>
					) : (
						<div className={cardClasses}>
							{imageUrl && (
								<figure
									className={`card-img-top${cardRadius ? ' ' + cardRadius : ''}`}
								>
									<img
										className={`img-fluid${cardRadius ? ' ' + cardRadius : ''}`}
										src={imageUrl}
										srcSet={`${imageUrl} 2x`}
										alt={post.alt || fullName}
									/>
								</figure>
							)}
							<div className="card-body px-6 py-5">
								{fullName && (
									<h4 className="mb-1">{fullName}</h4>
								)}
								{position && <p className="mb-0">{position}</p>}
							</div>
						</div>
					)}
				</>
			);
		}

		// Если дошли сюда, значит шаблон для staff не распознан - возвращаем null
		return null;
	}

	// Проверяем обычные шаблоны ПОСЛЕ проверки postType
	if (template === 'card') {
		// Card template
		return (
			<article className="h-100 mb-6">
				<div className="card shadow-lg d-flex flex-column h-100">
					<figure className={figureClassString}>
						<a
							href={isEditor ? '#' : postLink}
							onClick={
								isEditor ? (e) => e.preventDefault() : undefined
							}
						>
							<img src={imageUrl} alt={post.alt || postTitle} />
						</a>
						{renderFigcaption()}
					</figure>
					<div className="card-body p-6">
						<div className="post-header">
							<div className="post-category">
								<a
									href={isEditor ? '#' : postLink}
									className="hover"
									rel="category"
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
									{__(
										'Category',
										'codeweber-gutenberg-blocks'
									)}
								</a>
							</div>
							<h2 className="post-title h3 mt-1 mb-3">
								<a
									className="link-dark"
									href={isEditor ? '#' : postLink}
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
									{titleLimited}
								</a>
							</h2>
						</div>
						<div className="post-footer mt-auto">
							<ul className="post-meta d-flex mb-0">
								<li className="post-date">
									<i className="uil uil-calendar-alt"></i>
									<span>
										{__(
											'Date',
											'codeweber-gutenberg-blocks'
										)}
									</span>
								</li>
								<li className="post-comments">
									<a
										href={
											isEditor
												? '#'
												: postLink + '#comments'
										}
										onClick={
											isEditor
												? (e) => e.preventDefault()
												: undefined
										}
									>
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
		const excerptLimited =
			descriptionLimited.length > 116
				? descriptionLimited.substring(0, 116) + '...'
				: descriptionLimited;
		return (
			<article className="h-100 mb-6">
				<div className="card d-flex flex-column h-100">
					<figure className={figureClassString + ' hover-scale'}>
						<a
							href={isEditor ? '#' : postLink}
							onClick={
								isEditor ? (e) => e.preventDefault() : undefined
							}
						>
							<img src={imageUrl} alt={post.alt || postTitle} />
							<span className="bg"></span>
						</a>
						{renderFigcaption()}
					</figure>
					<div className="card-body">
						<div className="post-header">
							<div className="post-category text-line">
								<a
									href={isEditor ? '#' : postLink}
									className="hover"
									rel="category"
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
									{__(
										'Category',
										'codeweber-gutenberg-blocks'
									)}
								</a>
							</div>
							<h2 className="post-title h3 mt-1 mb-3">
								<a
									className="link-dark"
									href={isEditor ? '#' : postLink}
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
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
								<span>
									{__('Date', 'codeweber-gutenberg-blocks')}
								</span>
							</li>
							<li className="post-comments">
								<a
									href={
										isEditor ? '#' : postLink + '#comments'
									}
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
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
				<a
					href={isEditor ? '#' : postLink}
					className="card-link d-block text-decoration-none d-flex flex-column h-100 lift"
					onClick={isEditor ? (e) => e.preventDefault() : undefined}
				>
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
								<span>
									{__('Date', 'codeweber-gutenberg-blocks')}
								</span>
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
		const excerptLimited =
			descriptionLimited.length > 116
				? descriptionLimited.substring(0, 116) + '...'
				: descriptionLimited;
		return (
			<article>
				<div className="post-col">
					<figure
						className={
							'post-figure ' +
							figureClassString +
							' hover-scale mb-5'
						}
					>
						<a
							href={isEditor ? '#' : postLink}
							onClick={
								isEditor ? (e) => e.preventDefault() : undefined
							}
						>
							<img
								src={imageUrl}
								alt={post.alt || postTitle}
								className="post-image"
							/>
							<div className="caption-wrapper p-7">
								<div className="caption bg-matte-color mt-auto label-u text-neutral-50 px-4 py-2">
									{__(
										'Category',
										'codeweber-gutenberg-blocks'
									)}
								</div>
							</div>
							<span className="bg"></span>
						</a>
						{renderFigcaption()}
					</figure>
					<div className="post-body mt-4">
						<div className="post-meta d-flex mb-3 fs-16 justify-content-between">
							<span className="post-date">
								{__('Date', 'codeweber-gutenberg-blocks')}
							</span>
							<a
								href={isEditor ? '#' : postLink + '#comments'}
								className="post-comments"
								onClick={
									isEditor
										? (e) => e.preventDefault()
										: undefined
								}
							>
								<i className="uil uil-comment"></i>
								{__('0', 'codeweber-gutenberg-blocks')}
							</a>
						</div>
						<h3 className="post-title h4" title={postTitle}>
							<a
								className="link-dark"
								href={isEditor ? '#' : postLink}
								onClick={
									isEditor
										? (e) => e.preventDefault()
										: undefined
								}
							>
								{titleLimited}
							</a>
						</h3>
						{excerptLimited && (
							<div className="body-l-l mb-4 post-excerpt">
								{excerptLimited}
							</div>
						)}
						<a
							href={isEditor ? '#' : postLink}
							className="hover-8 link-body label-s text-charcoal-blue me-4 post-read-more"
							onClick={
								isEditor ? (e) => e.preventDefault() : undefined
							}
						>
							{__('Read more', 'codeweber-gutenberg-blocks')}
						</a>
					</div>
				</div>
			</article>
		);
	} else if (template === 'overlay-5') {
		// Overlay-5 template
		const excerptLimited =
			descriptionLimited.length > 116
				? descriptionLimited.substring(0, 113) + '...'
				: descriptionLimited;
		const overlay5Classes = `overlay overlay-5 hover-scale ${borderRadius || 'rounded'}`;

		return (
			<article>
				<figure className={overlay5Classes}>
					<a
						href={isEditor ? '#' : postLink}
						onClick={
							isEditor ? (e) => e.preventDefault() : undefined
						}
					>
						<div className="bottom-overlay post-meta fs-16 justify-content-between position-absolute zindex-1 d-flex flex-column h-100 w-100 p-5">
							<div className="d-flex w-100 justify-content-end"></div>
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
								<a
									href={isEditor ? '#' : postLink}
									className="hover-8 link-body label-s text-charcoal-blue me-4 post-read-more"
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
									{__(
										'Read more',
										'codeweber-gutenberg-blocks'
									)}
								</a>
							</div>
						</div>
					</figcaption>
				</figure>
			</article>
		);
	} else if (template === 'document-card') {
		// Document Card template - на основе overlay-5, но с кнопкой загрузки
		const excerptLimited =
			descriptionLimited.length > 116
				? descriptionLimited.substring(0, 113) + '...'
				: descriptionLimited;
		const documentCardClasses = `overlay overlay-5 ${borderRadius || 'rounded'}`;

		// Получаем URL файла документа (если есть в данных поста)
		const documentFileUrl =
			post.documentFile || post.meta?.document_file || '';
		const documentFileName = documentFileUrl
			? documentFileUrl.split('/').pop()
			: '';

		return (
			<article>
				<figure className={documentCardClasses}>
					<a
						href={isEditor ? '#' : postLink}
						onClick={
							isEditor ? (e) => e.preventDefault() : undefined
						}
					>
						<div className="bottom-overlay post-meta fs-16 justify-content-between position-absolute zindex-1 d-flex flex-column h-100 w-100 p-5">
							<div className="d-flex w-100 justify-content-end"></div>
							<h2 className="h5 mb-0">{titleLimited}</h2>
						</div>
						<img
							src={imageUrl}
							alt={post.alt || postTitle}
							className={borderRadius || 'rounded'}
						/>
					</a>
					<figcaption className="p-5">
						<div className="post-body from-left">
							{excerptLimited && (
								<p className="mb-3">{excerptLimited}</p>
							)}
							{documentFileUrl ? (
								<a
									href={documentFileUrl}
									download={documentFileName}
									target="_blank"
									className="btn btn-primary btn-icon btn-icon-start btn-sm d-flex"
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
									<i className="uil uil-envelope fs-15"></i>
									<span>
										{__(
											'Send to Email',
											'codeweber-gutenberg-blocks'
										)}
									</span>
								</a>
							) : (
								<a
									href={isEditor ? '#' : postLink}
									className="hover-8 link-body label-s text-charcoal-blue me-4 post-read-more"
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
									{__(
										'Read more',
										'codeweber-gutenberg-blocks'
									)}
								</a>
							)}
						</div>
					</figcaption>
				</figure>
			</article>
		);
	} else if (template === 'document-card-download') {
		// Document Card Download template - на основе overlay-5, с AJAX кнопкой загрузки
		const excerptLimited =
			descriptionLimited.length > 116
				? descriptionLimited.substring(0, 113) + '...'
				: descriptionLimited;
		const documentCardClasses = `overlay overlay-5 ${borderRadius || 'rounded'}`;

		// Получаем ID поста для AJAX загрузки
		const postId = post.id || post.ID || '';

		// Получаем URL файла документа (если есть в данных поста)
		const documentFileUrl =
			post.documentFile || post.meta?.document_file || '';

		return (
			<article>
				<figure className={documentCardClasses}>
					<a
						href={isEditor ? '#' : postLink}
						onClick={
							isEditor ? (e) => e.preventDefault() : undefined
						}
					>
						<div className="bottom-overlay post-meta fs-16 justify-content-between position-absolute zindex-1 d-flex flex-column h-100 w-100 p-5">
							<div className="d-flex w-100 justify-content-end"></div>
							<h2 className="h5 mb-0">{titleLimited}</h2>
						</div>
						<img
							src={imageUrl}
							alt={post.alt || postTitle}
							className={borderRadius || 'rounded'}
						/>
					</a>
					<figcaption className="p-5">
						<div className="post-body from-left">
							{excerptLimited && (
								<p className="mb-3">{excerptLimited}</p>
							)}
							{documentFileUrl && postId ? (
								<a
									href="javascript:void(0)"
									className="btn btn-primary btn-icon btn-icon-start btn-sm d-flex"
									data-bs-toggle="download"
									data-value={`doc-${postId}`}
									data-loading-text={__(
										'Loading...',
										'codeweber-gutenberg-blocks'
									)}
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
									<i className="uil uil-import fs-15"></i>
									<span className="ms-1">
										{__(
											'Download',
											'codeweber-gutenberg-blocks'
										)}
									</span>
								</a>
							) : (
								<a
									href={isEditor ? '#' : postLink}
									className="hover-8 link-body label-s text-charcoal-blue me-4 post-read-more"
									onClick={
										isEditor
											? (e) => e.preventDefault()
											: undefined
									}
								>
									{__(
										'Read more',
										'codeweber-gutenberg-blocks'
									)}
								</a>
							)}
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
					<a
						href={isEditor ? '#' : postLink}
						onClick={
							isEditor ? (e) => e.preventDefault() : undefined
						}
					>
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
					<a
						href={isEditor ? '#' : postLink}
						onClick={
							isEditor ? (e) => e.preventDefault() : undefined
						}
					>
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
							<a
								href={isEditor ? '#' : postLink}
								onClick={
									isEditor
										? (e) => e.preventDefault()
										: undefined
								}
							>
								<img
									src={imageUrl}
									alt={post.alt || postTitle}
								/>
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
					<a
						href={isEditor ? '#' : postLink}
						onClick={
							isEditor ? (e) => e.preventDefault() : undefined
						}
					>
						<img src={imageUrl} alt={post.alt || postTitle} />
					</a>
					{renderFigcaption()}
				</figure>
				<div className="post-header">
					<div className="post-category text-line">
						<a
							href={isEditor ? '#' : postLink}
							className="hover"
							rel="category"
							onClick={
								isEditor ? (e) => e.preventDefault() : undefined
							}
						>
							{__('Category', 'codeweber-gutenberg-blocks')}
						</a>
					</div>
					<h2 className="post-title h3 mt-1 mb-3">
						<a
							className="link-dark"
							href={isEditor ? '#' : postLink}
							onClick={
								isEditor ? (e) => e.preventDefault() : undefined
							}
						>
							{titleLimited}
						</a>
					</h2>
				</div>
				<div className="post-footer">
					<ul className="post-meta">
						<li className="post-date">
							<i className="uil uil-calendar-alt"></i>
							<span>
								{__('Date', 'codeweber-gutenberg-blocks')}
							</span>
						</li>
						<li className="post-comments">
							<a
								href={isEditor ? '#' : postLink + '#comments'}
								onClick={
									isEditor
										? (e) => e.preventDefault()
										: undefined
								}
							>
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
