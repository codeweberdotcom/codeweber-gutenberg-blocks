/**
 * Feature Block - Deprecated Save v1
 *
 * wrapContent used Fragment when contentWrapperClass was empty.
 */

import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { IconRenderSave } from '../../components/icon';
import { ParagraphRenderSave } from '../../components/paragraph';
import { getTitleClasses } from '../heading-subtitle/utils';
import { generateBackgroundClasses } from '../../utilities/class-generators';
import { getSpacingClasses } from '../section/utils';

const SaveDeprecatedV1 = ({ attributes }) => {
	const {
		featureLayout,
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
		customSvgSize,
		enableTitle,
		title,
		titleTag,
		enableParagraph,
		paragraph,
		paragraphTag,
		paragraphColor,
		paragraphColorType,
		paragraphSize,
		paragraphWeight,
		paragraphTransform,
		paragraphClass,
		enableButton,
		buttonText,
		buttonUrl,
		buttonColor,
		buttonClass,
		enableCard,
		enableCardBody,
		cardBodyClass,
		overflowHidden,
		h100,
		borderRadius,
		shadow,
		cardBorder,
		borderColor,
		borderPosition,
		borderWidth,
		borderColorType,
		borderAccent,
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
		imageMobileLayout,
		imageDesktopLayout,
		contentWrapperClass,
	} = attributes;

	const getCardClasses = () => {
		const classes = [];
		if (enableCard) classes.push('card');
		if (overflowHidden) classes.push('overflow-hidden');
		if (h100) classes.push('h-100');
		if (borderRadius) classes.push(borderRadius);
		if (shadow) classes.push(shadow);
		if (cardBorder || borderPosition) classes.push(cardBorder || borderPosition);
		if ((borderColor || borderWidth) && !cardBorder && !borderPosition) classes.push('border');
		if (borderWidth) classes.push(borderWidth);
		if (borderColor) {
			const colorType = borderColorType || 'solid';
			classes.push(colorType === 'soft' ? `border-soft-${borderColor}` : `border-${borderColor}`);
		}
		if (borderAccent) classes.push(borderAccent);
		classes.push(
			...generateBackgroundClasses({
				backgroundType, backgroundColor, backgroundColorType,
				backgroundGradient, backgroundImageUrl, backgroundSize,
				backgroundPatternUrl, backgroundOverlay,
			})
		);
		classes.push(
			...getSpacingClasses({
				spacingType, spacingXs, spacingSm, spacingMd,
				spacingLg, spacingXl, spacingXxl,
			})
		);
		if (blockClass) classes.push(blockClass);
		return classes.filter(Boolean).join(' ');
	};

	const getDataAttributes = () => {
		const dataAttrs = {};
		if (blockData) {
			blockData.split(',').forEach((pair) => {
				const [key, value] = pair.split('=').map((s) => s.trim());
				if (key && value) dataAttrs[`data-${key}`] = value;
			});
		}
		return dataAttrs;
	};

	const getButtonClasses = () => {
		const classes = buttonClass ? buttonClass.split(' ') : [];
		if (buttonColor) classes.push(`link-${buttonColor}`);
		return classes.filter(Boolean).join(' ');
	};

	const cardClasses = getCardClasses();
	const dataAttributes = getDataAttributes();

	const iconElement = (
		<IconRenderSave
			iconType={iconType} iconName={iconName} svgIcon={svgIcon}
			svgStyle={svgStyle} iconSize={iconSize} iconFontSize={iconFontSize}
			iconColor={iconColor} iconColor2={iconColor2} iconClass={iconClass}
			iconWrapper={iconWrapper} iconWrapperStyle={iconWrapperStyle}
			iconBtnSize={iconBtnSize} iconBtnVariant={iconBtnVariant}
			iconWrapperClass={iconWrapperClass} iconGradientColor={iconGradientColor}
			customSvgUrl={customSvgUrl} customSvgId={customSvgId} customSvgSize={customSvgSize}
		/>
	);

	const titleElement = enableTitle ? (
		<RichText.Content
			tagName={titleTag || 'h4'}
			value={title}
			className={getTitleClasses(attributes)}
		/>
	) : null;

	const paragraphElement = enableParagraph ? (
		<ParagraphRenderSave
			attributes={{
				...attributes,
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

	const buttonElement = enableButton ? (
		<a href={buttonUrl} className={getButtonClasses()}>
			{buttonText}
		</a>
	) : null;

	// Old wrapContent: Fragment when contentWrapperClass is empty
	const wrapContent = (content) =>
		contentWrapperClass
			? <div className={contentWrapperClass}>{content}</div>
			: <>{content}</>;

	const renderContent = () => {
		if (featureLayout === 'image-feature') {
			const mobileClass = imageMobileLayout === 'horizontal' ? 'flex-row' : 'flex-column';
			const desktopClass = imageDesktopLayout === 'horizontal' ? 'flex-md-row' : 'flex-md-column';
			const wrapperClass = `d-flex ${mobileClass} ${desktopClass} align-items-start gap-5`;
			return (
				<div className={wrapperClass}>
					<div className="flex-shrink-0">
						<InnerBlocks.Content />
					</div>
					{wrapContent(<>{titleElement}{paragraphElement}{buttonElement}</>)}
				</div>
			);
		}
		if (featureLayout === 'vertical') {
			return (
				<>
					{iconElement}
					{wrapContent(<>{titleElement}{paragraphElement}{buttonElement}</>)}
				</>
			);
		}
		if (featureLayout === 'horizontal') {
			return (
				<>
					<div>{iconElement}</div>
					{wrapContent(<>{titleElement}{paragraphElement}{buttonElement}</>)}
				</>
			);
		}
		return (
			<>
				<div className="d-flex flex-row align-items-center mb-4">
					{iconElement}
					{titleElement}
				</div>
				{wrapContent(<>{paragraphElement}{buttonElement}</>)}
			</>
		);
	};

	const blockProps = useBlockProps.save({
		className: cardClasses,
		id: blockId,
		...(backgroundType === 'image' && backgroundImageUrl && { 'data-image-src': backgroundImageUrl }),
		...(backgroundType === 'pattern' && backgroundPatternUrl && { 'data-image-src': backgroundPatternUrl }),
		...dataAttributes,
		...(animationEnabled && animationType && {
			'data-cue': animationType,
			...(animationDuration && { 'data-duration': animationDuration }),
			...(animationDelay && { 'data-delay': animationDelay }),
		}),
	});

	const layoutClasses = featureLayout === 'horizontal' ? 'd-flex flex-row' : '';

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
				<div className={`card-body ${layoutClasses} ${cardBodyClass || ''}`.trim()}>
					{renderContent()}
				</div>
			) : (
				<div className={layoutClasses}>{renderContent()}</div>
			)}
		</div>
	);
};

export default SaveDeprecatedV1;
