import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

import Edit from './edit';
import Save from './save';

registerBlockType(metadata, {
	edit: Edit,
	save: Save,
});







