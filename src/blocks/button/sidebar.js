// Импорт необходимых модулей
import { __ } from '@wordpress/i18n';
import { colors } from '../../utilities/colors';
import { gradientcolors } from '../../utilities/gradient_colors';
import { shapes } from '../../utilities/shapes';
import { fontIcons } from '../../utilities/font_icon';
import { fontIconsSocial } from '../../utilities/font_icon_social';
import { useState, useEffect } from '@wordpress/element';
import {
	PanelBody,
	Button,
	ComboboxControl,
	SelectControl,
} from '@wordpress/components';
import { IconPicker } from '../../components/icon/IconPicker';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import apiFetch from '@wordpress/api-fetch';

export const ButtonSidebar = ({
	attributes,
	setAttributes,
	iconPickerOpen,
	setIconPickerOpen,
}) => {
	const {
		ButtonSize,
		ButtonColor,
		ButtonGradientColor,
		ButtonStyle,
		ButtonType,
		ButtonShape,
		ButtonIconPosition,
		IconClass,
		SocialIconClass,
		SocialIconStyle,
		LinkColor,
		HoverType,
		LinkTextColor,
		LeftIcon,
		RightIcon,
		CircleIcon,
	} = attributes;

	// Извлекаем имя иконки из класса (например, "uil uil-windows" -> "windows")
	const getIconName = (iconClass) => {
		if (!iconClass) return '';
		const match = iconClass.match(/uil-([^\s]+)/);
		return match ? match[1] : '';
	};

	// Условие для ограничения отображения кнопок Outline, Gradient и Outline Gradient
	const isRestrictedType = ['expand', 'social', 'play'].includes(ButtonType);

	const handleButtonTypeChange = (type) => {
		const {
			ButtonSize,
			ButtonColor,
			ButtonGradientColor,
			ButtonStyle,
			ButtonType,
			ButtonShape,
			ButtonIconPosition,
			IconClass,
			SocialIconClass,
			SocialIconStyle,
			LeftIcon,
			RightIcon,
			CircleIcon,
		} = attributes;

		let leftIcon = '';
		let rightIcon = '';
		let circleIcon = '';

		if (type === 'expand') {
			leftIcon = 'uil uil-arrow-right';
		} else if (type === 'play') {
			leftIcon = 'icn-caret-right';
		} else if (type === 'circle') {
			circleIcon = IconClass || 'uil uil-arrow-right';
		} else if (type === 'icon') {
			if (attributes.ButtonIconPosition === 'left') {
				leftIcon = IconClass || 'uil uil-arrow-right';
			} else if (attributes.ButtonIconPosition === 'right') {
				rightIcon = IconClass || 'uil uil-arrow-right';
			}
		} else if (type === 'link') {
			// Set default HoverType to 'none' when switching to link type
			setAttributes({ HoverType: 'none' });
		}

		setAttributes({
			ButtonType: type,
			LeftIcon: leftIcon,
			RightIcon: '',
			CircleIcon: circleIcon,
		});
	};

	// Выбор размера кнокпи
	const handleButtonSizeChange = (newSize) => {
		setAttributes({
			ButtonSize: newSize, // Обновляем размер кнопки
		});
	};

	// Выбор формы кнокпи
	const handleButtonShapeChange = (newShape) => {
		setAttributes({
			ButtonShape: newShape, // Обновляем форму кнопки
		});
	};

	const handleButtonStyleChange = (newStyle) => {
		setAttributes({
			ButtonStyle: newStyle, // Обновляем стиль кнопки
		});
	};

	const handleButtonColorChange = (newColor) => {
		setAttributes({
			ButtonColor: newColor, // Обновляем цвет кнопки
		});
	};

	const handleLinkColorChange = (newColor) => {
		setAttributes({
			LinkColor: newColor, // Обновляем цвет ссылки
		});
	};

	const handleHoverTypeChange = (newType) => {
		setAttributes({
			HoverType: newType, // Обновляем тип hover эффекта
		});
	};

	const handleLinkTextColorChange = (newColor) => {
		setAttributes({
			LinkTextColor: newColor, // Обновляем цвет текста ссылки
		});
	};

	const handleIconChange = (type, value) => {
		const {
			ButtonType,
			ButtonIconPosition,
			IconClass,
			SocialIconClass,
			SocialIconStyle,
			LeftIcon,
			RightIcon,
			CircleIcon,
		} = attributes;

		let leftIcon = '';
		let rightIcon = '';
		let circleIcon = '';

		switch (type) {
			case 'position': {
				// Обработка изменения позиции иконки
				if (ButtonType === 'icon') {
					if (ButtonIconPosition === 'left') {
						rightIcon = IconClass;
						leftIcon = '';
					} else if (ButtonIconPosition === 'right') {
						leftIcon = IconClass;
						rightIcon = '';
					}
				}
				setAttributes({
					ButtonIconPosition: value,
					LeftIcon: leftIcon,
					RightIcon: rightIcon,
					CircleIcon: circleIcon,
				});
				break;
			}

			case 'icon': {
				// Обработка изменения иконки
				if (ButtonType === 'circle') {
					circleIcon = value;
				} else if (ButtonType === 'icon') {
					if (ButtonIconPosition === 'left') {
						leftIcon = value;
						rightIcon = '';
					} else if (ButtonIconPosition === 'right') {
						rightIcon = value;
						leftIcon = '';
					}
				}
				setAttributes({
					IconClass: value,
					LeftIcon: leftIcon,
					RightIcon: rightIcon,
					CircleIcon: circleIcon,
				});
				break;
			}

			case 'socialIconStyle': {
				// Обработка изменения стиля социальной иконки
				setAttributes({
					SocialIconStyle: value,
				});
				break;
			}

			case 'socialIconClass': {
				let socialIconClass = '';

				if (ButtonType === 'social') {
					if (ButtonIconPosition === 'left') {
						socialIconClass = value;
					} else if (ButtonIconPosition === 'right') {
						socialIconClass = value;
					}
				}

				setAttributes({
					SocialIconClass: socialIconClass,
				});
				break;
			}

			default:
				break;
		}
	};

	return (
		<PanelBody
			title={__('Button Settings', 'codeweber-gutenberg-blocks')}
			className="custom-panel-body"
		>
			{/* Тип кнопки */}
			<div className="component-sidebar-title">
				<label>{__('Button Type', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<div className="button-type-controls button-group-sidebar_33">
				{[
					{ label: 'Solid', value: 'solid' },
					{ label: 'Circle', value: 'circle' },
					{ label: 'Social', value: 'social' },
					{ label: 'Icon', value: 'icon' },
					{ label: 'Expand', value: 'expand' },
					{ label: 'Play', value: 'play' },
					{ label: 'Link', value: 'link' },
				].map((type) => (
					<Button
						key={type.value}
						isPrimary={ButtonType === type.value}
						onClick={() => handleButtonTypeChange(type.value)}
					>
						{type.label}
					</Button>
				))}
			</div>

			{(ButtonType === 'solid' ||
				ButtonType === 'circle' ||
				ButtonType === 'social' ||
				ButtonType === 'icon') && (
				<>
					{/* Размер кнопки */}
					<div className="component-sidebar-title">
						<label>
							{__('Button Size', 'codeweber-gutenberg-blocks')}
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
								isPrimary={ButtonSize === size.value}
								onClick={() =>
									handleButtonSizeChange(size.value)
								} // Используем функцию для изменения размера кнопки
							>
								{size.label}
							</Button>
						))}
					</div>
				</>
			)}

			{/* Форма кнопки */}
			{(ButtonType === 'icon' || ButtonType === 'solid') && (
				<div className="button-shape-controls">
					<div className="component-sidebar-title">
						<label>
							{__('Button Shape', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					<div className="button-shape-buttons button-group-sidebar_33">
						{shapes.map((shape) => (
							<Button
								key={shape.value}
								isPrimary={ButtonShape === shape.value}
								onClick={() =>
									handleButtonShapeChange(shape.value)
								} // Используем функцию для изменения формы кнопки
							>
								{shape.label}
							</Button>
						))}
					</div>
				</div>
			)}

			{/* Стиль кнопки */}
			{(ButtonType === 'icon' ||
				ButtonType === 'solid' ||
				ButtonType === 'circle' ||
				ButtonType === 'expand' ||
				ButtonType === 'play') && (
				<div className="button-style-controls">
					<div className="component-sidebar-title">
						<label>
							{__('Button Style', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					{/* Основные стили кнопок (50% ширины) */}
					<div className="button-style-buttons button-group-sidebar_50">
						{[
							{ label: 'Solid', value: 'solid' },
							{ label: 'Soft', value: 'soft' },
							// Отображаем кнопки Outline и Gradient только если не выбран ограниченный тип
							...(!isRestrictedType
								? [
										{ label: 'Outline', value: 'outline' },
										{
											label: 'Gradient',
											value: 'gradient',
										},
									]
								: []),
						].map((style) => (
							<Button
								key={style.value}
								isPrimary={ButtonStyle === style.value}
								onClick={() =>
									handleButtonStyleChange(style.value)
								} // Используем функцию для изменения стиля кнопки
							>
								{style.label}
							</Button>
						))}
					</div>
					{/* Outline Gradient на всю ширину */}
					{!isRestrictedType && (
						<div className="button-style-buttons button-group-sidebar_100">
							<Button
								isPrimary={ButtonStyle === 'outline-gradient'}
								onClick={() =>
									handleButtonStyleChange('outline-gradient')
								}
							>
								Outline Gradient
							</Button>
						</div>
					)}
				</div>
			)}

			{/* Цвет кнопки */}
			{(ButtonType === 'icon' ||
				ButtonType === 'solid' ||
				ButtonType === 'circle' ||
				ButtonType === 'expand' ||
				ButtonType === 'play') &&
				(ButtonStyle === 'solid' ||
					ButtonStyle === 'outline' ||
					ButtonStyle === 'soft') && (
					<ComboboxControl
						label={__('Button Color', 'codeweber-gutenberg-blocks')}
						value={ButtonColor}
						options={colors}
						onChange={handleButtonColorChange} // Используем функцию для изменения цвета кнопки
					/>
				)}

			{/* Градиентный цвет */}
			{(ButtonType === 'icon' ||
				ButtonType === 'solid' ||
				ButtonType === 'circle' ||
				ButtonType === 'expand' ||
				ButtonType === 'play') &&
				(ButtonStyle === 'outline-gradient' ||
					ButtonStyle === 'gradient') && (
					<ComboboxControl
						label={__(
							'Gradient Color',
							'codeweber-gutenberg-blocks'
						)}
						value={ButtonGradientColor}
						options={gradientcolors}
						onChange={(newGradient) =>
							setAttributes({
								ButtonGradientColor: newGradient,
							})
						}
					/>
				)}

			{/* Link Type */}
			{ButtonType === 'link' && (
				<div className="link-type-controls button-group-sidebar_33">
					<div className="component-sidebar-title">
						<label>
							{__('Link Type', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					{[
						{ label: 'Нет', value: 'none' },
						{ label: 'Hover', value: 'hover' },
						{ label: 'Hover 2', value: 'hover-2' },
						{ label: 'Hover 3', value: 'hover-3' },
						{ label: 'Hover 8', value: 'hover-8' },
						{ label: 'Hover 9', value: 'hover-9' },
					].map((type) => (
						<Button
							key={type.value}
							isPrimary={HoverType === type.value}
							onClick={() => handleHoverTypeChange(type.value)}
						>
							{type.label}
						</Button>
					))}
				</div>
			)}

			{/* Link Variant */}
			{ButtonType === 'link' && HoverType !== 'none' && (
				<div className="link-variant-controls button-group-sidebar_33">
					<div className="component-sidebar-title">
						<label>
							{__('Link Variant', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					{[
						{ label: 'Body', value: 'body' },
						{ label: 'Default', value: 'default' },
						{ label: 'More', value: 'more' },
					].map((variant) => (
						<Button
							key={variant.value}
							isPrimary={LinkColor === variant.value}
							onClick={() => handleLinkColorChange(variant.value)}
						>
							{variant.label}
						</Button>
					))}
				</div>
			)}

			{/* Link Text Color */}
			{ButtonType === 'link' && HoverType !== 'none' && (
				<ComboboxControl
					label={__('Link Text Color', 'codeweber-gutenberg-blocks')}
					value={LinkTextColor}
					options={colors}
					onChange={handleLinkTextColorChange}
				/>
			)}

			{/* Позиция иконки */}
			{ButtonType === 'icon' && (
				<>
					<div className="icon-position-controls button-group-sidebar_50">
						<div className="component-sidebar-title">
							<label>
								{__(
									'Icon Position',
									'codeweber-gutenberg-blocks'
								)}
							</label>
						</div>
						<Button
							isPrimary={ButtonIconPosition === 'left'}
							onClick={() => handleIconChange('position', 'left')} // Используем универсальный обработчик
						>
							{__('Left', 'codeweber-gutenberg-blocks')}
						</Button>
						<Button
							isPrimary={ButtonIconPosition === 'right'}
							onClick={() =>
								handleIconChange('position', 'right')
							} // Используем универсальный обработчик
						>
							{__('Right', 'codeweber-gutenberg-blocks')}
						</Button>
					</div>
				</>
			)}

			{/* Иконка круга - выбор через IconPicker */}
			{(ButtonType === 'circle' || ButtonType === 'icon') && (
				<>
					<div className="component-sidebar-title">
						<label>
							{__('Icon Class', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					<Button
						isPrimary
						onClick={() => setIconPickerOpen(true)}
						style={{ width: '100%', marginBottom: '12px' }}
					>
						{__('Select Icon', 'codeweber-gutenberg-blocks')}
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
						onClose={() => setIconPickerOpen(false)}
						onSelect={(result) => {
							// Извлекаем iconName и сохраняем как класс иконки
							const iconClass = result.iconName
								? `uil uil-${result.iconName}`
								: '';

							// Определяем, какую иконку обновлять в зависимости от типа и позиции
							if (ButtonType === 'circle') {
								setAttributes({
									IconClass: iconClass,
									CircleIcon: iconClass,
								});
							} else if (ButtonType === 'icon') {
								if (ButtonIconPosition === 'left') {
									setAttributes({
										IconClass: iconClass,
										LeftIcon: iconClass,
										RightIcon: '',
									});
								} else if (ButtonIconPosition === 'right') {
									setAttributes({
										IconClass: iconClass,
										RightIcon: iconClass,
										LeftIcon: '',
									});
								}
							}
						}}
						selectedIcon={getIconName(IconClass)}
						selectedType="font"
						initialTab="font"
						allowFont={true}
						allowSvgLineal={false}
						allowSvgSolid={false}
					/>
				</>
			)}

			{/* Социальные иконки */}
			{ButtonType === 'social' && (
				<ComboboxControl
					label={__(
						'Social Icon Class',
						'codeweber-gutenberg-blocks'
					)}
					value={SocialIconClass}
					options={fontIconsSocial}
					onChange={(newIconClass) =>
						handleIconChange('socialIconClass', newIconClass)
					} // Универсальный обработчик
				/>
			)}

			{/* Социальные иконки - стиль */}
			{ButtonType === 'social' && (
				<>
					<div className="social-icon-style-controls button-group-sidebar">
						<div className="component-sidebar-title">
							<label>
								{__(
									'Social Icon Style',
									'codeweber-gutenberg-blocks'
								)}
							</label>
						</div>
						<div className="social-icon-style-buttons">
							{[
								{ label: 'Style 1', value: 'style_1' },
								{ label: 'Style 2', value: 'style_2' },
								{ label: 'Style 3', value: 'style_3' },
							].map((style) => (
								<Button
									key={style.value}
									isPrimary={SocialIconStyle === style.value}
									onClick={
										() =>
											handleIconChange(
												'socialIconStyle',
												style.value
											) // Универсальный обработчик
									}
								>
									{style.label}
								</Button>
							))}
						</div>
					</div>
				</>
			)}

			{/* Block Meta Fields */}
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
						'Button Class',
						'codeweber-gutenberg-blocks'
					),
					dataLabel: __('Button Data', 'codeweber-gutenberg-blocks'),
					idLabel: __('Button ID', 'codeweber-gutenberg-blocks'),
				}}
			/>
		</PanelBody>
	);
};
