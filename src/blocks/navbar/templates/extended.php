<?php
/**
 * Navbar Block - Extended template (no Redux, no topbar).
 * Markup aligned with theme codeweber header-extended.php.
 *
 * @package CodeWeber Gutenberg Blocks
 * @var string $home_link     Home URL.
 * @var string $logo_variant     Logo variant for get_custom_logo_type.
 * @var string $logo_mobile      Mobile logo variant.
 * @var string $logo_brand_class Logo wrapper class (navbar-brand + optional w-*).
 * @var string $logo_custom_html  Custom HTML after logo link (when enabled and not empty).
 * @var string $menu_loc        Menu theme_location.
 * @var int    $menu_depth      Menu depth.
 * @var string $wrapper_class   Header wrapper classes.
 * @var string $header_bg_class Header background class (bg-* or bg-soft-*) for nav.
 * @var string $nav_class       Nav classes.
 * @var string $offcanvas_class Offcanvas theme class.
 * @var string $extended_bar_class Second row bar class (e.g. bg-white).
 * @var string $navbar_other_inner_blocks Rendered inner blocks for navbar-other.
 * @var string $navbar_social_html        Social icons HTML from Redux (when enabled).
 * @var bool   $for_editor_preview True when rendering for editor preview (placeholder for InnerBlocks).
 */
if (!defined('ABSPATH')) {
	exit;
}
$walker = class_exists('WP_Bootstrap_Navwalker') ? new WP_Bootstrap_Navwalker() : null;
$logo_fn = function_exists('get_custom_logo_type') ? 'get_custom_logo_type' : null;
$logo_fb = has_custom_logo() ? get_custom_logo() : '<span class="site-title">' . esc_html(get_bloginfo('name')) . '</span>';
$btn_close_class = (isset($offcanvas_class) && strpos($offcanvas_class, 'dark') !== false) ? 'btn-close btn-close-white' : 'btn-close';
?>
<header class="<?php echo esc_attr($wrapper_class); ?>"<?php if (!empty($block_id_attr)) { echo ' id="' . esc_attr($block_id_attr) . '"'; } ?>>
	<nav class="navbar navbar-expand-lg extended <?php echo esc_attr($nav_class); ?><?php if (!empty($header_bg_class)) { echo ' ' . esc_attr($header_bg_class); } ?>">
		<div class="container flex-lg-column">
			<div class="topbar d-flex flex-row w-100 justify-content-between align-items-center">
				<div class="<?php echo esc_attr($logo_brand_class); ?>">
					<a href="<?php echo esc_url($home_link); ?>"><?php echo $logo_fn ? $logo_fn($logo_variant) : $logo_fb; ?></a><?php if (!empty($logo_custom_html)) { echo wp_kses_post($logo_custom_html); } ?>
				</div>
				<div class="navbar-other ms-auto">
					<ul class="navbar-nav flex-row align-items-center">
						<?php if (!empty($for_editor_preview)) { ?>
							<li class="nav-item">
								<div id="navbar-other-innerblocks" class="navbar-other-innerblocks-slot d-flex align-items-center" style="pointer-events:auto;min-height:40px;min-width:120px;border:1px dashed rgba(0,0,0,.2);border-radius:4px"></div>
							</li>
						<?php } elseif (!empty($navbar_other_inner_blocks)) { ?>
							<?php echo $navbar_other_inner_blocks; ?>
						<?php } ?>
						<li class="nav-item d-lg-none">
							<button class="hamburger offcanvas-nav-btn" aria-label="<?php esc_attr_e('Menu', 'codeweber-gutenberg-blocks'); ?>"><span></span></button>
						</li>
					</ul>
					<!-- /.navbar-nav -->
				</div>
				<!-- /.navbar-other -->
			</div>

			<div class="navbar-collapse-wrapper d-flex flex-row align-items-center <?php echo esc_attr($extended_bar_class); ?>">
				<div class="navbar-collapse offcanvas offcanvas-nav offcanvas-start <?php echo esc_attr($offcanvas_class); ?>">
					<div class="offcanvas-header d-lg-none">
						<a href="<?php echo esc_url($home_link); ?>"><?php echo $logo_fn ? $logo_fn($logo_mobile) : $logo_fb; ?></a>
						<button type="button" class="<?php echo esc_attr($btn_close_class); ?>" data-bs-dismiss="offcanvas" aria-label="<?php esc_attr_e('Close', 'codeweber-gutenberg-blocks'); ?>"></button>
					</div>
					<div class="offcanvas-body d-flex flex-column h-100">
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
						<?php if (!empty($offcanvas_info_in_nav_html)) { ?>
						<div class="offcanvas-footer d-lg-none">
							<div><?php echo $offcanvas_info_in_nav_html; ?></div>
						</div>
						<?php } ?>
					</div>
				</div>
				<div class="navbar-other ms-auto w-100 d-none d-lg-block"><?php if (!empty($navbar_social_html)) { echo $navbar_social_html; } ?></div>
			</div>
		</div>
	</nav>
	<?php if (!empty($after_nav_html)) { echo $after_nav_html; } ?>
</header>
