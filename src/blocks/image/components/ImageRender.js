import { getLightboxAttributes } from '../../../utilities/lightbox';
import { getImageHoverClasses, getTooltipTitle } from '../../../components/image-hover/ImageHoverControl';
import { getImageUrl } from '../../../utilities/image-url';

export const ImageRender = ({ attributes, isEditor = false }) => {
	const {
		image,
		imageSize,
		imageMask,
		borderRadius,
		enableLightbox,
		lightboxGallery,
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
	} = attributes;

	if (!image || !image.url) {
		return null;
	}

	// Получаем URL нужного размера
	const imageUrl = getImageUrl(image, imageSize);

	// Получаем классы hover эффектов
	const hoverClasses = getImageHoverClasses(attributes);

	// Получаем tooltip title
	const tooltipTitle = getTooltipTitle(effectType, tooltipStyle, image);

	// Получаем атрибуты lightbox
	const lightboxAttrs = getLightboxAttributes(enableLightbox, lightboxGallery);

	// Определяем href и обработчик клика
	const href = isEditor ? '#' : (enableLightbox ? image.url : '#');
	const onClickHandler = isEditor ? (e) => e.preventDefault() : undefined;

	// Формируем классы figure
	const figureClasses = [
		hoverClasses,
		borderRadius,
	].filter(Boolean).join(' ');

	// Формируем контент изображения
	const imageContent = (
		<img src={imageUrl} alt={image.alt || ''} />
	);

	// Wrapper для маски
	const maskedImage = imageMask && imageMask !== 'none' ? (
		<div className={`img-mask ${imageMask}`}>
			{imageContent}
		</div>
	) : imageContent;

	// Tooltip вариант
	if (effectType === 'tooltip' && tooltipTitle) {
		return (
			<figure className={figureClasses} title={tooltipTitle}>
				<a href={href} onClick={onClickHandler} {...lightboxAttrs}>
					{maskedImage}
				</a>
			</figure>
		);
	}

	// Overlay вариант
	if (effectType === 'overlay') {
		// Определяем текст для overlay
		const overlayText = image.caption || image.title || '';

		// Overlay 4 использует иконку "+"
		if (overlayStyle === 'overlay-4') {
			return (
				<figure className={figureClasses}>
					<a href={href} onClick={onClickHandler} {...lightboxAttrs}>
						{maskedImage}
					</a>
					{overlayText && (
						<figcaption>
							<h2 className="mb-0">+</h2>
						</figcaption>
					)}
				</figure>
			);
		}

		// Остальные overlay стили
		return (
			<figure className={figureClasses}>
				<a href={href} onClick={onClickHandler} {...lightboxAttrs}>
					{maskedImage}
				</a>
				{overlayText && (
					<figcaption>
						<h5 className="from-top mb-0">{overlayText}</h5>
					</figcaption>
				)}
			</figure>
		);
	}

	// Простой вариант (cursor, none или только simple эффекты)
	return (
		<figure className={figureClasses}>
			<a href={href} onClick={onClickHandler} {...lightboxAttrs}>
				{maskedImage}
			</a>
		</figure>
	);
};

