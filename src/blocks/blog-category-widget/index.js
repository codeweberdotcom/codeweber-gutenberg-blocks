import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';

registerBlockType(metadata, {
	edit: Edit,
	save: Save,
	title: __('Blog Category Widget', 'codeweber-gutenberg-blocks'),
	description: __(
		'Widget list of blog categories with optional post count.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('blog', 'codeweber-gutenberg-blocks'),
		__('categories', 'codeweber-gutenberg-blocks'),
		__('widget', 'codeweber-gutenberg-blocks'),
		__('sidebar', 'codeweber-gutenberg-blocks'),
	],
});
