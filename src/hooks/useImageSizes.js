/**
 * useImageSizes - хук для загрузки доступных размеров изображений из REST API
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Хук для загрузки размеров изображений
 *
 * @param {Object} options - Опции
 * @param {boolean} options.includeFull - Включать размер "Full" (по умолчанию true)
 * @param {boolean} options.sort - Сортировать по label (по умолчанию true)
 * @param {Array} options.fallbackSizes - Размеры по умолчанию при ошибке
 * @param {string} options.postType - Тип записи для фильтрации размеров
 *
 * @returns {Object} { sizes: Array, loading: boolean, error: Error|null }
 */
export const useImageSizes = (options = {}) => {
	const {
		includeFull = true,
		sort = true,
		postType = null,
		fallbackSizes = [
			{
				value: 'thumbnail',
				label: 'Thumbnail (150x150)',
				width: 150,
				height: 150,
			},
			{
				value: 'medium',
				label: 'Medium (300x300)',
				width: 300,
				height: 300,
			},
			{
				value: 'large',
				label: 'Large (1024x1024)',
				width: 1024,
				height: 1024,
			},
			{ value: 'full', label: 'Full Size', width: null, height: null },
		],
	} = options;

	const [sizes, setSizes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		// Формируем путь с параметром post_type если он передан
		let apiPath = '/codeweber-gutenberg-blocks/v1/image-sizes';
		if (postType) {
			apiPath += `?post_type=${encodeURIComponent(postType)}`;
		}

		apiFetch({
			path: apiPath,
			method: 'GET',
		})
			.then((response) => {
				let availableSizes = response.map((size) => ({
					value: size.value,
					label: size.label,
					width: size.width,
					height: size.height,
					crop: size.crop,
				}));

				// Добавляем "Full Size" если нужно
				if (
					includeFull &&
					!availableSizes.find((size) => size.value === 'full')
				) {
					availableSizes.push({
						value: 'full',
						label: 'Full Size',
						width: null,
						height: null,
						crop: false,
					});
				}

				// Сортируем по label
				if (sort) {
					availableSizes.sort((a, b) =>
						a.label.localeCompare(b.label)
					);
				}

				setSizes(availableSizes);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Failed to fetch image sizes:', err);
				setError(err);
				setSizes(fallbackSizes);
				setLoading(false);
			});
	}, [postType, includeFull, sort]); // Перезагружаем при изменении postType

	return { sizes, loading, error };
};
