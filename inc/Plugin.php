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

		// Enqueue frontend scripts
		add_action('wp_enqueue_scripts', __CLASS__ . '::gutenbergBlocksExternalLibraries');

		// Фильтр для условного рендеринга аккордеона (перехватываем до рендеринга)
		add_filter('pre_render_block', __CLASS__ . '::pre_render_accordion_block', 10, 2);

		// Фильтр для условного рендеринга списков (перехватываем до рендеринга)
		add_filter('pre_render_block', __CLASS__ . '::pre_render_lists_block', 10, 2);

		// Фильтр для условного рендеринга аватара (перехватываем до рендеринга)
		add_filter('pre_render_block', __CLASS__ . '::pre_render_avatar_block', 10, 2);

		// Фильтр для условной загрузки FilePond для file полей
		add_filter('pre_render_block', __CLASS__ . '::pre_render_file_field', 10, 2);

		// Фильтр для условного рендеринга form-field с inline button
		add_filter('pre_render_block', __CLASS__ . '::pre_render_form_field_inline_button', 10, 2);
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

		// Register REST API endpoint for theme style classes (button/card radius)
		add_action('rest_api_init', [StyleAPI::class, 'register_routes']);

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
			[],
			GUTENBERG_BLOCKS_VERSION
		);

		// Enqueue scrollCue init script for editor
		wp_enqueue_script(
			'codeweber-blocks-scrollcue-init',
			self::getBaseUrl() . '/includes/js/scrollcue-editor-init.js',
			[],
			GUTENBERG_BLOCKS_VERSION,
			true
		);

		// Pass plugin URL to JavaScript for placeholder image via inline script
		wp_add_inline_script(
			'codeweber-blocks-scrollcue-init',
			'window.codeweberBlocksData = window.codeweberBlocksData || {}; window.codeweberBlocksData.pluginUrl = ' . wp_json_encode(self::getBaseUrl()) . ';',
			'before'
		);
	}

	public static function getBlocksName(): array {
	return [
		'accordion',
		'avatar',
		'banner',
		'button',
		'section',
		'column',
		'columns',
		'heading-subtitle',
		'icon',
		'lists',
		'media',
		'paragraph',
		'card',
		'feature',
		'image-simple',
		'post-grid',
		'tabs',
		'label-plus',
		'form',
		'form-field',
		'submit-button',
		'divider',
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
	 * Pre-render avatar block conditionally based on avatarType
	 * Uses PHP render when avatarType is 'user' to get fresh user data
	 */
	public static function pre_render_avatar_block($pre_render, $parsed_block) {
		// Проверяем, что это блок avatar
		if (!isset($parsed_block['blockName']) || $parsed_block['blockName'] !== 'codeweber-blocks/avatar') {
			return $pre_render;
		}

		$attributes = $parsed_block['attrs'] ?? [];
		$avatar_type = $attributes['avatarType'] ?? 'letters';

		// Используем PHP render только для режима 'user'
		if ($avatar_type === 'user') {
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

		foreach (self::getBlocksName() as $block_name) {
			$block_type = register_block_type($blocks_path . $block_name);

			// Устанавливаем переводы СРАЗУ после успешной регистрации
			if ($block_type) {
				$script_handle = 'codeweber-blocks-' . $block_name . '-editor-script';

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
			'banner',
			'media',
			'image-simple',
			'button',
			'card',
			'column',
			'columns',
			'feature',
			'heading-subtitle',
			'icon',
			'paragraph',
			'section',
			'post-grid',
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

	public static function gutenbergBlocksRegisterCategory($categories, $post): array {
		return [
			[
				'slug'  => 'codeweber-gutenberg-blocks',
				'title' => __('Codeweber Gutenberg Blocks', Plugin::L10N),
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
			],
		]);
	}

	/**
	 * REST API callback for getting posts for accordion (using WP_Query like render.php)
	 */
	public static function get_accordion_posts_callback($request) {
		$post_type = $request->get_param('post_type');
		$selected_taxonomies_json = $request->get_param('selected_taxonomies');

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
			'orderby' => 'date',
			'order' => 'DESC',
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
			// #region agent log
			$log_dir = dirname(WP_CONTENT_DIR) . '/.cursor';
			$log_path = $log_dir . '/debug.log';
			if (!is_dir($log_dir)) {
				@mkdir($log_dir, 0755, true);
			}
			@file_put_contents($log_path, json_encode(['sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'A','location'=>'Plugin.php:771','message'=>'FilePond already enqueued','data'=>[],'timestamp'=>time()*1000])."\n", FILE_APPEND);
			// #endregion
			return;
		}

		$css_url = self::getBaseUrl() . '/assets/filepond/filepond.min.css';
		$js_url = self::getBaseUrl() . '/assets/filepond/filepond.min.js';
		$init_url = self::getBaseUrl() . '/includes/js/filepond-init.js';

		// #region agent log
		$log_dir = dirname(WP_CONTENT_DIR) . '/.cursor';
		$log_path = $log_dir . '/debug.log';
		if (!is_dir($log_dir)) {
			@mkdir($log_dir, 0755, true);
		}
		@file_put_contents($log_path, json_encode(['sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'A','location'=>'Plugin.php:777','message'=>'Enqueueing FilePond scripts','data'=>['cssUrl'=>$css_url,'jsUrl'=>$js_url,'initUrl'=>$init_url,'cssExists'=>file_exists(dirname(__DIR__).'/assets/filepond/filepond.min.css'),'jsExists'=>file_exists(dirname(__DIR__).'/assets/filepond/filepond.min.js')],'timestamp'=>time()*1000])."\n", FILE_APPEND);
		// #endregion

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

		// #region agent log
		$log_dir = dirname(WP_CONTENT_DIR) . '/.cursor';
		$log_path = $log_dir . '/debug.log';
		if (!is_dir($log_dir)) {
			@mkdir($log_dir, 0755, true);
		}
		@file_put_contents($log_path, json_encode(['sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'A','location'=>'Plugin.php:805','message'=>'FilePond scripts enqueued','data'=>['scriptEnqueued'=>wp_script_is('filepond','enqueued'),'styleEnqueued'=>wp_style_is('filepond','enqueued'),'initEnqueued'=>wp_script_is('filepond-init','enqueued')],'timestamp'=>time()*1000])."\n", FILE_APPEND);
		// #endregion
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

		// #region agent log
		$log_file = dirname(dirname(WP_CONTENT_DIR)) . '/.cursor/debug.log';
		$log_entry = json_encode([
			'sessionId' => 'debug-session',
			'runId' => 'run1',
			'hypothesisId' => 'I',
			'location' => 'Plugin.php:pre_render_form_field_inline_button',
			'message' => 'pre_render_form_field_inline_button called',
			'data' => [
				'enable_inline_button' => $enable_inline_button,
				'field_type' => $field_type,
				'inline_button_enabled' => $inline_button_enabled,
				'enableInlineButton_raw' => $attributes['enableInlineButton'] ?? 'NOT_SET'
			],
			'timestamp' => time() * 1000
		]) . "\n";
		@file_put_contents($log_file, $log_entry, FILE_APPEND);
		// #endregion

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

				// #region agent log
				$log_entry = json_encode([
					'sessionId' => 'debug-session',
					'runId' => 'run1',
					'hypothesisId' => 'J',
					'location' => 'Plugin.php:pre_render_form_field_inline_button',
					'message' => 'INLINE BUTTON - calling render.php',
					'data' => [
						'render_path' => $render_path,
						'file_exists' => file_exists($render_path)
					],
					'timestamp' => time() * 1000
				]) . "\n";
				@file_put_contents($log_file, $log_entry, FILE_APPEND);
				// #endregion

				ob_start();
				require $render_path;
				$rendered = ob_get_clean();

				// #region agent log
				$log_entry = json_encode([
					'sessionId' => 'debug-session',
					'runId' => 'run1',
					'hypothesisId' => 'K',
					'location' => 'Plugin.php:pre_render_form_field_inline_button',
					'message' => 'INLINE BUTTON - render.php output generated',
					'data' => [
						'output_length' => strlen($rendered),
						'output_preview' => substr($rendered, 0, 200)
					],
					'timestamp' => time() * 1000
				]) . "\n";
				@file_put_contents($log_file, $log_entry, FILE_APPEND);
				// #endregion

				return $rendered;
			}
		}

		return $pre_render;
	}
}


