import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TabPanel } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Icon, layout as layoutIcon, image, cog } from '@wordpress/icons';
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';
import { VideoURLControl } from '../../components/video-url/VideoURLControl';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

const BANNER_TYPES = [
	{ label: __('Banner 34', 'codeweber-gutenberg-blocks'), value: 'banner-34' },
];

export const BannersSidebar = ({ attributes, setAttributes }) => {
	const {
		bannerType,
		imageId,
		imageUrl,
		imageAlt,
		backgroundImageId,
		backgroundImageUrl,
		backgroundImageSize,
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundSize,
		sectionClass,
		videoUrl,
		videoId,
	} = attributes;

	const [availableImageSizes, setAvailableImageSizes] = useState([]);
	const [imageSize, setImageSize] = useState('');

	// Fetch current background image data when component mounts or backgroundImageId changes
	useEffect(() => {
		if (backgroundImageId && backgroundImageId > 0) {
			apiFetch({
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
			apiFetch({
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

	const handleImageSelect = (media) => {
		setAttributes({
			imageId: media?.id || 0,
			imageUrl: media?.url || '',
			imageAlt: media?.alt || '',
		});
	};


	const tabs = [
		{ name: 'layout', title: <TabIcon icon={layoutIcon} label={__('Layout', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'images', title: <TabIcon icon={image} label={__('Images', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'background', title: <TabIcon icon={image} label={__('Background', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{tab.name === 'layout' && (
						<PanelBody title={__('Banner Type', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<SelectControl
								label={__('Select Banner Type', 'codeweber-gutenberg-blocks')}
								value={bannerType}
								options={BANNER_TYPES}
								onChange={(value) => setAttributes({ bannerType: value })}
							/>
						</PanelBody>
					)}

					{tab.name === 'images' && (
						<PanelBody title={__('Image', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={handleImageSelect}
									allowedTypes={['image']}
									value={imageId}
									render={({ open }) => (
										<>
											{imageUrl ? (
												<div className="mb-3">
													<img src={imageUrl} alt={imageAlt} style={{ maxWidth: '100%', height: 'auto' }} />
													<button onClick={open} className="components-button is-secondary mt-2" type="button">
														{__('Replace Image', 'codeweber-gutenberg-blocks')}
													</button>
													<button onClick={() => setAttributes({ imageId: 0, imageUrl: '', imageAlt: '' })} className="components-button is-secondary mt-2" type="button">
														{__('Remove Image', 'codeweber-gutenberg-blocks')}
													</button>
												</div>
											) : (
												<button onClick={open} className="components-button is-primary" type="button">
													{__('Select Image', 'codeweber-gutenberg-blocks')}
												</button>
											)}
										</>
									)}
								/>
							</MediaUploadCheck>
						</PanelBody>
					)}

					{tab.name === 'background' && (
						<div style={{ padding: '16px' }}>
							<BackgroundSettingsPanel
								attributes={attributes}
								setAttributes={setAttributes}
								allowVideo={bannerType === 'banner-34'}
								backgroundImageSize={backgroundImageSize}
								imageSizeLabel={imageSize}
								availableImageSizes={availableImageSizes}
							/>
							{bannerType === 'banner-34' && (
								<div className="mb-3">
									<label>{__('Video URL', 'codeweber-gutenberg-blocks')}</label>
									<VideoURLControl
										videoType="youtube"
										value={videoUrl}
										onChange={(url) => setAttributes({ videoUrl: url })}
										forLightbox={true}
									/>
								</div>
							)}
						</div>
					)}

					{tab.name === 'settings' && (
						<PanelBody title={__('Settings', 'codeweber-gutenberg-blocks')} initialOpen={false}>
							<div className="mb-3">
								<label>{__('Section Classes', 'codeweber-gutenberg-blocks')}</label>
								<input
									type="text"
									className="components-text-control__input"
									value={sectionClass}
									onChange={(e) => setAttributes({ sectionClass: e.target.value })}
									placeholder={__('Additional CSS classes', 'codeweber-gutenberg-blocks')}
								/>
							</div>
						</PanelBody>
					)}
				</>
			)}
		</TabPanel>
	);
};

