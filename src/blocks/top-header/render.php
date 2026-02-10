<?php
/**
 * Top Header Block - Server-side render
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

if (!isset($attributes) || !is_array($attributes)) {
	$attributes = [];
}

$show_address = isset($attributes['showAddress']) ? (bool) $attributes['showAddress'] : true;
$show_email = isset($attributes['showEmail']) ? (bool) $attributes['showEmail'] : true;
$show_phone = isset($attributes['showPhone']) ? (bool) $attributes['showPhone'] : true;
$phones = isset($attributes['phones']) && is_array($attributes['phones']) ? $attributes['phones'] : ['phone_01'];
$background_color = isset($attributes['backgroundColor']) ? sanitize_html_class($attributes['backgroundColor']) : 'primary';
$text_color = isset($attributes['textColor']) ? sanitize_html_class($attributes['textColor']) : 'white';
$block_class = isset($attributes['blockClass']) ? esc_attr($attributes['blockClass']) : '';
$block_id = isset($attributes['blockId']) ? esc_attr($attributes['blockId']) : '';

if (!class_exists('Redux')) {
	return;
}

global $opt_name;
if (empty($opt_name)) {
	$opt_name = 'redux_demo';
}

$city = Redux::get_option($opt_name, 'fact-city') ?? '';
$street = Redux::get_option($opt_name, 'fact-street') ?? '';
$house = Redux::get_option($opt_name, 'fact-house') ?? '';
$address = trim("{$city}, {$street}, {$house}", ' ,');
$email = Redux::get_option($opt_name, 'e-mail') ?? '';
$phone_values = [];
foreach ($phones as $key) {
	$v = Redux::get_option($opt_name, $key);
	if (!empty($v)) {
		$phone_values[] = [
			'display' => $v,
			'clean' => preg_replace('/\D/', '', $v),
		];
	}
}

$has_content = ($show_address && $address) || ($show_email && $email) || ($show_phone && count($phone_values) > 0);
if (!$has_content) {
	return;
}

$bg_class = $background_color ? 'bg-' . $background_color : 'bg-primary';
$txt_class = $text_color ? 'text-' . $text_color : 'text-white';
$link_class = $text_color === 'white' ? 'link-white' : 'link-body';
$wrapper_class = trim("codeweber-top-header {$bg_class} {$txt_class} fw-bold fs-15 {$block_class}");
?>

<div class="<?php echo esc_attr($wrapper_class); ?>"<?php echo $block_id ? ' id="' . $block_id . '"' : ''; ?>>
	<div class="container d-flex flex-row justify-content-between flex-wrap">
		<?php if ($show_address && $address) : ?>
			<div class="d-flex flex-row align-items-center">
				<div class="icon mt-1 me-2"><i class="uil uil-location-pin-alt"></i></div>
				<address class="mb-0"><?php echo esc_html($address); ?></address>
			</div>
		<?php endif; ?>
		<?php if ($show_email && $email) : ?>
			<div class="d-none d-md-flex flex-row align-items-center me-6 ms-auto">
				<div class="icon mt-1 me-2"><i class="uil uil-message"></i></div>
				<p class="mb-0"><a href="mailto:<?php echo esc_attr(antispambot($email)); ?>" class="<?php echo esc_attr($link_class); ?> hover"><?php echo esc_html(antispambot($email)); ?></a></p>
			</div>
		<?php endif; ?>
		<?php if ($show_phone && count($phone_values) > 0) : ?>
			<div class="d-flex flex-row align-items-center">
				<div class="icon mt-1 me-2"><i class="uil uil-phone-volume"></i></div>
				<?php foreach ($phone_values as $p) : ?>
					<a href="tel:<?php echo esc_attr($p['clean']); ?>" class="<?php echo esc_attr($link_class); ?> hover ms-2"><?php echo esc_html($p['display']); ?></a>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</div>
</div>
