/**
 * Floating Navigator Block Registration
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import './editor.scss';

import metadata from './block.json';
import Edit from './edit';

registerBlockType( metadata, {
	edit: Edit,
	save: () => null,
	title: __( 'Floating Navigator', 'codeweber-gutenberg-blocks' ),
	description: __(
		'Floating widget with a popup list of anchor links to page sections.',
		'codeweber-gutenberg-blocks'
	),
	keywords: [
		__( 'floating', 'codeweber-gutenberg-blocks' ),
		__( 'navigation', 'codeweber-gutenberg-blocks' ),
		__( 'anchor', 'codeweber-gutenberg-blocks' ),
		__( 'scroll', 'codeweber-gutenberg-blocks' ),
	],
} );
