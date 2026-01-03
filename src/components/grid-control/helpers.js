/**
 * Helpers для генерации CSS классов из атрибутов GridControl
 * 
 * @package CodeWeber Gutenberg Blocks
 */

/**
 * Генерирует классы row-cols для адаптивных колонок
 * 
 * @param {string} prefix - Префикс (например, 'row-cols')
 * @param {string} value - Значение (например, '3', 'auto', '')
 * @returns {string} CSS класс
 */
const rowColsClass = (prefix, value) => {
	if (!value) return '';
	if (value === 'auto') {
		return `${prefix}-auto`;
	}
	return `${prefix}-${value}`;
};

/**
 * Генерирует классы для row-cols с учетом всех breakpoints
 * 
 * @param {Object} attrs - Объект атрибутов
 * @param {string} prefix - Префикс атрибутов (например, 'grid', 'columns')
 * @param {string} fallbackCount - Fallback значение для количества колонок
 * @returns {Array} Массив CSS классов
 */
export const getRowColsClasses = (attrs = {}, prefix = 'grid', fallbackCount = null) => {
	const {
		[`${prefix}RowCols`]: rowCols,
		[`${prefix}RowColsSm`]: rowColsSm,
		[`${prefix}RowColsMd`]: rowColsMd,
		[`${prefix}RowColsLg`]: rowColsLg,
		[`${prefix}RowColsXl`]: rowColsXl,
		[`${prefix}RowColsXxl`]: rowColsXxl,
	} = attrs;

	const responsiveClasses = [
		rowColsClass('row-cols', rowCols || fallbackCount || ''),
		rowColsClass('row-cols-sm', rowColsSm),
		rowColsClass('row-cols-md', rowColsMd),
		rowColsClass('row-cols-lg', rowColsLg),
		rowColsClass('row-cols-xl', rowColsXl),
		rowColsClass('row-cols-xxl', rowColsXxl),
	].filter(Boolean);

	return responsiveClasses;
};

/**
 * Генерирует классы gap с учетом всех breakpoints
 * 
 * @param {Object} attrs - Объект атрибутов
 * @param {string} prefix - Префикс атрибутов (например, 'grid', 'columns')
 * @returns {Array} Массив CSS классов
 */
/**
 * Генерирует классы gap для одного типа (general, x, или y)
 */
const getGapClassesForType = (attrs = {}, prefix = 'grid', gapTypePrefix = 'g') => {
	const classes = [];
	const suffix = gapTypePrefix === 'g' ? '' : gapTypePrefix === 'gx' ? 'X' : 'Y';
	
	const {
		[`${prefix}Gap${suffix}`]: gapDefault,
		[`${prefix}Gap${suffix}Xs`]: gapXs,
		[`${prefix}Gap${suffix}Sm`]: gapSm,
		[`${prefix}Gap${suffix}Md`]: gapMd,
		[`${prefix}Gap${suffix}Lg`]: gapLg,
		[`${prefix}Gap${suffix}Xl`]: gapXl,
		[`${prefix}Gap${suffix}Xxl`]: gapXxl,
	} = attrs;

	// Базовое значение (default breakpoint) - используем XS если установлен, иначе default
	// В Bootstrap XS - это базовый breakpoint без префикса
	const baseGap = (gapXs && gapXs !== '') ? gapXs : gapDefault;
	if (baseGap && baseGap !== '') {
		classes.push(`${gapTypePrefix}-${baseGap}`);
	}
	// Остальные breakpoints
	if (gapSm && gapSm !== '') {
		classes.push(`${gapTypePrefix}-sm-${gapSm}`);
	}
	if (gapMd && gapMd !== '') {
		classes.push(`${gapTypePrefix}-md-${gapMd}`);
	}
	if (gapLg && gapLg !== '') {
		classes.push(`${gapTypePrefix}-lg-${gapLg}`);
	}
	if (gapXl && gapXl !== '') {
		classes.push(`${gapTypePrefix}-xl-${gapXl}`);
	}
	if (gapXxl && gapXxl !== '') {
		classes.push(`${gapTypePrefix}-xxl-${gapXxl}`);
	}

	return classes;
};

/**
 * Генерирует классы gap с учетом всех типов (general, x, y) одновременно
 */
export const getGapClasses = (attrs = {}, prefix = 'grid') => {
	const classes = [];
	
	// Собираем классы для всех трех типов одновременно
	classes.push(...getGapClassesForType(attrs, prefix, 'g'));   // General (g-*)
	classes.push(...getGapClassesForType(attrs, prefix, 'gx'));   // Horizontal (gx-*)
	classes.push(...getGapClassesForType(attrs, prefix, 'gy'));   // Vertical (gy-*)

	return classes;
};

/**
 * Генерирует классы spacing с учетом всех breakpoints
 * 
 * @param {Object} attrs - Объект атрибутов
 * @param {string} prefix - Префикс атрибутов (например, 'grid', 'columns')
 * @returns {Array} Массив CSS классов
 */
