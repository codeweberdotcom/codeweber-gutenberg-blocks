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
	TabPanel,
	RangeControl,
} from '@wordpress/components';
import { Icon, menu, list, typography, edit, cog } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { IconPicker } from '../../components/icon/IconPicker';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { colors } from '../../utilities/colors';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<Icon icon={icon} size={20} />
	</span>
);

export const MenuSidebar = ({ attributes, setAttributes, wpMenus = [] }) => {
	const {
		mode,
		wpMenuId,
		depth,
		orientation,
		theme,
		listType,
		bulletColor,
		bulletBg,
		iconClass,
		textColor,
		menuClass,
		itemClass,
		linkClass,
		enableWidget,
		enableMegaMenu,
		columns,
		enableTitle,
		title,
		titleTag,
		titleColor,
		titleColorType,
		titleSize,
		titleWeight,
		titleTransform,
		titleClass,
	} = attributes;

	const [iconPickerOpen, setIconPickerOpen] = useState(false);

	// Extract icon name from class (e.g., "uil uil-arrow-right" -> "arrow-right")
	const getIconName = (iconClass) => {
		if (!iconClass) return '';
		const match = iconClass.match(/uil-([^\s]+)/);
		return match ? match[1] : '';
	};

	// Define tabs
	const tabs = [
		{
			name: 'menu',
			title: (
				<TabIcon
					icon={menu}
					label={__('Menu', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'list',
			title: (
				<TabIcon
					icon={list}
					label={__('List', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'title',
			title: (
				<TabIcon
					icon={typography}
					label={__('Title', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'items',
			title: (
				<TabIcon
					icon={edit}
					label={__('Items', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'settings',
			title: (
				<TabIcon
					icon={cog}
					label={__('Settings', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{/* MENU TAB */}
					{tab.name === 'menu' && (
						<PanelBody
							title={__(
								'Menu Settings',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							{/* Widget Toggle */}
							<ToggleControl
								label={__(
									'Enable Widget Wrapper',
									'codeweber-gutenberg-blocks'
								)}
								checked={enableWidget || false}
								onChange={(value) =>
									setAttributes({ enableWidget: value })
								}
								help={__(
									'Add widget wrapper div with class "widget"',
									'codeweber-gutenberg-blocks'
								)}
							/>

							<ToggleControl
								label={__(
									'Enable Mega Menu',
									'codeweber-gutenberg-blocks'
								)}
								checked={enableMegaMenu || false}
								onChange={(value) =>
									setAttributes({ enableMegaMenu: value })
								}
								help={__(
									'Use div tag and h6 size for title',
									'codeweber-gutenberg-blocks'
								)}
							/>

							{enableMegaMenu && (
								<SelectControl
									label={__(
										'Columns',
										'codeweber-gutenberg-blocks'
									)}
									value={String(columns ?? 1)}
									options={[
										{ label: __('1 column', 'codeweber-gutenberg-blocks'), value: '1' },
										{ label: __('2 columns', 'codeweber-gutenberg-blocks'), value: '2' },
										{ label: __('3 columns', 'codeweber-gutenberg-blocks'), value: '3' },
									]}
									onChange={(value) =>
										setAttributes({ columns: parseInt(value, 10) })
									}
									help={__(
										'Number of columns for mega menu layout',
										'codeweber-gutenberg-blocks'
									)}
								/>
							)}

							{/* Mode Selection */}
							<div
								className="component-sidebar-title"
								style={{ marginTop: '16px' }}
							>
								<label>
									{__(
										'Data Source',
										'codeweber-gutenberg-blocks'
									)}
								</label>
							</div>
							<div className="button-group-sidebar_50">
								{[
									{
										label: __(
											'Custom',
											'codeweber-gutenberg-blocks'
										),
										value: 'custom',
									},
									{
										label: __(
											'WP Menu',
											'codeweber-gutenberg-blocks'
										),
										value: 'wp-menu',
									},
								].map((modeOption) => (
									<Button
										key={modeOption.value}
										isPrimary={
											(mode || 'custom') ===
											modeOption.value
										}
										onClick={() =>
											setAttributes({
												mode: modeOption.value,
											})
										}
									>
										{modeOption.label}
									</Button>
								))}
							</div>

							{/* WordPress Menu Selection - показываем только в режиме WP Menu */}
							{mode === 'wp-menu' && (
								<>
									<div style={{ marginTop: '16px' }}>
										<SelectControl
											label={__(
												'WordPress Menu',
												'codeweber-gutenberg-blocks'
											)}
											value={wpMenuId || 0}
											options={[
												{
													label: __(
														'Select a menu...',
														'codeweber-gutenberg-blocks'
													),
													value: 0,
												},
												...wpMenus.map((menu) => ({
													label:
														menu.name ||
														`Menu ${menu.id}`,
													value: menu.id,
												})),
											]}
											onChange={(value) =>
												setAttributes({
													wpMenuId: parseInt(value, 10),
												})
											}
											help={__(
												'Select a WordPress menu to display',
												'codeweber-gutenberg-blocks'
											)}
										/>
									</div>
									<div style={{ marginTop: '16px' }}>
										<RangeControl
											label={__(
												'Menu depth (levels)',
												'codeweber-gutenberg-blocks'
											)}
											value={depth ?? 0}
											onChange={(value) =>
												setAttributes({ depth: value ?? 0 })
											}
											min={0}
											max={5}
											help={__(
												'0 = all levels, 1 = top level only, 2 = top + 1 sublevel, etc.',
												'codeweber-gutenberg-blocks'
											)}
										/>
									</div>
								</>
							)}

							{/* Orientation - Vertical / Horizontal */}
							<div
								className="component-sidebar-title"
								style={{ marginTop: '16px' }}
							>
								<label>
									{__('Orientation', 'codeweber-gutenberg-blocks')}
								</label>
							</div>
							<div className="button-group-sidebar_50">
								{[
									{
										label: __('Horizontal', 'codeweber-gutenberg-blocks'),
										value: 'horizontal',
									},
									{
										label: __('Vertical', 'codeweber-gutenberg-blocks'),
										value: 'vertical',
									},
								].map((opt) => (
									<Button
										key={opt.value}
										isPrimary={(orientation || 'horizontal') === opt.value}
										onClick={() => setAttributes({ orientation: opt.value })}
									>
										{opt.label}
									</Button>
								))}
							</div>

							{/* Theme - Default / Light / Dark / Inverse */}
							<div
								className="component-sidebar-title"
								style={{ marginTop: '16px' }}
							>
								<label>
									{__('Theme', 'codeweber-gutenberg-blocks')}
								</label>
							</div>
							<div className="button-group-sidebar_50">
								{[
									{
										label: __(
											'Default',
											'codeweber-gutenberg-blocks'
										),
										value: 'default',
									},
									{
										label: __(
											'Light',
											'codeweber-gutenberg-blocks'
										),
										value: 'light',
									},
									{
										label: __(
											'Dark',
											'codeweber-gutenberg-blocks'
										),
										value: 'dark',
									},
									{
										label: __(
											'Inverse',
											'codeweber-gutenberg-blocks'
										),
										value: 'inverse',
									},
								].map((themeOption) => (
									<Button
										key={themeOption.value}
										isPrimary={
											(theme || 'default') ===
											themeOption.value
										}
										onClick={() =>
											setAttributes({
												theme: themeOption.value,
											})
										}
									>
										{themeOption.label}
									</Button>
								))}
							</div>
							{theme === 'inverse' && (
								<p style={{ marginTop: '8px', fontSize: '12px', color: '#757575' }}>
									{__('Inverse: no colors on menu elements; adds class text-inverse to footer.', 'codeweber-gutenberg-blocks')}
								</p>
							)}
						</PanelBody>
					)}

					{/* LIST TAB */}
					{tab.name === 'list' && (
						<PanelBody
							title={__(
								'List Settings',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							{/* List Type */}
							<div className="component-sidebar-title">
								<label>
									{__(
										'List Type',
										'codeweber-gutenberg-blocks'
									)}
								</label>
							</div>
							<div className="button-group-sidebar_33">
								{[
									{
										label: __(
											'None',
											'codeweber-gutenberg-blocks'
										),
										value: 'none',
									},
									{
										label: __(
											'Unordered',
											'codeweber-gutenberg-blocks'
										),
										value: 'unordered',
									},
									{
										label: __(
											'Icon',
											'codeweber-gutenberg-blocks'
										),
										value: 'icon',
									},
								].map((type) => (
									<Button
										key={type.value}
										isPrimary={
											(listType || 'none') === type.value
										}
										onClick={() =>
											setAttributes({
												listType: type.value,
											})
										}
									>
										{type.label}
									</Button>
								))}
							</div>

							{/* Bullet Color */}
							<div
								className="component-sidebar-title"
								style={{ marginTop: '16px' }}
							>
								<label>
									{__(
										'Bullet Color',
										'codeweber-gutenberg-blocks'
									)}
								</label>
							</div>
							<SelectControl
								value={bulletColor || 'primary'}
								options={[
									{
										label: __(
											'Primary',
											'codeweber-gutenberg-blocks'
										),
										value: 'primary',
									},
									{
										label: __(
											'None',
											'codeweber-gutenberg-blocks'
										),
										value: 'none',
									},
									{
										label: __(
											'Light',
											'codeweber-gutenberg-blocks'
										),
										value: 'light',
									},
									{
										label: __(
											'White',
											'codeweber-gutenberg-blocks'
										),
										value: 'white',
									},
									...colors
										.filter((c) =>
											[
												'aqua',
												'green',
												'leaf',
												'navy',
												'orange',
												'pink',
												'purple',
												'red',
												'violet',
												'yellow',
												'fuchsia',
												'sky',
												'grape',
											].includes(c.value)
										)
										.map((c) => ({
											label: c.label,
											value: c.value,
										})),
								]}
								onChange={(value) =>
									setAttributes({ bulletColor: value })
								}
							/>

							{/* Bullet Background - только для icon-list */}
							{listType === 'icon' && (
								<div style={{ marginTop: '16px' }}>
									<ToggleControl
										label={__(
											'Bullet Background',
											'codeweber-gutenberg-blocks'
										)}
										checked={bulletBg || false}
										onChange={(value) =>
											setAttributes({ bulletBg: value })
										}
										help={__(
											'Enable background color for bullet icons',
											'codeweber-gutenberg-blocks'
										)}
									/>
								</div>
							)}

							{/* Icon Class - только для icon-list */}
							{listType === 'icon' && (
								<div style={{ marginTop: '16px' }}>
									<div className="component-sidebar-title">
										<label>
											{__(
												'Icon',
												'codeweber-gutenberg-blocks'
											)}
										</label>
									</div>
									<Button
										isPrimary
										onClick={() => setIconPickerOpen(true)}
										style={{
											width: '100%',
											marginBottom: '12px',
										}}
									>
										{__(
											'Select Icon',
											'codeweber-gutenberg-blocks'
										)}
									</Button>
									{iconClass && (
										<div
											style={{
												marginTop: '8px',
												padding: '8px',
												background: '#f0f0f1',
												borderRadius: '4px',
												fontSize: '12px',
											}}
										>
											<strong>
												{__(
													'Current icon:',
													'codeweber-gutenberg-blocks'
												)}
											</strong>{' '}
											{iconClass}
										</div>
									)}
									<IconPicker
										isOpen={iconPickerOpen}
										onClose={() => setIconPickerOpen(false)}
										onSelect={(result) => {
											const iconClass = result.iconName
												? `uil uil-${result.iconName}`
												: '';
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
							<div
								className="component-sidebar-title"
								style={{ marginTop: '16px' }}
							>
								<label>
									{__(
										'Text Color',
										'codeweber-gutenberg-blocks'
									)}
								</label>
							</div>
							<SelectControl
								value={textColor || ''}
								options={[
									{
										label: __(
											'Default',
											'codeweber-gutenberg-blocks'
										),
										value: '',
									},
									...colors.map((color) => ({
										label: color.label,
										value: color.value,
									})),
								]}
								onChange={(value) =>
									setAttributes({ textColor: value })
								}
							/>

							{/* Menu Class */}
							<div style={{ marginTop: '16px' }}>
								<TextControl
									label={__(
										'Menu Classes',
										'codeweber-gutenberg-blocks'
									)}
									value={
										menuClass !== undefined &&
										menuClass !== null
											? menuClass
											: 'list-unstyled text-reset mb-0'
									}
									onChange={(value) => {
										setAttributes({ menuClass: value });
									}}
									help={__(
										'Additional CSS classes for the menu list',
										'codeweber-gutenberg-blocks'
									)}
								/>
							</div>

							{/* Item Class */}
							<div style={{ marginTop: '16px' }}>
								<TextControl
									label={__(
										'Item Classes',
										'codeweber-gutenberg-blocks'
									)}
									value={itemClass || ''}
									onChange={(value) =>
										setAttributes({ itemClass: value })
									}
									help={__(
										'Additional CSS classes for menu items (li elements)',
										'codeweber-gutenberg-blocks'
									)}
								/>
							</div>

							{/* Link Class */}
							<div style={{ marginTop: '16px' }}>
								<TextControl
									label={__(
										'Link Classes',
										'codeweber-gutenberg-blocks'
									)}
									value={linkClass || ''}
									onChange={(value) =>
										setAttributes({ linkClass: value })
									}
									help={__(
										'CSS classes for link elements (<a>)',
										'codeweber-gutenberg-blocks'
									)}
								/>
							</div>
						</PanelBody>
					)}

					{/* TITLE TAB */}
					{tab.name === 'title' && (
						<PanelBody
							title={__(
								'Title Settings',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							{/* Title Toggle */}
							<ToggleControl
								label={__(
									'Enable Title',
									'codeweber-gutenberg-blocks'
								)}
								checked={enableTitle || false}
								onChange={(value) =>
									setAttributes({ enableTitle: value })
								}
								help={__(
									'Add widget title',
									'codeweber-gutenberg-blocks'
								)}
							/>

							{/* Title Settings */}
							{enableTitle && (
								<>
									<div style={{ marginTop: '16px' }}>
										<HeadingContentControl
											attributes={{
												...attributes,
												enableSubtitle: false,
												enableText: false,
											}}
											setAttributes={setAttributes}
											hideSubtitle={true}
											hideText={true}
											hideTitle={true}
										/>
									</div>
									<div style={{ marginTop: '16px' }}>
										<HeadingTypographyControl
											attributes={attributes}
											setAttributes={setAttributes}
											hideSubtitle={true}
											hideText={true}
										/>
									</div>
								</>
							)}

							{/* Сообщение если title не включен */}
							{!enableTitle && (
								<div
									style={{
										marginTop: '16px',
										padding: '12px',
										background: '#f0f0f1',
										borderRadius: '4px',
									}}
								>
									<p
										style={{
											margin: 0,
											fontSize: '13px',
											color: '#757575',
										}}
									>
										{__(
											'Enable Title to configure title settings.',
											'codeweber-gutenberg-blocks'
										)}
									</p>
								</div>
							)}
						</PanelBody>
					)}

					{/* ITEMS TAB */}
					{tab.name === 'items' && mode === 'custom' && (
						<PanelBody
							title={__(
								'Menu Items',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							{attributes.items &&
								attributes.items.length > 0 && (
									<div style={{ marginBottom: '16px' }}>
										{attributes.items.map((item, index) => (
											<div
												key={item.id}
												style={{
													marginBottom: '12px',
													padding: '12px',
													border: '1px solid #ddd',
													borderRadius: '4px',
												}}
											>
												<TextControl
													label={__(
														'Text',
														'codeweber-gutenberg-blocks'
													)}
													value={item.text || ''}
													onChange={(value) => {
														const newItems = [
															...attributes.items,
														];
														newItems[index] = {
															...newItems[index],
															text: value,
														};
														setAttributes({
															items: newItems,
														});
													}}
												/>
												<TextControl
													label={__(
														'URL',
														'codeweber-gutenberg-blocks'
													)}
													value={item.url || '#'}
													onChange={(value) => {
														const newItems = [
															...attributes.items,
														];
														newItems[index] = {
															...newItems[index],
															url: value,
														};
														setAttributes({
															items: newItems,
														});
													}}
												/>
												<Button
													isSmall
													isDestructive
													onClick={() => {
														const newItems =
															attributes.items.filter(
																(_, i) =>
																	i !== index
															);
														setAttributes({
															items: newItems,
														});
													}}
													style={{ marginTop: '8px' }}
												>
													{__(
														'Remove',
														'codeweber-gutenberg-blocks'
													)}
												</Button>
											</div>
										))}
									</div>
								)}
							<Button
								isPrimary
								onClick={() => {
									const clientIdPrefix =
										Date.now().toString();
									const newItem = {
										id: `item-${clientIdPrefix}-${Math.floor(Math.random() * 1000)}`,
										text: __(
											'New menu item',
											'codeweber-gutenberg-blocks'
										),
										url: '#',
									};
									setAttributes({
										items: [
											...(attributes.items || []),
											newItem,
										],
									});
								}}
							>
								{__(
									'+ Add Menu Item',
									'codeweber-gutenberg-blocks'
								)}
							</Button>
						</PanelBody>
					)}

					{/* ITEMS TAB - если не custom режим */}
					{tab.name === 'items' && mode !== 'custom' && (
						<PanelBody
							title={__(
								'Menu Items',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							<p style={{ padding: '16px', color: '#757575' }}>
								{__(
									'Switch to Custom mode to edit menu items.',
									'codeweber-gutenberg-blocks'
								)}
							</p>
						</PanelBody>
					)}

					{/* SETTINGS TAB */}
					{tab.name === 'settings' && (
						<PanelBody
							title={__(
								'Block Settings',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							<BlockMetaFields
								attributes={attributes}
								setAttributes={setAttributes}
								fieldKeys={{
									dataKey: 'menuData',
									idKey: 'menuId',
								}}
							/>
						</PanelBody>
					)}
				</>
			)}
		</TabPanel>
	);
};
