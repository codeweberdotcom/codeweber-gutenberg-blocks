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
	const { items = [], format = 'simple', itemClass = '' } = attributes;

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
							showWrapper={false}
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
