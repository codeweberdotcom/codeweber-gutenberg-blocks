import { generateColorClass, generateTypographyClasses, generateTextAlignClass, generateAlignItemsClass, generateJustifyContentClass, generatePositionClass } from '../../utilities/class-generators';

export const getTitleClasses = (attrs) => {
    const classes = [];
    const {
        titleTag,
        titleColor,
        titleColorType,
        align,
        alignItems,
        justifyContent,
        position,
        titleClass,
    } = attrs;

    if (titleTag && titleTag.startsWith('display-')) {
        classes.push(titleTag);
    }

    // Color classes
    classes.push(generateColorClass(titleColor, titleColorType, 'text'));

    // Text align class
    classes.push(generateTextAlignClass(align));

    // Align items class
    classes.push(generateAlignItemsClass(alignItems));

    // Justify content class
    classes.push(generateJustifyContentClass(justifyContent));

    // Position class
    classes.push(generatePositionClass(position));

    // Typography classes
    classes.push(...generateTypographyClasses(attrs, 'title'));

    // Custom class
    if (titleClass) {
        classes.push(titleClass);
    }

    return classes.filter(Boolean).join(' ');
};

export const getSubtitleClasses = (attrs) => {
    const classes = [];
    const {
        subtitleTag,
        subtitleColor,
        subtitleColorType,
        align,
        alignItems,
        justifyContent,
        position,
        lead,
        subtitleClass,
    } = attrs;

    // Lead class
    if (lead && subtitleTag === 'p') {
        classes.push(lead);
    }

    // Color classes
    classes.push(generateColorClass(subtitleColor, subtitleColorType, 'text'));

    // Text align class
    classes.push(generateTextAlignClass(align));

    // Align items class
    classes.push(generateAlignItemsClass(alignItems));

    // Justify content class
    classes.push(generateJustifyContentClass(justifyContent));

    // Position class
    classes.push(generatePositionClass(position));

    // Typography classes
    classes.push(...generateTypographyClasses(attrs, 'subtitle'));

    // Custom class
    if (subtitleClass) {
        classes.push(subtitleClass);
    }

    return classes.filter(Boolean).join(' ');
};

export const createHeadingTagOptions = () => [
    { value: 'h1', label: 'H1' },
    { value: 'h2', label: 'H2' },
    { value: 'h3', label: 'H3' },
    { value: 'h4', label: 'H4' },
    { value: 'h5', label: 'H5' },
    { value: 'h6', label: 'H6' },
    { value: 'display-1', label: 'Display 1' },
    { value: 'display-2', label: 'Display 2' },
    { value: 'display-3', label: 'Display 3' },
    { value: 'display-4', label: 'Display 4' },
    { value: 'display-5', label: 'Display 5' },
    { value: 'display-6', label: 'Display 6' },
];

export const createSubtitleTagOptions = () => [
    { value: 'p', label: 'Paragraph' },
    { value: 'h1', label: 'H1' },
    { value: 'h2', label: 'H2' },
    { value: 'h3', label: 'H3' },
    { value: 'h4', label: 'H4' },
    { value: 'h5', label: 'H5' },
    { value: 'h6', label: 'H6' },
];

export const createSizeOptions = () => [
    { value: '', label: 'Default' },
    { value: 'fs-1', label: 'fs-1' },
    { value: 'fs-2', label: 'fs-2' },
    { value: 'fs-3', label: 'fs-3' },
    { value: 'fs-4', label: 'fs-4' },
    { value: 'fs-5', label: 'fs-5' },
    { value: 'fs-6', label: 'fs-6' },
];

export const createWeightOptions = () => [
    { value: '', label: 'Default' },
    { value: 'fw-light', label: 'fw-light (300)' },
    { value: 'fw-normal', label: 'fw-normal (400)' },
    { value: 'fw-medium', label: 'fw-medium (500)' },
    { value: 'fw-semibold', label: 'fw-semibold (600)' },
    { value: 'fw-bold', label: 'fw-bold (700)' },
    { value: 'fw-extrabold', label: 'fw-extrabold (800)' },
    { value: 'fw-black', label: 'fw-black (900)' },
    { value: 'fw-bolder', label: 'fw-bolder' },
];

export const createTransformOptions = () => [
    { value: '', label: 'Default' },
    { value: 'text-uppercase', label: 'Uppercase' },
    { value: 'text-lowercase', label: 'Lowercase' },
    { value: 'text-capitalize', label: 'Capitalize' },
];

export const createLeadOptions = () => [
    { value: '', label: 'Default' },
    { value: 'lead', label: 'lead' },
    { value: 'lead-sm', label: 'lead-sm' },
    { value: 'lead-md', label: 'lead-md' },
    { value: 'lead-lg', label: 'lead-lg' },
    { value: 'lead-xl', label: 'lead-xl' },
    { value: 'lead-xxl', label: 'lead-xxl' },
];


import { colors } from '../../utilities/colors';

export const createColorOptions = () => [
    { value: '', label: 'Default' },
    ...colors.map(color => ({ value: color.value, label: color.label })),
];

