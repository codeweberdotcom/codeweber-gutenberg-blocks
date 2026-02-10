<?php
/**
 * Tabulator Block - Server-side render
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

$document_id = isset($attributes['documentId']) ? (int) $attributes['documentId'] : 0;
$height = isset($attributes['height']) ? esc_attr($attributes['height']) : '400px';
$layout = isset($attributes['layout']) ? $attributes['layout'] : 'fitColumns';
$theme = isset($attributes['theme']) ? $attributes['theme'] : 'midnight';
$sortable = isset($attributes['sortable']) ? (bool) $attributes['sortable'] : true;
$resizable_columns = isset($attributes['resizableColumns']) ? (bool) $attributes['resizableColumns'] : true;
$movable_columns = isset($attributes['movableColumns']) ? (bool) $attributes['movableColumns'] : true;
$header_filter = isset($attributes['headerFilter']) ? (bool) $attributes['headerFilter'] : true;
$column_min_width = isset($attributes['columnMinWidth']) ? (int) $attributes['columnMinWidth'] : 80;
$column_max_width = isset($attributes['columnMaxWidth']) ? (int) $attributes['columnMaxWidth'] : 400;
$export_enabled = isset($attributes['exportEnabled']) ? (bool) $attributes['exportEnabled'] : true;

$theme_css_map = [
	'midnight' => 'tabulator_midnight.min.css',
	'modern'   => 'tabulator_modern.min.css',
	'default'  => 'tabulator.min.css',
];
$theme_file = $theme_css_map[ $theme ] ?? $theme_css_map['midnight'];

$block_id = 'cw-tabulator-' . uniqid();
$wrapper_class = 'wp-block-codeweber-blocks-tabulator';

if (!defined('GUTENBERG_BLOCKS_URL')) {
	return '<div class="' . esc_attr($wrapper_class) . '"><p>' . esc_html__('Plugin error.', 'codeweber-gutenberg-blocks') . '</p></div>';
}

if ($document_id <= 0 || !post_type_exists('documents')) {
	return '<div class="' . esc_attr($wrapper_class) . '"><p>' . esc_html__('Select a document in block settings.', 'codeweber-gutenberg-blocks') . '</p></div>';
}

$tabulator_base = GUTENBERG_BLOCKS_URL . 'assets/vendor/tabulator/';
$api_root = esc_url(rest_url('codeweber-gutenberg-blocks/v1'));
$nonce = wp_create_nonce('wp_rest');

wp_enqueue_style(
	'tabulator-' . $theme,
	$tabulator_base . $theme_file,
	[],
	'6.3.0'
);
wp_enqueue_script(
	'tabulator',
	$tabulator_base . 'tabulator.min.js',
	[],
	'6.3.0',
	true
);

$opts = [
	'documentId'      => $document_id,
	'height'          => $height,
	'layout'          => $layout,
	'exportEnabled'   => $export_enabled,
	'sortable'        => $sortable,
	'resizableColumns'=> $resizable_columns,
	'movableColumns'  => $movable_columns,
	'headerFilter'    => $header_filter,
	'columnMinWidth'  => $column_min_width,
	'columnMaxWidth'  => $column_max_width,
	'apiRoot'         => $api_root,
	'nonce'           => $nonce,
	'blockId'         => $block_id,
];
$opts_json = wp_json_encode($opts);

$init_script = sprintf(
	"(function(){var opts=%s;var c=document.getElementById(opts.blockId);if(!c||typeof Tabulator==='undefined')return;var L=c.querySelector('.cw-tabulator-loading');fetch(opts.apiRoot+'/documents/'+opts.documentId+'/csv',{headers:{'X-WP-Nonce':opts.nonce}}).then(function(r){return r.json();}).then(function(data){if(L)L.remove();if(!data.rows||data.rows.length===0){c.innerHTML='<p>%s</p>';return;}var h=data.rows[0],rows=data.rows.slice(1),minW=opts.columnMinWidth||80,maxW=opts.columnMaxWidth||0,cols=h.map(function(x,i){var col={title:String(x||'Col'+(i+1)),field:'col'+i,minWidth:minW,resizable:opts.resizableColumns!==false,headerSort:opts.sortable!==false,formatter:'html'};if(maxW>0)col.maxWidth=maxW;if(opts.headerFilter){col.headerFilter='input';col.headerFilterPlaceholder='%s';}return col;}),tData=rows.map(function(row){var o={};row.forEach(function(cell,i){o['col'+i]=cell;});return o;});var table=new Tabulator(c,{data:tData,columns:cols,layout:opts.layout||'fitColumns',height:opts.height||'400px',resizableColumnFit:true,movableColumns:opts.movableColumns!==false});if(opts.exportEnabled){var bar=c.parentElement&&c.parentElement.querySelector('.cw-tabulator-export');if(bar){bar.style.display='flex';var csvBtn=bar.querySelector('[data-export=csv]');var jsonBtn=bar.querySelector('[data-export=json]');if(csvBtn)csvBtn.onclick=function(){table.download('csv','data.csv');};if(jsonBtn)jsonBtn.onclick=function(){table.download('json','data.json');};}}}).catch(function(){if(L)L.remove();c.innerHTML='<p class=\"cw-tabulator-error\">%s</p>';});})();",
	$opts_json,
	esc_js(__('No data', 'codeweber-gutenberg-blocks')),
	esc_js(__('Search…', 'codeweber-gutenberg-blocks')),
	esc_js(__('Error loading data', 'codeweber-gutenberg-blocks'))
);
wp_add_inline_script('tabulator', $init_script, 'after');
$export_label_csv = esc_attr__('Export CSV', 'codeweber-gutenberg-blocks');
$export_label_json = esc_attr__('Export JSON', 'codeweber-gutenberg-blocks');
?>
<div class="<?php echo esc_attr($wrapper_class); ?>">
	<?php if ($export_enabled) : ?>
	<div class="cw-tabulator-export" style="display:none">
		<button type="button" class="btn has-ripple btn-primary btn-xs" data-export="csv" title="<?php echo $export_label_csv; ?>">CSV</button>
		<button type="button" class="btn has-ripple btn-primary btn-xs" data-export="json" title="<?php echo $export_label_json; ?>">JSON</button>
	</div>
	<?php endif; ?>
	<div id="<?php echo esc_attr($block_id); ?>">
		<div class="cw-tabulator-loading"><?php esc_html_e('Loading…', 'codeweber-gutenberg-blocks'); ?></div>
	</div>
</div>
