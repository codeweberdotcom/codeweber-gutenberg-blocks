<?php
/**
 * Tabs Block - Server-side render
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

// ── Attributes ──────────────────────────────────────────────────────────────

$tab_style      = isset( $attributes['tabStyle'] ) ? $attributes['tabStyle'] : 'basic';
$tab_rounded    = isset( $attributes['tabRounded'] ) ? $attributes['tabRounded'] : '';
$tab_alignment  = isset( $attributes['tabAlignment'] ) ? $attributes['tabAlignment'] : 'left';
$tab_background = isset( $attributes['tabBackground'] ) ? (bool) $attributes['tabBackground'] : false;
$tabs_id        = isset( $attributes['tabsId'] ) ? $attributes['tabsId'] : '';
$tabs_class     = isset( $attributes['tabsClass'] ) ? $attributes['tabsClass'] : '';
$tabs_data      = isset( $attributes['tabsData'] ) ? $attributes['tabsData'] : '';
$anchor         = isset( $attributes['anchor'] ) ? trim( (string) $attributes['anchor'] ) : '';

if ( empty( $tabs_id ) ) {
	$tabs_id = 'tabs-' . substr( md5( (string) get_the_ID() . wp_json_encode( $attributes ) ), 0, 8 );
}

$container_id = $anchor ?: $tabs_id;

// ── Nav classes ──────────────────────────────────────────────────────────────

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

// ── Wrapper attributes ───────────────────────────────────────────────────────

$wrapper_attrs_extra = array();
if ( $container_id ) {
	$wrapper_attrs_extra['id'] = $container_id;
}
if ( $tabs_data ) {
	$wrapper_attrs_extra['data-codeweber'] = $tabs_data;
}
$wrapper_attributes = get_block_wrapper_attributes( $wrapper_attrs_extra );

// ── Build nav from inner blocks ──────────────────────────────────────────────
// Supports both new format (inner_blocks) and old format (items attribute).

$nav_items_html = '';
$has_inner_blocks = isset( $block->inner_blocks ) && count( $block->inner_blocks ) > 0;
$old_items        = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : array();
$has_old_items    = ! empty( $old_items );

if ( $has_inner_blocks ) {
	// NEW FORMAT: iterate inner tab-panel blocks
	foreach ( $block->inner_blocks as $index => $panel_block ) {
		$title     = isset( $panel_block->attributes['tabTitle'] ) ? $panel_block->attributes['tabTitle'] : ( 'Tab ' . ( $index + 1 ) );
		$icon      = isset( $panel_block->attributes['tabIcon'] ) ? $panel_block->attributes['tabIcon'] : '';
		$panel_id  = isset( $panel_block->attributes['panelId'] ) && $panel_block->attributes['panelId']
			? $panel_block->attributes['panelId']
			: ( 'panel-' . $index );
		$panel_id_html = $tabs_id . '-' . $panel_id;
		$is_active = ( 0 === $index );

		$nav_items_html .= '<li class="nav-item" role="presentation">';
		$nav_items_html .= '<a'
			. ' class="nav-link' . ( $is_active ? ' active' : '' ) . '"'
			. ' data-bs-toggle="tab"'
			. ' href="#' . esc_attr( $panel_id_html ) . '"'
			. ' role="tab"'
			. ' aria-selected="' . ( $is_active ? 'true' : 'false' ) . '"'
			. ( ! $is_active ? ' tabindex="-1"' : '' )
			. '>';
		if ( $icon ) {
			$nav_items_html .= '<i class="' . esc_attr( $icon ) . '" style="margin-right:0.5rem"></i>';
		}
		$nav_items_html .= wp_kses_post( $title );
		$nav_items_html .= '</a>';
		$nav_items_html .= '</li>';
	}
} elseif ( $has_old_items ) {
	// OLD FORMAT: build nav from items attribute
	foreach ( $old_items as $index => $item ) {
		$item_id      = isset( $item['id'] ) ? $item['id'] : '';
		$item_id_html = $tabs_id . '-' . $item_id;
		$item_title   = isset( $item['title'] ) ? $item['title'] : '';
		$item_icon    = isset( $item['icon'] ) ? $item['icon'] : '';
		$is_active    = ( 0 === $index );

		$nav_items_html .= '<li class="nav-item" role="presentation">';
		$nav_items_html .= '<a'
			. ' class="nav-link' . ( $is_active ? ' active' : '' ) . '"'
			. ' data-bs-toggle="tab"'
			. ' href="#' . esc_attr( $item_id_html ) . '"'
			. ' role="tab"'
			. ' aria-selected="' . ( $is_active ? 'true' : 'false' ) . '"'
			. ( ! $is_active ? ' tabindex="-1"' : '' )
			. '>';
		if ( $item_icon ) {
			$nav_items_html .= '<i class="' . esc_attr( $item_icon ) . '" style="margin-right:0.5rem"></i>';
		}
		$nav_items_html .= wp_kses_post( $item_title );
		$nav_items_html .= '</a>';
		$nav_items_html .= '</li>';
	}
}

// ── Render ───────────────────────────────────────────────────────────────────

?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<ul class="<?php echo esc_attr( implode( ' ', $nav_classes ) ); ?>" role="tablist">
		<?php echo $nav_items_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</ul>

	<div class="tab-content">
		<?php if ( $has_inner_blocks ) : ?>
			<?php
			// New format: tab-panel blocks render their own <div class="tab-pane"> wrappers.
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $content;
			?>
		<?php elseif ( $has_old_items ) : ?>
			<?php
			// Old format: render panes from innerBlocksByTab.
			$inner_blocks_by_tab = isset( $attributes['innerBlocksByTab'] ) ? $attributes['innerBlocksByTab'] : array();
			foreach ( $old_items as $index => $item ) :
				$item_id      = isset( $item['id'] ) ? $item['id'] : '';
				$item_id_html = $tabs_id . '-' . $item_id;
				$is_active    = ( 0 === $index );

				$pane_classes = 'tab-pane fade' . ( $is_active ? ' active show' : '' );

				$tab_html = '';
				if ( isset( $inner_blocks_by_tab[ $item_id ] ) ) {
					$tab_data = $inner_blocks_by_tab[ $item_id ];
					if ( is_string( $tab_data ) && ! empty( $tab_data ) ) {
						$tab_html = do_blocks( $tab_data );
					} elseif ( is_array( $tab_data ) ) {
						foreach ( $tab_data as $block_obj ) {
							if ( ! empty( $block_obj['originalContent'] ) ) {
								$tab_html .= wp_kses_post( $block_obj['originalContent'] );
							} elseif ( ! empty( $block_obj['name'] ) ) {
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
					class="<?php echo esc_attr( $pane_classes ); ?>"
					id="<?php echo esc_attr( $item_id_html ); ?>"
					role="tabpanel"
					aria-labelledby="tab-<?php echo esc_attr( $item_id_html ); ?>"
				>
					<?php echo $tab_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>

</div>
