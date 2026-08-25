/**
 * Position helpers — генерация классов и inline CSS-переменных
 * для адаптивного позиционирования блока (absolute / relative / fixed / sticky).
 *
 * На выходе — только Bootstrap-классы + CSS custom properties,
 * сами значения раскрываются в style.scss компонента.
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';

/**
 * Брейкпоинты темы. Пустой key — база (xs, без инфикса).
 */
export const POSITION_BREAKPOINTS = [
	{ key: '', slug: '', label: 'Base' },
	{ key: 'Sm', slug: 'sm', label: 'SM' },
	{ key: 'Md', slug: 'md', label: 'MD' },
	{ key: 'Lg', slug: 'lg', label: 'LG' },
	{ key: 'Xl', slug: 'xl', label: 'XL' },
	{ key: 'Xxl', slug: 'xxl', label: 'XXL' },
	{ key: 'Xxxl', slug: 'xxxl', label: 'XXXL' },
];

/**
 * Человекочитаемые описания брейкпоинтов (для подсказок в сайдбаре).
 *
 * @param {string} key Ключ брейкпоинта
 * @return {string} Описание
 */
export const getBreakpointDescription = (key) => {
	const map = {
		'': __('Base — all screens', 'codeweber-gutenberg-blocks'),
		Sm: __('Small (≥576px)', 'codeweber-gutenberg-blocks'),
		Md: __('Medium (≥768px)', 'codeweber-gutenberg-blocks'),
		Lg: __('Large (≥992px)', 'codeweber-gutenberg-blocks'),
		Xl: __('Extra large (≥1200px)', 'codeweber-gutenberg-blocks'),
		Xxl: __('Extra extra large (≥1400px)', 'codeweber-gutenberg-blocks'),
		Xxxl: __('Wide (≥1921px)', 'codeweber-gutenberg-blocks'),
	};

	return map[key] || '';
};

/**
 * Стороны смещения. В этом порядке рисуется сетка в сайдбаре.
 */
export const POSITION_SIDES = ['Top', 'Right', 'Bottom', 'Left'];

/**
 * Типы позиционирования → классы Bootstrap.
 */
export const POSITION_TYPES = [
	{ value: 'absolute', label: 'position-absolute' },
	{ value: 'relative', label: 'position-relative' },
	{ value: 'fixed', label: 'position-fixed' },
	{ value: 'sticky', label: 'position-sticky' },
];

/**
 * Допустимые значения transform-origin.
 */
