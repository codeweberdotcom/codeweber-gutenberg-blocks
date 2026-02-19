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

$avatar_type   = isset( $attributes['avatarType'] ) ? $attributes['avatarType'] : 'custom';
$size          = isset( $attributes['size'] ) ? $attributes['size'] : '15';
$show_name     = isset( $attributes['showName'] ) ? $attributes['showName'] : false;
$user_id       = isset( $attributes['userId'] ) ? intval( $attributes['userId'] ) : 0;
$staff_id        = isset( $attributes['staffId'] ) ? intval( $attributes['staffId'] ) : 0;
$staff_show_dept = isset( $attributes['staffShowDepartment'] ) && $attributes['staffShowDepartment'];
$staff_show_phone = isset( $attributes['staffShowPhone'] ) && $attributes['staffShowPhone'];

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
			$user_placeholder_url = get_template_directory_uri() . '/dist/assets/img/avatar-placeholder.jpg';
			$user_avatar_src = '';
			if ( ! empty( $avatar_id ) ) {
				$avatar_src = wp_get_attachment_image_src( $avatar_id, 'thumbnail' );
				if ( $avatar_src ) {
					$user_avatar_src = $avatar_src[0];
				}
			}
			if ( $user_avatar_src === '' ) {
				$avatar_html = get_avatar( $user->user_email, 96 );
				if ( $avatar_html && preg_match( '/src=["\']([^"\']+)["\']/', $avatar_html, $matches ) && ! empty( $matches[1] ) ) {
					$user_avatar_src = $matches[1];
				}
			}
			if ( $user_avatar_src === '' ) {
				$user_avatar_src = $user_placeholder_url;
			}
			?>
			<div class="author-info d-md-flex align-items-center">
				<div class="d-flex align-items-center">
					<figure class="user-avatar">
						<img class="rounded-circle" 
							src="<?php echo esc_url( $user_avatar_src ); ?>" 
							alt="<?php echo esc_attr( $user->display_name ); ?>">
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
	<?php elseif ( $avatar_type === 'staff' && $staff_id ) : ?>
		<?php
		$staff_post = get_post( $staff_id );
		if ( $staff_post && $staff_post->post_type === 'staff' && $staff_post->post_status === 'publish' ) {
			$staff_name = trim( (string) get_post_meta( $staff_id, '_staff_name', true ) . ' ' . (string) get_post_meta( $staff_id, '_staff_surname', true ) );
			if ( $staff_name === '' ) {
				$staff_name = get_the_title( $staff_id );
			}
			if ( $staff_show_dept && taxonomy_exists( 'departments' ) ) {
				$terms = get_the_terms( $staff_id, 'departments' );
				$job_label = '';
				if ( $terms && ! is_wp_error( $terms ) ) {
					$first = reset( $terms );
					$job_label = $first->name;
				}
				if ( $job_label === '' ) {
					$job_label = get_post_meta( $staff_id, '_staff_position', true );
				}
			} else {
				$job_label = get_post_meta( $staff_id, '_staff_position', true );
			}
			$staff_phone = get_post_meta( $staff_id, '_staff_phone', true );
			if ( (string) $staff_phone === '' ) {
				$staff_phone = get_post_meta( $staff_id, '_staff_job_phone', true );
			}
			$staff_link = get_permalink( $staff_id );
			$thumb_id   = get_post_thumbnail_id( $staff_id );
			$placeholder_url = get_template_directory_uri() . '/dist/assets/img/avatar-placeholder.jpg';
			$clean_number_fn = function_exists( 'cleanNumber' ) ? 'cleanNumber' : function( $s ) { return preg_replace( '/[^0-9+]/', '', $s ); };
			$inner_class = 'd-flex align-items-center' . ( $staff_show_phone ? ' mb-4' : '' );
			?>
			<div class="author-info d-md-flex align-items-center">
				<div class="<?php echo esc_attr( $inner_class ); ?>">
					<figure class="user-avatar">
						<?php
						if ( $thumb_id ) {
							$avatar_src = wp_get_attachment_image_src( $thumb_id, 'thumbnail' );
							if ( $avatar_src ) {
								?>
								<img class="rounded-circle" src="<?php echo esc_url( $avatar_src[0] ); ?>" alt="<?php echo esc_attr( $staff_name ); ?>">
								<?php
							} else {
								?>
								<img class="rounded-circle" src="<?php echo esc_url( $placeholder_url ); ?>" alt="<?php echo esc_attr( $staff_name ); ?>">
								<?php
							}
						} else {
							?>
							<img class="rounded-circle" src="<?php echo esc_url( $placeholder_url ); ?>" alt="<?php echo esc_attr( $staff_name ); ?>">
							<?php
						}
						?>
					</figure>
					<div>
						<div class="h6 mb-1 lh-1">
							<a href="<?php echo esc_url( $staff_link ); ?>" class="link-dark">
								<?php echo esc_html( $staff_name ); ?>
							</a>
						</div>
						<?php if ( (string) $job_label !== '' ) : ?>
							<div class="post-meta fs-15 lh-1 mb-1">
								<?php echo esc_html( $job_label ); ?>
							</div>
						<?php endif; ?>
						<?php if ( $staff_show_phone && (string) $staff_phone !== '' ) : ?>
							<div class="post-meta fs-15 lh-1">
								<a href="tel:<?php echo esc_attr( call_user_func( $clean_number_fn, $staff_phone ) ); ?>">
									<?php echo esc_html( $staff_phone ); ?>
								</a>
							</div>
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
