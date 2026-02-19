<?php
/**
 * Blog Category Widget Block - Server-side render
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

$show_count   = isset($attributes['showCount']) ? (bool) $attributes['showCount'] : true;
$orderby      = isset($attributes['orderby']) ? $attributes['orderby'] : 'name';
$order        = isset($attributes['order']) ? strtoupper($attributes['order']) : 'ASC';
$number       = isset($attributes['number']) ? (int) $attributes['number'] : 0;
$list_class   = isset($attributes['listClass']) ? $attributes['listClass'] : 'unordered-list bullet-primary text-reset';

$term_args = [
	'taxonomy'   => 'category',
	'orderby'    => $orderby,
	'order'      => $order,
	'hide_empty' => true,
];
if ($number > 0) {
	$term_args['number'] = $number;
}

$categories = get_terms($term_args);

if (is_wp_error($categories) || empty($categories)) {
	echo '<p>' . esc_html__('No categories found.', 'codeweber-gutenberg-blocks') . '</p>';
	return;
}

?>
<div class="widget">
	<ul class="<?php echo esc_attr($list_class); ?>">
		<?php
		foreach ($categories as $term) {
			$url   = get_term_link($term);
			$count = $show_count ? ' (' . (int) $term->count . ')' : '';
			if (is_wp_error($url)) {
				$url = '#';
			}
			?>
			<li><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($term->name) . esc_html($count); ?></a></li>
			<?php
		}
		?>
	</ul>
</div>
