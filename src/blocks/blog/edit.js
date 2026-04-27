import { useBlockProps, InnerBlocks, InspectorControls, store as blockEditorStore } from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { BlogSidebar } from './sidebar';
import { LAYOUT_TEMPLATES } from './templates';

const BlogEdit = ( { attributes, setAttributes, clientId } ) => {
	const { layoutType, blockClass, blockData, blockId } = attributes;

	const blockProps = useBlockProps( {
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

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const innerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ) || [],
		[ clientId ]
	);

	const isFirstRender = useRef( true );
	const prevLayoutType = useRef( layoutType );

	// Apply template on first insert.
	useEffect( () => {
		if ( isFirstRender.current && innerBlocks.length === 0 ) {
			const tpl = LAYOUT_TEMPLATES[ layoutType ] || LAYOUT_TEMPLATES[ 'text-only' ];
			replaceInnerBlocks( clientId, createBlocksFromInnerBlocksTemplate( tpl ), false );
		}
		isFirstRender.current = false;
	}, [] ); // eslint-disable-line react-hooks/exhaustive-deps

	// Apply template when layout type changes.
	const handleLayoutChange = ( newLayout ) => {
		if ( newLayout === prevLayoutType.current ) return;

		setAttributes( { layoutType: newLayout } );
		prevLayoutType.current = newLayout;

		const tpl = LAYOUT_TEMPLATES[ newLayout ] || LAYOUT_TEMPLATES[ 'text-only' ];
		replaceInnerBlocks( clientId, createBlocksFromInnerBlocksTemplate( tpl ), false );
	};

	return (
		<>
			<InspectorControls>
				<BlogSidebar
					attributes={ attributes }
					setAttributes={ setAttributes }
					onLayoutChange={ handleLayoutChange }
				/>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks templateLock={ false } />
			</div>
		</>
	);
};

export default BlogEdit;
