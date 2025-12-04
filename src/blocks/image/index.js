/**
 * Image Block
 * 
 * Display image or video with effects, masks and lightbox
 */
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
