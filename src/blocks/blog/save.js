import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const BlogSave = ( { attributes } ) => {
	const { layoutType, blockClass, blockData, blockId } = attributes;

	const blockProps = useBlockProps.save( {
		className: [
			'cwgb-blog-section',
			`layout-${ layoutType }`,
			blockClass,
		]
			.filter( Boolean )
			.join( ' ' ),
		...( blockId ? { id: blockId } : {} ),
		...( blockData ? { 'data-attrs': blockData } : {} ),
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
};

export default BlogSave;
