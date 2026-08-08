/**
 * Submit Button Block
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import './style.scss';
import './editor.scss';

import Edit from './edit';
import Save from './save';
import metadata from './block.json';

// v2 — до появления preset-стилей (getClassNames из блока Button): класс кнопки
// целиком хранился в buttonClass. Мигрируем: кастомная строка → styleMode 'custom'
// (внешний вид сохраняется), дефолтная 'btn btn-primary' → 'preset'.
// v1 — data-loading-text и текст кнопки по умолчанию были захардкожены на английском
const deprecated = [
	{
		migrate(attributes) {
			const cls = (attributes.buttonClass || '').trim();
			return {
				...attributes,
				styleMode:
					cls && cls !== 'btn btn-primary' ? 'custom' : 'preset',
			};
		},
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
					data-loading-text={__('Sending...', 'codeweber-gutenberg-blocks')}
				>
					<span>
						{buttonText ||
							__('Send Message', 'codeweber-gutenberg-blocks')}
					</span>
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
	{
		migrate(attributes) {
			const cls = (attributes.buttonClass || '').trim();
			return {
				...attributes,
				styleMode:
					cls && cls !== 'btn btn-primary' ? 'custom' : 'preset',
			};
		},
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
