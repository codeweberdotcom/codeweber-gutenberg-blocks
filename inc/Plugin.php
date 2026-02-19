<?php

namespace Codeweber\Blocks;

class Plugin {
	/**
	 * Prefix for naming.
	 *
	 * @var string
	 */
	const PREFIX = 'codeweber-gutenberg-blocks';

	/**
	 * Gettext localization domain.
	 *
	 * @var string
	 */
	const L10N = self::PREFIX;

	/**
	 * @var string
	 */
	private static string $baseUrl;

	public static function perInit(): void {
		// block initialization
		add_action('init',  __CLASS__ . '::gutenbergBlocksInit');

		// Enqueue global editor styles
		add_action('enqueue_block_editor_assets', __CLASS__ . '::enqueueEditorGlobalStyles');

		// Inject editor styles into iframe (for WP 6.3+ iframed editor)
		add_filter('block_editor_settings_all', __CLASS__ . '::addEditorGlobalStylesToSettings', 10, 2);

		// Header widgets blocks: only in CPT header
		add_filter('allowed_block_types_all', __CLASS__ . '::filterHeaderWidgetsBlocksByPostType', 10, 2);

		// Enqueue frontend scripts
		add_action('wp_enqueue_scripts', __CLASS__ . '::gutenbergBlocksExternalLibraries');

		// Фильтр для условного рендеринга аккордеона (перехватываем до рендеринга)
		add_filter('pre_render_block', __CLASS__ . '::pre_render_accordion_block', 10, 2);

		// Фильтр для условного рендеринга списков (перехватываем до рендеринга)
		add_filter('pre_render_block', __CLASS__ . '::pre_render_lists_block', 10, 2);

		// Фильтр для условного рендеринга меню (перехватываем до рендеринга)
		add_filter('pre_render_block', __CLASS__ . '::pre_render_menu_block', 10, 2);

		// Фильтр для условного рендеринга аватара (перехватываем до рендеринга)
		add_filter('pre_render_block', __CLASS__ . '::pre_render_avatar_block', 10, 2);

		// Фильтр для условной загрузки FilePond для file полей
		add_filter('pre_render_block', __CLASS__ . '::pre_render_file_field', 10, 2);

		// Фильтр для условного рендеринга form-field с inline button
		add_filter('pre_render_block', __CLASS__ . '::pre_render_form_field_inline_button', 10, 2);

		// Фильтр для рендеринга html-blocks блока
		add_filter('pre_render_block', __CLASS__ . '::pre_render_html_blocks_block', 10, 2);

		// Фильтр для рендеринга contacts блока
		add_filter('pre_render_block', __CLASS__ . '::pre_render_contacts_block', 10, 2);

		// Фильтр для рендеринга social-icons блока
		add_filter('pre_render_block', __CLASS__ . '::pre_render_social_icons_block', 10, 2);

		// Фильтр для рендеринга tables блока (manual + CSV из documents CPT)
		add_filter('pre_render_block', __CLASS__ . '::pre_render_tables_block', 10, 2);

		// Фильтр для рендеринга navbar блока
		add_filter('pre_render_block', __CLASS__ . '::pre_render_navbar_block', 10, 2);

		// Фильтр для рендеринга top-header блока
		add_filter('pre_render_block', __CLASS__ . '::pre_render_top_header_block', 10, 2);
	}

	public static function init(): void {
		// blocks category
		if (version_compare($GLOBALS['wp_version'], '5.7', '<')) {
			add_filter('block_categories', __CLASS__ . '::gutenbergBlocksRegisterCategory', 10, 2);
		}
		else {
			add_filter('block_categories_all', __CLASS__ . '::gutenbergBlocksRegisterCategory', 10, 2);
		}

		// Register REST API endpoint for image sizes
		add_action('rest_api_init', __CLASS__ . '::register_image_sizes_endpoint');

		// Register REST API endpoint for taxonomies and terms
		add_action('rest_api_init', __CLASS__ . '::register_taxonomies_endpoint');

		// Register REST API endpoint for accordion posts (using WP_Query)
		add_action('rest_api_init', __CLASS__ . '::register_accordion_posts_endpoint');

		// Register REST API endpoint for archive URLs
		add_action('rest_api_init', __CLASS__ . '::register_archive_urls_endpoint');

		// Register REST API endpoint for theme style classes (button/card radius)
		add_action('rest_api_init', [StyleAPI::class, 'register_routes']);

		// Register REST API endpoint for logos
		add_action('rest_api_init', __CLASS__ . '::register_logos_endpoint');

		// Register REST API endpoint for contacts
		add_action('rest_api_init', __CLASS__ . '::register_contacts_endpoint');

		// Register REST API endpoint for social-icons preview (editor = frontend)
		add_action('rest_api_init', __CLASS__ . '::register_social_icons_preview_endpoint');

		// Register REST API endpoint for tables: documents list (CSV) and CSV content
		add_action('rest_api_init', __CLASS__ . '::register_tables_documents_endpoint');

		// Register REST API endpoint for navbar block preview (editor)
		add_action('rest_api_init', __CLASS__ . '::register_navbar_preview_endpoint');

		// Register REST API endpoint for sidebars list
		add_action('rest_api_init', __CLASS__ . '::register_sidebars_endpoint');

		// Load JavaScript translations after scripts are enqueued
		add_action('enqueue_block_editor_assets', __CLASS__ . '::loadJSTranslations', 100);
	}

	public static function initVideoThumbnailAPI(): void {
		error_log('Plugin::initVideoThumbnailAPI() called');
		// Initialize Video Thumbnail API - must be called early
		$api = new VideoThumbnailAPI();
		error_log('VideoThumbnailAPI instance created: ' . get_class($api));
	}

	public static function initLoadMoreAPI(): void {
		// Initialize Load More API
		$api = new LoadMoreAPI();
	}

	/**
	 * Enqueue global editor styles for all blocks
	 */
	public static function enqueueEditorGlobalStyles(): void {
		wp_enqueue_style(
			'codeweber-blocks-editor-global',
			self::getBaseUrl() . '/includes/css/editor-global.css',
			['wp-edit-blocks'],
			GUTENBERG_BLOCKS_VERSION
		);

		// Tabulator CSS for tabulator block (script loaded via block dependency)
		wp_enqueue_style('tabulator-editor');

		// Enqueue scrollCue init script for editor
		wp_enqueue_script(
			'codeweber-blocks-scrollcue-init',
			self::getBaseUrl() . '/includes/js/scrollcue-editor-init.js',
			[],
			GUTENBERG_BLOCKS_VERSION,
			true
		);

		// Prism.js for syntax highlighting in Code and Card (footer code) blocks in editor
		$prism_js_path = get_theme_file_path('src/assets/js/vendor/prism.js');
		$prism_css_path = get_theme_file_path('src/assets/css/vendor/prism.css');
		if ($prism_js_path && file_exists($prism_js_path)) {
			wp_enqueue_script(
				'prism',
				get_theme_file_uri('src/assets/js/vendor/prism.js'),
				[],
				'1.24.1',
				true
			);
			if ($prism_css_path && file_exists($prism_css_path)) {
				wp_enqueue_style(
					'prism',
					get_theme_file_uri('src/assets/css/vendor/prism.css'),
					[],
					'1.24.1'
				);
			}
			global $wp_scripts;
			foreach (['card', 'code'] as $block_name) {
				$script_handle = 'codeweber-blocks-' . $block_name . '-editor-script';
				if (isset($wp_scripts->registered[$script_handle])) {
					$wp_scripts->registered[$script_handle]->deps[] = 'prism';
				}
			}
		}

		// Pass plugin URL to JavaScript for placeholder image via inline script
		wp_add_inline_script(
			'codeweber-blocks-scrollcue-init',
			'window.codeweberBlocksData = window.codeweberBlocksData || {}; window.codeweberBlocksData.pluginUrl = ' . wp_json_encode(rtrim(self::getBaseUrl(), '/') . '/') . ';',
			'before'
		);
	}

	/**
	 * Add editor global styles to block editor settings (for iframed editor).
	 *
	 * @param array<string, mixed> $editor_settings
	 * @param \WP_Block_Editor_Context $editor_context
	 * @return array<string, mixed>
	 */
	public static function addEditorGlobalStylesToSettings(array $editor_settings, $editor_context): array {
		$css_file = dirname(__DIR__) . '/includes/css/editor-global.css';
		if (!is_readable($css_file)) {
			return $editor_settings;
		}
		$css = file_get_contents($css_file);
		if ($css === false) {
			return $editor_settings;
		}
		$editor_settings['styles'] = $editor_settings['styles'] ?? [];
		$editor_settings['styles'][] = ['css' => $css];
		return $editor_settings;
	}

	/**
	 * Restrict header widgets blocks to CPT header only.
	 *
	 * @param bool|string[] $allowed_block_types
	 * @param \WP_Block_Editor_Context $block_editor_context
	 * @return bool|string[]
	 */
	public static function filterHeaderWidgetsBlocksByPostType($allowed_block_types, $block_editor_context) {
		$header_blocks = ['codeweber-blocks/header-widgets'];

		$post = $block_editor_context->post ?? null;
		$post_type = $post ? get_post_type($post) : '';

		if ($post_type === 'header') {
			return $allowed_block_types;
		}

		if (is_array($allowed_block_types)) {
			return array_values(array_diff($allowed_block_types, $header_blocks));
		}

		return $allowed_block_types;
	}

	public static function getBlocksName(): array {
	return [
		'accordion',
		'avatar',
		'header-widgets',
		'banners',
		'blog-category-widget',
		'blog-post-widget',
		'blog-tag-widget',
		'blog-year-widget',
		'button',
		'section',
		'column',
		'columns',
		'heading-subtitle',
		'icon',
		'lists',
		'logo',
		'menu',
		'media',
		'paragraph',
		'blockquote',
		'code',
		'dropcap',
		'card',
		'feature',
		'features',
		'image-simple',
		'post-grid',
		'tabs',
		'tables',
		'tabulator',
		'label-plus',
		'form',
		'form-field',
		'submit-button',
		'divider',
		'yandex-map',
		'html-blocks',
		'swiper',
		'group-button',
		'widget',
		'contacts',
		'cta',
		'navbar',
		'search',
		'social-icons',
		'social-wrapper',
		'top-header',
	];
	}

