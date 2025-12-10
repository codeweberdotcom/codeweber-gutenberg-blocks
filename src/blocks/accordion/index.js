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
	title: __('Accordion', 'codeweber-gutenberg-blocks'),
	description: __('Bootstrap accordion with multiple items. Supports simple, background, and icon styles.', 'codeweber-gutenberg-blocks'),
	keywords: [
		__('accordion', 'codeweber-gutenberg-blocks'),
		__('collapse', 'codeweber-gutenberg-blocks'),
		__('faq', 'codeweber-gutenberg-blocks'),
		__('tabs', 'codeweber-gutenberg-blocks'),
	],
});


