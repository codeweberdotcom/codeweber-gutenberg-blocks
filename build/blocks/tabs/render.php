<?php
/**
 * Tabs Block - Server-side render
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Extract attributes
$tab_style          = isset( $attributes['tabStyle'] ) ? $attributes['tabStyle'] : 'basic';
$tab_rounded        = isset( $attributes['tabRounded'] ) ? $attributes['tabRounded'] : '';
$tab_alignment      = isset( $attributes['tabAlignment'] ) ? $attributes['tabAlignment'] : 'left';
$tab_background     = isset( $attributes['tabBackground'] ) ? (bool) $attributes['tabBackground'] : false;
$items              = isset( $attributes['items'] ) ? $attributes['items'] : array();
$tabs_id            = isset( $attributes['tabsId'] ) ? $attributes['tabsId'] : '';
$tabs_class         = isset( $attributes['tabsClass'] ) ? $attributes['tabsClass'] : '';
$tabs_data          = isset( $attributes['tabsData'] ) ? $attributes['tabsData'] : '';
$inner_blocks_by_tab = isset( $attributes['innerBlocksByTab'] ) ? $attributes['innerBlocksByTab'] : array();
$anchor              = isset( $attributes['anchor'] ) ? trim( (string) $attributes['anchor'] ) : '';

if ( empty( $tabs_id ) ) {
	$tabs_id = 'tabs-' . substr( md5( (string) get_the_ID() . wp_json_encode( $items ) ), 0, 8 );
}

$container_id = $anchor ?: $tabs_id;

// Build nav classes
$nav_classes = array( 'nav', 'nav-tabs' );
if ( 'basic' === $tab_style ) {
	$nav_classes[] = 'nav-tabs-basic';
} elseif ( 'pills' === $tab_style ) {
	$nav_classes[] = 'nav-pills';
} elseif ( 'fanny' === $tab_style ) {
	$nav_classes[] = 'nav-tabs-fanny';
	$nav_classes[] = 'width-auto';

	if ( $tab_rounded ) {
		if ( 'theme' === $tab_rounded ) {
			$theme_class = class_exists( '\Codeweber_Options' ) ? trim( \Codeweber_Options::style( 'button' ) ) : '';
			if ( $theme_class ) {
				$nav_classes[] = 'tab-' . $theme_class;
				$nav_classes[] = $theme_class;
			}
		} else {
			$nav_classes[] = 'tab-' . $tab_rounded;
			$nav_classes[] = $tab_rounded;
		}
	}
	if ( 'center' === $tab_alignment ) {
		$nav_classes[] = 'mx-auto';
	} elseif ( 'right' === $tab_alignment ) {
		$nav_classes[] = 'ms-auto';
	}
	if ( $tab_background ) {
		$nav_classes[] = 'bg-white';
		$nav_classes[] = 'p-1';
		$nav_classes[] = 'shadow-xl';
	}
}
if ( $tabs_class ) {
	$nav_classes[] = $tabs_class;
}

// Build wrapper attributes via get_block_wrapper_attributes()
$wrapper_attrs_extra = array();
if ( $container_id ) {
	$wrapper_attrs_extra['id'] = $container_id;
}
if ( $tabs_data ) {
	$wrapper_attrs_extra['data-codeweber'] = $tabs_data;
}
$wrapper_attributes = get_block_wrapper_attributes( $wrapper_attrs_extra );

?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is safe ?>>

	<ul class="<?php echo esc_attr( implode( ' ', $nav_classes ) ); ?>" role="tablist">
		<?php foreach ( $items as $index => $item ) : ?>
			<?php
			$item_id      = isset( $item['id'] ) ? $item['id'] : '';
			$item_id_html = $tabs_id . '-' . $item_id;
			$item_title   = isset( $item['title'] ) ? $item['title'] : '';
			$item_icon    = isset( $item['icon'] ) ? $item['icon'] : '';
			$is_active    = 0 === $index;
			?>
			<li class="nav-item" role="presentation">
				<a
					class="nav-link<?php echo $is_active ? ' active' : ''; ?>"
					data-bs-toggle="tab"
					href="#<?php echo esc_attr( $item_id_html ); ?>"
					role="tab"
					aria-selected="<?php echo $is_active ? 'true' : 'false'; ?>"
					aria-controls="<?php echo esc_attr( $item_id_html ); ?>"
					<?php echo ! $is_active ? 'tabindex="-1"' : ''; ?>
				>
					<?php if ( $item_icon ) : ?>
						<i class="<?php echo esc_attr( $item_icon ); ?>" style="margin-right:<?php echo $item_title ? '0.5rem' : '0'; ?>"></i>
					<?php endif; ?>
					<?php echo wp_kses_post( $item_title ); ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>

	<div class="tab-content">
		<?php foreach ( $items as $index => $item ) : ?>
			<?php
			$item_id      = isset( $item['id'] ) ? $item['id'] : '';
			$item_id_html = $tabs_id . '-' . $item_id;
			$is_active    = 0 === $index;

			$pane_classes = array( 'tab-pane', 'fade' );
			if ( $is_active ) {
				$pane_classes[] = 'show';
				$pane_classes[] = 'active';
			}

			// Get tab content: new format = HTML string, old format = array of block objects
			$tab_html = '';
			if ( isset( $inner_blocks_by_tab[ $item_id ] ) ) {
				$tab_data = $inner_blocks_by_tab[ $item_id ];

				if ( is_string( $tab_data ) && ! empty( $tab_data ) ) {
					// New format: serialized block markup — render via do_blocks()
					$tab_html = do_blocks( $tab_data );
				} elseif ( is_array( $tab_data ) ) {
					// Old format: array of block objects stored directly from JS getBlocks()
					foreach ( $tab_data as $block_obj ) {
						if ( ! empty( $block_obj['originalContent'] ) ) {
							// Use pre-rendered HTML if available
							$tab_html .= wp_kses_post( $block_obj['originalContent'] );
						} elseif ( ! empty( $block_obj['name'] ) ) {
							// Reconstruct block markup and render
							$block_markup = serialize_block(
								array(
									'blockName'    => $block_obj['name'],
									'attrs'        => isset( $block_obj['attributes'] ) ? $block_obj['attributes'] : array(),
									'innerBlocks'  => array(),
									'innerHTML'    => '',
									'innerContent' => array(),
								)
							);
							$tab_html .= do_blocks( $block_markup );
						}
					}
				}
			}
			?>
			<div
				class="<?php echo esc_attr( implode( ' ', $pane_classes ) ); ?>"
				id="<?php echo esc_attr( $item_id_html ); ?>"
				role="tabpanel"
				aria-labelledby="tab-<?php echo esc_attr( $item_id_html ); ?>"
			>
				<?php
				// $tab_html is either from do_blocks() or wp_kses_post() — both safe
				echo $tab_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				?>
			</div>
		<?php endforeach; ?>
	</div>

</div>
