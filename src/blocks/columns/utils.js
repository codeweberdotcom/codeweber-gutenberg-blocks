import { getGridClasses } from '../../components/grid-control';

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

export const getColumnsClassNames = (attrs = {}, mode = 'save') => {
	const classes = ['naviddev-columns'];
	const {
		columnsType,
		columnsClass,
		columnsGutterX,
		columnsGutterY,
		columnsAlignItems,
		columnsJustifyContent,
		columnsTextAlign,
		columnsPosition,
		columnsCount,
	} = attrs;
	
	// Добавляем кастомный класс
	if (columnsClass) {
		classes.push(columnsClass.trim());
	}
	
	// Используем getGridClasses для row-cols, gap и spacing
	const gridClasses = getGridClasses(attrs, 'columns', {
		fallbackRowCols: columnsCount ? String(columnsCount) : null,
	});
	classes.push(gridClasses);
	
	// Старые gutter классы (для обратной совместимости)
	if (columnsGutterX) {
		classes.push(`gx-${columnsGutterX}`);
	}
	if (columnsGutterY) {
		classes.push(`gy-${columnsGutterY}`);
	}
	
	// Позиционирование
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
	
	// Класс для редактора (для визуального отображения колонок)
	if (mode === 'edit' && columnsType === 'classic' && columnsCount) {
		classes.push(`columns-${columnsCount}`);
	}

	return classes.filter(Boolean).join(' ');
};


