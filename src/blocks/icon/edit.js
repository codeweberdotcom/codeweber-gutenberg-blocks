/**
 * Icon Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';

import { IconRender } from '../../components/icon';
import { IconSidebar } from './sidebar';

/**
 * Edit Component
 */
const Edit = ({ attributes, setAttributes }) => {
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

	// Классы блока
	const blockClasses = [
		'cwgb-icon-block',
		blockAlign ? `text-${blockAlign}` : '',
		blockClass,
	].filter(Boolean).join(' ');

	// Парсим data-атрибуты
	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	const blockProps = useBlockProps({
		className: blockClasses,
		id: blockId || undefined,
		...dataAttributes,
	});

	return (
		<>
			{/* Toolbar выравнивания */}
			<BlockControls>
				<AlignmentToolbar
					value={blockAlign}
					onChange={(value) => setAttributes({ blockAlign: value })}
				/>
			</BlockControls>

			{/* Inspector Controls */}
			<InspectorControls>
				<IconSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			{/* Preview */}
			<div {...blockProps}>
				{iconType === 'none' ? (
					<div className="cwgb-icon-placeholder">
						<span>{__('Выберите иконку в настройках', 'codeweber-blocks')}</span>
					</div>
				) : (
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
						blockAlign={blockAlign}
						blockClass={blockClass}
						blockData={blockData}
						blockId={blockId}
						isEditor={true}
					/>
				)}
			</div>
		</>
	);
};

export default Edit;

