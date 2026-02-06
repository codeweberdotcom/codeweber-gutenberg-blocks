/**
 * Tables Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export const TablesSidebar = ({ attributes, setAttributes }) => {
	const {
		sourceMode,
		csvDocumentId,
		tableDark,
		tableStriped,
		tableBordered,
		tableBorderless,
		tableHover,
		responsive,
	} = attributes;

	const [documents, setDocuments] = useState([]);
	const [loadingDocs, setLoadingDocs] = useState(false);

	useEffect(() => {
		if (sourceMode !== 'csv') return;
		setLoadingDocs(true);
		apiFetch({ path: '/codeweber-gutenberg-blocks/v1/documents-csv' })
			.then((data) => {
				setDocuments(Array.isArray(data) ? data : []);
			})
			.catch(() => setDocuments([]))
			.finally(() => setLoadingDocs(false));
	}, [sourceMode]);

	return (
		<>
			<PanelBody
				title={__('Data Source', 'codeweber-gutenberg-blocks')}
				initialOpen={true}
			>
				<SelectControl
					label={__('Display mode', 'codeweber-gutenberg-blocks')}
					value={sourceMode || 'manual'}
					options={[
						{ value: 'manual', label: __('Manual table', 'codeweber-gutenberg-blocks') },
						{ value: 'csv', label: __('CSV/XLS/XLSX from Documents', 'codeweber-gutenberg-blocks') },
					]}
					onChange={(v) => setAttributes({ sourceMode: v, csvDocumentId: v === 'csv' ? csvDocumentId : 0 })}
				/>
				{sourceMode === 'csv' && (
					<SelectControl
						label={__('Document (CSV/XLS/XLSX)', 'codeweber-gutenberg-blocks')}
						value={String(csvDocumentId || '')}
						options={[
							{ value: '', label: loadingDocs ? __('Loading…', 'codeweber-gutenberg-blocks') : __('— Select document —', 'codeweber-gutenberg-blocks') },
							...documents.map((d) => ({ value: String(d.id), label: d.title })),
						]}
						disabled={loadingDocs}
						onChange={(v) => setAttributes({ csvDocumentId: v ? parseInt(v, 10) : 0 })}
					/>
				)}
			</PanelBody>
			<PanelBody
				title={__('Table Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
			>
				{/* Table Style Modifiers - можно комбинировать */}
				<div className="component-sidebar-title">
					<label>
						{__('Table classes', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<ToggleControl
					label={__('table-dark', 'codeweber-gutenberg-blocks')}
					checked={tableDark === true}
					onChange={(v) => setAttributes({ tableDark: v })}
				/>
				<ToggleControl
					label={__('table-striped', 'codeweber-gutenberg-blocks')}
					checked={tableStriped === true}
					onChange={(v) => setAttributes({ tableStriped: v })}
				/>
				<ToggleControl
					label={__('table-bordered', 'codeweber-gutenberg-blocks')}
					checked={tableBordered === true}
					onChange={(v) => setAttributes({ tableBordered: v })}
				/>
				<ToggleControl
					label={__('table-borderless', 'codeweber-gutenberg-blocks')}
					checked={tableBorderless === true}
					onChange={(v) => setAttributes({ tableBorderless: v })}
				/>
				<ToggleControl
					label={__('table-hover', 'codeweber-gutenberg-blocks')}
					checked={tableHover === true}
					onChange={(v) => setAttributes({ tableHover: v })}
				/>

				{/* Responsive Toggle */}
				<div style={{ marginTop: '16px' }}>
					<ToggleControl
						label={__('Responsive', 'codeweber-gutenberg-blocks')}
						help={__(
							'Wrap table in table-responsive for horizontal scroll on small screens.',
							'codeweber-gutenberg-blocks'
						)}
						checked={responsive === true}
						onChange={(enabled) =>
							setAttributes({ responsive: enabled })
						}
					/>
				</div>
			</PanelBody>
		</>
	);
};
