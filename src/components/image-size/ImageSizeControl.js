/**
 * ImageSizeControl - компонент для выбора размера изображения
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { useImageSizes } from '../../hooks/useImageSizes';

/**
 * ImageSizeControl Component
 *
 * @param {Object} props
 * @param {string} props.value - Текущее значение
 * @param {Function} props.onChange - Callback при изменении
 * @param {string} props.label - Label для контрола
 * @param {string} props.help - Текст подсказки
 * @param {Array} props.customSizes - Кастомные размеры (опционально, переопределяет API)
 * @param {Array} props.availableSizes - Массив доступных размеров для фильтрации (имена размеров)
 * @param {boolean} props.includeFull - Включать "Full Size" (по умолчанию true)
 * @param {boolean} props.sort - Сортировать размеры (по умолчанию true)
 * @param {boolean} props.showLoading - Показывать индикатор загрузки (по умолчанию false)
 * @param {string} props.postType - Тип записи для фильтрации размеров
 */
export const ImageSizeControl = ({
	value,
	onChange,
	label,
	help,
	customSizes,
	availableSizes = null,
	includeFull = true,
	sort = true,
	showLoading = false,
	postType = null,
}) => {
	// Загружаем размеры из API (если не переданы customSizes)
	const { sizes: apiSizes, loading } = useImageSizes({
		includeFull,
		sort,
		postType,
	});

	// Используем customSizes или API sizes
	let sizes = customSizes || apiSizes;

	// Фильтруем размеры по availableSizes если передан
	if (availableSizes && availableSizes.length > 0) {
		sizes = sizes.filter((size) => availableSizes.includes(size.value));
	}

	// Форматируем опции для SelectControl
	const options = sizes.map((size) => ({
		value: size.value,
		label: size.label,
	}));

	// Добавляем опцию по умолчанию если список пустой
	if (options.length === 0) {
		options.push({
			value: '',
			label: __('Loading...', 'codeweber-gutenberg-blocks'),
		});
	}

	return (
		<SelectControl
			label={label || __('Image Size', 'codeweber-gutenberg-blocks')}
			value={value}
			options={options}
			onChange={onChange}
			help={
				help ||
				(showLoading && loading
					? __('Loading sizes...', 'codeweber-gutenberg-blocks')
					: undefined)
			}
			disabled={loading && showLoading}
		/>
	);
};
