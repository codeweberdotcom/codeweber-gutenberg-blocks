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
	TabPanel,
} from '@wordpress/components';
import { Icon, settings, typography, code, image } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { IconPicker } from '../../components/icon/IconPicker';
import { colors } from '../../utilities/colors';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span 
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

/**
 * Sidebar Component
 */
const DividerSidebar = ({ attributes, setAttributes }) => {
	const {
		dividerType,
		borderStyle,
		borderIcon,
		textAlign,
		title,
		titleTag,
		titleColorType,
		titleTransform,
		waveType,
		waveColor,
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

	const tabs = [
		{ name: 'settings', title: <TabIcon icon={settings} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'text', title: <TabIcon icon={typography} label={__('Text', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'background', title: <TabIcon icon={image} label={__('Background', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'advanced', title: <TabIcon icon={code} label={__('Advanced', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{tab.name === 'settings' && (
						<>
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
											{ label: __('Text', 'codeweber-gutenberg-blocks'), value: 'text' },
										]}
									onChange={(value) => {
										setAttributes({ borderStyle: value });
										// При выборе стиля "text" устанавливаем значения по умолчанию
										if (value === 'text') {
											setAttributes({
												enableTitle: true,
												title: title || 'Тестовый разделитель',
												titleTag: titleTag || 'span',
												titleColorType: titleColorType || 'solid',
												titleTransform: titleTransform || 'text-uppercase',
											});
										}
									}}
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
									{borderStyle === 'text' && (
										<SelectControl
											label={__('Text Alignment', 'codeweber-gutenberg-blocks')}
											value={textAlign}
											options={[
												{ label: __('Left', 'codeweber-gutenberg-blocks'), value: 'left' },
												{ label: __('Center', 'codeweber-gutenberg-blocks'), value: 'center' },
												{ label: __('Right', 'codeweber-gutenberg-blocks'), value: 'right' },
											]}
											onChange={(value) => setAttributes({ textAlign: value })}
										/>
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
						</>
					)}

					{tab.name === 'text' && dividerType === 'border' && borderStyle === 'text' && (
						<>
							<PanelBody title={__('Title Content', 'codeweber-gutenberg-blocks')} initialOpen={true}>
								<HeadingContentControl
									attributes={attributes}
									setAttributes={setAttributes}
									hideSubtitle={true}
									hideText={true}
									hideTitle={true}
								/>
							</PanelBody>
							<PanelBody title={__('Title Typography', 'codeweber-gutenberg-blocks')} initialOpen={false}>
								<HeadingTypographyControl
									attributes={attributes}
									setAttributes={setAttributes}
									hideSubtitle={true}
									hideText={true}
								/>
							</PanelBody>
						</>
					)}

					{tab.name === 'text' && !(dividerType === 'border' && borderStyle === 'text') && (
						<PanelBody>
							<p style={{ color: '#757575', fontStyle: 'italic' }}>
								{__('Text settings are available only for Text divider style.', 'codeweber-gutenberg-blocks')}
							</p>
						</PanelBody>
					)}

					{tab.name === 'background' && dividerType === 'border' && borderStyle === 'text' && (
						<PanelBody title={__('Background Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<BackgroundSettingsPanel
								attributes={attributes}
								setAttributes={setAttributes}
								allowVideo={false}
							/>
						</PanelBody>
					)}

					{tab.name === 'background' && !(dividerType === 'border' && borderStyle === 'text') && (
						<PanelBody>
							<p style={{ color: '#757575', fontStyle: 'italic' }}>
								{__('Background settings are available only for Text divider style.', 'codeweber-gutenberg-blocks')}
							</p>
						</PanelBody>
					)}

					{tab.name === 'advanced' && (
						<PanelBody title={__('Advanced', 'codeweber-gutenberg-blocks')} initialOpen={true}>
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
					)}
				</>
			)}
		</TabPanel>
	);
};

export default DividerSidebar;












