<?php
/**
 * Opening Hours Block — Server-Side Render
 *
 * Data source: theme Redux options (Company Details → Opening Hours).
 * All hours logic lives in the shared \Codeweber\Blocks\OpeningHours helper.
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

use Codeweber\Blocks\OpeningHours;

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

$rows    = OpeningHours::rows();
$is_open = OpeningHours::isOpenNow( $rows );
$display = OpeningHours::buildDisplay(
	$rows,
	array(
		'dayFormat'     => $day_format,
		'breakMode'     => $break_mode,
		'groupSameDays' => $group_days,
		'separator'     => $separator_key,
		'dayoffLabel'   => $dayoff_label,
	)
);

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
