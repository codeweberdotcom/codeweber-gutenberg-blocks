/**
 * Card Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses, generateAlignmentClasses } from '../../utilities/class-generators';
import { getSpacingClasses } from '../section/utils';

/**
 * Save Component
 */
const Save = ({ attributes }) => {
	const {
		enableCard,
		enableCardBody,
		overflowHidden,
		h100,
		borderRadius,
		shadow,
		cardBorder,
		borderColor,
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageUrl,
		backgroundSize,
		backgroundPatternUrl,
		backgroundOverlay,
		blockClass,
		blockId,
		blockData,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
	} = attributes;

	// Generate classes for card wrapper
	const getCardClasses = () => {
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
		
		if (cardBorder) {
			classes.push(cardBorder);
			if (borderColor) {
				classes.push(`border-${borderColor}`);
			}
		}
		
		// Background classes (color, gradient, image)
		classes.push(...generateBackgroundClasses(attributes));
		
		// Spacing classes
		classes.push(...getSpacingClasses(attributes));
		
		// Alignment classes
		classes.push(...generateAlignmentClasses(attributes));
		
		// Custom class
		if (blockClass) {
			classes.push(blockClass);
		}
		
		return classes.filter(Boolean).join(' ');
	};

	// Parse data attributes
	const getDataAttributes = () => {
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

	const cardClasses = getCardClasses();
	const dataAttributes = getDataAttributes();

	// If card is disabled, just output InnerBlocks
	if (!enableCard) {
		return <InnerBlocks.Content />;
	}

	return (
		<div
			{...(cardClasses && { className: cardClasses })}
			{...(blockId && { id: blockId })}
			{...(backgroundType === 'image' && backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
			{...(backgroundType === 'pattern' && backgroundPatternUrl && { 'data-image-src': backgroundPatternUrl })}
			{...dataAttributes}
			{...(animationEnabled && animationType && { 
				'data-cue': animationType,
				...(animationDuration && { 'data-duration': animationDuration }),
				...(animationDelay && { 'data-delay': animationDelay }),
			})}
		>
			{enableCardBody ? (
				<div className="card-body">
					<InnerBlocks.Content />
				</div>
			) : (
				<InnerBlocks.Content />
			)}
		</div>
	);
};

export default Save;

