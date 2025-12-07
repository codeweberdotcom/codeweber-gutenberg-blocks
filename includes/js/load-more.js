/**
 * Load More functionality
 * 
 * Handles AJAX-based content loading with "Show More" button
 * Automatically reinitializes theme.init after content is loaded
 * 
 * @package CodeWeber Gutenberg Blocks
 */

(function() {
	'use strict';

	/**
	 * Initialize Load More functionality
	 */
	function initLoadMore() {
		const loadMoreButtons = document.querySelectorAll('.cwgb-load-more-btn');
		
		if (loadMoreButtons.length === 0) {
			return;
		}

		loadMoreButtons.forEach(button => {
			// Skip if already initialized
			if (button.dataset.initialized === 'true') {
				return;
			}

			button.dataset.initialized = 'true';
			
			button.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();

				const container = button.closest('.cwgb-load-more-container');
				if (!container) {
					console.error('Load More: Container not found');
					return;
				}

				const blockId = container.dataset.blockId;
				const blockType = container.dataset.blockType || '';
				const blockAttributes = container.dataset.blockAttributes || '';
				const currentOffset = parseInt(container.dataset.currentOffset) || 0;
				const loadCount = parseInt(container.dataset.loadCount) || 6;
				const postId = container.dataset.postId || '';

				if (!blockId) {
					console.error('Load More: Block ID not found');
					return;
				}

				// Show loading state
				const originalText = button.textContent || button.innerText;
				const isLoadingText = button.dataset.loadingText || 'Loading...';
				
				// Для кнопок используем disabled, для ссылок - pointer-events
				if (button.tagName === 'BUTTON') {
					button.disabled = true;
					button.textContent = isLoadingText;
				} else {
					button.style.pointerEvents = 'none';
					button.style.opacity = '0.6';
					button.textContent = isLoadingText;
				}

				// Use REST API endpoint
				const apiUrl = cwgbLoadMore?.restUrl || '/wp-json/codeweber-gutenberg-blocks/v1/load-more';
				
				// Логирование для отладки
				console.log('Load More: Sending request', {
					block_id: blockId,
					block_type: blockType,
					offset: currentOffset,
					count: loadCount,
					has_attributes: !!blockAttributes,
					attributes_length: blockAttributes ? blockAttributes.length : 0
				});

				// Кодируем block_attributes для передачи в JSON
				const requestBody = {
					block_id: blockId,
					block_type: blockType,
					block_attributes: blockAttributes, // Уже строка JSON из data-атрибута
					offset: currentOffset,
					count: loadCount,
					post_id: postId
				};

				fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': cwgbLoadMore?.nonce || ''
					},
					body: JSON.stringify(requestBody)
				})
				.then(response => {
					console.log('Load More: Response status', response.status, response.statusText);
					if (!response.ok) {
						return response.text().then(text => {
							console.error('Load More: Error response', text);
							try {
								const err = JSON.parse(text);
								throw new Error(err.message || err.code || 'Network response was not ok: ' + response.status);
							} catch (e) {
								throw new Error('Network response was not ok: ' + response.status + ' - ' + text.substring(0, 100));
							}
						});
					}
					return response.json();
				})
				.then(data => {
					console.log('Load More: Response data', data);
					
					// WordPress REST API может возвращать данные напрямую или в обертке
					// Проверяем оба варианта
					const responseData = data.data || data;
					const success = data.success !== undefined ? data.success : (responseData && (responseData.html !== undefined || responseData.has_more !== undefined));
					
					console.log('Load More: Parsed response', { success, responseData });
					
					if (success && responseData) {
						// Insert new content
						const itemsContainer = container.querySelector('.cwgb-load-more-items');
						if (itemsContainer && responseData.html) {
							// Create a temporary container to parse HTML
							const tempDiv = document.createElement('div');
							tempDiv.innerHTML = responseData.html;
							
							// Сохраняем количество существующих элементов для определения первого нового
							const existingChildrenCount = itemsContainer.children.length;
							
							// Append each item
							while (tempDiv.firstChild) {
								itemsContainer.appendChild(tempDiv.firstChild);
							}

							// Небольшая задержка перед инициализацией, чтобы DOM обновился
							setTimeout(() => {
								// Reinitialize theme components для контейнера с новыми элементами
								// Передаем контейнер для более точной инициализации
								reinitializeTheme(container);
								
								// Прокрутка к первому новому элементу (как в теме Codeweber)
								// Получаем первый новый элемент после добавления в DOM
								if (itemsContainer.children.length > existingChildrenCount) {
									const firstNewElement = itemsContainer.children[existingChildrenCount];
									if (firstNewElement) {
										// Используем тот же подход, что и в теме: window.scroll() с behavior: "smooth"
										// Вычисляем позицию элемента относительно документа
										const elementTop = firstNewElement.getBoundingClientRect().top + window.pageYOffset;
										// Добавляем небольшой отступ сверху для лучшей видимости
										const scrollOffset = elementTop - 100; // 100px отступ сверху
										window.scroll({
											top: Math.max(0, scrollOffset), // Не позволяем уйти в отрицательные значения
											behavior: 'smooth'
										});
										console.log('✅ Load More: Scrolled to new content');
									}
								}
							}, 100);
						}

						// Update offset
						container.dataset.currentOffset = responseData.offset || (currentOffset + loadCount);

						// Hide button if no more items
						if (!responseData.has_more) {
							button.style.display = 'none';
						} else {
							// Восстанавливаем состояние для кнопок и ссылок
							if (button.tagName === 'BUTTON') {
								button.disabled = false;
							} else {
								button.style.pointerEvents = '';
								button.style.opacity = '';
							}
							button.textContent = originalText;
						}
					} else {
						console.error('Load More: Invalid response structure', data);
						throw new Error(data.message || responseData?.message || 'Failed to load more items');
					}
				})
				.catch(error => {
					console.error('Load More Error:', error);
					// Восстанавливаем состояние для кнопок и ссылок
					if (button.tagName === 'BUTTON') {
						button.disabled = false;
					} else {
						button.style.pointerEvents = '';
						button.style.opacity = '';
					}
					button.textContent = originalText;
					alert('Load error. Please try again.');
				});
			});
		});
	}

	/**
	 * Reinitialize theme components after content is loaded
	 * Specifically for Image Simple block components
	 * Can be called with a container (for Load More) or without (for initial page load)
	 */
	function reinitializeTheme(container) {
		if (typeof window.theme === 'undefined') {
			console.warn('Load More: theme object not found');
			return;
		}

		// Определяем, это Load More или первая загрузка
		const isLoadMore = container && container.classList.contains('cwgb-load-more-container');
		const isInitialLoad = container && container.classList.contains('cwgb-image-simple-block');
		const logPrefix = isLoadMore ? 'Load More' : 'Image Simple';

		// Небольшая задержка для того, чтобы DOM обновился
		setTimeout(() => {
			try {
				// Определяем область поиска элементов
				const searchScope = container || document;

				// 1. GLightbox - инициализация для элементов
				// Проверяем наличие lightbox в theme (GLightbox instance)
				if (window.theme?.lightbox && typeof window.theme.lightbox.reload === 'function') {
					// GLightbox уже инициализирован, просто перезагружаем для новых элементов
					window.theme.lightbox.reload();
					console.log(`✅ ${logPrefix}: GLightbox reloaded`);
				} else if (typeof window.theme?.initLightbox === 'function') {
					// Если есть функция initLightbox, используем её
					window.theme.initLightbox();
					console.log(`✅ ${logPrefix}: GLightbox initialized via initLightbox`);
				} else if (typeof window.GLightbox === 'function') {
					// Fallback: проверяем наличие элементов
					const glightboxElements = searchScope.querySelectorAll('[data-glightbox]');
					if (glightboxElements.length > 0) {
						console.log(`✅ ${logPrefix}: GLightbox elements found`, glightboxElements.length);
						// GLightbox должен автоматически обработать новые элементы при следующем клике
					}
				}

				// 2. Image Hover Overlay - для overlay эффектов
				// theme.imageHoverOverlay() автоматически добавляет span.bg к элементам .overlay > a, .overlay > span
				// Но нужно вызывать только для новых элементов, у которых еще нет span.bg
				if (isLoadMore && typeof window.theme?.imageHoverOverlay === 'function') {
					// Находим все overlay элементы в контейнере (включая те, что имеют класс overlay-*)
					// и добавляем span.bg только к тем, у кого его еще нет
					const allOverlays = container.querySelectorAll('[class*="overlay-"] > a, [class*="overlay-"] > span, .overlay > a, .overlay > span');
					let addedCount = 0;
					allOverlays.forEach(overlay => {
						// Проверяем, есть ли уже span.bg
						if (!overlay.querySelector('span.bg')) {
							const overlayBg = document.createElement('span');
							overlayBg.className = 'bg';
							overlay.appendChild(overlayBg);
							addedCount++;
						}
					});
					console.log(`✅ ${logPrefix}: Image Hover Overlay initialized for ${addedCount} new elements`);
				} else if (typeof window.theme?.imageHoverOverlay === 'function') {
					// Для первой загрузки вызываем стандартную функцию
					window.theme.imageHoverOverlay();
					console.log(`✅ ${logPrefix}: Image Hover Overlay initialized`);
				}

				// 3. iTooltip - для tooltip эффектов
				if (typeof window.theme?.iTooltip === 'function') {
					window.theme.iTooltip();
					console.log(`✅ ${logPrefix}: iTooltip initialized`);
				}

				// 4. Isotope - для grid layouts (если используется)
				if (typeof window.theme?.isotope === 'function') {
					window.theme.isotope();
					console.log(`✅ ${logPrefix}: Isotope initialized`);
				}

				// 5. Bootstrap Tooltips и Popovers
				if (typeof window.theme?.bsTooltips === 'function') {
					window.theme.bsTooltips();
				}
				if (typeof window.theme?.bsPopovers === 'function') {
					window.theme.bsPopovers();
				}

				// 6. Общая инициализация theme.init (если доступна)
				// Для Load More вызываем init для переинициализации всех компонентов
				// Для первой загрузки не вызываем, чтобы не конфликтовать с основной инициализацией темы
				if (isLoadMore && typeof window.theme?.init === 'function') {
					window.theme.init();
					console.log(`✅ ${logPrefix}: theme.init() reinitialized`);
				} else if (isInitialLoad) {
					console.log(`✅ ${logPrefix}: Components initialized`);
				}

			} catch (error) {
				console.error('Load More: Error reinitializing theme components', error);
			}
		}, isLoadMore ? 100 : 200); // Для Load More меньше задержка, для первой загрузки больше
	}

	// Initialize Load More functionality on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initLoadMore);
	} else {
		initLoadMore();
	}

	// Reinitialize after AJAX content is loaded (for compatibility with other AJAX handlers)
	document.addEventListener('cwgbLoadMoreComplete', function() {
		reinitializeTheme();
	});

})();

