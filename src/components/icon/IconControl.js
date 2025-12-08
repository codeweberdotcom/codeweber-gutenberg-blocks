/**
 * IconControl - Inspector Control для настроек иконки
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	ButtonGroup,
	SelectControl,
	ToggleControl,
	BaseControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

import { IconPicker } from './IconPicker';
import { IconRender } from './IconRender';
import {
	iconTypes,
	iconSvgSizes,
	iconFontSizes,
	iconColors,
	iconDuoColors,
	svgIconStyles,
	iconWrapperStyles,
	iconBtnSizes,
	iconBtnVariants,
} from '../../utilities/icon_sizes';

/**
 * Получение значения атрибута с префиксом
 */
const getAttr = (attributes, prefix, name) => {
	const attrName = prefix ? `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;
	return attributes[attrName];
};

/**
 * Установка значения атрибута с префиксом
 */
const setAttr = (setAttributes, prefix, name, value) => {
	const attrName = prefix ? `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;
	setAttributes({ [attrName]: value });
};

/**
 * IconControl Component
 *
 * @param {Object} props
 * @param {Object} props.attributes - Атрибуты блока
 * @param {Function} props.setAttributes - Функция обновления атрибутов
 * @param {string} props.prefix - Префикс атрибутов (для множественных иконок в блоке)
 * @param {string} props.label - Заголовок панели
 * @param {boolean} props.allowSvg - Разрешить SVG иконки
 * @param {boolean} props.allowFont - Разрешить Font иконки
 * @param {boolean} props.allowCustom - Разрешить кастомные SVG
 * @param {boolean} props.showWrapper - Показать настройки обёртки
 * @param {boolean} props.initialOpen - Панель открыта по умолчанию
 */
