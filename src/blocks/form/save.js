import { InnerBlocks } from '@wordpress/block-editor';

// Dynamic block rendered server-side via render.php.
// InnerBlocks.Content serializes inner blocks into the block comment
// so PHP can receive them via $block->inner_blocks / parse_blocks().
export default function save() {
	return <InnerBlocks.Content />;
}
