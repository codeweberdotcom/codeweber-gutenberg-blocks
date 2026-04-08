<?php
/**
 * Page Header Block — server-side render.
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ── Attributes ────────────────────────────────────────────────
$template_model    = $attributes['templateModel']    ?? 'auto';
$title_mode        = $attributes['titleMode']        ?? 'auto';
$custom_title      = $attributes['customTitle']      ?? '';
$breadcrumbs_mode  = $attributes['breadcrumbsMode']  ?? 'auto';

// ── Resolve template model number ─────────────────────────────
// 'auto' → read from Redux; otherwise use the block-level override.
if ( $template_model === 'auto' || ! in_array( $template_model, [ '1','2','3','4','5','6','7','8','9' ], true ) ) {
	$resolved_model = class_exists( 'Codeweber_Options' )
		? ( Codeweber_Options::get( 'global_page_header_model', '2' ) ?: '2' )
		: '2';
} else {
	$resolved_model = $template_model;
}

// ── Build pageheader_vars ─────────────────────────────────────
// Replicates get_pageheader_vars() from pageheader.php so this
// block is fully self-contained (pageheader.php may not be loaded).
if ( ! function_exists( 'cwgb_build_pageheader_vars' ) ) {
	function cwgb_build_pageheader_vars( string $model ): array {
		if ( ! class_exists( 'Codeweber_Options' ) ) {
			return [
				'breadcrumbs_enable' => false,
				'breadcrumbs_color'  => 'muted',
				'breadcrumbs_bg'     => ' bg-soft-primary',
				'breadcrumbs_align'  => 'left',
				'container_class'    => [],
				'section_class'      => [],
				'col_class'          => [ 'col-lg-10 col-xxl-8' ],
				'title_class'        => [ 'text-dark' ],
				'subtitle_class'     => [ 'text-dark' ],
				'data_section'       => [],
				'row_class'          => [],
				'subtitle_html'      => '',
			];
		}

		// ── Breadcrumbs ────────────────────────────────────────
		$crumb_color_raw = Codeweber_Options::get( 'global-page-header-breadcrumb-color' );
		$crumb_enable    = Codeweber_Options::get( 'global-page-header-breadcrumb-enable' );
		$crumb_bg_raw    = Codeweber_Options::get( 'global-page-header-breadcrumb-bg-color' );
		$crumb_align_raw = Codeweber_Options::get( 'global-bredcrumbs-aligns' );

		$crumb_align = match ( $crumb_align_raw ) {
			'2'     => 'center',
			'3'     => 'right',
			default => 'left',
		};
		$crumb_bg = $crumb_bg_raw ? ' bg-' . $crumb_bg_raw : ' bg-soft-primary';
		$crumb_color = match ( $crumb_color_raw ) {
			'1'     => 'dark',
			'2'     => 'white',
			default => 'muted',
		};

		// ── Header background (for container padding logic) ────
		$header_background = Codeweber_Options::get( 'header-background' );
		$is_transparent    = ( $header_background === '3' );

		// ── Container class — depends on model ─────────────────
		$container_class = [];
		$container_class[] = match ( $model ) {
			'4'     => $is_transparent ? 'pb-12 pb-md-16 pt-20 pt-md-21' : 'py-12 py-md-16',
			'5'     => $is_transparent ? 'pt-17 pb-10'                   : 'py-10',
			'6'     => $is_transparent ? 'pt-20 pb-18 pb-md-20 pt-md-21 pb-lg-21' : 'pt-16 pb-18 pb-md-20 pt-md-16 pb-lg-21',
			'7'     => $is_transparent ? 'pt-19 pt-md-23 pb-18 pb-md-20' : 'pt-19 pt-md-20 pb-18 pb-md-20',
			'8'     => $is_transparent ? 'pt-19 pt-md-24 pb-18 pb-md-20' : 'pt-19 pt-md-21 pb-18 pb-md-20',
			'9'     => $is_transparent ? 'py-14'                          : 'py-12',
			'3'     => $is_transparent ? 'pt-18 pt-md-20'                 : 'pt-10 pt-md-14',
			default => $is_transparent ? 'pt-18 pt-md-18'                 : 'pt-10 pt-md-14', // 1, 2 and fallback
		};

		// ── Section / background ───────────────────────────────
		$bg_type       = Codeweber_Options::get( 'global-page-header-background' );
		$bg_solid      = Codeweber_Options::get( 'global-page-header-bg-solid-color' );
		$bg_soft       = Codeweber_Options::get( 'global-page-header-bg-soft-color' );
		$bg_image_url  = Codeweber_Options::get( 'global-page-header-image' )['url']   ?? '';
		$bg_pattern_url = Codeweber_Options::get( 'global-page-header-pattern' )['url'] ?? '';

		$section_class = [];
		$data_section  = [];
		if ( $bg_type === '1' && $bg_solid ) {
			$section_class[] = 'bg-' . $bg_solid;
		} elseif ( $bg_type === '2' && $bg_soft ) {
			$section_class[] = 'bg-' . $bg_soft;
		} elseif ( $bg_type === '3' ) {
			$section_class[] = 'bg-image bg-cover bg-overlay image-wrapper';
			if ( $bg_image_url ) {
				$data_section[] = 'data-image-src="' . esc_url( $bg_image_url ) . '"';
			}
		} elseif ( $bg_type === '4' ) {
			$section_class[] = 'pattern-wrapper bg-image';
			if ( $bg_pattern_url ) {
				$data_section[] = 'data-image-src="' . esc_url( $bg_pattern_url ) . '"';
			}
		}

		// ── Title color ────────────────────────────────────────
		$title_color_raw = Codeweber_Options::get( 'global-page-header-title-color' );
		$title_size      = Codeweber_Options::get( 'opt-select-title-size', '' ) ?? '';
		$title_class     = [];
		$subtitle_class  = [];

		if ( $title_color_raw === '2' ) {
			$title_class[]    = 'text-white';
			$subtitle_class[] = 'text-white';
		} else {
			$title_class[]    = 'text-dark';
			$subtitle_class[] = 'text-dark';
		}
		if ( $title_size ) {
			$title_class[] = $title_size;
		}

		// ── Alignment ─────────────────────────────────────────
		$align_raw  = Codeweber_Options::get( 'global-page-header-aligns' );
		$col_class  = [];
		$row_class  = [];

		if ( $align_raw === '2' ) {
			$container_class[] = 'text-center';
			$col_class[]       = 'col-md-7 col-lg-6 col-xl-5 mx-auto';
			$row_class[]       = 'd-flex justify-content-center';
		} elseif ( $align_raw === '3' ) {
			$container_class[] = 'text-end';
			$col_class[]       = 'col-lg-10 col-xxl-8';
			$row_class[]       = 'd-flex justify-content-end';
			$title_class[]     = 'text-end';
		} else {
			$col_class[] = 'col-lg-10 col-xxl-8';
		}

		// ── Subtitle ───────────────────────────────────────────
		$subtitle_html = '';
		if ( function_exists( 'the_subtitle' ) ) {
			$lead_class    = 'lead ' . implode( ' ', $subtitle_class );
			$padding       = ( $align_raw === '2' ) ? ' px-lg-5 px-xxl-8' : '';
			$subtitle_html = the_subtitle( '<p class="' . esc_attr( $lead_class . $padding ) . '">%s</p>', '', '', false );
		}

		return [
			'breadcrumbs_enable' => $crumb_enable,
			'breadcrumbs_color'  => $crumb_color,
			'breadcrumbs_bg'     => $crumb_bg,
			'breadcrumbs_align'  => $crumb_align,
			'container_class'    => $container_class,
			'section_class'      => $section_class,
			'col_class'          => $col_class,
			'title_class'        => $title_class,
			'subtitle_class'     => $subtitle_class,
			'data_section'       => $data_section,
			'row_class'          => $row_class,
			'subtitle_html'      => $subtitle_html,
			'global_page_header_model' => $model,
			'header_background'  => $header_background,
		];
	}
}

$pageheader_vars = cwgb_build_pageheader_vars( $resolved_model );

// ── Breadcrumbs override ──────────────────────────────────────
if ( $breadcrumbs_mode === 'show' ) {
	$pageheader_vars['breadcrumbs_enable'] = '1';
} elseif ( $breadcrumbs_mode === 'hide' ) {
	$pageheader_vars['breadcrumbs_enable'] = false;
}

// ── Custom title override ─────────────────────────────────────
$has_title_override = ( $title_mode === 'custom' && $custom_title !== '' );
if ( $has_title_override ) {
	$sanitized_custom_title = sanitize_text_field( $custom_title );
	add_filter(
		'codeweber_universal_title_override',
		static function () use ( $sanitized_custom_title ) {
			return $sanitized_custom_title;
		},
		10
	);
}

// ── Include theme template ────────────────────────────────────
$template_file = get_theme_file_path( "templates/pageheader/pageheader-{$resolved_model}.php" );

if ( file_exists( $template_file ) ) {
	$ob_level = ob_get_level();
	ob_start();
	// phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
	require $template_file;
	$html = '';
	while ( ob_get_level() > $ob_level ) {
		$html .= ob_get_clean();
	}
} else {
	$html = '';
}

// ── Remove custom title filter ────────────────────────────────
if ( $has_title_override ) {
	remove_all_filters( 'codeweber_universal_title_override' );
}

// ── Output ────────────────────────────────────────────────────
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
echo $html;
