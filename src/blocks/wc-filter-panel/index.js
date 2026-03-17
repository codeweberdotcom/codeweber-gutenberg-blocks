/**
 * WC Filter Panel Block
 */

import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import Save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save: Save,
	deprecated: [
		{
			// v0.1.0 — flat attributes (showPrice, showCategories, attributes[], etc.)
			attributes: {
				showPrice: { type: 'boolean', default: true },
				showCategories: { type: 'boolean', default: true },
				attributes: { type: 'array', default: [] },
				showRating: { type: 'boolean', default: false },
				showStock: { type: 'boolean', default: false },
				displayMode: { type: 'string', default: 'checkbox' },
				showCount: { type: 'boolean', default: true },
				title: { type: 'string', default: '' },
			},
			save() {
				return null;
			},
		},
	],
} );
