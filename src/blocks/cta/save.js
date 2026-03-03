import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const CTASave = ({ attributes }) => {
	const { blockClass, blockId, blockData } = attributes;
	const blockProps = useBlockProps.save({
		className: ['cta-block', blockClass].filter(Boolean).join(' '),
		...(blockId ? { id: blockId } : {}),
		...(blockData && typeof blockData === 'string'
			? Object.fromEntries(
					blockData.split(',').reduce((acc, pair) => {
						const eq = pair.indexOf('=');
						if (eq > 0) {
							const key = pair.slice(0, eq).trim();
							const value = pair.slice(eq + 1).trim();
							if (key) acc.push([`data-${key}`, value]);
						}
						return acc;
					}, [])
			  )
			: {}),
	});

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
};

export default CTASave;
