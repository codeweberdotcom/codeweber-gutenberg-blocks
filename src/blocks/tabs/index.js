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
	title: __('Tabs', 'codeweber-gutenberg-blocks'),
	description: __(
		'Bootstrap tabs with multiple items. Supports basic and pills styles with icons.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('tabs', 'codeweber-gutenberg-blocks'),
		__('tab', 'codeweber-gutenberg-blocks'),
		__('navigation', 'codeweber-gutenberg-blocks'),
		__('nav', 'codeweber-gutenberg-blocks'),
	],
	deprecated: [],
});
