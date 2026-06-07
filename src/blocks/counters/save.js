/**
 * Counters Block - Save Component
 *
 * Renders child blocks (columns -> column -> counter).
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { InnerBlocks } from '@wordpress/block-editor';

const CountersSave = ({ attributes }) => {
	const { enableMasonry } = attributes;

	// Masonry needs a .grid ancestor wrapping the .isotope row (theme.isotope()).
	if (enableMasonry) {
		return (
			<div className="grid">
				<InnerBlocks.Content />
			</div>
		);
	}

	return <InnerBlocks.Content />;
};

export default CountersSave;
