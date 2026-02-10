<?php
/**
 * Navbar Block - Extended center logo template (no Redux, no topbar).
 *
 * @package CodeWeber Gutenberg Blocks
 * @var string $home_link     Home URL.
 * @var string $logo_variant  Logo variant for get_custom_logo_type.
 * @var string $logo_mobile   Mobile logo variant.
 * @var string $menu_loc        Menu theme_location.
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
<header class="<?php echo esc_attr($wrapper_class); ?>">
	<nav class="navbar navbar-expand-lg extended extended-alt <?php echo esc_attr($nav_class); ?>">
		<div class="container">
			<div class="navbar-brand">
				<a href="<?php echo esc_url($home_link); ?>"><?php echo $logo_fn ? $logo_fn($logo_variant) : $logo_fb; ?></a>
			</div>
			<div class="navbar-collapse-wrapper d-flex flex-row align-items-center justify-content-between">
				<div class="navbar-other w-100 d-none d-lg-block"></div>
				<div class="navbar-collapse offcanvas offcanvas-nav offcanvas-start <?php echo esc_attr($offcanvas_class); ?>">
					<div class="offcanvas-header d-lg-none">
						<a href="<?php echo esc_url($home_link); ?>"><?php echo $logo_fn ? $logo_fn($logo_mobile) : $logo_fb; ?></a>
						<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
					</div>
					<div class="offcanvas-body">
						<?php
						wp_nav_menu([
							'theme_location' => $menu_loc,
							'depth'          => $menu_depth,
							'container'      => '',
							'menu_class'     => 'navbar-nav',
							'fallback_cb'    => $walker ? 'WP_Bootstrap_Navwalker::fallback' : 'wp_page_menu',
							'walker'         => $walker,
						]);
						?>
					</div>
				</div>
				<div class="navbar-other w-100 d-flex">
					<ul class="navbar-nav flex-row align-items-center ms-auto">
						<li class="nav-item d-lg-none">
							<button class="hamburger offcanvas-nav-btn" aria-label="<?php esc_attr_e('Menu', 'codeweber-gutenberg-blocks'); ?>"><span></span></button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</nav>
	<?php if (!empty($after_nav_html)) { echo $after_nav_html; } ?>
</header>
