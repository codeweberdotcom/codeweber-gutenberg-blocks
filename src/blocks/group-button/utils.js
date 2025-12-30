export const normalizeGroupButtonId = (value = '') => value.replace(/^#/, '').trim();

export const normalizeGroupButtonData = (value = '') => {
	if (!value) return {};
	const attributes = {};
	value.split(',').forEach((pair) => {
		const [key, ...rest] = pair.split('=');
		const val = (rest.join('=') || '').trim();
		const cleanKey = key.trim().toLowerCase();
		if (!cleanKey || !val) return;
		if (cleanKey.startsWith('data-') || cleanKey.startsWith('aria-')) {
			attributes[cleanKey] = val;
		} else {
			attributes[`data-${cleanKey}`] = val;
		}
	});
	return attributes;
};

export const getGroupButtonClassNames = (attrs = {}, mode = 'save') => {
	const classes = [];
	// Добавляем класс для редактора (нужен для CSS стилей)
	if (mode === 'edit') {
		classes.push('naviddev-group-button');
	}
	const {
		blockClass,
		groupAlignItems,
		groupJustifyContent,
		groupTextAlign,
		groupPosition,
	} = attrs;

	if (blockClass) {
		classes.push(blockClass.trim());
	}

	// Базовые классы обертки - всегда d-flex
	classes.push('d-flex');
	
	// Justify Content - добавляем только если задан
	if (groupJustifyContent) {
		classes.push(groupJustifyContent.trim());
	}
	
	if (groupAlignItems) {
		classes.push(groupAlignItems.trim());
	}
	if (groupTextAlign) {
		classes.push(groupTextAlign.trim());
	}
	if (groupPosition) {
		classes.push(groupPosition.trim());
	}

	classes.push(...getSpacingClasses(attrs));

	return classes.filter(Boolean).join(' ');
};

export const getSpacingClasses = (attrs = {}) => {
	const classes = [];
	const {
		spacingType = 'padding',
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
	} = attrs;

	const prefix = spacingType === 'margin' ? 'm' : 'p';

	const addClass = (value, infix = '') => {
		if (value) {
			classes.push(`${prefix}${infix}-${value}`);
		}
	};

	addClass(spacingXs);
	addClass(spacingSm, '-sm');
	addClass(spacingMd, '-md');
	addClass(spacingLg, '-lg');
	addClass(spacingXl, '-xl');
	addClass(spacingXxl, '-xxl');

	return classes;
};

