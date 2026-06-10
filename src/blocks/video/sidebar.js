import { InspectorControls } from '@wordpress/block-editor';
import {
	TabPanel,
	PanelBody,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, image, cog } from '@wordpress/icons';
import { MediaControl } from './controls/MediaControl';
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
									{attributes.videoLightbox && (
										<TextControl
											label={__(
												'Gallery Name',
												'codeweber-gutenberg-blocks'
											)}
											help={__(
												'Videos sharing the same gallery name open in one lightbox slider.',
												'codeweber-gutenberg-blocks'
											)}
											value={attributes.lightboxGallery}
											onChange={(value) =>
												setAttributes({
													lightboxGallery: value,
												})
											}
										/>
									)}
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
