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

$number = isset($attributes['number']) ? (int) $attributes['number'] : 12;
$order  = isset($attributes['order']) ? strtoupper($attributes['order']) : 'DESC';

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

?>
<ul class="unordered-list bullet-primary text-reset">
	<?php echo $archives; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_get_archives() returns escaped HTML ?>
</ul>
