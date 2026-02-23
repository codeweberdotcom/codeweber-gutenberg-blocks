import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import './editor.scss';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';

registerBlockType(metadata, {
	edit: Edit,
	save: Save,
	title: __('Shortcode Render', 'codeweber-gutenberg-blocks'),
	description: __(
		'Render any WordPress shortcode. Enter the shortcode in the block settings.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('shortcode', 'codeweber-gutenberg-blocks'),
		__('widget', 'codeweber-gutenberg-blocks'),
	],
});
