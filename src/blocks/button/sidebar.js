// Импорт необходимых модулей
import { __ } from '@wordpress/i18n';
import { colors } from '../../utilities/colors';
import { fontIconsSocial } from '../../utilities/font_icon_social';
import { useSelect } from '@wordpress/data';
import { PanelBody, Button, ComboboxControl } from '@wordpress/components';
import { ButtonStyleControls } from '../../components/button-style/ButtonStyleControls';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

export const ButtonSidebar = ({
	attributes,
	setAttributes,
	iconPickerOpen,
	setIconPickerOpen,
	clientId,
}) => {
	const {
		ButtonType,
		SocialIconClass,
		SocialIconStyle,
		LinkColor,
		HoverType,
		LinkTextColor,
	} = attributes;

	// Проверка: кнопка внутри Social Wrapper — только тип Social, размер/стиль/класс задаются в обёртке
	const isInsideSocialWrapper = useSelect(
		(select) => {
			if (!clientId) return false;
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parents = getBlockParents(clientId);
			const directParentId = parents[0];
			if (!directParentId) return false;
			const parent = getBlock(directParentId);
			return parent?.name === 'codeweber-blocks/social-wrapper';
		},
		[clientId]
	);

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
		const { ButtonIconPosition } = attributes;

		switch (type) {
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
			{/* Общие стилевые контролы: тип/размер/форма/стиль/цвет/градиент/иконка
			    (общий компонент с блоком Submit Button) */}
			{!isInsideSocialWrapper && (
				<ButtonStyleControls
					attributes={attributes}
					setAttributes={setAttributes}
					iconPickerOpen={iconPickerOpen}
					setIconPickerOpen={setIconPickerOpen}
				/>
			)}
			{isInsideSocialWrapper && (
				<p className="description" style={{ marginBottom: '1em' }}>
					{__('Type: Social (set by Social Wrapper)', 'codeweber-gutenberg-blocks')}
				</p>
			)}

			{/* Link Type */}
			{ButtonType === 'link' && (
				<>
					<div className="component-sidebar-title">
						<label>
							{__('Link Type', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					<div className="link-type-controls button-group-sidebar_33">
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
				</>
			)}

			{/* Link Variant */}
			{ButtonType === 'link' && HoverType !== 'none' && (
				<>
					<div className="component-sidebar-title">
						<label>
							{__('Link Variant', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					<div className="link-variant-controls button-group-sidebar_50">
						{[
							{ label: 'Body', value: 'body' },
							{ label: 'Default', value: 'default' },
							{ label: 'More', value: 'more' },
							{ label: 'More Left', value: 'more-left' },
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
				</>
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

			{/* Социальные иконки: класс иконки и стиль (стиль скрыт внутри Social Wrapper) */}
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

			{/* Социальные иконки - стиль (задаётся в Social Wrapper) */}
			{!isInsideSocialWrapper && ButtonType === 'social' && (
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

			{/* Block Meta Fields (класс кнопки задаётся в Social Wrapper) */}
			{!isInsideSocialWrapper && (
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
			)}
		</PanelBody>
	);
};
