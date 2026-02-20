<?php
/**
 * Blog Post Widget Block - Server-side render
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

$posts_per_page = isset($attributes['postsPerPage']) ? (int) $attributes['postsPerPage'] : 3;
$image_size     = isset($attributes['imageSize']) ? $attributes['imageSize'] : 'codeweber_post_100-100';
$show_date      = isset($attributes['showDate']) ? (bool) $attributes['showDate'] : true;
$show_comments  = isset($attributes['showComments']) ? (bool) $attributes['showComments'] : true;
$title_length   = isset($attributes['titleLength']) ? (int) $attributes['titleLength'] : 50;
$source         = isset($attributes['source']) ? $attributes['source'] : 'latest';
$orderby        = isset($attributes['orderby']) ? $attributes['orderby'] : 'date';
$order          = isset($attributes['order']) ? strtoupper($attributes['order']) : 'DESC';
$category_id    = isset($attributes['categoryId']) ? (int) $attributes['categoryId'] : 0;
$tag_id         = isset($attributes['tagId']) ? (int) $attributes['tagId'] : 0;
$year           = isset($attributes['year']) ? trim((string) $attributes['year']) : '';
$border_radius  = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : '';
if ($border_radius === '' && function_exists('getThemeCardImageRadius')) {
	$border_radius = getThemeCardImageRadius('rounded');
}
if ($border_radius === '') {
	$border_radius = 'rounded';
}

$query_args = [
	'post_type'      => 'post',
	'posts_per_page' => $posts_per_page,
	'post_status'    => 'publish',
];

if ($source === 'random') {
	$query_args['orderby'] = 'rand';
} else {
	$query_args['orderby'] = $orderby;
	$query_args['order']   = $order;
}

$tax_query = [];
if ($category_id > 0) {
	$tax_query[] = [
		'taxonomy' => 'category',
		'field'    => 'term_id',
		'terms'    => $category_id,
	];
}
if ($tag_id > 0) {
	$tax_query[] = [
		'taxonomy' => 'post_tag',
		'field'    => 'term_id',
		'terms'    => $tag_id,
	];
}
if (!empty($tax_query)) {
	$tax_query['relation'] = 'AND';
	$query_args['tax_query'] = $tax_query;
}

if ($year !== '') {
	$query_args['date_query'] = [
		[
			'year' => (int) $year,
		],
	];
}

$query = new WP_Query($query_args);

if (!$query->have_posts()) {
	echo '<p>' . esc_html__('No posts found.', 'codeweber-gutenberg-blocks') . '</p>';
	return;
}

?>
<ul class="image-list">
	<?php
	while ($query->have_posts()) {
		$query->the_post();
		$post_id   = get_the_ID();
		$permalink = get_permalink();
		$title    = get_the_title();
		if ($title_length > 0 && mb_strlen($title) > $title_length) {
			$title = mb_substr($title, 0, $title_length) . '…';
		}
		$date     = get_the_date();
		$comments = get_comments_number();
		$thumb = get_the_post_thumbnail_url($post_id, $image_size);
		if (!$thumb && function_exists('codeweber_placeholder_image_url')) {
			$thumb = codeweber_placeholder_image_url();
		}
		if (!$thumb) {
			$thumb = get_template_directory_uri() . '/dist/assets/img/photos/a1.jpg';
		}
		?>
		<li>
			<figure class="<?php echo esc_attr($border_radius); ?>">
				<a href="<?php echo esc_url($permalink); ?>">
					<img src="<?php echo esc_url($thumb); ?>" alt="<?php echo esc_attr($title); ?>">
				</a>
			</figure>
			<div class="post-content">
				<div class="h6 lh-md mb-0">
					<a class="link-dark" href="<?php echo esc_url($permalink); ?>"><?php echo esc_html($title); ?></a>
				</div>
				<?php if ($show_date || $show_comments) : ?>
				<ul class="post-meta">
					<?php if ($show_date) : ?>
					<li class="post-date"><i class="uil uil-calendar-alt"></i><span><?php echo esc_html($date); ?></span></li>
					<?php endif; ?>
					<?php if ($show_comments) : ?>
					<li class="post-comments"><a href="<?php echo esc_url(get_comments_link()); ?>"><i class="uil uil-comment"></i><?php echo (int) $comments; ?></a></li>
					<?php endif; ?>
				</ul>
				<?php endif; ?>
			</div>
		</li>
		<?php
	}
	wp_reset_postdata();
	?>
</ul>
