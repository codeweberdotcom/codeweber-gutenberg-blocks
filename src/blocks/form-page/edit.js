import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
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
	} = attributes;

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
		</>
	);
};

export default FormPageEdit;
