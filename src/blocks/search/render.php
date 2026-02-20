<?php
/**
 * Search Block - Server-side render
 *
 * Outputs search form markup only (no shortcode). Two display types:
 * - form: inline form in layout
 * - dropdown: Bootstrap dropdown — only icon visible, form in dropdown on click
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array $attributes Block attributes.
 */

if (!defined('ABSPATH')) {
	exit;
}

if (!isset($attributes) || !is_array($attributes)) {
	$attributes = [];
}

$block_class   = isset($attributes['blockClass']) ? $attributes['blockClass'] : '';
$block_id      = isset($attributes['blockId']) ? $attributes['blockId'] : '';
$display_type  = isset($attributes['displayType']) && $attributes['displayType'] === 'dropdown' ? 'dropdown' : (isset($attributes['displayType']) ? $attributes['displayType'] : 'form');
$placeholder   = isset($attributes['placeholder']) && $attributes['placeholder'] !== '' ? $attributes['placeholder'] : __('Type keyword', 'codeweber-gutenberg-blocks');
$posts_per_page = isset($attributes['postsPerPage']) ? $attributes['postsPerPage'] : '8';
$post_types    = isset($attributes['postTypes']) ? $attributes['postTypes'] : 'post';
$search_content = isset($attributes['searchContent']) ? $attributes['searchContent'] : 'false';
$show_excerpt  = isset($attributes['showExcerpt']) ? $attributes['showExcerpt'] : 'false';
$taxonomy      = isset($attributes['taxonomy']) ? $attributes['taxonomy'] : '';
$term          = isset($attributes['term']) ? $attributes['term'] : '';
$include_taxonomies = isset($attributes['includeTaxonomies']) ? $attributes['includeTaxonomies'] : 'false';
$dropdown_min_width = isset($attributes['dropdownMinWidth']) && $attributes['dropdownMinWidth'] !== '' ? $attributes['dropdownMinWidth'] : '320';
$dropdown_min_width = is_numeric($dropdown_min_width) ? (int) $dropdown_min_width . 'px' : $dropdown_min_width;
$form_id_attr  = isset($attributes['formId']) && $attributes['formId'] !== '' ? $attributes['formId'] : 'search-form-' . uniqid('');
$form_class    = isset($attributes['formClass']) ? $attributes['formClass'] : '';
$input_id      = $form_id_attr . '-input';
$form_wrap_class = trim('position-relative ' . $form_class);

$wrapper_classes = ['cwgb-search-block'];
if ($display_type === 'dropdown') {
	$wrapper_classes[] = 'dropdown';
} elseif ($display_type === 'inline') {
	$wrapper_classes[] = 'inline';
}
if ($block_class) {
	$wrapper_classes[] = $block_class;
}
$wrapper_attr = ' class="' . esc_attr(implode(' ', $wrapper_classes)) . '"';
if ($block_id) {
	$wrapper_attr .= ' id="' . esc_attr($block_id) . '"';
}

// Form markup (same structure as theme shortcode, no shortcode call)
$form_radius = function_exists('getThemeFormRadius') ? getThemeFormRadius() : ' rounded';
$form_html = '<div class="' . esc_attr($form_wrap_class) . '">'
	. '<form class="search-form" id="' . esc_attr($form_id_attr) . '">'
	. '<input type="text" id="' . esc_attr($input_id) . '" class="search-form form-control' . esc_attr($form_radius) . '" placeholder="' . esc_attr($placeholder) . '" autocomplete="off"'
	. ' data-posts-per-page="' . esc_attr($posts_per_page) . '"'
	. ' data-post-types="' . esc_attr($post_types) . '"'
	. ' data-search-content="' . esc_attr($search_content) . '"'
	. ' data-taxonomy="' . esc_attr($taxonomy) . '"'
	. ' data-term="' . esc_attr($term) . '"'
	. ' data-include-taxonomies="' . esc_attr($include_taxonomies) . '"'
	. ' data-show-excerpt="' . esc_attr($show_excerpt) . '">'
	. '</form></div>';

?>
<div<?php echo $wrapper_attr; ?>>
	<?php if ($display_type === 'dropdown') : ?>
		<a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="<?php esc_attr_e('Search', 'codeweber-gutenberg-blocks'); ?>">
			<i class="uil uil-search"></i>
		</a>
		<div class="dropdown-menu dropdown-menu-end p-0" style="min-width: <?php echo esc_attr($dropdown_min_width); ?>;">
			<?php echo $form_html; ?>
		</div>
	<?php else : ?>
		<?php echo $form_html; ?>
	<?php endif; ?>
</div>
