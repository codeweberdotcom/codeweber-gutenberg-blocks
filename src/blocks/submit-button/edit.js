/**
 * Submit Button Block Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, cog, positionCenter } from '@wordpress/icons';
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

export default function Edit({ attributes, setAttributes }) {
	const {
		buttonText,
		buttonClass,
		blockClass,
		blockData,
		blockId,
		buttonPosition,
		buttonAlignItems,
		buttonJustifyContent,
		buttonTextAlign,
	} = attributes;

	const blockProps = useBlockProps({
		className: `submit-button-preview ${blockClass || ''}`,
	});

	const tabs = [
		{ name: 'button', title: <TabIcon icon={cog} label={__('Button', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'position', title: <TabIcon icon={positionCenter} label={__('Position', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* BUTTON TAB */}
							{tab.name === 'button' && (
								<PanelBody title={__('Button Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
									<TextControl
										label={__('Button Text', 'codeweber-gutenberg-blocks')}
										value={buttonText}
										onChange={(value) => setAttributes({ buttonText: value })}
									/>
									<TextControl
										label={__('Button Classes', 'codeweber-gutenberg-blocks')}
										value={buttonClass}
										onChange={(value) => setAttributes({ buttonClass: value })}
										help={__('Bootstrap classes: btn btn-primary', 'codeweber-gutenberg-blocks')}
									/>
								</PanelBody>
							)}

							{/* POSITION TAB */}
							{tab.name === 'position' && (
								<div style={{ padding: '16px' }}>
									<PositioningControl
										title={__('Button Position', 'codeweber-gutenberg-blocks')}
										alignItems={buttonAlignItems}
										onAlignItemsChange={(value) => setAttributes({ buttonAlignItems: value })}
										justifyContent={buttonJustifyContent}
										onJustifyContentChange={(value) => setAttributes({ buttonJustifyContent: value })}
										textAlign={buttonTextAlign}
										onTextAlignChange={(value) => setAttributes({ buttonTextAlign: value })}
										position={buttonPosition}
										onPositionChange={(value) => setAttributes({ buttonPosition: value })}
										noPanel={true}
									/>
								</div>
							)}

							{/* SETTINGS TAB */}
							{tab.name === 'settings' && (
								<PanelBody title={__('Advanced', 'codeweber-gutenberg-blocks')} initialOpen={false}>
									<TextControl
										label={__('Block Class', 'codeweber-gutenberg-blocks')}
										value={blockClass}
										onChange={(value) => setAttributes({ blockClass: value })}
									/>
									<TextControl
										label={__('Block Data', 'codeweber-gutenberg-blocks')}
										value={blockData}
										onChange={(value) => setAttributes({ blockData: value })}
									/>
									<TextControl
										label={__('Block ID', 'codeweber-gutenberg-blocks')}
										value={blockId}
										onChange={(value) => setAttributes({ blockId: value })}
									/>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			{(() => {
				// Формируем классы для обертки позиции
				const positionClasses = [];
				if (buttonPosition) {
					positionClasses.push(buttonPosition.trim());
				}
				if (buttonAlignItems) {
					positionClasses.push(buttonAlignItems.trim());
				}
				if (buttonJustifyContent) {
					positionClasses.push('d-flex', buttonJustifyContent.trim());
				}
				if (buttonTextAlign) {
					positionClasses.push(buttonTextAlign.trim());
				}

				const positionWrapperClass = positionClasses.filter(Boolean).join(' ');

				const buttonElement = (
					<button
						type="button"
						className={buttonClass || 'btn btn-primary'}
						disabled
					>
						<i className="uil uil-send fs-13"></i>
						{buttonText || __('Send Message', 'codeweber-gutenberg-blocks')}
					</button>
				);

				return (
					<div {...blockProps}>
						<div className="form-submit-wrapper mt-4">
							{positionWrapperClass ? (
								<div className={positionWrapperClass}>
									{buttonElement}
								</div>
							) : (
								buttonElement
							)}
						</div>
					</div>
				);
			})()}
		</>
	);
}

