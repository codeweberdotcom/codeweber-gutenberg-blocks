(function() {
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
		const ajaxurl = (typeof fetch_vars !== 'undefined' && fetch_vars.ajaxurl) 
			? fetch_vars.ajaxurl 
			: '/wp-admin/admin-ajax.php';

		const formData = new FormData();
		formData.append('action', 'fetch_action');
		formData.append('actionType', 'getHotspotContent');
		formData.append('params', JSON.stringify({
			hotspot_id: hotspotId,
			point_id: pointId
		}));


		return fetch(ajaxurl, {
			method: 'POST',
			body: formData
		})
		.then(response => {
			return response.json();
		})
		.then(result => {
			if (result.status === 'success' && result.data) {
				// Сохраняем в кэш
				contentCache[cacheKey] = result.data;
				return result.data;
			} else {
				throw new Error(result.message || 'Failed to load content');
			}
		})
		.catch(error => {
			console.error('Fetch error:', error);
			throw error;
		});
	}

	/**
	 * Получить значение data-атрибута
	 */
	function getDataAttr(element, attr) {
		return element.getAttribute(`data-${attr}`) || element.dataset[attr] || '';
	}

	// Callout функциональность
	let activeCalloutId = null;
	let hideCalloutTimeout = null;

	/**
	 * Инициализация Callout для hotspot точек
	 * Создает выноски с SVG линиями при наведении
	 */
	function initHotspotCallouts(container, hotspotId) {
		const points = container.querySelectorAll('.cw-hotspot-point[data-callout="true"]');
		console.log('initHotspotCallouts called for hotspot:', hotspotId, 'Found points:', points.length);
		if (!points.length) {
			console.log('No callout points found in container');
			return;
		}
		
		let pointCounter = 0;
		
		points.forEach((pointElement) => {
			pointCounter++;
			const pointId = getDataAttr(pointElement, 'point-id');
			const calloutText = getDataAttr(pointElement, 'callout-text') || '';
			
			if (!calloutText) return;
			
			// Создаем контейнер для callout
			const calloutContainer = document.createElement('div');
			calloutContainer.className = 'cw-hotspot-callout-container';
			calloutContainer.id = `cw-callout-${hotspotId}-${pointId}`;
			
			// Вычисляем ширину текста
			const tempSpan = document.createElement('span');
			tempSpan.style.fontSize = '0.875rem';
			tempSpan.style.fontFamily = "'Segoe UI', system-ui, -apple-system, sans-serif";
			tempSpan.style.fontWeight = '500';
			tempSpan.style.visibility = 'hidden';
			tempSpan.style.position = 'absolute';
			tempSpan.style.whiteSpace = 'nowrap';
			tempSpan.textContent = calloutText;
			document.body.appendChild(tempSpan);
			
			const textWidth = tempSpan.offsetWidth;
			document.body.removeChild(tempSpan);
			
			// Параметры линии
			const diagonalLength = 35;
			const textOffset = 50;
			const totalWidth = diagonalLength + textWidth + 15;
			
			// Создаем SVG линию
			const svgNS = "http://www.w3.org/2000/svg";
			const svg = document.createElementNS(svgNS, "svg");
			svg.setAttribute("class", "cw-hotspot-callout-line");
			svg.setAttribute("width", totalWidth);
			svg.setAttribute("height", "30");
			svg.setAttribute("viewBox", `0 0 ${totalWidth} 30`);
			
			const path = document.createElementNS(svgNS, "path");
			const pathData = `M5,25 L${diagonalLength},5 L${totalWidth},5`;
			path.setAttribute("d", pathData);
			path.setAttribute("stroke", "rgba(108, 117, 125, 0.3)");
			
			svg.appendChild(path);
			calloutContainer.appendChild(svg);
			
			// Создаем текст
			const textDiv = document.createElement("div");
			textDiv.className = "cw-hotspot-callout-text bg-white px-2 py-1 shadow-sm opacity-0 fs-14 text-dark text-nowrap";
			textDiv.textContent = calloutText;
			textDiv.style.left = `${textOffset}px`;
			textDiv.style.top = `-15px`;
			
			calloutContainer.appendChild(textDiv);
			
			// Добавляем в контейнер hotspot
			const annotationBox = container.querySelector('.cw-hotspot-annotation-box');
			if (annotationBox) {
				annotationBox.appendChild(calloutContainer);
				console.log('Callout container added for point:', pointId, 'Text:', calloutText);
			} else {
				console.error('Annotation box not found for hotspot:', hotspotId);
			}
			
			// Обработчики событий
			pointElement.addEventListener('mouseenter', () => {
				clearTimeout(hideCalloutTimeout);
				showCallout(hotspotId, pointId, pointElement, calloutContainer);
			});
			
			pointElement.addEventListener('mouseleave', () => {
				hideCalloutTimeout = setTimeout(() => hideCallout(hotspotId, pointId, calloutContainer), 100);
			});
			
			calloutContainer.addEventListener('mouseenter', () => {
				clearTimeout(hideCalloutTimeout);
				showCallout(hotspotId, pointId, pointElement, calloutContainer);
			});
			
			calloutContainer.addEventListener('mouseleave', () => {
				hideCalloutTimeout = setTimeout(() => hideCallout(hotspotId, pointId, calloutContainer), 100);
			});
		});
	}

	function showCallout(hotspotId, pointId, pointElement, calloutContainer) {
		clearTimeout(hideCalloutTimeout);
		
		const calloutId = `${hotspotId}-${pointId}`;
		
		if (activeCalloutId !== calloutId) {
			if (activeCalloutId) {
				const prevCallout = document.getElementById(`cw-callout-${activeCalloutId}`);
				if (prevCallout) {
					hideCallout(activeCalloutId.split('-')[0], activeCalloutId.split('-')[1], prevCallout);
				}
			}
			
			positionCallout(pointElement, calloutContainer);
			
			calloutContainer.classList.remove('hiding');
			calloutContainer.classList.remove('active');
			void calloutContainer.offsetWidth; // Принудительный reflow
			calloutContainer.classList.add('active');

			// Показываем текст
			const textDiv = calloutContainer.querySelector('.cw-hotspot-callout-text');
			if (textDiv) {
				textDiv.classList.remove('opacity-0');
				textDiv.classList.add('opacity-100');
			}

			activeCalloutId = calloutId;
		}
	}

	function hideCallout(hotspotId, pointId, calloutContainer) {
		if (calloutContainer && calloutContainer.classList.contains('active')) {
			calloutContainer.classList.add('hiding');
			calloutContainer.classList.remove('active');

			// Скрываем текст (через анимацию)

			setTimeout(() => {
				calloutContainer.classList.remove('hiding');
				const line = calloutContainer.querySelector('.cw-hotspot-callout-line');
				const text = calloutContainer.querySelector('.cw-hotspot-callout-text');
				if (line) {
					line.style.animation = 'none';
					void line.offsetWidth;
					line.style.animation = null;
				}
				if (text) {
					text.style.animation = 'none';
					void text.offsetWidth;
					text.style.animation = null;
				}
			}, 600);

			if (activeCalloutId === `${hotspotId}-${pointId}`) {
				activeCalloutId = null;
			}
		}
	}

	function positionCallout(pointElement, calloutContainer) {
		if (!calloutContainer || !pointElement) return;

		const rect = pointElement.getBoundingClientRect();
		const container = pointElement.closest('.cw-hotspot-annotation-box');
		if (!container) return;

		const containerRect = container.getBoundingClientRect();

		// Центр точки относительно контейнера (учитываем transform: translate(-50%, -50%))
		// rect.left - левый край точки, но центр в rect.left + rect.width/2
		const centerX = rect.left - containerRect.left + rect.width / 2;
		const centerY = rect.top - containerRect.top + rect.height / 2;

		// Позиционируем callout так, чтобы линия шла от центра точки
		// SVG линия начинается от M5,25 (5px вправо, 25px вниз от верхнего левого callout)
		calloutContainer.style.left = (centerX - 5) + 'px';
		calloutContainer.style.top = (centerY - 25) + 'px';
	}

	/**
	 * Инициализация Bootstrap Popover для hotspot точек
	 * Поддерживает HTML контент и все типы триггеров (click, hover, focus)
	 * Гибридный подход: Text через скрытый элемент, Post через Fetch систему
	 */
	function initHotspotPopovers(container, hotspotId) {
		const points = container.querySelectorAll('.cw-hotspot-point [data-bs-toggle="popover"]');
		
		// Проверяем наличие Bootstrap
		if (!points.length || typeof bootstrap === 'undefined' || !bootstrap.Popover) {
			console.warn('Bootstrap Popover not available for hotspot ID:', hotspotId);
			return;
		}

		// Используем современный синтаксис Bootstrap 5 (рекомендуется документацией)
		[...points].forEach(pointElement => {
			const wrapper = pointElement.closest('.cw-hotspot-point');
			if (!wrapper) return;

			const pointId = getDataAttr(wrapper, 'point-id');
			const useAjax = getDataAttr(pointElement, 'bs-ajax-load') === 'true';
			const contentType = getDataAttr(pointElement, 'content-type') || 'text';
			
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
					const maxSpace = Math.max(spaceBottom, spaceTop, spaceRight, spaceLeft);
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
			const contentContainer = wrapper.querySelector('.cw-hotspot-popover-content');
			const staticContent = contentContainer ? contentContainer.innerHTML : '';
			
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
				customClass: customClass
			};
			
			// Устанавливаем title - если он пустой, устанавливаем пустую строку, чтобы Bootstrap создал popover
			// Bootstrap Popover может не работать, если title вообще не задан
			popoverOptions.title = title || '';
			
			// Устанавливаем начальный контент
			if (useAjax) {
				// Для AJAX показываем индикатор загрузки (используем спиннер из темы, как в yandex map)
				popoverOptions.content = '<div class="cw-hotspot-loading text-center p-3"><div class="spinner spinner-sm"></div></div>';
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
								padding: 8
							}
						},
						{
							name: 'flip',
							options: {
								fallbackPlacements: ['bottom', 'top', 'right', 'left'],
								padding: 8
							}
						},
						{
							name: 'computeStyles',
							options: {
								adaptive: true
							}
						}
					]
				};
			}
			
			// Получаем ширину popover из data-атрибута
			const popoverWidth = getDataAttr(pointElement, 'bs-popover-width');
			
			// Используем getOrCreateInstance (рекомендуется Bootstrap 5 для динамического контента)
			let popover;
			try {
				popover = bootstrap.Popover.getOrCreateInstance(pointElement, popoverOptions);
			} catch (e) {
				console.error('Error creating popover:', e);
				return; // Пропускаем этот элемент, если не удалось создать popover
			}
			
			// Применяем индивидуальную ширину popover, если она задана
			// Класс типа контента уже добавлен через customClass при создании popover
			if (popoverWidth) {
				pointElement.addEventListener('shown.bs.popover', () => {
					const popoverElement = document.querySelector('.popover.cw-hotspot-popover');
					if (popoverElement) {
						// Устанавливаем data-атрибут для CSS
						popoverElement.setAttribute('data-popover-width', popoverWidth);
						
						// Применяем ширину напрямую через CSS переменную или style
						if (popoverWidth === 'auto') {
							popoverElement.style.width = 'auto';
							popoverElement.style.maxWidth = 'none';
						} else {
							// Проверяем, является ли значение валидным CSS значением
							// Поддерживаем px, %, em, rem, vw, vh и т.д.
							popoverElement.style.setProperty('--popover-width', popoverWidth);
							popoverElement.style.width = popoverWidth;
							popoverElement.style.maxWidth = popoverWidth;
						}
					}
				}, { once: false }); // Может срабатывать несколько раз при повторном открытии
			}
			
			// Добавляем логирование для отслеживания выбранного placement после показа
			if (placement === 'auto') {
				pointElement.addEventListener('shown.bs.popover', () => {
					// Получаем фактическое placement после показа
					const popoverElement = document.querySelector('.popover.cw-hotspot-popover');
					if (popoverElement) {
						const actualPlacement = popover._getPlacement();
					}
				}, { once: true });
			}
			
			// Для статического контента принудительно устанавливаем контент через setContent
			if (!useAjax && staticContent) {
				const contentUpdate = {
					'.popover-body': staticContent
				};
				// Если есть заголовок, устанавливаем его тоже, иначе скрываем header
				if (title) {
					contentUpdate['.popover-header'] = title;
				} else {
					// Если title пустой, скрываем header
					contentUpdate['.popover-header'] = '';
				}
				popover.setContent(contentUpdate);
			}
			
			// Если title пустой, скрываем header после показа popover
			if (!title) {
				pointElement.addEventListener('shown.bs.popover', () => {
					const popoverElement = document.querySelector('.popover.cw-hotspot-popover');
					if (popoverElement) {
						const header = popoverElement.querySelector('.popover-header');
						if (header) {
							header.style.display = 'none';
						}
					}
				}, { once: true });
			}
			
			
			// Добавляем обработчик для однократного обновления контента при первом показе
			if (!useAjax && staticContent) {
				let contentUpdated = false; // Флаг для предотвращения повторных обновлений
				
				// Используем shown.bs.popover для однократного обновления контента
				pointElement.addEventListener('shown.bs.popover', () => {
					// Обновляем контент только один раз
					if (!contentUpdated) {
						contentUpdated = true;
						
						
						// Используем setTimeout для небольшой задержки, чтобы DOM был готов
						setTimeout(() => {
							// Ищем popover элемент
							const allPopovers = document.querySelectorAll('.popover');
							const popoverElement = Array.from(allPopovers).find(pop => {
								return pop.classList.contains('cw-hotspot-popover') || pop.getAttribute('data-bs-popper') !== null;
							}) || allPopovers[allPopovers.length - 1];
							
							if (popoverElement) {
								// Проверяем наличие заголовка перед обновлением контента
								const popoverHeader = popoverElement.querySelector('.popover-header');
								const hasHeader = !!popoverHeader;
								const headerContent = popoverHeader ? popoverHeader.innerHTML : '';
								
								
								let popoverBody = popoverElement.querySelector('.popover-body');
								
								// Если .popover-body не существует, создаем его
								if (!popoverBody) {
									popoverBody = document.createElement('div');
									popoverBody.className = 'popover-body';
									popoverElement.appendChild(popoverBody);
								}
								
								if (popoverBody) {
									const currentContent = popoverBody.innerHTML.trim();
									
									// Обновляем только если контент пустой или значительно меньше ожидаемого
									if (!currentContent || currentContent.length < staticContent.trim().length / 2) {
										popoverBody.innerHTML = staticContent;
									}
									
									// Проверяем и обновляем заголовок
									let headerAfter = popoverElement.querySelector('.popover-header');
									
									// Если заголовок должен быть, но его нет или он пустой
									if (title) {
										if (!headerAfter) {
											// Создаем заголовок
											headerAfter = document.createElement('div');
											headerAfter.className = 'popover-header';
											// Вставляем перед body
											popoverElement.insertBefore(headerAfter, popoverBody);
										}
										
										// Устанавливаем содержимое заголовка, если оно пустое или не совпадает
										if (!headerAfter.innerHTML.trim() || headerAfter.innerHTML.trim() !== title) {
											headerAfter.innerHTML = title;
										}
									}
									
									// Финальная проверка структуры
								}
							}
						}, 50); // Небольшая задержка для готовности DOM
					}
				}, { once: true }); // Используем { once: true } для однократного выполнения
			}
			
			// Добавляем обработчик клика для диагностики
			pointElement.addEventListener('click', (e) => {
			});
			
			// Добавляем обработчик для события show.bs.popover (до показа)
			pointElement.addEventListener('show.bs.popover', (e) => {
			});
			
			// Если используется AJAX, загружаем контент при показе
			if (useAjax && hotspotId && pointId) {
				let contentLoaded = false;
				let isLoading = false;
				
				// Используем shown.bs.popover вместо show.bs.popover, чтобы popover был уже полностью показан
				pointElement.addEventListener('shown.bs.popover', () => {
					
					// Загружаем контент только один раз
					if (!contentLoaded && !isLoading) {
						isLoading = true;
						
						// Проверяем, что popover все еще открыт
						const isPopoverShown = popover._isShown();
						
						if (!isPopoverShown) {
							isLoading = false;
							return;
						}
						
						// Показываем индикатор загрузки (используем спиннер из темы, как в yandex map)
						try {
							popover.setContent({
								'.popover-body': '<div class="cw-hotspot-loading text-center p-3"><div class="spinner spinner-sm"></div></div>'
							});
						} catch (e) {
						}
						
						// Загружаем контент
						loadHotspotContent(hotspotId, pointId)
							.then(data => {
								
								// Проверяем, что popover все еще открыт перед обновлением контента
								const isStillShown = popover._isShown();
								
								if (!isStillShown) {
									contentLoaded = false; // Разрешаем повторную загрузку при следующем открытии
									isLoading = false;
									return;
								}
								
								contentLoaded = true;
								isLoading = false;
								
								// Объединяем статический контент (для Hybrid) с AJAX контентом
								let finalContent = '';
								if (staticContent) {
									finalContent = `${staticContent}<div class="cw-hotspot-post-content mt-3">${data.content || ''}</div>`;
								} else {
									finalContent = data.content || '';
								}
								
								// Обновляем контент popover
								try {
									popover.setContent({
										'.popover-body': finalContent
									});
								} catch (e) {
								}
								
								// Обновляем title, если он изменился
								if (data.title && data.title !== title) {
									try {
										popover.setContent({
											'.popover-header': data.title
										});
									} catch (e) {
									}
								}
							})
							.catch(error => {
								
								isLoading = false;
								console.error('Error loading hotspot content:', error);
								
								// Проверяем, что popover все еще открыт перед показом ошибки
								if (popover._isShown()) {
									try {
										popover.setContent({
											'.popover-body': '<div class="alert alert-danger">Error loading content. Please try again.</div>'
										});
									} catch (e) {
									}
								}
							});
					}
				}, { once: true }); // Используем { once: true } для однократного выполнения
				
				// Отслеживаем закрытие popover во время загрузки
				pointElement.addEventListener('hide.bs.popover', () => {
				});
			}
			
			// Для hover триггера: закрываем при уходе мыши с popover
			if (trigger === 'hover' || trigger.includes('hover')) {
				pointElement.addEventListener('shown.bs.popover', () => {
					const popoverElement = document.querySelector('.popover.cw-hotspot-popover');
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
		const containers = document.querySelectorAll('.cw-image-hotspot-container');
		
		[...containers].forEach(container => {
			const hotspotId = getDataAttr(container, 'hotspot-id');
			const displayType = getDataAttr(container, 'display-type') || 'popover';
			
			console.log('Initializing hotspot:', hotspotId, 'Display Type:', displayType);
			
			if (displayType === 'callout') {
				// Инициализируем Callouts
				initHotspotCallouts(container, hotspotId);
			} else {
				// Инициализируем Bootstrap Popovers
				initHotspotPopovers(container, hotspotId);
				
				// Добавляем классы для стилизации в зависимости от триггера
				const firstPoint = container.querySelector('.cw-hotspot-point [data-bs-toggle="popover"]');
				if (firstPoint) {
					const trigger = getDataAttr(firstPoint, 'bs-trigger') || 'click';
					container.classList.add(`cw-hotspot-trigger-${trigger}`);
					
					// Отключаем hover эффекты темы для click и focus триггеров
					if (trigger === 'click' || trigger === 'focus') {
						container.classList.add('cw-hotspot-trigger-click');
					}
				}
			}
		});
		
		// Повторная инициализация после динамической загрузки контента
		document.addEventListener('cw-hotspot-loaded', e => {
			const container = e.detail?.container;
			if (container) {
				const hotspotId = getDataAttr(container, 'hotspot-id');
				const displayType = getDataAttr(container, 'display-type') || 'popover';
				
				if (displayType === 'callout') {
					initHotspotCallouts(container, hotspotId);
				} else {
					initHotspotPopovers(container, hotspotId);
				}
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
