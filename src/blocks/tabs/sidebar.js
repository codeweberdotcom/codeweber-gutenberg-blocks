/**
 * Tabs Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ButtonGroup,
	Button,
	ToggleControl,
} from '@wordpress/components';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

export const TabsSidebar = ({ attributes, setAttributes }) => {
	const {
		tabStyle,
		tabRounded,
		tabAlignment,
		tabBackground,
		tabsClass,
		tabsData,
		tabsId,
	} = attributes;

	const handleStyleChange = (style) => {
		setAttributes({ tabStyle: style });
	};

	const handleRoundedChange = (rounded) => {
		setAttributes({ tabRounded: rounded });
	};

	const handleAlignmentChange = (alignment) => {
		setAttributes({ tabAlignment: alignment });
	};

	const handleBackgroundChange = (enabled) => {
		setAttributes({ tabBackground: enabled });
	};

	return (
		<>
			<PanelBody
				title={__('Tabs Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
			>
				{/* Tab Style Selection */}
				<div className="component-sidebar-title">
					<label>
						{__('Tab Style', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<ButtonGroup>
					{[
						{
							label: __('Basic', 'codeweber-gutenberg-blocks'),
							value: 'basic',
						},
						{
							label: __('Pills', 'codeweber-gutenberg-blocks'),
							value: 'pills',
						},
						{
							label: __('Fanny', 'codeweber-gutenberg-blocks'),
							value: 'fanny',
						},
					].map((styleOption) => (
						<Button
							key={styleOption.value}
							isPrimary={tabStyle === styleOption.value}
							onClick={() => handleStyleChange(styleOption.value)}
						>
							{styleOption.label}
						</Button>
					))}
				</ButtonGroup>

				{/* Fanny Style Settings - только для стиля fanny */}
				{tabStyle === 'fanny' && (
					<>
						{/* Tab Rounded Selection */}
						<div
							className="component-sidebar-title"
							style={{ marginTop: '16px' }}
						>
							<label>
								{__(
									'Tab Rounded',
									'codeweber-gutenberg-blocks'
								)}
							</label>
						</div>
						<ButtonGroup>
							{[
								{
									label: __(
										'None',
										'codeweber-gutenberg-blocks'
									),
									value: '',
								},
								{
									label: __(
										'Rounded',
										'codeweber-gutenberg-blocks'
									),
									value: 'rounded',
								},
								{
									label: __(
										'Rounded 0',
										'codeweber-gutenberg-blocks'
									),
									value: 'rounded-0',
								},
								{
									label: __(
										'Rounded Pill',
										'codeweber-gutenberg-blocks'
									),
									value: 'rounded-pill',
								},
							].map((roundedOption) => (
								<Button
									key={roundedOption.value}
									isPrimary={
										tabRounded === roundedOption.value
									}
									onClick={() =>
										handleRoundedChange(roundedOption.value)
									}
								>
									{roundedOption.label}
								</Button>
							))}
						</ButtonGroup>

						{/* Tab Alignment Selection */}
						<div
							className="component-sidebar-title"
							style={{ marginTop: '16px' }}
						>
							<label>
								{__(
									'Tab Alignment',
									'codeweber-gutenberg-blocks'
								)}
							</label>
						</div>
						<ButtonGroup>
							{[
								{
									label: __(
										'Left',
										'codeweber-gutenberg-blocks'
									),
									value: 'left',
								},
								{
									label: __(
										'Center',
										'codeweber-gutenberg-blocks'
									),
									value: 'center',
								},
								{
									label: __(
										'Right',
										'codeweber-gutenberg-blocks'
									),
									value: 'right',
								},
							].map((alignmentOption) => (
								<Button
									key={alignmentOption.value}
									isPrimary={
										tabAlignment === alignmentOption.value
									}
									onClick={() =>
										handleAlignmentChange(
											alignmentOption.value
										)
									}
								>
									{alignmentOption.label}
								</Button>
							))}
						</ButtonGroup>

						{/* Tab Background Toggle */}
						<div style={{ marginTop: '16px' }}>
							<ToggleControl
								label={__(
									'Enable Background',
									'codeweber-gutenberg-blocks'
								)}
								checked={tabBackground === true}
								onChange={handleBackgroundChange}
							/>
						</div>
					</>
				)}
			</PanelBody>

			{/* Block Meta Fields */}
			<BlockMetaFields
				attributes={attributes}
				setAttributes={setAttributes}
				blockId={tabsId}
				blockIdLabel={__('Tabs ID', 'codeweber-gutenberg-blocks')}
				blockClass={tabsClass}
				blockClassLabel={__('Tabs Class', 'codeweber-gutenberg-blocks')}
				blockData={tabsData}
				blockDataLabel={__('Tabs Data', 'codeweber-gutenberg-blocks')}
			/>
		</>
	);
};
