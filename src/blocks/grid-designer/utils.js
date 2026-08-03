// Theme gap — uses Bootstrap gutter var (matches the site's Redux gap setting)
export const THEME_GAP_VALUE = 'var(--bs-gutter-x, 1.5rem)';

export function buildColsValue( colCount, colSizes ) {
	if ( ! colCount ) return '';
	const widths = Array.from(
		{ length: colCount },
		( _, i ) => ( colSizes && colSizes[ i ] && colSizes[ i ].trim() ) || '1fr'
	);
	if ( widths.every( ( w ) => w === '1fr' ) ) return `repeat(${ colCount }, 1fr)`;
	return widths.join( ' ' );
}

export function buildRowsValue( rowCount, rowSizes ) {
	if ( ! rowCount ) return '';
	const heights = Array.from(
		{ length: rowCount },
		( _, i ) => ( rowSizes && rowSizes[ i ] && rowSizes[ i ].trim() ) || 'auto'
	);
	if ( heights.every( ( h ) => h === 'auto' ) ) return '';
	return heights.join( ' ' );
}

export function resolveGap( gapType, gridGap ) {
	if ( gapType === 'theme' ) return THEME_GAP_VALUE;
	return ( gridGap && gridGap.trim() ) || '';
}

export function generateGridStyles( attributes, gridId ) {
	if ( ! gridId ) return '';

	const {
		colCount,
		colSizes,
		rowCount,
		rowSizes,
		colCountSm,
		colCountMd,
		gapType,
		gridGap,
		gridAutoFlow,
		alignItems,
		justifyItems,
		alignContent,
		justifyContent,
		minHeight,
	} = attributes;

	const selector = `.cwgb-grid-designer-${ gridId }`;
	const gap = resolveGap( gapType, gridGap );

	// Base declarations (mobile — single column by default)
	const baseDecls = { display: 'grid' };
	const mobileCols = colCountSm > 0 ? colCountSm : 1;
	baseDecls[ 'grid-template-columns' ] = `repeat(${ mobileCols }, 1fr)`;
	if ( gap ) baseDecls.gap = gap;
	if ( gridAutoFlow && gridAutoFlow !== 'row' )
		baseDecls[ 'grid-auto-flow' ] = gridAutoFlow;
	if ( alignItems ) baseDecls[ 'align-items' ] = alignItems;
	if ( justifyItems ) baseDecls[ 'justify-items' ] = justifyItems;
	if ( alignContent ) baseDecls[ 'align-content' ] = alignContent;
	if ( justifyContent ) baseDecls[ 'justify-content' ] = justifyContent;
	if ( minHeight ) baseDecls[ 'min-height' ] = minHeight;

	const baseDecl = Object.entries( baseDecls )
		.map( ( [ p, v ] ) => `${ p }:${ v }` )
		.join( ';' );
	let css = `${ selector }{${ baseDecl }}`;

	// When colCountMd is set: MD (768px) = intermediate columns, LG (992px) = full desktop.
	// When not set: keep original single breakpoint at 768px (backward compatible).
	const hasMd = colCountMd > 0;

	if ( hasMd ) {
		const firstRowSize =
			rowSizes && rowSizes.find( ( s ) => s && s.trim() && s.trim() !== 'auto' );
		const mdDecl =
			`grid-template-columns:repeat(${ colCountMd },1fr)` +
			( firstRowSize ? `;grid-auto-rows:${ firstRowSize.trim() }` : '' );
		css += `@media(min-width:768px){${ selector }{${ mdDecl }}}`;
	}

	const deskBreakpoint = hasMd ? '992px' : '768px';
	const deskDecls = {};
	const cols = buildColsValue( colCount, colSizes );
	if ( cols ) deskDecls[ 'grid-template-columns' ] = cols;

	const rows = buildRowsValue( rowCount, rowSizes );
	if ( rows ) deskDecls[ 'grid-template-rows' ] = rows;

	if ( Object.keys( deskDecls ).length ) {
		const deskDecl = Object.entries( deskDecls )
			.map( ( [ p, v ] ) => `${ p }:${ v }` )
			.join( ';' );
		css += `@media(min-width:${ deskBreakpoint }){${ selector }{${ deskDecl }}}`;
	}

	return css;
}

