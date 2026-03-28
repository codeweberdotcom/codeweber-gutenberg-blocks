import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import edit from './edit';
import save from './save';
import blockJson from './block.json';

registerBlockType( blockJson.name, {
	...blockJson,
	title: __( 'Text Rotator', 'codeweber-gutenberg-blocks' ),
	description: __(
		'Animated text rotator: typer, rotator-fade, rotator-zoom.',
		'codeweber-gutenberg-blocks'
	),
	edit,
	save,
} );
