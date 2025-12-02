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

/**
 * Get Angled divider classes
 * Based on Sandbox theme: https://sandbox.elemisthemes.com/docs/elements/dividers.html
 * 
 * @param {Object} attrs - Block attributes
 * @returns {string[]} Array of CSS classes
 */
export const getAngledClasses = (attrs = {}) => {
	const classes = [];
	const { angledEnabled, angledUpper, angledLower } = attrs;

	if (!angledEnabled) {
		return classes;
	}

	classes.push('angled');

	if (angledUpper) {
		classes.push(angledUpper);
	}

	if (angledLower) {
		classes.push(angledLower);
	}

	return classes;
};

/**
 * Wave SVG paths from Sandbox theme
 * https://sandbox.elemisthemes.com/docs/elements/dividers.html
 */
export const WAVE_SVGS = {
	'wave-1': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 70"><path fill="currentColor" d="M1440,70H0V45.16a5762.49,5762.49,0,0,1,1440,0Z"/></svg>',
	'wave-2': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60"><path fill="currentColor" d="M0,0V60H1440V0A5771,5771,0,0,1,0,0Z"/></svg>',
	'wave-3': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 92.26"><path fill="currentColor" d="M1206,21.2c-60-5-119-36.92-291-5C772,51.11,768,48.42,708,43.13c-60-5.68-108-29.92-168-30.22-60,.3-147,27.93-207,28.23-60-.3-122-25.94-182-36.91S30,5.93,0,16.2V92.26H1440v-87l-30,5.29C1348.94,22.29,1266,26.19,1206,21.2Z"/></svg>',
	'wave-4': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"><path fill="currentColor" d="M1260,1.65c-60-5.07-119.82,2.47-179.83,10.13s-120,11.48-180,9.57-120-7.66-180-6.42c-60,1.63-120,11.21-180,16a1129.52,1129.52,0,0,1-180,0c-60-4.78-120-14.36-180-19.14S60,7,30,7H0v93H1440V30.89C1380.07,23.2,1319.93,6.15,1260,1.65Z"/></svg>',
	'wave-5': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"><path fill="currentColor" d="M1260.2,37.86c-60-10-120-20.07-180-16.76-60,3.71-120,19.77-180,18.47-60-1.71-120-21.78-180-31.82s-120-10-180-1.7c-60,8.73-120,24.79-180,28.5-60,3.31-120-6.73-180-11.74s-120-5-150-5H0V100H1440V49.63C1380.07,57.9,1320.13,47.88,1260.2,37.86Z"/></svg>',
};

/**
 * Check if waves are enabled
 * 
 * @param {Object} attrs - Block attributes
 * @returns {Object} { hasTopWave, hasBottomWave, topType, bottomType }
 */
export const getWaveConfig = (attrs = {}) => {
	const { waveTopEnabled, waveTopType, waveBottomEnabled, waveBottomType } = attrs;

	return {
		hasTopWave: waveTopEnabled && waveTopType && WAVE_SVGS[waveTopType],
		hasBottomWave: waveBottomEnabled && waveBottomType && WAVE_SVGS[waveBottomType],
		topType: waveTopType,
		bottomType: waveBottomType,
	};
};


