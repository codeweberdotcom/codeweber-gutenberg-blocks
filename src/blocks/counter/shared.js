/**
 * Counter Block - Shared helpers
 *
 * Keeps edit.js and save.js in sync: class/style generation and the
 * layout arrangement of the prebuilt elements (icon, counter, label,
 * subtitle, ratings).
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { generateBackgroundClasses } from '../../utilities/class-generators';
import { getSpacingClasses } from '../section/utils';
import { getTitleClasses } from '../heading-subtitle/utils';

/**
 * Classes for the counter number element (always gets `.counter`).
 */
export const getCounterClasses = (attributes) => {
	const classes = ['counter'];

	if (attributes.counterLg) {
		classes.push('counter-lg');
	}

	if (attributes.textWhite) {
		classes.push('text-white');
	}

	const titleClasses = getTitleClasses(attributes);
	if (titleClasses) {
		classes.push(titleClasses);
	}

	return classes.filter(Boolean).join(' ');
};

/**
 * Classes for the root element (card wrapper or bare container).
 */
export const getRootClasses = (attributes) => {
	const {
		enableCard,
		overflowHidden,
		h100,
		borderRadius,
		shadow,
		cardBorder,
		borderColor,
		borderColorType,
		borderWidth,
		borderPosition,
		borderAccent,
		align,
		textWhite,
		positionType,
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageUrl,
		backgroundSize,
		backgroundPatternUrl,
		backgroundOverlay,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		spacingXxxl,
		blockClass,
	} = attributes;

	const classes = [];

	if (enableCard) {
		classes.push('card');
	}

	if (overflowHidden) {
		classes.push('overflow-hidden');
	}

	if (h100) {
		classes.push('h-100');
	}

	if (borderRadius) {
		classes.push(borderRadius);
	}

	if (shadow) {
		classes.push(shadow);
	}

	if (cardBorder || borderPosition) {
		classes.push(cardBorder || borderPosition);
	}

	if ((borderColor || borderWidth) && !cardBorder && !borderPosition) {
		classes.push('border');
	}

	if (borderWidth) {
		classes.push(borderWidth);
	}

	if (borderColor) {
		const colorType = borderColorType || 'solid';
		if (colorType === 'soft') {
			classes.push(`border-soft-${borderColor}`);
		} else {
			classes.push(`border-${borderColor}`);
		}
	}

	if (borderAccent) {
		classes.push(borderAccent);
	}

	if (align) {
		classes.push(align);
	}

	// text-white on the bare container (cards keep it on the counter itself)
	if (textWhite && !enableCard) {
		classes.push('text-white');
	}

	if (positionType) {
		classes.push(positionType);
	}

	classes.push(
		...generateBackgroundClasses({
			backgroundType,
			backgroundColor,
			backgroundColorType,
			backgroundGradient,
			backgroundImageUrl,
			backgroundSize,
			backgroundPatternUrl,
			backgroundOverlay,
		})
	);

	classes.push(
		...getSpacingClasses({
			spacingType,
			spacingXs,
			spacingSm,
			spacingMd,
			spacingLg,
			spacingXl,
			spacingXxl,
			spacingXxxl,
		})
	);

	if (blockClass) {
		classes.push(blockClass);
	}

	return classes.filter(Boolean).join(' ');
};

/**
 * Inline styles for absolute/relative positioning offsets and z-index.
 */
export const getPositionStyles = (attributes) => {
	const { offsetTop, offsetBottom, offsetLeft, offsetRight, zIndex } =
		attributes;
	const styles = {};

	if (offsetTop) styles.top = offsetTop;
	if (offsetBottom) styles.bottom = offsetBottom;
	if (offsetLeft) styles.left = offsetLeft;
	if (offsetRight) styles.right = offsetRight;
	if (zIndex) styles.zIndex = zIndex;

	return Object.keys(styles).length > 0 ? styles : undefined;
};

/**
 * data-* attributes parsed from the blockData string ("key=value, key2=value2").
 */
export const getDataAttributes = (blockData) => {
	const dataAttrs = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttrs[`data-${key}`] = value;
			}
		});
	}
	return dataAttrs;
};

/**
 * Arrange the prebuilt elements according to the chosen layout preset.
 *
 * @param {string} layout   counter-1 | counter-2 | counter-3 | counter-4
 * @param {Object} elements { icon, counter, label, subtitle, ratings }
 * @return {JSX.Element}
 */
export const arrangeLayout = (layout, elements) => {
	const { icon, counter, label, subtitle, ratings } = elements;

	// Layout 4: counter + subtitle (h6) + ratings
	if (layout === 'counter-4') {
		return (
			<>
				{counter}
				{subtitle}
				{ratings}
			</>
		);
	}

	// Layout 3: counter + label only (no icon)
	if (layout === 'counter-3') {
		return (
			<>
				{counter}
				{label}
			</>
		);
	}

	// Layout 2: icon on top, then counter + label
	if (layout === 'counter-2') {
		return (
			<>
				{icon}
				{counter}
				{label}
			</>
		);
	}

	// Layout 1 (default): icon on the left, counter + label on the right
	return (
		<div className="d-flex d-lg-block d-xl-flex flex-row">
			<div>{icon}</div>
			<div>
				{counter}
				{label}
			</div>
		</div>
	);
};
