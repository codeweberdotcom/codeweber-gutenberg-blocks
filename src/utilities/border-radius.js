/**
 * Border Radius Utilities
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';

/**
 * Border Radius Options
 * Based on Bootstrap 5 and theme custom classes
 *
 * Bootstrap 5: rounded-0 to rounded-5
 * Theme custom: rounded-xl (0.8rem)
 * Theme variables:
 * $border-radius: 0.4rem
 * $border-radius-sm: 0.2rem
 * $border-radius-xl: 0.8rem
 * $rounded-pill: 1.5rem
 */
export const borderRadiusOptions = [
	{ value: '', label: __('Default', 'codeweber-gutenberg-blocks') },
	{
		value: 'rounded-0',
		label: __('Rounded-0 (0)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'rounded-1',
		label: __('Rounded-1 (0.2rem)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'rounded-2',
		label: __('Rounded-2 (0.25rem)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'rounded',
		label: __('Rounded (0.4rem)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'rounded-3',
		label: __('Rounded-3 (0.5rem)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'rounded-4',
		label: __('Rounded-4 (1rem)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'rounded-5',
		label: __('Rounded-5 (1.5rem)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'rounded-xl',
		label: __('Rounded-xl (0.8rem - Theme)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'rounded-pill',
		label: __('Rounded-pill (50rem)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'rounded-circle',
		label: __('Rounded-circle (50%)', 'codeweber-gutenberg-blocks'),
	},
];

/**
 * Positional Border Radius Options
 */
export const positionOptions = [
	{ value: '', label: __('All Sides', 'codeweber-gutenberg-blocks') },
	{ value: 'top', label: __('Top Only', 'codeweber-gutenberg-blocks') },
	{ value: 'bottom', label: __('Bottom Only', 'codeweber-gutenberg-blocks') },
	{
		value: 'start',
		label: __('Start (Left) Only', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'end',
		label: __('End (Right) Only', 'codeweber-gutenberg-blocks'),
	},
];

/**
 * Generate border radius class
 *
 * @param {string} radius - Border radius value
 * @param {string} position - Position (top, bottom, start, end)
 * @returns {string} Generated class
 */
export const generateBorderRadiusClass = (radius = '', position = '') => {
	if (!radius) return '';

	if (position && position !== '') {
		// rounded-top, rounded-xl-bottom, etc.
		const baseClass = radius === 'rounded' ? 'rounded' : radius;
		return `${baseClass}-${position}`;
	}

	return radius;
};
