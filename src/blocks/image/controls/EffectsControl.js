import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl } from '@wordpress/components';
import { BorderRadiusControl } from '../../../components/border-radius/BorderRadiusControl';

export const EffectsControl = ({ attributes, setAttributes }) => {
	const {
		hoverEffect,
		overlayType,
		overlayGradient,
		overlayColor,
		tooltipType,
		cursor,
		captionType,
		captionBg,
		captionPosition,
		borderRadius,
	} = attributes;

	// Обработчик для Tooltip Type - сбрасывает Cursor и Caption
	const handleTooltipChange = (value) => {
		const updates = { tooltipType: value };
		// Если выбран tooltip (не "none"), сбрасываем cursor и caption
		if (value !== 'none') {
			updates.cursor = '';
			updates.captionType = 'none';
		}
		setAttributes(updates);
	};

	// Обработчик для Cursor Style - сбрасывает Tooltip и Caption
	const handleCursorChange = (value) => {
		const updates = { cursor: value };
		// Если выбран cursor (не пустой), сбрасываем tooltip и caption
		if (value !== '') {
			updates.tooltipType = 'none';
			updates.captionType = 'none';
		}
		setAttributes(updates);
	};

	// Обработчик для Caption Type - сбрасывает Tooltip и Cursor
	const handleCaptionChange = (value) => {
		const updates = { captionType: value };
		// Если выбран caption (не "none"), сбрасываем tooltip и cursor
		if (value !== 'none') {
			updates.tooltipType = 'none';
			updates.cursor = '';
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

			<SelectControl
				label={__('Overlay Type', 'codeweber-blocks')}
				value={overlayType}
				options={[
					{ label: __('None', 'codeweber-blocks'), value: 'none' },
					{ label: 'Overlay 1', value: 'overlay-1' },
					{ label: 'Overlay 2', value: 'overlay-2' },
					{ label: 'Overlay 3', value: 'overlay-3' },
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

			<SelectControl
				label={__('Tooltip Type', 'codeweber-blocks')}
				value={tooltipType}
				options={[
					{ label: __('None', 'codeweber-blocks'), value: 'none' },
					{ label: 'iTooltip Dark', value: 'itooltip-dark' },
					{ label: 'iTooltip Light', value: 'itooltip-light' },
					{ label: 'iTooltip Primary', value: 'itooltip-primary' },
				]}
				onChange={handleTooltipChange}
				disabled={cursor !== '' || captionType !== 'none'}
				help={cursor !== '' || captionType !== 'none' ? __('Disabled when Cursor or Caption is active', 'codeweber-blocks') : ''}
			/>

			<SelectControl
				label={__('Cursor Style', 'codeweber-blocks')}
				value={cursor}
				options={[
					{ label: __('Default', 'codeweber-blocks'), value: '' },
					{ label: 'Cursor Dark', value: 'cursor-dark' },
					{ label: 'Cursor Light', value: 'cursor-light' },
					{ label: 'Cursor Primary', value: 'cursor-primary' },
				]}
				onChange={handleCursorChange}
				disabled={tooltipType !== 'none' || captionType !== 'none'}
				help={tooltipType !== 'none' || captionType !== 'none' ? __('Disabled when Tooltip or Caption is active', 'codeweber-blocks') : ''}
			/>

			<SelectControl
				label={__('Caption Type', 'codeweber-blocks')}
				value={captionType}
				options={[
					{ label: __('None', 'codeweber-blocks'), value: 'none' },
					{ label: 'Caption (with bg)', value: 'caption' },
				]}
				onChange={handleCaptionChange}
				disabled={tooltipType !== 'none' || cursor !== ''}
				help={tooltipType !== 'none' || cursor !== '' ? __('Disabled when Tooltip or Cursor is active', 'codeweber-blocks') : ''}
			/>

			{captionType !== 'none' && (
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
				</>
			)}

			<BorderRadiusControl
				value={borderRadius}
				onChange={(value) => setAttributes({ borderRadius: value })}
			/>
		</>
	);
};

