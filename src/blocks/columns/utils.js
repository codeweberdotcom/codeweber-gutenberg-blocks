export const normalizeColumnsId = (value = '') => value.replace(/^#/, '').trim();

export const normalizeColumnsData = (value = '') => {
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

const gutterClass = (prefix, value) => (value ? `${prefix}-${value}` : '');
const rowColsClass = (prefix, value) => {
	if (!value) return '';
	if (value === 'auto') {
		return `${prefix}-auto`;
	}
	return `${prefix}-${value}`;
};

export const getColumnsClassNames = (attrs = {}, mode = 'save') => {
	const classes = ['naviddev-columns', 'row'];
	const {
		columnsType,
		columnsClass,
		columnsGutterX,
		columnsGutterY,
		columnsAlignItems,
		columnsJustifyContent,
		columnsTextAlign,
		columnsPosition,
		columnsRowCols,
		columnsRowColsSm,
		columnsRowColsMd,
		columnsRowColsLg,
		columnsRowColsXl,
		columnsRowColsXxl,
		columnsCount,
	} = attrs;
	if (columnsClass) {
		classes.push(columnsClass.trim());
	}
	if (columnsType === 'columns-grid') {
		const responsiveClasses = [
			rowColsClass('row-cols', columnsRowCols || (columnsCount ? String(columnsCount) : '')),
			rowColsClass('row-cols-sm', columnsRowColsSm),
			rowColsClass('row-cols-md', columnsRowColsMd),
			rowColsClass('row-cols-lg', columnsRowColsLg),
			rowColsClass('row-cols-xl', columnsRowColsXl),
			rowColsClass('row-cols-xxl', columnsRowColsXxl),
		].filter(Boolean);
		if (responsiveClasses.length) {
			classes.push(...responsiveClasses);
		} else {
			classes.push(`row-cols-${columnsCount || 1}`);
		}
	} else if (columnsCount && mode === 'edit') {
		classes.push(`columns-${columnsCount}`);
	}
	if (columnsGutterX) {
		classes.push(gutterClass('gx', columnsGutterX));
	}
	if (columnsGutterY) {
		classes.push(gutterClass('gy', columnsGutterY));
	}
	if (columnsAlignItems) {
		classes.push(columnsAlignItems.trim());
	}
	if (columnsJustifyContent) {
		classes.push('d-flex', columnsJustifyContent.trim());
	}
	if (columnsTextAlign) {
		classes.push(columnsTextAlign.trim());
	}
	if (columnsPosition) {
		classes.push(columnsPosition.trim());
	}

	classes.push(...getGapClasses(attrs));
	classes.push(...getSpacingClasses(attrs));

	return classes.filter(Boolean).join(' ');
};

export const getGapClasses = (attrs = {}) => {
	const classes = [];
	const {
		columnsGapType = 'general',
		columnsGapXs,
		columnsGapSm,
		columnsGapMd,
		columnsGapLg,
		columnsGapXl,
		columnsGapXxl,
	} = attrs;

	const prefix = columnsGapType === 'general' ? 'g' : columnsGapType === 'x' ? 'gx' : 'gy';

	if (columnsGapXs) {
		classes.push(`${prefix}-${columnsGapXs}`);
	}
	if (columnsGapSm) {
		classes.push(`${prefix}-sm-${columnsGapSm}`);
	}
	if (columnsGapMd) {
		classes.push(`${prefix}-md-${columnsGapMd}`);
	}
	if (columnsGapLg) {
		classes.push(`${prefix}-lg-${columnsGapLg}`);
	}
	if (columnsGapXl) {
		classes.push(`${prefix}-xl-${columnsGapXl}`);
	}
	if (columnsGapXxl) {
		classes.push(`${prefix}-xxl-${columnsGapXxl}`);
	}

	return classes;
};

export const getSpacingClasses = (attrs = {}) => {
	const classes = [];
	const {
		columnsSpacingType = 'padding',
		columnsSpacingXs,
		columnsSpacingSm,
		columnsSpacingMd,
		columnsSpacingLg,
		columnsSpacingXl,
		columnsSpacingXxl,
	} = attrs;

	const prefix = columnsSpacingType === 'margin' ? 'm' : 'p';

	if (columnsSpacingXs) {
		classes.push(`${prefix}-${columnsSpacingXs}`);
	}
	if (columnsSpacingSm) {
		classes.push(`${prefix}-sm-${columnsSpacingSm}`);
	}
	if (columnsSpacingMd) {
		classes.push(`${prefix}-md-${columnsSpacingMd}`);
	}
	if (columnsSpacingLg) {
		classes.push(`${prefix}-lg-${columnsSpacingLg}`);
	}
	if (columnsSpacingXl) {
		classes.push(`${prefix}-xl-${columnsSpacingXl}`);
	}
	if (columnsSpacingXxl) {
		classes.push(`${prefix}-xxl-${columnsSpacingXxl}`);
	}

	return classes;
};


