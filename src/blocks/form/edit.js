import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	SelectControl,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Icon, cog, inbox, comment, shield, justifySpaceBetween, positionCenter } from '@wordpress/icons';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { GridControl, getGapClasses } from '../../components/grid-control';
import { PositioningControl } from '../../components/layout/PositioningControl';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

const FormEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		formId,
		formType,
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
		formFields,
		blockClass,
		blockData,
		blockId,
		formGapType,
		formGap,
		formGapXs,
		formGapSm,
		formGapMd,
		formGapLg,
		formGapXl,
		formGapXxl,
		formAlignItems,
		formJustifyContent,
		formTextAlign,
		formPosition,
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

	// Для замены innerBlocks при применении шаблона
	const { replaceInnerBlocks } = useDispatch(blockEditorStore);

	// Функция для получения шаблона блоков
	const getTemplateBlocks = () => {
		if (formType === 'testimonial') {
			return [
				['codeweber-blocks/form-field', {
					fieldType: 'textarea',
					fieldName: 'testimonial_text',
					fieldLabel: __('Your Review', 'codeweber-gutenberg-blocks'),
					isRequired: true,
				}],
				['codeweber-blocks/form-field', {
					fieldType: 'rating',
					fieldName: 'rating',
					fieldLabel: __('Rating', 'codeweber-gutenberg-blocks'),
					isRequired: true,
				}],
				['codeweber-blocks/form-field', {
					fieldType: 'text',
					fieldName: 'name',
					fieldLabel: __('Your Name', 'codeweber-gutenberg-blocks'),
					isRequired: true,
					showForGuestsOnly: true,
				}],
				['codeweber-blocks/form-field', {
					fieldType: 'email',
					fieldName: 'author_email',
					fieldLabel: __('Your Email', 'codeweber-gutenberg-blocks'),
					isRequired: true,
					showForGuestsOnly: true,
				}],
				['codeweber-blocks/form-field', {
					fieldType: 'author_role',
					fieldName: 'role',
					fieldLabel: __('Your Position', 'codeweber-gutenberg-blocks'),
				}],
				['codeweber-blocks/form-field', {
					fieldType: 'text',
					fieldName: 'company',
					fieldLabel: __('Company', 'codeweber-gutenberg-blocks'),
				}],
				['codeweber-blocks/form-field', {
					fieldType: 'consents_block',
					width: 'col-12',
				}],
				['codeweber-blocks/submit-button', {
					buttonText: __('Submit Review', 'codeweber-gutenberg-blocks'),
					buttonClass: 'btn btn-primary',
				}],
			];
		}

		// Дефолтный шаблон для обычных форм
		return [
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
			['codeweber-blocks/form-field', {
				fieldType: 'consents_block',
				width: 'col-12',
			}],
			['codeweber-blocks/submit-button', {
				buttonText: __('Send Message', 'codeweber-gutenberg-blocks'),
				buttonClass: 'btn btn-primary',
			}],
		];
	};

	// Применяем шаблон при первом создании блока, если блоки пусты
	const hasAppliedTemplateRef = useRef(false);
	useEffect(() => {
		if (innerBlocks.length === 0 && !hasAppliedTemplateRef.current) {
			const template = getTemplateBlocks();
			replaceInnerBlocks(clientId, template);
			hasAppliedTemplateRef.current = true;
		}
	}, [innerBlocks.length, clientId, replaceInnerBlocks]);

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

	const tabs = [
		{ name: 'form', title: <TabIcon icon={cog} label={__('Form', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'email', title: <TabIcon icon={inbox} label={__('Email', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'messages', title: <TabIcon icon={comment} label={__('Messages', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'security', title: <TabIcon icon={shield} label={__('Security', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'align', title: <TabIcon icon={positionCenter} label={__('Position', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'gap', title: <TabIcon icon={justifySpaceBetween} label={__('Gap', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* FORM TAB */}
							{tab.name === 'form' && (
								<PanelBody title={__('Form Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
									<SelectControl
										label={__('Form Type', 'codeweber-gutenberg-blocks')}
										value={formType || 'form'}
										options={[
											{ label: __('Regular Form', 'codeweber-gutenberg-blocks'), value: 'form' },
											{ label: __('Newsletter Subscription', 'codeweber-gutenberg-blocks'), value: 'newsletter' },
											{ label: __('Testimonial Form', 'codeweber-gutenberg-blocks'), value: 'testimonial' },
											{ label: __('Resume Form', 'codeweber-gutenberg-blocks'), value: 'resume' },
											{ label: __('Callback Request', 'codeweber-gutenberg-blocks'), value: 'callback' },
										]}
										onChange={(value) => setAttributes({ formType: value })}
										help={__('Select the type of form. This determines how the form is processed.', 'codeweber-gutenberg-blocks')}
									/>
									<TextControl
										label={__('Form ID', 'codeweber-gutenberg-blocks')}
										value={formId || (postId ? String(postId) : '')}
										disabled={true}
										help={__('Form ID is assigned automatically from the CPT Form ID and cannot be changed here.', 'codeweber-gutenberg-blocks')}
									/>
								</PanelBody>
							)}

							{/* EMAIL TAB */}
							{tab.name === 'email' && (
								<PanelBody title={__('Email Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
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
							)}

							{/* MESSAGES TAB */}
							{tab.name === 'messages' && (
								<PanelBody title={__('Messages', 'codeweber-gutenberg-blocks')} initialOpen={true}>
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
							)}

							{/* SECURITY TAB */}
							{tab.name === 'security' && (
								<PanelBody title={__('Security', 'codeweber-gutenberg-blocks')} initialOpen={true}>
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
							)}

							{/* ALIGN TAB */}
							{tab.name === 'align' && (
								<div style={{ padding: '16px' }}>
									<PositioningControl
										title={__('Form Align', 'codeweber-gutenberg-blocks')}
										alignItems={formAlignItems}
										onAlignItemsChange={(value) => setAttributes({ formAlignItems: value })}
										justifyContent={formJustifyContent}
										onJustifyContentChange={(value) => setAttributes({ formJustifyContent: value })}
										textAlign={formTextAlign}
										onTextAlignChange={(value) => setAttributes({ formTextAlign: value })}
										position={formPosition}
										onPositionChange={(value) => setAttributes({ formPosition: value })}
										noPanel={true}
									/>
								</div>
							)}

							{/* GAP TAB */}
							{tab.name === 'gap' && (
								<div style={{ padding: '16px' }}>
									<GridControl
										attributes={attributes}
										setAttributes={setAttributes}
										attributePrefix="form"
										showRowCols={false}
										showGap={true}
										showSpacing={false}
									/>
								</div>
							)}

							{/* SETTINGS TAB */}
							{tab.name === 'settings' && (
								<PanelBody title={__('Advanced', 'codeweber-gutenberg-blocks')} initialOpen={true}>
									<BlockMetaFields
										attributes={attributes}
										setAttributes={setAttributes}
										fieldKeys={{
											classKey: 'blockClass',
											dataKey: 'blockData',
											idKey: 'blockId',
										}}
										labels={{
											classLabel: __('Block Class', 'codeweber-gutenberg-blocks'),
											dataLabel: __('Block Data', 'codeweber-gutenberg-blocks'),
											idLabel: __('Block ID', 'codeweber-gutenberg-blocks'),
										}}
									/>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			<div {...blockProps}>
				<div className="form-preview">
					<h4>{formType === 'testimonial' ? __('Testimonial Form', 'codeweber-gutenberg-blocks') : __('Contact Form', 'codeweber-gutenberg-blocks')}</h4>
					{(() => {
						const gapClasses = getGapClasses(attributes, 'form');
						const rowClasses = ['row', ...gapClasses].filter(Boolean);
						const rowClassName = rowClasses.length > 1 ? rowClasses.join(' ') : 'row g-4';

						// Добавляем классы выравнивания к элементу с row и gap (для редактора)
						const alignmentClasses = [];
						if (formAlignItems) {
							alignmentClasses.push(formAlignItems.trim());
						}
						if (formJustifyContent) {
							alignmentClasses.push('d-flex', formJustifyContent.trim());
						}
						if (formTextAlign) {
							alignmentClasses.push(formTextAlign.trim());
						}
						if (formPosition) {
							alignmentClasses.push(formPosition.trim());
						}

						const finalRowClassName = [rowClassName, ...alignmentClasses].filter(Boolean).join(' ');

					return (
						<div className={`form-fields-preview ${finalRowClassName}`}>
							<InnerBlocks
								allowedBlocks={['codeweber-blocks/form-field', 'codeweber-blocks/submit-button']}
								template={getTemplateBlocks()}
								templateLock={false}
							/>
						</div>
					);
					})()}
				</div>
			</div>
		</>
	);
};

export default FormEdit;

