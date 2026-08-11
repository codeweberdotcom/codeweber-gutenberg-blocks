import { RichText } from '@wordpress/block-editor';
import { IconRenderSave } from '../../components/icon';
import { getClassNames } from '../button/buttonclass';

const Save = ({ attributes }) => {
	const {
		counterText,
		labelText,
		positionBottom,
		positionRight,
		cardRadiusClass,
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
		customSvgUrl,
		customSvgId,
		customSvgSize,
		showCounterClass,
		blockClass,
		blockData,
		blockId,
		displayType,
		badgeColor,
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
	const cardStyle = {
		bottom: positionBottom || undefined,
		right: positionRight || undefined,
	};

	const cardClasses = [
		'card',
		'shadow-lg',
		'position-absolute',
		'p-0',
		cardRadiusClass,
		blockClass,
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
					<div>
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
							iconWrapperClass="pe-none mx-auto me-3"
							customSvgUrl={customSvgUrl}
							customSvgId={customSvgId}
							customSvgSize={customSvgSize}
						/>
					</div>
					<div>
						<RichText.Content
							tagName="div"
							className={`h3 mb-0 text-nowrap${showCounterClass ? ' counter' : ''}`}
							value={counterText}
						/>
						<RichText.Content
							tagName="p"
							className="fs-14 lh-sm mb-0 text-nowrap"
							value={labelText}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Save;
