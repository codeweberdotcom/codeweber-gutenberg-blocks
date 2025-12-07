/**
 * Утилита для получения URL изображения нужного размера
 * 
 * @package CodeWeber Gutenberg Blocks
 */

/**
 * Получает URL изображения нужного размера
 * 
 * @param {Object} image - Объект изображения
 * @param {string} image.url - Full size URL
 * @param {Object} image.sizes - Объект с размерами { thumbnail: { source_url }, medium: { source_url }, ... }
 * @param {string} size - Нужный размер (например, 'thumbnail', 'medium', 'full')
 * @returns {string} URL изображения нужного размера
 */
export const getImageUrl = (image, size = 'full') => {
	if (!image) {
		return '';
	}

	// Если размер "full" или размеры недоступны, возвращаем full URL
	if (size === 'full' || !image.sizes) {
		return image.url;
	}

	// Проверяем наличие нужного размера
	if (image.sizes[size] && image.sizes[size].source_url) {
		return image.sizes[size].source_url;
	}

	// Fallback на full size
	return image.url;
};

/**
 * Получает размеры изображения (width x height)
 * 
 * @param {Object} image - Объект изображения
 * @param {string} size - Нужный размер
 * @returns {Object} { width: number, height: number } или null
 */
export const getImageDimensions = (image, size = 'full') => {
	if (!image || !image.sizes || !image.sizes[size]) {
		return null;
	}

	return {
		width: image.sizes[size].width || null,
		height: image.sizes[size].height || null,
	};
};


