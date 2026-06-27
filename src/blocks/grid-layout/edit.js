import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	Button,
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import {
	THEME_GAP_VALUE,
	getEditorGridStyle,
	getGridLayoutClassNames,
	normalizeGridId,
	normalizeGridData,
} from './utils';

const ALLOWED_BLOCKS = [ 'codeweber-blocks/grid-item' ];

const INITIAL_TEMPLATE = [
	[ 'codeweber-blocks/grid-item' ],
	[ 'codeweber-blocks/grid-item' ],
	[ 'codeweber-blocks/grid-item' ],
	[ 'codeweber-blocks/grid-item' ],
];

// ─── Presets ────────────────────────────────────────────────────────────────

const PRESETS = [
	{
		id: 'equal-2x2',
		label: __( '2×2', 'codeweber-gutenberg-blocks' ),
		colCount: 2,
		colSizes: [],
		rowCount: 2,
		rowSizes: [],
		items: [
			{ gridColumn: '', gridRow: '' },
			{ gridColumn: '', gridRow: '' },
			{ gridColumn: '', gridRow: '' },
			{ gridColumn: '', gridRow: '' },
		],
	},
	{
		id: 'equal-3cols',
		label: __( '3 cols', 'codeweber-gutenberg-blocks' ),
		colCount: 3,
		colSizes: [],
		rowCount: 1,
		rowSizes: [],
		items: [
			{ gridColumn: '', gridRow: '' },
			{ gridColumn: '', gridRow: '' },
			{ gridColumn: '', gridRow: '' },
		],
	},
	{
		id: 'magazine',
		label: __( 'Magazine', 'codeweber-gutenberg-blocks' ),
		// 6-column grid: items use spans
		colCount: 6,
		colSizes: [],
		rowCount: 3,
		rowSizes: [],
		items: [
			{ gridColumn: '1 / 4', gridRow: '1 / 3' }, // big left
			{ gridColumn: '4 / 7', gridRow: '1' },      // top right
			{ gridColumn: '4 / 7', gridRow: '2' },      // mid right
			{ gridColumn: '1 / 3', gridRow: '3' },      // bottom 1
			{ gridColumn: '3 / 5', gridRow: '3' },      // bottom 2
			{ gridColumn: '5 / 7', gridRow: '3' },      // bottom 3
		],
	},
	{
		id: 'bento',
		label: __( 'Bento', 'codeweber-gutenberg-blocks' ),
		colCount: 3,
		colSizes: [],
		rowCount: 2,
		rowSizes: [],
		items: [
			{ gridColumn: '1 / 2', gridRow: '1' },  // small top-left
			{ gridColumn: '2 / 4', gridRow: '1' },  // wide top-right
			{ gridColumn: '1 / 3', gridRow: '2' },  // wide bottom-left
			{ gridColumn: '3 / 4', gridRow: '2' },  // small bottom-right
		],
	},
	{
		id: 'sidebar',
		label: __( 'Sidebar', 'codeweber-gutenberg-blocks' ),
		colCount: 2,
		colSizes: [ '280px', '1fr' ],
		rowCount: 1,
		rowSizes: [],
		items: [
			{ gridColumn: '', gridRow: '' },
			{ gridColumn: '', gridRow: '' },
		],
	},
];

