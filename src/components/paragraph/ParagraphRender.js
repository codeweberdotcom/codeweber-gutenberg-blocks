/**
 * ParagraphRender - Компонент рендеринга параграфа
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { generateColorClass, generateTypographyClasses } from '../../utilities/class-generators';

/**
 * Генерация классов для параграфа
 */
export const getParagraphClasses = (attrs, prefix = '') => {
	const classes = [];

	const getAttr = (name) => {
		const attrName = prefix ? `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;
		return attrs[attrName];
	};

	const textColor = getAttr('textColor') || '';
	const textColorType = getAttr('textColorType') || 'solid';
	const textClass = getAttr('textClass') || '';

	// Color classes
	classes.push(generateColorClass(textColor, textColorType, 'text'));

	// Typography classes
	classes.push(...generateTypographyClasses(attrs, prefix ? `${prefix}text` : 'text'));

	// Custom class
	if (textClass) {
		classes.push(textClass);
	}

	return classes.filter(Boolean).join(' ');
};

/**
 * ParagraphRender - для использования в edit.js
 */
export const ParagraphRender = ({
	attributes,
	setAttributes,
	prefix = '',
	tag = 'p',
}) => {
	const getAttr = (name) => {
		const attrName = prefix ? `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;
		return attributes[attrName];
	};

	const setAttr = (name, value) => {
		const attrName = prefix ? `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;
		setAttributes({ [attrName]: value });
	};

	const text = getAttr('text') || '';
	const classes = getParagraphClasses(attributes, prefix);

	return (
		<RichText
			tagName={tag}
			value={text}
			onChange={(value) => setAttr('text', value)}
			className={classes}
			placeholder={__('Enter paragraph...', 'codeweber-gutenberg-blocks')}
		/>
	);
};

/**
 * ParagraphRenderSave - для использования в save.js
 */
export const ParagraphRenderSave = ({
	attributes,
	prefix = '',
	tag = 'p',
}) => {
	const getAttr = (name) => {
		const attrName = prefix ? `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;
		return attributes[attrName];
	};

	const text = getAttr('text') || '';
	const classes = getParagraphClasses(attributes, prefix);
	const textId = getAttr('textId') || '';
	const textData = getAttr('textData') || '';

	// Парсим data-атрибуты
	const dataAttributes = {};
	if (textData) {
		textData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	return (
		<RichText.Content
			tagName={tag}
			value={text}
			{...(classes && { className: classes })}
			{...(textId && { id: textId })}
			{...dataAttributes}
		/>
	);
};

export default ParagraphRender;

