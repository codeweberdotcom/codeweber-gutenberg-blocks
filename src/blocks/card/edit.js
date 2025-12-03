/**
 * Card Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { TabPanel, PanelBody, ToggleControl, ButtonGroup, Button, ComboboxControl } from '@wordpress/components';
import { Icon, symbol, brush, resizeCornerNE, positionCenter, image, cog } from '@wordpress/icons';

import { BorderRadiusControl } from '../../components/border-radius';
import { ShadowControl } from '../../components/shadow';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { BackgroundSettingsPanel } from '../../components/background/BackgroundSettingsPanel';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { colors } from '../../utilities/colors';
import { generateBackgroundClasses, generateAlignmentClasses } from '../../utilities/class-generators';
import { getSpacingClasses } from '../section/utils';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span 
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

/**
 * Edit Component
 */
const Edit = ({ attributes, setAttributes, clientId }) => {
	const {
		enableCard,
		enableCardBody,
		overflowHidden,
		h100,
		borderRadius,
		shadow,
		cardBorder,
		borderColor,
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageUrl,
		backgroundSize,
		backgroundPatternUrl,
		backgroundOverlay,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		align,
		alignItems,
		justifyContent,
		position,
		blockClass,
		blockId,
		blockData,
	} = attributes;

	const tabs = [
		{ name: 'general', title: <TabIcon icon={symbol} label={__('General', 'codeweber-blocks')} /> },
		{ name: 'appearance', title: <TabIcon icon={brush} label={__('Appearance', 'codeweber-blocks')} /> },
		{ name: 'spacing', title: <TabIcon icon={resizeCornerNE} label={__('Spacing', 'codeweber-blocks')} /> },
		{ name: 'align', title: <TabIcon icon={positionCenter} label={__('Position', 'codeweber-blocks')} /> },
		{ name: 'background', title: <TabIcon icon={image} label={__('Background', 'codeweber-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-blocks')} /> },
	];

	// Generate classes for card wrapper
	const getCardClasses = () => {
		const classes = [];
		
		if (enableCard) {
			classes.push('card');
		}
		
		if (overflowHidden) {
			classes.push('overflow-hidden');
		}
		
		if (h100) {
			classes.push('h-100');
		}
		
		if (borderRadius) {
			classes.push(borderRadius);
		}
		
		if (shadow) {
			classes.push(shadow);
		}
		
		if (cardBorder) {
			classes.push(cardBorder);
			if (borderColor) {
				classes.push(`border-${borderColor}`);
			}
		}
		
		// Background classes (color, gradient, image)
		classes.push(...generateBackgroundClasses(attributes));
		
		// Spacing classes
		classes.push(...getSpacingClasses(attributes));
		
		// Alignment classes
		classes.push(...generateAlignmentClasses(attributes));
		
		// Custom class
		if (blockClass) {
			classes.push(blockClass);
		}
		
		return classes.filter(Boolean).join(' ');
	};

	// Parse data attributes
	const getDataAttributes = () => {
		const dataAttrs = {};
		if (blockData) {
			blockData.split(',').forEach((pair) => {
				const [key, value] = pair.split('=').map((s) => s.trim());
				if (key && value) {
					dataAttrs[`data-${key}`] = value;
				}
			});
		}
		return dataAttrs;
	};

	// Generate inline styles for editor preview (NOT saved to DB)
	const getCardStyles = () => {
		const styles = {};

		if (backgroundType === 'image' && backgroundImageUrl) {
			styles.backgroundImage = `url(${backgroundImageUrl})`;
			styles.backgroundRepeat = 'no-repeat';
			if (backgroundSize === 'bg-cover') {
				styles.backgroundSize = 'cover';
			} else if (backgroundSize === 'bg-full') {
				styles.backgroundSize = '100% 100%';
			} else {
				styles.backgroundSize = 'auto';
			}
			styles.backgroundPosition = 'center';
		}

		if (backgroundType === 'pattern' && backgroundPatternUrl) {
			styles.backgroundImage = `url(${backgroundPatternUrl})`;
			styles.backgroundRepeat = 'repeat';
			if (backgroundSize === 'bg-cover') {
				styles.backgroundSize = 'cover';
			} else if (backgroundSize === 'bg-full') {
				styles.backgroundSize = '100% 100%';
			} else {
				styles.backgroundSize = 'auto';
			}
		}

		return Object.keys(styles).length > 0 ? styles : undefined;
	};

	const blockProps = useBlockProps({
		className: getCardClasses(),
		...(blockId && { id: blockId }),
		...getDataAttributes(),
	});

	return (
		<>
			{/* Inspector Controls */}
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* GENERAL TAB */}
							{tab.name === 'general' && (
								<PanelBody>
									<ToggleControl
										label={__('Enable Card Wrapper', 'codeweber-blocks')}
										checked={enableCard}
										onChange={(value) => setAttributes({ enableCard: value })}
									/>

									{enableCard && (
										<ToggleControl
											label={__('Enable Card Body', 'codeweber-blocks')}
											checked={enableCardBody}
											onChange={(value) => setAttributes({ enableCardBody: value })}
										/>
									)}

									<ToggleControl
										label={__('Overflow Hidden', 'codeweber-blocks')}
										checked={overflowHidden}
										onChange={(value) => setAttributes({ overflowHidden: value })}
									/>

									<ToggleControl
										label={__('H-100', 'codeweber-blocks')}
										checked={h100}
										onChange={(value) => setAttributes({ h100: value })}
									/>
								</PanelBody>
							)}

							{/* APPEARANCE TAB */}
							{tab.name === 'appearance' && (
								<PanelBody>
									<BorderRadiusControl
										value={borderRadius}
										onChange={(value) => setAttributes({ borderRadius: value })}
									/>

									<ShadowControl
										value={shadow}
										onChange={(value) => setAttributes({ shadow: value })}
									/>

									<div className="component-sidebar-title">
										<label>{__('Card Border Position', 'codeweber-blocks')}</label>
									</div>
									<ButtonGroup className="button-group-sidebar_33" style={{ marginBottom: '16px' }}>
										<Button
											isPrimary={cardBorder === ''}
											onClick={() => setAttributes({ cardBorder: '' })}
										>
											{__('None', 'codeweber-blocks')}
										</Button>
										<Button
											isPrimary={cardBorder === 'card-border-top'}
											onClick={() => setAttributes({ cardBorder: 'card-border-top' })}
										>
											{__('Top', 'codeweber-blocks')}
										</Button>
										<Button
											isPrimary={cardBorder === 'card-border-bottom'}
											onClick={() => setAttributes({ cardBorder: 'card-border-bottom' })}
										>
											{__('Bottom', 'codeweber-blocks')}
										</Button>
									</ButtonGroup>
									<ButtonGroup className="button-group-sidebar_50" style={{ marginBottom: '16px' }}>
										<Button
											isPrimary={cardBorder === 'card-border-start'}
											onClick={() => setAttributes({ cardBorder: 'card-border-start' })}
										>
											{__('Start', 'codeweber-blocks')}
										</Button>
										<Button
											isPrimary={cardBorder === 'card-border-end'}
											onClick={() => setAttributes({ cardBorder: 'card-border-end' })}
										>
											{__('End', 'codeweber-blocks')}
										</Button>
									</ButtonGroup>

									{cardBorder && (
										<ComboboxControl
											label={__('Border Color', 'codeweber-blocks')}
											value={borderColor}
											options={colors}
											onChange={(value) => setAttributes({ borderColor: value })}
										/>
									)}
								</PanelBody>
							)}

							{/* SPACING TAB */}
							{tab.name === 'spacing' && (
								<PanelBody>
									<SpacingControl
										spacingType={spacingType}
										spacingXs={spacingXs}
										spacingSm={spacingSm}
										spacingMd={spacingMd}
										spacingLg={spacingLg}
										spacingXl={spacingXl}
										spacingXxl={spacingXxl}
										onChange={(key, value) => setAttributes({ [key]: value })}
									/>
								</PanelBody>
							)}

							{/* POSITION TAB */}
							{tab.name === 'align' && (
								<PanelBody>
									<PositioningControl
										alignItems={alignItems}
										onAlignItemsChange={(value) => setAttributes({ alignItems: value })}
										justifyContent={justifyContent}
										onJustifyContentChange={(value) => setAttributes({ justifyContent: value })}
										textAlign={align}
										onTextAlignChange={(value) => setAttributes({ align: value })}
										position={position}
										onPositionChange={(value) => setAttributes({ position: value })}
										noPanel={true}
									/>
								</PanelBody>
							)}

							{/* BACKGROUND TAB */}
							{tab.name === 'background' && (
								<PanelBody>
									<BackgroundSettingsPanel
										attributes={attributes}
										setAttributes={setAttributes}
										allowVideo={false}
									/>
								</PanelBody>
							)}

							{/* SETTINGS TAB */}
							{tab.name === 'settings' && (
								<PanelBody>
									<BlockMetaFields
										attributes={attributes}
										setAttributes={setAttributes}
										fieldKeys={{
											classKey: 'blockClass',
											dataKey: 'blockData',
											idKey: 'blockId',
										}}
										labels={{
											classLabel: __('Card Class', 'codeweber-blocks'),
											dataLabel: __('Card Data', 'codeweber-blocks'),
											idLabel: __('Card ID', 'codeweber-blocks'),
										}}
									/>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			{/* Card Preview */}
			<div {...blockProps} style={getCardStyles()}>
				{enableCard && enableCardBody ? (
					<div className="card-body">
						<InnerBlocks />
					</div>
				) : (
					<InnerBlocks />
				)}
			</div>
		</>
	);
};

export default Edit;

