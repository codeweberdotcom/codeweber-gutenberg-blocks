<?php
/**
 * Navbar Block - Fancy center logo template (no Redux, no topbar).
 * No InnerBlocks — logo between two menus only.
 *
 * @package CodeWeber Gutenberg Blocks
 * @var string $home_link     Home URL.
 * @var string $logo_variant  Logo variant for get_custom_logo_type (desktop).
 * @var string $logo_mobile   Mobile logo variant.
 * @var string $menu_loc      Menu theme_location (left).
 * @var string $menu_loc1     Menu theme_location (right).
 * @var int    $menu_depth    Menu depth.
 * @var string $wrapper_class Header wrapper classes.
 * @var string $nav_class     Nav classes.
 * @var string $offcanvas_class              Offcanvas theme class.
 * @var string $navbar_collapse_wrapper_class Center bar classes (bg-light/dark etc.) for fancy.
 */
if (!defined('ABSPATH')) {
	exit;
}
$walker = class_exists('WP_Bootstrap_Navwalker') ? new WP_Bootstrap_Navwalker() : null;
$logo_fn = function_exists('get_custom_logo_type') ? 'get_custom_logo_type' : null;
$logo_fb = has_custom_logo() ? get_custom_logo() : '<span class="site-title">' . esc_html(get_bloginfo('name')) . '</span>';
$btn_close_class = (isset($offcanvas_class) && strpos($offcanvas_class, 'dark') !== false) ? 'btn-close btn-close-white' : 'btn-close';
?>
<header class="<?php echo esc_attr($wrapper_class); ?>">
	<nav class="navbar navbar-expand-lg fancy center-logo <?php echo esc_attr($nav_class); ?>">
		<div class="container">
			<div class="navbar-collapse-wrapper d-lg-flex flex-row flex-nowrap w-100 justify-content-between align-items-center <?php echo esc_attr($navbar_collapse_wrapper_class ?: 'bg-light navbar-light'); ?>">
				<div class="d-flex flex-row w-100 justify-content-between align-items-center d-lg-none">
					<div class="navbar-brand">
						<a href="<?php echo esc_url($home_link); ?>"><?php echo $logo_fn ? $logo_fn($logo_variant) : $logo_fb; ?></a>
					</div>
					<div class="navbar-other ms-auto">
						<ul class="navbar-nav flex-row align-items-center">
							<li class="nav-item d-lg-none">
								<button class="hamburger offcanvas-nav-btn" aria-label="<?php esc_attr_e('Menu', 'codeweber-gutenberg-blocks'); ?>"><span></span></button>
							</li>
						</ul>
					</div>
				</div>
				<div class="navbar-collapse-inner d-flex flex-row align-items-center w-100 mt-0">
					<div class="navbar-collapse offcanvas offcanvas-nav offcanvas-start <?php echo esc_attr($offcanvas_class); ?>">
						<div class="offcanvas-header mx-lg-auto order-0 order-lg-1 d-lg-flex px-lg-15">
							<a href="<?php echo esc_url($home_link); ?>" class="transition-none d-none d-lg-flex"><?php echo $logo_fn ? $logo_fn($logo_variant) : $logo_fb; ?></a>
							<a href="<?php echo esc_url($home_link); ?>" class="d-lg-none transition-none"><?php echo $logo_fn ? $logo_fn($logo_mobile) : $logo_fb; ?></a>
							<button type="button" class="<?php echo esc_attr($btn_close_class); ?> d-lg-none" data-bs-dismiss="offcanvas" aria-label="<?php esc_attr_e('Close', 'codeweber-gutenberg-blocks'); ?>"></button>
						</div>
						<div class="w-100 order-1 order-lg-0 d-lg-flex">
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
						<div class="w-100 order-3 order-lg-2 d-lg-flex">
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
						<div class="offcanvas-body order-4 mt-auto"></div>
					</div>
				</div>
			</div>
		</div>
	</nav>
	<?php if (!empty($after_nav_html)) { echo $after_nav_html; } ?>
</header>
