/**
 * Submit Button Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';

import Edit from './edit';
import Save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: Save,
});

// Ограничение видимости блока выполняется через PHP фильтры
// в codeweber-forms-gutenberg-restrictions.php
// JavaScript фильтры здесь не нужны, так как они могут конфликтовать с PHP фильтрами

