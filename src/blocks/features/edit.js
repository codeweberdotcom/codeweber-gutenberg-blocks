/**
 * Features Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { TabPanel, PanelBody } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { Icon, symbol, typography, button, addCard, starFilled } from '@wordpress/icons';
import { ButtonGroup, Button } from '@wordpress/components';

import { IconControl } from '../../components/icon';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { BorderSettingsPanel } from '../../components/borders';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BackgroundSettingsPanel } from '../../components/background/BackgroundSettingsPanel';
import { TextControl, ToggleControl, ComboboxControl } from '@wordpress/components';
import { colors } from '../../utilities/colors';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span 
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

const ALLOWED_BLOCKS = ['codeweber-blocks/columns'];

const FeaturesEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		featureLayout,
		// Icon
		iconType,
		iconName,
		svgIcon,
		svgStyle,
		iconSize,
		iconFontSize,
		iconColor,
		iconColor2,
		iconClass,
		iconWrapper,
		iconWrapperStyle,
		iconBtnSize,
		iconBtnVariant,
		iconWrapperClass,
		customSvgUrl,
		customSvgId,
		// Title
		enableTitle,
		title,
		titleTag,
		titleColor,
		titleColorType,
		titleSize,
		titleWeight,
		titleTransform,
		titleClass,
		// Paragraph
		enableParagraph,
		paragraph,
		paragraphTag,
		paragraphColor,
		paragraphColorType,
		paragraphSize,
		paragraphWeight,
		paragraphTransform,
		paragraphClass,
		// Button
		enableButton,
		buttonText,
		buttonUrl,
		buttonColor,
		buttonClass,
		// Card
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
		backgroundImageId,
		backgroundImageUrl,
		backgroundImageSize,
		backgroundSize,
		backgroundOverlay,
		backgroundPatternUrl,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
	} = attributes;

	const { replaceInnerBlocks, updateBlockAttributes } = useDispatch('core/block-editor');
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId) || [],
		[clientId]
	);
	const hasInitialized = useRef(false);

	// Initialize with 4 columns, each containing 1 feature block
	useEffect(() => {
		if (hasInitialized.current || innerBlocks.length > 0) {
			return;
		}

		// Create 4 columns, each with 1 feature block with different data
		const featureData = [
			{
				iconName: 'phone-volume',
				iconColor: 'yellow',
				buttonColor: 'yellow',
				title: '24/7 Support',
				paragraph: 'Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.',
			},
			{
				iconName: 'shield-exclamation',
				iconColor: 'red',
				buttonColor: 'red',
				title: 'Secure Payments',
				paragraph: 'Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.',
			},
			{
				iconName: 'laptop-cloud',
				iconColor: 'leaf',
				buttonColor: 'leaf',
				title: 'Daily Updates',
				paragraph: 'Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.',
			},
			{
				iconName: 'chart-line',
				iconColor: 'blue',
				buttonColor: 'blue',
				title: 'Market Research',
				paragraph: 'Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus. Cras justo.',
			},
		];

		const columnsBlock = createBlock('codeweber-blocks/columns', {
			columnsCount: 4,
			columnsType: 'columns-grid',
			columnsRowCols: '12',
			columnsRowColsMd: '3',
			columnsGap: '3',
			columnsGapMd: '3',
		}, [
			// Column 1
			createBlock('codeweber-blocks/column', {}, [
				createBlock('codeweber-blocks/feature', {
					iconName: featureData[0].iconName,
					iconColor: featureData[0].iconColor,
					buttonColor: featureData[0].buttonColor,
					title: featureData[0].title,
					paragraph: featureData[0].paragraph,
				})
			]),
			// Column 2
			createBlock('codeweber-blocks/column', {}, [
				createBlock('codeweber-blocks/feature', {
					iconName: featureData[1].iconName,
					iconColor: featureData[1].iconColor,
					buttonColor: featureData[1].buttonColor,
					title: featureData[1].title,
					paragraph: featureData[1].paragraph,
				})
			]),
			// Column 3
			createBlock('codeweber-blocks/column', {}, [
				createBlock('codeweber-blocks/feature', {
					iconName: featureData[2].iconName,
					iconColor: featureData[2].iconColor,
					buttonColor: featureData[2].buttonColor,
					title: featureData[2].title,
					paragraph: featureData[2].paragraph,
				})
			]),
			// Column 4
			createBlock('codeweber-blocks/column', {}, [
				createBlock('codeweber-blocks/feature', {
					iconName: featureData[3].iconName,
					iconColor: featureData[3].iconColor,
					buttonColor: featureData[3].buttonColor,
					title: featureData[3].title,
					paragraph: featureData[3].paragraph,
				})
			]),
		]);

		replaceInnerBlocks(clientId, [columnsBlock], false);
		hasInitialized.current = true;
	}, [clientId, innerBlocks.length, replaceInnerBlocks]);

	// Apply settings to all child feature blocks
	const applySettingsToFeatures = (updates) => {
		setAttributes(updates);
		
		// Find all feature blocks recursively
		const findFeatureBlocks = (blocks) => {
			const featureBlocks = [];
			
			const traverse = (blockList) => {
				if (!blockList || !Array.isArray(blockList)) return;
				
				blockList.forEach(block => {
					if (block.name === 'codeweber-blocks/feature') {
						featureBlocks.push(block);
					}
					// Recursively check inner blocks
					if (block.innerBlocks && block.innerBlocks.length > 0) {
						traverse(block.innerBlocks);
					}
				});
			};
			
			traverse(blocks);
			return featureBlocks;
		};

		const featureBlocks = findFeatureBlocks(innerBlocks);
		featureBlocks.forEach(block => {
			updateBlockAttributes(block.clientId, updates);
		});
	};

	const blockProps = useBlockProps({
		className: 'features-wrapper',
	});

	const tabs = [
		{ name: 'feature', title: <TabIcon icon={starFilled} label={__('Feature', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'icon', title: <TabIcon icon={symbol} label={__('Icon', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'title', title: <TabIcon icon={typography} label={__('Title', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'button', title: <TabIcon icon={button} label={__('Button', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'card', title: <TabIcon icon={addCard} label={__('Card', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* FEATURE TAB */}
							{tab.name === 'feature' && (
								<PanelBody>
									<ButtonGroup>
										<Button
											variant={featureLayout === 'vertical' ? 'primary' : 'secondary'}
											onClick={() => {
												applySettingsToFeatures({ 
													featureLayout: 'vertical',
													iconWrapperStyle: 'btn',
													iconBtnVariant: 'soft',
													iconColor: 'yellow',
													iconWrapperClass: 'pe-none mb-5',
													titleClass: '',
													buttonColor: 'yellow',
												});
											}}
										>
											{__('Feature 1', 'codeweber-gutenberg-blocks')}
										</Button>
										<Button
											variant={featureLayout === 'horizontal' ? 'primary' : 'secondary'}
											onClick={() => {
												applySettingsToFeatures({ 
													featureLayout: 'horizontal',
													iconWrapperStyle: 'btn-circle',
													iconBtnVariant: 'solid',
													iconColor: 'primary',
													iconWrapperClass: 'me-5',
													titleClass: '',
													buttonColor: '',
												});
											}}
										>
											{__('Feature 2', 'codeweber-gutenberg-blocks')}
										</Button>
										<Button
											variant={featureLayout === 'feature-3' ? 'primary' : 'secondary'}
											onClick={() => {
												applySettingsToFeatures({ 
													featureLayout: 'feature-3',
													iconWrapperStyle: 'btn-circle',
													iconBtnVariant: 'soft',
													iconColor: 'primary',
													iconWrapperClass: 'pe-none me-5',
													titleClass: 'mb-1',
													buttonColor: 'yellow',
												});
											}}
										>
											{__('Feature 3', 'codeweber-gutenberg-blocks')}
										</Button>
									</ButtonGroup>
								</PanelBody>
							)}

							{/* ICON TAB */}
							{tab.name === 'icon' && (
								<PanelBody>
									<IconControl
										attributes={attributes}
										setAttributes={applySettingsToFeatures}
										prefix=""
									/>
								</PanelBody>
							)}

							{/* TITLE TAB */}
							{tab.name === 'title' && (
								<PanelBody>
									<HeadingContentControl
										attributes={{
											...attributes,
											enableSubtitle: false,
											enableText: enableParagraph,
											text: paragraph,
										}}
										setAttributes={(updates) => {
											const mappedUpdates = {};
											Object.keys(updates).forEach((key) => {
												if (key === 'text') {
													mappedUpdates.paragraph = updates[key];
												} else if (key === 'enableText') {
													mappedUpdates.enableParagraph = updates[key];
												} else {
													mappedUpdates[key] = updates[key];
												}
											});
											applySettingsToFeatures(mappedUpdates);
										}}
										hideSubtitle={true}
									/>
									<div style={{ marginTop: '16px' }}>
										<HeadingTypographyControl
											attributes={{
												...attributes,
												textTag: paragraphTag,
												textColor: paragraphColor,
												textColorType: paragraphColorType,
												textSize: paragraphSize,
												textWeight: paragraphWeight,
												textTransform: paragraphTransform,
												textClass: paragraphClass,
											}}
											setAttributes={(updates) => {
												const mappedUpdates = {};
												Object.keys(updates).forEach((key) => {
													if (key.startsWith('text')) {
														const paragraphKey = key.replace(/^text/, 'paragraph');
														mappedUpdates[paragraphKey] = updates[key];
													} else {
														mappedUpdates[key] = updates[key];
													}
												});
												applySettingsToFeatures(mappedUpdates);
											}}
											hideSubtitle={true}
										/>
									</div>
								</PanelBody>
							)}

							{/* BUTTON TAB */}
							{tab.name === 'button' && (
								<PanelBody>
									<ToggleControl
										label={__('Enable Button', 'codeweber-gutenberg-blocks')}
										checked={enableButton}
										onChange={(value) => applySettingsToFeatures({ enableButton: value })}
									/>
									{enableButton && (
										<>
											<TextControl
												label={__('Button Text', 'codeweber-gutenberg-blocks')}
												value={buttonText}
												onChange={(value) => applySettingsToFeatures({ buttonText: value })}
											/>
											<TextControl
												label={__('Button URL', 'codeweber-gutenberg-blocks')}
												value={buttonUrl}
												onChange={(value) => applySettingsToFeatures({ buttonUrl: value })}
											/>
											<ComboboxControl
												label={__('Button Color', 'codeweber-gutenberg-blocks')}
												value={buttonColor}
												options={colors}
												onChange={(value) => applySettingsToFeatures({ buttonColor: value })}
											/>
											<TextControl
												label={__('Button Classes', 'codeweber-gutenberg-blocks')}
												value={buttonClass}
												onChange={(value) => applySettingsToFeatures({ buttonClass: value })}
												help={__('Default: more hover', 'codeweber-gutenberg-blocks')}
											/>
										</>
									)}
								</PanelBody>
							)}

							{/* CARD TAB */}
							{tab.name === 'card' && (
								<PanelBody>
									<ToggleControl
										label={__('Enable Card Wrapper', 'codeweber-gutenberg-blocks')}
										checked={enableCard}
										onChange={(value) => applySettingsToFeatures({ enableCard: value })}
									/>
									{enableCard && (
										<ToggleControl
											label={__('Enable Card Body', 'codeweber-gutenberg-blocks')}
											checked={enableCardBody}
											onChange={(value) => applySettingsToFeatures({ enableCardBody: value })}
										/>
									)}
									<ToggleControl
										label={__('Overflow Hidden', 'codeweber-gutenberg-blocks')}
										checked={overflowHidden}
										onChange={(value) => applySettingsToFeatures({ overflowHidden: value })}
									/>
									<ToggleControl
										label={__('H-100', 'codeweber-gutenberg-blocks')}
										checked={h100}
										onChange={(value) => applySettingsToFeatures({ h100: value })}
									/>
									<BorderSettingsPanel
										borderRadius={borderRadius}
										onBorderRadiusChange={(value) => applySettingsToFeatures({ borderRadius: value })}
										shadow={shadow}
										onShadowChange={(value) => applySettingsToFeatures({ shadow: value })}
										showBorder={false}
									/>
									<div style={{ marginTop: '16px' }}>
										<SpacingControl
											spacingType={spacingType}
											spacingXs={spacingXs}
											spacingSm={spacingSm}
											spacingMd={spacingMd}
											spacingLg={spacingLg}
											spacingXl={spacingXl}
											spacingXxl={spacingXxl}
											onChange={(key, value) => applySettingsToFeatures({ [key]: value })}
										/>
									</div>
									<div style={{ marginTop: '16px' }}>
										<BackgroundSettingsPanel
											attributes={attributes}
											setAttributes={applySettingsToFeatures}
										/>
									</div>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default FeaturesEdit;

