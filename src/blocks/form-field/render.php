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

// Extract attributes from block
$field_type = $attributes['fieldType'] ?? 'text';
$field_name = $attributes['fieldName'] ?? '';
$consents = $attributes['consents'] ?? [];
$field_label = $attributes['fieldLabel'] ?? '';
$placeholder = $attributes['placeholder'] ?? '';
$is_required = !empty($attributes['isRequired']);
$button_text = $attributes['buttonText'] ?? '';
$button_class = $attributes['buttonClass'] ?? 'btn btn-primary';

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
    $field_label_display = !empty($field_label) ? $field_label : __('Email Address', 'codeweber');
    $field_placeholder_display = !empty($placeholder) ? $placeholder : $field_label_display;

    // Button text
    $button_text_display = !empty($button_text) ? $button_text : __('Join', 'codeweber');
    $button_class_final = trim($button_class . ' ' . $button_radius_class);

    ob_start();
    ?>
    <div class="<?php echo esc_attr($width_classes); ?>">
        <div class="input-group form-floating">
            <input
                type="email"
                class="form-control required email <?php echo esc_attr($form_radius_class); ?>"
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
                // Render consent checkbox
                echo codeweber_forms_render_consent_checkbox(
                    $consent,
                    'newsletter_consents', // name of the array already processed in universal logic
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

// For other field types, return null to use save.js
return null;




