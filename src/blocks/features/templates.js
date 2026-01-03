/**
 * Features Block Templates
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';

// Function to get localized templates
export const getFeaturesTemplates = () => [
	{
		id: 'default',
		label: __('Default Template', 'codeweber-gutenberg-blocks'),
		columnsConfig: {
			columnsCount: 4,
			columnsType: 'classic',
		},
		featuresConfig: {
			enableCard: true,
			h100: true,
			enableCardBody: true,
			iconColor: 'white',
			iconColor2: '11',
			iconBtnVariant: 'gradient',
		},
		columnConfig: {
			default: {
				columnCol: '12',
				columnColMd: '3',
			},
		},
		firstColumn: null, // Default шаблон не имеет первой колонки с Title
		featureData: [
			{
				iconName: 'phone-volume',
				iconColor: 'yellow',
				buttonColor: 'yellow',
				title: '24/7 Support',
				paragraph: 'Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.',
			},
			{
				iconName: 'shield-exclamation',
				iconColor: 'red',
				buttonColor: 'red',
				title: 'Secure Payments',
				paragraph: 'Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.',
			},
			{
				iconName: 'laptop-cloud',
				iconColor: 'leaf',
				buttonColor: 'leaf',
				title: 'Daily Updates',
				paragraph: 'Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.',
			},
			{
				iconName: 'chart-line',
				iconColor: 'blue',
				buttonColor: 'blue',
				title: 'Market Research',
				paragraph: 'Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.',
			},
		],
	},
	{
		id: 'gradient-cards',
		label: __('Gradient Cards Template', 'codeweber-gutenberg-blocks'),
		columnsConfig: {
			columnsCount: 6,
			columnsType: 'columns-grid',
			columnsGap: '3',
			columnsGapMd: '3',
		},
		featuresConfig: {
			iconColor: 'white',
			iconColor2: '11',
			iconWrapperStyle: 'btn-circle',
			iconBtnVariant: 'gradient',
			buttonText: __('Read more', 'codeweber-gutenberg-blocks'),
			buttonColor: 'primary',
			buttonClass: 'hover',
			enableCard: true,
			enableCardBody: true,
			h100: true,
		},
		columnConfig: {
			default: {
				columnCol: '3',
				columnColMd: '4',
			},
		},
		firstColumn: {
			subtitle: __('Features', 'codeweber-gutenberg-blocks'),
			title: __('We create conditions in which it is profitable to work', 'codeweber-gutenberg-blocks'),
			text: __('Learn why clients choose us and what benefits they get from working with our company.', 'codeweber-gutenberg-blocks'),
			subtitleLine: false,
			enableText: true,
			h100: true,
		},
		featureData: [
			{
				iconName: 'shield-exclamation',
				title: __('Fast Delivery', 'codeweber-gutenberg-blocks'),
				paragraph: __('Get orders in the shortest time with quality and reliability guarantees at every stage of delivery.', 'codeweber-gutenberg-blocks'),
			},
			{
				iconName: 'laptop-cloud',
				title: __('Competitive Prices', 'codeweber-gutenberg-blocks'),
				paragraph: __('Save budget thanks to special offers and flexible discount system for regular customers.', 'codeweber-gutenberg-blocks'),
			},
			{
				iconName: 'chart-line',
				title: __('Quality Guarantee', 'codeweber-gutenberg-blocks'),
				paragraph: __('Confidence in every product thanks to strict quality control and proven production standards.', 'codeweber-gutenberg-blocks'),
			},
			{
				iconName: 'webcam',
				title: __('Individual Approach', 'codeweber-gutenberg-blocks'),
				paragraph: __('Personal solutions for your tasks taking into account all features and requirements of your business.', 'codeweber-gutenberg-blocks'),
				h100: false,
			},
			{
				iconName: 'suitcase',
				title: __('Experience & Expertise', 'codeweber-gutenberg-blocks'),
				paragraph: __('Work with professionals who have years of experience and deep knowledge in their field.', 'codeweber-gutenberg-blocks'),
				h100: false,
			},
		],
	},
];

