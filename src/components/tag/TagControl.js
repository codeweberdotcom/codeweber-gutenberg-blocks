/**
 * TagControl - Компонент выбора HTML тега
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

/**
 * Опции для заголовков (h1-h6, display-*, div, p, span)
 */
export const createHeadingTagOptions = () => [
	{ value: 'h1', label: 'H1' },
	{ value: 'h2', label: 'H2' },
	{ value: 'h3', label: 'H3' },
	{ value: 'h4', label: 'H4' },
	{ value: 'h5', label: 'H5' },
	{ value: 'h6', label: 'H6' },
	{ value: 'div', label: 'Div' },
	{ value: 'p', label: 'Paragraph' },
	{ value: 'span', label: 'Span' },
	{ value: 'display-1', label: 'Display 1' },
	{ value: 'display-2', label: 'Display 2' },
	{ value: 'display-3', label: 'Display 3' },
	{ value: 'display-4', label: 'Display 4' },
	{ value: 'display-5', label: 'Display 5' },
	{ value: 'display-6', label: 'Display 6' },
];

/**
 * Опции для подзаголовков (p, h1-h6, div, span)
 */
export const createSubtitleTagOptions = () => [
	{ value: 'p', label: 'Paragraph' },
	{ value: 'h1', label: 'H1' },
	{ value: 'h2', label: 'H2' },
	{ value: 'h3', label: 'H3' },
	{ value: 'h4', label: 'H4' },
	{ value: 'h5', label: 'H5' },
	{ value: 'h6', label: 'H6' },
	{ value: 'div', label: 'Div' },
	{ value: 'span', label: 'Span' },
];

/**
 * Опции для текста/параграфа (p, div, span, h1-h6)
 */
export const createTextTagOptions = () => [
	{ value: 'p', label: 'Paragraph' },
	{ value: 'div', label: 'Div' },
	{ value: 'span', label: 'Span' },
	{ value: 'h1', label: 'H1' },
	{ value: 'h2', label: 'H2' },
	{ value: 'h3', label: 'H3' },
	{ value: 'h4', label: 'H4' },
	{ value: 'h5', label: 'H5' },
	{ value: 'h6', label: 'H6' },
];

/**
 * TagControl Component
 *
 * @param {Object} props
 * @param {string} props.label - Лейбл для поля
 * @param {string} props.value - Текущее значение
 * @param {Function} props.onChange - Callback при изменении
 * @param {string} props.type - Тип опций: 'heading', 'subtitle', 'text'
 */
export const TagControl = ({
	label = __('Tag', 'codeweber-gutenberg-blocks'),
	value,
	onChange,
	type = 'text',
}) => {
	let options = createTextTagOptions();

	if (type === 'heading') {
		options = createHeadingTagOptions();
	} else if (type === 'subtitle') {
		options = createSubtitleTagOptions();
	}

	return (
		<SelectControl
			label={label}
			value={value}
			options={options}
			onChange={onChange}
		/>
	);
};

export default TagControl;










