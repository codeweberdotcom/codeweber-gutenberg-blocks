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
import { TablesSidebar } from './sidebar';

const normalizeCell = (c) =>
	typeof c === 'string'
		? { content: c, colspan: 1 }
		: { content: c?.content ?? '', colspan: Math.max(1, c?.colspan ?? 1) };

const TablesEdit = ({ attributes, setAttributes }) => {
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
			newCells.push({ content: '', colspan: 1 });
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
			{ content: cell.content, colspan: 1 },
			{ content: '', colspan: 1 },
			...Array.from({ length: cell.colspan - 2 }, () => ({
				content: '',
				colspan: 1,
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
			{ content: cell.content, colspan: 1 },
			{ content: '', colspan: 1 },
			...Array.from({ length: cell.colspan - 2 }, () => ({
				content: '',
				colspan: 1,
			})),
			...cells.slice(cellIndex + 1),
		];
		newRows[rowIndex] = { ...newRows[rowIndex], cells: newCells };
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
		const emptyCells = headerCellsNorm.map(() => ({ content: '', colspan: 1 }));
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
		const padColspan = totalHeaderCols - totalRowCols;
		if (padColspan <= 0) return;
		const newRows = [...rows];
		const newCells = [...rowCells, { content: value, colspan: padColspan }];
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
					const padColspan = totalHeaderCols - totalRowCols;
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

	return (
		<>
			<InspectorControls>
				<TablesSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
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
			</div>
		</>
	);
};

export default TablesEdit;
