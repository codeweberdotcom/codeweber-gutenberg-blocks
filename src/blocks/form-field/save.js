/**
 * Form Field Block Save Component
 *
 * Saves form field HTML
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function Save({ attributes }) {
	const {
		fieldType,
		fieldName,
		fieldLabel,
		placeholder,
		isRequired,
		maxLength,
		minLength,
		width,
		fieldColumns,
		fieldColumnsXs,
		fieldColumnsSm,
		fieldColumnsMd,
		fieldColumnsLg,
		fieldColumnsXl,
		fieldColumnsXxl,
		validationType,
		accept,
		multiple,
		options,
		defaultValue,
		helpText,
		phoneMask,
		phoneMaskCaret,
		phoneMaskSoftCaret,
		buttonText,
		buttonClass,
		fieldClass,
		enableInlineButton,
		inlineButtonText,
		inlineButtonClass,
		maxFiles,
		maxFileSize,
		maxTotalFileSize,
	} = attributes;

	// For consents_block, return null to use server-side render.php
	if (fieldType === 'consents_block') {
		return null;
	}

	// For fields with inline button, return null to use server-side render.php
	const inlineButtonSupportedTypes = ['text', 'email', 'tel', 'url', 'number', 'date', 'time', 'author_role', 'company'];
	const inlineButtonEnabled = enableInlineButton && inlineButtonSupportedTypes.includes(fieldType);
	
	// #region agent log
	if (typeof window !== 'undefined') {
		fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				location: 'save.js:57',
				message: 'save.js inline button check',
				data: {
					enableInlineButton: enableInlineButton,
					fieldType: fieldType,
					inlineButtonEnabled: inlineButtonEnabled,
					isSupportedType: inlineButtonSupportedTypes.includes(fieldType)
				},
				timestamp: Date.now(),
				sessionId: 'debug-session',
				runId: 'run1',
				hypothesisId: 'G'
			})
		}).catch(() => {});
	}
	// #endregion
	
	if (inlineButtonEnabled) {
		// #region agent log
		if (typeof window !== 'undefined') {
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					location: 'save.js:59',
					message: 'save.js RETURNING NULL for inline button',
					data: { fieldType, fieldName },
					timestamp: Date.now(),
					sessionId: 'debug-session',
					runId: 'run1',
					hypothesisId: 'H'
				})
			}).catch(() => {});
		}
		// #endregion
		return null; // Use server-side render.php
	}

	if (!fieldName) {
		return null;
	}

	// Генерируем классы col-* из fieldColumns* атрибутов
	const getColClasses = () => {
		const colClasses = [];

		// Если есть fieldColumns* атрибуты, используем их
		if (fieldColumns || fieldColumnsXs || fieldColumnsSm || fieldColumnsMd || fieldColumnsLg || fieldColumnsXl || fieldColumnsXxl) {
			if (fieldColumns) colClasses.push(`col-${fieldColumns}`);
			if (fieldColumnsXs) colClasses.push(`col-${fieldColumnsXs}`);
			if (fieldColumnsSm) colClasses.push(`col-sm-${fieldColumnsSm}`);
			if (fieldColumnsMd) colClasses.push(`col-md-${fieldColumnsMd}`);
			if (fieldColumnsLg) colClasses.push(`col-lg-${fieldColumnsLg}`);
			if (fieldColumnsXl) colClasses.push(`col-xl-${fieldColumnsXl}`);
			if (fieldColumnsXxl) colClasses.push(`col-xxl-${fieldColumnsXxl}`);

			return colClasses.length > 0 ? colClasses.join(' ') : 'col-12';
		}

		// Fallback на старый атрибут width для обратной совместимости
		return width || 'col-12';
	};

	const blockProps = useBlockProps.save({
		className: `form-field-wrapper ${getColClasses()}`,
	});

	const fieldId = `field-${fieldName}`;
	const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';
	const labelContent = fieldLabel + requiredMark;

	// Рендерим поле в зависимости от типа
	const renderField = () => {
		const classNames = (...parts) => parts.filter(Boolean).join(' ').trim();
		const maskProps = {};

		if (fieldType === 'tel' && phoneMask) {
			maskProps['data-mask'] = phoneMask;
			let caretChar = (phoneMaskCaret || '').toString();
			caretChar = caretChar === '' ? '' : caretChar.slice(0, 1);
			if (caretChar) {
				maskProps['data-mask-caret'] = caretChar;
			}
			let softCaretChar = (phoneMaskSoftCaret || '').toString();
			softCaretChar = softCaretChar === '' ? '' : softCaretChar.slice(0, 1);
			if (softCaretChar) {
				maskProps['data-mask-soft-caret'] = softCaretChar;
			}
			// data-mask-blur не добавляем, так как по умолчанию должно быть false
		}

		switch (fieldType) {
			case 'textarea':
				return (
					<div className="form-floating">
						<textarea
							className={classNames('form-control', fieldClass)}
							id={fieldId}
							name={fieldName}
							placeholder={placeholder || fieldLabel}
							{...(isRequired && { required: true })}
							{...(maxLength > 0 && { maxLength })}
							style={{ height: '120px' }}
							defaultValue={defaultValue || ''}
							value={defaultValue || ''}
						/>
						<label htmlFor={fieldId}>
							<RawHTML>{labelContent}</RawHTML>
						</label>
					</div>
				);

			case 'select':
				return (
					<div className="form-select-wrapper mb-4">
						<select
							className={classNames('form-select', fieldClass)}
							id={fieldId}
							name={fieldName}
							aria-label={fieldLabel || placeholder || __('Select option', 'codeweber-gutenberg-blocks')}
							defaultValue={defaultValue || ''}
							{...(isRequired && { required: true })}
						>
							<option value="">{placeholder || fieldLabel || __('Select...', 'codeweber-gutenberg-blocks')}</option>
							{options && options.map((opt, idx) => (
								<option key={idx} value={opt.value || opt.label}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
				);

			case 'radio':
				return (
					<div>
						<label className="form-label">
							<RawHTML>{labelContent}</RawHTML>
						</label>
						{options && options.map((opt, idx) => (
							<div key={idx} className="form-check">
								<input
									className={classNames('form-check-input', fieldClass)}
									type="radio"
									id={`${fieldId}-${idx}`}
									name={fieldName}
									value={opt.value || opt.label}
									{...(isRequired && { required: true })}
								/>
								<label className="form-check-label" htmlFor={`${fieldId}-${idx}`}>
									{opt.label}
								</label>
							</div>
						))}
					</div>
				);

			case 'checkbox':
				if (options && options.length > 0) {
					return (
						<div>
							<label className="form-label" dangerouslySetInnerHTML={{
								__html: fieldLabel + requiredMark
							}} />
							{options.map((opt, idx) => (
								<div key={idx} className="form-check">
									<input
									className={classNames('form-check-input small-checkbox', fieldClass)}
										type="checkbox"
										id={`${fieldId}-${idx}`}
										name={`${fieldName}[]`}
										value={opt.value || opt.label}
									/>
									<label className="form-check-label" htmlFor={`${fieldId}-${idx}`}>
										{opt.label}
									</label>
								</div>
							))}
						</div>
					);
				}
				return (
					<div className="form-check">
						<input
							className={classNames('form-check-input small-checkbox', fieldClass)}
							type="checkbox"
							id={fieldId}
							name={fieldName}
							value="1"
							{...(isRequired && { required: true })}
						/>
						<label className="form-check-label" htmlFor={fieldId}>
							<RawHTML>{labelContent}</RawHTML>
						</label>
					</div>
				);

			case 'file':
				// Преобразуем accept в формат для HTML атрибута (браузер фильтрует файлы в диалоге)
				let acceptAttr = accept;
				if (accept) {
					// Разбиваем по запятой, если несколько типов
					const types = accept.split(',').map(t => t.trim()).filter(t => t);
					
					// Преобразуем каждый тип
					const formattedTypes = types.map(type => {
						// Если это уже MIME-тип (содержит "/"), оставляем как есть
						if (type.includes('/')) {
							return type;
						}
						// Если это расширение без точки, добавляем точку
						if (!type.startsWith('.')) {
							return '.' + type.toLowerCase();
						}
						// Если уже с точкой, просто приводим к нижнему регистру
						return type.toLowerCase();
					});
					
					acceptAttr = formattedTypes.join(',');
				}
				
				return (
					<div>
						<label htmlFor={fieldId} className="form-label">
							<RawHTML>{labelContent}</RawHTML>
						</label>
					<div className="input-group">
						{/* FilePond всегда используется для полей типа file - обычный дизайн */}
						<input
							type="file"
							className={classNames('filepond', fieldClass)}
							id={fieldId}
							name={multiple ? `${fieldName}[]` : fieldName}
							data-filepond="true"
							data-max-files={multiple && maxFiles ? maxFiles : (!multiple ? '1' : '')}
							data-max-file-size={maxFileSize ? maxFileSize : ''}
							data-max-total-file-size={maxTotalFileSize ? maxTotalFileSize : ''}
							{...(isRequired && { required: true })}
							{...(acceptAttr && { accept: acceptAttr })}
							{...(multiple && { multiple: true })}
						/>
					</div>
					</div>
				);

			case 'hidden':
				return (
					<input
						type="hidden"
						className={classNames(fieldClass)}
						id={fieldId}
						name={fieldName}
						value={defaultValue}
					/>
				);

			case 'rating':
				const currentRating = parseInt(defaultValue) || 0;
				return (
					<div>
						<label className="form-label d-block mb-2">
							<RawHTML>{labelContent}</RawHTML>
						</label>
						<input
							type="hidden"
							id={fieldId}
							name={fieldName}
							value={currentRating}
							{...(isRequired && { required: true })}
						/>
						<div className="rating-stars-wrapper d-flex gap-1 align-items-center p-0" data-rating-input={fieldId}>
							{[1, 2, 3, 4, 5].map((starValue) => (
								<span
									key={starValue}
									className={`rating-star-item ${starValue <= currentRating ? 'active' : ''}`}
									data-rating={starValue}
									style={{ cursor: 'pointer' }}
								>
									★
								</span>
							))}
						</div>
					</div>
				);

			default:
				return (
					<div className="form-floating">
						<input
							type={fieldType}
							className={classNames('form-control', fieldClass)}
							id={fieldId}
							name={fieldName}
							placeholder={placeholder || fieldLabel}
							value={defaultValue || ''}
							{...(isRequired && { required: true })}
							{...(maxLength > 0 && { maxLength })}
							{...(minLength > 0 && { minLength })}
							{...maskProps}
						/>
						<label htmlFor={fieldId}>
							<RawHTML>{labelContent}</RawHTML>
						</label>
					</div>
				);
		}
	};

	return (
		<div {...blockProps}>
			{renderField()}
			{helpText && (
				<div className="form-text text-muted small">
					{helpText}
				</div>
			)}
		</div>
	);
}

