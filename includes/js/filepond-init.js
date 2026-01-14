/**
 * FilePond Initialization
 *
 * Initializes FilePond for file input fields with data-filepond="true"
 *
 * @package CodeWeber Gutenberg Blocks
 */

(function () {
	'use strict';

	/**
	 * Initialize FilePond for file inputs
	 */
	function initFilePond() {
		// Check if FilePond is loaded
		if (typeof FilePond === 'undefined') {
			console.warn('FilePond library not loaded');
			return;
		}

		// Find all file inputs with data-filepond="true"
		const fileInputs = document.querySelectorAll(
			'input[type="file"][data-filepond="true"]'
		);

		if (fileInputs.length === 0) {
			return;
		}

		// Register FilePond plugins if needed
		// FilePond.registerPlugin(...);

		// Initialize FilePond for each input
		fileInputs.forEach(function (input) {
			// Skip if already initialized
			if (input.hasAttribute('data-filepond-initialized')) {
				return;
			}

			// Mark as initialized
			input.setAttribute('data-filepond-initialized', 'true');

			// Сохраняем оригинальный ID, так как FilePond может изменить его
			const originalInputId = input.id;

			// Helper to convert sizes like "10MB" to bytes
			function parseSizeToBytes(sizeStr) {
				if (!sizeStr || typeof sizeStr !== 'string') return null;
				const match = sizeStr
					.trim()
					.match(/^(\d+(?:\.\d+)?)(\s*(b|kb|mb|gb|tb))?$/i);
				if (!match) return null;
				const value = parseFloat(match[1]);
				const unit = (match[3] || 'b').toLowerCase();
				const multipliers = {
					b: 1,
					kb: 1024,
					mb: 1024 * 1024,
					gb: 1024 * 1024 * 1024,
					tb: 1024 * 1024 * 1024 * 1024,
				};
				return Math.round(value * (multipliers[unit] || 1));
			}

			// Проверяем стиль FilePond (Bootstrap для одиночных файлов или обычный для множественных)
			const filepondStyle = input.dataset.filepondStyle || 'default';
			const isBootstrapStyle = filepondStyle === 'bootstrap';

			// Get configuration from data attributes
			const config = {
				allowMultiple: input.hasAttribute('multiple'),
				credits: false, // Disable "Powered by PQINA" credit
				allowSyncAcceptAttribute: true, // Синхронизировать атрибут accept с внутренним input элементом
			};

			// Обработка acceptedFileTypes - преобразуем строку accept в массив для FilePond
			if (input.accept) {
				const acceptValue = input.accept.trim();

				if (acceptValue) {
					// Разбиваем по запятой, если есть несколько типов
					const types = acceptValue
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t);

					// Преобразуем каждый тип в формат, понятный FilePond
					const acceptedTypes = types.map((type) => {
						// Если это уже MIME-тип (содержит "/"), оставляем как есть
						if (type.includes('/')) {
							return type;
						}
						// Если это расширение без точки, добавляем точку
						if (!type.startsWith('.')) {
							return '.' + type.toLowerCase();
						}
						// Если уже с точкой, просто приводим к нижнему регистру
						return type.toLowerCase();
					});

					config.acceptedFileTypes = acceptedTypes;
				}
			}

			// Для Bootstrap стиля скрываем стандартный UI FilePond
			if (isBootstrapStyle) {
				config.stylePanelLayout = 'compact';
				config.stylePanelAspectRatio = '0';
				config.styleButtonRemoveItemPosition = 'left';
				config.styleButtonProcessItemPosition = 'right';
				config.styleLoadIndicatorPosition = 'right';
				config.styleProgressIndicatorPosition = 'right';
				config.styleButtonRemoveItemAlign = false;
			}

			// Add translations for FilePond labels
			var translations =
				typeof filepondSettings !== 'undefined' &&
				filepondSettings.translations
					? filepondSettings.translations
					: {};

			// Customize drop label text (can be overridden via data-label-idle attribute)
			if (input.dataset.labelIdle) {
				config.labelIdle = input.dataset.labelIdle;
			} else if (translations.labelIdle) {
				config.labelIdle = translations.labelIdle;
			} else {
				config.labelIdle =
					'Drag & drop your files or <span class="filepond--label-action">browse</span>';
			}

			if (translations.uploadComplete) {
				config.labelFileProcessingComplete =
					translations.uploadComplete;
			} else {
				config.labelFileProcessingComplete = 'Upload complete';
			}
			if (translations.tapToUndo) {
				config.labelTapToUndo = translations.tapToUndo;
			} else {
				config.labelTapToUndo = 'Tap to undo';
			}
			if (translations.uploading) {
				config.labelFileProcessing = translations.uploading;
			} else {
				config.labelFileProcessing = 'Uploading';
			}
			if (translations.tapToCancel) {
				config.labelTapToCancel = translations.tapToCancel;
			} else {
				config.labelTapToCancel = 'tap to cancel';
			}

			// Max files
			if (
				input.dataset.maxFiles &&
				parseInt(input.dataset.maxFiles) > 0
			) {
				config.maxFiles = parseInt(input.dataset.maxFiles);
			}

			// Max file size
			if (input.dataset.maxFileSize) {
				config.maxFileSize = input.dataset.maxFileSize;
			}

			// Max total file size
			if (input.dataset.maxTotalFileSize) {
				config.maxTotalFileSize = input.dataset.maxTotalFileSize;
			}

			// Precompute byte limits for custom validation
			const maxFileSizeBytes = input.dataset.maxFileSize
				? parseSizeToBytes(input.dataset.maxFileSize)
				: null;
			const maxTotalFileSizeBytes = input.dataset.maxTotalFileSize
				? parseSizeToBytes(input.dataset.maxTotalFileSize)
				: null;

			// Server configuration for instant upload
			if (
				typeof filepondSettings !== 'undefined' &&
				filepondSettings.uploadUrl
			) {
				config.server = {
					process: {
						url: filepondSettings.uploadUrl,
						method: 'POST',
						// Explicitly set field name for file upload
						name: 'filepond',
						headers: {
							'X-WP-Nonce': filepondSettings.nonce || '',
						},
						ondata: (formData) => {
							return formData;
						},
						onload: (response) => {
							// FilePond expects file ID as response
							try {
								const result =
									typeof response === 'string'
										? JSON.parse(response)
										: response;
								if (result && result.file && result.file.id) {
									return result.file.id;
								}
								// Fallback: try to extract ID from response
								if (
									result &&
									result.success &&
									result.file_id
								) {
									return result.file_id;
								}
								return response;
							} catch (e) {
								console.error(
									'FilePond: Error parsing upload response:',
									e,
									response
								);
								return response;
							}
						},
						onerror: (response) => {
							try {
								const error =
									typeof response === 'string'
										? JSON.parse(response)
										: response;
								return (
									error.message ||
									error.code ||
									'Upload failed'
								);
							} catch (e) {
								return response || 'Upload failed';
							}
						},
					},
					revert: (uniqueFileId, load, error) => {
						// Delete temp file when user removes it from FilePond
						if (
							typeof filepondSettings !== 'undefined' &&
							filepondSettings.uploadUrl &&
							uniqueFileId
						) {
							fetch(
								filepondSettings.uploadUrl + '/' + uniqueFileId,
								{
									method: 'DELETE',
									headers: {
										'X-WP-Nonce':
											filepondSettings.nonce || '',
									},
								}
							)
								.then((response) => {
									if (response.ok) {
										load();
									} else {
										error('Failed to delete file');
									}
								})
								.catch(() => {
									error('Failed to delete file');
								});
						} else {
							load();
						}
					},
				};
			}

			// Create FilePond instance
			try {
				const pond = FilePond.create(input, config);

				// Явно устанавливаем атрибут accept на внутреннем input элементе FilePond
				// Это нужно для фильтрации файлов в диалоге выбора браузера
				if (input.accept) {
					const acceptValue = input.accept;

					// Функция для установки атрибута accept
					const setAcceptAttribute = function (browserInput) {
						if (browserInput) {
							browserInput.setAttribute('accept', acceptValue);
							return true;
						}
						return false;
					};

					// Используем MutationObserver для отслеживания создания внутреннего input элемента
					const observer = new MutationObserver(function (mutations) {
						mutations.forEach(function (mutation) {
							mutation.addedNodes.forEach(function (node) {
								if (node.nodeType === 1) {
									// Element node
									// Проверяем, является ли это input элементом
									if (
										node.tagName === 'INPUT' &&
										node.type === 'file'
									) {
										if (setAcceptAttribute(node)) {
											observer.disconnect();
										}
									}
									// Также проверяем дочерние элементы
									const fileInput =
										node.querySelector &&
										node.querySelector(
											'input[type="file"]'
										);
									if (
										fileInput &&
										setAcceptAttribute(fileInput)
									) {
										observer.disconnect();
									}
								}
							});
						});
					});

					// Наблюдаем за document.body, так как FilePond может добавлять элементы в любое место
					if (document.body) {
						observer.observe(document.body, {
							childList: true,
							subtree: true,
						});
					}

					// Также пробуем установить через несколько попыток с задержками
					const trySetAccept = function (attempt) {
						attempt = attempt || 0;
						if (attempt > 10) {
							observer.disconnect();
							return;
						}

						// Пробуем найти input через разные способы
						let browserInput = null;

						// Способ 1: через pond.root
						if (pond.root) {
							browserInput =
								pond.root.querySelector('input[type="file"]');
						}

						// Способ 2: через поиск по aria-controls (FilePond использует это)
						if (!browserInput && input.id) {
							const ariaControls =
								'filepond--assistant-' +
								input.id.replace(/^field-/, '');
							browserInput = document.querySelector(
								'input[aria-controls="' + ariaControls + '"]'
							);
						}

						// Способ 3: через поиск по классу filepond--browser
						if (!browserInput) {
							browserInput =
								document.querySelector('.filepond--browser');
						}

						// Способ 4: через поиск input с ID, содержащим "filepond--browser"
						if (!browserInput) {
							browserInput = document.querySelector(
								'input[id^="filepond--browser"]'
							);
						}

						if (browserInput && setAcceptAttribute(browserInput)) {
							observer.disconnect();
						} else {
							setTimeout(function () {
								trySetAccept(attempt + 1);
							}, 100);
						}
					};

					// Начинаем попытки
					trySetAccept(0);

					// Останавливаем observer через 2 секунды, если не нашли
					setTimeout(function () {
						observer.disconnect();
					}, 2000);
				}

				// Helper function to show alert message под полем FilePond
				function showAlertMessage(message, type) {
					type = type || 'warning'; // warning, danger, info, success

					// Get translations if available
					const translations =
						typeof filepondSettings !== 'undefined' &&
						filepondSettings.translations
							? filepondSettings.translations
							: {};

					// Determine alert class and icon based on type
					let alertClass = 'alert-dark';
					let iconClass = 'uil uil-info-circle';
					if (type === 'danger') {
						alertClass = 'alert-danger';
						iconClass = 'uil uil-times-circle';
					} else if (type === 'success') {
						alertClass = 'alert-success';
						iconClass = 'uil uil-check-circle';
					} else if (type === 'info') {
						alertClass = 'alert-info';
						iconClass = 'uil uil-exclamation-circle';
					} else if (type === 'warning') {
						alertClass = 'alert-warning';
						iconClass = 'uil uil-exclamation-triangle';
					}

					// Находим контейнер для сообщений под полем FilePond
					let messageContainer = null;
					// Используем оригинальный ID input (FilePond может изменить ID)
					const containerId = 'filepond-message-' + originalInputId;
					messageContainer = document.getElementById(containerId);

					// Если контейнера нет, ищем FilePond root и создаем контейнер
					if (!messageContainer) {
						// Пробуем разные способы найти FilePond root
						let pondRoot = null;

						// Способ 1: через pond.root (если доступен)
						if (pond && pond.root) {
							pondRoot = pond.root;
						}

						// Способ 2: через поиск по оригинальному ID
						if (!pondRoot && originalInputId) {
							// FilePond создает root с ID, который может быть основан на оригинальном ID
							pondRoot =
								document.querySelector(
									'#' + originalInputId + '.filepond--root'
								) ||
								document.querySelector('#' + originalInputId);

							// Если не нашли по ID, ищем ближайший .filepond--root
							if (!pondRoot) {
								const originalInput =
									document.getElementById(originalInputId);
								if (originalInput) {
									pondRoot =
										originalInput.closest(
											'.filepond--root'
										);
								}
							}
						}

						// Способ 3: через поиск по input элементу (FilePond может изменить его ID)
						if (!pondRoot && input) {
							pondRoot = input.closest('.filepond--root');
						}

						// Способ 4: через поиск по родительскому элементу
						if (!pondRoot && input && input.parentElement) {
							pondRoot =
								input.parentElement.querySelector(
									'.filepond--root'
								);
						}

						// Если нашли root, создаем контейнер
						if (pondRoot && pondRoot.parentElement) {
							messageContainer = document.createElement('div');
							messageContainer.id = containerId;
							messageContainer.className =
								'filepond-message-container mt-2';
							// Вставляем контейнер после FilePond root
							if (pondRoot.nextSibling) {
								pondRoot.parentElement.insertBefore(
									messageContainer,
									pondRoot.nextSibling
								);
							} else {
								pondRoot.parentElement.appendChild(
									messageContainer
								);
							}
						} else {
							console.warn(
								'FilePond: Could not find pondRoot or parentElement for',
								originalInputId,
								{
									pondRoot: pondRoot,
									hasParent: pondRoot
										? !!pondRoot.parentElement
										: false,
								}
							);
						}
					}

					// Если все еще нет контейнера (fallback), используем старый способ
					if (!messageContainer) {
						console.warn(
							'FilePond: Using fallback global alert container for',
							originalInputId
						);
						let alertContainer =
							document.getElementById('cw-alert-container');
						if (!alertContainer) {
							alertContainer = document.createElement('div');
							alertContainer.id = 'cw-alert-container';
							alertContainer.className =
								'position-fixed top-0 end-0 p-3 cw-alert-container';
							alertContainer.style.zIndex = '1090';
							alertContainer.style.maxWidth = '400px';
							document.body.appendChild(alertContainer);
						}
						messageContainer = alertContainer;
					}

					// Удаляем предыдущие сообщения для этого поля (чтобы показывать только последнее)
					const existingAlerts = messageContainer.querySelectorAll(
						'.filepond-alert-message'
					);
					existingAlerts.forEach((alert) => alert.remove());

					// Create alert element
					const alertElement = document.createElement('div');
					alertElement.className =
						'alert ' +
						alertClass +
						' alert-icon alert-dismissible fade show filepond-alert-message';
					alertElement.setAttribute('role', 'alert');

					alertElement.innerHTML =
						'<i class="' +
						iconClass +
						'"></i> ' +
						message +
						'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

					messageContainer.appendChild(alertElement);

					// Auto-remove after 5 seconds
					setTimeout(function () {
						if (alertElement && alertElement.parentElement) {
							alertElement.classList.remove('show');
							setTimeout(function () {
								if (
									alertElement &&
									alertElement.parentElement
								) {
									alertElement.remove();
								}
							}, 150); // Wait for fade animation
						}
					}, 5000);
				}

				// Add error handler to show validation messages
				pond.on('warning', function (error, file) {
					console.warn('FilePond warning:', error, file);
					var message = '';
					var translations =
						typeof filepondSettings !== 'undefined' &&
						filepondSettings.translations
							? filepondSettings.translations
							: {};
					if (error && error.body) {
						if (error.body === 'Max files') {
							message = translations.maxFiles
								? translations.maxFiles.replace(
										'%s',
										config.maxFiles || 5
									)
								: 'Максимальное количество файлов: ' +
									(config.maxFiles || 5) +
									'. Пожалуйста, удалите лишние файлы.';
						} else if (error.body === 'File is too large') {
							message = translations.fileTooLarge
								? translations.fileTooLarge.replace(
										'%s',
										config.maxFileSize || '10MB'
									)
								: 'Файл слишком большой. Максимальный размер: ' +
									(config.maxFileSize || '10MB');
						} else if (error.body === 'Total file size too large') {
							message = translations.totalSizeTooLarge
								? translations.totalSizeTooLarge.replace(
										'%s',
										config.maxTotalFileSize || '100MB'
									)
								: 'Общий размер файлов слишком большой. Максимум: ' +
									(config.maxTotalFileSize || '100MB');
						} else {
							message = error.body;
						}
						showAlertMessage(message, 'warning');
					}
				});

				pond.on('error', function (error, file) {
					console.error('FilePond error:', error, file);
					var translations =
						typeof filepondSettings !== 'undefined' &&
						filepondSettings.translations
							? filepondSettings.translations
							: {};
					var message =
						translations.errorUploading ||
						'Ошибка при загрузке файла';
					if (error && error.body) {
						message = error.body;
					}
					showAlertMessage(message, 'danger');
				});

				// Handle file validation and show messages
				pond.on('addfile', function (error, file) {
					// Кастомная валидация типов файлов (если плагин FilePondPluginFileValidateType не загружен)
					if (
						!error &&
						file &&
						config.acceptedFileTypes &&
						config.acceptedFileTypes.length > 0
					) {
						const fileExtension = file.filename
							? (file.filename.match(/\.[0-9a-z]+$/i) ||
									[])[0]?.toLowerCase()
							: null;
						const fileMimeType = file.fileType || file.file?.type;

						let isValidType = false;

						// Проверяем по расширению файла
						if (fileExtension) {
							isValidType = config.acceptedFileTypes.some(
								(acceptedType) => {
									// Если acceptedType - это расширение (начинается с точки)
									if (acceptedType.startsWith('.')) {
										return (
											acceptedType.toLowerCase() ===
											fileExtension
										);
									}
									// Если acceptedType - это MIME-тип
									if (acceptedType.includes('/')) {
										return (
											fileMimeType &&
											fileMimeType === acceptedType
										);
									}
									return false;
								}
							);
						}

						// Если тип не подходит, удаляем файл и показываем ошибку
						if (!isValidType) {
							pond.removeFile(file);
							var translations =
								typeof filepondSettings !== 'undefined' &&
								filepondSettings.translations
									? filepondSettings.translations
									: {};
							var acceptedTypesStr =
								config.acceptedFileTypes.join(', ');
							var errorMessage = translations.invalidFileType
								? translations.invalidFileType.replace(
										'%s',
										acceptedTypesStr
									)
								: 'Неподдерживаемый тип файла. Разрешенные типы: ' +
									acceptedTypesStr;

							showAlertMessage(errorMessage, 'warning');
							return;
						}
					}

					if (error) {
						console.error('FilePond: Error adding file:', error);
						// Show message for validation errors
						var errorMessage = '';
						if (error && error.body) {
							var translations =
								typeof filepondSettings !== 'undefined' &&
								filepondSettings.translations
									? filepondSettings.translations
									: {};
							if (error.body === 'Max files') {
								errorMessage = translations.maxFiles
									? translations.maxFiles.replace(
											'%s',
											config.maxFiles || 5
										)
									: 'Максимальное количество файлов: ' +
										(config.maxFiles || 5);
							} else if (
								error.body === 'File is too large' ||
								error.body === 'File too large'
							) {
								errorMessage = translations.fileTooLarge
									? translations.fileTooLarge.replace(
											'%s',
											config.maxFileSize || '10MB'
										)
									: 'Файл слишком большой. Максимальный размер: ' +
										(config.maxFileSize || '10MB');
							} else if (
								error.body === 'Total file size too large'
							) {
								errorMessage = translations.totalSizeTooLarge
									? translations.totalSizeTooLarge.replace(
											'%s',
											config.maxTotalFileSize || '100MB'
										)
									: 'Общий размер файлов слишком большой. Максимум: ' +
										(config.maxTotalFileSize || '100MB');
							} else if (
								error.body === 'Invalid file type' ||
								error.body === 'File type not allowed'
							) {
								// Обработка ошибки неподдерживаемого типа файла
								var acceptedTypesStr = config.acceptedFileTypes
									? config.acceptedFileTypes.join(', ')
									: '';
								errorMessage = translations.invalidFileType
									? translations.invalidFileType.replace(
											'%s',
											acceptedTypesStr
										)
									: 'Неподдерживаемый тип файла. Разрешенные типы: ' +
										acceptedTypesStr;
							} else {
								errorMessage = error.body;
							}
						} else {
							var translations =
								typeof filepondSettings !== 'undefined' &&
								filepondSettings.translations
									? filepondSettings.translations
									: {};
							errorMessage =
								translations.errorAddingFile ||
								'Ошибка при добавлении файла';
						}
						showAlertMessage(errorMessage, 'warning');
						return;
					}

					if (!file) {
						return;
					}

					// Check single file size - FilePond file object has fileSize property
					if (maxFileSizeBytes && file.fileSize) {
						if (file.fileSize > maxFileSizeBytes) {
							pond.removeFile(file);
							var translations =
								typeof filepondSettings !== 'undefined' &&
								filepondSettings.translations
									? filepondSettings.translations
									: {};
							var msg = translations.fileTooLarge
								? translations.fileTooLarge.replace(
										'%s',
										config.maxFileSize || '10MB'
									)
								: 'Файл слишком большой. Максимальный размер: ' +
									(config.maxFileSize || '10MB');
							showAlertMessage(msg, 'warning');
							return;
						}
					}

					// Check total size after a short delay to ensure all files are processed
					if (maxTotalFileSizeBytes) {
						setTimeout(function () {
							var currentFiles = pond.getFiles();
							var totalSize = currentFiles.reduce(function (
								sum,
								f
							) {
								return sum + (f.fileSize || 0);
							}, 0);
							if (totalSize > maxTotalFileSizeBytes) {
								pond.removeFile(file);
								var msg =
									typeof filepondSettings !== 'undefined' &&
									filepondSettings.translations &&
									filepondSettings.translations
										.totalSizeExceeded
										? filepondSettings.translations.totalSizeExceeded.replace(
												'%s',
												config.maxTotalFileSize ||
													'100MB'
											)
										: 'Общий размер файлов превышен. Максимум: ' +
											(config.maxTotalFileSize ||
												'100MB');
								showAlertMessage(msg, 'warning');
							}
						}, 100);
					}

					// Check max files limit after file is added
					if (config.maxFiles) {
						setTimeout(function () {
							var currentFiles = pond.getFiles();
							if (currentFiles.length > config.maxFiles) {
								// Remove files beyond the limit (keep only the first maxFiles files)
								var filesToRemove = currentFiles.slice(
									config.maxFiles
								);
								var removedCount = filesToRemove.length;
								filesToRemove.forEach(function (fileToRemove) {
									pond.removeFile(fileToRemove);
								});
								console.warn(
									'FilePond: Max files limit reached (' +
										config.maxFiles +
										'). Removed excess files.'
								);
								var msg =
									typeof filepondSettings !== 'undefined' &&
									filepondSettings.translations &&
									filepondSettings.translations.filesRemoved
										? filepondSettings.translations.filesRemoved
												.replace('%s', config.maxFiles)
												.replace('%s', removedCount)
										: 'Максимальное количество файлов: ' +
											config.maxFiles +
											'. Удалено файлов: ' +
											removedCount;
								showAlertMessage(msg, 'warning');
							}
						}, 100);
					}
				});

				// Store reference for cleanup if needed
				input.filepondInstance = pond;

				// Store file IDs in data attribute for form submission
				pond.on('processfile', function (error, file) {
					if (!error && file && file.serverId) {
						// File successfully uploaded, serverId contains file ID
						var currentIds = input.dataset.fileIds
							? input.dataset.fileIds.split(',')
							: [];
						if (currentIds.indexOf(file.serverId) === -1) {
							currentIds.push(file.serverId);
							input.dataset.fileIds = currentIds.join(',');
						}
					}
				});
			} catch (error) {
				console.error(
					'FilePond: Error initializing for input #' + input.id + ':',
					error
				);
			}
		});
	}

	/**
	 * Initialize on DOM ready
	 * Wait for FilePond to be loaded
	 */
	function waitForFilePond() {
		if (typeof FilePond !== 'undefined') {
			initFilePond();
		} else {
			// Retry after a short delay
			setTimeout(waitForFilePond, 100);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', waitForFilePond);
	} else {
		waitForFilePond();
	}

	// Re-initialize for dynamically loaded content (e.g., modals, AJAX)
	// Listen for custom event or use MutationObserver
	const observer = new MutationObserver(function (mutations) {
		let shouldReinit = false;
		mutations.forEach(function (mutation) {
			if (mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach(function (node) {
					if (node.nodeType === 1) {
						// Element node
						if (
							node.matches &&
							node.matches(
								'input[type="file"][data-filepond="true"]'
							)
						) {
							shouldReinit = true;
						} else if (
							node.querySelector &&
							node.querySelector(
								'input[type="file"][data-filepond="true"]'
							)
						) {
							shouldReinit = true;
						}
					}
				});
			}
		});
		if (shouldReinit) {
			initFilePond();
		}
	});

	// Observe document body for changes
	if (document.body) {
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// Also listen for modal events (Bootstrap)
	document.addEventListener('shown.bs.modal', function () {
		initFilePond();
	});

	// Export initFilePond globally for re-initialization after form submission
	window.initFilePond = initFilePond;
})();
