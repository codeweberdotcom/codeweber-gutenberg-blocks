import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';

/**
 * Block Registration
 */

registerBlockType(metadata, {
	edit: Edit,
	save: Save,
	title: __('Menu', 'codeweber-gutenberg-blocks'),
	description: __('Menu block with Custom and WordPress Menu modes. Supports dark/light theme and list styling options.', 'codeweber-gutenberg-blocks'),
	keywords: [
		__('menu', 'codeweber-gutenberg-blocks'),
		__('navigation', 'codeweber-gutenberg-blocks'),
		__('nav', 'codeweber-gutenberg-blocks'),
		__('list', 'codeweber-gutenberg-blocks'),
	],
});













