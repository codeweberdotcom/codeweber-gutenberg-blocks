export const getTitleClasses = (attrs) => {
    const classes = [];
    const {
        titleTag,
        titleColor,
        titleColorType,
        align,
        titleSize,
        titleWeight,
        titleTransform,
        titleLine,
    } = attrs;

    if (titleTag && titleTag.startsWith('display-')) {
        classes.push(titleTag);
    }

    if (titleColor) {
        if (titleColorType === 'soft') {
            classes.push(`text-soft-${titleColor}`);
        } else if (titleColorType === 'pale') {
            classes.push(`text-pale-${titleColor}`);
        } else {
            classes.push(`text-${titleColor}`);
        }
    }

    if (align) {
        classes.push(`text-${align}`);
    }

    if (titleSize) {
        classes.push(titleSize);
    }

    if (titleWeight) {
        classes.push(titleWeight);
    }

    if (titleTransform) {
        classes.push(titleTransform);
    }

    if (titleLine) {
        classes.push('text-line');
    }

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
        subtitleSize,
        subtitleWeight,
        subtitleTransform,
        subtitleLine,
        lead,
    } = attrs;

    if (lead && subtitleTag === 'p') {
        classes.push('lead');
    }

    if (subtitleColor) {
        if (subtitleColorType === 'soft') {
            classes.push(`text-soft-${subtitleColor}`);
        } else if (subtitleColorType === 'pale') {
            classes.push(`text-pale-${subtitleColor}`);
        } else {
            classes.push(`text-${subtitleColor}`);
        }
    }

    if (align) {
        classes.push(`text-${align}`);
    }

    if (subtitleSize) {
        classes.push(subtitleSize);
    }

    if (subtitleWeight) {
        classes.push(subtitleWeight);
    }

    if (subtitleTransform) {
        classes.push(subtitleTransform);
    }

    if (subtitleLine) {
        classes.push('text-line');
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
    { value: 'fs-1', label: 'Extra Small' },
    { value: 'fs-2', label: 'Small' },
    { value: 'fs-3', label: 'Medium' },
    { value: 'fs-4', label: 'Large' },
    { value: 'fs-5', label: 'Extra Large' },
    { value: 'fs-6', label: 'XX Large' },
];

export const createWeightOptions = () => [
    { value: '', label: 'Default' },
    { value: 'fw-light', label: 'Light' },
    { value: 'fw-normal', label: 'Normal' },
    { value: 'fw-bold', label: 'Bold' },
    { value: 'fw-bolder', label: 'Bolder' },
];

export const createTransformOptions = () => [
    { value: '', label: 'Default' },
    { value: 'text-uppercase', label: 'Uppercase' },
    { value: 'text-lowercase', label: 'Lowercase' },
    { value: 'text-capitalize', label: 'Capitalize' },
];


import { colors } from '../../utilities/colors';

export const createColorOptions = () => [
    { value: '', label: 'Default' },
    ...colors.map(color => ({ value: color.value, label: color.label })),
];

