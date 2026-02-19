/**
 * Code Block
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
	title: __('Code', 'codeweber-gutenberg-blocks'),
	description: __(
		'Code snippet with Copy button. Use for HTML, CSS, JS or plain text.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('code', 'codeweber-gutenberg-blocks'),
		__('snippet', 'codeweber-gutenberg-blocks'),
		__('pre', 'codeweber-gutenberg-blocks'),
		__('syntax', 'codeweber-gutenberg-blocks'),
		__('clipboard', 'codeweber-gutenberg-blocks'),
	],
});
