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
	Button,
	TabPanel,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Icon, cog, grid } from '@wordpress/icons';
import { GridControl } from '../../components/grid-control';
import { ResponsiveControl, createBreakpointsConfig } from '../../components/responsive-control';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import apiFetch from '@wordpress/api-fetch';

const FormFieldEdit = ({ attributes, setAttributes }) => {
	const {
		fieldType,
		fieldName,
		fieldLabel,
		placeholder,
		fieldClass,
		isRequired,
		showForGuestsOnly,
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
		consents = [],
		buttonText,
		buttonClass,
	} = attributes;

	const [legalDocuments, setLegalDocuments] = useState([]);
	const [loadingDocuments, setLoadingDocuments] = useState(false);
	const [loadingLabels, setLoadingLabels] = useState({}); // Track loading state for each consent label

	// Генерируем классы col-* из fieldColumns* атрибутов (как в save.js)
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

	const blockProps = useBlockProps({
		className: `form-field-preview ${getColClasses()}`,
	});

	// Load legal documents when consents_block is selected
	useEffect(() => {
		if (fieldType === 'consents_block' && legalDocuments.length === 0 && !loadingDocuments) {
			setLoadingDocuments(true);
			apiFetch({ path: '/wp/v2/legal?per_page=100&orderby=title&order=asc' })
				.then((docs) => {
					setLegalDocuments(docs || []);
					setLoadingDocuments(false);
				})
				.catch((error) => {
					console.error('Error loading legal documents:', error);
					setLoadingDocuments(false);
				});
		}
	}, [fieldType, legalDocuments.length, loadingDocuments]);

	// Track document_id changes and load default labels automatically
	useEffect(() => {
		if (fieldType === 'consents_block' && consents && consents.length > 0) {
			consents.forEach((consent, index) => {
				// If document_id is set but label is empty or missing, load default label
				// Only load if not already loading and document_id exists
				// Skip if label already exists (to avoid overwriting user edits)
				if (consent.document_id && (!consent.label || consent.label.trim() === '') && !loadingLabels[index]) {
					// getDefaultLabel already manages loadingLabels state internally
					getDefaultLabel(consent.document_id, index);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fieldType, consents?.map(c => `${c.document_id || ''}`).join('|')]); // Only trigger when document_id changes, not label

	// Add consent
	const addConsent = () => {
		const newConsents = [...(consents || []), {
			label: '',
			document_id: 0,
			required: false,
		}];
		setAttributes({ consents: newConsents });
	};

	// Remove consent
	const removeConsent = (index) => {
		const newConsents = [...(consents || [])];
		newConsents.splice(index, 1);
		setAttributes({ consents: newConsents });
	};

	// Update consent
	const updateConsent = (index, field, value) => {
		const newConsents = [...(consents || [])];
		newConsents[index] = {
			...newConsents[index],
			[field]: value,
		};
		setAttributes({ consents: newConsents });
	};

	// Get default label for document
	const getDefaultLabel = async (documentId, consentIndex) => {
		if (!documentId) return;

		// Check current label before async operation
		const currentConsents = consents || [];
		const currentLabel = currentConsents[consentIndex]?.label || '';

		if (currentLabel.trim()) {
			if (!window.confirm(__('Replace existing label text with default text for this document?', 'codeweber-gutenberg-blocks'))) {
				return; // Don't update if user cancels
			}
		}

		// Set loading state for this consent
		setLoadingLabels((prev) => ({ ...prev, [consentIndex]: true }));

		try {
			// Get document info
			const docResponse = await apiFetch({
				path: '/wp/v2/legal/' + documentId,
			});

			// Try to get default label via AJAX
			const formData = new FormData();
			formData.append('action', 'codeweber_forms_get_default_label');
			formData.append('document_id', documentId);

			// Get nonce - use REST API nonce for AJAX
			let nonce = '';
			if (window.wpApiSettings?.nonce) {
				nonce = window.wpApiSettings.nonce;
			} else {
				// Try to get nonce from wp.data if available
				const wpData = window.wp?.data;
				if (wpData) {
					const coreData = wpData.select('core');
					if (coreData) {
						nonce = coreData.getNonce() || '';
					}
				}
			}
			formData.append('nonce', nonce);

			// Get AJAX URL (available in WordPress admin/Gutenberg editor)
			const ajaxUrl = window.ajaxurl || (window.wpApiSettings?.root ? window.wpApiSettings.root.replace('/wp-json/', '/wp-admin/admin-ajax.php') : '/wp-admin/admin-ajax.php');

			console.log('Getting default label for document:', documentId, 'nonce:', nonce ? 'present' : 'missing');

			const ajaxResponse = await fetch(ajaxUrl, {
				method: 'POST',
				body: formData,
			}).then((res) => {
				console.log('AJAX response status:', res.status);
				return res.json();
			}).catch((error) => {
				console.error('AJAX fetch error:', error);
				return null;
			});

			console.log('AJAX response:', ajaxResponse);

			// Use setAttributes with a function to get the most current state
			// This ensures we're working with the latest consents, including any document_id changes
			setAttributes((currentAttributes) => {
				const currentConsents = currentAttributes.consents || [];

				// Check if consent at this index exists
				if (currentConsents[consentIndex]) {
					const currentConsent = currentConsents[consentIndex];
					const updatedConsents = [...currentConsents];

					// Preserve all existing fields, only update the label
					// This is crucial: we must preserve document_id and all other fields
					const updatedConsent = {
						...currentConsent, // Preserve document_id, required, and all other fields
					};

					if (ajaxResponse?.success && ajaxResponse?.data?.label) {
						console.log('Updating label with:', ajaxResponse.data.label);
						updatedConsent.label = ajaxResponse.data.label;
					} else {
						console.log('AJAX failed, using fallback label');
						// Fallback: simple default label
						const docTitle = docResponse?.title?.rendered || docResponse?.title || '';
						const docLink = docResponse?.link || '#';
						const defaultLabel = __('I agree to the {document_title_url}', 'codeweber-gutenberg-blocks')
							.replace('{document_title_url}', `<a href="${docLink}">${docTitle}</a>`);
						updatedConsent.label = defaultLabel;
					}

					updatedConsents[consentIndex] = updatedConsent;

					console.log('Updated consent:', updatedConsent);

					return { consents: updatedConsents };
				} else {
					console.warn('Consent index does not exist:', consentIndex);
					return currentAttributes; // No change
				}
			});
		} catch (error) {
			console.error('Error getting default label:', error);
		} finally {
			// Clear loading state
			setLoadingLabels((prev) => {
				const newState = { ...prev };
				delete newState[consentIndex];
				return newState;
			});
		}
	};

	// Типы полей
	const fieldTypes = [
		{ label: __('Text', 'codeweber-gutenberg-blocks'), value: 'text' },
		{ label: __('Email', 'codeweber-gutenberg-blocks'), value: 'email' },
		{ label: __('Newsletter Email', 'codeweber-gutenberg-blocks'), value: 'newsletter' },
		{ label: __('Tel', 'codeweber-gutenberg-blocks'), value: 'tel' },
		{ label: __('URL', 'codeweber-gutenberg-blocks'), value: 'url' },
		{ label: __('Textarea', 'codeweber-gutenberg-blocks'), value: 'textarea' },
		{ label: __('Select', 'codeweber-gutenberg-blocks'), value: 'select' },
		{ label: __('Radio', 'codeweber-gutenberg-blocks'), value: 'radio' },
		{ label: __('Checkbox', 'codeweber-gutenberg-blocks'), value: 'checkbox' },
		{ label: __('File', 'codeweber-gutenberg-blocks'), value: 'file' },
		{ label: __('Date', 'codeweber-gutenberg-blocks'), value: 'date' },
		{ label: __('Time', 'codeweber-gutenberg-blocks'), value: 'time' },
		{ label: __('Number', 'codeweber-gutenberg-blocks'), value: 'number' },
		{ label: __('Hidden', 'codeweber-gutenberg-blocks'), value: 'hidden' },
		{ label: __('Consents block', 'codeweber-gutenberg-blocks'), value: 'consents_block' },
		{ label: __('Rating', 'codeweber-gutenberg-blocks'), value: 'rating' },
		{ label: __('Author Role (Position)', 'codeweber-gutenberg-blocks'), value: 'author_role' },
		{ label: __('Company', 'codeweber-gutenberg-blocks'), value: 'company' },
	];

	// Bootstrap grid классы
	const widthOptions = [
		{ label: __('Full Width (col-12)', 'codeweber-gutenberg-blocks'), value: 'col-12' },
		{ label: __('Half Width (col-md-6)', 'codeweber-gutenberg-blocks'), value: 'col-md-6' },
		{ label: __('Third Width (col-md-4)', 'codeweber-gutenberg-blocks'), value: 'col-md-4' },
		{ label: __('Quarter Width (col-md-3)', 'codeweber-gutenberg-blocks'), value: 'col-md-3' },
	];

	// Рендер предпросмотра поля
	const renderFieldPreview = () => {
		const fieldId = `field-${fieldName || 'preview'}`;
		const controlClass = (base) => [base, fieldClass || ''].filter(Boolean).join(' ').trim();

		switch (fieldType) {
			case 'textarea':
				return (
					<div className="form-floating">
						<textarea
							className={controlClass('form-control')}
							id={fieldId}
							placeholder={placeholder || fieldLabel}
							disabled
							style={{ height: '100px' }}
						/>
						<label htmlFor={fieldId}>
							{fieldLabel || __('Field Label', 'codeweber-gutenberg-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
					</div>
				);

			case 'select':
				return (
					<div className="form-floating">
						<select className={controlClass('form-select')} id={fieldId} disabled>
							<option>{placeholder || __('Select option...', 'codeweber-gutenberg-blocks')}</option>
							{options && options.length > 0 && options.map((opt, idx) => (
								<option key={idx} value={opt.value}>{opt.label}</option>
							))}
						</select>
						<label htmlFor={fieldId}>
							{fieldLabel || __('Field Label', 'codeweber-gutenberg-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
					</div>
				);

			case 'checkbox':
			case 'radio':
				return (
					<div>
						<label className="form-label">
							{fieldLabel || __('Field Label', 'codeweber-gutenberg-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
						{options && options.length > 0 ? (
							<div>
								{options.map((opt, idx) => (
									<div key={idx} className={`form-check ${fieldType === 'radio' ? '' : 'form-check-inline'}`}>
										<input
											className={controlClass(`form-check-input ${fieldType === 'checkbox' ? 'small-checkbox' : ''}`)}
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
									className={controlClass(`form-check-input ${fieldType === 'checkbox' ? 'small-checkbox' : ''}`)}
									type={fieldType}
									id={fieldId}
									disabled
								/>
								<label className="form-check-label" htmlFor={fieldId}>
									{placeholder || __('Option', 'codeweber-gutenberg-blocks')}
								</label>
							</div>
						)}
					</div>
				);

			case 'rating':
				return (
					<div className="testimonial-rating-selector">
						<label className="form-label d-block mb-3">
							{fieldLabel || __('Rating', 'codeweber-gutenberg-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
						<div className="rating-stars-wrapper d-flex gap-1 align-items-center" style={{ fontSize: '1.25rem', padding: '0.5rem' }}>
							{['★', '★', '★', '★', '★'].map((star, idx) => (
								<span key={idx} style={{ color: '#fcc032', cursor: 'pointer' }}>{star}</span>
							))}
						</div>
					</div>
				);

			case 'author_role':
			case 'company':
				// Эти типы рендерятся как обычные text поля
				return (
					<div className="form-floating">
						<input
							type="text"
							className={controlClass('form-control')}
							id={fieldId}
							placeholder={placeholder || fieldLabel}
							defaultValue={defaultValue}
							disabled
						/>
						<label htmlFor={fieldId}>
							{fieldLabel || (fieldType === 'author_role' ? __('Your Position', 'codeweber-gutenberg-blocks') : __('Company', 'codeweber-gutenberg-blocks'))}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
					</div>
				);

			case 'newsletter':
				const previewButtonText = buttonText || __('Join', 'codeweber-gutenberg-blocks');
				const previewButtonClass = buttonClass || 'btn btn-primary';
				return (
					<div className="input-group form-floating">
						<input
							type="email"
							className={controlClass('form-control required email rounded')}
							id={fieldId}
							placeholder={placeholder || fieldLabel || __('Email Address', 'codeweber-gutenberg-blocks')}
							disabled
							autoComplete="off"
						/>
						<label htmlFor={fieldId}>
							{fieldLabel || __('Email Address', 'codeweber-gutenberg-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
						<input
							type="submit"
							value={previewButtonText}
							className={previewButtonClass}
							disabled
						/>
					</div>
				);

			case 'file':
				return (
					<div className="form-floating">
						<input
							type="file"
							className={controlClass('form-control')}
							id={fieldId}
							accept={accept}
							multiple={multiple}
							disabled
						/>
						<label htmlFor={fieldId}>
							{fieldLabel || __('File Upload', 'codeweber-gutenberg-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
					</div>
				);

			case 'hidden':
				return (
					<div className="text-muted small">
						{__('Hidden Field', 'codeweber-gutenberg-blocks')}: {fieldName || 'field_name'}
					</div>
				);

			case 'consents_block':
				return (
					<div className="text-muted small p-3 border rounded bg-light">
						<strong>{__('Consents Block', 'codeweber-gutenberg-blocks')}</strong>
						<br />
						<small>{__('This field outputs consents configured below the form.', 'codeweber-gutenberg-blocks')}</small>
					</div>
				);

			default:
				return (
					<div className="form-floating">
						<input
							type={fieldType}
							className={controlClass('form-control')}
							id={fieldId}
							placeholder={placeholder || fieldLabel}
							defaultValue={defaultValue}
							disabled
						/>
						<label htmlFor={fieldId}>
							{fieldLabel || __('Field Label', 'codeweber-gutenberg-blocks')}
							{isRequired && <span className="text-danger"> *</span>}
						</label>
					</div>
				);
		}
	};

	// Tab icon component
	const TabIcon = ({ icon, label }) => (
		<span
			title={label}
			style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
		>
			<Icon icon={icon} size={20} />
		</span>
	);

	// Define tabs based on field type
	const tabs = fieldType === 'consents_block'
		? [
			{ name: 'consents', title: <TabIcon icon={cog} label={__('Consents', 'codeweber-gutenberg-blocks')} /> },
			{ name: 'layout', title: <TabIcon icon={grid} label={__('Layout', 'codeweber-gutenberg-blocks')} /> },
			{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
		]
		: [
			{ name: 'field', title: <TabIcon icon={cog} label={__('Field Settings', 'codeweber-gutenberg-blocks')} /> },
			{ name: 'layout', title: <TabIcon icon={grid} label={__('Layout', 'codeweber-gutenberg-blocks')} /> },
			{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
		];

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* CONSENTS TAB (only for consents_block) */}
							{tab.name === 'consents' && fieldType === 'consents_block' && (
								<PanelBody>
									<p className="description" style={{ marginBottom: '15px' }}>
										{__('Add consent checkboxes to your form. Each consent can have a custom label with placeholders for document links.', 'codeweber-gutenberg-blocks')}
									</p>

									{(consents || []).map((consent, index) => (
										<div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', background: '#f9f9f9' }}>
											<p style={{ marginTop: 0, fontWeight: 'bold' }}>
												{__('Consent', 'codeweber-gutenberg-blocks')} #{index + 1}
											</p>

											<div>
												<TextControl
													label={
														<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
															<span>{__('Label Text', 'codeweber-gutenberg-blocks')}</span>
															{loadingLabels[index] && (
																<>
																	<Spinner style={{ margin: 0 }} />
																	<span style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
																		{__('Loading...', 'codeweber-gutenberg-blocks')}
																	</span>
																</>
															)}
														</div>
													}
													value={consent.label || ''}
													onChange={(value) => updateConsent(index, 'label', value)}
													placeholder={__('I agree to the {document_title}', 'codeweber-gutenberg-blocks')}
													help={loadingLabels[index] ? __('Loading default label...', 'codeweber-gutenberg-blocks') : __('You can use placeholders: {document_url}, {document_title}, {document_title_url}, {form_id}', 'codeweber-gutenberg-blocks')}
													disabled={loadingLabels[index]}
												/>
											</div>

											<SelectControl
												label={__('Select Document', 'codeweber-gutenberg-blocks')}
												value={String(consent.document_id || '')}
												options={[
													{ label: __('— Select —', 'codeweber-gutenberg-blocks'), value: '' },
													...(loadingDocuments ? [] : legalDocuments.map((doc) => ({
														label: doc.title?.rendered || doc.title || `Document #${doc.id}`,
														value: String(doc.id),
													}))),
												]}
												onChange={(value) => {
													const docId = parseInt(value) || 0;
													// Update document_id - this will trigger useEffect to load label
													updateConsent(index, 'document_id', docId);
													if (docId === 0) {
														// Clear label if no document selected
														updateConsent(index, 'label', '');
													}
													// Label will be loaded automatically via useEffect when document_id changes
												}}
												disabled={loadingDocuments}
											/>

											<ToggleControl
												label={__('Required (form cannot be submitted without this consent)', 'codeweber-gutenberg-blocks')}
												checked={consent.required || false}
												onChange={(value) => updateConsent(index, 'required', value)}
											/>

											<Button
												isDestructive
												isSmall
												onClick={() => removeConsent(index)}
												style={{ marginTop: '10px' }}
											>
												{__('Remove', 'codeweber-gutenberg-blocks')}
											</Button>
										</div>
									))}

									<Button
										isPrimary
										isSmall
										onClick={addConsent}
										style={{ marginTop: '10px' }}
									>
										{__('+ Add Consent', 'codeweber-gutenberg-blocks')}
									</Button>
								</PanelBody>
							)}

							{/* FIELD SETTINGS TAB (for non-consents_block) */}
							{tab.name === 'field' && fieldType !== 'consents_block' && (
								<>
									<PanelBody title={__('Field Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
										<SelectControl
											label={__('Field Type', 'codeweber-gutenberg-blocks')}
											value={fieldType}
											options={fieldTypes}
											onChange={(value) => {
												const newAttributes = { fieldType: value };
												const defaultNames = {
													text: 'name',
													email: 'email',
													newsletter: 'email',
													textarea: 'message',
													tel: 'phone',
													url: 'website',
													number: 'number',
													date: 'date',
													time: 'time',
													select: 'option',
													radio: 'option',
													checkbox: 'option',
													file: 'file',
													hidden: 'hidden_field',
													consents_block: 'consent',
													rating: 'rating',
													author_role: 'role',
													company: 'company',
												};

												const mappedName = defaultNames[value];
												newAttributes.fieldName = mappedName !== undefined ? mappedName : fieldName;

												// Автоматически устанавливаем fieldLabel для специальных типов, только если он пустой
												if (value === 'author_role' && !fieldLabel) {
													newAttributes.fieldLabel = __('Your Position', 'codeweber-gutenberg-blocks');
												} else if (value === 'company' && !fieldLabel) {
													newAttributes.fieldLabel = __('Company', 'codeweber-gutenberg-blocks');
												} else if (value === 'rating' && !fieldLabel) {
													newAttributes.fieldLabel = __('Rating', 'codeweber-gutenberg-blocks');
												}
												setAttributes(newAttributes);
											}}
										/>
										<TextControl
											label={__('Field Name', 'codeweber-gutenberg-blocks')}
											value={fieldName}
											onChange={(value) => setAttributes({ fieldName: value })}
											help={__('Unique field identifier (e.g., name, email)', 'codeweber-gutenberg-blocks')}
											required
										/>
										<TextControl
											label={__('Field Label', 'codeweber-gutenberg-blocks')}
											value={fieldLabel}
											onChange={(value) => setAttributes({ fieldLabel: value })}
										/>
										{fieldType !== 'hidden' && fieldType !== 'checkbox' && fieldType !== 'radio' && (
											<TextControl
												label={__('Placeholder', 'codeweber-gutenberg-blocks')}
												value={placeholder}
												onChange={(value) => setAttributes({ placeholder: value })}
											/>
										)}
										<ToggleControl
											label={__('Required Field', 'codeweber-gutenberg-blocks')}
											checked={isRequired}
											onChange={(value) => setAttributes({ isRequired: value })}
										/>
										<ToggleControl
											label={__('Show for guests only', 'codeweber-gutenberg-blocks')}
											checked={showForGuestsOnly || false}
											onChange={(value) => setAttributes({ showForGuestsOnly: value })}
											help={__('Field will be shown only for non-logged-in users (guests)', 'codeweber-gutenberg-blocks')}
										/>
										{fieldType === 'newsletter' && (
											<>
												<TextControl
													label={__('Button Text', 'codeweber-gutenberg-blocks')}
													value={buttonText || ''}
													onChange={(value) => setAttributes({ buttonText: value })}
													help={__('Text for the submit button (default: "Join")', 'codeweber-gutenberg-blocks')}
												/>
												<TextControl
													label={__('Button Class', 'codeweber-gutenberg-blocks')}
													value={buttonClass || 'btn btn-primary'}
													onChange={(value) => setAttributes({ buttonClass: value })}
													help={__('CSS classes for the submit button (default: "btn btn-primary")', 'codeweber-gutenberg-blocks')}
												/>
											</>
										)}
									</PanelBody>

									<PanelBody title={__('Validation', 'codeweber-gutenberg-blocks')} initialOpen={false}>
										<TextControl
											label={__('Min Length', 'codeweber-gutenberg-blocks')}
											type="number"
											value={minLength || ''}
											onChange={(value) => setAttributes({ minLength: parseInt(value) || 0 })}
										/>
										<TextControl
											label={__('Max Length', 'codeweber-gutenberg-blocks')}
											type="number"
											value={maxLength || ''}
											onChange={(value) => setAttributes({ maxLength: parseInt(value) || 0 })}
										/>
										<SelectControl
											label={__('Validation Type', 'codeweber-gutenberg-blocks')}
											value={validationType}
											options={[
												{ label: __('None', 'codeweber-gutenberg-blocks'), value: 'none' },
												{ label: __('Email', 'codeweber-gutenberg-blocks'), value: 'email' },
												{ label: __('URL', 'codeweber-gutenberg-blocks'), value: 'url' },
												{ label: __('Phone', 'codeweber-gutenberg-blocks'), value: 'tel' },
											]}
											onChange={(value) => setAttributes({ validationType: value })}
										/>
									</PanelBody>

									{(fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') && (
										<PanelBody title={__('Options', 'codeweber-gutenberg-blocks')} initialOpen={false}>
											<TextareaControl
												label={__('Options (one per line, format: label|value)', 'codeweber-gutenberg-blocks')}
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
												help={__('Example: Option 1|value1', 'codeweber-gutenberg-blocks')}
											/>
										</PanelBody>
									)}

									{fieldType === 'file' && (
										<PanelBody title={__('File Settings', 'codeweber-gutenberg-blocks')} initialOpen={false}>
											<TextControl
												label={__('Accept', 'codeweber-gutenberg-blocks')}
												value={accept}
												onChange={(value) => setAttributes({ accept: value })}
												help={__('File types: .pdf,.doc,.docx or image/*', 'codeweber-gutenberg-blocks')}
											/>
											<ToggleControl
												label={__('Multiple Files', 'codeweber-gutenberg-blocks')}
												checked={multiple}
												onChange={(value) => setAttributes({ multiple: value })}
											/>
										</PanelBody>
									)}

									<PanelBody title={__('Advanced', 'codeweber-gutenberg-blocks')} initialOpen={false}>
										<TextControl
											label={__('Default Value', 'codeweber-gutenberg-blocks')}
											value={defaultValue}
											onChange={(value) => setAttributes({ defaultValue: value })}
										/>
										<TextControl
											label={__('Help Text', 'codeweber-gutenberg-blocks')}
											value={helpText}
											onChange={(value) => setAttributes({ helpText: value })}
											help={__('Additional help text below the field', 'codeweber-gutenberg-blocks')}
										/>
									</PanelBody>
								</>
							)}

							{/* LAYOUT TAB - ResponsiveControl for columns */}
							{tab.name === 'layout' && (
								<PanelBody>
									<ResponsiveControl
										{...createBreakpointsConfig({
											type: 'custom',
											attributes,
											attributePrefix: 'fieldColumns',
											onChange: setAttributes,
											variant: 'dropdown',
											label: __('Columns count', 'codeweber-gutenberg-blocks'),
											tooltip: __('Number of columns at each breakpoint', 'codeweber-gutenberg-blocks'),
											customOptions: {
												default: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
												xs: ['', '1', '2', '3', '4', '5', '6'],
												sm: ['', '1', '2', '3', '4', '5', '6'],
												md: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
												lg: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
												xl: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
												xxl: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
											},
										})}
									/>
								</PanelBody>
							)}

							{/* SETTINGS TAB */}
							{tab.name === 'settings' && (
								<PanelBody>
									<TextControl
										label={__('Field CSS Class', 'codeweber-gutenberg-blocks')}
										value={fieldClass || ''}
										onChange={(value) => setAttributes({ fieldClass: value })}
										help={__('Optional class added to the form element', 'codeweber-gutenberg-blocks')}
									/>
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

