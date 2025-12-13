import { RichText } from '@wordpress/block-editor';
import { IconRenderSave } from '../../components/icon';

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
		showCounterClass,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	const cardStyle = {
		bottom: positionBottom || undefined,
		right: positionRight || undefined,
	};

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

	const cardClasses = [
		'card',
		'shadow-lg',
		'position-absolute',
		'p-0',
		cardRadiusClass,
		blockClass,
	].filter(Boolean).join(' ');

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

