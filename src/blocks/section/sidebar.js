// Импорт необходимых модулей
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	PanelBody,
	Button,
	SelectControl,
	TextareaControl,
	ToggleControl,
	RangeControl,
	FormFileUpload,
	TabPanel,
} from '@wordpress/components';
import { Icon, layout, box, image, styles, resizeCornerNE, cog, border } from '@wordpress/icons';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck
} from '@wordpress/block-editor';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { SectionSettingsPanel } from '../../components/section/SectionSettingsPanel';
import { ContainerSettingsPanel } from '../../components/section/ContainerSettingsPanel';
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { AngledControl } from '../../components/angled/AngledControl';
import { WavesControl } from '../../components/waves/WavesControl';
import { BorderSettingsPanel } from '../../components/borders';

export const SectionSidebar = ({ attributes, setAttributes }) => {
	const [imageSize, setImageSize] = useState('');
	const [videoSize, setVideoSize] = useState('');
	const [availableImageSizes, setAvailableImageSizes] = useState([]);

	const {
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageId,
		backgroundImageUrl,
		backgroundImageSize,
		backgroundSize,
		backgroundVideoId,
		backgroundVideoUrl,
		textColor,
		backgroundOverlay,
		backgroundPatternUrl,
	containerClass,
	containerType,
	containerTextAlign,
	containerAlignItems,
	containerJustifyContent,
	containerPosition,
		sectionFrame,
		overflowHidden,
		positionRelative,
		minHeight,
		sectionClass,
		sectionData,
		sectionId,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		angledEnabled,
		angledUpper,
		angledLower,
		waveTopEnabled,
		waveTopType,
		waveBottomEnabled,
		waveBottomType,
		borderRadius,
		shadow,
		borderPosition,
		borderColor,
		borderColorType,
		borderWidth,
	} = attributes;


	// Fetch current image data when component mounts or backgroundImageId changes
	useEffect(() => {
		if (backgroundImageId && backgroundImageId > 0) {
			wp.apiFetch({
				path: `/wp/v2/media/${backgroundImageId}`,
				method: 'GET'
			}).then((attachment) => {
				// Get file size
				if (attachment && attachment.media_details && attachment.media_details.filesize) {
					const sizeInBytes = attachment.media_details.filesize;
					if (sizeInBytes < 1024 * 1024) {
						setImageSize((sizeInBytes / 1024).toFixed(1) + ' KB');
					} else {
						setImageSize((sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB');
					}
				} else {
					setImageSize('');
				}
				
				// Get available sizes from media_details
				if (attachment && attachment.media_details && attachment.media_details.sizes) {
					const sizes = Object.keys(attachment.media_details.sizes);
					sizes.push('full'); // Always include full size
					setAvailableImageSizes(sizes);
				} else {
					setAvailableImageSizes(['full']);
				}
			}).catch(() => {
				setImageSize('');
				setAvailableImageSizes([]);
			});
		} else {
			setImageSize('');
			setAvailableImageSizes([]);
		}
	}, [backgroundImageId]);

	// Update image URL when backgroundImageSize changes
	useEffect(() => {
		if (backgroundImageId && backgroundImageId > 0 && backgroundImageSize) {
			// Use WordPress REST API to get image data
			wp.apiFetch({
				path: `/wp/v2/media/${backgroundImageId}`,
				method: 'GET'
			}).then((attachment) => {
				let newUrl = attachment.source_url; // Default to full size

				// Check if requested size exists in media_details
				if (backgroundImageSize !== 'full' && 
					attachment.media_details && 
					attachment.media_details.sizes && 
					attachment.media_details.sizes[backgroundImageSize]) {
					
					newUrl = attachment.media_details.sizes[backgroundImageSize].source_url;
				}

				// Update URL if different
				if (newUrl !== backgroundImageUrl) {
					setAttributes({ backgroundImageUrl: newUrl });
				}
			}).catch((error) => {
				console.error('Failed to fetch image data:', error);
			});
		}
	}, [backgroundImageSize, backgroundImageId]);

	// Fetch video size when component mounts or backgroundVideoId changes
	useEffect(() => {
		if (backgroundVideoId && backgroundVideoId > 0) {
			wp.apiFetch({
				path: `/wp/v2/media/${backgroundVideoId}`,
				method: 'GET'
			}).then((attachment) => {
				if (attachment && attachment.media_details && attachment.media_details.filesize) {
					const sizeInBytes = attachment.media_details.filesize;
					if (sizeInBytes < 1024 * 1024) {
						setVideoSize((sizeInBytes / 1024).toFixed(1) + ' KB');
					} else {
						setVideoSize((sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB');
					}
				} else {
					setVideoSize('');
				}
			}).catch(() => {
				setVideoSize('');
			});
		} else {
			setVideoSize('');
		}
	}, [backgroundVideoId]);

	const handleContainerChange = (key, value) => {
		setAttributes({ [key]: value });
	};

	const handleSectionChange = (key, value) => {
		setAttributes({ [key]: value });
	};

	const handleTextColorChange = (color) => {
		setAttributes({ textColor: color });
	};

	// Tab icon with native title tooltip
	const TabIcon = ({ icon, label }) => (
		<span 
			title={label}
			style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
		>
			<Icon icon={icon} size={20} />
		</span>
	);

	const tabs = [
		{ name: 'section', title: <TabIcon icon={layout} label={__('Section', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'container', title: <TabIcon icon={box} label={__('Container', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'background', title: <TabIcon icon={image} label={__('Background', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'borders', title: <TabIcon icon={border} label={__('Borders', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'angled', title: <TabIcon icon={styles} label={__('Dividers', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'spacing', title: <TabIcon icon={resizeCornerNE} label={__('Spacing', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<TabPanel
			tabs={tabs}
		>
			{(tab) => (
				<>
					{tab.name === 'background' && (
						<>
							<PanelBody
								title={__('Background Settings', 'codeweber-gutenberg-blocks')}
								className="custom-panel-body"
							>
							<BackgroundSettingsPanel
								attributes={attributes}
								setAttributes={setAttributes}
								allowVideo={true}
								backgroundImageSize={backgroundImageSize}
								imageSizeLabel={imageSize}
								availableImageSizes={availableImageSizes}
							/>
								{/* Background Video */}
								{backgroundType === 'video' && (
									<>
										<div className="component-sidebar-title">
											<label>{__('Background Video', 'codeweber-gutenberg-blocks')}</label>
										</div>
										{!backgroundVideoUrl && (
											<MediaUploadCheck>
												<MediaUpload
													onSelect={(media) => {
														setAttributes({
															backgroundVideoId: media.id,
															backgroundVideoUrl: media.url,
														});
													}}
													allowedTypes={['video']}
													value={backgroundVideoId}
													render={({ open }) => (
														<div
															className="video-placeholder"
															onClick={open}
															style={{
																width: '100%',
																height: '80px',
																backgroundColor: '#f0f0f0',
																border: '2px dashed #ccc',
																borderRadius: '4px',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																cursor: 'pointer',
																transition: 'all 0.2s ease'
															}}
														>
															<div style={{
																textAlign: 'center',
																color: '#666'
															}}>
																<div style={{
																	fontSize: '20px',
																	marginBottom: '4px'
																}}>
																	🎥
																</div>
																<div style={{
																	fontSize: '12px',
																	fontWeight: '500'
																}}>
																	{__('Select Video', 'codeweber-gutenberg-blocks')}
																</div>
															</div>
														</div>
													)}
												/>
											</MediaUploadCheck>
										)}
										{backgroundVideoUrl && (
											<>
												<div style={{
													marginTop: '12px',
													marginBottom: '12px',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													minHeight: '80px',
													backgroundColor: '#000',
													border: '1px solid #ddd',
													borderRadius: '4px',
													overflow: 'hidden',
													position: 'relative'
												}}
												onClick={() => {
													// Open WordPress media library and select the current video
													const mediaFrame = wp.media({
														title: __('Select Video', 'codeweber-gutenberg-blocks'),
														button: {
															text: __('Select', 'codeweber-gutenberg-blocks'),
														},
														multiple: false,
														library: {
															type: 'video'
														}
													});

													// Pre-select the current video if it's from media library
													if (backgroundVideoId && backgroundVideoId > 0) {
														mediaFrame.on('open', () => {
															const selection = mediaFrame.state().get('selection');
															const attachment = wp.media.attachment(backgroundVideoId);
															selection.add(attachment);
														});
													}

													mediaFrame.on('select', () => {
														const attachment = mediaFrame.state().get('selection').first().toJSON();
														setAttributes({
															backgroundVideoId: attachment.id,
															backgroundVideoUrl: attachment.url,
														});
													});

													mediaFrame.open();
												}}>
													<div style={{
														color: '#fff',
														fontSize: '14px',
														fontWeight: '500',
														textAlign: 'center',
														padding: '10px'
													}}>
														🎥 {__('Video loaded', 'codeweber-gutenberg-blocks')}
													</div>
													{videoSize && (
														<div style={{
															position: 'absolute',
															bottom: '4px',
															right: '4px',
															backgroundColor: 'rgba(0, 0, 0, 0.7)',
															color: '#fff',
															padding: '2px 6px',
															borderRadius: '3px',
															fontSize: '10px',
															fontWeight: '500'
														}}>
															{videoSize}
														</div>
													)}
													<div
														style={{
															position: 'absolute',
															top: '4px',
															right: '4px',
															backgroundColor: 'rgba(220, 53, 69, 0.8)',
															color: '#fff',
															width: '20px',
															height: '20px',
															borderRadius: '50%',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															cursor: 'pointer',
															fontSize: '12px'
														}}
														onClick={(e) => {
															e.stopPropagation();
															setAttributes({
																backgroundVideoId: 0,
																backgroundVideoUrl: '',
															});
														}}
														title={__('Remove Video', 'codeweber-gutenberg-blocks')}
													>
														<i className="uil uil-times" style={{ margin: 0 }}></i>
													</div>
												</div>
											</>
										)}
									</>
								)}
							</PanelBody>
						</>
					)}

					{tab.name === 'borders' && (
						<PanelBody>
							<BorderSettingsPanel
								borderRadius={borderRadius}
								onBorderRadiusChange={(value) => setAttributes({ borderRadius: value })}
								shadow={shadow}
								onShadowChange={(value) => setAttributes({ shadow: value })}
								borderPosition={borderPosition}
								borderColor={borderColor}
								borderColorType={borderColorType || 'solid'}
								borderWidth={borderWidth}
								showPosition={true}
								showBorderRadius={true}
								showShadow={true}
								onBorderPositionChange={(value) => setAttributes({ borderPosition: value })}
								onBorderColorChange={(value) => setAttributes({ borderColor: value })}
								onBorderColorTypeChange={(value) => setAttributes({ borderColorType: value })}
								onBorderWidthChange={(value) => setAttributes({ borderWidth: value })}
							/>
						</PanelBody>
					)}

					{tab.name === 'angled' && (
						<div style={{ padding: '16px' }}>
							<PanelBody title={__('Angles', 'codeweber-gutenberg-blocks')} initialOpen={true}>
								<AngledControl
									angledEnabled={angledEnabled}
									angledUpper={angledUpper}
									angledLower={angledLower}
									onAngledEnabledChange={(value) => setAttributes({ angledEnabled: value })}
									onAngledUpperChange={(value) => setAttributes({ angledUpper: value })}
									onAngledLowerChange={(value) => setAttributes({ angledLower: value })}
								/>
							</PanelBody>
							<PanelBody title={__('Waves', 'codeweber-gutenberg-blocks')} initialOpen={false}>
								<WavesControl
									waveTopEnabled={waveTopEnabled}
									waveTopType={waveTopType}
									waveBottomEnabled={waveBottomEnabled}
									waveBottomType={waveBottomType}
									onWaveTopEnabledChange={(value) => setAttributes({ waveTopEnabled: value })}
									onWaveTopTypeChange={(value) => setAttributes({ waveTopType: value })}
									onWaveBottomEnabledChange={(value) => setAttributes({ waveBottomEnabled: value })}
									onWaveBottomTypeChange={(value) => setAttributes({ waveBottomType: value })}
								/>
							</PanelBody>
						</div>
					)}

					{tab.name === 'spacing' && (
						<div style={{ padding: '16px' }}>
							<SpacingControl
								spacingType={spacingType}
								spacingXs={spacingXs}
								spacingSm={spacingSm}
								spacingMd={spacingMd}
								spacingLg={spacingLg}
								spacingXl={spacingXl}
								spacingXxl={spacingXxl}
								onChange={(key, value) => setAttributes({ [key]: value })}
							/>
						</div>
					)}

					{tab.name === 'section' && (
						<>
							<SectionSettingsPanel
								textColor={textColor}
								sectionFrame={sectionFrame}
								overflowHidden={overflowHidden}
								positionRelative={positionRelative}
								minHeight={minHeight}
								onTextColorChange={handleTextColorChange}
								onSectionChange={handleSectionChange}
							/>
						</>
					)}

					{tab.name === 'container' && (
						<>
							<ContainerSettingsPanel
								containerType={containerType}
								containerClass={containerClass}
								onContainerChange={handleContainerChange}
							/>
							<PositioningControl
								title={__('Container Align', 'codeweber-gutenberg-blocks')}
								textAlign={containerTextAlign}
								onTextAlignChange={(value) => handleContainerChange('containerTextAlign', value)}
								alignItems={containerAlignItems}
								onAlignItemsChange={(value) => handleContainerChange('containerAlignItems', value)}
								justifyContent={containerJustifyContent}
								onJustifyContentChange={(value) => handleContainerChange('containerJustifyContent', value)}
								position={containerPosition}
								onPositionChange={(value) => handleContainerChange('containerPosition', value)}
							/>
						</>
					)}

					{tab.name === 'settings' && (
						<div style={{ padding: '16px' }}>
							<BlockMetaFields
								attributes={attributes}
								setAttributes={setAttributes}
							/>
						</div>
					)}

				</>
			)}
		</TabPanel>
	);
};


