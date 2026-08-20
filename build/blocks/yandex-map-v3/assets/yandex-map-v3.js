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
			} catch (e) {}
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

	function calcBoundsCenter(markers) {
		var lngs = markers.map(function (m) { return m.coords[0]; });
		var lats = markers.map(function (m) { return m.coords[1]; });
		var minLng = Math.min.apply(null, lngs);
		var maxLng = Math.max.apply(null, lngs);
		var minLat = Math.min.apply(null, lats);
		var maxLat = Math.max.apply(null, lats);
		return [ (minLng + maxLng) / 2, (minLat + maxLat) / 2 ];
	}

	function calcBoundsZoom(markers, containerW, containerH) {
		if (markers.length < 2) { return null; }
		var lngs = markers.map(function (m) { return m.coords[0]; });
		var lats = markers.map(function (m) { return m.coords[1]; });
		var minLng = Math.min.apply(null, lngs);
		var maxLng = Math.max.apply(null, lngs);
		var minLat = Math.min.apply(null, lats);
		var maxLat = Math.max.apply(null, lats);
		// 15% padding so markers aren't on the edge
		var lngPad = (maxLng - minLng) * 0.15 || 0.02;
		var latPad = (maxLat - minLat) * 0.15 || 0.02;
		minLng -= lngPad; maxLng += lngPad;
		minLat -= latPad; maxLat += latPad;
		function latRad(lat) {
			var sin = Math.sin(lat * Math.PI / 180);
			var r   = Math.log((1 + sin) / (1 - sin)) / 2;
			return Math.max(Math.min(r, Math.PI), -Math.PI) / 2;
		}
		var latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;
		var lngFraction = (maxLng - minLng) / 360;
		var latZoom = Math.log(containerH / 256 / latFraction) / Math.LN2;
		var lngZoom = Math.log(containerW / 256 / lngFraction) / Math.LN2;
		return Math.floor(Math.min(latZoom, lngZoom, 17));
	}

	async function initMap(container) {
		var config;
		try {
			config = JSON.parse(container.dataset.mapV3);
		} catch (e) {
			return;
		}

		if (typeof ymaps3 === 'undefined') {
			container.innerHTML = '<div style="padding:16px;color:#888;font-size:14px;">Yandex Maps v3 API not loaded.</div>';
			return;
		}

		await ymaps3.ready;

		var YMap                 = ymaps3.YMap;
		var YMapDefaultSchemeLayer   = ymaps3.YMapDefaultSchemeLayer;
		var YMapDefaultFeaturesLayer = ymaps3.YMapDefaultFeaturesLayer;
		var YMapMarker           = ymaps3.YMapMarker;
		var YMapControls         = ymaps3.YMapControls;

		var mapCenter = config.center;
		var mapZoom   = config.zoom;
		if (config.autoFitBounds && config.markers && config.markers.length > 0) {
			mapCenter = calcBoundsCenter(config.markers);
			var fittedZoom = calcBoundsZoom(config.markers, container.offsetWidth, container.offsetHeight);
			if (fittedZoom !== null) { mapZoom = fittedZoom; }
		}

		var map = new YMap(container, {
			location: { center: mapCenter, zoom: mapZoom },
			behaviors: buildBehaviors(config),
		});

		var schemeOptions = buildSchemeOptions(config);
		if (config.mapType === 'satellite' || config.mapType === 'hybrid') {
			var YMapTileDataSource = ymaps3.YMapTileDataSource;
			var YMapLayer          = ymaps3.YMapLayer;
			map.addChild(new YMapTileDataSource({ id: 'custom', raster: { type: 'ground' } }));
			map.addChild(new YMapLayer({ source: 'custom', type: 'ground', options: { rasterType: config.mapType } }));
		} else {
			map.addChild(new YMapDefaultSchemeLayer(schemeOptions));
		}

		map.addChild(new YMapDefaultFeaturesLayer());

		// Zoom control — optional, don't let failures block markers
		try {
			var zoomPkg = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
			if (zoomPkg && zoomPkg.YMapZoomControl && YMapControls) {
				var controls = new YMapControls({ position: 'right' });
				controls.addChild(new zoomPkg.YMapZoomControl());
				map.addChild(controls);
			}
		} catch (e) {
			console.warn('[yandex-map-v3] zoom control not loaded:', e.message);
		}

		// Markers
		if (config.markers && config.markers.length > 0) {
			config.markers.forEach(function (markerData) {
				addMarker(map, markerData, config, YMapMarker);
			});
		}
	}

	function addMarker(map, markerData, config, YMapMarker) {
		var color = config.markerColor || '#FF0000';
		var el    = document.createElement('div');
		// Explicit inline styles so marker is visible even without CSS
		el.style.cssText = [
			'width:14px',
			'height:14px',
			'background:' + color,
			'border:2px solid #fff',
			'border-radius:50%',
			'cursor:pointer',
			'box-shadow:0 1px 3px rgba(0,0,0,.4)',
		].join(';');

		var marker = new YMapMarker({ coordinates: markerData.coords }, el);
		map.addChild(marker);
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
