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

	// Fetch image sizes when imageId changes
	useEffect(() => {
		if (imageId && imageId > 0) {
			apiFetch({
				path: `/wp/v2/media/${imageId}`,
				method: 'GET'
			}).then((attachment) => {
				if (attachment && attachment.media_details && attachment.media_details.sizes) {
					const sizes = Object.keys(attachment.media_details.sizes);
					sizes.push('full');
					setAvailableImageSizes(sizes);
				}
			}).catch(() => {
				setAvailableImageSizes([]);
			});
		}
	}, [imageId]);

	const handleImageSelect = (media) => {
		setAttributes({
			imageId: media?.id || 0,
			imageUrl: media?.url || '',
			imageAlt: media?.alt || '',
		});
	};

	const handleBackgroundImageSelect = (media) => {
		setAttributes({
			backgroundImageId: media?.id || 0,
			backgroundImageUrl: media?.url || '',
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
						<PanelBody title={__('Background', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<BackgroundSettingsPanel
								attributes={attributes}
								setAttributes={setAttributes}
								allowVideo={bannerType === 'banner-34'}
								backgroundImageSize={backgroundSize}
								availableImageSizes={availableImageSizes}
								renderImagePicker={(open) => (
									<MediaUploadCheck>
										<MediaUpload
											onSelect={handleBackgroundImageSelect}
											allowedTypes={['image']}
											value={backgroundImageId}
											render={({ open: openPicker }) => (
												<>
													{backgroundImageUrl ? (
														<div className="mb-3">
															<img src={backgroundImageUrl} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
															<button onClick={openPicker} className="components-button is-secondary mt-2" type="button">
																{__('Replace Image', 'codeweber-gutenberg-blocks')}
															</button>
															<button onClick={() => setAttributes({ backgroundImageId: 0, backgroundImageUrl: '' })} className="components-button is-secondary mt-2" type="button">
																{__('Remove Image', 'codeweber-gutenberg-blocks')}
															</button>
														</div>
													) : (
														<button onClick={openPicker} className="components-button is-primary" type="button">
															{__('Select Background Image', 'codeweber-gutenberg-blocks')}
														</button>
													)}
												</>
											)}
										/>
									</MediaUploadCheck>
								)}
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
						</PanelBody>
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

