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
	title: __('Blog Year Widget', 'codeweber-gutenberg-blocks'),
	description: __(
		'Widget list of monthly archive links (e.g. February 2019).',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('blog', 'codeweber-gutenberg-blocks'),
		__('archive', 'codeweber-gutenberg-blocks'),
		__('year', 'codeweber-gutenberg-blocks'),
		__('month', 'codeweber-gutenberg-blocks'),
		__('widget', 'codeweber-gutenberg-blocks'),
	],
});
