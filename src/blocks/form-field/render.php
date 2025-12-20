<?php
/**
 * Form Field Block Server-Side Render
 *
 * Handles server-side rendering for form fields, especially for consents_block type
 *
 * @package CodeWeber Gutenberg Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Ensure context is set (may be passed from pre_render hook)
if (!isset($context)) {
    $context = [];
}

// Extract attributes from block
$field_type = $attributes['fieldType'] ?? 'text';
$field_name = $attributes['fieldName'] ?? '';
$consents = $attributes['consents'] ?? [];
$field_label = $attributes['fieldLabel'] ?? '';
$placeholder = $attributes['placeholder'] ?? '';
$is_required = !empty($attributes['isRequired']);
$button_text = $attributes['buttonText'] ?? '';
$button_class = $attributes['buttonClass'] ?? 'btn btn-primary';
$field_class = isset($attributes['fieldClass']) ? trim($attributes['fieldClass']) : '';

// #region agent log
$log_file = dirname(WP_CONTENT_DIR) . '/.cursor/debug.log';
$log_dir = dirname($log_file);
if (!is_dir($log_dir)) {
    @mkdir($log_dir, 0755, true);
}
$log_entry = json_encode([
    'sessionId' => 'debug-session',
    'runId' => 'run1',
    'hypothesisId' => 'A',
    'location' => 'render.php:25',
    'message' => 'render.php called - attributes check',
    'data' => [
        'field_type' => $field_type,
        'field_name' => $field_name,
        'enableInlineButton_raw' => $attributes['enableInlineButton'] ?? 'NOT_SET',
        'enableInlineButton_type' => gettype($attributes['enableInlineButton'] ?? null),
        'all_attributes_keys' => array_keys($attributes)
    ],
    'timestamp' => time() * 1000
]) . "\n";
@file_put_contents($log_file, $log_entry, FILE_APPEND);
// #endregion

// Check for inline button BEFORE other checks
$enable_inline_button = isset($attributes['enableInlineButton']) && ($attributes['enableInlineButton'] === true || $attributes['enableInlineButton'] === 'true' || $attributes['enableInlineButton'] === 1);
$inline_button_supported_types = ['text', 'email', 'tel', 'url', 'number', 'date', 'time', 'author_role', 'company'];
$inline_button_enabled = $enable_inline_button && in_array($field_type, $inline_button_supported_types) && $field_type !== 'newsletter';

// #region agent log
$log_entry = json_encode([
    'sessionId' => 'debug-session',
    'runId' => 'run1',
    'hypothesisId' => 'B',
    'location' => 'render.php:29',
    'message' => 'inline button check result',
    'data' => [
        'enable_inline_button' => $enable_inline_button,
        'field_type' => $field_type,
        'is_supported_type' => in_array($field_type, $inline_button_supported_types),
        'inline_button_enabled' => $inline_button_enabled
    ],
    'timestamp' => time() * 1000
]) . "\n";
@file_put_contents($log_file, $log_entry, FILE_APPEND);
// #endregion

// For fields with inline button, render server-side FIRST (before other checks)
if ($inline_button_enabled) {
    // #region agent log
    $log_entry = json_encode([
        'sessionId' => 'debug-session',
        'runId' => 'run1',
        'hypothesisId' => 'C',
        'location' => 'render.php:32',
        'message' => 'INLINE BUTTON PATH TAKEN - rendering inline button',
        'data' => [
            'field_type' => $field_type,
            'field_name' => $field_name
        ],
        'timestamp' => time() * 1000
    ]) . "\n";
    @file_put_contents($log_file, $log_entry, FILE_APPEND);
    // #endregion
    // Get width classes
    $width_classes = 'col-12';
    if (!empty($attributes['fieldColumns'])) {
        $width_classes = 'col-' . esc_attr($attributes['fieldColumns']);
    } elseif (!empty($attributes['width'])) {
        $width_classes = esc_attr($attributes['width']);
    }

    // Get form radius class from theme
    $form_radius_class = '';
    if (function_exists('getThemeFormRadius')) {
        $form_radius_class = getThemeFormRadius();
    } else {
        $form_radius_class = 'rounded';
    }

    // Get button radius class from theme
    $button_radius_class = '';
    if (function_exists('getThemeButton')) {
        $button_radius_class = getThemeButton();
    }

    $field_id_inline = 'field-' . ($field_name ?: $field_type);
    $field_label_display = !empty($field_label) ? $field_label : '';
    $field_placeholder_display = !empty($placeholder) ? $placeholder : $field_label_display;
    $required_mark = $is_required ? ' <span class="text-danger">*</span>' : '';
    $label_content = $field_label_display . $required_mark;

    // Button text and class
    $inline_button_text = !empty($attributes['inlineButtonText']) ? $attributes['inlineButtonText'] : __('Send', 'codeweber-gutenberg-blocks');
    $inline_button_class = !empty($attributes['inlineButtonClass']) ? $attributes['inlineButtonClass'] : 'btn btn-primary';
    $button_class_final = trim($inline_button_class . ' ' . $button_radius_class);

    // Для inline button: если стиль кнопки rounded-pill, применяем его к input полю
    $input_radius_class = $form_radius_class;
    if (strpos($button_radius_class, 'rounded-pill') !== false) {
        $input_radius_class = ' rounded-pill';
    }

    // Mask props for tel field
    $mask_attrs = '';
    if ($field_type === 'tel' && !empty($attributes['phoneMask'])) {
        $mask_attrs = ' data-mask="' . esc_attr($attributes['phoneMask']) . '"';
        if (!empty($attributes['phoneMaskCaret'])) {
            $mask_attrs .= ' data-mask-caret="' . esc_attr(substr($attributes['phoneMaskCaret'], 0, 1)) . '"';
        }
        if (!empty($attributes['phoneMaskSoftCaret'])) {
            $mask_attrs .= ' data-mask-soft-caret="' . esc_attr(substr($attributes['phoneMaskSoftCaret'], 0, 1)) . '"';
        }
    }

    ob_start();
    ?>
    <div class="<?php echo esc_attr($width_classes); ?>">
        <div class="input-group form-floating">
            <input
                type="<?php echo esc_attr($field_type); ?>"
                class="form-control <?php echo esc_attr(trim($input_radius_class . ' ' . $field_class)); ?>"
                id="<?php echo esc_attr($field_id_inline); ?>"
                name="<?php echo esc_attr($field_name); ?>"
                placeholder="<?php echo esc_attr($field_placeholder_display); ?>"
                value="<?php echo esc_attr($attributes['defaultValue'] ?? ''); ?>"
                <?php echo $is_required ? 'required' : ''; ?>
                <?php echo !empty($attributes['maxLength']) ? 'maxlength="' . intval($attributes['maxLength']) . '"' : ''; ?>
                <?php echo !empty($attributes['minLength']) ? 'minlength="' . intval($attributes['minLength']) . '"' : ''; ?>
                <?php echo $mask_attrs; ?>
            >
            <label for="<?php echo esc_attr($field_id_inline); ?>">
                <?php echo wp_kses_post($label_content); ?>
            </label>
            <input
                type="submit"
                value="<?php echo esc_attr($inline_button_text); ?>"
                class="<?php echo esc_attr($button_class_final); ?>"
                data-loading-text="<?php echo esc_attr(__('Sending...', 'codeweber-gutenberg-blocks')); ?>"
            >
        </div>
    </div>
    <?php
    $output = ob_get_clean();
    // #region agent log
    $log_entry = json_encode([
        'sessionId' => 'debug-session',
        'runId' => 'run1',
        'hypothesisId' => 'D',
        'location' => 'render.php:113',
        'message' => 'INLINE BUTTON OUTPUT GENERATED',
        'data' => [
            'output_length' => strlen($output),
            'output_preview' => substr($output, 0, 200)
        ],
        'timestamp' => time() * 1000
    ]) . "\n";
    @file_put_contents($log_file, $log_entry, FILE_APPEND);
    // #endregion
    echo $output;
    return;
}

// #region agent log
$log_entry = json_encode([
    'sessionId' => 'debug-session',
    'runId' => 'run1',
    'hypothesisId' => 'E',
    'location' => 'render.php:116',
    'message' => 'INLINE BUTTON PATH NOT TAKEN - checking other conditions',
    'data' => [
        'field_type' => $field_type,
        'inline_button_enabled' => $inline_button_enabled
    ],
    'timestamp' => time() * 1000
]) . "\n";
@file_put_contents($log_file, $log_entry, FILE_APPEND);
// #endregion

// For newsletter type, we need to render it server-side with button
if ($field_type === 'newsletter') {
    // Get form ID from context or parent block
    $form_id = 0;
    if (isset($context['codeweber/formId'])) {
        $form_id = intval($context['codeweber/formId']);
    } elseif (isset($block->context['codeweber/formId'])) {
        $form_id = intval($block->context['codeweber/formId']);
    } else {
        // Try to get from current post
        global $post;
        if ($post && $post->post_type === 'codeweber_form') {
            $form_id = $post->ID;
        }
    }

    // Get width classes
    $width_classes = 'col-12';
    if (!empty($attributes['fieldColumns'])) {
        $width_classes = 'col-' . esc_attr($attributes['fieldColumns']);
    } elseif (!empty($attributes['width'])) {
        $width_classes = esc_attr($attributes['width']);
    }

    // Get form radius class from theme
    $form_radius_class = '';
    if (function_exists('getThemeFormRadius')) {
        $form_radius_class = getThemeFormRadius();
    } else {
        $form_radius_class = 'rounded';
    }

    // Get button radius class from theme
    $button_radius_class = '';
    if (function_exists('getThemeButton')) {
        $button_radius_class = getThemeButton();
    }

    // Field name defaults to 'email' for newsletter
    $field_name_value = !empty($field_name) ? $field_name : 'email';
    $field_id = 'field-' . $field_name_value;

    // Field label and placeholder
    $field_label_display = !empty($field_label) ? $field_label : __('Email Address', 'codeweber-gutenberg-blocks');
    $field_placeholder_display = !empty($placeholder) ? $placeholder : $field_label_display;

    // Button text
    $button_text_display = !empty($button_text) ? $button_text : __('Join', 'codeweber');
    $button_class_final = trim($button_class . ' ' . $button_radius_class);

    // Для newsletter типа: если стиль кнопки rounded-pill, применяем его к input полю
    $input_radius_class = $form_radius_class;
    if (strpos($button_radius_class, 'rounded-pill') !== false) {
        $input_radius_class = ' rounded-pill';
    }

    ob_start();
    ?>
    <div class="<?php echo esc_attr($width_classes); ?>">
        <div class="input-group form-floating">
            <input
                type="email"
                class="form-control required email <?php echo esc_attr(trim($input_radius_class . ' ' . $field_class)); ?>"
                id="<?php echo esc_attr($field_id); ?>"
                name="<?php echo esc_attr($field_name_value); ?>"
                placeholder="<?php echo esc_attr($field_placeholder_display); ?>"
                <?php echo $is_required ? 'required' : ''; ?>
                autocomplete="off"
            >
            <label for="<?php echo esc_attr($field_id); ?>">
                <?php echo esc_html($field_label_display); ?>
                <?php if ($is_required): ?>
                    <span class="text-danger">*</span>
                <?php endif; ?>
            </label>
            <input
                type="submit"
                value="<?php echo esc_attr($button_text_display); ?>"
                class="<?php echo esc_attr($button_class_final); ?>"
                data-loading-text="<?php echo esc_attr(__('Sending...', 'codeweber')); ?>"
            >
        </div>
    </div>
    <?php
    echo ob_get_clean();
    return;
}

// For rating type, we need to render it server-side
if ($field_type === 'rating' && function_exists('codeweber_testimonial_rating_stars')) {
    // Get form ID from context or parent block
    $form_id = 0;
    if (isset($context['codeweber/formId'])) {
        $form_id = intval($context['codeweber/formId']);
    } elseif (isset($block->context['codeweber/formId'])) {
        $form_id = intval($block->context['codeweber/formId']);
    } else {
        // Try to get from current post
        global $post;
        if ($post && $post->post_type === 'codeweber_form') {
            $form_id = $post->ID;
        }
    }

    // Get width classes
    $width_classes = 'col-12';
    if (!empty($attributes['fieldColumns'])) {
        $width_classes = 'col-' . esc_attr($attributes['fieldColumns']);
    } elseif (!empty($attributes['width'])) {
        $width_classes = esc_attr($attributes['width']);
    }

    $field_name_rating = !empty($field_name) ? $field_name : 'rating';
    $field_id_rating = 'field-' . $field_name_rating;
    $field_label_rating = !empty($field_label) ? $field_label : __('Rating', 'codeweber');
    $is_required_rating = !empty($attributes['isRequired']);

    ob_start();
    ?>
    <div class="<?php echo esc_attr($width_classes); ?>">
        <?php echo codeweber_testimonial_rating_stars(0, $field_name_rating, $field_id_rating, $is_required_rating); ?>
    </div>
    <?php
    echo ob_get_clean();
    return;
}

// For consents_block, we need to render it server-side
if ($field_type === 'consents_block' && !empty($consents) && function_exists('codeweber_forms_render_consent_checkbox')) {
    // Get form ID from context or parent block
    $form_id = 0;
    if (isset($context['codeweber/formId'])) {
        $form_id = intval($context['codeweber/formId']);
    } elseif (isset($block->context['codeweber/formId'])) {
        $form_id = intval($block->context['codeweber/formId']);
    } else {
        // Try to get from current post
        global $post;
        if ($post && $post->post_type === 'codeweber_form') {
            $form_id = $post->ID;
        }
    }

    // Get width classes
    $width_classes = 'col-12';
    if (!empty($attributes['fieldColumns'])) {
        $width_classes = 'col-' . esc_attr($attributes['fieldColumns']);
    } elseif (!empty($attributes['width'])) {
        $width_classes = esc_attr($attributes['width']);
    }

    // Определяем префикс для согласий на основе типа формы
    $consents_prefix = 'newsletter_consents'; // По умолчанию
    if ($form_id > 0) {
        // Пробуем получить тип формы через CodeweberFormsCore или через мета-данные
        if (function_exists('CodeweberFormsCore')) {
            $form_type_for_consents = CodeweberFormsCore::get_form_type($form_id, []);
            if ($form_type_for_consents === 'testimonial') {
                $consents_prefix = 'testimonial_consents';
            }
        } else {
            // Fallback: проверяем мета-данные напрямую
            $form_type_meta = get_post_meta($form_id, '_form_type', true);
            if ($form_type_meta === 'testimonial') {
                $consents_prefix = 'testimonial_consents';
            }
        }
    }

    ob_start();
    ?>
    <div class="<?php echo esc_attr($width_classes); ?>">
        <div class="form-consents-block mt-3">
            <?php
            foreach ($consents as $consent) {
                // Skip empty consents
                if (empty($consent['label']) || empty($consent['document_id'])) {
                    continue;
                }
                // Render consent checkbox with appropriate prefix
                echo codeweber_forms_render_consent_checkbox(
                    $consent,
                    $consents_prefix, // Используем правильный префикс в зависимости от типа формы
                    $form_id
                );
            }
            ?>
        </div>
    </div>
    <?php
    echo ob_get_clean();
    return;
}

// Render select with desired markup
if ($field_type === 'select') {
    // Get width classes
    $width_classes = 'col-12';
    if (!empty($attributes['fieldColumns'])) {
        $width_classes = 'col-' . esc_attr($attributes['fieldColumns']);
    } elseif (!empty($attributes['width'])) {
        $width_classes = esc_attr($attributes['width']);
    }

    $field_id = 'field-' . ($field_name ?: 'select');
    $placeholder_text = $placeholder ?: ($field_label ?: __('Select option...', 'codeweber-gutenberg-blocks'));

    ob_start();
    ?>
    <div class="<?php echo esc_attr($width_classes); ?>">
        <div class="form-select-wrapper mb-4">
            <select
                class="form-select <?php echo esc_attr($field_class); ?>"
                id="<?php echo esc_attr($field_id); ?>"
                name="<?php echo esc_attr($field_name); ?>"
                <?php echo $is_required ? 'required' : ''; ?>
            >
                <option value=""><?php echo esc_html($placeholder_text); ?></option>
                <?php
                if (!empty($attributes['options']) && is_array($attributes['options'])) {
                    foreach ($attributes['options'] as $opt) {
                        $opt_label = $opt['label'] ?? '';
                        $opt_value = $opt['value'] ?? $opt_label;
                        ?>
                        <option value="<?php echo esc_attr($opt_value); ?>">
                            <?php echo esc_html($opt_label); ?>
                        </option>
                        <?php
                    }
                }
                ?>
            </select>
        </div>
    </div>
    <?php
    echo ob_get_clean();
    return;
}

// #region agent log
$log_entry = json_encode([
    'sessionId' => 'debug-session',
    'runId' => 'run1',
    'hypothesisId' => 'F',
    'location' => 'render.php:356',
    'message' => 'RETURNING NULL - will use save.js',
    'data' => [
        'field_type' => $field_type,
        'field_name' => $field_name
    ],
    'timestamp' => time() * 1000
]) . "\n";
@file_put_contents($log_file, $log_entry, FILE_APPEND);
// #endregion

// For other field types, return null to use save.js
return null;










