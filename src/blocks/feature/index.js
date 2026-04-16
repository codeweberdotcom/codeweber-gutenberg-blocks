/**
 * Feature Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import './editor.scss';
import './style.scss';

import Edit from './edit';
import save from './save';
import SaveDeprecatedV1 from './save-deprecated';
import metadata from './block.json';

/**
 * Register: Feature Block
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
	deprecated: [
		{
			attributes: metadata.attributes,
			save: SaveDeprecatedV1,
		},
	],
});
