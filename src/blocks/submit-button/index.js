/**
 * Submit Button Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { select } from '@wordpress/data';
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

// Check if current post type is codeweber_form
const isFormCPT = () => {
	try {
		const postType = select('core/editor')?.getCurrentPostType();
		return postType === 'codeweber_form';
	} catch (e) {
		return false;
	}
};

// Ensure the block is visible in the inserter only when inside codeweber_form CPT
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
					inserter: isFormCPT(),
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
					inserter: isFormCPT(),
				},
			};
		}
		return settings;
	}
);

