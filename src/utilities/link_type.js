import { __ } from '@wordpress/i18n';
import {
	SelectControl,
	TextControl,
	Button,
	PanelBody,
	Spinner,
} from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { VideoURLControl } from '../components/video-url/VideoURLControl';
import { parseVKVideoURL, parseRutubeVideoURL } from './videoUrlParsers';

export const LinkTypeSelector = ({ attributes, setAttributes }) => {
	const {
		LinkType,
		LinkUrl,
		PostId,
		PostType,
		PageId,
		CF7ID,
		CodeweberFormID,
		ModalID,
		HtmlID,
		PhoneType, // Добавляем PhoneType к атрибутам
		PhoneNumber,
		YoutubeID,
		VimeoID,
		RutubeID,
		DocumentID,
		DocumentAction,
		VKID,
		ButtonType,
		LeftIcon,
		DataGlightbox,
		DataGallery,
		DataBsToggle,
		DataBsTarget,
		DataGlightboxTitle,
		ArchiveId,
		ArchiveType,
	} = attributes;

	// Состояния для хранения списка постов, страниц, модальных окон, HTML и форм CF7 и телефонов
	const [posts, setPosts] = useState([]);
	const [pages, setPages] = useState([]);
	const [cf7Forms, setCf7Forms] = useState([]);
	const [codeweberForms, setCodeweberForms] = useState([]);
	const [modals, setModals] = useState([]);
	const [htmlPosts, setHtmlPosts] = useState([]);
		const [documentPosts, setDocumentPosts] = useState([]);
	const [isLoadingCF7, setIsLoadingCF7] = useState(true);
	const [isLoadingCodeweberForms, setIsLoadingCodeweberForms] = useState(true);
	const [phones, setPhones] = useState([]);
	const [isLoadingPhones, setIsLoadingPhones] = useState(false);
	const [postTypes, setPostTypes] = useState([]);
	const [isLoadingPostTypes, setIsLoadingPostTypes] = useState(false);
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);
	const [archives, setArchives] = useState([]);
	const [isLoadingArchives, setIsLoadingArchives] = useState(false);

	// Устанавливаем начальное состояние загрузки для телефонов
	useEffect(() => {
		if (LinkType === 'phone' && PhoneType === 'contacts') {
			setIsLoadingPhones(true);
		}
	}, [LinkType, PhoneType]);

	// Получаем базовый URL сайта с использованием глобальной переменной WordPress
	const sitelinkurl = wpApiSettings.root.replace('/wp-json/', '');

	// Функция для загрузки телефонов из Redux через кастомный REST API
	const fetchPhoneNumbers = async () => {
		setIsLoadingPhones(true);
		try {
			const response = await fetch(`${wpApiSettings.root}wp/v2/phones`);
			if (!response.ok) {
				throw new Error(`Failed to fetch phones: ${response.status} ${response.statusText}`);
			}
			const phoneNumbers = await response.json();
			
			// Проверяем, что phoneNumbers является объектом
			if (!phoneNumbers || typeof phoneNumbers !== 'object') {
				console.warn('Invalid phone numbers response:', phoneNumbers);
				setPhones([]);
				return;
			}
			
			// phoneNumbers уже является объектом вида { 'phone_01': '+74951234567', ... }
			const phoneOptions = Object.entries(phoneNumbers).map(
				([id, phone]) => ({
					label: phone,
					value: phone,
				})
			);
			
			console.log('Loaded phones:', phoneOptions);
			setPhones(phoneOptions);
		} catch (error) {
			console.error('Error fetching phones:', error);
			setPhones([]);
		} finally {
			setIsLoadingPhones(false);
		}
	};

	// Функция для загрузки типов записей
	const fetchPostTypes = async () => {
		setIsLoadingPostTypes(true);
		try {
			const types = await apiFetch({ path: '/wp/v2/types' });
			const postTypeOptions = Object.keys(types)
				.filter((key) => {
					// Стандартные системные типы WordPress
					const excluded = [
						'attachment',
						'wp_block',
						'wp_template',
						'wp_template_part',
						'wp_navigation',
						'nav_menu_item',
						'wp_global_styles',
						'wp_font_family',
						'wp_font_face',
					];
					// Кастомные типы записей темы, которые нужно исключить
					const excludedCustom = [
						'html_blocks',
						'modal',
						'header',
						'footer',
						'page-header',
					];
					
					// Исключаем по ключу
					if (excluded.includes(key) || excludedCustom.includes(key)) {
						return false;
					}
					
					// Фильтрация по названию
					const typeName = (types[key].name || '').toLowerCase();
					const excludedNamePatterns = [
						'элементы меню',
						'меню навигации',
						'глобальные стили',
						'семейства шрифтов',
						'гарнитуры шрифта',
						'хедер',
						'футер',
						'заголовки',
						'page header',
						'page headers',
						'модальные окна',
						'modal',
						'html блоки',
						'html blocks',
						'rm content editor',
						'content editor',
					];
					
					if (excludedNamePatterns.some(pattern => typeName.includes(pattern.toLowerCase()))) {
						return false;
					}
					
					return true;
				})
				.map((key) => ({
					label: types[key].name || key,
					value: key,
				}));

			setPostTypes(postTypeOptions);
		} catch (error) {
			console.error('Error fetching post types:', error);
			setPostTypes([]);
		} finally {
			setIsLoadingPostTypes(false);
		}
	};

	// Функция для загрузки архивов (типы записей и таксономии)
	const fetchArchives = async () => {
		setIsLoadingArchives(true);
		try {
			const archiveOptions = [];
			
			// Получаем типы записей с архивами
			const types = await apiFetch({ path: '/wp/v2/types' });
			Object.keys(types).forEach((key) => {
				const type = types[key];
				// Проверяем, есть ли архив у типа записи
				if (type.has_archive && type.has_archive !== false) {
					// Формируем URL архива
					const archiveSlug = typeof type.has_archive === 'string' ? type.has_archive : key;
					archiveOptions.push({
						label: `${type.name} ${__('Archive', 'codeweber-gutenberg-blocks')}`,
						value: `post_type_${key}`,
						type: 'post_type',
						slug: archiveSlug,
						postType: key,
					});
				}
			});
			
			// Получаем таксономии и их термины
			const taxonomies = await apiFetch({ path: '/wp/v2/taxonomies' });
			const taxonomyPromises = [];
			
			Object.keys(taxonomies).forEach((taxonomyKey) => {
				const taxonomy = taxonomies[taxonomyKey];
				// Пропускаем скрытые таксономии
				if (!taxonomy.show_ui) {
					return;
				}
				
				// Получаем термины для таксономии
				const taxonomyPromise = apiFetch({ 
					path: `/wp/v2/${taxonomy.rest_base || taxonomyKey}?per_page=100&_fields=id,name,slug` 
				})
					.then((terms) => {
						if (Array.isArray(terms)) {
							return terms.map((term) => ({
								label: `${term.name} (${taxonomy.name})`,
								value: `taxonomy_${taxonomyKey}_${term.id}`,
								type: 'taxonomy',
								taxonomy: taxonomyKey,
								termId: term.id,
								termSlug: term.slug,
							}));
						}
						return [];
					})
					.catch((error) => {
						console.warn(`Error fetching terms for taxonomy ${taxonomyKey}:`, error);
						return [];
					});
				
				taxonomyPromises.push(taxonomyPromise);
			});
			
			// Ждем завершения всех запросов таксономий
			const taxonomyResults = await Promise.all(taxonomyPromises);
			taxonomyResults.forEach((terms) => {
				if (Array.isArray(terms)) {
					archiveOptions.push(...terms);
				}
			});
			
			setArchives(archiveOptions);
		} catch (error) {
			console.error('Error fetching archives:', error);
			setArchives([]);
		} finally {
			setIsLoadingArchives(false);
		}
	};

	// Функция для загрузки записей выбранного типа
	const fetchPostsByType = async (postType) => {
		if (!postType) {
			setPosts([]);
			return;
		}
		
		setIsLoadingPosts(true);
		try {
			// Получаем правильный REST API endpoint для типа записи
			let endpoint = postType;
			
			// Для стандартных типов используем правильный rest_base
			if (postType === 'post') {
				endpoint = 'posts';
			} else if (postType === 'page') {
				endpoint = 'pages';
			} else {
				// Для кастомных типов получаем rest_base из данных типа
				try {
					const postTypeData = await apiFetch({
						path: `/wp/v2/types/${postType}`,
					});
					if (postTypeData && postTypeData.rest_base) {
						endpoint = postTypeData.rest_base;
					}
				} catch (error) {
					console.warn('Could not fetch post type data, using postType as endpoint:', error);
					// Оставляем endpoint как postType
				}
			}
			
			// Запрашиваем записи с полями id и title, чтобы получить базовую информацию
			const response = await fetch(`${wpApiSettings.root}wp/v2/${endpoint}?per_page=100&_fields=id,title,link,slug`);
			if (!response.ok) {
				throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
			}
			const data = await response.json();
			setPosts(data);
		} catch (error) {
			console.error('Error fetching posts:', error);
			setPosts([]);
		} finally {
			setIsLoadingPosts(false);
		}
	};

	// Загрузка постов, страниц, модальных окон и HTML с использованием WordPress REST API
	useEffect(() => {
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

		const fetchCodeweberForms = async () => {
			try {
				// Используем apiFetch для правильной авторизации
				// rest_base установлен как 'codeweber' в CPT регистрации
				const data = await apiFetch({
					path: '/wp/v2/codeweber?per_page=100&status=publish&_fields=id,title'
				});
				
				// Проверяем, что data - массив
				if (!Array.isArray(data)) {
					console.warn('CodeWeber forms response is not an array:', data);
					setCodeweberForms([]);
					setIsLoadingCodeweberForms(false);
					return;
				}
				
				const formOptions = data.map((form) => ({
					label: `${form.id}: ${form.title?.rendered || form.title || `Form #${form.id}`}`,
					value: String(form.id),
				}));
				setCodeweberForms(formOptions);

				if (formOptions.length === 1) {
					setAttributes({ CodeweberFormID: formOptions[0].value });
				}

				setIsLoadingCodeweberForms(false);
			} catch (error) {
				console.error('Error fetching CodeWeber forms:', error);
				console.error('Error details:', error.message, error);
				// Попробуем альтернативный способ через fetch
				try {
					const response = await fetch(
						`${wpApiSettings.root}wp/v2/codeweber?per_page=100&status=publish&_fields=id,title`
					);
					if (response.ok) {
						const data = await response.json();
						if (Array.isArray(data)) {
							const formOptions = data.map((form) => ({
								label: `${form.id}: ${form.title?.rendered || form.title || `Form #${form.id}`}`,
								value: String(form.id),
							}));
							setCodeweberForms(formOptions);
							if (formOptions.length === 1) {
								setAttributes({ CodeweberFormID: formOptions[0].value });
							}
						}
					} else {
						console.error('Fetch response not OK:', response.status, response.statusText);
					}
				} catch (fetchError) {
					console.error('Fallback fetch also failed:', fetchError);
				}
				setCodeweberForms([]);
				setIsLoadingCodeweberForms(false);
			}
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
			// Загружаем типы записей при выборе типа ссылки "post"
			if (postTypes.length === 0) {
				fetchPostTypes();
			}
			// Если уже выбран тип записей, загружаем записи этого типа
			if (PostType) {
				fetchPostsByType(PostType);
			}
		} else if (LinkType === 'cf7') {
			fetchCF7Forms();
		} else if (LinkType === 'cf') {
			fetchCodeweberForms();
		} else if (LinkType === 'modal') {
			fetchModals();
		} else if (LinkType === 'html') {
			fetchHtmlPosts();
		} else if (LinkType === 'phone') {
			// Загружаем телефоны заранее, чтобы они были готовы при выборе 'contacts'
			if (PhoneType === 'contacts') {
				fetchPhoneNumbers();
			}
		} else if (LinkType === 'document') {
			fetchDocumentPosts();
		} else if (LinkType === 'archive') {
			if (archives.length === 0) {
				fetchArchives();
			}
		}


	}, [LinkType, PostType, sitelinkurl]);

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
				CodeweberFormID: '',
				CodeweberFormID: '',
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
				CodeweberFormID: '',
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
				PostType: '',
				PageId: '',
				CF7ID: '',
				CodeweberFormID: '',
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
				CodeweberFormID: '',
				CodeweberFormID: '',
				ModalID: '',
				HtmlID: '',
				DataValue: '',
				DocumentID: '',
				DataGlightbox: '',
				DataGallery: '',
				DataBsToggle: 'modal',
				DataBsTarget: 'modal',
			});
		} else if (newLinkType === 'cf') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				CodeweberFormID: '',
				CodeweberFormID: '',
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
				CodeweberFormID: '',
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
				CodeweberFormID: '',
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
				CodeweberFormID: '',
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
				CodeweberFormID: '',
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
				CodeweberFormID: '',
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
				CodeweberFormID: '',
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
				CodeweberFormID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				DocumentAction: 'download',
				DataGlightbox: '',
				DataGallery: '',
				DataBsToggle: '',
				DataBsTarget: '',
			});
		} else if (newLinkType === 'pdf') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				CodeweberFormID: '',
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
				CodeweberFormID: '',
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
				CodeweberFormID: '',
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
		} else if (newLinkType === 'archive') {
			setAttributes({
				LinkUrl: '',
				PostId: '',
				PageId: '',
				CF7ID: '',
				CodeweberFormID: '',
				ModalID: '',
				HtmlID: '',
				PhoneType: '',
				DataValue: '',
				YoutubeID: '',
				VimeoID: '',
				RutubeID: '',
				VKID: '',
				DocumentID: '',
				ArchiveId: '',
				ArchiveType: '',
				DataGlightbox: '',
				DataGallery: '',
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
		// #region agent log
		fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'link_type.js:676',message:'handleLinkUrlChange called',data:{LinkType,PhoneType,newLinkUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
		// #endregion
		// Проверяем тип ссылки - добавляем "tel:" только для телефонных ссылок
		if (LinkType === 'phone' && PhoneType === 'custom') {
			// Проверяем и добавляем "tel:" только если его еще нет
			const formattedLinkUrl = newLinkUrl.startsWith('tel:')
				? newLinkUrl
				: `tel:${newLinkUrl}`;
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'link_type.js:682',message:'Adding tel: prefix',data:{formattedLinkUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
			// #endregion
			setAttributes({ LinkUrl: formattedLinkUrl });
		} else {
			// #region agent log
			fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'link_type.js:686',message:'Setting LinkUrl without tel: prefix',data:{newLinkUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
			// #endregion
			setAttributes({ LinkUrl: newLinkUrl });
		}
	};

	const handlePostTypeChange = (selectedPostType) => {
		setAttributes({ PostType: selectedPostType, PostId: '' });
		// Загружаем записи выбранного типа
		fetchPostsByType(selectedPostType);
	};

	const handlePostSelect = async (selectedPostId) => {
		if (!selectedPostId || !PostType) {
			return;
		}
		
		setAttributes({ PostId: selectedPostId });
		
		// Ищем запись в уже загруженных
		const selectedPost = posts.find(
			(post) => {
				const postId = String(post.id);
				const selectedId = String(selectedPostId);
				return postId === selectedId || post.id == selectedPostId;
			}
		);
		
		// Если запись найдена и есть link, используем его
		if (selectedPost && selectedPost.link) {
			setAttributes({ LinkUrl: selectedPost.link });
			return;
		}
		
		// Определяем правильный endpoint для типа записи
		let endpoint = PostType;
		if (PostType === 'post') {
			endpoint = 'posts';
		} else if (PostType === 'page') {
			endpoint = 'pages';
		} else {
			// Для кастомных типов получаем rest_base
			try {
				const postTypeData = await apiFetch({
					path: `/wp/v2/types/${PostType}`,
				});
				if (postTypeData && postTypeData.rest_base) {
					endpoint = postTypeData.rest_base;
				}
			} catch (error) {
				console.warn('Could not fetch post type data:', error);
			}
		}
		
		// Если link нет, запрашиваем конкретную запись по ID для получения правильного URL
		try {
			const response = await fetch(`${wpApiSettings.root}wp/v2/${endpoint}/${selectedPostId}?_fields=id,link`);
			if (response.ok) {
				const postData = await response.json();
				if (postData.link) {
					setAttributes({ LinkUrl: postData.link });
					return;
				}
			}
		} catch (error) {
			console.warn('Error fetching post permalink:', error);
		}
		
		// Если ничего не получилось, формируем URL по ID
		// Это fallback, который всегда сработает
		const baseUrl = wpApiSettings.root.replace('/wp-json/', '');
		let postUrl;
		
		if (PostType === 'post') {
			postUrl = `${baseUrl}?p=${selectedPostId}`;
		} else if (PostType === 'page') {
			postUrl = `${baseUrl}?page_id=${selectedPostId}`;
		} else {
			// Для кастомных типов записей
			postUrl = `${baseUrl}?post_type=${PostType}&p=${selectedPostId}`;
		}
		
		setAttributes({ LinkUrl: postUrl });
	};

	// Автоматический выбор записи, если она единственная
	useEffect(() => {
		// Выполняем только если:
		// 1. Тип ссылки - "post"
		// 2. Выбран тип записей (PostType)
		// 3. Записи загружены (не загружаются)
		// 4. Записей ровно одна
		// 5. PostId еще не установлен или пустой
		if (
			LinkType === 'post' &&
			PostType &&
			!isLoadingPosts &&
			posts.length === 1 &&
			(!PostId || PostId === '')
		) {
			const singlePost = posts[0];
			const postId = String(singlePost.id);
			
			// Автоматически выбираем единственную запись
			handlePostSelect(postId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [LinkType, PostType, isLoadingPosts, posts.length, PostId]);

	// Автоматический выбор документа, если он единственный
	useEffect(() => {
		// Выполняем только если:
		// 1. Тип ссылки - "document"
		// 2. Документы загружены
		// 3. Документов ровно один
		// 4. DocumentID еще не установлен или пустой
		if (
			LinkType === 'document' &&
			documentPosts.length === 1 &&
			(!DocumentID || DocumentID === '')
		) {
			const singleDocument = documentPosts[0];
			const documentId = String(singleDocument.id);
			
			// Автоматически выбираем единственный документ
			handleDocumentSelect(documentId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [LinkType, documentPosts.length, DocumentID]);

const handleCF7Select = (selectedCF7Id) => {
	setAttributes({
		CF7ID: selectedCF7Id,
		DataValue: `cf7-${selectedCF7Id}`,
		LinkUrl: 'javascript:void(0)',
		DataBsToggle: 'modal',
		DataBsTarget: `modal`,
	});
};

const handleCodeweberFormSelect = (selectedFormId) => {
	setAttributes({
		CodeweberFormID: selectedFormId,
		DataValue: `cf-${selectedFormId}`,
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
	if (!selectedDocumentId) {
		return;
	}

	setAttributes({ DocumentID: selectedDocumentId });

	// Обновляем атрибуты в зависимости от выбранного действия
	// Используем текущее значение DocumentAction или значение по умолчанию 'download'
	const action = DocumentAction || 'download';
	
	if (action === 'download') {
		setAttributes({
			DataValue: `doc-${selectedDocumentId}`,
			LinkUrl: 'javascript:void(0)',
			DataBsToggle: 'download',
			DataBsTarget: '',
		});
	} else if (action === 'email') {
		setAttributes({
			DataValue: `doc-${selectedDocumentId}`,
			LinkUrl: 'javascript:void(0)',
			DataBsToggle: 'modal',
			DataBsTarget: 'modal',
		});
	}
};

const handleDocumentActionChange = (newAction) => {
	setAttributes({ DocumentAction: newAction });
	// Если документ уже выбран, обновляем атрибуты
	if (DocumentID) {
		if (newAction === 'download') {
			setAttributes({
				DataValue: `doc-${DocumentID}`,
				LinkUrl: 'javascript:void(0)',
				DataBsToggle: 'download',
				DataBsTarget: '',
			});
		} else if (newAction === 'email') {
			setAttributes({
				DataValue: `doc-${DocumentID}`,
				LinkUrl: 'javascript:void(0)',
				DataBsToggle: 'modal',
				DataBsTarget: 'modal',
			});
		}
	}
};

const handleArchiveSelect = async (selectedArchiveValue) => {
	// #region agent log
	fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'link_type.js:1020',message:'handleArchiveSelect called',data:{selectedArchiveValue},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
	// #endregion
	if (!selectedArchiveValue) {
		return;
	}
	
	// Находим выбранный архив
	const selectedArchive = archives.find(arch => arch.value === selectedArchiveValue);
	// #region agent log
	fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'link_type.js:1027',message:'Selected archive found',data:{selectedArchive},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
	// #endregion
	if (!selectedArchive) {
		return;
	}
	
	setAttributes({ 
		ArchiveId: selectedArchiveValue,
		ArchiveType: selectedArchive.type,
	});
	
	// Получаем правильный URL архива через REST API
	try {
		let apiPath = '';
		if (selectedArchive.type === 'post_type') {
			apiPath = `/codeweber-gutenberg-blocks/v1/archive-url?type=post_type&post_type=${selectedArchive.postType}`;
		} else if (selectedArchive.type === 'taxonomy') {
			apiPath = `/codeweber-gutenberg-blocks/v1/archive-url?type=taxonomy&taxonomy=${selectedArchive.taxonomy}&term_id=${selectedArchive.termId}`;
		}
		
		// #region agent log
		fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'link_type.js:1042',message:'Fetching archive URL from API',data:{apiPath},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
		// #endregion
		
		const response = await apiFetch({ path: apiPath });
		// #region agent log
		fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'link_type.js:1045',message:'Archive URL received',data:{response},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
		// #endregion
		
		if (response && response.url) {
			setAttributes({ LinkUrl: response.url });
		} else {
			console.error('Invalid archive URL response:', response);
		}
	} catch (error) {
		console.error('Error fetching archive URL:', error);
		// Fallback: формируем URL вручную
		const baseUrl = wpApiSettings.root.replace('/wp-json/', '');
		let archiveUrl = '';
		
		if (selectedArchive.type === 'post_type') {
			archiveUrl = `${baseUrl}${selectedArchive.slug}/`;
		} else if (selectedArchive.type === 'taxonomy') {
			archiveUrl = `${baseUrl}${selectedArchive.taxonomy}/${selectedArchive.termSlug}/`;
		}
		
		// #region agent log
		fetch('http://127.0.0.1:7242/ingest/49b89e88-4674-4191-9133-bf7fd16c00a5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'link_type.js:1062',message:'Using fallback URL',data:{archiveUrl,error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
		// #endregion
		
		setAttributes({ LinkUrl: archiveUrl });
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
					{ label: __('Post', 'codeweber-gutenberg-blocks'), value: 'post' },
					{ label: __('Archive', 'codeweber-gutenberg-blocks'), value: 'archive' },
					{ label: __('CF7', 'codeweber-gutenberg-blocks'), value: 'cf7' },
					{ label: __('Формы', 'codeweber-gutenberg-blocks'), value: 'cf' },
					{ label: __('Modal', 'codeweber-gutenberg-blocks'), value: 'modal' },
					{ label: __('Phone', 'codeweber-gutenberg-blocks'), value: 'phone' },
					{ label: __('PDF', 'codeweber-gutenberg-blocks'), value: 'pdf' },
					{ label: __('Image', 'codeweber-gutenberg-blocks'), value: 'image' },
					{ label: __('Html5 Video', 'codeweber-gutenberg-blocks'), value: 'html5video' },
					{ label: __('YouTube', 'codeweber-gutenberg-blocks'), value: 'youtube' },
					{ label: __('Vimeo', 'codeweber-gutenberg-blocks'), value: 'vimeo' },
					{ label: __('Rutube', 'codeweber-gutenberg-blocks'), value: 'rutube' },
					{ label: __('VK Video', 'codeweber-gutenberg-blocks'), value: 'vk' },
					{ label: __('Document', 'codeweber-gutenberg-blocks'), value: 'document' },
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
							<>
								{isLoadingPhones ? (
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<Spinner />
										<span>{__('Loading phones...', 'codeweber-gutenberg-blocks')}</span>
									</div>
								) : (
									<SelectControl
										label={__('Select Phone', 'codeweber-gutenberg-blocks')}
										value={PhoneNumber}
										options={phones.length > 0 ? phones : [{ label: __('No phones found', 'codeweber-gutenberg-blocks'), value: '' }]}
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
					</>
				)}

				{LinkType === 'post' && (
					<>
						<SelectControl
							label={__('Select Post Type', 'codeweber-gutenberg-blocks')}
							value={PostType}
							options={
								isLoadingPostTypes
									? [{ label: __('Loading...', 'codeweber-gutenberg-blocks'), value: '' }]
									: postTypes.length > 0
									? postTypes
									: [{ label: __('No post types found', 'codeweber-gutenberg-blocks'), value: '' }]
							}
							onChange={handlePostTypeChange}
							help={__('Select the type of post to display', 'codeweber-gutenberg-blocks')}
						/>

						{PostType && (
							<>
								{isLoadingPosts ? (
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
										<Spinner />
										<span>{__('Loading posts...', 'codeweber-gutenberg-blocks')}</span>
									</div>
								) : posts.length > 0 ? (
									<SelectControl
										label={__('Select Post', 'codeweber-gutenberg-blocks')}
										value={PostId}
										options={posts.map((post) => ({
											label: post.title.rendered,
											value: String(post.id), // Приводим к строке для консистентности
										}))}
										onChange={handlePostSelect}
									/>
								) : (
									<p style={{ marginTop: '16px' }}>
										{__('No posts found', 'codeweber-gutenberg-blocks')}
									</p>
								)}
							</>
						)}
					</>
				)}

				{LinkType === 'archive' && (
					<>
						{isLoadingArchives ? (
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<Spinner />
								<span>{__('Loading archives...', 'codeweber-gutenberg-blocks')}</span>
							</div>
						) : archives.length > 0 ? (
							<SelectControl
								label={__('Select Archive', 'codeweber-gutenberg-blocks')}
								value={ArchiveId}
								options={archives.map((archive) => ({
									label: archive.label,
									value: archive.value,
								}))}
								onChange={handleArchiveSelect}
							/>
						) : (
							<p>{__('No archives found', 'codeweber-gutenberg-blocks')}</p>
						)}
					</>
				)}

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

				{LinkType === 'cf' &&
					(isLoadingCodeweberForms ? (
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<Spinner />
							<span>{__('Loading forms...', 'codeweber-gutenberg-blocks')}</span>
						</div>
					) : codeweberForms.length > 0 ? (
						<SelectControl
							label={__('Select Form', 'codeweber-gutenberg-blocks')}
							value={CodeweberFormID}
							options={codeweberForms.map((form) => ({
								label: form.label,
								value: form.value,
							}))}
							onChange={handleCodeweberFormSelect}
						/>
					) : (
						<p>{__('No CodeWeber forms found', 'codeweber-gutenberg-blocks')}</p>
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

				{LinkType === 'document' && (
					<>
						<div className="component-sidebar-title">
							<label>
								{__('Document Action', 'codeweber-gutenberg-blocks')}
							</label>
						</div>
						<div className="document-action-controls button-group-sidebar_50">
							<Button
								isPrimary={DocumentAction === 'download'}
								onClick={() => handleDocumentActionChange('download')}
							>
								{__('Download', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								isPrimary={DocumentAction === 'email'}
								onClick={() => handleDocumentActionChange('email')}
							>
								{__('Send to Email', 'codeweber-gutenberg-blocks')}
							</Button>
						</div>
						{documentPosts.length > 0 ? (
							<SelectControl
								label={__('Select Document', 'codeweber-gutenberg-blocks')}
								value={DocumentID}
								options={documentPosts.map((doc) => ({
									label: doc.title.rendered,
									value: String(doc.id),
								}))}
								onChange={handleDocumentSelect}
							/>
						) : (
							<p>{__('No documents found', 'codeweber-gutenberg-blocks')}</p>
						)}
					</>
				)}
			</PanelBody>
		</>
	);
};


