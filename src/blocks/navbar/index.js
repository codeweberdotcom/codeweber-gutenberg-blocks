import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

/**
 * Internal dependencies
 */
import Edit from './edit';

/**
 * Block Registration
 */

registerBlockType(metadata, {
	edit: Edit,
	save: () => <InnerBlocks.Content />, // Persist inner blocks; full HTML rendered server-side via render.php
	title: __('Navbar', 'codeweber-gutenberg-blocks'),
	description: __(
		'Navbar block with multiple predefined header templates (Classic, Fancy, Extended, etc.)',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('navbar', 'codeweber-gutenberg-blocks'),
		__('header', 'codeweber-gutenberg-blocks'),
		__('navigation', 'codeweber-gutenberg-blocks'),
		__('menu', 'codeweber-gutenberg-blocks'),
	],
});
