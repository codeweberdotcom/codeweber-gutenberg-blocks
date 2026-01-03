/**
 * Menu Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Button,
	ToggleControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { IconPicker } from '../../components/icon/IconPicker';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { colors } from '../../utilities/colors';

export const MenuSidebar = ({ attributes, setAttributes, wpMenus = [] }) => {
	const {
		mode,
		wpMenuId,
		theme,
		listType,
		bulletColor,
		bulletBg,
		iconClass,
		textColor,
		menuClass,
	} = attributes;

	const [iconPickerOpen, setIconPickerOpen] = useState(false);

	// Extract icon name from class (e.g., "uil uil-arrow-right" -> "arrow-right")
	const getIconName = (iconClass) => {
		if (!iconClass) return '';
		const match = iconClass.match(/uil-([^\s]+)/);
		return match ? match[1] : '';
	};

	return (
		<>
			<PanelBody
				title={__('Menu Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
				initialOpen={true}
			>
				{/* Mode Selection */}
				<div className="component-sidebar-title">
					<label>{__('Data Source', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<div className="button-group-sidebar_33">
					{[
						{ label: __('Custom', 'codeweber-gutenberg-blocks'), value: 'custom' },
						{ label: __('WP Menu', 'codeweber-gutenberg-blocks'), value: 'wp-menu' },
					].map((modeOption) => (
						<Button
							key={modeOption.value}
							isPrimary={(mode || 'custom') === modeOption.value}
							onClick={() => setAttributes({ mode: modeOption.value })}
						>
							{modeOption.label}
						</Button>
					))}
				</div>

				{/* WordPress Menu Selection - показываем только в режиме WP Menu */}
				{mode === 'wp-menu' && (
					<div style={{ marginTop: '16px' }}>
						<SelectControl
							label={__('WordPress Menu', 'codeweber-gutenberg-blocks')}
							value={wpMenuId || 0}
							options={[
								{ label: __('Select a menu...', 'codeweber-gutenberg-blocks'), value: 0 },
								...wpMenus.map(menu => ({
									label: menu.name || `Menu ${menu.id}`,
									value: menu.id,
								})),
							]}
							onChange={(value) => setAttributes({ wpMenuId: parseInt(value, 10) })}
							help={__('Select a WordPress menu to display', 'codeweber-gutenberg-blocks')}
						/>
					</div>
				)}

				{/* Theme Toggle - Dark/Light */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>{__('Theme', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<div className="button-group-sidebar_50">
					{[
						{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
						{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
					].map((themeOption) => (
						<Button
							key={themeOption.value}
							isPrimary={(theme || 'light') === themeOption.value}
							onClick={() => setAttributes({ theme: themeOption.value })}
						>
							{themeOption.label}
						</Button>
					))}
				</div>

				{/* List Type */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>{__('List Type', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<div className="button-group-sidebar_50">
					{[
						{ label: __('Unordered', 'codeweber-gutenberg-blocks'), value: 'unordered' },
						{ label: __('Icon', 'codeweber-gutenberg-blocks'), value: 'icon' },
					].map((type) => (
						<Button
							key={type.value}
							isPrimary={(listType || 'unordered') === type.value}
							onClick={() => setAttributes({ listType: type.value })}
						>
							{type.label}
						</Button>
					))}
				</div>

				{/* Bullet Color */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>{__('Bullet Color', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={bulletColor || 'primary'}
					options={[
						{ label: __('Primary', 'codeweber-gutenberg-blocks'), value: 'primary' },
						{ label: __('None', 'codeweber-gutenberg-blocks'), value: 'none' },
						{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
						{ label: __('White', 'codeweber-gutenberg-blocks'), value: 'white' },
						...colors.filter(c => ['aqua', 'green', 'leaf', 'navy', 'orange', 'pink', 'purple', 'red', 'violet', 'yellow', 'fuchsia', 'sky', 'grape'].includes(c.value)).map(c => ({
							label: c.label,
							value: c.value,
						})),
					]}
					onChange={(value) => setAttributes({ bulletColor: value })}
				/>

				{/* Bullet Background - только для icon-list */}
				{listType === 'icon' && (
					<div style={{ marginTop: '16px' }}>
						<ToggleControl
							label={__('Bullet Background', 'codeweber-gutenberg-blocks')}
							checked={bulletBg || false}
							onChange={(value) => setAttributes({ bulletBg: value })}
							help={__('Enable background color for bullet icons', 'codeweber-gutenberg-blocks')}
						/>
					</div>
				)}

				{/* Icon Class - только для icon-list */}
				{listType === 'icon' && (
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
						{iconClass && (
							<div style={{ marginTop: '8px', padding: '8px', background: '#f0f0f1', borderRadius: '4px', fontSize: '12px' }}>
								<strong>{__('Current icon:', 'codeweber-gutenberg-blocks')}</strong> {iconClass}
							</div>
						)}
						<IconPicker
							isOpen={iconPickerOpen}
							onClose={() => setIconPickerOpen(false)}
							onSelect={(result) => {
								const iconClass = result.iconName ? `uil uil-${result.iconName}` : '';
								setAttributes({ iconClass });
							}}
							selectedIcon={getIconName(iconClass)}
							selectedType="font"
							initialTab="font"
							allowFont={true}
							allowSvgLineal={false}
							allowSvgSolid={false}
						/>
					</div>
				)}

				{/* Text Color */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>{__('Text Color', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={textColor || ''}
					options={[
						{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
						...colors.map(color => ({
							label: color.label,
							value: color.value,
						})),
					]}
					onChange={(value) => setAttributes({ textColor: value })}
				/>

				{/* Menu Class */}
				<div style={{ marginTop: '16px' }}>
					<TextControl
						label={__('Menu Classes', 'codeweber-gutenberg-blocks')}
						value={menuClass || 'list-unstyled text-reset mb-0'}
						onChange={(value) => setAttributes({ menuClass: value })}
						help={__('Additional CSS classes for the menu list', 'codeweber-gutenberg-blocks')}
					/>
				</div>
			</PanelBody>

			{/* Custom Menu Items Editor - только в режиме Custom */}
			{mode === 'custom' && (
				<PanelBody
					title={__('Menu Items', 'codeweber-gutenberg-blocks')}
					className="custom-panel-body"
					initialOpen={false}
				>
					{attributes.items && attributes.items.length > 0 && (
						<div style={{ marginBottom: '16px' }}>
							{attributes.items.map((item, index) => (
								<div key={item.id} style={{ 
									marginBottom: '12px', 
									padding: '12px', 
									border: '1px solid #ddd', 
									borderRadius: '4px' 
								}}>
									<TextControl
										label={__('Text', 'codeweber-gutenberg-blocks')}
										value={item.text || ''}
										onChange={(value) => {
											const newItems = [...attributes.items];
											newItems[index] = { ...newItems[index], text: value };
											setAttributes({ items: newItems });
										}}
									/>
									<TextControl
										label={__('URL', 'codeweber-gutenberg-blocks')}
										value={item.url || '#'}
										onChange={(value) => {
											const newItems = [...attributes.items];
											newItems[index] = { ...newItems[index], url: value };
											setAttributes({ items: newItems });
										}}
									/>
									<Button
										isSmall
										isDestructive
										onClick={() => {
											const newItems = attributes.items.filter((_, i) => i !== index);
											setAttributes({ items: newItems });
										}}
										style={{ marginTop: '8px' }}
									>
										{__('Remove', 'codeweber-gutenberg-blocks')}
									</Button>
								</div>
							))}
						</div>
					)}
					<Button
						isPrimary
						onClick={() => {
							const clientIdPrefix = Date.now().toString();
							const newItem = {
								id: `item-${clientIdPrefix}-${Math.floor(Math.random() * 1000)}`,
								text: __('New menu item', 'codeweber-gutenberg-blocks'),
								url: '#',
							};
							setAttributes({ items: [...(attributes.items || []), newItem] });
						}}
					>
						{__('+ Add Menu Item', 'codeweber-gutenberg-blocks')}
					</Button>
				</PanelBody>
			)}

			{/* Block Meta Fields */}
			<PanelBody
				title={__('Block Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
				initialOpen={false}
			>
				<BlockMetaFields
					attributes={attributes}
					setAttributes={setAttributes}
					fieldKeys={{
						classKey: 'menuClass',
						dataKey: 'menuData',
						idKey: 'menuId',
					}}
				/>
			</PanelBody>
		</>
	);
};

