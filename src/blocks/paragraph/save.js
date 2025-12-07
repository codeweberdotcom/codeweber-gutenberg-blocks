/**
 * Paragraph Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { ParagraphRenderSave } from '../../components/paragraph';

/**
 * Save Component
 */
const Save = ({ attributes }) => {
	const { text, textTag } = attributes;

	// Не сохраняем если текст пустой
	if (!text || text.trim() === '') {
		return null;
	}

	return (
		<ParagraphRenderSave
			attributes={attributes}
			prefix=""
			tag={textTag}
		/>
	);
};

export default Save;