export const POSITION_ORIGINS = [
	{ value: '', label: __('Center (default)', 'codeweber-gutenberg-blocks') },
	{ value: 'top left', label: __('Top left', 'codeweber-gutenberg-blocks') },
	{
		value: 'top center',
		label: __('Top center', 'codeweber-gutenberg-blocks'),
	},
	{ value: 'top right', label: __('Top right', 'codeweber-gutenberg-blocks') },
	{
		value: 'center left',
		label: __('Center left', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'center right',
		label: __('Center right', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'bottom left',
		label: __('Bottom left', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'bottom center',
		label: __('Bottom center', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'bottom right',
		label: __('Bottom right', 'codeweber-gutenberg-blocks'),
	},
];

/**
 * Значения display для класса видимости (d-{bp}-{display}).
 */
export const POSITION_DISPLAYS = [
	{ value: 'block', label: 'block' },
	{ value: 'inline-block', label: 'inline-block' },
	{ value: 'flex', label: 'flex' },
	{ value: 'inline-flex', label: 'inline-flex' },
	{ value: 'grid', label: 'grid' },
];

/**
 * Брейкпоинты для контролов видимости (у базы нет инфикса в d-*).
 */
export const POSITION_VISIBILITY_BREAKPOINTS = POSITION_BREAKPOINTS.filter(
	(bp) => bp.slug !== ''
);

/**
 * Имя атрибута: posTop, posTopLg, posScaleXxl и т.д.
 *
 * @param {string} name   Часть имени ('Top', 'Scale', 'ZIndex', ...)
 * @param {string} bpKey  Ключ брейкпоинта ('', 'Sm', 'Md', ...)
 * @param {string} prefix Префикс атрибутов блока
 * @return {string} Имя атрибута
 */
export const positionAttr = (name, bpKey = '', prefix = 'pos') =>
	`${prefix}${name}${bpKey}`;

const LENGTH_RE = /^-?(?:\d+(?:\.\d+)?|\.\d+)(px|%|rem|em|vh|vw|vmin|vmax)?$/;

/**
 * Приводит значение смещения к безопасной CSS-длине.
 *
 * @param {string|number} raw Исходное значение
 * @return {string|null} CSS-длина или null, если значение пустое/не распознано
 */
export const sanitizeLength = (raw) => {
	if (raw === null || raw === undefined) {
		return null;
	}

	const value = String(raw).trim();

	if (value === '') {
		return null;
	}

	if (value === 'auto' || value === '0') {
		return value;
	}

	const match = value.match(LENGTH_RE);

	if (!match) {
		return null;
	}

	// Число без единицы измерения трактуем как пиксели.
	return match[1] ? value : `${value}px`;
};

/**
 * Приводит масштаб (в процентах) к множителю для scale().
 *
 * @param {string|number} raw Значение в процентах
 * @return {string|null} Множитель или null
 */
export const sanitizeScale = (raw) => {
	if (raw === null || raw === undefined || raw === '') {
		return null;
	}

	const value = parseFloat(raw);

	if (Number.isNaN(value)) {
		return null;
	}

	const clamped = Math.min(500, Math.max(1, value));

	return String(Math.round((clamped / 100) * 10000) / 10000);
};

/**
 * Приводит z-index к целому числу в разумных пределах.
 *
 * @param {string|number} raw Значение z-index
 * @return {number|null} z-index или null
 */
export const sanitizeZIndex = (raw) => {
	if (raw === null || raw === undefined || raw === '') {
		return null;
	}

	const value = parseInt(raw, 10);

	if (Number.isNaN(value)) {
		return null;
	}

	return Math.min(9999, Math.max(-100, value));
};

/**
 * Нужна ли блоку трансформация (scale на любом брейкпоинте или центрирование).
 *
 * @param {Object} attributes Атрибуты блока
 * @param {string} prefix     Префикс атрибутов
 * @return {boolean} true, если нужен класс-модификатор трансформации
 */
export const hasPositionTransform = (attributes, prefix = 'pos') => {
	if (
		attributes[positionAttr('CenterX', '', prefix)] ||
		attributes[positionAttr('CenterY', '', prefix)]
	) {
		return true;
	}

	return POSITION_BREAKPOINTS.some(
		(bp) =>
			sanitizeScale(attributes[positionAttr('Scale', bp.key, prefix)]) !==
			null
	);
};

/**
 * Классы позиционирования и видимости.
 *
 * @param {Object}  attributes             Атрибуты блока
 * @param {string}  prefix                 Префикс атрибутов
 * @param {Object}  options                Опции
 * @param {boolean} options.skipVisibility Не добавлять d-* классы: в редакторе d-none спрятал бы блок
 * @return {string} Строка классов (может быть пустой)
 */
export const getPositionClasses = (
	attributes,
	prefix = 'pos',
	options = {}
) => {
	if (!attributes[positionAttr('Enabled', '', prefix)]) {
		return '';
	}

	const classes = ['cwgb-position'];

	const type = attributes[positionAttr('Type', '', prefix)] || 'absolute';

	if (POSITION_TYPES.some((option) => option.value === type)) {
		classes.push(`position-${type}`);
	}

	if (hasPositionTransform(attributes, prefix)) {
		classes.push('cwgb-position--transform');
	}

	if (!options.skipVisibility) {
		const visibleFrom = attributes[positionAttr('VisibleFrom', '', prefix)];

		if (
			visibleFrom &&
			POSITION_VISIBILITY_BREAKPOINTS.some(
				(bp) => bp.slug === visibleFrom
			)
		) {
			const display =
				attributes[positionAttr('VisibleDisplay', '', prefix)] ||
				'block';
			const validDisplay = POSITION_DISPLAYS.some(
				(option) => option.value === display
			)
				? display
				: 'block';

			classes.push('d-none', `d-${visibleFrom}-${validDisplay}`);
		}

		const hiddenFrom = attributes[positionAttr('HiddenFrom', '', prefix)];

		if (
			hiddenFrom &&
			POSITION_VISIBILITY_BREAKPOINTS.some((bp) => bp.slug === hiddenFrom)
		) {
			classes.push(`d-${hiddenFrom}-none`);
		}
	}

	return classes.join(' ');
};

/**
 * Inline-стиль: CSS-переменные для смещений/масштаба + z-index.
 *
 * @param {Object} attributes Атрибуты блока
 * @param {string} prefix     Префикс атрибутов
 * @return {Object|undefined} Объект стилей или undefined
 */
export const getPositionStyle = (attributes, prefix = 'pos') => {
	if (!attributes[positionAttr('Enabled', '', prefix)]) {
		return undefined;
	}

	const style = {};

	POSITION_BREAKPOINTS.forEach((bp) => {
		const suffix = bp.slug ? `-${bp.slug}` : '';

		POSITION_SIDES.forEach((side) => {
			const value = sanitizeLength(
				attributes[positionAttr(side, bp.key, prefix)]
			);

			if (value !== null) {
				style[`--cwgb-pos-${side.toLowerCase()}${suffix}`] = value;
			}
		});

		const scale = sanitizeScale(
			attributes[positionAttr('Scale', bp.key, prefix)]
		);

		if (scale !== null) {
			style[`--cwgb-pos-scale${suffix}`] = scale;
		}
	});

	if (attributes[positionAttr('CenterX', '', prefix)]) {
		style['--cwgb-pos-tx'] = '-50%';
	}

	if (attributes[positionAttr('CenterY', '', prefix)]) {
		style['--cwgb-pos-ty'] = '-50%';
	}

	const origin = attributes[positionAttr('Origin', '', prefix)];

	if (origin && POSITION_ORIGINS.some((option) => option.value === origin)) {
		style['--cwgb-pos-origin'] = origin;
	}

	const zIndex = sanitizeZIndex(
		attributes[positionAttr('ZIndex', '', prefix)]
	);

	if (zIndex !== null) {
		style.zIndex = zIndex;
	}

	return Object.keys(style).length ? style : undefined;
};

/**
 * Есть ли у брейкпоинта хоть одно заданное значение — для индикатора в UI.
 *
 * @param {Object} attributes Атрибуты блока
 * @param {string} bpKey      Ключ брейкпоинта
 * @param {string} prefix     Префикс атрибутов
 * @return {boolean} true, если брейкпоинт настроен
 */
export const isBreakpointConfigured = (attributes, bpKey, prefix = 'pos') => {
	const hasSide = POSITION_SIDES.some(
		(side) =>
			sanitizeLength(attributes[positionAttr(side, bpKey, prefix)]) !==
			null
	);

	return (
		hasSide ||
		sanitizeScale(attributes[positionAttr('Scale', bpKey, prefix)]) !== null
	);
};
