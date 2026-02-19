/**
 * Dropcap Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';

function getDropcapClasses(attributes) {
	const { style, color, colorType, circleBgType } = attributes;
	const classes = ['dropcap'];

	const textPrefix = colorType === 'solid' ? '' : `${colorType}-`;
	const textClass = color ? `text-${textPrefix}${color}`.replace(/-$/, '') : '';
	if (textClass) classes.push(textClass);

	if (style === 'circle') {
		classes.push('rounded-circle');
		const bgPrefix = circleBgType === 'solid' ? '' : `${circleBgType}-`;
		const bgClass = color ? `bg-${bgPrefix}${color}`.replace(/-$/, '') : '';
		if (bgClass) classes.push(bgClass);
	}

	return classes.join(' ');
}

const save = ({ attributes }) => {
	const { content } = attributes;
	const blockProps = useBlockProps.save();
	const { className: blockClassName, ...restBlockProps } = blockProps;
	const className = (blockClassName || '')
		.replace(/\bwp-block-codeweber-blocks-dropcap\b/g, '')
		.trim() || undefined;
	const dropcapClassName = getDropcapClasses(attributes);
	const first = (content && content.length) ? content.charAt(0) : 'A';
	const rest = (content && content.length > 1) ? content.slice(1) : '';

	return (
		<p {...restBlockProps} className={className}>
			<span className={dropcapClassName}>{first}</span>
			{rest && <span dangerouslySetInnerHTML={{ __html: rest }} />}
		</p>
	);
};

export default save;
