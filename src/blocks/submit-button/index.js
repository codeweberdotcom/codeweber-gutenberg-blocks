/**
 * Submit Button Block
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
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

// Ensure the block is visible in the inserter when inside a form
// Use getBlockType filter to dynamically modify block settings
addFilter(
	'blocks.getBlockType',
	'codeweber-blocks/submit-button/inserter-visibility',
	(blockType, name) => {
		if (name === 'codeweber-blocks/submit-button' && blockType) {
			return {
				...blockType,
				supports: {
					...blockType.supports,
					inserter: true,
				},
			};
		}
		return blockType;
	}
);

// Also ensure it's visible in registerBlockType for initial registration
addFilter(
	'blocks.registerBlockType',
	'codeweber-blocks/submit-button/inserter-visibility-register',
	(settings, name) => {
		if (name === 'codeweber-blocks/submit-button') {
			return {
				...settings,
				supports: {
					...settings.supports,
					inserter: true,
				},
			};
		}
		return settings;
	}
);

