/**
 * Tables Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 * Based on Bootstrap 5 tables from Sandbox template
 * https://sandbox.elemisthemes.com/docs/elements/tables.html
 */

import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { TablesSidebar } from './sidebar';

const normalizeCell = (c) =>
	typeof c === 'string'
		? { content: c, colspan: 1, rowspan: 1 }
		: {
				content: c?.content ?? '',
				colspan: Math.max(1, c?.colspan ?? 1),
				rowspan: Math.max(1, c?.rowspan ?? 1),
		  };

const TablesEdit = ({ attributes, setAttributes }) => {
	const {
		sourceMode,
		csvDocumentId,
		tableDark,
		tableStriped,
		tableBordered,
		tableBorderless,
		tableHover,
		responsive,
		headerCells,
		rows,
	} = attributes;

	const [csvPreview, setCsvPreview] = useState({ header: [], rows: [] });
	const [csvLoading, setCsvLoading] = useState(false);

	useEffect(() => {
		if (sourceMode !== 'csv' || !csvDocumentId) {
			setCsvPreview({ header: [], rows: [] });
			return;
		}
		setCsvLoading(true);
		apiFetch({ path: `/codeweber-gutenberg-blocks/v1/documents/${csvDocumentId}/csv` })
			.then((data) => {
				setCsvPreview({
					header: data?.rows?.[0] || [],
					rows: data?.rows?.slice(1) || [],
				});
			})
			.catch(() => setCsvPreview({ header: [], rows: [] }))
			.finally(() => setCsvLoading(false));
	}, [sourceMode, csvDocumentId]);

	const headerCellsNorm = (headerCells || []).map(normalizeCell);
	const getRowCells = (row) => (row?.cells || []).map(normalizeCell);

	const getTableClasses = () => {
		const classes = ['table'];
		if (tableDark) classes.push('table-dark');
		if (tableStriped) classes.push('table-striped');
		if (tableBordered) classes.push('table-bordered');
		if (tableBorderless) classes.push('table-borderless');
		if (tableHover) classes.push('table-hover');
		return classes.join(' ');
	};

	const updateHeaderCell = (index, value) => {
		const newHeader = headerCellsNorm.map((c, i) =>
			i === index ? { ...c, content: value } : c
		);
		setAttributes({ headerCells: newHeader });
	};

	const updateRowCell = (rowIndex, cellIndex, value) => {
		const newRows = [...rows];
		const currentCells = getRowCells(newRows[rowIndex]);
		const newCells = [...currentCells];
		while (newCells.length <= cellIndex) {
			newCells.push({ content: '', colspan: 1, rowspan: 1 });
		}
		newCells[cellIndex] = { ...newCells[cellIndex], content: value };
		newRows[rowIndex] = { ...newRows[rowIndex], cells: newCells };
		setAttributes({ rows: newRows });
	};

	const mergeHeaderCells = (index) => {
		if (index >= headerCellsNorm.length - 1) return;
		const newHeader = headerCellsNorm
			.map((c, i) => {
				if (i === index) {
					const next = headerCellsNorm[index + 1];
					return {
						content: (c.content + ' ' + next.content).trim(),
						colspan: c.colspan + next.colspan,
						rowspan: c.rowspan ?? 1,
					};
				}
				if (i === index + 1) return null;
				return c;
			})
			.filter(Boolean);
		setAttributes({ headerCells: newHeader });
	};

	const splitHeaderCell = (index) => {
		const cell = headerCellsNorm[index];
		if (!cell || cell.colspan <= 1) return;
		const newHeader = [
			...headerCellsNorm.slice(0, index),
			{ content: cell.content, colspan: 1, rowspan: 1 },
			{ content: '', colspan: 1, rowspan: 1 },
			...Array.from({ length: cell.colspan - 2 }, () => ({
				content: '',
				colspan: 1,
				rowspan: 1,
			})),
			...headerCellsNorm.slice(index + 1),
		];
		setAttributes({ headerCells: newHeader });
	};

	const mergeRowCells = (rowIndex, cellIndex) => {
		const cells = getRowCells(rows[rowIndex]);
		if (cellIndex >= cells.length - 1) return;
		const newRows = [...rows];
		const newCells = cells
			.map((c, i) => {
				if (i === cellIndex) {
					const next = cells[cellIndex + 1];
					return {
						content: (c.content + ' ' + next.content).trim(),
						colspan: c.colspan + next.colspan,
						rowspan: c.rowspan ?? 1,
					};
				}
				if (i === cellIndex + 1) return null;
				return c;
			})
			.filter(Boolean);
		newRows[rowIndex] = { ...newRows[rowIndex], cells: newCells };
		setAttributes({ rows: newRows });
	};

	const splitRowCell = (rowIndex, cellIndex) => {
		const cells = getRowCells(rows[rowIndex]);
		const cell = cells[cellIndex];
		if (!cell || cell.colspan <= 1) return;
		const newRows = [...rows];
		const newCells = [
			...cells.slice(0, cellIndex),
			{ content: cell.content, colspan: 1, rowspan: 1 },
			{ content: '', colspan: 1, rowspan: 1 },
			...Array.from({ length: cell.colspan - 2 }, () => ({
				content: '',
				colspan: 1,
				rowspan: 1,
			})),
			...cells.slice(cellIndex + 1),
		];
		newRows[rowIndex] = { ...newRows[rowIndex], cells: newCells };
		setAttributes({ rows: newRows });
	};

	// Layout: для каждой строки — массив { cell, colIndex, cellIndex, rowspan, colspan }
	// coveredSet: Set "row:col" для покрытых rowspan ячеек
	const buildBodyLayout = () => {
		const covered = new Set();
		const layout = [];
		for (let r = 0; r < rows.length; r++) {
			layout[r] = [];
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
				layout[r].push({
					cell,
					colIndex: col,
					cellIndex: cellIdx,
					rowspan,
					colspan,
				});
				for (let i = 1; i < rowspan; i++) {
					for (let j = 0; j < colspan; j++) {
						covered.add(`${r + i}:${col + j}`);
					}
				}
				col += colspan;
				cellIdx++;
			}
		}
		return { layout, covered };
	};

	const getCoveredColsForRow = (rowIndex) => {
		const { covered } = buildBodyLayout();
		let count = 0;
		for (let c = 0; c < totalHeaderCols; c++) {
			if (covered.has(`${rowIndex}:${c}`)) count++;
		}
		return count;
	};

	const mergeRowCellsDown = (rowIndex, cellIndex) => {
		if (rowIndex >= rows.length - 1) return;
		const { layout } = buildBodyLayout();
		const rowLayout = layout[rowIndex];
		const item = rowLayout?.find((x) => x.cellIndex === cellIndex);
		if (!item) return;
		const { colIndex, colspan } = item;
		// Ищем ячейку в следующей строке в той же колонке
		const nextRowLayout = layout[rowIndex + 1];
		const nextItem = nextRowLayout?.find(
			(x) => x.colIndex >= colIndex && x.colIndex < colIndex + colspan
		);
		if (!nextItem) return; // уже объединено или нет строки
		const newRows = [...rows];
		const currentCells = getRowCells(newRows[rowIndex]);
		const nextCells = getRowCells(newRows[rowIndex + 1]);
		const currentCell = currentCells[cellIndex];
		const nextCell = nextCells[nextItem.cellIndex];
		const mergedCell = {
			content: (currentCell.content + ' ' + nextCell.content).trim(),
			colspan: currentCell.colspan,
			rowspan: (currentCell.rowspan ?? 1) + (nextCell.rowspan ?? 1),
		};
		const newCurrentCells = currentCells.map((c, i) =>
			i === cellIndex ? mergedCell : c
		);
		const newNextCells = nextCells.filter((_, i) => i !== nextItem.cellIndex);
		newRows[rowIndex] = { ...newRows[rowIndex], cells: newCurrentCells };
		newRows[rowIndex + 1] = { ...newRows[rowIndex + 1], cells: newNextCells };
		setAttributes({ rows: newRows });
	};

	const splitRowCellDown = (rowIndex, cellIndex) => {
		const cells = getRowCells(rows[rowIndex]);
		const cell = cells[cellIndex];
		if (!cell || (cell.rowspan ?? 1) <= 1) return;
		const newRows = [...rows];
		const newCurrentCells = cells.map((c, i) =>
			i === cellIndex ? { ...c, rowspan: 1 } : c
		);
		// Вставляем новую ячейку в следующую строку
		const { layout } = buildBodyLayout();
		const nextRowLayout = layout[rowIndex + 1];
		const item = layout[rowIndex]?.find((x) => x.cellIndex === cellIndex);
		if (!item || !nextRowLayout) return;
		const { colIndex } = item;
		const idx = nextRowLayout.findIndex((x) => x.colIndex >= colIndex);
		const insertIdx = idx === -1 ? nextRowLayout.length : idx;
		const nextCells = getRowCells(newRows[rowIndex + 1]);
		const newNextCells = [
			...nextCells.slice(0, insertIdx),
			{ content: '', colspan: cell.colspan, rowspan: 1 },
			...nextCells.slice(insertIdx),
		];
		newRows[rowIndex] = { ...newRows[rowIndex], cells: newCurrentCells };
		newRows[rowIndex + 1] = { ...newRows[rowIndex + 1], cells: newNextCells };
		setAttributes({ rows: newRows });
	};

	const addColumn = () => {
		setAttributes({
			headerCells: [
				...headerCellsNorm,
				{ content: __('New', 'codeweber-gutenberg-blocks'), colspan: 1 },
			],
			rows: rows.map((row) => ({
				...row,
				cells: [...getRowCells(row), { content: '', colspan: 1 }],
			})),
		});
	};

	const removeColumn = (colIndex) => {
		if (headerCellsNorm.length <= 1) return;
		setAttributes({
			headerCells: headerCellsNorm.filter((_, i) => i !== colIndex),
			rows: rows.map((row) => ({
				...row,
				cells: getRowCells(row).filter((_, i) => i !== colIndex),
			})),
		});
	};

	const addRow = () => {
		const emptyCells = headerCellsNorm.map(() => ({
			content: '',
			colspan: 1,
			rowspan: 1,
		}));
		setAttributes({
			rows: [...rows, { cells: emptyCells }],
		});
	};

	const removeRow = (rowIndex) => {
		if (rows.length <= 1) return;
		setAttributes({
			rows: rows.filter((_, i) => i !== rowIndex),
		});
	};

	const totalHeaderCols = headerCellsNorm.reduce((s, c) => s + c.colspan, 0);

	const updateRowPadCell = (rowIndex, value) => {
		const rowCells = getRowCells(rows[rowIndex]);
		const totalRowCols = rowCells.reduce((s, c) => s + c.colspan, 0);
		const coveredCols = getCoveredColsForRow(rowIndex);
		const freeCols = totalHeaderCols - coveredCols;
		const padColspan = Math.max(0, freeCols - totalRowCols);
		if (padColspan <= 0) return;
		const newRows = [...rows];
		const newCells = [
			...rowCells,
			{ content: value, colspan: padColspan, rowspan: 1 },
		];
		newRows[rowIndex] = { ...newRows[rowIndex], cells: newCells };
		setAttributes({ rows: newRows });
	};

	const blockProps = useBlockProps({
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
							<div className="tables-cell-controls">
								<Button
									isSmall
									isDestructive
									onClick={(e) => {
										e.stopPropagation();
										removeColumn(colIndex);
									}}
									disabled={headerCellsNorm.length <= 1}
									title={__('Remove column', 'codeweber-gutenberg-blocks')}
								>
									×
								</Button>
								{colIndex < headerCellsNorm.length - 1 && (
									<Button
										isSmall
										isSecondary
										onClick={(e) => {
											e.stopPropagation();
											mergeHeaderCells(colIndex);
										}}
										title={__(
											'Merge with next cell',
											'codeweber-gutenberg-blocks'
										)}
									>
										⇄
									</Button>
								)}
								{cell.colspan > 1 && (
									<Button
										isSmall
										isSecondary
										onClick={(e) => {
											e.stopPropagation();
											splitHeaderCell(colIndex);
										}}
										title={__('Split cell', 'codeweber-gutenberg-blocks')}
									>
										⊣
									</Button>
								)}
							</div>
							<RichText
								tagName="span"
								value={cell.content}
								onChange={(value) => updateHeaderCell(colIndex, value)}
								placeholder={__('Header…', 'codeweber-gutenberg-blocks')}
								withoutInteractiveFormatting
							/>
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
					const { layout: bodyLayout } = buildBodyLayout();
					const canMergeDown = (rIdx, cIdx) => {
						if (rIdx >= rows.length - 1) return false;
						const item = bodyLayout[rIdx]?.find((x) => x.cellIndex === cIdx);
						if (!item) return false;
						const next = bodyLayout[rIdx + 1]?.find(
							(x) =>
								x.colIndex >= item.colIndex &&
								x.colIndex < item.colIndex + item.colspan
						);
						return !!next;
					};
					return (
						<tr key={rowIndex} className="tables-editor-row">
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
										{colIndex === 0 && (
											<span className="tables-row-actions">
												<Button
													isSmall
													isDestructive
													onClick={() => removeRow(rowIndex)}
													disabled={rows.length <= 1}
													title={__(
														'Remove row',
														'codeweber-gutenberg-blocks'
													)}
												>
													×
												</Button>
											</span>
										)}
										<div className="tables-cell-controls">
											{colIndex < rowCells.length - 1 && (
												<Button
													isSmall
													isSecondary
													onClick={(e) => {
														e.stopPropagation();
														mergeRowCells(rowIndex, colIndex);
													}}
													title={__(
														'Merge with next cell',
														'codeweber-gutenberg-blocks'
													)}
												>
													⇄
												</Button>
											)}
											{cell.colspan > 1 && (
												<Button
													isSmall
													isSecondary
													onClick={(e) => {
														e.stopPropagation();
														splitRowCell(rowIndex, colIndex);
													}}
													title={__(
														'Split cell',
														'codeweber-gutenberg-blocks'
													)}
												>
													⊣
												</Button>
											)}
											{canMergeDown(rowIndex, colIndex) && (
												<Button
													isSmall
													isSecondary
													onClick={(e) => {
														e.stopPropagation();
														mergeRowCellsDown(rowIndex, colIndex);
													}}
													title={__(
														'Merge with cell below',
														'codeweber-gutenberg-blocks'
													)}
												>
													⇕
												</Button>
											)}
											{(cell.rowspan ?? 1) > 1 && (
												<Button
													isSmall
													isSecondary
													onClick={(e) => {
														e.stopPropagation();
														splitRowCellDown(rowIndex, colIndex);
													}}
													title={__(
														'Split cell vertically',
														'codeweber-gutenberg-blocks'
													)}
												>
													⊤
												</Button>
											)}
										</div>
										<RichText
											tagName="span"
											value={cell.content}
											onChange={(value) =>
												updateRowCell(rowIndex, colIndex, value)
											}
											placeholder={__('…', 'codeweber-gutenberg-blocks')}
											withoutInteractiveFormatting
										/>
									</CellTag>
								);
							})}
							{padColspan > 0 && (
								<td colSpan={padColspan}>
									<RichText
										tagName="span"
										value=""
										onChange={(value) =>
											updateRowPadCell(rowIndex, value)
										}
										placeholder="…"
										withoutInteractiveFormatting
									/>
								</td>
							)}
						</tr>
					);
				})}
			</tbody>
		</table>
	);

	const isCsvMode = sourceMode === 'csv';
	const csvTableContent = (
		<table className={getTableClasses()}>
			<thead>
				<tr>
					{csvPreview.header.map((cell, i) => (
						<th key={i} scope="col">
							{String(cell)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{csvPreview.rows.map((row, ri) => (
					<tr key={ri}>
						{row.map((cell, ci) => (
							<td key={ci}>{String(cell)}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);

	return (
		<>
			<InspectorControls>
				<TablesSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				{isCsvMode ? (
					<>
						{csvLoading ? (
							<p>{__('Loading CSV…', 'codeweber-gutenberg-blocks')}</p>
						) : csvDocumentId && (csvPreview.header.length > 0 || csvPreview.rows.length > 0) ? (
							responsive ? (
								<div className="table-responsive">{csvTableContent}</div>
							) : (
								csvTableContent
							)
						) : (
							<p className="tables-csv-placeholder">
								{__('Select a CSV document in the sidebar. Table updates when the document changes.', 'codeweber-gutenberg-blocks')}
							</p>
						)}
					</>
				) : (
					<>
						{responsive ? (
							<div className="table-responsive">{tableContent}</div>
						) : (
							tableContent
						)}
						<div className="tables-block-actions">
							<Button isSmall isSecondary onClick={addColumn}>
								{__('+ Add Column', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button isSmall isSecondary onClick={addRow}>
								{__('+ Add Row', 'codeweber-gutenberg-blocks')}
							</Button>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default TablesEdit;
