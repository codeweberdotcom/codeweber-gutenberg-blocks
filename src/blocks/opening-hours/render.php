<?php
/**
 * Opening Hours Block — Server-Side Render
 *
 * Data source: theme Redux options (Company Details → Opening Hours).
 * Keys: opening_hours_{day}_opens_1 / _closes_1 / _opens_2 / _closes_2.
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * Available: $attributes, $content, $block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! isset( $attributes ) || ! is_array( $attributes ) ) {
	$attributes = array();
}

$show_title    = ! empty( $attributes['showTitle'] );
$title         = isset( $attributes['title'] ) ? (string) $attributes['title'] : '';
$show_status   = ! empty( $attributes['showStatus'] );
$open_label    = isset( $attributes['openLabel'] ) ? (string) $attributes['openLabel'] : '';
$closed_label  = isset( $attributes['closedLabel'] ) ? (string) $attributes['closedLabel'] : '';
$highlight     = ! empty( $attributes['highlightToday'] );
$today_label   = isset( $attributes['todayLabel'] ) ? (string) $attributes['todayLabel'] : '';
$day_format    = isset( $attributes['dayFormat'] ) ? (string) $attributes['dayFormat'] : 'short';
$dayoff_label  = isset( $attributes['dayoffLabel'] ) ? (string) $attributes['dayoffLabel'] : '';
$break_mode    = isset( $attributes['breakMode'] ) ? (string) $attributes['breakMode'] : 'both';
$group_days    = ! empty( $attributes['groupSameDays'] );
$separator_key = isset( $attributes['timeSeparator'] ) ? (string) $attributes['timeSeparator'] : 'ndash';
$layout        = isset( $attributes['layout'] ) ? (string) $attributes['layout'] : 'list';
$align_end     = ! empty( $attributes['alignTimeEnd'] );
$text_size     = isset( $attributes['textSize'] ) ? (string) $attributes['textSize'] : '';

// Time-range separator string.
switch ( $separator_key ) {
	case 'mdash':
		$sep = ' — ';
		break;
	case 'to':
		$sep = ' ' . __( 'to', 'codeweber-gutenberg-blocks' ) . ' ';
		break;
	default:
		$sep = ' – '; // en dash.
}

// Read a Redux option (theme), with a safe fallback.
$get_opt = static function ( $key ) {
	if ( class_exists( 'Codeweber_Options' ) ) {
		return (string) Codeweber_Options::get( $key, '' );
	}
	$opts = get_option( 'redux_demo', array() );
	return isset( $opts[ $key ] ) ? (string) $opts[ $key ] : '';
};

// Monday-first day order, mapped to PHP weekday index (0 = Sunday).
$day_keys = array( 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' );
$w_index  = array(
	'monday'    => 1,
	'tuesday'   => 2,
	'wednesday' => 3,
	'thursday'  => 4,
	'friday'    => 5,
	'saturday'  => 6,
	'sunday'    => 0,
);

// Localized day name (uses WP locale, so it follows the site language).
global $wp_locale;
$name_of = static function ( $day ) use ( $wp_locale, $w_index, $day_format ) {
	$full = $wp_locale->get_weekday( $w_index[ $day ] );
	return ( 'full' === $day_format ) ? $full : $wp_locale->get_weekday_abbrev( $full );
};

// Read raw hours for every day.
$rows = array();
foreach ( $day_keys as $day ) {
	$o1 = trim( $get_opt( 'opening_hours_' . $day . '_opens_1' ) );
	$c1 = trim( $get_opt( 'opening_hours_' . $day . '_closes_1' ) );
	$o2 = trim( $get_opt( 'opening_hours_' . $day . '_opens_2' ) );
	$c2 = trim( $get_opt( 'opening_hours_' . $day . '_closes_2' ) );

	$rows[ $day ] = array(
		'o1'     => $o1,
		'c1'     => $c1,
		'o2'     => $o2,
		'c2'     => $c2,
		'closed' => ( '' === $o1 ),
	);
}

// Build the display time line(s) for a day, honoring the break mode.
$format_day = static function ( $r ) use ( $break_mode, $sep, $dayoff_label ) {
	if ( $r['closed'] ) {
		return array(
			'closed' => true,
			'lines'  => array( $dayoff_label ),
		);
	}

	$end1 = ( '' !== $r['c1'] ) ? $r['c1'] : $r['c2'];

	if ( 'range' === $break_mode ) {
		$end = ( '' !== $r['c2'] ) ? $r['c2'] : $r['c1'];
		return array(
			'closed' => false,
			'lines'  => array( $r['o1'] . $sep . $end ),
		);
	}

	$first       = $r['o1'] . $sep . $end1;
	$has_second  = ( '' !== $r['o2'] && '' !== $r['c2'] );

	if ( ! $has_second ) {
		return array(
			'closed' => false,
			'lines'  => array( $first ),
		);
	}

	$second = $r['o2'] . $sep . $r['c2'];

	if ( 'second-line' === $break_mode ) {
		return array(
			'closed' => false,
			'lines'  => array( $first, $second ),
		);
	}

	// both.
	return array(
		'closed' => false,
		'lines'  => array( $first . ', ' . $second ),
	);
};

$formatted = array();
foreach ( $day_keys as $day ) {
	$formatted[ $day ] = $format_day( $rows[ $day ] );
}

// Current day / open-now status (site timezone).
$now       = current_datetime();
$today_w   = (int) $now->format( 'w' );
$now_hm    = $now->format( 'H:i' );
$today_key = array_search( $today_w, $w_index, true );

$is_open = false;
if ( isset( $rows[ $today_key ] ) && ! $rows[ $today_key ]['closed'] ) {
	$tr      = $rows[ $today_key ];
	$within  = static function ( $a, $b ) use ( $now_hm ) {
		return ( '' !== $a && '' !== $b && $now_hm >= $a && $now_hm <= $b );
	};
	$end1    = ( '' !== $tr['c1'] ) ? $tr['c1'] : $tr['c2'];
	if ( $within( $tr['o1'], $end1 ) || $within( $tr['o2'], $tr['c2'] ) ) {
		$is_open = true;
	}
}

// Build the display list, grouping consecutive identical days when requested.
$display = array();
$n       = count( $day_keys );
$i       = 0;
while ( $i < $n ) {
	$day = $day_keys[ $i ];
	$sig = implode( '|', $formatted[ $day ]['lines'] ) . ( $formatted[ $day ]['closed'] ? 'C' : 'O' );
	$j   = $i;

	if ( $group_days ) {
		while ( $j + 1 < $n ) {
			$next  = $day_keys[ $j + 1 ];
			$nsig  = implode( '|', $formatted[ $next ]['lines'] ) . ( $formatted[ $next ]['closed'] ? 'C' : 'O' );
			if ( $nsig === $sig ) {
				$j++;
			} else {
				break;
			}
		}
	}

	$label = $name_of( $day_keys[ $i ] );
	if ( $j > $i ) {
		$label .= '–' . $name_of( $day_keys[ $j ] );
	}

	$is_today = false;
	for ( $k = $i; $k <= $j; $k++ ) {
		if ( $day_keys[ $k ] === $today_key ) {
			$is_today = true;
			break;
		}
	}

	$display[] = array(
		'label'    => $label,
		'lines'    => $formatted[ $day_keys[ $i ] ]['lines'],
		'closed'   => $formatted[ $day_keys[ $i ] ]['closed'],
		'is_today' => $is_today,
		'single'   => ( $j === $i ),
	);

	$i = $j + 1;
}

// Root element (no structural wrapper — only the block node itself).
$anchor        = isset( $attributes['anchor'] ) ? trim( (string) $attributes['anchor'] ) : '';
$root_classes  = array_filter( array( 'cwgb-opening-hours', $text_size ) );
$wrapper_extra = array( 'class' => implode( ' ', $root_classes ) );
if ( '' !== $anchor ) {
	$wrapper_extra['id'] = $anchor;
}
$wrapper_attributes = get_block_wrapper_attributes( $wrapper_extra );

// Render the time cell content (lines joined with <br>, each escaped).
$render_lines = static function ( $lines ) {
	return implode( '<br>', array_map( 'esc_html', (array) $lines ) );
};
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $show_title || $show_status ) : ?>
		<div class="cwgb-oh-head d-flex justify-content-between align-items-center mb-2">
			<?php if ( $show_title ) : ?>
				<span class="cwgb-oh-title fw-bold"><?php echo esc_html( $title ); ?></span>
			<?php else : ?>
				<span></span>
			<?php endif; ?>
			<?php
			if ( $show_status ) :
				$status_class = $is_open ? 'text-success' : 'text-danger';
				$status_text  = $is_open ? $open_label : $closed_label;
				?>
				<span class="cwgb-oh-status d-inline-flex align-items-center gap-1 <?php echo esc_attr( $status_class ); ?>">
					<span class="cwgb-oh-dot d-inline-block rounded-circle"></span><?php echo esc_html( $status_text ); ?>
				</span>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php if ( 'table' === $layout ) : ?>
		<table class="cwgb-oh-table table table-sm mb-0">
			<tbody>
				<?php foreach ( $display as $row ) : ?>
					<tr class="<?php echo esc_attr( $highlight && $row['is_today'] ? 'fw-bold' : '' ); ?>">
						<td class="cwgb-oh-day">
							<?php
							echo esc_html( $row['label'] );
							if ( $highlight && $row['is_today'] && $row['single'] && '' !== $today_label ) {
								echo ' ' . esc_html( $today_label );
							}
							?>
						</td>
						<td class="cwgb-oh-time<?php echo $align_end ? ' text-end' : ''; ?><?php echo $row['closed'] ? ' text-muted' : ''; ?>">
							<?php echo $render_lines( $row['lines'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	<?php else : ?>
		<?php foreach ( $display as $row ) : ?>
			<?php
			$row_classes = array( 'cwgb-oh-row', 'd-flex' );
			if ( $align_end ) {
				$row_classes[] = 'justify-content-between';
			}
			if ( $highlight && $row['is_today'] ) {
				$row_classes[] = 'fw-bold';
			}
			?>
			<div class="<?php echo esc_attr( implode( ' ', $row_classes ) ); ?>">
				<span class="cwgb-oh-day">
					<?php
					echo esc_html( $row['label'] );
					if ( $highlight && $row['is_today'] && $row['single'] && '' !== $today_label ) {
						echo ' ' . esc_html( $today_label );
					}
					?>
				</span>
				<span class="cwgb-oh-time<?php echo $row['closed'] ? ' text-muted' : ''; ?>">
					<?php echo $render_lines( $row['lines'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</span>
			</div>
		<?php endforeach; ?>
	<?php endif; ?>
</div>
