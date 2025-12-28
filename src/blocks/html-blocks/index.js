/**
 * Html Blocks Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import './editor.scss';
import './style.scss';

import Edit from './edit';
import metadata from './block.json';

/**
 * Register: Html Blocks Block
 */
registerBlockType(metadata, {
	edit: Edit,
	save: () => null, // Используем render.php для рендеринга
});

