import { useBlockProps } from '@wordpress/block-editor';

import { getSpacingClasses } from '../../components/grid-control';

const SpacerSave = ( { attributes } ) => {
	const { blockClass, blockId } = attributes;

	const spacingClasses = getSpacingClasses( attributes, 'spacer' );

	const blockProps = useBlockProps.save( {
		className: [ 'cwgb-spacer', ...spacingClasses, blockClass ]
			.filter( Boolean )
			.join( ' ' ),
		...( blockId ? { id: blockId } : {} ),
	} );

	return <div { ...blockProps } />;
};

export default SpacerSave;
