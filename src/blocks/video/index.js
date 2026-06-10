/**
 * Video Block
 *
 * Display video (HTML5, Vimeo, YouTube, VK, Rutube) with poster and lightbox
 */
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save,
});
