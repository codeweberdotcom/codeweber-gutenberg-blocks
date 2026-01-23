import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	TabPanel,
	ButtonGroup,
	Button,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Icon, layout as layoutIcon, image, cog, video } from '@wordpress/icons';
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';
import { VideoURLControl } from '../../components/video-url/VideoURLControl';
import { ImageControl } from '../../components/image/ImageControl';
import { ImageHoverControl } from '../../components/image-hover/ImageHoverControl';
import { LightboxControl } from '../../components/lightbox/LightboxControl';
import { BorderRadiusControl } from '../../components/border-radius';
import { LayoutControl } from '../image-simple/controls/LayoutControl';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

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

const BANNER_TYPES = [
	{ label: __('Banner 1', 'codeweber-gutenberg-blocks'), value: 'banner-1' },
	{ label: __('Banner 2', 'codeweber-gutenberg-blocks'), value: 'banner-2' },
	{ label: __('Banner 3', 'codeweber-gutenberg-blocks'), value: 'banner-3' },
	{ label: __('Banner 4', 'codeweber-gutenberg-blocks'), value: 'banner-4' },
	{ label: __('Banner 6', 'codeweber-gutenberg-blocks'), value: 'banner-6' },
	{ label: __('Banner 7', 'codeweber-gutenberg-blocks'), value: 'banner-7' },
	{ label: __('Banner 8', 'codeweber-gutenberg-blocks'), value: 'banner-8' },
	{
		label: __('Banner 10', 'codeweber-gutenberg-blocks'),
		value: 'banner-10',
	},
	{
		label: __('Banner 11', 'codeweber-gutenberg-blocks'),
		value: 'banner-11',
	},
	{
		label: __('Banner 14', 'codeweber-gutenberg-blocks'),
		value: 'banner-14',
	},
	{
		label: __('Banner 15', 'codeweber-gutenberg-blocks'),
		value: 'banner-15',
	},
	{
		label: __('Banner 16', 'codeweber-gutenberg-blocks'),
		value: 'banner-16',
	},
	{
		label: __('Banner 18', 'codeweber-gutenberg-blocks'),
		value: 'banner-18',
	},
	{
		label: __('Banner 20', 'codeweber-gutenberg-blocks'),
		value: 'banner-20',
	},
	{
		label: __('Banner 23', 'codeweber-gutenberg-blocks'),
		value: 'banner-23',
	},
	{
		label: __('Banner 24', 'codeweber-gutenberg-blocks'),
		value: 'banner-24',
	},
	{
		label: __('Banner 25', 'codeweber-gutenberg-blocks'),
		value: 'banner-25',
	},
	{
		label: __('Banner 27', 'codeweber-gutenberg-blocks'),
		value: 'banner-27',
	},
	{
		label: __('Banner 29', 'codeweber-gutenberg-blocks'),
		value: 'banner-29',
	},
	{
		label: __('Banner 30', 'codeweber-gutenberg-blocks'),
		value: 'banner-30',
	},
	{
		label: __('Banner 32', 'codeweber-gutenberg-blocks'),
		value: 'banner-32',
	},
	{
		label: __('Banner 34', 'codeweber-gutenberg-blocks'),
		value: 'banner-34',
	},
];

