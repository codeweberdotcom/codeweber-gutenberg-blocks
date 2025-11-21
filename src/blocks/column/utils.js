export const normalizeColumnId = (value = '') => value.replace(/^#/, '').trim();

export const normalizeColumnData = (value = '') => {
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

export const getColumnBackgroundClasses = (attrs = {}) => {
	const classes = [];
	const {
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundSize,
		backgroundOverlay,
	} = attrs;

	switch (backgroundType) {
		case 'color':
			if (backgroundColorType === 'gradient' && backgroundGradient) {
				classes.push(backgroundGradient);
			} else if (backgroundColor) {
				if (backgroundColorType === 'soft') {
					classes.push(`bg-soft-${backgroundColor}`);
				} else if (backgroundColorType === 'pale') {
					classes.push(`bg-pale-${backgroundColor}`);
				} else {
					classes.push(`bg-${backgroundColor}`);
				}
			}
			break;
		case 'image':
			classes.push('image-wrapper', 'bg-image');
			if (backgroundSize) {
				classes.push(backgroundSize);
			}
			classes.push(backgroundOverlay || 'bg-overlay');
			break;
		case 'pattern':
			classes.push('pattern-wrapper', 'bg-image', 'text-white');
			if (backgroundSize) {
				classes.push(backgroundSize);
			}
			break;
		default:
			break;
	}

	return classes.filter(Boolean);
};

export const getColumnStyles = (attrs = {}) => {
	const { backgroundType, backgroundImageUrl, backgroundPatternUrl, backgroundSize } = attrs;
	if (backgroundType === 'image' && backgroundImageUrl) {
		const size = backgroundSize === 'bg-cover' ? 'cover' : backgroundSize === 'bg-full' ? '100% 100%' : 'auto';
		return {
			backgroundImage: `url(${backgroundImageUrl})`,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
			backgroundSize: size,
		};
	}

	if (backgroundType === 'pattern' && backgroundPatternUrl) {
		const size = backgroundSize === 'bg-cover' ? 'cover' : backgroundSize === 'bg-full' ? '100% 100%' : 'auto';
		return {
			backgroundImage: `url(${backgroundPatternUrl})`,
			backgroundRepeat: 'repeat',
			backgroundSize: size,
		};
	}

	return undefined;
};

export const getColumnClassNames = (attrs = {}) => {
	const classes = ['naviddev-column'];
	const {
		columnClass,
		columnAlignItems,
		columnJustifyContent,
		columnTextAlign,
		columnPosition,
	} = attrs;

	if (columnClass) {
		classes.push(columnClass.trim());
	}

	classes.push(...getColumnBackgroundClasses(attrs));
	classes.push(...getAdaptiveClasses(attrs));
	classes.push(...getSpacingClasses(attrs));
	if (columnAlignItems) {
		classes.push(columnAlignItems.trim());
	}
	if (columnJustifyContent) {
		classes.push('d-flex', columnJustifyContent.trim());
	}
	if (columnTextAlign) {
		classes.push(columnTextAlign.trim());
	}
	if (columnPosition) {
		classes.push(columnPosition.trim());
	}

	return classes.filter(Boolean).join(' ');
};

export const getAdaptiveClasses = (attrs = {}) => {
	const classes = [];
	const {
		columnColXs,
		columnColSm,
		columnColMd,
		columnColLg,
		columnColXl,
		columnColXxl,
	} = attrs;

	if (columnColXs) {
		classes.push(columnColXs === 'auto' ? 'col-auto' : `col-${columnColXs}`);
	}
	if (columnColSm) {
		classes.push(columnColSm === 'auto' ? 'col-sm-auto' : `col-sm-${columnColSm}`);
	}
	if (columnColMd) {
		classes.push(columnColMd === 'auto' ? 'col-md-auto' : `col-md-${columnColMd}`);
	}
	if (columnColLg) {
		classes.push(columnColLg === 'auto' ? 'col-lg-auto' : `col-lg-${columnColLg}`);
	}
	if (columnColXl) {
		classes.push(columnColXl === 'auto' ? 'col-xl-auto' : `col-xl-${columnColXl}`);
	}
	if (columnColXxl) {
		classes.push(columnColXxl === 'auto' ? 'col-xxl-auto' : `col-xxl-${columnColXxl}`);
	}

	return classes;
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


