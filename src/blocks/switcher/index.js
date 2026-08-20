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
	title: __('Switcher', 'codeweber-gutenberg-blocks'),
	description: __(
		'Segmented link switcher: two or more links where the one matching the current page is highlighted.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('switcher', 'codeweber-gutenberg-blocks'),
		__('toggle', 'codeweber-gutenberg-blocks'),
		__('segmented', 'codeweber-gutenberg-blocks'),
		__('pills', 'codeweber-gutenberg-blocks'),
	],
});
