/**
 * Divider Block - Sidebar Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ComboboxControl,
	Button,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { IconPicker } from '../../components/icon/IconPicker';
import { colors } from '../../utilities/colors';

/**
 * Sidebar Component
 */
const DividerSidebar = ({ attributes, setAttributes }) => {
	const {
		dividerType,
		borderStyle,
		borderIcon,
		waveType,
		waveColor,
		marginTop,
		marginBottom,
		blockClass,
		blockId,
	} = attributes;

	const [iconPickerOpen, setIconPickerOpen] = useState(false);

	// Extract icon name from class (e.g., "uil uil-heart" -> "heart")
	const getIconName = (iconClass) => {
		if (!iconClass) return '';
		const match = iconClass.match(/uil-([^\s]+)/);
		return match ? match[1] : '';
	};

	return (
		<>
			{/* Основные настройки */}
			<PanelBody title={__('Divider Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Divider Type', 'codeweber-gutenberg-blocks')}
					value={dividerType}
					options={[
						{ label: __('Border', 'codeweber-gutenberg-blocks'), value: 'border' },
						{ label: __('Wave', 'codeweber-gutenberg-blocks'), value: 'wave' },
					]}
					onChange={(value) => setAttributes({ dividerType: value })}
				/>
			</PanelBody>

			{/* Настройки Border */}
			{dividerType === 'border' && (
				<PanelBody title={__('Border Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Border Style', 'codeweber-gutenberg-blocks')}
						value={borderStyle}
						options={[
							{ label: __('Simple', 'codeweber-gutenberg-blocks'), value: 'simple' },
							{ label: __('Double', 'codeweber-gutenberg-blocks'), value: 'double' },
							{ label: __('Icon', 'codeweber-gutenberg-blocks'), value: 'icon' },
						]}
						onChange={(value) => setAttributes({ borderStyle: value })}
					/>
					{borderStyle === 'icon' && (
						<div style={{ marginTop: '16px' }}>
							<div className="component-sidebar-title">
								<label>{__('Icon', 'codeweber-gutenberg-blocks')}</label>
							</div>
							<Button
								isPrimary
								onClick={() => setIconPickerOpen(true)}
								style={{ width: '100%', marginBottom: '12px' }}
							>
								{__('Select Icon', 'codeweber-gutenberg-blocks')}
							</Button>
							{borderIcon && (
								<div style={{ marginTop: '8px', padding: '8px', background: '#f0f0f1', borderRadius: '4px', fontSize: '12px' }}>
									<strong>{__('Current icon:', 'codeweber-gutenberg-blocks')}</strong> {borderIcon}
								</div>
							)}
							<IconPicker
								isOpen={iconPickerOpen}
								onClose={() => setIconPickerOpen(false)}
								onSelect={(result) => {
									const iconClass = result.iconName ? `uil uil-${result.iconName}` : '';
									setAttributes({ borderIcon: iconClass });
								}}
								selectedIcon={getIconName(borderIcon)}
								selectedType="font"
								initialTab="font"
								allowFont={true}
								allowSvgLineal={false}
								allowSvgSolid={false}
							/>
						</div>
					)}
				</PanelBody>
			)}

			{/* Настройки Wave */}
			{dividerType === 'wave' && (
				<PanelBody title={__('Wave Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Wave Type', 'codeweber-gutenberg-blocks')}
						value={waveType}
						options={[
							{ label: __('Wave 1', 'codeweber-gutenberg-blocks'), value: 'wave-1' },
							{ label: __('Wave 2', 'codeweber-gutenberg-blocks'), value: 'wave-2' },
							{ label: __('Wave 3', 'codeweber-gutenberg-blocks'), value: 'wave-3' },
							{ label: __('Wave 4', 'codeweber-gutenberg-blocks'), value: 'wave-4' },
							{ label: __('Wave 5', 'codeweber-gutenberg-blocks'), value: 'wave-5' },
						]}
						onChange={(value) => setAttributes({ waveType: value })}
					/>
					<ComboboxControl
						label={__('Wave Color', 'codeweber-gutenberg-blocks')}
						value={waveColor}
						options={[
							{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
							...colors.map(color => ({
								label: color.label,
								value: color.value,
							})),
						]}
						onChange={(value) => setAttributes({ waveColor: value })}
					/>
				</PanelBody>
			)}

			{/* Общие настройки */}
			<PanelBody title={__('Spacing', 'codeweber-gutenberg-blocks')} initialOpen={false}>
				<TextControl
					label={__('Margin Top', 'codeweber-gutenberg-blocks')}
					value={marginTop}
					onChange={(value) => setAttributes({ marginTop: value })}
					help={__('Enter margin class (e.g., my-8, mt-4)', 'codeweber-gutenberg-blocks')}
				/>
				<TextControl
					label={__('Margin Bottom', 'codeweber-gutenberg-blocks')}
					value={marginBottom}
					onChange={(value) => setAttributes({ marginBottom: value })}
					help={__('Enter margin class (e.g., my-8, mb-4)', 'codeweber-gutenberg-blocks')}
				/>
			</PanelBody>

			{/* Дополнительные настройки */}
			<PanelBody title={__('Advanced', 'codeweber-gutenberg-blocks')} initialOpen={false}>
				<TextControl
					label={__('Additional CSS Classes', 'codeweber-gutenberg-blocks')}
					value={blockClass}
					onChange={(value) => setAttributes({ blockClass: value })}
				/>
				<TextControl
					label={__('Block ID', 'codeweber-gutenberg-blocks')}
					value={blockId}
					onChange={(value) => setAttributes({ blockId: value })}
				/>
			</PanelBody>
		</>
	);
};

export default DividerSidebar;






