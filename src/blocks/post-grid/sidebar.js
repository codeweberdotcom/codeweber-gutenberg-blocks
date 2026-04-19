import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, cog, grid, typography, seen, filter } from '@wordpress/icons';
import { MainControl } from './controls/MainControl';
import { LayoutControl } from './controls/LayoutControl';
import { TitleControl } from './controls/TitleControl';
import { DisplayControl } from './controls/DisplayControl';
import { FilterControl } from './controls/FilterControl';
import { BorderRadiusControl } from '../../components/border-radius';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { LoadMoreControl } from '../../components/load-more';

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

export const PostGridSidebar = ({ attributes, setAttributes }) => {
	// Display tab hidden for clients (logos only — no titles/dates).
	const hasDisplayTab = attributes.postType !== 'clients';

	const tabs = [
		{
			name: 'main',
			title: (
				<TabIcon
					icon={cog}
					label={__('Main', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'layout',
			title: (
				<TabIcon
					icon={grid}
					label={__('Layout', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'title',
			title: (
				<TabIcon
					icon={typography}
					label={__('Title', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		...(hasDisplayTab
			? [
					{
						name: 'display',
						title: (
							<TabIcon
								icon={seen}
								label={__(
									'Display',
									'codeweber-gutenberg-blocks'
								)}
							/>
						),
					},
				]
			: []),
		{
			name: 'filter',
			title: (
				<TabIcon
					icon={filter}
					label={__('Filter', 'codeweber-gutenberg-blocks')}
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
		<InspectorControls>
			<TabPanel tabs={tabs}>
				{(tab) => (
					<>
						{/* MAIN TAB */}
						{tab.name === 'main' && (
							<PanelBody>
								<MainControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</PanelBody>
						)}

						{/* LAYOUT TAB */}
						{tab.name === 'layout' && (
							<PanelBody>
								<LayoutControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>

								{/* Load More - только для Grid режима */}
								{attributes.displayMode !== 'swiper' && (
									<div
										style={{
											marginTop: '24px',
											paddingTop: '24px',
											borderTop: '1px solid #ddd',
										}}
									>
										<PanelBody
											title={__(
												'Load More',
												'codeweber-gutenberg-blocks'
											)}
											initialOpen={false}
										>
											<LoadMoreControl
												attributes={attributes}
												setAttributes={setAttributes}
												attributePrefix="loadMore"
											/>
										</PanelBody>
									</div>
								)}

								<div style={{ marginTop: '16px' }}>
									<BorderRadiusControl
										value={attributes.borderRadius}
										onChange={(value) =>
											setAttributes({
												borderRadius: value,
											})
										}
									/>
								</div>
							</PanelBody>
						)}

						{/* TITLE TAB */}
						{tab.name === 'title' && (
							<PanelBody>
								<TitleControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</PanelBody>
						)}

						{/* DISPLAY TAB */}
						{tab.name === 'display' && (
							<PanelBody>
								<DisplayControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</PanelBody>
						)}

						{/* FILTER TAB */}
						{tab.name === 'filter' && (
							<PanelBody>
								<FilterControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</PanelBody>
						)}

						{/* SETTINGS TAB */}
						{tab.name === 'settings' && (
							<PanelBody>
								<ToggleControl
									label={__(
										'Text Inverse',
										'codeweber-gutenberg-blocks'
									)}
									help={__(
										'Adds "text-inverse" class to the block wrapper (for dark backgrounds).',
										'codeweber-gutenberg-blocks'
									)}
									checked={!!attributes.textInverse}
									onChange={(value) =>
										setAttributes({ textInverse: value })
									}
								/>
								<BlockMetaFields
									attributes={attributes}
									setAttributes={setAttributes}
									fieldKeys={{
										classKey: 'blockClass',
										dataKey: 'blockData',
										idKey: 'blockId',
									}}
									labels={{
										classLabel: __(
											'Block Class',
											'codeweber-gutenberg-blocks'
										),
										dataLabel: __(
											'Block Data',
											'codeweber-gutenberg-blocks'
										),
										idLabel: __(
											'Block ID',
											'codeweber-gutenberg-blocks'
										),
									}}
								/>
							</PanelBody>
						)}
					</>
				)}
			</TabPanel>
		</InspectorControls>
	);
};
