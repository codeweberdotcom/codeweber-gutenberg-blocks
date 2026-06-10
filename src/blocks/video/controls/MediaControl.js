import { __ } from '@wordpress/i18n';
import {
	Button,
	SelectControl,
	ToggleControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { ImageSizeControl } from '../../../components/image-size';
import { VideoURLControl } from '../../../components/video-url/VideoURLControl';
import {
	parseVKVideoURL,
	parseRutubeVideoURL,
} from '../../../utilities/videoUrlParsers';

export const MediaControl = ({ attributes, setAttributes }) => {
	const {
		videoType,
		videoUrl,
		videoVimeoId,
		videoYoutubeId,
		videoVkId,
		videoRutubeId,
		videoEmbed,
		videoPoster,
		videoPosterSize,
		videoAutoplay,
		videoLoop,
		videoMuted,
		videoControls,
		showPlayIcon,
	} = attributes;

	const [isLoadingPoster, setIsLoadingPoster] = useState(false);

	// Auto-fetch poster when Video Type changes OR when VK/Rutube video URL changes
	useEffect(() => {
		// Auto-fetch VK poster when videoType switches to 'vk' OR when videoVkId changes
		if (videoType === 'vk' && videoVkId) {
			setIsLoadingPoster(true);
			const { oid, id } = parseVKVideoURL(videoVkId);

			if (oid && id) {
				wp.apiFetch({
					path: `/codeweber-gutenberg-blocks/v1/vk-thumbnail?oid=${encodeURIComponent(oid)}&id=${encodeURIComponent(id)}`,
					method: 'GET',
				})
					.then((response) => {
						if (response.success && response.thumbnail_url) {
							setAttributes({
								videoPoster: {
									id: 0,
									url: response.thumbnail_url,
									alt: response.title || 'VK video thumbnail',
								},
								videoPosterSize: 'full',
							});
						}
						setIsLoadingPoster(false);
					})
					.catch((error) => {
						console.error('❌ Could not fetch VK poster:', error);
						setIsLoadingPoster(false);
					});
			} else {
				setIsLoadingPoster(false);
			}
		}

		// Auto-fetch Rutube poster when videoType switches to 'rutube' OR when videoRutubeId changes
		if (videoType === 'rutube' && videoRutubeId) {
			setIsLoadingPoster(true);
			const { videoId } = parseRutubeVideoURL(videoRutubeId);

			if (videoId && videoId.match(/^[a-f0-9]{32}$/)) {
				wp.apiFetch({
					path: `/codeweber-gutenberg-blocks/v1/rutube-thumbnail/${videoId}`,
					method: 'GET',
				})
					.then((response) => {
						if (response.success && response.thumbnail_url) {
							setAttributes({
								videoPoster: {
									id: 0,
									url: response.thumbnail_url,
									alt:
										response.title ||
										'Rutube video thumbnail',
								},
								videoPosterSize: 'full',
							});
						}
						setIsLoadingPoster(false);
					})
					.catch((error) => {
						setIsLoadingPoster(false);
					});
			} else {
				setIsLoadingPoster(false);
			}
		}
	}, [videoType, videoVkId, videoRutubeId]); // Auto-fetch when Video Type OR video URLs change

	// Update poster URL when videoPosterSize changes (only for uploaded posters)
	useEffect(() => {
		if (videoPoster.id && videoPoster.id > 0 && videoPosterSize) {
			wp.apiFetch({
				path: `/wp/v2/media/${videoPoster.id}`,
				method: 'GET',
			})
				.then((attachment) => {
					let newUrl = attachment.source_url; // Default to full size

					if (
						videoPosterSize !== 'full' &&
						attachment.media_details &&
						attachment.media_details.sizes &&
						attachment.media_details.sizes[videoPosterSize]
					) {
						newUrl =
							attachment.media_details.sizes[videoPosterSize]
								.source_url;
					}

					if (newUrl !== videoPoster.url) {
						setAttributes({
							videoPoster: {
								...videoPoster,
								url: newUrl,
							},
						});
					}
				})
				.catch((error) => {
					console.error('Failed to fetch poster data:', error);
				});
		}
	}, [videoPosterSize, videoPoster.id]);

	return (
		<div className="cwgb-media-control">
			{/* Video Type Selector */}
			<div className="component-sidebar-title">
				<label>
					{__('Video Type', 'codeweber-gutenberg-blocks')}
				</label>
			</div>
			<SelectControl
				value={videoType}
				options={[
					{
						label: __(
							'HTML5 Video',
							'codeweber-gutenberg-blocks'
						),
						value: 'html5',
					},
					{
						label: __('Vimeo', 'codeweber-gutenberg-blocks'),
						value: 'vimeo',
					},
					{
						label: __('YouTube', 'codeweber-gutenberg-blocks'),
						value: 'youtube',
					},
					{
						label: __('VK Video', 'codeweber-gutenberg-blocks'),
						value: 'vk',
					},
					{
						label: __('Rutube', 'codeweber-gutenberg-blocks'),
						value: 'rutube',
					},
					{
						label: __('Embed Code', 'codeweber-gutenberg-blocks'),
						value: 'embed',
					},
				]}
				onChange={(value) => setAttributes({ videoType: value })}
			/>

			{/* HTML5 Video Upload */}
			{videoType === 'html5' && (
				<>
					<div
						className="component-sidebar-title"
						style={{ marginTop: '16px' }}
					>
						<label>
							{__('Video File', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({ videoUrl: media.url })
							}
							allowedTypes={['video']}
							value={videoUrl}
							render={({ open }) => (
								<>
									{!videoUrl && (
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
									{videoUrl && (
										<div
											onClick={open}
											style={{
												marginBottom: '12px',
												padding: '12px',
												background: '#f9f9f9',
												border: '1px solid #ddd',
												borderRadius: '4px',
												cursor: 'pointer',
												position: 'relative',
											}}
										>
											<div
												style={{
													fontSize: '12px',
													color: '#666',
													wordBreak: 'break-all',
													paddingRight: '24px',
												}}
											>
												{videoUrl.split('/').pop()}
											</div>
											<Button
												isLink
												onClick={(event) => {
													event.stopPropagation();
													setAttributes({
														videoUrl: '',
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
				</>
			)}

			{/* Vimeo */}
			{videoType === 'vimeo' && (
				<TextControl
					label={__(
						'Vimeo Video ID',
						'codeweber-gutenberg-blocks'
					)}
					value={videoVimeoId || ''}
					onChange={(value) =>
						setAttributes({ videoVimeoId: value })
					}
					help={__('Example: 15801179', 'codeweber-gutenberg-blocks')}
				/>
			)}

			{/* YouTube */}
			{videoType === 'youtube' && (
				<TextControl
					label={__(
						'YouTube Video ID',
						'codeweber-gutenberg-blocks'
					)}
					value={videoYoutubeId || ''}
					onChange={(value) =>
						setAttributes({ videoYoutubeId: value })
					}
					help={__(
						'Example: j_Y2Gwaj7Gs',
						'codeweber-gutenberg-blocks'
					)}
				/>
			)}

			{/* VK Video */}
			{videoType === 'vk' && (
				<VideoURLControl
					videoType="vk"
					value={videoVkId || ''}
					onChange={(url, metadata) => {
						setAttributes({ videoVkId: url });
					}}
					autoloadPoster={true}
					onPosterLoad={(posterData) => {
						setAttributes({
							videoPoster: posterData,
							videoPosterSize: 'full',
						});
					}}
					multiline={true}
				/>
			)}

			{/* Rutube */}
			{videoType === 'rutube' && (
				<VideoURLControl
					videoType="rutube"
					value={videoRutubeId || ''}
					onChange={(url, metadata) => {
						setAttributes({ videoRutubeId: url });
					}}
					autoloadPoster={true}
					onPosterLoad={(posterData) => {
						setAttributes({
							videoPoster: posterData,
							videoPosterSize: 'full',
						});
					}}
					multiline={true}
				/>
			)}

			{/* Embed */}
			{videoType === 'embed' && (
				<TextareaControl
					label={__('Embed Code', 'codeweber-gutenberg-blocks')}
					value={videoEmbed || ''}
					onChange={(value) => setAttributes({ videoEmbed: value })}
					help={__(
						'Paste iframe or embed code',
						'codeweber-gutenberg-blocks'
					)}
					rows={5}
				/>
			)}

			{/* Video Poster */}
			{videoType !== 'embed' && (
				<>
					<div
						className="component-sidebar-title"
						style={{ marginTop: '16px' }}
					>
						<label>
							{__('Video Poster', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									videoPoster: {
										id: media.id,
										url: media.url,
										alt: media.alt || '',
									},
									videoPosterSize: 'full',
								})
							}
							allowedTypes={['image']}
							value={videoPoster.id}
							render={({ open }) => (
								<>
									{!videoPoster.url && (
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
													📷
												</div>
												<div
													style={{
														fontSize: '12px',
														fontWeight: '500',
													}}
												>
													{__(
														'Select Poster',
														'codeweber-gutenberg-blocks'
													)}
												</div>
											</div>
										</div>
									)}
									{videoPoster.url && (
										<div
											onClick={open}
											style={{
												marginBottom: '12px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												minHeight: '100px',
												backgroundColor: '#fff',
												border: '1px solid #ddd',
												borderRadius: '4px',
												overflow: 'hidden',
												cursor: 'pointer',
												position: 'relative',
											}}
										>
											<img
												src={videoPoster.url}
												alt={videoPoster.alt || ''}
												style={{
													width: '100%',
													height: 'auto',
													display: 'block',
												}}
											/>
											<Button
												isLink
												onClick={(event) => {
													event.stopPropagation();
													setAttributes({
														videoPoster: {
															id: 0,
															url: '',
															alt: '',
														},
														videoPosterSize:
															'full',
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

					{/* Poster Image Size (only for uploaded posters) */}
					{videoPoster.id > 0 && (
						<div style={{ marginTop: '12px' }}>
							<ImageSizeControl
								value={videoPosterSize}
								onChange={(value) =>
									setAttributes({ videoPosterSize: value })
								}
								label={__(
									'Poster Size',
									'codeweber-gutenberg-blocks'
								)}
							/>
						</div>
					)}

					{/* Loading indicator */}
					{isLoadingPoster && (
						<div
							style={{
								marginTop: '8px',
								marginBottom: '15px',
								padding: '8px 12px',
								backgroundColor: '#f0f6fc',
								border: '1px solid #0073aa',
								borderRadius: '4px',
								color: '#0073aa',
								fontSize: '13px',
								fontWeight: '500',
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
							}}
						>
							<span
								style={{
									display: 'inline-block',
									width: '14px',
									height: '14px',
									border: '2px solid #0073aa',
									borderTopColor: 'transparent',
									borderRadius: '50%',
									animation: 'spin 0.6s linear infinite',
								}}
							></span>
							{__(
								'Loading poster...',
								'codeweber-gutenberg-blocks'
							)}
						</div>
					)}

					{/* Auto-load poster button for VK/Rutube */}
					{(videoType === 'vk' || videoType === 'rutube') &&
						!isLoadingPoster && (
							<Button
								variant="secondary"
								onClick={async () => {
									setIsLoadingPoster(true);

									if (
										videoType === 'rutube' &&
										videoRutubeId
									) {
										const { videoId } =
											parseRutubeVideoURL(videoRutubeId);
										if (videoId) {
											try {
												const response =
													await wp.apiFetch({
														path: `/codeweber-gutenberg-blocks/v1/rutube-thumbnail/${videoId}`,
														method: 'GET',
													});
												if (
													response.success &&
													response.thumbnail_url
												) {
													setAttributes({
														videoPoster: {
															id: 0,
															url: response.thumbnail_url,
															alt:
																response.title ||
																'Rutube video thumbnail',
														},
														videoPosterSize:
															'full',
													});
												}
											} catch (error) {
												// Silently handle poster loading errors
											} finally {
												setIsLoadingPoster(false);
											}
										} else {
											setIsLoadingPoster(false);
										}
									} else if (
										videoType === 'vk' &&
										videoVkId
									) {
										const { oid, id } =
											parseVKVideoURL(videoVkId);
										if (oid && id) {
											try {
												const response =
													await wp.apiFetch({
														path: `/codeweber-gutenberg-blocks/v1/vk-thumbnail?oid=${encodeURIComponent(oid)}&id=${encodeURIComponent(id)}`,
														method: 'GET',
													});
												if (
													response.success &&
													response.thumbnail_url
												) {
													setAttributes({
														videoPoster: {
															id: 0,
															url: response.thumbnail_url,
															alt:
																response.title ||
																'VK video thumbnail',
														},
														videoPosterSize:
															'full',
													});
												}
											} catch (error) {
												console.error(
													'❌ Failed to load VK poster:',
													error
												);
											} finally {
												setIsLoadingPoster(false);
											}
										} else {
											setIsLoadingPoster(false);
										}
									}
								}}
								style={{
									marginTop: '8px',
									marginBottom: '15px',
									width: '100%',
								}}
							>
								{__(
									'Auto-load Poster from Provider',
									'codeweber-gutenberg-blocks'
								)}
							</Button>
						)}
				</>
			)}

			{/* Video Options */}
			{videoType === 'html5' && (
				<>
					<ToggleControl
						label={__('Autoplay', 'codeweber-gutenberg-blocks')}
						checked={videoAutoplay}
						onChange={(value) =>
							setAttributes({ videoAutoplay: value })
						}
					/>
					<ToggleControl
						label={__('Loop', 'codeweber-gutenberg-blocks')}
						checked={videoLoop}
						onChange={(value) =>
							setAttributes({ videoLoop: value })
						}
					/>
					<ToggleControl
						label={__('Muted', 'codeweber-gutenberg-blocks')}
						checked={videoMuted}
						onChange={(value) =>
							setAttributes({ videoMuted: value })
						}
					/>
					<ToggleControl
						label={__('Show Controls', 'codeweber-gutenberg-blocks')}
						checked={videoControls}
						onChange={(value) =>
							setAttributes({ videoControls: value })
						}
					/>
				</>
			)}

			{/* Play Icon */}
			<ToggleControl
				label={__('Show Play Icon', 'codeweber-gutenberg-blocks')}
				checked={showPlayIcon}
				onChange={(value) => setAttributes({ showPlayIcon: value })}
			/>
		</div>
	);
};
