/**
 * Paragraph Component - Exports
 *
 * @package CodeWeber Gutenberg Blocks
 */

export { ParagraphControl } from './ParagraphControl';
export { ParagraphRender, ParagraphRenderSave, getParagraphClasses } from './ParagraphRender';

/**
 * Хелпер для добавления атрибутов параграфа в block.json
 *
 * @param {string} prefix - Префикс атрибутов (например, '' или 'intro')
 * @returns {Object} - Объект атрибутов
 */
export const paragraphAttributes = (prefix = '') => {
	const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
	const attr = (name) => prefix ? `${prefix}${capitalize(name)}` : name;

	return {
		[attr('text')]: {
			type: 'string',
			default: '',
		},
		[attr('textTag')]: {
			type: 'string',
			default: 'p',
		},
		[attr('textColor')]: {
			type: 'string',
			default: '',
		},
		[attr('textColorType')]: {
			type: 'string',
			default: 'solid',
		},
		[attr('textSize')]: {
			type: 'string',
			default: '',
		},
		[attr('textWeight')]: {
			type: 'string',
			default: '',
		},
		[attr('textTransform')]: {
			type: 'string',
			default: '',
		},
		[attr('textClass')]: {
			type: 'string',
			default: '',
		},
		[attr('textData')]: {
			type: 'string',
			default: '',
		},
		[attr('textId')]: {
			type: 'string',
			default: '',
		},
	};
};





