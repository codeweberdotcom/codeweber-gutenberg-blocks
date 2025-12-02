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
		blockAlign,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	// Не сохраняем если иконка не выбрана
	if (iconType === 'none') {
		return null;
	}

	return (
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
			blockAlign={blockAlign}
			blockClass={blockClass}
			blockData={blockData}
			blockId={blockId}
		/>
	);
};

export default Save;

