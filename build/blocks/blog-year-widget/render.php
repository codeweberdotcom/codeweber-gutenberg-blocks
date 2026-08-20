<?php
/**
 * Blog Year Widget Block - Server-side render
 * Outputs monthly archive links (e.g. February 2019).
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

$number       = isset($attributes['number']) ? (int) $attributes['number'] : 12;
$order        = isset($attributes['order']) ? strtoupper($attributes['order']) : 'DESC';
$text_inverse = isset($attributes['textInverse']) ? (bool) $attributes['textInverse'] : false;
$list_class   = 'unordered-list bullet-primary' . ($text_inverse ? ' text-inverse' : '');

$archives = wp_get_archives([
	'type'            => 'monthly',
	'limit'           => $number > 0 ? $number : 12,
	'order'           => $order,
	'echo'            => 0,
	'format'          => 'html',
	'show_post_count' => false,
]);

if (empty($archives)) {
	echo '<p>' . esc_html__('No archives found.', 'codeweber-gutenberg-blocks') . '</p>';
	return;
}

$anchor = isset($attributes['anchor']) ? trim((string) $attributes['anchor']) : '';
?>
<ul class="<?php echo esc_attr($list_class); ?>"<?php echo $anchor ? ' id="' . esc_attr($anchor) . '"' : ''; ?>>
	<?php echo $archives; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_get_archives() returns escaped HTML ?>
</ul>
