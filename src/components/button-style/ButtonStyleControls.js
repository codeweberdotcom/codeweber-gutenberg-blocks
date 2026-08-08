/**
 * ButtonStyleControls — общее ядро стилевых контролов кнопки.
 *
 * Используется сайдбарами блоков Button и Submit Button: тип, размер, форма,
 * стиль, цвет/градиент, позиция иконки и IconPicker. Логика CSS-классов живёт
 * в blocks/button/buttonclass.js (getClassNames) — здесь только UI и атрибуты.
 * Набор доступных типов задаётся пропом `types` (Submit Button ограничивается
 * solid/icon/expand); состояние IconPicker может быть управляемым извне
 * (Button держит его в edit.js) или локальным (Submit Button).
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, ComboboxControl } from '@wordpress/components';
import { colors } from '../../utilities/colors';
import { gradientcolors } from '../../utilities/gradient_colors';
import { shapes } from '../../utilities/shapes';
import { IconPicker } from '../icon/IconPicker';

const DEFAULT_TYPES = [
	{ label: 'Solid', value: 'solid' },
	{ label: 'Circle', value: 'circle' },
	{ label: 'Social', value: 'social' },
	{ label: 'Icon', value: 'icon' },
	{ label: 'Expand', value: 'expand' },
	{ label: 'Play', value: 'play' },
	{ label: 'Link', value: 'link' },
];

export const ButtonStyleControls = ({
	attributes,
	setAttributes,
	types = DEFAULT_TYPES,
	iconPickerOpen: iconPickerOpenProp,
	setIconPickerOpen: setIconPickerOpenProp,
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
	} = attributes;

	// IconPicker: управляемое состояние (Button) или локальное (Submit Button)
	const [iconPickerOpenLocal, setIconPickerOpenLocal] = useState(false);
	const iconPickerOpen =
		iconPickerOpenProp !== undefined
			? iconPickerOpenProp
			: iconPickerOpenLocal;
	const setIconPickerOpen = setIconPickerOpenProp || setIconPickerOpenLocal;

	// Извлекаем имя иконки из класса (например, "uil uil-windows" -> "windows")
	const getIconName = (iconClass) => {
		if (!iconClass) return '';
		const match = iconClass.match(/uil-([^\s]+)/);
		return match ? match[1] : '';
	};

	// Ограничение стилей Outline/Gradient/Outline Gradient
	const isRestrictedType = ['expand', 'social', 'play'].includes(ButtonType);

	const handleButtonTypeChange = (type) => {
		let leftIcon = '';
		let circleIcon = '';

		if (type === 'expand') {
			leftIcon = 'uil uil-arrow-right';
		} else if (type === 'play') {
			leftIcon = 'icn-caret-right';
		} else if (type === 'circle') {
			circleIcon = IconClass || 'uil uil-arrow-right';
		} else if (type === 'icon') {
			if (ButtonIconPosition === 'left') {
				leftIcon = IconClass || 'uil uil-arrow-right';
			}
		} else if (type === 'link') {
			setAttributes({ HoverType: 'none' });
		}

		setAttributes({
			ButtonType: type,
			LeftIcon: leftIcon,
			RightIcon: '',
			CircleIcon: circleIcon,
		});
	};

	const handleIconPositionChange = (value) => {
		let leftIcon = '';
		let rightIcon = '';
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
			CircleIcon: '',
		});
	};

	return (
		<>
			{/* Тип кнопки */}
			<div className="component-sidebar-title">
				<label>{__('Button Type', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<div className="button-type-controls button-group-sidebar_33">
				{types.map((type) => (
					<Button
						key={type.value}
						isPrimary={ButtonType === type.value}
						onClick={() => handleButtonTypeChange(type.value)}
					>
						{type.label}
					</Button>
				))}
			</div>

			{/* Размер кнопки */}
			{(ButtonType === 'solid' ||
				ButtonType === 'circle' ||
				ButtonType === 'social' ||
				ButtonType === 'icon') && (
				<>
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
									setAttributes({ ButtonSize: size.value })
								}
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
					<div className="button-shape-buttons button-group-sidebar_50">
						{shapes.map((shape) => (
							<Button
								key={shape.value}
								isPrimary={ButtonShape === shape.value}
								onClick={() =>
									setAttributes({ ButtonShape: shape.value })
								}
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
					{/* Стили кнопок: 4 в ряд + Outline Gradient на всю ширину */}
					<div className="button-style-buttons button-group-sidebar-style">
						{[
							{ label: 'Solid', value: 'solid' },
							{ label: 'Soft', value: 'soft' },
							...(!isRestrictedType
								? [
										{ label: 'Outline', value: 'outline' },
										{ label: 'Gradient', value: 'gradient' },
									]
								: []),
						].map((style) => (
							<Button
								key={style.value}
								isPrimary={ButtonStyle === style.value}
								onClick={() =>
									setAttributes({ ButtonStyle: style.value })
								}
							>
								{style.label}
							</Button>
						))}
						{!isRestrictedType && (
							<Button
								className="button-style-full-width"
								isPrimary={ButtonStyle === 'outline-gradient'}
								onClick={() =>
									setAttributes({
										ButtonStyle: 'outline-gradient',
									})
								}
							>
								Outline Gradient
							</Button>
						)}
					</div>
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
						onChange={(value) =>
							setAttributes({ ButtonColor: value })
						}
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
						label={__('Gradient Color', 'codeweber-gutenberg-blocks')}
						value={ButtonGradientColor}
						options={gradientcolors}
						onChange={(value) =>
							setAttributes({ ButtonGradientColor: value })
						}
					/>
				)}

			{/* Позиция иконки */}
			{ButtonType === 'icon' && (
				<>
					<div className="component-sidebar-title">
						<label>
							{__('Icon Position', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					<div className="icon-position-controls button-group-sidebar_50">
						<Button
							isPrimary={ButtonIconPosition === 'left'}
							onClick={() => handleIconPositionChange('left')}
						>
							{__('Left', 'codeweber-gutenberg-blocks')}
						</Button>
						<Button
							isPrimary={ButtonIconPosition === 'right'}
							onClick={() => handleIconPositionChange('right')}
						>
							{__('Right', 'codeweber-gutenberg-blocks')}
						</Button>
					</div>
				</>
			)}

			{/* Иконка — выбор через IconPicker */}
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
								{__('Current icon:', 'codeweber-gutenberg-blocks')}
							</strong>{' '}
							{IconClass}
						</div>
					)}
					<IconPicker
						isOpen={iconPickerOpen}
						onClose={() => setIconPickerOpen(false)}
						onSelect={(result) => {
							const iconClass = result.iconName
								? `uil uil-${result.iconName}`
								: '';

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
		</>
	);
};
