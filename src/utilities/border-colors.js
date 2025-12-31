/**
 * Border Color Utilities
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';

/**
 * Border Color Options - Основные цвета
 */
export const borderColors = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('Primary', 'codeweber-gutenberg-blocks'), value: 'primary' },
	{ label: __('Blue', 'codeweber-gutenberg-blocks'), value: 'blue' },
	{ label: __('Sky', 'codeweber-gutenberg-blocks'), value: 'sky' },
	{ label: __('Purple', 'codeweber-gutenberg-blocks'), value: 'purple' },
	{ label: __('Grape', 'codeweber-gutenberg-blocks'), value: 'grape' },
	{ label: __('Violet', 'codeweber-gutenberg-blocks'), value: 'violet' },
	{ label: __('Pink', 'codeweber-gutenberg-blocks'), value: 'pink' },
	{ label: __('Fuchsia', 'codeweber-gutenberg-blocks'), value: 'fuchsia' },
	{ label: __('Red', 'codeweber-gutenberg-blocks'), value: 'red' },
	{ label: __('Orange', 'codeweber-gutenberg-blocks'), value: 'orange' },
	{ label: __('Yellow', 'codeweber-gutenberg-blocks'), value: 'yellow' },
	{ label: __('Green', 'codeweber-gutenberg-blocks'), value: 'green' },
	{ label: __('Leaf', 'codeweber-gutenberg-blocks'), value: 'leaf' },
	{ label: __('Aqua', 'codeweber-gutenberg-blocks'), value: 'aqua' },
	{ label: __('Navy', 'codeweber-gutenberg-blocks'), value: 'navy' },
	{ label: __('Ash', 'codeweber-gutenberg-blocks'), value: 'ash' },
	{ label: __('White', 'codeweber-gutenberg-blocks'), value: 'white' },
	{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
	{ label: __('Gray', 'codeweber-gutenberg-blocks'), value: 'gray' },
	{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
	{ label: __('Black', 'codeweber-gutenberg-blocks'), value: 'black' },
];

/**
 * Border Soft Color Options - Мягкие цвета
 */
export const borderSoftColors = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('Primary Soft', 'codeweber-gutenberg-blocks'), value: 'soft-primary' },
	{ label: __('Blue Soft', 'codeweber-gutenberg-blocks'), value: 'soft-blue' },
	{ label: __('Sky Soft', 'codeweber-gutenberg-blocks'), value: 'soft-sky' },
	{ label: __('Purple Soft', 'codeweber-gutenberg-blocks'), value: 'soft-purple' },
	{ label: __('Grape Soft', 'codeweber-gutenberg-blocks'), value: 'soft-grape' },
	{ label: __('Violet Soft', 'codeweber-gutenberg-blocks'), value: 'soft-violet' },
	{ label: __('Pink Soft', 'codeweber-gutenberg-blocks'), value: 'soft-pink' },
	{ label: __('Fuchsia Soft', 'codeweber-gutenberg-blocks'), value: 'soft-fuchsia' },
	{ label: __('Red Soft', 'codeweber-gutenberg-blocks'), value: 'soft-red' },
	{ label: __('Orange Soft', 'codeweber-gutenberg-blocks'), value: 'soft-orange' },
	{ label: __('Yellow Soft', 'codeweber-gutenberg-blocks'), value: 'soft-yellow' },
	{ label: __('Green Soft', 'codeweber-gutenberg-blocks'), value: 'soft-green' },
	{ label: __('Leaf Soft', 'codeweber-gutenberg-blocks'), value: 'soft-leaf' },
	{ label: __('Aqua Soft', 'codeweber-gutenberg-blocks'), value: 'soft-aqua' },
	{ label: __('Navy Soft', 'codeweber-gutenberg-blocks'), value: 'soft-navy' },
	{ label: __('Ash Soft', 'codeweber-gutenberg-blocks'), value: 'soft-ash' },
];

/**
 * Border Pale Color Options - Бледные цвета
 */
export const borderPaleColors = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('Primary Pale', 'codeweber-gutenberg-blocks'), value: 'pale-primary' },
	{ label: __('Blue Pale', 'codeweber-gutenberg-blocks'), value: 'pale-blue' },
	{ label: __('Sky Pale', 'codeweber-gutenberg-blocks'), value: 'pale-sky' },
	{ label: __('Purple Pale', 'codeweber-gutenberg-blocks'), value: 'pale-purple' },
	{ label: __('Grape Pale', 'codeweber-gutenberg-blocks'), value: 'pale-grape' },
	{ label: __('Violet Pale', 'codeweber-gutenberg-blocks'), value: 'pale-violet' },
	{ label: __('Pink Pale', 'codeweber-gutenberg-blocks'), value: 'pale-pink' },
	{ label: __('Fuchsia Pale', 'codeweber-gutenberg-blocks'), value: 'pale-fuchsia' },
	{ label: __('Red Pale', 'codeweber-gutenberg-blocks'), value: 'pale-red' },
	{ label: __('Orange Pale', 'codeweber-gutenberg-blocks'), value: 'pale-orange' },
	{ label: __('Yellow Pale', 'codeweber-gutenberg-blocks'), value: 'pale-yellow' },
	{ label: __('Green Pale', 'codeweber-gutenberg-blocks'), value: 'pale-green' },
	{ label: __('Leaf Pale', 'codeweber-gutenberg-blocks'), value: 'pale-leaf' },
	{ label: __('Aqua Pale', 'codeweber-gutenberg-blocks'), value: 'pale-aqua' },
	{ label: __('Navy Pale', 'codeweber-gutenberg-blocks'), value: 'pale-navy' },
	{ label: __('Ash Pale', 'codeweber-gutenberg-blocks'), value: 'pale-ash' },
];

/**
 * Border Position Options - Позиция border для карточек
 */
export const borderPositions = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('Top', 'codeweber-gutenberg-blocks'), value: 'card-border-top' },
	{ label: __('Bottom', 'codeweber-gutenberg-blocks'), value: 'card-border-bottom' },
	{ label: __('Start', 'codeweber-gutenberg-blocks'), value: 'card-border-start' },
	{ label: __('End', 'codeweber-gutenberg-blocks'), value: 'card-border-end' },
	{ label: __('All Sides', 'codeweber-gutenberg-blocks'), value: 'border' },
];

/**
 * Border Width Options
 */
export const borderWidths = [
	{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('0', 'codeweber-gutenberg-blocks'), value: 'border-0' },
	{ label: __('1px', 'codeweber-gutenberg-blocks'), value: 'border' },
	{ label: __('2px', 'codeweber-gutenberg-blocks'), value: 'border-2' },
	{ label: __('3px', 'codeweber-gutenberg-blocks'), value: 'border-3' },
	{ label: __('4px', 'codeweber-gutenberg-blocks'), value: 'border-4' },
	{ label: __('5px', 'codeweber-gutenberg-blocks'), value: 'border-5' },
];

