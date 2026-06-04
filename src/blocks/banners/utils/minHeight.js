/**
 * Shared Min Height (min-vh) helpers for the Banners block.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/**
 * Options for the Min Height button group in the banners sidebar.
 *
 * `''` (Default) keeps each banner's built-in min-vh, `'none'` removes it,
 * any `min-vh-*` value overrides it.
 */
export const BANNER_MIN_HEIGHT_OPTIONS = [
	{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: 'none' },
	{ label: '25', value: 'min-vh-25' },
	{ label: '30', value: 'min-vh-30' },
	{ label: '50', value: 'min-vh-50' },
	{ label: '60', value: 'min-vh-60' },
	{ label: '70', value: 'min-vh-70' },
	{ label: '80', value: 'min-vh-80' },
	{ label: '100', value: 'min-vh-100' },
];

/**
 * Resolve the min-vh class for a banner section.
 *
 * @param {string} minHeight      Selected value ('' = Default, 'none' = remove, or a min-vh-* class).
 * @param {string} builtinDefault The banner's original hardcoded min-vh class (or '' if none).
 * @return {string} The min-vh class to apply, or '' for no class.
 */
export const resolveMinHeightClass = (minHeight, builtinDefault = '') => {
	if (minHeight === undefined || minHeight === null || minHeight === '') {
		return builtinDefault;
	}
	if (minHeight === 'none') {
		return '';
	}
	return minHeight;
};
