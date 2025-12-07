/**
 * Post Grid Block - Frontend Script
 * Инициализация Swiper для режима slider
 */

(function() {
	'use strict';

	/**
	 * Инициализация Swiper для Post Grid блоков
	 * Вызывает theme.swiperSlider() для инициализации всех Swiper контейнеров
	 */
	function initPostGridSwiper() {
		// Проверяем наличие функции инициализации Swiper в теме
		if (typeof window.theme?.swiperSlider === 'function') {
			// Проверяем наличие Swiper контейнеров в Post Grid блоках
			const postGridBlocks = document.querySelectorAll('.cwgb-post-grid-block .swiper-container');
			
			if (postGridBlocks.length > 0) {
				// Вызываем theme.swiperSlider() - он сам найдет все .swiper-container и инициализирует их
				window.theme.swiperSlider();
				console.log('✅ Post Grid Swiper initialized for', postGridBlocks.length, 'block(s)');
			}
		} else {
			// Если theme.js еще не загружен, ждем
			console.warn('Post Grid: Swiper initialization function not available. Waiting for theme.js...');
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
			const postGridContainers = document.querySelectorAll('.cwgb-post-grid-block .swiper-container');
			if (postGridContainers.length > 0) {
				// Проверяем, инициализированы ли уже контейнеры (если у них есть swiper-controls, значит уже инициализированы)
				const uninitialized = Array.from(postGridContainers).filter(function(container) {
					return !container.querySelector('.swiper-controls');
				});
				
				if (uninitialized.length > 0) {
					// Вызываем theme.swiperSlider() - он сам найдет все .swiper-container и инициализирует их
					window.theme.swiperSlider();
					console.log('✅ Post Grid Swiper initialized for', uninitialized.length, 'block(s)');
				}
			}
		} else {
			// Если theme.js еще не загружен, ждем немного и пробуем снова
			setTimeout(function() {
				if (typeof window.theme?.swiperSlider === 'function') {
					initOnLoad();
				}
			}, 200);
		}
	}

	// Инициализация после полной загрузки страницы (включая все ресурсы)
	// Это гарантирует, что theme.init() уже выполнился
	if (window.addEventListener) {
		window.addEventListener('load', function() {
			setTimeout(initOnLoad, 100);
		});
	} else if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() {
			// Дополнительная задержка для гарантии, что theme.init() выполнился
			setTimeout(initOnLoad, 300);
		});
	} else {
		// DOM уже загружен, но ждем полной загрузки страницы
		if (document.readyState === 'complete') {
			setTimeout(initOnLoad, 100);
		} else {
			window.addEventListener('load', function() {
				setTimeout(initOnLoad, 100);
			});
		}
	}

	// Также инициализируем при загрузке через AJAX (для Load More и других динамических загрузок)
	// Используем MutationObserver для отслеживания добавления новых блоков
	if (typeof MutationObserver !== 'undefined') {
		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.addedNodes.length > 0) {
					// Проверяем, были ли добавлены новые Post Grid блоки
					const hasNewPostGrid = Array.from(mutation.addedNodes).some(function(node) {
						return node.nodeType === 1 && (
							node.classList?.contains('cwgb-post-grid-block') ||
							node.querySelector?.('.cwgb-post-grid-block .swiper-container')
						);
					});

					if (hasNewPostGrid) {
						// Небольшая задержка для гарантии, что DOM полностью обновлен
						setTimeout(function() {
							if (typeof window.theme?.swiperSlider === 'function') {
								window.theme.swiperSlider();
							}
						}, 200);
					}
				}
			});
		});

		// Начинаем наблюдение за изменениями в DOM
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}
})();