	/**
	 * Pre-render accordion block conditionally based on mode
	 * Always uses PHP render for both modes (Post and Custom)
	 */
	public static function pre_render_accordion_block($pre_render, $parsed_block) {
		// Проверяем, что это блок accordion
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/accordion') {
			return $pre_render;
		}

		// Отладка
		if (defined('WP_DEBUG') && WP_DEBUG) {
			error_log('[Accordion Pre-Render] Block detected, attrs: ' . print_r($parsed_block['attrs'] ?? [], true));
		}

		// Всегда используем PHP render (он обрабатывает оба режима)
		$render_path = self::getBasePath() . '/build/blocks/accordion/render.php';
		if (file_exists($render_path)) {
			// Передаем атрибуты и блок в render.php
			$attributes = $parsed_block['attrs'] ?? [];
			$content = $parsed_block['innerHTML'] ?? '';
			$block_instance = new \WP_Block($parsed_block);

			// Отладка
			if (defined('WP_DEBUG') && WP_DEBUG) {
				error_log('[Accordion Pre-Render] Render path exists: ' . $render_path);
				error_log('[Accordion Pre-Render] Attributes: ' . print_r($attributes, true));
				error_log('[Accordion Pre-Render] Mode: ' . ($attributes['mode'] ?? 'not set'));
			}

			// Передаем переменные в область видимости render.php
			extract([
				'attributes' => $attributes,
				'content' => $content,
				'block' => $block_instance,
			], EXTR_SKIP);

			ob_start();
			// Передаем переменные в render.php
			require $render_path;
			$rendered = ob_get_clean();

			// Отладка
			if (defined('WP_DEBUG') && WP_DEBUG) {
				error_log('[Accordion Pre-Render] Rendered output length: ' . strlen($rendered));
				error_log('[Accordion Pre-Render] Rendered output preview: ' . substr($rendered, 0, 200));
			}

			return $rendered;
		} else {
			if (defined('WP_DEBUG') && WP_DEBUG) {
				error_log('[Accordion Pre-Render] Render path NOT found: ' . $render_path);
			}
		}

