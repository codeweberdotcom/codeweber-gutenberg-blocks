import { useLayoutEffect, useEffect, useRef, useState } from '@wordpress/element';
import { parseGridLine, normalizeCellRect } from '../utils';

// Renders as a SEPARATE, absolutely-positioned layer on top of the real grid
// (not as literal children of the same CSS Grid). Explicit grid children of
// the real container would reserve every track for auto-placement purposes,
// starving any real grid-item that has no explicit position of a track to
// land in. Instead this reads the real container's *resolved* pixel track
// sizes via getComputedStyle (correct even for "auto" row heights) and
// mirrors them on its own grid — pixel-perfect alignment, zero interference.
export default function GridCanvasOverlay( {
	colCount,
	rowCount,
	innerBlocks,
	activeClientId,
	setActiveClientId,
	updateBlockAttributes,
	onAddItem,
} ) {
	const wrapperRef = useRef( null );
	const dragRef = useRef( null );
	const cleanupRef = useRef( null );
	const [ dragRect, setDragRect ] = useState( null );
	const [ gridTemplate, setGridTemplate ] = useState( null );

	useLayoutEffect( () => {
		const wrapper = wrapperRef.current;
		const container = wrapper && wrapper.parentElement;
		if ( ! container ) return undefined;

		const win = container.ownerDocument.defaultView;

		const measure = () => {
			const cs = win.getComputedStyle( container );
			setGridTemplate( {
				columns: cs.gridTemplateColumns,
				rows: cs.gridTemplateRows,
				gap: cs.gap,
			} );
		};

		measure();
		win.addEventListener( 'resize', measure );
		return () => win.removeEventListener( 'resize', measure );
	}, [ colCount, rowCount ] );

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
		<div
			ref={ wrapperRef }
			className="cwgb-grid-overlay"
			style={
				gridTemplate
					? {
							gridTemplateColumns: gridTemplate.columns,
							gridTemplateRows: gridTemplate.rows,
							gap: gridTemplate.gap,
					  }
					: undefined
			}
		>
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
				<button
					type="button"
					className="cwgb-grid-overlay__pill cwgb-grid-overlay__pill--add"
					onMouseDown={ ( e ) => e.stopPropagation() }
					onClick={ onAddItem }
				>
					+
				</button>
			</div>
			{ gridTemplate && hitCells }
			{ gridTemplate && areaOverlays }
			{ gridTemplate && previewRect && (
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
		</div>
	);
}
