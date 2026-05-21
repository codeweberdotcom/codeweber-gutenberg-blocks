import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';

/**
 * Block Registration
 */
registerBlockType(metadata, {
	edit: Edit,
	save: Save,
	deprecated: [
		{
			// Blocks created programmatically (without static save HTML)
			attributes: metadata.attributes,
			save: () => null,
		},
	],
});
