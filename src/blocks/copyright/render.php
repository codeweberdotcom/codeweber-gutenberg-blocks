<?php
/**
 * Copyright Block — Server-Side Render
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * Available: $attributes, $content, $block
 */

$show_copyright  = ! empty( $attributes['showCopyright'] );
$show_year       = ! empty( $attributes['showYear'] );
$copyright_text  = esc_html( $attributes['copyrightText'] ?? '' );
$show_developer  = ! empty( $attributes['showDeveloper'] );
$developer_label = esc_html( $attributes['developerLabel'] ?? '' );
$developer_name  = esc_html( $attributes['developerName'] ?? '' );
$developer_url   = esc_url( $attributes['developerUrl'] ?? '' );
$developer_target = ! empty( $attributes['developerTarget'] );
$text_color      = esc_attr( $attributes['textColor'] ?? '' );
$link_color      = esc_attr( $attributes['linkColor'] ?? '' );
$alignment       = esc_attr( $attributes['alignment'] ?? 'text-center' );
$separator       = esc_html( $attributes['separator'] ?? ' \u2014 ' );
$layout          = esc_attr( $attributes['layout'] ?? 'inline' );

if ( ! $show_copyright && ! $show_developer ) {
	return;
}

$extra_classes = array_filter( [ $alignment, $text_color ] );

$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => implode( ' ', $extra_classes ),
] );

// Build copyright part.
$copyright_part = '';
if ( $show_copyright ) {
	$year_prefix    = $show_year ? '&copy; ' . esc_html( date( 'Y' ) ) . ' ' : '';
	$copyright_part = $year_prefix . $copyright_text;
}

// Build developer part.
$developer_part = '';
if ( $show_developer && $developer_name ) {
	$target_attr = $developer_target ? ' target="_blank" rel="noopener noreferrer"' : '';
	$link_class  = $link_color ? ' class="' . esc_attr( $link_color ) . '"' : '';

	if ( $developer_url ) {
		$developer_link = '<a href="' . $developer_url . '"' . $link_class . $target_attr . '>' . $developer_name . '</a>';
	} else {
		$developer_link = $developer_name;
	}

	$developer_part = $developer_label
		? $developer_label . ' ' . $developer_link
		: $developer_link;
}

$parts = array_filter( [ $copyright_part, $developer_part ] );
?>
<div <?php echo $wrapper_attributes; ?>>
<?php if ( 'stacked' === $layout ) : ?>
	<?php if ( $copyright_part ) : ?>
		<p class="mb-0"><?php echo $copyright_part; ?></p>
	<?php endif; ?>
	<?php if ( $developer_part ) : ?>
		<p class="mb-0"><?php echo $developer_part; ?></p>
	<?php endif; ?>
<?php else : ?>
	<p class="mb-0"><?php echo implode( $separator, $parts ); ?></p>
<?php endif; ?>
</div>
