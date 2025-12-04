import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getLightboxAttributes } from '../../utilities/lightbox';

/**
 * ImageRender - компонент для рендеринга изображения в редакторе
 */
export const ImageRender = ({
	image,
	hoverEffect,
	enableEffect,
	effectType,
	overlayType,
	overlayGradient,
	overlayColor,
	tooltipType,
	cursor,
	iconName,
	iconColor,
	captionType,
	captionBg,
	captionPosition,
	captionPadding,
	captionFontSize,
	borderRadius,
	enableLightbox,
	lightboxGallery,
	isEditor = false,
}) => {
	if (!image || !image.url) {
		return null;
	}

	// Формируем классы для figure
	const getFigureClasses = () => {
		const classes = [];

		// Overlay (только для effectType === 'overlay')
		if (enableEffect && effectType === 'overlay' && overlayType && overlayType !== 'none') {
			classes.push('overlay', overlayType);
			
			if (overlayType === 'overlay-2' && overlayColor) {
				classes.push('color');
			}
			
			if (overlayType === 'overlay-3' && overlayGradient) {
				classes.push(`overlay-${overlayGradient}`);
			}
		}

		// Tooltip (только для effectType === 'tooltip')
		if (enableEffect && effectType === 'tooltip' && tooltipType && tooltipType !== 'none') {
			classes.push('itooltip', tooltipType);
		}

		// Hover effect
		if (hoverEffect && hoverEffect !== 'none') {
			classes.push(hoverEffect);
		}

		// Cursor (старый атрибут, оставлен для обратной совместимости)
		if (cursor) {
			classes.push(cursor);
		}

		// Border radius
		if (borderRadius) {
			classes.push(borderRadius);
		}

		return classes.join(' ');
	};

	// Формируем атрибуты для lightbox (используем утилиту)
	const lightboxAttrs = !isEditor 
		? getLightboxAttributes(enableLightbox, lightboxGallery, 'image')
		: {};

	// Формируем title для tooltip
	const getTooltipTitle = () => {
		if (enableEffect && effectType === 'tooltip' && tooltipType && tooltipType !== 'none') {
			// Форматируем title и description как HTML для iTooltip (как в документации темы)
			let html = '';
			const titleText = image.title || image.caption;
			if (titleText) {
				html += `<h5 class="mb-1">${titleText}</h5>`;
			}
			if (image.description) {
				html += `<p class="mb-0">${image.description}</p>`;
			}
			return html;
		}
		return '';
	};

	// Формируем классы для caption
	const getCaptionClasses = () => {
		const bgMap = {
			'white': 'bg-white',
			'dark': 'bg-dark',
			'primary': 'bg-primary',
			'soft-primary': 'bg-soft-primary',
		};

		const positionMap = {
			'bottom-center': 'mx-auto mt-auto',
			'bottom-left': 'me-auto mt-auto',
			'bottom-right': 'ms-auto mt-auto',
			'top-center': 'mx-auto mb-auto',
			'top-left': 'me-auto mb-auto',
			'top-right': 'ms-auto mb-auto',
			'center': 'mx-auto my-auto',
		};

		const classes = ['caption', 'rounded'];
		
		// Padding - парсим формат "y-x" (например "2-3" → py-2 px-3)
		if (captionPadding) {
			const [py, px] = captionPadding.split('-');
			if (py && px) {
				classes.push(`py-${py}`, `px-${px}`);
			}
		}
		
		// Background
		if (captionBg && bgMap[captionBg]) {
			classes.push(bgMap[captionBg]);
			
			// Добавляем text-white для темных фонов (Dark, Primary)
			if (captionBg === 'dark' || captionBg === 'primary') {
				classes.push('text-white');
			}
		}
		
		// Position
		if (captionPosition && positionMap[captionPosition]) {
			classes.push(positionMap[captionPosition]);
		}
		
		return classes.join(' ');
	};

	const figureClasses = getFigureClasses();
	const tooltipTitle = getTooltipTitle();
	const captionClasses = getCaptionClasses();

	// Если это редактор, отключаем клики
	if (isEditor) {
		// Вариант с Caption (как в Image Slider)
		if (enableEffect && effectType === 'caption' && image.caption) {
			return (
				<div className={`caption-image ${hoverEffect && hoverEffect !== 'none' ? hoverEffect : ''} ${borderRadius || ''}`}>
					<a href="#" onClick={(e) => e.preventDefault()}>
						<img src={image.url} alt={image.alt || ''} className={borderRadius || ''} />
					</a>
					<div className="caption-wrapper p-12">
						<div className={`${captionClasses} mb-0 ${captionFontSize || 'h5'}`.trim()}>
							{image.caption}
						</div>
					</div>
				</div>
			);
		}

		// Вариант с иконкой (cursor)
		if (enableEffect && effectType === 'icon' && iconColor) {
			return (
				<figure className={`${figureClasses} cursor-${iconColor}`.trim()}>
					<a href="#" onClick={(e) => e.preventDefault()}>
						<img src={image.url} alt={image.alt || ''} />
					</a>
				</figure>
			);
		}

		// Вариант с Overlay
		if (enableEffect && effectType === 'overlay') {
			return (
				<figure className={figureClasses}>
					<a href="#" onClick={(e) => e.preventDefault()}>
						<img src={image.url} alt={image.alt || ''} />
					</a>
					<span className="bg"></span>
					{overlayType === 'overlay-4' ? (
						<figcaption>
							<div className="from-top mb-0 h5">
								<i className="uil uil-plus mt-5"></i>
							</div>
						</figcaption>
					) : overlayType === 'overlay-2' ? (
						((image.title || image.caption) || image.description) && (
							<figcaption>
								<div className="from-top mb-1 h5">{image.title || image.caption}</div>
								{image.description && <p className="from-bottom mb-0">{image.description}</p>}
							</figcaption>
						)
					) : overlayType === 'overlay-3' ? (
						((image.title || image.caption) || image.description) && (
							<figcaption>
								<div className="from-left mb-1 h5">{image.title || image.caption}</div>
								{image.description && <p className="from-left mb-0">{image.description}</p>}
							</figcaption>
						)
					) : (
						(image.title || image.caption) && (
							<figcaption>
								<div className="from-top mb-0 h5">{image.title || image.caption}</div>
							</figcaption>
						)
					)}
				</figure>
			);
		}

		// Вариант с Tooltip
		if (enableEffect && effectType === 'tooltip') {
			return (
				<figure
					className={figureClasses}
					{...(tooltipTitle && { title: tooltipTitle })}
				>
					<a href="#" onClick={(e) => e.preventDefault()}>
						<img src={image.url} alt={image.alt || ''} />
					</a>
				</figure>
			);
		}

		// Вариант без эффектов или для других типов
		return (
			<figure className={figureClasses}>
				<a href="#" onClick={(e) => e.preventDefault()}>
					<img src={image.url} alt={image.alt || ''} />
				</a>
			</figure>
		);
	}

	// Для фронтенда
	// Вариант с Tooltip
	if (enableEffect && effectType === 'tooltip') {
		return (
			<figure
				className={figureClasses}
				{...(tooltipTitle && { title: tooltipTitle })}
			>
				<a href={image.linkUrl || image.url} {...lightboxAttrs}>
					<img src={image.url} alt={image.alt || ''} />
				</a>
			</figure>
		);
	}

	// Вариант без эффектов или для других типов  
	return (
		<figure className={figureClasses}>
			<a href={image.linkUrl || image.url} {...lightboxAttrs}>
				<img src={image.url} alt={image.alt || ''} />
			</a>
			{overlayType && overlayType !== 'none' && (
				(image.title || image.caption) && (
					<figcaption>
						<div className="from-top mb-0 h5">{image.title || image.caption}</div>
					</figcaption>
				)
			)}
		</figure>
	);
};

