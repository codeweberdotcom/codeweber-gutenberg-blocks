<?php
/**
 * Floating Navigator Block - Server-side render
 *
 * Floating button → popup with anchor links → smooth scroll.
 * Active item highlighted via IntersectionObserver.
 * Popup closes only on outside click or Escape.
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

$items            = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : [];
$position         = isset( $attributes['position'] ) ? $attributes['position'] : 'right-bottom';
$btn_type_desktop = isset( $attributes['buttonTypeDesktop'] ) ? $attributes['buttonTypeDesktop'] : 'button';
$btn_type_tablet  = isset( $attributes['buttonTypeTablet'] ) ? $attributes['buttonTypeTablet'] : 'icon';
$btn_type_mobile  = isset( $attributes['buttonTypeMobile'] ) ? $attributes['buttonTypeMobile'] : 'icon';
$button_text      = isset( $attributes['buttonText'] ) ? $attributes['buttonText'] : 'Navigation';
$button_icon      = isset( $attributes['buttonIcon'] ) ? $attributes['buttonIcon'] : 'list-ul';
$button_color     = isset( $attributes['buttonColor'] ) ? $attributes['buttonColor'] : 'primary';
$button_size      = isset( $attributes['buttonSize'] ) ? $attributes['buttonSize'] : 'md';
$button_rotate    = ! empty( $attributes['buttonRotate'] );
$popup_title      = isset( $attributes['popupTitle'] ) ? $attributes['popupTitle'] : 'Contents';
$popup_bg         = isset( $attributes['popupBgColor'] ) ? $attributes['popupBgColor'] : '#ffffff';
$popup_text       = isset( $attributes['popupTextColor'] ) ? $attributes['popupTextColor'] : '#212529';
$offset_x_desktop = isset( $attributes['offsetXDesktop'] ) ? (int) $attributes['offsetXDesktop'] : 24;
$offset_y_desktop = isset( $attributes['offsetYDesktop'] ) ? (int) $attributes['offsetYDesktop'] : 24;
$offset_x_tablet  = isset( $attributes['offsetXTablet'] ) ? (int) $attributes['offsetXTablet'] : 16;
$offset_y_tablet  = isset( $attributes['offsetYTablet'] ) ? (int) $attributes['offsetYTablet'] : 16;
$offset_x_mobile  = isset( $attributes['offsetXMobile'] ) ? (int) $attributes['offsetXMobile'] : 12;
$offset_y_mobile  = isset( $attributes['offsetYMobile'] ) ? (int) $attributes['offsetYMobile'] : 12;

if ( empty( $items ) ) {
	return;
}

// Sanitize
$allowed_positions = [ 'right-bottom', 'right-top', 'left-bottom', 'left-top' ];
$allowed_types     = [ 'icon', 'button' ];
$allowed_sizes     = [ 'sm', 'md', 'lg', 'elg' ];

$position         = in_array( $position, $allowed_positions, true ) ? $position : 'right-bottom';
$btn_type_desktop = in_array( $btn_type_desktop, $allowed_types, true ) ? $btn_type_desktop : 'button';
$btn_type_tablet  = in_array( $btn_type_tablet, $allowed_types, true ) ? $btn_type_tablet : 'icon';
$btn_type_mobile  = in_array( $btn_type_mobile, $allowed_types, true ) ? $btn_type_mobile : 'icon';
$button_color     = preg_replace( '/[^a-z0-9\-]/', '', $button_color );
$button_icon      = preg_replace( '/[^a-z0-9\-]/', '', $button_icon );
$button_size      = in_array( $button_size, $allowed_sizes, true ) ? $button_size : 'md';
$popup_bg         = sanitize_hex_color( $popup_bg ) ?: '#ffffff';
$popup_text       = sanitize_hex_color( $popup_text ) ?: '#212529';

$has_text = 'button' === $btn_type_desktop || 'button' === $btn_type_tablet || 'button' === $btn_type_mobile;

$size_map       = [ 'sm' => '1.8rem', 'md' => '2.2rem', 'lg' => '3rem', 'elg' => '4rem' ];
$btn_size_value = $size_map[ $button_size ] ?? '2.2rem';

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
	"--fn-btn-size:{$btn_size_value}",
] );

// Collect anchor IDs for IntersectionObserver
$anchor_ids = array_filter( array_column( $items, 'anchor' ) );
?>
<div
	id="<?php echo esc_attr( $unique_id ); ?>"
	class="cwgb-floating-nav"
	data-position="<?php echo esc_attr( $position ); ?>"
	data-btn-type-desktop="<?php echo esc_attr( $btn_type_desktop ); ?>"
	data-btn-type-tablet="<?php echo esc_attr( $btn_type_tablet ); ?>"
	data-btn-type-mobile="<?php echo esc_attr( $btn_type_mobile ); ?>"
	data-btn-size="<?php echo esc_attr( $button_size ); ?>"
	<?php if ( $button_rotate ) : ?>data-rotate="true"<?php endif; ?>
	style="<?php echo esc_attr( $css_vars ); ?>"
	aria-label="<?php esc_attr_e( 'Page navigation', 'codeweber-gutenberg-blocks' ); ?>"
>
	<button
		class="cwgb-floating-nav__trigger btn btn-<?php echo esc_attr( $button_color ); ?>"
		aria-expanded="false"
		aria-haspopup="true"
		aria-controls="<?php echo esc_attr( $unique_id . '-popup' ); ?>"
		type="button"
	>
		<i class="uil uil-<?php echo esc_attr( $button_icon ); ?>"></i>
		<?php if ( $has_text && $button_text ) : ?>
			<span class="cwgb-floating-nav__trigger-text"><?php echo esc_html( $button_text ); ?></span>
		<?php endif; ?>
	</button>

	<div
		id="<?php echo esc_attr( $unique_id . '-popup' ); ?>"
		class="cwgb-floating-nav__popup"
		aria-hidden="true"
		role="navigation"
	>
		<?php if ( $popup_title ) : ?>
			<div class="cwgb-floating-nav__popup-title">
				<?php echo esc_html( $popup_title ); ?>
			</div>
		<?php endif; ?>

		<?php foreach ( $items as $item ) :
			if ( empty( $item['anchor'] ) ) {
				continue;
			}
			$label = isset( $item['label'] ) && $item['label'] ? $item['label'] : $item['anchor'];
			?>
			<a
				href="#<?php echo esc_attr( $item['anchor'] ); ?>"
				class="cwgb-floating-nav__item nav-link"
				data-anchor="<?php echo esc_attr( $item['anchor'] ); ?>"
			><?php echo esc_html( $label ); ?></a>
		<?php endforeach; ?>
	</div>
</div>

<script>
( function () {
	var widget  = document.getElementById( '<?php echo esc_js( $unique_id ); ?>' );
	if ( ! widget ) return;

	var trigger = widget.querySelector( '.cwgb-floating-nav__trigger' );
	var popup   = widget.querySelector( '.cwgb-floating-nav__popup' );
	var links   = popup.querySelectorAll( '.cwgb-floating-nav__item' );

	// ── Open / close ───────────────────────────────────────
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
		if ( ! widget.contains( e.target ) ) close();
	} );

	document.addEventListener( 'keydown', function ( e ) {
		if ( e.key === 'Escape' ) close();
	} );

	// ── Smooth scroll (popup stays open) ───────────────────
	links.forEach( function ( link ) {
		link.addEventListener( 'click', function ( e ) {
			var target = document.getElementById( this.getAttribute( 'href' ).slice( 1 ) );
			if ( target ) {
				e.preventDefault();
				target.scrollIntoView( { behavior: 'smooth', block: 'start' } );
			}
		} );
	} );

	// ── Active item via IntersectionObserver ───────────────
	var anchors = <?php echo wp_json_encode( array_values( $anchor_ids ) ); ?>;

	if ( 'IntersectionObserver' in window && anchors.length ) {
		var activeAnchor = null;

		function setActive( anchor ) {
			if ( activeAnchor === anchor ) return;
			activeAnchor = anchor;
			links.forEach( function ( link ) {
				var isActive = link.getAttribute( 'data-anchor' ) === anchor;
				link.classList.toggle( 'active', isActive );
				link.toggleAttribute( 'aria-current', isActive );
			} );
		}

		// Track which sections are visible and pick the topmost one
		var visible = {};

		var observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					visible[ entry.target.id ] = entry.isIntersecting;
				} );

				// First visible anchor in DOM order wins
				var found = anchors.find( function ( id ) { return visible[ id ]; } );
				if ( found ) setActive( found );
			},
			{ rootMargin: '0px 0px -40% 0px', threshold: 0 }
		);

		anchors.forEach( function ( id ) {
			var el = document.getElementById( id );
			if ( el ) observer.observe( el );
		} );
	}
} )();
</script>
