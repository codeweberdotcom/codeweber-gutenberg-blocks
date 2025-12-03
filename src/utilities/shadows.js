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
	{ value: '', label: __('Default (with border)', 'codeweber-blocks') },
	{ value: 'shadow-none', label: __('No Shadow', 'codeweber-blocks') },
	{ value: 'shadow-sm', label: __('Small', 'codeweber-blocks') },
	{ value: 'shadow', label: __('Regular', 'codeweber-blocks') },
	{ value: 'shadow-lg', label: __('Large', 'codeweber-blocks') },
	{ value: 'shadow-xl', label: __('Extra Large', 'codeweber-blocks') },
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

