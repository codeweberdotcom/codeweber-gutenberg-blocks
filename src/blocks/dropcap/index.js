/**
 * Dropcap Block
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
	title: __('Dropcap', 'codeweber-gutenberg-blocks'),
	description: __(
		'Drop cap letter with color and style options (simple, colored, circle).',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('dropcap', 'codeweber-gutenberg-blocks'),
		__('drop cap', 'codeweber-gutenberg-blocks'),
		__('letter', 'codeweber-gutenberg-blocks'),
		__('initial', 'codeweber-gutenberg-blocks'),
	],
});
