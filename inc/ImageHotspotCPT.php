<?php

namespace Codeweber\Blocks;

/**
 * Image Hotspot CPT Registration
 *
 * Custom Post Type for storing image hotspot configurations
 *
 * @package Codeweber\Blocks
 */
class ImageHotspotCPT {

	public function __construct() {
		add_action('init', [$this, 'register_post_type']);
		add_action('save_post_cw_image_hotspot', [$this, 'save_hotspot_meta'], 10, 3);

		// Регистрация шорткода
		add_shortcode('cw_image_hotspot', [$this, 'render_shortcode']);

		// Добавляем колонки в список hotspots
		add_filter('manage_cw_image_hotspot_posts_columns', [$this, 'add_custom_columns']);
		add_action('manage_cw_image_hotspot_posts_custom_column', [$this, 'fill_custom_columns'], 10, 2);

		// Подключаем скрипты и стили для админки
		add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);

		// Добавляем метабокс для редактирования hotspots
		add_action('add_meta_boxes', [$this, 'add_meta_boxes']);

		// Метабоксы для сторонних CPT через фильтр cw_hotspot_extra_post_types
		add_action('add_meta_boxes', [$this, 'add_extra_meta_boxes']);

		// Подключаем скрипт для копирования шорткода
		add_action('admin_footer', [$this, 'enqueue_copy_shortcode_script']);

		// AJAX для получения типа поста
		add_action('wp_ajax_get_post_type', [$this, 'ajax_get_post_type']);

		// Endpoint для загрузки только CSS с определениями иконок
		add_action('admin_enqueue_scripts', [$this, 'enqueue_unicons_icons_css']);

