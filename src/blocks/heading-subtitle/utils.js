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
        subtitleLine,
        subtitleClass,
    } = attrs;

    // Lead class
    if (lead && subtitleTag === 'p') {
        classes.push(lead);
    }

    // Subtitle line class
    if (subtitleLine) {
        classes.push('text-line');
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
    { value: 'div', label: 'Div' },
    { value: 'p', label: 'Paragraph' },
    { value: 'span', label: 'Span' },
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
    { value: 'div', label: 'Div' },
    { value: 'span', label: 'Span' },
];

export const createTextTagOptions = () => [
    { value: 'p', label: 'Paragraph' },
    { value: 'div', label: 'Div' },
    { value: 'span', label: 'Span' },
    { value: 'h1', label: 'H1' },
    { value: 'h2', label: 'H2' },
    { value: 'h3', label: 'H3' },
    { value: 'h4', label: 'H4' },
    { value: 'h5', label: 'H5' },
    { value: 'h6', label: 'H6' },
];

export const createSizeOptions = () => [
    { value: '', label: 'Default' },
    // H-классы (размеры h1-h6 как классы)
    { value: 'h1', label: 'h1' },
    { value: 'h2', label: 'h2' },
    { value: 'h3', label: 'h3' },
    { value: 'h4', label: 'h4' },
    { value: 'h5', label: 'h5' },
    { value: 'h6', label: 'h6' },
    // Bootstrap размеры
    { value: 'fs-sm', label: 'fs-sm' },
    { value: 'fs-lg', label: 'fs-lg' },
    // fs-1 до fs-6
    { value: 'fs-1', label: 'fs-1' },
    { value: 'fs-2', label: 'fs-2' },
    { value: 'fs-3', label: 'fs-3' },
    { value: 'fs-4', label: 'fs-4' },
    { value: 'fs-5', label: 'fs-5' },
    { value: 'fs-6', label: 'fs-6' },
    // Малые размеры
    { value: 'fs-13', label: 'fs-13' },
    { value: 'fs-14', label: 'fs-14' },
    { value: 'fs-15', label: 'fs-15' },
    { value: 'fs-16', label: 'fs-16' },
    { value: 'fs-17', label: 'fs-17' },
    { value: 'fs-18', label: 'fs-18' },
    { value: 'fs-19', label: 'fs-19' },
    { value: 'fs-20', label: 'fs-20' },
    { value: 'fs-21', label: 'fs-21' },
    { value: 'fs-22', label: 'fs-22' },
    { value: 'fs-23', label: 'fs-23' },
    { value: 'fs-24', label: 'fs-24' },
    { value: 'fs-25', label: 'fs-25' },
    { value: 'fs-26', label: 'fs-26' },
    { value: 'fs-27', label: 'fs-27' },
    { value: 'fs-28', label: 'fs-28' },
    { value: 'fs-30', label: 'fs-30' },
    // Средние размеры
    { value: 'fs-32', label: 'fs-32' },
    { value: 'fs-35', label: 'fs-35' },
    { value: 'fs-40', label: 'fs-40' },
    { value: 'fs-45', label: 'fs-45' },
    { value: 'fs-50', label: 'fs-50' },
    // Большие размеры
    { value: 'fs-55', label: 'fs-55' },
    { value: 'fs-60', label: 'fs-60' },
    { value: 'fs-65', label: 'fs-65' },
    { value: 'fs-70', label: 'fs-70' },
    { value: 'fs-75', label: 'fs-75' },
    { value: 'fs-80', label: 'fs-80' },
    { value: 'fs-85', label: 'fs-85' },
    { value: 'fs-90', label: 'fs-90' },
    { value: 'fs-95', label: 'fs-95' },
    { value: 'fs-100', label: 'fs-100' },
    // Очень большие размеры
    { value: 'fs-110', label: 'fs-110' },
    { value: 'fs-120', label: 'fs-120' },
    { value: 'fs-130', label: 'fs-130' },
    { value: 'fs-140', label: 'fs-140' },
    { value: 'fs-150', label: 'fs-150' },
    { value: 'fs-160', label: 'fs-160' },
    { value: 'fs-170', label: 'fs-170' },
    { value: 'fs-180', label: 'fs-180' },
    { value: 'fs-190', label: 'fs-190' },
    { value: 'fs-200', label: 'fs-200' },
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

