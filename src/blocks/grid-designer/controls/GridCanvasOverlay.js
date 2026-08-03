import { useEffect, useRef, useState } from '@wordpress/element';
import { parseGridLine, normalizeCellRect } from '../utils';

// Two layers, both extra children of the SAME CSS Grid container as the real
// grid-item blocks:
//  - a transparent, single-track hit-test grid that only captures the drag
//    gesture (no fill, so real content stays visible underneath);
//  - one rectangle overlay per positioned item, spanning its full
//    gridColumn/gridRow in one element (not per-cell), so occupied areas
//    read as a single highlighted region instead of a wall of tinted cells.
export default function GridCanvasOverlay( {
	colCount,
	rowCount,
	innerBlocks,
	activeClientId,
	setActiveClientId,
	updateBlockAttributes,
} ) {
	const dragRef = useRef( null );
	const cleanupRef = useRef( null );
	const [ dragRect, setDragRect ] = useState( null );

	useEffect( () => {
		return () => {
			if ( cleanupRef.current ) cleanupRef.current();
		};
	}, [] );

	const itemRects = innerBlocks.map( ( block ) => {
		const col = parseGridLine( block.attributes.gridColumnLg );
		const row = parseGridLine( block.attributes.gridRowLg );
		if ( ! col || ! row ) return null;
		return { colStart: col.start, colEnd: col.end, rowStart: row.start, rowEnd: row.end };
	} );

	const activeIndex = innerBlocks.findIndex( ( b ) => b.clientId === activeClientId );

	// The overlay lives inside the block-editor iframe, but this script executes
	// in the top document — a plain `window.addEventListener` would miss the
	// mouseup fired when the user releases over the iframe canvas (iframe DOM
	// events don't reach the parent window). Use the node's own window instead.
	const beginDrag = ( col, row, ownerWindow ) => {
		const start = { col, row };
		dragRef.current = { start, end: start };
		setDragRect( dragRef.current );

		const onMouseUp = () => {
			const activeBlock = innerBlocks.find( ( b ) => b.clientId === activeClientId );
			if ( activeBlock && dragRef.current ) {
				const rect = normalizeCellRect( dragRef.current.start, dragRef.current.end );
				updateBlockAttributes( activeBlock.clientId, {
					gridColumnLg: `${ rect.colStart } / ${ rect.colEnd + 1 }`,
					gridRowLg: `${ rect.rowStart } / ${ rect.rowEnd + 1 }`,
				} );
			}
			dragRef.current = null;
			setDragRect( null );
			ownerWindow.removeEventListener( 'mouseup', onMouseUp );
			cleanupRef.current = null;
		};

		ownerWindow.addEventListener( 'mouseup', onMouseUp );
		cleanupRef.current = () => ownerWindow.removeEventListener( 'mouseup', onMouseUp );
	};

	const updateDragEnd = ( col, row ) => {
		if ( ! dragRef.current ) return;
		dragRef.current = { ...dragRef.current, end: { col, row } };
		setDragRect( dragRef.current );
	};

	const previewRect = dragRect ? normalizeCellRect( dragRect.start, dragRect.end ) : null;

	// Transparent hit-test grid — one cell per track intersection, no fill.
	const hitCells = [];
	for ( let ri = 0; ri < rowCount; ri++ ) {
		for ( let ci = 0; ci < colCount; ci++ ) {
			const col = ci + 1;
			const row = ri + 1;
			hitCells.push(
				<button
					key={ `${ col }-${ row }` }
					type="button"
					className="cwgb-grid-overlay__cell"
					style={ { gridColumn: `${ col } / ${ col + 1 }`, gridRow: `${ row } / ${ row + 1 }` } }
					onMouseDown={ ( e ) => {
						e.preventDefault();
						beginDrag( col, row, e.currentTarget.ownerDocument.defaultView );
					} }
					onMouseEnter={ () => updateDragEnd( col, row ) }
				/>
			);
		}
	}

	// One rectangle per already-positioned item (skip the one currently being redrawn).
	const areaOverlays = itemRects.map( ( rect, idx ) => {
		if ( ! rect ) return null;
		if ( previewRect && idx === activeIndex ) return null;
		return (
			<div
				key={ innerBlocks[ idx ].clientId }
				className={ 'cwgb-grid-overlay__area' + ( idx === activeIndex ? ' is-active' : '' ) }
				style={ {
					gridColumn: `${ rect.colStart } / ${ rect.colEnd + 1 }`,
					gridRow: `${ rect.rowStart } / ${ rect.rowEnd + 1 }`,
				} }
			>
				<span className="cwgb-grid-overlay__area-id">{ idx + 1 }</span>
			</div>
		);
	} );

	return (
		<>
			{ innerBlocks.length > 1 && (
				<div className="cwgb-grid-overlay__pills">
					{ innerBlocks.map( ( block, i ) => (
						<button
							key={ block.clientId }
							type="button"
							className={
								'cwgb-grid-overlay__pill' +
								( block.clientId === activeClientId ? ' is-active' : '' )
							}
							onMouseDown={ ( e ) => e.stopPropagation() }
							onClick={ () => setActiveClientId( block.clientId ) }
						>
							{ i + 1 }
						</button>
					) ) }
				</div>
			) }
			{ hitCells }
			{ areaOverlays }
			{ previewRect && (
				<div
					className="cwgb-grid-overlay__area cwgb-grid-overlay__area--preview"
					style={ {
						gridColumn: `${ previewRect.colStart } / ${ previewRect.colEnd + 1 }`,
						gridRow: `${ previewRect.rowStart } / ${ previewRect.rowEnd + 1 }`,
					} }
				>
					<span className="cwgb-grid-overlay__area-id">{ activeIndex + 1 }</span>
				</div>
			) }
		</>
	);
}
