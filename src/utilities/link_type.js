import { __ } from '@wordpress/i18n';
import {
	SelectControl,
	TextControl,
	Button,
	PanelBody,
} from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { VideoURLControl } from '../components/video-url/VideoURLControl';
import { parseVKVideoURL, parseRutubeVideoURL } from './videoUrlParsers';

export const LinkTypeSelector = ({ attributes, setAttributes }) => {
	const {
		LinkType,
		LinkUrl,
		PostId,
		PageId,
		CF7ID,
		ModalID,
		HtmlID,
		PhoneType, // Добавляем PhoneType к атрибутам
		PhoneNumber,
		YoutubeID,
		VimeoID,
		RutubeID,
		DocumentID,
		VKID,
		ButtonType,
		LeftIcon,
		DataGlightbox,
		DataGallery,
		DataBsToggle,
		DataBsTarget,
		DataGlightboxTitle,
	} = attributes;

	// Состояния для хранения списка постов, страниц, модальных окон, HTML и форм CF7 и телефонов
	const [posts, setPosts] = useState([]);
	const [pages, setPages] = useState([]);
	const [cf7Forms, setCf7Forms] = useState([]);
	const [modals, setModals] = useState([]);
	const [htmlPosts, setHtmlPosts] = useState([]);
	const [documentPosts, setDocumentPosts] = useState([]);
	const [isLoadingCF7, setIsLoadingCF7] = useState(true);
	const [phones, setPhones] = useState([]);

	// Получаем базовый URL сайта с использованием глобальной переменной WordPress
	const sitelinkurl = wpApiSettings.root.replace('/wp-json/', '');

	// Функция для загрузки телефонов
	const fetchPhoneNumbers = async () => {
		const response = await fetch(`${sitelinkurl}/wp-json/wp/v2/options`);
		const data = await response.json();
		const phoneNumbers = data.phones || {};
		const phoneOptions = Object.entries(phoneNumbers).map(
			([id, phone]) => ({
				label: phone,
				value: phone,
			})
		);
		setPhones(phoneOptions);
	};

	// Загрузка постов, страниц, модальных окон и HTML с использованием WordPress REST API
	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch(`${wpApiSettings.root}wp/v2/posts`);
			const data = await response.json();
			setPosts(data);
		};

		const fetchPages = async () => {
			const response = await fetch(`${wpApiSettings.root}wp/v2/pages`);
			const data = await response.json();
			setPages(data);
		};

		const fetchCF7Forms = async () => {
			const response = await fetch(
				`${sitelinkurl}/wp-json/wp/v2/options`
			);
			const data = await response.json();
			const forms = data.cf7_forms || {}; // Получаем объект с формами
			const formOptions = Object.entries(forms).map(([id, title]) => ({
				label: `${id}: ${title}`,
				value: id,
			}));
			setCf7Forms(formOptions);

			if (formOptions.length === 1) {
				setAttributes({ CF7ID: formOptions[0].value });
			}

			setIsLoadingCF7(false);
		};

		const fetchModals = async () => {
			const response = await fetch(`${wpApiSettings.root}wp/v2/modal`);
			const data = await response.json();
			setModals(data);
		};

		const fetchHtmlPosts = async () => {
			const response = await fetch(`${wpApiSettings.root}wp/v2/html`);
			const data = await response.json();
			setHtmlPosts(data);
		};

		const fetchDocumentPosts = async () => {
			const response = await fetch(
				`${wpApiSettings.root}wp/v2/documents`
			);
			const data = await response.json();
			setDocumentPosts(data);
		};

		// Загрузка данных в зависимости от типа ссылки
		if (LinkType === 'post') {
			fetchPosts();
		} else if (LinkType === 'page') {
			fetchPages();
		} else if (LinkType === 'cf7') {
			fetchCF7Forms();
		} else if (LinkType === 'modal') {
			fetchModals();
		} else if (LinkType === 'html') {
			fetchHtmlPosts();
		} else if (LinkType === 'phone') {
			fetchPhoneNumbers();
		} else if (LinkType === 'document') {
			fetchDocumentPosts();
		}


	}, [LinkType,  sitelinkurl]);

	// Автоматический выбор первого модального окна, если ModalID пустой
	useEffect(() => {
		if (LinkType === 'modal' && modals.length > 0 && !ModalID) {
			setAttributes({
				ModalID: modals[0].id,
				DataValue: `modal-${modals[0].id}`,
				LinkUrl: 'javascript:void(0)',
				DataBsToggle: 'modal',
				DataBsTarget: 'modal',
			});
		}
	}, [modals, ModalID, LinkType, setAttributes]);

	// Функция для обработки изменения файла
  const handleFileSelect = (media) => {
    if (media && media.url) {
      setAttributes({
        LinkUrl: media.url, // Сохраняем URL выбранного файла
      });
    }
  };


	const handleLinkTypeChange = (newLinkType) => {
		setAttributes({ LinkType: newLinkType });
		if (newLinkType === 'external') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				DocumentID: '',
				DataGlightbox: '',
				DataGallery: '',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'phone') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: 'custom',
				DataValue: '',
				DocumentID: '',
				DataGlightbox: '',
				DataGallery: '',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'post') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				DataValue: '',
				DocumentID: '',
				DataGlightbox: '',
				DataGallery: '',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'page') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				DataValue: '',
				DocumentID: '',
				DataGlightbox: '',
				DataGallery: '',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'cf7') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				DataValue: '',
				DocumentID: '',
				DataGlightbox: '',
				DataGallery: '',
				DataBsToggle: 'modal',
				DataBsTarget: 'modal',
			});
		} else if (newLinkType === 'modal') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				DataValue: '',
				DocumentID: '',
				DataGlightbox: '',
				DataGallery: '',
				DataBsToggle: 'modal',
				DataBsTarget: 'modal',
			});
		} else if (newLinkType === 'html') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				DataValue: '',
				DocumentID: '',
				DataGlightbox: '',
				DataGallery: '',
				DataBsToggle: 'modal',
				DataBsTarget: 'modal',
			});
		} else if (newLinkType === 'youtube') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				DataGlightbox: 'youtube',
				DataGallery: 'youtube',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'vimeo') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				DataGlightbox: 'vimeo',
				DataGallery: 'vimeo',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'rutube') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				DataGlightbox: 'video',
				DataGallery: '',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'vk') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				DataGlightbox: 'video',
				DataGallery: '',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'document') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				DataGlightbox: '',
				DataGallery: 'document',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'pdf') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				DataGlightbox: 'height: 100vh',
				DataGallery: 'pdf',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'image') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				DataGlightbox: 'image',
				DataGallery: 'image',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'html5video') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				DataGlightbox: 'html5video',
				DataGallery: 'html5video',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		}
	};

	const handlePhoneTypeChange = (newPhoneType) => {
		setAttributes({ PhoneType: newPhoneType });
		if (newPhoneType === 'contacts') {
			fetchPhoneNumbers(); // Загрузка телефонов при выборе "Contacts"
		}
	};

	const handleLinkUrlChange = (newLinkUrl) => {
		if (PhoneType === 'custom') {
			// Проверяем и добавляем "tel:" только если его еще нет
			const formattedLinkUrl = newLinkUrl.startsWith('tel:')
				? newLinkUrl
				: `tel:${newLinkUrl}`;
			setAttributes({ LinkUrl: formattedLinkUrl });
		} else {
			setAttributes({ LinkUrl: newLinkUrl });
		}
	};

	const handlePostSelect = (selectedPostId) => {
		setAttributes({ PostId: selectedPostId });
		const selectedPost = posts.find(
			(post) => post.id === parseInt(selectedPostId)
		);
		if (selectedPost) {
			setAttributes({ LinkUrl: selectedPost.link });
		}
	};

	const handlePageSelect = (selectedPageId) => {
		setAttributes({ PageId: selectedPageId });
		const selectedPage = pages.find(
			(page) => page.id === parseInt(selectedPageId)
		);
		if (selectedPage) {
			setAttributes({ LinkUrl: selectedPage.link });
		}
	};

