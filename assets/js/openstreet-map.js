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

	function createColoredIcon( color ) {
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

	function escHtml( str ) {
		if ( ! str ) return '';
		return String( str )
			.replace( /&/g, '&amp;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
			.replace( /"/g, '&quot;' );
	}

	function buildPopupHTML( marker, fields ) {
		let html = '<div class="cwgb-osm-popup">';

		if ( fields.showTitle && marker.title ) {
			html += `<p class="cwgb-osm-popup__title">${ escHtml( marker.title ) }</p>`;
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
				`<a href="tel:${ escHtml( marker.phone ) }">${ escHtml( marker.phone ) }</a>` +
				'</div>';
		}

		if ( fields.showDescription && marker.description ) {
			html += `<div class="cwgb-osm-popup__field" style="display:block">${ marker.description }</div>`;
		}

		if ( fields.showLink && marker.link ) {
			html += `<a href="${ escHtml( marker.link ) }" class="btn btn-sm btn-primary cwgb-osm-popup__link" target="_blank" rel="noopener noreferrer">Details &rarr;</a>`;
		}

		html += '</div>';
		return html;
	}

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
		const markers = s.markers || [];
		const fields = s.popupFields || {};

		const map = L.map( el, {
			center: s.center || [ 55.76, 37.64 ],
			zoom: s.zoom || 12,
			scrollWheelZoom: !! s.scrollZoom,
			dragging: s.drag !== false,
			zoomControl: true,
		} );

		L.tileLayer( tileConfig.url, {
			attribution: tileConfig.attribution,
			subdomains: tileConfig.subdomains || 'abc',
			maxZoom: tileConfig.maxZoom || 19,
		} ).addTo( map );

		if ( markers.length === 0 ) return;

		const leafletMarkers = markers.map( ( marker ) => {
			const icon = createColoredIcon( marker.color || '#0d6efd' );
			const lm = L.marker( [ marker.lat, marker.lng ], { icon } );
			lm.bindPopup( buildPopupHTML( marker, fields ), { maxWidth: 300 } );
			return lm;
		} );

		if ( s.clustering && typeof L.markerClusterGroup === 'function' ) {
			const cluster = L.markerClusterGroup();
			leafletMarkers.forEach( ( lm ) => cluster.addLayer( lm ) );
			map.addLayer( cluster );
		} else {
			leafletMarkers.forEach( ( lm ) => lm.addTo( map ) );
		}

		if ( s.autoFit && markers.length > 1 ) {
			const bounds = L.latLngBounds( markers.map( ( m ) => [ m.lat, m.lng ] ) );
			map.fitBounds( bounds, { padding: [ 40, 40 ] } );
		}
	}

	function initAll() {
		document.querySelectorAll( '.cwgb-osm-map' ).forEach( ( el ) => {
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
} )();
