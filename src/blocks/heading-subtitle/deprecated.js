import { RichText } from '@wordpress/block-editor';
import blockJson from './block.json';
import { getTitleClasses } from './utils';
import { ParagraphRenderSave } from '../../components/paragraph';
import {
	generateColorClass,
	generateTypographyClasses,
	generateTextAlignClass,
	generateAlignItemsClass,
	generateJustifyContentClass,
	generatePositionClass,
} from '../../utilities/class-generators';

// Функция для очистки тегов strong из HTML (копия из save.js v1)
const cleanStrongTags = (html) => {
	if (!html) return html;
	let cleaned = html;
	let previous = '';
	while (cleaned !== previous) {
		previous = cleaned;
		cleaned = cleaned
			.replace(/<strong[^>]*>/gi, '')
			.replace(/<\/strong>/gi, '');
	}
	return cleaned;
};

// Классы подзаголовка v1: выравнивание добавлялось к самому элементу для всех типов.
const getSubtitleClassesV1 = (attrs) => {
	const classes = [];
	const {
		subtitleColor,
		subtitleColorType,
		align,
		alignItems,
		justifyContent,
		position,
		lead,
		subtitleTag,
		subtitleLineType = 'default',
		subtitleClass,
	} = attrs;

	if (lead && subtitleTag === 'p') {
		classes.push(lead);
	}

	if (subtitleLineType === 'line') {
		classes.push('text-line');
	} else if (subtitleLineType === 'primary') {
		classes.push('text-line-primary');
	} else if (subtitleLineType === 'full') {
		classes.push('text-line-full');
	}

	classes.push(generateColorClass(subtitleColor, subtitleColorType, 'text'));
	classes.push(generateTextAlignClass(align));
	classes.push(generateAlignItemsClass(alignItems));
	classes.push(generateJustifyContentClass(justifyContent));
	classes.push(generatePositionClass(position));
	classes.push(...generateTypographyClasses(attrs, 'subtitle'));

	if (subtitleClass) {
		classes.push(subtitleClass);
	}

	return classes.filter(Boolean).join(' ');
};

const SaveV1 = ({ attributes }) => {
	const {
		enableTitle,
		enableSubtitle,
		enableText,
		title,
		subtitle,
		order,
		titleTag,
		subtitleTag,
		textTag,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		wrapperClass,
		wrapperId,
	} = attributes;

	const elements = [];

	if (enableTitle) {
		const cleanTitle = cleanStrongTags(title);
		elements.push(
			<RichText.Content
				key="title"
				tagName={titleTag}
				value={cleanTitle}
				className={getTitleClasses(attributes)}
			/>
		);
	}
	if (enableSubtitle) {
		elements.push(
			<RichText.Content
				key="subtitle"
				tagName={subtitleTag}
				value={subtitle}
				className={getSubtitleClassesV1(attributes)}
			/>
		);
	}

	if (order === 'subtitle-first') {
		elements.reverse();
	}

	if (enableText) {
		elements.push(
			<ParagraphRenderSave
				key="text"
				attributes={attributes}
				prefix=""
				tag={textTag}
			/>
		);
	}

	return (
		<div
			className={['d-flex', 'flex-column', wrapperClass]
				.filter(Boolean)
				.join(' ')}
			{...(wrapperId && { id: wrapperId })}
			{...(animationEnabled && animationType && {
				'data-cue': animationType,
				...(animationDuration && {
					'data-duration': animationDuration,
				}),
				...(animationDelay && {
					'data-delay': animationDelay,
				}),
			})}
		>
			{elements}
		</div>
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
