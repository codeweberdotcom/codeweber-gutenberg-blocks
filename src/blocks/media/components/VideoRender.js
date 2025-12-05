import { __ } from '@wordpress/i18n';

export const VideoRender = ({ attributes, isEditor = false, setAttributes }) => {
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
		lightboxUniqueId,
	} = attributes;

	// Функция для получения embed URL (используется inline плеером)
	const getVideoEmbedUrl = () => {
		if (videoType === 'vk' && videoVkId) {
			console.log('🔍 VK - Starting parsing:', videoVkId);
			let vkSrc = '';
			
			// Если это iframe код - извлекаем src
			if (videoVkId.includes('<iframe')) {
				const srcMatch = videoVkId.match(/src=["']([^"']+)["']/);
				if (srcMatch && srcMatch[1]) {
					vkSrc = srcMatch[1];
					console.log('✅ VK - Extracted from iframe:', vkSrc);
				}
			}
			// Если это прямая ссылка
			else if (videoVkId.includes('vkvideo.ru') || videoVkId.includes('vk.com/video')) {
				try {
					const url = new URL(videoVkId.includes('http') ? videoVkId : `https://${videoVkId}`);
					console.log('🔍 VK - Parsed URL:', url.href);
					if (url.pathname.includes('video_ext.php')) {
						vkSrc = url.href;
						console.log('✅ VK - Already embed URL:', vkSrc);
					} else {
						const videoIdMatch = url.pathname.match(/video(-?\d+)_(\d+)/);
						if (videoIdMatch) {
							const oid = videoIdMatch[1];
							const id = videoIdMatch[2];
							vkSrc = `https://vkvideo.ru/video_ext.php?oid=${oid}&id=${id}`;
							console.log('✅ VK - Converted to embed:', vkSrc);
						}
					}
				} catch (e) {
					console.error('❌ VK URL parsing error:', e);
				}
			}
			// Если это ID в формате -229485578_456239126 или oid=-229485578&id=456239126
			else if (videoVkId.includes('_') || videoVkId.includes('oid=')) {
				if (videoVkId.includes('oid=')) {
					vkSrc = `https://vkvideo.ru/video_ext.php?${videoVkId}`;
					console.log('✅ VK - From params:', vkSrc);
				} else {
					const parts = videoVkId.split('_');
					vkSrc = `https://vkvideo.ru/video_ext.php?oid=${parts[0]}&id=${parts[1]}`;
					console.log('✅ VK - From ID format:', vkSrc);
				}
			}
			console.log('🎯 VK - Final URL:', vkSrc);
			return vkSrc;
		}
		
		if (videoType === 'rutube' && videoRutubeId) {
			console.log('🔍 Rutube - Starting parsing:', videoRutubeId);
			let rutubeId = videoRutubeId;
			
			// Если это iframe код
			if (videoRutubeId.includes('<iframe')) {
				const srcMatch = videoRutubeId.match(/src=["']([^"']+)["']/);
				console.log('🔍 Rutube - iframe srcMatch:', srcMatch);
				if (srcMatch && srcMatch[1]) {
					const idMatch = srcMatch[1].match(/\/embed\/([a-f0-9]+)/);
					console.log('🔍 Rutube - idMatch from src:', idMatch);
					if (idMatch && idMatch[1]) {
						rutubeId = idMatch[1];
						console.log('✅ Rutube - ID from iframe:', rutubeId);
					}
				}
			}
			// Если это полная ссылка
			else if (videoRutubeId.includes('rutube.ru')) {
				try {
					const url = new URL(videoRutubeId.includes('http') ? videoRutubeId : `https://${videoRutubeId}`);
					console.log('🔍 Rutube - Parsed URL:', url.href);
					const idMatch = url.pathname.match(/\/(?:video|embed)\/([a-f0-9]+)/);
					console.log('🔍 Rutube - idMatch from URL:', idMatch);
					if (idMatch && idMatch[1]) {
						rutubeId = idMatch[1];
						console.log('✅ Rutube - ID from URL:', rutubeId);
					}
				} catch (e) {
					console.error('❌ Rutube URL parsing error:', e);
				}
			} else {
				console.log('✅ Rutube - Direct ID:', rutubeId);
			}
			
			const finalUrl = `https://rutube.ru/play/embed/${rutubeId}`;
			console.log('🎯 Rutube - Final URL:', finalUrl);
			return finalUrl;
		}
		
		return '';
	};

	// Если включен Video Lightbox - рендерим превью с ссылкой
	if (videoLightbox && (videoType === 'html5' || videoType === 'vimeo' || videoType === 'youtube' || videoType === 'vk' || videoType === 'rutube')) {
		let videoLightboxUrl = '';
		let glightboxAttr = '';
		let hiddenIframe = null;
		
		// Используем сохраненный uniqueId или генерируем на основе видео ID (для save)
		const uniqueId = lightboxUniqueId || `video-${(videoVkId || videoRutubeId || videoYoutubeId || videoVimeoId || 'default').substr(0, 9).replace(/[^a-z0-9]/gi, '')}`;
		
		// YouTube и Vimeo - используют нативную поддержку GLightbox
		if (videoType === 'youtube') {
			videoLightboxUrl = `https://www.youtube.com/watch?v=${videoYoutubeId}`;
			glightboxAttr = ''; // GLightbox автоматически определяет YouTube
		} else if (videoType === 'vimeo') {
			videoLightboxUrl = `https://vimeo.com/${videoVimeoId}`;
			glightboxAttr = ''; // GLightbox автоматически определяет Vimeo
		} 
		// HTML5 - прямой URL видеофайла
		else if (videoType === 'html5') {
			videoLightboxUrl = videoUrl;
			glightboxAttr = ''; // GLightbox автоматически определяет видеофайл
		}
		// VK и Rutube - создаем скрытый div с iframe и ссылаемся на него
		else if (videoType === 'vk' || videoType === 'rutube') {
			const embedUrl = getVideoEmbedUrl();
			if (!embedUrl) return null;
			
			// Ссылка на скрытый контейнер
			videoLightboxUrl = `#${uniqueId}`;
			glightboxAttr = 'width: auto;';
			
			// Скрытый iframe контейнер - минимальная обёртка
			hiddenIframe = (
				<div id={uniqueId} style={{ display: 'none' }}>
					<iframe
						src={embedUrl}
						allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write;"
						frameBorder="0"
						allowFullScreen
						style={{ width: '100%', height: '100%', aspectRatio: '16/9' }}
					/>
				</div>
			);
		}
		
		if (!videoLightboxUrl) {
			return null;
		}

		const href = isEditor ? '#' : videoLightboxUrl;
		const onClickHandler = isEditor ? (e) => e.preventDefault() : undefined;
		const linkStyle = isEditor ? { pointerEvents: 'none', cursor: 'default' } : undefined;

		return (
			<>
				{hiddenIframe}
				<figure className="position-relative">
					<a 
						href={href} 
						onClick={onClickHandler}
						data-glightbox={!isEditor && glightboxAttr ? glightboxAttr : undefined}
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
			</>
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
		const vkSrc = getVideoEmbedUrl();

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
		const rutubeSrc = getVideoEmbedUrl();

		if (!rutubeSrc) {
			return null;
		}

		return (
			<div className="ratio ratio-16x9">
				<iframe
					src={rutubeSrc}
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

