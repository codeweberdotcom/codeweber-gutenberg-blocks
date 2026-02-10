/**
 * Tabulator Block - Edit Component
 * Full Tabulator render in editor, same as frontend
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { TabulatorSidebar } from './sidebar';

const THEME_CSS = {
	midnight: 'tabulator_midnight.min.css',
	modern: 'tabulator_modern.min.css',
	default: 'tabulator.min.css',
};

const TabulatorEdit = ({ attributes, setAttributes, clientId }) => {
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

	const selectedClientId = useSelect((select) => select('core/block-editor')?.getSelectedBlockClientId?.(), []);

	const containerRef = useRef(null);
	const tableRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	// Load theme CSS when this block is selected
	useEffect(() => {
		if (selectedClientId !== clientId) return;
		const pluginUrl = window.codeweberBlocksData?.pluginUrl || '';
		if (!pluginUrl) return;
		const themeFile = THEME_CSS[theme] || THEME_CSS.midnight;
		const href = pluginUrl + 'assets/vendor/tabulator/' + themeFile;
		let link = document.getElementById('tabulator-editor-theme');
		if (link) {
			link.href = href;
		} else {
			link = document.createElement('link');
			link.id = 'tabulator-editor-theme';
			link.rel = 'stylesheet';
			link.href = href;
			document.head.appendChild(link);
		}
		return () => {
			// Keep link for other blocks; next selected block will update it
		};
	}, [clientId, selectedClientId, theme]);

	useEffect(() => {
		if (!documentId) {
			setLoading(false);
			setError(null);
			setData(null);
			return;
		}
		setLoading(true);
		setError(null);
		setData(null);
		apiFetch({ path: `/codeweber-gutenberg-blocks/v1/documents/${documentId}/csv` })
			.then((res) => {
				setError(null);
				setData(res);
			})
			.catch((err) => {
				setError(err?.message || __('Error loading data', 'codeweber-gutenberg-blocks'));
				setData(null);
			})
			.finally(() => setLoading(false));
	}, [documentId]);

	useEffect(() => {
		if (!data || !containerRef.current) return;
		if (!data.rows || data.rows.length === 0) return;

		const pluginUrl = window.codeweberBlocksData?.pluginUrl || '';

		const initTabulator = () => {
			if (typeof window.Tabulator === 'undefined') return false;
			const container = containerRef.current;
			if (!container) return false;

			const headers = data.rows[0];
			const rows = data.rows.slice(1);
			const minW = columnMinWidth || 80;
			const maxW = columnMaxWidth || 0;

			const columns = headers.map((h, i) => {
				const col = {
					title: String(h || 'Col' + (i + 1)),
					field: 'col' + i,
					minWidth: minW,
					resizable: resizableColumns !== false,
					headerSort: sortable !== false,
					formatter: 'html',
				};
				if (maxW > 0) col.maxWidth = maxW;
				if (headerFilter) {
					col.headerFilter = 'input';
					col.headerFilterPlaceholder = __('Search…', 'codeweber-gutenberg-blocks');
				}
				return col;
			});

			const tableData = rows.map((row) => {
				const obj = {};
				row.forEach((cell, i) => (obj['col' + i] = cell));
				return obj;
			});

			if (tableRef.current) {
				tableRef.current.destroy();
				tableRef.current = null;
			}

			tableRef.current = new window.Tabulator(container, {
				data: tableData,
				columns,
				layout: layout || 'fitColumns',
				height: height || '400px',
				resizableColumnFit: true,
				movableColumns: movableColumns !== false,
			});
			return true;
		};

		if (initTabulator()) {
			return () => {
				if (tableRef.current) {
					try {
						tableRef.current.destroy();
					} catch (e) {}
					tableRef.current = null;
				}
			};
		}

		// Load Tabulator dynamically if not available
		if (pluginUrl && typeof window.Tabulator === 'undefined') {
			const script = document.createElement('script');
			script.src = pluginUrl + 'assets/vendor/tabulator/tabulator.min.js';
			script.onload = () => {
				initTabulator();
			};
			document.head.appendChild(script);
			return () => {
				script.remove();
				if (tableRef.current) {
					try {
						tableRef.current.destroy();
					} catch (e) {}
					tableRef.current = null;
				}
			};
		}

		// Retry if Tabulator may load after block script
		let attempts = 0;
		const maxAttempts = 50;
		const id = setInterval(() => {
			if (initTabulator()) {
				clearInterval(id);
			} else if (++attempts >= maxAttempts) {
				clearInterval(id);
			}
		}, 100);

		return () => {
			clearInterval(id);
			if (tableRef.current) {
				try {
					tableRef.current.destroy();
				} catch (e) {}
				tableRef.current = null;
			}
		};
	}, [
		data,
		height,
		layout,
		sortable,
		resizableColumns,
		movableColumns,
		headerFilter,
		columnMinWidth,
		columnMaxWidth,
	]);

	const blockProps = useBlockProps({
		className: 'wp-block-codeweber-blocks-tabulator tabulator-block-editor',
	});

	return (
		<>
			<InspectorControls>
				<TabulatorSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				{!documentId ? (
					<div className="tabulator-block-placeholder">
						<p>{__('Select a document (CSV/XLS/XLSX) in the sidebar.', 'codeweber-gutenberg-blocks')}</p>
					</div>
				) : loading ? (
					<div className="tabulator-block-loading">
						<p>{__('Loading…', 'codeweber-gutenberg-blocks')}</p>
					</div>
				) : error ? (
					<div className="tabulator-block-error">
						<p>{error}</p>
					</div>
				) : !data?.rows?.length ? (
					<div className="tabulator-block-empty">
						<p>{__('No data in document.', 'codeweber-gutenberg-blocks')}</p>
					</div>
				) : (
					<>
						{exportEnabled !== false && (
							<div className="cw-tabulator-export">
								<button
									type="button"
									className="btn has-ripple btn-primary btn-xs"
									onClick={() => tableRef.current?.download('csv', 'data.csv')}
								>
									CSV
								</button>
								<button
									type="button"
									className="btn has-ripple btn-primary btn-xs"
									onClick={() => tableRef.current?.download('json', 'data.json')}
								>
									JSON
								</button>
							</div>
						)}
						<div
							ref={containerRef}
							className="tabulator-editor-container"
							style={{ minHeight: height || '400px' }}
						/>
					</>
				)}
			</div>
		</>
	);
};

export default TabulatorEdit;
