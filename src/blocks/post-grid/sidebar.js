import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, cog, grid, starFilled, layout } from '@wordpress/icons';
import { MainControl } from './controls/MainControl';
import { LayoutControl } from './controls/LayoutControl';
import { BorderRadiusControl } from '../../components/border-radius';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { ImageHoverControl } from '../../components/image-hover/ImageHoverControl';
import { LoadMoreControl } from '../../components/load-more';
import { PostGridTemplateControl } from '../../components/post-grid-template';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span 
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

export const PostGridSidebar = ({ attributes, setAttributes }) => {
	const tabs = [
		{ name: 'main', title: <TabIcon icon={cog} label={__('Main', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'template', title: <TabIcon icon={layout} label={__('Template', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'layout', title: <TabIcon icon={grid} label={__('Layout', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'effects', title: <TabIcon icon={starFilled} label={__('Effects', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
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

						{/* TEMPLATE TAB */}
						{tab.name === 'template' && (
							<PanelBody>
								<PostGridTemplateControl
									value={attributes.template || 'default'}
									onChange={(value) => setAttributes({ template: value })}
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
								<div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #ddd' }}>
									<PanelBody title={__('Load More', 'codeweber-gutenberg-blocks')} initialOpen={false}>
										<LoadMoreControl 
											attributes={attributes} 
											setAttributes={setAttributes}
											attributePrefix="loadMore"
										/>
									</PanelBody>
								</div>

								<div style={{ marginTop: '16px' }}>
									<BorderRadiusControl
										value={attributes.borderRadius}
										onChange={(value) => setAttributes({ borderRadius: value })}
									/>
								</div>
							</PanelBody>
						)}

						{/* EFFECTS TAB */}
						{tab.name === 'effects' && (
							<PanelBody>
								<ImageHoverControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</PanelBody>
						)}

						{/* SETTINGS TAB */}
						{tab.name === 'settings' && (
							<PanelBody>
								<BlockMetaFields
									attributes={attributes}
									setAttributes={setAttributes}
									fieldKeys={{
										classKey: 'blockClass',
										dataKey: 'blockData',
										idKey: 'blockId',
									}}
									labels={{
										classLabel: __('Block Class', 'codeweber-gutenberg-blocks'),
										dataLabel: __('Block Data', 'codeweber-gutenberg-blocks'),
										idLabel: __('Block ID', 'codeweber-gutenberg-blocks'),
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

