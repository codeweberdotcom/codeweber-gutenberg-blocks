/**
 * Contacts Sidebar Settings
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
	CheckboxControl,
	TabPanel,
	ComboboxControl,
} from '@wordpress/components';
import { Icon, trash, starFilled, typography, cog } from '@wordpress/icons';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { IconControl } from '../../components/icon/IconControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

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

export const ContactsSidebar = ({ attributes, setAttributes }) => {
	const { items = [], format = 'simple', itemClass = '', theme = 'default' } = attributes;

	const updateItem = (index, updates) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], ...updates };
		setAttributes({ items: newItems });
	};

	const moveItem = (fromIndex, toIndex) => {
		const newItems = [...items];
		const [moved] = newItems.splice(fromIndex, 1);
		newItems.splice(toIndex, 0, moved);
		setAttributes({ items: newItems });
	};

	const addItem = (type) => {
		const newItem = {
			type,
			enabled: true,
			...(type === 'address' ? { addressType: 'legal' } : {}),
			...(type === 'phone' ? { phones: ['phone_01'] } : {}),
			...(type === 'schedule' ? { showStatus: false } : {}),
		};
		setAttributes({ items: [...items, newItem] });
	};

	const removeItem = (index) => {
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
	};

	const phoneOptions = [
		{
			label: __('Phone 01', 'codeweber-gutenberg-blocks'),
			value: 'phone_01',
		},
		{
			label: __('Phone 02', 'codeweber-gutenberg-blocks'),
			value: 'phone_02',
		},
		{
			label: __('Phone 03', 'codeweber-gutenberg-blocks'),
			value: 'phone_03',
		},
		{
			label: __('Phone 04', 'codeweber-gutenberg-blocks'),
			value: 'phone_04',
		},
		{
			label: __('Phone 05', 'codeweber-gutenberg-blocks'),
			value: 'phone_05',
		},
	];

	const tabs = [
		{
			name: 'items',
			title: (
				<TabIcon
					icon={trash}
					label={__('Contact Items', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'text',
			title: (
				<TabIcon
					icon={typography}
					label={__('Text', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'icon',
			title: (
				<TabIcon
					icon={starFilled}
					label={__('Icon', 'codeweber-gutenberg-blocks')}
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
					{tab.name === 'items' && (
						<PanelBody
							title={__(
								'Contact Items',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							{/* Theme: default = no classes, dark = text-dark, light = text-light */}
							<div
								className="component-sidebar-title"
								style={{ marginTop: 0, marginBottom: '12px' }}
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
											'Dark',
											'codeweber-gutenberg-blocks'
										),
										value: 'dark',
									},
									{
										label: __(
											'Light',
											'codeweber-gutenberg-blocks'
										),
										value: 'light',
									},
								].map((themeOption) => (
									<Button
										key={themeOption.value}
										variant={
											(theme || 'default') ===
											themeOption.value
												? 'primary'
												: 'secondary'
										}
										isSmall
										className="button-group-sidebar_50-item"
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
							<SelectControl
								label={__(
									'Format',
									'codeweber-gutenberg-blocks'
								)}
								value={format}
								options={[
									{
										label: __(
											'Simple',
											'codeweber-gutenberg-blocks'
										),
										value: 'simple',
									},
									{
										label: __(
											'With Icon',
											'codeweber-gutenberg-blocks'
										),
										value: 'icon',
									},
									{
										label: __(
											'With Icon Simple',
											'codeweber-gutenberg-blocks'
										),
										value: 'icon-simple',
									},
								]}
								onChange={(value) =>
									setAttributes({ format: value })
								}
							/>
							{(format === 'icon' || format === 'icon-simple') && (
								<p
									style={{
										marginTop: '8px',
										marginBottom: '0',
										fontSize: '12px',
										color: '#757575',
									}}
								>
									{__(
										'Use the Icon and Text tabs to customize icon and paragraph.',
										'codeweber-gutenberg-blocks'
									)}
								</p>
							)}

							{items.length === 0 && (
								<p
									style={{
										marginBottom: '16px',
										color: '#757575',
									}}
								>
									{__(
										'No contact items. Add items below.',
										'codeweber-gutenberg-blocks'
									)}
								</p>
							)}

							{items.map((item, index) => (
								<div
									key={index}
									style={{
										marginBottom: '16px',
										padding: '12px',
										border: '1px solid #ddd',
										borderRadius: '4px',
									}}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											marginBottom: '8px',
										}}
									>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '8px',
											}}
										>
											<strong>
												{__(
													'Item',
													'codeweber-gutenberg-blocks'
												)}{' '}
												{index + 1}: {item.type}
											</strong>
										</div>
										<div
											style={{
												display: 'flex',
												gap: '8px',
											}}
										>
											<Button
												isSmall
												onClick={() =>
													moveItem(index, index - 1)
												}
												disabled={index === 0}
											>
												↑
											</Button>
											<Button
												isSmall
												onClick={() =>
													moveItem(index, index + 1)
												}
												disabled={
													index === items.length - 1
												}
											>
												↓
											</Button>
											<Button
												isSmall
												isDestructive
												onClick={() =>
													removeItem(index)
												}
												icon={trash}
											/>
										</div>
									</div>

									<ToggleControl
										label={__(
											'Enable',
											'codeweber-gutenberg-blocks'
										)}
										checked={item.enabled}
										onChange={(value) =>
											updateItem(index, {
												enabled: value,
											})
										}
									/>

									{item.type === 'address' && (
										<SelectControl
											label={__(
												'Address Type',
												'codeweber-gutenberg-blocks'
											)}
											value={item.addressType}
											options={[
												{
													label: __(
														'Legal Address',
														'codeweber-gutenberg-blocks'
													),
													value: 'legal',
												},
												{
													label: __(
														'Actual Address',
														'codeweber-gutenberg-blocks'
													),
													value: 'actual',
												},
											]}
											onChange={(value) =>
												updateItem(index, {
													addressType: value,
												})
											}
										/>
									)}

									{item.type === 'phone' && (
										<div style={{ marginTop: '12px' }}>
											<label
												style={{
													display: 'block',
													marginBottom: '8px',
													fontWeight: 'bold',
												}}
											>
												{__(
													'Select Phones',
													'codeweber-gutenberg-blocks'
												)}
											</label>
											{phoneOptions.map((option) => (
												<CheckboxControl
													key={option.value}
													label={option.label}
													checked={(
														item.phones || []
													).includes(option.value)}
													onChange={(checked) => {
														const currentPhones =
															item.phones || [];
														const newPhones =
															checked
																? [
																		...currentPhones,
																		option.value,
																	]
																: currentPhones.filter(
																		(p) =>
																			p !==
																			option.value
																	);
														updateItem(index, {
															phones: newPhones,
														});
													}}
												/>
											))}
										</div>
									)}

									{item.type === 'schedule' && (
										<>
											<TextControl
												label={__('Title', 'codeweber-gutenberg-blocks')}
												help={__('Leave empty to hide the heading.', 'codeweber-gutenberg-blocks')}
												value={item.title ?? 'Opening hours'}
												onChange={(value) =>
													updateItem(index, { title: value })
												}
											/>
											<SelectControl
												label={__('Day name format', 'codeweber-gutenberg-blocks')}
												value={item.dayFormat || 'short'}
												options={[
													{ label: __('Short (Mon)', 'codeweber-gutenberg-blocks'), value: 'short' },
													{ label: __('Full (Monday)', 'codeweber-gutenberg-blocks'), value: 'full' },
												]}
												onChange={(value) =>
													updateItem(index, { dayFormat: value })
												}
											/>
											<SelectControl
												label={__('Lunch break', 'codeweber-gutenberg-blocks')}
												value={item.breakMode || 'both'}
												options={[
													{ label: __('Both intervals', 'codeweber-gutenberg-blocks'), value: 'both' },
													{ label: __('Single range', 'codeweber-gutenberg-blocks'), value: 'range' },
													{ label: __('Second line', 'codeweber-gutenberg-blocks'), value: 'second-line' },
												]}
												onChange={(value) =>
													updateItem(index, { breakMode: value })
												}
											/>
											<SelectControl
												label={__('Time separator', 'codeweber-gutenberg-blocks')}
												value={item.timeSeparator || 'ndash'}
												options={[
													{ label: __('En dash (–)', 'codeweber-gutenberg-blocks'), value: 'ndash' },
													{ label: __('Em dash (—)', 'codeweber-gutenberg-blocks'), value: 'mdash' },
													{ label: __('Word to', 'codeweber-gutenberg-blocks'), value: 'to' },
												]}
												onChange={(value) =>
													updateItem(index, { timeSeparator: value })
												}
											/>
											<TextControl
												label={__('Day off label', 'codeweber-gutenberg-blocks')}
												value={item.dayoffLabel ?? 'Day off'}
												onChange={(value) =>
													updateItem(index, { dayoffLabel: value })
												}
											/>
											<ToggleControl
												label={__('Group days with identical hours', 'codeweber-gutenberg-blocks')}
												checked={!!item.groupSameDays}
												onChange={(value) =>
													updateItem(index, { groupSameDays: value })
												}
											/>
											<ToggleControl
												label={__('Highlight current day', 'codeweber-gutenberg-blocks')}
												checked={item.highlightToday !== false}
												onChange={(value) =>
													updateItem(index, { highlightToday: value })
												}
											/>
											{item.highlightToday !== false && (
												<TextControl
													label={__('Today label', 'codeweber-gutenberg-blocks')}
													help={__('Shown next to the current day, e.g. · today', 'codeweber-gutenberg-blocks')}
													value={item.todayLabel ?? ''}
													onChange={(value) =>
														updateItem(index, { todayLabel: value })
													}
												/>
											)}
											<ToggleControl
												label={__('Show open/closed status', 'codeweber-gutenberg-blocks')}
												checked={!!item.showStatus}
												onChange={(value) =>
													updateItem(index, { showStatus: value })
												}
											/>
											{!!item.showStatus && (
												<>
													<TextControl
														label={__('Open label', 'codeweber-gutenberg-blocks')}
														value={item.openLabel ?? 'Open now'}
														onChange={(value) =>
															updateItem(index, { openLabel: value })
														}
													/>
													<TextControl
														label={__('Closed label', 'codeweber-gutenberg-blocks')}
														value={item.closedLabel ?? 'Closed'}
														onChange={(value) =>
															updateItem(index, { closedLabel: value })
														}
													/>
												</>
											)}
										</>
									)}
								</div>
							))}

							<div
								style={{
									marginTop: '16px',
									paddingTop: '16px',
									borderTop: '1px solid #ddd',
								}}
							>
								<p
									style={{
										marginBottom: '8px',
										fontWeight: 'bold',
									}}
								>
									{__(
										'Add Item',
										'codeweber-gutenberg-blocks'
									)}
								</p>
								<div
									style={{
										display: 'flex',
										gap: '8px',
										flexWrap: 'wrap',
									}}
								>
									<Button
										isSmall
										variant="secondary"
										onClick={() => addItem('address')}
									>
										{__(
											'Address',
											'codeweber-gutenberg-blocks'
										)}
									</Button>
									<Button
										isSmall
										variant="secondary"
										onClick={() => addItem('email')}
									>
										{__(
											'Email',
											'codeweber-gutenberg-blocks'
										)}
									</Button>
									<Button
										isSmall
										variant="secondary"
										onClick={() => addItem('phone')}
									>
										{__(
											'Phone',
											'codeweber-gutenberg-blocks'
										)}
									</Button>
									<Button
										isSmall
										variant="secondary"
										onClick={() => addItem('schedule')}
									>
										{__(
											'Opening hours',
											'codeweber-gutenberg-blocks'
										)}
									</Button>
								</div>
							</div>
						</PanelBody>
					)}

					{tab.name === 'text' && (
						<HeadingTypographyControl
							attributes={attributes}
							setAttributes={setAttributes}
							hideSubtitle={true}
							hideText={false}
						/>
					)}

					{tab.name === 'icon' && (
						<IconControl
							attributes={attributes}
							setAttributes={setAttributes}
							prefix=""
							showWrapper={format === 'icon'}
						/>
					)}

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
									classKey: 'blockClass',
									dataKey: 'blockData',
									idKey: 'blockId',
								}}
								labels={{
									classLabel: __(
										'Block Class',
										'codeweber-gutenberg-blocks'
									),
									dataLabel: __(
										'Block Data',
										'codeweber-gutenberg-blocks'
									),
									idLabel: __(
										'Block ID',
										'codeweber-gutenberg-blocks'
									),
								}}
							/>
							<div style={{ marginTop: '16px' }}>
								<TextControl
									label={__(
										'Item Class',
										'codeweber-gutenberg-blocks'
									)}
									value={itemClass}
									onChange={(value) =>
										setAttributes({ itemClass: value })
									}
									help={__(
										'CSS classes for each contact item wrapper (address, email, phone).',
										'codeweber-gutenberg-blocks'
									)}
								/>
							</div>
						</PanelBody>
					)}
				</>
			)}
		</TabPanel>
	);
};
