<?php
/**
 * Form Block - Server-side render
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

// Получаем атрибуты
$form_id = isset($attributes['formId']) ? $attributes['formId'] : '';

// Если formId - это ID поста CPT, используем его
if (!empty($form_id) && is_numeric($form_id)) {
    $form_post = get_post($form_id);
    if ($form_post && $form_post->post_type === 'codeweber_form') {
        // Используем модуль темы для рендеринга
        if (class_exists('CodeweberFormsCore')) {
            $core = new CodeweberFormsCore();
            echo $core->render_form($form_post->ID, $form_post);
            return;
        }
    }
}

// Иначе рендерим inline форму из innerBlocks
if (class_exists('CodeweberFormsRenderer')) {
    // Парсим innerBlocks для получения полей
    $fields = [];

    // Получаем innerBlocks из parsed_block (переданного через extract)
    $inner_blocks = [];

    // Способ 1: Из атрибутов блока (основной способ для блоков с save: null)
    if (!empty($attributes['formFields']) && is_array($attributes['formFields'])) {
        // Поля сохранены в атрибутах блока
        $fields = $attributes['formFields'];
    }
    // Способ 2: Из parsed_block
    elseif (isset($parsed_block) && !empty($parsed_block['innerBlocks'])) {
        $inner_blocks = $parsed_block['innerBlocks'];
    }
    // Способ 3: Через WP_Block объект
    elseif (is_object($block) && property_exists($block, 'inner_blocks')) {
        // $block->inner_blocks это WP_Block_List, нужно преобразовать в массив
        $block_inner_blocks = $block->inner_blocks;

        if (!empty($block_inner_blocks)) {
            // Преобразуем WP_Block_List в массив parsed_block структур
            foreach ($block_inner_blocks as $inner_block_obj) {
                if (is_object($inner_block_obj) && property_exists($inner_block_obj, 'parsed_block')) {
                    $inner_blocks[] = $inner_block_obj->parsed_block;
                }
            }
        }
    }

    // Способ 3: Парсим из сохраненного контента поста (если innerBlocks пусты)
    // Это критично, так как при save: null innerBlocks не сохраняются в HTML
    if (empty($inner_blocks)) {
        global $post;
        if ($post && !empty($post->post_content)) {
            // Парсим все блоки из контента поста
            $all_blocks = parse_blocks($post->post_content);

            // Рекурсивная функция для поиска блока формы и его innerBlocks
            $find_form_block = function($blocks) use (&$find_form_block) {
                foreach ($blocks as $block_item) {
                    // Если это блок формы, возвращаем его innerBlocks
                    if (isset($block_item['blockName']) && $block_item['blockName'] === 'codeweber-blocks/form') {
                        return $block_item['innerBlocks'] ?? [];
                    }
                    // Рекурсивно ищем во вложенных блоках
                    if (!empty($block_item['innerBlocks'])) {
                        $found = $find_form_block($block_item['innerBlocks']);
                        if (!empty($found)) {
                            return $found;
                        }
                    }
                }
                return [];
            };

            $inner_blocks = $find_form_block($all_blocks);
        }
    }

    // Извлекаем поля и кнопки из innerBlocks (если еще не получены из атрибутов)
    $submit_buttons = [];
    if (empty($fields) && !empty($inner_blocks)) {
        foreach ($inner_blocks as $inner_block) {
            // inner_block может быть массивом или объектом WP_Block
            if (is_array($inner_block)) {
                if (isset($inner_block['blockName']) && $inner_block['blockName'] === 'codeweber-blocks/form-field') {
                    $field_attrs = $inner_block['attrs'] ?? [];
                    if (!empty($field_attrs)) {
                        $fields[] = $field_attrs;
                    }
                } elseif (isset($inner_block['blockName']) && $inner_block['blockName'] === 'codeweber-blocks/submit-button') {
                    $button_attrs = $inner_block['attrs'] ?? [];
                    if (!empty($button_attrs)) {
                        $submit_buttons[] = $button_attrs;
                    }
                }
                // Рекурсивно обрабатываем вложенные блоки
                if (!empty($inner_block['innerBlocks'])) {
                    foreach ($inner_block['innerBlocks'] as $nested_block) {
                        if (isset($nested_block['blockName']) && $nested_block['blockName'] === 'codeweber-blocks/form-field') {
                            $field_attrs = $nested_block['attrs'] ?? [];
                            if (!empty($field_attrs)) {
                                $fields[] = $field_attrs;
                            }
                        } elseif (isset($nested_block['blockName']) && $nested_block['blockName'] === 'codeweber-blocks/submit-button') {
                            $button_attrs = $nested_block['attrs'] ?? [];
                            if (!empty($button_attrs)) {
                                $submit_buttons[] = $button_attrs;
                            }
                        }
                    }
                }
            } elseif (is_object($inner_block)) {
                if (method_exists($inner_block, 'get_name')) {
                    $block_name = $inner_block->get_name();
                    if ($block_name === 'codeweber-blocks/form-field') {
                        $fields[] = $inner_block->get_attributes();
                    } elseif ($block_name === 'codeweber-blocks/submit-button') {
                        $submit_buttons[] = $inner_block->get_attributes();
                    }
                } elseif (property_exists($inner_block, 'name')) {
                    if ($inner_block->name === 'codeweber-blocks/form-field') {
                        $fields[] = $inner_block->attributes ?? [];
                    } elseif ($inner_block->name === 'codeweber-blocks/submit-button') {
                        $submit_buttons[] = $inner_block->attributes ?? [];
                    }
                }
            }
        }
    }

    // Если поля не найдены, пытаемся получить через $block->inner_blocks
    if (empty($fields) && is_object($block)) {
        // Используем внутренний метод WP_Block для получения innerBlocks
        $reflection = new ReflectionClass($block);
        if ($reflection->hasProperty('inner_blocks')) {
            $property = $reflection->getProperty('inner_blocks');
            $property->setAccessible(true);
            $block_inner_blocks = $property->getValue($block);

            if (!empty($block_inner_blocks)) {
                foreach ($block_inner_blocks as $inner_block_obj) {
                    if (is_object($inner_block_obj)) {
                        $block_name = method_exists($inner_block_obj, 'get_name')
                            ? $inner_block_obj->get_name()
                            : (property_exists($inner_block_obj, 'name') ? $inner_block_obj->name : '');

                        if ($block_name === 'codeweber-blocks/form-field') {
                            $attrs = method_exists($inner_block_obj, 'get_attributes')
                                ? $inner_block_obj->get_attributes()
                                : (property_exists($inner_block_obj, 'attributes') ? $inner_block_obj->attributes : []);
                            if (!empty($attrs)) {
                                $fields[] = $attrs;
                            }
                        }
                    }
                }
            }
        }
    }

    // Отладка (если включен WP_DEBUG)
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[Form Render] Fields count: ' . count($fields));
        error_log('[Form Render] Inner blocks count: ' . count($inner_blocks));
        error_log('[Form Render] Parsed block keys: ' . (isset($parsed_block) ? implode(', ', array_keys($parsed_block)) : 'not set'));
        if (isset($parsed_block['innerBlocks'])) {
            error_log('[Form Render] Inner blocks structure: ' . print_r($parsed_block['innerBlocks'], true));
        }
        if (is_object($block)) {
            error_log('[Form Render] Block class: ' . get_class($block));
            error_log('[Form Render] Block methods: ' . implode(', ', get_class_methods($block)));
        }
        error_log('[Form Render] Fields: ' . print_r($fields, true));
    }

    // Временная отладка в HTML (удалить после исправления)
    if (empty($fields) && current_user_can('manage_options')) {
        $debug_info = '<!-- Form Debug: Fields=' . count($fields) . ', InnerBlocks=' . count($inner_blocks) . ', HasParsedBlock=' . (isset($parsed_block) ? 'yes' : 'no') . ' -->';
        echo $debug_info;
    }

    // НОВОЕ: Извлекаем тип формы из атрибутов блока
    $form_type = isset($attributes['formType']) ? $attributes['formType'] : null;

    $form_config = [
        'fields' => $fields,
        'settings' => $attributes,
        'submit_buttons' => $submit_buttons,
    ];

    // НОВОЕ: Добавляем тип формы в конфигурацию
    if ($form_type) {
        $form_config['type'] = $form_type;
    }

    // Проверяем, есть ли file поле с FilePond
    $has_filepond = false;
    foreach ($fields as $field) {
        // FilePond всегда используется для полей типа file
        if (($field['fieldType'] ?? '') === 'file') {
            $has_filepond = true;
            // #region agent log
            $log_dir = dirname(WP_CONTENT_DIR) . '/.cursor';
            $log_path = $log_dir . '/debug.log';
            if (!is_dir($log_dir)) {
                @mkdir($log_dir, 0755, true);
            }
            @file_put_contents($log_path, json_encode(['sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'A','location'=>'form/render.php:215','message'=>'FilePond field detected in inline form','data'=>['fieldType'=>$field['fieldType']??'','useFilePond'=>$field['useFilePond']??false,'maxFiles'=>$field['maxFiles']??0,'maxFileSize'=>$field['maxFileSize']??'','maxTotalFileSize'=>$field['maxTotalFileSize']??''],'timestamp'=>time()*1000])."\n", FILE_APPEND);
            // #endregion
            break;
        }
    }

    // Enqueue FilePond if needed
    if ($has_filepond) {
        // #region agent log
        $log_dir = dirname(WP_CONTENT_DIR) . '/.cursor';
        $log_path = $log_dir . '/debug.log';
        if (!is_dir($log_dir)) {
            @mkdir($log_dir, 0755, true);
        }
        @file_put_contents($log_path, json_encode(['sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'A','location'=>'form/render.php:225','message'=>'Attempting to enqueue FilePond for inline form','data'=>['has_filepond'=>$has_filepond,'class_exists'=>class_exists('\Codeweber\Blocks\Plugin')],'timestamp'=>time()*1000])."\n", FILE_APPEND);
        // #endregion
        if (class_exists('\Codeweber\Blocks\Plugin')) {
            \Codeweber\Blocks\Plugin::enqueue_filepond();
            // #region agent log
            $log_dir = dirname(WP_CONTENT_DIR) . '/.cursor';
            $log_path = $log_dir . '/debug.log';
            if (!is_dir($log_dir)) {
                @mkdir($log_dir, 0755, true);
            }
            @file_put_contents($log_path, json_encode(['sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'A','location'=>'form/render.php:230','message'=>'FilePond enqueued for inline form','data'=>['script_enqueued'=>wp_script_is('filepond','enqueued'),'style_enqueued'=>wp_style_is('filepond','enqueued')],'timestamp'=>time()*1000])."\n", FILE_APPEND);
            // #endregion
        }
    }

    $renderer = new CodeweberFormsRenderer();
    echo $renderer->render($form_id ?: uniqid('form_'), $form_config);
} else {
    echo '<p>' . __('Forms module is not active.', 'codeweber-gutenberg-blocks') . '</p>';
}

