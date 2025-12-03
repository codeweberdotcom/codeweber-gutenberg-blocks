/**
 * Feature Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { TabPanel, PanelBody, ButtonGroup, Button, TextControl, ToggleControl } from '@wordpress/components';
import { Icon, symbol, typography, button, addCard, starFilled } from '@wordpress/icons';

import { IconControl, IconRender } from '../../components/icon';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { ParagraphRender } from '../../components/paragraph';
import { BorderRadiusControl } from '../../components/border-radius';
import { ShadowControl } from '../../components/shadow';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BackgroundSettingsPanel } from '../../components/background/BackgroundSettingsPanel';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { getTitleClasses, getTextClasses } from '../heading-subtitle/utils';
import { generateBackgroundClasses } from '../../utilities/class-generators';
import { getSpacingClasses } from '../section/utils';
import { colors } from '../../utilities/colors';
import { ComboboxControl } from '@wordpress/components';

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
const Edit = ({ attributes, setAttributes }) => {
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
		blockClass,
		blockId,
		blockData,
	} = attributes;

	const tabs = [
		{ name: 'feature', title: <TabIcon icon={symbol} label={__('Feature', 'codeweber-blocks')} /> },
		{ name: 'icon', title: <TabIcon icon={starFilled} label={__('Icon', 'codeweber-blocks')} /> },
		{ name: 'title', title: <TabIcon icon={typography} label={__('Title', 'codeweber-blocks')} /> },
		{ name: 'button', title: <TabIcon icon={button} label={__('Button', 'codeweber-blocks')} /> },
		{ name: 'card', title: <TabIcon icon={addCard} label={__('Card', 'codeweber-blocks')} /> },
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
		}
		
		if (borderColor) {
			classes.push(`border-${borderColor}`);
		}
		
		// Background classes
		classes.push(...generateBackgroundClasses({
			backgroundType,
			backgroundColor,
			backgroundColorType,
			backgroundGradient,
			backgroundImageUrl,
			backgroundSize,
			backgroundPatternUrl,
			backgroundOverlay,
		}));
		
		// Spacing classes
		classes.push(...getSpacingClasses({
			spacingType,
			spacingXs,
			spacingSm,
			spacingMd,
			spacingLg,
			spacingXl,
			spacingXxl,
		}));
		
		return classes.filter(Boolean).join(' ');
	};

	// Generate inline styles for background preview in editor
	const getCardStyles = () => {
		const styles = {};
		
		if (backgroundType === 'image' && backgroundImageUrl) {
			styles.backgroundImage = `url(${backgroundImageUrl})`;
			styles.backgroundRepeat = 'no-repeat';
			styles.backgroundSize = backgroundSize || 'cover';
			styles.backgroundPosition = 'center center';
		}
		
		if (backgroundType === 'pattern' && backgroundPatternUrl) {
			styles.backgroundImage = `url(${backgroundPatternUrl})`;
			styles.backgroundRepeat = 'repeat';
		}
		
		return Object.keys(styles).length > 0 ? styles : null;
	};

	// Generate button classes
	const getButtonClasses = () => {
		const classes = buttonClass ? buttonClass.split(' ') : [];
		if (buttonColor) {
			classes.push(`link-${buttonColor}`);
		}
		return classes.filter(Boolean).join(' ');
	};

	const blockProps = useBlockProps({
		className: getCardClasses(),
		style: getCardStyles(),
	});
	
	// Layout classes применяются к card-body или card, не к основному контейнеру
	const layoutClasses = featureLayout === 'horizontal' ? 'd-flex flex-row' : '';

	// Render content based on layout
	const renderContent = () => {
		// Icon
		const iconElement = (
			<IconRender
				iconType={iconType}
				iconName={iconName}
				svgIcon={svgIcon}
				svgStyle={svgStyle}
				iconSize={iconSize}
				iconFontSize={iconFontSize}
				iconColor={iconColor}
				iconColor2={iconColor2}
				iconClass={iconClass}
				iconWrapper={iconWrapper}
				iconWrapperStyle={iconWrapperStyle}
				iconBtnSize={iconBtnSize}
				iconBtnVariant={iconBtnVariant}
				iconWrapperClass={iconWrapperClass}
				customSvgUrl={customSvgUrl}
				customSvgId={customSvgId}
				isEditor={true}
			/>
		);

		// Title
		const titleElement = enableTitle ? (
			<RichText
				tagName={titleTag || 'h4'}
				value={title}
				onChange={(value) => setAttributes({ title: value })}
				className={getTitleClasses(attributes)}
				placeholder={__('Enter title...', 'codeweber-blocks')}
			/>
		) : null;

		// Paragraph
		const paragraphElement = enableParagraph ? (
			<ParagraphRender
				attributes={{
					...attributes,
					// Map all paragraph attributes to text for ParagraphRender
					text: paragraph,
					textColor: paragraphColor,
					textColorType: paragraphColorType,
					textSize: paragraphSize,
					textWeight: paragraphWeight,
					textTransform: paragraphTransform,
					textClass: paragraphClass,
				}}
				setAttributes={(updates) => {
					// Map text back to paragraph
					if (updates.text !== undefined) {
						setAttributes({ paragraph: updates.text });
					} else {
						setAttributes(updates);
					}
				}}
				prefix=""
				tag={paragraphTag}
			/>
		) : null;

		// Button
		const buttonElement = enableButton ? (
			<a
				href={buttonUrl}
				className={getButtonClasses()}
				onClick={(e) => e.preventDefault()}
			>
				{buttonText}
			</a>
		) : null;

		// Layout 1: Vertical
		if (featureLayout === 'vertical') {
			return (
				<>
					{iconElement}
					{titleElement}
					{paragraphElement}
					{buttonElement}
				</>
			);
		}

		// Layout 2: Horizontal
		return (
			<>
				<div>
					{iconElement}
				</div>
				<div>
					{titleElement}
					{paragraphElement}
					{buttonElement}
				</div>
			</>
		);
	};

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
												setAttributes({ 
													featureLayout: 'vertical',
													iconWrapperStyle: 'btn',
													iconBtnVariant: 'soft',
													iconColor: 'yellow',
													iconWrapperClass: 'pe-none mb-5',
													buttonColor: 'yellow',
												});
											}}
										>
											{__('Feature 1', 'codeweber-blocks')}
										</Button>
										<Button
											variant={featureLayout === 'horizontal' ? 'primary' : 'secondary'}
											onClick={() => {
												setAttributes({ 
													featureLayout: 'horizontal',
													iconWrapperStyle: 'btn-circle',
													iconBtnVariant: 'solid',
													iconColor: 'primary',
													iconWrapperClass: 'me-5',
													buttonColor: '',
												});
											}}
										>
											{__('Feature 2', 'codeweber-blocks')}
										</Button>
									</ButtonGroup>
								</PanelBody>
							)}

							{/* ICON TAB */}
							{tab.name === 'icon' && (
								<PanelBody>
									<IconControl
										attributes={attributes}
										setAttributes={setAttributes}
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
											enableSubtitle: false, // Subtitle не используется в Feature
											enableText: enableParagraph, // Map enableParagraph to enableText
											text: paragraph, // Map paragraph to text
										}}
										setAttributes={(updates) => {
											// Map text back to paragraph
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
											setAttributes(mappedUpdates);
										}}
										hideSubtitle={true}
									/>
									<div style={{ marginTop: '16px' }}>
										<HeadingTypographyControl
											attributes={{
												...attributes,
												// Map paragraph attributes to text for HeadingTypographyControl
												textTag: paragraphTag,
												textColor: paragraphColor,
												textColorType: paragraphColorType,
												textSize: paragraphSize,
												textWeight: paragraphWeight,
												textTransform: paragraphTransform,
												textClass: paragraphClass,
											}}
											setAttributes={(updates) => {
												// Map text attributes back to paragraph
												const mappedUpdates = {};
												Object.keys(updates).forEach((key) => {
													if (key.startsWith('text')) {
														const paragraphKey = key.replace(/^text/, 'paragraph');
														mappedUpdates[paragraphKey] = updates[key];
													} else {
														mappedUpdates[key] = updates[key];
													}
												});
												setAttributes(mappedUpdates);
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
										label={__('Enable Button', 'codeweber-blocks')}
										checked={enableButton}
										onChange={(value) => setAttributes({ enableButton: value })}
									/>
									{enableButton && (
										<>
											<TextControl
												label={__('Button Text', 'codeweber-blocks')}
												value={buttonText}
												onChange={(value) => setAttributes({ buttonText: value })}
											/>
											<TextControl
												label={__('Button URL', 'codeweber-blocks')}
												value={buttonUrl}
												onChange={(value) => setAttributes({ buttonUrl: value })}
											/>
											<ComboboxControl
												label={__('Button Color', 'codeweber-blocks')}
												value={buttonColor}
												options={colors}
												onChange={(value) => setAttributes({ buttonColor: value })}
											/>
											<TextControl
												label={__('Button Classes', 'codeweber-blocks')}
												value={buttonClass}
												onChange={(value) => setAttributes({ buttonClass: value })}
												help={__('Default: more hover', 'codeweber-blocks')}
											/>
										</>
									)}
								</PanelBody>
							)}

							{/* CARD TAB */}
							{tab.name === 'card' && (
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
									<BorderRadiusControl
										value={borderRadius}
										onChange={(value) => setAttributes({ borderRadius: value })}
									/>
									<ShadowControl
										value={shadow}
										onChange={(value) => setAttributes({ shadow: value })}
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
											onChange={(key, value) => setAttributes({ [key]: value })}
										/>
									</div>
									<div style={{ marginTop: '16px' }}>
										<BackgroundSettingsPanel
											attributes={attributes}
											setAttributes={setAttributes}
										/>
									</div>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			<div {...blockProps}>
				{enableCard ? (
					enableCardBody ? (
						<div className={`card-body ${layoutClasses}`.trim()}>
							{renderContent()}
						</div>
					) : (
						<div className={layoutClasses}>
							{renderContent()}
						</div>
					)
				) : (
					<div className={layoutClasses}>
						{renderContent()}
					</div>
				)}
			</div>
		</>
	);
};

export default Edit;

