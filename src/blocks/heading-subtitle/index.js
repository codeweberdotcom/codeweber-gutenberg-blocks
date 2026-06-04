import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import blockJson from './block.json';

registerBlockType(blockJson.name, {
	...blockJson,
	title: __('Title', 'codeweber-gutenberg-blocks'),
	description: __(
		'A flexible heading and subtitle block with advanced typography controls.',
		'codeweber-gutenberg-blocks'
	),
	edit,
	save,
	deprecated,
});
