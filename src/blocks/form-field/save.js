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
	} = attributes;

	// For consents_block and newsletter, return null to use server-side render.php
	if (fieldType === 'consents_block' || fieldType === 'newsletter') {
		return null;
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
		const inlineButtonSupportedTypes = ['text', 'email', 'tel', 'url', 'number', 'date', 'time', 'author_role', 'company'];
		const inlineButtonEnabled = enableInlineButton && inlineButtonSupportedTypes.includes(fieldType) && fieldType !== 'newsletter';

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

		if (inlineButtonEnabled) {
			const formRadiusClass = typeof window !== 'undefined' && window.getThemeFormRadius
				? window.getThemeFormRadius()
				: 'rounded';
			const buttonRadiusClass = typeof window !== 'undefined' && window.getThemeButton
				? window.getThemeButton()
				: '';
			const submitButtonText = inlineButtonText || __('Send', 'codeweber-gutenberg-blocks');
			const submitButtonClass = `${inlineButtonClass || 'btn btn-primary'} ${buttonRadiusClass}`.trim();

			return (
				<div className="input-group form-floating">
					<input
						type={fieldType}
						className={classNames('form-control', formRadiusClass, fieldClass)}
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
					<input
						type="submit"
						value={submitButtonText}
						className={submitButtonClass}
					/>
				</div>
			);
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
				return (
					<div>
						<label htmlFor={fieldId} className="form-label">
							<RawHTML>{labelContent}</RawHTML>
						</label>
					<div className="input-group">
						<input
							type="file"
							className={classNames('form-control file-input-hidden', fieldClass)}
							id={fieldId}
							name={multiple ? `${fieldName}[]` : fieldName}
							{...(isRequired && { required: true })}
							{...(accept && { accept })}
							{...(multiple && { multiple: true })}
						/>
						<input
							type="text"
							className={classNames('form-control file-input-display', fieldClass)}
							id={`${fieldId}-display`}
							readOnly
							placeholder={__('No file selected', 'codeweber-gutenberg-blocks')}
						/>
						<button
							type="button"
							className="btn btn-outline-secondary file-browse-button"
							data-file-input={fieldId}
						>
							{__('Browse', 'codeweber-gutenberg-blocks')}
						</button>
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

			case 'newsletter':
				// Получаем класс скругления из темы (если доступен через глобальную переменную)
				const formRadiusClass = typeof window !== 'undefined' && window.getThemeFormRadius
					? window.getThemeFormRadius()
					: 'rounded';

				// Получаем класс кнопки из темы (если доступен)
				const buttonRadiusClass = typeof window !== 'undefined' && window.getThemeButton
					? window.getThemeButton()
					: '';

				// Текст кнопки из атрибутов или по умолчанию
				const submitButtonText = buttonText || __('Join', 'codeweber-gutenberg-blocks');
				// Классы кнопки из атрибутов или по умолчанию, с добавлением класса скругления из темы
				const submitButtonClass = `${buttonClass || 'btn btn-primary'} ${buttonRadiusClass}`.trim();

				return (
					<div className="input-group form-floating">
						<input
							type="email"
							className={`form-control required email ${formRadiusClass}`}
							id={fieldId}
							name={fieldName}
							placeholder={placeholder || fieldLabel || __('Email Address', 'codeweber-gutenberg-blocks')}
							{...(isRequired && { required: true })}
							{...(maxLength > 0 && { maxLength })}
							{...(minLength > 0 && { minLength })}
							autoComplete="off"
							value={defaultValue || ''}
						/>
						<label htmlFor={fieldId}>
							<RawHTML>{labelContent}</RawHTML>
						</label>
						<input
							type="submit"
							value={submitButtonText}
							className={submitButtonClass}
						/>
					</div>
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

