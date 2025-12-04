/**
 * ImageSimpleRender - простой рендеринг изображения без эффектов
 * Используется в блоке Image Simple
 */
export const ImageSimpleRender = ({
	image,
	borderRadius,
	enableLightbox,
	lightboxGallery,
	isEditor = false,
}) => {
	if (!image || !image.url) {
		return null;
	}

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

	const lightboxAttrs = getLightboxAttributes();
	const figureClasses = borderRadius || '';

	// Для редактора - отключаем клики
	if (isEditor) {
		if (enableLightbox) {
			return (
				<figure className={figureClasses}>
					<a href="#" onClick={(e) => e.preventDefault()}>
						<img src={image.url} alt={image.alt || ''} />
					</a>
				</figure>
			);
		}
		
		// Без lightbox - без тега <a>
		return (
			<figure className={figureClasses}>
				<img src={image.url} alt={image.alt || ''} />
			</figure>
		);
	}

	// Для фронтенда
	if (enableLightbox) {
		return (
			<figure className={figureClasses}>
				<a href={image.linkUrl || image.url} {...lightboxAttrs}>
					<img src={image.url} alt={image.alt || ''} />
				</a>
			</figure>
		);
	}
	
	// Без lightbox - без тега <a>
	return (
		<figure className={figureClasses}>
			<img src={image.url} alt={image.alt || ''} />
		</figure>
	);
};

