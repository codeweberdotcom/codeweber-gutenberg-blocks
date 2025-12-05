import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup, SelectControl, ToggleControl, TextControl, TextareaControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { ImageSizeControl } from '../../../components/image-size';
import { LightboxControl } from '../../../components/lightbox/LightboxControl';

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
		videoVkId,
		videoRutubeId,
		videoEmbed,
		videoPoster,
		videoAutoplay,
		videoLoop,
		videoMuted,
		videoControls,
		showPlayIcon,
	} = attributes;

	const [availableImageSizes, setAvailableImageSizes] = useState([]);
	const [isLoadingPoster, setIsLoadingPoster] = useState(false);

	// Auto-fetch poster when Video Type changes OR when VK/Rutube video URL changes
	useEffect(() => {
		// Auto-fetch VK poster when videoType switches to 'vk' OR when videoVkId changes
		if (videoType === 'vk' && videoVkId) {
			setIsLoadingPoster(true);
			const extractOidId = (vkUrl) => {
				let oid = '', id = '';
				try {
					const url = new URL(vkUrl.includes('http') ? vkUrl : `https://${vkUrl}`);
					oid = url.searchParams.get('oid');
					id = url.searchParams.get('id');
					
					// If not found, try to extract from pathname (video page URL)
					if (!oid || !id) {
						const pathMatch = url.pathname.match(/video(-?\d+)_(\d+)/);
						if (pathMatch) {
							oid = pathMatch[1];
							id = pathMatch[2];
						}
					}
				} catch (e) {}
				return { oid, id };
			};
			
			const { oid, id } = extractOidId(videoVkId);
			if (oid && id) {
				console.log('🔄 Auto-fetching VK poster (videoType or URL changed):', { oid, id, videoType });
				wp.apiFetch({
					path: `/codeweber-gutenberg-blocks/v1/vk-thumbnail?oid=${encodeURIComponent(oid)}&id=${encodeURIComponent(id)}`,
					method: 'GET'
				}).then(response => {
					if (response.success && response.thumbnail_url) {
						setAttributes({
							videoPoster: {
								id: 0,
								url: response.thumbnail_url,
								alt: response.title || 'VK video thumbnail'
							}
						});
						console.log('✅ VK poster auto-loaded:', response.thumbnail_url);
					}
					setIsLoadingPoster(false);
				}).catch(error => {
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
			const extractRutubeId = (rutubeUrl) => {
				try {
					const url = new URL(rutubeUrl.includes('http') ? rutubeUrl : `https://${rutubeUrl}`);
					// Try to match both /embed/ and /video/ formats
					let match = url.pathname.match(/\/embed\/([a-f0-9]{32})/);
					if (!match) {
						match = url.pathname.match(/\/video\/([a-f0-9]{32})/);
					}
					return match ? match[1] : '';
				} catch (e) {
					return '';
				}
			};
			
			const videoId = extractRutubeId(videoRutubeId);
			if (videoId && videoId.match(/^[a-f0-9]{32}$/)) {
				console.log('🔄 Auto-fetching Rutube poster (videoType or URL changed):', { videoId, videoType });
				wp.apiFetch({
					path: `/codeweber-gutenberg-blocks/v1/rutube-thumbnail/${videoId}`,
					method: 'GET'
				}).then(response => {
					if (response.success && response.thumbnail_url) {
						setAttributes({
							videoPoster: {
								id: 0,
								url: response.thumbnail_url,
								alt: response.title || 'Rutube video thumbnail'
							}
						});
						console.log('✅ Rutube poster auto-loaded:', response.thumbnail_url);
					}
					setIsLoadingPoster(false);
				}).catch(error => {
					console.error('❌ Could not fetch Rutube poster:', error);
					setIsLoadingPoster(false);
				});
			} else {
				console.log('⚠️ Rutube videoId not extracted from:', videoRutubeId);
				setIsLoadingPoster(false);
			}
		}
	}, [videoType, videoVkId, videoRutubeId]); // Auto-fetch when Video Type OR video URLs change

	// VK Video ID Parser (from Button block logic)
	const handleVKIDChange = async (newVKID) => {
		let processedVKID = newVKID;
		let extractedUrl = '';
		let oid = '';
		let id = '';

		// Check if the input is a full iframe embed code
		if (newVKID.includes('<iframe') && newVKID.includes('vkvideo.ru')) {
			// Extract the src URL from the iframe
			const srcMatch = newVKID.match(/src="([^"]*vkvideo\.ru[^"]*)"/);
			if (srcMatch) {
				extractedUrl = srcMatch[1];
				// Ensure the URL has the proper protocol
				if (extractedUrl.startsWith('//')) {
					extractedUrl = `https:${extractedUrl}`;
				}
				processedVKID = extractedUrl;
				
				// Extract oid and id for poster
				try {
					const url = new URL(extractedUrl);
					oid = url.searchParams.get('oid');
					id = url.searchParams.get('id');
				} catch (e) {}
			}
		} else if (newVKID.includes('vkvideo.ru/video_ext.php')) {
			// Handle direct URL input
			try {
				extractedUrl = newVKID.startsWith('http') ? newVKID : `https://${newVKID}`;
				// Validate that it's a proper VK video URL
				const urlParams = new URL(extractedUrl);
				if (urlParams.searchParams.has('oid') && urlParams.searchParams.has('id')) {
					processedVKID = extractedUrl;
					oid = urlParams.searchParams.get('oid');
					id = urlParams.searchParams.get('id');

					// Generate enhanced VK video URL with additional parameters
					const enhancedUrl = new URL(extractedUrl);
					enhancedUrl.searchParams.set('hd', '2');
					if (!enhancedUrl.searchParams.has('hash')) {
						const hash = '0f00c4ecd2885c04'; // Default hash
						enhancedUrl.searchParams.set('hash', hash);
					}

					extractedUrl = enhancedUrl.toString();
				}
			} catch (error) {
				console.warn('Invalid VK video URL format');
			}
		}

		setAttributes({
			videoVkId: extractedUrl || processedVKID,
		});

		// Auto-fetch poster from VK if we have oid and id
		if (oid && id) {
			console.log('🔄 Fetching VK poster for:', { oid, id });
			try {
				const apiPath = `/codeweber-gutenberg-blocks/v1/vk-thumbnail?oid=${encodeURIComponent(oid)}&id=${encodeURIComponent(id)}`;
				console.log('📡 VK API path:', apiPath);
				
				const response = await wp.apiFetch({
					path: apiPath,
					method: 'GET'
				});
				
				console.log('📦 VK API response:', response);
				
				if (response.success && response.thumbnail_url) {
					// Automatically set poster
					setAttributes({
						videoPoster: {
							id: 0,
							url: response.thumbnail_url,
							alt: response.title || 'VK video thumbnail'
						}
					});
					console.log('✅ VK poster auto-loaded:', response.thumbnail_url);
				} else {
					console.warn('⚠️ VK API returned no thumbnail');
				}
			} catch (error) {
				console.error('❌ Could not fetch VK poster:', error);
			}
		} else {
			console.log('⚠️ VK oid/id not extracted:', { oid, id });
		}
	};

	// Rutube Video ID Parser (from Button block logic)
	const handleRutubeIDChange = async (newRutubeID) => {
		let processedRutubeID = newRutubeID;
		let extractedUrl = '';
		let videoId = '';

		// Check if the input is a full iframe embed code
		if (newRutubeID.includes('<iframe') && newRutubeID.includes('rutube.ru')) {
			// Extract the src URL from the iframe
			const srcMatch = newRutubeID.match(/src="([^"]*rutube\.ru[^"]*)"/);
			if (srcMatch) {
				extractedUrl = srcMatch[1];
				// Ensure the URL has the proper protocol
				if (extractedUrl.startsWith('//')) {
					extractedUrl = `https:${extractedUrl}`;
				}
				processedRutubeID = extractedUrl;

				// Extract video ID from Rutube URL
				try {
					const urlObj = new URL(extractedUrl);
					const pathname = urlObj.pathname;
					const pathMatch = pathname.match(/\/embed\/([^\/]+)/);
					if (pathMatch) {
						videoId = pathMatch[1];
					}
				} catch (error) {
					console.warn('Could not extract video ID from Rutube iframe');
				}
			}
		} else if (newRutubeID.includes('rutube.ru/play/embed/')) {
			// Handle direct URL input
			try {
				extractedUrl = newRutubeID.startsWith('http') ? newRutubeID : `https://${newRutubeID}`;
				// Validate that it's a proper Rutube URL
				const urlObj = new URL(extractedUrl);
				if (urlObj.hostname.includes('rutube.ru') && urlObj.pathname.includes('/embed/')) {
					processedRutubeID = extractedUrl;

					// Extract video ID from URL
					const pathname = urlObj.pathname;
					const pathMatch = pathname.match(/\/embed\/([^\/]+)/);
					if (pathMatch) {
						videoId = pathMatch[1];
					}
				}
			} catch (error) {
				console.warn('Invalid Rutube URL format');
			}
		} else if (newRutubeID.match(/^[a-f0-9]{32}$/)) {
			// If input is just a 32-char hex ID, construct the embed URL
			videoId = newRutubeID;
			extractedUrl = `https://rutube.ru/play/embed/${videoId}`;
			processedRutubeID = extractedUrl;
		}

		// Save videoId before adding autoplay (important for poster fetch)
		const finalVideoId = videoId;
		
		// Add autoplay parameter to Rutube URL for faster initialization
		if (extractedUrl || processedRutubeID) {
			try {
				const finalUrl = new URL(extractedUrl || processedRutubeID);
				finalUrl.searchParams.set('autoplay', '1');
				const enhancedUrl = finalUrl.toString();
				
				setAttributes({
					videoRutubeId: enhancedUrl,
				});
			} catch (error) {
				// If URL parsing fails, use as is
				setAttributes({
					videoRutubeId: extractedUrl || processedRutubeID,
				});
			}
		} else {
			setAttributes({
				videoRutubeId: newRutubeID,
			});
		}

		// Auto-fetch poster from Rutube API if we have video ID
		if (finalVideoId && finalVideoId.match(/^[a-f0-9]{32}$/)) {
			console.log('🔄 Fetching Rutube poster for:', finalVideoId);
			try {
				const apiPath = `/codeweber-gutenberg-blocks/v1/rutube-thumbnail/${finalVideoId}`;
				console.log('📡 Rutube API path:', apiPath);
				
				const response = await wp.apiFetch({
					path: apiPath,
					method: 'GET'
				});
				
				console.log('📦 Rutube API response:', response);
				
				if (response.success && response.thumbnail_url) {
					// Automatically set poster
					setAttributes({
						videoPoster: {
							id: 0,
							url: response.thumbnail_url,
							alt: response.title || 'Rutube video thumbnail'
						}
					});
					console.log('✅ Rutube poster auto-loaded:', response.thumbnail_url);
				} else {
					console.warn('⚠️ Rutube API returned no thumbnail');
				}
			} catch (error) {
				console.error('❌ Could not fetch Rutube poster:', error);
			}
		} else {
			console.log('⚠️ Rutube videoId not valid:', finalVideoId);
		}
	};

	// Handler for image selection
	const handleSelectImage = (media) => {
		setAttributes({
			image: {
				id: media.id,
				url: media.url,
				sizes: media.sizes || {},
				alt: media.alt || '',
				title: media.title || '',
				caption: media.caption || '',
				description: media.description || '',
			},
		});
	};

	// Handler for image removal
	const handleRemoveImage = () => {
		setAttributes({
			image: {
				id: 0,
				url: '',
				sizes: {},
				alt: '',
				title: '',
				caption: '',
				description: '',
			},
		});
	};

	// Fetch available image sizes when image is selected
	useEffect(() => {
		if (image.id && image.id > 0) {
			wp.apiFetch({
				path: `/wp/v2/media/${image.id}`,
				method: 'GET'
			}).then((attachment) => {
				if (attachment && attachment.media_details && attachment.media_details.sizes) {
					const sizes = Object.keys(attachment.media_details.sizes);
					sizes.push('full');
					setAvailableImageSizes(sizes);
				} else {
					setAvailableImageSizes(['full']);
				}
			}).catch(() => {
				setAvailableImageSizes([]);
			});
		} else {
			setAvailableImageSizes([]);
		}
	}, [image.id]);

	// Update image URL when imageSize changes
	useEffect(() => {
		if (image.id && image.id > 0 && imageSize) {
			wp.apiFetch({
				path: `/wp/v2/media/${image.id}`,
				method: 'GET'
			}).then((attachment) => {
				let newUrl = attachment.source_url; // Default to full size

				if (imageSize !== 'full' && 
					attachment.media_details && 
					attachment.media_details.sizes && 
					attachment.media_details.sizes[imageSize]) {
					
					newUrl = attachment.media_details.sizes[imageSize].source_url;
				}

				// Update image URL if different
				if (newUrl !== image.url) {
					setAttributes({ 
						image: {
							...image,
							url: newUrl
						}
					});
				}
			}).catch((error) => {
				console.error('Failed to fetch image data:', error);
			});
		}
	}, [imageSize, image.id]);

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
					<div className="component-sidebar-title">
						<label>{__('Background Image', 'codeweber-gutenberg-blocks')}</label>
					</div>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={handleSelectImage}
							allowedTypes={['image']}
							value={image.id}
							render={({ open }) => (
								<>
									{!image.url && (
										<div
											className="image-placeholder"
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
											<div style={{ textAlign: 'center', color: '#666' }}>
												<div style={{ fontSize: '20px', marginBottom: '4px' }}>
													📷
												</div>
												<div style={{ fontSize: '12px', fontWeight: '500' }}>
													{__('Select Image', 'codeweber-gutenberg-blocks')}
												</div>
											</div>
										</div>
									)}
									{image.url && (
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
												backgroundColor: '#fff',
												border: '1px solid #ddd',
												borderRadius: '4px',
												overflow: 'hidden',
												cursor: 'pointer',
												position: 'relative',
											}}
										>
											<img
												src={image.url}
												alt={image.alt || ''}
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
													handleRemoveImage();
												}}
												style={{
													position: 'absolute',
													top: '6px',
													right: '6px',
													backgroundColor: 'rgba(220, 53, 69, 0.8)',
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
												<i className="uil uil-times" style={{ margin: 0, fontSize: '12px' }}></i>
											</Button>
										</div>
									)}
								</>
							)}
						/>
					</MediaUploadCheck>

					{image.url && (
						<>
							{/* Image Size Control */}
							<ImageSizeControl
								value={imageSize}
								onChange={(value) => setAttributes({ imageSize: value })}
								label={__('Image Size', 'codeweber-gutenberg-blocks')}
								availableSizes={availableImageSizes}
							/>

							{/* Lightbox Settings - after Image Size */}
							<div style={{ marginTop: '16px' }}>
								<LightboxControl attributes={attributes} setAttributes={setAttributes} />
							</div>

							{/* Image Mask */}
							<div style={{ marginTop: '16px' }}>
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
								/>
							</div>
						</>
					)}
				</>
			)}

			{/* VIDEO SETTINGS */}
			{mediaType === 'video' && (
				<>
					{/* Video Type Selector */}
					<div className="component-sidebar-title">
						<label>{__('Video Type', 'codeweber-gutenberg-blocks')}</label>
					</div>
					<SelectControl
						value={videoType}
						options={[
							{ label: __('HTML5 Video', 'codeweber-gutenberg-blocks'), value: 'html5' },
							{ label: __('Vimeo', 'codeweber-gutenberg-blocks'), value: 'vimeo' },
							{ label: __('YouTube', 'codeweber-gutenberg-blocks'), value: 'youtube' },
							{ label: __('VK Video', 'codeweber-gutenberg-blocks'), value: 'vk' },
							{ label: __('Rutube', 'codeweber-gutenberg-blocks'), value: 'rutube' },
							{ label: __('Embed Code', 'codeweber-gutenberg-blocks'), value: 'embed' },
						]}
						onChange={(value) => setAttributes({ videoType: value })}
					/>

					{/* HTML5 Video Upload */}
					{videoType === 'html5' && (
						<>
							<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
								<label>{__('Video File', 'codeweber-gutenberg-blocks')}</label>
							</div>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => setAttributes({ videoUrl: media.url })}
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
													<div style={{ textAlign: 'center', color: '#666' }}>
														<div style={{ fontSize: '20px', marginBottom: '4px' }}>
															🎥
														</div>
														<div style={{ fontSize: '12px', fontWeight: '500' }}>
															{__('Select Video', 'codeweber-gutenberg-blocks')}
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
													<div style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all', paddingRight: '24px' }}>
														{videoUrl.split('/').pop()}
													</div>
													<Button
														isLink
														onClick={(event) => {
															event.stopPropagation();
															setAttributes({ videoUrl: '' });
														}}
														style={{
															position: 'absolute',
															top: '6px',
															right: '6px',
															backgroundColor: 'rgba(220, 53, 69, 0.8)',
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
														<i className="uil uil-times" style={{ margin: 0, fontSize: '12px' }}></i>
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
							label={__('Vimeo Video ID', 'codeweber-gutenberg-blocks')}
							value={videoVimeoId || ''}
							onChange={(value) => setAttributes({ videoVimeoId: value })}
							help={__('Example: 15801179', 'codeweber-gutenberg-blocks')}
						/>
					)}

					{/* YouTube */}
					{videoType === 'youtube' && (
						<TextControl
							label={__('YouTube Video ID', 'codeweber-gutenberg-blocks')}
							value={videoYoutubeId || ''}
							onChange={(value) => setAttributes({ videoYoutubeId: value })}
							help={__('Example: j_Y2Gwaj7Gs', 'codeweber-gutenberg-blocks')}
						/>
					)}

					{/* VK Video */}
					{videoType === 'vk' && (
						<TextareaControl
							label={__('VK Video URL or iframe', 'codeweber-gutenberg-blocks')}
							value={videoVkId || ''}
							onChange={handleVKIDChange}
							help={__('Paste VK video embed URL or full iframe code - URL will be extracted automatically', 'codeweber-gutenberg-blocks')}
							rows={3}
						/>
					)}

					{/* Rutube */}
					{videoType === 'rutube' && (
						<TextareaControl
							label={__('Rutube Video URL or ID', 'codeweber-gutenberg-blocks')}
							value={videoRutubeId || ''}
							onChange={handleRutubeIDChange}
							help={__('Paste Rutube embed URL, video ID, or full iframe code - URL will be extracted automatically', 'codeweber-gutenberg-blocks')}
							rows={3}
						/>
					)}

					{/* Embed */}
					{videoType === 'embed' && (
						<TextareaControl
							label={__('Embed Code', 'codeweber-gutenberg-blocks')}
							value={videoEmbed || ''}
							onChange={(value) => setAttributes({ videoEmbed: value })}
							help={__('Paste iframe or embed code', 'codeweber-gutenberg-blocks')}
							rows={5}
						/>
					)}

					{/* Video Poster */}
					{videoType !== 'embed' && (
						<>
							<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
								<label>{__('Video Poster', 'codeweber-gutenberg-blocks')}</label>
							</div>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => setAttributes({ 
										videoPoster: {
											id: media.id,
											url: media.url,
											alt: media.alt || '',
										}
									})}
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
													<div style={{ textAlign: 'center', color: '#666' }}>
														<div style={{ fontSize: '20px', marginBottom: '4px' }}>
															📷
														</div>
														<div style={{ fontSize: '12px', fontWeight: '500' }}>
															{__('Select Poster', 'codeweber-gutenberg-blocks')}
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
																videoPoster: { id: 0, url: '', alt: '' }
															});
														}}
														style={{
															position: 'absolute',
															top: '6px',
															right: '6px',
															backgroundColor: 'rgba(220, 53, 69, 0.8)',
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
														<i className="uil uil-times" style={{ margin: 0, fontSize: '12px' }}></i>
													</Button>
												</div>
											)}
										</>
									)}
								/>
							</MediaUploadCheck>
							
							{/* Loading indicator */}
							{isLoadingPoster && (
								<div style={{
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
									gap: '8px'
								}}>
									<span style={{ 
										display: 'inline-block',
										width: '14px',
										height: '14px',
										border: '2px solid #0073aa',
										borderTopColor: 'transparent',
										borderRadius: '50%',
										animation: 'spin 0.6s linear infinite'
									}}></span>
									{__('Загрузка постера...', 'codeweber-gutenberg-blocks')}
								</div>
							)}
							
							{/* Auto-load poster button for VK/Rutube */}
							{(videoType === 'vk' || videoType === 'rutube') && !isLoadingPoster && (
								<Button
									variant="secondary"
									onClick={async () => {
										console.log('🔘 Button clicked! videoType:', videoType, 'videoRutubeId:', videoRutubeId, 'videoVkId:', videoVkId);
										setIsLoadingPoster(true);
										
										if (videoType === 'rutube' && videoRutubeId) {
											const extractRutubeId = (url) => {
												try {
													const urlObj = new URL(url.includes('http') ? url : `https://${url}`);
													// Try to match both /embed/ and /video/ formats
													let match = urlObj.pathname.match(/\/embed\/([a-f0-9]{32})/);
													if (!match) {
														match = urlObj.pathname.match(/\/video\/([a-f0-9]{32})/);
													}
													return match ? match[1] : '';
												} catch (e) {
													return '';
												}
											};
											
											const videoId = extractRutubeId(videoRutubeId);
											if (videoId) {
												console.log('🔄 Manual fetch Rutube poster:', videoId);
												try {
													const response = await wp.apiFetch({
														path: `/codeweber-gutenberg-blocks/v1/rutube-thumbnail/${videoId}`,
														method: 'GET'
													});
													if (response.success && response.thumbnail_url) {
														setAttributes({
															videoPoster: {
																id: 0,
																url: response.thumbnail_url,
																alt: response.title || 'Rutube video thumbnail'
															}
														});
														console.log('✅ Rutube poster loaded manually');
													}
												} catch (error) {
													console.error('❌ Failed to load Rutube poster:', error);
												} finally {
													setIsLoadingPoster(false);
												}
											} else {
												setIsLoadingPoster(false);
											}
										} else if (videoType === 'vk' && videoVkId) {
											const extractOidId = (url) => {
												let oid = '', id = '';
												try {
													const urlObj = new URL(url.includes('http') ? url : `https://${url}`);
													
													// Try to get from query params (embed URL)
													oid = urlObj.searchParams.get('oid');
													id = urlObj.searchParams.get('id');
													
													// If not found, try to extract from pathname (video page URL)
													if (!oid || !id) {
														const pathMatch = urlObj.pathname.match(/video(-?\d+)_(\d+)/);
														if (pathMatch) {
															oid = pathMatch[1];
															id = pathMatch[2];
														}
													}
												} catch (e) {
													console.error('Failed to parse VK URL:', e);
												}
												return { oid, id };
											};
											
											const { oid, id } = extractOidId(videoVkId);
											console.log('🔍 Extracted VK oid/id:', { oid, id });
											if (oid && id) {
												console.log('🔄 Manual fetch VK poster:', { oid, id });
												try {
													const response = await wp.apiFetch({
														path: `/codeweber-gutenberg-blocks/v1/vk-thumbnail?oid=${encodeURIComponent(oid)}&id=${encodeURIComponent(id)}`,
														method: 'GET'
													});
													if (response.success && response.thumbnail_url) {
														setAttributes({
															videoPoster: {
																id: 0,
																url: response.thumbnail_url,
																alt: response.title || 'VK video thumbnail'
															}
														});
														console.log('✅ VK poster loaded manually');
													}
												} catch (error) {
													console.error('❌ Failed to load VK poster:', error);
												} finally {
													setIsLoadingPoster(false);
												}
											} else {
												setIsLoadingPoster(false);
											}
										}
									}}
									style={{ marginTop: '8px', marginBottom: '15px', width: '100%' }}
								>
									{__('Auto-load Poster from Provider', 'codeweber-gutenberg-blocks')}
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
					/>
				</>
			)}
		</div>
	);
};

