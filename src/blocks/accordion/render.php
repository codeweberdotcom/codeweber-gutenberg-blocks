<?php
/**
 * Accordion Block - Server-side render
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

// Отладка: логируем полученные атрибуты
if (defined('WP_DEBUG') && WP_DEBUG) {
	error_log('[Accordion Render] Attributes received: ' . print_r($attributes, true));
}

// Получаем атрибуты
$mode = isset($attributes['mode']) ? $attributes['mode'] : 'custom';
$accordionStyle = isset($attributes['accordionStyle']) ? $attributes['accordionStyle'] : 'simple';
$allowMultiple = isset($attributes['allowMultiple']) ? (bool) $attributes['allowMultiple'] : false;
$accordionId = isset($attributes['accordionId']) ? $attributes['accordionId'] : '';
$iconPosition = isset($attributes['iconPosition']) ? $attributes['iconPosition'] : 'left';
$iconType = isset($attributes['iconType']) ? $attributes['iconType'] : 'type-1';
$firstItemOpen = isset($attributes['firstItemOpen']) ? (bool) $attributes['firstItemOpen'] : false;
$postType = isset($attributes['postType']) ? $attributes['postType'] : '';
$selectedTaxonomies = isset($attributes['selectedTaxonomies']) ? $attributes['selectedTaxonomies'] : [];
$items = isset($attributes['items']) ? $attributes['items'] : [];

// Отладка: логируем извлеченные значения
if (defined('WP_DEBUG') && WP_DEBUG) {
	error_log('[Accordion Render] Mode: ' . $mode . ', PostType: ' . $postType . ', Items count: ' . count($items));
}

// Если режим "Custom", возвращаем null - будет использоваться сохраненный HTML из save.js
// Но так как render указан в block.json, WordPress всегда будет вызывать этот файл
// Поэтому для режима Custom мы все равно должны рендерить, используя сохраненные items

// Генерируем уникальный ID для аккордеона, если не установлен
if (empty($accordionId)) {
	$accordionId = 'accordion-' . substr(md5(json_encode($attributes) . get_the_ID()), 0, 8);
}

// Получаем скругление для аккордеона из Redux (только rounded-0, если выбрано)
$accordionCardRadius = '';
if (function_exists('getThemeAccordionCardRadius')) {
	$accordionCardRadius = getThemeAccordionCardRadius();
}

// Формируем классы для аккордеона
$accordionClasses = ['accordion', 'accordion-wrapper'];
if ($iconPosition === 'right') {
	$accordionClasses[] = 'icon-right';
}
if ($iconType === 'type-2') {
	$accordionClasses[] = 'type-2';
} elseif ($iconType === 'type-3') {
	$accordionClasses[] = 'type-3';
} else {
	$accordionClasses[] = 'type-1';
}

// Подготавливаем данные для рендеринга
$itemsToRender = [];

if ($mode === 'post' && !empty($postType)) {
	// Режим "Post" - загружаем посты через WP_Query
	if (defined('WP_DEBUG') && WP_DEBUG) {
		error_log('[Accordion Render] Post mode detected, postType: ' . $postType);
	}
	
	$queryArgs = array(
		'post_type' => $postType,
		'posts_per_page' => 10,
		'post_status' => 'publish',
		'orderby' => 'date',
		'order' => 'DESC',
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
		
		if (count($taxQuery) > 1) { // Если есть хотя бы одна таксономия с терминами
			$queryArgs['tax_query'] = $taxQuery;
		}
	}

	// Выполняем запрос
	$query = new WP_Query($queryArgs);
	
	if (defined('WP_DEBUG') && WP_DEBUG) {
		error_log('[Accordion Render] WP_Query executed, found posts: ' . $query->found_posts);
		error_log('[Accordion Render] Query args: ' . print_r($queryArgs, true));
	}
	
	if ($query->have_posts()) {
		$index = 0;
		while ($query->have_posts()) {
			$query->the_post();
			$postId = get_the_ID();
			
			// Получаем контент поста
			$postTitle = get_the_title();
			$postContent = '';
			
			// Пытаемся получить excerpt
			if (has_excerpt()) {
				$postContent = get_the_excerpt();
			} else {
				// Берем первые 200 символов из content
				$content = get_the_content();
				$content = strip_tags($content);
				$content = str_replace('&nbsp;', ' ', $content);
				$content = trim($content);
				$postContent = mb_substr($content, 0, 200);
				if (mb_strlen($content) > 200) {
					$postContent .= '...';
				}
			}
			
			// Если контент пустой, используем заглушку
			if (empty($postContent)) {
				$postContent = __('No content available', 'codeweber-gutenberg-blocks');
			}
			
			$itemsToRender[] = array(
				'id' => 'item-' . $postId . '-' . $index,
				'title' => $postTitle,
				'content' => $postContent,
				'icon' => '',
				'isOpen' => $firstItemOpen && $index === 0,
			);
			
			$index++;
		}
		wp_reset_postdata();
	} else {
		if (defined('WP_DEBUG') && WP_DEBUG) {
			error_log('[Accordion Render] No posts found for post_type: ' . $postType);
		}
	}
} else {
	// Режим "Custom" - используем сохраненные items
	if (defined('WP_DEBUG') && WP_DEBUG) {
		error_log('[Accordion Render] Custom mode detected, items count: ' . count($items));
	}
	
	if (!empty($items) && is_array($items)) {
		$itemsToRender = $items;
	} else {
		// Если items пустые, используем пустой массив (ничего не отображаем)
		$itemsToRender = [];
		if (defined('WP_DEBUG') && WP_DEBUG) {
			error_log('[Accordion Render] Custom mode: items array is empty');
		}
	}
}

// Отладка: логируем финальное количество items для рендеринга
if (defined('WP_DEBUG') && WP_DEBUG) {
	error_log('[Accordion Render] Final itemsToRender count: ' . count($itemsToRender));
}

// Получаем wrapper атрибуты
// Формируем атрибуты вручную, чтобы избежать проблем с контекстом блока в get_block_wrapper_attributes()
$wrapperAttributes = 'class="' . esc_attr(implode(' ', $accordionClasses)) . '" id="' . esc_attr($accordionId) . '"';
?>

<div <?php echo $wrapperAttributes; ?>>
	<?php if (!empty($itemsToRender)) : ?>
		<?php foreach ($itemsToRender as $index => $item) : ?>
			<?php
			$itemId = isset($item['id']) ? $item['id'] : 'item-' . $index;
			$headingId = 'heading-' . $itemId;
			$collapseId = 'collapse-' . $itemId;
			
			// Определяем, открыт ли элемент
			$isOpen = isset($item['isOpen']) ? (bool) $item['isOpen'] : false;
			
			// Классы для элемента
			$itemClasses = ['card', 'accordion-item'];
			if ($accordionStyle === 'simple') {
				$itemClasses[] = 'plain';
			} elseif ($accordionStyle === 'icon') {
				$itemClasses[] = 'icon';
			}
			// Применяем скругление из Redux (только rounded-0, если выбрано)
			if (!empty($accordionCardRadius)) {
				$itemClasses[] = $accordionCardRadius;
			}
			
			// Классы для кнопки
			$buttonClasses = ['accordion-button'];
			if (!$isOpen) {
				$buttonClasses[] = 'collapsed';
			}
			
			// Классы для collapse
			$collapseClasses = ['accordion-collapse', 'collapse'];
			if ($isOpen) {
				$collapseClasses[] = 'show';
			}
			
			// Получаем данные элемента
			$itemTitle = isset($item['title']) ? $item['title'] : '';
			$itemContent = isset($item['content']) ? $item['content'] : '';
			$itemIcon = isset($item['icon']) ? $item['icon'] : '';
			
			// Атрибуты для collapse
			$collapseAttrs = array(
				'id' => esc_attr($collapseId),
				'class' => implode(' ', $collapseClasses),
				'aria-labelledby' => esc_attr($headingId),
			);
			
			if (!$allowMultiple) {
				$collapseAttrs['data-bs-parent'] = '#' . esc_attr($accordionId);
			}
			
			// Формируем строку атрибутов для collapse
			$collapseAttrsString = '';
			foreach ($collapseAttrs as $key => $value) {
				$collapseAttrsString .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
			}
			?>
			<div class="<?php echo esc_attr(implode(' ', $itemClasses)); ?>">
				<div class="card-header" id="<?php echo esc_attr($headingId); ?>">
					<button
						class="<?php echo esc_attr(implode(' ', $buttonClasses)); ?>"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#<?php echo esc_attr($collapseId); ?>"
						aria-expanded="<?php echo $isOpen ? 'true' : 'false'; ?>"
						aria-controls="<?php echo esc_attr($collapseId); ?>"
					>
						<?php if ($accordionStyle === 'icon' && !empty($itemIcon)) : ?>
							<span class="icon"><i class="<?php echo esc_attr($itemIcon); ?>"></i></span>
						<?php endif; ?>
						<?php echo esc_html($itemTitle); ?>
					</button>
				</div>
				<div<?php echo $collapseAttrsString; ?>>
					<div class="card-body">
						<p><?php echo wp_kses_post($itemContent); ?></p>
					</div>
				</div>
			</div>
		<?php endforeach; ?>
	<?php else : ?>
		<?php if ($mode === 'post') : ?>
			<p><?php esc_html_e('No posts found.', 'codeweber-gutenberg-blocks'); ?></p>
		<?php elseif ($mode === 'custom') : ?>
			<!-- Accordion items will be loaded from saved attributes -->
		<?php endif; ?>
	<?php endif; ?>
</div>




