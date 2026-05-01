/* global L */
/**
 * OpenStreetMap (Leaflet) block initialisation
 * Reads data-osm-settings JSON from each .cwgb-osm-map container.
 */
(function () {
	'use strict';

	const TILE_LAYERS = {
		osm: {
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19,
		},
		'carto-light': {
			url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 20,
		},
		'carto-dark': {
			url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 20,
		},
		topo: {
			url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			attribution:
				'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
			maxZoom: 17,
		},
		'esri-sat': {
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attribution:
				'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
			maxZoom: 19,
		},
	};

	// --- Marker icon factories ---

	function createPinIcon( color ) {
		const svg =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">' +
			'<path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24S24 19.2 24 12C24 5.4 18.6 0 12 0z" fill="' +
			color +
			'" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>' +
			'<circle cx="12" cy="12" r="4.5" fill="rgba(255,255,255,0.85)"/>' +
			'</svg>';

		return L.divIcon( {
			html: svg,
			className: 'cwgb-osm-marker',
			iconSize: [ 24, 36 ],
			iconAnchor: [ 12, 36 ],
			popupAnchor: [ 0, -38 ],
		} );
	}

	function createDotIcon( color ) {
		const html =
			'<div class="cwgb-osm-dot-marker">' +
			'<div class="cwgb-osm-dot-marker__dot" style="background:' +
			color +
			';box-shadow:0 0 0 2px ' +
			color +
			'44;"></div>' +
			'</div>';

		return L.divIcon( {
			html,
			className: '',
			iconSize: [ 12, 12 ],
			iconAnchor: [ 6, 6 ],
			popupAnchor: [ 0, -10 ],
		} );
	}

	function createDotLabelIcon( color, label ) {
		const safe = label
			? String( label ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' )
			: '';
		const html =
			'<div class="cwgb-osm-dot-marker">' +
			'<div class="cwgb-osm-dot-marker__dot" style="background:' +
			color +
			';box-shadow:0 0 0 2px ' +
			color +
			'44;"></div>' +
			( safe
				? '<div class="cwgb-osm-dot-marker__label">' + safe + '</div>'
				: '' ) +
			'</div>';

		return L.divIcon( {
			html,
			className: '',
			iconSize: [ 12, 12 ],
			iconAnchor: [ 6, 6 ],
			popupAnchor: [ 0, -10 ],
		} );
	}

	function makeIcon( marker, markerType ) {
		const color = marker.color || '#0d6efd';
		if ( markerType === 'pin' ) {
			return createPinIcon( color );
		}
		if ( markerType === 'dot' ) {
			return createDotIcon( color );
		}
		return createDotLabelIcon( color, marker.label || '' );
	}

	// --- Helpers ---

	function escHtml( str ) {
		if ( ! str ) return '';
		return String( str )
			.replace( /&/g, '&amp;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
			.replace( /"/g, '&quot;' );
	}

	// --- Popup builder ---

	function buildPopupHTML( marker, fields ) {
		let html = '<div class="cwgb-osm-popup">';

		// Staff marker: photo header
		if ( marker.photo ) {
			html += '<div class="cwgb-osm-popup__person">';
			html +=
				'<img src="' +
				escHtml( marker.photo ) +
				'" alt="' +
				escHtml( marker.title ) +
				'" class="cwgb-osm-popup__person-photo" loading="lazy">';
			html += '<div class="cwgb-osm-popup__person-info">';
			if ( fields.showTitle && marker.title ) {
				html +=
					'<p class="cwgb-osm-popup__title cwgb-osm-popup__title--sm">' +
					escHtml( marker.title ) +
					'</p>';
			}
			if ( fields.showDescription && marker.description ) {
				html +=
					'<span class="cwgb-osm-popup__position">' +
					escHtml( marker.description ) +
					'</span>';
			}
			html += '</div></div>';
		} else {
			if ( fields.showTitle && marker.title ) {
				html +=
					'<p class="cwgb-osm-popup__title">' +
					escHtml( marker.title ) +
					'</p>';
			}
		}

		if ( fields.showAddress && marker.address ) {
			html +=
				'<div class="cwgb-osm-popup__field">' +
				'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/></svg>' +
				escHtml( marker.address ) +
				'</div>';
		}

		if ( fields.showPhone && marker.phone ) {
			html +=
				'<div class="cwgb-osm-popup__field">' +
				'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>' +
				'<a href="tel:' +
				escHtml( marker.phone ) +
				'">' +
				escHtml( marker.phone ) +
				'</a>' +
				'</div>';
		}

		if ( ! marker.photo && fields.showDescription && marker.description ) {
			html +=
				'<div class="cwgb-osm-popup__field" style="display:block">' +
				marker.description +
				'</div>';
		}

		if ( fields.showLink && marker.link ) {
			html +=
				'<a href="' +
				escHtml( marker.link ) +
				'" class="btn btn-sm btn-primary cwgb-osm-popup__link" target="_blank" rel="noopener noreferrer">Details &rarr;</a>';
		}

		// Staff section (offices preset).
		if (
			fields.showStaff &&
			marker.staff &&
			marker.staff.length > 0
		) {
			html += '<div class="cwgb-osm-popup__staff">';
			html +=
				'<button type="button" class="cwgb-osm-popup__staff-btn" aria-expanded="false">' +
				'Staff <span>(' +
				marker.staff.length +
				')</span>' +
				'</button>';
			html += '<div class="cwgb-osm-popup__staff-list">';
			marker.staff.forEach( function ( s ) {
				html += '<div class="cwgb-osm-popup__staff-item">';
				if ( s.photo ) {
					html +=
						'<img src="' +
						escHtml( s.photo ) +
						'" alt="' +
						escHtml( s.name ) +
						'" class="cwgb-osm-popup__staff-photo" loading="lazy">';
				} else {
					html += '<div class="cwgb-osm-popup__staff-avatar"></div>';
				}
				html += '<div class="cwgb-osm-popup__staff-info">';
				html +=
					'<span class="cwgb-osm-popup__staff-name">' +
					escHtml( s.name ) +
					'</span>';
				if ( s.position ) {
					html +=
						'<span class="cwgb-osm-popup__staff-pos">' +
						escHtml( s.position ) +
						'</span>';
				}
				html += '</div></div>';
			} );
			html += '</div></div>';
		}

		html += '</div>';
		return html;
	}

	// --- Staff toggle (delegated) ---
	document.addEventListener( 'click', function ( e ) {
		const btn = e.target.closest( '.cwgb-osm-popup__staff-btn' );
		if ( ! btn ) return;
		const list = btn.nextElementSibling;
		if ( list ) {
			const open = list.classList.toggle( 'cwgb-osm-popup__staff-list--open' );
			btn.setAttribute( 'aria-expanded', String( open ) );
		}
	} );

	// --- Map initialisation ---

	function initMap( el ) {
		const raw = el.getAttribute( 'data-osm-settings' );
		if ( ! raw ) return;

		let s;
		try {
			s = JSON.parse( raw );
		} catch ( e ) {
			return;
		}

		const tileConfig = TILE_LAYERS[ s.tileLayer ] || TILE_LAYERS.osm;
		const markers    = s.markers || [];
		const fields     = s.popupFields || {};
		const markerType = s.markerType || 'dot-label';

		const map = L.map( el, {
			center: s.center || [ 55.76, 37.64 ],
			zoom: s.zoom || 12,
			scrollWheelZoom: !! s.scrollZoom,
			dragging: s.drag !== false,
			zoomControl: true,
		} );

		map.attributionControl.setPrefix(
			'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8">' +
			'<path fill="#fff" d="M0 0h12v3H0z"/>' +
			'<path fill="#0039A6" d="M0 3h12v2H0z"/>' +
			'<path fill="#D52B1E" d="M0 5h12v3H0z"/>' +
			'</svg>'
		);

		const tileLayer = L.tileLayer( tileConfig.url, {
			attribution: tileConfig.attribution,
			subdomains: tileConfig.subdomains || 'abc',
			maxZoom: tileConfig.maxZoom || 19,
		} );

		tileLayer.addTo( map );

		if ( markers.length === 0 ) return;

		const leafletMarkers = markers.map( function ( marker ) {
			const icon = makeIcon( marker, markerType );
			const lm   = L.marker( [ marker.lat, marker.lng ], { icon } );
			lm.bindPopup( buildPopupHTML( marker, fields ), { maxWidth: 300 } );
			return lm;
		} );

		if ( s.clustering && typeof L.markerClusterGroup === 'function' ) {
			const cluster = L.markerClusterGroup();
			leafletMarkers.forEach( function ( lm ) {
				cluster.addLayer( lm );
			} );
			map.addLayer( cluster );
		} else {
			leafletMarkers.forEach( function ( lm ) {
				lm.addTo( map );
			} );
		}

		if ( s.autoFit && markers.length > 1 ) {
			const bounds = L.latLngBounds( markers.map( function ( m ) {
				return [ m.lat, m.lng ];
			} ) );
			map.fitBounds( bounds, { padding: [ 40, 40 ] } );
		}
	}

	function initAll() {
		document.querySelectorAll( '.cwgb-osm-map' ).forEach( function ( el ) {
			if ( el.dataset.osmInit ) return;
			el.dataset.osmInit = '1';
			initMap( el );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initAll );
	} else {
		initAll();
	}

	const observer = new MutationObserver( function () {
		document.querySelectorAll( '.cwgb-osm-map:not([data-osm-init])' ).forEach( function ( el ) {
			el.dataset.osmInit = '1';
			initMap( el );
		} );
	} );
	observer.observe( document.body, { childList: true, subtree: true } );
} )();
