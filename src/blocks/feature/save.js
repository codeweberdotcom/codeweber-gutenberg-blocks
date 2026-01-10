/**
 * Feature Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { RichText, useBlockProps } from '@wordpress/block-editor';
import { IconRenderSave } from '../../components/icon';
import { ParagraphRenderSave } from '../../components/paragraph';
import { getTitleClasses, getTextClasses } from '../heading-subtitle/utils';
import { generateBackgroundClasses } from '../../utilities/class-generators';
import { getSpacingClasses } from '../section/utils';

/**
 * Save Component
 */
const Save = ({ attributes }) => {
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
		iconGradientColor,
		customSvgUrl,
		customSvgId,
		// Title
		enableTitle,
		title,
		titleTag,
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
		borderPosition,
		borderWidth,
		borderColorType,
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
		blockClass,
		blockId,
		blockData,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
	} = attributes;

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

		if (cardBorder || borderPosition) {
			classes.push(cardBorder || borderPosition);
		}

		// Если выбраны цвет или ширина, но нет позиции - применяем обычный border
		if ((borderColor || borderWidth) && !cardBorder && !borderPosition) {
			classes.push('border');
		}

		if (borderWidth) {
			classes.push(borderWidth);
		}

		if (borderColor) {
			const colorType = borderColorType || 'solid';
			if (colorType === 'soft') {
				classes.push(`border-soft-${borderColor}`);
			} else {
				classes.push(`border-${borderColor}`);
			}
		}

		// Background classes
		classes.push(
			...generateBackgroundClasses({
				backgroundType,
				backgroundColor,
				backgroundColorType,
				backgroundGradient,
				backgroundImageUrl,
				backgroundSize,
				backgroundPatternUrl,
				backgroundOverlay,
			})
		);

		// Spacing classes
		classes.push(
			...getSpacingClasses({
				spacingType,
				spacingXs,
				spacingSm,
				spacingMd,
				spacingLg,
				spacingXl,
				spacingXxl,
			})
		);

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

	// Generate button classes
	const getButtonClasses = () => {
		const classes = buttonClass ? buttonClass.split(' ') : [];
		if (buttonColor) {
			classes.push(`link-${buttonColor}`);
		}
		return classes.filter(Boolean).join(' ');
	};

	const cardClasses = getCardClasses();
	const dataAttributes = getDataAttributes();

	// Icon
	const iconElement = (
		<IconRenderSave
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
			iconGradientColor={iconGradientColor}
			customSvgUrl={customSvgUrl}
			customSvgId={customSvgId}
		/>
	);

	// Title
	const titleElement = enableTitle ? (
		<RichText.Content
			tagName={titleTag || 'h4'}
			value={title}
			className={getTitleClasses(attributes)}
		/>
	) : null;

	// Paragraph
	const paragraphElement = enableParagraph ? (
		<ParagraphRenderSave
			attributes={{
				...attributes,
				// Map all paragraph attributes to text for ParagraphRenderSave
				text: paragraph,
				textColor: paragraphColor,
				textColorType: paragraphColorType,
				textSize: paragraphSize,
				textWeight: paragraphWeight,
				textTransform: paragraphTransform,
				textClass: paragraphClass,
			}}
			prefix=""
			tag={paragraphTag}
		/>
	) : null;

	// Button
	const buttonElement = enableButton ? (
		<a href={buttonUrl} className={getButtonClasses()}>
			{buttonText}
		</a>
	) : null;

	// Render content based on layout
	const renderContent = () => {
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
		if (featureLayout === 'horizontal') {
			return (
				<>
					<div>{iconElement}</div>
					<div>
						{titleElement}
						{paragraphElement}
						{buttonElement}
					</div>
				</>
			);
		}

		// Layout 3: Feature 3 (Icon + Title в одной строке)
		return (
			<>
				<div className="d-flex flex-row align-items-center mb-4">
					{iconElement}
					{titleElement}
				</div>
				{paragraphElement}
				{buttonElement}
			</>
		);
	};

	// Main wrapper with useBlockProps.save
	const blockProps = useBlockProps.save({
		className: cardClasses,
		id: blockId,
		...(backgroundType === 'image' &&
			backgroundImageUrl && { 'data-image-src': backgroundImageUrl }),
		...(backgroundType === 'pattern' &&
			backgroundPatternUrl && { 'data-image-src': backgroundPatternUrl }),
		...dataAttributes,
		...(animationEnabled &&
			animationType && {
				'data-cue': animationType,
				...(animationDuration && {
					'data-duration': animationDuration,
				}),
				...(animationDelay && { 'data-delay': animationDelay }),
			}),
	});

	// Layout classes применяются к card-body или card, не к основному контейнеру
	const layoutClasses =
		featureLayout === 'horizontal' ? 'd-flex flex-row' : '';

	// If card is disabled, just output content with layout
	if (!enableCard) {
		return (
			<div {...blockProps}>
				<div className={layoutClasses}>{renderContent()}</div>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			{enableCardBody ? (
				<div className={`card-body ${layoutClasses}`.trim()}>
					{renderContent()}
				</div>
			) : (
				<div className={layoutClasses}>{renderContent()}</div>
			)}
		</div>
	);
};

export default Save;
