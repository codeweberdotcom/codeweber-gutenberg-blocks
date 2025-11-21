import { __ } from '@wordpress/i18n';
import { PanelBody, ButtonGroup, Button } from '@wordpress/components';

const ALIGN_ITEMS_OPTIONS = [
	{ value: '', label: __('Default', 'codeweber-blocks') },
	{ value: 'align-items-start', label: __('Start', 'codeweber-blocks') },
	{ value: 'align-items-center', label: __('Center', 'codeweber-blocks') },
	{ value: 'align-items-end', label: __('End', 'codeweber-blocks') },
	{ value: 'align-items-stretch', label: __('Stretch', 'codeweber-blocks') },
];

const JUSTIFY_CONTENT_OPTIONS = [
	{ value: '', label: __('Default', 'codeweber-blocks') },
	{ value: 'justify-content-start', label: __('Start', 'codeweber-blocks') },
	{ value: 'justify-content-center', label: __('Center', 'codeweber-blocks') },
	{ value: 'justify-content-end', label: __('End', 'codeweber-blocks') },
	{ value: 'justify-content-between', label: __('Between', 'codeweber-blocks') },
	{ value: 'justify-content-around', label: __('Around', 'codeweber-blocks') },
	{ value: 'justify-content-evenly', label: __('Evenly', 'codeweber-blocks') },
];

const TEXT_ALIGN_OPTIONS = [
	{ value: '', label: __('Default', 'codeweber-blocks') },
	{ value: 'text-start', label: __('Start', 'codeweber-blocks') },
	{ value: 'text-center', label: __('Center', 'codeweber-blocks') },
	{ value: 'text-end', label: __('End', 'codeweber-blocks') },
];

const POSITION_OPTIONS = [
	{ value: '', label: __('Static', 'codeweber-blocks') },
	{ value: 'position-relative', label: __('Relative', 'codeweber-blocks') },
	{ value: 'position-absolute', label: __('Absolute', 'codeweber-blocks') },
	{ value: 'position-fixed', label: __('Fixed', 'codeweber-blocks') },
];

const renderGroup = (label, value, onChange, options) => (
	<div className="mb-3">
		<div className="component-sidebar-title">
			<label>{label}</label>
		</div>
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

export const PositioningControl = ({
	title = __('Align', 'codeweber-blocks'),
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
	if (![showAlignItems, showJustifyContent, showTextAlign, showPosition].some(Boolean)) {
		return null;
	}

	const content = (
		<>
			{showTextAlign && onTextAlignChange && renderGroup(__('Text Align', 'codeweber-blocks'), textAlign, onTextAlignChange, TEXT_ALIGN_OPTIONS)}
			{showAlignItems && onAlignItemsChange && renderGroup(__('Align Items', 'codeweber-blocks'), alignItems, onAlignItemsChange, ALIGN_ITEMS_OPTIONS)}
			{showJustifyContent && onJustifyContentChange && renderGroup(__('Justify Content', 'codeweber-blocks'), justifyContent, onJustifyContentChange, JUSTIFY_CONTENT_OPTIONS)}
			{showPosition && onPositionChange && renderGroup(__('Position', 'codeweber-blocks'), position, onPositionChange, POSITION_OPTIONS)}
		</>
	);

	if (noPanel) {
		return content;
	}

	return (
		<PanelBody	title={title}
			className="custom-panel-body"
			initialOpen={false}
		>
			{content}
		</PanelBody>
	);
};

export default PositioningControl;


