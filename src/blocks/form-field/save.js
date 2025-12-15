/**
 * Form Field Block Save Component
 * 
 * Saves form field HTML
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

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
		validationType,
		accept,
		multiple,
		options,
		defaultValue,
		helpText,
	} = attributes;

	if (!fieldName) {
		return null;
	}

	const blockProps = useBlockProps.save({
		className: `form-field-wrapper ${width || 'col-12'}`,
	});

	const fieldId = `field-${fieldName}`;
	const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';
	const labelContent = fieldLabel + requiredMark;

	// Рендерим поле в зависимости от типа
	const renderField = () => {
		switch (fieldType) {
			case 'textarea':
				return (
					<div className="form-floating">
						<textarea
							className="form-control"
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
					<div className="form-floating">
						<select
							className="form-select"
							id={fieldId}
							name={fieldName}
							{...(isRequired && { required: true })}
						>
							<option value="">{placeholder || 'Select...'}</option>
							{options && options.map((opt, idx) => (
								<option key={idx} value={opt.value || opt.label}>
									{opt.label}
								</option>
							))}
						</select>
						<label htmlFor={fieldId}>
							<RawHTML>{labelContent}</RawHTML>
						</label>
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
									className="form-check-input"
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
										className="form-check-input small-checkbox"
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
							className="form-check-input small-checkbox"
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
					<div className="form-floating">
						<input
							type="file"
							className="form-control"
							id={fieldId}
							name={multiple ? `${fieldName}[]` : fieldName}
							{...(isRequired && { required: true })}
							{...(accept && { accept })}
							{...(multiple && { multiple: true })}
						/>
						<label htmlFor={fieldId}>
							<RawHTML>{labelContent}</RawHTML>
						</label>
					</div>
				);

			case 'hidden':
				return (
					<input
						type="hidden"
						id={fieldId}
						name={fieldName}
						value={defaultValue}
					/>
				);

			default:
				return (
					<div className="form-floating">
						<input
							type={fieldType}
							className="form-control"
							id={fieldId}
							name={fieldName}
							placeholder={placeholder || fieldLabel}
							value={defaultValue || ''}
							{...(isRequired && { required: true })}
							{...(maxLength > 0 && { maxLength })}
							{...(minLength > 0 && { minLength })}
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

