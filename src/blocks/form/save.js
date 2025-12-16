/**
 * Form Block Save Component
 *
 * Saves form HTML with innerBlocks
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getGapClasses } from '../../components/grid-control';

export default function Save({ attributes }) {
	const {
		formId,
		formName,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	// Используем стабильный ID: если formId задан - используем его
	// Если не задан, используем стабильный идентификатор на основе formName
	// Это предотвращает генерацию случайного ID при каждом сохранении
	// В CPT формах formId должен быть всегда задан (ID поста)
	const formIdAttr = formId || (formName ? `form-${formName.toLowerCase().replace(/\s+/g, '-')}` : 'form-block');
	const blockProps = useBlockProps.save({
		className: 'codeweber-form-wrapper',
	});

	// Формируем классы для формы
	const formClasses = ['codeweber-form'];
	if (blockClass) {
		formClasses.push(blockClass);
	}

	// Формируем ID для формы (приоритет: blockId > formIdAttr)
	const formElementId = blockId || `form-${formIdAttr}`;

	// Формируем data-атрибуты из blockData
	const getDataAttrs = () => {
		if (!blockData) {
			return {};
		}
		try {
			const parsedData = JSON.parse(blockData);
			const dataAttrs = {};
			Object.keys(parsedData).forEach(key => {
				// В React/JSX data-атрибуты должны быть в camelCase или через строки
				dataAttrs[`data-${key}`] = parsedData[key];
			});
			return dataAttrs;
		} catch (e) {
			// Если не JSON, используем как есть
			return { 'data-custom': blockData };
		}
	};

	const dataAttrs = getDataAttrs();

	// Получаем классы Gap
	const gapClasses = getGapClasses(attributes, 'form');
	const rowClasses = ['row', ...gapClasses].filter(Boolean);
	// Если нет gap классов, используем дефолтный g-4
	let rowClassName = rowClasses.length > 1 ? rowClasses.join(' ') : 'row g-4';

	// Добавляем классы выравнивания к элементу с row (для фронтенда)
	const alignmentClasses = [];
	if (attributes.formAlignItems) {
		alignmentClasses.push(attributes.formAlignItems.trim());
	}
	if (attributes.formJustifyContent) {
		alignmentClasses.push('d-flex', attributes.formJustifyContent.trim());
	}
	if (attributes.formTextAlign) {
		alignmentClasses.push(attributes.formTextAlign.trim());
	}
	if (attributes.formPosition) {
		alignmentClasses.push(attributes.formPosition.trim());
	}

	rowClassName = [rowClassName, ...alignmentClasses].filter(Boolean).join(' ');

	return (
		<div {...blockProps}>
			<form
				id={formElementId}
				className={formClasses.join(' ')}
				data-form-id={formIdAttr}
				{...dataAttrs}
				method="post"
				encType="multipart/form-data"
			>
				<input type="hidden" name="form_id" value={formIdAttr} />
				<div className="form-messages" style={{ display: 'none' }}></div>
				<div className={rowClassName}>
					<InnerBlocks.Content />
				</div>
			</form>
		</div>
	);
}

