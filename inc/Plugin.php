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
			'paragraph',
			'card',
			'feature',
			'image',
			'image-simple',
		];
	}

	public static function gutenbergBlocksInit(): void {
		foreach (self::getBlocksName() as $block_name) {
			register_block_type(self::getBasePath() . '/build/blocks/' . $block_name);
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
			GUTENBERG_BLOCKS_INC_URL . 'js/plugin.js',
			[],
			GUTENBERG_BLOCKS_VERSION,
			TRUE
		);
	}

	/**
	 * Register REST API endpoint for image sizes
	 */
	public static function register_image_sizes_endpoint() {
		register_rest_route('codeweber-gutenberg-blocks/v1', '/image-sizes', [
			'methods' => 'GET',
			'callback' => __CLASS__ . '::get_image_sizes_callback',
			'permission_callback' => '__return_true', // Allow public access for now
		]);
	}

	/**
	 * REST API callback for getting image sizes
	 */
	public static function get_image_sizes_callback() {
		$image_sizes = [];

		// Get all registered image sizes
		$registered_sizes = get_intermediate_image_sizes();

		foreach ($registered_sizes as $size_key) {
			$size_data = [
				'value' => $size_key,
				'label' => ucfirst($size_key),
				'width' => null,
				'height' => null,
			];

			// Get size details if available
			if (isset($GLOBALS['_wp_additional_image_sizes'][$size_key])) {
				$size_info = $GLOBALS['_wp_additional_image_sizes'][$size_key];
				$size_data['width'] = $size_info['width'];
				$size_data['height'] = $size_info['height'];
				$size_data['crop'] = $size_info['crop'];
			} elseif (in_array($size_key, ['thumbnail', 'medium', 'large'])) {
				$size_data['width'] = get_option($size_key . '_size_w');
				$size_data['height'] = get_option($size_key . '_size_h');
			}

			// Create label with dimensions if available
			if ($size_data['width'] && $size_data['height']) {
				$size_data['label'] = sprintf('%s (%dx%d)', ucfirst($size_key), $size_data['width'], $size_data['height']);
			}

			$image_sizes[] = $size_data;
		}

		return new \WP_REST_Response($image_sizes, 200);
	}


	/**
	 * Loads the plugin text domain.
	 */
	public static function loadTextDomain(): void {
		load_plugin_textdomain(static::L10N, FALSE, static::L10N . '/languages/');
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


