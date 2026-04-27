import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import BlogEdit from './edit';
import BlogSave from './save';
import './style.scss';
import './editor.scss';

registerBlockType( metadata.name, {
	edit: BlogEdit,
	save: BlogSave,
} );
