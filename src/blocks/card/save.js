/**
 * Card Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { InnerBlocks } from '@wordpress/block-editor';
import { CodeRender } from '../../components/code';
import {
	generateBackgroundClasses,
	generateAlignmentClasses,
} from '../../utilities/class-generators';
import { getSpacingClasses } from '../section/utils';

/**
 * Save Component
 */
const Save = ({ attributes }) => {
	const {
		cardType,
		enableCard,
		enableCardBody,
		overflowHidden,
		h100,
		borderRadius,
		shadow,
		cardBorder,
		borderColor,
		borderPosition,
		borderWidth,
		borderColorType,
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageUrl,
		backgroundSize,
		backgroundPatternUrl,
		backgroundOverlay,
		blockClass,
		cardBodyClass,
		blockId,
		blockData,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		enableCardFooter,
		cardFooterLinkText,
		cardFooterCode,
		cardFooterCollapseId,
		cardFooterCodeLanguage,
		cardFooterCodeBackground,
		cardFooterLinkColor,
	} = attributes;

	// Generate classes for card wrapper
	const getCardClasses = () => {
		const classes = [];

		// Card-specific classes only apply in card mode
		if (cardType === 'card') {
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

			// Если выбраны цвет или ширина, но нет позиции - применяем обычный border
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
				} else if (colorType === 'pale') {
					classes.push(`border-pale-${borderColor}`);
				} else {
					classes.push(`border-${borderColor}`);
				}
			}
		}

		// Background classes (color, gradient, image)
		classes.push(...generateBackgroundClasses(attributes));

		// Spacing classes
		classes.push(...getSpacingClasses(attributes));

		// Alignment classes - применяются к card только если card-body не включен (только для card mode)
		if (cardType === 'card' && !enableCardBody) {
			classes.push(...generateAlignmentClasses(attributes));
		} else if (cardType === 'wrapper') {
			// Для wrapper всегда применяем alignment
			classes.push(...generateAlignmentClasses(attributes));
		}

		// Custom class
		if (blockClass) {
			classes.push(blockClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	// Generate classes for card-body
	const getCardBodyClasses = () => {
		const classes = ['card-body'];

		// Alignment classes - применяются к card-body если он включен
		if (enableCardBody) {
			classes.push(...generateAlignmentClasses(attributes));
		}

		if (cardBodyClass) {
			classes.push(cardBodyClass);
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

	// If card type is card and card is disabled, just output InnerBlocks
	if (cardType === 'card' && !enableCard) {
		return <InnerBlocks.Content />;
	}

	return (
		<div
			{...(cardClasses && { className: cardClasses })}
			{...(blockId && { id: blockId })}
			{...(backgroundType === 'image' &&
				backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
			{...(backgroundType === 'pattern' &&
				backgroundPatternUrl && {
					'data-image-src': backgroundPatternUrl,
				})}
			{...dataAttributes}
			{...(animationEnabled &&
				animationType && {
					'data-cue': animationType,
					...(animationDuration && {
						'data-duration': animationDuration,
					}),
					...(animationDelay && { 'data-delay': animationDelay }),
				})}
		>
			{cardType === 'card' && enableCardBody ? (
				<div className={getCardBodyClasses()}>
					<InnerBlocks.Content />
				</div>
			) : (
				<InnerBlocks.Content />
			)}
			{cardType === 'card' &&
				enableCard &&
				enableCardFooter &&
				(cardFooterCollapseId || blockId) && (() => {
					const collapseId =
						cardFooterCollapseId || (blockId ? 'collapse-' + blockId : 'collapse-1');
					return (
						<>
							<div className="card-footer position-relative">
								<a
									className={
										'collapse-link stretched-link collapsed' +
										(cardFooterLinkColor === 'light' ? ' text-light' : '')
									}
									href={'#' + collapseId}
									data-bs-toggle="collapse"
									aria-expanded="false"
								>
									{cardFooterLinkText || '{{CODEWEBER_DEFAULT_FOOTER_LINK}}'}
								</a>
							</div>
							<div
								id={collapseId}
								className={
									'card-footer p-0 accordion-collapse collapse ' +
									(cardFooterCodeBackground === 'light' ? 'bg-light' : 'bg-dark')
								}
							>
								<CodeRender
									content={cardFooterCode || ''}
									language={cardFooterCodeLanguage || 'html'}
									copyLabel="Copy"
									backgroundColor={cardFooterCodeBackground || 'dark'}
								/>
							</div>
						</>
					);
				})()}
		</div>
	);
};

export default Save;
