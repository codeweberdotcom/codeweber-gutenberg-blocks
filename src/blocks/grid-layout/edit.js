import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import {
	getEditorGridStyle,
	getGridLayoutClassNames,
	normalizeGridId,
	normalizeGridData,
} from './utils';

const ALLOWED_BLOCKS = [ 'codeweber-blocks/grid-item' ];

const DEFAULT_TEMPLATE = [
	[ 'codeweber-blocks/grid-item' ],
	[ 'codeweber-blocks/grid-item' ],
	[ 'codeweber-blocks/grid-item' ],
];

const BPS = [
	{ key: '', label: 'Base' },
	{ key: 'Sm', label: 'SM' },
	{ key: 'Md', label: 'MD' },
	{ key: 'Lg', label: 'LG' },
	{ key: 'Xl', label: 'XL' },
	{ key: 'Xxl', label: 'XXL' },
	{ key: 'Xxxl', label: 'XXXL' },
];

const COL_PRESETS = [
	{ label: '1fr', value: '1fr' },
	{ label: '1:1', value: '1fr 1fr' },
	{ label: '1:1:1', value: 'repeat(3, 1fr)' },
	{ label: '4', value: 'repeat(4, 1fr)' },
	{ label: '◄─', value: '280px 1fr' },
	{ label: '─►', value: '1fr 280px' },
	{ label: '2:1', value: '2fr 1fr' },
	{ label: 'auto', value: 'repeat(auto-fill, minmax(200px, 1fr))' },
];

const AUTO_FLOW_OPTIONS = [
	{ value: 'row', label: __( 'Row', 'codeweber-gutenberg-blocks' ) },
	{ value: 'column', label: __( 'Column', 'codeweber-gutenberg-blocks' ) },
	{ value: 'dense', label: __( 'Dense', 'codeweber-gutenberg-blocks' ) },
	{
		value: 'row dense',
		label: __( 'Row Dense', 'codeweber-gutenberg-blocks' ),
	},
	{
		value: 'column dense',
		label: __( 'Column Dense', 'codeweber-gutenberg-blocks' ),
	},
];

const ALIGN_ITEMS_OPTIONS = [
	{ value: '', label: '—' },
	{ value: 'start', label: 'Start' },
	{ value: 'end', label: 'End' },
	{ value: 'center', label: 'Center' },
	{ value: 'stretch', label: 'Stretch' },
	{ value: 'baseline', label: 'Baseline' },
];

const JUSTIFY_ITEMS_OPTIONS = [
	{ value: '', label: '—' },
	{ value: 'start', label: 'Start' },
	{ value: 'end', label: 'End' },
	{ value: 'center', label: 'Center' },
	{ value: 'stretch', label: 'Stretch' },
];

const CONTENT_OPTIONS = [
	{ value: '', label: '—' },
	{ value: 'start', label: 'Start' },
	{ value: 'end', label: 'End' },
	{ value: 'center', label: 'Center' },
	{ value: 'stretch', label: 'Stretch' },
	{ value: 'space-between', label: 'Space Between' },
	{ value: 'space-around', label: 'Space Around' },
	{ value: 'space-evenly', label: 'Space Evenly' },
];

