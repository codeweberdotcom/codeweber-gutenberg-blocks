/**
 * Widget Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { generateColorClass, generateTypographyClasses } from '../../utilities/class-generators';

const WidgetSave = ({ attributes }) => {
	const {
		enableTitle,
		title,
		titleTag,
		titleClass,
		titleColor,
		titleColorType,
	} = attributes;

	// Parse data attributes
	const getDataAttributes = () => {
		if (!attributes.widgetData) return {};
		const dataAttrs = {};
		const pairs = attributes.widgetData.split(',');
		pairs.forEach(pair => {
			const [key, value] = pair.split('=').map(s => s.trim());
			if (key && value) {
				dataAttrs[`data-${key}`] = value;
			}
		});
		return dataAttrs;
	};

	const dataAttributes = getDataAttributes();

	// Generate title classes
	const getTitleClasses = () => {
		const classes = ['widget-title'];
		
		// Color classes
		let hasColorClass = false;
		if (titleColor) {
			const colorClass = generateColorClass(titleColor, titleColorType, 'text');
			if (colorClass) {
				classes.push(colorClass);
				hasColorClass = true;
			}
		}

		// Add default text-dark if no custom color is set
		if (!hasColorClass) {
			classes.push('text-dark');
		}

		// Typography classes
		const typographyClasses = generateTypographyClasses(attributes, 'title');
		classes.push(...typographyClasses);

		// Custom class
		if (titleClass) {
			classes.push(titleClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	// Build className with widget class and custom class
	const widgetClasses = ['widget'];
	if (attributes.widgetClass) {
		widgetClasses.push(attributes.widgetClass);
	}
	const widgetClassName = widgetClasses.filter(Boolean).join(' ');

	return (
		<div
			className={widgetClassName}
			{...(attributes.widgetId && { id: attributes.widgetId })}
			{...dataAttributes}
		>
			{enableTitle && title && (
				<RichText.Content
					tagName={titleTag || 'h4'}
					value={title}
					className={getTitleClasses()}
				/>
			)}
			<InnerBlocks.Content />
		</div>
	);
};

export default WidgetSave;

