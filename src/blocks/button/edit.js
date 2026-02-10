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

// Функция для обработки иконки

const ButtonEdit = ({ attributes, setAttributes }) => {
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
					/>
				</InspectorControls>
				{ButtonType === 'social' ? (
					<a
						href="#"
						className={
							SocialIconStyle === 'style_1'
								? `btn btn-circle ${ButtonSize} btn-${SocialIconClass}`
								: SocialIconStyle === 'style_2'
									? `btn btn-circle ${ButtonSize} btn-${SocialIconClass} social-muted`
									: `btn btn-circle ${ButtonSize} btn-${SocialIconClass}`
						}
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
							className={`uil uil-${SocialIconClass}${SocialIconClass === 'facebook' ? '-f' : ''}`}
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
						{getIconComponent(LeftIcon)}
						{getIconComponent(CircleIcon)}
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

						{getIconComponent(RightIcon)}
					</a>
				)}
			</div>
		</>
	);
};

export default ButtonEdit;
