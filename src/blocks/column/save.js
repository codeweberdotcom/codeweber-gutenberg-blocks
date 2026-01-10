import { InnerBlocks } from '@wordpress/block-editor';
import {
	getColumnClassNames,
	normalizeColumnId,
	normalizeColumnData,
} from './utils';

const ColumnSave = ({ attributes }) => {
	const {
		columnId,
		columnData,
		backgroundType,
		backgroundImageUrl,
		backgroundPatternUrl,
	} = attributes;

	const hasValidImageUrl =
		backgroundImageUrl &&
		backgroundImageUrl !== 'null' &&
		backgroundImageUrl.trim() !== '';
	const hasValidPatternUrl =
		backgroundPatternUrl &&
		backgroundPatternUrl !== 'null' &&
		backgroundPatternUrl.trim() !== '';

	const dataAttributes = {
		...(backgroundType === 'image' &&
			hasValidImageUrl && { 'data-image-src': backgroundImageUrl }),
		...(backgroundType === 'pattern' &&
			hasValidPatternUrl && { 'data-image-src': backgroundPatternUrl }),
	};

	const blockProps = {
		className: getColumnClassNames(attributes),
		id: normalizeColumnId(columnId) || undefined,
		...dataAttributes,
	};

	return (
		<div {...blockProps} {...normalizeColumnData(columnData)}>
			<InnerBlocks.Content />
		</div>
	);
};

export default ColumnSave;
