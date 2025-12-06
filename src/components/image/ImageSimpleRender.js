/**
 * ImageSimpleRender - рендеринг изображения с hover эффектами
 * Используется в блоке Image Simple
 */
import { getLightboxAttributes } from '../../utilities/lightbox';
import { getImageHoverClasses, getTooltipTitle } from '../image-hover/ImageHoverControl';
import { getImageUrl } from '../../utilities/image-url';

export const ImageSimpleRender = ({
	image,
	borderRadius,
	enableLightbox,
	lightboxGallery,
	imageSize = 'full',
	// Новые атрибуты для hover эффектов
	simpleEffect,
	effectType,
	tooltipStyle,
	overlayStyle,
	overlayGradient,
	overlayColor,
	cursorStyle,
	isEditor = false,
}) => {
	if (!image) {
		return null;
	}
	
	// Если URL пустой, используем placeholder
	if (!image.url) {
		image.url = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
	}

	// Получаем URL нужного размера
	const imageUrl = getImageUrl(image, imageSize);

	// Получаем атрибуты lightbox через утилиту
	const lightboxAttrs = !isEditor 
		? getLightboxAttributes(enableLightbox, lightboxGallery, 'image')
		: {};

	// Получаем классы hover эффектов
	const hoverClasses = getImageHoverClasses({
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
	});

	// Формируем финальные классы
	const figureClasses = `${hoverClasses} ${borderRadius || ''}`.trim();

	// Получаем title для tooltip
	const tooltipTitle = getTooltipTitle(image, effectType);

	// Определяем href и обработчик клика в зависимости от контекста
	const href = isEditor ? '#' : (image.linkUrl || image.url);
	const onClickHandler = isEditor ? (e) => e.preventDefault() : undefined;

	// Единая верстка для редактора и фронтенда
	// Tooltip вариант
	if (effectType === 'tooltip' && tooltipTitle) {
		return (
			<figure className={figureClasses} title={tooltipTitle}>
				<a href={href} onClick={onClickHandler} {...lightboxAttrs}>
					<img src={imageUrl} alt={image.alt || ''} />
				</a>
			</figure>
		);
	}

	// Overlay вариант
	if (effectType === 'overlay') {
		return (
			<figure className={figureClasses}>
				<a href={href} onClick={onClickHandler} {...lightboxAttrs}>
					<img src={imageUrl} alt={image.alt || ''} />
				</a>
				{overlayStyle === 'overlay-4' ? (
					<figcaption>
						<div className="from-top mb-0 h2">
							<span className="mt-5">+</span>
						</div>
					</figcaption>
				) : overlayStyle === 'overlay-2' ? (
					(image.title || image.caption || image.description) && (
						<figcaption>
							<h5 className="from-top mb-1">{image.title || image.caption}</h5>
							{image.description && <p className="from-bottom mb-0">{image.description}</p>}
						</figcaption>
					)
				) : overlayStyle === 'overlay-3' ? (
					(image.title || image.caption || image.description) && (
						<figcaption>
							<h5 className="from-left mb-1">{image.title || image.caption}</h5>
							{image.description && <p className="from-left mb-0">{image.description}</p>}
						</figcaption>
					)
				) : (
					(image.title || image.caption) && (
						<figcaption>
							<h5 className="from-top mb-0">{image.title || image.caption}</h5>
						</figcaption>
					)
				)}
			</figure>
		);
	}

	// Простой вариант (cursor, none или только simple эффекты)
	return (
		<figure className={figureClasses}>
			<a href={href} onClick={onClickHandler} {...lightboxAttrs}>
				<img src={imageUrl} alt={image.alt || ''} />
			</a>
		</figure>
	);
};

