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
	{ value: '', label: __('Default (with border)', 'codeweber-gutenberg-blocks') },
	{ value: 'shadow-none', label: __('No Shadow', 'codeweber-gutenberg-blocks') },
	{ value: 'shadow-sm', label: __('Small', 'codeweber-gutenberg-blocks') },
	{ value: 'shadow', label: __('Regular', 'codeweber-gutenberg-blocks') },
	{ value: 'shadow-lg', label: __('Large', 'codeweber-gutenberg-blocks') },
	{ value: 'shadow-xl', label: __('Extra Large', 'codeweber-gutenberg-blocks') },
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










