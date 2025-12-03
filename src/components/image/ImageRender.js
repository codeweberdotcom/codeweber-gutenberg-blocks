import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * ImageRender - компонент для рендеринга изображения в редакторе
 */
export const ImageRender = ({
	image,
	hoverEffect,
	overlayType,
	overlayGradient,
	overlayColor,
	tooltipType,
	cursor,
	captionType,
	captionBg,
	captionPosition,
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

		// Overlay
		if (overlayType && overlayType !== 'none') {
			classes.push('overlay', overlayType);
			
			if (overlayType === 'overlay-2' && overlayColor) {
				classes.push('color');
			}
			
			if (overlayType === 'overlay-3' && overlayGradient) {
				classes.push(`overlay-${overlayGradient}`);
			}
		}

		// Tooltip
		if (tooltipType && tooltipType !== 'none') {
			classes.push('itooltip', tooltipType);
		}

		// Hover effect
		if (hoverEffect && hoverEffect !== 'none') {
			classes.push(hoverEffect);
		}

		// Cursor
		if (cursor) {
			classes.push(cursor);
		}

		// Border radius
		if (borderRadius) {
			classes.push(borderRadius);
		}

		return classes.join(' ');
	};

	// Формируем атрибуты для lightbox
	const getLightboxAttributes = () => {
		if (!enableLightbox || isEditor) {
			return {};
		}

		const attrs = {
			'data-glightbox': 'image',
		};

		if (lightboxGallery) {
			attrs['data-gallery'] = lightboxGallery;
		}

		return attrs;
	};

	// Формируем title для tooltip
	const getTooltipTitle = () => {
		if (tooltipType && tooltipType !== 'none' && image.caption) {
			return image.caption;
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

		const classes = ['caption', 'rounded', 'px-4', 'py-3'];
		
		if (captionBg && bgMap[captionBg]) {
			classes.push(bgMap[captionBg]);
		}

		if (captionPosition && positionMap[captionPosition]) {
			classes.push(positionMap[captionPosition]);
		}

		return classes.join(' ');
	};

	const figureClasses = getFigureClasses();
	const lightboxAttrs = getLightboxAttributes();
	const tooltipTitle = getTooltipTitle();
	const captionClasses = getCaptionClasses();

	// Если это редактор, отключаем клики
	if (isEditor) {
		// Вариант с Caption (как в Image Slider)
		if (captionType !== 'none' && image.caption) {
			return (
				<div className={`caption-image ${hoverEffect && hoverEffect !== 'none' ? hoverEffect : ''} ${borderRadius || ''}`} style={{ cursor: 'default', pointerEvents: 'none' }}>
					<img src={image.url} alt={image.alt || ''} className={borderRadius || ''} />
					<div className="caption-wrapper p-12">
						<div className={captionClasses}>
							<h5 className="mb-0">{image.caption}</h5>
						</div>
					</div>
				</div>
			);
		}

		// Вариант с Overlay
		return (
			<figure
				className={figureClasses}
				title={tooltipTitle}
			>
				<div style={{ position: 'relative', cursor: 'default', pointerEvents: 'none' }}>
					<img src={image.url} alt={image.alt || ''} />
					{overlayType && overlayType !== 'none' && (
						<span className="bg"></span>
					)}
				</div>
				{overlayType && overlayType !== 'none' && image.caption && (
					<figcaption>
						<h5 className="from-top mb-0">{image.caption}</h5>
					</figcaption>
				)}
			</figure>
		);
	}

	// Для фронтенда
	return (
		<figure
			className={figureClasses}
			title={tooltipTitle}
		>
			<a href={image.linkUrl || image.url} {...lightboxAttrs}>
				<img src={image.url} alt={image.alt || ''} />
			</a>
			{overlayType && overlayType !== 'none' && (
				<>
					<span className="bg"></span>
					{image.caption && (
						<figcaption>
							<h5 className="from-top mb-0">{image.caption}</h5>
						</figcaption>
					)}
				</>
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
	overlayType,
	overlayGradient,
	overlayColor,
	tooltipType,
	cursor,
	captionType,
	captionBg,
	captionPosition,
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

		// Overlay
		if (overlayType && overlayType !== 'none') {
			classes.push('overlay', overlayType);
			
			if (overlayType === 'overlay-2' && overlayColor) {
				classes.push('color');
			}
			
			if (overlayType === 'overlay-3' && overlayGradient) {
				classes.push(`overlay-${overlayGradient}`);
			}
		}

		// Tooltip
		if (tooltipType && tooltipType !== 'none') {
			classes.push('itooltip', tooltipType);
		}

		// Hover effect
		if (hoverEffect && hoverEffect !== 'none') {
			classes.push(hoverEffect);
		}

		// Cursor
		if (cursor) {
			classes.push(cursor);
		}

		// Border radius
		if (borderRadius) {
			classes.push(borderRadius);
		}

		return classes.join(' ');
	};

	// Формируем атрибуты для lightbox
	const getLightboxAttributes = () => {
		if (!enableLightbox) {
			return {};
		}

		const attrs = {
			'data-glightbox': 'image',
		};

		if (lightboxGallery) {
			attrs['data-gallery'] = lightboxGallery;
		}

		return attrs;
	};

	// Формируем title для tooltip
	const getTooltipTitle = () => {
		if (tooltipType && tooltipType !== 'none' && image.caption) {
			return image.caption;
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

		const classes = ['caption', 'rounded', 'px-4', 'py-3'];
		
		if (captionBg && bgMap[captionBg]) {
			classes.push(bgMap[captionBg]);
		}

		if (captionPosition && positionMap[captionPosition]) {
			classes.push(positionMap[captionPosition]);
		}

		return classes.join(' ');
	};

	const figureClasses = getFigureClasses();
	const lightboxAttrs = getLightboxAttributes();
	const tooltipTitle = getTooltipTitle();
	const captionClasses = getCaptionClasses();

	// Вариант с Caption (как в Image Slider)
	if (captionType !== 'none' && image.caption) {
		return (
			<div className={`caption-image ${hoverEffect && hoverEffect !== 'none' ? hoverEffect : ''} ${borderRadius || ''}`}>
				<a href={image.linkUrl || image.url} {...lightboxAttrs}>
					<img src={image.url} alt={image.alt || ''} className={borderRadius || ''} />
				</a>
				<div className="caption-wrapper p-12">
					<div className={captionClasses}>
						<h5 className="mb-0">{image.caption}</h5>
					</div>
				</div>
			</div>
		);
	}

	// Вариант с Overlay
	return (
		<figure
			className={figureClasses || undefined}
			title={tooltipTitle || undefined}
		>
			<a href={image.linkUrl || image.url} {...lightboxAttrs}>
				<img src={image.url} alt={image.alt || ''} />
			</a>
			{overlayType && overlayType !== 'none' && (
				<>
					<span className="bg"></span>
					{image.caption && (
						<figcaption>
							<h5 className="from-top mb-0">{image.caption}</h5>
						</figcaption>
					)}
				</>
			)}
		</figure>
	);
};

