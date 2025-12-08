/**
 * Accordion Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Button,
	ButtonGroup,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

export const AccordionSidebar = ({ attributes, setAttributes }) => {
	const { accordionStyle, allowMultiple, iconPosition, iconType, firstItemOpen } = attributes;

	const handleStyleChange = (style) => {
		setAttributes({ accordionStyle: style });
	};

	const handleAllowMultipleChange = (value) => {
		setAttributes({ allowMultiple: value });
	};

	return (
		<PanelBody
			title={__('Accordion Settings', 'codeweber-gutenberg-blocks')}
			className="custom-panel-body"
		>
			{/* Accordion Style */}
			<div className="component-sidebar-title">
				<label>{__('Accordion Style', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<div className="accordion-style-controls button-group-sidebar_33">
				{[
					{ label: 'Simple', value: 'simple' },
					{ label: 'Card', value: 'background' },
					{ label: 'Icon', value: 'icon' },
				].map((style) => (
					<Button
						key={style.value}
						isPrimary={accordionStyle === style.value}
						onClick={() => handleStyleChange(style.value)}
					>
						{style.label}
					</Button>
				))}
			</div>

			{/* Icon Position */}
			<div className="component-sidebar-title">
				<label>{__('Icon Position', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<div className="button-group-sidebar_33">
				{[
					{ label: __('Left', 'codeweber-gutenberg-blocks'), value: 'left' },
					{ label: __('Right', 'codeweber-gutenberg-blocks'), value: 'right' },
				].map((pos) => (
					<Button
						key={pos.value}
						isPrimary={(iconPosition || 'left') === pos.value}
						onClick={() => setAttributes({ iconPosition: pos.value })}
					>
						{pos.label}
					</Button>
				))}
			</div>

			{/* Icon Type */}
			<div className="component-sidebar-title">
				<label>{__('Icon Type', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<div className="button-group-sidebar_33">
				{[
					{ label: __('Type 1', 'codeweber-gutenberg-blocks'), value: 'type-1' },
					{ label: __('Type 2', 'codeweber-gutenberg-blocks'), value: 'type-2' },
					{ label: __('Type 3', 'codeweber-gutenberg-blocks'), value: 'type-3' },
				].map((type) => (
					<Button
						key={type.value}
						isPrimary={(iconType || 'type-1') === type.value}
						onClick={() => setAttributes({ iconType: type.value })}
					>
						{type.label}
					</Button>
				))}
			</div>

			{/* Allow Multiple Open */}
			<ToggleControl
				label={__('Allow Multiple Items Open', 'codeweber-gutenberg-blocks')}
				checked={allowMultiple}
				onChange={handleAllowMultipleChange}
				help={__(
					'When enabled, multiple accordion items can be open at the same time.',
					'codeweber-gutenberg-blocks'
				)}
			/>

			{/* First item open by default */}
			<ToggleControl
				label={__('Open first item by default', 'codeweber-gutenberg-blocks')}
				checked={firstItemOpen}
				onChange={(value) => setAttributes({ firstItemOpen: value })}
				help={__(
					'When enabled, the first item is forced open (others closed).',
					'codeweber-gutenberg-blocks'
				)}
			/>
		</PanelBody>
	);
};
