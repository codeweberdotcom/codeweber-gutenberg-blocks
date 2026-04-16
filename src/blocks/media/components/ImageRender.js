import { getLightboxAttributes } from '../../../utilities/lightbox';
import {
	getImageHoverClasses,
	getTooltipTitle,
} from '../../../components/image-hover/ImageHoverControl';
import { getImageUrl } from '../../../utilities/image-url';

export const ImageRender = ({ attributes, isEditor = false }) => {
	const {
		image,
		imageSize,
		imageMask,
		borderRadius,
		enableLightbox,
		lightboxGallery,
		lightboxShowDesc,
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		overlayIconColor = 'bg-frost',
		cursorStyle,
	} = attributes;

	if (!image || !image.url) {
		return null;
	}

	// Получаем URL нужного размера
	const imageUrl = getImageUrl(image, imageSize);

	// Overlay эффекты отключены если лайтбокс выключен
	const activeEffectType = (!enableLightbox && !isEditor && effectType === 'overlay') ? 'none' : effectType;

	// Получаем классы hover эффектов
	const hoverClasses = getImageHoverClasses({ ...attributes, effectType: activeEffectType });

	// Получаем tooltip title
	const tooltipTitle = getTooltipTitle(effectType, tooltipStyle, image);

	// Получаем атрибуты lightbox
	const lbTitle = lightboxShowDesc ? image.title || '' : '';
	const lbDesc = lightboxShowDesc ? image.description || '' : '';
	const lightboxAttrs = getLightboxAttributes(
		enableLightbox,
		lightboxGallery,
		'image',
		lbTitle,
		lbDesc
	);

	// Определяем href и обработчик клика
	const lightboxUrl = getImageUrl(image, 'codeweber_extralarge');
	const href = enableLightbox && !isEditor ? lightboxUrl : '#';
	const onClickHandler = (e) => {
		if (isEditor) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	// Формируем классы figure
	const figureClasses = [hoverClasses, borderRadius]
		.filter(Boolean)
		.join(' ');

	// Формируем контент изображения
	const imageContent = <img src={imageUrl} alt={image.alt || ''} />;

	// Wrapper для маски
	const maskedImage =
		imageMask && imageMask !== 'none' ? (
			<div className={`img-mask ${imageMask}`}>{imageContent}</div>
		) : (
			imageContent
		);

	// Стили для отключения кликабельности в редакторе
	const linkStyle = isEditor
		? { pointerEvents: 'none', cursor: 'default' }
		: undefined;

	// Tooltip вариант
	if (effectType === 'tooltip' && tooltipTitle) {
		return (
			<figure className={figureClasses} title={tooltipTitle}>
				<a
					href={href}
					onClick={onClickHandler}
					{...lightboxAttrs}
					style={linkStyle}
				>
					{maskedImage}
				</a>
			</figure>
		);
	}

	// Overlay вариант
	if (activeEffectType === 'overlay') {
		// Определяем текст для overlay
		const overlayText = image.caption || image.title || '';

		// Overlay 6: hover-overlay with frost icon
		if (overlayStyle === 'overlay-6') {
			return (
				<figure className={figureClasses}>
					<a
						href={href}
						onClick={onClickHandler}
						{...lightboxAttrs}
						style={linkStyle}
					>
						{maskedImage}
						<span
							className={`hover-icon ${overlayIconColor || 'bg-frost'} text-white`}
						>
							<svg
								fill="currentColor"
								viewBox="0 0 256 256"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M220,128a4.0002,4.0002,0,0,1-4,4H132v84a4,4,0,0,1-8,0V132H40a4,4,0,0,1,8,0v84h84A4.0002,4.0002,0,0,1,220,128Z"></path>
							</svg>
						</span>
					</a>
				</figure>
			);
		}

		// Overlay 7: item-link button
		if (overlayStyle === 'overlay-7') {
			return (
				<figure className={figureClasses}>
					{maskedImage}
					{!isEditor && enableLightbox && (
						<a
							className="item-link"
							href={lightboxUrl}
							{...lightboxAttrs}
							style={linkStyle}
						>
							<i className="uil uil-plus"></i>
						</a>
					)}
				</figure>
			);
		}

		// Overlay 5: plus icon inside <a>
		if (overlayStyle === 'overlay-5') {
			return (
				<figure className={figureClasses}>
					<a
						href={href}
						onClick={onClickHandler}
						{...lightboxAttrs}
						style={linkStyle}
					>
						{maskedImage}
						<span className="hover-icon text-white">
							<svg
								fill="currentColor"
								viewBox="0 0 256 256"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M220,128a4.0002,4.0002,0,0,1-4,4H132v84a4,4,0,0,1-8,0V132H40a4,4,0,0,1,0-8h84V40a4,4,0,0,1,8,0v84h84A4.0002,4.0002,0,0,1,220,128Z"></path>
							</svg>
						</span>
					</a>
				</figure>
			);
		}

		// Overlay 4 использует иконку "+"
		if (overlayStyle === 'overlay-4') {
			return (
				<figure className={figureClasses}>
					<a
						href={href}
						onClick={onClickHandler}
						{...lightboxAttrs}
						style={linkStyle}
					>
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
				<a
					href={href}
					onClick={onClickHandler}
					{...lightboxAttrs}
					style={linkStyle}
				>
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
	if (!enableLightbox && !isEditor) {
		return <figure className={figureClasses}>{maskedImage}</figure>;
	}

	return (
		<figure className={figureClasses}>
			<a
				href={href}
				onClick={onClickHandler}
				{...lightboxAttrs}
				style={linkStyle}
			>
				{maskedImage}
			</a>
		</figure>
	);
};
