/**
 * Counters Block Templates
 *
 * Each template builds a `columns` row (with the counter-wrapper class) whose
 * columns each hold a `counter` block preset.
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';

/**
 * Column width config derived from the chosen number of columns.
 * Keys are always present so updates clear leftover breakpoint classes.
 */
export const COLUMN_COL = {
	1: { columnCol: '12', columnColMd: '', columnColLg: '' },
	2: { columnCol: '', columnColMd: '6', columnColLg: '' },
	3: { columnCol: '', columnColMd: '4', columnColLg: '' },
	4: { columnCol: '6', columnColMd: '', columnColLg: '3' },
	6: { columnCol: '6', columnColMd: '4', columnColLg: '2' },
};

export const getColumnColConfig = (count) =>
	COLUMN_COL[count] || COLUMN_COL[2];

// Shared base for the icon-left card preset (Counter 1)
const card1Base = {
	counterLayout: 'counter-1',
	enableCard: true,
	enableCardBody: true,
	shadow: 'shadow-lg',
	iconType: 'font',
	iconWrapper: true,
	iconWrapperStyle: 'btn-circle',
	iconBtnSize: 'btn-lg',
	iconBtnVariant: 'soft',
	iconWrapperClass: 'pe-none mx-auto me-4 mb-lg-3 mb-xl-0',
	iconClass: '',
	titleClass: 'mb-1',
	paragraphClass: 'mb-0',
};

export const getCountersTemplates = () => [
	{
		id: 'cards',
		label: __('Cards (icon left)', 'codeweber-gutenberg-blocks'),
		supportsMasonry: true,
		defaultColumns: 2,
		defaultColorScheme: 'light',
		columnsConfig: {
			columnsType: 'classic',
			columnsGapType: 'theme',
			columnsClass: 'counter-wrapper align-items-center',
		},
		counters: [
			{ ...card1Base, iconName: 'presentation-check', iconColor: 'purple', title: '7518', paragraph: __('Projects Done', 'codeweber-gutenberg-blocks') },
			{ ...card1Base, iconName: 'users-alt', iconColor: 'red', title: '3472', paragraph: __('Happy Customers', 'codeweber-gutenberg-blocks') },
			{ ...card1Base, iconName: 'user-check', iconColor: 'yellow', title: '4537', paragraph: __('Expert Employees', 'codeweber-gutenberg-blocks') },
			{ ...card1Base, iconName: 'trophy', iconColor: 'aqua', title: '2184', paragraph: __('Awards Won', 'codeweber-gutenberg-blocks') },
		],
	},
	{
		id: 'icons',
		label: __('SVG icons (centered)', 'codeweber-gutenberg-blocks'),
		defaultColumns: 3,
		defaultColorScheme: 'light',
		columnsConfig: {
			columnsType: 'classic',
			columnsGapType: 'theme',
			columnsClass: 'counter-wrapper text-center align-items-center',
		},
		counters: [
			{ counterLayout: 'counter-2', enableCard: false, iconType: 'svg', iconWrapper: false, svgStyle: 'lineal', iconSize: 'lg', iconColor: 'primary', iconClass: 'mb-3', svgIcon: 'check', align: 'text-center', titleClass: 'mb-1', paragraphClass: 'mb-0', title: '7518', paragraph: __('Completed Projects', 'codeweber-gutenberg-blocks') },
			{ counterLayout: 'counter-2', enableCard: false, iconType: 'svg', iconWrapper: false, svgStyle: 'lineal', iconSize: 'lg', iconColor: 'primary', iconClass: 'mb-3', svgIcon: 'user', align: 'text-center', titleClass: 'mb-1', paragraphClass: 'mb-0', title: '3472', paragraph: __('Happy Customers', 'codeweber-gutenberg-blocks') },
			{ counterLayout: 'counter-2', enableCard: false, iconType: 'svg', iconWrapper: false, svgStyle: 'lineal', iconSize: 'lg', iconColor: 'primary', iconClass: 'mb-3', svgIcon: 'briefcase-2', align: 'text-center', titleClass: 'mb-1', paragraphClass: 'mb-0', title: '2184', paragraph: __('Expert Employees', 'codeweber-gutenberg-blocks') },
		],
	},
	{
		id: 'plain',
		label: __('Plain (large)', 'codeweber-gutenberg-blocks'),
		defaultColumns: 4,
		defaultColorScheme: 'dark',
		columnsConfig: {
			columnsType: 'classic',
			columnsGapType: 'theme',
			columnsClass: 'counter-wrapper text-center align-items-center',
		},
		counters: [
			{ counterLayout: 'counter-3', enableCard: false, counterLg: true, align: 'text-center', titleClass: 'mb-1', paragraphClass: 'mb-0', title: '7518', paragraph: __('Completed Projects', 'codeweber-gutenberg-blocks') },
			{ counterLayout: 'counter-3', enableCard: false, counterLg: true, align: 'text-center', titleClass: 'mb-1', paragraphClass: 'mb-0', title: '3472', paragraph: __('Happy Customers', 'codeweber-gutenberg-blocks') },
			{ counterLayout: 'counter-3', enableCard: false, counterLg: true, align: 'text-center', titleClass: 'mb-1', paragraphClass: 'mb-0', title: '2184', paragraph: __('Expert Employees', 'codeweber-gutenberg-blocks') },
			{ counterLayout: 'counter-3', enableCard: false, counterLg: true, align: 'text-center', titleClass: 'mb-1', paragraphClass: 'mb-0', title: '4523', paragraph: __('Awards Won', 'codeweber-gutenberg-blocks') },
		],
	},
	{
		id: 'ratings',
		label: __('Ratings', 'codeweber-gutenberg-blocks'),
		defaultColumns: 2,
		defaultColorScheme: 'light',
		columnsConfig: {
			columnsType: 'classic',
			columnsGapType: 'theme',
			columnsClass: 'counter-wrapper align-items-center',
		},
		counters: [
			{ counterLayout: 'counter-4', enableCard: false, counterLg: true, enableSubtitle: true, enableRatings: true, ratingsValue: 'five', align: '', titleClass: 'mb-1', subtitleClass: 'fs-17 mb-1', title: '99.7%', subtitle: __('Customer Satisfaction', 'codeweber-gutenberg-blocks') },
			{ counterLayout: 'counter-4', enableCard: false, counterLg: true, enableSubtitle: true, enableRatings: true, ratingsValue: 'five', align: '', titleClass: 'mb-1', subtitleClass: 'fs-17 mb-1', title: '4x', subtitle: __('New Visitors', 'codeweber-gutenberg-blocks') },
		],
	},
];