/**
 * ImageRenderSave - компонент для сохранения на фронтенд
 */
export const ImageRenderSave = ({
	image,
	hoverEffect,
	enableEffect,
	effectType,
	overlayType,
	overlayGradient,
	overlayColor,
	tooltipType,
	cursor,
	iconName,
	iconColor,
	captionType,
	captionBg,
	captionPosition,
	captionPadding,
	captionFontSize,
	borderRadius,
	enableLightbox,
	lightboxGallery,
}) => {
	if (!image || !image.url) {
		return null;
	}

	// Формируем классы для figure
	const getFigureClasses = () => {
		const classes = [];

		// Overlay (только для effectType === 'overlay')
		if (enableEffect && effectType === 'overlay' && overlayType && overlayType !== 'none') {
			classes.push('overlay', overlayType);
			
			if (overlayType === 'overlay-2' && overlayColor) {
				classes.push('color');
			}
			
			if (overlayType === 'overlay-3' && overlayGradient) {
				classes.push(`overlay-${overlayGradient}`);
			}
		}

		// Tooltip (только для effectType === 'tooltip')
		if (enableEffect && effectType === 'tooltip' && tooltipType && tooltipType !== 'none') {
			classes.push('itooltip', tooltipType);
		}

		// Hover effect
		if (hoverEffect && hoverEffect !== 'none') {
			classes.push(hoverEffect);
		}

		// Cursor (старый атрибут, оставлен для обратной совместимости)
		if (cursor) {
			classes.push(cursor);
		}

		// Border radius
		if (borderRadius) {
			classes.push(borderRadius);
		}

		return classes.join(' ');
	};

	// Формируем атрибуты для lightbox (используем утилиту)
	const lightboxAttrs = getLightboxAttributes(enableLightbox, lightboxGallery, 'image');

	// Формируем title для tooltip
	const getTooltipTitle = () => {
		if (enableEffect && effectType === 'tooltip' && tooltipType && tooltipType !== 'none') {
			// Форматируем title и description как HTML для iTooltip (как в документации темы)
			let html = '';
			const titleText = image.title || image.caption;
			if (titleText) {
				html += `<h5 class="mb-1">${titleText}</h5>`;
			}
			if (image.description) {
				html += `<p class="mb-0">${image.description}</p>`;
			}
			return html;
		}
		return '';
	};

	// Формируем классы для caption
	const getCaptionClasses = () => {
		const bgMap = {
			'white': 'bg-white',
			'dark': 'bg-dark',
			'primary': 'bg-primary',
			'soft-primary': 'bg-soft-primary',
		};

		const positionMap = {
			'bottom-center': 'mx-auto mt-auto',
			'bottom-left': 'me-auto mt-auto',
			'bottom-right': 'ms-auto mt-auto',
			'top-center': 'mx-auto mb-auto',
			'top-left': 'me-auto mb-auto',
			'top-right': 'ms-auto mb-auto',
			'center': 'mx-auto my-auto',
		};

		const classes = ['caption', 'rounded'];
		
		// Padding - парсим формат "y-x" (например "2-3" → py-2 px-3)
		if (captionPadding) {
			const [py, px] = captionPadding.split('-');
			if (py && px) {
				classes.push(`py-${py}`, `px-${px}`);
			}
		}
		
		// Background
		if (captionBg && bgMap[captionBg]) {
			classes.push(bgMap[captionBg]);
			
			// Добавляем text-white для темных фонов (Dark, Primary)
			if (captionBg === 'dark' || captionBg === 'primary') {
				classes.push('text-white');
			}
		}
		
		// Position
		if (captionPosition && positionMap[captionPosition]) {
			classes.push(positionMap[captionPosition]);
		}
		
		return classes.join(' ');
	};

	const figureClasses = getFigureClasses();
	const tooltipTitle = getTooltipTitle();
	const captionClasses = getCaptionClasses();

	// Вариант с Caption (как в Image Slider)
	if (enableEffect && effectType === 'caption' && image.caption) {
		return (
			<div className={`caption-image ${hoverEffect && hoverEffect !== 'none' ? hoverEffect : ''} ${borderRadius || ''}`}>
				<a href={image.linkUrl || image.url} {...lightboxAttrs}>
					<img src={image.url} alt={image.alt || ''} className={borderRadius || ''} />
				</a>
				<div className="caption-wrapper p-12">
					<div className={`${captionClasses} mb-0 ${captionFontSize || 'h5'}`.trim()}>
						{image.caption}
					</div>
				</div>
			</div>
		);
	}

	// Вариант с иконкой (cursor)
	if (enableEffect && effectType === 'icon' && iconColor) {
		return (
			<figure className={`${figureClasses} cursor-${iconColor}`.trim()}>
				<a href={image.linkUrl || image.url} {...lightboxAttrs}>
					<img src={image.url} alt={image.alt || ''} />
				</a>
			</figure>
		);
	}

	// Вариант с Overlay
	if (enableEffect && effectType === 'overlay') {
		return (
			<figure className={figureClasses}>
				<a href={image.linkUrl || image.url} {...lightboxAttrs}>
					<img src={image.url} alt={image.alt || ''} />
				</a>
				{overlayType === 'overlay-4' ? (
					<figcaption>
						<div className="from-top mb-0 h5">
							<i className="uil uil-plus mt-5"></i>
						</div>
					</figcaption>
				) : overlayType === 'overlay-2' ? (
					((image.title || image.caption) || image.description) && (
						<figcaption>
							<div className="from-top mb-1 h5">{image.title || image.caption}</div>
							{image.description && <p className="from-bottom mb-0">{image.description}</p>}
						</figcaption>
					)
				) : overlayType === 'overlay-3' ? (
					((image.title || image.caption) || image.description) && (
						<figcaption>
							<div className="from-left mb-1 h5">{image.title || image.caption}</div>
							{image.description && <p className="from-left mb-0">{image.description}</p>}
						</figcaption>
					)
				) : (
					(image.title || image.caption) && (
						<figcaption>
							<div className="from-top mb-0 h5">{image.title || image.caption}</div>
						</figcaption>
					)
				)}
			</figure>
		);
	}

	// Вариант с Tooltip
	if (enableEffect && effectType === 'tooltip') {
		return (
			<figure
				className={figureClasses}
				{...(tooltipTitle && { title: tooltipTitle })}
			>
				<a href={image.linkUrl || image.url} {...lightboxAttrs}>
					<img src={image.url} alt={image.alt || ''} />
				</a>
			</figure>
		);
	}

	// Вариант без эффектов или для других типов
	return (
		<figure className={figureClasses}>
			<a href={image.linkUrl || image.url} {...lightboxAttrs}>
				<img src={image.url} alt={image.alt || ''} />
			</a>
		</figure>
	);
};

