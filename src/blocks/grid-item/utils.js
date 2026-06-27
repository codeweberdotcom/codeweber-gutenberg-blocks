export const BREAKPOINTS = [
	{ key: '', minWidth: null },
	{ key: 'Sm', minWidth: '576px' },
	{ key: 'Md', minWidth: '768px' },
	{ key: 'Lg', minWidth: '992px' },
	{ key: 'Xl', minWidth: '1200px' },
	{ key: 'Xxl', minWidth: '1400px' },
	{ key: 'Xxxl', minWidth: '1920px' },
];

export function generateItemStyles( attributes, itemId ) {
	if ( ! itemId ) return '';

	const { alignSelf, justifySelf } = attributes;
	const selector = `.cwgb-grid-item-${ itemId }`;
	const bpRules = {};

	// Static self-alignment
	if ( alignSelf || justifySelf ) {
		bpRules[ '' ] = {};
		if ( alignSelf ) bpRules[ '' ][ 'align-self' ] = alignSelf;
		if ( justifySelf ) bpRules[ '' ][ 'justify-self' ] = justifySelf;
	}

	// Responsive position + order per breakpoint
	BREAKPOINTS.forEach( ( { key } ) => {
		const col = attributes[ `gridColumn${ key }` ];
		const row = attributes[ `gridRow${ key }` ];
		const ord = attributes[ `order${ key }` ];
		if ( col || row || ord ) {
			if ( ! bpRules[ key ] ) bpRules[ key ] = {};
			if ( col ) bpRules[ key ][ 'grid-column' ] = col;
			if ( row ) bpRules[ key ][ 'grid-row' ] = row;
			if ( ord ) bpRules[ key ].order = ord;
		}
	} );

	if ( ! Object.keys( bpRules ).length ) return '';

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

export function normalizeItemId( value ) {
	return ( value || '' ).replace( /^#/, '' ).trim();
}

export function normalizeItemData( value ) {
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

export function getItemBackgroundClasses( attrs ) {
	const classes = [];
	const {
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundSize,
		backgroundOverlay,
	} = attrs;

	switch ( backgroundType ) {
		case 'color':
			if ( backgroundColorType === 'gradient' && backgroundGradient ) {
				classes.push( backgroundGradient );
			} else if ( backgroundColor ) {
				if ( backgroundColorType === 'soft' ) {
					classes.push( `bg-soft-${ backgroundColor }` );
				} else if ( backgroundColorType === 'pale' ) {
					classes.push( `bg-pale-${ backgroundColor }` );
				} else {
					classes.push( `bg-${ backgroundColor }` );
				}
			}
			break;
		case 'image':
			classes.push( 'image-wrapper', 'bg-image' );
			if ( backgroundSize ) classes.push( backgroundSize );
			if ( backgroundOverlay ) classes.push( backgroundOverlay.trim() );
			break;
		case 'pattern':
			classes.push( 'pattern-wrapper', 'bg-image', 'text-white' );
			if ( backgroundSize ) classes.push( backgroundSize );
			break;
		default:
			break;
	}

	return classes.filter( Boolean );
}

export function getItemSpacingClasses( attrs ) {
	const classes = [];
	const {
		spacingType = 'padding',
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		spacingXxxl,
	} = attrs;

	const prefix = spacingType === 'margin' ? 'm' : 'p';
	if ( spacingXs ) classes.push( `${ prefix }-${ spacingXs }` );
	if ( spacingSm ) classes.push( `${ prefix }-sm-${ spacingSm }` );
	if ( spacingMd ) classes.push( `${ prefix }-md-${ spacingMd }` );
	if ( spacingLg ) classes.push( `${ prefix }-lg-${ spacingLg }` );
	if ( spacingXl ) classes.push( `${ prefix }-xl-${ spacingXl }` );
	if ( spacingXxl ) classes.push( `${ prefix }-xxl-${ spacingXxl }` );
	if ( spacingXxxl ) classes.push( `${ prefix }-xxxl-${ spacingXxxl }` );
	return classes;
}

export function getItemClassNames( attrs, mode ) {
	const classes = [ 'cwgb-grid-item' ];
	if ( mode === 'edit' ) classes.push( 'cwgb-grid-item--edit' );
	const { itemId, itemClass } = attrs;
	if ( itemId ) classes.push( `cwgb-grid-item-${ itemId }` );
	if ( itemClass ) classes.push( itemClass.trim() );
	classes.push( ...getItemBackgroundClasses( attrs ) );
	classes.push( ...getItemSpacingClasses( attrs ) );
	return classes.filter( Boolean ).join( ' ' );
}

// Returns inline style for editor preview using full cascade (highest breakpoint wins).
export function getEditorItemStyle( attrs ) {
	const style = {};

	const cascade = ( prop ) => {
		const suffixes = [ '', 'Sm', 'Md', 'Lg', 'Xl', 'Xxl', 'Xxxl' ];
		let result = '';
		for ( const s of suffixes ) {
			const val = attrs[ `${ prop }${ s }` ];
			if ( val ) result = val;
		}
		return result;
	};

	const col = cascade( 'gridColumn' );
	if ( col ) style.gridColumn = col;

	const row = cascade( 'gridRow' );
	if ( row ) style.gridRow = row;

	const ord = cascade( 'order' );
	if ( ord ) style.order = ord;

	if ( attrs.alignSelf ) style.alignSelf = attrs.alignSelf;
	if ( attrs.justifySelf ) style.justifySelf = attrs.justifySelf;

	return Object.keys( style ).length ? style : undefined;
}

// Background inline style for editor (image/pattern preview).
export function getItemEditorBgStyle( attrs ) {
	const { backgroundType, backgroundImageUrl, backgroundPatternUrl, backgroundSize } = attrs;
	if (
		backgroundType === 'image' &&
		backgroundImageUrl &&
		backgroundImageUrl !== 'null' &&
		backgroundImageUrl.trim()
	) {
		const size =
			backgroundSize === 'bg-cover'
				? 'cover'
				: backgroundSize === 'bg-full'
					? '100% 100%'
					: 'auto';
		return {
			backgroundImage: `url(${ backgroundImageUrl })`,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
			backgroundSize: size,
		};
	}
	if (
		backgroundType === 'pattern' &&
		backgroundPatternUrl &&
		backgroundPatternUrl !== 'null' &&
		backgroundPatternUrl.trim()
	) {
		const size =
			backgroundSize === 'bg-cover'
				? 'cover'
				: backgroundSize === 'bg-full'
					? '100% 100%'
					: 'auto';
		return {
			backgroundImage: `url(${ backgroundPatternUrl })`,
			backgroundRepeat: 'repeat',
			backgroundSize: size,
		};
	}
	return undefined;
}
