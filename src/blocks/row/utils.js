export const normalizeRowId = (value = '') => value.replace(/^#/, '').trim();

export const normalizeRowData = (value = '') => {
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

export const getRowClassNames = (attrs = {}) => {
	const classes = ['row'];
	const { rowType, rowClass, rowCols, rowGutterX, rowGutterY, rowAlignItems, rowJustifyContent, rowTextAlign, rowPosition } = attrs;
	const { rowColumnsCount } = attrs;
	if (rowClass) {
		classes.push(rowClass.trim());
	}
	if (rowType === 'columns-grid') {
		const colsClass = rowCols || (rowColumnsCount ? `row-cols-${rowColumnsCount}` : 'row-cols-1');
		if (colsClass) {
			classes.push(colsClass.trim());
		}
	} else if (rowCols) {
		classes.push(rowCols.trim());
	}
	else if (rowColumnsCount) {
		classes.push(`row-cols-${rowColumnsCount}`);
	}
	if (rowGutterX) {
		classes.push(gutterClass('gx', rowGutterX));
	}
	if (rowGutterY) {
		classes.push(gutterClass('gy', rowGutterY));
	}
	if (rowAlignItems) {
		classes.push(rowAlignItems.trim());
	}
	if (rowJustifyContent) {
		classes.push('d-flex', rowJustifyContent.trim());
	}
	if (rowTextAlign) {
		classes.push(rowTextAlign.trim());
	}
	if (rowPosition) {
		classes.push(rowPosition.trim());
	}
	return classes.filter(Boolean).join(' ');
};


