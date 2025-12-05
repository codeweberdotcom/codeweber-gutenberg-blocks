/**
 * Video URL Parsers
 * Utilities for parsing video URLs from VK, Rutube, YouTube, Vimeo
 */

/**
 * Parse VK Video URL or iframe and extract oid/id
 * @param {string} input - VK Video URL or iframe code
 * @param {boolean} enhanceQuality - Add HD and other quality parameters (default: true)
 * @param {boolean} forLightbox - Add autoplay and fullscreen for lightbox (default: false)
 * @returns {object} - { url: string, oid: string, id: string }
 */
export const parseVKVideoURL = (input, enhanceQuality = true, forLightbox = false) => {
	let url = '';
	let oid = '';
	let id = '';

	if (!input) {
		return { url: '', oid: '', id: '' };
	}

	// Check if input is iframe code
	if (input.includes('<iframe') && input.includes('vkvideo.ru')) {
		const srcMatch = input.match(/src="([^"]*vkvideo\.ru[^"]*)"/);
		if (srcMatch) {
			url = srcMatch[1];
			if (url.startsWith('//')) {
				url = `https:${url}`;
			}
		}
	} 
	// Check if input is URL
	else if (input.includes('vkvideo.ru') || input.includes('vk.com/video')) {
		try {
			url = input.startsWith('http') ? input : `https://${input}`;
		} catch (e) {
			console.warn('Invalid VK video URL format');
		}
	}

	// Extract oid and id from URL
	if (url) {
		try {
			const urlObj = new URL(url);
			
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

			// If we have oid and id, generate proper embed URL with enhancements
			if (oid && id) {
				const finalUrl = new URL(`https://vkvideo.ru/video_ext.php`);
				finalUrl.searchParams.set('oid', oid);
				finalUrl.searchParams.set('id', id);
				
				// Add quality enhancement parameters if requested
				if (enhanceQuality) {
					finalUrl.searchParams.set('hd', '2');
					if (!urlObj.searchParams.has('hash')) {
						finalUrl.searchParams.set('hash', '0f00c4ecd2885c04'); // Default hash
					} else {
						finalUrl.searchParams.set('hash', urlObj.searchParams.get('hash'));
					}
					
					// Add lightbox-specific parameters
					if (forLightbox) {
						finalUrl.searchParams.set('autoplay', '1');
						finalUrl.searchParams.set('allowFullscreen', 'true');
						finalUrl.searchParams.set('fullscreen', 'true');
					}
				}
				
				url = finalUrl.toString();
			}
		} catch (e) {
			console.error('Failed to parse VK URL:', e);
		}
	}

	return { url, oid, id };
};

/**
 * Parse Rutube Video URL or iframe and extract video ID
 * @param {string} input - Rutube Video URL or iframe code
 * @param {boolean} addAutoplay - Add autoplay parameter to URL (default: true)
 * @returns {object} - { url: string, videoId: string }
 */
export const parseRutubeVideoURL = (input, addAutoplay = true) => {
	let url = '';
	let videoId = '';

	if (!input) {
		return { url: '', videoId: '' };
	}

	// Check if input is iframe code
	if (input.includes('<iframe') && input.includes('rutube.ru')) {
		const srcMatch = input.match(/src="([^"]*rutube\.ru[^"]*)"/);
		if (srcMatch) {
			url = srcMatch[1];
			if (url.startsWith('//')) {
				url = `https:${url}`;
			}
		}
	}
	// Check if input is URL
	else if (input.includes('rutube.ru')) {
		url = input.startsWith('http') ? input : `https://${input}`;
	}
	// Check if input is just a 32-char hex ID
	else if (input.match(/^[a-f0-9]{32}$/)) {
		videoId = input;
		url = `https://rutube.ru/play/embed/${videoId}`;
		if (addAutoplay) {
			url += '?autoplay=1';
		}
		return { url, videoId };
	}

	// Extract video ID from URL
	if (url) {
		try {
			const urlObj = new URL(url);
			// Try /embed/ format
			let match = urlObj.pathname.match(/\/embed\/([a-f0-9]{32})/);
			// Try /video/ format
			if (!match) {
				match = urlObj.pathname.match(/\/video\/([a-f0-9]{32})/);
			}
			if (match) {
				videoId = match[1];
				// Always use embed format for final URL
				const finalUrl = new URL(`https://rutube.ru/play/embed/${videoId}`);
				// Add autoplay parameter for faster initialization
				if (addAutoplay) {
					finalUrl.searchParams.set('autoplay', '1');
				}
				url = finalUrl.toString();
			}
		} catch (e) {
			console.warn('Invalid Rutube URL format');
		}
	}

	return { url, videoId };
};

/**
 * Parse YouTube Video URL and extract video ID
 * @param {string} input - YouTube Video URL
 * @returns {object} - { url: string, videoId: string }
 */
export const parseYouTubeVideoURL = (input) => {
	let videoId = '';

	if (!input) {
		return { url: '', videoId: '' };
	}

	try {
		// Handle different YouTube URL formats
		if (input.includes('youtube.com') || input.includes('youtu.be')) {
			const url = new URL(input.startsWith('http') ? input : `https://${input}`);
			
			// youtube.com/watch?v=ID
			if (url.hostname.includes('youtube.com')) {
				videoId = url.searchParams.get('v') || '';
			}
			// youtu.be/ID
			else if (url.hostname.includes('youtu.be')) {
				videoId = url.pathname.slice(1);
			}
		}
		// Just the ID
		else if (input.match(/^[a-zA-Z0-9_-]{11}$/)) {
			videoId = input;
		}
	} catch (e) {
		console.warn('Invalid YouTube URL format');
	}

	return { url: input, videoId };
};

/**
 * Parse Vimeo Video URL and extract video ID
 * @param {string} input - Vimeo Video URL
 * @returns {object} - { url: string, videoId: string }
 */
export const parseVimeoVideoURL = (input) => {
	let videoId = '';

	if (!input) {
		return { url: '', videoId: '' };
	}

	try {
		// Handle different Vimeo URL formats
		if (input.includes('vimeo.com')) {
			const url = new URL(input.startsWith('http') ? input : `https://${input}`);
			const match = url.pathname.match(/\/(\d+)/);
			if (match) {
				videoId = match[1];
			}
		}
		// Just the ID
		else if (input.match(/^\d+$/)) {
			videoId = input;
		}
	} catch (e) {
		console.warn('Invalid Vimeo URL format');
	}

	return { url: input, videoId };
};

