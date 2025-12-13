<?php
/**
 * Lists Block - Server-side render
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

// Убеждаемся, что текстовый домен загружен для переводов
$plugin_path = dirname(dirname(dirname(dirname(__FILE__))));
load_plugin_textdomain('codeweber-gutenberg-blocks', false, basename($plugin_path) . '/languages/');

// Получаем атрибуты
$mode = isset($attributes['mode']) ? $attributes['mode'] : 'custom';
$listType = isset($attributes['listType']) ? $attributes['listType'] : 'unordered';
$bulletColor = isset($attributes['bulletColor']) ? $attributes['bulletColor'] : 'primary';
$bulletBg = isset($attributes['bulletBg']) ? (bool) $attributes['bulletBg'] : false;
$iconClass = isset($attributes['iconClass']) ? $attributes['iconClass'] : 'uil uil-arrow-right';
$textColor = isset($attributes['textColor']) ? $attributes['textColor'] : '';
$postType = isset($attributes['postType']) ? $attributes['postType'] : '';
$selectedTaxonomies = isset($attributes['selectedTaxonomies']) ? $attributes['selectedTaxonomies'] : [];
$enableLinks = isset($attributes['enableLinks']) ? (bool) $attributes['enableLinks'] : false;
$postsPerPage = isset($attributes['postsPerPage']) ? intval($attributes['postsPerPage']) : 10;
$orderBy = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date';
$order = isset($attributes['order']) ? $attributes['order'] : 'desc';
$listClass = isset($attributes['listClass']) ? $attributes['listClass'] : '';
$listId = isset($attributes['listId']) ? $attributes['listId'] : '';
$listData = isset($attributes['listData']) ? $attributes['listData'] : '';
$items = isset($attributes['items']) ? $attributes['items'] : [];

// Grid attributes
$gridRowCols = isset($attributes['gridRowCols']) ? $attributes['gridRowCols'] : '';
$gridRowColsSm = isset($attributes['gridRowColsSm']) ? $attributes['gridRowColsSm'] : '';
$gridRowColsMd = isset($attributes['gridRowColsMd']) ? $attributes['gridRowColsMd'] : '';
$gridRowColsLg = isset($attributes['gridRowColsLg']) ? $attributes['gridRowColsLg'] : '';
$gridRowColsXl = isset($attributes['gridRowColsXl']) ? $attributes['gridRowColsXl'] : '';
$gridRowColsXxl = isset($attributes['gridRowColsXxl']) ? $attributes['gridRowColsXxl'] : '';

// Gap attributes
$gridGapType = isset($attributes['gridGapType']) ? $attributes['gridGapType'] : 'general';
$gridGap = isset($attributes['gridGap']) ? $attributes['gridGap'] : '';
$gridGapXs = isset($attributes['gridGapXs']) ? $attributes['gridGapXs'] : '';
$gridGapSm = isset($attributes['gridGapSm']) ? $attributes['gridGapSm'] : '';
$gridGapMd = isset($attributes['gridGapMd']) ? $attributes['gridGapMd'] : '';
$gridGapLg = isset($attributes['gridGapLg']) ? $attributes['gridGapLg'] : '';
$gridGapXl = isset($attributes['gridGapXl']) ? $attributes['gridGapXl'] : '';
$gridGapXxl = isset($attributes['gridGapXxl']) ? $attributes['gridGapXxl'] : '';
$gridGapX = isset($attributes['gridGapX']) ? $attributes['gridGapX'] : '';
$gridGapY = isset($attributes['gridGapY']) ? $attributes['gridGapY'] : '';

// Подготавливаем данные для рендеринга
$itemsToRender = [];

if ($mode === 'post' && !empty($postType)) {
	// Режим "Post" - загружаем посты через WP_Query
	$queryArgs = array(
		'post_type' => $postType,
		'posts_per_page' => $postsPerPage,
		'post_status' => 'publish',
		'orderby' => $orderBy,
		'order' => strtoupper($order),
	);

	// Добавляем фильтрацию по таксономиям, если выбраны термины
	if (!empty($selectedTaxonomies) && is_array($selectedTaxonomies)) {
		$taxQuery = array('relation' => 'AND');
		
		foreach ($selectedTaxonomies as $taxonomySlug => $termIds) {
			if (!empty($termIds) && is_array($termIds)) {
				$taxQuery[] = array(
					'taxonomy' => $taxonomySlug,
					'field' => 'term_id',
					'terms' => array_map('intval', $termIds),
					'operator' => 'IN',
				);
			}
		}
		
		if (count($taxQuery) > 1) {
			$queryArgs['tax_query'] = $taxQuery;
		}
	}

	$query = new WP_Query($queryArgs);
	
	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$postId = get_the_ID();
			$postTitle = get_the_title();
			$postUrl = get_permalink();
			
			$itemsToRender[] = array(
				'id' => 'post-' . $postId,
				'text' => $postTitle,
				'url' => $postUrl,
			);
		}
		wp_reset_postdata();
	}
} else {
	// Режим "Custom" - используем сохраненные items
	$itemsToRender = $items;
}

// Формируем классы для списка
$listClasses = [];
if ($listType === 'unordered') {
	$listClasses[] = 'unordered-list';
} elseif ($listType === 'icon') {
	$listClasses[] = 'icon-list';
}

// Bullet color
if ($bulletColor && $bulletColor !== 'none') {
	$listClasses[] = 'bullet-' . esc_attr($bulletColor);
}

// Bullet background (only for icon-list)
if ($listType === 'icon' && $bulletBg) {
	$listClasses[] = 'bullet-bg';
	if ($bulletColor && $bulletColor !== 'none') {
		$listClasses[] = 'bullet-soft-' . esc_attr($bulletColor);
	}
}

// Text color
if ($textColor) {
	$listClasses[] = 'text-' . esc_attr($textColor);
}

// Custom class
if ($listClass) {
	$listClasses[] = esc_attr($listClass);
}

// Parse data attributes
$dataAttrs = [];
if ($listData) {
	$pairs = explode(',', $listData);
	foreach ($pairs as $pair) {
		$parts = explode('=', trim($pair));
		if (count($parts) === 2) {
			$key = trim($parts[0]);
			$value = trim($parts[1]);
			if ($key && $value) {
				$dataAttrs['data-' . esc_attr($key)] = esc_attr($value);
			}
		}
	}
}

// Build data attributes string
$dataAttrsString = '';
foreach ($dataAttrs as $key => $value) {
	$dataAttrsString .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
}

// Wrapper attributes
$wrapperAttrs = [];
if ($listId) {
	$wrapperAttrs['id'] = esc_attr($listId);
}
$wrapperAttrsString = '';
foreach ($wrapperAttrs as $key => $value) {
	if ($value) {
		$wrapperAttrsString .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
	}
}

?>
<div<?php echo $wrapperAttrsString . $dataAttrsString; ?>>
	<?php if (empty($itemsToRender)) : ?>
		<p><?php esc_html_e('No items found.', 'codeweber-gutenberg-blocks'); ?></p>
	<?php else : ?>
		<ul class="<?php echo esc_attr(implode(' ', $listClasses)); ?>">
			<?php foreach ($itemsToRender as $item) : ?>
				<li>
					<?php if ($listType === 'icon') : ?>
						<span><i class="<?php echo esc_attr($iconClass); ?>"></i></span>
					<?php endif; ?>
					<span>
						<?php if ($enableLinks && !empty($item['url'])) : ?>
							<a href="<?php echo esc_url($item['url']); ?>"><?php echo esc_html($item['text']); ?></a>
						<?php else : ?>
							<?php echo esc_html($item['text']); ?>
						<?php endif; ?>
					</span>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</div>





