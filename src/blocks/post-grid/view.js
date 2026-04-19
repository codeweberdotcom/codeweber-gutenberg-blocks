/**
 * Post Grid Block - Frontend Script
 * Инициализация Swiper для режима slider
 */

(function () {
	'use strict';

	/**
	 * Инициализация Swiper для Post Grid блоков
	 * Вызывает theme.swiperSlider() для инициализации всех Swiper контейнеров
	 */
	function initPostGridSwiper() {
		// Проверяем наличие функции инициализации Swiper в теме
		if (typeof window.theme?.swiperSlider === 'function') {
			// Проверяем наличие Swiper контейнеров в Post Grid блоках
			const postGridBlocks = document.querySelectorAll(
				'.cwgb-post-grid-block .swiper-container'
			);

			if (postGridBlocks.length > 0) {
				// Вызываем theme.swiperSlider() - он сам найдет все .swiper-container и инициализирует их
				window.theme.swiperSlider();
				console.log(
					'✅ Post Grid Swiper initialized for',
					postGridBlocks.length,
					'block(s)'
				);
			}
		} else {
			// Если theme.js еще не загружен, ждем
			console.warn(
				'Post Grid: Swiper initialization function not available. Waiting for theme.js...'
			);
		}
	}

	/**
	 * Инициализация при загрузке страницы
	 * Ждем полной загрузки, чтобы theme.js точно был загружен и theme.init() выполнился
	 */
	function initOnLoad() {
		// Проверяем, загружен ли theme.js
		if (typeof window.theme?.swiperSlider === 'function') {
			// Проверяем, есть ли неинициализированные Swiper контейнеры в Post Grid блоках
			const postGridContainers = document.querySelectorAll(
				'.cwgb-post-grid-block .swiper-container'
			);
			if (postGridContainers.length > 0) {
				// Проверяем, инициализированы ли уже контейнеры (если у них есть swiper-controls, значит уже инициализированы)
				const uninitialized = Array.from(postGridContainers).filter(
					function (container) {
						return !container.querySelector('.swiper-controls');
					}
				);

				if (uninitialized.length > 0) {
					// Вызываем theme.swiperSlider() - он сам найдет все .swiper-container и инициализирует их
					window.theme.swiperSlider();
					console.log(
						'✅ Post Grid Swiper initialized for',
						uninitialized.length,
						'block(s)'
					);
				}
			}
		} else {
			// Если theme.js еще не загружен, ждем немного и пробуем снова
			setTimeout(function () {
				if (typeof window.theme?.swiperSlider === 'function') {
					initOnLoad();
				}
			}, 200);
		}
	}

	// Инициализация после полной загрузки страницы (включая все ресурсы)
	// Это гарантирует, что theme.init() уже выполнился
	if (window.addEventListener) {
		window.addEventListener('load', function () {
			setTimeout(initOnLoad, 100);
		});
	} else if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			// Дополнительная задержка для гарантии, что theme.init() выполнился
			setTimeout(initOnLoad, 300);
		});
	} else {
		// DOM уже загружен, но ждем полной загрузки страницы
		if (document.readyState === 'complete') {
			setTimeout(initOnLoad, 100);
		} else {
			window.addEventListener('load', function () {
				setTimeout(initOnLoad, 100);
			});
		}
	}

	/**
	 * Post Grid filter bar — runtime taxonomy filter.
	 *
	 * На клик по кнопке .cwgb-post-grid-filter .filter-item отправляем POST
	 * в REST /codeweber-gutenberg-blocks/v1/post-grid/filter с текущими attributes
	 * блока (берём из data-block-attributes на wrapper'е) и term_id. Ответ —
	 * обновлённый HTML всего блока; подменяем только .cwgb-post-grid-results.
	 */
	function bindFilterBars() {
		var bars = document.querySelectorAll('.cwgb-post-grid-filter');
		bars.forEach(function (bar) {
			if (bar.dataset.cwgbFilterBound === '1') return;
			bar.dataset.cwgbFilterBound = '1';

			bar.addEventListener('click', function (ev) {
				var btn = ev.target.closest('.filter-item');
				if (!btn) return;
				ev.preventDefault();

				var blockId = bar.getAttribute('data-cwgb-filter-for');
				if (!blockId) return;

				var termId = parseInt(
					btn.getAttribute('data-cwgb-filter-term') || '0',
					10
				);

				var block = document.querySelector(
					'.cwgb-post-grid-block[data-block-id="' + blockId + '"]'
				);
				if (!block) return;

				var results = block.querySelector(
					'.cwgb-post-grid-results[data-cwgb-results-for="' +
						blockId +
						'"]'
				);
				if (!results) return;

				var attrsRaw = block.getAttribute('data-block-attributes');
				var attrs = {};
				try {
					attrs = attrsRaw ? JSON.parse(attrsRaw) : {};
				} catch (e) {
					console.error('Post Grid filter: attrs parse failed', e);
					return;
				}

				// UI: активная кнопка
				bar.querySelectorAll('.filter-item').forEach(function (b) {
					b.classList.remove('active');
				});
				btn.classList.add('active');

				// Визуальная блокировка результатов
				results.style.opacity = '0.5';
				results.style.pointerEvents = 'none';

				var restUrl =
					(window.wpApiSettings && window.wpApiSettings.root
						? window.wpApiSettings.root
						: '/wp-json/') +
					'codeweber-gutenberg-blocks/v1/post-grid/filter';

				fetch(restUrl, {
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce':
							window.wpApiSettings && window.wpApiSettings.nonce
								? window.wpApiSettings.nonce
								: '',
					},
					body: JSON.stringify({
						attributes: attrs,
						term_id: termId,
					}),
				})
					.then(function (r) {
						return r.json();
					})
					.then(function (data) {
						if (!data || !data.html) return;

						// Парсим ответ и извлекаем только наш results-контейнер.
						var parser = new DOMParser();
						var doc = parser.parseFromString(data.html, 'text/html');
						var newResults = doc.querySelector(
							'.cwgb-post-grid-results[data-cwgb-results-for="' +
								blockId +
								'"]'
						);
						if (newResults) {
							results.innerHTML = newResults.innerHTML;
						}

						// Реинициализация swiper если режим slider (на всякий случай).
						if (typeof window.theme?.swiperSlider === 'function') {
							window.theme.swiperSlider();
						}
					})
					.catch(function (err) {
						console.error('Post Grid filter: request failed', err);
					})
					.finally(function () {
						results.style.opacity = '';
						results.style.pointerEvents = '';
					});
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bindFilterBars);
	} else {
		bindFilterBars();
	}

	// Также инициализируем при загрузке через AJAX (для Load More и других динамических загрузок)
	// Используем MutationObserver для отслеживания добавления новых блоков
	if (typeof MutationObserver !== 'undefined') {
		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.addedNodes.length > 0) {
					// Проверяем, были ли добавлены новые Post Grid блоки
					const hasNewPostGrid = Array.from(mutation.addedNodes).some(
						function (node) {
							return (
								node.nodeType === 1 &&
								(node.classList?.contains(
									'cwgb-post-grid-block'
								) ||
									node.querySelector?.(
										'.cwgb-post-grid-block .swiper-container'
									))
							);
						}
					);

					if (hasNewPostGrid) {
						// Небольшая задержка для гарантии, что DOM полностью обновлен
						setTimeout(function () {
							if (
								typeof window.theme?.swiperSlider === 'function'
							) {
								window.theme.swiperSlider();
							}
							bindFilterBars();
						}, 200);
					}
				}
			});
		});

		// Начинаем наблюдение за изменениями в DOM
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
})();
