import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { LAYOUT_OPTIONS } from './templates';

export const BlogSidebar = ( { attributes, setAttributes, onLayoutChange } ) => {
	const { layoutType, blockClass, blockData, blockId } = attributes;

	return (
		<>
			<PanelBody
				title={ __( 'Layout', 'codeweber-gutenberg-blocks' ) }
				initialOpen={ true }
			>
				<SelectControl
					label={ __( 'Layout type', 'codeweber-gutenberg-blocks' ) }
					value={ layoutType }
					options={ LAYOUT_OPTIONS }
					onChange={ onLayoutChange }
					__nextHasNoMarginBottom
					help={ __(
						'Changing the layout replaces the inner content with a new template.',
						'codeweber-gutenberg-blocks'
					) }
				/>
			</PanelBody>

			<PanelBody
				title={ __( 'Settings', 'codeweber-gutenberg-blocks' ) }
				initialOpen={ false }
			>
				<TextControl
					label={ __( 'Block Class', 'codeweber-gutenberg-blocks' ) }
					value={ blockClass }
					onChange={ ( value ) => setAttributes( { blockClass: value } ) }
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Block ID', 'codeweber-gutenberg-blocks' ) }
					value={ blockId }
					onChange={ ( value ) => setAttributes( { blockId: value } ) }
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Block Data', 'codeweber-gutenberg-blocks' ) }
					value={ blockData }
					onChange={ ( value ) => setAttributes( { blockData: value } ) }
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</>
	);
};