// Mini visual preview of each preset
function PresetVisual( { id } ) {
	const cell = {
		background: 'currentColor',
		opacity: 0.45,
		borderRadius: '1px',
	};
	const grid = ( cols, rows, children ) => ( {
		display: 'grid',
		gridTemplateColumns: cols,
		gridTemplateRows: rows,
		gap: '2px',
		width: '44px',
		height: '32px',
	} );

	if ( id === 'equal-2x2' ) {
		return (
			<div style={ grid( '1fr 1fr', '1fr 1fr' ) }>
				{ [ 0, 1, 2, 3 ].map( ( i ) => (
					<div key={ i } style={ cell } />
				) ) }
			</div>
		);
	}
	if ( id === 'equal-3cols' ) {
		return (
			<div style={ grid( '1fr 1fr 1fr', '1fr' ) }>
				{ [ 0, 1, 2 ].map( ( i ) => (
					<div key={ i } style={ cell } />
				) ) }
			</div>
		);
	}
	if ( id === 'magazine' ) {
		return (
			<div style={ grid( 'repeat(6,1fr)', 'repeat(3,1fr)' ) }>
				<div style={ { ...cell, gridColumn: '1/4', gridRow: '1/3', opacity: 0.65 } } />
				<div style={ { ...cell, gridColumn: '4/7', gridRow: '1' } } />
				<div style={ { ...cell, gridColumn: '4/7', gridRow: '2' } } />
				<div style={ { ...cell, gridColumn: '1/3', gridRow: '3' } } />
				<div style={ { ...cell, gridColumn: '3/5', gridRow: '3' } } />
				<div style={ { ...cell, gridColumn: '5/7', gridRow: '3' } } />
			</div>
		);
	}
	if ( id === 'bento' ) {
		return (
			<div style={ grid( '1fr 2fr', 'repeat(2,1fr)' ) }>
				<div style={ cell } />
				<div style={ { ...cell, opacity: 0.65 } } />
				<div style={ { ...cell, opacity: 0.65 } } />
				<div style={ cell } />
			</div>
		);
	}
	if ( id === 'sidebar' ) {
		return (
			<div style={ grid( '1fr 2.5fr', '1fr' ) }>
				<div style={ cell } />
				<div style={ { ...cell, opacity: 0.65 } } />
			</div>
		);
	}
	return null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const COL_COUNTS = [ 1, 2, 3, 4, 5, 6 ];
const ROW_COUNTS = [ 1, 2, 3, 4, 5 ];
const MOB_COUNTS = [ 1, 2, 3 ];

const AUTO_FLOW_OPTIONS = [
	{ value: 'row', label: __( 'Row', 'codeweber-gutenberg-blocks' ) },
	{ value: 'column', label: __( 'Column', 'codeweber-gutenberg-blocks' ) },
	{ value: 'dense', label: __( 'Dense', 'codeweber-gutenberg-blocks' ) },
	{ value: 'row dense', label: __( 'Row Dense', 'codeweber-gutenberg-blocks' ) },
	{
		value: 'column dense',
		label: __( 'Column Dense', 'codeweber-gutenberg-blocks' ),
	},
];

const ALIGN_OPTIONS = [
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

function CountButtons( { counts, active, onChange } ) {
	return (
		<div style={ { display: 'flex', gap: '4px', marginBottom: '12px' } }>
			{ counts.map( ( n ) => (
				<Button
					key={ n }
					variant={ active === n ? 'primary' : 'secondary' }
					isSmall
					onClick={ () => onChange( n ) }
				>
					{ n }
				</Button>
			) ) }
		</div>
	);
}

// ─── Edit ─────────────────────────────────────────────────────────────────────

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		gridId,
		gridHtmlId,
		gridData,
		colCount,
		rowCount,
		colSizes,
		rowSizes,
		colCountSm,
		gapType,
		gridGap,
		gridAutoFlow,
		alignItems,
		justifyItems,
		alignContent,
		justifyContent,
		minHeight,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		spacingXxxl,
	} = attributes;

	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);
	const { insertBlocks, updateBlockAttributes } =
		useDispatch( 'core/block-editor' );

	// Pending preset: applied to child blocks once they exist
	const pendingPreset = useRef( null );

	// Generate unique gridId on first mount
	useEffect( () => {
		if ( ! gridId ) {
			setAttributes( {
				gridId: Math.random().toString( 36 ).substr( 2, 8 ),
			} );
		}
	}, [] );

	// Auto-sync inner block count to colCount × rowCount
	useEffect( () => {
		const total = colCount * rowCount;
		const current = innerBlocks.length;
		if ( current < total ) {
			const toAdd = Array.from( { length: total - current }, () =>
				createBlock( 'codeweber-blocks/grid-item' )
			);
			insertBlocks( toAdd, current, clientId, false );
		}
	}, [ colCount, rowCount, innerBlocks.length ] );

	// Apply pending preset item attrs once enough blocks exist
	useEffect( () => {
		if ( ! pendingPreset.current ) return;
		const preset = pendingPreset.current;
		if ( innerBlocks.length >= preset.items.length ) {
			innerBlocks.slice( 0, preset.items.length ).forEach( ( block, i ) => {
				const item = preset.items[ i ];
				updateBlockAttributes( block.clientId, {
					gridColumn: item.gridColumn || '',
					gridColumnSm: '',
					gridColumnMd: '',
					gridColumnLg: '',
					gridColumnXl: '',
					gridColumnXxl: '',
					gridColumnXxxl: '',
					gridRow: item.gridRow || '',
					gridRowSm: '',
					gridRowMd: '',
					gridRowLg: '',
					gridRowXl: '',
					gridRowXxl: '',
					gridRowXxxl: '',
					order: '',
					orderSm: '',
					orderMd: '',
					orderLg: '',
					orderXl: '',
					orderXxl: '',
					orderXxxl: '',
				} );
			} );
			pendingPreset.current = null;
		}
	}, [ innerBlocks.length ] );

	// Apply a preset: set layout attrs + sync child block positions
	const applyPreset = ( preset ) => {
		setAttributes( {
			colCount: preset.colCount,
			colSizes: preset.colSizes || [],
			rowCount: preset.rowCount,
			rowSizes: preset.rowSizes || [],
		} );

		const needed = preset.items.length;

		if ( innerBlocks.length >= needed ) {
			// Enough blocks — apply attrs immediately
			innerBlocks.slice( 0, needed ).forEach( ( block, i ) => {
				const item = preset.items[ i ];
				updateBlockAttributes( block.clientId, {
					gridColumn: item.gridColumn || '',
					gridColumnSm: '',
					gridColumnMd: '',
					gridColumnLg: '',
					gridColumnXl: '',
					gridColumnXxl: '',
					gridColumnXxxl: '',
					gridRow: item.gridRow || '',
					gridRowSm: '',
					gridRowMd: '',
					gridRowLg: '',
					gridRowXl: '',
					gridRowXxl: '',
					gridRowXxxl: '',
					order: '',
					orderSm: '',
					orderMd: '',
					orderLg: '',
					orderXl: '',
					orderXxl: '',
					orderXxxl: '',
				} );
			} );
		} else {
			// Need more blocks — store preset and let useEffect apply when ready
			pendingPreset.current = preset;
			const toAdd = Array.from(
				{ length: needed - innerBlocks.length },
				() => createBlock( 'codeweber-blocks/grid-item' )
			);
			insertBlocks( toAdd, innerBlocks.length, clientId, false );
		}
	};

	const blockProps = useBlockProps( {
		className: getGridLayoutClassNames( attributes ),
		id: normalizeGridId( gridHtmlId ) || undefined,
		style: getEditorGridStyle( attributes ),
		...normalizeGridData( gridData ),
	} );

	const handleColSize = ( i, val ) => {
		const next = [ ...( colSizes || [] ) ];
		next[ i ] = val;
		setAttributes( { colSizes: next } );
	};

	const handleRowSize = ( i, val ) => {
		const next = [ ...( rowSizes || [] ) ];
		next[ i ] = val;
		setAttributes( { rowSizes: next } );
	};

	return (
		<>
			<InspectorControls>
				{ /* ── Presets ── */ }
				<PanelBody
					title={ __( 'Presets', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<div style={ { display: 'flex', flexWrap: 'wrap', gap: '6px' } }>
						{ PRESETS.map( ( preset ) => (
							<button
								key={ preset.id }
								type="button"
								onClick={ () => applyPreset( preset ) }
								title={ preset.label }
								style={ {
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: '4px',
									padding: '6px 8px',
									border: '1px solid #ddd',
									borderRadius: '4px',
									background: '#fff',
									cursor: 'pointer',
									color: '#1e1e1e',
									fontSize: '10px',
									lineHeight: 1,
								} }
								onMouseEnter={ ( e ) =>
									( e.currentTarget.style.borderColor = '#007cba' )
								}
								onMouseLeave={ ( e ) =>
									( e.currentTarget.style.borderColor = '#ddd' )
								}
							>
								<PresetVisual id={ preset.id } />
								{ preset.label }
							</button>
						) ) }
					</div>
				</PanelBody>

				{ /* ── Grid structure ── */ }
				<PanelBody
					title={ __( 'Grid', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<p style={ { margin: '0 0 4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' } }>
						{ __( 'Columns', 'codeweber-gutenberg-blocks' ) }
					</p>
					<CountButtons
						counts={ COL_COUNTS }
						active={ colCount }
						onChange={ ( n ) => setAttributes( { colCount: n } ) }
					/>
					<div style={ { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' } }>
						{ Array.from( { length: colCount }, ( _, i ) => (
							<div key={ i } style={ { flex: '1 1 52px', minWidth: '44px' } }>
								<TextControl
									label={ String( i + 1 ) }
									value={ ( colSizes && colSizes[ i ] ) || '' }
									placeholder="1fr"
									onChange={ ( val ) => handleColSize( i, val ) }
								/>
							</div>
						) ) }
					</div>

					<p style={ { margin: '0 0 4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' } }>
						{ __( 'Rows', 'codeweber-gutenberg-blocks' ) }
					</p>
					<CountButtons
						counts={ ROW_COUNTS }
						active={ rowCount }
						onChange={ ( n ) => setAttributes( { rowCount: n } ) }
					/>
					<div style={ { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' } }>
						{ Array.from( { length: rowCount }, ( _, i ) => (
							<div key={ i } style={ { flex: '1 1 52px', minWidth: '44px' } }>
								<TextControl
									label={ String( i + 1 ) }
									value={ ( rowSizes && rowSizes[ i ] ) || '' }
									placeholder="auto"
									onChange={ ( val ) => handleRowSize( i, val ) }
								/>
							</div>
						) ) }
					</div>

					<p style={ { margin: '0 0 4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' } }>
						{ __( 'Gap', 'codeweber-gutenberg-blocks' ) }
					</p>
					<div style={ { display: 'flex', gap: '4px', marginBottom: '8px' } }>
						<Button
							variant={ gapType === 'theme' ? 'primary' : 'secondary' }
							isSmall
							onClick={ () => setAttributes( { gapType: 'theme' } ) }
						>
							{ __( 'Theme', 'codeweber-gutenberg-blocks' ) }
						</Button>
						<Button
							variant={ gapType === 'custom' ? 'primary' : 'secondary' }
							isSmall
							onClick={ () => setAttributes( { gapType: 'custom' } ) }
						>
							{ __( 'Custom', 'codeweber-gutenberg-blocks' ) }
						</Button>
					</div>
					{ gapType === 'theme' && (
						<p style={ { margin: '0 0 12px', fontSize: '11px', color: '#757575' } }>
							{ THEME_GAP_VALUE }
						</p>
					) }
					{ gapType === 'custom' && (
						<TextControl
							value={ gridGap || '' }
							placeholder="20px"
							onChange={ ( val ) => setAttributes( { gridGap: val } ) }
							help={ __( 'e.g. 20px or 1rem 2rem', 'codeweber-gutenberg-blocks' ) }
						/>
					) }

					<p style={ { margin: '0 0 4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' } }>
						{ __( 'Mobile columns (< 768px)', 'codeweber-gutenberg-blocks' ) }
					</p>
					<CountButtons
						counts={ MOB_COUNTS }
						active={ colCountSm || 1 }
						onChange={ ( n ) => setAttributes( { colCountSm: n } ) }
					/>
				</PanelBody>

				{ /* ── Alignment ── */ }
				<PanelBody
					title={ __( 'Alignment', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'align-items', 'codeweber-gutenberg-blocks' ) }
						value={ alignItems || '' }
						options={ ALIGN_OPTIONS }
						onChange={ ( val ) => setAttributes( { alignItems: val } ) }
					/>
					<SelectControl
						label={ __( 'justify-items', 'codeweber-gutenberg-blocks' ) }
						value={ justifyItems || '' }
						options={ ALIGN_OPTIONS }
						onChange={ ( val ) => setAttributes( { justifyItems: val } ) }
					/>
					<SelectControl
						label={ __( 'align-content', 'codeweber-gutenberg-blocks' ) }
						value={ alignContent || '' }
						options={ CONTENT_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { alignContent: val } )
						}
					/>
					<SelectControl
						label={ __( 'justify-content', 'codeweber-gutenberg-blocks' ) }
						value={ justifyContent || '' }
						options={ CONTENT_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { justifyContent: val } )
						}
					/>
					<SelectControl
						label={ __( 'grid-auto-flow', 'codeweber-gutenberg-blocks' ) }
						value={ gridAutoFlow || 'row' }
						options={ AUTO_FLOW_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { gridAutoFlow: val } )
						}
					/>
					<TextControl
						label={ __( 'min-height', 'codeweber-gutenberg-blocks' ) }
						value={ minHeight || '' }
						placeholder="400px"
						onChange={ ( val ) => setAttributes( { minHeight: val } ) }
					/>
				</PanelBody>

				{ /* ── Spacing ── */ }
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

				{ /* ── Advanced ── */ }
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
					template={ INITIAL_TEMPLATE }
					templateLock={ false }
				/>
			</div>
		</>
	);
}
