import { RichText } from '@wordpress/block-editor';
import { IconRenderSave } from '../../components/icon';
import { getClassNames } from '../button/buttonclass';
import { getLabelPartClasses, getLabelPartTag } from './utils';

const Save = ({ attributes }) => {
	const {
		counterText,
		labelText,
		positionBottom,
		positionRight,
		cardRadiusClass,
		iconType,
		iconText,
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
		customSvgUrl,
		customSvgId,
		customSvgSize,
		showCounterClass,
		blockClass,
		blockData,
		blockId,
		displayType,
		badgeColor,
		cardAbsolute,
		enableIcon,
		enableTitle,
		enableText,
		titleTag,
		textTag,
		ButtonType,
		ButtonIconPosition,
		LeftIcon,
		RightIcon,
	} = attributes;

	// Parse data attributes
	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	// Badge type
	if (displayType === 'badge') {
		const badgeClasses = [
			'badge',
			`bg-${badgeColor || 'primary'}`,
			'rounded-pill',
			blockClass,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<RichText.Content
				tagName="span"
				className={badgeClasses}
				id={blockId || undefined}
				value={labelText}
				{...dataAttributes}
			/>
		);
	}

	// Button type (no link — rendered as <span>)
	if (displayType === 'button') {
		const btnClasses = getClassNames(attributes, { forSave: true });
		const hasLeftIcon =
			ButtonType === 'icon' && ButtonIconPosition === 'left' && LeftIcon;
		const hasRightIcon =
			ButtonType === 'icon' && ButtonIconPosition === 'right' && RightIcon;

		return (
			<span
				className={btnClasses || undefined}
				id={blockId || undefined}
				{...dataAttributes}
			>
				{hasLeftIcon && <i className={LeftIcon}></i>}
				<RichText.Content tagName="span" value={labelText} />
				{hasRightIcon && <i className={RightIcon}></i>}
			</span>
		);
	}

	// Card type (default — original markup)
	const cardStyle = cardAbsolute
		? {
				bottom: positionBottom || undefined,
				right: positionRight || undefined,
			}
		: undefined;

	const cardClasses = [
		'card',
		'shadow-lg',
		cardAbsolute ? 'position-absolute' : '',
		'p-0',
		cardRadiusClass,
		blockClass,
	]
		.filter(Boolean)
		.join(' ');

	const titleClasses = [
		getLabelPartClasses(attributes, 'title'),
		showCounterClass ? 'counter' : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div
			className={cardClasses}
			style={cardStyle}
			id={blockId || undefined}
			{...dataAttributes}
		>
			<div className="card-body py-4 px-5">
				<div className="d-flex flex-row align-items-center">
					{enableIcon && (
						<div>
							<IconRenderSave
								iconType={iconType}
								iconText={iconText}
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
								iconWrapperClass="pe-none mx-auto me-3"
								customSvgUrl={customSvgUrl}
								customSvgId={customSvgId}
								customSvgSize={customSvgSize}
							/>
						</div>
					)}
					{(enableTitle || enableText) && (
						<div>
							{enableTitle && (
								<RichText.Content
									tagName={getLabelPartTag(titleTag, 'div')}
									className={titleClasses}
									value={counterText}
								/>
							)}
							{enableText && (
								<RichText.Content
									tagName={getLabelPartTag(textTag, 'p')}
									className={getLabelPartClasses(
										attributes,
										'text'
									)}
									value={labelText}
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Save;
