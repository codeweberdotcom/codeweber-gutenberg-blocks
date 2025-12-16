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

