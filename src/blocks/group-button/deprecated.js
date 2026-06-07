/**
 * Group Button Block - Deprecated versions
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { InnerBlocks } from '@wordpress/block-editor';
import metadata from './block.json';
import {
	normalizeGroupButtonId,
	normalizeGroupButtonData,
	getSpacingClasses,
} from './utils';

// v1: обёртка использовала только `d-flex` без `flex-wrap`.
// Воспроизводим старую генерацию классов, чтобы ранее вставленные
// блоки проходили валидацию и мигрировали без ошибок.
const getGroupButtonClassNamesV1 = (attrs = {}) => {
	const classes = [];
	const {
		blockClass,
		groupAlignItems,
		groupJustifyContent,
		groupTextAlign,
		groupPosition,
	} = attrs;

	if (blockClass) {
		classes.push(blockClass.trim());
	}

	classes.push('d-flex');

	if (groupJustifyContent) {
		classes.push(groupJustifyContent.trim());
	}
	if (groupAlignItems) {
		classes.push(groupAlignItems.trim());
	}
	if (groupTextAlign) {
		classes.push(groupTextAlign.trim());
	}
	if (groupPosition) {
		classes.push(groupPosition.trim());
	}

	classes.push(...getSpacingClasses(attrs));

	return classes.filter(Boolean).join(' ');
};

const v1 = {
	attributes: metadata.attributes,
	supports: metadata.supports,
	save({ attributes }) {
		const {
			blockId,
			blockData,
			animationEnabled,
			animationType,
			animationDuration,
			animationDelay,
		} = attributes;

		const blockProps = {
			className: getGroupButtonClassNamesV1(attributes),
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
	},
};

export default [v1];
