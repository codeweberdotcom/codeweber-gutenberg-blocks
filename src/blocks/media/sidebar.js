import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, image, starFilled, search, cog } from '@wordpress/icons';
import { MediaControl } from './controls/MediaControl';
import { ImageHoverControl } from '../../components/image-hover/ImageHoverControl';
import { LightboxControl } from '../../components/lightbox/LightboxControl';
import { BorderRadiusControl } from '../../components/border-radius';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

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

export const ImageSidebar = ({ attributes, setAttributes }) => {
	const tabs = [
		{
			name: 'media',
			title: (
				<TabIcon
					icon={image}
					label={__('Media', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'effects',
			title: (
				<TabIcon
					icon={starFilled}
					label={__('Effects', 'codeweber-gutenberg-blocks')}
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
						{/* MEDIA TAB */}
						{tab.name === 'media' && (
							<PanelBody>
								<MediaControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>

								{/* Video Lightbox Settings */}
								{attributes.mediaType === 'video' && (
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
								)}

								{/* Border Radius */}
								{attributes.mediaType === 'image' &&
									attributes.image.url && (
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

						{/* EFFECTS TAB */}
						{tab.name === 'effects' && (
							<PanelBody>
								{attributes.mediaType === 'image' &&
								attributes.image.url ? (
									<ImageHoverControl
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								) : (
									<p
										style={{
											color: '#757575',
											fontSize: '13px',
										}}
									>
										{__(
											'Hover effects are only available for images.',
											'codeweber-gutenberg-blocks'
										)}
									</p>
								)}
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
