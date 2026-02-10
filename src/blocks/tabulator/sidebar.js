/**
 * Tabulator Block - Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
	RangeControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export const TabulatorSidebar = ({ attributes, setAttributes }) => {
	const {
		documentId,
		height,
		layout,
		theme,
		exportEnabled,
		sortable,
		resizableColumns,
		movableColumns,
		headerFilter,
		columnMinWidth,
		columnMaxWidth,
	} = attributes;

	const [documents, setDocuments] = useState([]);
	const [loadingDocs, setLoadingDocs] = useState(false);

	useEffect(() => {
		setLoadingDocs(true);
		apiFetch({ path: '/codeweber-gutenberg-blocks/v1/documents-csv' })
			.then((data) => {
				setDocuments(Array.isArray(data) ? data : []);
			})
			.catch(() => setDocuments([]))
			.finally(() => setLoadingDocs(false));
	}, []);

	return (
		<>
			<PanelBody title={__('Data Source', 'codeweber-gutenberg-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Document (CSV/XLS/XLSX)', 'codeweber-gutenberg-blocks')}
					value={String(documentId || '')}
					options={[
						{
							value: '',
							label: loadingDocs
								? __('Loading…', 'codeweber-gutenberg-blocks')
								: __('— Select document —', 'codeweber-gutenberg-blocks'),
						},
						...documents.map((d) => ({ value: String(d.id), label: d.title })),
					]}
					disabled={loadingDocs}
					onChange={(v) => setAttributes({ documentId: v ? parseInt(v, 10) : 0 })}
				/>
			</PanelBody>

			<PanelBody title={__('Display', 'codeweber-gutenberg-blocks')} initialOpen={true}>
				<TextControl
					label={__('Height', 'codeweber-gutenberg-blocks')}
					value={height}
					onChange={(v) => setAttributes({ height: v || '400px' })}
					help={__('e.g. 400px, 50vh', 'codeweber-gutenberg-blocks')}
				/>
				<SelectControl
					label={__('Layout', 'codeweber-gutenberg-blocks')}
					value={layout}
					options={[
						{ value: 'fitColumns', label: __('Fit Columns', 'codeweber-gutenberg-blocks') },
						{ value: 'fitData', label: __('Fit Data', 'codeweber-gutenberg-blocks') },
						{ value: 'fitDataFill', label: __('Fit Data Fill', 'codeweber-gutenberg-blocks') },
					]}
					onChange={(v) => setAttributes({ layout: v })}
				/>
				<SelectControl
					label={__('Theme', 'codeweber-gutenberg-blocks')}
					value={theme}
					options={[
						{ value: 'midnight', label: __('Midnight (dark)', 'codeweber-gutenberg-blocks') },
						{ value: 'modern', label: __('Modern', 'codeweber-gutenberg-blocks') },
						{ value: 'default', label: __('Default (light)', 'codeweber-gutenberg-blocks') },
					]}
					onChange={(v) => setAttributes({ theme: v })}
				/>
			</PanelBody>

			<PanelBody title={__('Export', 'codeweber-gutenberg-blocks')}>
				<ToggleControl
					label={__('Export buttons', 'codeweber-gutenberg-blocks')}
					help={__('Show CSV/JSON export buttons above the table', 'codeweber-gutenberg-blocks')}
					checked={exportEnabled !== false}
					onChange={(v) => setAttributes({ exportEnabled: v })}
				/>
			</PanelBody>

			<PanelBody title={__('Columns', 'codeweber-gutenberg-blocks')}>
				<ToggleControl
					label={__('Sortable', 'codeweber-gutenberg-blocks')}
					help={__('Allow sorting by clicking column header', 'codeweber-gutenberg-blocks')}
					checked={sortable}
					onChange={(v) => setAttributes({ sortable: v })}
				/>
				<ToggleControl
					label={__('Resizable columns', 'codeweber-gutenberg-blocks')}
					checked={resizableColumns}
					onChange={(v) => setAttributes({ resizableColumns: v })}
				/>
				<ToggleControl
					label={__('Movable columns', 'codeweber-gutenberg-blocks')}
					help={__('Allow drag to reorder columns', 'codeweber-gutenberg-blocks')}
					checked={movableColumns}
					onChange={(v) => setAttributes({ movableColumns: v })}
				/>
				<ToggleControl
					label={__('Header filter', 'codeweber-gutenberg-blocks')}
					help={__('Search/filter input in column headers', 'codeweber-gutenberg-blocks')}
					checked={headerFilter}
					onChange={(v) => setAttributes({ headerFilter: v })}
				/>
				<RangeControl
					label={__('Min column width (px)', 'codeweber-gutenberg-blocks')}
					value={columnMinWidth}
					onChange={(v) => setAttributes({ columnMinWidth: v })}
					min={40}
					max={200}
					step={10}
				/>
				<RangeControl
					label={__('Max column width (px)', 'codeweber-gutenberg-blocks')}
					value={columnMaxWidth}
					onChange={(v) => setAttributes({ columnMaxWidth: v })}
					min={0}
					max={800}
					step={50}
				/>
			</PanelBody>
		</>
	);
};
