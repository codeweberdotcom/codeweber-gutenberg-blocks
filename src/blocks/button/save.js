import { useBlockProps, RichText } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { getClassNames } from '../button/buttonclass'; // Путь к функции getClassNames

// Функция для обработки иконки
const getIconComponent = (iconClass) => {
	if (!iconClass) return null;
	return <i className={iconClass}></i>;
};

// Font-size for social icon when Style 2/3 — как в теме .btn-circle (theme _buttons.scss)
const getSocialIconSizeRem = (buttonSize) => {
	const map = {
		'btn-xs': '0.7rem',
		'btn-sm': '0.85rem',
		'': '1rem',
		'btn-lg': '1.4rem',
		'btn-elg': '1.6rem',
	};
	return map[buttonSize] || '1rem';
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
		PostId,
		PostType,
		PageId,
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
		blockClass,
		blockId,
		blockData,
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

	// Add target="_blank" only for external links, all other types open on the same page
	const isExternalLink = LinkType === 'external';
	const shouldOpenInNewTab = isExternalLink && !hasGlightbox && !hasBsToggle;

	// Check if this is a video link (VK, Rutube, YouTube, Vimeo)
	const isVideoLink =
		LinkType === 'vkvideo' ||
		LinkType === 'rutube' ||
		LinkType === 'youtube' ||
		LinkType === 'vimeo' ||
		(hasGlightbox && DataGlightbox.includes('type: iframe'));

	// For video links, create hidden iframe and use anchor link (like Media block)
	let hiddenIframe = null;
	let finalHref = LinkUrl;
	let finalGlightbox = DataGlightbox;

	// Если LinkType === 'post' и LinkUrl пустой, но есть PostId, формируем URL из PostId
	if (
		LinkType === 'post' &&
		(!LinkUrl || LinkUrl === '#' || LinkUrl === '') &&
		PostId
	) {
		// Формируем URL по ID записи (это fallback, в идеале LinkUrl должен быть заполнен)
		// Но на фронтенде мы не можем использовать get_permalink, поэтому формируем простой URL
		// В реальности WordPress автоматически обработает такой URL
		if (PostType === 'page') {
			finalHref = `?page_id=${PostId}`;
		} else if (PostType === 'post') {
			finalHref = `?p=${PostId}`;
		} else if (PostType) {
			finalHref = `?post_type=${PostType}&p=${PostId}`;
		} else {
			finalHref = `?p=${PostId}`;
		}
	}

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
					style={{
						width: '100%',
						height: '100%',
						aspectRatio: '16/9',
					}}
				/>
			</div>
		);
	}

	// Parse data attributes from blockData
	const getDataAttributes = () => {
		const dataAttrs = {};
		if (blockData) {
			blockData.split(',').forEach((pair) => {
				const [key, value] = pair.split('=').map((s) => s.trim());
				if (key && value) {
					dataAttrs[`data-${key}`] = value;
				}
			});
		}
		return dataAttrs;
	};

	const dataAttributes = getDataAttributes();

	// Normalize blockId (remove # if present); don't output id when empty to avoid duplicate ids
	const normalizeButtonId = (value = '') => value.replace(/^#/, '').trim();
	const buttonId =
		(normalizeButtonId(blockId) || anchor || '').trim() || undefined;

	// Build link props manually to have full control
	const linkProps = {
		href: finalHref, // Use anchor link for videos
		className: buttonClass,
		...(buttonId && { id: buttonId }),
		'data-value': DataValue || undefined,
		...dataAttributes,
	};

	// Add GLightbox attrs (use finalGlightbox for videos)
	if (hasGlightbox || isVideoLink)
		linkProps['data-glightbox'] = finalGlightbox;
	if (hasGallery) linkProps['data-gallery'] = DataGallery;

	// Add Bootstrap attrs
	if (hasBsToggle) linkProps['data-bs-toggle'] = DataBsToggle;
	if (hasBsTarget) {
		// Если DataBsTarget уже содержит #, не добавляем его повторно
		// Если DataBsTarget равен "modal", добавляем #
		const target = DataBsTarget.startsWith('#')
			? DataBsTarget
			: `#${DataBsTarget}`;
		linkProps['data-bs-target'] = target;
	}

	// Add target="_blank" only for external links
	if (shouldOpenInNewTab) {
		linkProps.target = '_blank';
		linkProps.rel = 'noopener noreferrer';
	}

	return (
		<>
			{hiddenIframe}
			{attributes.ButtonType === 'social' ? (
				<a
					href={LinkUrl}
					className={[
						attributes.SocialIconStyle === 'style_1' && [
							'btn',
							'btn-circle',
							'has-ripple',
							attributes.ButtonSize,
							attributes.SocialIconClass && `btn-${attributes.SocialIconClass}`,
							blockClass,
						].filter(Boolean).join(' '),
						attributes.SocialIconStyle !== 'style_1' && [blockClass, 'has-ripple'].filter(Boolean).join(' '),
					].filter(Boolean).join(' ') || undefined}
					{...(buttonId && { id: buttonId })}
					data-value={DataValue || undefined}
					{...(hasGlightbox && {
						'data-glightbox': DataGlightbox,
					})}
					{...(hasGallery && { 'data-gallery': DataGallery })}
					{...(hasBsToggle && { 'data-bs-toggle': DataBsToggle })}
					{...(hasBsTarget && {
						'data-bs-target': `#${DataBsTarget}`,
					})}
					{...dataAttributes}
				>
					<i
						className={`uil uil-${
							attributes.SocialIconClass === 'facebook'
								? 'facebook-f'
								: attributes.SocialIconClass === 'vkmusic'
									? 'vk-music'
									: attributes.SocialIconClass
						}`}
						style={
							attributes.SocialIconStyle === 'style_2' ||
							attributes.SocialIconStyle === 'style_3'
								? { fontSize: getSocialIconSizeRem(attributes.ButtonSize) }
								: undefined
						}
					></i>
				</a>
			) : (
				<a
					href={linkProps.href || undefined}
					className={linkProps.className || undefined}
					{...(linkProps.id && { id: linkProps.id })}
					data-value={linkProps['data-value'] || undefined}
					data-glightbox={linkProps['data-glightbox'] || undefined}
					data-gallery={linkProps['data-gallery'] || undefined}
					data-bs-toggle={linkProps['data-bs-toggle'] || undefined}
					data-bs-target={linkProps['data-bs-target'] || undefined}
					target={linkProps.target || undefined}
					rel={linkProps.rel || undefined}
				>
					{ButtonType === 'icon' &&
					(attributes.ButtonStyle === 'gradient' ||
						attributes.ButtonStyle === 'outline-gradient')
						? LeftIcon && <span>{getIconComponent(LeftIcon)}</span>
						: getIconComponent(LeftIcon)}
					{ButtonType === 'circle' &&
					(attributes.ButtonStyle === 'gradient' ||
						attributes.ButtonStyle === 'outline-gradient') ? (
						<span>{getIconComponent(CircleIcon)}</span>
					) : (
						getIconComponent(CircleIcon)
					)}
					{getIconComponent(SocialIcon)}

					{!shouldHideText && ButtonType === 'expand' && (
						<span>
							<RawHTML>{ButtonContent}</RawHTML>
						</span>
					)}
					{!shouldHideText &&
						ButtonType !== 'expand' &&
						attributes.ButtonStyle === 'outline-gradient' && (
							<span>
								<RawHTML>{ButtonContent}</RawHTML>
							</span>
						)}
					{!shouldHideText &&
						ButtonType !== 'expand' &&
						attributes.ButtonStyle !== 'outline-gradient' && (
							<RawHTML>{ButtonContent}</RawHTML>
						)}

					{ButtonType === 'icon' &&
					(attributes.ButtonStyle === 'gradient' ||
						attributes.ButtonStyle === 'outline-gradient')
						? RightIcon && <span>{getIconComponent(RightIcon)}</span>
						: getIconComponent(RightIcon)}
				</a>
			)}
		</>
	);
};

export default ButtonSave;
