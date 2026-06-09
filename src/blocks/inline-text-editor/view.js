/**
 * Inline Text Editor — frontend drawer logic.
 *
 * Loaded only when the block is present on the page (viewScript). Talks to the
 * REST routes registered in inc/InlineTextEditor.php. No build-time deps:
 * removing the block folder removes this file with no side effects elsewhere.
 */

const ROOT_SELECTOR = '[data-cw-inline-editor]';

function init() {
	const root = document.querySelector( ROOT_SELECTOR );
	if ( ! root ) {
		return;
	}

	let config;
	try {
		config = JSON.parse( root.getAttribute( 'data-cw-config' ) || '{}' );
	} catch ( e ) {
		return;
	}
	if ( ! config.restBase || ! config.postId ) {
		return;
	}

	const drawer = document.getElementById( 'cwgbInlineEditorDrawer' );
	const fieldsEl = root.querySelector( '[data-cw-fields]' );
	const formEl = root.querySelector( '[data-cw-form]' );
	if ( ! drawer || ! fieldsEl || ! formEl ) {
		return;
	}

	const actionsEl = root.querySelector( '[data-cw-actions]' );
	const statusEl = root.querySelector( '[data-cw-status]' );
	const saveBtn = root.querySelector( '[data-cw-save]' );
	const saveLabel = saveBtn ? saveBtn.textContent.trim() : '';
	let loaded = false;

	const setStatus = ( msg, type ) => {
		statusEl.textContent = msg || '';
		let cls = 'text-muted';
		if ( type === 'error' ) {
			cls = 'text-danger';
		} else if ( type === 'success' ) {
			cls = 'text-success';
		}
		statusEl.className = 'cwgb-inline-editor-status small mb-3 ' + cls;
	};

	const headers = () => ( {
		'Content-Type': 'application/json',
		'X-WP-Nonce': config.nonce,
	} );

	const esc = ( s ) =>
		String( s ).replace( /[&<>"]/g, ( c ) => ( {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
		}[ c ] ) );

	const buildFields = ( blocks ) => {
		fieldsEl.innerHTML = '';
		if ( ! blocks.length ) {
			setStatus(
				config.i18nEmpty || 'No editable Codeweber blocks found on this page.',
				''
			);
			actionsEl.hidden = true;
			return;
		}

		let lastContainer = null;
		blocks.forEach( ( block ) => {
			// Group header per top-level container (matches the List View).
			if ( block.containerId !== lastContainer ) {
				lastContainer = block.containerId;
				const header = document.createElement( 'div' );
				header.className =
					'fw-bold text-uppercase small text-muted mt-3 mb-2 pb-1 border-bottom';
				header.textContent = block.container || '';
				fieldsEl.appendChild( header );
			}

			const card = document.createElement( 'div' );
			card.className = 'card mb-3';
			card.setAttribute( 'data-cw-block', String( block.index ) );

			let html = '<div class="card-body">';
			block.fields.forEach( ( field ) => {
				const fid = 'cw-field-' + block.index + '-' + field.key;
				html += '<div class="mb-3">';
				html += '<label class="form-label small" for="' + fid + '">' + esc( field.label ) + '</label>';
				html +=
					'<textarea class="form-control form-control-sm" id="' +
					fid +
					'" data-cw-field="' +
					esc( field.key ) +
					'" rows="2">' +
					esc( field.value ) +
					'</textarea>';
				html += '</div>';
			} );
			html += '</div>';
			card.innerHTML = html;

			// Store originals for diffing and optimistic-lock "old" value.
			card.querySelectorAll( '[data-cw-field]' ).forEach( ( ta ) => {
				ta.setAttribute( 'data-cw-original', ta.value );
			} );

			fieldsEl.appendChild( card );
		} );

		actionsEl.hidden = false;
	};

	const load = () => {
		if ( loaded ) {
			return;
		}
		setStatus( config.i18nLoading || 'Loading…', '' );
		fetch( config.restBase + '/' + config.postId, {
			method: 'GET',
			headers: headers(),
			credentials: 'same-origin',
		} )
			.then( ( r ) => r.json() )
			.then( ( data ) => {
				loaded = true;
				setStatus( '', '' );
				buildFields( Array.isArray( data ) ? data : [] );
			} )
			.catch( () => {
				setStatus( config.i18nError || 'Failed to load.', 'error' );
			} );
	};

	const swapBlock = ( index, html ) => {
		const target = document.querySelector(
			'[data-cw-edit-index="' + index + '"]'
		);
		if ( ! target || ! html ) {
			return;
		}
		const tmp = document.createElement( 'div' );
		tmp.innerHTML = html.trim();
		const fresh = tmp.firstElementChild;
		if ( fresh ) {
			fresh.setAttribute( 'data-cw-edit-index', String( index ) );
			target.replaceWith( fresh );
		}
	};

	const saveBlock = ( card ) => {
		const values = [];
		card.querySelectorAll( '[data-cw-field]' ).forEach( ( ta ) => {
			const original = ta.getAttribute( 'data-cw-original' );
			if ( ta.value !== original ) {
				values.push( {
					key: ta.getAttribute( 'data-cw-field' ),
					old: original,
					new: ta.value,
				} );
			}
		} );
		if ( ! values.length ) {
			return Promise.resolve( { skipped: [] } );
		}

		const index = parseInt( card.getAttribute( 'data-cw-block' ), 10 );
		return fetch( config.restBase + '/' + config.postId, {
			method: 'POST',
			headers: headers(),
			credentials: 'same-origin',
			body: JSON.stringify( { index, values } ),
		} )
			.then( ( r ) => r.json().then( ( body ) => ( { ok: r.ok, body } ) ) )
			.then( ( { ok, body } ) => {
				if ( ! ok ) {
					throw new Error(
						( body && body.message ) || 'Save failed'
					);
				}
				const res = body;
				if ( res && res.html ) {
					swapBlock( index, res.html );
					// Commit new originals for fields that were not skipped.
					const skipped = ( res.skipped || [] );
					card.querySelectorAll( '[data-cw-field]' ).forEach( ( ta ) => {
						if ( skipped.indexOf( ta.getAttribute( 'data-cw-field' ) ) === -1 ) {
							ta.setAttribute( 'data-cw-original', ta.value );
						}
					} );
				}
				return res || { skipped: [] };
			} );
	};

	const setSaving = ( saving ) => {
		if ( ! saveBtn ) {
			return;
		}
		saveBtn.disabled = saving;
		saveBtn.textContent = saving
			? config.i18nSaving || 'Saving…'
			: saveLabel;
	};

	formEl.addEventListener( 'submit', ( e ) => {
		e.preventDefault();
		const cards = Array.from( fieldsEl.querySelectorAll( '[data-cw-block]' ) );
		setStatus( config.i18nSaving || 'Saving…', '' );
		setSaving( true );
		Promise.all( cards.map( ( c ) => saveBlock( c ) ) )
			.then( ( results ) => {
				const skippedCount = results.reduce(
					( n, r ) => n + ( ( r && r.skipped ) ? r.skipped.length : 0 ),
					0
				);
				if ( skippedCount ) {
					setStatus(
						config.i18nConflict ||
							'Saved. Some fields were skipped because the page content changed — reload to edit them.',
						'error'
					);
				} else {
					setStatus( config.i18nSaved || 'Saved.', 'success' );
				}
			} )
			.catch( () => {
				setStatus( config.i18nError || 'Save failed.', 'error' );
			} )
			.finally( () => {
				setSaving( false );
			} );
	} );

	drawer.addEventListener( 'show.bs.offcanvas', load );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
