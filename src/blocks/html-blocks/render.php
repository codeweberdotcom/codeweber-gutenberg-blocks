<?php
/**
 * Html Blocks Block - Server-side render
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

// Получаем атрибуты из разных источников
if (!isset($attributes) && isset($parsed_block['attrs'])) {
    $attributes = $parsed_block['attrs'];
}
if (!isset($attributes) && is_object($block)) {
    if (method_exists($block, 'get_attributes')) {
        $attributes = $block->get_attributes();
    } elseif (property_exists($block, 'attributes')) {
        $attributes = $block->attributes;
    }
}
if (!isset($attributes)) {
    $attributes = [];
}

$selected_block_id = isset($attributes['selectedBlockId']) ? intval($attributes['selectedBlockId']) : 0;
$block_class = isset($attributes['blockClass']) ? esc_attr($attributes['blockClass']) : '';
$block_id = isset($attributes['blockId']) ? esc_attr($attributes['blockId']) : '';
$block_data = isset($attributes['blockData']) ? esc_attr($attributes['blockData']) : '';

// Если блок не выбран, ничего не выводим
if (!$selected_block_id || $selected_block_id === 0) {
    return;
}

// Получаем пост из CPT html_blocks
$html_block_post = get_post($selected_block_id);

// Проверяем, что пост существует и это правильный тип
if (!$html_block_post || $html_block_post->post_type !== 'html_blocks' || $html_block_post->post_status !== 'publish') {
    return;
}

// Получаем контент поста
$content = apply_filters('the_content', $html_block_post->post_content);

// Формируем классы
$classes = ['codeweber-html-blocks'];
if ($block_class) {
    $classes[] = $block_class;
}

// Формируем data атрибуты
$data_attrs = '';
if ($block_data) {
    $data_parts = explode(',', $block_data);
    foreach ($data_parts as $part) {
        $part = trim($part);
        if (strpos($part, '=') !== false) {
            list($key, $value) = explode('=', $part, 2);
            $key = trim($key);
            $value = trim($value);
            if ($key && $value) {
                $data_attrs .= ' data-' . esc_attr($key) . '="' . esc_attr($value) . '"';
            }
        }
    }
}

// Выводим блок
?>
<div 
    class="<?php echo esc_attr(implode(' ', $classes)); ?>"
    <?php echo $block_id ? 'id="' . esc_attr($block_id) . '"' : ''; ?>
    <?php echo $data_attrs; ?>
>
    <div class="html-blocks-content">
        <?php echo $content; ?>
    </div>
</div>

