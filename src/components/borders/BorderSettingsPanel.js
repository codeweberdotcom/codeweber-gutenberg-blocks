/**
 * BorderSettingsPanel Component
 * 
 * Объединяет все настройки border: радиус, тень, позиция, цвет, ширина
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { BorderRadiusControl } from '../border-radius';
import { ShadowControl } from '../shadow';
import { BorderControl } from './BorderControl';

/**
 * BorderSettingsPanel Component
 * 
 * @param {Object} props
 * @param {string} props.borderRadius - Border radius value
 * @param {Function} props.onBorderRadiusChange - Callback when border radius changes
 * @param {string} props.shadow - Shadow value
 * @param {Function} props.onShadowChange - Callback when shadow changes
 * @param {string} props.borderPosition - Current border position (card-border-top, etc.)
 * @param {string} props.borderColor - Current border color
 * @param {string} props.borderColorType - Current border color type (solid, soft)
 * @param {string} props.borderWidth - Current border width
 * @param {boolean} props.showPosition - Show position control (for cards)
 * @param {Function} props.onBorderPositionChange - Callback when position changes
 * @param {Function} props.onBorderColorChange - Callback when color changes
 * @param {Function} props.onBorderColorTypeChange - Callback when color type changes
 * @param {Function} props.onBorderWidthChange - Callback when width changes
 * @param {boolean} props.showBorderRadius - Show border radius control (default: true)
 * @param {boolean} props.showShadow - Show shadow control (default: true)
 * @param {boolean} props.showBorder - Show border control (default: true)
 */
export const BorderSettingsPanel = ({
	// Border Radius
	borderRadius = '',
	onBorderRadiusChange,
	// Shadow
	shadow = '',
	onShadowChange,
	// Border
	borderPosition = '',
	borderColor = '',
	borderColorType = 'solid',
	borderWidth = '',
	showPosition = true,
	onBorderPositionChange,
	onBorderColorChange,
	onBorderColorTypeChange,
	onBorderWidthChange,
	// Visibility flags
	showBorderRadius = true,
	showShadow = true,
	showBorder = true,
}) => {
	// Нормализуем borderColorType - всегда используем 'solid' по умолчанию
	const normalizedBorderColorType = borderColorType || 'solid';

	return (
		<>
			{/* Border Radius */}
			{showBorderRadius && onBorderRadiusChange && (
				<BorderRadiusControl
					value={borderRadius}
					onChange={onBorderRadiusChange}
				/>
			)}

			{/* Shadow */}
			{showShadow && onShadowChange && (
				<ShadowControl
					value={shadow}
					onChange={onShadowChange}
				/>
			)}

			{/* Border Settings */}
			{showBorder && (
				<div style={{ marginTop: showBorderRadius || showShadow ? '16px' : '0' }}>
					<BorderControl
						borderPosition={borderPosition}
						borderColor={borderColor}
						borderColorType={normalizedBorderColorType}
						borderWidth={borderWidth}
						showPosition={showPosition}
						onBorderPositionChange={onBorderPositionChange}
						onBorderColorChange={onBorderColorChange}
						onBorderColorTypeChange={onBorderColorTypeChange}
						onBorderWidthChange={onBorderWidthChange}
					/>
				</div>
			)}
		</>
	);
};

export default BorderSettingsPanel;

