import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	Button,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
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
// cellCount MUST equal items.length on every spanning preset to prevent
// auto-sync from creating colCount×rowCount cells instead of the actual number.

const PRESETS = [
	{
		id: 'magazine',
		label: __( 'Magazine', 'codeweber-gutenberg-blocks' ),
		colCount: 6,
		colSizes: [],
		rowCount: 3,
		rowSizes: [],
		items: [
			{ gridColumn: '1 / 4', gridRow: '1 / 3' },
			{ gridColumn: '4 / 7', gridRow: '1' },
			{ gridColumn: '4 / 7', gridRow: '2' },
			{ gridColumn: '1 / 3', gridRow: '3' },
			{ gridColumn: '3 / 5', gridRow: '3' },
			{ gridColumn: '5 / 7', gridRow: '3' },
		],
	},
	{
		// Tall block on left (spans 2 rows) + 2 right + 2 bottom
		id: 'bento-left-hero',
		label: __( 'Bento 1', 'codeweber-gutenberg-blocks' ),
		colCount: 2,
		colSizes: [],
		rowCount: 3,
		rowSizes: [],
		items: [
			{ gridColumn: '1', gridRow: '1 / 3' },
			{ gridColumn: '2', gridRow: '1' },
			{ gridColumn: '2', gridRow: '2' },
			{ gridColumn: '1', gridRow: '3' },
			{ gridColumn: '2', gridRow: '3' },
		],
	},
	{
		// Full-width top banner + 2×2 grid below
		id: 'bento-top-banner',
		label: __( 'Bento 2', 'codeweber-gutenberg-blocks' ),
		colCount: 2,
		colSizes: [],
		rowCount: 3,
		rowSizes: [],
		items: [
			{ gridColumn: '1 / -1', gridRow: '1' },
			{ gridColumn: '1', gridRow: '2' },
			{ gridColumn: '2', gridRow: '2' },
			{ gridColumn: '1', gridRow: '3' },
			{ gridColumn: '2', gridRow: '3' },
		],
	},
	{
		// 3 left blocks + tall block on right (spans all rows)
		id: 'bento-right-hero',
		label: __( 'Bento 3', 'codeweber-gutenberg-blocks' ),
		colCount: 2,
		colSizes: [],
		rowCount: 3,
		rowSizes: [],
		items: [
			{ gridColumn: '1', gridRow: '1' },
			{ gridColumn: '1', gridRow: '2' },
			{ gridColumn: '1', gridRow: '3' },
			{ gridColumn: '2', gridRow: '1 / 4' },
		],
	},
	{
		// Alternating wide/narrow rows (checkerboard)
		id: 'bento-checker',
		label: __( 'Bento 4', 'codeweber-gutenberg-blocks' ),
		colCount: 3,
		colSizes: [],
		rowCount: 2,
		rowSizes: [],
		items: [
			{ gridColumn: '1 / 3', gridRow: '1' },
			{ gridColumn: '3 / 4', gridRow: '1' },
			{ gridColumn: '1 / 2', gridRow: '2' },
			{ gridColumn: '2 / 4', gridRow: '2' },
		],
	},
	{
		// Wide featured cell top-left + grid of 4
		id: 'bento-featured',
		label: __( 'Bento 5', 'codeweber-gutenberg-blocks' ),
		colCount: 3,
		colSizes: [],
		rowCount: 3,
		rowSizes: [],
		items: [
			{ gridColumn: '1 / 3', gridRow: '1 / 3' },
			{ gridColumn: '3 / 4', gridRow: '1' },
			{ gridColumn: '3 / 4', gridRow: '2' },
			{ gridColumn: '1 / 2', gridRow: '3' },
			{ gridColumn: '2 / 3', gridRow: '3' },
			{ gridColumn: '3 / 4', gridRow: '3' },
		],
	},
];

