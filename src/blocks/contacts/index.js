/**
 * Contacts Block Registration
 *
 * @package CodeWeber Gutenberg Blocks
 */

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
	title: __('Contacts', 'codeweber-gutenberg-blocks'),
	description: __('Display contact information from Codeweber theme Redux settings.', 'codeweber-gutenberg-blocks'),
	keywords: [
		__('contacts', 'codeweber-gutenberg-blocks'),
		__('address', 'codeweber-gutenberg-blocks'),
		__('email', 'codeweber-gutenberg-blocks'),
		__('phone', 'codeweber-gutenberg-blocks'),
		__('contact', 'codeweber-gutenberg-blocks'),
	],
});

