/**
 * Submit Button Block Edit Component
 *
 * Style controls mirror the Button block (type/size/shape/style/color/icons);
 * the button class is composed by the shared getClassNames() from the Button block.
 * styleMode 'custom' keeps the legacy free-text Button Classes field.
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TabPanel,
	ToggleControl,
	Button,
	ComboboxControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, cog, positionCenter } from '@wordpress/icons';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { IconPicker } from '../../components/icon/IconPicker';
import { colors } from '../../utilities/colors';
import { gradientcolors } from '../../utilities/gradient_colors';
import { shapes } from '../../utilities/shapes';
import { getClassNames } from '../button/buttonclass';

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

export default function Edit({ attributes, setAttributes }) {
	const {
		buttonText,
		buttonClass,
		blockClass,
		blockData,
		blockId,
		buttonPosition,
		buttonAlignItems,
		buttonJustifyContent,
		buttonTextAlign,
		styleMode,
		ButtonType,
		ButtonSize,
		ButtonStyle,
		ButtonColor,
		ButtonGradientColor,
		ButtonShape,
		ButtonIconPosition,
		IconClass,
		LeftIcon,
		RightIcon,
	} = attributes;

	const [iconPickerOpen, setIconPickerOpen] = useState(false);

	const isCustom = styleMode === 'custom';
	// Expand supports solid/soft styles only (same restriction as the Button block)
	const isRestrictedType = ButtonType === 'expand';

	const blockProps = useBlockProps({
		className: `submit-button-preview ${blockClass || ''}`,
	});

	const handleTypeChange = (type) => {
		let leftIcon = '';
		let rightIcon = '';
		if (type === 'expand') {
			leftIcon = 'uil uil-arrow-right';
		} else if (type === 'icon') {
			if (ButtonIconPosition === 'right') {
				rightIcon = IconClass || 'uil uil-arrow-right';
			} else {
				leftIcon = IconClass || 'uil uil-arrow-right';
			}
		}
		const next = {
			ButtonType: type,
			LeftIcon: leftIcon,
			RightIcon: rightIcon,
		};
		if (type === 'expand' && !['solid', 'soft'].includes(ButtonStyle)) {
			next.ButtonStyle = 'solid';
		}
		setAttributes(next);
	};

	const handleIconPositionChange = (pos) => {
		setAttributes({
			ButtonIconPosition: pos,
			LeftIcon: pos === 'left' ? IconClass || 'uil uil-arrow-right' : '',
			RightIcon: pos === 'right' ? IconClass || 'uil uil-arrow-right' : '',
		});
	};

	const tabs = [
		{
			name: 'button',
			title: (
				<TabIcon
					icon={cog}
					label={__('Button', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'position',
			title: (
				<TabIcon
					icon={positionCenter}
					label={__('Position', 'codeweber-gutenberg-blocks')}
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
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* BUTTON TAB */}
							{tab.name === 'button' && (
								<PanelBody
									title={__(
										'Button Settings',
										'codeweber-gutenberg-blocks'
									)}
									className="custom-panel-body"
									initialOpen={true}
								>
									<TextControl
										label={__(
											'Button Text',
											'codeweber-gutenberg-blocks'
										)}
										value={buttonText}
										onChange={(value) =>
											setAttributes({ buttonText: value })
										}
									/>

									<ToggleControl
										label={__(
											'Use custom classes',
											'codeweber-gutenberg-blocks'
										)}
										checked={isCustom}
										onChange={(value) =>
											setAttributes({
												styleMode: value
													? 'custom'
													: 'preset',
											})
										}
										help={__(
											'Off: style controls like the Button block. On: free-text Bootstrap classes.',
											'codeweber-gutenberg-blocks'
										)}
										__nextHasNoMarginBottom
									/>

									{isCustom && (
										<TextControl
											label={__(
												'Button Classes',
												'codeweber-gutenberg-blocks'
											)}
											value={buttonClass}
											onChange={(value) =>
												setAttributes({
													buttonClass: value,
												})
											}
											help={__(
												'Bootstrap classes: btn btn-primary',
												'codeweber-gutenberg-blocks'
											)}
										/>
									)}

									{!isCustom && (
										<>
											{/* Тип кнопки */}
											<div className="component-sidebar-title">
												<label>
													{__(
														'Button Type',
														'codeweber-gutenberg-blocks'
													)}
												</label>
											</div>
											<div className="button-type-controls button-group-sidebar_33">
												{[
													{ label: 'Solid', value: 'solid' },
													{ label: 'Icon', value: 'icon' },
													{ label: 'Expand', value: 'expand' },
												].map((type) => (
													<Button
														key={type.value}
														isPrimary={
															ButtonType === type.value
														}
														onClick={() =>
															handleTypeChange(type.value)
														}
													>
														{type.label}
													</Button>
												))}
											</div>

											{/* Размер кнопки */}
											{(ButtonType === 'solid' ||
												ButtonType === 'icon') && (
												<>
													<div className="component-sidebar-title">
														<label>
															{__(
																'Button Size',
																'codeweber-gutenberg-blocks'
															)}
														</label>
													</div>
													<div className="button-size-controls button-group-sidebar_33">
														{[
															{ label: 'ExSm', value: 'btn-xs' },
															{ label: 'Sm', value: 'btn-sm' },
															{ label: 'Md', value: '' },
															{ label: 'Lg', value: 'btn-lg' },
															{ label: 'ExLg', value: 'btn-elg' },
														].map((size) => (
															<Button
																key={size.value}
																isPrimary={
																	ButtonSize === size.value
																}
																onClick={() =>
																	setAttributes({
																		ButtonSize: size.value,
																	})
																}
															>
																{size.label}
															</Button>
														))}
													</div>
												</>
											)}

											{/* Форма кнопки */}
											{(ButtonType === 'solid' ||
												ButtonType === 'icon') && (
												<>
													<div className="component-sidebar-title">
														<label>
															{__(
																'Button Shape',
																'codeweber-gutenberg-blocks'
															)}
														</label>
													</div>
													<div className="button-shape-buttons button-group-sidebar_50">
														{shapes.map((shape) => (
															<Button
																key={shape.value}
																isPrimary={
																	ButtonShape === shape.value
																}
																onClick={() =>
																	setAttributes({
																		ButtonShape: shape.value,
																	})
																}
															>
																{shape.label}
															</Button>
														))}
													</div>
												</>
											)}

											{/* Стиль кнопки */}
											<div className="component-sidebar-title">
												<label>
													{__(
														'Button Style',
														'codeweber-gutenberg-blocks'
													)}
												</label>
											</div>
											<div className="button-style-buttons button-group-sidebar-style">
												{[
													{ label: 'Solid', value: 'solid' },
													{ label: 'Soft', value: 'soft' },
													...(!isRestrictedType
														? [
																{
																	label: 'Outline',
																	value: 'outline',
																},
																{
																	label: 'Gradient',
																	value: 'gradient',
																},
															]
														: []),
												].map((style) => (
													<Button
														key={style.value}
														isPrimary={
															ButtonStyle === style.value
														}
														onClick={() =>
															setAttributes({
																ButtonStyle: style.value,
															})
														}
													>
														{style.label}
													</Button>
												))}
												{!isRestrictedType && (
													<Button
														className="button-style-full-width"
														isPrimary={
															ButtonStyle ===
															'outline-gradient'
														}
														onClick={() =>
															setAttributes({
																ButtonStyle:
																	'outline-gradient',
															})
														}
													>
														Outline Gradient
													</Button>
												)}
											</div>

											{/* Цвет кнопки */}
											{(ButtonStyle === 'solid' ||
												ButtonStyle === 'outline' ||
												ButtonStyle === 'soft') && (
												<ComboboxControl
													label={__(
														'Button Color',
														'codeweber-gutenberg-blocks'
													)}
													value={ButtonColor}
													options={colors}
													onChange={(value) =>
														setAttributes({
															ButtonColor: value,
														})
													}
												/>
											)}

											{/* Градиент */}
											{(ButtonStyle === 'gradient' ||
												ButtonStyle ===
													'outline-gradient') && (
												<ComboboxControl
													label={__(
														'Gradient Color',
														'codeweber-gutenberg-blocks'
													)}
													value={ButtonGradientColor}
													options={gradientcolors}
													onChange={(value) =>
														setAttributes({
															ButtonGradientColor: value,
														})
													}
												/>
											)}

											{/* Позиция иконки */}
											{ButtonType === 'icon' && (
												<>
													<div className="component-sidebar-title">
														<label>
															{__(
																'Icon Position',
																'codeweber-gutenberg-blocks'
															)}
														</label>
													</div>
													<div className="icon-position-controls button-group-sidebar_50">
														<Button
															isPrimary={
																ButtonIconPosition === 'left'
															}
															onClick={() =>
																handleIconPositionChange(
																	'left'
																)
															}
														>
															{__(
																'Left',
																'codeweber-gutenberg-blocks'
															)}
														</Button>
														<Button
															isPrimary={
																ButtonIconPosition ===
																'right'
															}
															onClick={() =>
																handleIconPositionChange(
																	'right'
																)
															}
														>
															{__(
																'Right',
																'codeweber-gutenberg-blocks'
															)}
														</Button>
													</div>
												</>
											)}

											{/* Иконка */}
											{ButtonType === 'icon' && (
												<>
													<div className="component-sidebar-title">
														<label>
															{__(
																'Icon Class',
																'codeweber-gutenberg-blocks'
															)}
														</label>
													</div>
													<Button
														isPrimary
														onClick={() =>
															setIconPickerOpen(true)
														}
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
													{IconClass && (
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
															{IconClass}
														</div>
													)}
													<IconPicker
														isOpen={iconPickerOpen}
														onClose={() =>
															setIconPickerOpen(false)
														}
														onSelect={(result) => {
															const iconClass =
																result.iconName
																	? `uil uil-${result.iconName}`
																	: '';
															setAttributes({
																IconClass: iconClass,
																LeftIcon:
																	ButtonIconPosition ===
																	'left'
																		? iconClass
																		: '',
																RightIcon:
																	ButtonIconPosition ===
																	'right'
																		? iconClass
																		: '',
															});
															setIconPickerOpen(false);
														}}
													/>
												</>
											)}
										</>
									)}
								</PanelBody>
							)}

							{/* POSITION TAB */}
							{tab.name === 'position' && (
								<div style={{ padding: '16px' }}>
									<PositioningControl
										title={__(
											'Button Position',
											'codeweber-gutenberg-blocks'
										)}
										alignItems={buttonAlignItems}
										onAlignItemsChange={(value) =>
											setAttributes({
												buttonAlignItems: value,
											})
										}
										justifyContent={buttonJustifyContent}
										onJustifyContentChange={(value) =>
											setAttributes({
												buttonJustifyContent: value,
											})
										}
										textAlign={buttonTextAlign}
										onTextAlignChange={(value) =>
											setAttributes({
												buttonTextAlign: value,
											})
										}
										position={buttonPosition}
										onPositionChange={(value) =>
											setAttributes({
												buttonPosition: value,
											})
										}
										noPanel={true}
									/>
								</div>
							)}

							{/* SETTINGS TAB */}
							{tab.name === 'settings' && (
								<PanelBody
									title={__(
										'Advanced',
										'codeweber-gutenberg-blocks'
									)}
									initialOpen={false}
								>
									<TextControl
										label={__(
											'Block Class',
											'codeweber-gutenberg-blocks'
										)}
										value={blockClass}
										onChange={(value) =>
											setAttributes({ blockClass: value })
										}
									/>
									<TextControl
										label={__(
											'Block Data',
											'codeweber-gutenberg-blocks'
										)}
										value={blockData}
										onChange={(value) =>
											setAttributes({ blockData: value })
										}
									/>
									<TextControl
										label={__(
											'Block ID',
											'codeweber-gutenberg-blocks'
										)}
										value={blockId}
										onChange={(value) =>
											setAttributes({ blockId: value })
										}
									/>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			{(() => {
				// Формируем классы для обертки позиции
				const positionClasses = [];
				if (buttonPosition) {
					positionClasses.push(buttonPosition.trim());
				}
				if (buttonAlignItems) {
					positionClasses.push(buttonAlignItems.trim());
				}
				if (buttonJustifyContent) {
					positionClasses.push('d-flex', buttonJustifyContent.trim());
				}
				if (buttonTextAlign) {
					positionClasses.push(buttonTextAlign.trim());
				}

				const positionWrapperClass = positionClasses
					.filter(Boolean)
					.join(' ');

				const buttonClassName = isCustom
					? buttonClass || 'btn btn-primary'
					: getClassNames({ ...attributes, blockClass: '' });

				const iconEl = (cls) =>
					cls ? <i className={cls}></i> : null;

				const buttonElement = (
					<button
						type="button"
						className={buttonClassName}
						disabled
					>
						{!isCustom && iconEl(LeftIcon)}
						<span>
							{buttonText ||
								__(
									'Send Message',
									'codeweber-gutenberg-blocks'
								)}
						</span>
						{!isCustom && iconEl(RightIcon)}
					</button>
				);

				return (
					<div {...blockProps}>
						<div className="form-submit-wrapper mt-4">
							{positionWrapperClass ? (
								<div className={positionWrapperClass}>
									{buttonElement}
								</div>
							) : (
								buttonElement
							)}
						</div>
					</div>
				);
			})()}
		</>
	);
}
