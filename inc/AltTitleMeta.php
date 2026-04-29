<?php

namespace Codeweber\Blocks;

/**
 * Alternative Title meta field for all public post types and taxonomies.
 *
 * Supports basic HTML tags (<br>, <strong>, <em>, <span>) for styled titles
 * with line breaks. Used by Post Grid, Lists, and Accordion blocks when
 * the "Use Alt Title" toggle is enabled.
 */
class AltTitleMeta {

	const META_KEY = '_alt_title';

	public function __construct() {
		add_action( 'init', [ $this, 'register_meta' ] );
		add_action( 'add_meta_boxes', [ $this, 'add_meta_box' ] );
		add_action( 'save_post', [ $this, 'save_meta' ], 10, 2 );
		// Term meta hooks registered after all taxonomies are available.
		add_action( 'init', [ $this, 'register_term_hooks' ], 99 );
	}

	public function register_meta(): void {
		register_post_meta( '', self::META_KEY, [
			'single'            => true,
			'type'              => 'string',
			'show_in_rest'      => true,
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
			'sanitize_callback' => 'wp_kses_post',
		] );

		register_term_meta( '', self::META_KEY, [
			'single'            => true,
			'type'              => 'string',
			'show_in_rest'      => true,
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
			'sanitize_callback' => 'wp_kses_post',
		] );
	}

	public function register_term_hooks(): void {
		$taxonomies = get_taxonomies( [ 'public' => true ], 'names' );
		foreach ( $taxonomies as $taxonomy ) {
			add_action( "{$taxonomy}_edit_form_fields", [ $this, 'render_term_edit_field' ], 10, 2 );
			add_action( "{$taxonomy}_add_form_fields",  [ $this, 'render_term_add_field' ] );
		}
		add_action( 'edited_term',  [ $this, 'save_term_meta' ], 10, 3 );
		add_action( 'created_term', [ $this, 'save_term_meta' ], 10, 3 );
	}

	public function render_term_edit_field( \WP_Term $term ): void {
		wp_nonce_field( 'cwgb_alt_title_term_nonce', 'cwgb_alt_title_term_nonce_field' );
		$value = get_term_meta( $term->term_id, self::META_KEY, true );
		?>
		<tr class="form-field">
			<th scope="row">
				<label for="cwgb_alt_title_term_field">
					<?php esc_html_e( 'Alternative Title (HTML)', 'codeweber-gutenberg-blocks' ); ?>
				</label>
			</th>
			<td>
				<textarea
					id="cwgb_alt_title_term_field"
					name="cwgb_alt_title_term_field"
					rows="3"
					style="width:100%;box-sizing:border-box;"
				><?php echo esc_textarea( $value ); ?></textarea>
				<p class="description">
					<?php esc_html_e( 'Overrides the display title in blocks. Supports <br>, <strong>, <em>, <span>.', 'codeweber-gutenberg-blocks' ); ?>
				</p>
			</td>
		</tr>
		<?php
	}

	public function render_term_add_field(): void {
		wp_nonce_field( 'cwgb_alt_title_term_nonce', 'cwgb_alt_title_term_nonce_field' );
		?>
		<div class="form-field">
			<label for="cwgb_alt_title_term_field">
				<?php esc_html_e( 'Alternative Title (HTML)', 'codeweber-gutenberg-blocks' ); ?>
			</label>
			<textarea
				id="cwgb_alt_title_term_field"
				name="cwgb_alt_title_term_field"
				rows="3"
				style="width:100%;box-sizing:border-box;"
			></textarea>
			<p><?php esc_html_e( 'Overrides the display title in blocks. Supports <br>, <strong>, <em>, <span>.', 'codeweber-gutenberg-blocks' ); ?></p>
		</div>
		<?php
	}

	public function save_term_meta( int $term_id ): void {
		if ( ! isset( $_POST['cwgb_alt_title_term_nonce_field'] ) ) {
			return;
		}
		if ( ! wp_verify_nonce( $_POST['cwgb_alt_title_term_nonce_field'], 'cwgb_alt_title_term_nonce' ) ) {
			return;
		}
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		$value = isset( $_POST['cwgb_alt_title_term_field'] )
			? wp_kses_post( wp_unslash( $_POST['cwgb_alt_title_term_field'] ) )
			: '';

		if ( $value !== '' ) {
			update_term_meta( $term_id, self::META_KEY, $value );
		} else {
			delete_term_meta( $term_id, self::META_KEY );
		}
	}

	public function add_meta_box(): void {
		$post_types = get_post_types( [ 'public' => true ], 'names' );
		foreach ( $post_types as $post_type ) {
			if ( in_array( $post_type, [ 'attachment' ], true ) ) {
				continue;
			}
			add_meta_box(
				'cwgb_alt_title',
				__( 'Alternative Title (HTML)', 'codeweber-gutenberg-blocks' ),
				[ $this, 'render_meta_box' ],
				$post_type,
				'side',
				'default'
			);
		}
	}

	public function render_meta_box( \WP_Post $post ): void {
		wp_nonce_field( 'cwgb_alt_title_nonce', 'cwgb_alt_title_nonce_field' );
		$value = get_post_meta( $post->ID, self::META_KEY, true );
		?>
		<p style="margin:0 0 6px;color:#757575;font-size:11px;">
			<?php esc_html_e( 'Overrides the main title in blocks. Supports <br>, <strong>, <em>, <span>.', 'codeweber-gutenberg-blocks' ); ?>
		</p>
		<textarea
			id="cwgb_alt_title_field"
			name="cwgb_alt_title_field"
			rows="3"
			style="width:100%;box-sizing:border-box;"
		><?php echo esc_textarea( $value ); ?></textarea>
		<?php
	}

	public function save_meta( int $post_id, \WP_Post $post ): void {
		if ( ! isset( $_POST['cwgb_alt_title_nonce_field'] ) ) {
			return;
		}
		if ( ! wp_verify_nonce( $_POST['cwgb_alt_title_nonce_field'], 'cwgb_alt_title_nonce' ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$value = isset( $_POST['cwgb_alt_title_field'] ) ? wp_kses_post( wp_unslash( $_POST['cwgb_alt_title_field'] ) ) : '';
		update_post_meta( $post_id, self::META_KEY, $value );
	}
}
