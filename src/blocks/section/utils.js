export const normalizeMinHeightClass = (value = '') => {
	const map = {
		'min-h-25': 'min-vh-25',
		'min-h-30': 'min-vh-30',
		'min-h-50': 'min-vh-50',
		'min-h-60': 'min-vh-60',
		'min-h-70': 'min-vh-70',
		'min-h-75': 'min-vh-75',
		'min-h-80': 'min-vh-80',
		'min-h-100': 'min-vh-100',
	};

	return map[value] || value;
};

export const getContainerClassNames = (attrs = {}) => {
	const classes = [];
	const candidates = [
		attrs.containerClass,
		attrs.containerTextAlign,
		attrs.containerAlignItems,
		attrs.containerJustifyContent,
		attrs.containerPosition,
	];

	const needsFlex = attrs.containerJustifyContent && attrs.containerJustifyContent !== '';
	if (needsFlex) {
		classes.push('d-flex');
	}

	candidates.forEach((value) => {
		if (!value) {
			return;
		}
		classes.push(value.trim());
	});

	return classes.join(' ').trim();
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

	if (spacingXs) {
		classes.push(`${prefix}-${spacingXs}`);
	}
	if (spacingSm) {
		classes.push(`${prefix}-sm-${spacingSm}`);
	}
	if (spacingMd) {
		classes.push(`${prefix}-md-${spacingMd}`);
	}
	if (spacingLg) {
		classes.push(`${prefix}-lg-${spacingLg}`);
	}
	if (spacingXl) {
		classes.push(`${prefix}-xl-${spacingXl}`);
	}
	if (spacingXxl) {
		classes.push(`${prefix}-xxl-${spacingXxl}`);
	}

	return classes;
};


