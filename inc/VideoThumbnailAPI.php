<?php
/**
 * Video Thumbnail API
 * 
 * Provides endpoints for fetching video thumbnails from VK and Rutube
 * to bypass CORS restrictions
 */

namespace Codeweber\Blocks;

class VideoThumbnailAPI {
	public function __construct() {
		add_action('rest_api_init', [$this, 'register_routes']);
	}

	public function register_routes() {
		// Rutube thumbnail endpoint
		register_rest_route('codeweber-gutenberg-blocks/v1', '/rutube-thumbnail/(?P<video_id>[a-f0-9]{32})', [
			'methods' => 'GET',
			'callback' => [$this, 'get_rutube_thumbnail'],
			'permission_callback' => '__return_true',
			'args' => [
				'video_id' => [
					'required' => true,
					'validate_callback' => function($param) {
						return preg_match('/^[a-f0-9]{32}$/', $param);
					}
				]
			]
		]);

		// VK video thumbnail endpoint
		register_rest_route('codeweber-gutenberg-blocks/v1', '/vk-thumbnail', [
			'methods' => 'GET',
			'callback' => [$this, 'get_vk_thumbnail'],
			'permission_callback' => '__return_true',
			'args' => [
				'oid' => [
					'required' => true,
					'validate_callback' => function($param) {
						// oid может быть отрицательным (сообщества VK)
						return is_numeric($param) && (int) $param != 0;
					},
					'sanitize_callback' => 'intval'
				],
				'id' => [
					'required' => true,
					'validate_callback' => function($param) {
						return is_numeric($param) && (int) $param > 0;
					},
					'sanitize_callback' => 'absint'
				]
			]
		]);
	}

	/**
	 * Get Rutube video thumbnail
	 */
	public function get_rutube_thumbnail($request) {
		$video_id = $request->get_param('video_id');

		// Fetch from Rutube API
		$api_url = "https://rutube.ru/api/video/{$video_id}/";

		$response = wp_remote_get($api_url, [
			'timeout' => 10,
			'headers' => [
				'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			]
		]);

		if (is_wp_error($response)) {
			error_log("Rutube API: WP_Error - " . $response->get_error_message());
			return new \WP_Error('api_error', 'Failed to fetch Rutube data', ['status' => 500]);
		}

		$body = wp_remote_retrieve_body($response);
		$data = json_decode($body, true);

		if (!$data || !isset($data['thumbnail_url'])) {
			return new \WP_Error('no_thumbnail', 'Thumbnail not found', ['status' => 404]);
		}

		return [
			'success' => true,
			'thumbnail_url' => $data['thumbnail_url'],
			'title' => $data['title'] ?? '',
			'description' => $data['description'] ?? ''
		];
	}

	/**
	 * Get VK video thumbnail
	 */
	public function get_vk_thumbnail($request) {
		$oid = $request->get_param('oid');
		$id = $request->get_param('id');

		$thumbnail_url = '';
		$title = '';
		$description = '';
		
		// Method 1: Try to get thumbnail from vkvideo.ru embed page
		$embed_url = "https://vkvideo.ru/video_ext.php?oid={$oid}&id={$id}";

		$response = wp_remote_get($embed_url, [
			'timeout' => 10,
			'headers' => [
				'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			]
		]);
		
		if (!is_wp_error($response)) {
			$body = wp_remote_retrieve_body($response);
			
			// Try to extract thumbnail from various possible meta tags
			$patterns = [
				'/<meta property="og:image" content="([^"]+)"/',
				'/<meta name="og:image" content="([^"]+)"/',
				'/<link rel="image_src" href="([^"]+)"/',
			];
			
			foreach ($patterns as $pattern) {
				if (preg_match($pattern, $body, $matches)) {
					$thumbnail_url = $matches[1];
					break;
				}
			}
			
			// Extract title
			if (preg_match('/<meta property="og:title" content="([^"]+)"/', $body, $matches)) {
				$title = html_entity_decode($matches[1]);
			}
		}
		
		// Method 2: If not found, try vk.com video page
		if (empty($thumbnail_url)) {
			$video_url = "https://vk.com/video{$oid}_{$id}";
			$response = wp_remote_get($video_url, [
				'timeout' => 10,
				'headers' => [
					'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
				]
			]);

			if (is_wp_error($response)) {
				error_log("VK API: Failed to fetch vk.com page - " . $response->get_error_message());
				return new \WP_Error('api_error', 'Failed to fetch VK data', ['status' => 500]);
			}

			$body = wp_remote_retrieve_body($response);
			
			// Extract og:image from HTML
			if (preg_match('/<meta property="og:image" content="([^"]+)"/', $body, $matches)) {
				$thumbnail_url = $matches[1];
			}

			// Extract og:title and og:description
			if (empty($title) && preg_match('/<meta property="og:title" content="([^"]+)"/', $body, $matches)) {
				$title = html_entity_decode($matches[1]);
			}
			
			if (preg_match('/<meta property="og:description" content="([^"]+)"/', $body, $matches)) {
				$description = html_entity_decode($matches[1]);
			}
		}

		// If still no thumbnail, return error
		if (empty($thumbnail_url)) {
				return new \WP_Error('no_thumbnail', 'Thumbnail not found', ['status' => 404]);
		}
		
		// Decode HTML entities in thumbnail URL
		$thumbnail_url = html_entity_decode($thumbnail_url, ENT_QUOTES | ENT_HTML5, 'UTF-8');

		return [
			'success' => true,
			'thumbnail_url' => $thumbnail_url,
			'title' => $title,
			'description' => $description
		];
	}
}

