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
	title: __('Widget', 'codeweber-gutenberg-blocks'),
	description: __(
		'Widget container with title and InnerBlocks support.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__('widget', 'codeweber-gutenberg-blocks'),
		__('container', 'codeweber-gutenberg-blocks'),
		__('sidebar', 'codeweber-gutenberg-blocks'),
	],
});



