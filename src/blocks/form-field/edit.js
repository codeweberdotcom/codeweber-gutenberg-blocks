import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { GridControl } from '../../components/grid-control';

const FormFieldEdit = ({ attributes, setAttributes }) => {
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

	const blockProps = useBlockProps({
		className: `form-field-preview ${width}`,
	});

	// Типы полей
	const fieldTypes = [
		{ label: __('Text', 'codeweber-blocks'), value: 'text' },
		{ label: __('Email', 'codeweber-blocks'), value: 'email' },
		{ label: __('Tel', 'codeweber-blocks'), value: 'tel' },
		{ label: __('URL', 'codeweber-blocks'), value: 'url' },
		{ label: __('Textarea', 'codeweber-blocks'), value: 'textarea' },
		{ label: __('Select', 'codeweber-blocks'), value: 'select' },
		{ label: __('Radio', 'codeweber-blocks'), value: 'radio' },
		{ label: __('Checkbox', 'codeweber-blocks'), value: 'checkbox' },
		{ label: __('File', 'codeweber-blocks'), value: 'file' },
		{ label: __('Date', 'codeweber-blocks'), value: 'date' },
		{ label: __('Time', 'codeweber-blocks'), value: 'time' },
		{ label: __('Number', 'codeweber-blocks'), value: 'number' },
		{ label: __('Hidden', 'codeweber-blocks'), value: 'hidden' },
		{ label: __('Consents block', 'codeweber-blocks'), value: 'consents_block' },
	];

	// Bootstrap grid классы
	const widthOptions = [
		{ label: __('Full Width (col-12)', 'codeweber-blocks'), value: 'col-12' },
		{ label: __('Half Width (col-md-6)', 'codeweber-blocks'), value: 'col-md-6' },
		{ label: __('Third Width (col-md-4)', 'codeweber-blocks'), value: 'col-md-4' },
		{ label: __('Quarter Width (col-md-3)', 'codeweber-blocks'), value: 'col-md-3' },
	];

	// Рендер предпросмотра поля
	const renderFieldPreview = () => {
		const fieldId = `field-${fieldName || 'preview'}`;
		
		switch (fieldType) {
			case 'textarea':
				return (
					<div className="form-floating">
						<textarea
							className="form-control"
							id={fieldId}
							placeholder={placeholder || fieldLabel}
							disabled
							style={{ height: '100px' }}
						/>
						<label htmlFor={fieldId}>
							{fieldLabel || __('Field Label', 'codeweber-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
					</div>
				);
			
			case 'select':
				return (
					<div className="form-floating">
						<select className="form-select" id={fieldId} disabled>
							<option>{placeholder || __('Select option...', 'codeweber-blocks')}</option>
							{options && options.length > 0 && options.map((opt, idx) => (
								<option key={idx} value={opt.value}>{opt.label}</option>
							))}
						</select>
						<label htmlFor={fieldId}>
							{fieldLabel || __('Field Label', 'codeweber-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
					</div>
				);
			
			case 'checkbox':
			case 'radio':
				return (
					<div>
						<label className="form-label">
							{fieldLabel || __('Field Label', 'codeweber-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
						{options && options.length > 0 ? (
							<div>
								{options.map((opt, idx) => (
									<div key={idx} className={`form-check ${fieldType === 'radio' ? '' : 'form-check-inline'}`}>
										<input
											className={`form-check-input ${fieldType === 'checkbox' ? 'small-checkbox' : ''}`}
											type={fieldType}
											name={fieldType === 'radio' ? fieldName : `${fieldName}[]`}
											id={`${fieldId}-${idx}`}
											disabled
										/>
										<label className="form-check-label" htmlFor={`${fieldId}-${idx}`}>
											{opt.label}
										</label>
									</div>
								))}
							</div>
						) : (
							<div className="form-check">
								<input
									className={`form-check-input ${fieldType === 'checkbox' ? 'small-checkbox' : ''}`}
									type={fieldType}
									id={fieldId}
									disabled
								/>
								<label className="form-check-label" htmlFor={fieldId}>
									{placeholder || __('Option', 'codeweber-blocks')}
								</label>
							</div>
						)}
					</div>
				);
			
			case 'file':
				return (
					<div className="form-floating">
						<input
							type="file"
							className="form-control"
							id={fieldId}
							accept={accept}
							multiple={multiple}
							disabled
						/>
						<label htmlFor={fieldId}>
							{fieldLabel || __('File Upload', 'codeweber-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
					</div>
				);
			
			case 'hidden':
				return (
					<div className="text-muted small">
						{__('Hidden Field', 'codeweber-blocks')}: {fieldName || 'field_name'}
					</div>
				);
			
			case 'consents_block':
				return (
					<div className="text-muted small p-3 border rounded bg-light">
						<strong>{__('Consents Block', 'codeweber-blocks')}</strong>
						<br />
						<small>{__('This field outputs consents configured below the form.', 'codeweber-blocks')}</small>
					</div>
				);
			
			default:
				return (
					<div className="form-floating">
						<input
							type={fieldType}
							className="form-control"
							id={fieldId}
							placeholder={placeholder || fieldLabel}
							defaultValue={defaultValue}
							disabled
						/>
						<label htmlFor={fieldId}>
							{fieldLabel || __('Field Label', 'codeweber-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
					</div>
				);
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Field Settings', 'codeweber-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Field Type', 'codeweber-blocks')}
						value={fieldType}
						options={fieldTypes}
						onChange={(value) => setAttributes({ fieldType: value })}
					/>
					<TextControl
						label={__('Field Name', 'codeweber-blocks')}
						value={fieldName}
						onChange={(value) => setAttributes({ fieldName: value })}
						help={__('Unique field identifier (e.g., name, email)', 'codeweber-blocks')}
						required
					/>
					<TextControl
						label={__('Field Label', 'codeweber-blocks')}
						value={fieldLabel}
						onChange={(value) => setAttributes({ fieldLabel: value })}
					/>
					{fieldType !== 'hidden' && fieldType !== 'checkbox' && fieldType !== 'radio' && (
						<TextControl
							label={__('Placeholder', 'codeweber-blocks')}
							value={placeholder}
							onChange={(value) => setAttributes({ placeholder: value })}
						/>
					)}
					<ToggleControl
						label={__('Required Field', 'codeweber-blocks')}
						checked={isRequired}
						onChange={(value) => setAttributes({ isRequired: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Validation', 'codeweber-blocks')} initialOpen={false}>
					<TextControl
						label={__('Min Length', 'codeweber-blocks')}
						type="number"
						value={minLength || ''}
						onChange={(value) => setAttributes({ minLength: parseInt(value) || 0 })}
					/>
					<TextControl
						label={__('Max Length', 'codeweber-blocks')}
						type="number"
						value={maxLength || ''}
						onChange={(value) => setAttributes({ maxLength: parseInt(value) || 0 })}
					/>
					<SelectControl
						label={__('Validation Type', 'codeweber-blocks')}
						value={validationType}
						options={[
							{ label: __('None', 'codeweber-blocks'), value: 'none' },
							{ label: __('Email', 'codeweber-blocks'), value: 'email' },
							{ label: __('URL', 'codeweber-blocks'), value: 'url' },
							{ label: __('Phone', 'codeweber-blocks'), value: 'tel' },
						]}
						onChange={(value) => setAttributes({ validationType: value })}
					/>
				</PanelBody>

				{(fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') && (
					<PanelBody title={__('Options', 'codeweber-blocks')} initialOpen={false}>
						<TextareaControl
							label={__('Options (one per line, format: label|value)', 'codeweber-blocks')}
							value={options ? options.map(opt => `${opt.label}|${opt.value}`).join('\n') : ''}
							onChange={(value) => {
								const opts = value.split('\n')
									.filter(line => line.trim())
									.map(line => {
										const parts = line.split('|');
										return {
											label: parts[0]?.trim() || parts[0] || '',
											value: parts[1]?.trim() || parts[0]?.trim() || '',
										};
									});
								setAttributes({ options: opts });
							}}
							help={__('Example: Option 1|value1', 'codeweber-blocks')}
						/>
					</PanelBody>
				)}

				{fieldType === 'file' && (
					<PanelBody title={__('File Settings', 'codeweber-blocks')} initialOpen={false}>
						<TextControl
							label={__('Accept', 'codeweber-blocks')}
							value={accept}
							onChange={(value) => setAttributes({ accept: value })}
							help={__('File types: .pdf,.doc,.docx or image/*', 'codeweber-blocks')}
						/>
						<ToggleControl
							label={__('Multiple Files', 'codeweber-blocks')}
							checked={multiple}
							onChange={(value) => setAttributes({ multiple: value })}
						/>
					</PanelBody>
				)}

				<PanelBody title={__('Layout', 'codeweber-blocks')} initialOpen={false}>
					<SelectControl
						label={__('Field Width', 'codeweber-blocks')}
						value={width}
						options={widthOptions}
						onChange={(value) => setAttributes({ width: value })}
					/>
					<GridControl
						attributes={attributes}
						setAttributes={setAttributes}
						attributePrefix="field"
						showRowCols={false}
						showGap={false}
						showSpacing={false}
					/>
				</PanelBody>

				<PanelBody title={__('Advanced', 'codeweber-blocks')} initialOpen={false}>
					<TextControl
						label={__('Default Value', 'codeweber-blocks')}
						value={defaultValue}
						onChange={(value) => setAttributes({ defaultValue: value })}
					/>
					<TextControl
						label={__('Help Text', 'codeweber-blocks')}
						value={helpText}
						onChange={(value) => setAttributes({ helpText: value })}
						help={__('Additional help text below the field', 'codeweber-blocks')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{renderFieldPreview()}
				{helpText && (
					<div className="form-text text-muted small">
						{helpText}
					</div>
				)}
			</div>
		</>
	);
};

export default FormFieldEdit;

