import { useEffect, useRef, useState } from '@wordpress/element';
import { parseGridLine, normalizeCellRect } from '../utils';

// Renders as extra children of the SAME CSS Grid container as the real
// grid-item blocks: each cell button gets an explicit single-track
// gridColumn/gridRow, so it lines up pixel-perfect with the real tracks
// (including "auto" row heights) with no coordinate math or mirrored
// dimensions needed. Painted after <InnerBlocks>, so it sits on top.
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

	const beginDrag = ( col, row ) => {
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
			window.removeEventListener( 'mouseup', onMouseUp );
			cleanupRef.current = null;
		};

		window.addEventListener( 'mouseup', onMouseUp );
		cleanupRef.current = () => window.removeEventListener( 'mouseup', onMouseUp );
	};

	const updateDragEnd = ( col, row ) => {
		if ( ! dragRef.current ) return;
		dragRef.current = { ...dragRef.current, end: { col, row } };
		setDragRect( dragRef.current );
	};

	const previewRect = dragRect ? normalizeCellRect( dragRect.start, dragRect.end ) : null;

	const cells = [];
	for ( let ri = 0; ri < rowCount; ri++ ) {
		for ( let ci = 0; ci < colCount; ci++ ) {
			const col = ci + 1;
			const row = ri + 1;

			const inPreview =
				!! previewRect &&
				col >= previewRect.colStart &&
				col <= previewRect.colEnd &&
				row >= previewRect.rowStart &&
				row <= previewRect.rowEnd;

			const occupyingIndex = itemRects.findIndex( ( rect, idx ) => {
				if ( ! rect ) return false;
				if ( previewRect && idx === activeIndex ) return false; // being redrawn right now
				return (
					col >= rect.colStart &&
					col <= rect.colEnd &&
					row >= rect.rowStart &&
					row <= rect.rowEnd
				);
			} );

			let cls = 'cwgb-grid-overlay__cell';
			if ( inPreview ) cls += ' is-preview';
			else if ( occupyingIndex === activeIndex && occupyingIndex !== -1 ) cls += ' is-active-ghost';
			else if ( occupyingIndex !== -1 ) cls += ' is-ghost';

			cells.push(
				<button
					key={ `${ col }-${ row }` }
					type="button"
					className={ cls }
					style={ { gridColumn: `${ col } / ${ col + 1 }`, gridRow: `${ row } / ${ row + 1 }` } }
					onMouseDown={ ( e ) => {
						e.preventDefault();
						beginDrag( col, row );
					} }
					onMouseEnter={ () => updateDragEnd( col, row ) }
				>
					{ ! inPreview && occupyingIndex !== -1 ? occupyingIndex + 1 : '' }
				</button>
			);
		}
	}

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
			{ cells }
		</>
	);
}