export const getSpacingClasses = (attrs = {}, prefix = 'grid') => {
	const classes = [];
	const {
		[`${prefix}SpacingType`]: spacingType = 'padding',
		[`${prefix}SpacingXs`]: spacingXs,
		[`${prefix}SpacingSm`]: spacingSm,
		[`${prefix}SpacingMd`]: spacingMd,
		[`${prefix}SpacingLg`]: spacingLg,
		[`${prefix}SpacingXl`]: spacingXl,
		[`${prefix}SpacingXxl`]: spacingXxl,
	} = attrs;

	// Определяем префикс классов: 'p' для padding, 'm' для margin
	const classPrefix = spacingType === 'margin' ? 'm' : 'p';

	if (spacingXs) {
		classes.push(`${classPrefix}-${spacingXs}`);
	}
	if (spacingSm) {
		classes.push(`${classPrefix}-sm-${spacingSm}`);
	}
	if (spacingMd) {
		classes.push(`${classPrefix}-md-${spacingMd}`);
	}
	if (spacingLg) {
		classes.push(`${classPrefix}-lg-${spacingLg}`);
	}
	if (spacingXl) {
		classes.push(`${classPrefix}-xl-${spacingXl}`);
	}
	if (spacingXxl) {
		classes.push(`${classPrefix}-xxl-${spacingXxl}`);
	}

	return classes;
};

/**
 * Генерирует все CSS классы для grid контейнера
 * 
 * @param {Object} attrs - Объект атрибутов
 * @param {string} prefix - Префикс атрибутов (например, 'grid', 'columns')
 * @param {Object} options - Дополнительные опции
 * @param {boolean} options.includeRow - Включать класс 'row' (по умолчанию true)
 * @param {string} options.fallbackRowCols - Fallback для row-cols
 * @param {Array} options.additionalClasses - Дополнительные классы
 * @returns {string} Строка CSS классов
 */
export const getGridClasses = (attrs = {}, prefix = 'grid', options = {}) => {
	const {
		includeRow = true,
		fallbackRowCols = null,
		additionalClasses = [],
	} = options;

	const classes = [];

	// Базовый класс row
	if (includeRow) {
		classes.push('row');
	}

	// Row-cols классы
	classes.push(...getRowColsClasses(attrs, prefix, fallbackRowCols));

	// Gap классы
	classes.push(...getGapClasses(attrs, prefix));

	// Spacing классы
	classes.push(...getSpacingClasses(attrs, prefix));

	// Дополнительные классы
	if (additionalClasses.length) {
		classes.push(...additionalClasses);
	}

	return classes.filter(Boolean).join(' ');
};

/**
 * Создает объект с дефолтными атрибутами для grid
 * Используется в block.json
 * 
 * @param {string} prefix - Префикс атрибутов
 * @param {Object} defaults - Дефолтные значения
 * @returns {Object} Объект атрибутов для block.json
 */
export const createGridAttributes = (prefix = 'grid', defaults = {}) => {
	return {
		// Row Cols
		[`${prefix}RowCols`]: {
			type: 'string',
			default: defaults.rowCols || '',
		},
		[`${prefix}RowColsSm`]: {
			type: 'string',
			default: defaults.rowColsSm || '',
		},
		[`${prefix}RowColsMd`]: {
			type: 'string',
			default: defaults.rowColsMd || '',
		},
		[`${prefix}RowColsLg`]: {
			type: 'string',
			default: defaults.rowColsLg || '',
		},
		[`${prefix}RowColsXl`]: {
			type: 'string',
			default: defaults.rowColsXl || '',
		},
		[`${prefix}RowColsXxl`]: {
			type: 'string',
			default: defaults.rowColsXxl || '',
		},
		// Gap
		[`${prefix}GapType`]: {
			type: 'string',
			default: defaults.gapType || 'general',
		},
		[`${prefix}GapXs`]: {
			type: 'string',
			default: defaults.gapXs || '',
		},
		[`${prefix}GapSm`]: {
			type: 'string',
			default: defaults.gapSm || '',
		},
		[`${prefix}GapMd`]: {
			type: 'string',
			default: defaults.gapMd || '',
		},
		[`${prefix}GapLg`]: {
			type: 'string',
			default: defaults.gapLg || '',
		},
		[`${prefix}GapXl`]: {
			type: 'string',
			default: defaults.gapXl || '',
		},
		[`${prefix}GapXxl`]: {
			type: 'string',
			default: defaults.gapXxl || '',
		},
		// Spacing
		[`${prefix}SpacingType`]: {
			type: 'string',
			default: defaults.spacingType || 'padding',
		},
		[`${prefix}SpacingXs`]: {
			type: 'string',
			default: defaults.spacingXs || '',
		},
		[`${prefix}SpacingSm`]: {
			type: 'string',
			default: defaults.spacingSm || '',
		},
		[`${prefix}SpacingMd`]: {
			type: 'string',
			default: defaults.spacingMd || '',
		},
		[`${prefix}SpacingLg`]: {
			type: 'string',
			default: defaults.spacingLg || '',
		},
		[`${prefix}SpacingXl`]: {
			type: 'string',
			default: defaults.spacingXl || '',
		},
		[`${prefix}SpacingXxl`]: {
			type: 'string',
			default: defaults.spacingXxl || '',
		},
	};
};

