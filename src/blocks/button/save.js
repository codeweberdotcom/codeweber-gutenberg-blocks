import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getClassNames } from '../button/buttonclass'; // Путь к функции getClassNames

// Функция для обработки иконки
const getIconComponent = (iconClass) => {
	if (!iconClass) return null;
	return <i className={iconClass}></i>;
};

const ButtonSave = ({ attributes }) => {
	const {
		anchor,
		LinkUrl,
		ButtonContent,
		ButtonType,
		ButtonSize,
		SocialIconClass,
		SocialIconStyle,
		DataValue,
		LeftIcon,
		CircleIcon,
		SocialIcon,
		RightIcon,
		DataGlightbox,
		DataGallery,
		DataBsToggle,
		DataBsTarget,
	} = attributes;

	// Генерация класса кнопки
	const buttonClass = getClassNames(attributes);

	// Определение, нужно ли скрывать текст
	const shouldHideText =
		ButtonType === 'play' ||
		ButtonType === 'social' ||
		ButtonType === 'circle';

	// Проверка на наличие значений в новых атрибутах
	const hasGlightbox = DataGlightbox && DataGlightbox.trim() !== '';
	const hasGallery = DataGallery && DataGallery.trim() !== '';
	const hasBsToggle = DataBsToggle && DataBsToggle.trim() !== '';
	const hasBsTarget = DataBsTarget && DataBsTarget.trim() !== '';

	return (
		<>
			{attributes.ButtonType === 'social' ? (
				<nav className={`nav social${attributes.SocialIconStyle === 'style_2' ? ' social-muted' : ''}`}>
					<a
						href={LinkUrl}
						className={
							attributes.SocialIconStyle === 'style_1'
								? `btn btn-circle ${attributes.ButtonSize} btn-${attributes.SocialIconClass}`
								: ''
						}
						data-value={DataValue || undefined}
						{...(hasGlightbox && { 'data-glightbox': DataGlightbox })}
						{...(hasGallery && { 'data-gallery': DataGallery })}
						{...(hasBsToggle && { 'data-bs-toggle': DataBsToggle })}
						{...(hasBsTarget && {
							'data-bs-target': `#${DataBsTarget}`,
						})}
					>
						<i className={`uil uil-${attributes.SocialIconClass}${attributes.SocialIconClass === 'facebook' ? '-f' : ''}`}></i>
					</a>
				</nav>
			) : (
				<a
					{...useBlockProps.save({ className: buttonClass, id: anchor })}
					href={LinkUrl}
					data-value={DataValue || undefined}
					{...(hasGlightbox && { 'data-glightbox': DataGlightbox })}
					{...(hasGallery && { 'data-gallery': DataGallery })}
					{...(hasBsToggle && { 'data-bs-toggle': DataBsToggle })}
					{...(hasBsTarget && {
						'data-bs-target': `#${DataBsTarget}`,
					})}
				>
					{getIconComponent(LeftIcon)}
					{getIconComponent(CircleIcon)}
					{getIconComponent(SocialIcon)}

					{!shouldHideText && (
						<RichText.Content
							tagName="span"
							value={ButtonContent}
							className="button-content"
						/>
					)}

					{getIconComponent(RightIcon)}
				</a>
			)}
		</>
	);
};

export default ButtonSave;


