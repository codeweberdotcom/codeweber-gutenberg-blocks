import { __ } from '@wordpress/i18n';
import { PanelBody, Button, ToggleControl, SelectControl } from '@wordpress/components';

const TEXT_COLOR_OPTIONS = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: 'none' },
	{ label: __('White', 'codeweber-gutenberg-blocks'), value: 'text-white' },
	{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'text-dark' },
	{
		label: __('Inverse', 'codeweber-gutenberg-blocks'),
		value: 'text-inverse',
	},
];

const MIN_HEIGHT_OPTIONS = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: '25vh', value: 'min-vh-25' },
	{ label: '30vh', value: 'min-vh-30' },
	{ label: '50vh', value: 'min-vh-50' },
	{ label: '60vh', value: 'min-vh-60' },
	{ label: '70vh', value: 'min-vh-70' },
	{ label: '80vh', value: 'min-vh-80' },
	{ label: '100vh', value: 'min-vh-100' },
];

const SECTION_TAG_OPTIONS = [
	{ label: 'section', value: 'section' },
	{ label: 'header', value: 'header' },
	{ label: 'footer', value: 'footer' },
	{ label: 'article', value: 'article' },
	{ label: 'aside', value: 'aside' },
	{ label: 'address', value: 'address' },
	{ label: 'nav', value: 'nav' },
];

export const SectionSettingsPanel = ({
	sectionTag,
	textColor,
	sectionFrame,
	overflowHidden,
	positionRelative,
	minHeight,
	onSectionTagChange,
	onTextColorChange,
	onSectionChange,
}) => (
	<PanelBody
		title={__('Section Settings', 'codeweber-gutenberg-blocks')}
		className="custom-panel-body"
		initialOpen={true}
	>
		<SelectControl
			label={__('Wrapper Tag', 'codeweber-gutenberg-blocks')}
			value={sectionTag || 'section'}
			options={SECTION_TAG_OPTIONS}
			onChange={onSectionTagChange}
		/>
		<div className="component-sidebar-title">
			<label>{__('Text Color', 'codeweber-gutenberg-blocks')}</label>
		</div>
		<div className="button-group-sidebar_33">
			{TEXT_COLOR_OPTIONS.map((color) => (
				<Button
					key={color.value}
					isPrimary={textColor === color.value}
					onClick={() => onTextColorChange(color.value)}
				>
					{color.label}
				</Button>
			))}
		</div>

		<ToggleControl
			label={__('Section Frame', 'codeweber-gutenberg-blocks')}
			checked={sectionFrame}
			onChange={(checked) => onSectionChange('sectionFrame', checked)}
		/>
		<ToggleControl
			label={__('Overflow Hidden', 'codeweber-gutenberg-blocks')}
			checked={overflowHidden}
			onChange={(checked) => onSectionChange('overflowHidden', checked)}
		/>
		<ToggleControl
			label={__('Position Relative', 'codeweber-gutenberg-blocks')}
			checked={positionRelative}
			onChange={(checked) => onSectionChange('positionRelative', checked)}
		/>

		<div className="component-sidebar-title">
			<label>{__('Min Height', 'codeweber-gutenberg-blocks')}</label>
		</div>
		<div className="button-group-sidebar_33">
			{MIN_HEIGHT_OPTIONS.map((height) => (
				<Button
					key={height.value}
					isPrimary={minHeight === height.value}
					onClick={() => onSectionChange('minHeight', height.value)}
				>
					{height.label}
				</Button>
			))}
		</div>
	</PanelBody>
);

export default SectionSettingsPanel;
