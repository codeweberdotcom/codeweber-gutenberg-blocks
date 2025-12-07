/**
 * Helpers для быстрого создания конфигураций ResponsiveControl
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';

/**
 * Стандартные опции для разных типов
 */
const PRESET_OPTIONS = {
	items: {
		default: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		xs: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		sm: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		md: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		lg: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		xl: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		xxl: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
	},
	columns: {
		all: [
			{ value: '', label: __('Default', 'codeweber-gutenberg-blocks') },
			{ value: 'auto', label: __('Auto', 'codeweber-gutenberg-blocks') },
			{ value: '1', label: __('1 column', 'codeweber-gutenberg-blocks') },
			{ value: '2', label: __('2 columns', 'codeweber-gutenberg-blocks') },
			{ value: '3', label: __('3 columns', 'codeweber-gutenberg-blocks') },
			{ value: '4', label: __('4 columns', 'codeweber-gutenberg-blocks') },
			{ value: '5', label: __('5 columns', 'codeweber-gutenberg-blocks') },
			{ value: '6', label: __('6 columns', 'codeweber-gutenberg-blocks') },
			{ value: '7', label: __('7 columns', 'codeweber-gutenberg-blocks') },
			{ value: '8', label: __('8 columns', 'codeweber-gutenberg-blocks') },
			{ value: '9', label: __('9 columns', 'codeweber-gutenberg-blocks') },
			{ value: '10', label: __('10 columns', 'codeweber-gutenberg-blocks') },
			{ value: '11', label: __('11 columns', 'codeweber-gutenberg-blocks') },
			{ value: '12', label: __('12 columns', 'codeweber-gutenberg-blocks') },
		],
	},
};

/**
 * Создает конфигурацию breakpoints для ResponsiveControl
 * 
 * @param {Object} config
 * @param {string} config.type - 'items' | 'columns' | 'custom'
 * @param {Object} config.attributes - Объект атрибутов блока
 * @param {string} config.attributePrefix - Префикс атрибутов (например, 'swiperItems')
 * @param {Function} config.onChange - Функция setAttributes
 * @param {Object} config.defaults - Дефолтные значения для breakpoints
 * @param {Object} config.customOptions - Кастомные опции для каждого breakpoint
 * @param {string} config.variant - 'dropdown' | 'select'
 * @param {string} config.label - Заголовок
 * @param {string} config.tooltip - Подсказка
 * 
 * @returns {Object} Конфигурация для ResponsiveControl
 */
