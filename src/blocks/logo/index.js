/**
 * Logo Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { siteLogo } from '@wordpress/icons';

import metadata from './block.json';
import Edit from './edit';

import './editor.scss';
import './style.scss';

/**
 * Register: Logo Block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: siteLogo,
	edit: Edit,
	save: () => null, // Используем render.php для рендеринга
});

