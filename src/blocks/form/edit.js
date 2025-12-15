import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

const FormEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		formId,
		formName,
		recipientEmail,
		senderEmail,
		senderName,
		subject,
		successMessage,
		errorMessage,
		enableCaptcha,
		captchaType,
		enableRateLimit,
		rateLimitCount,
		rateLimitPeriod,
		submitButtonText,
		submitButtonClass,
		formFields,
	} = attributes;
	
	// Получаем innerBlocks для сохранения в атрибуты
	const innerBlocks = useSelect((select) => {
		return select('core/block-editor').getBlocks(clientId);
	}, [clientId]);
	
	// Сохраняем структуру полей в атрибуты при изменении innerBlocks
	useEffect(() => {
		if (!innerBlocks || innerBlocks.length === 0) {
			if (formFields && formFields.length > 0) {
				// Не очищаем, если поля уже есть (при первой загрузке)
				return;
			}
		}
		
		// Извлекаем атрибуты из innerBlocks
		const fields = innerBlocks
			.filter(block => block.name === 'codeweber-blocks/form-field')
			.map(block => block.attributes || {});
		
		// Обновляем только если изменилось
		if (JSON.stringify(fields) !== JSON.stringify(formFields || [])) {
			setAttributes({ formFields: fields });
		}
	}, [innerBlocks, clientId, setAttributes]);

	const blockProps = useBlockProps({
		className: 'codeweber-form-block',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Form Settings', 'codeweber-blocks')} initialOpen={true}>
					<TextControl
						label={__('Form Name', 'codeweber-blocks')}
						value={formName}
						onChange={(value) => setAttributes({ formName: value })}
					/>
					<TextControl
						label={__('Form ID', 'codeweber-blocks')}
						value={formId}
						onChange={(value) => setAttributes({ formId: value })}
						help={__('Leave empty to auto-generate', 'codeweber-blocks')}
					/>
				</PanelBody>

				<PanelBody title={__('Email Settings', 'codeweber-blocks')} initialOpen={false}>
					<TextControl
						label={__('Recipient Email', 'codeweber-blocks')}
						type="email"
						value={recipientEmail}
						onChange={(value) => setAttributes({ recipientEmail: value })}
						help={__('Email address to receive form submissions', 'codeweber-blocks')}
					/>
					<TextControl
						label={__('Sender Email', 'codeweber-blocks')}
						type="email"
						value={senderEmail}
						onChange={(value) => setAttributes({ senderEmail: value })}
					/>
					<TextControl
						label={__('Sender Name', 'codeweber-blocks')}
						value={senderName}
						onChange={(value) => setAttributes({ senderName: value })}
					/>
					<TextControl
						label={__('Email Subject', 'codeweber-blocks')}
						value={subject}
						onChange={(value) => setAttributes({ subject: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Messages', 'codeweber-blocks')} initialOpen={false}>
					<TextareaControl
						label={__('Success Message', 'codeweber-blocks')}
						value={successMessage}
						onChange={(value) => setAttributes({ successMessage: value })}
					/>
					<TextareaControl
						label={__('Error Message', 'codeweber-blocks')}
						value={errorMessage}
						onChange={(value) => setAttributes({ errorMessage: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Security', 'codeweber-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Captcha', 'codeweber-blocks')}
						checked={enableCaptcha}
						onChange={(value) => setAttributes({ enableCaptcha: value })}
					/>
					{enableCaptcha && (
						<SelectControl
							label={__('Captcha Type', 'codeweber-blocks')}
							value={captchaType}
							options={[
								{ label: __('Honeypot', 'codeweber-blocks'), value: 'honeypot' },
							]}
							onChange={(value) => setAttributes({ captchaType: value })}
						/>
					)}
					<ToggleControl
						label={__('Enable Rate Limiting', 'codeweber-blocks')}
						checked={enableRateLimit}
						onChange={(value) => setAttributes({ enableRateLimit: value })}
					/>
					{enableRateLimit && (
						<>
							<TextControl
								label={__('Max Submissions', 'codeweber-blocks')}
								type="number"
								value={rateLimitCount}
								onChange={(value) => setAttributes({ rateLimitCount: parseInt(value) || 5 })}
							/>
							<TextControl
								label={__('Time Period (seconds)', 'codeweber-blocks')}
								type="number"
								value={rateLimitPeriod}
								onChange={(value) => setAttributes({ rateLimitPeriod: parseInt(value) || 60 })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Submit Button', 'codeweber-blocks')} initialOpen={false}>
					<TextControl
						label={__('Button Text', 'codeweber-blocks')}
						value={submitButtonText}
						onChange={(value) => setAttributes({ submitButtonText: value })}
					/>
					<TextControl
						label={__('Button Classes', 'codeweber-blocks')}
						value={submitButtonClass}
						onChange={(value) => setAttributes({ submitButtonClass: value })}
						help={__('Bootstrap classes: btn btn-primary', 'codeweber-blocks')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="form-preview">
					<h4>{formName || __('Contact Form', 'codeweber-blocks')}</h4>
					<div className="form-fields-preview">
						<InnerBlocks
							allowedBlocks={['codeweber-blocks/form-field']}
							template={[
								['codeweber-blocks/form-field', {
									fieldType: 'text',
									fieldName: 'name',
									fieldLabel: __('Name', 'codeweber-blocks'),
									isRequired: true,
								}],
								['codeweber-blocks/form-field', {
									fieldType: 'email',
									fieldName: 'email',
									fieldLabel: __('Email', 'codeweber-blocks'),
									isRequired: true,
								}],
								['codeweber-blocks/form-field', {
									fieldType: 'textarea',
									fieldName: 'message',
									fieldLabel: __('Message', 'codeweber-blocks'),
									isRequired: true,
								}],
							]}
						/>
					</div>
					<div className="form-submit-preview">
						<button type="button" className={submitButtonClass} disabled>
							{submitButtonText}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default FormEdit;

