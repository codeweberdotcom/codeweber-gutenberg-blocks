<?php
/**
 * Switcher Block - Server-side render
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner blocks rendered HTML.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$items = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : array();

if ( empty( $items ) ) {
	return;
}

$switch_style = isset( $attributes['switchStyle'] ) ? $attributes['switchStyle'] : 'pill';
$switch_color = isset( $attributes['switchColor'] ) ? $attributes['switchColor'] : 'primary';
$switch_size  = isset( $attributes['switchSize'] ) ? $attributes['switchSize'] : 'md';
$alignment    = isset( $attributes['alignment'] ) ? $attributes['alignment'] : 'start';
$active_mode  = isset( $attributes['activeMode'] ) ? $attributes['activeMode'] : 'auto';
$active_index = isset( $attributes['activeIndex'] ) ? (int) $attributes['activeIndex'] : 0;
$block_class  = isset( $attributes['blockClass'] ) ? $attributes['blockClass'] : '';
$block_data   = isset( $attributes['blockData'] ) ? $attributes['blockData'] : '';
$block_id     = isset( $attributes['blockId'] ) ? $attributes['blockId'] : '';
$anchor       = isset( $attributes['anchor'] ) ? trim( (string) $attributes['anchor'] ) : '';

$size_classes = array(
	'sm' => 'px-3 py-1 fs-14',
	'md' => 'px-4 py-2 fs-15',
	'lg' => 'px-5 py-3 fs-17',
);
$size_class = isset( $size_classes[ $switch_size ] ) ? $size_classes[ $switch_size ] : $size_classes['md'];

$align_classes = array(
	'start'  => 'justify-content-start',
	'center' => 'justify-content-center',
	'end'    => 'justify-content-end',
);
$align_class = isset( $align_classes[ $alignment ] ) ? $align_classes[ $alignment ] : $align_classes['start'];

/**
 * Path of a URL, stripped of host, query, fragment and trailing slash, so that
 * '/business/', 'https://site.test/business', and '/business/?utm=x' all match.
 */
$cw_switcher_path = static function ( $url ) {
	$path = (string) wp_parse_url( (string) $url, PHP_URL_PATH );
	$path = untrailingslashit( $path );
	return '' === $path ? '/' : $path;
};

// Which item is current? Longest match wins, so '/business/pricing' beats '/'.
if ( 'auto' === $active_mode ) {
	$current_path = $cw_switcher_path( isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/' );
	$best_length  = -1;

	foreach ( $items as $index => $item ) {
		if ( empty( $item['url'] ) ) {
			continue;
		}

		$item_path = $cw_switcher_path( $item['url'] );
		if ( '/' === $item_path ) {
			$matches = ( '/' === $current_path );
		} else {
			$matches = ( $current_path === $item_path || 0 === strpos( $current_path . '/', $item_path . '/' ) );
		}

		if ( $matches && strlen( $item_path ) > $best_length ) {
			$best_length  = strlen( $item_path );
			$active_index = (int) $index;
		}
	}
}

// Parse block data attributes: "key=value, key2=value2".
$data_attributes = '';
if ( $block_data ) {
	foreach ( explode( ',', $block_data ) as $pair ) {
		$parts = array_map( 'trim', explode( '=', $pair, 2 ) );
		if ( 2 === count( $parts ) && '' !== $parts[0] && '' !== $parts[1] ) {
			$data_attributes .= sprintf( ' data-%s="%s"', esc_attr( $parts[0] ), esc_attr( $parts[1] ) );
		}
	}
}

$container_id = $anchor ? $anchor : $block_id;
$is_segmented = 'segmented' === $switch_style;

$container_classes = $is_segmented
	? array( 'btn-group', $block_class )
	: array( 'nav', 'nav-pills', 'bg-' . $switch_color, 'rounded-pill', 'p-1', 'd-inline-flex', $block_class );

$container_class = implode( ' ', array_filter( $container_classes ) );
$last_index      = count( $items ) - 1;
?>
<div class="d-flex <?php echo esc_attr( $align_class ); ?>">
	<?php if ( $is_segmented ) : ?>
	<div class="<?php echo esc_attr( $container_class ); ?>" role="group"
		<?php echo $container_id ? ' id="' . esc_attr( $container_id ) . '"' : ''; ?>
		<?php echo $data_attributes; // phpcs:ignore WordPress.Security.EscapeOutput ?>>
	<?php else : ?>
	<ul class="<?php echo esc_attr( $container_class ); ?>"
		<?php echo $container_id ? ' id="' . esc_attr( $container_id ) . '"' : ''; ?>
		<?php echo $data_attributes; // phpcs:ignore WordPress.Security.EscapeOutput ?>>
	<?php endif; ?>

		<?php
		foreach ( $items as $index => $item ) :
			$label     = isset( $item['label'] ) ? $item['label'] : '';
			$url       = isset( $item['url'] ) ? $item['url'] : '';
			$is_active = ( (int) $index === $active_index );

			if ( $is_segmented ) {
				$item_class = 'btn ' . ( $is_active
					? 'btn-soft-' . $switch_color . ' border-' . $switch_color . ' fw-bold'
					: 'btn-outline-ash' ) . ' ' . $size_class;
			} else {
				$item_class = 'nav-link rounded-pill ' . ( $is_active
					? 'active text-' . $switch_color
					: 'text-white' ) . ( $index === $last_index ? ' me-0' : '' ) . ' ' . $size_class;
			}

			$tag  = $url ? 'a' : 'span';
			$attr = $url ? ' href="' . esc_url( $url ) . '"' : '';
			$attr .= $is_active ? ' aria-current="page"' : '';

			$link = sprintf(
				'<%1$s class="%2$s"%3$s>%4$s</%1$s>',
				$tag,
				esc_attr( $item_class ),
				$attr,
				esc_html( $label )
			);

			if ( $is_segmented ) {
				echo $link; // phpcs:ignore WordPress.Security.EscapeOutput
			} else {
				echo '<li class="nav-item">' . $link . '</li>'; // phpcs:ignore WordPress.Security.EscapeOutput
			}
		endforeach;
		?>

	<?php if ( $is_segmented ) : ?>
	</div>
	<?php else : ?>
	</ul>
	<?php endif; ?>
</div>