const handleCF7Select = (selectedCF7Id) => {
	setAttributes({
		CF7ID: selectedCF7Id,
		DataValue: `cf7-${selectedCF7Id}`,
		LinkUrl: 'javascript:void(0)',
		DataBsToggle: 'modal',
		DataBsTarget: `modal`,
	});
};

const handleModalSelect = (selectedModalId) => {
	setAttributes({
		ModalID: selectedModalId,
		DataValue: `modal-${selectedModalId}`,
		LinkUrl: 'javascript:void(0)',
		DataBsToggle: 'modal',
		DataBsTarget: `modal`,
	});
};

const handleHtmlSelect = (selectedHtmlId) => {
  setAttributes({
    HtmlID: selectedHtmlId,
    DataValue: `html-${selectedHtmlId}`,
    LinkUrl: 'javascript:void(0)',
    DataBsToggle: 'modal',
    DataBsTarget: `modal`,
  });
};

const handleDocumentSelect = async (selectedDocumentId) => {
	setAttributes({ DocumentID: selectedDocumentId });

	try {
		// Отправляем запрос к REST API
		const response = await fetch(
			`${wpApiSettings.root}wp/v2/documents/${selectedDocumentId}`
		);
		if (!response.ok) {
			throw new Error(`Ошибка HTTP: ${response.status}`);
		}
		const documentData = await response.json();
		const fileUrl = documentData.meta?._new_documents_file || '';
		setAttributes({
			DataValue: `doc-${selectedDocumentId}`,
			LinkUrl: fileUrl || 'javascript:void(0)',
		});
	} catch (error) {
		console.error(error);
	}
};

	const handleYoutubeIDChange = (newYoutubeID) => {
		setAttributes({
			YoutubeID: newYoutubeID,
			LinkUrl: newYoutubeID,
			DataGlightbox: `youtube`,
		});
	};


	const handleVimeoIDChange = (newVimeoID) => {
		setAttributes({
			VimeoID: newVimeoID,
			LinkUrl: newVimeoID,
			DataGlightbox: `vimeo`,
		});
	};

	const handleRutubeIDChange = (url, metadata = {}) => {
		const videoId = metadata.videoId || '';
		
		// Generate unique gallery ID for this Rutube video instance
		const uniqueGalleryId = `rutube_${videoId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		setAttributes({
			RutubeID: url,
			LinkUrl: url || 'javascript:void(0)',
			DataValue: url ? `rutube-${url}` : '',
			DataGallery: uniqueGalleryId,
			// Use iframe type with proper width for Rutube
			DataGlightbox: url ? 'type: iframe; width: 90vw; height: 90vh;' : 'video',
		});
	};

	const handleVKIDChange = (url, metadata = {}) => {
		const { oid, id } = metadata;
		
		// Generate unique gallery ID for this VK video instance
		const uniqueGalleryId = `vk_${id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		setAttributes({
			VKID: url,
			LinkUrl: url || 'javascript:void(0)',
			DataValue: url ? `vkvideo-${url}` : '',
			DataGallery: uniqueGalleryId,
			// Use iframe type with proper width for VK
			DataGlightbox: url ? 'type: iframe; width: 90vw; height: 90vh;' : 'video',
		});
	};

	const handlePdfChange = (newPDFlink) => {
		setAttributes({
			LinkUrl: newPDFlink,
			DataGlightbox: 'height: 100vh',
			DataGallery: 'pdf',
		});
	};

	const handleImageChange = (newValue) => {
		setAttributes({
			LinkUrl: newValue,
			DataGlightbox: 'image',
			DataGallery: 'image',
		});
	};

	const handleImageSelect = (media) => {
		setAttributes({
			LinkUrl: media.url,
			DataGlightbox: 'image',
			DataGallery: 'image',
		});
	};

const handleGalleryID = (newValue) => {
	setAttributes({ DataGallery: newValue || '' }); // Сохраняем введенное значение в DataGallery
};

const handleHtml5VideoSelect = (media) => {
	if (media && media.url) {
		setAttributes({ LinkUrl: media.url }); // Сохраняем URL выбранного видео
	} else {
		setAttributes({ LinkUrl: '' }); // Если ничего не выбрано, очищаем
	}
};

const handleHtml5VideoChange = (newUrl) => {
	setAttributes({ LinkUrl: newUrl }); // Обновляем атрибут LinkUrl с введенным значением
};


	return (
		<>
			<PanelBody
				title={__('Link Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
			>
			<SelectControl
				label={__('Type link', 'codeweber-gutenberg-blocks')}
				value={LinkType}
				options={[
					{ label: __('External', 'codeweber-gutenberg-blocks'), value: 'external' },
					{ label: __('Page', 'codeweber-gutenberg-blocks'), value: 'page' },
					{ label: __('Post', 'codeweber-gutenberg-blocks'), value: 'post' },
					{ label: __('CF7', 'codeweber-gutenberg-blocks'), value: 'cf7' },
					{ label: __('Modal', 'codeweber-gutenberg-blocks'), value: 'modal' },
					{ label: __('HTML', 'codeweber-gutenberg-blocks'), value: 'html' },
					{ label: __('Document', 'codeweber-gutenberg-blocks'), value: 'document' },
					{ label: __('Phone', 'codeweber-gutenberg-blocks'), value: 'phone' },
					{ label: __('PDF', 'codeweber-gutenberg-blocks'), value: 'pdf' },
					{ label: __('Image', 'codeweber-gutenberg-blocks'), value: 'image' },
					{ label: __('Html5 Video', 'codeweber-gutenberg-blocks'), value: 'html5video' },
					{ label: __('YouTube', 'codeweber-gutenberg-blocks'), value: 'youtube' },
					{ label: __('Vimeo', 'codeweber-gutenberg-blocks'), value: 'vimeo' },
					{ label: __('Rutube', 'codeweber-gutenberg-blocks'), value: 'rutube' },
					{ label: __('VK Video', 'codeweber-gutenberg-blocks'), value: 'vk' },
				]}
					onChange={handleLinkTypeChange}
				/>

				{/* Поля для YouTube */}
				{LinkType === 'youtube' && (
					<TextControl
					label={__('YouTube Video URL', 'codeweber-gutenberg-blocks')}
						value={YoutubeID}
						onChange={handleYoutubeIDChange}
						placeholder="YouTube URL"
					/>
				)}

				{/* Поля для Vimeo */}
				{LinkType === 'vimeo' && (
					<TextControl
					label={__('Vimeo Video URL', 'codeweber-gutenberg-blocks')}
						value={VimeoID}
						onChange={handleVimeoIDChange}
						placeholder="Vimeo URL"
					/>
				)}

				{/* Поля для Rutube */}
				{LinkType === 'rutube' && (
					<VideoURLControl
						videoType="rutube"
						value={RutubeID}
						onChange={(url, metadata) => {
							// Pass metadata with videoId for proper handling
							handleRutubeIDChange(url, metadata);
						}}
						autoloadPoster={false}
						multiline={false}
						enhanceQuality={true}
						forLightbox={true}
					/>
				)}

				{/* Поля для VK */}
				{LinkType === 'vk' && (
					<VideoURLControl
						videoType="vk"
						value={VKID}
						onChange={(url, metadata) => {
							// Pass metadata with oid/id for proper handling
							handleVKIDChange(url, metadata);
						}}
						autoloadPoster={false}
						multiline={false}
						enhanceQuality={true}
						forLightbox={true}
					/>
				)}

				{LinkType === 'external' && (
					<TextControl
						label={__('URL', 'codeweber-gutenberg-blocks')}
						value={LinkUrl}
						onChange={handleLinkUrlChange}
						placeholder="https://example.com"
					/>
				)}

				{LinkType === 'pdf' && (
					<TextControl
						label={__('URL', 'codeweber-gutenberg-blocks')}
						value={LinkUrl}
						onChange={handlePdfChange}
						placeholder="https://example.com"
					/>
				)}

				{LinkType === 'pdf' && (
					<MediaUpload
						onSelect={handleFileSelect} // Обработка выбранного файла
						allowedTypes={['application/pdf']}
						value={LinkUrl}
						render={({ open }) => (
							<Button onClick={open} className="is-primary">
								Select file
							</Button> // Кнопка для открытия медиатека
						)}
					/>
				)}

				{LinkType === 'image' && (
					<TextControl
						label={__('Image URL', 'codeweber-gutenberg-blocks')}
						value={LinkUrl}
						onChange={handleImageChange}
						placeholder="https://example.com"
					/>
				)}

				{LinkType === 'image' && (
					<MediaUpload
						onSelect={handleImageSelect} // Обработка выбранного изображения
						allowedTypes={[
							'image/jpeg',
							'image/png',
							'image/gif',
							'image/webp',
							'image/svg+xml',
							'image/*',
						]} // Разрешаем все типы изображений
						value={LinkUrl}
						render={({ open }) => (
							<Button onClick={open} className="is-primary mb-2">
								Select image
							</Button> // Кнопка для открытия медиатека
						)}
					/>
				)}

				{LinkType === 'html5video' && (
					<TextControl
						label={__('Html 5 video URL', 'codeweber-gutenberg-blocks')}
						value={LinkUrl}
						onChange={handleHtml5VideoChange}
						placeholder="https://example.com"
					/>
				)}

				{LinkType === 'html5video' && (
					<MediaUpload
						onSelect={handleHtml5VideoSelect} // Обработка выбранного видео
						allowedTypes={[
							'video/mp4',
							'video/webm',
							'video/ogg',
							'video/*',
						]} // Разрешаем видеоформаты
						render={({ open }) => (
							<Button onClick={open} className="is-primary mb-2">
								Select video
							</Button> // Кнопка для открытия медиатеки
						)}
					/>
				)}

				{['image', 'vimeo', 'youtube', 'pdf', 'html5video'].includes(
					LinkType
				) && (
					<TextControl
						label={__('Gallery ID', 'codeweber-gutenberg-blocks')}
						value={DataGallery} // Привязываем значение к DataGallery
						onChange={handleGalleryID} // Функция обработки изменений
						placeholder="Enter Gallery ID"
					/>
				)}

				{LinkType === 'phone' && (
					<>
						<div className="component-sidebar-title">
							<label>
								{__('Phone Type', 'codeweber-gutenberg-blocks')}
							</label>
						</div>

						<div className="phone-type-controls button-group-sidebar_50">
							<Button
								isPrimary={PhoneType === 'custom'}
								onClick={() => {
									handlePhoneTypeChange('custom');
									setAttributes({
										LinkUrl: '', // Обновляем другие атрибуты, если нужно
										PhoneNumber: '', // Очищаем или изменяем другие атрибуты
									});
								}}
							>
								Custom
							</Button>
							<Button
								isPrimary={PhoneType === 'contacts'}
								onClick={() =>
									handlePhoneTypeChange('contacts')
								}
							>
								Contacts
							</Button>
						</div>

						{PhoneType === 'custom' && (
							<TextControl
								label={__('Custom phone', 'codeweber-gutenberg-blocks')}
								value={LinkUrl.replace(/^tel:/, '')} // Убираем "tel:" для отображения
								onChange={handleLinkUrlChange}
								placeholder="+1234567890"
							/>
						)}

						{PhoneType === 'contacts' && (
							<SelectControl
								label={__('Select Phone', 'codeweber-gutenberg-blocks')}
								value={PhoneNumber}
								options={phones}
								onChange={(newPhone) => {
									setAttributes({
										PhoneNumber: newPhone,
									});
									setAttributes({
										LinkUrl: `tel:${newPhone}`,
									});
									setAttributes({
										DataValue: ``,
									});
								}}
							/>
						)}
					</>
				)}

				{LinkType === 'post' &&
					(posts.length > 0 ? (
						<SelectControl
							label={__('Select Post', 'codeweber-gutenberg-blocks')}
							value={PostId}
							options={posts.map((post) => ({
								label: post.title.rendered,
								value: post.id,
							}))}
							onChange={handlePostSelect}
						/>
					) : (
						<p>Post not found</p> // Выводим сообщение, если постов нет
					))}

				{LinkType === 'page' &&
					(pages.length > 0 ? (
						<SelectControl
							label={__('Select Page', 'codeweber-gutenberg-blocks')}
							value={PageId}
							options={pages.map((page) => ({
								label: page.title.rendered,
								value: page.id,
							}))}
							onChange={handlePageSelect}
						/>
					) : (
						<p>Page not found</p> // Выводим сообщение, если страниц нет
					))}

				{LinkType === 'cf7' &&
					(cf7Forms.length > 0 ? (
						<SelectControl
							label={__('Select CF7', 'codeweber-gutenberg-blocks')}
							value={CF7ID}
							options={cf7Forms.map((form) => ({
								label: form.label, // Используем label, который вы формировали в fetchCF7Forms
								value: form.value,
							}))}
							onChange={handleCF7Select}
						/>
					) : (
						<p>Формы CF7 не найдены</p> // Сообщение о том, что формы отсутствуют
					))}

				{LinkType === 'modal' &&
					(modals.length > 0 ? (
					<SelectControl
						label={__('Select Modal', 'codeweber-gutenberg-blocks')}
						value={ModalID}
							options={modals.map((modal) => ({
								label: modal.title.rendered,
								value: modal.id,
							}))}
							onChange={handleModalSelect}
						/>
					) : (
						<p>Modal not found</p> // Выводим сообщение, если модальных окон нет
					))}

				{LinkType === 'html' &&
					(htmlPosts.length > 0 ? (
						<SelectControl
							label={__('Select HTML', 'codeweber-gutenberg-blocks')}
							value={HtmlID}
							options={htmlPosts.map((htmlPost) => ({
								label: htmlPost.title.rendered,
								value: htmlPost.id,
							}))}
							onChange={handleHtmlSelect}
						/>
					) : (
						<p>HTML not found</p> // Выводим сообщение, если HTML контента нет
					))}

				{LinkType === 'document' &&
					(documentPosts.length > 0 ? (
						<SelectControl
							label={__('Select Document', 'codeweber-gutenberg-blocks')}
							value={DocumentID}
							options={documentPosts.map((documentPost) => {
								// Извлекаем расширение файла из URL
								const fileUrl =
									documentPost.meta?._new_documents_file ||
									'';
								const fileExtension = fileUrl
									? fileUrl.split('.').pop()
									: 'file not found'; // Извлекаем расширение

								return {
									label: `${documentPost.title.rendered} - ${fileExtension}`, // Добавляем расширение к названию
									value: documentPost.id,
								};
							})}
							onChange={handleDocumentSelect}
						/>
					) : (
						<p>Document not found</p> // Выводим сообщение, если документов нет
					))}
			</PanelBody>
		</>
	);
};


