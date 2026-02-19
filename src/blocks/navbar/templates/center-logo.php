<?php
/**
 * Navbar Block - Center logo template (no Redux, no topbar).
 *
 * @package CodeWeber Gutenberg Blocks
 * @var string $home_link     Home URL.
 * @var string $logo_variant     Logo variant for get_custom_logo_type.
 * @var string $logo_mobile      Mobile logo variant.
 * @var string $logo_brand_class Logo wrapper class (navbar-brand + optional w-*).
 * @var string $logo_custom_html  Custom HTML after logo link (when enabled and not empty).
 * @var string $menu_loc        Menu theme_location (left).
 * @var string $menu_loc1       Menu theme_location (right).
 * @var int    $menu_depth      Menu depth.
 * @var string $wrapper_class   Header wrapper classes.
 * @var string $nav_class       Nav classes.
 * @var string $offcanvas_class Offcanvas theme class.
 */
if (!defined('ABSPATH')) {
	exit;
}
$walker = class_exists('WP_Bootstrap_Navwalker') ? new WP_Bootstrap_Navwalker() : null;
$logo_fn = function_exists('get_custom_logo_type') ? 'get_custom_logo_type' : null;
$logo_fb = has_custom_logo() ? get_custom_logo() : '<span class="site-title">' . esc_html(get_bloginfo('name')) . '</span>';
?>
<header class="<?php echo esc_attr($wrapper_class); ?>"<?php if (!empty($block_id_attr)) { echo ' id="' . esc_attr($block_id_attr) . '"'; } ?>>
	<nav class="navbar navbar-expand-lg center-logo <?php echo esc_attr($nav_class); ?>">
		<div class="container justify-content-between align-items-center">
			<div class="d-flex flex-row w-100 justify-content-between align-items-center d-lg-none">
				<div class="<?php echo esc_attr($logo_brand_class); ?>">
					<a href="<?php echo esc_url($home_link); ?>"><?php echo $logo_fn ? $logo_fn($logo_variant) : $logo_fb; ?></a><?php if (!empty($logo_custom_html)) { echo wp_kses_post($logo_custom_html); } ?>
					<?php if (is_active_sidebar('header-widget-1')) { dynamic_sidebar('header-widget-1'); } ?>
				</div>
				<div class="navbar-other ms-auto">
					<ul class="navbar-nav flex-row align-items-center">
						<li class="nav-item d-lg-none">
							<button class="hamburger offcanvas-nav-btn" aria-label="<?php esc_attr_e('Menu', 'codeweber-gutenberg-blocks'); ?>"><span></span></button>
						</li>
					</ul>
				</div>
			</div>
			<div class="navbar-collapse-wrapper d-flex flex-row align-items-center w-100">
				<div class="navbar-collapse-inner d-flex flex-row align-items-center w-100 mt-0">
					<div class="navbar-collapse offcanvas offcanvas-nav offcanvas-start <?php echo esc_attr($offcanvas_class); ?>">
						<div class="offcanvas-header mx-lg-auto order-0 order-lg-1 d-lg-flex px-lg-15">
							<a href="<?php echo esc_url($home_link); ?>"><?php echo $logo_fn ? $logo_fn($logo_variant) : $logo_fb; ?></a>
							<?php if (is_active_sidebar('header-widget-1')) { dynamic_sidebar('header-widget-1'); } ?>
							<button type="button" class="btn-close d-lg-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
						</div>
						<div class="w-100 order-1 order-lg-0 d-lg-flex offcanvas-body">
							<?php
							wp_nav_menu([
								'theme_location' => $menu_loc,
								'depth'          => $menu_depth,
								'container'      => '',
								'menu_class'     => 'navbar-nav ms-lg-auto',
								'fallback_cb'    => $walker ? 'WP_Bootstrap_Navwalker::fallback' : 'wp_page_menu',
								'walker'         => $walker,
							]);
							?>
						</div>
						<div class="w-100 order-3 order-lg-2 d-lg-flex offcanvas-body">
							<?php
							wp_nav_menu([
								'theme_location' => $menu_loc1,
								'depth'          => $menu_depth,
								'container'      => '',
								'menu_class'     => 'navbar-nav me-lg-auto',
								'fallback_cb'    => $walker ? 'WP_Bootstrap_Navwalker::fallback' : 'wp_page_menu',
								'walker'         => $walker,
							]);
							?>
						</div>
						<div class="offcanvas-body order-4 mt-auto d-lg-none">
							<?php if (!empty($offcanvas_info_in_nav_html)) { ?>
							<div class="offcanvas-footer">
								<div><?php echo $offcanvas_info_in_nav_html; ?></div>
							</div>
							<?php } ?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
	<?php if (!empty($after_nav_html)) { echo $after_nav_html; } ?>
</header>
