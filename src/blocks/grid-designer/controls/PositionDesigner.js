import { Button, ButtonGroup } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { parseGridLine, normalizeCellRect } from '../utils';

// Targets one child grid-item at a time (chosen via the numbered switcher)
// and writes an explicit "start / end" range into its gridColumnLg / gridRowLg
// attributes — the same fields the manual text fields and presets already use.
export default function PositionDesigner( {
	colCount,
	rowCount,
	innerBlocks,
	updateBlockAttributes,
} ) {
	const [ activeIndex, setActiveIndex ] = useState( 0 );
	const [ dragRect, setDragRect ] = useState( null ); // { start: {col,row}, end: {col,row} }
	const dragRef = useRef( null );
	const cleanupRef = useRef( null );

	useEffect( () => {
		if ( activeIndex >= innerBlocks.length ) {
			setActiveIndex( 0 );
		}
	}, [ innerBlocks.length, activeIndex ] );

	// Remove any dangling window listener if the panel unmounts mid-drag.
	useEffect( () => {
		return () => {
			if ( cleanupRef.current ) cleanupRef.current();
		};
	}, [] );

	const beginDrag = ( col, row ) => {
		const start = { col, row };
		dragRef.current = { start, end: start };
		setDragRect( dragRef.current );

		const activeBlock = innerBlocks[ activeIndex ];

		const onMouseUp = () => {
			if ( activeBlock && dragRef.current ) {
				const rect = normalizeCellRect(
					dragRef.current.start,
					dragRef.current.end
				);
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

	if ( ! innerBlocks.length ) {
		return (
			<p className="cwgb-position-designer__empty">
				{ __(
					'Add at least one Grid Item to position it here.',
					'codeweber-gutenberg-blocks'
				) }
			</p>
		);
	}

	const activeBlock = innerBlocks[ activeIndex ];
	const savedRect = ( () => {
		if ( ! activeBlock ) return null;
		const col = parseGridLine( activeBlock.attributes.gridColumnLg );
		const row = parseGridLine( activeBlock.attributes.gridRowLg );
		if ( ! col || ! row ) return null;
		return {
			colStart: col.start,
			colEnd: col.end,
			rowStart: row.start,
			rowEnd: row.end,
		};
	} )();

	const rect = dragRect ? normalizeCellRect( dragRect.start, dragRect.end ) : savedRect;

	const handleClear = () => {
		if ( ! activeBlock ) return;
		updateBlockAttributes( activeBlock.clientId, {
			gridColumnLg: '',
			gridRowLg: '',
		} );
	};

	return (
		<div className="cwgb-position-designer">
			<ButtonGroup style={ { flexWrap: 'wrap', marginBottom: '8px' } }>
				{ innerBlocks.map( ( block, i ) => (
					<Button
						key={ block.clientId }
						variant={ i === activeIndex ? 'primary' : 'secondary' }
						isSmall
						onClick={ () => setActiveIndex( i ) }
					>
						{ i + 1 }
					</Button>
				) ) }
			</ButtonGroup>

			<p className="cwgb-position-designer__value">
				{ rect
					? sprintf(
							'grid-column: %1$d / %2$d — grid-row: %3$d / %4$d',
							rect.colStart,
							rect.colEnd + 1,
							rect.rowStart,
							rect.rowEnd + 1
					  )
					: __(
							'Not positioned — drag on the grid below.',
							'codeweber-gutenberg-blocks'
					  ) }
			</p>

			<div
				className="cwgb-position-designer__grid"
				style={ {
					gridTemplateColumns: `repeat(${ colCount }, 1fr)`,
					gridTemplateRows: `repeat(${ rowCount }, 24px)`,
				} }
			>
				{ Array.from( { length: rowCount }, ( rowUnused, ri ) =>
					Array.from( { length: colCount }, ( colUnused, ci ) => {
						const col = ci + 1;
						const row = ri + 1;
						const isSelected =
							!! rect &&
							col >= rect.colStart &&
							col <= rect.colEnd &&
							row >= rect.rowStart &&
							row <= rect.rowEnd;

						return (
							<button
								key={ `${ col }-${ row }` }
								type="button"
								className={
									'cwgb-position-designer__cell' +
									( isSelected ? ' is-selected' : '' )
								}
								onMouseDown={ ( e ) => {
									e.preventDefault();
									beginDrag( col, row );
								} }
								onMouseEnter={ () => updateDragEnd( col, row ) }
							/>
						);
					} )
				) }
			</div>

			<Button variant="tertiary" isDestructive isSmall onClick={ handleClear }>
				{ __( 'Clear position', 'codeweber-gutenberg-blocks' ) }
			</Button>
		</div>
	);
}
