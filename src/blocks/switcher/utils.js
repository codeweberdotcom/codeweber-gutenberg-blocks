/**
 * Switcher helpers shared by the editor preview and the server render.
 */

/** Size presets: [link padding + font size]. */
export const SIZE_CLASSES = {
	sm: 'px-3 py-1 fs-14',
	md: 'px-4 py-2 fs-15',
	lg: 'px-5 py-3 fs-17',
};

export const ALIGN_CLASSES = {
	start: 'justify-content-start',
	center: 'justify-content-center',
	end: 'justify-content-end',
};

/**
 * Classes for one item.
 *
 * @param {Object}  props
 * @param {string}  props.switchStyle - 'pill' | 'segmented'
 * @param {string}  props.switchColor - theme colour name
 * @param {string}  props.switchSize  - 'sm' | 'md' | 'lg'
 * @param {boolean} props.isActive    - whether this item is the current one
 * @param {boolean} props.isLast      - last item, drops the trailing margin
 * @return {string} Class list
 */
export const getItemClasses = ({
	switchStyle,
	switchColor,
	switchSize,
	isActive,
	isLast,
}) => {
	const size = SIZE_CLASSES[switchSize] || SIZE_CLASSES.md;

	if (switchStyle === 'segmented') {
		return [
			'btn',
			isActive
				? `btn-soft-${switchColor} border-${switchColor} fw-bold`
				: 'btn-outline-ash',
			size,
		]
			.filter(Boolean)
			.join(' ');
	}

	return [
		'nav-link',
		'rounded-pill',
		isActive ? `active text-${switchColor}` : 'text-white',
		isLast ? 'me-0' : '',
		size,
	]
		.filter(Boolean)
		.join(' ');
};

/**
 * Classes for the container.
 *
 * @param {Object} props
 * @param {string} props.switchStyle
 * @param {string} props.switchColor
 * @param {string} props.blockClass
 * @return {string} Class list
 */
export const getContainerClasses = ({
	switchStyle,
	switchColor,
	blockClass,
}) => {
	if (switchStyle === 'segmented') {
		return ['btn-group', blockClass].filter(Boolean).join(' ');
	}

	return [
		'nav',
		'nav-pills',
		`bg-${switchColor}`,
		'rounded-pill',
		'p-1',
		'd-inline-flex',
		blockClass,
	]
		.filter(Boolean)
		.join(' ');
};
