/**
 * Submit Button Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import './style.scss';
import './editor.scss';

import Edit from './edit';
import Save from './save';
import metadata from './block.json';

// v1 — data-loading-text и текст кнопки по умолчанию были захардкожены на английском
const deprecated = [
	{
		save({ attributes }) {
			const {
				buttonText,
				buttonClass,
				blockClass,
				buttonPosition,
				buttonAlignItems,
				buttonJustifyContent,
				buttonTextAlign,
			} = attributes;

			const positionClasses = [];
			if (buttonPosition) positionClasses.push(buttonPosition.trim());
			if (buttonAlignItems) positionClasses.push(buttonAlignItems.trim());
			if (buttonJustifyContent)
				positionClasses.push('d-flex', buttonJustifyContent.trim());
			if (buttonTextAlign) positionClasses.push(buttonTextAlign.trim());

			const positionWrapperClass = positionClasses.filter(Boolean).join(' ');

			const blockProps = useBlockProps.save({
				className: `form-submit-wrapper mt-4 ${blockClass || ''}`,
			});

			const buttonElement = (
				<button
					type="submit"
					className={buttonClass || 'btn btn-primary'}
					data-loading-text="Sending..."
				>
					<span>{buttonText || 'Send Message'}</span>
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
		},
	},
];

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: Save,
	deprecated,
});

// Ограничение видимости блока выполняется через PHP фильтры
// в codeweber-forms-gutenberg-restrictions.php
// JavaScript фильтры здесь не нужны, так как они могут конфликтовать с PHP фильтрами
