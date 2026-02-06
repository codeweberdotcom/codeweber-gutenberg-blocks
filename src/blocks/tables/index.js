import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';

/**
 * Deprecation: remove cardWrapper from old blocks
 */
const deprecationCardWrapper = {
	isEligible(attributes) {
		return attributes.cardWrapper !== undefined;
	},
	migrate(attributes) {
		const { cardWrapper, ...rest } = attributes;
		return rest;
	},
};

/**
 * Deprecation: migrate string cells to { content, colspan } format
 */
const deprecationCellFormat = {
	isEligible(attributes) {
		const first = attributes.headerCells?.[0];
		return typeof first === 'string';
	},
	migrate(attributes) {
		return {
			...attributes,
			headerCells: (attributes.headerCells || []).map((c) =>
				typeof c === 'string'
					? { content: c, colspan: 1, rowspan: 1 }
					: { ...c, rowspan: c.rowspan ?? 1 }
			),
			rows: (attributes.rows || []).map((row) => ({
				...row,
				cells: (row.cells || []).map((c) =>
					typeof c === 'string'
						? { content: c, colspan: 1, rowspan: 1 }
						: { ...c, rowspan: c.rowspan ?? 1 }
				),
			})),
		};
	},
};

const deprecationSourceMode = {
	isEligible(attributes) {
		return attributes.sourceMode === undefined;
	},
	migrate(attributes) {
		return {
			...attributes,
			sourceMode: 'manual',
			csvDocumentId: 0,
		};
	},
};

/**
 * Block Registration
 */
registerBlockType(metadata, {
	edit: Edit,
	save: Save,
	deprecated: [deprecationCardWrapper, deprecationCellFormat, deprecationSourceMode],
	title: __('Tables', 'codeweber-gutenberg-blocks'),
	description: __(
		'Bootstrap 5 tables. Supports Simple, Dark, Striped, Bordered, Borderless, Hoverable, and Responsive styles.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('table', 'codeweber-gutenberg-blocks'),
		__('tables', 'codeweber-gutenberg-blocks'),
		__('bootstrap', 'codeweber-gutenberg-blocks'),
		__('data', 'codeweber-gutenberg-blocks'),
	],
});
