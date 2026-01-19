/**
 * Group Button Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { InnerBlocks } from '@wordpress/block-editor';
import {
	getGroupButtonClassNames,
	normalizeGroupButtonId,
	normalizeGroupButtonData,
} from './utils';

const GroupButtonSave = ({ attributes }) => {
	const {
		blockId,
		blockData,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
	} = attributes;

	const blockProps = {
		className: getGroupButtonClassNames(attributes),
		id: normalizeGroupButtonId(blockId) || undefined,
		...(animationEnabled &&
			animationType && {
				'data-cue': animationType,
				...(animationDuration && {
					'data-duration': animationDuration,
				}),
				...(animationDelay && { 'data-delay': animationDelay }),
			}),
		...normalizeGroupButtonData(blockData),
	};

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
};

export default GroupButtonSave;



