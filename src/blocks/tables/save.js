/**
 * Tables Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 * Based on Bootstrap 5 tables from Sandbox template
 */

import { useBlockProps } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';

const normalizeCell = (c) =>
	typeof c === 'string'
		? { content: c, colspan: 1 }
		: { content: c?.content ?? '', colspan: Math.max(1, c?.colspan ?? 1) };

const TablesSave = ({ attributes }) => {
	const {
		tableDark,
		tableStriped,
		tableBordered,
		tableBorderless,
		tableHover,
		responsive,
		headerCells,
		rows,
	} = attributes;

	const headerCellsNorm = (headerCells || []).map(normalizeCell);
	const getRowCells = (row) => (row?.cells || []).map(normalizeCell);
	const totalHeaderCols = headerCellsNorm.reduce((s, c) => s + c.colspan, 0);

	const getTableClasses = () => {
		const classes = ['table'];
		if (tableDark) classes.push('table-dark');
		if (tableStriped) classes.push('table-striped');
		if (tableBordered) classes.push('table-bordered');
		if (tableBorderless) classes.push('table-borderless');
		if (tableHover) classes.push('table-hover');
		return classes.join(' ');
	};

	const blockProps = useBlockProps.save({
		className: 'wp-block-codeweber-blocks-tables',
	});

	const tableContent = (
		<table className={getTableClasses()}>
			<thead>
				<tr>
					{headerCellsNorm.map((cell, colIndex) => (
						<th
							key={colIndex}
							scope="col"
							colSpan={cell.colspan > 1 ? cell.colspan : undefined}
						>
							<RichText.Content value={cell.content} />
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, rowIndex) => {
					const rowCells = getRowCells(row);
					const totalRowCols = rowCells.reduce((s, c) => s + c.colspan, 0);
					const padColspan = totalHeaderCols - totalRowCols;
					return (
						<tr key={rowIndex}>
							{rowCells.map((cell, colIndex) => {
								const CellTag = colIndex === 0 ? 'th' : 'td';
								const cellProps = colIndex === 0 ? { scope: 'row' } : {};
								return (
									<CellTag
										key={colIndex}
										{...cellProps}
										colSpan={cell.colspan > 1 ? cell.colspan : undefined}
									>
										<RichText.Content value={cell.content} />
									</CellTag>
								);
							})}
							{padColspan > 0 && (
								<td key="pad" colSpan={padColspan}></td>
							)}
						</tr>
					);
				})}
			</tbody>
		</table>
	);

	return (
		<div {...blockProps}>
			{responsive ? (
				<div className="table-responsive">{tableContent}</div>
			) : (
				tableContent
			)}
		</div>
	);
};

export default TablesSave;
