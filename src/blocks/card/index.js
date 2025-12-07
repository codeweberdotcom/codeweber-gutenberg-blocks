/**
 * Card Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import './editor.scss';
import './style.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Register: Card Block
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
});