function BpSwitcher( { active, onChange } ) {
	return (
		<ButtonGroup style={ { flexWrap: 'wrap', marginBottom: '8px' } }>
			{ BPS.map( ( { key, label } ) => (
				<Button
					key={ key }
					variant={ active === key ? 'primary' : 'secondary' }
					isSmall
					onClick={ () => onChange( key ) }
				>
					{ label }
				</Button>
			) ) }
		</ButtonGroup>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const [ colBp, setColBp ] = useState( 'Md' );
	const [ rowBp, setRowBp ] = useState( 'Md' );
	const [ gapBp, setGapBp ] = useState( 'Md' );
	const [ heightBp, setHeightBp ] = useState( '' );

	const {
		gridId,
		gridHtmlId,
		gridData,
		gridAutoFlow,
		alignItems,
		justifyItems,
		alignContent,
		justifyContent,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		spacingXxxl,
	} = attributes;

	useEffect( () => {
		if ( ! gridId ) {
			setAttributes( {
				gridId: Math.random().toString( 36 ).substr( 2, 8 ),
			} );
		}
	}, [] );

	const blockProps = useBlockProps( {
		className: getGridLayoutClassNames( attributes ),
		id: normalizeGridId( gridHtmlId ) || undefined,
		style: getEditorGridStyle( attributes ),
		...normalizeGridData( gridData ),
	} );

	const colAttr = `gridTemplateCols${ colBp }`;
	const rowAttr = `gridTemplateRows${ rowBp }`;
	const autoRowsAttr = `gridAutoRows${ rowBp }`;
	const gapAttr = `gridGap${ gapBp }`;
	const heightAttr = `minHeight${ heightBp }`;

	return (
		<>
			<InspectorControls>
				{ /* Columns */ }
				<PanelBody
					title={ __( 'Columns', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<BpSwitcher active={ colBp } onChange={ setColBp } />
					<p style={ { fontSize: '11px', color: '#757575', margin: '0 0 6px' } }>
						{ __( 'grid-template-columns', 'codeweber-gutenberg-blocks' ) }
					</p>
					<div style={ { display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' } }>
						{ COL_PRESETS.map( ( p ) => (
							<Button
								key={ p.value }
								variant={
									attributes[ colAttr ] === p.value
										? 'primary'
										: 'secondary'
								}
								isSmall
								onClick={ () =>
									setAttributes( { [ colAttr ]: p.value } )
								}
							>
								{ p.label }
							</Button>
						) ) }
					</div>
					<TextControl
						value={ attributes[ colAttr ] || '' }
						onChange={ ( val ) =>
							setAttributes( { [ colAttr ]: val } )
						}
						placeholder="repeat(3, 1fr)"
						help={ __( 'Any valid CSS value', 'codeweber-gutenberg-blocks' ) }
					/>
				</PanelBody>

				{ /* Rows */ }
				<PanelBody
					title={ __( 'Rows', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<BpSwitcher active={ rowBp } onChange={ setRowBp } />
					<TextControl
						label={ __(
							'grid-template-rows',
							'codeweber-gutenberg-blocks'
						) }
						value={ attributes[ rowAttr ] || '' }
						onChange={ ( val ) =>
							setAttributes( { [ rowAttr ]: val } )
						}
						placeholder="auto 200px auto"
					/>
					<TextControl
						label={ __(
							'grid-auto-rows',
							'codeweber-gutenberg-blocks'
						) }
						value={ attributes[ autoRowsAttr ] || '' }
						onChange={ ( val ) =>
							setAttributes( { [ autoRowsAttr ]: val } )
						}
						placeholder="minmax(100px, auto)"
					/>
					<SelectControl
						label={ __(
							'grid-auto-flow',
							'codeweber-gutenberg-blocks'
						) }
						value={ gridAutoFlow || 'row' }
						options={ AUTO_FLOW_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { gridAutoFlow: val } )
						}
					/>
				</PanelBody>

				{ /* Gap */ }
				<PanelBody
					title={ __( 'Gap', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<BpSwitcher active={ gapBp } onChange={ setGapBp } />
					<TextControl
						label={ __( 'gap', 'codeweber-gutenberg-blocks' ) }
						value={ attributes[ gapAttr ] || '' }
						onChange={ ( val ) =>
							setAttributes( { [ gapAttr ]: val } )
						}
						placeholder="16px"
						help={ __(
							'Two values: row-gap column-gap (e.g. 16px 24px)',
							'codeweber-gutenberg-blocks'
						) }
					/>
				</PanelBody>

				{ /* Alignment */ }
				<PanelBody
					title={ __( 'Alignment', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __(
							'align-items',
							'codeweber-gutenberg-blocks'
						) }
						value={ alignItems || '' }
						options={ ALIGN_ITEMS_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { alignItems: val } )
						}
					/>
					<SelectControl
						label={ __(
							'justify-items',
							'codeweber-gutenberg-blocks'
						) }
						value={ justifyItems || '' }
						options={ JUSTIFY_ITEMS_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { justifyItems: val } )
						}
					/>
					<SelectControl
						label={ __(
							'align-content',
							'codeweber-gutenberg-blocks'
						) }
						value={ alignContent || '' }
						options={ CONTENT_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { alignContent: val } )
						}
					/>
					<SelectControl
						label={ __(
							'justify-content',
							'codeweber-gutenberg-blocks'
						) }
						value={ justifyContent || '' }
						options={ CONTENT_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { justifyContent: val } )
						}
					/>
				</PanelBody>

				{ /* Min Height */ }
				<PanelBody
					title={ __( 'Min Height', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<BpSwitcher active={ heightBp } onChange={ setHeightBp } />
					<TextControl
						label={ __( 'min-height', 'codeweber-gutenberg-blocks' ) }
						value={ attributes[ heightAttr ] || '' }
						onChange={ ( val ) =>
							setAttributes( { [ heightAttr ]: val } )
						}
						placeholder="400px"
					/>
				</PanelBody>

				{ /* Spacing */ }
				<PanelBody
					title={ __( 'Spacing', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<SpacingControl
						spacingType={ spacingType }
						spacingXs={ spacingXs }
						spacingSm={ spacingSm }
						spacingMd={ spacingMd }
						spacingLg={ spacingLg }
						spacingXl={ spacingXl }
						spacingXxl={ spacingXxl }
						spacingXxxl={ spacingXxxl }
						onChange={ ( key, val ) =>
							setAttributes( { [ key ]: val } )
						}
					/>
				</PanelBody>

				{ /* Advanced */ }
				<PanelBody
					title={ __( 'Advanced', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<BlockMetaFields
						attributes={ attributes }
						setAttributes={ setAttributes }
						fieldKeys={ {
							classKey: 'gridClass',
							dataKey: 'gridData',
							idKey: 'gridHtmlId',
						} }
						labels={ {
							classLabel: __(
								'Grid Class',
								'codeweber-gutenberg-blocks'
							),
							dataLabel: __(
								'Grid Data',
								'codeweber-gutenberg-blocks'
							),
							idLabel: __(
								'Grid ID',
								'codeweber-gutenberg-blocks'
							),
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ DEFAULT_TEMPLATE }
					templateLock={ false }
				/>
			</div>
		</>
	);
}
