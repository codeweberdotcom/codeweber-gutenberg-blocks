import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, image, cog, link } from '@wordpress/icons';
import { MediaControl } from './controls/MediaControl';
import { BorderRadiusControl } from '../../components/border-radius';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { LinkTypeSelector } from '../../utilities/link_type';

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

export const VideoSidebar = ({ attributes, setAttributes }) => {
	const tabs = [
		{
			name: 'media',
			title: (
				<TabIcon
					icon={image}
					label={__('Video', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'link',
			title: (
				<TabIcon
					icon={link}
					label={__('Link', 'codeweber-gutenberg-blocks')}
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
						{/* VIDEO TAB */}
						{tab.name === 'media' && (
							<PanelBody>
								<MediaControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>

								{/* Video Lightbox Settings */}
								<div style={{ marginTop: '16px' }}>
									<ToggleControl
										label={__(
											'Enable Video Lightbox',
											'codeweber-gutenberg-blocks'
										)}
										checked={attributes.videoLightbox}
										onChange={(value) =>
											setAttributes({
												videoLightbox: value,
											})
										}
									/>
								</div>

								{/* Border Radius */}
								{attributes.videoPoster.url && (
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
								)}
							</PanelBody>
						)}

						{/* LINK TAB */}
						{tab.name === 'link' && (
							<LinkTypeSelector
								attributes={attributes}
								setAttributes={setAttributes}
							/>
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
