import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TabPanel, TextControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Icon, layout as layoutIcon, edit, image, cog, button } from '@wordpress/icons';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { ParagraphControl } from '../../components/paragraph/ParagraphControl';
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';
// import { LinkTypeSelector } from '../../utilities/link_type'; // Временно отключено для диагностики
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

const LAYOUTS = [
	{ label: __('Layout 1', 'codeweber-gutenberg-blocks'), value: 'layout1' },
	{ label: __('Layout 2', 'codeweber-gutenberg-blocks'), value: 'layout2' },
	{ label: __('Layout 3', 'codeweber-gutenberg-blocks'), value: 'layout3' },
	{ label: __('Layout 4', 'codeweber-gutenberg-blocks'), value: 'layout4' },
	{ label: __('Layout 5', 'codeweber-gutenberg-blocks'), value: 'layout5' },
	{ label: __('Layout 6', 'codeweber-gutenberg-blocks'), value: 'layout6' },
	{ label: __('Layout 7', 'codeweber-gutenberg-blocks'), value: 'layout7' },
];

export const BannerSidebar = ({ attributes, setAttributes }) => {
	const {
		layout,
		title,
		subtitle,
		paragraph,
		buttonText,
		buttonText2,
		buttonUrl,
		buttonUrl2,
		buttonClass,
		buttonClass2,
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
		containerClass,
		textAlign,
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
		{ name: 'content', title: <TabIcon icon={edit} label={__('Content', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'buttons', title: <TabIcon icon={button} label={__('Buttons', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'images', title: <TabIcon icon={image} label={__('Images', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'background', title: <TabIcon icon={image} label={__('Background', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{tab.name === 'layout' && (
						<PanelBody title={__('Layout', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<SelectControl
								label={__('Select Layout', 'codeweber-gutenberg-blocks')}
								value={layout}
								options={LAYOUTS}
								onChange={(value) => setAttributes({ layout: value })}
							/>
						</PanelBody>
					)}

					{tab.name === 'content' && (
						<PanelBody title={__('Content', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<HeadingContentControl
								attributes={{
									enableTitle: true,
									enableSubtitle: layout !== 'layout1' && layout !== 'layout5' && layout !== 'layout6' && layout !== 'layout7',
									enableText: true,
									title,
									subtitle,
									titleTag: attributes.titleTag || 'h1',
									subtitleTag: attributes.subtitleTag || 'h2',
								}}
								setAttributes={setAttributes}
								hideSubtitle={layout === 'layout1' || layout === 'layout5' || layout === 'layout6' || layout === 'layout7'}
							/>

							<ParagraphControl
								attributes={attributes}
								setAttributes={setAttributes}
								prefix=""
								label={__('Paragraph', 'codeweber-gutenberg-blocks')}
							/>
						</PanelBody>
					)}

					{tab.name === 'buttons' && (
						<>
							{(layout === 'layout1' || layout === 'layout4' || layout === 'layout5' || layout === 'layout6' || layout === 'layout7') && (
								<PanelBody title={__('Buttons', 'codeweber-gutenberg-blocks')} initialOpen={true}>
									<div className="mb-3">
										<label>{__('Button 1 Text', 'codeweber-gutenberg-blocks')}</label>
										<input
											type="text"
											className="components-text-control__input"
											value={buttonText}
											onChange={(e) => setAttributes({ buttonText: e.target.value })}
											placeholder={__('Enter button text...', 'codeweber-gutenberg-blocks')}
										/>
									</div>
									{/* LinkTypeSelector временно отключен */}
									<div className="mb-3">
										<label>{__('Button URL', 'codeweber-gutenberg-blocks')}</label>
										<input
											type="text"
											className="components-text-control__input"
											value={buttonUrl}
											onChange={(e) => setAttributes({ buttonUrl: e.target.value })}
											placeholder={__('Enter URL...', 'codeweber-gutenberg-blocks')}
										/>
									</div>
									{(layout === 'layout1' || layout === 'layout4') && (
										<>
											<div className="mb-3">
												<label>{__('Button 2 Text', 'codeweber-gutenberg-blocks')}</label>
												<input
													type="text"
													className="components-text-control__input"
													value={buttonText2}
													onChange={(e) => setAttributes({ buttonText2: e.target.value })}
													placeholder={__('Enter button text...', 'codeweber-gutenberg-blocks')}
												/>
											</div>
											<div className="mb-3">
												<label>{__('Button 2 URL', 'codeweber-gutenberg-blocks')}</label>
												<input
													type="text"
													className="components-text-control__input"
													value={buttonUrl2}
													onChange={(e) => setAttributes({ buttonUrl2: e.target.value })}
													placeholder={__('Enter URL...', 'codeweber-gutenberg-blocks')}
												/>
											</div>
										</>
									)}
								</PanelBody>
							)}

							{(layout === 'layout2' || layout === 'layout3' || layout === 'layout5') && (
								<PanelBody title={__('Button', 'codeweber-gutenberg-blocks')} initialOpen={true}>
									<div className="mb-3">
										<label>{__('Button Text', 'codeweber-gutenberg-blocks')}</label>
										<input
											type="text"
											className="components-text-control__input"
											value={buttonText}
											onChange={(e) => setAttributes({ buttonText: e.target.value })}
											placeholder={__('Enter button text...', 'codeweber-gutenberg-blocks')}
										/>
									</div>
									{/* LinkTypeSelector временно отключен */}
									<div className="mb-3">
										<label>{__('Button URL', 'codeweber-gutenberg-blocks')}</label>
										<input
											type="text"
											className="components-text-control__input"
											value={buttonUrl}
											onChange={(e) => setAttributes({ buttonUrl: e.target.value })}
											placeholder={__('Enter URL...', 'codeweber-gutenberg-blocks')}
										/>
									</div>
								</PanelBody>
							)}
						</>
					)}

					{tab.name === 'images' && (
						<>
							{(layout === 'layout1' || layout === 'layout3' || layout === 'layout6' || layout === 'layout7') && (
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
						</>
					)}

					{tab.name === 'background' && (
						<PanelBody title={__('Background', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<BackgroundSettingsPanel
								attributes={attributes}
								setAttributes={setAttributes}
								allowVideo={layout === 'layout7'}
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
							{layout === 'layout7' && (
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

					{tab.name === 'buttons' && (
						<PanelBody title={__('Button 1', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<TextControl
								label={__('Button Text', 'codeweber-gutenberg-blocks')}
								value={buttonText}
								onChange={(value) => setAttributes({ buttonText: value })}
								placeholder={__('Enter button text...', 'codeweber-gutenberg-blocks')}
							/>
							<TextControl
								label={__('Button URL', 'codeweber-gutenberg-blocks')}
								value={buttonUrl}
								onChange={(value) => setAttributes({ buttonUrl: value })}
								placeholder={__('Enter URL...', 'codeweber-gutenberg-blocks')}
							/>
							<TextControl
								label={__('Button Classes', 'codeweber-gutenberg-blocks')}
								value={buttonClass}
								onChange={(value) => setAttributes({ buttonClass: value })}
								placeholder={__('btn btn-lg btn-primary', 'codeweber-gutenberg-blocks')}
								help={__('CSS classes for the button', 'codeweber-gutenberg-blocks')}
							/>
						</PanelBody>
					)}

					{tab.name === 'settings' && (
						<PanelBody title={__('Settings', 'codeweber-gutenberg-blocks')} initialOpen={false}>
							{/* Дополнительные настройки можно добавить здесь */}
						</PanelBody>
					)}
				</>
			)}
		</TabPanel>
	);
};

