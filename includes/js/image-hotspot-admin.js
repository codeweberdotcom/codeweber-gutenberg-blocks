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
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:init',message:'Loading hotspot data from DB',data:{hotspotData:hotspotData,hotspotDataLength:hotspotData?hotspotData.length:0},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'K'})}).catch(()=>{});
			// #endregion
			
			if (hotspotData) {
				try {
					this.hotspots = JSON.parse(hotspotData);
					
					// #region agent log
					fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:init',message:'Hotspot data parsed',data:{hotspotsCount:this.hotspots.length,hotspots:JSON.stringify(this.hotspots)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'L'})}).catch(()=>{});
					// #endregion
					
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
				iconName: 'plus' // Иконка для точки (по умолчанию plus)
			};
			
			this.hotspots.push(point);
			this.renderHotspot(point);
			this.editPoint(point);
		},
		
		renderHotspots: function() {
			const self = this;
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:renderHotspots',message:'Rendering all hotspots',data:{hotspotsCount:this.hotspots.length,hotspots:JSON.stringify(this.hotspots)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'H'})}).catch(()=>{});
			// #endregion
			
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
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:renderHotspot',message:'Rendering hotspot point',data:{pointId:point.id,iconName:point.iconName,pointData:point},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
			// #endregion
			
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
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:renderHotspot',message:'Icon settings determined',data:{iconName:iconName,buttonStyle:buttonStyle,buttonSize:buttonSize,buttonShape:buttonShape},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
			// #endregion
			
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
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:renderHotspot',message:'Button HTML created',data:{iconHtml:iconHtml,iconName:iconName},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
			// #endregion
			
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
					const imgOffset = self.annotationBox.offset();
					const imgPosition = $img.position();
					const imgWidth = $img.width();
					const imgHeight = $img.height();
					
					// Calculate position relative to annotation box
					const annotationOffset = self.annotationBox.offset();
					const pointOffset = pointHtml.offset();
					
					// Calculate percentage relative to image
					// Account for the fact that point is centered with translate(-50%, -50%)
					const relativeLeft = pointOffset.left - annotationOffset.left - imgPosition.left;
					const relativeTop = pointOffset.top - annotationOffset.top - imgPosition.top;
					
					const x = (relativeLeft / imgWidth) * 100;
					const y = (relativeTop / imgHeight) * 100;
					
					point.x = Math.max(0, Math.min(100, x));
					point.y = Math.max(0, Math.min(100, y));
					
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
			
			$('#cw-hotspot-modal-title').val(point.title || '');
			$('#cw-hotspot-modal-content').val(point.content || '');
			$('#cw-hotspot-modal-link').val(point.link || '');
			$('#cw-hotspot-modal-link-target').val(point.linkTarget || '_self');
			
			// Устанавливаем значение иконки (единственное поле для точки)
			const iconName = point.iconName || 'plus';
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:showEditModal',message:'Loading point icon for edit',data:{pointId:point.id,pointIconName:point.iconName,iconName:iconName},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'I'})}).catch(()=>{});
			// #endregion
			
			$('#cw-hotspot-modal-icon').val(iconName);
			this.updateIconPreview(iconName);
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:showEditModal',message:'Icon input value after setting',data:{iconInputValue:$('#cw-hotspot-modal-icon').val()},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'J'})}).catch(()=>{});
			// #endregion
			
			modal.addClass('active');
			
			// Initialize icon selector every time modal opens (needed to rebuild icon list)
			this.initIconSelector();
			
			// Save button
			$('#cw-hotspot-modal-save').off('click').on('click', () => {
				const iconValue = $('#cw-hotspot-modal-icon').val();
				
				// #region agent log
				fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:save-point',message:'Saving point data',data:{pointId:point.id,iconValue:iconValue,iconInputValue:$('#cw-hotspot-modal-icon').val()},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
				// #endregion
				
				point.title = $('#cw-hotspot-modal-title').val();
				point.content = $('#cw-hotspot-modal-content').val();
				point.link = $('#cw-hotspot-modal-link').val();
				point.linkTarget = $('#cw-hotspot-modal-link-target').val();
				point.iconName = iconValue || 'plus';
				
				// #region agent log
				fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:save-point',message:'Point data after save',data:{pointId:point.id,pointIconName:point.iconName,fullPoint:JSON.stringify(point)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'E'})}).catch(()=>{});
				// #endregion
				
				// Re-render to update visual
				this.renderHotspots();
				this.saveHotspots();
				modal.removeClass('active');
			});
			
			// Cancel button
			$('#cw-hotspot-modal-cancel').off('click').on('click', () => {
				modal.removeClass('active');
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
									<label for="cw-hotspot-modal-content">${cwHotspotAdmin.i18n.pointContent}</label>
									<textarea id="cw-hotspot-modal-content"></textarea>
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
							</div>
							<div class="cw-hotspot-modal-footer">
								<button type="button" class="button" id="cw-hotspot-modal-cancel">${cwHotspotAdmin.i18n.cancel}</button>
								<button type="button" class="button button-primary" id="cw-hotspot-modal-save">${cwHotspotAdmin.i18n.save}</button>
							</div>
						</div>
					`);
				
				$('body').append(modal);
				
				// Close on X or backdrop click
				modal.on('click', function(e) {
					if ($(e.target).is('.cw-hotspot-modal') || $(e.target).is('.cw-hotspot-modal-close')) {
						modal.removeClass('active');
					}
				});
				
				// Initialize icon selector
				this.initIconSelector();
			}
			
			return modal;
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
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:selectIcon',message:'Icon selected',data:{iconName:iconName,iconInputValue:$iconInput.val()},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'F'})}).catch(()=>{});
			// #endregion
			
			const finalIconName = iconName || 'plus';
			$iconInput.val(finalIconName);
			this.updateIconPreview(finalIconName);
			
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'image-hotspot-admin.js:selectIcon',message:'Icon input value after setting',data:{iconInputValue:$iconInput.val()},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'G'})}).catch(()=>{});
			// #endregion
			
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

