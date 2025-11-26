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

export const SectionSidebar = ({ attributes, setAttributes }) => {
	const [imageSize, setImageSize] = useState('');
	const [videoSize, setVideoSize] = useState('');
	const [imageSizes, setImageSizes] = useState([]);

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
	} = attributes;


	// Fetch image sizes and current image data when component mounts or backgroundImageId changes
	useEffect(() => {
		// Get available image sizes from our custom REST API endpoint
		wp.apiFetch({
			path: '/codeweber-blocks/v1/image-sizes',
			method: 'GET'
		}).then((sizes) => {
			let availableSizes = sizes.map(size => ({
				value: size.value,
				label: size.label,
				width: size.width,
				height: size.height
			}));

			// Ensure full size is always available
			if (!availableSizes.find(size => size.value === 'full')) {
				availableSizes.push({
					value: 'full',
					label: 'Full Size',
					width: null,
					height: null
				});
			}

			// Sort sizes by label for better UX
			availableSizes.sort((a, b) => a.label.localeCompare(b.label));

			setImageSizes(availableSizes);
		}).catch((error) => {
			console.error('Failed to fetch image sizes:', error);
			// Fallback to basic sizes
			const fallbackSizes = [
				{ value: 'thumbnail', label: 'Thumbnail (150x150)', width: 150, height: 150 },
				{ value: 'medium', label: 'Medium (300x300)', width: 300, height: 300 },
				{ value: 'large', label: 'Large (1024x1024)', width: 1024, height: 1024 },
				{ value: 'full', label: 'Full Size', width: null, height: null }
			];
			setImageSizes(fallbackSizes);
		});

		if (backgroundImageId && backgroundImageId > 0) {
			wp.apiFetch({
				path: `/wp/v2/media/${backgroundImageId}`,
				method: 'GET'
			}).then((attachment) => {
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
			}).catch(() => {
				setImageSize('');
			});
		} else {
			setImageSize('');
		}
	}, [backgroundImageId]);

	// Update image URL when backgroundImageSize changes
	useEffect(() => {
		if (backgroundImageId && backgroundImageId > 0) {
			// Use WordPress function to get the correct image URL for the selected size
			const imageData = wp.media.attachment(backgroundImageId);
			if (imageData) {
				imageData.fetch().then(() => {
					const sizeUrl = imageData.get('url');
					const sizes = imageData.get('sizes');

					let newUrl = sizeUrl; // Default to full size

					if (backgroundImageSize && backgroundImageSize !== 'full' && sizes && sizes[backgroundImageSize]) {
						newUrl = sizes[backgroundImageSize].url;
					}

					// Only update if URL is different
					if (newUrl !== backgroundImageUrl) {
						setAttributes({ backgroundImageUrl: newUrl });
					}
				}).catch((error) => {
					console.error('Failed to fetch image data:', error);
				});
			}
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

	const tabs = [
		{ name: 'section', title: 'Sec' },
		{ name: 'background', title: 'Bg' },
		{ name: 'spacing', title: 'Spc' },
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
								title={__('Background Settings', 'codeweber-blocks')}
								className="custom-panel-body"
							>
							<BackgroundSettingsPanel
								attributes={attributes}
								setAttributes={setAttributes}
								allowVideo={true}
								imageSizes={imageSizes}
								backgroundImageSize={backgroundImageSize}
								imageSizeLabel={imageSize}
							/>
								{/* Background Video */}
								{backgroundType === 'video' && (
									<>
										<div className="component-sidebar-title">
											<label>{__('Background Video', 'codeweber-blocks')}</label>
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
																	{__('Select Video', 'codeweber-blocks')}
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
														title: __('Select Video', 'codeweber-blocks'),
														button: {
															text: __('Select', 'codeweber-blocks'),
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
														🎥 {__('Video loaded', 'codeweber-blocks')}
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
														title={__('Remove Video', 'codeweber-blocks')}
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
							<ContainerSettingsPanel
								containerType={containerType}
								containerClass={containerClass}
								onContainerChange={handleContainerChange}
							/>
							<PositioningControl
								title={__('Container Align', 'codeweber-blocks')}
								textAlign={containerTextAlign}
								onTextAlignChange={(value) => handleContainerChange('containerTextAlign', value)}
								alignItems={containerAlignItems}
								onAlignItemsChange={(value) => handleContainerChange('containerAlignItems', value)}
								justifyContent={containerJustifyContent}
								onJustifyContentChange={(value) => handleContainerChange('containerJustifyContent', value)}
								position={containerPosition}
								onPositionChange={(value) => handleContainerChange('containerPosition', value)}
							/>
							<SectionSettingsPanel
								textColor={textColor}
								sectionFrame={sectionFrame}
								overflowHidden={overflowHidden}
								positionRelative={positionRelative}
								minHeight={minHeight}
								onTextColorChange={handleTextColorChange}
								onSectionChange={handleSectionChange}
							/>
							<BlockMetaFields
								attributes={attributes}
								setAttributes={setAttributes}
							/>
						</>
					)}

				</>
			)}
		</TabPanel>
	);
};


