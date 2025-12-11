<?php
/**
 * Debug script handles
 * Add to functions.php temporarily: require_once WP_CONTENT_DIR . '/plugins/codeweber-gutenberg-blocks/debug-scripts.php';
 */

add_action('admin_enqueue_scripts', function() {
	global $wp_scripts;
	
	error_log('=== REGISTERED SCRIPTS ===');
	foreach ($wp_scripts->registered as $handle => $script) {
		if (strpos($handle, 'codeweber') !== false) {
			error_log("Handle: $handle");
			if (isset($script->textdomain)) {
				error_log("  Textdomain: {$script->textdomain}");
			}
			if (isset($script->translations_path)) {
				error_log("  Path: {$script->translations_path}");
			}
		}
	}
	error_log('======================');
}, 999);






