/**
 * Shadow Utilities
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';

/**
 * Shadow Options
 * Based on Bootstrap 5 and theme custom shadows
 */
export const shadowOptions = [
	{ value: '', label: __('—', 'codeweber-gutenberg-blocks') },
	{ value: 'shadow-none', label: 'shadow-none' },
	{ value: 'shadow-sm', label: 'shadow-sm' },
	{ value: 'shadow', label: 'shadow' },
	{ value: 'shadow-lg', label: 'shadow-lg' },
	{ value: 'shadow-xl', label: 'shadow-xl' },
];

/**
 * Generate shadow class
 *
 * @param {string} shadow - Shadow value
 * @returns {string} Shadow class
 */
export const generateShadowClass = (shadow = '') => {
	return shadow || '';
};
