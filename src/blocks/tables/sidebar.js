/**
 * Tables Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { colors } from '../../utilities/colors';

export const TablesSidebar = ({ attributes, setAttributes }) => {
	const {
		sourceMode,
		csvDocumentId,
		tableDark,
		tableSm,
		tableStriped,
		tableStripedColumns,
		tableBordered,
		tableBorderless,
		tableHover,
		tableVariant,
		textColor,
		customTableClass,
		theadVariant,
		theadTextColor,
		showHeader,
		hideTopBorder,
		hideBottomBorder,
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
					label={__('table-sm', 'codeweber-gutenberg-blocks')}
					checked={tableSm === true}
					onChange={(v) => setAttributes({ tableSm: v })}
				/>
				<ToggleControl
					label={__('table-striped', 'codeweber-gutenberg-blocks')}
					checked={tableStriped === true}
					onChange={(v) => setAttributes({ tableStriped: v })}
				/>
				<ToggleControl
					label={__('table-striped-columns', 'codeweber-gutenberg-blocks')}
					checked={tableStripedColumns === true}
					onChange={(v) => setAttributes({ tableStripedColumns: v })}
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
					label={__('Hide top border line', 'codeweber-gutenberg-blocks')}
					help={__(
						'Remove the border above the first row (border-top-0).',
						'codeweber-gutenberg-blocks'
					)}
					checked={hideTopBorder === true}
					onChange={(v) => setAttributes({ hideTopBorder: v })}
				/>
				<ToggleControl
					label={__('Hide bottom border line', 'codeweber-gutenberg-blocks')}
					help={__(
						'Remove the border below the last row (border-bottom-0).',
						'codeweber-gutenberg-blocks'
					)}
					checked={hideBottomBorder === true}
					onChange={(v) => setAttributes({ hideBottomBorder: v })}
				/>
				<ToggleControl
					label={__('table-hover', 'codeweber-gutenberg-blocks')}
					checked={tableHover === true}
					onChange={(v) => setAttributes({ tableHover: v })}
				/>

				{/* Contextual table color */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>
						{__('Table color', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<SelectControl
					value={tableVariant || ''}
					options={[
						{ value: '', label: __('— None —', 'codeweber-gutenberg-blocks') },
						{ value: 'primary', label: 'table-primary' },
						{ value: 'secondary', label: 'table-secondary' },
						{ value: 'success', label: 'table-success' },
						{ value: 'danger', label: 'table-danger' },
						{ value: 'warning', label: 'table-warning' },
						{ value: 'info', label: 'table-info' },
						{ value: 'light', label: 'table-light' },
						{ value: 'dark', label: 'table-dark' },
					]}
					onChange={(v) => setAttributes({ tableVariant: v })}
				/>

				{/* Font color — independent of the table theme/variant */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>
						{__('Font color', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<SelectControl
					value={textColor || ''}
					options={[
						{ value: '', label: __('— Default —', 'codeweber-gutenberg-blocks') },
						...colors.map((c) => ({ value: c.value, label: c.label })),
					]}
					onChange={(v) => setAttributes({ textColor: v })}
				/>

				{/* Custom CSS classes on the <table> tag */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>
						{__('Custom table classes', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<TextControl
					value={customTableClass || ''}
					help={__(
						'Add your own classes to the <table> tag, space-separated.',
						'codeweber-gutenberg-blocks'
					)}
					onChange={(v) => setAttributes({ customTableClass: v })}
				/>

				{/* Header style + visibility */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>
						{__('Header', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<ToggleControl
					label={__('Show table header', 'codeweber-gutenberg-blocks')}
					help={__(
						'Hide the <thead> row on the frontend.',
						'codeweber-gutenberg-blocks'
					)}
					checked={showHeader !== false}
					onChange={(v) => setAttributes({ showHeader: v })}
				/>
				<SelectControl
					label={__('Header background', 'codeweber-gutenberg-blocks')}
					value={theadVariant || ''}
					options={[
						{ value: '', label: __('— Default —', 'codeweber-gutenberg-blocks') },
						{ value: '', label: '── Bootstrap ──', disabled: true },
						{ value: 'table-primary', label: 'table-primary' },
						{ value: 'table-secondary', label: 'table-secondary' },
						{ value: 'table-success', label: 'table-success' },
						{ value: 'table-danger', label: 'table-danger' },
						{ value: 'table-warning', label: 'table-warning' },
						{ value: 'table-info', label: 'table-info' },
						{ value: 'table-light', label: 'table-light' },
						{ value: 'table-dark', label: 'table-dark' },
						{ value: '', label: '── Theme colors ──', disabled: true },
						{ value: 'table-blue', label: 'table-blue' },
						{ value: 'table-sky', label: 'table-sky' },
						{ value: 'table-purple', label: 'table-purple' },
						{ value: 'table-grape', label: 'table-grape' },
						{ value: 'table-violet', label: 'table-violet' },
						{ value: 'table-pink', label: 'table-pink' },
						{ value: 'table-fuchsia', label: 'table-fuchsia' },
						{ value: 'table-red', label: 'table-red' },
						{ value: 'table-orange', label: 'table-orange' },
						{ value: 'table-yellow', label: 'table-yellow' },
						{ value: 'table-green', label: 'table-green' },
						{ value: 'table-leaf', label: 'table-leaf' },
						{ value: 'table-aqua', label: 'table-aqua' },
						{ value: 'table-navy', label: 'table-navy' },
						{ value: 'table-ash', label: 'table-ash' },
						{ value: 'table-dewalt', label: 'table-dewalt' },
						{ value: 'table-max', label: 'table-max' },
						{ value: 'table-bronze', label: 'table-bronze' },
						{ value: 'table-coffee', label: 'table-coffee' },
						{ value: 'table-flame', label: 'table-flame' },
						{ value: 'table-emerald', label: 'table-emerald' },
						{ value: 'table-crimson', label: 'table-crimson' },
						{ value: 'table-gray', label: 'table-gray' },
							{ value: '', label: '── Solid ──', disabled: true },
							{ value: 'table-blue-solid', label: 'table-blue-solid' },
							{ value: 'table-sky-solid', label: 'table-sky-solid' },
							{ value: 'table-purple-solid', label: 'table-purple-solid' },
							{ value: 'table-grape-solid', label: 'table-grape-solid' },
							{ value: 'table-violet-solid', label: 'table-violet-solid' },
							{ value: 'table-pink-solid', label: 'table-pink-solid' },
							{ value: 'table-fuchsia-solid', label: 'table-fuchsia-solid' },
							{ value: 'table-red-solid', label: 'table-red-solid' },
							{ value: 'table-orange-solid', label: 'table-orange-solid' },
							{ value: 'table-yellow-solid', label: 'table-yellow-solid' },
							{ value: 'table-green-solid', label: 'table-green-solid' },
							{ value: 'table-leaf-solid', label: 'table-leaf-solid' },
							{ value: 'table-aqua-solid', label: 'table-aqua-solid' },
							{ value: 'table-navy-solid', label: 'table-navy-solid' },
							{ value: 'table-ash-solid', label: 'table-ash-solid' },
							{ value: 'table-dewalt-solid', label: 'table-dewalt-solid' },
							{ value: 'table-max-solid', label: 'table-max-solid' },
							{ value: 'table-bronze-solid', label: 'table-bronze-solid' },
							{ value: 'table-coffee-solid', label: 'table-coffee-solid' },
							{ value: 'table-flame-solid', label: 'table-flame-solid' },
							{ value: 'table-emerald-solid', label: 'table-emerald-solid' },
							{ value: 'table-crimson-solid', label: 'table-crimson-solid' },
							{ value: 'table-gray-solid', label: 'table-gray-solid' },
					]}
					disabled={showHeader === false}
					onChange={(v) => setAttributes({ theadVariant: v })}
				/>
				<SelectControl
					label={__('Header text color', 'codeweber-gutenberg-blocks')}
					value={theadTextColor || ''}
					options={[
						{ value: '', label: __('— Auto —', 'codeweber-gutenberg-blocks') },
						{ value: 'text-dark', label: __('Dark', 'codeweber-gutenberg-blocks') },
						{ value: 'text-white', label: __('Light', 'codeweber-gutenberg-blocks') },
					]}
					disabled={showHeader === false}
					onChange={(v) => setAttributes({ theadTextColor: v })}
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
