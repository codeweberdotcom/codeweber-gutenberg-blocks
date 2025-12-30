/**
 * Html Blocks Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { code } from '@wordpress/icons';
import './editor.scss';
import './style.scss';

import Edit from './edit';
import metadata from './block.json';

/**
 * Register: Html Blocks Block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: code,
	edit: Edit,
	save: () => null, // Используем render.php для рендеринга
});

