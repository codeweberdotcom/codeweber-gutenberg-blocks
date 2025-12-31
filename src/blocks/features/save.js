/**
 * Features Block - Save Component
 * 
 * This block renders child blocks (columns -> column -> feature).
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const FeaturesSave = () => {
	const blockProps = useBlockProps.save({
		className: 'features-wrapper',
	});
	
	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
};

export default FeaturesSave;

