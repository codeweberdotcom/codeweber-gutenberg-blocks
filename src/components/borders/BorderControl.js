/**
 * BorderControl Component
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { SelectControl, ComboboxControl, ButtonGroup, Button } from '@wordpress/components';
import { ColorTypeControl } from '../colors/ColorTypeControl';
import { borderWidths } from '../../utilities/border-colors';
import { colors } from '../../utilities/colors';

/**
 * BorderControl Component
 * 
 * @param {Object} props
 * @param {string} props.borderPosition - Current border position (card-border-top, etc.)
 * @param {string} props.borderColor - Current border color
 * @param {string} props.borderColorType - Current border color type (solid, soft, pale)
 * @param {string} props.borderWidth - Current border width
 * @param {boolean} props.showPosition - Show position control (for cards)
 * @param {Function} props.onBorderPositionChange - Callback when position changes
 * @param {Function} props.onBorderColorChange - Callback when color changes
 * @param {Function} props.onBorderColorTypeChange - Callback when color type changes
 * @param {Function} props.onBorderWidthChange - Callback when width changes
 */
export const BorderControl = ({ 
	borderPosition = '',
	borderColor = '',
	borderColorType = 'solid',
	borderWidth = '',
	showPosition = true,
	onBorderPositionChange,
	onBorderColorChange,
	onBorderColorTypeChange,
	onBorderWidthChange,
}) => {
	// Нормализуем borderColorType - всегда используем 'solid' по умолчанию
	const normalizedBorderColorType = borderColorType || 'solid';

	// Формируем значение для ComboboxControl
	const getColorValue = () => {
		return borderColor || '';
	};

	const handleColorChange = (value) => {
		if (onBorderColorChange) {
			onBorderColorChange(value);
		}
	};

	return (
		<>
			{/* Border Position (для карточек) */}
			{showPosition && (
				<>
					<div className="component-sidebar-title">
						<label>{__('Border Position', 'codeweber-gutenberg-blocks')}</label>
					</div>
					<ButtonGroup className="button-group-sidebar_33" style={{ marginBottom: '16px' }}>
						<Button
							isPrimary={borderPosition === ''}
							onClick={() => onBorderPositionChange && onBorderPositionChange('')}
						>
							{__('None', 'codeweber-gutenberg-blocks')}
						</Button>
						<Button
							isPrimary={borderPosition === 'card-border-top'}
							onClick={() => onBorderPositionChange && onBorderPositionChange('card-border-top')}
						>
							{__('Top', 'codeweber-gutenberg-blocks')}
						</Button>
						<Button
							isPrimary={borderPosition === 'card-border-bottom'}
							onClick={() => onBorderPositionChange && onBorderPositionChange('card-border-bottom')}
						>
							{__('Bottom', 'codeweber-gutenberg-blocks')}
						</Button>
					</ButtonGroup>
					<ButtonGroup className="button-group-sidebar_50" style={{ marginBottom: '16px' }}>
						<Button
							isPrimary={borderPosition === 'card-border-start'}
							onClick={() => onBorderPositionChange && onBorderPositionChange('card-border-start')}
						>
							{__('Start', 'codeweber-gutenberg-blocks')}
						</Button>
						<Button
							isPrimary={borderPosition === 'card-border-end'}
							onClick={() => onBorderPositionChange && onBorderPositionChange('card-border-end')}
						>
							{__('End', 'codeweber-gutenberg-blocks')}
						</Button>
					</ButtonGroup>
					{(borderPosition || borderColor) && (
						<Button
							isPrimary={borderPosition === 'border'}
							onClick={() => onBorderPositionChange && onBorderPositionChange('border')}
							style={{ marginBottom: '16px', width: '100%' }}
						>
							{__('All Sides', 'codeweber-gutenberg-blocks')}
						</Button>
					)}
				</>
			)}

			{/* Border Width */}
			{onBorderWidthChange && (
				<SelectControl
					label={__('Border Width', 'codeweber-gutenberg-blocks')}
					value={borderWidth}
					options={borderWidths}
					onChange={onBorderWidthChange}
				/>
			)}

			{/* Border Color Type */}
			{onBorderColorTypeChange && (
				<ColorTypeControl
					label={__('Border Color Type', 'codeweber-gutenberg-blocks')}
					value={normalizedBorderColorType}
					onChange={onBorderColorTypeChange}
					options={[
						{ value: 'solid', label: __('Solid', 'codeweber-gutenberg-blocks') },
						{ value: 'soft', label: __('Soft', 'codeweber-gutenberg-blocks') },
					]}
				/>
			)}

			{/* Border Color */}
			<ComboboxControl
				label={__('Border Color', 'codeweber-gutenberg-blocks')}
				value={getColorValue()}
				options={colors}
				onChange={handleColorChange}
			/>
		</>
	);
};

export default BorderControl;