export function normalizeGridId( value ) {
	return ( value || '' ).replace( /^#/, '' ).trim();
}

export function normalizeGridData( value ) {
	if ( ! value ) return {};
	const attrs = {};
	value.split( ',' ).forEach( ( pair ) => {
		const [ key, ...rest ] = pair.split( '=' );
		const val = ( rest.join( '=' ) || '' ).trim();
		const cleanKey = ( key || '' ).trim().toLowerCase();
		if ( ! cleanKey || ! val ) return;
		if ( cleanKey.startsWith( 'data-' ) || cleanKey.startsWith( 'aria-' ) ) {
			attrs[ cleanKey ] = val;
		} else {
			attrs[ `data-${ cleanKey }` ] = val;
		}
	} );
	return attrs;
}

export function getGridDesignerClassNames( attrs ) {
	const classes = [ 'cwgb-grid-designer' ];
	const {
		gridId,
		gridClass,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		spacingXxxl,
	} = attrs;

	if ( gridId ) classes.push( `cwgb-grid-designer-${ gridId }` );
	if ( gridClass ) classes.push( gridClass.trim() );

	const p = spacingType === 'margin' ? 'm' : 'p';
	if ( spacingXs ) classes.push( `${ p }-${ spacingXs }` );
	if ( spacingSm ) classes.push( `${ p }-sm-${ spacingSm }` );
	if ( spacingMd ) classes.push( `${ p }-md-${ spacingMd }` );
	if ( spacingLg ) classes.push( `${ p }-lg-${ spacingLg }` );
	if ( spacingXl ) classes.push( `${ p }-xl-${ spacingXl }` );
	if ( spacingXxl ) classes.push( `${ p }-xxl-${ spacingXxl }` );
	if ( spacingXxxl ) classes.push( `${ p }-xxxl-${ spacingXxxl }` );

	return classes.filter( Boolean ).join( ' ' );
}

// Editor inline style — shows desktop layout (editor is desktop width)
export function getEditorGridStyle( attrs ) {
	const { colCount, colSizes, rowCount, rowSizes, gapType, gridGap, alignItems, justifyItems, minHeight } = attrs;
	const style = { display: 'grid' };

	const cols = buildColsValue( colCount, colSizes );
	if ( cols ) style.gridTemplateColumns = cols;

	const rows = buildRowsValue( rowCount, rowSizes );
	if ( rows ) style.gridTemplateRows = rows;

	const gap = resolveGap( gapType, gridGap );
	if ( gap ) style.gap = gap;

	if ( alignItems ) style.alignItems = alignItems;
	if ( justifyItems ) style.justifyItems = justifyItems;
	if ( minHeight ) style.minHeight = minHeight;

	return style;
}

// ─── Position Designer helpers ──────────────────────────────────────────────
// Parses a saved CSS grid-column/grid-row value ("1 / 4") back into a
// 1-based inclusive cell range. Returns null for shorthand the designer
// can't represent yet ("span 2", "1 / -1", empty) — the next drag simply
// overwrites it with an explicit range.
export function parseGridLine( value ) {
	if ( ! value ) return null;
	const range = value.match( /^\s*(-?\d+)\s*\/\s*(-?\d+)\s*$/ );
	if ( range ) {
		const start = parseInt( range[ 1 ], 10 );
		const end = parseInt( range[ 2 ], 10 );
		if ( end < 0 ) return null;
		return { start, end: end - 1 };
	}
	const single = value.match( /^\s*(-?\d+)\s*$/ );
	if ( single ) {
		const n = parseInt( single[ 1 ], 10 );
		return { start: n, end: n };
	}
	return null;
}

export function normalizeCellRect( a, b ) {
	return {
		colStart: Math.min( a.col, b.col ),
		colEnd: Math.max( a.col, b.col ),
		rowStart: Math.min( a.row, b.row ),
		rowEnd: Math.max( a.row, b.row ),
	};
}
