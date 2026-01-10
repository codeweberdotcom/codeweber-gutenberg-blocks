import { __ } from '@wordpress/i18n';
import { PanelBody, ButtonGroup, Button } from '@wordpress/components';

const ALIGN_ITEMS_OPTIONS = [
	{ value: '', label: __('No', 'codeweber-gutenberg-blocks') },
	{ value: 'align-items-start', label: 'Start' },
	{ value: 'align-items-center', label: 'Center' },
	{ value: 'align-items-end', label: 'End' },
	{ value: 'align-items-stretch', label: 'Stretch' },
];

const JUSTIFY_CONTENT_OPTIONS = [
	{ value: '', label: __('No', 'codeweber-gutenberg-blocks') },
	{ value: 'justify-content-start', label: 'Start' },
	{ value: 'justify-content-center', label: 'Center' },
	{ value: 'justify-content-end', label: 'End' },
	{ value: 'justify-content-between', label: 'Between' },
	{ value: 'justify-content-around', label: 'Around' },
	{ value: 'justify-content-evenly', label: 'Evenly' },
];

const TEXT_ALIGN_OPTIONS = [
	{ value: '', label: __('No', 'codeweber-gutenberg-blocks') },
	{ value: 'text-start', label: 'Start' },
	{ value: 'text-center', label: 'Center' },
	{ value: 'text-end', label: 'End' },
];

const POSITION_OPTIONS = [
	{ value: '', label: 'Static' },
	{ value: 'position-relative', label: 'Relative' },
	{ value: 'position-absolute', label: 'Absolute' },
	{ value: 'position-fixed', label: 'Fixed' },
];

const renderGroup = (label, value, onChange, options) => {
	const classValue = value || __('No class', 'codeweber-gutenberg-blocks');

	return (
		<div className="mb-3">
			<div className="component-sidebar-title">
				<label>{label}</label>
			</div>
			{/* Отображение класса под заголовком */}
			{value && (
				<div
					style={{
						marginBottom: '16px',
						padding: '8px 12px',
						backgroundColor: 'rgb(240, 240, 241)',
						borderRadius: '4px',
						fontSize: '12px',
						fontFamily: 'monospace',
						color: 'rgb(30, 30, 30)',
					}}
				>
					<div
						style={{
							marginBottom: '4px',
							fontSize: '11px',
							fontWeight: '500',
							textTransform: 'uppercase',
							color: 'rgb(117, 117, 117)',
						}}
					>
						{__('Class', 'codeweber-gutenberg-blocks')}:
					</div>
					<div style={{ wordBreak: 'break-word' }}>{classValue}</div>
				</div>
			)}
			<ButtonGroup>
				{options.map((option) => (
					<Button
						key={option.value || 'default'}
						isPrimary={value === option.value}
						onClick={() => onChange(option.value)}
					>
						{option.label}
					</Button>
				))}
			</ButtonGroup>
		</div>
	);
};

export const PositioningControl = ({
	title = __('Align', 'codeweber-gutenberg-blocks'),
	alignItems,
	onAlignItemsChange,
	justifyContent,
	onJustifyContentChange,
	textAlign,
	onTextAlignChange,
	position,
	onPositionChange,
	showAlignItems = true,
	showJustifyContent = true,
	showTextAlign = true,
	showPosition = true,
	noPanel = false,
}) => {
	if (
		![showAlignItems, showJustifyContent, showTextAlign, showPosition].some(
			Boolean
		)
	) {
		return null;
	}

	const content = (
		<>
			{showTextAlign &&
				onTextAlignChange &&
				renderGroup(
					__('Text Align', 'codeweber-gutenberg-blocks'),
					textAlign,
					onTextAlignChange,
					TEXT_ALIGN_OPTIONS
				)}
			{showAlignItems &&
				onAlignItemsChange &&
				renderGroup(
					__('Align Items', 'codeweber-gutenberg-blocks'),
					alignItems,
					onAlignItemsChange,
					ALIGN_ITEMS_OPTIONS
				)}
			{showJustifyContent &&
				onJustifyContentChange &&
				renderGroup(
					__('Justify Content', 'codeweber-gutenberg-blocks'),
					justifyContent,
					onJustifyContentChange,
					JUSTIFY_CONTENT_OPTIONS
				)}
			{showPosition &&
				onPositionChange &&
				renderGroup(
					__('Position', 'codeweber-gutenberg-blocks'),
					position,
					onPositionChange,
					POSITION_OPTIONS
				)}
		</>
	);

	if (noPanel) {
		return content;
	}

	return (
		<PanelBody
			title={title}
			className="custom-panel-body"
			initialOpen={false}
		>
			{content}
		</PanelBody>
	);
};

export default PositioningControl;
