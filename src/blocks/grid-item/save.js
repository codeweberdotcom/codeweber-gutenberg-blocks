import { InnerBlocks } from '@wordpress/block-editor';
import {
	generateItemStyles,
	getItemClassNames,
	normalizeItemId,
	normalizeItemData,
} from './utils';

export default function Save( { attributes } ) {
	const { itemId, itemHtmlId, itemData, backgroundType, backgroundImageUrl, backgroundPatternUrl } =
		attributes;

	const css = generateItemStyles( attributes, itemId );
	const className = getItemClassNames( attributes );
	const id = normalizeItemId( itemHtmlId ) || undefined;

	const hasValidImageUrl =
		backgroundImageUrl &&
		backgroundImageUrl !== 'null' &&
		backgroundImageUrl.trim() !== '';
	const hasValidPatternUrl =
		backgroundPatternUrl &&
		backgroundPatternUrl !== 'null' &&
		backgroundPatternUrl.trim() !== '';

	const bgDataAttrs = {
		...( backgroundType === 'image' &&
			hasValidImageUrl && { 'data-image-src': backgroundImageUrl } ),
		...( backgroundType === 'pattern' &&
			hasValidPatternUrl && { 'data-image-src': backgroundPatternUrl } ),
	};

	return (
		<>
			{ css && (
				// eslint-disable-next-line react/no-danger
				<style dangerouslySetInnerHTML={ { __html: css } } />
			) }
			<div
				className={ className }
				id={ id }
				{ ...bgDataAttrs }
				{ ...normalizeItemData( itemData ) }
			>
				<InnerBlocks.Content />
			</div>
		</>
	);
}
