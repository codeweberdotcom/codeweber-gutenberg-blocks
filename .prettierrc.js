/**
 * Prettier конфигурация для переопределения WordPress Prettier config
 * Гарантирует, что в конце файла будет только ОДНА пустая строка
 * 
 * WordPress Prettier config уже включает insertFinalNewline: true,
 * но этот файл явно гарантирует правильное поведение
 */
module.exports = {
	...require('@wordpress/prettier-config'),
	endOfLine: 'lf',
};

