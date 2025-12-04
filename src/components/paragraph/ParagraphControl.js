/**
 * ParagraphControl - Inspector Control для настроек параграфа
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { ComboboxControl, SelectControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import { ColorTypeControl } from '../colors/ColorTypeControl';
import { colors } from '../../utilities/colors';
import {
	createSizeOptions,
	createWeightOptions,
	createTransformOptions,
} from '../../blocks/heading-subtitle/utils';

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
 * ParagraphControl Component
 *
 * @param {Object} props
 * @param {Object} props.attributes - Атрибуты блока
 * @param {Function} props.setAttributes - Функция обновления атрибутов
 * @param {string} props.prefix - Префикс атрибутов (например, 'text')
 * @param {string} props.label - Заголовок
 */
export const ParagraphControl = ({
	attributes,
	setAttributes,
	prefix = '',
	label = __('Paragraph', 'codeweber-gutenberg-blocks'),
}) => {
	const text = getAttr(attributes, prefix, 'text') || '';
	const textColor = getAttr(attributes, prefix, 'textColor') || '';
	const textColorType = getAttr(attributes, prefix, 'textColorType') || 'solid';
	const textSize = getAttr(attributes, prefix, 'textSize') || '';
	const textWeight = getAttr(attributes, prefix, 'textWeight') || '';
	const textTransform = getAttr(attributes, prefix, 'textTransform') || '';

	return (
		<div style={{ padding: '16px' }}>
			{/* Поле ввода текста */}
			<div className="mb-3">
				<label>{label}</label>
				<div style={{
					border: '1px solid #ccc',
					borderRadius: '4px',
					padding: '8px',
					minHeight: '80px',
					backgroundColor: '#fff'
				}}>
					<RichText
						tagName="div"
						value={text}
						onChange={(value) => setAttr(setAttributes, prefix, 'text', value)}
						placeholder={__('Enter paragraph...', 'codeweber-gutenberg-blocks')}
						allowedFormats={[]}
						__unstableAllowHtml={true}
					/>
				</div>
			</div>

			{/* Типографика */}
			<ColorTypeControl
				label={__('Color Type', 'codeweber-gutenberg-blocks')}
				value={textColorType}
				onChange={(value) => setAttr(setAttributes, prefix, 'textColorType', value)}
				options={[
					{ value: 'solid', label: __('Solid', 'codeweber-gutenberg-blocks') },
					{ value: 'soft', label: __('Soft', 'codeweber-gutenberg-blocks') },
					{ value: 'pale', label: __('Pale', 'codeweber-gutenberg-blocks') },
				]}
			/>
			<ComboboxControl
				label={__('Color', 'codeweber-gutenberg-blocks')}
				value={textColor}
				options={colors}
				onChange={(value) => setAttr(setAttributes, prefix, 'textColor', value)}
			/>
			<SelectControl
				label={__('Size', 'codeweber-gutenberg-blocks')}
				value={textSize}
				options={createSizeOptions()}
				onChange={(value) => setAttr(setAttributes, prefix, 'textSize', value)}
			/>
			<SelectControl
				label={__('Weight', 'codeweber-gutenberg-blocks')}
				value={textWeight}
				options={createWeightOptions()}
				onChange={(value) => setAttr(setAttributes, prefix, 'textWeight', value)}
			/>
			<SelectControl
				label={__('Transform', 'codeweber-gutenberg-blocks')}
				value={textTransform}
				options={createTransformOptions()}
				onChange={(value) => setAttr(setAttributes, prefix, 'textTransform', value)}
			/>
		</div>
	);
};

export default ParagraphControl;

