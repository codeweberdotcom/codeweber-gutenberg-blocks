import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getColumnsClassNames, normalizeColumnsId, normalizeColumnsData } from './utils';

const ColumnsSave = ({ attributes }) => {
	const { columnsId, columnsData } = attributes;
	const blockProps = useBlockProps.save({
		className: getColumnsClassNames(attributes, 'save'),
		id: normalizeColumnsId(columnsId) || undefined,
	});

	return (
		<div {...blockProps} {...normalizeColumnsData(columnsData)}>
			<InnerBlocks.Content />
		</div>
	);
};

export default ColumnsSave;


