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
$table_striped = !empty($attributes['tableStriped']);
$table_bordered = !empty($attributes['tableBordered']);
$table_borderless = !empty($attributes['tableBorderless']);
$table_hover = !empty($attributes['tableHover']);
$responsive = isset($attributes['responsive']) ? (bool) $attributes['responsive'] : true;

$table_classes = ['table'];
if ($table_dark) $table_classes[] = 'table-dark';
if ($table_striped) $table_classes[] = 'table-striped';
if ($table_bordered) $table_classes[] = 'table-bordered';
if ($table_borderless) $table_classes[] = 'table-borderless';
if ($table_hover) $table_classes[] = 'table-hover';
$table_class_str = implode(' ', $table_classes);

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
?>
<div class="<?php echo esc_attr($wrapper_class); ?>">
	<?php if ($responsive) : ?>
		<div class="table-responsive">
	<?php endif; ?>
	<table class="<?php echo esc_attr($table_class_str); ?>">
		<?php if (!empty($header_cells) || !empty($rows_data)) : ?>
			<thead>
				<tr>
					<?php
					if ($source_mode === 'csv' && !empty($header_cells)) {
						foreach ($header_cells as $cell) {
							$val = is_array($cell) ? ($cell['content'] ?? $cell) : $cell;
							echo '<th scope="col">' . esc_html($val) . '</th>';
						}
					} elseif ($source_mode === 'manual' && !empty($header_cells)) {
						foreach ($header_cells as $cell) {
							$colspan = $cell['colspan'] ?? 1;
							$content = $cell['content'] ?? '';
							$col_attr = $colspan > 1 ? ' colSpan="' . (int) $colspan . '"' : '';
							echo '<th scope="col"' . $col_attr . '>' . wp_kses_post($content) . '</th>';
						}
					}
					?>
				</tr>
			</thead>
			<tbody>
				<?php
				if ($source_mode === 'csv' && !empty($rows_data)) {
					foreach ($rows_data as $row) {
						echo '<tr>';
						foreach ($row as $cell) {
							$val = is_array($cell) ? ($cell['content'] ?? reset($cell)) : $cell;
							echo '<td>' . esc_html($val) . '</td>';
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
							echo '<' . $tag . $scope . $row_attr . $col_attr . '>' . wp_kses_post($content) . '</' . $tag . '>';
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
