/**
 * Icon Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { IconRenderSave } from '../../components/icon';

/**
 * Save Component
 */
const Save = ({ attributes }) => {
	const {
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
		customSvgSize,
		blockAlign,
		blockClass,
		blockData,
		blockId,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
	} = attributes;

	// Не сохраняем если иконка не выбрана
	if (iconType === 'none') {
		return null;
	}

	const iconEl = (
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
			customSvgUrl={customSvgUrl}
			customSvgId={customSvgId}
			customSvgSize={customSvgSize}
			blockAlign={blockAlign}
			blockClass={blockClass}
			blockData={blockData}
			blockId={blockId}
		/>
	);

	if (animationEnabled && animationType) {
		return (
			<span
				data-cue={animationType}
				{...(animationDuration && { 'data-duration': animationDuration })}
				{...(animationDelay && { 'data-delay': animationDelay })}
			>
				{iconEl}
			</span>
		);
	}

	return iconEl;
};

export default Save;
