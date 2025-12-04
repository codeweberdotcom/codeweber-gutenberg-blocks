import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, image, grid, cog, search } from '@wordpress/icons';
import { ImageControl } from '../../components/image/ImageControl';
import { LayoutControl } from './controls/LayoutControl';
import { LightboxControl } from '../../components/lightbox/LightboxControl';
import { BorderRadiusControl } from '../../components/border-radius';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span 
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

export const ImageSimpleSidebar = ({ attributes, setAttributes }) => {
	const tabs = [
		{ name: 'images', title: <TabIcon icon={image} label={__('Images', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'layout', title: <TabIcon icon={grid} label={__('Layout', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'lightbox', title: <TabIcon icon={search} label={__('Lightbox', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<InspectorControls>
			<TabPanel tabs={tabs}>
				{(tab) => (
					<>
						{/* IMAGES TAB */}
						{tab.name === 'images' && (
							<PanelBody>
								<ImageControl
									images={attributes.images}
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

								<div style={{ marginTop: '16px' }}>
									<BorderRadiusControl
										value={attributes.borderRadius}
										onChange={(value) => setAttributes({ borderRadius: value })}
									/>
								</div>
							</PanelBody>
						)}

						{/* LIGHTBOX TAB */}
						{tab.name === 'lightbox' && (
							<PanelBody>
								<LightboxControl
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

