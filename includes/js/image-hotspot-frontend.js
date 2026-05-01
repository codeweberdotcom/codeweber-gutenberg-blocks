(function () {
	'use strict';

	// Кэш для загруженного контента
	const contentCache = {};

	/**
	 * Загрузка контента через Fetch систему темы
	 */
	function loadHotspotContent(hotspotId, pointId) {
		// Проверяем кэш
		const cacheKey = `${hotspotId}_${pointId}`;
		if (contentCache[cacheKey]) {
			return Promise.resolve(contentCache[cacheKey]);
		}

		// Используем Fetch систему темы
		const ajaxurl =
			typeof fetch_vars !== 'undefined' && fetch_vars.ajaxurl
				? fetch_vars.ajaxurl
				: '/wp-admin/admin-ajax.php';

		const formData = new FormData();
		formData.append('action', 'fetch_action');
		formData.append('actionType', 'getHotspotContent');
		formData.append(
			'params',
			JSON.stringify({
				hotspot_id: hotspotId,
				point_id: pointId,
			})
		);
		formData.append('nonce', typeof fetch_vars !== 'undefined' ? fetch_vars.nonce : '');

		return fetch(ajaxurl, {
			method: 'POST',
			body: formData,
		})
			.then((response) => {
				return response.json();
			})
			.then((result) => {
				if (result.status === 'success' && result.data) {
					// Сохраняем в кэш
					contentCache[cacheKey] = result.data;
					return result.data;
				} else {
					throw new Error(result.message || 'Failed to load content');
				}
			})
			.catch((error) => {
				console.error('Fetch error:', error);
				throw error;
			});
	}

	/**
	 * Получить значение data-атрибута
	 */
	function getDataAttr(element, attr) {
		return (
			element.getAttribute(`data-${attr}`) || element.dataset[attr] || ''
		);
	}

	/**
	 * Инициализация Bootstrap Popover для hotspot точек
	 * Поддерживает HTML контент и все типы триггеров (click, hover, focus)
	 * Гибридный подход: Text через скрытый элемент, Post через Fetch систему
	 */
	function initHotspotPopovers(container, hotspotId) {
		const points = container.querySelectorAll(
			'.cw-hotspot-point [data-bs-toggle="popover"]'
		);

		// Проверяем наличие Bootstrap
		if (
			!points.length ||
			typeof bootstrap === 'undefined' ||
			!bootstrap.Popover
		) {
			console.warn(
				'Bootstrap Popover not available for hotspot ID:',
				hotspotId
			);
			return;
		}

		// Используем современный синтаксис Bootstrap 5 (рекомендуется документацией)
		[...points].forEach((pointElement) => {
			const wrapper = pointElement.closest('.cw-hotspot-point');
			if (!wrapper) return;

			const pointId = getDataAttr(wrapper, 'point-id');
			const useAjax =
				getDataAttr(pointElement, 'bs-ajax-load') === 'true';
			const contentType =
				getDataAttr(pointElement, 'content-type') || 'text';

			// Получаем настройки из data-атрибутов
			const trigger = getDataAttr(pointElement, 'bs-trigger') || 'click';
			let placement = getDataAttr(pointElement, 'bs-placement') || 'auto';
			const title = getDataAttr(pointElement, 'bs-title') || '';

			// Если placement="auto", используем умную логику на основе позиции элемента
			if (placement === 'auto') {
				const rect = pointElement.getBoundingClientRect();
				const viewportHeight = window.innerHeight;
				const viewportWidth = window.innerWidth;
				const elementTop = rect.top;
				const elementBottom = rect.bottom;
				const elementLeft = rect.left;
				const elementRight = rect.right;

				// Вычисляем доступное пространство в каждом направлении
				const spaceTop = elementTop;
				const spaceBottom = viewportHeight - elementBottom;
				const spaceLeft = elementLeft;
				const spaceRight = viewportWidth - elementRight;

				// Определяем лучшее направление на основе доступного пространства
				// Приоритет: bottom > top > right > left
				// Но если элемент в верхней части экрана (верхние 20%), предпочитаем bottom
				const isInTopArea = elementTop < viewportHeight * 0.2;
				const isInBottomArea = elementBottom > viewportHeight * 0.8;
				const isInLeftArea = elementLeft < viewportWidth * 0.2;
				const isInRightArea = elementRight > viewportWidth * 0.8;

				if (isInTopArea && spaceBottom > 100) {
					// Элемент вверху - открываем вниз
					placement = 'bottom';
				} else if (isInBottomArea && spaceTop > 100) {
					// Элемент внизу - открываем вверх
					placement = 'top';
				} else if (isInLeftArea && spaceRight > 200) {
					// Элемент слева - открываем вправо
					placement = 'right';
				} else if (isInRightArea && spaceLeft > 200) {
					// Элемент справа - открываем влево
					placement = 'left';
				} else {
					// Выбираем направление с наибольшим пространством
					const maxSpace = Math.max(
						spaceBottom,
						spaceTop,
						spaceRight,
						spaceLeft
					);
					if (maxSpace === spaceBottom) {
						placement = 'bottom';
					} else if (maxSpace === spaceTop) {
						placement = 'top';
					} else if (maxSpace === spaceRight) {
						placement = 'right';
					} else {
						placement = 'left';
					}
				}
			}

			// Получаем контент из скрытого элемента (для Text и Hybrid)
			const contentContainer = wrapper.querySelector(
				'.cw-hotspot-popover-content'
			);
			const staticContent = contentContainer
				? contentContainer.innerHTML
				: '';

			// Используем getOrCreateInstance (рекомендуется Bootstrap 5)
			// Формируем customClass с учетом типа контента для применения CSS сразу
			let customClass = 'cw-hotspot-popover';
			if (contentType === 'post' || contentType === 'hybrid') {
				customClass += ' cw-hotspot-content-' + contentType;
			}

			const popoverOptions = {
				trigger: trigger,
				placement: placement,
				html: true,
				sanitize: false,
				customClass: customClass,
			};

			// Устанавливаем title - если он пустой, устанавливаем пустую строку, чтобы Bootstrap создал popover
			// Bootstrap Popover может не работать, если title вообще не задан
			popoverOptions.title = title || '';

			// Устанавливаем начальный контент
			if (useAjax) {
				// Для AJAX показываем индикатор загрузки (используем спиннер из темы, как в yandex map)
				popoverOptions.content =
					'<div class="cw-hotspot-loading text-center p-3"><div class="spinner spinner-sm"></div></div>';
			} else {
				// Для статического контента берем из скрытого элемента - устанавливаем напрямую как строку
				// Устанавливаем контент, но если он пустой, используем невидимый пробел, чтобы Bootstrap создал структуру
				popoverOptions.content = staticContent.trim() || '&nbsp;';
			}

			// Удаляем data-bs-content атрибут, если он есть, чтобы не переопределял наш контент
			if (pointElement.hasAttribute('data-bs-content')) {
				pointElement.removeAttribute('data-bs-content');
			}

			// Для placement="auto" добавляем более умную логику через модификаторы Popper
			if (placement === 'auto') {
				// Добавляем модификаторы для лучшего определения направления
				popoverOptions.popperConfig = {
					modifiers: [
						{
							name: 'preventOverflow',
							options: {
								boundary: 'viewport',
								padding: 8,
							},
						},
						{
							name: 'flip',
							options: {
								fallbackPlacements: [
									'bottom',
									'top',
									'right',
									'left',
								],
								padding: 8,
							},
						},
						{
							name: 'computeStyles',
							options: {
								adaptive: true,
							},
						},
					],
				};
			}

			// Получаем ширину popover из data-атрибута
			const popoverWidth = getDataAttr(pointElement, 'bs-popover-width');

			// Dispose auto-init instance (created without our options) and create fresh
			let popover;
			try {
				const existing = bootstrap.Popover.getInstance(pointElement);
				if (existing) existing.dispose();
				popover = new bootstrap.Popover(pointElement, popoverOptions);
			} catch (e) {
				console.error('Error creating popover:', e);
				return;
			}

			// Применяем индивидуальную ширину popover, если она задана
			// Класс типа контента уже добавлен через customClass при создании popover
			if (popoverWidth) {
				pointElement.addEventListener(
					'shown.bs.popover',
					() => {
						const popoverElement = document.querySelector(
							'.popover.cw-hotspot-popover'
						);
						if (popoverElement) {
							// Устанавливаем data-атрибут для CSS
							popoverElement.setAttribute(
								'data-popover-width',
								popoverWidth
							);

							// Применяем ширину напрямую через CSS переменную или style
							if (popoverWidth === 'auto') {
								popoverElement.style.width = 'auto';
								popoverElement.style.maxWidth = 'none';
							} else {
								// Проверяем, является ли значение валидным CSS значением
								// Поддерживаем px, %, em, rem, vw, vh и т.д.
								popoverElement.style.setProperty(
									'--popover-width',
									popoverWidth
								);
								popoverElement.style.width = popoverWidth;
								popoverElement.style.maxWidth = popoverWidth;
							}
						}
					},
					{ once: false }
				); // Может срабатывать несколько раз при повторном открытии
			}

			// Добавляем логирование для отслеживания выбранного placement после показа
			if (placement === 'auto') {
				pointElement.addEventListener(
					'shown.bs.popover',
					() => {
						// Получаем фактическое placement после показа
						const popoverElement = document.querySelector(
							'.popover.cw-hotspot-popover'
						);
						if (popoverElement) {
							const actualPlacement = popover._getPlacement();
						}
					},
					{ once: true }
				);
			}

			// Static content: re-inject on every shown event via aria-describedby
			if (!useAjax) {
				pointElement.addEventListener('shown.bs.popover', () => {
					const popoverId = pointElement.getAttribute('aria-describedby');
					const popoverEl = popoverId ? document.getElementById(popoverId) : null;
					if (!popoverEl) return;

					const body = popoverEl.querySelector('.popover-body');
					const header = popoverEl.querySelector('.popover-header');

					if (body) body.innerHTML = staticContent || '';
					if (header) {
						if (title) {
							header.textContent = title;
							header.style.display = '';
						} else {
							header.style.display = 'none';
						}
					}
				});
			}

			// Если используется AJAX, загружаем контент при показе
			if (useAjax && hotspotId && pointId) {
				let contentLoaded = false;
				let isLoading = false;
				let cachedContent = '';
				let cachedTitle = '';

				// Bootstrap 5.3 nullifies _tip after hide, so popover.setContent() is unreliable.
				// We use aria-describedby to find the live popover element in the DOM directly.
				const getPopoverParts = () => {
					const popoverId = pointElement.getAttribute('aria-describedby');
					const popoverEl = popoverId ? document.getElementById(popoverId) : null;
					return {
						body: popoverEl ? popoverEl.querySelector('.popover-body') : null,
						header: popoverEl ? popoverEl.querySelector('.popover-header') : null,
					};
				};

				// Bootstrap removes popover DOM on hide and recreates on show —
				// re-inject cached content on every shown event (no { once: true }).
				pointElement.addEventListener('shown.bs.popover', () => {
					if (contentLoaded) {
						const { body, header } = getPopoverParts();
						if (body) {
							body.innerHTML = cachedContent;
							if (popover._popper) popover._popper.update();
						}
						if (cachedTitle && header) header.textContent = cachedTitle;
						return;
					}

					if (isLoading) return;
					isLoading = true;

					const { body } = getPopoverParts();
					if (!body) {
						isLoading = false;
						return;
					}

					// Показываем спиннер
					body.innerHTML = '<div class="cw-hotspot-loading text-center p-3"><div class="spinner spinner-sm"></div></div>';

					// Загружаем контент
					loadHotspotContent(hotspotId, pointId)
						.then((data) => {
							const { body: bodyEl, header: headerEl } = getPopoverParts();

							if (!bodyEl) {
								isLoading = false;
								return;
							}

							let finalContent = '';
							if (staticContent) {
								finalContent = `${staticContent}<div class="cw-hotspot-post-content mt-3">${data.content || ''}</div>`;
							} else {
								finalContent = data.content || '';
							}

							cachedContent = finalContent;
							if (data.title && data.title !== title) cachedTitle = data.title;

							bodyEl.innerHTML = finalContent;
							if (cachedTitle && headerEl) headerEl.textContent = cachedTitle;

							contentLoaded = true;
							isLoading = false;

							if (popover._popper) {
								popover._popper.update();
							}
						})
						.catch((error) => {
							isLoading = false;
							console.error('Error loading hotspot content:', error);

							const { body: bodyEl } = getPopoverParts();
							if (bodyEl) {
								bodyEl.innerHTML = '<div class="alert alert-danger">Error loading content. Please try again.</div>';
							}
						});
				});

				// Сбрасываем isLoading если поповер закрыли во время загрузки
				pointElement.addEventListener('hide.bs.popover', () => {
					if (isLoading) isLoading = false;
				});
			}

			// Для hover триггера: закрываем при уходе мыши с popover
			if (trigger === 'hover' || trigger.includes('hover')) {
				pointElement.addEventListener('shown.bs.popover', () => {
					const popoverElement = document.querySelector(
						'.popover.cw-hotspot-popover'
					);
					if (popoverElement) {
						popoverElement.addEventListener('mouseleave', () => {
							popover.hide();
						});
					}
				});
			}
		});
	}

	// Инициализация при загрузке DOM
	function initAllHotspots() {
		// Используем современный синтаксис Bootstrap 5 (рекомендуется документацией)
		const containers = document.querySelectorAll(
			'.cw-image-hotspot-container'
		);

		[...containers].forEach((container) => {
			const hotspotId = getDataAttr(container, 'hotspot-id');

			// Инициализируем Bootstrap Popovers
			initHotspotPopovers(container, hotspotId);

			// Добавляем классы для стилизации в зависимости от триггера
			const firstPoint = container.querySelector(
				'.cw-hotspot-point [data-bs-toggle="popover"]'
			);
			if (firstPoint) {
				const trigger =
					getDataAttr(firstPoint, 'bs-trigger') || 'click';
				container.classList.add(`cw-hotspot-trigger-${trigger}`);

				// Отключаем hover эффекты темы для click и focus триггеров
				if (trigger === 'click' || trigger === 'focus') {
					container.classList.add('cw-hotspot-trigger-click');
				}
			}
		});

		// Повторная инициализация после динамической загрузки контента
		document.addEventListener('cw-hotspot-loaded', (e) => {
			const container = e.detail?.container;
			if (container) {
				const hotspotId = getDataAttr(container, 'hotspot-id');
				initHotspotPopovers(container, hotspotId);
			}
		});
	}

	// Инициализация
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initAllHotspots);
	} else {
		initAllHotspots();
	}
})();
