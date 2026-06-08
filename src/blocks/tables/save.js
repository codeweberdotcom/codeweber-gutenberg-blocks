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
		tableSm,
		tableStriped,
		tableStripedColumns,
		tableBordered,
		tableBorderless,
		tableHover,
		tableVariant,
		theadVariant,
		showHeader,
		hideTopBorder,
		hideBottomBorder,
		responsive,
		headerCells,
		rows,
		columnAligns,
		columnShrink,
	} = attributes;

	const aligns = Array.isArray(columnAligns) ? columnAligns : [];
	const alignClass = (i) => (aligns[i] ? `text-${aligns[i]}` : '');

	const shrink = Array.isArray(columnShrink) ? columnShrink : [];
	const shrinkStyle = (i) =>
		shrink[i] ? { width: '1%', whiteSpace: 'nowrap' } : undefined;

	// CSV mode: server-side render only, no saved content
	if (sourceMode === 'csv') {
		return null;
	}

	const headerCellsNorm = (headerCells || []).map(normalizeCell);
	const getRowCells = (row) => (row?.cells || []).map(normalizeCell);
	const totalHeaderCols = headerCellsNorm.reduce((s, c) => s + c.colspan, 0);

	// Bootstrap-классы скрытия верхней/нижней линии на крайних строках.
	const headerVisible = showHeader !== false;
	const bodyHasNoHeader = !headerVisible || headerCellsNorm.length === 0;
	const headerCellClass = (i) => {
		const c = [alignClass(i)];
		if (hideTopBorder) c.push('border-top-0');
		return c.filter(Boolean).join(' ') || undefined;
	};
	const bodyCellClass = (rowIndex, i) => {
		const c = [alignClass(i)];
		if (hideTopBorder && bodyHasNoHeader && rowIndex === 0) c.push('border-top-0');
		if (hideBottomBorder && rowIndex === rows.length - 1) c.push('border-bottom-0');
		return c.filter(Boolean).join(' ') || undefined;
	};
	const padCellClass = (rowIndex) => {
		const c = [];
		if (hideTopBorder && bodyHasNoHeader && rowIndex === 0) c.push('border-top-0');
		if (hideBottomBorder && rowIndex === rows.length - 1) c.push('border-bottom-0');
		return c.filter(Boolean).join(' ') || undefined;
	};

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
		if (tableSm) classes.push('table-sm');
		if (tableStriped) classes.push('table-striped');
		if (tableStripedColumns) classes.push('table-striped-columns');
		if (tableBordered) classes.push('table-bordered');
		if (tableBorderless) classes.push('table-borderless');
		if (tableHover) classes.push('table-hover');
		if (tableVariant) classes.push(`table-${tableVariant}`);
		return classes.join(' ');
	};

	const blockProps = useBlockProps.save({
		className: 'wp-block-codeweber-blocks-tables',
	});

	const tableContent = (
		<table className={getTableClasses()}>
			{showHeader !== false && (
			<thead className={theadVariant || undefined}>
				<tr>
					{headerCellsNorm.map((cell, colIndex) => (
						<th
							key={colIndex}
							scope="col"
							className={headerCellClass(colIndex)}
							style={shrinkStyle(colIndex)}
							colSpan={cell.colspan > 1 ? cell.colspan : undefined}
						>
							<RichText.Content value={cell.content} />
						</th>
					))}
				</tr>
			</thead>
			)}
			<tbody
				style={
					hideTopBorder && bodyHasNoHeader ? { borderTop: 0 } : undefined
				}
			>
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
										className={bodyCellClass(rowIndex, colIndex)}
										style={shrinkStyle(colIndex)}
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
								<td key="pad" colSpan={padColspan} className={padCellClass(rowIndex)}></td>
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
