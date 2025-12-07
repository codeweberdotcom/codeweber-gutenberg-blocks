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
	}

	public static function getBlocksName(): array {
	return [
		'button',
		'section',
		'column',
		'columns',
		'heading-subtitle',
		'icon',
		'media',
		'paragraph',
		'card',
		'feature',
		'image-simple',
		'post-grid',
	];
	}

	public static function gutenbergBlocksInit(): void {
		$blocks_path = self::getBasePath() . '/build/blocks/';
		$lang_path = self::getBasePath() . '/languages';
		
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
	 * Loads JavaScript translations for Gutenberg blocks.
	 */
	public static function loadJSTranslations(): void {
		// Загружаем переводы для всех скриптов блоков
		// WordPress автоматически генерирует handle: {namespace}-{block-name}-editor-script
		$blocks = [
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
		wp_enqueue_script(
			'codeweber-blocks-load-more',
			GUTENBERG_BLOCKS_INC_URL . 'js/load-more.js',
			[],
			GUTENBERG_BLOCKS_VERSION,
			TRUE
		);
		
		// Localize script for Load More
		wp_localize_script('codeweber-blocks-load-more', 'cwgbLoadMore', [
			'restUrl' => rest_url('codeweber-gutenberg-blocks/v1/load-more'),
			'nonce' => wp_create_nonce('wp_rest'),
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
}


