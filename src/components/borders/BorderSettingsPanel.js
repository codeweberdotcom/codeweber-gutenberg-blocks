/**
 * BorderSettingsPanel Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { SelectControl, ComboboxControl } from '@wordpress/components';
import { BorderRadiusControl } from '../border-radius/BorderRadiusControl';
import { ShadowControl } from '../shadow/ShadowControl';
import { ColorTypeControl } from '../colors/ColorTypeControl';
import { colors } from '../../utilities/colors';

// Border position options
const BORDER_POSITION_OPTIONS = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('All', 'codeweber-gutenberg-blocks'), value: 'border' },
	{ label: __('Top', 'codeweber-gutenberg-blocks'), value: 'border-top' },
	{
		label: __('Bottom', 'codeweber-gutenberg-blocks'),
		value: 'border-bottom',
	},
	{ label: __('Start', 'codeweber-gutenberg-blocks'), value: 'border-start' },
	{ label: __('End', 'codeweber-gutenberg-blocks'), value: 'border-end' },
];

// Border width options
const BORDER_WIDTH_OPTIONS = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('1px', 'codeweber-gutenberg-blocks'), value: 'border-1' },
	{ label: __('2px', 'codeweber-gutenberg-blocks'), value: 'border-2' },
	{ label: __('3px', 'codeweber-gutenberg-blocks'), value: 'border-3' },
	{ label: __('4px', 'codeweber-gutenberg-blocks'), value: 'border-4' },
	{ label: __('5px', 'codeweber-gutenberg-blocks'), value: 'border-5' },
];

/**
 * BorderSettingsPanel Component
 *
 * @param {Object} props
 * @param {string} props.borderRadius - Current border radius value
 * @param {Function} props.onBorderRadiusChange - Callback when border radius changes
 * @param {string} props.shadow - Current shadow value
 * @param {Function} props.onShadowChange - Callback when shadow changes
 * @param {string} props.borderPosition - Current border position value
 * @param {Function} props.onBorderPositionChange - Callback when border position changes
 * @param {string} props.borderColor - Current border color value
 * @param {Function} props.onBorderColorChange - Callback when border color changes
 * @param {string} props.borderColorType - Current border color type (solid/soft)
 * @param {Function} props.onBorderColorTypeChange - Callback when border color type changes
 * @param {string} props.borderWidth - Current border width value
 * @param {Function} props.onBorderWidthChange - Callback when border width changes
 * @param {boolean} props.showPosition - Show border position control
 * @param {boolean} props.showBorderRadius - Show border radius control
 * @param {boolean} props.showShadow - Show shadow control
 * @param {boolean} props.showBorder - Show border controls (position, color, width)
 */
export const BorderSettingsPanel = ({
	borderRadius,
	onBorderRadiusChange,
	shadow,
	onShadowChange,
	borderPosition = '',
	onBorderPositionChange,
	borderColor = '',
	onBorderColorChange,
	borderColorType = 'solid',
	onBorderColorTypeChange,
	borderWidth = '',
	onBorderWidthChange,
	showPosition = true,
	showBorderRadius = true,
	showShadow = true,
	showBorder = true,
}) => {
	return (
		<>
			{showBorderRadius && (
				<div style={{ marginBottom: '16px' }}>
					<BorderRadiusControl
						value={borderRadius || ''}
						onChange={onBorderRadiusChange}
					/>
				</div>
			)}

			{showShadow && (
				<div style={{ marginBottom: '16px' }}>
					<ShadowControl
						value={shadow || ''}
						onChange={onShadowChange}
					/>
				</div>
			)}

			{showBorder && (
				<>
					{showPosition && (
						<div style={{ marginBottom: '16px' }}>
							<SelectControl
								label={__(
									'Border Position',
									'codeweber-gutenberg-blocks'
								)}
								value={borderPosition || ''}
								options={BORDER_POSITION_OPTIONS}
								onChange={onBorderPositionChange}
							/>
						</div>
					)}

					<div style={{ marginBottom: '16px' }}>
						<SelectControl
							label={__(
								'Border Width',
								'codeweber-gutenberg-blocks'
							)}
							value={borderWidth || ''}
							options={BORDER_WIDTH_OPTIONS}
							onChange={onBorderWidthChange}
						/>
					</div>

					<div style={{ marginBottom: '16px' }}>
						<ColorTypeControl
							label={__(
								'Border Color Type',
								'codeweber-gutenberg-blocks'
							)}
							value={borderColorType || 'solid'}
							onChange={onBorderColorTypeChange}
							options={[
								{
									value: 'solid',
									label: __(
										'Solid',
										'codeweber-gutenberg-blocks'
									),
								},
								{
									value: 'soft',
									label: __(
										'Soft',
										'codeweber-gutenberg-blocks'
									),
								},
							]}
						/>
					</div>

					<div style={{ marginBottom: '16px' }}>
						<ComboboxControl
							label={__(
								'Border Color',
								'codeweber-gutenberg-blocks'
							)}
							value={borderColor || ''}
							options={colors}
							onChange={onBorderColorChange}
						/>
					</div>
				</>
			)}
		</>
	);
};

export default BorderSettingsPanel;
