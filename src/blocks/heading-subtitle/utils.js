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
        titleClass,
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
    { value: 'fs-15', label: 'FS 15' },
    { value: 'fs-16', label: 'FS 16' },
    { value: 'fs-17', label: 'FS 17' },
    { value: 'fs-18', label: 'FS 18' },
    { value: 'fs-19', label: 'FS 19' },
    { value: 'fs-20', label: 'FS 20' },
    { value: 'fs-21', label: 'FS 21' },
    { value: 'fs-22', label: 'FS 22' },
    { value: 'fs-23', label: 'FS 23' },
    { value: 'fs-24', label: 'FS 24' },
    { value: 'fs-25', label: 'FS 25' },
    { value: 'fs-26', label: 'FS 26' },
    { value: 'fs-27', label: 'FS 27' },
    { value: 'fs-28', label: 'FS 28' },
    { value: 'fs-29', label: 'FS 29' },
    { value: 'fs-30', label: 'FS 30' },
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

