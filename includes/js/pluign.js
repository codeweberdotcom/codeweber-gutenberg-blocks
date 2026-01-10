// console.log('plugin.js');

/**
 * Fix target="_blank" for GLightbox links
 * Remove target="_blank" from links that use GLightbox (video, image, iframe, etc.)
 * This ensures GLightbox can open properly instead of opening in new tab
 */

// Run VERY early, before other scripts
(function () {
	let customLightbox = null;

	function fixGLightboxLinks() {
		// Find all links with data-glightbox attribute
		const glightboxLinks = document.querySelectorAll('a[data-glightbox]');

		glightboxLinks.forEach((link) => {
			const glightboxAttr = link.getAttribute('data-glightbox');

			// Remove target="_blank" for GLightbox links (video, iframe, image, pdf)
			if (
				glightboxAttr &&
				(glightboxAttr.includes('type: iframe') ||
					glightboxAttr.includes('video') ||
					glightboxAttr.includes('youtube') ||
					glightboxAttr.includes('vimeo') ||
					glightboxAttr.includes('image') ||
					glightboxAttr.includes('pdf'))
			) {
				link.removeAttribute('target');
				link.removeAttribute('rel');
			}
		});

		// Remove target="_blank" from tel: and mailto: links
		const telLinks = document.querySelectorAll('a[href^="tel:"]');
		const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');

		telLinks.forEach((link) => {
			link.removeAttribute('target');
			link.removeAttribute('rel');
		});

		mailtoLinks.forEach((link) => {
			link.removeAttribute('target');
			link.removeAttribute('rel');
		});
	}

	function initCustomGLightbox() {
		// Initialize GLightbox specifically for button video links
		if (typeof GLightbox !== 'undefined') {
			// Destroy previous instance if exists
			if (customLightbox) {
				customLightbox.destroy();
			}

			// Create new instance for button links with iframe videos
			customLightbox = GLightbox({
				selector: 'a.btn[data-glightbox*="iframe"]',
				touchNavigation: true,
				loop: false,
				zoomable: false,
				autoplayVideos: true,
			});
		}
	}

	// Run immediately if DOM already loaded
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			fixGLightboxLinks();
			setTimeout(initCustomGLightbox, 200); // Init after theme's GLightbox
		});
	} else {
		fixGLightboxLinks();
		setTimeout(initCustomGLightbox, 200);
	}

	// Also run after full page load
	window.addEventListener('load', function () {
		setTimeout(function () {
			fixGLightboxLinks();
			initCustomGLightbox();
		}, 300);
	});
})();
