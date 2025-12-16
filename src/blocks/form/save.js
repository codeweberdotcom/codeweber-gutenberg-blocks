/**
 * Form Block Save Component
 * 
 * Saves form HTML with innerBlocks
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const {
		formId,
		formName,
		submitButtonText,
		submitButtonClass,
	} = attributes;

	// Используем стабильный ID: если formId задан - используем его
	// Если не задан, используем стабильный идентификатор на основе formName
	// Это предотвращает генерацию случайного ID при каждом сохранении
	// В CPT формах formId должен быть всегда задан (ID поста)
	const formIdAttr = formId || (formName ? `form-${formName.toLowerCase().replace(/\s+/g, '-')}` : 'form-block');
	const blockProps = useBlockProps.save({
		className: 'codeweber-form-wrapper',
	});

	return (
		<div {...blockProps}>
			<form
				id={`form-${formIdAttr}`}
				className="codeweber-form"
				data-form-id={formIdAttr}
				method="post"
				encType="multipart/form-data"
			>
				<input type="hidden" name="form_id" value={formIdAttr} />
				<div className="form-messages" style={{ display: 'none' }}></div>
				<div className="row g-4">
					<InnerBlocks.Content />
				</div>
				<div className="form-submit-wrapper mt-4">
					<button
						type="submit"
						className={submitButtonClass || 'btn btn-primary'}
						data-loading-text="Sending..."
					>
						{submitButtonText || 'Send Message'}
					</button>
				</div>
			</form>
		</div>
	);
}

