(function () {
	'use strict';

	var COLOR_PRESETS = {
		light: { theme: 'light' },
		dark: { theme: 'dark' },
		grayscale: { customization: [{ stylers: [{ saturation: -1 }] }] },
		pale: { customization: [{ stylers: [{ saturation: -0.5 }, { lightness: 0.3 }] }] },
		sepia: {
			customization: [
				{ tags: { any: ['water'] }, stylers: [{ color: '#c9a87a' }] },
				{ tags: { any: ['landscape', 'admin'] }, stylers: [{ color: '#e8d5b0' }] },
				{ tags: { any: ['road'] }, stylers: [{ color: '#d4b896' }] },
				{ tags: { any: ['building'] }, stylers: [{ color: '#c8b090' }] },
			],
		},
	};

	function buildSchemeOptions(config) {
		if (config.colorScheme === 'custom' && config.customStyle) {
			try {
				return { customization: JSON.parse(config.customStyle) };
			} catch (e) {
				// fallback to light
			}
		}
		return COLOR_PRESETS[config.colorScheme] || { theme: 'light' };
	}

	function buildBehaviors(config) {
		var behaviors = ['drag', 'pinchZoom', 'dblClick', 'mouseRotate', 'mouseTilt'];
		if (!config.enableScrollZoom) {
			behaviors = behaviors.filter(function (b) { return b !== 'scrollZoom'; });
		} else {
			behaviors.push('scrollZoom');
		}
		if (!config.enableDrag) {
			behaviors = behaviors.filter(function (b) { return b !== 'drag'; });
		}
		return behaviors;
	}

	async function initMap(container) {
		var config;
		try {
			config = JSON.parse(container.dataset.mapV3);
		} catch (e) {
			return;
		}

		if (typeof ymaps3 === 'undefined') {
			container.innerHTML = '<div style="padding:16px;color:#888;font-size:14px;">Yandex Maps v3 API not loaded. Check API key domain restrictions.</div>';
			return;
		}

		await ymaps3.ready;

		var ymaps3Modules = ymaps3;
		var YMap = ymaps3Modules.YMap;
		var YMapDefaultSchemeLayer = ymaps3Modules.YMapDefaultSchemeLayer;
		var YMapDefaultFeaturesLayer = ymaps3Modules.YMapDefaultFeaturesLayer;
		var YMapMarker = ymaps3Modules.YMapMarker;
		var YMapControls = ymaps3Modules.YMapControls;

		var zoomPkg = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
		var YMapZoomControl = zoomPkg.YMapZoomControl;

		var mapCenter = config.center;

		// Auto-fit: use first marker as center
		if (config.autoFitBounds && config.markers && config.markers.length > 0) {
			mapCenter = config.markers[0].coords;
		}

		var map = new YMap(container, {
			location: { center: mapCenter, zoom: config.zoom },
			behaviors: buildBehaviors(config),
		});

		// Map type layer
		var schemeOptions = buildSchemeOptions(config);
		if (config.mapType === 'satellite' || config.mapType === 'hybrid') {
			var YMapTileDataSource = ymaps3Modules.YMapTileDataSource;
			var YMapLayer = ymaps3Modules.YMapLayer;
			map.addChild(new YMapTileDataSource({ id: 'custom', raster: { type: 'ground' } }));
			map.addChild(new YMapLayer({ source: 'custom', type: 'ground', options: { rasterType: config.mapType } }));
		} else {
			map.addChild(new YMapDefaultSchemeLayer(schemeOptions));
		}

		map.addChild(new YMapDefaultFeaturesLayer());

		// Zoom control
		var controls = new YMapControls({ position: 'right' });
		controls.addChild(new YMapZoomControl());
		map.addChild(controls);

		// Markers
		if (config.markers && config.markers.length > 0) {
			config.markers.forEach(function (markerData) {
				addMarker(map, markerData, config);
			});
		}
	}

	function addMarker(map, markerData, config) {
		var el = document.createElement('div');
		el.className = 'cwgb-map-v3-marker';
		el.style.background = config.markerColor || '#FF0000';

		var marker = new ymaps3.YMapMarker(
			{ coordinates: markerData.coords },
			el
		);
		map.addChild(marker);
		// Phase 2: balloon on click
	}

	function init() {
		document.querySelectorAll('[data-map-v3]').forEach(function (el) {
			initMap(el).catch(function (err) {
				console.error('[yandex-map-v3] init error', err);
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
