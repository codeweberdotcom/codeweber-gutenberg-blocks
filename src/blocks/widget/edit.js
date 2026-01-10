/**
 * Widget Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { WidgetSidebar } from './sidebar';
import {
	generateColorClass,
	generateTypographyClasses,
} from '../../utilities/class-generators';

const WidgetEdit = ({ attributes, setAttributes }) => {
	const {
		enableTitle,
		title,
		titleTag,
		titleClass,
		titleColor,
		titleColorType,
	} = attributes;

	const blockProps = useBlockProps();

	// Parse data attributes
	const getDataAttributes = () => {
		if (!attributes.widgetData) return {};
		const dataAttrs = {};
		const pairs = attributes.widgetData.split(',');
		pairs.forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
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
			const colorClass = generateColorClass(
				titleColor,
				titleColorType,
				'text'
			);
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
		const typographyClasses = generateTypographyClasses(
			attributes,
			'title'
		);
		classes.push(...typographyClasses);

		// Custom class
		if (titleClass) {
			classes.push(titleClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	return (
		<>
			<InspectorControls>
				<WidgetSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<div
					className={['widget', attributes.widgetClass]
						.filter(Boolean)
						.join(' ')}
					{...(attributes.widgetId && { id: attributes.widgetId })}
					{...dataAttributes}
				>
					{enableTitle && (
						<RichText
							tagName={titleTag || 'h4'}
							value={title}
							onChange={(value) =>
								setAttributes({ title: value })
							}
							placeholder={__(
								'Enter title...',
								'codeweber-gutenberg-blocks'
							)}
							className={getTitleClasses()}
						/>
					)}
					<InnerBlocks />
				</div>
			</div>
		</>
	);
};

export default WidgetEdit;
