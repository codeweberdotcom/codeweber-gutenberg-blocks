<?php
/**
 * Tables Block - Server-side render
 *
 * @package CodeWeber Gutenberg Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

if (!defined('ABSPATH')) {
	exit;
}

$source_mode = $attributes['sourceMode'] ?? 'manual';
$csv_document_id = isset($attributes['csvDocumentId']) ? (int) $attributes['csvDocumentId'] : 0;
$table_dark = !empty($attributes['tableDark']);
$table_sm = !empty($attributes['tableSm']);
$table_striped = !empty($attributes['tableStriped']);
$table_striped_columns = !empty($attributes['tableStripedColumns']);
$table_bordered = !empty($attributes['tableBordered']);
$table_borderless = !empty($attributes['tableBorderless']);
$table_hover = !empty($attributes['tableHover']);
$table_variant = isset($attributes['tableVariant']) ? trim((string) $attributes['tableVariant']) : '';
$thead_variant = isset($attributes['theadVariant']) ? trim((string) $attributes['theadVariant']) : '';
$show_header = isset($attributes['showHeader']) ? (bool) $attributes['showHeader'] : true;
$responsive = isset($attributes['responsive']) ? (bool) $attributes['responsive'] : true;

$allowed_variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
$allowed_thead = ['table-light', 'table-dark'];

$table_classes = ['table'];
if ($table_dark) $table_classes[] = 'table-dark';
if ($table_sm) $table_classes[] = 'table-sm';
if ($table_striped) $table_classes[] = 'table-striped';
if ($table_striped_columns) $table_classes[] = 'table-striped-columns';
if ($table_bordered) $table_classes[] = 'table-bordered';
if ($table_borderless) $table_classes[] = 'table-borderless';
if ($table_hover) $table_classes[] = 'table-hover';
if ($table_variant && in_array($table_variant, $allowed_variants, true)) $table_classes[] = 'table-' . $table_variant;
$table_class_str = implode(' ', $table_classes);

$thead_class = ($thead_variant && in_array($thead_variant, $allowed_thead, true)) ? $thead_variant : '';

$allowed_aligns = ['center', 'end'];
$column_aligns = (isset($attributes['columnAligns']) && is_array($attributes['columnAligns'])) ? $attributes['columnAligns'] : [];
$align_attr = function ($i) use ($column_aligns, $allowed_aligns) {
	$a = isset($column_aligns[$i]) ? (string) $column_aligns[$i] : '';
	return in_array($a, $allowed_aligns, true) ? ' class="text-' . $a . '"' : '';
};

$header_cells = [];
$rows_data = [];

if ($source_mode === 'csv' && $csv_document_id > 0 && post_type_exists('documents')) {
	$post = get_post($csv_document_id);
	if ($post && $post->post_type === 'documents') {
		$file_meta = get_post_meta($csv_document_id, '_document_file', true);
		if ($file_meta) {
			$file_url = is_numeric($file_meta) ? wp_get_attachment_url((int) $file_meta) : $file_meta;
			if ($file_url) {
				$ext = strtolower(pathinfo($file_url, PATHINFO_EXTENSION));
				if (in_array($ext, ['csv', 'xls', 'xlsx'], true)) {
					$result = \Codeweber\Blocks\SpreadsheetHelper::parse_from_url($file_url, $ext);
					if (!empty($result['rows'])) {
						$parsed = $result['rows'];
						$header_cells = array_shift($parsed);
						$rows_data = $parsed;
					}
				}
			}
		}
	}
} else {
	$header_raw = $attributes['headerCells'] ?? [];
	$rows_raw = $attributes['rows'] ?? [];
	$normalize = function ($c) {
		if (is_string($c)) return ['content' => $c, 'colspan' => 1, 'rowspan' => 1];
		return [
			'content' => $c['content'] ?? '',
			'colspan' => max(1, (int) ($c['colspan'] ?? 1)),
			'rowspan' => max(1, (int) ($c['rowspan'] ?? 1)),
		];
	};
	$header_cells = array_map($normalize, $header_raw);
	foreach ($rows_raw as $row) {
		$cells = $row['cells'] ?? [];
		$rows_data[] = array_map($normalize, $cells);
	}
}

$wrapper_class = 'wp-block-codeweber-blocks-tables';
$anchor = isset($attributes['anchor']) ? trim((string) $attributes['anchor']) : '';
?>
<div class="<?php echo esc_attr($wrapper_class); ?>"<?php echo $anchor ? ' id="' . esc_attr($anchor) . '"' : ''; ?>>
	<?php if ($responsive) : ?>
		<div class="table-responsive">
	<?php endif; ?>
	<table class="<?php echo esc_attr($table_class_str); ?>">
		<?php if (!empty($header_cells) || !empty($rows_data)) : ?>
			<?php if ($show_header && !empty($header_cells)) : ?>
			<thead<?php echo $thead_class ? ' class="' . esc_attr($thead_class) . '"' : ''; ?>>
				<tr>
					<?php
					if ($source_mode === 'csv' && !empty($header_cells)) {
						foreach ($header_cells as $h_idx => $cell) {
							$val = is_array($cell) ? ($cell['content'] ?? $cell) : $cell;
							echo '<th scope="col"' . $align_attr($h_idx) . '>' . esc_html($val) . '</th>';
						}
					} elseif ($source_mode === 'manual' && !empty($header_cells)) {
						foreach ($header_cells as $h_idx => $cell) {
							$colspan = $cell['colspan'] ?? 1;
							$content = $cell['content'] ?? '';
							$col_attr = $colspan > 1 ? ' colSpan="' . (int) $colspan . '"' : '';
							echo '<th scope="col"' . $align_attr($h_idx) . $col_attr . '>' . wp_kses_post($content) . '</th>';
						}
					}
					?>
				</tr>
			</thead>
			<?php endif; ?>
			<tbody>
				<?php
				if ($source_mode === 'csv' && !empty($rows_data)) {
					foreach ($rows_data as $row) {
						echo '<tr>';
						foreach ($row as $c_idx => $cell) {
							$val = is_array($cell) ? ($cell['content'] ?? reset($cell)) : $cell;
							echo '<td' . $align_attr($c_idx) . '>' . esc_html($val) . '</td>';
						}
						echo '</tr>';
					}
				} elseif ($source_mode === 'manual' && !empty($rows_data)) {
					$total_cols = array_sum(array_map(function ($c) { return $c['colspan'] ?? 1; }, $header_cells));
					$covered = [];
					foreach ($rows_data as $r_idx => $row) {
						echo '<tr>';
						$row_cells = $row;
						$col = 0;
						$cell_idx = 0;
						while ($col < $total_cols && $cell_idx < count($row_cells)) {
							$key = $r_idx . ':' . $col;
							if (isset($covered[$key])) {
								$col++;
								continue;
							}
							$cell = $row_cells[$cell_idx];
							$rowspan = (int) ($cell['rowspan'] ?? 1);
							$colspan = (int) ($cell['colspan'] ?? 1);
							$content = $cell['content'] ?? '';
							$tag = $cell_idx === 0 ? 'th' : 'td';
							$scope = $cell_idx === 0 ? ' scope="row"' : '';
							$row_attr = $rowspan > 1 ? ' rowSpan="' . $rowspan . '"' : '';
							$col_attr = $colspan > 1 ? ' colSpan="' . $colspan . '"' : '';
							echo '<' . $tag . $scope . $align_attr($cell_idx) . $row_attr . $col_attr . '>' . wp_kses_post($content) . '</' . $tag . '>';
							for ($i = 1; $i < $rowspan; $i++) {
								for ($j = 0; $j < $colspan; $j++) {
									$covered[($r_idx + $i) . ':' . ($col + $j)] = true;
								}
							}
							$col += $colspan;
							$cell_idx++;
						}
						$covered_count = 0;
						for ($c = 0; $c < $total_cols; $c++) {
							if (isset($covered[$r_idx . ':' . $c])) $covered_count++;
						}
						$free_cols = $total_cols - $covered_count;
						$row_span = array_sum(array_map(function ($c) { return $c['colspan'] ?? 1; }, $row_cells));
						$pad = max(0, $free_cols - $row_span);
						if ($pad > 0) {
							echo '<td colSpan="' . $pad . '"></td>';
						}
						echo '</tr>';
					}
				}
				?>
			</tbody>
		<?php else : ?>
			<tbody><tr><td><?php esc_html_e('No data', 'codeweber-gutenberg-blocks'); ?></td></tr></tbody>
		<?php endif; ?>
	</table>
	<?php if ($responsive) : ?>
		</div>
	<?php endif; ?>
</div>
