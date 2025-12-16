import { InnerBlocks } from '@wordpress/block-editor';
import { getColumnClassNames, normalizeColumnId, getColumnStyles, normalizeColumnData } from './utils';

const ColumnSave = ({ attributes }) => {
	const { columnId, columnData } = attributes;
	const blockProps = {
		className: getColumnClassNames(attributes),
		id: normalizeColumnId(columnId) || undefined,
		style: getColumnStyles(attributes),
	};

	return (
		<div {...blockProps} {...normalizeColumnData(columnData)}>
			<InnerBlocks.Content />
		</div>
	);
};

export default ColumnSave;


