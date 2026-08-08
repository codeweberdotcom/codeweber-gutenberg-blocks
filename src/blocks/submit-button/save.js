/**
 * Submit Button Block Save Component
 *
 * styleMode 'preset' — class composed by the Button block's getClassNames();
 * styleMode 'custom' — legacy free-text buttonClass.
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getClassNames } from '../button/buttonclass';

export default function Save({ attributes }) {
	const {
		buttonText,
		buttonClass,
		blockClass,
		buttonPosition,
		buttonAlignItems,
		buttonJustifyContent,
		buttonTextAlign,
		styleMode,
		ButtonType,
		ButtonShape,
		LeftIcon,
		RightIcon,
	} = attributes;

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

	const positionWrapperClass = positionClasses.filter(Boolean).join(' ');

	const blockProps = useBlockProps.save({
		className: `form-submit-wrapper mt-4 ${blockClass || ''}`,
	});

	const isCustom = styleMode === 'custom';
	// forSave: Theme shape всегда сериализуется как rounded-pill (стабильный контент);
	// на фронте data-button-shape="theme" переключается скриптом темы, как у блока Button.
	const buttonClassName = isCustom
		? buttonClass || 'btn btn-primary'
		: getClassNames({ ...attributes, blockClass: '' }, { forSave: true });

	const iconEl = (cls) => (cls ? <i className={cls}></i> : null);

	const themeShapeAttr =
		!isCustom &&
		ButtonShape === 'theme' &&
		(ButtonType === 'solid' || ButtonType === 'icon')
			? { 'data-button-shape': 'theme' }
			: {};

	// Если есть классы позиции, оборачиваем кнопку в div с этими классами
	const buttonElement = (
		<button
			type="submit"
			className={buttonClassName}
			data-loading-text={__('Sending...', 'codeweber-gutenberg-blocks')}
			{...themeShapeAttr}
		>
			{!isCustom && iconEl(LeftIcon)}
			<span>{buttonText || __('Send Message', 'codeweber-gutenberg-blocks')}</span>
			{!isCustom && iconEl(RightIcon)}
		</button>
	);

	return (
		<div {...blockProps}>
			{positionWrapperClass ? (
				<div className={positionWrapperClass}>{buttonElement}</div>
			) : (
				buttonElement
			)}
		</div>
	);
}
