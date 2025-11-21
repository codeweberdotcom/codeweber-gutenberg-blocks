import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getRowClassNames, normalizeRowData, normalizeRowId } from './utils';

const RowSave = ({ attributes }) => {
	const { rowId, rowData } = attributes;
	const blockProps = useBlockProps.save({
		className: getRowClassNames(attributes),
		id: normalizeRowId(rowId) || undefined,
	});

	return (
		<div {...blockProps} {...normalizeRowData(rowData)}>
			<InnerBlocks.Content />
		</div>
	);
};

export default RowSave;


