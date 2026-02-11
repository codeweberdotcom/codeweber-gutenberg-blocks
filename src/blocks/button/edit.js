import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { LinkTypeSelector } from '../../utilities/link_type';
import { ButtonSidebar } from '../button/sidebar';
import { getClassNames } from '../button/buttonclass';
import { __ } from '@wordpress/i18n';
import { useState, useRef, useLayoutEffect } from '@wordpress/element';

// Font-size for social icon when Style 2/3 — как в теме .btn-circle (theme _buttons.scss)
const getSocialIconSizeRem = (buttonSize) => {
	const map = {
		'btn-xs': '0.7rem',
		'btn-sm': '0.85rem',
		'': '1rem',
		'btn-lg': '1.4rem',
		'btn-elg': '1.6rem',
	};
	return map[buttonSize] || '1rem';
};

// Функция для обработки иконки

const ButtonEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		anchor,
		LinkUrl,
		ButtonSize,
		ButtonColor,
		ButtonGradientColor,
		ButtonStyle,
		ButtonType,
		ButtonShape,
		ButtonContent,
		ButtonIconPosition,
		RightIcon,
		LeftIcon,
		SocialIcon,
		IconClass,
		SocialIconClass,
		SocialIconStyle,
		CircleIcon,
		DataValue,
		DataGlightbox,
		DataGallery,
		DataBsToggle,
		DataBsTarget,
		blockClass,
	} = attributes;

	const [iconPickerOpen, setIconPickerOpen] = useState(false);
	const buttonContentRef = useRef(null);

	// Override white-space: pre-wrap from RichText (inline style can't be overridden by CSS)
	useLayoutEffect(() => {
		const el = buttonContentRef.current?.querySelector?.('.button-content');
		if (el) el.style.whiteSpace = 'nowrap';
	});

	const onChangeButtonContent = (newContent) =>
		setAttributes({ ButtonContent: newContent });

	const buttonClass = getClassNames(attributes);

	// Извлекаем имя иконки из класса (например, "uil uil-windows" -> "windows")
	const getIconName = (iconClass) => {
		if (!iconClass) return '';
		const match = iconClass.match(/uil-([^\s]+)/);
		return match ? match[1] : '';
	};

	const getIconComponent = (iconClass, onClick) => {
		if (!iconClass) return null;
		return (
			<i
				className={iconClass}
				onClick={
					onClick
						? (e) => {
								e.stopPropagation();
								onClick();
							}
						: undefined
				}
				style={onClick ? { cursor: 'pointer' } : {}}
				title={
					onClick
						? __(
								'Click to change icon',
								'codeweber-gutenberg-blocks'
							)
						: ''
				}
			></i>
		);
	};

	const shouldHideText =
		ButtonType === 'play' ||
		ButtonType === 'social' ||
		ButtonType === 'circle';

	// Проверка наличия данных в DataGlightbox и DataGallery
	const hasGlightbox = DataGlightbox && DataGlightbox.trim() !== '';
	const hasGallery = DataGallery && DataGallery.trim() !== '';
	const hasBsToggle = DataBsToggle && DataBsToggle.trim() !== '';
	const hasBsTarget = DataBsTarget && DataBsTarget.trim() !== '';

	// Вызываем useBlockProps всегда, чтобы соблюдать правила React Hooks
	const blockProps = useBlockProps({ className: buttonClass, id: anchor });

	return (
		<>
			<div>
				<InspectorControls>
					{/* Добавляем выпадающий список для LinkType */}
					<LinkTypeSelector
						attributes={attributes}
						setAttributes={setAttributes}
					/>
					<ButtonSidebar
						attributes={attributes}
						setAttributes={setAttributes}
						iconPickerOpen={iconPickerOpen}
						setIconPickerOpen={setIconPickerOpen}
						clientId={clientId}
					/>
				</InspectorControls>
				{ButtonType === 'social' ? (
					<a
						href="#"
						className={[
							SocialIconStyle === 'style_1' &&
								[
									'btn',
									'btn-circle',
									'has-ripple',
									ButtonSize,
									SocialIconClass && `btn-${SocialIconClass}`,
									blockClass,
								]
									.filter(Boolean)
									.join(' '),
							SocialIconStyle !== 'style_1' && [blockClass, 'has-ripple'].filter(Boolean).join(' '),
						]
							.filter(Boolean)
							.join(' ') || undefined}
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							return false;
						}}
						data-value={DataValue || undefined}
						{...(hasBsToggle && {
							'data-bs-toggle': DataBsToggle,
						})}
						{...(hasBsTarget && {
							'data-bs-target': `#${DataBsTarget}`,
						})}
					>
						<i
							className={`uil uil-${
								SocialIconClass === 'facebook'
									? 'facebook-f'
									: SocialIconClass === 'vkmusic'
										? 'vk-music'
										: SocialIconClass
							}`}
							style={
								SocialIconStyle === 'style_2' || SocialIconStyle === 'style_3'
									? { fontSize: getSocialIconSizeRem(ButtonSize) }
									: undefined
							}
						></i>
					</a>
				) : (
					<a
						{...blockProps}
						style={{
							pointerEvents: 'auto',
							cursor: 'default',
						}}
						href="#"
						// Применяем сгенерированный класс
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							return false;
						}}
						data-value={DataValue || undefined}
						// DON'T add glightbox attributes in editor - they cause unwanted popups
						// {...(hasGlightbox && { 'data-glightbox': DataGlightbox })}
						// {...(hasGallery && { 'data-gallery': DataGallery })}
						{...(hasBsToggle && { 'data-bs-toggle': DataBsToggle })}
						{...(hasBsTarget && {
							'data-bs-target': `#${DataBsTarget}`,
						})}
					>
						{ButtonType === 'icon' &&
						(ButtonStyle === 'gradient' ||
							ButtonStyle === 'outline-gradient')
							? LeftIcon && <span>{getIconComponent(LeftIcon)}</span>
							: getIconComponent(LeftIcon)}
						{ButtonType === 'circle' &&
						(ButtonStyle === 'gradient' ||
							ButtonStyle === 'outline-gradient') ? (
							<span>{getIconComponent(CircleIcon)}</span>
						) : (
							getIconComponent(CircleIcon)
						)}
						{getIconComponent(SocialIcon)}

						{!shouldHideText && (
							<span ref={buttonContentRef}>
								<RichText
									tagName="span"
									value={ButtonContent}
									onChange={onChangeButtonContent}
									placeholder={__(
										'Enter button text...',
										'codeweber-gutenberg-blocks'
									)}
									className="button-content"
								/>
							</span>
						)}

						{ButtonType === 'icon' &&
						(ButtonStyle === 'gradient' ||
							ButtonStyle === 'outline-gradient')
							? RightIcon && <span>{getIconComponent(RightIcon)}</span>
							: getIconComponent(RightIcon)}
					</a>
				)}
			</div>
		</>
	);
};

export default ButtonEdit;
