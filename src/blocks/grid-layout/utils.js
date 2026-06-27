export const BREAKPOINTS = [
	{ key: '', label: 'Base', minWidth: null },
	{ key: 'Sm', label: 'SM', minWidth: '576px' },
	{ key: 'Md', label: 'MD', minWidth: '768px' },
	{ key: 'Lg', label: 'LG', minWidth: '992px' },
	{ key: 'Xl', label: 'XL', minWidth: '1200px' },
	{ key: 'Xxl', label: 'XXL', minWidth: '1400px' },
	{ key: 'Xxxl', label: 'XXXL', minWidth: '1920px' },
];

export function generateGridStyles( attributes, gridId ) {
	if ( ! gridId ) return '';

	const {
		gridAutoFlow,
		alignItems,
		justifyItems,
		alignContent,
		justifyContent,
	} = attributes;

	const selector = `.cwgb-grid-${ gridId }`;
	const bpRules = {};

	// Base: display:grid + static (non-responsive) props
	bpRules[ '' ] = { display: 'grid' };
	if ( gridAutoFlow && gridAutoFlow !== 'row' ) {
		bpRules[ '' ][ 'grid-auto-flow' ] = gridAutoFlow;
	}
	if ( alignItems ) bpRules[ '' ][ 'align-items' ] = alignItems;
	if ( justifyItems ) bpRules[ '' ][ 'justify-items' ] = justifyItems;
	if ( alignContent ) bpRules[ '' ][ 'align-content' ] = alignContent;
	if ( justifyContent ) bpRules[ '' ][ 'justify-content' ] = justifyContent;

	// Responsive props per breakpoint
	BREAKPOINTS.forEach( ( { key } ) => {
		if ( ! bpRules[ key ] ) bpRules[ key ] = {};
		const cols = attributes[ `gridTemplateCols${ key }` ];
		const rows = attributes[ `gridTemplateRows${ key }` ];
		const autoRows = attributes[ `gridAutoRows${ key }` ];
		const gap = attributes[ `gridGap${ key }` ];
		const minH = attributes[ `minHeight${ key }` ];
		if ( cols ) bpRules[ key ][ 'grid-template-columns' ] = cols;
		if ( rows ) bpRules[ key ][ 'grid-template-rows' ] = rows;
		if ( autoRows ) bpRules[ key ][ 'grid-auto-rows' ] = autoRows;
		if ( gap ) bpRules[ key ].gap = gap;
		if ( minH ) bpRules[ key ][ 'min-height' ] = minH;
	} );

	let css = '';

	BREAKPOINTS.forEach( ( { key, minWidth } ) => {
		const rules = bpRules[ key ];
		if ( ! rules || ! Object.keys( rules ).length ) return;
		const decls = Object.entries( rules )
			.map( ( [ p, v ] ) => `${ p }:${ v }` )
			.join( ';' );
		if ( ! minWidth ) {
			css += `${ selector }{${ decls }}`;
		} else {
			css += `@media(min-width:${ minWidth }){${ selector }{${ decls }}}`;
		}
	} );

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
		if (
			cleanKey.startsWith( 'data-' ) ||
			cleanKey.startsWith( 'aria-' )
		) {
			attrs[ cleanKey ] = val;
		} else {
			attrs[ `data-${ cleanKey }` ] = val;
		}
	} );
	return attrs;
}

export function getGridLayoutClassNames( attrs ) {
	const classes = [ 'cwgb-grid-layout' ];
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

	if ( gridId ) classes.push( `cwgb-grid-${ gridId }` );
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

// Returns inline style for editor preview using full cascade (highest breakpoint wins).
export function getEditorGridStyle( attrs ) {
	const style = { display: 'grid' };

	// Simulate CSS cascade: apply from base up, each higher bp overrides
	const cascade = ( prop ) => {
		const suffixes = [ '', 'Sm', 'Md', 'Lg', 'Xl', 'Xxl', 'Xxxl' ];
		let result = '';
		for ( const s of suffixes ) {
			const val = attrs[ `${ prop }${ s }` ];
			if ( val ) result = val;
		}
		return result;
	};

	const cols = cascade( 'gridTemplateCols' );
	if ( cols ) style.gridTemplateColumns = cols;

	const rows = cascade( 'gridTemplateRows' );
	if ( rows ) style.gridTemplateRows = rows;

	const autoRows = cascade( 'gridAutoRows' );
	if ( autoRows ) style.gridAutoRows = autoRows;

	const gap = cascade( 'gridGap' );
	if ( gap ) style.gap = gap;

	const minH = cascade( 'minHeight' );
	if ( minH ) style.minHeight = minH;

	if ( attrs.gridAutoFlow ) style.gridAutoFlow = attrs.gridAutoFlow;
	if ( attrs.alignItems ) style.alignItems = attrs.alignItems;
	if ( attrs.justifyItems ) style.justifyItems = attrs.justifyItems;
	if ( attrs.alignContent ) style.alignContent = attrs.alignContent;
	if ( attrs.justifyContent ) style.justifyContent = attrs.justifyContent;

	return style;
}
