(function($) {
	'use strict';

	// #region agent log
	function logDebug(location, message, data) {
		const logEntry = {
			timestamp: Date.now(),
			location: location,
			message: message,
			data: data || {},
			sessionId: 'debug-session',
			runId: 'initial',
			hypothesisId: 'C'
		};
		fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(logEntry)
		}).catch(() => {});
	}
	// #endregion

	function initHoverTrigger($container, $points, popupStyle, hotspotId) {
		// Для стиля tooltip - показываем при hover
		if (popupStyle === 'tooltip') {
			$points.on('mouseenter', function() {
				const $point = $(this);
				$point.addClass('active');

				// #region agent log
				logDebug('image-hotspot-frontend.js:tooltip-show', 'Tooltip shown', {
					hotspotId: hotspotId,
					pointId: $point.data('hotspot-id')
				});
				// #endregion
			});

			$points.on('mouseleave', function() {
				const $point = $(this);
				$point.removeClass('active');

				// #region agent log
				logDebug('image-hotspot-frontend.js:tooltip-hide', 'Tooltip hidden', {
					hotspotId: hotspotId,
					pointId: $point.data('hotspot-id')
				});
				// #endregion
			});
		} else {
			// Для стиля popup при hover
			$points.on('mouseenter', function() {
				const $point = $(this);
				$point.addClass('active');
			});

			$points.on('mouseleave', function() {
				const $point = $(this);
				$point.removeClass('active');
			});
		}
	}

	function initClickTrigger($container, $points, popupStyle, hotspotId) {
		// #region agent log
		logDebug('image-hotspot-frontend.js:initClickTrigger', 'Initializing click trigger', {
			hotspotId: hotspotId,
			popupStyle: popupStyle,
			pointsCount: $points.length
		});
		// #endregion

		// Убеждаемся, что hover события не привязаны (защита от двойной инициализации)
		$points.off('mouseenter mouseleave');

		$points.on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			const $point = $(this);
			const $popup = $point.find('.cw-hotspot-popup');

			// Переключаем состояние
			if ($point.hasClass('active')) {
				// Закрываем
				$points.removeClass('active');
			} else {
				// Закрываем другие открытые popup
				$points.removeClass('active');

				// Открываем текущий popup
				$point.addClass('active');

				// Позиционируем popup для popup стиля
				if (popupStyle === 'popup' && $popup.length) {
					const popupWidth = $popup.outerWidth();
					const popupHeight = $popup.outerHeight();

					// Центрируем popup
					$popup.css({
						left: '50%',
						top: '50%',
						marginLeft: -popupWidth / 2 + 'px',
						marginTop: -popupHeight / 2 + 'px'
					});
				}
			}

			// #region agent log
			logDebug('image-hotspot-frontend.js:popup-toggle', 'Popup toggled', {
				hotspotId: hotspotId,
				pointId: $point.data('hotspot-id'),
				isActive: $point.hasClass('active'),
				popupStyle: popupStyle
			});
			// #endregion
		});

		// Закрываем popup при клике вне popup
		$(document).off('click.hotspot-' + hotspotId);
		$(document).on('click.hotspot-' + hotspotId, function(e) {
			if (!$(e.target).closest('.cw-hotspot-point').length &&
			    !$(e.target).closest('.cw-hotspot-popup').length) {
				$points.removeClass('active');
			}
		});

		// Закрываем popup при нажатии ESC
		$(document).off('keydown.hotspot-' + hotspotId);
		$(document).on('keydown.hotspot-' + hotspotId, function(e) {
			if (e.keyCode === 27) { // ESC
				$points.removeClass('active');
			}
		});
	}

	$(document).ready(function() {
		// #region agent log
		logDebug('image-hotspot-frontend.js:init', 'Frontend script initialized');
		// #endregion

		// Инициализация для каждого контейнера hotspot
		$('.cw-image-hotspot-container').each(function() {
			const $container = $(this);
			const hotspotId = $container.data('hotspot-id');
			const popupStyle = $container.data('popup-style') || 'tooltip';

			// Читаем popupTrigger из data-атрибута (пробуем оба способа)
			let popupTrigger = $container.attr('data-popup-trigger');
			if (!popupTrigger) {
				popupTrigger = $container.data('popup-trigger');
			}
			if (!popupTrigger) {
				popupTrigger = 'hover'; // по умолчанию
			}

			// #region agent log
			logDebug('image-hotspot-frontend.js:container-init', 'Container initialized', {
				hotspotId: hotspotId,
				popupStyle: popupStyle,
				popupTrigger: popupTrigger,
				dataAttrValue: $container.attr('data-popup-trigger'),
				dataMethodValue: $container.data('popup-trigger'),
				htmlString: $container[0] ? $container[0].outerHTML.substring(0, 200) : 'no element'
			});
			// #endregion

			const $points = $container.find('.cw-hotspot-point');

			// Определяем способ триггера
			if (popupTrigger === 'click') {
				// #region agent log
				logDebug('image-hotspot-frontend.js:trigger-mode', 'Using click trigger mode');
				// #endregion
				// В режиме click отключаем hover эффекты классов темы
				$container.addClass('cw-hotspot-trigger-click');
				// При клике для любого стиля popup
				initClickTrigger($container, $points, popupStyle, hotspotId);
			} else {
				// #region agent log
				logDebug('image-hotspot-frontend.js:trigger-mode', 'Using hover trigger mode', {
					popupTrigger: popupTrigger
				});
				// #endregion
				// При наведении (hover) для любого стиля popup
				$container.addClass('cw-hotspot-trigger-hover');
				initHoverTrigger($container, $points, popupStyle, hotspotId);
			}
		});
	});

})(jQuery);
