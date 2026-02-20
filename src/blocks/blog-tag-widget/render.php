<?php
/**
 * Blog Tag Widget Block - Server-side render
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

if (!defined('ABSPATH')) {
	exit;
}

$orderby       = isset($attributes['orderby']) ? $attributes['orderby'] : 'name';
$order         = isset($attributes['order']) ? strtoupper($attributes['order']) : 'ASC';
$number        = isset($attributes['number']) ? (int) $attributes['number'] : 0;
$tag_style     = isset($attributes['tagStyle']) ? $attributes['tagStyle'] : 'btn';
$tag_color     = isset($attributes['tagColor']) ? $attributes['tagColor'] : 'ash';
$tag_color_type = isset($attributes['tagColorType']) ? $attributes['tagColorType'] : 'soft';

$button_style = function_exists('getThemeButton') ? getThemeButton() : ' rounded-pill';

// Build link class: Type 1 = btn btn-soft-ash btn-sm + getThemeButton | Type 2 = badge badge-lg + getThemeButton bg-ash
if ($tag_style === 'badge') {
	$prefix = ($tag_color_type === 'soft') ? 'bg-soft-' : (($tag_color_type === 'pale') ? 'bg-pale-' : 'bg-');
	$link_class = 'badge badge-lg' . $button_style . ' ' . $prefix . $tag_color;
} else {
	$prefix = ($tag_color_type === 'soft') ? 'btn-soft-' : (($tag_color_type === 'pale') ? 'btn-pale-' : 'btn-');
	$link_class = 'btn ' . $prefix . $tag_color . ' btn-sm' . $button_style;
}

$term_args = [
	'taxonomy'   => 'post_tag',
	'orderby'    => $orderby,
	'order'      => $order,
	'hide_empty' => true,
];
if ($number > 0) {
	$term_args['number'] = $number;
}

$tags = get_terms($term_args);

if (is_wp_error($tags) || empty($tags)) {
	echo '<p>' . esc_html__('No tags found.', 'codeweber-gutenberg-blocks') . '</p>';
	return;
}

?>
<ul class="list-unstyled tag-list">
	<?php
	foreach ($tags as $term) {
		$url = get_term_link($term);
		if (is_wp_error($url)) {
			$url = '#';
		}
		?>
		<li><a href="<?php echo esc_url($url); ?>" class="<?php echo esc_attr($link_class); ?>"><?php echo esc_html($term->name); ?></a></li>
		<?php
	}
	?>
</ul>
