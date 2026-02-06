<?php
/**
 * Helper for reading CSV, XLS, XLSX files.
 *
 * @package CodeWeber Gutenberg Blocks
 */

namespace Codeweber\Blocks;

if (!defined('ABSPATH')) {
	exit;
}

class SpreadsheetHelper {

	/**
	 * Supported extensions for documents.
	 *
	 * @var string[]
	 */
	public static $SUPPORTED_EXTENSIONS = ['csv', 'xls', 'xlsx'];

	/**
	 * Parse a file and return rows (array of arrays).
	 *
	 * @param string $file_path Absolute path to file.
	 * @param string $ext      Extension: csv, xls, or xlsx.
	 * @return array{rows: array, error?: string} Rows or error.
	 */
	public static function parse_file($file_path, $ext) {
		$ext = strtolower($ext);
		if (!in_array($ext, self::$SUPPORTED_EXTENSIONS, true)) {
			return ['rows' => [], 'error' => __('Unsupported file format.', 'codeweber-gutenberg-blocks')];
		}
		if (!is_readable($file_path)) {
			return ['rows' => [], 'error' => __('File not readable.', 'codeweber-gutenberg-blocks')];
		}

		if ($ext === 'csv') {
			return self::parse_csv($file_path);
		}
		if ($ext === 'xlsx') {
			return self::parse_xlsx($file_path);
		}
		if ($ext === 'xls') {
			return self::parse_xls($file_path);
		}

		return ['rows' => [], 'error' => __('Unknown format.', 'codeweber-gutenberg-blocks')];
	}

	/**
	 * Parse CSV file.
	 *
	 * @param string $file_path Path to CSV.
	 * @return array{rows: array, error?: string}
	 */
	protected static function parse_csv($file_path) {
		$content = file_get_contents($file_path);
		if ($content === false) {
			return ['rows' => [], 'error' => __('Could not read file.', 'codeweber-gutenberg-blocks')];
		}
		$lines = preg_split('/\r\n|\r|\n/', $content);
		$rows = [];
		foreach ($lines as $line) {
			if (trim($line) === '') {
				continue;
			}
			$rows[] = str_getcsv($line, ',', '"');
		}
		return ['rows' => $rows];
	}

	/**
	 * Parse XLSX file.
	 *
	 * @param string $file_path Path to XLSX.
	 * @return array{rows: array, error?: string}
	 */
	protected static function parse_xlsx($file_path) {
		$lib = dirname(__DIR__) . '/lib/SimpleXLSX.php';
		if (!file_exists($lib)) {
			return ['rows' => [], 'error' => __('XLSX library not found.', 'codeweber-gutenberg-blocks')];
		}
		require_once $lib;
		$xlsx = \Shuchkin\SimpleXLSX::parse($file_path);
		if (!$xlsx || !$xlsx->success()) {
			$err = \Shuchkin\SimpleXLSX::parseError();
			return ['rows' => [], 'error' => $err ?: __('Could not parse XLSX.', 'codeweber-gutenberg-blocks')];
		}
		$rows = $xlsx->rows(0);
		return ['rows' => is_array($rows) ? $rows : iterator_to_array($rows, false)];
	}

	/**
	 * Parse XLS file.
	 *
	 * @param string $file_path Path to XLS.
	 * @return array{rows: array, error?: string}
	 */
	protected static function parse_xls($file_path) {
		$lib = dirname(__DIR__) . '/lib/SimpleXLS.php';
		if (!file_exists($lib)) {
			return ['rows' => [], 'error' => __('XLS library not found.', 'codeweber-gutenberg-blocks')];
		}
		require_once $lib;
		$xls = \Shuchkin\SimpleXLS::parse($file_path);
		if (!$xls || !$xls->success()) {
			$err = \Shuchkin\SimpleXLS::parseError();
			return ['rows' => [], 'error' => $err ?: __('Could not parse XLS.', 'codeweber-gutenberg-blocks')];
		}
		$rows = $xls->rows(0);
		return ['rows' => is_array($rows) ? $rows : iterator_to_array($rows, false)];
	}

	/**
	 * Resolve file path from URL (handles different URL formats on frontend vs admin).
	 *
	 * @param string $file_url File URL from document meta.
	 * @return string|false Absolute path or false.
	 */
	public static function url_to_file_path($file_url) {
		if (empty($file_url)) {
			return false;
		}
		$upload_dir = wp_upload_dir();
		if (empty($upload_dir['error'])) {
			$file_path = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $file_url);
			if (file_exists($file_path)) {
				return $file_path;
			}
			$baseurl_alt = str_replace(['https:', 'http:'], '', $upload_dir['baseurl']);
			$file_url_alt = str_replace(['https:', 'http:'], '', $file_url);
			$file_path = str_replace($baseurl_alt, $upload_dir['basedir'], $file_url_alt);
			if (file_exists($file_path)) {
				return $file_path;
			}
		}
		$url_path = parse_url($file_url, PHP_URL_PATH);
		if ($url_path && preg_match('#wp-content/uploads/(.+)$#', $url_path, $m)) {
			$rel_path = $m[1];
			$file_path = $upload_dir['basedir'] . '/' . $rel_path;
			if (file_exists($file_path)) {
				return $file_path;
			}
		}
		return false;
	}

	/**
	 * Parse from URL (for remote files).
	 *
	 * @param string $file_url Full URL to file.
	 * @param string $ext      Extension.
	 * @return array{rows: array, error?: string}
	 */
	public static function parse_from_url($file_url, $ext) {
		$file_path = self::url_to_file_path($file_url);
		if ($file_path) {
			return self::parse_file($file_path, $ext);
		}
		$response = wp_remote_get($file_url);
		if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
			return ['rows' => [], 'error' => __('Could not fetch file.', 'codeweber-gutenberg-blocks')];
		}
		$content = wp_remote_retrieve_body($response);
		if (empty($content)) {
			return ['rows' => [], 'error' => __('Empty file.', 'codeweber-gutenberg-blocks')];
		}
		$ext = strtolower($ext);
		if ($ext === 'csv') {
			$lines = preg_split('/\r\n|\r|\n/', $content);
			$rows = [];
			foreach ($lines as $line) {
				if (trim($line) === '') continue;
				$rows[] = str_getcsv($line, ',', '"');
			}
			return ['rows' => $rows];
		}
		$tmp = wp_tempnam('xls');
		if (!$tmp) {
			return ['rows' => [], 'error' => __('Could not create temp file.', 'codeweber-gutenberg-blocks')];
		}
		file_put_contents($tmp, $content);
		$result = self::parse_file($tmp, $ext);
		@unlink($tmp);
		return $result;
	}
}
