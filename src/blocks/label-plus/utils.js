/**
 * Label+ helpers: class list and tag resolution for the card title and paragraph.
 */

import {
	generateColorClass,
	generateTypographyClasses,
} from '../../utilities/class-generators';

/**
 * Class list for the card title (counterText) or paragraph (labelText).
 *
 * Deliberately without the cw-title / cw-paragraph prefixes used by the Title
 * block: blocks saved before typography was configurable carry no typography
 * attributes, so the defaults of titleClass / textClass reproduce the markup
 * they were saved with and their validation keeps passing.
 *
 * @param {Object} attrs  - Block attributes
 * @param {string} prefix - 'title' or 'text'
 * @return {string} Space separated class list
 */
export const getLabelPartClasses = (attrs, prefix) => {
	const color = attrs[`${prefix}Color`];
	const colorType = attrs[`${prefix}ColorType`];
	const custom = attrs[`${prefix}Class`];

	return [
		...generateTypographyClasses(attrs, prefix),
		generateColorClass(color, colorType, 'text'),
		custom,
	]
		.filter(Boolean)
		.join(' ');
};

/**
 * Tag to render a part with. display-* values are classes, not tags.
 *
 * @param {string} tag      - Configured tag
 * @param {string} fallback - Tag to use when the value is a display-* class
 * @return {string} Tag name
 */
export const getLabelPartTag = (tag, fallback) =>
	!tag || tag.startsWith('display-') ? fallback : tag;
