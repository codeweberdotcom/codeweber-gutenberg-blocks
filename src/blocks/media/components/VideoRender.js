import { __ } from '@wordpress/i18n';

export const VideoRender = ({ attributes, isEditor = false }) => {
	const {
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
		videoLightbox,
	} = attributes;

	// Функция для получения URL видео для lightbox
	const getVideoLightboxUrl = () => {
		if (videoType === 'html5') return videoUrl;
		if (videoType === 'vimeo') return `https://vimeo.com/${videoVimeoId}`;
		if (videoType === 'youtube') return `https://www.youtube.com/watch?v=${videoYoutubeId}`;
		if (videoType === 'vk' && videoVkId) {
			// VK поддерживает два формата: oid=-123&id=456 или -123_456
			if (videoVkId.includes('oid=')) {
				return `https://vk.com/video_ext.php?${videoVkId}`;
			}
			return `https://vk.com/video${videoVkId}`;
		}
		if (videoType === 'rutube') return `https://rutube.ru/video/${videoRutubeId}`;
		return '';
	};

	// Если включен Video Lightbox - рендерим превью с ссылкой
	if (videoLightbox && (videoType === 'html5' || videoType === 'vimeo' || videoType === 'youtube' || videoType === 'vk' || videoType === 'rutube')) {
		const videoLightboxUrl = getVideoLightboxUrl();
		
		if (!videoLightboxUrl) {
			return null;
		}

		const href = isEditor ? '#' : videoLightboxUrl;
		const onClickHandler = isEditor ? (e) => e.preventDefault() : undefined;
		const linkStyle = isEditor ? { pointerEvents: 'none', cursor: 'default' } : undefined;

		return (
			<figure className="position-relative">
				<a 
					href={href} 
					onClick={onClickHandler}
					data-glightbox={!isEditor ? '' : undefined}
					style={linkStyle}
				>
					{videoPoster.url ? (
						<img src={videoPoster.url} alt={videoPoster.alt || ''} />
					) : (
						<div 
							style={{
								width: '100%',
								paddingTop: '56.25%', // 16:9 aspect ratio
								background: '#000',
								position: 'relative',
							}}
						/>
					)}
					{showPlayIcon && (
						<button 
							type="button" 
							className="video-play-btn position-absolute top-50 start-50 translate-middle"
							aria-label="Play"
						>
							<svg width="117" height="135" viewBox="0 0 117 135" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 0L116.978 67.2L0 134.4V0Z" fill="currentColor"/>
							</svg>
						</button>
					)}
				</a>
			</figure>
		);
	}

	// HTML5 Video (inline player)
	if (videoType === 'html5' && videoUrl) {
		// В редакторе показываем только превью без Plyr
		if (isEditor) {
			return (
				<div style={{ position: 'relative' }}>
					{videoPoster.url ? (
						<img src={videoPoster.url} alt="" style={{ width: '100%', height: 'auto' }} />
					) : (
						<div 
							style={{
								width: '100%',
								paddingTop: '56.25%',
								background: '#000',
								position: 'relative',
							}}
						/>
					)}
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							color: '#fff',
							fontSize: '14px',
							background: 'rgba(0,0,0,0.7)',
							padding: '8px 12px',
							borderRadius: '4px',
						}}
					>
						{__('Video Player (Preview)', 'codeweber-gutenberg-blocks')}
					</div>
				</div>
			);
		}

		// На фронтенде рендерим video для Plyr
		const videoAttrs = {
			poster: videoPoster.url || undefined,
			className: 'player',
			playsInline: true,
			controls: videoControls,
			preload: 'none',
		};

		if (videoAutoplay) videoAttrs.autoPlay = true;
		if (videoLoop) videoAttrs.loop = true;
		if (videoMuted) videoAttrs.muted = true;

		return (
			<video {...videoAttrs}>
				<source src={videoUrl} type="video/mp4" />
			</video>
		);
	}

	// Vimeo (inline player)
	if (videoType === 'vimeo' && videoVimeoId) {
		// В редакторе показываем реальный плеер (как на фронтенде)
		return (
			<div
				className="player"
				data-plyr-provider="vimeo"
				data-plyr-embed-id={videoVimeoId}
			></div>
		);
	}

	// YouTube (inline player)
	if (videoType === 'youtube' && videoYoutubeId) {
		// В редакторе показываем реальный плеер (как на фронтенде)
		return (
			<div
				className="player"
				data-plyr-provider="youtube"
				data-plyr-embed-id={videoYoutubeId}
			></div>
		);
	}

	// VK Video (inline player)
	if (videoType === 'vk' && videoVkId) {
		// Парсим VK video URL или iframe
		let vkSrc = '';
		
		// Если это iframe код - извлекаем src
		if (videoVkId.includes('<iframe')) {
			const srcMatch = videoVkId.match(/src=["']([^"']+)["']/);
			if (srcMatch && srcMatch[1]) {
				vkSrc = srcMatch[1];
			}
		}
		// Если это прямая ссылка на vkvideo.ru или vk.com
		else if (videoVkId.includes('vkvideo.ru') || videoVkId.includes('vk.com/video')) {
			// Извлекаем все параметры из URL
			try {
				const url = new URL(videoVkId.includes('http') ? videoVkId : `https://${videoVkId}`);
				// Если это уже embed ссылка
				if (url.pathname.includes('video_ext.php')) {
					vkSrc = url.href;
				} else {
					// Парсим video ID из разных форматов
					// Формат: https://vk.com/video-229485578_456239126
					// Формат: https://vkvideo.ru/video-229485578_456239126
					const videoIdMatch = url.pathname.match(/video(-?\d+)_(\d+)/);
					if (videoIdMatch) {
						const oid = videoIdMatch[1];
						const id = videoIdMatch[2];
						// Используем vkvideo.ru как в примере
						vkSrc = `https://vkvideo.ru/video_ext.php?oid=${oid}&id=${id}`;
					}
				}
			} catch (e) {
				console.error('VK URL parsing error:', e);
			}
		}
		// Если это ID в формате -229485578_456239126 или oid=-229485578&id=456239126
		else if (videoVkId.includes('_') || videoVkId.includes('oid=')) {
			if (videoVkId.includes('oid=')) {
				vkSrc = `https://vkvideo.ru/video_ext.php?${videoVkId}`;
			} else {
				const parts = videoVkId.split('_');
				vkSrc = `https://vkvideo.ru/video_ext.php?oid=${parts[0]}&id=${parts[1]}`;
			}
		}

		if (!vkSrc) {
			return null;
		}

		return (
			<div className="ratio ratio-16x9">
				<iframe
					src={vkSrc}
					allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
					frameBorder="0"
					allowFullScreen
				></iframe>
			</div>
		);
	}

	// Rutube Video (inline player)
	if (videoType === 'rutube' && videoRutubeId) {
		// Парсим Rutube URL или ID
		let rutubeId = videoRutubeId;
		
		// Если это iframe код - извлекаем src
		if (videoRutubeId.includes('<iframe')) {
			const srcMatch = videoRutubeId.match(/src=["']([^"']+)["']/);
			if (srcMatch && srcMatch[1]) {
				// Извлекаем ID из src
				const idMatch = srcMatch[1].match(/\/embed\/([a-f0-9]+)/);
				if (idMatch && idMatch[1]) {
					rutubeId = idMatch[1];
				}
			}
		}
		// Если это полная ссылка
		else if (videoRutubeId.includes('rutube.ru')) {
			try {
				const url = new URL(videoRutubeId.includes('http') ? videoRutubeId : `https://${videoRutubeId}`);
				// Формат: https://rutube.ru/video/1234567890abcdef1234567890abcdef
				// Формат: https://rutube.ru/play/embed/1234567890abcdef1234567890abcdef
				const idMatch = url.pathname.match(/\/(?:video|embed)\/([a-f0-9]+)/);
				if (idMatch && idMatch[1]) {
					rutubeId = idMatch[1];
				}
			} catch (e) {
				console.error('Rutube URL parsing error:', e);
			}
		}

		return (
			<div className="ratio ratio-16x9">
				<iframe
					src={`https://rutube.ru/play/embed/${rutubeId}`}
					allow="clipboard-write; autoplay"
					frameBorder="0"
					allowFullScreen
				></iframe>
			</div>
		);
	}

	// Embed Code
	if (videoType === 'embed' && videoEmbed) {
		return (
			<div className="ratio ratio-16x9">
				<div dangerouslySetInnerHTML={{ __html: videoEmbed }} />
			</div>
		);
	}

	// Placeholder для редактора
	if (isEditor) {
		return (
			<div
				style={{
					padding: '40px',
					textAlign: 'center',
					background: '#f0f0f0',
					border: '2px dashed #ccc',
					borderRadius: '4px',
				}}
			>
				<p style={{ margin: 0, color: '#666' }}>
					{videoType === 'html5' && __('Upload video file', 'codeweber-gutenberg-blocks')}
					{videoType === 'vimeo' && __('Enter Vimeo video ID', 'codeweber-gutenberg-blocks')}
					{videoType === 'youtube' && __('Enter YouTube video ID', 'codeweber-gutenberg-blocks')}
					{videoType === 'vk' && __('Enter VK video ID', 'codeweber-gutenberg-blocks')}
					{videoType === 'rutube' && __('Enter Rutube video ID', 'codeweber-gutenberg-blocks')}
					{videoType === 'embed' && __('Paste embed code', 'codeweber-gutenberg-blocks')}
				</p>
			</div>
		);
	}

	return null;
};