// Mini visual preview — CSS Grid div
function PresetVisual( { id } ) {
	const cell = { background: 'currentColor', opacity: 0.45, borderRadius: '1px' };
	const g = ( cols, rows ) => ( {
		display: 'grid',
		gridTemplateColumns: cols,
		gridTemplateRows: rows,
		gap: '2px',
		width: '44px',
		height: '34px',
	} );

	if ( id === 'magazine' ) {
		return (
			<div style={ g( 'repeat(6,1fr)', 'repeat(3,1fr)' ) }>
				<div style={ { ...cell, gridColumn: '1/4', gridRow: '1/3', opacity: 0.65 } } />
				<div style={ { ...cell, gridColumn: '4/7', gridRow: '1' } } />
				<div style={ { ...cell, gridColumn: '4/7', gridRow: '2' } } />
				<div style={ { ...cell, gridColumn: '1/3', gridRow: '3' } } />
				<div style={ { ...cell, gridColumn: '3/5', gridRow: '3' } } />
				<div style={ { ...cell, gridColumn: '5/7', gridRow: '3' } } />
			</div>
		);
	}
	if ( id === 'bento-left-hero' ) {
		return (
			<div style={ g( '1fr 1fr', 'repeat(3,1fr)' ) }>
				<div style={ { ...cell, gridColumn: '1', gridRow: '1/3', opacity: 0.65 } } />
				<div style={ { ...cell, gridColumn: '2', gridRow: '1' } } />
				<div style={ { ...cell, gridColumn: '2', gridRow: '2' } } />
				<div style={ { ...cell, gridColumn: '1', gridRow: '3' } } />
				<div style={ { ...cell, gridColumn: '2', gridRow: '3' } } />
			</div>
		);
	}
	if ( id === 'bento-top-banner' ) {
		return (
			<div style={ g( '1fr 1fr', 'repeat(3,1fr)' ) }>
				<div style={ { ...cell, gridColumn: '1/-1', gridRow: '1', opacity: 0.65 } } />
				<div style={ { ...cell, gridColumn: '1', gridRow: '2' } } />
				<div style={ { ...cell, gridColumn: '2', gridRow: '2' } } />
				<div style={ { ...cell, gridColumn: '1', gridRow: '3' } } />
				<div style={ { ...cell, gridColumn: '2', gridRow: '3' } } />
			</div>
		);
	}
	if ( id === 'bento-right-hero' ) {
		return (
			<div style={ g( '1fr 1fr', 'repeat(3,1fr)' ) }>
				<div style={ { ...cell, gridColumn: '1', gridRow: '1' } } />
				<div style={ { ...cell, gridColumn: '1', gridRow: '2' } } />
				<div style={ { ...cell, gridColumn: '1', gridRow: '3' } } />
				<div style={ { ...cell, gridColumn: '2', gridRow: '1/4', opacity: 0.65 } } />
			</div>
		);
	}
	if ( id === 'bento-checker' ) {
		return (
			<div style={ g( '1fr 1fr 1fr', '1fr 1fr' ) }>
				<div style={ { ...cell, gridColumn: '1/3', opacity: 0.65 } } />
				<div style={ cell } />
				<div style={ cell } />
				<div style={ { ...cell, gridColumn: '2/4', opacity: 0.65 } } />
			</div>
		);
	}
	if ( id === 'bento-featured' ) {
		return (
			<div style={ g( '1fr 1fr 1fr', 'repeat(3,1fr)' ) }>
				<div style={ { ...cell, gridColumn: '1/3', gridRow: '1/3', opacity: 0.65 } } />
				<div style={ { ...cell, gridColumn: '3', gridRow: '1' } } />
				<div style={ { ...cell, gridColumn: '3', gridRow: '2' } } />
				<div style={ cell } />
				<div style={ cell } />
				<div style={ cell } />
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
	{ value: 'column dense', label: __( 'Column Dense', 'codeweber-gutenberg-blocks' ) },
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

function buildItemPatch( item ) {
	return {
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
	};
}

// ─── Edit ─────────────────────────────────────────────────────────────────────

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		gridId,
		gridHtmlId,
		gridData,
		colCount,
		rowCount,
		cellCount,
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

	// useState so the pending-preset effect re-runs when it changes.
	const [ pendingPreset, setPendingPreset ] = useState( null );

	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);
	const { insertBlocks, updateBlockAttributes } = useDispatch( 'core/block-editor' );

	// Generate unique gridId on first mount
	useEffect( () => {
		if ( ! gridId ) {
			setAttributes( { gridId: Math.random().toString( 36 ).substr( 2, 8 ) } );
		}
	}, [] );

	// Auto-sync child block count.
	// cellCount overrides colCount×rowCount — critical for spanning presets like Magazine
	// (6 cols × 3 rows = 18 without cellCount, but only 6 cells are needed).
	// Skipped while a preset is pending to avoid race conditions.
	useEffect( () => {
		if ( pendingPreset ) return;
		const target = cellCount > 0 ? cellCount : colCount * rowCount;
		const current = innerBlocks.length;
		if ( current < target ) {
			const toAdd = Array.from( { length: target - current }, () =>
				createBlock( 'codeweber-blocks/grid-item' )
			);
			insertBlocks( toAdd, current, clientId, false );
		}
	}, [ colCount, rowCount, cellCount, innerBlocks.length, pendingPreset ] );

	// Apply pending preset grid-column/grid-row to children once enough blocks exist.
	useEffect( () => {
		if ( ! pendingPreset ) return;
		if ( innerBlocks.length < pendingPreset.items.length ) return;

		innerBlocks.slice( 0, pendingPreset.items.length ).forEach( ( block, i ) => {
			updateBlockAttributes( block.clientId, buildItemPatch( pendingPreset.items[ i ] ) );
		} );
		setPendingPreset( null );
	}, [ pendingPreset, innerBlocks.length ] );

	const applyPreset = ( preset ) => {
		setAttributes( {
			colCount: preset.colCount,
			colSizes: preset.colSizes || [],
			rowCount: preset.rowCount,
			rowSizes: preset.rowSizes || [],
			// cellCount limits auto-sync to the actual number of cells in the preset,
			// not colCount × rowCount (which would be wrong for spanning layouts).
			cellCount: preset.items.length,
		} );
		setPendingPreset( preset );
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
								onMouseEnter={ ( e ) => ( e.currentTarget.style.borderColor = '#007cba' ) }
								onMouseLeave={ ( e ) => ( e.currentTarget.style.borderColor = '#ddd' ) }
							>
								<PresetVisual id={ preset.id } />
								{ preset.label }
							</button>
						) ) }
					</div>
				</PanelBody>

				{ /* ── Grid ── */ }
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
						onChange={ ( n ) =>
							setAttributes( { colCount: n, cellCount: n * rowCount } )
						}
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
						onChange={ ( n ) =>
							setAttributes( { rowCount: n, cellCount: colCount * n } )
						}
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
						onChange={ ( val ) => setAttributes( { alignContent: val } ) }
					/>
					<SelectControl
						label={ __( 'justify-content', 'codeweber-gutenberg-blocks' ) }
						value={ justifyContent || '' }
						options={ CONTENT_OPTIONS }
						onChange={ ( val ) => setAttributes( { justifyContent: val } ) }
					/>
					<SelectControl
						label={ __( 'grid-auto-flow', 'codeweber-gutenberg-blocks' ) }
						value={ gridAutoFlow || 'row' }
						options={ AUTO_FLOW_OPTIONS }
						onChange={ ( val ) => setAttributes( { gridAutoFlow: val } ) }
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
						onChange={ ( key, val ) => setAttributes( { [ key ]: val } ) }
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
						fieldKeys={ { classKey: 'gridClass', dataKey: 'gridData', idKey: 'gridHtmlId' } }
						labels={ {
							classLabel: __( 'Grid Class', 'codeweber-gutenberg-blocks' ),
							dataLabel: __( 'Grid Data', 'codeweber-gutenberg-blocks' ),
							idLabel: __( 'Grid ID', 'codeweber-gutenberg-blocks' ),
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
