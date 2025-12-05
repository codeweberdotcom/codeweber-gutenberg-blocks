import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getClassNames } from '../button/buttonclass'; // Путь к функции getClassNames

// Функция для обработки иконки
const getIconComponent = (iconClass) => {
	if (!iconClass) return null;
	return <i className={iconClass}></i>;
};

// Generate unique video ID for lightbox
const generateVideoId = (linkUrl, linkType) => {
	const timestamp = Date.now();
	const randomStr = Math.random().toString(36).substring(2, 11);
	const typePrefix = linkType || 'video';
	return `${typePrefix}-${timestamp}-${randomStr}`;
};

const ButtonSave = ({ attributes }) => {
	const {
		anchor,
		LinkUrl,
		LinkType,
		ButtonContent,
		ButtonType,
		ButtonSize,
		SocialIconClass,
		SocialIconStyle,
		DataValue,
		LeftIcon,
		CircleIcon,
		SocialIcon,
		RightIcon,
		DataGlightbox,
		DataGallery,
		DataBsToggle,
		DataBsTarget,
	} = attributes;

	// Генерация класса кнопки
	const buttonClass = getClassNames(attributes);

	// Определение, нужно ли скрывать текст
	const shouldHideText =
		ButtonType === 'play' ||
		ButtonType === 'social' ||
		ButtonType === 'circle';

	// Проверка на наличие значений в новых атрибутах
	const hasGlightbox = DataGlightbox && DataGlightbox.trim() !== '';
	const hasGallery = DataGallery && DataGallery.trim() !== '';
	const hasBsToggle = DataBsToggle && DataBsToggle.trim() !== '';
	const hasBsTarget = DataBsTarget && DataBsTarget.trim() !== '';
	
	// Don't add target="_blank" if using GLightbox (video, image, pdf, iframe) or Bootstrap modals
	const shouldNotOpenInNewTab = hasGlightbox || hasBsToggle;
	
	// Check if this is a video link (VK, Rutube, YouTube, Vimeo)
	const isVideoLink = LinkType === 'vkvideo' || LinkType === 'rutube' || 
	                    LinkType === 'youtube' || LinkType === 'vimeo' ||
	                    (hasGlightbox && DataGlightbox.includes('type: iframe'));
	
	// For video links, create hidden iframe and use anchor link (like Media block)
	let hiddenIframe = null;
	let finalHref = LinkUrl;
	let finalGlightbox = DataGlightbox;
	
	if (isVideoLink && LinkUrl) {
		const videoId = generateVideoId(LinkUrl, LinkType);
		finalHref = `#${videoId}`;
		finalGlightbox = 'width: auto;';
		
		// Create hidden iframe (like in Media block)
		hiddenIframe = (
			<div id={videoId} style={{ display: 'none' }}>
				<iframe
					src={LinkUrl}
					allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write;"
					frameBorder="0"
					allowFullScreen
					style={{ width: '100%', height: '100%', aspectRatio: '16/9' }}
				/>
			</div>
		);
	}
	
	// Build link props manually to have full control
	const linkProps = {
		href: finalHref, // Use anchor link for videos
		className: buttonClass,
		id: anchor || undefined,
		'data-value': DataValue || undefined,
	};
	
	// Add GLightbox attrs (use finalGlightbox for videos)
	if (hasGlightbox || isVideoLink) linkProps['data-glightbox'] = finalGlightbox;
	if (hasGallery) linkProps['data-gallery'] = DataGallery;
	
	// Add Bootstrap attrs
	if (hasBsToggle) linkProps['data-bs-toggle'] = DataBsToggle;
	if (hasBsTarget) linkProps['data-bs-target'] = `#${DataBsTarget}`;
	
	// IMPORTANT: Don't add target/rel for GLightbox links to prevent opening in new tab
	if (!shouldNotOpenInNewTab) {
		linkProps.target = '_blank';
		linkProps.rel = 'noopener';
	}
	// If shouldNotOpenInNewTab is true, we simply don't set target/rel at all

	return (
		<>
			{hiddenIframe}
			{attributes.ButtonType === 'social' ? (
				<nav className={`nav social${attributes.SocialIconStyle === 'style_2' ? ' social-muted' : ''}`}>
					<a
						href={LinkUrl}
						className={
							attributes.SocialIconStyle === 'style_1'
								? `btn btn-circle ${attributes.ButtonSize} btn-${attributes.SocialIconClass}`
								: ''
						}
						data-value={DataValue || undefined}
						{...(hasGlightbox && { 'data-glightbox': DataGlightbox })}
						{...(hasGallery && { 'data-gallery': DataGallery })}
						{...(hasBsToggle && { 'data-bs-toggle': DataBsToggle })}
						{...(hasBsTarget && {
							'data-bs-target': `#${DataBsTarget}`,
						})}
					>
						<i className={`uil uil-${attributes.SocialIconClass}${attributes.SocialIconClass === 'facebook' ? '-f' : ''}`}></i>
					</a>
				</nav>
			) : (
				<a
					href={linkProps.href || undefined}
					className={linkProps.className || undefined}
					id={linkProps.id || undefined}
					data-value={linkProps['data-value'] || undefined}
					data-glightbox={linkProps['data-glightbox'] || undefined}
					data-gallery={linkProps['data-gallery'] || undefined}
					data-bs-toggle={linkProps['data-bs-toggle'] || undefined}
					data-bs-target={linkProps['data-bs-target'] || undefined}
					target={linkProps.target || undefined}
					rel={linkProps.rel || undefined}
				>
					{getIconComponent(LeftIcon)}
					{getIconComponent(CircleIcon)}
					{getIconComponent(SocialIcon)}

					{!shouldHideText && (
						<RichText.Content
							tagName="span"
							value={ButtonContent}
							className="button-content"
						/>
					)}

					{getIconComponent(RightIcon)}
				</a>
			)}
		</>
	);
};

export default ButtonSave;


