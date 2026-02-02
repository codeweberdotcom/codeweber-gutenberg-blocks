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
	title: __('Nav Menu', 'codeweber-gutenberg-blocks'),
	description: __(
		'Navigation menu container. Add any blocks inside, including Menu block, buttons, search, etc.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('nav', 'codeweber-gutenberg-blocks'),
		__('menu', 'codeweber-gutenberg-blocks'),
		__('navbar', 'codeweber-gutenberg-blocks'),
		__('navigation', 'codeweber-gutenberg-blocks'),
		__('header', 'codeweber-gutenberg-blocks'),
	],
});
