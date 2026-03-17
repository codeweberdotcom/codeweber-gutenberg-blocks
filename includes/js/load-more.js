/**
 * Load More functionality
 *
 * Handles AJAX-based content loading with "Show More" button
 * Uses Fetch system (admin-ajax.php) from theme, with fallback to REST API
 * Automatically reinitializes theme.init after content is loaded
 *
 * @package CodeWeber Gutenberg Blocks
 */

(function () {
	'use strict';

	/**
	 * Apply button radius class from theme to Load More buttons
	 */
	function applyButtonRadiusClass() {
		fetch('/wp-json/codeweber/v1/styles')
			.then((response) => response.json())
			.catch(() => ({}))
			.then((styles) => {
				const buttonRadiusClass = styles?.button_radius_class || '';
				if (!buttonRadiusClass) return;
				document.querySelectorAll('.cwgb-load-more-btn').forEach((button) => {
					if (button.tagName === 'BUTTON') {
						const trimmedClass = buttonRadiusClass.trim();
						if (trimmedClass && !button.classList.contains(trimmedClass)) {
							button.classList.add(trimmedClass);
						}
					}
				});
			})
			.catch(() => {});
	}

	/**
	 * Initialize Load More functionality.
	 * Uses delegated event on document — works after PJAX DOM replacement.
	 */
	function initLoadMore() {
		applyButtonRadiusClass();
	}

	/**
	 * Delegated click handler — attaches once, works for any button in DOM.
	 */
	document.addEventListener('click', function (e) {
		const button = e.target.closest('.cwgb-load-more-btn');
		if (!button) return;
		if (button.disabled) return;

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
		let isLoadingText =
			button.getAttribute('data-loading-text') ||
			button.dataset.loadingText;
		if (!isLoadingText && typeof cwgbLoadMore !== 'undefined' && cwgbLoadMore.loadingText) {
			isLoadingText = cwgbLoadMore.loadingText;
		}
		if (!isLoadingText) {
			isLoadingText = 'Loading...';
		}

		if (button.tagName === 'BUTTON') {
			button.disabled = true;
			button.textContent = isLoadingText;
		} else {
			button.style.pointerEvents = 'none';
			button.style.opacity = '0.6';
			button.textContent = isLoadingText;
		}

		const useFetch = typeof fetch_vars !== 'undefined' && fetch_vars.ajaxurl;
		const apiUrl = useFetch
			? fetch_vars.ajaxurl
			: cwgbLoadMore?.restUrl || '/wp-json/codeweber-gutenberg-blocks/v1/load-more';

		console.log('Load More: Sending request', {
			method: useFetch ? 'Fetch (admin-ajax)' : 'REST API',
			block_id: blockId,
			block_type: blockType,
			offset: currentOffset,
			count: loadCount,
		});

		let fetchOptions;
		if (useFetch) {
			const formData = new FormData();
			formData.append('action', 'fetch_action');
			formData.append('actionType', 'loadMoreItems');
			formData.append('nonce', fetch_vars.nonce);
			formData.append(
				'params',
				JSON.stringify({
					block_id: blockId,
					block_type: blockType,
					block_attributes: blockAttributes,
					offset: currentOffset,
					count: loadCount,
					post_id: postId,
				})
			);
			fetchOptions = { method: 'POST', body: formData };
		} else {
			fetchOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': cwgbLoadMore?.nonce || '',
				},
				body: JSON.stringify({
					block_id: blockId,
					block_type: blockType,
					block_attributes: blockAttributes,
					offset: currentOffset,
					count: loadCount,
					post_id: postId,
				}),
			};
		}

		fetch(apiUrl, fetchOptions)
			.then((response) => {
				if (!useFetch && !response.ok) {
					return response.text().then((text) => {
						try {
							const err = JSON.parse(text);
							throw new Error(err.message || err.code || 'HTTP ' + response.status);
						} catch (e) {
							throw new Error('HTTP ' + response.status);
						}
					});
				}
				return response.json();
			})
			.then((data) => {
				console.log('Load More: Response', data);

				let responseData;
				let success;
				if (useFetch) {
					responseData = data.data || {};
					success = data.status === 'success';
				} else {
					responseData = data.data || data;
					success =
						data.success !== undefined
							? data.success
							: responseData &&
							  (responseData.html !== undefined || responseData.has_more !== undefined);
				}

				console.log('Load More: Parsed', { success, html_length: responseData?.html?.length, has_more: responseData?.has_more });

				if (success && responseData) {
					const itemsContainer = container.querySelector('.cwgb-load-more-items');
					if (itemsContainer && responseData.html) {
						const tempDiv = document.createElement('div');
						tempDiv.innerHTML = responseData.html;

						const existingChildrenCount = itemsContainer.children.length;

						// Собираем ссылки на новые элементы ДО добавления в DOM
						const newItems = Array.from(tempDiv.children);

						// Добавляем элементы в DOM
						while (tempDiv.firstChild) {
							itemsContainer.appendChild(tempDiv.firstChild);
						}

						setTimeout(() => {
							// Isotope: используем window.Isotope (не jQuery плагин)
							// Получаем существующий инстанс через Isotope.data()
							if (window.Isotope && newItems.length > 0) {
								var isoInstance = window.Isotope.data(itemsContainer);
								if (isoInstance) {
									isoInstance.appended(newItems);
									console.log('✅ Load More: Isotope.appended()', newItems.length, 'items');
								} else {
									new window.Isotope(itemsContainer, {
										itemSelector: '.item',
										layoutMode: 'masonry',
									});
									console.log('✅ Load More: Isotope created');
								}
							}

							reinitializeTheme(container);
							applyButtonRadiusClass();

							// Прокрутка к первому новому элементу
							if (itemsContainer.children.length > existingChildrenCount) {
								const firstNewElement = itemsContainer.children[existingChildrenCount];
								if (firstNewElement) {
									const elementTop =
										firstNewElement.getBoundingClientRect().top + window.pageYOffset;
									window.scroll({
										top: Math.max(0, elementTop - 100),
										behavior: 'smooth',
									});
								}
							}
						}, 100);
					}

					// Обновляем offset
					const newOffset = responseData.offset || currentOffset + loadCount;
					container.dataset.currentOffset = newOffset;

					console.log('Load More: Offset updated', {
						old: currentOffset,
						new: newOffset,
						has_more: responseData.has_more,
					});

					if (!responseData.has_more) {
						button.style.display = 'none';
					} else {
						if (button.tagName === 'BUTTON') {
							button.disabled = false;
						} else {
							button.style.pointerEvents = '';
							button.style.opacity = '';
						}
						button.textContent = originalText;
					}
				} else {
					throw new Error(
						data.message || responseData?.message || 'Failed to load more items'
					);
				}
			})
			.catch((error) => {
				console.error('Load More Error:', error);
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

	/**
	 * Reinitialize theme components after content is loaded
	 */
	function reinitializeTheme(container) {
		if (typeof window.theme === 'undefined') {
			console.warn('Load More: theme object not found');
			return;
		}

		const isLoadMore =
			container && container.classList.contains('cwgb-load-more-container');
		const logPrefix = isLoadMore ? 'Load More' : 'Image Simple';

		setTimeout(
			() => {
				try {
					// 1. GLightbox
					if (window.theme?.lightbox && typeof window.theme.lightbox.reload === 'function') {
						window.theme.lightbox.reload();
						console.log(`✅ ${logPrefix}: GLightbox reloaded`);
					} else if (typeof window.theme?.initLightbox === 'function') {
						window.theme.initLightbox();
					}

					// 2. Image Hover Overlay
					if (isLoadMore && typeof window.theme?.imageHoverOverlay === 'function') {
						const allOverlays = container.querySelectorAll(
							'[class*="overlay-"] > a, [class*="overlay-"] > span, .overlay > a, .overlay > span'
						);
						allOverlays.forEach((overlay) => {
							if (!overlay.querySelector('span.bg')) {
								const bg = document.createElement('span');
								bg.className = 'bg';
								overlay.appendChild(bg);
							}
						});
					} else if (typeof window.theme?.imageHoverOverlay === 'function') {
						window.theme.imageHoverOverlay();
					}

					// 3. iTooltip
					if (typeof window.theme?.iTooltip === 'function') {
						window.theme.iTooltip();
					}

					// 4. Bootstrap Tooltips / Popovers
					if (typeof window.theme?.bsTooltips === 'function') window.theme.bsTooltips();
					if (typeof window.theme?.bsPopovers === 'function') window.theme.bsPopovers();

					// Isotope обрабатывается явно через Isotope.data().appended()
					// theme.init() не вызываем — он пересоздал бы Isotope с нуля

				} catch (error) {
					console.error('Load More: Error reinitializing theme', error);
				}
			},
			isLoadMore ? 100 : 200
		);
	}

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initLoadMore);
	} else {
		initLoadMore();
	}

	document.addEventListener('cwgbLoadMoreComplete', function () {
		reinitializeTheme();
	});
})();