export const createBreakpointsConfig = ({
	type = 'items',
	attributes,
	attributePrefix,
	onChange,
	defaults = {},
	customOptions = {},
	variant = 'dropdown',
	label,
	tooltip,
}) => {
	const breakpointKeys = ['default', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
	const breakpointLabels = {
		default: 'Base',
		xs: 'XS',
		sm: 'SM',
		md: 'MD',
		lg: 'LG',
		xl: 'XL',
		xxl: 'XXL',
	};

	const breakpointDescriptions = {
		default: __('Default', 'codeweber-gutenberg-blocks'),
		xs: __('Extra Small (≥0px)', 'codeweber-gutenberg-blocks'),
		sm: __('Small (≥576px)', 'codeweber-gutenberg-blocks'),
		md: __('Medium (≥768px)', 'codeweber-gutenberg-blocks'),
		lg: __('Large (≥992px)', 'codeweber-gutenberg-blocks'),
		xl: __('Extra Large (≥1200px)', 'codeweber-gutenberg-blocks'),
		xxl: __('Extra Extra Large (≥1400px)', 'codeweber-gutenberg-blocks'),
	};

	// Получаем опции для типа
	const getOptions = (key) => {
		if (customOptions[key]) {
			return customOptions[key];
		}
		
		if (type === 'items') {
			return PRESET_OPTIONS.items[key] || PRESET_OPTIONS.items.default;
		}
		
		if (type === 'columns') {
			return PRESET_OPTIONS.columns.all;
		}
		
		return ['', '1', '2', '3', '4', '5', '6'];
	};

	// Создаем массив breakpoints
	const breakpoints = breakpointKeys.map(key => {
		const suffix = key === 'default' ? '' : key.charAt(0).toUpperCase() + key.slice(1);
		const attribute = key === 'default' ? attributePrefix : `${attributePrefix}${suffix}`;
		
		return {
			key,
			label: variant === 'dropdown' ? breakpointLabels[key] : breakpointDescriptions[key],
			value: attributes[attribute],
			attribute,
			options: getOptions(key),
			defaultLabel: key === 'default' ? null : __('Auto', 'codeweber-gutenberg-blocks'),
		};
	});

	// Генерируем label если не указан
	const finalLabel = label || (
		type === 'items' 
			? __('Items Per View', 'codeweber-gutenberg-blocks')
			: type === 'columns'
			? __('Columns', 'codeweber-gutenberg-blocks')
			: __('Responsive Settings', 'codeweber-gutenberg-blocks')
	);

	return {
		label: finalLabel,
		breakpoints,
		variant,
		onChange: (attribute, value) => onChange({ [attribute]: value }),
		tooltip,
	};
};

/**
 * Быстрые пресеты для популярных случаев
 */

export const createSwiperItemsConfig = (attributes, setAttributes) => {
	return createBreakpointsConfig({
		type: 'items',
		attributes,
		attributePrefix: 'swiperItems',
		onChange: setAttributes,
		variant: 'dropdown',
		label: __('Items Per View', 'codeweber-gutenberg-blocks'),
		tooltip: __('Number of items to display at each breakpoint', 'codeweber-gutenberg-blocks'),
	});
};

export const createColumnsConfig = (attributes, setAttributes, variant = 'select') => {
	// Для columns убираем XS, т.к. row-cols-xs не существует в Bootstrap
	const config = createBreakpointsConfig({
		type: 'columns',
		attributes,
		attributePrefix: 'columnsRowCols',
		onChange: setAttributes,
		variant,
		label: __('Columns Per Row', 'codeweber-gutenberg-blocks'),
		tooltip: __('Number of columns at each breakpoint', 'codeweber-gutenberg-blocks'),
	});
	
	// Фильтруем XS breakpoint
	config.breakpoints = config.breakpoints.filter(bp => bp.key !== 'xs');
	
	return config;
};

export const createColumnWidthConfig = (attributes, setAttributes, variant = 'dropdown') => {
	// Опции для ширины колонки (col-1 до col-12 + auto)
	const columnOptions = [
		{ value: '', label: __('None (col)', 'codeweber-gutenberg-blocks') },
		{ value: 'auto', label: __('Auto (col-auto)', 'codeweber-gutenberg-blocks') },
		{ value: '1', label: '1/12' },
		{ value: '2', label: '2/12' },
		{ value: '3', label: '3/12' },
		{ value: '4', label: '4/12' },
		{ value: '5', label: '5/12' },
		{ value: '6', label: '6/12' },
		{ value: '7', label: '7/12' },
		{ value: '8', label: '8/12' },
		{ value: '9', label: '9/12' },
		{ value: '10', label: '10/12' },
		{ value: '11', label: '11/12' },
		{ value: '12', label: '12/12' },
	];

	return createBreakpointsConfig({
		type: 'custom',
		attributes,
		attributePrefix: 'columnCol',
		onChange: setAttributes,
		variant,
		label: __('Column Width', 'codeweber-gutenberg-blocks'),
		tooltip: __('Set column width for each breakpoint (based on 12-column grid)', 'codeweber-gutenberg-blocks'),
		customOptions: {
			default: columnOptions,
			xs: columnOptions,
			sm: columnOptions,
			md: columnOptions,
			lg: columnOptions,
			xl: columnOptions,
			xxl: columnOptions,
		},
	});
};

