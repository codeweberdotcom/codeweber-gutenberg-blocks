import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { GridControl, getSpacingClasses } from '../../components/grid-control';

const SpacerEdit = ( { attributes, setAttributes } ) => {
	const { blockClass, blockId } = attributes;

	const spacingClasses = getSpacingClasses( attributes, 'spacer' );

	const blockProps = useBlockProps( {
		className: [ 'cwgb-spacer', ...spacingClasses, blockClass ]
			.filter( Boolean )
			.join( ' ' ),
	} );

	return (
		<>
			<InspectorControls>
				<div style={ { padding: '16px' } }>
					<GridControl
						attributes={ attributes }
						setAttributes={ setAttributes }
						attributePrefix="spacer"
						showRowCols={ false }
						showGap={ false }
						showSpacing={ true }
					/>
					<TextControl
						label={ __( 'CSS Class', 'codeweber-gutenberg-blocks' ) }
						value={ blockClass }
						onChange={ ( value ) =>
							setAttributes( { blockClass: value } )
						}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={ __( 'Block ID', 'codeweber-gutenberg-blocks' ) }
						value={ blockId }
						onChange={ ( value ) =>
							setAttributes( { blockId: value } )
						}
						__nextHasNoMarginBottom
					/>
				</div>
			</InspectorControls>
			<div { ...blockProps }>
				<span className="cwgb-spacer__label">
					{ __( 'Spacer', 'codeweber-gutenberg-blocks' ) }
				</span>
			</div>
		</>
	);
};

export default SpacerEdit;
