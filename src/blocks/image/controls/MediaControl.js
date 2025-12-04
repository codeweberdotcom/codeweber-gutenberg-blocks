import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, ButtonGroup, SelectControl, ToggleControl, TextControl, TextareaControl } from '@wordpress/components';
import { ImageSizeControl } from '../../../components/image-size';

export const MediaControl = ({ attributes, setAttributes }) => {
	const {
		mediaType,
		image,
		imageSize,
		imageMask,
		videoType,
		videoUrl,
		videoVimeoId,
		videoYoutubeId,
		videoEmbed,
		videoPoster,
		videoAutoplay,
		videoLoop,
		videoMuted,
		videoControls,
		showPlayIcon,
	} = attributes;

	// Обработка выбора изображения
	const handleSelectImage = async (media) => {
		let title = '';
		let description = '';
		let sizes = {};

		// Запрашиваем полные данные из REST API
		try {
			const response = await fetch(`/wp-json/wp/v2/media/${media.id}`);
			if (response.ok) {
				const fullData = await response.json();
				title = fullData.title?.rendered || '';

				// Description может содержать HTML
				let descriptionHtml = fullData.description?.rendered || '';
				if (descriptionHtml) {
					const tempDiv = document.createElement('div');
					tempDiv.innerHTML = descriptionHtml;
					description = tempDiv.textContent || tempDiv.innerText || '';
					description = description.trim();
				}

				// Получаем все размеры
				if (fullData.media_details?.sizes) {
					sizes = fullData.media_details.sizes;
				}
			}
		} catch (error) {
			console.warn('Failed to fetch full media data:', error);
		}

		setAttributes({
			image: {
				id: media.id,
				url: media.url,
				sizes: sizes,
				alt: media.alt || '',
				title: title,
				caption: media.caption || '',
				description: description,
			},
		});
	};

	// Обработка выбора poster для видео
	const handleSelectPoster = (media) => {
		setAttributes({
			videoPoster: {
				id: media.id,
				url: media.url,
				alt: media.alt || '',
			},
		});
	};

	return (
		<div className="cwgb-media-control">
			{/* Media Type Selection */}
			<div className="component-sidebar-title">
				<label>{__('Media Type', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<ButtonGroup className="button-group-sidebar_2">
				<Button
					isPrimary={mediaType === 'image'}
					onClick={() => setAttributes({ mediaType: 'image' })}
				>
					{__('Image', 'codeweber-gutenberg-blocks')}
				</Button>
				<Button
					isPrimary={mediaType === 'video'}
					onClick={() => setAttributes({ mediaType: 'video' })}
				>
					{__('Video', 'codeweber-gutenberg-blocks')}
				</Button>
			</ButtonGroup>

			{/* IMAGE SETTINGS */}
			{mediaType === 'image' && (
				<>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={handleSelectImage}
							allowedTypes={['image']}
							value={image.id}
							render={({ open }) => (
								<Button onClick={open} variant="primary" className="mt-3">
									{image.url
										? __('Change Image', 'codeweber-gutenberg-blocks')
										: __('Add Image', 'codeweber-gutenberg-blocks')}
								</Button>
							)}
						/>
					</MediaUploadCheck>

					{image.url && (
						<>
							<div style={{ marginTop: '16px' }}>
								<img
									src={image.url}
									alt={image.alt || ''}
									style={{ width: '100%', height: 'auto' }}
								/>
							</div>

							<Button
								onClick={() =>
									setAttributes({
										image: { id: 0, url: '', sizes: {}, alt: '', title: '', caption: '', description: '' },
									})
								}
								isDestructive
								className="mt-2"
							>
								{__('Remove Image', 'codeweber-gutenberg-blocks')}
							</Button>

							{/* Image Size Control */}
							<div style={{ marginTop: '16px' }}>
								<ImageSizeControl
									value={imageSize}
									onChange={(value) => setAttributes({ imageSize: value })}
									label={__('Image Size', 'codeweber-gutenberg-blocks')}
									help={__('Choose image size for display', 'codeweber-gutenberg-blocks')}
								/>
							</div>

							{/* Image Mask */}
							<SelectControl
								label={__('Image Mask', 'codeweber-gutenberg-blocks')}
								value={imageMask}
								options={[
									{ label: __('None', 'codeweber-gutenberg-blocks'), value: 'none' },
									{ label: __('Mask 1', 'codeweber-gutenberg-blocks'), value: 'mask-1' },
									{ label: __('Mask 2', 'codeweber-gutenberg-blocks'), value: 'mask-2' },
									{ label: __('Mask 3', 'codeweber-gutenberg-blocks'), value: 'mask-3' },
								]}
								onChange={(value) => setAttributes({ imageMask: value })}
								help={__('Apply SVG mask to image', 'codeweber-gutenberg-blocks')}
							/>
						</>
					)}
				</>
			)}

			{/* VIDEO SETTINGS */}
			{mediaType === 'video' && (
				<>
					<SelectControl
						label={__('Video Type', 'codeweber-gutenberg-blocks')}
						value={videoType}
						options={[
							{ label: __('HTML5 Video', 'codeweber-gutenberg-blocks'), value: 'html5' },
							{ label: __('Vimeo', 'codeweber-gutenberg-blocks'), value: 'vimeo' },
							{ label: __('YouTube', 'codeweber-gutenberg-blocks'), value: 'youtube' },
							{ label: __('Embed Code', 'codeweber-gutenberg-blocks'), value: 'embed' },
						]}
						onChange={(value) => setAttributes({ videoType: value })}
					/>

					{/* HTML5 Video */}
					{videoType === 'html5' && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => setAttributes({ videoUrl: media.url })}
									allowedTypes={['video']}
									value={videoUrl}
									render={({ open }) => (
										<Button onClick={open} variant="primary" className="mt-3">
											{videoUrl
												? __('Change Video', 'codeweber-gutenberg-blocks')
												: __('Upload Video', 'codeweber-gutenberg-blocks')}
										</Button>
									)}
								/>
							</MediaUploadCheck>

							{videoUrl && (
								<div style={{ marginTop: '8px', fontSize: '12px', color: '#757575' }}>
									{videoUrl}
								</div>
							)}
						</>
					)}

					{/* Vimeo */}
					{videoType === 'vimeo' && (
						<TextControl
							label={__('Vimeo Video ID', 'codeweber-gutenberg-blocks')}
							value={videoVimeoId}
							onChange={(value) => setAttributes({ videoVimeoId: value })}
							help={__('Example: 15801179', 'codeweber-gutenberg-blocks')}
						/>
					)}

					{/* YouTube */}
					{videoType === 'youtube' && (
						<TextControl
							label={__('YouTube Video ID', 'codeweber-gutenberg-blocks')}
							value={videoYoutubeId}
							onChange={(value) => setAttributes({ videoYoutubeId: value })}
							help={__('Example: j_Y2Gwaj7Gs', 'codeweber-gutenberg-blocks')}
						/>
					)}

					{/* Embed */}
					{videoType === 'embed' && (
						<TextareaControl
							label={__('Embed Code', 'codeweber-gutenberg-blocks')}
							value={videoEmbed}
							onChange={(value) => setAttributes({ videoEmbed: value })}
							help={__('Paste iframe or embed code', 'codeweber-gutenberg-blocks')}
							rows={5}
						/>
					)}

					{/* Video Poster */}
					{videoType !== 'embed' && (
						<>
							<div style={{ marginTop: '16px' }}>
								<label className="components-base-control__label">
									{__('Video Poster (Preview Image)', 'codeweber-gutenberg-blocks')}
								</label>
							</div>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={handleSelectPoster}
									allowedTypes={['image']}
									value={videoPoster.id}
									render={({ open }) => (
										<Button onClick={open} variant="secondary">
											{videoPoster.url
												? __('Change Poster', 'codeweber-gutenberg-blocks')
												: __('Add Poster', 'codeweber-gutenberg-blocks')}
										</Button>
									)}
								/>
							</MediaUploadCheck>

							{videoPoster.url && (
								<>
									<div style={{ marginTop: '8px' }}>
										<img
											src={videoPoster.url}
											alt={videoPoster.alt || ''}
											style={{ width: '100%', height: 'auto' }}
										/>
									</div>
									<Button
										onClick={() => setAttributes({ videoPoster: { id: 0, url: '', alt: '' } })}
										isDestructive
										isSmall
										className="mt-2"
									>
										{__('Remove Poster', 'codeweber-gutenberg-blocks')}
									</Button>
								</>
							)}
						</>
					)}

					{/* Video Options */}
					{videoType === 'html5' && (
						<>
							<ToggleControl
								label={__('Autoplay', 'codeweber-gutenberg-blocks')}
								checked={videoAutoplay}
								onChange={(value) => setAttributes({ videoAutoplay: value })}
							/>
							<ToggleControl
								label={__('Loop', 'codeweber-gutenberg-blocks')}
								checked={videoLoop}
								onChange={(value) => setAttributes({ videoLoop: value })}
							/>
							<ToggleControl
								label={__('Muted', 'codeweber-gutenberg-blocks')}
								checked={videoMuted}
								onChange={(value) => setAttributes({ videoMuted: value })}
							/>
							<ToggleControl
								label={__('Show Controls', 'codeweber-gutenberg-blocks')}
								checked={videoControls}
								onChange={(value) => setAttributes({ videoControls: value })}
							/>
						</>
					)}

					{/* Play Icon */}
					<ToggleControl
						label={__('Show Play Icon', 'codeweber-gutenberg-blocks')}
						checked={showPlayIcon}
						onChange={(value) => setAttributes({ showPlayIcon: value })}
						help={__('Display play icon overlay on video poster', 'codeweber-gutenberg-blocks')}
					/>
				</>
			)}
		</div>
	);
};

