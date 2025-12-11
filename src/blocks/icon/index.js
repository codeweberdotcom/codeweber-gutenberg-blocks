/**
 * Icon Block
 *
 * Универсальный блок иконки.
 * Поддерживает Font Icons (Unicons), SVG иконки и кастомные SVG.
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';

import './editor.scss';
import './style.scss';

/**
 * Иконка блока для редактора
 */
const blockIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="currentColor"
	>
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

/**
 * Регистрация блока
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: blockIcon,
	edit: Edit,
	save: Save,
});









