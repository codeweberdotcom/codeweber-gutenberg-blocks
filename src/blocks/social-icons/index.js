/**
 * Social Icons Block Registration
 *
 * @package CodeWeber Gutenberg Blocks
 */

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
	title: __('Social Icons', 'codeweber-gutenberg-blocks'),
	description: __(
		'Display social network links as icons. Use theme settings or custom links.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('social', 'codeweber-gutenberg-blocks'),
		__('icons', 'codeweber-gutenberg-blocks'),
		__('links', 'codeweber-gutenberg-blocks'),
		__('share', 'codeweber-gutenberg-blocks'),
	],
});
