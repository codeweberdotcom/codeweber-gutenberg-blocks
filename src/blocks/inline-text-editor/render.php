<?php

/**
 * Inline Text Editor — frontend render.
 *
 * Outputs nothing for visitors. For logged-in users who can edit the current
 * post, it renders a floating trigger button and a Bootstrap offcanvas drawer.
 * All editing logic lives in inc/InlineTextEditor.php (REST + DOM tagging).
 *
 * Available: $attributes, $content, $block
 *
 * @package CodeWeber Gutenberg Blocks
 */

if (!defined('ABSPATH')) {
	exit;
}

$cw_post_id = (int) get_queried_object_id();

// Only render for users allowed to edit this exact post.
if ($cw_post_id <= 0 || !current_user_can('edit_post', $cw_post_id)) {
	return;
}

$cw_config = [
	'restBase' => esc_url_raw(rest_url('codeweber-gutenberg-blocks/v1/inline-editor')),
	'nonce'    => wp_create_nonce('wp_rest'),
	'postId'   => $cw_post_id,
];
?>
<div
	class="cwgb-inline-editor"
	data-cw-inline-editor
	data-cw-config="<?php echo esc_attr(wp_json_encode($cw_config)); ?>"
>
	<button
		type="button"
		class="btn btn-primary btn-icon rounded-circle shadow position-fixed bottom-0 end-0 m-4"
		style="z-index: 1045;"
		data-bs-toggle="offcanvas"
		data-bs-target="#cwgbInlineEditorDrawer"
		aria-controls="cwgbInlineEditorDrawer"
		title="<?php echo esc_attr__('Edit page texts', 'codeweber-gutenberg-blocks'); ?>"
	>
		<i class="uil uil-edit"></i>
	</button>

	<div
		class="offcanvas offcanvas-end"
		tabindex="-1"
		id="cwgbInlineEditorDrawer"
		aria-labelledby="cwgbInlineEditorDrawerLabel"
	>
		<div class="offcanvas-header border-bottom">
			<h5 class="offcanvas-title" id="cwgbInlineEditorDrawerLabel">
				<?php echo esc_html__('Edit page texts', 'codeweber-gutenberg-blocks'); ?>
			</h5>
			<button
				type="button"
				class="btn-close"
				data-bs-dismiss="offcanvas"
				aria-label="<?php echo esc_attr__('Close', 'codeweber-gutenberg-blocks'); ?>"
			></button>
		</div>
		<div class="offcanvas-body">
			<div class="cwgb-inline-editor-status small text-muted mb-3" data-cw-status></div>
			<form data-cw-form>
				<div data-cw-fields></div>
				<div class="d-grid gap-2 mt-3" data-cw-actions hidden>
					<button type="submit" class="btn btn-primary" data-cw-save>
						<?php echo esc_html__('Save changes', 'codeweber-gutenberg-blocks'); ?>
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
<?php