		return $pre_render;
	}

	/**
	 * Pre-render lists block conditionally based on mode
	 * Always uses PHP render for both modes (Post and Custom)
	 */
	public static function pre_render_lists_block($pre_render, $parsed_block) {
		// Проверяем, что это блок lists
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/lists') {
			return $pre_render;
		}

		// Всегда используем PHP render (он обрабатывает оба режима)
		$render_path = self::getBasePath() . '/build/blocks/lists/render.php';
		if (file_exists($render_path)) {
			// Передаем атрибуты и блок в render.php
			$attributes = $parsed_block['attrs'] ?? [];
			$content = $parsed_block['innerHTML'] ?? '';
			$block_instance = new \WP_Block($parsed_block);

			// Передаем переменные в область видимости render.php
			extract([
				'attributes' => $attributes,
				'content' => $content,
				'block' => $block_instance,
			], EXTR_SKIP);

			ob_start();
			require $render_path;
			$rendered = ob_get_clean();

			return $rendered;
		}

		return $pre_render;
	}

	/**
	 * Pre-render menu block conditionally based on mode
	 * Always uses PHP render for both modes (WP Menu and Custom)
	 */
	public static function pre_render_menu_block($pre_render, $parsed_block) {
		// Проверяем, что это блок menu
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/menu') {
			return $pre_render;
		}

		// Всегда используем PHP render (он обрабатывает оба режима)
		$render_path = self::getBasePath() . '/build/blocks/menu/render.php';
		if (file_exists($render_path)) {
			// Передаем атрибуты и блок в render.php
			$attributes = $parsed_block['attrs'] ?? [];
			$content = $parsed_block['innerHTML'] ?? '';
			$block_instance = new \WP_Block($parsed_block);

			// Передаем переменные в область видимости render.php
			extract([
				'attributes' => $attributes,
				'content' => $content,
				'block' => $block_instance,
			], EXTR_SKIP);

			ob_start();
			require $render_path;
			$rendered = ob_get_clean();

			return $rendered;
		}

		return $pre_render;
	}

	/**
	 * Pre-render avatar block conditionally based on avatarType
	 * Uses PHP render when avatarType is 'user' or 'staff' to get fresh data
	 */
	public static function pre_render_avatar_block($pre_render, $parsed_block) {
		// Проверяем, что это блок avatar
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/avatar') {
			return $pre_render;
		}

		$attributes = $parsed_block['attrs'] ?? [];
		$avatar_type = $attributes['avatarType'] ?? 'letters';

		// Используем PHP render для режимов 'user' и 'staff'
		if ($avatar_type === 'user' || $avatar_type === 'staff') {
			$render_path = self::getBasePath() . '/build/blocks/avatar/render.php';
			if (file_exists($render_path)) {
				$content = $parsed_block['innerHTML'] ?? '';
				$block_instance = new \WP_Block($parsed_block);

				// Передаем переменные в область видимости render.php
				extract([
					'attributes' => $attributes,
					'content' => $content,
					'block' => $block_instance,
				], EXTR_SKIP);

				ob_start();
				require $render_path;
				$rendered = ob_get_clean();

				return $rendered;
			}
		}

		return $pre_render;
	}

	public static function gutenbergBlocksInit(): void {
		$blocks_path = self::getBasePath() . '/build/blocks/';
		$lang_path = self::getBasePath() . '/languages';

		// Фильтр для перевода метаданных блоков (title, description)
		add_filter('block_type_metadata_settings', [__CLASS__, 'translate_block_metadata'], 10, 2);

		// Tabulator for tabulator block - register early so block can depend on it
		$tabulator_base = rtrim(self::getBaseUrl(), '/') . '/assets/vendor/tabulator/';
		wp_register_style(
			'tabulator-editor',
			$tabulator_base . 'tabulator_midnight.min.css',
			[],
			'6.3.0'
		);
		wp_register_style(
			'tabulator-editor-modern',
			$tabulator_base . 'tabulator_modern.min.css',
			[],
			'6.3.0'
		);
		wp_register_style(
			'tabulator-editor-default',
			$tabulator_base . 'tabulator.min.css',
			[],
			'6.3.0'
		);
		wp_register_script(
			'tabulator-editor',
			$tabulator_base . 'tabulator.min.js',
			[],
			'6.3.0',
			false
		);

		foreach (self::getBlocksName() as $block_name) {
			$block_args = [];
			if (in_array($block_name, ['blog-post-widget', 'blog-category-widget', 'blog-tag-widget', 'blog-year-widget'], true)) {
				$render_path = self::getBasePath() . '/build/blocks/' . $block_name . '/render.php';
				if (file_exists($render_path)) {
					$block_args['render_callback'] = function ($attributes, $content, $block) use ($render_path) {
						ob_start();
						extract([
							'attributes' => $attributes,
							'content'    => $content,
							'block'      => $block,
						], EXTR_SKIP);
						require $render_path;
						return ob_get_clean();
					};
				}
			}
			$block_type = register_block_type($blocks_path . $block_name, $block_args);

			// Устанавливаем переводы СРАЗУ после успешной регистрации
			if ($block_type) {
				$script_handle = 'codeweber-blocks-' . $block_name . '-editor-script';

				// Tabulator block: add tabulator-editor as dependency
				if ($block_name === 'tabulator') {
					global $wp_scripts;
					if (isset($wp_scripts->registered[$script_handle])) {
						$wp_scripts->registered[$script_handle]->deps[] = 'tabulator-editor';
					}
				}

				// Avatar block: pass placeholder image URL for editor when user/staff has no photo
				if ($block_name === 'avatar') {
					wp_localize_script($script_handle, 'cwgbAvatarPlaceholderUrl', [
						'url' => get_template_directory_uri() . '/dist/assets/img/avatar-placeholder.jpg',
					]);
				}

				// Search block: pass public post types (theme + active theme CPT) for Post types dropdown
				if ($block_name === 'search') {
					$search_excluded = [
						'attachment', 'wp_block', 'wp_template', 'wp_template_part', 'wp_navigation',
						'nav_menu_item', 'wp_global_styles', 'wp_font_family', 'wp_font_face',
						'html_blocks', 'modal', 'header', 'footer', 'page-header', 'codeweber_form', 'cw_image_hotspot',
					];
					$pt_objects = get_post_types(['public' => true], 'objects');
					$search_post_types = [];
					foreach ($pt_objects as $pt => $obj) {
						if (in_array($pt, $search_excluded, true)) {
							continue;
						}
						$search_post_types[] = ['value' => $pt, 'label' => ! empty($obj->labels->name) ? $obj->labels->name : $pt];
					}
					wp_localize_script($script_handle, 'cwgbSearchPostTypes', ['postTypes' => $search_post_types]);
				}

				// Проверяем что скрипт действительно зарегистрирован
				global $wp_scripts;
				if (isset($wp_scripts->registered[$script_handle])) {
					$result = wp_set_script_translations(
						$script_handle,
						'codeweber-gutenberg-blocks',
						$lang_path
					);

					// Debug log
					if (defined('WP_DEBUG') && WP_DEBUG) {
						error_log("[$block_name] Translation setup: " . ($result ? 'SUCCESS' : 'FAILED') . " for $script_handle");
					}
				}
			}
		}
	}

	/**
	 * Translate block metadata (title, description) from block.json
	 */
	public static function translate_block_metadata($settings, $metadata) {
		// Переводим только блоки нашего плагина
		if (!isset($metadata['name']) || strpos($metadata['name'], 'codeweber-blocks/') !== 0) {
			return $settings;
		}

		// Переводим title
		if (isset($settings['title']) && !empty($settings['title'])) {
			$settings['title'] = __($settings['title'], 'codeweber-gutenberg-blocks');
		}

		// Переводим description
		if (isset($settings['description']) && !empty($settings['description'])) {
			$settings['description'] = __($settings['description'], 'codeweber-gutenberg-blocks');
		}

		return $settings;
	}

	/**
	 * Loads JavaScript translations for Gutenberg blocks.
	 */
	public static function loadJSTranslations(): void {
		// Загружаем переводы для всех скриптов блоков
		// WordPress автоматически генерирует handle: {namespace}-{block-name}-editor-script
		$blocks = [
			'accordion',
			'banners',
			'media',
			'image-simple',
			'button',
			'card',
			'column',
			'columns',
			'feature',
			'features',
			'heading-subtitle',
			'icon',
			'paragraph',
			'blockquote',
			'dropcap',
			'section',
			'post-grid',
			'yandex-map',
			'swiper',
			'group-button',
			'cta',
		];

		foreach ($blocks as $block_name) {
			$script_handle = 'codeweber-blocks-' . $block_name . '-editor-script';

			// Проверяем что скрипт зарегистрирован
			if (wp_script_is($script_handle, 'registered') || wp_script_is($script_handle, 'enqueued')) {
				$result = wp_set_script_translations(
					$script_handle,
					'codeweber-gutenberg-blocks',
					self::getBasePath() . '/languages'
				);

				// Debug
				if (defined('WP_DEBUG') && WP_DEBUG) {
					error_log("Translation set for $script_handle: " . ($result ? 'SUCCESS' : 'FAILED'));
				}
			}
		}
	}

	/**
	 * Pass locale to features block
	 */
	public static function gutenbergBlocksRegisterCategory($categories, $post): array {
		return [
			[
				'slug'  => 'codeweber-gutenberg-blocks',
				'title' => __('Codeweber Gutenberg Blocks', Plugin::L10N),
			],
			[
				'slug'  => 'codeweber-gutenberg-elements',
				'title' => __('Codeweber Gutenberg Elements', Plugin::L10N),
			],
			[
				'slug'  => 'codeweber-gutenberg-widgets',
				'title' => __('Widgets Codeweber Gutenberg', Plugin::L10N),
			],
			...$categories,
		];
	}

	public static function gutenbergBlocksExternalLibraries() {
		wp_enqueue_script(
			'gutenberg-blocks-lib',
			GUTENBERG_BLOCKS_INC_URL . 'js/pluign.js',
			[],
			GUTENBERG_BLOCKS_VERSION,
			TRUE
		);

		// Load More functionality
		// Dependencies: fetch-handler from theme (if available) for Fetch system support
		$dependencies = [];
		if (wp_script_is('fetch-handler', 'registered')) {
			$dependencies[] = 'fetch-handler';
		}

		wp_enqueue_script(
			'codeweber-blocks-load-more',
			GUTENBERG_BLOCKS_INC_URL . 'js/load-more.js',
			$dependencies,
			GUTENBERG_BLOCKS_VERSION,
			TRUE
		);

		// Убеждаемся, что переводы загружены перед локализацией
		if (!is_textdomain_loaded('codeweber-gutenberg-blocks')) {
			self::loadTextDomain();
		}

		// Localize script for Load More
		wp_localize_script('codeweber-blocks-load-more', 'cwgbLoadMore', [
			'restUrl' => rest_url('codeweber-gutenberg-blocks/v1/load-more'),
			'nonce' => wp_create_nonce('wp_rest'),
			'loadingText' => esc_html__('Loading...', 'codeweber-gutenberg-blocks'),
		]);
	}

	/**
	 * Register REST API endpoint for image sizes
	 */
	public static function register_image_sizes_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/image-sizes', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_image_sizes_callback',
			'permission_callback' => '__return_true',
			'args' => [
				'post_type' => [
					'required' => false,
					'sanitize_callback' => 'sanitize_key',
				],
			],
		]);
	}

	/**
	 * REST API callback for getting image sizes
	 */
	public static function get_image_sizes_callback($request) {
		$post_type = $request->get_param('post_type');
		$image_sizes = [];
		$all_sizes = [];

		// Получаем все intermediate размеры (исключая удаленные)
		$intermediate_sizes = get_intermediate_image_sizes();

		// Добавляем стандартные размеры WordPress (если они не удалены)
		foreach (['thumbnail', 'medium', 'medium_large', 'large'] as $size) {
			if (in_array($size, $intermediate_sizes)) {
				$width = get_option($size . '_size_w');
				$height = get_option($size . '_size_h');

				if ($width || $height) {
					$all_sizes[$size] = [
						'width' => $width,
						'height' => $height,
						'crop' => get_option($size . '_crop'),
					];
				}
			}
		}

		// Добавляем все кастомные размеры из темы
		if (isset($GLOBALS['_wp_additional_image_sizes'])) {
			foreach ($GLOBALS['_wp_additional_image_sizes'] as $size_key => $size_info) {
				// Проверяем, что размер не был удален
				if (in_array($size_key, $intermediate_sizes)) {
					$all_sizes[$size_key] = $size_info;
				}
			}
		}

		// Формируем массив для REST API
		foreach ($all_sizes as $size_key => $size_info) {
			$width = isset($size_info['width']) ? intval($size_info['width']) : null;
			$height = isset($size_info['height']) ? intval($size_info['height']) : null;

			// Пропускаем размеры без параметров
			if (!$width && !$height) {
				continue;
			}

			$size_data = [
				'value' => $size_key,
				'label' => ucfirst(str_replace(['_', '-'], ' ', $size_key)),
				'width' => $width,
				'height' => $height,
			];

			// Create label with dimensions
			if ($width && $height) {
				$size_data['label'] = sprintf(
					'%s (%dx%d)',
					ucfirst(str_replace(['_', '-'], ' ', $size_key)),
					$width,
					$height
				);
			} elseif ($width) {
				$size_data['label'] = sprintf(
					'%s (%dpx width)',
					ucfirst(str_replace(['_', '-'], ' ', $size_key)),
					$width
				);
			} elseif ($height) {
				$size_data['label'] = sprintf(
					'%s (%dpx height)',
					ucfirst(str_replace(['_', '-'], ' ', $size_key)),
					$height
				);
			}

			$image_sizes[] = $size_data;
		}

		// Если передан post_type, фильтруем размеры по разрешенным для этого типа записи
		if ($post_type && function_exists('codeweber_get_allowed_image_sizes')) {
			$allowed_sizes = codeweber_get_allowed_image_sizes($post_type);

			// Если есть разрешенные размеры, фильтруем список
			if (!empty($allowed_sizes) && is_array($allowed_sizes)) {
				// Всегда добавляем 'full' в разрешенные размеры
				$allowed_sizes[] = 'full';
				$image_sizes = array_filter($image_sizes, function($size) use ($allowed_sizes) {
					return in_array($size['value'], $allowed_sizes, true);
				});
				// Переиндексируем массив после фильтрации
				$image_sizes = array_values($image_sizes);
			}
		} elseif ($post_type) {
			// Если функция не доступна, но post_type передан, логируем для отладки
			if (defined('WP_DEBUG') && WP_DEBUG) {
				error_log('codeweber_get_allowed_image_sizes function not found for post_type: ' . $post_type);
			}
		}

		// Сортируем по имени для удобства
		usort($image_sizes, function($a, $b) {
			return strcmp($a['label'], $b['label']);
		});

		return new \WP_REST_Response($image_sizes, 200);
	}

	/**
	 * Register REST API endpoint for taxonomies and terms
	 */
	public static function register_taxonomies_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/taxonomies/(?P<post_type>[a-zA-Z0-9_-]+)', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_taxonomies_callback',
			'permission_callback' => '__return_true',
			'args' => [
				'post_type' => [
					'required' => true,
					'sanitize_callback' => 'sanitize_key',
				],
			],
		]);
	}

	/**
	 * REST API callback for getting taxonomies and terms for a post type
	 */
	public static function get_taxonomies_callback($request) {
		$post_type = $request->get_param('post_type');

		if (empty($post_type)) {
			return new \WP_Error('missing_post_type', 'Post type is required', ['status' => 400]);
		}

		// Получаем все таксономии для данного типа записи
		$taxonomies = get_object_taxonomies($post_type, 'objects');

		$result = [];

		foreach ($taxonomies as $taxonomy_slug => $taxonomy) {
			// Пропускаем скрытые таксономии (но показываем если show_ui = true)
			if (!$taxonomy->show_ui) {
				continue;
			}

			// Получаем все термины для этой таксономии
			$terms = get_terms([
				'taxonomy' => $taxonomy_slug,
				'hide_empty' => false,
			]);

			if (is_wp_error($terms)) {
				error_log('TaxonomyFilterControl: Error getting terms for ' . $taxonomy_slug . ': ' . $terms->get_error_message());
				continue;
			}

			$terms_data = [];
			foreach ($terms as $term) {
				$terms_data[] = [
					'id' => $term->term_id,
					'slug' => $term->slug,
					'name' => $term->name,
					'count' => $term->count,
				];
			}

			// Получаем rest_base для REST API (может отличаться от slug)
			$rest_base = !empty($taxonomy->rest_base) ? $taxonomy->rest_base : $taxonomy_slug;

			$result[] = [
				'slug' => $taxonomy_slug,
				'rest_base' => $rest_base,
				'name' => $taxonomy->label,
				'singular_name' => $taxonomy->labels->singular_name,
				'terms' => $terms_data,
			];
		}

		return new \WP_REST_Response($result, 200);
	}

	/**
	 * Register REST API endpoint for accordion posts (using WP_Query)
	 */
	public static function register_accordion_posts_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/accordion-posts', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_accordion_posts_callback',
			'permission_callback' => '__return_true',
			'args' => [
				'post_type' => [
					'required' => true,
					'sanitize_callback' => 'sanitize_key',
				],
				'selected_taxonomies' => [
					'required' => false,
					'type' => 'string',
					'default' => '{}',
				],
				'orderby' => [
					'required' => false,
					'sanitize_callback' => 'sanitize_key',
					'default' => 'date',
				],
				'order' => [
					'required' => false,
					'sanitize_callback' => 'sanitize_text_field',
					'default' => 'desc',
				],
			],
		]);
	}

	/**
	 * REST API callback for getting posts for accordion (using WP_Query like render.php)
	 */
	public static function get_accordion_posts_callback($request) {
		$post_type = $request->get_param('post_type');
		$selected_taxonomies_json = $request->get_param('selected_taxonomies');
		$orderby = $request->get_param('orderby') ?: 'date';
		$order = $request->get_param('order') ?: 'desc';

		if (empty($post_type)) {
			return new \WP_Error('missing_post_type', 'Post type is required', ['status' => 400]);
		}

		// Парсим selected_taxonomies из JSON
		$selected_taxonomies = [];
		if (!empty($selected_taxonomies_json)) {
			$decoded = json_decode($selected_taxonomies_json, true);
			if (is_array($decoded)) {
				$selected_taxonomies = $decoded;
			}
		}

		// Используем тот же WP_Query, что и в render.php
		$queryArgs = array(
			'post_type' => $post_type,
			'posts_per_page' => 10,
			'post_status' => 'publish',
			'orderby' => $orderby,
			'order' => strtoupper($order),
		);

		// Добавляем фильтрацию по таксономиям, если выбраны термины
		if (!empty($selected_taxonomies) && is_array($selected_taxonomies)) {
			$taxQuery = array('relation' => 'AND');

			foreach ($selected_taxonomies as $taxonomySlug => $termIds) {
				if (!empty($termIds) && is_array($termIds)) {
					$taxQuery[] = array(
						'taxonomy' => $taxonomySlug,
						'field' => 'term_id',
						'terms' => array_map('intval', $termIds),
						'operator' => 'IN',
					);
				}
			}

			if (count($taxQuery) > 1) { // Если есть хотя бы одна таксономия с терминами
				$queryArgs['tax_query'] = $taxQuery;
			}
		}

		// Выполняем запрос
		$query = new \WP_Query($queryArgs);

		$posts = [];

		if ($query->have_posts()) {
			$index = 0;
			while ($query->have_posts()) {
				$query->the_post();
				$postId = get_the_ID();

				// Получаем контент поста (как в render.php)
				$postTitle = get_the_title();
				$postContent = '';

				// Пытаемся получить excerpt
				if (has_excerpt()) {
					$postContent = get_the_excerpt();
				} else {
					// Берем первые 200 символов из content
					$content = get_the_content();
					$content = strip_tags($content);
					$content = str_replace('&nbsp;', ' ', $content);
					$content = trim($content);
					$postContent = mb_substr($content, 0, 200);
					if (mb_strlen($content) > 200) {
						$postContent .= '...';
					}
				}

				// Если контент пустой, используем заглушку
				if (empty($postContent)) {
					$postContent = __('No content available', 'codeweber-gutenberg-blocks');
				}

				$posts[] = array(
					'id' => $postId,
					'title' => $postTitle,
					'content' => $postContent,
				);

				$index++;
			}
			wp_reset_postdata();
		}

		return new \WP_REST_Response($posts, 200);
	}

	/**
	 * Register REST API endpoint for archive URLs
	 */
	public static function register_archive_urls_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/archive-url', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_archive_url_callback',
			'permission_callback' => '__return_true',
			'args' => [
				'type' => [
					'required' => true,
					'type' => 'string',
					'enum' => ['post_type', 'taxonomy'],
				],
				'post_type' => [
					'required' => false,
					'type' => 'string',
				],
				'taxonomy' => [
					'required' => false,
					'type' => 'string',
				],
				'term_id' => [
					'required' => false,
					'type' => 'integer',
				],
			],
		]);
	}

	/**
	 * REST API callback for getting archive URL
	 */
	public static function get_archive_url_callback($request) {
		$type = $request->get_param('type');
		$url = '';

		if ($type === 'post_type') {
			$post_type = $request->get_param('post_type');
			if ($post_type) {
				$url = get_post_type_archive_link($post_type);
			}
		} elseif ($type === 'taxonomy') {
			$taxonomy = $request->get_param('taxonomy');
			$term_id = $request->get_param('term_id');
			if ($taxonomy && $term_id) {
				$term = get_term($term_id, $taxonomy);
				if ($term && !is_wp_error($term)) {
					$url = get_term_link($term);
				}
			}
		}

		if (empty($url) || is_wp_error($url)) {
			return new \WP_Error('invalid_archive', 'Could not generate archive URL', ['status' => 400]);
		}

		return new \WP_REST_Response(['url' => $url], 200);
	}

	/**
	 * Register REST API endpoint for logos
	 */
	public static function register_logos_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/logos', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_logos_callback',
			'permission_callback' => '__return_true',
		]);
	}

	/**
	 * REST API callback for getting logos
	 */
	public static function get_logos_callback($request) {
		global $opt_name;
		$options = get_option($opt_name ?: 'redux_demo');

		// Получаем ID текущего поста из параметра или из контекста
		$post_id = $request->get_param('post_id');
		if (!$post_id) {
			$post_id = get_the_ID();
		}

		// Проверяем кастомные логотипы для поста
		$custom_dark_logo = $post_id ? get_post_meta($post_id, 'custom-logo-dark-header', true) : null;
		$custom_light_logo = $post_id ? get_post_meta($post_id, 'custom-logo-light-header', true) : null;

		$default_logos = [
			'light' => get_template_directory_uri() . '/dist/assets/img/logo-light.png',
			'dark'  => get_template_directory_uri() . '/dist/assets/img/logo-dark.png',
		];

		// Получаем URL логотипов
		$dark_logo = !empty($custom_dark_logo['url'])
			? $custom_dark_logo['url']
			: (!empty($options['opt-dark-logo']['url']) ? $options['opt-dark-logo']['url'] : $default_logos['dark']);

		$light_logo = !empty($custom_light_logo['url'])
			? $custom_light_logo['url']
			: (!empty($options['opt-light-logo']['url']) ? $options['opt-light-logo']['url'] : $default_logos['light']);

		return [
			'dark' => esc_url($dark_logo),
			'light' => esc_url($light_logo),
		];
	}

	/**
	 * Loads the plugin text domain.
	 */
	public static function loadTextDomain(): void {
		load_plugin_textdomain(
			static::L10N,
			false,
			basename(self::getBasePath()) . '/languages/'
		);
	}

	/**
	 * The base URL path to this plugin's folder.
	 *
	 * Uses plugins_url() instead of plugin_dir_url() to avoid a trailing slash.
	 */
	public static function getBaseUrl(): string {
		if (!isset(static::$baseUrl)) {
			static::$baseUrl = plugins_url('', static::getBasePath() . '/plugin.php');
		}
		return static::$baseUrl;
	}

	/**
	 * The absolute filesystem base path of this plugin.
	 *
	 * @return string
	 */
	public static function getBasePath(): string {
		return dirname(__DIR__);
	}

	/**
	 * Enqueue FilePond library and initialization script
	 */
	public static function enqueue_filepond() {
		// Check if already enqueued
		if (wp_script_is('filepond', 'enqueued')) {
			return;
		}

		$css_url = self::getBaseUrl() . '/assets/filepond/filepond.min.css';
		$js_url = self::getBaseUrl() . '/assets/filepond/filepond.min.js';
		$init_url = self::getBaseUrl() . '/includes/js/filepond-init.js';


		// Enqueue FilePond CSS
		wp_enqueue_style(
			'filepond',
			$css_url,
			[],
			'4.30.0'
		);

		// Enqueue FilePond JS
		wp_enqueue_script(
			'filepond',
			$js_url,
			[],
			'4.30.0',
			true
		);

		// Enqueue FilePond initialization script
		// Добавляем timestamp для обхода кеша браузера
		$init_file_path = self::getBasePath() . '/includes/js/filepond-init.js';
		$init_version = file_exists($init_file_path) ? filemtime($init_file_path) : GUTENBERG_BLOCKS_VERSION;
		wp_enqueue_script(
			'filepond-init',
			$init_url,
			['filepond'],
			$init_version,
			true
		);

		// Localize script if needed
		wp_localize_script('filepond-init', 'filepondSettings', [
			'uploadUrl' => rest_url('codeweber-forms/v1/upload'),
			'nonce' => wp_create_nonce('wp_rest'),
			'translations' => [
				'labelIdle' => __('Drag & drop your files or <span class="filepond--label-action">browse</span>', 'codeweber-gutenberg-blocks'),
				'maxFiles' => __('Maximum number of files: %s. Please remove excess files.', 'codeweber-gutenberg-blocks'),
				'fileTooLarge' => __('File is too large. Maximum size: %s', 'codeweber-gutenberg-blocks'),
				'totalSizeTooLarge' => __('Total file size is too large. Maximum: %s', 'codeweber-gutenberg-blocks'),
				'errorUploading' => __('Error uploading file', 'codeweber-gutenberg-blocks'),
				'errorAddingFile' => __('Error adding file', 'codeweber-gutenberg-blocks'),
				'filesRemoved' => __('Maximum number of files: %s. Files removed: %s', 'codeweber-gutenberg-blocks'),
				'totalSizeExceeded' => __('Total file size exceeded. Maximum: %s', 'codeweber-gutenberg-blocks'),
				'uploadComplete' => __('Upload complete', 'codeweber-gutenberg-blocks'),
				'tapToUndo' => __('Tap to undo', 'codeweber-gutenberg-blocks'),
				'uploading' => __('Uploading', 'codeweber-gutenberg-blocks'),
				'tapToCancel' => __('tap to cancel', 'codeweber-gutenberg-blocks'),
			]
		]);

	}

	/**
	 * Pre-render file field block to conditionally load FilePond
	 */
	public static function pre_render_file_field($pre_render, $parsed_block) {
		// Check if this is a form-field block
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/form-field') {
			return $pre_render;
		}

		$attrs = $parsed_block['attrs'] ?? [];
		$fieldType = $attrs['fieldType'] ?? '';

		// FilePond всегда используется для полей типа file
		if ($fieldType === 'file') {
			self::enqueue_filepond();
		}

		// Also check inner blocks (for form blocks containing form-field blocks)
		if (isset($parsed_block['innerBlocks']) && is_array($parsed_block['innerBlocks'])) {
			foreach ($parsed_block['innerBlocks'] as $inner_block) {
				if (isset($inner_block['blockName']) && $inner_block['blockName'] === 'codeweber-blocks/form-field') {
					$inner_attrs = $inner_block['attrs'] ?? [];
					$inner_fieldType = $inner_attrs['fieldType'] ?? '';
					// FilePond всегда используется для полей типа file

					if ($inner_fieldType === 'file') {
						self::enqueue_filepond();
						break; // No need to check further
					}
				}
			}
		}

		return $pre_render;
	}

	/**
	 * Pre-render form-field block with inline button
	 * Uses PHP render when enableInlineButton is true
	 */
	public static function pre_render_form_field_inline_button($pre_render, $parsed_block) {
		// Check if this is a form-field block
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/form-field') {
			return $pre_render;
		}

		$attributes = $parsed_block['attrs'] ?? [];
		$enable_inline_button = isset($attributes['enableInlineButton']) && ($attributes['enableInlineButton'] === true || $attributes['enableInlineButton'] === 'true' || $attributes['enableInlineButton'] === 1);
		$field_type = $attributes['fieldType'] ?? 'text';
		$inline_button_supported_types = ['text', 'email', 'tel', 'url', 'number', 'date', 'time', 'author_role', 'company'];
		$inline_button_enabled = $enable_inline_button && in_array($field_type, $inline_button_supported_types) && $field_type !== 'newsletter';


		// Use PHP render for fields with inline button
		if ($inline_button_enabled) {
			$render_path = self::getBasePath() . '/build/blocks/form-field/render.php';
			if (file_exists($render_path)) {
				$content = $parsed_block['innerHTML'] ?? '';
				$block_instance = new \WP_Block($parsed_block);

				// Get context from parent block if available
				$context = [];
				if (isset($parsed_block['blockContext'])) {
					$context = $parsed_block['blockContext'];
				}

				// Pass variables to render.php scope
				extract([
					'attributes' => $attributes,
					'content' => $content,
					'block' => $block_instance,
					'context' => $context,
				], EXTR_SKIP);


				ob_start();
				require $render_path;
				$rendered = ob_get_clean();


				return $rendered;
			}
		}

		return $pre_render;
	}

	/**
	 * Pre-render html-blocks block
	 * Always uses PHP render
	 */
	public static function pre_render_html_blocks_block($pre_render, $parsed_block) {
		// Проверяем, что это блок html-blocks
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/html-blocks') {
			return $pre_render;
		}

		// Всегда используем PHP render
		$render_path = self::getBasePath() . '/build/blocks/html-blocks/render.php';
		if (file_exists($render_path)) {
			// Передаем атрибуты и блок в render.php
			$attributes = $parsed_block['attrs'] ?? [];
			$content = $parsed_block['innerHTML'] ?? '';
			$block_instance = new \WP_Block($parsed_block);

			// Передаем переменные в область видимости render.php
			extract([
				'attributes' => $attributes,
				'content' => $content,
				'block' => $block_instance,
				'parsed_block' => $parsed_block,
			], EXTR_SKIP);

			ob_start();
			require $render_path;
			$rendered = ob_get_clean();

			return $rendered;
		}

		return $pre_render;
	}

	/**
	 * Register REST API endpoint for contacts
	 */
	public static function register_contacts_endpoint() {
		// #region agent log
		$log_entry = json_encode(['location' => 'Plugin.php:1152', 'message' => 'register_contacts_endpoint called', 'data' => [], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'ALL']);
		@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
		error_log('DEBUG: register_contacts_endpoint called');
		// #endregion

		register_rest_route('codeweber-gutenberg-blocks/v1', '/contacts', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_contacts_callback',
			'permission_callback' => '__return_true',
		]);

	}

	/**
	 * Register REST API endpoint for sidebars list (navbar widget areas)
	 */
	public static function register_sidebars_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/sidebars', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_sidebars_callback',
			'permission_callback' => '__return_true',
		]);
	}

	/**
	 * REST: list of registered sidebars (id, name)
	 */
	public static function get_sidebars_callback() {
		global $wp_registered_sidebars;
		$list = [
			['value' => '', 'label' => __('— None —', 'codeweber-gutenberg-blocks')],
		];
		if (is_array($wp_registered_sidebars)) {
			foreach ($wp_registered_sidebars as $id => $sidebar) {
				$list[] = [
					'value' => $id,
					'label' => isset($sidebar['name']) ? $sidebar['name'] : $id,
				];
			}
		}
		return new \WP_REST_Response(['sidebars' => $list], 200);
	}

	/**
	 * Register REST API endpoint for social-icons block preview (same HTML as frontend)
	 */
	public static function register_social_icons_preview_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/social-icons-preview', [
			'methods' => 'POST',
			'callback' => __CLASS__ . '::social_icons_preview_callback',
			'permission_callback' => '__return_true',
			'args' => [
				'attributes' => [
					'required' => false,
					'type' => 'object',
					'default' => [],
				],
			],
		]);
		register_rest_route('codeweber-gutenberg-blocks/v1', '/social-icons-list', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::social_icons_list_callback',
			'permission_callback' => '__return_true',
		]);
	}

	/**
	 * REST: list of social networks from theme (get_option('socials_urls')) with non-empty URL
	 */
	public static function social_icons_list_callback() {
		$socials = get_option('socials_urls');
		if (!is_array($socials)) {
			return new \WP_REST_Response(['socials' => []], 200);
		}
		$list = [];
		foreach ($socials as $slug => $url) {
			if ($url !== '' && $url !== null) {
				$label = $slug;
				if (strpos(strtolower($label), 'vk') === 0) {
					$label = strtoupper(substr($label, 0, 2)) . substr($label, 2);
				} else {
					$label = ucfirst($label);
				}
				$list[] = ['slug' => $slug, 'url' => $url, 'label' => $label];
			}
		}
		return new \WP_REST_Response(['socials' => $list], 200);
	}

	/**
	 * Render social icons HTML from theme Redux (get_option('socials_urls')).
	 * Same output as Social Icons block in theme mode. Used by navbar block.
	 *
	 * @param string $style_type   type1-type9
	 * @param string $size         xs|sm|md|lg|elg
	 * @param string $button_color primary etc
	 * @param string $button_style solid|outline
	 * @param string $button_form  circle|block
	 * @param string $nav_class    extra nav classes
	 * @param array  $enabled_slugs only show these slugs; empty = all
	 * @return string HTML or empty
	 */
	public static function render_social_from_theme($style_type = 'type1', $size = 'sm', $button_color = 'primary', $button_style = 'solid', $button_form = 'circle', $nav_class = '', $enabled_slugs = []) {
		$socials_raw = get_option('socials_urls');
		if (!is_array($socials_raw)) {
			return '';
		}
		$socials_filtered = $socials_raw;
		if (!empty($enabled_slugs)) {
			$socials_filtered = array_intersect_key($socials_raw, array_flip($enabled_slugs));
		}
		$socials_filtered = array_filter($socials_filtered, function ($u) {
			return $u !== '' && $u !== null;
		});
		if (empty($socials_filtered)) {
			return function_exists('social_links') ? social_links($nav_class, $style_type, $size, $button_color, $button_style, $button_form) : '';
		}
		$size_classes = [
			'xs'  => ['fs-30', 'btn-xs'],
			'sm'  => ['', 'btn-sm'],
			'md'  => ['fs-45', 'btn-md'],
			'lg'  => ['fs-60', 'btn-lg'],
			'elg' => ['fs-60', 'btn-elg'],
		];
		$btn_size_class = isset($size_classes[ $size ][1]) ? $size_classes[ $size ][1] : 'btn-md';
		$btn_form_class = ($button_form === 'block') ? 'btn-block' : 'btn-circle';
		$nav_class_base = 'nav social gap-2';
		if ($style_type === 'type2') {
			$nav_class_base .= ' social-muted';
		} elseif ($style_type === 'type4') {
			$nav_class_base .= ' social-white';
		} elseif ($style_type === 'type7') {
			$nav_class_base = 'nav gap-2 social-white';
		}
		if ($nav_class !== '') {
			$nav_class_base .= ' ' . $nav_class;
		}
		if ($style_type === 'type8' || $style_type === 'type9') {
			$nav_class_base = 'nav gap-2' . ($nav_class !== '' ? ' ' . $nav_class : '');
		}
		$out = '<nav class="' . esc_attr(trim($nav_class_base)) . '">';
		foreach ($socials_filtered as $social => $url) {
			$original_social = $social;
			switch ($social) {
				case 'telegram': $social = 'telegram-alt'; break;
				case 'rutube': $social = 'rutube-1'; break;
				case 'github': $social = 'github-alt'; break;
				case 'ok': $social = 'ok-1'; break;
				case 'vkmusic': $social = 'vk-music'; break;
				case 'tik-tok': $social = 'tiktok'; break;
				case 'googledrive': $social = 'google-drive'; break;
				case 'googleplay': $social = 'google-play'; break;
				case 'odnoklassniki': $social = 'square-odnoklassniki'; break;
			}
			$icon_class = 'uil uil-' . esc_attr($social);
			$label = $original_social;
			$btnlabel = (stripos($label, 'vk') === 0) ? strtoupper(substr($label, 0, 2)) . substr($label, 2) : ucfirst($label);
			if ($style_type === 'type1') {
				$out .= '<a href="' . esc_url($url) . '" class="btn ' . esc_attr($btn_form_class) . ' has-ripple ' . esc_attr($btn_size_class) . ' btn-' . esc_attr($social) . '" target="_blank" rel="noopener"><i class="' . $icon_class . '"></i></a>';
			} elseif ($style_type === 'type5') {
				$out .= '<a href="' . esc_url($url) . '" class="btn ' . esc_attr($btn_form_class) . ' has-ripple ' . esc_attr($btn_size_class) . ' btn-dark" target="_blank" rel="noopener"><i class="' . $icon_class . '"></i></a>';
			} elseif ($style_type === 'type2' || $style_type === 'type3' || $style_type === 'type4') {
				$out .= '<a href="' . esc_url($url) . '" class="has-ripple" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
			} elseif ($style_type === 'type6') {
				$out .= '<a role="button" href="' . esc_url($url) . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '" class="btn btn-icon ' . esc_attr($btn_size_class) . ' border btn-icon-start btn-white justify-content-between w-100 fs-16 has-ripple"><i class="fs-20 lh-1 ' . $icon_class . '"></i>' . esc_html($btnlabel) . '</a>';
			} elseif ($style_type === 'type7') {
				$out .= '<a role="button" href="' . esc_url($url) . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '" class="btn btn-icon ' . esc_attr($btn_size_class) . ' btn-icon-start btn-' . esc_attr($original_social) . ' justify-content-between w-100 has-ripple"><i class="fs-20 lh-1 ' . $icon_class . '"></i>' . esc_html($btnlabel) . '</a>';
			} elseif ($style_type === 'type8') {
				$btn_color = $button_color !== '' ? esc_attr($button_color) : 'primary';
				$bs = ($button_style === 'outline') ? 'outline' : 'solid';
				$btn_class = ($bs === 'outline') ? 'btn ' . esc_attr($btn_form_class) . ' has-ripple btn-outline-' . $btn_color . ' ' . esc_attr($btn_size_class) : 'btn ' . esc_attr($btn_form_class) . ' has-ripple btn-' . $btn_color . ' ' . esc_attr($btn_size_class);
				$out .= '<a href="' . esc_url($url) . '" class="' . $btn_class . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
			} elseif ($style_type === 'type9') {
				$btn_class = 'btn ' . esc_attr($btn_form_class) . ' has-ripple btn-outline-primary ' . esc_attr($btn_size_class);
				$out .= '<a href="' . esc_url($url) . '" class="' . $btn_class . '" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
			} else {
				$out .= '<a href="' . esc_url($url) . '" class="has-ripple" target="_blank" rel="noopener" title="' . esc_attr($label) . '"><i class="' . $icon_class . '"></i></a>';
			}
		}
		$out .= '</nav>';
		return $out;
	}

	/**
	 * REST API callback: render social-icons block HTML (same as frontend)
	 */
	public static function social_icons_preview_callback($request) {
		$attributes = $request->get_param('attributes');
		if (!is_array($attributes)) {
			$attributes = [];
		}
		$render_path = self::getBasePath() . '/build/blocks/social-icons/render.php';
		if (!file_exists($render_path)) {
			return new \WP_REST_Response(['html' => ''], 200);
		}
		ob_start();
		extract(['attributes' => $attributes, 'content' => '', 'block' => null, 'parsed_block' => null], EXTR_SKIP);
		require $render_path;
		$html = ob_get_clean();
		return new \WP_REST_Response(['html' => $html], 200);
	}

	/**
	 * REST API callback for getting contacts data
	 */
	public static function get_contacts_callback($request) {
		// #region agent log - FIRST LOG, before anything else
		error_log('DEBUG: get_contacts_callback START');
		$log_data = json_encode(['location' => 'Plugin.php:1170', 'message' => 'get_contacts_callback entry', 'data' => ['class_exists_Redux' => class_exists('\Redux'), 'abspath' => defined('ABSPATH') ? ABSPATH : 'NOT_DEFINED'], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'A']);
		if (defined('ABSPATH')) {
			@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
		}
		error_log('DEBUG: get_contacts_callback entry logged');
		// #endregion

		try {
			// Проверяем наличие Redux Framework
			if (!class_exists('\Redux')) {
				// #region agent log
				$log_data = json_encode(['location' => 'Plugin.php:1170', 'message' => 'Redux class not found', 'data' => [], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'A']);
				@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
				// #endregion
				return new \WP_REST_Response([
					'address' => [
						'legal' => '',
						'actual' => '',
					],
					'email' => '',
					'phones' => [],
				], 200);
			}

			// Получаем глобальную переменную opt_name для Redux
			global $opt_name;
			if (empty($opt_name)) {
				$opt_name = 'redux_demo';
			}
			// #region agent log
			$log_data = json_encode(['location' => 'Plugin.php:1185', 'message' => 'opt_name set', 'data' => ['opt_name' => $opt_name], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'B']);
			@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			// #endregion

			// Вспомогательная функция для получения адреса (вынесена из closure)
			// #region agent log
			$log_data = json_encode(['location' => 'Plugin.php:1196', 'message' => 'before creating get_contact_address', 'data' => ['class_exists' => class_exists('\Redux')], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'C']);
			@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			// #endregion

			$get_contact_address = function($addressType, $opt_name) {
				// #region agent log
				$log_entry = json_encode(['location' => 'Plugin.php:1200', 'message' => 'get_contact_address called', 'data' => ['addressType' => $addressType, 'opt_name' => $opt_name, 'class_exists' => class_exists('\Redux')], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'C']);
				@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
				// #endregion

				if (!class_exists('\Redux')) {
					return '';
				}

				try {
					// #region agent log
					$log_entry = json_encode(['location' => 'Plugin.php:1210', 'message' => 'inside get_contact_address try', 'data' => ['addressType' => $addressType], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'C']);
					@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
					// #endregion

					if ($addressType === 'legal') {
						// #region agent log
						$log_entry = json_encode(['location' => 'Plugin.php:1216', 'message' => 'before first Redux::get_option legal', 'data' => ['opt_name' => $opt_name], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'B']);
						@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
						// #endregion

						$country = \Redux::get_option($opt_name, 'juri-country');
						
						// #region agent log
						$log_entry = json_encode(['location' => 'Plugin.php:1222', 'message' => 'after first Redux::get_option', 'data' => ['country' => $country], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'B']);
						@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
						// #endregion

						$region = \Redux::get_option($opt_name, 'juri-region');
						$city = \Redux::get_option($opt_name, 'juri-city');
						$street = \Redux::get_option($opt_name, 'juri-street');
						$house = \Redux::get_option($opt_name, 'juri-house');
						$office = \Redux::get_option($opt_name, 'juri-office');
						$postal = \Redux::get_option($opt_name, 'juri-postal');
					} else {
						// #region agent log
						$log_entry = json_encode(['location' => 'Plugin.php:1232', 'message' => 'before first Redux::get_option actual', 'data' => ['opt_name' => $opt_name], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'B']);
						@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
						// #endregion

						$country = \Redux::get_option($opt_name, 'fact-country');
						
						// #region agent log
						$log_entry = json_encode(['location' => 'Plugin.php:1238', 'message' => 'after first Redux::get_option actual', 'data' => ['country' => $country], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'B']);
						@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
						// #endregion

						$region = \Redux::get_option($opt_name, 'fact-region');
						$city = \Redux::get_option($opt_name, 'fact-city');
						$street = \Redux::get_option($opt_name, 'fact-street');
						$house = \Redux::get_option($opt_name, 'fact-house');
						$office = \Redux::get_option($opt_name, 'fact-office');
						$postal = \Redux::get_option($opt_name, 'fact-postal');
					}

					// #region agent log
					$log_entry = json_encode(['location' => 'Plugin.php:1250', 'message' => 'address parts collected', 'data' => ['street' => $street, 'house' => $house, 'city' => $city], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'D']);
					@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
					// #endregion

					// Формируем адрес в обратном порядке: индекс, страна, регион, город, улица, дом, офис
					$address_parts = [];
					if (!empty($postal)) $address_parts[] = $postal; // Индекс в начале
					if (!empty($country)) $address_parts[] = $country;
					if (!empty($region)) $address_parts[] = $region;
					if (!empty($city)) $address_parts[] = $city;
					if (!empty($street)) $address_parts[] = $street;
					if (!empty($house)) $address_parts[] = $house;
					if (!empty($office)) $address_parts[] = $office;
					$result = implode(', ', $address_parts);
					
					// #region agent log
					$log_entry = json_encode(['location' => 'Plugin.php:1256', 'message' => 'address assembled', 'data' => ['result' => $result], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'D']);
					@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
					// #endregion

					return $result;
				} catch (\Exception $e) {
					// #region agent log
					$log_entry = json_encode(['location' => 'Plugin.php:1262', 'message' => 'get_contact_address exception', 'data' => ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(), 0, 500)], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'C']);
					@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
					// #endregion
					return '';
				} catch (\Error $e) {
					// #region agent log
					$log_entry = json_encode(['location' => 'Plugin.php:1268', 'message' => 'get_contact_address fatal error', 'data' => ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(), 0, 500)], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'C']);
					@file_put_contents(ABSPATH . '.cursor/debug.log', $log_entry . "\n", FILE_APPEND);
					// #endregion
					return '';
				}
			};

			// Локальная функция для очистки номера телефона
			$cleanNumber = function($digits) {
				return preg_replace('/\D/', '', $digits);
			};

			// Получаем данные
			// #region agent log
			$log_data = json_encode(['location' => 'Plugin.php:1230', 'message' => 'before getting addresses', 'data' => [], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'E']);
			@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			// #endregion

			$legal_address = $get_contact_address('legal', $opt_name);
			$actual_address = $get_contact_address('actual', $opt_name);
			
			// #region agent log
			$log_data = json_encode(['location' => 'Plugin.php:1236', 'message' => 'before getting email', 'data' => ['legal_address' => $legal_address, 'actual_address' => $actual_address], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'E']);
			@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			// #endregion

			// #region agent log
			$log_data = json_encode(['location' => 'Plugin.php:1264', 'message' => 'before getting email', 'data' => [], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'E']);
			@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			// #endregion

			$email = \Redux::get_option($opt_name, 'e-mail');
			
			// #region agent log
			$log_data = json_encode(['location' => 'Plugin.php:1270', 'message' => 'after getting email', 'data' => ['email' => $email], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'E']);
			@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			// #endregion

			// Получаем телефоны
			// #region agent log
			$log_data = json_encode(['location' => 'Plugin.php:1245', 'message' => 'before getting phones', 'data' => ['email' => $email], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'E']);
			@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			// #endregion

			$phones = [];
			$phone_keys = ['phone_01', 'phone_02', 'phone_03', 'phone_04', 'phone_05'];
			foreach ($phone_keys as $phone_key) {
				try {
					// #region agent log
					$log_data = json_encode(['location' => 'Plugin.php:1280', 'message' => 'before phone Redux::get_option', 'data' => ['phone_key' => $phone_key], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'B']);
					@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
					// #endregion

					$phone_value = \Redux::get_option($opt_name, $phone_key);
					
					// #region agent log
					$log_data = json_encode(['location' => 'Plugin.php:1286', 'message' => 'after phone Redux::get_option', 'data' => ['phone_key' => $phone_key, 'phone_value' => $phone_value], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'B']);
					@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
					// #endregion

					if (!empty($phone_value)) {
						$phones[$phone_key] = [
							'display' => $phone_value,
							'clean' => $cleanNumber($phone_value),
						];
					}
				} catch (\Exception $e) {
					// #region agent log
					$log_data = json_encode(['location' => 'Plugin.php:1297', 'message' => 'phone get_option exception', 'data' => ['phone_key' => $phone_key, 'error' => $e->getMessage()], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'B']);
					@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
					// #endregion
				}
			}

			// #region agent log
			$log_data = json_encode(['location' => 'Plugin.php:1263', 'message' => 'before returning response', 'data' => ['phones_count' => count($phones)], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'E']);
			@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			// #endregion

			return new \WP_REST_Response([
				'address' => [
					'legal' => $legal_address,
					'actual' => $actual_address,
				],
				'email' => $email ? $email : '',
				'phones' => $phones,
			], 200);
		} catch (\Exception $e) {
			// #region agent log
			error_log('DEBUG: get_contacts_callback Exception: ' . $e->getMessage());
			$log_data = json_encode(['location' => 'Plugin.php:1383', 'message' => 'main catch exception', 'data' => ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(), 0, 1000)], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'ALL']);
			if (defined('ABSPATH')) {
				@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			}
			// #endregion
			error_log('Contacts API Error: ' . $e->getMessage());
			return new \WP_REST_Response([
				'code' => 'internal_server_error',
				'message' => 'An error occurred while fetching contact data.',
				'data' => ['status' => 500, 'error' => $e->getMessage()],
			], 500);
		} catch (\Error $e) {
			// #region agent log
			error_log('DEBUG: get_contacts_callback Fatal Error: ' . $e->getMessage());
			$log_data = json_encode(['location' => 'Plugin.php:1397', 'message' => 'main catch fatal error', 'data' => ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(), 0, 1000)], 'timestamp' => time() * 1000, 'sessionId' => 'debug-session', 'runId' => 'run1', 'hypothesisId' => 'ALL']);
			if (defined('ABSPATH')) {
				@file_put_contents(ABSPATH . '.cursor/debug.log', $log_data . "\n", FILE_APPEND);
			}
			// #endregion
			error_log('Contacts API Fatal Error: ' . $e->getMessage());
			return new \WP_REST_Response([
				'code' => 'internal_server_error',
				'message' => 'A fatal error occurred while fetching contact data.',
				'data' => ['status' => 500, 'error' => $e->getMessage()],
			], 500);
		}
	}

	/**
	 * Pre-render contacts block
	 */
	public static function pre_render_contacts_block($pre_render, $parsed_block) {
		// Проверяем, что это блок contacts
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/contacts') {
			return $pre_render;
		}

		// Всегда используем PHP render
		$render_path = self::getBasePath() . '/build/blocks/contacts/render.php';
		if (file_exists($render_path)) {
			// Создаем экземпляр блока для получения атрибутов
			$block_instance = new \WP_Block($parsed_block);
			
			// Получаем атрибуты из разных источников
			$attributes = $parsed_block['attrs'] ?? [];
			
			// Если атрибуты пустые, пытаемся получить из экземпляра блока
			if (empty($attributes) && method_exists($block_instance, 'get_attributes')) {
				$attributes = $block_instance->get_attributes();
			} elseif (empty($attributes) && property_exists($block_instance, 'attributes')) {
				$attributes = $block_instance->attributes ?? [];
			}
			
			// Если items пустой или отсутствует, используем значения по умолчанию из block.json
			if (empty($attributes['items']) || !is_array($attributes['items'])) {
				if (!is_array($attributes)) {
					$attributes = [];
				}
				$attributes['items'] = [
					['type' => 'address', 'enabled' => true, 'addressType' => 'legal'],
					['type' => 'email', 'enabled' => true],
					['type' => 'phone', 'enabled' => true, 'phones' => ['phone_01']],
				];
				// Устанавливаем format по умолчанию, если его нет
				if (empty($attributes['format'])) {
					$attributes['format'] = 'simple';
				}
			}
			
			$content = $parsed_block['innerHTML'] ?? '';

			// Передаем переменные в область видимости render.php
			extract([
				'attributes' => $attributes,
				'content' => $content,
				'block' => $block_instance,
				'parsed_block' => $parsed_block,
			], EXTR_SKIP);

			ob_start();
			require $render_path;
			$rendered = ob_get_clean();

			// Отладка: если вывод пустой, добавляем комментарий с информацией
			if (empty(trim($rendered))) {
				$items_count = isset($attributes['items']) ? count($attributes['items']) : 0;
				$enabled_count = 0;
				if (isset($attributes['items']) && is_array($attributes['items'])) {
					$enabled_count = count(array_filter($attributes['items'], function($item) {
						return isset($item['enabled']) && $item['enabled'] === true;
					}));
				}
				$redux_loaded = class_exists('Redux') ? 'yes' : 'no';
				$rendered = '<!-- Contacts block rendered empty. Total items: ' . $items_count . ', Enabled items: ' . $enabled_count . ', Redux loaded: ' . $redux_loaded . ', Format: ' . (isset($attributes['format']) ? $attributes['format'] : 'not set') . ' -->';
			}

			return $rendered;
		} else {
			return '<!-- Contacts block: render.php file not found at ' . $render_path . ' -->';
		}

		return $pre_render;
	}

	/**
	 * Pre-render social-icons block
	 */
	public static function pre_render_social_icons_block($pre_render, $parsed_block) {
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/social-icons') {
			return $pre_render;
		}

		$render_path = self::getBasePath() . '/build/blocks/social-icons/render.php';
		if (file_exists($render_path)) {
			$block_instance = new \WP_Block($parsed_block);
			$attributes = $parsed_block['attrs'] ?? [];
			if (empty($attributes) && property_exists($block_instance, 'attributes')) {
				$attributes = $block_instance->attributes ?? [];
			}
			$content = $parsed_block['innerHTML'] ?? '';

			extract([
				'attributes' => $attributes,
				'content' => $content,
				'block' => $block_instance,
				'parsed_block' => $parsed_block,
			], EXTR_SKIP);

			ob_start();
			require $render_path;
			return ob_get_clean();
		}

		return $pre_render;
	}

	/**
	 * Pre-render tables block (manual mode + CSV from documents CPT)
	 */
	public static function pre_render_tables_block($pre_render, $parsed_block) {
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/tables') {
			return $pre_render;
		}

		$render_path = self::getBasePath() . '/build/blocks/tables/render.php';
		if (file_exists($render_path)) {
			$attributes = $parsed_block['attrs'] ?? [];
			$content = $parsed_block['innerHTML'] ?? '';
			$block_instance = new \WP_Block($parsed_block);

			extract([
				'attributes' => $attributes,
				'content' => $content,
				'block' => $block_instance,
			], EXTR_SKIP);

			ob_start();
			require $render_path;
			return ob_get_clean();
		}

		return $pre_render;
	}

	/**
	 * Pre-render navbar block (always uses PHP render via theme header templates)
	 */
	public static function pre_render_navbar_block($pre_render, $parsed_block) {
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/navbar') {
			return $pre_render;
		}

		$render_path = self::getBasePath() . '/build/blocks/navbar/render.php';
		if (file_exists($render_path)) {
			$attributes = $parsed_block['attrs'] ?? [];
			$content = $parsed_block['innerHTML'] ?? '';
			$block_instance = new \WP_Block($parsed_block);

			extract([
				'attributes' => $attributes,
				'content' => $content,
				'block' => $block_instance,
				'parsed_block' => $parsed_block,
			], EXTR_SKIP);

			ob_start();
			require $render_path;
			return ob_get_clean();
		}

		return $pre_render;
	}

	/**
	 * Pre-render top-header block
	 */
	public static function pre_render_top_header_block($pre_render, $parsed_block) {
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/top-header') {
			return $pre_render;
		}

		$render_path = self::getBasePath() . '/build/blocks/top-header/render.php';
		if (file_exists($render_path)) {
			$attributes = $parsed_block['attrs'] ?? [];
			$content = $parsed_block['innerHTML'] ?? '';
			$block_instance = new \WP_Block($parsed_block);

			extract([
				'attributes' => $attributes,
				'content' => $content,
				'block' => $block_instance,
			], EXTR_SKIP);

			ob_start();
			require $render_path;
			return ob_get_clean();
		}

		return $pre_render;
	}

	/**
	 * REST API: documents list (CSV only) and CSV content for tables block
	 */
	public static function register_tables_documents_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/documents-csv', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_documents_csv_list',
			'permission_callback' => '__return_true',
		]);
		register_rest_route('codeweber-gutenberg-blocks/v1', '/documents/(?P<id>\d+)/csv', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_document_csv_content',
			'permission_callback' => '__return_true',
			'args' => [
				'id' => [
					'required' => true,
					'type' => 'integer',
					'validate_callback' => function ($param) {
						return is_numeric($param) && (int) $param > 0;
					},
				],
			],
		]);
		register_rest_route('codeweber-gutenberg-blocks/v1', '/documents/(?P<id>\d+)/spreadsheet', [
			'methods' => 'POST',
			'callback' => __CLASS__ . '::save_document_spreadsheet',
			'permission_callback' => function () {
				return current_user_can('edit_posts');
			},
			'args' => [
				'id' => [
					'required' => true,
					'type' => 'integer',
					'validate_callback' => function ($param) {
						return is_numeric($param) && (int) $param > 0;
					},
				],
			],
		]);
	}

	/**
	 * Register REST API endpoint for navbar block preview in editor
	 */
	public static function register_navbar_preview_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/navbar-preview', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::navbar_preview_callback',
			'permission_callback' => function () {
				return current_user_can('edit_posts');
			},
			'args' => [
				'navbarType' => ['required' => false, 'type' => 'string', 'default' => 'navbar-1'],
				'menuLocation' => ['required' => false, 'type' => 'string', 'default' => ''],
				'menuLocationRight' => ['required' => false, 'type' => 'string', 'default' => ''],
				'menuDepth' => ['required' => false, 'type' => 'integer', 'default' => 4],
				'navbarColor' => ['required' => false, 'type' => 'string', 'default' => 'light'],
				'logoColor' => ['required' => false, 'type' => 'string', 'default' => 'auto'],
				'centerBarTheme' => ['required' => false, 'type' => 'string', 'default' => 'auto'],
				'mobileOffcanvasTheme' => ['required' => false, 'type' => 'string', 'default' => 'light'],
				'stickyNavbar' => ['required' => false, 'type' => 'string', 'default' => '0'],
				'transparentOnTop' => ['required' => false, 'type' => 'string', 'default' => '0'],
				'wrapperClass' => ['required' => false, 'type' => 'string', 'default' => ''],
				'navClass' => ['required' => false, 'type' => 'string', 'default' => ''],
				'blockClass' => ['required' => false, 'type' => 'string', 'default' => ''],
				'blockId' => ['required' => false, 'type' => 'string', 'default' => ''],
				'homeLink' => ['required' => false, 'type' => 'string', 'default' => ''],
				'logoWidth' => ['required' => false, 'type' => 'string', 'default' => ''],
				'logoHtmlEnabled' => ['required' => false, 'type' => 'string', 'default' => '0'],
				'logoHtml' => ['required' => false, 'type' => 'string', 'default' => ''],
				'headerBackground' => ['required' => false, 'type' => 'string', 'default' => ''],
				'headerBackgroundStyle' => ['required' => false, 'type' => 'string', 'default' => 'solid'],
				'socialFromTheme' => ['required' => false, 'type' => 'string', 'default' => '0'],
				'socialStyleType' => ['required' => false, 'type' => 'string', 'default' => 'type1'],
				'socialSize' => ['required' => false, 'type' => 'string', 'default' => 'sm'],
				'socialButtonColor' => ['required' => false, 'type' => 'string', 'default' => 'primary'],
				'socialButtonStyle' => ['required' => false, 'type' => 'string', 'default' => 'solid'],
				'socialButtonForm' => ['required' => false, 'type' => 'string', 'default' => 'circle'],
				'socialNavClass' => ['required' => false, 'type' => 'string', 'default' => ''],
				'socialThemeEnabledSlugs' => ['required' => false, 'type' => 'string', 'default' => ''],
				'mobileMenuElements' => ['required' => false, 'type' => 'string', 'default' => '[]'],
				'mobileMenuOffcanvasTheme' => ['required' => false, 'type' => 'string', 'default' => 'light'],
				'mobileMenuSocialType' => ['required' => false, 'type' => 'string', 'default' => ''],
				'mobileMenuSocialSize' => ['required' => false, 'type' => 'string', 'default' => ''],
				'mobileMenuSocialStyle' => ['required' => false, 'type' => 'string', 'default' => ''],
			],
		]);
	}

	/**
	 * Decode mobileMenuElements JSON for navbar preview.
	 *
	 * @param string $raw JSON string or empty.
	 * @return array<int, array{id: string, label?: string, enabled?: bool}>
	 */
	public static function navbar_preview_decode_mobile_elements($raw) {
		if (!is_string($raw) || $raw === '') {
			return [];
		}
		$decoded = json_decode($raw, true);
		return is_array($decoded) ? $decoded : [];
	}

	/**
	 * REST: Render navbar block HTML for editor preview
	 */
	public static function navbar_preview_callback(\WP_REST_Request $request) {
		$social_slugs_raw = $request->get_param('socialThemeEnabledSlugs');
		$social_slugs = [];
		if (is_string($social_slugs_raw) && $social_slugs_raw !== '') {
			$decoded = json_decode($social_slugs_raw, true);
			$social_slugs = is_array($decoded) ? $decoded : [];
		}
		$attributes = [
			'navbarType' => $request->get_param('navbarType') ?: 'navbar-1',
			'menuLocation' => $request->get_param('menuLocation') ?: '',
			'menuLocationRight' => $request->get_param('menuLocationRight') ?: '',
			'menuDepth' => (int) ($request->get_param('menuDepth') ?? 4),
			'navbarColor' => $request->get_param('navbarColor') ?: 'light',
			'logoColor' => $request->get_param('logoColor') ?: 'auto',
			'centerBarTheme' => $request->get_param('centerBarTheme') ?: 'auto',
			'mobileOffcanvasTheme' => $request->get_param('mobileOffcanvasTheme') ?: 'light',
			'stickyNavbar' => $request->get_param('stickyNavbar') === '1',
			'transparentOnTop' => $request->get_param('transparentOnTop') === '1',
			'wrapperClass' => $request->get_param('wrapperClass') ?: '',
			'navClass' => $request->get_param('navClass') ?: '',
			'blockClass' => $request->get_param('blockClass') ?: '',
			'blockId' => $request->get_param('blockId') ?: '',
			'homeLink' => $request->get_param('homeLink') ?: '',
			'logoWidth' => $request->get_param('logoWidth') ?: '',
			'logoHtmlEnabled' => $request->get_param('logoHtmlEnabled') === '1',
			'logoHtml' => $request->get_param('logoHtml') ?: '',
			'headerBackground' => $request->get_param('headerBackground') ?: '',
			'headerBackgroundStyle' => $request->get_param('headerBackgroundStyle') ?: 'solid',
			'socialFromTheme' => $request->get_param('socialFromTheme') === '1',
			'socialStyleType' => $request->get_param('socialStyleType') ?: 'type1',
			'socialSize' => $request->get_param('socialSize') ?: 'sm',
			'socialButtonColor' => $request->get_param('socialButtonColor') ?: 'primary',
			'socialButtonStyle' => $request->get_param('socialButtonStyle') ?: 'solid',
			'socialButtonForm' => $request->get_param('socialButtonForm') ?: 'circle',
			'socialNavClass' => $request->get_param('socialNavClass') ?: '',
			'socialThemeEnabledSlugs' => $social_slugs,
			'mobileMenuElements' => self::navbar_preview_decode_mobile_elements($request->get_param('mobileMenuElements')),
			'mobileMenuOffcanvasTheme' => $request->get_param('mobileMenuOffcanvasTheme') ?: 'light',
			'mobileMenuSocialType' => $request->get_param('mobileMenuSocialType') ?: '',
			'mobileMenuSocialSize' => $request->get_param('mobileMenuSocialSize') ?: '',
			'mobileMenuSocialStyle' => $request->get_param('mobileMenuSocialStyle') ?: '',
		];

		$render_path = self::getBasePath() . '/build/blocks/navbar/render.php';
		if (!file_exists($render_path)) {
			return new \WP_REST_Response(['html' => '<!-- Navbar render.php not found -->'], 200);
		}

		ob_start();
		$content = '';
		$block_instance = null;
		$parsed_block = ['innerBlocks' => []];
		$for_editor_preview = true;
		extract(compact('attributes', 'content', 'block_instance', 'parsed_block', 'for_editor_preview'), EXTR_SKIP);
		require $render_path;
		$html = ob_get_clean();

		$response = new \WP_REST_Response(['html' => $html], 200);
		$response->header('Cache-Control', 'no-cache, no-store, must-revalidate');
		return $response;
	}

	public static function get_documents_csv_list(\WP_REST_Request $request) {
		if (!post_type_exists('documents')) {
			return new \WP_REST_Response([], 200);
		}
		$posts = get_posts([
			'post_type' => 'documents',
			'post_status' => 'publish',
			'posts_per_page' => -1,
			'orderby' => 'title',
			'order' => 'ASC',
		]);
		$items = [];
		foreach ($posts as $post) {
			$file_url = get_post_meta($post->ID, '_document_file', true);
			if (!$file_url) continue;
			$ext = strtolower(pathinfo($file_url, PATHINFO_EXTENSION));
			if (!in_array($ext, ['csv', 'xls', 'xlsx'], true)) continue;
			$items[] = [
				'id' => $post->ID,
				'title' => $post->post_title,
				'file_url' => $file_url,
			];
		}
		return new \WP_REST_Response($items, 200);
	}

	public static function get_document_csv_content(\WP_REST_Request $request) {
		$post_id = (int) $request->get_param('id');
		$post = get_post($post_id);
		if (!$post || $post->post_type !== 'documents') {
			return new \WP_Error('invalid_document', __('Document not found.', 'codeweber-gutenberg-blocks'), ['status' => 404]);
		}
		$file_meta = get_post_meta($post_id, '_document_file', true);
		if (!$file_meta) {
			return new \WP_Error('no_file', __('No file attached to this document.', 'codeweber-gutenberg-blocks'), ['status' => 404]);
		}
		$file_url = is_numeric($file_meta) ? wp_get_attachment_url((int) $file_meta) : $file_meta;
		if (!$file_url) {
			return new \WP_Error('no_file', __('No file attached to this document.', 'codeweber-gutenberg-blocks'), ['status' => 404]);
		}
		$ext = strtolower(pathinfo($file_url, PATHINFO_EXTENSION));
		if (!in_array($ext, ['csv', 'xls', 'xlsx'], true)) {
			return new \WP_Error('not_supported', __('Document file must be CSV, XLS or XLSX.', 'codeweber-gutenberg-blocks'), ['status' => 400]);
		}
		$result = \Codeweber\Blocks\SpreadsheetHelper::parse_from_url($file_url, $ext);
		if (!empty($result['error'])) {
			return new \WP_Error('file_unreadable', $result['error'], ['status' => 500]);
		}
		$rows = $result['rows'];
		// Process shortcodes in each cell for Tabulator display
		foreach ($rows as $ri => $row) {
			foreach ($row as $ci => $cell) {
				$rows[$ri][$ci] = do_shortcode((string) $cell);
			}
		}
		return new \WP_REST_Response(['rows' => $rows], 200);
	}

	/**
	 * REST API: save spreadsheet data to document file (CSV/XLSX).
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function save_document_spreadsheet(\WP_REST_Request $request) {
		$post_id = (int) $request->get_param('id');
		$post = get_post($post_id);
		if (!$post || $post->post_type !== 'documents') {
			return new \WP_Error('invalid_document', __('Document not found.', 'codeweber-gutenberg-blocks'), ['status' => 404]);
		}
		if (!current_user_can('edit_post', $post_id)) {
			return new \WP_Error('forbidden', __('You do not have permission to edit this document.', 'codeweber-gutenberg-blocks'), ['status' => 403]);
		}
		$body = json_decode($request->get_body(), true);
		if (empty($body['rows']) || !is_array($body['rows'])) {
			return new \WP_Error('invalid_data', __('Invalid rows data.', 'codeweber-gutenberg-blocks'), ['status' => 400]);
		}
		$result = SpreadsheetHelper::write_file($post_id, $body['rows']);
		if (is_wp_error($result)) {
			return new \WP_REST_Response(['success' => false, 'message' => $result->get_error_message()], 500);
		}
		return new \WP_REST_Response(['success' => true], 200);
	}
}


