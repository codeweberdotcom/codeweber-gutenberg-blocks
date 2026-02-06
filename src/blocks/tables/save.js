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
		? { content: c, colspan: 1, rowspan: 1 }
		: {
				content: c?.content ?? '',
				colspan: Math.max(1, c?.colspan ?? 1),
				rowspan: Math.max(1, c?.rowspan ?? 1),
		  };

const TablesSave = ({ attributes }) => {
	const {
		sourceMode,
		tableDark,
		tableStriped,
		tableBordered,
		tableBorderless,
		tableHover,
		responsive,
		headerCells,
		rows,
	} = attributes;

	// CSV mode: server-side render only, no saved content
	if (sourceMode === 'csv') {
		return null;
	}

	const headerCellsNorm = (headerCells || []).map(normalizeCell);
	const getRowCells = (row) => (row?.cells || []).map(normalizeCell);
	const totalHeaderCols = headerCellsNorm.reduce((s, c) => s + c.colspan, 0);

	const getCoveredColsForRow = (rowIndex) => {
		const covered = new Set();
		for (let r = 0; r < rows.length; r++) {
			const cells = getRowCells(rows[r]);
			let col = 0;
			let cellIdx = 0;
			while (col < totalHeaderCols && cellIdx < cells.length) {
				if (covered.has(`${r}:${col}`)) {
					col++;
					continue;
				}
				const cell = cells[cellIdx];
				const rowspan = cell.rowspan ?? 1;
				const colspan = cell.colspan ?? 1;
				for (let i = 1; i < rowspan; i++) {
					for (let j = 0; j < colspan; j++) {
						covered.add(`${r + i}:${col + j}`);
					}
				}
				col += colspan;
				cellIdx++;
			}
		}
		let count = 0;
		for (let c = 0; c < totalHeaderCols; c++) {
			if (covered.has(`${rowIndex}:${c}`)) count++;
		}
		return count;
	};

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
					const coveredCols = getCoveredColsForRow(rowIndex);
					const freeCols = totalHeaderCols - coveredCols;
					const padColspan = Math.max(0, freeCols - totalRowCols);
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
										rowSpan={
											(cell.rowspan ?? 1) > 1 ? cell.rowspan : undefined
										}
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
