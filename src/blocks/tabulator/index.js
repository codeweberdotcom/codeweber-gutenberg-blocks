/**
 * Tabulator Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import './editor.scss';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';

registerBlockType(metadata, {
	edit: Edit,
	save: Save,
	title: __('Tabulator', 'codeweber-gutenberg-blocks'),
	description: __(
		'Interactive Tabulator table from Documents (CSV/XLS/XLSX). Supports sorting, filtering, resizable columns.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('tabulator', 'codeweber-gutenberg-blocks'),
		__('table', 'codeweber-gutenberg-blocks'),
		__('spreadsheet', 'codeweber-gutenberg-blocks'),
		__('data', 'codeweber-gutenberg-blocks'),
	],
});