export const IconControl = ({
	attributes,
	setAttributes,
	prefix = '',
	label = __('Icon', 'codeweber-gutenberg-blocks'),
	allowSvg = true,
	allowFont = true,
	allowCustom = true,
	showWrapper = true,
	initialOpen = false,
}) => {
	const [isPickerOpen, setIsPickerOpen] = useState(false);

	// Получаем значения атрибутов
	const iconType = getAttr(attributes, prefix, 'iconType') || 'none';
	const iconName = getAttr(attributes, prefix, 'iconName') || '';
	const svgIcon = getAttr(attributes, prefix, 'svgIcon') || '';
	const svgStyle = getAttr(attributes, prefix, 'svgStyle') || 'lineal';
	const iconSize = getAttr(attributes, prefix, 'iconSize') || 'xs';
	const iconFontSize = getAttr(attributes, prefix, 'iconFontSize') || '';
	const iconColor = getAttr(attributes, prefix, 'iconColor') || '';
	const iconColor2 = getAttr(attributes, prefix, 'iconColor2') || '';
	const iconClass = getAttr(attributes, prefix, 'iconClass') || '';
	const iconWrapper = getAttr(attributes, prefix, 'iconWrapper') || false;
	const iconWrapperStyle = getAttr(attributes, prefix, 'iconWrapperStyle') || '';
	const iconBtnSize = getAttr(attributes, prefix, 'iconBtnSize') || '';
	const iconBtnVariant = getAttr(attributes, prefix, 'iconBtnVariant') || 'soft';
	const iconWrapperClass = getAttr(attributes, prefix, 'iconWrapperClass') || '';
	const customSvgUrl = getAttr(attributes, prefix, 'customSvgUrl') || '';
	const customSvgId = getAttr(attributes, prefix, 'customSvgId') || null;

	// Фильтруем доступные типы иконок
	const availableTypes = iconTypes.filter((type) => {
		if (type.value === 'none') return true;
		if (type.value === 'font') return allowFont;
		if (type.value === 'svg') return allowSvg;
		if (type.value === 'custom') return allowCustom;
		return false;
	});

	// Определяем тип для IconPicker
	const getSelectedType = () => {
		if (iconType === 'font') return 'font';
		if (iconType === 'svg') {
			return svgStyle === 'solid' || svgStyle === 'solid-mono' || svgStyle === 'solid-duo'
				? 'svg-solid'
				: 'svg-lineal';
		}
		return 'font';
	};

	// Обработчик выбора иконки из picker
	const handleIconSelect = (selection) => {
		setAttr(setAttributes, prefix, 'iconType', selection.iconType);
		setAttr(setAttributes, prefix, 'iconName', selection.iconName);
		setAttr(setAttributes, prefix, 'svgIcon', selection.svgIcon);
		if (selection.svgStyle) {
			setAttr(setAttributes, prefix, 'svgStyle', selection.svgStyle);
		}
	};

	// Обработчик выбора кастомного SVG
	const handleCustomSvgSelect = (media) => {
		if (media && media.url && media.url.endsWith('.svg')) {
			setAttr(setAttributes, prefix, 'customSvgUrl', media.url);
			setAttr(setAttributes, prefix, 'customSvgId', media.id);
			setAttr(setAttributes, prefix, 'iconType', 'custom');
		}
	};

	// Удаление кастомного SVG
	const handleCustomSvgRemove = () => {
		setAttr(setAttributes, prefix, 'customSvgUrl', '');
		setAttr(setAttributes, prefix, 'customSvgId', null);
		setAttr(setAttributes, prefix, 'iconType', 'none');
	};

	return (
		<div style={{ padding: '16px' }}>
			{/* Тип иконки */}
			<SelectControl
				label={__('Icon Type', 'codeweber-gutenberg-blocks')}
				value={iconType}
				options={availableTypes}
				onChange={(value) => setAttr(setAttributes, prefix, 'iconType', value)}
				__nextHasNoMarginBottom
			/>

			{/* Выбор Font или SVG иконки */}
			{(iconType === 'font' || iconType === 'svg') && (
				<>
					<BaseControl
						label={__('Selected Icon', 'codeweber-gutenberg-blocks')}
						className="icon-control-preview"
					>
						<div className="icon-control-preview-wrapper">
							{iconType !== 'none' && (iconName || svgIcon) && (
								<div className="icon-control-preview-icon">
									<IconRender
										iconType={iconType}
										iconName={iconName}
										svgIcon={svgIcon}
										svgStyle={svgStyle}
										iconSize="sm"
										iconFontSize="fs-32"
										iconColor={iconColor}
										iconColor2={iconColor2}
										isEditor={true}
									/>
								</div>
							)}
							<Button
								variant="secondary"
								onClick={() => setIsPickerOpen(true)}
								className="icon-control-select-btn"
							>
								{iconName || svgIcon
									? __('Change Icon', 'codeweber-gutenberg-blocks')
									: __('Select Icon', 'codeweber-gutenberg-blocks')}
							</Button>
						</div>
					</BaseControl>

					<IconPicker
						isOpen={isPickerOpen}
						onClose={() => setIsPickerOpen(false)}
						onSelect={handleIconSelect}
						selectedIcon={iconType === 'font' ? iconName : svgIcon}
						selectedType={getSelectedType()}
						initialTab={iconType === 'font' ? 'font' : getSelectedType()}
					/>
				</>
			)}

			{/* Кастомный SVG */}
			{iconType === 'custom' && (
				<BaseControl label={__('Custom SVG', 'codeweber-gutenberg-blocks')}>
					<div className="icon-control-custom-svg">
						{customSvgUrl ? (
							<div className="icon-control-custom-svg-preview">
								<img src={customSvgUrl} alt="" className="icon-svg icon-svg-sm" />
								<Button
									variant="link"
									isDestructive
									onClick={handleCustomSvgRemove}
								>
									{__('Remove', 'codeweber-gutenberg-blocks')}
								</Button>
							</div>
						) : (
							<MediaUploadCheck>
								<MediaUpload
									onSelect={handleCustomSvgSelect}
									allowedTypes={['image/svg+xml']}
									value={customSvgId}
									render={({ open }) => (
										<Button variant="secondary" onClick={open}>
											{__('Upload SVG', 'codeweber-gutenberg-blocks')}
										</Button>
									)}
								/>
							</MediaUploadCheck>
						)}
					</div>
				</BaseControl>
			)}

			{/* Настройки SVG иконки */}
			{iconType === 'svg' && svgIcon && (
				<>
					<SelectControl
						label={__('SVG Style', 'codeweber-gutenberg-blocks')}
						value={svgStyle}
						options={
							// Если иконка из lineal - только lineal стиль доступен
							// Если из solid - доступны solid/solid-mono/solid-duo
							svgStyle === 'lineal'
								? svgIconStyles.filter((s) => s.value === 'lineal')
								: svgIconStyles.filter((s) => s.value !== 'lineal')
						}
						onChange={(value) => setAttr(setAttributes, prefix, 'svgStyle', value)}
						__nextHasNoMarginBottom
						help={
							svgStyle === 'lineal'
								? __('For Lineal icons, only outline style is available', 'codeweber-gutenberg-blocks')
								: __('For Solid icons, filled styles are available', 'codeweber-gutenberg-blocks')
						}
					/>

					<SelectControl
						label={__('Size', 'codeweber-gutenberg-blocks')}
						value={iconSize}
						options={iconSvgSizes.map((s) => ({ value: s.value, label: s.label }))}
						onChange={(value) => setAttr(setAttributes, prefix, 'iconSize', value)}
						__nextHasNoMarginBottom
					/>
				</>
			)}

			{/* Размер Font иконки */}
			{iconType === 'font' && iconName && (
				<SelectControl
					label={__('Size', 'codeweber-gutenberg-blocks')}
					value={iconFontSize}
					options={iconFontSizes}
					onChange={(value) => setAttr(setAttributes, prefix, 'iconFontSize', value)}
					__nextHasNoMarginBottom
				/>
			)}

			{/* Настройки кастомного SVG */}
			{iconType === 'custom' && customSvgUrl && (
				<SelectControl
					label={__('Size', 'codeweber-gutenberg-blocks')}
					value={iconSize}
					options={iconSvgSizes.map((s) => ({ value: s.value, label: s.label }))}
					onChange={(value) => setAttr(setAttributes, prefix, 'iconSize', value)}
					__nextHasNoMarginBottom
				/>
			)}

			{/* Цвет */}
			{iconType !== 'none' && (iconName || svgIcon || customSvgUrl) && (
				<>
					{/* Для solid-duo используем предустановленные комбинации */}
					{iconType === 'svg' && svgStyle === 'solid-duo' ? (
						<SelectControl
							label={__('Color Combination', 'codeweber-gutenberg-blocks')}
							value={iconColor && iconColor2 ? `${iconColor}-${iconColor2}` : ''}
							options={[
								{ value: '', label: __('Select combination', 'codeweber-gutenberg-blocks') },
								...iconDuoColors,
							]}
							onChange={(value) => {
								if (value) {
									const [color1, color2] = value.split('-');
									setAttr(setAttributes, prefix, 'iconColor', color1);
									setAttr(setAttributes, prefix, 'iconColor2', color2);
								} else {
									setAttr(setAttributes, prefix, 'iconColor', '');
									setAttr(setAttributes, prefix, 'iconColor2', '');
								}
							}}
							__nextHasNoMarginBottom
						/>
					) : (
						<SelectControl
							label={__('Color', 'codeweber-gutenberg-blocks')}
							value={iconColor}
							options={iconColors}
							onChange={(value) => setAttr(setAttributes, prefix, 'iconColor', value)}
							__nextHasNoMarginBottom
						/>
					)}
				</>
			)}

			{/* Дополнительные классы */}
			{iconType !== 'none' && (iconName || svgIcon || customSvgUrl) && (
				<BaseControl
					label={__('Additional icon class', 'codeweber-gutenberg-blocks')}
					help={__('For example: me-4, mb-3, etc.', 'codeweber-gutenberg-blocks')}
				>
					<input
						type="text"
						className="components-text-control__input"
						value={iconClass}
						onChange={(e) => setAttr(setAttributes, prefix, 'iconClass', e.target.value)}
						placeholder="me-4"
					/>
				</BaseControl>
			)}

			{/* Обёртка div.icon */}
			{showWrapper && iconType !== 'none' && (iconName || svgIcon || customSvgUrl) && (
				<>
					<ToggleControl
						label={__('Wrap in div.icon', 'codeweber-gutenberg-blocks')}
						help={__('Adds wrapper for positioning or styling', 'codeweber-gutenberg-blocks')}
						checked={iconWrapper}
						onChange={(value) => setAttr(setAttributes, prefix, 'iconWrapper', value)}
						__nextHasNoMarginBottom
					/>

					{iconWrapper && (
						<>
							<BaseControl
								label={__('Wrapper Style', 'codeweber-gutenberg-blocks')}
								__nextHasNoMarginBottom
							>
								<ButtonGroup className="icon-wrapper-style-buttons">
									{iconWrapperStyles.map((style) => (
										<Button
											key={style.value}
											variant={iconWrapperStyle === style.value ? 'primary' : 'secondary'}
											onClick={() => setAttr(setAttributes, prefix, 'iconWrapperStyle', style.value)}
											size="compact"
										>
											{style.label}
										</Button>
									))}
								</ButtonGroup>
							</BaseControl>

							{/* Настройки кнопки */}
							{(iconWrapperStyle === 'btn' || iconWrapperStyle === 'btn-circle') && (
								<>
									<BaseControl
										label={__('Button Variant', 'codeweber-gutenberg-blocks')}
										__nextHasNoMarginBottom
									>
										<ButtonGroup className="icon-wrapper-style-buttons">
											{iconBtnVariants.map((variant) => (
												<Button
													key={variant.value}
													variant={iconBtnVariant === variant.value ? 'primary' : 'secondary'}
													onClick={() => setAttr(setAttributes, prefix, 'iconBtnVariant', variant.value)}
													size="compact"
												>
													{variant.label}
												</Button>
											))}
										</ButtonGroup>
									</BaseControl>

									<BaseControl
										label={__('Button Size', 'codeweber-gutenberg-blocks')}
										__nextHasNoMarginBottom
									>
										<ButtonGroup className="icon-wrapper-style-buttons">
											{iconBtnSizes.map((size) => (
												<Button
													key={size.value}
													variant={iconBtnSize === size.value ? 'primary' : 'secondary'}
													onClick={() => setAttr(setAttributes, prefix, 'iconBtnSize', size.value)}
													size="compact"
												>
													{size.label}
												</Button>
											))}
										</ButtonGroup>
									</BaseControl>
								</>
							)}

							<BaseControl
								label={__('Additional wrapper classes', 'codeweber-gutenberg-blocks')}
								help={__('For example: pe-none, mb-5', 'codeweber-gutenberg-blocks')}
							>
								<input
									type="text"
									className="components-text-control__input"
									value={iconWrapperClass}
									onChange={(e) => setAttr(setAttributes, prefix, 'iconWrapperClass', e.target.value)}
									placeholder="pe-none mb-5"
								/>
							</BaseControl>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default IconControl;

