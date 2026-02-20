/**
 * Widget Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TabPanel,
	BaseControl,
	ButtonGroup,
	Button,
} from '@wordpress/components';
import { Icon, typography, cog } from '@wordpress/icons';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<Icon icon={icon} size={20} />
	</span>
);

export const WidgetSidebar = ({ attributes, setAttributes }) => {
	// Define tabs
	const tabs = [
		{
			name: 'title',
			title: (
				<TabIcon
					icon={typography}
					label={__('Title', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'settings',
			title: (
				<TabIcon
					icon={cog}
					label={__('Settings', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{/* TITLE TAB */}
					{tab.name === 'title' && (
						<PanelBody
							title={__(
								'Title Settings',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							<HeadingContentControl
								attributes={{
									...attributes,
									enableSubtitle: false,
									enableText: false,
								}}
								setAttributes={setAttributes}
								hideSubtitle={true}
								hideText={true}
								hideTitle={false}
							/>
							{attributes.enableTitle && (
								<BaseControl
									label={__(
										'Line type',
										'codeweber-gutenberg-blocks'
									)}
									className="mb-3"
								>
									<ButtonGroup>
										<Button
											isPressed={
												attributes.titleLineType ===
												'default'
											}
											onClick={() =>
												setAttributes({
													titleLineType: 'default',
													titleSize: 'h4',
													titleTransform: '',
													titleColor: '',
												})
											}
										>
											{__(
												'Default',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
										<Button
											isPressed={
												attributes.titleLineType ===
												'line'
											}
											onClick={() =>
												setAttributes({
													titleLineType: 'line',
													titleSize: 'fs-15',
													titleTransform:
														'text-uppercase',
													titleColor: 'ash',
												})
											}
										>
											{__(
												'Type 1',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
										<Button
											isPressed={
												attributes.titleLineType ===
												'primary'
											}
											onClick={() =>
												setAttributes({
													titleLineType: 'primary',
													titleSize: 'fs-15',
													titleTransform:
														'text-uppercase',
													titleColor: 'ash',
												})
											}
										>
											{__(
												'Type 2',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
										<Button
											isPressed={
												attributes.titleLineType ===
												'full'
											}
											onClick={() =>
												setAttributes({
													titleLineType: 'full',
													titleSize: 'fs-15',
													titleTransform:
														'text-uppercase',
													titleColor: 'ash',
												})
											}
										>
											{__(
												'Type 3',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
									</ButtonGroup>
								</BaseControl>
							)}
							<div style={{ marginTop: '16px' }}>
								<HeadingTypographyControl
									attributes={attributes}
									setAttributes={setAttributes}
									hideSubtitle={true}
									hideText={true}
								/>
							</div>
						</PanelBody>
					)}

					{/* SETTINGS TAB */}
					{tab.name === 'settings' && (
						<PanelBody
							title={__(
								'Block Settings',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							<BlockMetaFields
								attributes={attributes}
								setAttributes={setAttributes}
								fieldKeys={{
									classKey: 'widgetClass',
									dataKey: 'widgetData',
									idKey: 'widgetId',
								}}
							/>
						</PanelBody>
					)}
				</>
			)}
		</TabPanel>
	);
};
