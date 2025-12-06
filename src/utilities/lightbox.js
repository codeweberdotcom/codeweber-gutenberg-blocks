/**
 * Lightbox Utilities
 * 
 * Universal utilities for working with GLightbox
 * Can be used across multiple blocks (Image, Button, etc.)
 * 
 * @package CodeWeber Gutenberg Blocks
 */

/**
 * Get lightbox data attributes for HTML element
 * 
 * @param {boolean} enableLightbox - Enable/disable lightbox
 * @param {string} galleryName - Gallery name for grouping images
 * @param {string} type - Lightbox type: 'image', 'video', 'inline', etc.
 * @param {string} description - Optional description/title for lightbox
 * @returns {Object} Object with data attributes
 * 
 * @example
 * const attrs = getLightboxAttributes(true, 'gallery-1', 'image');
 * // Returns: { 'data-glightbox': 'image', 'data-gallery': 'gallery-1' }
 */
export const getLightboxAttributes = (
    enableLightbox = false, 
    galleryName = '', 
    type = 'image',
    description = ''
) => {
    if (!enableLightbox) {
        return {};
    }

    // According to Sandbox documentation: <a href="#" data-glightbox data-gallery="g1">
    // data-glightbox should be empty or contain title/description, not type
    const attrs = {
        'data-glightbox': '', // Empty attribute, GLightbox auto-detects type from href
    };

    // Add gallery grouping if specified
    if (galleryName && galleryName.trim() !== '') {
        attrs['data-gallery'] = galleryName;
    }

    // Add description/title if specified
    if (description && description.trim() !== '') {
        attrs['data-glightbox-title'] = description;
    }

    return attrs;
};

/**
 * Initialize GLightbox for all elements on page
 * Should be called after DOM changes (after adding/removing lightbox elements)
 * 
 * @param {string} selector - Optional CSS selector for specific elements
 * @returns {boolean} Success status
 * 
 * @example
 * initLightbox(); // Initialize for all elements
 * initLightbox('[data-gallery="my-gallery"]'); // Initialize for specific gallery
 */
export const initLightbox = (selector = null) => {
    if (typeof window === 'undefined') {
        return false;
    }

    // Check if theme has GLightbox initialization function
    if (typeof window.theme?.initLightbox === 'function') {
        try {
            window.theme.initLightbox(selector);
            return true;
        } catch (error) {
            console.error('Error initializing GLightbox:', error);
            return false;
        }
    }

    // Fallback: try to initialize GLightbox directly if available
    if (typeof window.GLightbox === 'function') {
        try {
            const config = {
                selector: selector || '[data-glightbox]',
                touchNavigation: true,
                loop: true,
                autoplayVideos: true,
            };
            
            window.GLightbox(config);
            return true;
        } catch (error) {
            console.error('Error initializing GLightbox directly:', error);
            return false;
        }
    }

    console.warn('GLightbox is not available. Please ensure GLightbox library is loaded.');
    return false;
};

/**
 * Generate lightbox URL for different media types
 * 
 * @param {string} url - Media URL
 * @param {string} type - Media type: 'youtube', 'vimeo', 'video', 'image'
 * @returns {string} Formatted URL for GLightbox
 * 
 * @example
 * getLightboxUrl('dQw4w9WgXcQ', 'youtube');
 * // Returns: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
 */
export const getLightboxUrl = (url, type = 'image') => {
    if (!url || url.trim() === '') {
        return '';
    }

    switch (type) {
        case 'youtube':
            // If already a full URL, return as is
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                return url;
            }
            // If video ID only, construct URL
            return `https://www.youtube.com/watch?v=${url}`;

        case 'vimeo':
            // If already a full URL, return as is
            if (url.includes('vimeo.com')) {
                return url;
            }
            // If video ID only, construct URL
            return `https://vimeo.com/${url}`;

        case 'video':
        case 'image':
        default:
            return url;
    }
};

/**
 * Get lightbox type from URL
 * Auto-detects media type based on URL pattern
 * 
 * @param {string} url - Media URL
 * @returns {string} Detected type: 'youtube', 'vimeo', 'video', 'image'
 * 
 * @example
 * getLightboxType('https://www.youtube.com/watch?v=abc123');
 * // Returns: 'youtube'
 */
export const getLightboxType = (url) => {
    if (!url || typeof url !== 'string') {
        return 'image';
    }

    const urlLower = url.toLowerCase();

    // YouTube
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
        return 'youtube';
    }

    // Vimeo
    if (urlLower.includes('vimeo.com')) {
        return 'vimeo';
    }

    // Video files
    if (urlLower.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
        return 'video';
    }

    // Image files
    if (urlLower.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return 'image';
    }

    // Default
    return 'image';
};

/**
 * Generate unique gallery ID
 * Useful for creating unique gallery groups
 * 
 * @param {string} prefix - Optional prefix for gallery ID
 * @returns {string} Unique gallery ID
 * 
 * @example
 * generateGalleryId('my-gallery');
 * // Returns: 'my-gallery-1234567890'
 */
export const generateGalleryId = (prefix = 'gallery') => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}-${timestamp}-${random}`;
};

