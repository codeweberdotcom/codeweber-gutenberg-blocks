import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { parseVKVideoURL, parseRutubeVideoURL, parseYouTubeVideoURL, parseVimeoVideoURL } from '../../utilities/videoUrlParsers';

/**
 * VideoURLControl Component
 * Universal component for VK, Rutube, YouTube, Vimeo video URLs
 * 
 * @param {Object} props
 * @param {string} props.videoType - Type of video: 'vk', 'rutube', 'youtube', 'vimeo'
 * @param {string} props.value - Current video URL/ID
 * @param {function} props.onChange - Callback when URL changes: (url, metadata) => void
 * @param {boolean} props.autoloadPoster - Whether to auto-load poster (default: false)
 * @param {function} props.onPosterLoad - Callback when poster is loaded: (posterUrl) => void
 * @param {boolean} props.multiline - Use TextareaControl instead of TextControl (default: false)
 * @param {boolean} props.enhanceQuality - Add quality/autoplay parameters to URL (default: true)
 * @param {boolean} props.forLightbox - Add autoplay/fullscreen for lightbox usage (default: false)
 */
export const VideoURLControl = ({
	videoType,
	value = '',
	onChange,
	autoloadPoster = false,
	onPosterLoad = null,
	multiline = false,
	enhanceQuality = true,
	forLightbox = false,
}) => {
	const [isLoadingPoster, setIsLoadingPoster] = useState(false);

	// Get label and help text based on video type
	const getConfig = () => {
		switch (videoType) {
			case 'vk':
				return {
					label: __('VK Video URL or iframe', 'codeweber-gutenberg-blocks'),
					help: __('Paste VK video embed URL or full iframe code - URL will be extracted automatically', 'codeweber-gutenberg-blocks'),
					placeholder: 'https://vkvideo.ru/video_ext.php?oid=...&id=... or paste iframe',
				};
			case 'rutube':
				return {
					label: __('Rutube Video URL or ID', 'codeweber-gutenberg-blocks'),
					help: __('Paste Rutube embed URL, video ID, or full iframe code - URL will be extracted automatically', 'codeweber-gutenberg-blocks'),
					placeholder: 'https://rutube.ru/play/embed/... or paste iframe or 32-char ID',
				};
			case 'youtube':
				return {
					label: __('YouTube Video URL or ID', 'codeweber-gutenberg-blocks'),
					help: __('Enter YouTube video URL or video ID', 'codeweber-gutenberg-blocks'),
					placeholder: 'https://youtube.com/watch?v=... or video ID',
				};
			case 'vimeo':
				return {
					label: __('Vimeo Video ID', 'codeweber-gutenberg-blocks'),
					help: __('Enter Vimeo video ID', 'codeweber-gutenberg-blocks'),
					placeholder: '123456789',
				};
			default:
				return {
					label: __('Video URL', 'codeweber-gutenberg-blocks'),
					help: '',
					placeholder: '',
				};
		}
	};

	// Handle video URL change
	const handleChange = async (newValue) => {
		let parsedData = {};

		// Parse URL based on video type
		switch (videoType) {
			case 'vk':
				parsedData = parseVKVideoURL(newValue, enhanceQuality, forLightbox);
				break;
			case 'rutube':
				parsedData = parseRutubeVideoURL(newValue, enhanceQuality);
				break;
			case 'youtube':
				parsedData = parseYouTubeVideoURL(newValue);
				break;
			case 'vimeo':
				parsedData = parseVimeoVideoURL(newValue);
				break;
			default:
				parsedData = { url: newValue };
		}

		// Call onChange callback with parsed data
		onChange(parsedData.url || newValue, parsedData);

		// Auto-load poster if enabled
		if (autoloadPoster && onPosterLoad && (videoType === 'vk' || videoType === 'rutube')) {
			if (videoType === 'vk' && parsedData.oid && parsedData.id) {
				setIsLoadingPoster(true);
				try {
					const response = await wp.apiFetch({
						path: `/codeweber-gutenberg-blocks/v1/vk-thumbnail?oid=${encodeURIComponent(parsedData.oid)}&id=${encodeURIComponent(parsedData.id)}`,
						method: 'GET'
					});
					if (response.success && response.thumbnail_url) {
						onPosterLoad({
							id: 0,
							url: response.thumbnail_url,
							alt: response.title || 'VK video thumbnail'
						});
						console.log('✅ VK poster auto-loaded:', response.thumbnail_url);
					}
				} catch (error) {
					console.error('❌ Could not fetch VK poster:', error);
				} finally {
					setIsLoadingPoster(false);
				}
			} else if (videoType === 'rutube' && parsedData.videoId) {
				setIsLoadingPoster(true);
				try {
					const response = await wp.apiFetch({
						path: `/codeweber-gutenberg-blocks/v1/rutube-thumbnail/${parsedData.videoId}`,
						method: 'GET'
					});
					if (response.success && response.thumbnail_url) {
						onPosterLoad({
							id: 0,
							url: response.thumbnail_url,
							alt: response.title || 'Rutube video thumbnail'
						});
						console.log('✅ Rutube poster auto-loaded:', response.thumbnail_url);
					}
				} catch (error) {
					console.error('❌ Could not fetch Rutube poster:', error);
				} finally {
					setIsLoadingPoster(false);
				}
			}
		}
	};

	const config = getConfig();
	const ControlComponent = multiline ? TextareaControl : TextControl;
	const extraProps = multiline ? { rows: 3 } : {};

	return (
		<>
			<ControlComponent
				label={config.label}
				value={value}
				onChange={handleChange}
				help={config.help}
				placeholder={config.placeholder}
				{...extraProps}
			/>
			
			{/* Loading indicator */}
			{isLoadingPoster && (
				<div style={{
					marginTop: '8px',
					marginBottom: '8px',
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
		</>
	);
};

