import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl, ButtonGroup, Button, RangeControl } from '@wordpress/components';
import { BorderRadiusControl } from '../../../components/border-radius/BorderRadiusControl';
import { colors } from '../../../utilities/colors';

export const EffectsControl = ({ attributes, setAttributes }) => {
	const {
		hoverEffect,
		enableEffect,
		effectType,
		overlayType,
		overlayGradient,
		overlayColor,
		tooltipType,
		cursor,
		iconName,
		iconColor,
		captionType,
		captionBg,
		captionPosition,
		captionPadding,
		captionFontSize,
		borderRadius,
	} = attributes;

	// Обработчик смены типа эффекта (взаимоисключающие)
	const handleEffectTypeChange = (type) => {
		const updates = { effectType: type };
		
		// Сбрасываем все другие типы при выборе нового
		if (type === 'overlay') {
			// Оставляем overlayType как есть или устанавливаем дефолт
			if (!overlayType || overlayType === 'none') {
				updates.overlayType = 'overlay-1';
			}
			updates.tooltipType = 'itooltip-light';
			updates.cursor = '';
			updates.captionType = 'none';
		} else if (type === 'tooltip') {
			// Активируем tooltip, сбрасываем остальные
			updates.overlayType = 'overlay-1';
			if (!tooltipType || tooltipType === 'none') {
				updates.tooltipType = 'itooltip-light';
			}
			updates.cursor = '';
			updates.captionType = 'none';
		} else if (type === 'caption') {
			// Активируем caption, сбрасываем остальные
			updates.overlayType = 'overlay-1';
			updates.tooltipType = 'itooltip-light';
			updates.cursor = '';
			updates.captionType = 'caption';
		} else if (type === 'icon') {
			// Активируем icon (вместо cursor), сбрасываем остальные
			updates.overlayType = 'overlay-1';
			updates.tooltipType = 'itooltip-light';
			updates.cursor = 'cursor-icon'; // Маркер что используется иконка
			updates.captionType = 'none';
			// Устанавливаем дефолтную иконку если не выбрана
			if (!iconName) {
				updates.iconName = 'arrow-right';
			}
		}
		
		setAttributes(updates);
	};

	return (
		<>
			<SelectControl
				label={__('Hover Effect', 'codeweber-blocks')}
				value={hoverEffect}
				options={[
					{ label: __('None', 'codeweber-blocks'), value: 'none' },
					{ label: 'Lift', value: 'lift' },
					{ label: 'Hover Scale', value: 'hover-scale' },
				]}
				onChange={(value) => setAttributes({ hoverEffect: value })}
			/>

			<ToggleControl
				label={__('Enable Effect Type', 'codeweber-blocks')}
				checked={enableEffect}
				onChange={(value) => {
					const updates = { enableEffect: value };
					// При отключении устанавливаем дефолтные значения (не 'none')
					if (!value) {
						updates.overlayType = 'overlay-1';
						updates.tooltipType = 'itooltip-light';
						updates.cursor = '';
						updates.captionType = 'none';
					}
					setAttributes(updates);
				}}
			/>

			{enableEffect && (
				<div className="mt-4 mb-4">
					<p className="mb-2 fw-bold">
						{__('Effect Type', 'codeweber-blocks')}
					</p>
					<ButtonGroup>
					<Button
						variant={effectType === 'overlay' ? 'primary' : 'secondary'}
						onClick={() => handleEffectTypeChange('overlay')}
					>
						{__('Overlay', 'codeweber-blocks')}
					</Button>
					<Button
						variant={effectType === 'tooltip' ? 'primary' : 'secondary'}
						onClick={() => handleEffectTypeChange('tooltip')}
					>
						{__('Tooltip', 'codeweber-blocks')}
					</Button>
					<Button
						variant={effectType === 'caption' ? 'primary' : 'secondary'}
						onClick={() => handleEffectTypeChange('caption')}
					>
						{__('Caption', 'codeweber-blocks')}
					</Button>
					<Button
						variant={effectType === 'icon' ? 'primary' : 'secondary'}
						onClick={() => handleEffectTypeChange('icon')}
					>
						{__('Icon', 'codeweber-blocks')}
					</Button>
				</ButtonGroup>
				</div>
			)}

			{/* Overlay Settings */}
			{enableEffect && effectType === 'overlay' && (
				<>
					<SelectControl
						label={__('Overlay Type', 'codeweber-blocks')}
						value={overlayType}
						options={[
							{ label: 'Overlay 1', value: 'overlay-1' },
							{ label: 'Overlay 2', value: 'overlay-2' },
							{ label: 'Overlay 3', value: 'overlay-3' },
							{ label: 'Overlay 4', value: 'overlay-4' },
						]}
						onChange={(value) => setAttributes({ overlayType: value })}
					/>

					{overlayType === 'overlay-2' && (
						<ToggleControl
							label={__('Overlay Color (Primary)', 'codeweber-blocks')}
							checked={overlayColor}
							onChange={(value) => setAttributes({ overlayColor: value })}
							help={__('Use primary color for overlay', 'codeweber-blocks')}
						/>
					)}

					{overlayType === 'overlay-3' && (
						<SelectControl
							label={__('Overlay Gradient', 'codeweber-blocks')}
							value={overlayGradient}
							options={[
								{ label: __('None', 'codeweber-blocks'), value: '' },
								{ label: 'Gradient 1', value: 'gradient-1' },
								{ label: 'Gradient 2', value: 'gradient-2' },
								{ label: 'Gradient 3', value: 'gradient-3' },
								{ label: 'Gradient 4', value: 'gradient-4' },
								{ label: 'Gradient 5', value: 'gradient-5' },
								{ label: 'Gradient 6', value: 'gradient-6' },
								{ label: 'Gradient 7', value: 'gradient-7' },
							]}
							onChange={(value) => setAttributes({ overlayGradient: value })}
						/>
					)}
				</>
			)}

			{/* Tooltip Settings */}
			{enableEffect && effectType === 'tooltip' && (
				<SelectControl
					label={__('Tooltip Type', 'codeweber-blocks')}
					value={tooltipType}
					options={[
						{ label: 'iTooltip Light', value: 'itooltip-light' },
						{ label: 'iTooltip Dark', value: 'itooltip-dark' },
						{ label: 'iTooltip Primary', value: 'itooltip-primary' },
					]}
					onChange={(value) => setAttributes({ tooltipType: value })}
				/>
			)}

			{/* Caption Settings */}
			{enableEffect && effectType === 'caption' && (
				<>
					<SelectControl
						label={__('Caption Background', 'codeweber-blocks')}
						value={captionBg}
						options={[
							{ label: 'White', value: 'white' },
							{ label: 'Dark', value: 'dark' },
							{ label: 'Primary', value: 'primary' },
							{ label: 'Soft Primary', value: 'soft-primary' },
						]}
						onChange={(value) => setAttributes({ captionBg: value })}
					/>

					<SelectControl
						label={__('Caption Position', 'codeweber-blocks')}
						value={captionPosition}
						options={[
							{ label: __('Bottom Center', 'codeweber-blocks'), value: 'bottom-center' },
							{ label: __('Bottom Left', 'codeweber-blocks'), value: 'bottom-left' },
							{ label: __('Bottom Right', 'codeweber-blocks'), value: 'bottom-right' },
							{ label: __('Top Center', 'codeweber-blocks'), value: 'top-center' },
							{ label: __('Top Left', 'codeweber-blocks'), value: 'top-left' },
							{ label: __('Top Right', 'codeweber-blocks'), value: 'top-right' },
							{ label: __('Center', 'codeweber-blocks'), value: 'center' },
						]}
						onChange={(value) => setAttributes({ captionPosition: value })}
					/>

					<SelectControl
						label={__('Caption Padding', 'codeweber-blocks')}
						value={captionPadding}
						options={[
							{ label: 'py-1 px-2', value: '1-2' },
							{ label: 'py-2 px-3', value: '2-3' },
							{ label: 'py-3 px-4', value: '3-4' },
							{ label: 'py-4 px-5', value: '4-5' },
							{ label: 'py-5 px-6', value: '5-6' },
						]}
						onChange={(value) => setAttributes({ captionPadding: value })}
					/>

					<SelectControl
						label={__('Caption Font Size', 'codeweber-blocks')}
						value={captionFontSize}
						options={[
							{ label: 'h1', value: 'h1' },
							{ label: 'h2', value: 'h2' },
							{ label: 'h3', value: 'h3' },
							{ label: 'h4', value: 'h4' },
							{ label: 'h5', value: 'h5' },
							{ label: 'h6', value: 'h6' },
							{ label: 'fs-sm', value: 'fs-sm' },
							{ label: 'fs-lg', value: 'fs-lg' },
							{ label: 'fs-12', value: 'fs-12' },
							{ label: 'fs-13', value: 'fs-13' },
							{ label: 'fs-14', value: 'fs-14' },
							{ label: 'fs-15', value: 'fs-15' },
							{ label: 'fs-16', value: 'fs-16' },
							{ label: 'fs-17', value: 'fs-17' },
							{ label: 'fs-18', value: 'fs-18' },
							{ label: 'fs-19', value: 'fs-19' },
							{ label: 'fs-20', value: 'fs-20' },
							{ label: 'fs-21', value: 'fs-21' },
							{ label: 'fs-22', value: 'fs-22' },
							{ label: 'fs-23', value: 'fs-23' },
							{ label: 'fs-24', value: 'fs-24' },
							{ label: 'fs-25', value: 'fs-25' },
							{ label: 'fs-26', value: 'fs-26' },
							{ label: 'fs-27', value: 'fs-27' },
							{ label: 'fs-28', value: 'fs-28' },
						]}
						onChange={(value) => setAttributes({ captionFontSize: value })}
					/>
				</>
			)}

			{/* Icon Settings */}
			{enableEffect && effectType === 'icon' && (
				<SelectControl
					label={__('Cursor Type', 'codeweber-blocks')}
					value={iconColor}
					options={[
						{ label: __('Dark', 'codeweber-blocks'), value: 'dark' },
						{ label: __('Light', 'codeweber-blocks'), value: 'light' },
						{ label: __('Primary', 'codeweber-blocks'), value: 'primary' },
					]}
					onChange={(value) => setAttributes({ iconColor: value })}
				/>
			)}

			<BorderRadiusControl
				value={borderRadius}
				onChange={(value) => setAttributes({ borderRadius: value })}
			/>
		</>
	);
};