		// Загружаем фронтенд-ассеты в редакторе Gutenberg (для превью шорткода)
		add_action('enqueue_block_editor_assets', [$this, 'enqueue_frontend_for_editor']);

	}

	/**
	 * Загрузить фронтенд-скрипты/стили в редакторе Gutenberg
	 */
	public function enqueue_frontend_for_editor() {
		wp_enqueue_style(
			'cw-hotspot-frontend',
			GUTENBERG_BLOCKS_URL . 'includes/css/image-hotspot-frontend.css',
			[],
			GUTENBERG_BLOCKS_VERSION
		);
		wp_enqueue_script(
			'cw-hotspot-frontend',
			GUTENBERG_BLOCKS_URL . 'includes/js/image-hotspot-frontend.js',
			['jquery'],
			GUTENBERG_BLOCKS_VERSION,
			true
		);
	}

	/**
	 * Register Custom Post Type for image hotspots
	 */
	public function register_post_type() {
		$labels = [
			'name' => __('Image Hotspots', 'codeweber-gutenberg-blocks'),
			'singular_name' => __('Image Hotspot', 'codeweber-gutenberg-blocks'),
			'menu_name' => __('Image Hotspots', 'codeweber-gutenberg-blocks'),
			'add_new' => __('Add New Hotspot', 'codeweber-gutenberg-blocks'),
			'add_new_item' => __('Add New Image Hotspot', 'codeweber-gutenberg-blocks'),
			'edit_item' => __('Edit Image Hotspot', 'codeweber-gutenberg-blocks'),
			'new_item' => __('New Image Hotspot', 'codeweber-gutenberg-blocks'),
			'view_item' => __('View Image Hotspot', 'codeweber-gutenberg-blocks'),
			'search_items' => __('Search Hotspots', 'codeweber-gutenberg-blocks'),
			'not_found' => __('No hotspots found', 'codeweber-gutenberg-blocks'),
			'not_found_in_trash' => __('No hotspots found in trash', 'codeweber-gutenberg-blocks'),
		];

		$args = [
			'label' => __('Image Hotspots', 'codeweber-gutenberg-blocks'),
			'labels' => $labels,
			'description' => __('Interactive image hotspots with tooltips and popups', 'codeweber-gutenberg-blocks'),
			'public' => false,
			'publicly_queryable' => false,
			'show_ui' => true,
			'show_in_rest' => true, // Важно для Gutenberg!
			'rest_base' => 'cw_image_hotspot',
			'rest_controller_class' => 'WP_REST_Posts_Controller',
			'has_archive' => false,
			'show_in_menu' => true,
			'menu_position' => 30,
			'menu_icon' => 'dashicons-location-alt',
			'capability_type' => 'post',
			'supports' => ['title'], // Только заголовок, контент будет в метаполях
			'can_export' => true,
		];

		register_post_type('cw_image_hotspot', $args);
	}

	/**
	 * Save hotspot meta fields
	 */
	public function save_hotspot_meta($post_id, $post, $update) {
		// Проверка nonce (будет добавлен в метабоксе)
		if (isset($_POST['cw_hotspot_meta_nonce']) &&
		    !wp_verify_nonce($_POST['cw_hotspot_meta_nonce'], 'save_hotspot_meta')) {
			return;
		}

		// Проверка прав
		if (!current_user_can('edit_post', $post_id)) {
			return;
		}

		// Проверка автосохранения
		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
			return;
		}

		// Проверка типа поста
		if ($post->post_type !== 'cw_image_hotspot') {
			return;
		}

		// Сохранение изображения
		if (isset($_POST['_hotspot_image'])) {
			update_post_meta($post_id, '_hotspot_image', intval($_POST['_hotspot_image']));
		}

		// Сохранение данных точек (JSON)
		if (isset($_POST['_hotspot_data'])) {
			// Валидация JSON
			$hotspot_data = stripslashes($_POST['_hotspot_data']);
			$decoded = json_decode($hotspot_data, true);
			if (json_last_error() === JSON_ERROR_NONE) {
				update_post_meta($post_id, '_hotspot_data', wp_slash($hotspot_data));
			}
		}

		// Сохранение настроек стилей
		if (isset($_POST['_hotspot_settings'])) {
			$settings = stripslashes($_POST['_hotspot_settings']);
			$decoded = json_decode($settings, true);
			if (json_last_error() === JSON_ERROR_NONE) {
				update_post_meta($post_id, '_hotspot_settings', wp_slash($settings));
			}
		}
	}

	/**
	 * Добавить метабоксы
	 */
	public function add_meta_boxes() {
		add_meta_box(
			'cw_hotspot_editor',
			__('Hotspot Editor', 'codeweber-gutenberg-blocks'),
			[$this, 'render_hotspot_editor'],
			'cw_image_hotspot',
			'normal',
			'high'
		);
	}

	/**
	 * Метабоксы хотспот-редактора для сторонних CPT (через фильтр cw_hotspot_extra_post_types)
	 */
	public function add_extra_meta_boxes() {
		/**
		 * Filter: cw_hotspot_extra_post_types
		 *
		 * Позволяет сторонним CPT подключить hotspot-редактор к своей записи.
		 *
		 * @param array $post_types Массив вида [ post_type => config_array ].
		 *   config_array может содержать:
		 *     image_meta_key    — мета-ключ с ID картинки (обязательно)
		 *     data_meta_key     — мета-ключ для хранения JSON точек
		 *     settings_meta_key — мета-ключ для хранения JSON настроек
		 *     show_image_upload — bool: показывать кнопку загрузки картинки
		 *     nonce_action      — строка для wp_nonce_field / wp_verify_nonce
		 *     nonce_field       — имя скрытого поля nonce
		 *     metabox_title     — заголовок метабокса
		 */
		$extra = apply_filters('cw_hotspot_extra_post_types', []);
		if (empty($extra) || !is_array($extra)) {
			return;
		}

		foreach ($extra as $post_type => $config) {
			$args = wp_parse_args($config, [
				'image_meta_key'    => '',
				'data_meta_key'     => '_hotspot_data',
				'settings_meta_key' => '_hotspot_settings',
				'show_image_upload' => false,
				'nonce_action'      => 'save_extra_hotspot_' . $post_type,
				'nonce_field'       => 'cw_extra_hotspot_nonce_' . $post_type,
				'metabox_title'     => __('Hotspot Annotation', 'codeweber-gutenberg-blocks'),
			]);

			// Закрываем $args в замыкание чтобы передать в callback
			$callback = function( $post, $metabox ) {
				$this->render_hotspot_editor( $post, $metabox['args'] );
			};

			add_meta_box(
				'cw_hotspot_extra_' . $post_type,
				$args['metabox_title'],
				$callback,
				$post_type,
				'normal',
				'high',
				$args
			);
		}
	}

	/**
	 * Рендеринг редактора hotspots
	 *
	 * @param WP_Post $post
	 * @param array   $args Конфигурация. Ключи: image_meta_key, data_meta_key,
	 *                      settings_meta_key, show_image_upload, nonce_action, nonce_field.
	 *                      Если передан второй аргумент как массив метабокса (WP callback),
	 *                      используется $args['args'].
	 */
	public function render_hotspot_editor($post, $args = []) {
		// WP передаёт метабокс-массив как второй аргумент — извлекаем наши args
		if (isset($args['args']) && is_array($args['args'])) {
			$args = $args['args'];
		}

		$args = wp_parse_args($args, [
			'image_meta_key'    => '_hotspot_image',
			'data_meta_key'     => '_hotspot_data',
			'settings_meta_key' => '_hotspot_settings',
			'show_image_upload' => true,
			'nonce_action'      => 'save_hotspot_meta',
			'nonce_field'       => 'cw_hotspot_meta_nonce',
			'enable_toggle'     => false,
			'enable_meta_key'   => '',
		]);

		// Nonce для безопасности
		wp_nonce_field($args['nonce_action'], $args['nonce_field']);

		// Получаем сохраненные данные
		$image_id = get_post_meta($post->ID, $args['image_meta_key'], true);
		$hotspot_data = get_post_meta($post->ID, $args['data_meta_key'], true);
		$settings = get_post_meta($post->ID, $args['settings_meta_key'], true);

		// Парсим JSON или используем пустой массив
		$hotspots = !empty($hotspot_data) ? json_decode($hotspot_data, true) : [];
		$settings_data = !empty($settings) ? json_decode($settings, true) : [];

		// Получаем URL изображения
		$image_url = '';
		if ($image_id) {
			$image_url = wp_get_attachment_image_url($image_id, 'full');
		}

		// Дефолтные настройки
			$default_settings = [
			'hotspotButtonStyle' => 'btn-primary',
			'hotspotButtonSize' => 'btn-sm',
			'hotspotButtonShape' => 'btn-circle',
			'hotspotMarkerType' => 'button',
			'hotspotDotSize' => 'w-4 h-4',
			'popoverTrigger' => 'click',
			'popoverPlacement' => 'auto',
			'hotspotImageSize' => 'cw_landscape_hd',
		];
		$settings_data = wp_parse_args($settings_data, $default_settings);

		?>
		<div class="cw-hotspot-admin-container">
			<!-- Скрытые поля для сохранения -->
			<?php if ($args['show_image_upload']): ?>
			<input type="hidden" name="<?php echo esc_attr($args['image_meta_key']); ?>" id="cw-hotspot-image-id" value="<?php echo esc_attr($image_id); ?>" />
			<?php else: ?>
			<input type="hidden" id="cw-hotspot-image-id" value="<?php echo esc_attr($image_id); ?>" />
			<?php endif; ?>
			<input type="hidden" name="<?php echo esc_attr($args['data_meta_key']); ?>" id="cw-hotspot-data" value="<?php echo esc_attr($hotspot_data ?: '[]'); ?>" />
			<input type="hidden" name="<?php echo esc_attr($args['settings_meta_key']); ?>" id="cw-hotspot-settings" value="<?php echo esc_attr(json_encode($settings_data)); ?>" />

			<?php if ($args['enable_toggle'] && $args['enable_meta_key']): ?>
			<?php $enabled = (bool) get_post_meta($post->ID, $args['enable_meta_key'], true); ?>
			<div style="margin-bottom: 16px; padding: 10px 14px; background: #f6f7f7; border: 1px solid #ddd; border-radius: 3px;">
				<label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 600;">
					<input type="checkbox"
					       name="<?php echo esc_attr($args['enable_meta_key']); ?>"
					       id="cw-hotspot-enabled-toggle"
					       value="1"
					       <?php checked($enabled, true); ?>
					       style="width: 16px; height: 16px;" />
					<?php _e('Enable Hotspot Annotation', 'codeweber-gutenberg-blocks'); ?>
				</label>
			</div>
			<div id="cw-hotspot-editor-body" style="<?php echo $enabled ? '' : 'display:none;'; ?>">
			<?php endif; ?>

			<!-- Кнопки управления -->
			<div class="cw-hotspot-toolbar" style="margin-bottom: 20px;">
				<?php if ($args['show_image_upload']): ?>
				<button type="button" class="button button-primary" id="cw-hotspot-upload-image">
					<?php _e('Upload Image', 'codeweber-gutenberg-blocks'); ?>
				</button>
				<?php endif; ?>
				<button type="button" class="button" id="cw-hotspot-add-point" style="margin-left: 10px;">
					<?php _e('Add Point', 'codeweber-gutenberg-blocks'); ?>
				</button>
			</div>

			<!-- Область редактирования -->
			<div class="cw-hotspot-editor-wrapper" style="position: relative; border: 1px solid #ddd; background: #f9f9f9; min-height: 400px; padding: 20px;">
				<div class="cw-hotspot-annotation-box" id="cw-hotspot-annotation-box" style="position: relative; display: inline-block;">
					<?php if ($image_url): ?>
						<img src="<?php echo esc_url($image_url); ?>"
						     class="cw-hotspot-main-image"
						     id="cw-hotspot-main-image"
						     alt="<?php echo esc_attr($post->post_title); ?>"
						     style="max-width: 100%; height: auto; display: block;" />
					<?php else: ?>
						<div class="cw-hotspot-placeholder" style="padding: 100px; text-align: center; color: #999;">
							<p><?php _e('Upload an image to start adding hotspots', 'codeweber-gutenberg-blocks'); ?></p>
						</div>
					<?php endif; ?>
				</div>
			</div>

			<!-- Панель настроек -->
			<div class="cw-hotspot-settings-panel" style="margin-top: 20px; padding: 15px; background: #fff; border: 1px solid #ddd;">
				<h3><?php _e('Hotspot Settings', 'codeweber-gutenberg-blocks'); ?></h3>
				<table class="form-table">
					<tr>
						<th><label for="hotspot-image-size"><?php _e('Image Size', 'codeweber-gutenberg-blocks'); ?></label></th>
						<td>
							<select id="hotspot-image-size" name="hotspot_image_size" class="cw-hotspot-setting">
								<?php
								$current_img_size = $settings_data['hotspotImageSize'] ?? 'cw_landscape_hd';
								$registered_sizes = wp_get_registered_image_subsizes();
								?>
								<option value="full" <?php selected( $current_img_size, 'full' ); ?>><?php _e( 'full — original', 'codeweber-gutenberg-blocks' ); ?></option>
								<?php foreach ( $registered_sizes as $slug => $data ) :
									$label = $slug . ' — ' . $data['width'] . '×' . $data['height'];
								?>
									<option value="<?php echo esc_attr( $slug ); ?>" <?php selected( $current_img_size, $slug ); ?>><?php echo esc_html( $label ); ?></option>
								<?php endforeach; ?>
							</select>
							<p class="description"><?php _e('Image size used on the frontend', 'codeweber-gutenberg-blocks'); ?></p>
						</td>
					</tr>
					<tr>
						<th><label for="hotspot-button-style"><?php _e('Button Style', 'codeweber-gutenberg-blocks'); ?></label></th>
						<td>
							<select id="hotspot-button-style" name="hotspot_button_style" class="cw-hotspot-setting">
								<?php
								$current_style = $settings_data['hotspotButtonStyle'] ?? 'btn-primary';
								$btn_colors = [
									// Bootstrap
									'btn-primary'         => 'Primary',
									'btn-secondary'       => 'Secondary',
									'btn-success'         => 'Success',
									'btn-info'            => 'Info',
									'btn-warning'         => 'Warning',
									'btn-danger'          => 'Danger',
									// Theme colors
									'btn-white'           => 'White',
									'btn-light'           => 'Light',
									'btn-gray'            => 'Gray',
									'btn-dark'            => 'Dark',
									'btn-blue'            => 'Blue',
									'btn-sky'             => 'Sky',
									'btn-purple'          => 'Purple',
									'btn-grape'           => 'Grape',
									'btn-violet'          => 'Violet',
									'btn-pink'            => 'Pink',
									'btn-fuchsia'         => 'Fuchsia',
									'btn-red'             => 'Red',
									'btn-orange'          => 'Orange',
									'btn-yellow'          => 'Yellow',
									'btn-green'           => 'Green',
									'btn-leaf'            => 'Leaf',
									'btn-aqua'            => 'Aqua',
									'btn-navy'            => 'Navy',
									'btn-ash'             => 'Ash',
									'btn-dewalt'          => 'Dewalt',
									'btn-max'             => 'Max',
									'btn-frost'           => 'Frost',
									// Social
									'btn-telegram'        => 'Telegram',
									'btn-whatsapp'        => 'WhatsApp',
									'btn-vk'              => 'VK',
									'btn-vkvideo'         => 'VK Video',
									'btn-vkmusic'         => 'VK Music',
									'btn-odnoklassniki'   => 'Odnoklassniki',
									'btn-rutube'          => 'Rutube',
									'btn-youtube'         => 'YouTube',
									'btn-yandex-dzen'     => 'Yandex Dzen',
									'btn-tiktok'          => 'TikTok',
									'btn-x-twitter'       => 'X (Twitter)',
									'btn-twitter'         => 'Twitter',
									'btn-instagram'       => 'Instagram',
									'btn-facebook'        => 'Facebook',
									'btn-facebook-messenger' => 'FB Messenger',
									'btn-pinterest'       => 'Pinterest',
									'btn-linkedin'        => 'LinkedIn',
									'btn-viber'           => 'Viber',
									'btn-skype'           => 'Skype',
									'btn-snapchat'        => 'Snapchat',
									'btn-google'          => 'Google',
									'btn-discord'         => 'Discord',
									'btn-twitch'          => 'Twitch',
									'btn-github'          => 'GitHub',
									'btn-behance'         => 'Behance',
									'btn-dribbble'        => 'Dribbble',
									'btn-figma'           => 'Figma',
									'btn-slack'           => 'Slack',
									'btn-reddit'          => 'Reddit',
									'btn-patreon'         => 'Patreon',
									'btn-vimeo'           => 'Vimeo',
									'btn-signal'          => 'Signal',
									'btn-wechat'          => 'WeChat',
									'btn-amazon'          => 'Amazon',
									'btn-apple'           => 'Apple',
									'btn-steam'           => 'Steam',
									'btn-paypal'          => 'PayPal',
									'btn-dropbox'         => 'Dropbox',
									'btn-gitlab'          => 'GitLab',
									'btn-codepen'         => 'CodePen',
									'btn-airbnb'          => 'Airbnb',
									'btn-medium-m'        => 'Medium',
									'btn-tumblr'          => 'Tumblr',
									'btn-vuejs'           => 'Vue.js',
								];
								foreach ( $btn_colors as $value => $label ) :
								?>
									<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $current_style, $value ); ?>><?php echo esc_html( $label ); ?></option>
								<?php endforeach; ?>
							</select>
							<p class="description"><?php _e('Global style for all hotspot buttons', 'codeweber-gutenberg-blocks'); ?></p>
						</td>
					</tr>
					<tr>
						<th><label for="hotspot-button-size"><?php _e('Button Size', 'codeweber-gutenberg-blocks'); ?></label></th>
						<td>
							<select id="hotspot-button-size" name="hotspot_button_size" class="cw-hotspot-setting">
								<option value="btn-xs" <?php selected($settings_data['hotspotButtonSize'] ?? 'btn-sm', 'btn-xs'); ?>><?php _e('Extra Small', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="btn-sm" <?php selected($settings_data['hotspotButtonSize'] ?? 'btn-sm', 'btn-sm'); ?>><?php _e('Small', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="btn-md" <?php selected($settings_data['hotspotButtonSize'] ?? '', 'btn-md'); ?>><?php _e('Medium', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="btn-lg" <?php selected($settings_data['hotspotButtonSize'] ?? '', 'btn-lg'); ?>><?php _e('Large', 'codeweber-gutenberg-blocks'); ?></option>
							</select>
							<p class="description"><?php _e('Global size for all hotspot buttons', 'codeweber-gutenberg-blocks'); ?></p>
						</td>
					</tr>
					<tr>
						<th><label for="hotspot-button-shape"><?php _e('Button Shape', 'codeweber-gutenberg-blocks'); ?></label></th>
						<td>
							<select id="hotspot-button-shape" name="hotspot_button_shape" class="cw-hotspot-setting">
								<option value="btn-circle" <?php selected($settings_data['hotspotButtonShape'] ?? 'btn-circle', 'btn-circle'); ?>><?php _e('Circle', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="btn-block rounded-0" <?php selected($settings_data['hotspotButtonShape'] ?? '', 'btn-block rounded-0'); ?>><?php _e('Block Rounded', 'codeweber-gutenberg-blocks'); ?></option>
							</select>
							<p class="description"><?php _e('Global shape for all hotspot buttons', 'codeweber-gutenberg-blocks'); ?></p>
						</td>
					</tr>
					<tr>
						<th><label for="hotspot-marker-type"><?php _e('Marker Type', 'codeweber-gutenberg-blocks'); ?></label></th>
						<td>
							<select id="hotspot-marker-type" name="hotspot_marker_type" class="cw-hotspot-setting">
								<option value="button" <?php selected($settings_data['hotspotMarkerType'] ?? 'button', 'button'); ?>><?php _e('Button (with icon)', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="dot" <?php selected($settings_data['hotspotMarkerType'] ?? 'button', 'dot'); ?>><?php _e('Dot (no icon)', 'codeweber-gutenberg-blocks'); ?></option>
							</select>
							<p class="description"><?php _e('Dot uses Button Style color and w-*/h-* size below', 'codeweber-gutenberg-blocks'); ?></p>
						</td>
					</tr>
					<tr>
						<th><label for="hotspot-dot-size"><?php _e('Dot Size', 'codeweber-gutenberg-blocks'); ?></label></th>
						<td>
							<select id="hotspot-dot-size" name="hotspot_dot_size" class="cw-hotspot-setting">
								<?php
								$current_dot_size = $settings_data['hotspotDotSize'] ?? 'w-4 h-4';
								$dot_sizes = [
									'w-2 h-2'   => 'w-2 h-2 (0.5rem)',
									'w-3 h-3'   => 'w-3 h-3 (0.75rem)',
									'w-4 h-4'   => 'w-4 h-4 (1rem)',
									'w-5 h-5'   => 'w-5 h-5 (1.25rem)',
									'w-6 h-6'   => 'w-6 h-6 (1.5rem)',
									'w-8 h-8'   => 'w-8 h-8 (2rem)',
									'w-10 h-10' => 'w-10 h-10 (2.5rem)',
									'w-12 h-12' => 'w-12 h-12 (3rem)',
									'w-15 h-15' => 'w-15 h-15 (3.75rem)',
								];
								foreach ( $dot_sizes as $value => $label ) :
								?>
									<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $current_dot_size, $value ); ?>><?php echo esc_html( $label ); ?></option>
								<?php endforeach; ?>
							</select>
							<p class="description"><?php _e('Used only when Marker Type is Dot', 'codeweber-gutenberg-blocks'); ?></p>
						</td>
					</tr>
					<tr>
						<th><label for="popover-trigger"><?php _e('Popover Trigger', 'codeweber-gutenberg-blocks'); ?></label></th>
						<td>
							<select id="popover-trigger" name="popover_trigger" class="cw-hotspot-setting">
								<option value="click" <?php selected($settings_data['popoverTrigger'] ?? 'click', 'click'); ?>><?php _e('Click', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="hover" <?php selected($settings_data['popoverTrigger'] ?? '', 'hover'); ?>><?php _e('Hover', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="focus" <?php selected($settings_data['popoverTrigger'] ?? '', 'focus'); ?>><?php _e('Focus', 'codeweber-gutenberg-blocks'); ?></option>
							</select>
							<p class="description"><?php _e('Bootstrap Popover Opening Method', 'codeweber-gutenberg-blocks'); ?></p>
						</td>
					</tr>
					<tr>
						<th><label for="popover-placement"><?php _e('Popover Placement', 'codeweber-gutenberg-blocks'); ?></label></th>
						<td>
							<select id="popover-placement" name="popover_placement" class="cw-hotspot-setting">
								<option value="auto" <?php selected($settings_data['popoverPlacement'] ?? 'auto', 'auto'); ?>><?php _e('Auto', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="top" <?php selected($settings_data['popoverPlacement'] ?? '', 'top'); ?>><?php _e('Top', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="right" <?php selected($settings_data['popoverPlacement'] ?? '', 'right'); ?>><?php _e('Right', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="bottom" <?php selected($settings_data['popoverPlacement'] ?? '', 'bottom'); ?>><?php _e('Bottom', 'codeweber-gutenberg-blocks'); ?></option>
								<option value="left" <?php selected($settings_data['popoverPlacement'] ?? '', 'left'); ?>><?php _e('Left', 'codeweber-gutenberg-blocks'); ?></option>
							</select>
							<p class="description"><?php _e('Popover Display Position', 'codeweber-gutenberg-blocks'); ?></p>
						</td>
					</tr>
				</table>
			</div>

			<?php if ($args['enable_toggle'] && $args['enable_meta_key']): ?>
			</div><!-- #cw-hotspot-editor-body -->
			<script>
			(function() {
				var toggle = document.getElementById('cw-hotspot-enabled-toggle');
				var body   = document.getElementById('cw-hotspot-editor-body');
				if (toggle && body) {
					toggle.addEventListener('change', function() {
						body.style.display = this.checked ? '' : 'none';
					});
				}
			})();
			</script>
			<?php endif; ?>
		</div>

		<?php
	}

	/**
	 * Render hotspot HTML for use in frontend templates.
	 *
	 * @param int    $image_id       Attachment ID for the background image.
	 * @param string $hotspot_data   JSON string of hotspot points.
	 * @param string $settings_json  JSON string of hotspot settings.
	 * @return string  HTML output.
	 */
	public static function render_hotspot_html($image_id, $hotspot_data, $settings_json) {
		if (!$image_id) {
			return '';
		}

		$hotspots      = !empty($hotspot_data) ? json_decode($hotspot_data, true) : [];
		$settings_data = !empty($settings_json) ? json_decode($settings_json, true) : [];

		$default_settings = [
			'hotspotButtonStyle' => 'btn-primary',
			'hotspotButtonSize'  => 'btn-sm',
			'hotspotButtonShape' => 'btn-circle',
			'hotspotMarkerType'  => 'button',
			'hotspotDotSize'     => 'w-4 h-4',
			'popoverTrigger'     => 'click',
			'popoverPlacement'   => 'auto',
			'hotspotImageSize'   => 'cw_landscape_hd',
		];
		$settings_data = wp_parse_args($settings_data, $default_settings);

		$image_size = $settings_data['hotspotImageSize'];
		$image_url  = wp_get_attachment_image_url($image_id, $image_size);
		if (!$image_url) {
			$image_url = wp_get_attachment_image_url($image_id, 'full');
		}
		if (!$image_url) {
			return '';
		}

		wp_enqueue_style(
			'cw-hotspot-frontend',
			GUTENBERG_BLOCKS_URL . 'includes/css/image-hotspot-frontend.css',
			[],
			GUTENBERG_BLOCKS_VERSION
		);
		wp_enqueue_script(
			'cw-hotspot-frontend',
			GUTENBERG_BLOCKS_URL . 'includes/js/image-hotspot-frontend.js',
			['jquery'],
			GUTENBERG_BLOCKS_VERSION,
			true
		);

		// Генерируем уникальный ID (используем ID изображения как суррогат)
		$hotspot_id = 'project_' . $image_id;

		ob_start();
		?>
		<div class="cw-image-hotspot-container w-100" data-hotspot-id="<?php echo esc_attr($hotspot_id); ?>">
			<div class="cw-hotspot-annotation-box w-100">
				<img src="<?php echo esc_url($image_url); ?>" class="cw-hotspot-main-image w-100" alt="" />
				<?php if (!empty($hotspots)): ?>
					<?php foreach ($hotspots as $hotspot): ?>
						<?php
						$point_icon      = !empty($hotspot['iconName']) ? $hotspot['iconName'] : 'plus';
						$button_style    = $settings_data['hotspotButtonStyle'];
						$button_size     = $settings_data['hotspotButtonSize'];
						$button_shape    = $settings_data['hotspotButtonShape'];
						$marker_type     = $settings_data['hotspotMarkerType'];
						$dot_size        = $settings_data['hotspotDotSize'];
						$content_type    = !empty($hotspot['contentType']) ? $hotspot['contentType'] : 'text';
						$popover_title   = !empty($hotspot['title']) ? esc_html($hotspot['title']) : '';
						$popover_trigger = $settings_data['popoverTrigger'];
						$popover_placement = $settings_data['popoverPlacement'];
						$wrapper_class   = !empty($hotspot['wrapperClass']) ? esc_attr($hotspot['wrapperClass']) : '';
						$use_ajax        = ($content_type === 'post' || $content_type === 'hybrid');

						$popover_content = '';
						if ($content_type === 'text') {
							if (!empty($hotspot['content'])) {
								$popover_content = wp_kses_post($hotspot['content']);
							}
							if (!empty($hotspot['link'])) {
								$popover_content .= '<br><a href="' . esc_url($hotspot['link']) . '" target="' . esc_attr($hotspot['linkTarget'] ?? '_self') . '">' . __('Learn more', 'codeweber-gutenberg-blocks') . '</a>';
							}
						} elseif ($content_type === 'hybrid' && !empty($hotspot['content'])) {
							$popover_content = wp_kses_post($hotspot['content']);
						}

						$shape_classes = $button_shape ? explode(' ', $button_shape) : [];
						$theme_classes = ['ripple'];
						if ($marker_type === 'dot') {
							$btn_classes = array_merge($theme_classes, $shape_classes, [$button_style, 'cw-hotspot-pulse'], explode(' ', $dot_size));
						} else {
							$btn_classes = array_merge($theme_classes, $shape_classes, [$button_style, $button_size]);
						}
						?>
						<div class="cw-hotspot-point"
						     style="left: <?php echo esc_attr($hotspot['x']); ?>%; top: <?php echo esc_attr($hotspot['y']); ?>%;"
						     data-x="<?php echo esc_attr($hotspot['x']); ?>"
						     data-y="<?php echo esc_attr($hotspot['y']); ?>"
						     data-hotspot-id="<?php echo esc_attr($hotspot['id']); ?>"
						     data-point-id="<?php echo esc_attr($hotspot['id']); ?>">
							<?php if (!$use_ajax && !empty($popover_content)): ?>
							<div class="cw-hotspot-popover-content" style="display:none;">
								<?php if ($wrapper_class): ?><div class="<?php echo $wrapper_class; ?>"><?php endif; ?>
								<?php echo $popover_content; ?>
								<?php if ($wrapper_class): ?></div><?php endif; ?>
							</div>
							<?php elseif ($content_type === 'hybrid' && !empty($popover_content)): ?>
							<div class="cw-hotspot-popover-content" style="display:none;">
								<?php if ($wrapper_class): ?><div class="<?php echo $wrapper_class; ?>"><?php endif; ?>
								<?php echo $popover_content; ?>
								<?php if ($wrapper_class): ?></div><?php endif; ?>
							</div>
							<?php endif; ?>
							<span class="btn <?php echo esc_attr(implode(' ', $btn_classes)); ?>"
							      tabindex="0"
							      data-bs-toggle="popover"
							      data-bs-trigger="<?php echo esc_attr($popover_trigger); ?>"
							      data-bs-placement="<?php echo esc_attr($popover_placement); ?>"
							      data-bs-html="true"
							      data-bs-ajax-load="<?php echo $use_ajax ? 'true' : 'false'; ?>"
							      <?php if ($popover_title): ?>data-bs-title="<?php echo esc_attr($popover_title); ?>"<?php endif; ?>
							      data-content-type="<?php echo esc_attr($content_type); ?>"
							      <?php if (!empty($hotspot['popoverWidth'])): ?>data-bs-popover-width="<?php echo esc_attr($hotspot['popoverWidth']); ?>"<?php endif; ?>>
								<?php if ($marker_type !== 'dot'): ?>
									<i class="uil uil-<?php echo esc_attr($point_icon); ?>"></i>
								<?php endif; ?>
							</span>
						</div>
					<?php endforeach; ?>
				<?php endif; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Подключить скрипты и стили для админки
	 */
	public function enqueue_admin_assets($hook) {
		$screen = get_current_screen();
		if (!$screen) {
			return;
		}

		$extra_post_types = array_keys( (array) apply_filters('cw_hotspot_extra_post_types', []) );
		$allowed_post_types = array_merge(['cw_image_hotspot'], $extra_post_types);

		if (!in_array($screen->post_type, $allowed_post_types, true)) {
			return;
		}

		// Подключаем стили темы для использования локального шрифта Unicons
		// Стили
		wp_enqueue_style(
			'cw-hotspot-admin',
			GUTENBERG_BLOCKS_URL . 'includes/css/image-hotspot-admin.css',
			[],
			GUTENBERG_BLOCKS_VERSION
		);


		// Скрипты
		wp_enqueue_media(); // WordPress Media Library
		wp_enqueue_script(
			'cw-hotspot-admin',
			GUTENBERG_BLOCKS_URL . 'includes/js/image-hotspot-admin.js',
			['jquery', 'jquery-ui-draggable', 'jquery-ui-droppable'],
			GUTENBERG_BLOCKS_VERSION,
			true
		);

		// Получаем список иконок Unicons
		$icons_list = $this->get_unicons_list();

		// Подключаем fetch-handler для админки (если еще не подключен)
		$fetch_script_path = get_template_directory() . '/functions/fetch/assets/js/fetch-handler.js';
		if (file_exists($fetch_script_path) && !wp_script_is('fetch-handler', 'enqueued')) {
			wp_enqueue_script(
				'fetch-handler',
				get_template_directory_uri() . '/functions/fetch/assets/js/fetch-handler.js',
				[],
				filemtime($fetch_script_path),
				true
			);
			wp_localize_script('fetch-handler', 'fetch_vars', [
				'ajaxurl' => admin_url('admin-ajax.php'),
				'nonce'   => wp_create_nonce('fetch_action_nonce'),
			]);
		}

		// Локализация
		wp_localize_script('cw-hotspot-admin', 'cwHotspotAdmin', [
			'ajaxurl' => admin_url('admin-ajax.php'), // Для совместимости, но используется Fetch система
			'icons' => $icons_list,
			'i18n' => [
				'editPoint' => __('Edit Point', 'codeweber-gutenberg-blocks'),
				'deletePoint' => __('Delete Point', 'codeweber-gutenberg-blocks'),
				'pointTitle' => __('Point Title', 'codeweber-gutenberg-blocks'),
				'pointContent' => __('Point Content', 'codeweber-gutenberg-blocks'),
				'pointLink' => __('Link URL', 'codeweber-gutenberg-blocks'),
				'selectIcon' => __('Select Icon', 'codeweber-gutenberg-blocks'),
				'searchIcon' => __('Search icon...', 'codeweber-gutenberg-blocks'),
				'save' => __('Save', 'codeweber-gutenberg-blocks'),
				'cancel' => __('Cancel', 'codeweber-gutenberg-blocks'),
				'contentType' => __('Content Type', 'codeweber-gutenberg-blocks'),
				'contentTypeText' => __('Text', 'codeweber-gutenberg-blocks'),
				'contentTypePost' => __('Post', 'codeweber-gutenberg-blocks'),
				'contentTypeHybrid' => __('Hybrid (Text + Post)', 'codeweber-gutenberg-blocks'),
				'selectPost' => __('Select Post', 'codeweber-gutenberg-blocks'),
				'selectPostPlaceholder' => __('-- Select Post --', 'codeweber-gutenberg-blocks'),
				'selectPostDescription' => __('Post content will be loaded via AJAX when popover opens.', 'codeweber-gutenberg-blocks'),
				'selectPostType' => __('Select Post Type', 'codeweber-gutenberg-blocks'),
				'selectPostTypePlaceholder' => __('-- Select Post Type --', 'codeweber-gutenberg-blocks'),
				'selectPostTypeDescription' => __('First select the type of post (Post, Page, Client, etc.)', 'codeweber-gutenberg-blocks'),
				'postTemplate' => __('Post Card Template', 'codeweber-gutenberg-blocks'),
				'postTemplateDescription' => __('Select the template to display the post card.', 'codeweber-gutenberg-blocks'),
				'contentTextDescription' => __('Enter text or HTML content. This will be displayed instantly from a hidden element.', 'codeweber-gutenberg-blocks'),
			]
		]);
	}

	/**
	 * Добавить кастомные колонки в список hotspots
	 */
	public function add_custom_columns($columns) {
		$new_columns = [];
		foreach ($columns as $key => $value) {
			$new_columns[$key] = $value;
			if ($key === 'title') {
				$new_columns['hotspot_id'] = __('ID', 'codeweber-gutenberg-blocks');
				$new_columns['shortcode'] = __('Shortcode', 'codeweber-gutenberg-blocks');
			}
		}
		return $new_columns;
	}

	/**
	 * Заполнить кастомные колонки
	 */
	public function fill_custom_columns($column, $post_id) {
		if ($column === 'hotspot_id') {
			echo '<strong>' . esc_html($post_id) . '</strong>';
		}

		if ($column === 'shortcode') {
			$shortcode = '[cw_image_hotspot id="' . esc_attr($post_id) . '"]';
			?>
			<div style="display: flex; align-items: center; gap: 8px;">
				<code style="background: #f0f0f1; padding: 4px 8px; border-radius: 3px; font-size: 12px; font-family: monospace;">
					<?php echo esc_html($shortcode); ?>
				</code>
				<button
					type="button"
					class="button button-small copy-shortcode-btn"
					data-shortcode="<?php echo esc_attr($shortcode); ?>"
					style="height: 24px; line-height: 22px; padding: 0 8px;"
					title="<?php esc_attr_e('Copy shortcode', 'codeweber-gutenberg-blocks'); ?>"
				>
					<span class="dashicons dashicons-clipboard" style="font-size: 14px; width: 14px; height: 14px; line-height: 22px;"></span>
				</button>
			</div>
			<?php
		}
	}

	/**
	 * Рендеринг шорткода на фронтенде
	 */
	public function render_shortcode($atts) {
		// Помечаем, что шорткод используется (для подключения ассетов)
		global $cw_image_hotspot_used;
		$cw_image_hotspot_used = true;

		// Подключаем скрипты и стили (если еще не подключены)
		wp_enqueue_style(
			'cw-hotspot-frontend',
			GUTENBERG_BLOCKS_URL . 'includes/css/image-hotspot-frontend.css',
			[],
			GUTENBERG_BLOCKS_VERSION
		);

		// Получаем атрибуты шорткода
		$atts = shortcode_atts([
			'id' => 0,
		], $atts, 'cw_image_hotspot');

		$hotspot_id = intval($atts['id']);


		if (!$hotspot_id) {
			return '';
		}

		// Получаем данные hotspot из CPT
		$post = get_post($hotspot_id);
		if (!$post || $post->post_type !== 'cw_image_hotspot') {
			return '';
		}

		// Получаем метаданные
		$image_id = get_post_meta($hotspot_id, '_hotspot_image', true);
		$hotspot_data = get_post_meta($hotspot_id, '_hotspot_data', true);
		$settings = get_post_meta($hotspot_id, '_hotspot_settings', true);


		if (!$image_id) {
			return '';
		}

		// Парсим данные точек и настройки
		$hotspots = !empty($hotspot_data) ? json_decode($hotspot_data, true) : [];
		$settings_data = !empty($settings) ? json_decode($settings, true) : [];

		// Дефолтные настройки
		$default_settings = [
			'hotspotButtonStyle' => 'btn-primary',
			'hotspotButtonSize' => 'btn-sm',
			'hotspotButtonShape' => 'btn-circle',
			'hotspotMarkerType' => 'button',
			'hotspotDotSize' => 'w-4 h-4',
			'popoverTrigger' => 'click',
			'popoverPlacement' => 'auto',
			'hotspotImageSize' => 'cw_landscape_hd',
		];
		$settings_data = wp_parse_args($settings_data, $default_settings);

		// Получаем URL изображения (после парсинга настроек)
		$image_size = $settings_data['hotspotImageSize'];
		$image_url = wp_get_attachment_image_url($image_id, $image_size);
		if (!$image_url) {
			$image_url = wp_get_attachment_image_url($image_id, 'full');
		}
		if (!$image_url) {
			return '';
		}

		// Подключаем скрипт фронтенда
		wp_enqueue_script(
			'cw-hotspot-frontend',
			GUTENBERG_BLOCKS_URL . 'includes/js/image-hotspot-frontend.js',
			['jquery'],
			GUTENBERG_BLOCKS_VERSION,
			true
		);

		// Fetch система темы уже предоставляет fetch_vars через fetch-handler.js

		// Bootstrap Popover будет инициализирован через скрипт фронтенда


		// Рендерим HTML
		ob_start();
		?>
		<div class="cw-image-hotspot-container cw-image-hotspot-<?php echo esc_attr($hotspot_id); ?> w-100"
		     data-hotspot-id="<?php echo esc_attr($hotspot_id); ?>">
			<div class="cw-hotspot-annotation-box w-100">
				<img src="<?php echo esc_url($image_url); ?>"
				     class="cw-hotspot-main-image w-100"
				     alt="<?php echo esc_attr($post->post_title); ?>" />
				<?php if (!empty($hotspots)): ?>
					<?php foreach ($hotspots as $hotspot): ?>
						<?php
						// Используем глобальные настройки для всех кнопок
						$point_icon = !empty($hotspot['iconName']) ? $hotspot['iconName'] : 'plus'; // Если иконка не задана, используем plus по умолчанию
						$button_style   = $settings_data['hotspotButtonStyle'] ?? 'btn-primary';
						$button_size    = $settings_data['hotspotButtonSize'] ?? 'btn-sm';
						$button_shape   = $settings_data['hotspotButtonShape'] ?? 'btn-circle';
						$marker_type    = $settings_data['hotspotMarkerType'] ?? 'button';
						$dot_size       = $settings_data['hotspotDotSize'] ?? 'w-4 h-4';
						?>
						<div class="cw-hotspot-point"
						     style="left: <?php echo esc_attr($hotspot['x']); ?>%; top: <?php echo esc_attr($hotspot['y']); ?>%;"
						     data-x="<?php echo esc_attr($hotspot['x']); ?>"
						     data-y="<?php echo esc_attr($hotspot['y']); ?>"
						     data-hotspot-id="<?php echo esc_attr($hotspot['id']); ?>"
						     data-point-id="<?php echo esc_attr($hotspot['id']); ?>">
							<?php
							// Разбиваем buttonShape на отдельные классы (может быть "btn-block rounded-0")
							$shape_classes = $button_shape ? explode(' ', $button_shape) : [];
							$theme_classes = ['ripple'];

							// Определяем тип контента
							$content_type = !empty($hotspot['contentType']) ? $hotspot['contentType'] : 'text';
							$popover_title = !empty($hotspot['title']) ? esc_html($hotspot['title']) : '';
							$popover_trigger = $settings_data['popoverTrigger'] ?? 'click';
							$popover_placement = $settings_data['popoverPlacement'] ?? 'auto';
							$wrapper_class = !empty($hotspot['wrapperClass']) ? esc_attr($hotspot['wrapperClass']) : '';


							// Формируем контент в зависимости от типа
							$popover_content = '';
							$use_ajax = false;

							if ($content_type === 'text') {
								// Простой текст - храним в скрытом элементе
								if (!empty($hotspot['content'])) {
									$popover_content = wp_kses_post($hotspot['content']);
								}
								if (!empty($hotspot['link'])) {
									$popover_content .= '<br><a href="' . esc_url($hotspot['link']) . '" target="' . esc_attr($hotspot['linkTarget'] ?? '_self') . '">' . __('Learn more', 'codeweber-gutenberg-blocks') . '</a>';
								}
							} elseif ($content_type === 'post' || $content_type === 'hybrid') {
								// Пост или гибрид - загружаем через AJAX
								$use_ajax = true;
								// Для гибрида сохраняем текст в скрытом элементе
								if ($content_type === 'hybrid' && !empty($hotspot['content'])) {
									$popover_content = wp_kses_post($hotspot['content']);
								}
							}
							?>
							<?php if (!$use_ajax && !empty($popover_content)): ?>
								<!-- Скрытый контейнер с HTML контентом для простого текста -->
								<?php
								?>
								<div class="cw-hotspot-popover-content" style="display: none;">
									<?php if (!empty($wrapper_class)): ?>
										<div class="<?php echo $wrapper_class; ?>">
											<?php echo $popover_content; ?>
										</div>
									<?php else: ?>
										<?php echo $popover_content; ?>
									<?php endif; ?>
								</div>
							<?php elseif ($content_type === 'hybrid' && !empty($popover_content)): ?>
								<!-- Для гибрида сохраняем текст в скрытом элементе -->
								<div class="cw-hotspot-popover-content" style="display: none;">
									<?php if (!empty($wrapper_class)): ?>
										<div class="<?php echo $wrapper_class; ?>">
											<?php echo $popover_content; ?>
										</div>
									<?php else: ?>
										<?php echo $popover_content; ?>
									<?php endif; ?>
								</div>
							<?php endif; ?>
							<?php
							?>
							<?php
							if ( $marker_type === 'dot' ) {
								// Dot: same btn structure, no icon, w-*/h-* size classes + pulse animation
								$dot_classes = array_merge( $theme_classes, $shape_classes, [ $button_style, 'cw-hotspot-pulse' ], explode( ' ', $dot_size ) );
							} else {
								$dot_classes = array_merge( $theme_classes, $shape_classes, [ $button_style, $button_size ] );
							}
							?>
							<span class="btn <?php echo esc_attr( implode( ' ', $dot_classes ) ); ?>"
							      tabindex="0"
							      data-bs-toggle="popover"
							      data-bs-trigger="<?php echo esc_attr($popover_trigger); ?>"
							      data-bs-placement="<?php echo esc_attr($popover_placement); ?>"
							      data-bs-html="true"
							      data-bs-ajax-load="<?php echo $use_ajax ? 'true' : 'false'; ?>"
							      <?php if ($popover_title): ?>data-bs-title="<?php echo esc_attr($popover_title); ?>"<?php endif; ?>
							      data-content-type="<?php echo esc_attr($content_type); ?>"
							      <?php if (!empty($hotspot['popoverWidth'])): ?>data-bs-popover-width="<?php echo esc_attr($hotspot['popoverWidth']); ?>"<?php endif; ?>>
								<?php if ( $marker_type !== 'dot' ) : ?>
									<?php if (!empty($point_icon)): ?>
										<i class="uil uil-<?php echo esc_attr($point_icon); ?>"></i>
									<?php else: ?>
										<i class="uil uil-plus"></i>
									<?php endif; ?>
								<?php endif; ?>
							</span>
						</div>
					<?php endforeach; ?>
				<?php endif; ?>
			</div>
		</div>
		<?php
		$output = ob_get_clean();


		return $output;
	}

	/**
	 * Получить список иконок Unicons
	 */
	private function get_unicons_list() {
		// Путь к JS файлу с иконками
		$icons_file = plugin_dir_path(__DIR__) . 'src/utilities/font_icon.js';

		if (!file_exists($icons_file)) {
			return [];
		}

		$content = file_get_contents($icons_file);

		// Извлекаем массив иконок из JS файла
		// Используем более гибкое регулярное выражение
		if (!preg_match('/export\s+const\s+fontIcons\s*=\s*\[(.*?)\];/s', $content, $matches)) {
			return [];
		}

		if (empty($matches[1])) {
			return [];
		}

		$icons = [];
		// Парсим строки вида { value: 'uil-icon-name', label: 'icon-name' },
		// Поддерживаем табы, пробелы и переносы строк
		preg_match_all("/\{\s*value:\s*['\"]([^'\"]+)['\"],\s*label:\s*['\"]([^'\"]+)['\"]\s*\}/", $matches[1], $icon_matches, PREG_SET_ORDER);

		foreach ($icon_matches as $match) {
			$full_icon_name = $match[1]; // Полное имя с префиксом uil-
			$icon_name = str_replace('uil-', '', $full_icon_name); // Убираем префикс uil-
			$icons[] = [
				'value' => $icon_name,
				'label' => $match[2],
				'class' => 'uil uil-' . $icon_name
			];
		}

		return $icons;
	}

	/**
	 * Загрузить только CSS с определениями иконок Unicons
	 * Без подключения всего style.css темы, чтобы не сломать верстку админки
	 */
	public function enqueue_unicons_icons_css() {
		$screen = get_current_screen();
		if (!$screen) {
			return;
		}

		$extra_post_types = array_keys( (array) apply_filters('cw_hotspot_extra_post_types', []) );
		$allowed_post_types = array_merge(['cw_image_hotspot'], $extra_post_types);

		if (!in_array($screen->post_type, $allowed_post_types, true)) {
			return;
		}

		$theme_path = get_template_directory();
		$theme_uri = get_template_directory_uri();
		$icons_scss_path = $theme_path . '/src/assets/scss/theme/_icons.scss';

		if (!file_exists($icons_scss_path)) {
			return;
		}

		$icons_scss_content = file_get_contents($icons_scss_path);
		$icons_css = '';

		// Извлекаем блок @font-face для Unicons
		if (preg_match('/@font-face\s*\{[^}]*font-family:\s*[\'"]Unicons[\'"][^}]*src:[^}]*\}/s', $icons_scss_content, $font_face_match)) {
			// Заменяем относительные пути на абсолютные URL
			$font_face_css = preg_replace(
				'/url\([\'"]?\.\.\/fonts\/unicons\/([^\'"]+)[\'"]?\)/',
				"url('{$theme_uri}/dist/assets/fonts/unicons/$1')",
				$font_face_match[0]
			);
			$icons_css .= $font_face_css . "\n";
		}

		// Извлекаем все определения .uil-*:before построчно
		// Это более надежный способ для SCSS файлов
		$lines = explode("\n", $icons_scss_content);
		$in_icon_block = false;
		$current_icon_block = '';

		foreach ($lines as $line) {
			$trimmed_line = trim($line);

			// Начало блока иконки: .uil-icon-name:before {
			if (preg_match('/^\.(uil-[a-zA-Z0-9\-]+):before\s*\{/', $trimmed_line)) {
				$in_icon_block = true;
				$current_icon_block = $trimmed_line . "\n";
				continue;
			}

			// Внутри блока иконки
			if ($in_icon_block) {
				$current_icon_block .= $trimmed_line . "\n";

				// Конец блока (закрывающая скобка)
				if (strpos($trimmed_line, '}') !== false) {
					$icons_css .= $current_icon_block;
					$in_icon_block = false;
					$current_icon_block = '';
				}
			}
		}

		// Базовые стили для иконок
		$unicons_font_css = "
		@font-face {
			font-family: 'Unicons';
			src: url('{$theme_uri}/dist/assets/fonts/unicons/Unicons.woff2') format('woff2'),
				url('{$theme_uri}/dist/assets/fonts/unicons/Unicons.woff') format('woff');
			font-weight: normal;
			font-style: normal;
			font-display: block;
		}
		[class^=\"uil-\"],
		[class*=\" uil-\"] {
			speak: none;
			font-style: normal;
			font-weight: normal;
			font-variant: normal;
			text-transform: none;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			word-spacing: normal;
			font-family: \"Unicons\" !important;
		}
		[class^=\"uil-\"]:before,
		[class*=\" uil-\"]:before {
			display: inline-block;
			font-family: \"Unicons\" !important;
			font-style: normal;
			font-weight: normal;
			font-variant: normal;
			text-transform: none;
			line-height: 1;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}
		" . $icons_css;

		wp_add_inline_style('cw-hotspot-admin', $unicons_font_css);
	}

	/**
	 * Подключить скрипт для копирования шорткода
	 */
	public function enqueue_copy_shortcode_script() {
		$screen = get_current_screen();
		if (!$screen || $screen->post_type !== 'cw_image_hotspot' || $screen->base !== 'edit') {
			return;
		}
		?>
		<script type="text/javascript">
		(function($) {
			$(document).ready(function() {
				$(document).on('click', '.copy-shortcode-btn', function(e) {
					e.preventDefault();
					var $btn = $(this);
					var shortcode = $btn.data('shortcode');

					var $temp = $('<textarea>');
					$('body').append($temp);
					$temp.val(shortcode).select();

					try {
						document.execCommand('copy');
						$temp.remove();

						var $originalIcon = $btn.find('.dashicons');
						$originalIcon.removeClass('dashicons-clipboard').addClass('dashicons-yes-alt');
						$btn.css('color', '#46b450');

						setTimeout(function() {
							$originalIcon.removeClass('dashicons-yes-alt').addClass('dashicons-clipboard');
							$btn.css('color', '');
						}, 2000);
					} catch (err) {
						$temp.remove();
						alert('<?php echo esc_js(__('Failed to copy shortcode', 'codeweber-gutenberg-blocks')); ?>');
					}
				});
			});
		})(jQuery);
		</script>
		<?php
	}

	/**
	 * AJAX: Получить тип поста
	 */
	public function ajax_get_post_type() {
		$post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;

		if (!$post_id) {
			wp_send_json_error(['message' => 'Post ID is required']);
			return;
		}

		$post = get_post($post_id);
		if (!$post) {
			wp_send_json_error(['message' => 'Post not found']);
			return;
		}

		wp_send_json_success([
			'post_type' => $post->post_type
		]);
	}
}

