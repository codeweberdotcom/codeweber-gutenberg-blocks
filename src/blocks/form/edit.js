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

	// Получаем информацию о текущем посте (для синхронизации ID формы с CPT "Форма")
	const { postId, postType } = useSelect((select) => {
		const editor = select('core/editor');
		return {
			postId: editor?.getCurrentPostId ? editor.getCurrentPostId() : null,
			postType: editor?.getCurrentPostType ? editor.getCurrentPostType() : null,
		};
	}, []);

	// Если мы внутри CPT codeweber_form — автоматически проставляем formId = ID записи CPT
	useEffect(() => {
		if (postType === 'codeweber_form' && postId) {
			const postIdStr = String(postId);
			if (formId !== postIdStr) {
				setAttributes({ formId: postIdStr });
			}
		}
	}, [postId, postType, formId, setAttributes]);

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
				<PanelBody title={__('Form Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<TextControl
						label={__('Form Name', 'codeweber-gutenberg-blocks')}
						value={formName}
						onChange={(value) => setAttributes({ formName: value })}
					/>
					<TextControl
						label={__('Form ID', 'codeweber-gutenberg-blocks')}
						value={formId || (postId ? String(postId) : '')}
						disabled={true}
						help={__('Form ID is assigned automatically from the CPT Form ID and cannot be changed here.', 'codeweber-gutenberg-blocks')}
					/>
				</PanelBody>

				<PanelBody title={__('Email Settings', 'codeweber-gutenberg-blocks')} initialOpen={false}>
					<TextControl
						label={__('Recipient Email', 'codeweber-gutenberg-blocks')}
						type="email"
						value={recipientEmail}
						onChange={(value) => setAttributes({ recipientEmail: value })}
						help={__('Email address to receive form submissions', 'codeweber-gutenberg-blocks')}
					/>
					<TextControl
						label={__('Sender Email', 'codeweber-gutenberg-blocks')}
						type="email"
						value={senderEmail}
						onChange={(value) => setAttributes({ senderEmail: value })}
					/>
					<TextControl
						label={__('Sender Name', 'codeweber-gutenberg-blocks')}
						value={senderName}
						onChange={(value) => setAttributes({ senderName: value })}
					/>
					<TextControl
						label={__('Email Subject', 'codeweber-gutenberg-blocks')}
						value={subject}
						onChange={(value) => setAttributes({ subject: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Messages', 'codeweber-gutenberg-blocks')} initialOpen={false}>
					<TextareaControl
						label={__('Success Message', 'codeweber-gutenberg-blocks')}
						value={successMessage}
						onChange={(value) => setAttributes({ successMessage: value })}
					/>
					<TextareaControl
						label={__('Error Message', 'codeweber-gutenberg-blocks')}
						value={errorMessage}
						onChange={(value) => setAttributes({ errorMessage: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Security', 'codeweber-gutenberg-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Captcha', 'codeweber-gutenberg-blocks')}
						checked={enableCaptcha}
						onChange={(value) => setAttributes({ enableCaptcha: value })}
					/>
					{enableCaptcha && (
						<SelectControl
							label={__('Captcha Type', 'codeweber-gutenberg-blocks')}
							value={captchaType}
							options={[
								{ label: __('Honeypot', 'codeweber-gutenberg-blocks'), value: 'honeypot' },
							]}
							onChange={(value) => setAttributes({ captchaType: value })}
						/>
					)}
					<ToggleControl
						label={__('Enable Rate Limiting', 'codeweber-gutenberg-blocks')}
						checked={enableRateLimit}
						onChange={(value) => setAttributes({ enableRateLimit: value })}
					/>
					{enableRateLimit && (
						<>
							<TextControl
								label={__('Max Submissions', 'codeweber-gutenberg-blocks')}
								type="number"
								value={rateLimitCount}
								onChange={(value) => setAttributes({ rateLimitCount: parseInt(value) || 5 })}
							/>
							<TextControl
								label={__('Time Period (seconds)', 'codeweber-gutenberg-blocks')}
								type="number"
								value={rateLimitPeriod}
								onChange={(value) => setAttributes({ rateLimitPeriod: parseInt(value) || 60 })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Submit Button', 'codeweber-gutenberg-blocks')} initialOpen={false}>
					<TextControl
						label={__('Button Text', 'codeweber-gutenberg-blocks')}
						value={submitButtonText}
						onChange={(value) => setAttributes({ submitButtonText: value })}
					/>
					<TextControl
						label={__('Button Classes', 'codeweber-gutenberg-blocks')}
						value={submitButtonClass}
						onChange={(value) => setAttributes({ submitButtonClass: value })}
						help={__('Bootstrap classes: btn btn-primary', 'codeweber-gutenberg-blocks')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="form-preview">
					<h4>{formName || __('Contact Form', 'codeweber-gutenberg-blocks')}</h4>
					<div className="form-fields-preview">
						<InnerBlocks
							allowedBlocks={['codeweber-blocks/form-field']}
							template={[
								['codeweber-blocks/form-field', {
									fieldType: 'text',
									fieldName: 'name',
									fieldLabel: __('Name', 'codeweber-gutenberg-blocks'),
									isRequired: true,
								}],
								['codeweber-blocks/form-field', {
									fieldType: 'email',
									fieldName: 'email',
									fieldLabel: __('Email', 'codeweber-gutenberg-blocks'),
									isRequired: true,
								}],
								['codeweber-blocks/form-field', {
									fieldType: 'textarea',
									fieldName: 'message',
									fieldLabel: __('Message', 'codeweber-gutenberg-blocks'),
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

