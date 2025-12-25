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
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent',message:'Content from cache',data:{hotspotId:hotspotId,pointId:pointId,cacheKey:cacheKey},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
			// #endregion
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

		// #region agent log
		fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent',message:'Starting AJAX request',data:{hotspotId:hotspotId,pointId:pointId,ajaxurl:ajaxurl},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
		// #endregion

		return fetch(ajaxurl, {
			method: 'POST',
			body: formData
		})
		.then(response => {
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent',message:'AJAX response received',data:{hotspotId:hotspotId,pointId:pointId,status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
			// #endregion
			return response.json();
		})
		.then(result => {
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent',message:'AJAX result parsed',data:{hotspotId:hotspotId,pointId:pointId,resultStatus:result.status,hasData:!!result.data,dataKeys:result.data?Object.keys(result.data):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
			// #endregion
			if (result.status === 'success' && result.data) {
				// Сохраняем в кэш
				contentCache[cacheKey] = result.data;
				return result.data;
			} else {
				throw new Error(result.message || 'Failed to load content');
			}
		})
		.catch(error => {
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent',message:'AJAX error',data:{hotspotId:hotspotId,pointId:pointId,error:error.message,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
			// #endregion
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
				
				// #region agent log
				fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:initHotspotPopovers',message:'Calculating smart placement',data:{pointId:pointId,elementTop:elementTop,elementBottom:elementBottom,viewportHeight:viewportHeight,spaceTop:spaceTop,spaceBottom:spaceBottom,spaceLeft:spaceLeft,spaceRight:spaceRight},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'J'})}).catch(()=>{});
				// #endregion
				
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
				
				// #region agent log
				fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:initHotspotPopovers',message:'Smart placement determined',data:{pointId:pointId,determinedPlacement:placement,isInTopArea:isInTopArea,isInBottomArea:isInBottomArea},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'J'})}).catch(()=>{});
				// #endregion
			}
			
			// Получаем контент из скрытого элемента (для Text и Hybrid)
			const contentContainer = wrapper.querySelector('.cw-hotspot-popover-content');
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:initHotspotPopovers',message:'Extracting content from hidden element',data:{pointId:pointId,hasContentContainer:!!contentContainer,contentContainerHTML:contentContainer?contentContainer.outerHTML.substring(0,100):'null',useAjax:useAjax},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
			// #endregion
			const staticContent = contentContainer ? contentContainer.innerHTML : '';
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:initHotspotPopovers',message:'Static content extracted',data:{pointId:pointId,staticContentLength:staticContent.length,staticContentPreview:staticContent.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
			// #endregion
			
			// Используем getOrCreateInstance (рекомендуется Bootstrap 5)
			const popoverOptions = {
				trigger: trigger,
				placement: placement,
				html: true,
				sanitize: false,
				customClass: 'cw-hotspot-popover'
			};
			
			if (title) {
				popoverOptions.title = title;
			}
			
			// Устанавливаем начальный контент
			if (useAjax) {
				// Для AJAX показываем индикатор загрузки
				popoverOptions.content = '<div class="cw-hotspot-loading text-center p-3"><span class="spinner-border spinner-border-sm" role="status"></span> Loading...</div>';
			} else {
				// Для статического контента берем из скрытого элемента - устанавливаем напрямую как строку
				// #region agent log
				fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:initHotspotPopovers',message:'Setting static content directly',data:{pointId:pointId,staticContentLength:staticContent.length,staticContentPreview:staticContent.substring(0,50),hasTitle:!!title,titleValue:title},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
				// #endregion
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
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:initHotspotPopovers',message:'Creating popover instance',data:{pointId:pointId,useAjax:useAjax,hasTitle:!!title,placement:placement,popoverWidth:popoverWidth,popoverOptionsContentType:typeof popoverOptions.content,popoverOptionsContentLength:typeof popoverOptions.content === 'string' ? popoverOptions.content.length : 0},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'E'})}).catch(()=>{});
			// #endregion
			const popover = bootstrap.Popover.getOrCreateInstance(pointElement, popoverOptions);
			
			// Применяем индивидуальную ширину popover, если она задана
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
						// #region agent log
						fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Actual placement detected',data:{pointId:pointId,requestedPlacement:placement,actualPlacement:actualPlacement,elementRect:pointElement.getBoundingClientRect(),viewportHeight:window.innerHeight,viewportWidth:window.innerWidth,elementTop:pointElement.getBoundingClientRect().top,elementBottom:pointElement.getBoundingClientRect().bottom},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'I'})}).catch(()=>{});
						// #endregion
					}
				}, { once: true });
			}
			
			// Для статического контента принудительно устанавливаем контент через setContent
			if (!useAjax && staticContent) {
				const contentUpdate = {
					'.popover-body': staticContent
				};
				// Если есть заголовок, устанавливаем его тоже
				if (title) {
					contentUpdate['.popover-header'] = title;
				}
				popover.setContent(contentUpdate);
				// #region agent log
				fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:initHotspotPopovers',message:'Forced content via setContent',data:{pointId:pointId,staticContentLength:staticContent.length,hasTitle:!!title,titleValue:title},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'G'})}).catch(()=>{});
				// #endregion
			}
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:initHotspotPopovers',message:'Popover instance created',data:{pointId:pointId,popoverExists:!!popover},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'E'})}).catch(()=>{});
			// #endregion
			
			// Добавляем обработчик для однократного обновления контента при первом показе
			if (!useAjax && staticContent) {
				let contentUpdated = false; // Флаг для предотвращения повторных обновлений
				
				// Используем shown.bs.popover для однократного обновления контента
				pointElement.addEventListener('shown.bs.popover', () => {
					// Обновляем контент только один раз
					if (!contentUpdated) {
						contentUpdated = true;
						
						// #region agent log
						fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Popover shown - updating content once',data:{pointId:pointId,staticContentLength:staticContent.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'F'})}).catch(()=>{});
						// #endregion
						
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
								
								// #region agent log
								fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Checking popover structure before update',data:{pointId:pointId,hasHeader:hasHeader,headerContent:headerContent,hasTitle:!!title,titleValue:title},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'H'})}).catch(()=>{});
								// #endregion
								
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
										// #region agent log
										fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Content updated directly in DOM (once)',data:{pointId:pointId,staticContentLength:staticContent.length,popoverBodyLength:popoverBody.innerHTML.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'F'})}).catch(()=>{});
										// #endregion
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
											// #region agent log
											fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Header created',data:{pointId:pointId,title:title},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'H'})}).catch(()=>{});
											// #endregion
										}
										
										// Устанавливаем содержимое заголовка, если оно пустое или не совпадает
										if (!headerAfter.innerHTML.trim() || headerAfter.innerHTML.trim() !== title) {
											headerAfter.innerHTML = title;
											// #region agent log
											fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Header content set',data:{pointId:pointId,title:title,headerContent:headerAfter.innerHTML},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'H'})}).catch(()=>{});
											// #endregion
										}
									}
									
									// Финальная проверка структуры
									// #region agent log
									fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Popover structure after update',data:{pointId:pointId,hasHeaderAfter:!!headerAfter,headerContentAfter:headerAfter?headerAfter.innerHTML:'',hasBody:!!popoverBody,bodyLength:popoverBody?popoverBody.innerHTML.length:0},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'H'})}).catch(()=>{});
									// #endregion
								}
							}
						}, 50); // Небольшая задержка для готовности DOM
					}
				}, { once: true }); // Используем { once: true } для однократного выполнения
			}
			
			// Если используется AJAX, загружаем контент при показе
			if (useAjax && hotspotId && pointId) {
				let contentLoaded = false;
				let isLoading = false;
				
				// Используем shown.bs.popover вместо show.bs.popover, чтобы popover был уже полностью показан
				pointElement.addEventListener('shown.bs.popover', () => {
					// #region agent log
					fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Popover shown event for AJAX',data:{pointId:pointId,contentLoaded:contentLoaded,isLoading:isLoading,hotspotId:hotspotId},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
					// #endregion
					
					// Загружаем контент только один раз
					if (!contentLoaded && !isLoading) {
						isLoading = true;
						
						// Проверяем, что popover все еще открыт
						const isPopoverShown = popover._isShown();
						// #region agent log
						fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Checking popover state before loading',data:{pointId:pointId,isPopoverShown:isPopoverShown},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
						// #endregion
						
						if (!isPopoverShown) {
							// #region agent log
							fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Popover already closed, skipping load',data:{pointId:pointId},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
							// #endregion
							isLoading = false;
							return;
						}
						
						// Показываем индикатор загрузки
						try {
							popover.setContent({
								'.popover-body': '<div class="cw-hotspot-loading text-center p-3"><span class="spinner-border spinner-border-sm" role="status"></span> Loading...</div>'
							});
							// #region agent log
							fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Loading indicator set',data:{pointId:pointId},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
							// #endregion
						} catch (e) {
							// #region agent log
							fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:shown.bs.popover',message:'Error setting loading indicator',data:{pointId:pointId,error:e.message},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
							// #endregion
						}
						
						// Загружаем контент
						loadHotspotContent(hotspotId, pointId)
							.then(data => {
								// #region agent log
								fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent.then',message:'AJAX content loaded successfully',data:{pointId:pointId,hasContent:!!data.content,contentLength:data.content?data.content.length:0,hasTitle:!!data.title},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'E'})}).catch(()=>{});
								// #endregion
								
								// Проверяем, что popover все еще открыт перед обновлением контента
								const isStillShown = popover._isShown();
								// #region agent log
								fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent.then',message:'Checking popover state before updating content',data:{pointId:pointId,isStillShown:isStillShown},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'F'})}).catch(()=>{});
								// #endregion
								
								if (!isStillShown) {
									// #region agent log
									fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent.then',message:'Popover closed during AJAX, cannot update content',data:{pointId:pointId},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'F'})}).catch(()=>{});
									// #endregion
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
									// #region agent log
									fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent.then',message:'Content updated successfully',data:{pointId:pointId,finalContentLength:finalContent.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'G'})}).catch(()=>{});
									// #endregion
								} catch (e) {
									// #region agent log
									fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent.then',message:'Error updating content',data:{pointId:pointId,error:e.message},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'G'})}).catch(()=>{});
									// #endregion
								}
								
								// Обновляем title, если он изменился
								if (data.title && data.title !== title) {
									try {
										popover.setContent({
											'.popover-header': data.title
										});
									} catch (e) {
										// #region agent log
										fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent.then',message:'Error updating title',data:{pointId:pointId,error:e.message},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'G'})}).catch(()=>{});
										// #endregion
									}
								}
							})
							.catch(error => {
								// #region agent log
								fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent.catch',message:'AJAX error caught',data:{pointId:pointId,error:error.message,isPopoverShown:popover._isShown()},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'H'})}).catch(()=>{});
								// #endregion
								
								isLoading = false;
								console.error('Error loading hotspot content:', error);
								
								// Проверяем, что popover все еще открыт перед показом ошибки
								if (popover._isShown()) {
									try {
										popover.setContent({
											'.popover-body': '<div class="alert alert-danger">Error loading content. Please try again.</div>'
										});
									} catch (e) {
										// #region agent log
										fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:loadHotspotContent.catch',message:'Error setting error message',data:{pointId:pointId,error:e.message},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'H'})}).catch(()=>{});
										// #endregion
									}
								}
							});
					}
				}, { once: true }); // Используем { once: true } для однократного выполнения
				
				// Отслеживаем закрытие popover во время загрузки
				pointElement.addEventListener('hide.bs.popover', () => {
					// #region agent log
					fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-frontend.js:hide.bs.popover',message:'Popover hide event',data:{pointId:pointId,contentLoaded:contentLoaded,isLoading:isLoading},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'I'})}).catch(()=>{});
					// #endregion
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
		});
		
		// Повторная инициализация после динамической загрузки контента
		document.addEventListener('cw-hotspot-loaded', e => {
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
