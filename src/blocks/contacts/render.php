<?php
/**
 * Contacts Block - Server-side render
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

$items = isset($attributes['items']) ? $attributes['items'] : [];

if (empty($items)) {
    return;
}

// Проверяем наличие Redux Framework
if (!class_exists('Redux')) {
    return;
}

// Получаем глобальную переменную opt_name для Redux
global $opt_name;
if (empty($opt_name)) {
    $opt_name = 'redux_demo';
}

// Функция для очистки номера телефона (из темы Codeweber)
if (!function_exists('cleanNumber')) {
    function cleanNumber($digits) {
        return preg_replace('/\D/', '', $digits);
    }
}

// Функция для получения адреса
if (!function_exists('get_contact_address')) {
    function get_contact_address($addressType, $opt_name) {
        if ($addressType === 'legal') {
            $country = Redux::get_option($opt_name, 'juri-country');
            $region = Redux::get_option($opt_name, 'juri-region');
            $city = Redux::get_option($opt_name, 'juri-city');
            $street = Redux::get_option($opt_name, 'juri-street');
            $house = Redux::get_option($opt_name, 'juri-house');
            $office = Redux::get_option($opt_name, 'juri-office');
            $postal = Redux::get_option($opt_name, 'juri-postal');
        } else {
            $country = Redux::get_option($opt_name, 'fact-country');
            $region = Redux::get_option($opt_name, 'fact-region');
            $city = Redux::get_option($opt_name, 'fact-city');
            $street = Redux::get_option($opt_name, 'fact-street');
            $house = Redux::get_option($opt_name, 'fact-house');
            $office = Redux::get_option($opt_name, 'fact-office');
            $postal = Redux::get_option($opt_name, 'fact-postal');
        }

        // Формируем адрес в обратном порядке: индекс, страна, регион, город, улица, дом, офис
        $address_parts = [];
        if (!empty($postal)) $address_parts[] = $postal; // Индекс в начале
        if (!empty($country)) $address_parts[] = $country;
        if (!empty($region)) $address_parts[] = $region;
        if (!empty($city)) $address_parts[] = $city;
        if (!empty($street)) $address_parts[] = $street;
        if (!empty($house)) $address_parts[] = $house;
        if (!empty($office)) $address_parts[] = $office;
        return implode(', ', $address_parts);
    }
}

// Функция для получения адреса хранения данных (персональные данные)
if (!function_exists('get_storage_address')) {
    function get_storage_address($opt_name) {
        return Redux::get_option($opt_name, 'storage_address');
    }
}

// Функция для получения email
if (!function_exists('get_contact_email')) {
    function get_contact_email($opt_name) {
        return Redux::get_option($opt_name, 'e-mail');
    }
}

// Функция для получения телефона
if (!function_exists('get_contact_phone')) {
    function get_contact_phone($phone_key, $opt_name) {
        return Redux::get_option($opt_name, $phone_key);
    }
}

// Выводим только включенные элементы
$enabled_items = array_filter($items, function($item) {
    return isset($item['enabled']) && $item['enabled'] === true;
});

if (empty($enabled_items)) {
    return;
}

ob_start();
?>

<div class="codeweber-contacts-block">
    <?php foreach ($enabled_items as $item): ?>
        <?php
        $type = isset($item['type']) ? $item['type'] : '';
        $format = isset($item['format']) ? $item['format'] : 'simple';
        ?>

        <?php if ($type === 'address'): ?>
            <?php
            $addressType = isset($item['addressType']) ? $item['addressType'] : 'legal';
            $address = get_contact_address($addressType, $opt_name);
            if (empty($address)) continue;
            ?>
            <?php if ($format === 'icon'): ?>
                <div class="d-flex flex-row">
                    <div>
                        <div class="icon text-primary fs-28 me-6 mt-n1">
                            <i class="uil uil-location-pin-alt"></i>
                        </div>
                    </div>
                    <div>
                        <h5 class="mb-1"><?php echo esc_html__('Address', 'codeweber-gutenberg-blocks'); ?></h5>
                        <address><?php echo esc_html($address); ?></address>
                    </div>
                </div>
            <?php else: ?>
                <div>
                    <address class="pe-xl-15 pe-xxl-17"><?php echo esc_html($address); ?></address>
                </div>
            <?php endif; ?>

        <?php elseif ($type === 'email'): ?>
            <?php
            $email = get_contact_email($opt_name);
            if (empty($email)) continue;
            ?>
            <?php if ($format === 'icon'): ?>
                <div class="d-flex flex-row">
                    <div>
                        <div class="icon text-primary fs-28 me-6 mt-n1">
                            <i class="uil uil-envelope"></i>
                        </div>
                    </div>
                    <div>
                        <h5 class="mb-1"><?php echo esc_html__('E-mail', 'codeweber-gutenberg-blocks'); ?></h5>
                        <p class="mb-0">
                            <a href="mailto:<?php echo esc_attr(antispambot($email)); ?>" class="link-body">
                                <?php echo esc_html(antispambot($email)); ?>
                            </a>
                        </p>
                    </div>
                </div>
            <?php else: ?>
                <div>
                    <a href="mailto:<?php echo esc_attr(antispambot($email)); ?>">
                        <?php echo esc_html(antispambot($email)); ?>
                    </a>
                </div>
            <?php endif; ?>

        <?php elseif ($type === 'phone'): ?>
            <?php
            $phones = isset($item['phones']) && is_array($item['phones']) ? $item['phones'] : ['phone_01'];
            $phone_values = [];
            foreach ($phones as $phone_key) {
                $phone_value = get_contact_phone($phone_key, $opt_name);
                if (!empty($phone_value)) {
                    $phone_values[] = [
                        'display' => $phone_value,
                        'clean' => cleanNumber($phone_value),
                        'key' => $phone_key
                    ];
                }
            }
            if (empty($phone_values)) continue;
            ?>
            <?php if ($format === 'icon'): ?>
                <div class="d-flex flex-row">
                    <div>
                        <div class="icon text-primary fs-28 me-6 mt-n1">
                            <i class="uil uil-phone-volume"></i>
                        </div>
                    </div>
                    <div>
                        <h5 class="mb-1"><?php echo esc_html__('Phone', 'codeweber-gutenberg-blocks'); ?></h5>
                        <?php foreach ($phone_values as $index => $phone_data): ?>
                            <a href="tel:<?php echo esc_attr($phone_data['clean']); ?>">
                                <?php echo esc_html($phone_data['display']); ?>
                            </a>
                            <?php if ($index < count($phone_values) - 1): ?>
                                <br>
                            <?php endif; ?>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php else: ?>
                <div>
                    <?php foreach ($phone_values as $index => $phone_data): ?>
                        <a href="tel:<?php echo esc_attr($phone_data['clean']); ?>">
                            <?php echo esc_html($phone_data['display']); ?>
                        </a>
                        <?php if ($index < count($phone_values) - 1): ?>
                            <br>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

        <?php endif; ?>
    <?php endforeach; ?>
</div>

<?php
echo ob_get_clean();