export const BannersSidebar = ({ attributes, setAttributes }) => {
	const {
		bannerType,
		imageType,
		imagePosition,
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
		columnClass,
		videoUrl,
		videoId,
		modalVideoId,
		modalVideoUrl,
		images,
		imageSize,
		borderRadius,
		enableLightbox,
		lightboxGallery,
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
	} = attributes;

	const [availableImageSizes, setAvailableImageSizes] = useState([]);
	const [backgroundImageSizeLabel, setBackgroundImageSizeLabel] =
		useState('');

	// Fetch current background image data when component mounts or backgroundImageId changes
	useEffect(() => {
		if (backgroundImageId && backgroundImageId > 0) {
			apiFetch({
				path: `/wp/v2/media/${backgroundImageId}`,
				method: 'GET',
			})
				.then((attachment) => {
					// Get file size
					if (
						attachment &&
						attachment.media_details &&
						attachment.media_details.filesize
					) {
						const sizeInBytes = attachment.media_details.filesize;
						if (sizeInBytes < 1024 * 1024) {
							setBackgroundImageSizeLabel(
								(sizeInBytes / 1024).toFixed(1) + ' KB'
							);
						} else {
							setBackgroundImageSizeLabel(
								(sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB'
							);
						}
					} else {
						setBackgroundImageSizeLabel('');
					}

					// Get available sizes from media_details
					if (
						attachment &&
						attachment.media_details &&
						attachment.media_details.sizes
					) {
						const sizes = Object.keys(
							attachment.media_details.sizes
						);
						sizes.push('full'); // Always include full size
						setAvailableImageSizes(sizes);
					} else {
						setAvailableImageSizes(['full']);
					}
				})
				.catch(() => {
					setBackgroundImageSizeLabel('');
					setAvailableImageSizes([]);
				});
		} else {
			setBackgroundImageSizeLabel('');
			setAvailableImageSizes([]);
		}
	}, [backgroundImageId]);

	// Update image URL when backgroundImageSize changes
	useEffect(() => {
		if (backgroundImageId && backgroundImageId > 0 && backgroundImageSize) {
			apiFetch({
				path: `/wp/v2/media/${backgroundImageId}`,
				method: 'GET',
			})
				.then((attachment) => {
					let newUrl = attachment.source_url; // Default to full size

					// Check if requested size exists in media_details
					if (
						backgroundImageSize !== 'full' &&
						attachment.media_details &&
						attachment.media_details.sizes &&
						attachment.media_details.sizes[backgroundImageSize]
					) {
						newUrl =
							attachment.media_details.sizes[backgroundImageSize]
								.source_url;
					}

					// Update URL if different
					if (newUrl !== backgroundImageUrl) {
						setAttributes({ backgroundImageUrl: newUrl });
					}
				})
				.catch((error) => {
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
		{
			name: 'layout',
			title: (
				<TabIcon
					icon={layoutIcon}
					label={__('Layout', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		// Скрываем вкладку Images для banner-15
		...(bannerType !== 'banner-15'
			? [
					{
						name: 'images',
						title: (
							<TabIcon
								icon={image}
								label={__('Images', 'codeweber-gutenberg-blocks')}
							/>
						),
					},
				]
			: []),
		{
			name: 'background',
			title: (
				<TabIcon
					icon={image}
					label={__('Background', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		// Добавляем вкладку Video только для banner-34
		...(bannerType === 'banner-34'
			? [
					{
						name: 'video',
						title: (
							<TabIcon
								icon={video}
								label={__('Video', 'codeweber-gutenberg-blocks')}
							/>
						),
					},
				]
			: []),
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
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{tab.name === 'layout' && (
						<PanelBody
							title={__(
								'Banner Type',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							<SelectControl
								label={__(
									'Select Banner Type',
									'codeweber-gutenberg-blocks'
								)}
								value={bannerType}
								options={BANNER_TYPES}
								onChange={(value) =>
									setAttributes({ bannerType: value })
								}
							/>
						</PanelBody>
					)}

					{tab.name === 'images' && (
						<>
							<PanelBody
								title={__(
									'Image',
									'codeweber-gutenberg-blocks'
								)}
								initialOpen={true}
							>
								<div className="mb-3">
									<div className="component-sidebar-title">
										<label>
											{__(
												'Image Position',
												'codeweber-gutenberg-blocks'
											)}
										</label>
									</div>
									<ButtonGroup>
										<button
											className={`components-button ${imagePosition === 'left' ? 'is-primary' : 'is-secondary'}`}
											onClick={() =>
												setAttributes({
													imagePosition: 'left',
												})
											}
										>
											{__(
												'Left',
												'codeweber-gutenberg-blocks'
											)}
										</button>
										<button
											className={`components-button ${imagePosition === 'right' ? 'is-primary' : 'is-secondary'}`}
											onClick={() =>
												setAttributes({
													imagePosition: 'right',
												})
											}
										>
											{__(
												'Right',
												'codeweber-gutenberg-blocks'
											)}
										</button>
									</ButtonGroup>
								</div>

								<div
									className="mb-3"
									style={{ marginTop: '16px' }}
								>
									<div className="component-sidebar-title">
										<label>
											{__(
												'Image Type',
												'codeweber-gutenberg-blocks'
											)}
										</label>
									</div>
									<ButtonGroup>
										<button
											className={`components-button ${imageType === 'background' ? 'is-primary' : 'is-secondary'}`}
											onClick={() =>
												setAttributes({
													imageType: 'background',
												})
											}
										>
											{__(
												'Background',
												'codeweber-gutenberg-blocks'
											)}
										</button>
										<button
											className={`components-button ${imageType === 'image-simple' ? 'is-primary' : 'is-secondary'}`}
											onClick={() =>
												setAttributes({
													imageType: 'image-simple',
												})
											}
										>
											{__(
												'Image Simple',
												'codeweber-gutenberg-blocks'
											)}
										</button>
									</ButtonGroup>
								</div>

								{(imageType === 'background' ||
									imageType === 'image-simple') && (
									<>
										<ImageControl
											images={images || []}
											imageSize={imageSize}
											setAttributes={setAttributes}
										/>
										<div
											className="mb-3"
											style={{ marginTop: '16px' }}
										>
											<BorderRadiusControl
												value={borderRadius}
												onChange={(value) =>
													setAttributes({
														borderRadius: value,
													})
												}
											/>
										</div>
										<div
											className="mb-3"
											style={{ marginTop: '16px' }}
										>
											<ImageHoverControl
												attributes={attributes}
												setAttributes={setAttributes}
											/>
										</div>
										<div
											className="mb-3"
											style={{ marginTop: '16px' }}
										>
											<LightboxControl
												attributes={attributes}
												setAttributes={setAttributes}
											/>
										</div>
									</>
								)}
							</PanelBody>

							{/* Layout settings for Image - показываем для обоих режимов (background и image-simple) */}
							<div style={{ marginTop: '16px' }}>
								<PanelBody
									title={__(
										'Image Layout',
										'codeweber-gutenberg-blocks'
									)}
									initialOpen={false}
								>
									<LayoutControl
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</PanelBody>
							</div>
						</>
					)}

					{tab.name === 'background' && (
						<div style={{ padding: '16px' }}>
							<BackgroundSettingsPanel
								attributes={attributes}
								setAttributes={setAttributes}
								allowVideo={bannerType === 'banner-34' || bannerType === 'banner-15'}
								backgroundImageSize={backgroundImageSize}
								imageSizeLabel={backgroundImageSizeLabel}
								availableImageSizes={availableImageSizes}
							/>
							{bannerType === 'banner-34' && (
								<div className="mb-3">
									<label>
										{__(
											'Video URL',
											'codeweber-gutenberg-blocks'
										)}
									</label>
									<VideoURLControl
										videoType="youtube"
										value={videoUrl}
										onChange={(url) =>
											setAttributes({ videoUrl: url })
										}
										forLightbox={true}
									/>
								</div>
							)}
						</div>
					)}

					{tab.name === 'video' && bannerType === 'banner-34' && (
						<PanelBody
							title={__('Video', 'codeweber-gutenberg-blocks')}
							initialOpen={true}
						>
							<div className="mb-3">
								<div className="component-sidebar-title">
									<label>
										{__(
											'Modal Video',
											'codeweber-gutenberg-blocks'
										)}
									</label>
								</div>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={(media) => {
											setAttributes({
												modalVideoId: media?.id || 0,
												modalVideoUrl: media?.url || '',
											});
										}}
										allowedTypes={['video']}
										value={modalVideoId}
										render={({ open }) => (
											<>
												{!modalVideoUrl && (
													<div
														onClick={open}
														style={{
															width: '100%',
															height: '100px',
															backgroundColor: '#f0f0f0',
															border: '2px dashed #ccc',
															borderRadius: '4px',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															cursor: 'pointer',
															transition: 'all 0.2s ease',
															marginBottom: '15px',
														}}
													>
														<div
															style={{
																textAlign: 'center',
																color: '#666',
															}}
														>
															<div
																style={{
																	fontSize: '20px',
																	marginBottom: '4px',
																}}
															>
																🎥
															</div>
															<div
																style={{
																	fontSize: '12px',
																	fontWeight: '500',
																}}
															>
																{__(
																	'Select Video',
																	'codeweber-gutenberg-blocks'
																)}
															</div>
														</div>
													</div>
												)}
												{modalVideoUrl && (
													<div
														onClick={(event) => {
															event.preventDefault();
															open();
														}}
														style={{
															marginTop: '12px',
															marginBottom: '12px',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															minHeight: '140px',
															backgroundColor: '#000',
															border: '1px solid #ddd',
															borderRadius: '4px',
															overflow: 'hidden',
															cursor: 'pointer',
															position: 'relative',
														}}
													>
														<video
															src={modalVideoUrl}
															style={{
																width: '100%',
																height: 'auto',
																display: 'block',
															}}
															muted
															loop
															autoPlay
															playsInline
														/>
														<Button
															isLink
															onClick={(event) => {
																event.stopPropagation();
																setAttributes({
																	modalVideoId: 0,
																	modalVideoUrl: '',
																});
															}}
															style={{
																position: 'absolute',
																top: '6px',
																right: '6px',
																backgroundColor:
																	'rgba(220, 53, 69, 0.8)',
																borderRadius: '50%',
																width: '20px',
																height: '20px',
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																color: '#fff',
																textDecoration: 'none',
															}}
														>
															<i
																className="uil uil-times"
																style={{
																	margin: 0,
																	fontSize: '12px',
																}}
															></i>
														</Button>
													</div>
												)}
											</>
										)}
									/>
								</MediaUploadCheck>
							</div>
						</PanelBody>
					)}

					{tab.name === 'settings' && (
						<PanelBody
							title={__('Settings', 'codeweber-gutenberg-blocks')}
							initialOpen={false}
						>
							<div className="mb-3">
								<label>
									{__(
										'Section Classes',
										'codeweber-gutenberg-blocks'
									)}
								</label>
								<input
									type="text"
									className="components-text-control__input"
									value={sectionClass}
									onChange={(e) =>
										setAttributes({
											sectionClass: e.target.value,
										})
									}
									placeholder={__(
										'Additional CSS classes',
										'codeweber-gutenberg-blocks'
									)}
								/>
							</div>
							{bannerType === 'banner-15' && (
								<div className="mb-3">
									<label>
										{__(
											'Column Class',
											'codeweber-gutenberg-blocks'
										)}
									</label>
									<input
										type="text"
										className="components-text-control__input"
										value={columnClass || ''}
										onChange={(e) =>
											setAttributes({
												columnClass: e.target.value,
											})
										}
										placeholder={__(
											'CSS classes for column',
											'codeweber-gutenberg-blocks'
										)}
									/>
								</div>
							)}
							{bannerType === 'banner-34' && (
								<>
									<div className="mb-3">
										<label>
											{__(
												'Image Column Classes',
												'codeweber-gutenberg-blocks'
											)}
										</label>
										<input
											type="text"
											className="components-text-control__input"
											value={
												attributes.imageColumnClass ||
												''
											}
											onChange={(e) =>
												setAttributes({
													imageColumnClass:
														e.target.value,
												})
											}
											placeholder={__(
												'CSS classes (replaces default column classes)',
												'codeweber-gutenberg-blocks'
											)}
										/>
										<p
											className="components-base-control__help"
											style={{
												fontSize: '12px',
												marginTop: '4px',
												color: '#757575',
											}}
										>
											{__(
												'If specified, replaces default column classes',
												'codeweber-gutenberg-blocks'
											)}
										</p>
									</div>
									<div className="mb-3">
										<label>
											{__(
												'Content Column Right Wrapper Classes',
												'codeweber-gutenberg-blocks'
											)}
										</label>
										<input
											type="text"
											className="components-text-control__input"
											value={
												attributes.contentColumnRightWrapperClass ||
												''
											}
											onChange={(e) =>
												setAttributes({
													contentColumnRightWrapperClass:
														e.target.value,
												})
											}
											placeholder={__(
												'CSS classes (replaces default wrapper classes)',
												'codeweber-gutenberg-blocks'
											)}
										/>
										<p
											className="components-base-control__help"
											style={{
												fontSize: '12px',
												marginTop: '4px',
												color: '#757575',
											}}
										>
											{__(
												'If specified, replaces default wrapper classes (py-12, ps-lg-12, etc.)',
												'codeweber-gutenberg-blocks'
											)}
										</p>
									</div>
								</>
							)}
						</PanelBody>
					)}
				</>
			)}
		</TabPanel>
	);
};
