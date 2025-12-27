import { registerBlockType } from '@wordpress/blocks';
import './editor.scss';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

// Для динамического блока save возвращает null
registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: () => null, // Динамический блок - рендерится на сервере
});






