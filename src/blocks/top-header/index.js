/**
 * Top Header Block Registration
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

import Edit from './edit';

registerBlockType(metadata, {
	edit: Edit,
	save: () => null,
	title: __('Top Header', 'codeweber-gutenberg-blocks'),
	description: __(
		'Top bar with address, email and phone from Redux settings.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('top header', 'codeweber-gutenberg-blocks'),
		__('topbar', 'codeweber-gutenberg-blocks'),
		__('header', 'codeweber-gutenberg-blocks'),
	],
});
