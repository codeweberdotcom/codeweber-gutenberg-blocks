/**
 * GridControl - универсальный компонент для настройки адаптивных сеток
 * 
 * Включает:
 * - Адаптивные колонки (row-cols-*)
 * - Адаптивные gap (g-*, gx-*, gy-*)
 * - Адаптивные spacing (p-*, m-*)
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { ResponsiveControl, createBreakpointsConfig } from '../responsive-control';

/**
 * GridControl Component
 * 
 * @param {Object} props
 * @param {Object} props.attributes - Атрибуты блока
 * @param {Function} props.setAttributes - Функция setAttributes
 * @param {string} props.attributePrefix - Префикс атрибутов (например, 'grid', 'columns')
 * @param {boolean} props.showRowCols - Показывать настройки row-cols (по умолчанию true)
 * @param {boolean} props.showGap - Показывать настройки gap (по умолчанию true)
 * @param {boolean} props.showSpacing - Показывать настройки spacing (по умолчанию false)
 * @param {string} props.rowColsLabel - Кастомный label для row-cols
 * @param {string} props.gapLabel - Кастомный label для gap
 * @param {string} props.spacingLabel - Кастомный label для spacing
 */
export const GridControl = ({
	attributes,
	setAttributes,
	attributePrefix = 'grid',
	showRowCols = true,
	showGap = true,
	showSpacing = false,
	rowColsLabel,
	gapLabel,
	spacingLabel,
}) => {
	// Получаем атрибуты с учетом префикса
	const getAttr = (suffix) => attributes[`${attributePrefix}${suffix}`];
	
	const gapType = getAttr('GapType') || 'general';
	const spacingType = getAttr('SpacingType') || 'padding';

	return (
		<>
			{/* Row Cols Settings */}
			{showRowCols && (
				<div style={{ marginBottom: '16px' }}>
					<ResponsiveControl
						{...createBreakpointsConfig({
							type: 'columns',
							attributes,
							attributePrefix: `${attributePrefix}RowCols`,
							onChange: setAttributes,
							variant: 'dropdown',
							label: rowColsLabel || __('Columns Per Row', 'codeweber-gutenberg-blocks'),
							tooltip: __('Number of columns at each breakpoint', 'codeweber-gutenberg-blocks'),
						})}
					/>
				</div>
			)}

			{/* Gap Settings */}
			{showGap && (
				<PanelBody
					title={gapLabel || __('Gap Settings', 'codeweber-gutenberg-blocks')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Gap Type', 'codeweber-gutenberg-blocks')}
						value={gapType}
						options={[
							{ label: __('General (Both)', 'codeweber-gutenberg-blocks'), value: 'general' },
							{ label: __('Horizontal (X)', 'codeweber-gutenberg-blocks'), value: 'x' },
							{ label: __('Vertical (Y)', 'codeweber-gutenberg-blocks'), value: 'y' },
						]}
						onChange={(value) => setAttributes({ [`${attributePrefix}GapType`]: value })}
						help={__('Choose gap direction: both axes, horizontal only, or vertical only', 'codeweber-gutenberg-blocks')}
					/>

					<ResponsiveControl
						{...createBreakpointsConfig({
							type: 'custom',
							attributes,
							attributePrefix: `${attributePrefix}Gap`,
							onChange: setAttributes,
							variant: 'dropdown',
							label: __('Gap Size', 'codeweber-gutenberg-blocks'),
							tooltip: __('Spacing between grid items', 'codeweber-gutenberg-blocks'),
							customOptions: {
								default: ['0', '1', '2', '3', '4', '5', '6'],
								xs: ['', '0', '1', '2', '3', '4', '5'],
								sm: ['', '0', '1', '2', '3', '4', '5'],
								md: ['', '0', '1', '2', '3', '4', '5', '6'],
								lg: ['', '0', '1', '2', '3', '4', '5', '6'],
								xl: ['', '0', '1', '2', '3', '4', '5', '6'],
								xxl: ['', '0', '1', '2', '3', '4', '5', '6'],
							},
						})}
					/>
				</PanelBody>
			)}

			{/* Spacing Settings */}
			{showSpacing && (
				<PanelBody
					title={spacingLabel || __('Spacing Settings', 'codeweber-gutenberg-blocks')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Spacing Type', 'codeweber-gutenberg-blocks')}
						value={spacingType}
						options={[
							{ label: __('Padding', 'codeweber-gutenberg-blocks'), value: 'padding' },
							{ label: __('Margin', 'codeweber-gutenberg-blocks'), value: 'margin' },
						]}
						onChange={(value) => setAttributes({ [`${attributePrefix}SpacingType`]: value })}
						help={__('Choose between padding (inside) or margin (outside)', 'codeweber-gutenberg-blocks')}
					/>

					<ResponsiveControl
						{...createBreakpointsConfig({
							type: 'custom',
							attributes,
							attributePrefix: `${attributePrefix}Spacing`,
							onChange: setAttributes,
							variant: 'dropdown',
							label: __('Spacing Size', 'codeweber-gutenberg-blocks'),
							tooltip: __('Container padding or margin', 'codeweber-gutenberg-blocks'),
							customOptions: {
								default: ['0', '1', '2', '3', '4', '5', '6'],
								xs: ['', '0', '1', '2', '3', '4', '5'],
								sm: ['', '0', '1', '2', '3', '4', '5'],
								md: ['', '0', '1', '2', '3', '4', '5', '6'],
								lg: ['', '0', '1', '2', '3', '4', '5', '6'],
								xl: ['', '0', '1', '2', '3', '4', '5', '6'],
								xxl: ['', '0', '1', '2', '3', '4', '5', '6'],
							},
						})}
					/>
				</PanelBody>
			)}
		</>
	);
};

