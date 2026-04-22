<?php
/**
 * Floating Navigator Block - Server-side render
 *
 * Renders a fixed floating button that opens an anchor-link popup on click.
 * Smooth scroll is handled by inline JS.
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array $attributes Block attributes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! isset( $attributes ) || ! is_array( $attributes ) ) {
	$attributes = [];
}

$items          = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : [];
$position       = isset( $attributes['position'] ) ? $attributes['position'] : 'right-bottom';
$button_type    = isset( $attributes['buttonType'] ) ? $attributes['buttonType'] : 'icon';
$button_text    = isset( $attributes['buttonText'] ) ? $attributes['buttonText'] : 'Navigation';
$button_icon    = isset( $attributes['buttonIcon'] ) ? $attributes['buttonIcon'] : 'list-ul';
$button_color   = isset( $attributes['buttonColor'] ) ? $attributes['buttonColor'] : 'primary';
$popup_bg       = isset( $attributes['popupBgColor'] ) ? $attributes['popupBgColor'] : '#ffffff';
$popup_text     = isset( $attributes['popupTextColor'] ) ? $attributes['popupTextColor'] : '#212529';
$offset_x_desktop = isset( $attributes['offsetXDesktop'] ) ? (int) $attributes['offsetXDesktop'] : 24;
$offset_y_desktop = isset( $attributes['offsetYDesktop'] ) ? (int) $attributes['offsetYDesktop'] : 24;
$offset_x_tablet  = isset( $attributes['offsetXTablet'] ) ? (int) $attributes['offsetXTablet'] : 16;
$offset_y_tablet  = isset( $attributes['offsetYTablet'] ) ? (int) $attributes['offsetYTablet'] : 16;
$offset_x_mobile  = isset( $attributes['offsetXMobile'] ) ? (int) $attributes['offsetXMobile'] : 12;
$offset_y_mobile  = isset( $attributes['offsetYMobile'] ) ? (int) $attributes['offsetYMobile'] : 12;

// Don't render without items
if ( empty( $items ) ) {
	return;
}

// Sanitize all values
$position     = in_array( $position, [ 'right-bottom', 'right-top', 'left-bottom', 'left-top' ], true ) ? $position : 'right-bottom';
$button_type  = in_array( $button_type, [ 'icon', 'button' ], true ) ? $button_type : 'icon';
$button_color = preg_replace( '/[^a-z0-9\-]/', '', $button_color );
$button_icon  = preg_replace( '/[^a-z0-9\-]/', '', $button_icon );
$popup_bg     = sanitize_hex_color( $popup_bg ) ?: '#ffffff';
$popup_text   = sanitize_hex_color( $popup_text ) ?: '#212529';

$unique_id = 'cwgb-fn-' . substr( md5( wp_json_encode( $attributes ) ), 0, 8 );

$css_vars = implode( '; ', [
	"--fn-offset-x-desktop:{$offset_x_desktop}px",
	"--fn-offset-y-desktop:{$offset_y_desktop}px",
	"--fn-offset-x-tablet:{$offset_x_tablet}px",
	"--fn-offset-y-tablet:{$offset_y_tablet}px",
	"--fn-offset-x-mobile:{$offset_x_mobile}px",
	"--fn-offset-y-mobile:{$offset_y_mobile}px",
	"--fn-popup-bg:{$popup_bg}",
	"--fn-popup-text:{$popup_text}",
] );
?>
<div
	id="<?php echo esc_attr( $unique_id ); ?>"
	class="cwgb-floating-nav"
	data-position="<?php echo esc_attr( $position ); ?>"
	style="<?php echo esc_attr( $css_vars ); ?>"
	aria-label="<?php esc_attr_e( 'Page navigation', 'codeweber-gutenberg-blocks' ); ?>"
>
	<button
		class="cwgb-floating-nav__trigger btn btn-<?php echo esc_attr( $button_color ); ?> btn-circle"
		aria-expanded="false"
		aria-haspopup="true"
		aria-controls="<?php echo esc_attr( $unique_id . '-popup' ); ?>"
		type="button"
	>
		<i class="uil uil-<?php echo esc_attr( $button_icon ); ?>"></i>
		<?php if ( 'button' === $button_type && $button_text ) : ?>
			<span class="cwgb-floating-nav__trigger-text"><?php echo esc_html( $button_text ); ?></span>
		<?php endif; ?>
	</button>

	<div
		id="<?php echo esc_attr( $unique_id . '-popup' ); ?>"
		class="cwgb-floating-nav__popup"
		aria-hidden="true"
		role="navigation"
	>
		<?php foreach ( $items as $item ) :
			if ( empty( $item['anchor'] ) ) {
				continue;
			}
			$label  = isset( $item['label'] ) && $item['label'] ? $item['label'] : $item['anchor'];
			?>
			<a
				href="#<?php echo esc_attr( $item['anchor'] ); ?>"
				class="cwgb-floating-nav__item"
			>
				<?php echo esc_html( $label ); ?>
			</a>
		<?php endforeach; ?>
	</div>
</div>

<script>
( function () {
	var widget = document.getElementById( '<?php echo esc_js( $unique_id ); ?>' );
	if ( ! widget ) return;

	var trigger = widget.querySelector( '.cwgb-floating-nav__trigger' );
	var popup   = widget.querySelector( '.cwgb-floating-nav__popup' );

	function open() {
		popup.classList.add( 'is-open' );
		trigger.setAttribute( 'aria-expanded', 'true' );
		popup.setAttribute( 'aria-hidden', 'false' );
	}

	function close() {
		popup.classList.remove( 'is-open' );
		trigger.setAttribute( 'aria-expanded', 'false' );
		popup.setAttribute( 'aria-hidden', 'true' );
	}

	trigger.addEventListener( 'click', function ( e ) {
		e.stopPropagation();
		popup.classList.contains( 'is-open' ) ? close() : open();
	} );

	document.addEventListener( 'click', function ( e ) {
		if ( ! widget.contains( e.target ) ) {
			close();
		}
	} );

	document.addEventListener( 'keydown', function ( e ) {
		if ( e.key === 'Escape' ) {
			close();
		}
	} );

	popup.querySelectorAll( '.cwgb-floating-nav__item' ).forEach( function ( link ) {
		link.addEventListener( 'click', function ( e ) {
			var target = document.getElementById( this.getAttribute( 'href' ).slice( 1 ) );
			if ( target ) {
				e.preventDefault();
				close();
				setTimeout( function () {
					target.scrollIntoView( { behavior: 'smooth', block: 'start' } );
				}, 120 );
			}
		} );
	} );
} )();
</script>
