/**
 * Paragraph Block - Deprecated versions
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { RichText } from '@wordpress/block-editor';
import blockJson from './block.json';
import {
	generateColorClass,
	generateTypographyClasses,
} from '../../utilities/class-generators';

// Классы параграфа v1: без маркерного класса cw-paragraph (добавлен в v2).
const getParagraphClassesV1 = (attrs) => {
	const classes = [];

	const textColor = attrs.textColor || '';
	const textColorType = attrs.textColorType || 'solid';
	const textClass = attrs.textClass || '';

	classes.push(generateColorClass(textColor, textColorType, 'text'));
	classes.push(...generateTypographyClasses(attrs, 'text'));

	if (textClass) {
		classes.push(textClass);
	}

	return classes.filter(Boolean).join(' ');
};

const SaveV1 = ({ attributes }) => {
	const { text, textTag, textId, textData } = attributes;

	if (!text || text.trim() === '') {
		return null;
	}

	const classes = getParagraphClassesV1(attributes);

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
			tagName={textTag}
			value={text}
			{...(classes && { className: classes })}
			{...(textId && { id: textId })}
			{...dataAttributes}
		/>
	);
};

const deprecated = [
	{
		attributes: blockJson.attributes,
		supports: blockJson.supports,
		save: SaveV1,
	},
];

export default deprecated;
