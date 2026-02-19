/**
 * Blockquote Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
	edit: Edit,
	save,
	title: __('Blockquote', 'codeweber-gutenberg-blocks'),
	description: __(
		'Blockquote with optional caption. Simple figure or card layout.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('quote', 'codeweber-gutenberg-blocks'),
		__('blockquote', 'codeweber-gutenberg-blocks'),
		__('citation', 'codeweber-gutenberg-blocks'),
	],
});
