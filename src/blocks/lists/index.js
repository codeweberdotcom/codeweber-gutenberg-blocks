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
	title: __('Lists', 'codeweber-gutenberg-blocks'),
	description: __('Custom lists with icons, colors, and columns. Supports Custom and Post modes.', 'codeweber-gutenberg-blocks'),
	keywords: [
		__('list', 'codeweber-gutenberg-blocks'),
		__('lists', 'codeweber-gutenberg-blocks'),
		__('ul', 'codeweber-gutenberg-blocks'),
		__('icon', 'codeweber-gutenberg-blocks'),
		__('columns', 'codeweber-gutenberg-blocks'),
	],
});





