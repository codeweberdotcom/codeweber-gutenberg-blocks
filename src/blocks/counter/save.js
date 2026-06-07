/**
 * Counter Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { RichText, useBlockProps } from '@wordpress/block-editor';
import { IconRenderSave } from '../../components/icon';
import { ParagraphRenderSave } from '../../components/paragraph';
import {
	getCounterClasses,
	getRootClasses,
	getPositionStyles,
	getDataAttributes,
	arrangeLayout,
} from './shared';

const Save = ({ attributes }) => {
	const {
		counterLayout,
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
		customSvgSize,
		// Counter number
		title,
		titleTag,
		// Label
		enableParagraph,
		paragraph,
		paragraphTag,
		paragraphColor,
		paragraphColorType,
		paragraphSize,
		paragraphWeight,
		paragraphTransform,
		paragraphClass,
		// Subtitle + ratings
		enableSubtitle,
		subtitle,
		subtitleTag,
		subtitleClass,
		enableRatings,
		ratingsValue,
		// Card
		enableCard,
		enableCardBody,
		cardBodyClass,
		backgroundType,
		backgroundImageUrl,
		backgroundPatternUrl,
		blockId,
		blockData,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
	} = attributes;

	const showIcon =
		counterLayout === 'counter-1' || counterLayout === 'counter-2';

	const icon =
		showIcon && iconType !== 'none' ? (
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
				customSvgSize={customSvgSize}
			/>
		) : null;

	const counter = (
		<RichText.Content
			tagName={titleTag || 'h3'}
			value={title}
			className={getCounterClasses(attributes)}
		/>
	);

	const label = enableParagraph ? (
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

	const subtitleEl =
		enableSubtitle && counterLayout === 'counter-4' ? (
			<RichText.Content
				tagName={subtitleTag || 'h6'}
				value={subtitle}
				className={subtitleClass || undefined}
			/>
		) : null;

	const ratings =
		enableRatings && counterLayout === 'counter-4' ? (
			<span className={`ratings ${ratingsValue}`}></span>
		) : null;

	const content = arrangeLayout(counterLayout, {
		icon,
		counter,
		label,
		subtitle: subtitleEl,
		ratings,
	});

	const blockProps = useBlockProps.save({
		className: getRootClasses(attributes),
		style: getPositionStyles(attributes),
		id: blockId || undefined,
		...(backgroundType === 'image' &&
			backgroundImageUrl && { 'data-image-src': backgroundImageUrl }),
		...(backgroundType === 'pattern' &&
			backgroundPatternUrl && { 'data-image-src': backgroundPatternUrl }),
		...getDataAttributes(blockData),
		...(animationEnabled &&
			animationType && {
				'data-cue': animationType,
				...(animationDuration && { 'data-duration': animationDuration }),
				...(animationDelay && { 'data-delay': animationDelay }),
			}),
	});

	if (enableCard && enableCardBody) {
		return (
			<div {...blockProps}>
				<div className={`card-body ${cardBodyClass || ''}`.trim()}>
					{content}
				</div>
			</div>
		);
	}

	return <div {...blockProps}>{content}</div>;
};

export default Save;
