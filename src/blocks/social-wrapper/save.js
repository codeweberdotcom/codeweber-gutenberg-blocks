/**
 * Social Wrapper Block - Save
 */

import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';

const SocialWrapperSave = ({ attributes }) => {
	const { SocialIconStyle, wrapperClass, blockId, blockData } = attributes;
	const navClassName = [
		'nav',
		'social',
		SocialIconStyle === 'style_2' ? 'social-muted' : '',
		wrapperClass,
	]
		.filter(Boolean)
		.join(' ');
	const blockProps = useBlockProps.save({
		className: navClassName,
		...(blockId && { id: blockId.replace(/^#/, '') }),
	});
	const dataAttrs = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s?.trim());
			if (key && value) dataAttrs[`data-${key}`] = value;
		});
	}

	return (
		<nav {...blockProps} {...dataAttrs}>
			<InnerBlocks.Content />
		</nav>
	);
};

export default SocialWrapperSave;
