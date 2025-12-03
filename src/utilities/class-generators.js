/**
 * Utility functions for generating CSS classes
 */

/**
 * Generate color classes based on color and type
 * @param {string} color - Color name
 * @param {string} colorType - 'solid', 'soft', 'pale'
 * @param {string} prefix - Prefix for class (e.g., 'text', 'bg')
 * @returns {string} CSS class
 */
export const generateColorClass = (color, colorType, prefix = 'text') => {
    if (!color) return '';

    if (colorType === 'soft') {
        return `${prefix}-soft-${color}`;
    } else if (colorType === 'pale') {
        return `${prefix}-pale-${color}`;
    } else {
        return `${prefix}-${color}`;
    }
};

/**
 * Generate typography classes
 * @param {Object} attrs - Attributes object
 * @param {string} prefix - 'title' or 'subtitle'
 * @returns {string[]} Array of classes
 */
export const generateTypographyClasses = (attrs, prefix) => {
    const classes = [];

    const size = attrs[`${prefix}Size`];
    const weight = attrs[`${prefix}Weight`];
    const transform = attrs[`${prefix}Transform`];
    const line = attrs[`${prefix}Line`];
    const tag = attrs[`${prefix}Tag`];

    if (tag && tag.startsWith('display-')) {
        classes.push(tag);
    }

    if (size) {
        classes.push(size);
    }

    if (weight) {
        classes.push(weight);
    }

    if (transform) {
        classes.push(transform);
    }

    if (line) {
        classes.push('text-line');
    }

    return classes;
};

/**
 * Generate background classes for section
 * @param {Object} attrs - Attributes object
 * @returns {string[]} Array of classes
 */
export const generateBackgroundClasses = (attrs) => {
    const classes = [];

    const { backgroundType, backgroundColor, backgroundColorType, backgroundGradient, backgroundSize, backgroundOverlay } = attrs;

    switch (backgroundType) {
        case 'color':
            if (backgroundColorType === 'gradient' && backgroundGradient) {
                classes.push(backgroundGradient);
            } else if (backgroundColor) {
                classes.push(generateColorClass(backgroundColor, backgroundColorType, 'bg'));
            }
            break;
        case 'image':
            classes.push('image-wrapper', 'bg-image');
            if (backgroundSize) {
                classes.push(backgroundSize);
            }
            if (backgroundOverlay) {
                if (backgroundOverlay === 'bg-overlay-300' || backgroundOverlay === 'bg-overlay-400') {
                    classes.push('bg-overlay', backgroundOverlay);
                } else {
                    classes.push(backgroundOverlay);
                }
            } else {
                classes.push('bg-overlay');
            }
            break;
        case 'pattern':
            classes.push('pattern-wrapper', 'bg-image', 'text-white');
            if (backgroundSize) {
                classes.push(backgroundSize);
            }
            break;
        case 'video':
            classes.push('video-wrapper', 'ratio', 'ratio-16x9');
            if (backgroundOverlay) {
                if (backgroundOverlay === 'bg-overlay-300' || backgroundOverlay === 'bg-overlay-400') {
                    classes.push('bg-overlay', backgroundOverlay);
                } else {
                    classes.push(backgroundOverlay);
                }
            } else if (backgroundOverlay !== '') {
                classes.push('bg-overlay');
            }
            break;
    }

    return classes;
};

/**
 * Generate text color class
 * @param {string} textColor - Text color
 * @returns {string} CSS class
 */
export const generateTextColorClass = (textColor) => {
    return textColor || '';
};

/**
 * Generate text alignment classes
 * @param {string} align - Alignment value
 * @returns {string} CSS class
 */
export const generateTextAlignClass = (align) => {
    if (!align) return '';
    return align.startsWith('text-') ? align : `text-${align}`;
};

/**
 * Generate align items classes
 * @param {string} alignItems - Align items value
 * @returns {string} CSS class
 */
export const generateAlignItemsClass = (alignItems) => {
    return alignItems || '';
};

/**
 * Generate justify content classes
 * @param {string} justifyContent - Justify content value
 * @returns {string} CSS class
 */
export const generateJustifyContentClass = (justifyContent) => {
    return justifyContent || '';
};

/**
 * Generate position classes
 * @param {string} position - Position value
 * @returns {string} CSS class
 */
export const generatePositionClass = (position) => {
    return position || '';
};

/**
 * Generate lead class for subtitle
 * @param {boolean} lead - Lead flag
 * @param {string} tag - Tag name
 * @returns {string} CSS class
 */
export const generateLeadClass = (lead, tag) => {
    return lead && tag === 'p' ? 'lead' : '';
};

/**
 * Validation functions
 */

/**
 * Validate color value
 * @param {string} color - Color to validate
 * @param {string[]} allowedColors - Array of allowed colors
 * @returns {boolean} Is valid
 */
export const validateColor = (color, allowedColors = []) => {
    if (!color) return true; // Empty is valid
    return allowedColors.includes(color);
};

/**
 * Validate size value
 * @param {string} size - Size to validate
 * @param {string[]} allowedSizes - Array of allowed sizes
 * @returns {boolean} Is valid
 */
export const validateSize = (size, allowedSizes = []) => {
    if (!size) return true;
    return allowedSizes.includes(size);
};

/**
 * Validate tag value
 * @param {string} tag - Tag to validate
 * @param {string[]} allowedTags - Array of allowed tags
 * @returns {boolean} Is valid
 */
export const validateTag = (tag, allowedTags = []) => {
    if (!tag) return true;
    return allowedTags.includes(tag);
};

/**
 * Generate spacing classes (padding and margin)
 * @param {Object} attrs - Attributes object
 * @returns {string[]} Array of spacing classes
 */
export const generateSpacingClasses = (attrs) => {
    const classes = [];
    
    // Padding
    if (attrs.paddingTop) classes.push(`pt-${attrs.paddingTop}`);
    if (attrs.paddingBottom) classes.push(`pb-${attrs.paddingBottom}`);
    if (attrs.paddingLeft) classes.push(`ps-${attrs.paddingLeft}`);
    if (attrs.paddingRight) classes.push(`pe-${attrs.paddingRight}`);
    
    // Margin
    if (attrs.marginTop) classes.push(`mt-${attrs.marginTop}`);
    if (attrs.marginBottom) classes.push(`mb-${attrs.marginBottom}`);
    
    return classes;
};

/**
 * Generate alignment classes
 * @param {Object} attrs - Attributes object
 * @returns {string[]} Array of alignment classes
 */
export const generateAlignmentClasses = (attrs) => {
    const classes = [];
    
    // Text align
    if (attrs.align) {
        classes.push(generateTextAlignClass(attrs.align));
    }
    
    // Align items
    if (attrs.alignItems) {
        classes.push(generateAlignItemsClass(attrs.alignItems));
    }
    
    // Justify content
    if (attrs.justifyContent) {
        classes.push(generateJustifyContentClass(attrs.justifyContent));
    }
    
    // Position
    if (attrs.position) {
        classes.push(generatePositionClass(attrs.position));
    }
    
    return classes.filter(Boolean);
};