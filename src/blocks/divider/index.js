/**
 * Divider Block
 *
 * Блок разделителя с поддержкой различных типов:
 * - Borders (простой, двойной, с иконкой)
 * - Angles (углы)
 * - Waves (волны)
 * - Vertical (вертикальные разделители)
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
		<path d="M3 11h18v2H3v-2z" />
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












