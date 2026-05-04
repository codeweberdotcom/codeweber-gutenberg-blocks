/**
 * Yandex Map v3 Block - Edit Component
 */

import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { YandexMapV3Sidebar } from './sidebar';

const COLOR_PRESETS = {
	light:     { theme: 'light' },
	dark:      { theme: 'dark' },
	grayscale: { customization: [ { stylers: [ { saturation: -1 } ] } ] },
	pale:      { customization: [ { stylers: [ { saturation: -0.5 }, { lightness: 0.3 } ] } ] },
	sepia: {
		customization: [
			{ tags: { any: [ 'water' ] },    stylers: [ { color: '#c9a87a' } ] },
			{ tags: { any: [ 'landscape' ] }, stylers: [ { color: '#e8d5b0' } ] },
			{ tags: { any: [ 'road' ] },      stylers: [ { color: '#d4b896' } ] },
			{ tags: { any: [ 'building' ] },  stylers: [ { color: '#c8b090' } ] },
		],
	},
};

function buildScheme( colorScheme, customStyleJson ) {
	if ( colorScheme === 'custom' && customStyleJson ) {
		try {
			return { customization: JSON.parse( customStyleJson ) };
		} catch ( e ) {}
	}
	return COLOR_PRESETS[ colorScheme ] || { theme: 'light' };
}

let apiLoadPromise = null;

function loadYandexMapsV3Api() {
	if ( typeof window.ymaps3 !== 'undefined' ) {
		return Promise.resolve();
	}
	if ( apiLoadPromise ) {
		return apiLoadPromise;
	}
	const data = window.codeweberYandexMaps || {};
	const apiKey = data.apiKey || '';
	const lang   = data.language || 'ru_RU';
	if ( ! apiKey ) {
		return Promise.reject( new Error( 'No API key for Yandex Maps v3' ) );
	}
	if ( document.querySelector( 'script[src*="api-maps.yandex.ru/v3/"]' ) ) {
		// Script tag exists but ymaps3 not ready yet — wait a bit
		apiLoadPromise = new Promise( ( resolve ) => setTimeout( resolve, 500 ) );
		return apiLoadPromise;
	}
	apiLoadPromise = new Promise( ( resolve, reject ) => {
		const script    = document.createElement( 'script' );
		script.src      = `https://api-maps.yandex.ru/v3/?apikey=${ encodeURIComponent( apiKey ) }&lang=${ encodeURIComponent( lang ) }`;
		script.onload   = resolve;
		script.onerror  = () => reject( new Error( 'Failed to load Yandex Maps v3 API' ) );
		document.head.appendChild( script );
	} );
	return apiLoadPromise;
}

const Edit = ( { attributes, setAttributes } ) => {
	const {
		center,
		zoom,
		height,
		borderRadius,
		colorScheme,
		customStyleJson,
	} = attributes;

	const blockProps      = useBlockProps( { className: 'cwgb-yandex-map-v3-block-edit' } );
	const mapContainerRef = useRef( null );
	const mapInstanceRef  = useRef( null );

	useEffect( () => {
		const el = mapContainerRef.current;
		if ( ! el ) return;

		let cancelled = false;

		async function init() {
			try {
				await loadYandexMapsV3Api();
				if ( cancelled ) return;

				await window.ymaps3.ready;
				if ( cancelled ) return;

				// Destroy previous instance before re-init
				if ( mapInstanceRef.current ) {
					mapInstanceRef.current.destroy();
					mapInstanceRef.current = null;
					el.innerHTML = '';
				}

				const {
					YMap,
					YMapDefaultSchemeLayer,
					YMapDefaultFeaturesLayer,
				} = window.ymaps3;

				const map = new YMap( el, {
					location: {
						center: [ center.lng, center.lat ],
						zoom,
					},
					behaviors: [ 'drag', 'pinchZoom', 'dblClick' ],
				} );

				map.addChild( new YMapDefaultSchemeLayer( buildScheme( colorScheme, customStyleJson ) ) );
				map.addChild( new YMapDefaultFeaturesLayer() );

				mapInstanceRef.current = map;
			} catch ( err ) {
				if ( ! cancelled ) {
					el.innerHTML = `<div style="padding:16px;color:#888;font-size:13px;">${ err.message }</div>`;
				}
			}
		}

		init();

		return () => {
			cancelled = true;
			if ( mapInstanceRef.current ) {
				mapInstanceRef.current.destroy();
				mapInstanceRef.current = null;
			}
		};
	}, [ center, zoom, colorScheme, customStyleJson ] );

	return (
		<>
			<InspectorControls>
				<YandexMapV3Sidebar
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					ref={ mapContainerRef }
					style={ {
						height: `${ height || 500 }px`,
						borderRadius: `${ borderRadius || 0 }px`,
						background: '#e8eaed',
					} }
				/>
			</div>
		</>
	);
};

export default Edit;
