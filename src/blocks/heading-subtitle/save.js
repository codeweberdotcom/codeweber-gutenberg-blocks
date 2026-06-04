import { RichText } from '@wordpress/block-editor';
import {
	getTitleClasses,
	getSubtitleClasses,
	getSubtitleAlignWrapperClass,
} from './utils';
import { ParagraphRenderSave } from '../../components/paragraph';

// Функция для очистки тегов strong из HTML
const cleanStrongTags = (html) => {
	if (!html) return html;
	// Удаляем все вложенные теги strong, сохраняя содержимое
	let cleaned = html;
	let previous = '';
	// Повторяем до тех пор, пока есть изменения
	while (cleaned !== previous) {
		previous = cleaned;
		cleaned = cleaned
			.replace(/<strong[^>]*>/gi, '')
			.replace(/<\/strong>/gi, '');
	}
	return cleaned;
};

const HeadingSubtitleSave = ({ attributes }) => {
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
		// Очищаем strong теги перед сохранением
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
		const subtitleEl = (
			<RichText.Content
				key="subtitle"
				tagName={subtitleTag}
				value={subtitle}
				className={getSubtitleClasses(attributes)}
			/>
		);
		const subtitleWrapClass = getSubtitleAlignWrapperClass(attributes);
		elements.push(
			subtitleWrapClass ? (
				<div key="subtitle-wrap" className={subtitleWrapClass}>
					{subtitleEl}
				</div>
			) : (
				subtitleEl
			)
		);
	}

	if (order === 'subtitle-first') {
		elements.reverse();
	}

	// Paragraph всегда после title и subtitle
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

	// Обёртка с Bootstrap-классами для вертикального позиционирования
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

export default HeadingSubtitleSave;
