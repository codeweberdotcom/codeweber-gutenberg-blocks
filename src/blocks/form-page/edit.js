import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

const ALLOWED_BLOCKS = [
	'codeweber-blocks/form-field',
	'codeweber-blocks/submit-button',
	'codeweber-gutenberg-blocks/heading-subtitle',
];

const FormPageEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		pageTitle,
		nextButtonText,
		nextButtonClass,
		showBackButton,
		backButtonText,
		backButtonClass,
		pageConditionalLogic,
		pageConditionalAction,
		pageConditionalMatch,
		pageConditionalRules,
	} = attributes;

	// Collect all form-field blocks from all pages in the parent form
	const allFormFields = useSelect(
		(select) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parents = getBlockParents(clientId);
			if (!parents.length) return [];
			const formId = parents[parents.length - 1];
			const formBlock = getBlock(formId);
			if (!formBlock) return [];
			const fields = [];
			(formBlock.innerBlocks || []).forEach((page) => {
				if (page.name !== 'codeweber-blocks/form-page') return;
				(page.innerBlocks || []).forEach((block) => {
					if (block.name !== 'codeweber-blocks/form-field') return;
					if (!block.attributes.fieldName) return;
					fields.push({
						label: block.attributes.fieldLabel || block.attributes.fieldName,
						value: block.attributes.fieldName,
						fieldType: block.attributes.fieldType || 'text',
						options: block.attributes.options || [],
					});
				});
			});
			return fields;
		},
		[clientId]
	);

	// Determine step number among siblings
	const { stepNumber, totalSteps } = useSelect(
		(select) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parents = getBlockParents(clientId);
			if (!parents.length) return { stepNumber: 1, totalSteps: 1 };
			const parentBlock = getBlock(parents[parents.length - 1]);
			const siblings = (parentBlock?.innerBlocks || []).filter(
				(b) => b.name === 'codeweber-blocks/form-page'
			);
			const idx = siblings.findIndex((b) => b.clientId === clientId);
			return {
				stepNumber: idx + 1,
				totalSteps: siblings.length,
			};
		},
		[clientId]
	);

	const isLast = stepNumber === totalSteps;

	const blockProps = useBlockProps({
		className: 'cwgb-form-page-editor',
		style: {
			border: '2px dashed #007cba',
			borderRadius: '4px',
			padding: '16px',
			marginBottom: '12px',
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Page Settings', 'codeweber-gutenberg-blocks')}
					initialOpen={true}
				>
					<TextControl
						label={__('Page Title (shown in progress indicator)', 'codeweber-gutenberg-blocks')}
						value={pageTitle}
						onChange={(v) => setAttributes({ pageTitle: v })}
					/>
				</PanelBody>
				<PanelBody
					title={__('Navigation Buttons', 'codeweber-gutenberg-blocks')}
					initialOpen={true}
				>
					{!isLast && (
						<>
							<TextControl
								label={__('Next Button Text', 'codeweber-gutenberg-blocks')}
								value={nextButtonText}
								onChange={(v) => setAttributes({ nextButtonText: v })}
							/>
							<TextControl
								label={__('Next Button Class', 'codeweber-gutenberg-blocks')}
								value={nextButtonClass}
								onChange={(v) => setAttributes({ nextButtonClass: v })}
							/>
						</>
					)}
					{stepNumber > 1 && (
						<>
							<ToggleControl
								label={__('Show Back Button', 'codeweber-gutenberg-blocks')}
								checked={showBackButton}
								onChange={(v) => setAttributes({ showBackButton: v })}
							/>
							{showBackButton && (
								<>
									<TextControl
										label={__('Back Button Text', 'codeweber-gutenberg-blocks')}
										value={backButtonText}
										onChange={(v) => setAttributes({ backButtonText: v })}
									/>
									<TextControl
										label={__('Back Button Class', 'codeweber-gutenberg-blocks')}
										value={backButtonClass}
										onChange={(v) => setAttributes({ backButtonClass: v })}
									/>
								</>
							)}
						</>
					)}
				</PanelBody>
				<PanelBody
					title={__('Conditional Logic', 'codeweber-gutenberg-blocks')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable Conditional Logic', 'codeweber-gutenberg-blocks')}
						checked={!!pageConditionalLogic}
						onChange={(v) => setAttributes({ pageConditionalLogic: v })}
					/>
					{pageConditionalLogic && (
						<>
							<SelectControl
								label={__('Action', 'codeweber-gutenberg-blocks')}
								value={pageConditionalAction || 'show'}
								options={[
									{ label: __('Show this page', 'codeweber-gutenberg-blocks'), value: 'show' },
									{ label: __('Skip this page', 'codeweber-gutenberg-blocks'), value: 'skip' },
								]}
								onChange={(v) => setAttributes({ pageConditionalAction: v })}
							/>
							<SelectControl
								label={__('Match', 'codeweber-gutenberg-blocks')}
								value={pageConditionalMatch || 'all'}
								options={[
									{ label: __('All rules', 'codeweber-gutenberg-blocks'), value: 'all' },
									{ label: __('Any rule', 'codeweber-gutenberg-blocks'), value: 'any' },
								]}
								onChange={(v) => setAttributes({ pageConditionalMatch: v })}
							/>
							{(pageConditionalRules || []).map((rule, idx) => (
								<div
									key={idx}
									style={{ marginBottom: '12px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
								>
									<SelectControl
										label={__('Field', 'codeweber-gutenberg-blocks')}
										value={rule.field || ''}
										options={[
											{ label: __('Select field...', 'codeweber-gutenberg-blocks'), value: '' },
											...allFormFields.map((f) => ({ label: f.label, value: f.value })),
										]}
										onChange={(v) => {
											const r = [...pageConditionalRules];
											r[idx] = { ...r[idx], field: v, value: '' };
											setAttributes({ pageConditionalRules: r });
										}}
									/>
									<SelectControl
										label={__('Operator', 'codeweber-gutenberg-blocks')}
										value={rule.operator || 'is'}
										options={[
											{ label: __('Is', 'codeweber-gutenberg-blocks'), value: 'is' },
											{ label: __('Is not', 'codeweber-gutenberg-blocks'), value: 'is_not' },
											{ label: __('Contains', 'codeweber-gutenberg-blocks'), value: 'contains' },
											{ label: __('Does not contain', 'codeweber-gutenberg-blocks'), value: 'not_contains' },
											{ label: __('Is empty', 'codeweber-gutenberg-blocks'), value: 'is_empty' },
											{ label: __('Is not empty', 'codeweber-gutenberg-blocks'), value: 'is_not_empty' },
										]}
										onChange={(v) => {
											const r = [...pageConditionalRules];
											r[idx] = { ...r[idx], operator: v };
											setAttributes({ pageConditionalRules: r });
										}}
									/>
									{!['is_empty', 'is_not_empty'].includes(rule.operator) && (() => {
										const sf = allFormFields.find((f) => f.value === rule.field);
										const useDropdown = sf &&
											['select', 'radio', 'checkbox'].includes(sf.fieldType) &&
											sf.options.length > 0 &&
											['is', 'is_not'].includes(rule.operator);
										const updateVal = (v) => {
											const r = [...pageConditionalRules];
											r[idx] = { ...r[idx], value: v };
											setAttributes({ pageConditionalRules: r });
										};
										if (useDropdown) {
											return (
												<SelectControl
													label={__('Value', 'codeweber-gutenberg-blocks')}
													value={rule.value || ''}
													options={[
														{ label: __('Select...', 'codeweber-gutenberg-blocks'), value: '' },
														...sf.options.map((o) => ({ label: o.label, value: o.value || o.label })),
													]}
													onChange={updateVal}
												/>
											);
										}
										return (
											<TextControl
												label={__('Value', 'codeweber-gutenberg-blocks')}
												value={rule.value || ''}
												onChange={updateVal}
											/>
										);
									})()}
									<Button
										isDestructive
										variant="link"
										onClick={() => setAttributes({ pageConditionalRules: pageConditionalRules.filter((_, i) => i !== idx) })}
									>
										{__('Remove rule', 'codeweber-gutenberg-blocks')}
									</Button>
								</div>
							))}
							<Button
								variant="secondary"
								onClick={() => setAttributes({ pageConditionalRules: [...(pageConditionalRules || []), { field: '', operator: 'is', value: '' }] })}
							>
								{__('Add rule', 'codeweber-gutenberg-blocks')}
							</Button>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						marginBottom: '12px',
						gap: '8px',
					}}
				>
					<span
						style={{
							background: '#007cba',
							color: '#fff',
							borderRadius: '50%',
							width: '24px',
							height: '24px',
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '12px',
							fontWeight: 700,
							flexShrink: 0,
						}}
					>
						{stepNumber}
					</span>
					<strong style={{ color: '#007cba', fontSize: '13px' }}>
						{pageTitle ||
							`${__('Step', 'codeweber-gutenberg-blocks')} ${stepNumber}`}
					</strong>
					<span style={{ color: '#666', fontSize: '12px', marginLeft: 'auto' }}>
						{__('of', 'codeweber-gutenberg-blocks')} {totalSteps}
					</span>
				</div>
				<div className="form-fields-preview row">
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={[
							[
								'codeweber-blocks/form-field',
								{
									fieldType: 'text',
									fieldLabel: __('Field', 'codeweber-gutenberg-blocks'),
								},
							],
						]}
						templateLock={false}
					/>
				</div>
			</div>
		</>
	);
};

export default FormPageEdit;
