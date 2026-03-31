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
import { borderRadiusOptions } from '../../utilities/border-radius';

// Border accent options
const BORDER_ACCENT_OPTIONS = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{
		label: __('Start (left)', 'codeweber-gutenberg-blocks'),
		value: 'card-border-start',
	},
	{
		label: __('End (right)', 'codeweber-gutenberg-blocks'),
		value: 'card-border-end',
	},
	{ label: __('Top', 'codeweber-gutenberg-blocks'), value: 'card-border-top' },
	{
		label: __('Bottom', 'codeweber-gutenberg-blocks'),
		value: 'card-border-bottom',
	},
];

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
 * API: { attributes, onChange, showPosition, showBorderRadius, showShadow, showBorder, showAccentBorder, radiusOptions }
 *
 * @param {Object}   props
 * @param {Object}   props.attributes       - Block attributes object
 * @param {Function} props.onChange         - setAttributes or equivalent (accepts object)
 * @param {boolean}  props.showPosition     - Show border position control
 * @param {boolean}  props.showBorderRadius - Show border radius control
 * @param {boolean}  props.showShadow       - Show shadow control
 * @param {boolean}  props.showBorder       - Show border controls (position, color, width)
 * @param {boolean}  props.showAccentBorder - Show accent border control
 * @param {Array}    props.radiusOptions    - Custom radius options (overrides default)
 */
export const BorderSettingsPanel = ({
	attributes = {},
	onChange,
	showPosition = true,
	showBorderRadius = true,
	showShadow = true,
	showBorder = true,
	showAccentBorder = true,
	radiusOptions = borderRadiusOptions,
}) => {
	const {
		borderRadius = '',
		shadow = '',
		borderPosition = '',
		borderColor = '',
		borderColorType = 'solid',
		borderWidth = '',
		borderAccent = '',
	} = attributes;

	return (
		<>
			{showBorderRadius && (
				<div style={{ marginBottom: '16px' }}>
					<BorderRadiusControl
						value={borderRadius}
						options={radiusOptions}
						onChange={(value) => onChange({ borderRadius: value })}
					/>
				</div>
			)}

			{showShadow && (
				<div style={{ marginBottom: '16px' }}>
					<ShadowControl
						value={shadow}
						onChange={(value) => onChange({ shadow: value })}
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
								value={borderPosition}
								options={BORDER_POSITION_OPTIONS}
								onChange={(value) =>
									onChange({ borderPosition: value })
								}
							/>
						</div>
					)}

					<div style={{ marginBottom: '16px' }}>
						<SelectControl
							label={__(
								'Border Width',
								'codeweber-gutenberg-blocks'
							)}
							value={borderWidth}
							options={BORDER_WIDTH_OPTIONS}
							onChange={(value) => onChange({ borderWidth: value })}
						/>
					</div>

					<div style={{ marginBottom: '16px' }}>
						<ColorTypeControl
							label={__(
								'Border Color Type',
								'codeweber-gutenberg-blocks'
							)}
							value={borderColorType}
							onChange={(value) =>
								onChange({ borderColorType: value })
							}
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
							value={borderColor}
							options={colors}
							onChange={(value) => onChange({ borderColor: value })}
						/>
					</div>
				</>
			)}

			{showAccentBorder && (
				<div style={{ marginBottom: '16px' }}>
					<SelectControl
						label={__(
							'Accent Border',
							'codeweber-gutenberg-blocks'
						)}
						value={borderAccent}
						options={BORDER_ACCENT_OPTIONS}
						onChange={(value) =>
							onChange({ borderAccent: value })
						}
					/>
				</div>
			)}
		</>
	);
};

export default BorderSettingsPanel;
