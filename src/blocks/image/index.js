import { registerBlockType } from '@wordpress/blocks';
import { image as icon } from '@wordpress/icons';
import './editor.scss';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
	...metadata,
	icon,
	edit: Edit,
	save,
});

