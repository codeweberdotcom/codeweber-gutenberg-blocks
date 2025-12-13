<?php
/**
 * Server-side rendering for the Avatar block
 *
 * @package CodeWeber Gutenberg Blocks
 * 
 * Variables available from Plugin.php via extract():
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

$avatar_type = isset( $attributes['avatarType'] ) ? $attributes['avatarType'] : 'custom';
$size        = isset( $attributes['size'] ) ? $attributes['size'] : '15';
$show_name   = isset( $attributes['showName'] ) ? $attributes['showName'] : false;
$user_id     = isset( $attributes['userId'] ) ? intval( $attributes['userId'] ) : 0;

// Block classes
$block_classes = array( 'cwgb-avatar-block' );
if ( ! empty( $attributes['blockAlign'] ) ) {
	$block_classes[] = 'text-' . esc_attr( $attributes['blockAlign'] );
}
if ( ! empty( $attributes['blockClass'] ) ) {
	$block_classes[] = esc_attr( $attributes['blockClass'] );
}

// Parse data attributes
$data_attributes = array();
if ( ! empty( $attributes['blockData'] ) ) {
	$pairs = explode( ',', $attributes['blockData'] );
	foreach ( $pairs as $pair ) {
		$parts = array_map( 'trim', explode( '=', $pair ) );
		if ( count( $parts ) === 2 ) {
			$data_attributes[ 'data-' . esc_attr( $parts[0] ) ] = esc_attr( $parts[1] );
		}
	}
}

// Helper function to get initials from name
$get_initials = function( $full_name ) {
	if ( empty( $full_name ) ) {
		return 'AB';
	}
	$words = array_filter( explode( ' ', trim( $full_name ) ) );
	if ( empty( $words ) ) {
		return 'AB';
	}
	if ( count( $words ) === 1 ) {
		return strtoupper( substr( $words[0], 0, 2 ) );
	}
	return strtoupper( substr( $words[0], 0, 1 ) . substr( end( $words ), 0, 1 ) );
};

// Avatar classes
$avatar_classes = array( 'avatar' );
// Background and text color for letters fallback
if ( ! empty( $attributes['bgColor'] ) ) {
	$avatar_classes[] = 'bg-' . esc_attr( $attributes['bgColor'] );
}
if ( ! empty( $attributes['textColor'] ) ) {
	$avatar_classes[] = 'text-' . esc_attr( $attributes['textColor'] );
}
if ( $size ) {
	$avatar_classes[] = 'w-' . esc_attr( $size );
	$avatar_classes[] = 'h-' . esc_attr( $size );
}

$wrapper_class = $show_name ? 'd-flex align-items-center' : '';
$avatar_style  = $show_name ? ' style="margin-right: 12px;"' : '';

ob_start();
?>
<div class="<?php echo esc_attr( implode( ' ', $block_classes ) ); ?>" 
	<?php echo ! empty( $attributes['blockId'] ) ? 'id="' . esc_attr( $attributes['blockId'] ) . '"' : ''; ?>
	<?php echo ! empty( $data_attributes ) ? wp_kses_data( implode( ' ', array_map( function( $key, $value ) { return $key . '="' . $value . '"'; }, array_keys( $data_attributes ), $data_attributes ) ) ) : ''; ?>>
	<?php if ( $avatar_type === 'user' && $user_id ) : ?>
		<?php
		$user = get_userdata( $user_id );
		if ( $user ) {
			// Get avatar
			$avatar_id = get_user_meta( $user_id, 'avatar_id', true );
			if ( empty( $avatar_id ) ) {
				$avatar_id = get_user_meta( $user_id, 'custom_avatar_id', true );
			}

			$user_link = get_author_posts_url( $user_id );
			$job_title = get_user_meta( $user_id, 'user_position', true );
			?>
			<div class="author-info d-md-flex align-items-center">
				<div class="d-flex align-items-center">
					<figure class="user-avatar">
						<?php
						if ( ! empty( $avatar_id ) ) {
							$avatar_src = wp_get_attachment_image_src( $avatar_id, 'thumbnail' );
							if ( $avatar_src ) {
								?>
								<img class="rounded-circle" 
									src="<?php echo esc_url( $avatar_src[0] ); ?>" 
									alt="<?php echo esc_attr( $user->display_name ); ?>">
								<?php
							} else {
								// Fallback to letters
								$initials = $get_initials( $user->display_name );
								?>
								<span class="<?php echo esc_attr( implode( ' ', $avatar_classes ) ); ?>">
									<span><?php echo esc_html( $initials ); ?></span>
								</span>
								<?php
							}
						} else {
							// Use WordPress default avatar or letters
							$avatar_html = get_avatar( $user->user_email, 96 );
							if ( $avatar_html ) {
								// Extract src from avatar HTML
								preg_match( '/src=["\']([^"\']+)["\']/', $avatar_html, $matches );
								if ( ! empty( $matches[1] ) ) {
									?>
									<img class="rounded-circle" 
										src="<?php echo esc_url( $matches[1] ); ?>" 
										alt="<?php echo esc_attr( $user->display_name ); ?>">
									<?php
								} else {
									// Fallback to letters
									$initials = $get_initials( $user->display_name );
									?>
									<span class="<?php echo esc_attr( implode( ' ', $avatar_classes ) ); ?>">
										<span><?php echo esc_html( $initials ); ?></span>
									</span>
									<?php
								}
							} else {
								// Final fallback
								$initials = $get_initials( $user->display_name );
								?>
								<span class="<?php echo esc_attr( implode( ' ', $avatar_classes ) ); ?>">
									<span><?php echo esc_html( $initials ); ?></span>
								</span>
								<?php
							}
						}
						?>
					</figure>
					<div>
						<h6>
							<a href="<?php echo esc_url( $user_link ); ?>" class="link-dark">
								<?php echo esc_html( $user->display_name ); ?>
							</a>
						</h6>
						<?php if ( $job_title ) : ?>
							<span class="post-meta fs-15">
								<?php echo esc_html( $job_title ); ?>
							</span>
						<?php endif; ?>
					</div>
				</div>
			</div>
			<?php
		}
		?>
	<?php else : ?>
		<div class="<?php echo esc_attr( $wrapper_class ); ?>">
			<?php if ( ! empty( $attributes['imageUrl'] ) ) : ?>
				<img class="<?php echo esc_attr( implode( ' ', $avatar_classes ) ); ?>" 
					src="<?php echo esc_url( $attributes['imageUrl'] ); ?>" 
					alt="<?php echo esc_attr( ! empty( $attributes['imageAlt'] ) ? $attributes['imageAlt'] : '' ); ?>"
					<?php echo $avatar_style; ?>>
			<?php else : ?>
				<?php
				$custom_name = ! empty( $attributes['name'] ) ? $attributes['name'] : '';
				$initials    = $get_initials( $custom_name );
				?>
				<span class="<?php echo esc_attr( implode( ' ', $avatar_classes ) ); ?>"<?php echo $avatar_style; ?>>
					<span><?php echo esc_html( $initials ); ?></span>
				</span>
			<?php endif; ?>

			<?php if ( $show_name ) : ?>
				<div>
					<?php if ( ! empty( $attributes['nameLink'] ) ) : ?>
						<div class="h6 mb-0">
							<a href="<?php echo esc_url( $attributes['nameLink'] ); ?>" class="link-dark">
								<?php echo esc_html( ! empty( $attributes['name'] ) ? $attributes['name'] : '' ); ?>
							</a>
						</div>
					<?php elseif ( ! empty( $attributes['name'] ) ) : ?>
						<div class="h6 mb-0">
							<?php echo esc_html( $attributes['name'] ); ?>
						</div>
					<?php endif; ?>
					<?php if ( ! empty( $attributes['position'] ) ) : ?>
						<span class="post-meta fs-15 d-block">
							<?php echo esc_html( $attributes['position'] ); ?>
						</span>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>
</div>
<?php
// Output is already in ob_start() from Plugin.php



