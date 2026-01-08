/**
 * Image Hotspot Admin JavaScript
 * 
 * Handles the hotspot editor functionality
 */
(function($) {
	'use strict';

	let hotspotEditor = {
		hotspots: [],
		currentEditingPoint: null,
		isDragging: false,
		annotationBox: null,
		mainImage: null,
		
		init: function() {
			this.annotationBox = $('#cw-hotspot-annotation-box');
			this.mainImage = $('#cw-hotspot-main-image');
			
			// Load existing hotspots from hidden field
			const hotspotData = $('#cw-hotspot-data').val();
			
			
			if (hotspotData) {
				try {
					this.hotspots = JSON.parse(hotspotData);
					
					
					this.renderHotspots();
				} catch (e) {
					console.error('Error parsing hotspot data:', e);
					this.hotspots = [];
				}
			}
			
			this.bindEvents();
		},
		
		bindEvents: function() {
			const self = this;
			
			// Upload image button
			$('#cw-hotspot-upload-image').on('click', function(e) {
				e.preventDefault();
				self.openMediaUploader();
			});
			
			// Add point button
			$('#cw-hotspot-add-point').on('click', function(e) {
				e.preventDefault();
				if (self.mainImage.length && self.mainImage.attr('src')) {
					self.addNewPoint(50, 50); // Default position: center
				} else {
					alert('Please upload an image first');
				}
			});
			
			// Click on image to add point
			this.annotationBox.on('click', '.cw-hotspot-main-image', function(e) {
				if ($(e.target).closest('.cw-hotspot-point').length) {
					return; // Don't add point if clicking on existing point
				}
				
				const $img = $(this);
				const offset = $img.offset();
				const imgWidth = $img.width();
				const imgHeight = $img.height();
				
				// Calculate percentage position
				const x = ((e.pageX - offset.left) / imgWidth) * 100;
				const y = ((e.pageY - offset.top) / imgHeight) * 100;
				
				self.addNewPoint(Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
			});
			
			// Settings change
			$('.cw-hotspot-setting').on('change', function() {
				self.saveSettings();
			});
			
			// Save form (update hidden field before submit)
			$('#post').on('submit', function() {
				self.saveHotspots();
			});
		},
		
		openMediaUploader: function() {
			const self = this;
			const mediaUploader = wp.media({
				title: 'Choose Image',
				button: {
					text: 'Use this image'
				},
				multiple: false
			});
			
			mediaUploader.on('select', function() {
				const attachment = mediaUploader.state().get('selection').first().toJSON();
				$('#cw-hotspot-image-id').val(attachment.id);
				
				const img = $('<img>')
					.attr('src', attachment.url)
					.attr('class', 'cw-hotspot-main-image')
					.attr('id', 'cw-hotspot-main-image');
				
				self.annotationBox.find('.cw-hotspot-placeholder').remove();
				self.annotationBox.find('.cw-hotspot-main-image').remove();
				self.annotationBox.prepend(img);
				self.mainImage = $('#cw-hotspot-main-image');
			});
			
			mediaUploader.open();
		},
		
		addNewPoint: function(x, y) {
			const pointId = 'point_' + Date.now();
			
			const point = {
				id: pointId,
				x: x,
				y: y,
				title: '',
				content: '',
				link: '',
				linkTarget: '_self',
				iconName: 'plus', // Иконка для точки (по умолчанию plus)
				contentType: 'text', // Тип контента: text, post, hybrid
				postId: '', // ID поста (если contentType = post или hybrid)
				postType: '', // Тип поста (post, page, clients и т.д.)
				postTemplate: 'default' // Шаблон PostCard
			};
			
			this.hotspots.push(point);
			this.renderHotspot(point);
			this.editPoint(point);
		},
		
		renderHotspots: function() {
			const self = this;
			
			
			// Remove all existing points
			this.annotationBox.find('.cw-hotspot-point').remove();
			
			// Render all points
			this.hotspots.forEach(function(point) {
				self.renderHotspot(point);
			});
		},
		
		renderHotspot: function(point) {
			const self = this;
			const settings = this.getSettings();
			
			
			// Удаляем старую точку, если она существует
			this.annotationBox.find('.cw-hotspot-point[data-point-id="' + point.id + '"]').remove();
			
			const pointHtml = $('<div>')
				.attr('class', 'cw-hotspot-point')
				.attr('data-point-id', point.id)
				.css({
					position: 'absolute',
					left: point.x + '%',
					top: point.y + '%',
					transform: 'translate(-50%, -50%)'
				});
			
			// Используем глобальные настройки и иконку из точки
			const iconName = point.iconName || 'plus';
			const buttonStyle = settings.hotspotButtonStyle || 'btn-primary';
			const buttonSize = settings.hotspotButtonSize || 'btn-sm';
			const buttonShape = settings.hotspotButtonShape || 'btn-circle';
			
			
			// Разбиваем buttonShape на отдельные классы (может быть "btn-block rounded-0")
			const shapeClasses = buttonShape ? buttonShape.split(' ') : [];
			
			const button = $('<a>')
				.attr('href', '#')
				.attr('onclick', 'return false;') // Предотвращаем переход по ссылке
				.addClass('btn');
			
			// Добавляем классы формы
			shapeClasses.forEach(function(cls) {
				if (cls) button.addClass(cls);
			});
			
			// Добавляем стиль и размер
			button.addClass(buttonStyle);
			button.addClass(buttonSize);
			
			// Добавляем иконку
			const iconHtml = '<i class="uil uil-' + iconName + '"></i>';
			button.html(iconHtml);
			
			
			const editorControls = $('<div>')
				.attr('class', 'cw-hotspot-point-editor')
				.append(
					$('<button>')
						.attr('type', 'button')
						.attr('class', 'edit-btn')
						.html('<span class="dashicons dashicons-edit"></span>')
						.on('click', function(e) {
							e.stopPropagation();
							self.editPoint(point);
						}),
					$('<button>')
						.attr('type', 'button')
						.attr('class', 'delete-btn')
						.html('<span class="dashicons dashicons-trash"></span>')
						.on('click', function(e) {
							e.stopPropagation();
							self.deletePoint(point.id);
						})
				);
			
			pointHtml.append(button).append(editorControls);
			
		// Make draggable (make the point container draggable)
		pointHtml.draggable({
			containment: this.annotationBox,
			cursor: 'move',
				stop: function(event, ui) {
					const $img = self.mainImage;
					if (!$img.length) return;
					
					// Get image position and dimensions relative to annotation box
					const imgPosition = $img.position();
					const imgWidth = $img.width();
					const imgHeight = $img.height();
					
					// Get the actual visual center of the point using getBoundingClientRect
					// This accounts for the transform: translate(-50%, -50%)
					const pointRect = pointHtml[0].getBoundingClientRect();
					const annotationRect = self.annotationBox[0].getBoundingClientRect();
					
					// Calculate the visual center of the point relative to annotation box
					const pointCenterX = pointRect.left + (pointRect.width / 2) - annotationRect.left;
					const pointCenterY = pointRect.top + (pointRect.height / 2) - annotationRect.top;
					
					// Calculate position relative to image (accounting for image position within annotation box)
					const relativeLeft = pointCenterX - imgPosition.left;
					const relativeTop = pointCenterY - imgPosition.top;
					
					// Calculate percentage relative to image
					const x = (relativeLeft / imgWidth) * 100;
					const y = (relativeTop / imgHeight) * 100;
					
					
					point.x = Math.max(0, Math.min(100, x));
					point.y = Math.max(0, Math.min(100, y));
					
					
					// Don't update CSS here - let jQuery UI draggable manage the position
					// The coordinates are saved and will be applied on next render
					// Updating CSS here can conflict with draggable's position management
					
					self.saveHotspots();
				}
			});
			
			// Click to select
			pointHtml.on('click', function(e) {
				e.stopPropagation();
				self.selectPoint(point.id);
			});
			
			this.annotationBox.append(pointHtml);
		},
		
		
		selectPoint: function(pointId) {
			this.annotationBox.find('.cw-hotspot-point').removeClass('active');
			this.annotationBox.find('.cw-hotspot-point[data-point-id="' + pointId + '"]').addClass('active');
		},
		
		editPoint: function(point) {
			this.currentEditingPoint = point;
			this.showEditModal(point);
		},
		
		deletePoint: function(pointId) {
			if (confirm('Are you sure you want to delete this point?')) {
				this.hotspots = this.hotspots.filter(function(p) {
					return p.id !== pointId;
				});
				this.annotationBox.find('.cw-hotspot-point[data-point-id="' + pointId + '"]').remove();
				this.saveHotspots();
			}
		},
		
		showEditModal: function(point) {
			const modal = this.getOrCreateModal();
			const self = this;
			
			
			// ВАЖНО: Привязываем обработчики кнопок ПЕРЕД всеми асинхронными операциями
			// Save button - используем замыкание для сохранения ссылок на point и self
			const currentPoint = point; // Сохраняем ссылку на точку
			const $saveButton = $('#cw-hotspot-modal-save');
			const $cancelButton = $('#cw-hotspot-modal-cancel');
			
			
			if ($saveButton.length > 0 && $cancelButton.length > 0) {
				// Удаляем все предыдущие обработчики и добавляем новые
				$saveButton.off('click.hotspot-save');
				
				
				$saveButton.on('click.hotspot-save', function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					
					if (!currentPoint) {
						console.error('Point object is missing');
						modal.removeClass('active');
						return false;
					}
					
					const iconValue = $('#cw-hotspot-modal-icon').val();
					
					// Сохраняем данные из формы в объект точки
					currentPoint.title = $('#cw-hotspot-modal-title').val();
					currentPoint.content = $('#cw-hotspot-modal-content').val();
					currentPoint.link = $('#cw-hotspot-modal-link').val();
					currentPoint.linkTarget = $('#cw-hotspot-modal-link-target').val();
					currentPoint.iconName = iconValue || 'plus';
					currentPoint.contentType = $('#cw-hotspot-modal-content-type').val() || 'text';
					currentPoint.postId = $('#cw-hotspot-modal-post-id').val() || '';
					currentPoint.postType = $('#cw-hotspot-modal-post-type').val() || '';
					currentPoint.postTemplate = $('#cw-hotspot-modal-post-template').val() || 'default';
					currentPoint.popoverWidth = $('#cw-hotspot-modal-popover-width').val() || '';
					currentPoint.wrapperClass = $('#cw-hotspot-modal-wrapper-class').val() || '';
					
					
					// Re-render to update visual
					self.renderHotspots();
					self.saveHotspots();
					
					
					modal.removeClass('active');
					
					
					return false;
				});
				
				// Cancel button
				$cancelButton.off('click.hotspot-cancel');
				
				
				$cancelButton.on('click.hotspot-cancel', function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					
					modal.removeClass('active');
					
					
					return false;
				});
			} else {
				console.error('Save or Cancel button not found in DOM', {
					saveButton: $saveButton.length,
					cancelButton: $cancelButton.length,
					modal: modal.length
				});
			}
			
			// Загружаем данные точки
			$('#cw-hotspot-modal-title').val(point.title || '');
			$('#cw-hotspot-modal-content').val(point.content || '');
			$('#cw-hotspot-modal-link').val(point.link || '');
			$('#cw-hotspot-modal-link-target').val(point.linkTarget || '_self');
			$('#cw-hotspot-modal-popover-width').val(point.popoverWidth || '');
			$('#cw-hotspot-modal-wrapper-class').val(point.wrapperClass || '');
			
			// Устанавливаем тип контента
			const contentType = point.contentType || 'text';
			$('#cw-hotspot-modal-content-type').val(contentType);
			
			// Показываем/скрываем поля в зависимости от типа контента
			this.toggleContentTypeFields(contentType);
			
			// Устанавливаем значение иконки
			const iconName = point.iconName || 'plus';
			
			
			$('#cw-hotspot-modal-icon').val(iconName);
			this.updateIconPreview(iconName);
			
			
			// Initialize icon selector every time modal opens (needed to rebuild icon list)
			this.initIconSelector();
			
			// Initialize content type handler every time modal opens
			this.initContentTypeHandler();
			
			// Initialize post selector if not already loaded
			const $postTypeSelect = $('#cw-hotspot-modal-post-type');
			const $postSelect = $('#cw-hotspot-modal-post-id');
			const postsMapExists = $postTypeSelect.data('posts-map') !== undefined;
			
			
			// Инициализируем post selector только если данные еще не загружены
			if (!postsMapExists || $postTypeSelect.find('option').length <= 1) {
				// Загружаем данные асинхронно, затем устанавливаем значения
				this.initPostSelector().then(() => {
					// После загрузки данных устанавливаем сохраненные значения
					this.setPostDataInModal(point);
				});
			} else {
				// Данные уже загружены, сразу устанавливаем значения
				this.setPostDataInModal(point);
			}
			
			modal.addClass('active');
		},
		
		setPostDataInModal: function(point) {
			const self = this;
			
			
			// Устанавливаем тип поста и сам пост, если есть
			if (point.postId) {
				const postId = point.postId;
				const savedTemplate = point.postTemplate || 'default';
				const $postTypeSelect = $('#cw-hotspot-modal-post-type');
				const $postSelect = $('#cw-hotspot-modal-post-id');
				
				// Пробуем получить тип из сохраненных данных или загружаем
				if (point.postType) {
					const postType = point.postType;
					
					// Устанавливаем тип поста БЕЗ trigger('change'), чтобы не сбросить список постов
					$postTypeSelect.val(postType);
					
					// Вручную заполняем список постов для выбранного типа
					const postsMap = $postTypeSelect.data('posts-map');
					if (postsMap && postsMap[postType]) {
						// Очищаем список постов
						$postSelect.empty();
						
						// Добавляем опцию по умолчанию
						const defaultOption = document.createElement('option');
						defaultOption.value = '';
						defaultOption.textContent = cwHotspotAdmin.i18n.selectPostPlaceholder || '-- Select Post --';
						$postSelect.append(defaultOption);
						
						// Заполняем постами выбранного типа
						postsMap[postType].posts.forEach(function(post) {
							const option = document.createElement('option');
							option.value = post.id;
							option.textContent = post.title;
							option.setAttribute('data-post-type', post.type);
							$postSelect.append(option);
						});
						
						// Активируем select
						$postSelect.prop('disabled', false);
						
						// Устанавливаем выбранный пост
						$postSelect.val(postId);
					}
					
					// Загружаем шаблоны для этого типа
					this.loadTemplatesForPostType(postType).then(() => {
						// После загрузки шаблонов устанавливаем сохраненный шаблон
						setTimeout(() => {
							$('#cw-hotspot-modal-post-template').val(savedTemplate);
						}, 100);
					});
				} else {
					// Если тип не сохранен, загружаем данные поста
					this.loadPostType(postId).then(postType => {
						if (postType) {
							// Устанавливаем тип поста БЕЗ trigger('change')
							$postTypeSelect.val(postType);
							
							// Вручную заполняем список постов
							const postsMap = $postTypeSelect.data('posts-map');
							if (postsMap && postsMap[postType]) {
								$postSelect.empty();
								
								const defaultOption = document.createElement('option');
								defaultOption.value = '';
								defaultOption.textContent = cwHotspotAdmin.i18n.selectPostPlaceholder || '-- Select Post --';
								$postSelect.append(defaultOption);
								
								postsMap[postType].posts.forEach(function(post) {
									const option = document.createElement('option');
									option.value = post.id;
									option.textContent = post.title;
									option.setAttribute('data-post-type', post.type);
									$postSelect.append(option);
								});
								
								$postSelect.prop('disabled', false);
								$postSelect.val(postId);
							}
							
							// Загружаем шаблоны для этого типа
							this.loadTemplatesForPostType(postType).then(() => {
								setTimeout(() => {
									$('#cw-hotspot-modal-post-template').val(savedTemplate);
								}, 100);
							});
						}
					});
				}
			} else {
				// Если нет postId, очищаем поля
				$('#cw-hotspot-modal-post-type').val('');
				$('#cw-hotspot-modal-post-id').val('').prop('disabled', true);
				$('#cw-hotspot-modal-post-template').val('default');
			}
		},
		
		toggleContentTypeFields: function(contentType) {
			const $textField = $('.cw-content-type-text');
			const $postFields = $('.cw-content-type-post');
			
			if (contentType === 'text') {
				$textField.show();
				$postFields.hide();
			} else if (contentType === 'post') {
				$textField.hide();
				$postFields.show();
			} else if (contentType === 'hybrid') {
				$textField.show();
				$postFields.show();
			}
		},
		
		loadPostType: function(postId) {
			// Загружаем тип поста через AJAX
			const ajaxurl = (typeof fetch_vars !== 'undefined' && fetch_vars.ajaxurl) 
				? fetch_vars.ajaxurl 
				: (typeof cwHotspotAdmin !== 'undefined' && cwHotspotAdmin.ajaxurl)
					? cwHotspotAdmin.ajaxurl
					: '/wp-admin/admin-ajax.php';
			
			return fetch(ajaxurl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					action: 'get_post_type',
					post_id: postId
				})
			})
			.then(response => response.json())
			.then(result => {
				if (result.success && result.data) {
					return result.data.post_type;
				}
				return null;
			})
			.catch(error => {
				console.error('Failed to load post type:', error);
				return null;
			});
		},
		
		loadTemplatesForPostType: function(postType) {
			const self = this;
			const $templateSelect = $('#cw-hotspot-modal-post-template');
			const ajaxurl = (typeof fetch_vars !== 'undefined' && fetch_vars.ajaxurl) 
				? fetch_vars.ajaxurl 
				: (typeof cwHotspotAdmin !== 'undefined' && cwHotspotAdmin.ajaxurl)
					? cwHotspotAdmin.ajaxurl
					: '/wp-admin/admin-ajax.php';
			
			const formData = new FormData();
			formData.append('action', 'fetch_action');
			formData.append('actionType', 'getPostCardTemplates');
			formData.append('params', JSON.stringify({
				post_type: postType
			}));
			
			return fetch(ajaxurl, {
				method: 'POST',
				body: formData
			})
			.then(response => response.json())
			.then(function(result) {
				if (result.status === 'success' && result.data && result.data.templates) {
					// Очищаем select
					$templateSelect.empty();
					
					// Заполняем шаблонами
					result.data.templates.forEach(function(template) {
						const option = document.createElement('option');
						option.value = template.value;
						option.textContent = template.label;
						option.setAttribute('title', template.description || '');
						$templateSelect.append(option);
					});
					
					// Устанавливаем шаблон по умолчанию, если он не был выбран ранее
					const currentValue = $templateSelect.val();
					if (!currentValue || !result.data.templates.find(t => t.value === currentValue)) {
						$templateSelect.val(result.data.default_template);
					}
				}
			})
			.catch(function(error) {
				console.error('Failed to load templates:', error);
			});
		},
		
		getOrCreateModal: function() {
			let modal = $('#cw-hotspot-edit-modal');
			
			if (modal.length === 0) {
				modal = $('<div>')
					.attr('id', 'cw-hotspot-edit-modal')
					.attr('class', 'cw-hotspot-modal')
					.html(`
						<div class="cw-hotspot-modal-content">
							<div class="cw-hotspot-modal-header">
								<h2>${cwHotspotAdmin.i18n.editPoint}</h2>
								<button type="button" class="cw-hotspot-modal-close">&times;</button>
							</div>
							<div class="cw-hotspot-modal-body">
								<div class="form-field">
									<label for="cw-hotspot-modal-icon">${cwHotspotAdmin.i18n.selectIcon || 'Icon'}</label>
									<div class="cw-icon-select-wrapper">
										<input type="hidden" id="cw-hotspot-modal-icon" />
										<div class="cw-icon-select">
											<div class="cw-icon-select-selected" id="cw-icon-select-trigger">
												<span class="cw-icon-preview"><i class="uil uil-plus"></i></span>
												<span class="cw-icon-label">Select icon...</span>
												<span class="cw-icon-select-arrow">▼</span>
											</div>
											<div class="cw-icon-select-dropdown" id="cw-icon-select-dropdown">
												<div class="cw-icon-search">
													<input type="text" class="cw-icon-search-input" placeholder="${cwHotspotAdmin.i18n.searchIcon || 'Search icon...'}" />
												</div>
												<div class="cw-icon-list" id="cw-icon-list"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="form-field">
									<label for="cw-hotspot-modal-title">${cwHotspotAdmin.i18n.pointTitle}</label>
									<input type="text" id="cw-hotspot-modal-title" />
								</div>
								<div class="form-field">
									<label for="cw-hotspot-modal-content-type">${cwHotspotAdmin.i18n.contentType || 'Content Type'}</label>
									<select id="cw-hotspot-modal-content-type">
										<option value="text">${cwHotspotAdmin.i18n.contentTypeText || 'Text'}</option>
										<option value="post">${cwHotspotAdmin.i18n.contentTypePost || 'Post'}</option>
										<option value="hybrid">${cwHotspotAdmin.i18n.contentTypeHybrid || 'Hybrid (Text + Post)'}</option>
									</select>
								</div>
								<div class="form-field cw-content-type-field cw-content-type-text">
									<label for="cw-hotspot-modal-content">${cwHotspotAdmin.i18n.pointContent}</label>
									<textarea id="cw-hotspot-modal-content" rows="5"></textarea>
									<p class="description">${cwHotspotAdmin.i18n.contentTextDescription || 'Enter text or HTML content. This will be displayed instantly from a hidden element.'}</p>
								</div>
								<div class="form-field cw-content-type-field cw-content-type-post" style="display: none;">
									<label for="cw-hotspot-modal-post-type">${cwHotspotAdmin.i18n.selectPostType || 'Select Post Type'}</label>
									<select id="cw-hotspot-modal-post-type" style="width: 100%;">
										<option value="">${cwHotspotAdmin.i18n.selectPostTypePlaceholder || '-- Select Post Type --'}</option>
									</select>
									<p class="description">${cwHotspotAdmin.i18n.selectPostTypeDescription || 'First select the type of post (Post, Page, Client, etc.)'}</p>
								</div>
								<div class="form-field cw-content-type-field cw-content-type-post" style="display: none;">
									<label for="cw-hotspot-modal-post-id">${cwHotspotAdmin.i18n.selectPost || 'Select Post'}</label>
									<select id="cw-hotspot-modal-post-id" style="width: 100%;" disabled>
										<option value="">${cwHotspotAdmin.i18n.selectPostPlaceholder || '-- Select Post Type First --'}</option>
									</select>
									<p class="description">${cwHotspotAdmin.i18n.selectPostDescription || 'Post content will be loaded via AJAX when popover opens.'}</p>
								</div>
								<div class="form-field cw-content-type-field cw-content-type-post" style="display: none;">
									<label for="cw-hotspot-modal-post-template">${cwHotspotAdmin.i18n.postTemplate || 'Post Card Template'}</label>
									<select id="cw-hotspot-modal-post-template" style="width: 100%;">
										<option value="default">${cwHotspotAdmin.i18n.loadingTemplates || 'Loading templates...'}</option>
									</select>
									<p class="description">${cwHotspotAdmin.i18n.postTemplateDescription || 'Select the template to display the post card. Templates will be loaded after selecting post type.'}</p>
								</div>
								<div class="form-field">
									<label for="cw-hotspot-modal-link">${cwHotspotAdmin.i18n.pointLink}</label>
									<input type="text" id="cw-hotspot-modal-link" placeholder="https://..." />
								</div>
								<div class="form-field">
									<label for="cw-hotspot-modal-link-target">Link Target</label>
									<select id="cw-hotspot-modal-link-target">
										<option value="_self">Same Window</option>
										<option value="_blank">New Window</option>
									</select>
								</div>
								<div class="form-field">
									<label for="cw-hotspot-modal-popover-width">Popover Width</label>
									<input type="text" id="cw-hotspot-modal-popover-width" placeholder="e.g., 300px, 50%, auto" />
									<p class="description">Set custom width for this popover (e.g., 300px, 50%, auto). Leave empty for default width.</p>
								</div>
								<div class="form-field">
									<label for="cw-hotspot-modal-wrapper-class">Wrapper Class</label>
									<input type="text" id="cw-hotspot-modal-wrapper-class" placeholder="e.g., custom-wrapper, my-class" />
									<p class="description">Optional CSS class to wrap the popover content. If filled, content will be wrapped in a div with this class.</p>
								</div>
							</div>
							<div class="cw-hotspot-modal-footer">
								<button type="button" class="button" id="cw-hotspot-modal-cancel">${cwHotspotAdmin.i18n.cancel}</button>
								<button type="button" class="button button-primary" id="cw-hotspot-modal-save">${cwHotspotAdmin.i18n.save}</button>
							</div>
						</div>
					`);
				
				$('body').append(modal);
				
				// Close on X or backdrop click - используем namespace для избежания конфликтов
				modal.off('click.hotspot-backdrop');
				modal.on('click.hotspot-backdrop', function(e) {
					// Закрываем только при клике на backdrop или кнопку закрытия, но не на содержимое модального окна
					if ($(e.target).is('.cw-hotspot-modal') || $(e.target).is('.cw-hotspot-modal-close')) {
						modal.removeClass('active');
					}
				});
				
				// Обработчик для кнопки закрытия в header
				modal.find('.cw-hotspot-modal-close').off('click.hotspot-close');
				modal.find('.cw-hotspot-modal-close').on('click.hotspot-close', function(e) {
					e.preventDefault();
					e.stopPropagation();
					modal.removeClass('active');
					return false;
				});
				
				// Initialize icon selector
				this.initIconSelector();
				
				// Initialize content type handler (будет вызван при каждом открытии модального окна)
				// Initialize post selector (будет вызван при каждом открытии модального окна)
			}
			
			return modal;
		},
		
		initContentTypeHandler: function() {
			const self = this;
			const $contentType = $('#cw-hotspot-modal-content-type');
			
			$contentType.off('change').on('change', function() {
				const contentType = $(this).val();
				self.toggleContentTypeFields(contentType);
			});
		},
		
		initPostSelector: function() {
			const self = this;
			const $postTypeSelect = $('#cw-hotspot-modal-post-type');
			const $postSelect = $('#cw-hotspot-modal-post-id');
			
			// Если данные уже загружены, возвращаем resolved promise
			if ($postTypeSelect.data('posts-map') !== undefined && $postTypeSelect.find('option').length > 1) {
				return Promise.resolve();
			}
			
			// Используем Fetch систему темы для получения списка типов постов
			const ajaxurl = (typeof fetch_vars !== 'undefined' && fetch_vars.ajaxurl) 
				? fetch_vars.ajaxurl 
				: (typeof cwHotspotAdmin !== 'undefined' && cwHotspotAdmin.ajaxurl)
					? cwHotspotAdmin.ajaxurl
					: '/wp-admin/admin-ajax.php';
			
			const formData = new FormData();
			formData.append('action', 'fetch_action');
			formData.append('actionType', 'getPostsForHotspot');
			formData.append('params', JSON.stringify({}));
			
			return fetch(ajaxurl, {
				method: 'POST',
				body: formData
			})
			.then(response => response.json())
			.then(function(result) {
				if (result.status === 'success' && result.data && result.data.posts) {
					// Группируем по типам
					const postTypesMap = {};
					result.data.posts.forEach(function(post) {
						if (!postTypesMap[post.type]) {
							postTypesMap[post.type] = {
								label: post.type_label || post.type,
								posts: []
							};
						}
						postTypesMap[post.type].posts.push(post);
					});
					
					// Сохраняем данные для использования при выборе типа
					$postTypeSelect.data('posts-map', postTypesMap);
					
					// Заполняем первый select - типы постов
					Object.keys(postTypesMap).sort().forEach(function(postType) {
						const option = document.createElement('option');
						option.value = postType;
						option.textContent = postTypesMap[postType].label;
						$postTypeSelect.append(option);
					});
					
					// Обработчик изменения типа поста
					$postTypeSelect.off('change').on('change', function() {
						const selectedType = $(this).val();
						const postsMap = $postTypeSelect.data('posts-map');
						
						// Сохраняем текущее значение поста перед очисткой (если оно есть)
						const currentPostId = $postSelect.val();
						
						// Очищаем второй select и сбрасываем значение
						$postSelect.empty().prop('disabled', true).val('');
						
						// Загружаем шаблоны для выбранного типа
						if (selectedType) {
							self.loadTemplatesForPostType(selectedType).then(() => {
								// После загрузки шаблонов проверяем, подходит ли текущий шаблон
								const $templateSelect = $('#cw-hotspot-modal-post-template');
								const currentTemplate = $templateSelect.val();
								const availableTemplates = Array.from($templateSelect.find('option')).map(opt => opt.value);
								
								// Если текущий шаблон не доступен для нового типа, устанавливаем по умолчанию
								if (currentTemplate && !availableTemplates.includes(currentTemplate)) {
									const defaultTemplate = $templateSelect.find('option').first().val();
									$templateSelect.val(defaultTemplate);
								}
							});
						} else {
							// Если тип не выбран, очищаем шаблоны
							const $templateSelect = $('#cw-hotspot-modal-post-template');
							$templateSelect.empty();
							const defaultOption = document.createElement('option');
							defaultOption.value = 'default';
							defaultOption.textContent = 'Default';
							$templateSelect.append(defaultOption);
						}
						
						if (selectedType && postsMap && postsMap[selectedType]) {
							// Добавляем опцию по умолчанию
							const defaultOption = document.createElement('option');
							defaultOption.value = '';
							defaultOption.textContent = cwHotspotAdmin.i18n.selectPostPlaceholder || '-- Select Post --';
							$postSelect.append(defaultOption);
							
							// Заполняем постами выбранного типа
							postsMap[selectedType].posts.forEach(function(post) {
								const option = document.createElement('option');
								option.value = post.id;
								option.textContent = post.title;
								option.setAttribute('data-post-type', post.type);
								$postSelect.append(option);
							});
							
							// Активируем второй select
							$postSelect.prop('disabled', false);
							
							// Восстанавливаем выбранный пост, если он есть в новом списке
							if (currentPostId && $postSelect.find(`option[value="${currentPostId}"]`).length > 0) {
								$postSelect.val(currentPostId);
							}
						} else {
							// Если тип не выбран, показываем placeholder
							const placeholderOption = document.createElement('option');
							placeholderOption.value = '';
							placeholderOption.textContent = cwHotspotAdmin.i18n.selectPostTypePlaceholder || '-- Select Post Type First --';
							$postSelect.append(placeholderOption);
						}
					});
				}
			})
			.catch(function(error) {
				console.error('Failed to load post types:', error);
				return Promise.reject(error);
			});
		},
		
		initIconSelector: function() {
			const self = this;
			const icons = cwHotspotAdmin.icons || [];
			const $trigger = $('#cw-icon-select-trigger');
			const $dropdown = $('#cw-icon-select-dropdown');
			const $iconList = $('#cw-icon-list');
			const $iconInput = $('#cw-hotspot-modal-icon');
			const $searchInput = $('.cw-icon-search-input');
			
			// Build icon list
			function buildIconList(filter = '') {
				$iconList.empty();
				const term = filter.toLowerCase();
				
				const filteredIcons = icons.filter(function(icon) {
					return !term || icon.label.toLowerCase().includes(term) || icon.value.toLowerCase().includes(term);
				});
				
				// Add icons
				filteredIcons.forEach(function(icon) {
					const $item = $('<div>')
						.addClass('cw-icon-item')
						.attr('data-icon', icon.value)
						.html('<span class="cw-icon-item-icon"><i class="' + icon.class + '"></i></span><span class="cw-icon-item-label">' + icon.label + '</span>')
						.on('click', function(e) {
							e.stopPropagation();
							self.selectIcon(icon.value);
						});
					$iconList.append($item);
				});
			}
			
			// Toggle dropdown (remove old handlers first)
			$trigger.off('click').on('click', function(e) {
				e.stopPropagation();
				$dropdown.toggleClass('active');
				if ($dropdown.hasClass('active')) {
					buildIconList(''); // Rebuild list when opening
					$searchInput.val(''); // Clear search
					$searchInput.focus();
				}
			});
			
			// Search (remove old handlers first)
			$searchInput.off('input').on('input', function() {
				buildIconList($(this).val());
			});
			
			// Initial build
			buildIconList('');
			
			// Close dropdown on outside click
			$(document).on('click', function(e) {
				if (!$(e.target).closest('.cw-icon-select-wrapper').length) {
					$dropdown.removeClass('active');
				}
			});
			
			// Initial build
			buildIconList();
		},
		
		selectIcon: function(iconName) {
			const $iconInput = $('#cw-hotspot-modal-icon');
			const $trigger = $('#cw-icon-select-trigger');
			const $dropdown = $('#cw-icon-select-dropdown');
			const icons = cwHotspotAdmin.icons || [];
			
			
			const finalIconName = iconName || 'plus';
			$iconInput.val(finalIconName);
			this.updateIconPreview(finalIconName);
			
			
			$dropdown.removeClass('active');
		},
		
		updateIconPreview: function(iconName) {
			const $trigger = $('#cw-icon-select-trigger');
			const $preview = $trigger.find('.cw-icon-preview');
			const $label = $trigger.find('.cw-icon-label');
			const icons = cwHotspotAdmin.icons || [];
			
			const icon = icons.find(function(i) { return i.value === iconName; });
			if (icon) {
				$preview.html('<i class="' + icon.class + '"></i>');
				$label.text(icon.label);
			} else {
				$preview.html('<i class="uil uil-' + iconName + '"></i>');
				$label.text(iconName || 'Select icon...');
			}
		},
		
		getSettings: function() {
			const settingsData = $('#cw-hotspot-settings').val();
			if (settingsData) {
				try {
					return JSON.parse(settingsData);
				} catch (e) {
					console.error('Error parsing settings:', e);
				}
			}
			return {
				hotspotButtonStyle: 'btn-primary',
				hotspotButtonSize: 'btn-sm',
				hotspotButtonShape: 'btn-circle',
				popoverTrigger: 'click',
				popoverPlacement: 'auto'
			};
		},
		
		saveSettings: function() {
			const settings = {
				hotspotButtonStyle: $('#hotspot-button-style').val() || 'btn-primary',
				hotspotButtonSize: $('#hotspot-button-size').val() || 'btn-sm',
				hotspotButtonShape: $('#hotspot-button-shape').val() || 'btn-circle',
				popoverTrigger: $('#popover-trigger').val() || 'click',
				popoverPlacement: $('#popover-placement').val() || 'auto'
			};
			
			$('#cw-hotspot-settings').val(JSON.stringify(settings));
			
			// Re-render points with new settings
			this.renderHotspots();
		},
		
		saveHotspots: function() {
			$('#cw-hotspot-data').val(JSON.stringify(this.hotspots));
		}
	};

	// Initialize on document ready
	$(document).ready(function() {
		if ($('#cw-hotspot-annotation-box').length) {
			hotspotEditor.init();
		}
	});

})(jQuery);

