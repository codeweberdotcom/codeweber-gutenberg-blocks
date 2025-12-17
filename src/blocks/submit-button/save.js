/**
 * Submit Button Block Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const {
		buttonText,
		buttonClass,
		blockClass,
		buttonPosition,
		buttonAlignItems,
		buttonJustifyContent,
		buttonTextAlign,
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

	// Если есть классы позиции, оборачиваем кнопку в div с этими классами
	const buttonElement = (
		<button
			type="submit"
			className={buttonClass || 'btn btn-primary'}
			data-loading-text="Sending..."
		>
			<i className="uil uil-send fs-13"></i>
			{buttonText || 'Send Message'}
		</button>
	);

	return (
		<div {...blockProps}>
			{positionWrapperClass ? (
				<div className={positionWrapperClass}>
					{buttonElement}
				</div>
			) : (
				buttonElement
			)}
		</div>
	);
}

