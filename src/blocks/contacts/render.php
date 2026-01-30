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

// Отладка: render.php загружен (временно)
// error_log('contacts render.php loaded');

// Атрибуты должны быть переданы через extract() в Plugin.php
// Если их нет, используем значения по умолчанию
if (!isset($attributes) || !is_array($attributes)) {
    $attributes = [];
}

$items = isset($attributes['items']) ? $attributes['items'] : [];
$format = isset($attributes['format']) ? $attributes['format'] : 'simple';
$titleTag = isset($attributes['titleTag']) ? $attributes['titleTag'] : 'div';
$titleColor = isset($attributes['titleColor']) ? $attributes['titleColor'] : '';
$titleColorType = isset($attributes['titleColorType']) ? $attributes['titleColorType'] : 'solid';
$titleSize = isset($attributes['titleSize']) ? $attributes['titleSize'] : 'h5';
$titleWeight = isset($attributes['titleWeight']) ? $attributes['titleWeight'] : '';
$titleTransform = isset($attributes['titleTransform']) ? $attributes['titleTransform'] : '';
$titleClass = isset($attributes['titleClass']) ? $attributes['titleClass'] : '';
$textTag = isset($attributes['textTag']) ? $attributes['textTag'] : 'address';
$textColor = isset($attributes['textColor']) ? $attributes['textColor'] : '';
$textColorType = isset($attributes['textColorType']) ? $attributes['textColorType'] : 'solid';
$textSize = isset($attributes['textSize']) ? $attributes['textSize'] : '';
$textWeight = isset($attributes['textWeight']) ? $attributes['textWeight'] : '';
$textTransform = isset($attributes['textTransform']) ? $attributes['textTransform'] : '';
$textClass = isset($attributes['textClass']) ? $attributes['textClass'] : '';
$iconType = isset($attributes['iconType']) ? $attributes['iconType'] : 'font';
$iconName = isset($attributes['iconName']) ? $attributes['iconName'] : '';
$svgIcon = isset($attributes['svgIcon']) ? $attributes['svgIcon'] : '';
$svgStyle = isset($attributes['svgStyle']) ? $attributes['svgStyle'] : 'lineal';
$iconSize = isset($attributes['iconSize']) ? $attributes['iconSize'] : 'xs';
$iconFontSize = isset($attributes['iconFontSize']) ? $attributes['iconFontSize'] : 'fs-28';
$iconColor = isset($attributes['iconColor']) ? $attributes['iconColor'] : 'primary';
$iconColor2 = isset($attributes['iconColor2']) ? $attributes['iconColor2'] : '';
$iconClass = isset($attributes['iconClass']) ? $attributes['iconClass'] : '';
$iconWrapper = isset($attributes['iconWrapper']) ? $attributes['iconWrapper'] : false;
$iconWrapperStyle = isset($attributes['iconWrapperStyle']) ? $attributes['iconWrapperStyle'] : '';
$iconBtnSize = isset($attributes['iconBtnSize']) ? $attributes['iconBtnSize'] : '';
$iconBtnVariant = isset($attributes['iconBtnVariant']) ? $attributes['iconBtnVariant'] : 'soft';
$iconWrapperClass = isset($attributes['iconWrapperClass']) ? $attributes['iconWrapperClass'] : 'mb-3';
$iconGradientColor = isset($attributes['iconGradientColor']) ? $attributes['iconGradientColor'] : 'gradient-1';
$customSvgUrl = isset($attributes['customSvgUrl']) ? $attributes['customSvgUrl'] : '';
$block_class = isset($attributes['blockClass']) ? $attributes['blockClass'] : '';
$block_id = isset($attributes['blockId']) ? $attributes['blockId'] : '';
$block_data = isset($attributes['blockData']) ? $attributes['blockData'] : '';
$item_class = isset($attributes['itemClass']) ? $attributes['itemClass'] : '';

if (empty($items)) {
    return;
}

// Функция для генерации классов цвета
if (!function_exists('get_contacts_color_class')) {
    function get_contacts_color_class($color, $colorType, $prefix = 'text') {
        if (!$color) return '';
        if ($colorType === 'soft') {
            return $prefix . '-soft-' . $color;
        } else if ($colorType === 'pale') {
            return $prefix . '-pale-' . $color;
        } else {
            return $prefix . '-' . $color;
        }
    }
}

// Функция для генерации типографических классов
if (!function_exists('get_contacts_typography_classes')) {
    function get_contacts_typography_classes($attrs, $prefix) {
        $classes = [];
        $size = isset($attrs[$prefix . 'Size']) ? $attrs[$prefix . 'Size'] : '';
        $weight = isset($attrs[$prefix . 'Weight']) ? $attrs[$prefix . 'Weight'] : '';
        $transform = isset($attrs[$prefix . 'Transform']) ? $attrs[$prefix . 'Transform'] : '';
        $tag = isset($attrs[$prefix . 'Tag']) ? $attrs[$prefix . 'Tag'] : '';
        
        if ($tag && strpos($tag, 'display-') === 0) {
            $classes[] = $tag;
        }
        if ($size) {
            $classes[] = $size;
        }
        if ($weight) {
            $classes[] = $weight;
        }
        if ($transform) {
            $classes[] = $transform;
        }
        return $classes;
    }
}

// Функция для генерации классов заголовка
if (!function_exists('get_contacts_title_classes')) {
    function get_contacts_title_classes($attrs) {
        $classes = ['mb-1'];
        $classes[] = get_contacts_color_class($attrs['titleColor'], $attrs['titleColorType'], 'text');
        $typographyClasses = get_contacts_typography_classes($attrs, 'title');
        $classes = array_merge($classes, $typographyClasses);
        if (!empty($attrs['titleClass'])) {
            $classes[] = $attrs['titleClass'];
        }
        return implode(' ', array_filter($classes));
    }
}

// Функция для генерации классов текста
if (!function_exists('get_contacts_text_classes')) {
    function get_contacts_text_classes($attrs) {
        $classes = [];
        $classes[] = get_contacts_color_class($attrs['textColor'], $attrs['textColorType'], 'text');
        $typographyClasses = get_contacts_typography_classes($attrs, 'text');
        $classes = array_merge($classes, $typographyClasses);
        if (!empty($attrs['textClass'])) {
            $classes[] = $attrs['textClass'];
        }
        return implode(' ', array_filter($classes));
    }
}

// Функция для генерации классов иконки (Font Icon)
if (!function_exists('get_contacts_icon_font_classes')) {
    function get_contacts_icon_font_classes($iconName, $iconFontSize, $iconColor, $iconClass) {
        $classes = ['uil', 'uil-' . $iconName];
        if ($iconFontSize) {
            $classes[] = $iconFontSize;
        }
        if ($iconColor) {
            $classes[] = 'text-' . $iconColor;
        }
        if ($iconClass) {
            $classes[] = $iconClass;
        }
        return implode(' ', array_filter($classes));
    }
}

// Функция для генерации классов обёртки иконки
if (!function_exists('get_contacts_icon_wrapper_classes')) {
    function get_contacts_icon_wrapper_classes($iconColor, $iconFontSize, $wrapperStyle, $btnSize, $btnVariant, $wrapperClass, $gradientColor) {
        $classes = ['icon'];
        
        // Стиль обёртки: кнопка
        if ($wrapperStyle === 'btn' || $wrapperStyle === 'btn-circle') {
            $classes[] = 'btn';
            $classes[] = 'btn-block';
            $classes[] = 'flex-shrink-0';
            
            // Круглая кнопка
            if ($wrapperStyle === 'btn-circle') {
                $classes[] = 'btn-circle';
            }
            
            // Вариант кнопки
            if ($btnVariant === 'gradient') {
                $classes[] = 'btn-gradient';
                if (strpos($gradientColor, 'gradient-') === 0) {
                    $classes[] = $gradientColor;
                } else {
                    $classes[] = 'gradient-' . $gradientColor;
                }
            } else if ($iconColor) {
                if ($btnVariant === 'soft') {
                    $classes[] = 'btn-soft-' . $iconColor;
                } else if ($btnVariant === 'outline') {
                    $classes[] = 'btn-outline-' . $iconColor;
                } else {
                    $classes[] = 'btn-' . $iconColor;
                }
            }
            
            // Размер кнопки
            if ($btnSize) {
                $classes[] = $btnSize;
            }
        } else {
            // Обычная обёртка div.icon
            if ($iconColor) {
                $classes[] = 'text-' . $iconColor;
            }
        }
        
        // Размер fs-* для font иконок с обёрткой
        if ($iconFontSize) {
            $classes[] = $iconFontSize;
        }
        
        if ($wrapperClass) {
            $classes[] = $wrapperClass;
        }
        
        return implode(' ', array_filter($classes));
    }
}

// Функция для получения пути SVG иконки (аналогично getSvgIconPath из JS)
if (!function_exists('get_contacts_svg_icon_path')) {
    function get_contacts_svg_icon_path($iconName, $style = 'lineal') {
        // Путь к SVG иконкам в теме (соответствует пути из getSvgIconPath в JS)
        $folder = ($style === 'lineal') ? 'lineal' : 'solid';
        return get_template_directory_uri() . '/dist/assets/img/icons/' . $folder . '/' . $iconName . '.svg';
    }
}

// Функция для генерации классов SVG иконки
if (!function_exists('get_contacts_svg_icon_classes')) {
    function get_contacts_svg_icon_classes($svgStyle, $iconSize, $iconColor, $iconColor2, $iconClass) {
        $classes = ['svg-inject', 'icon-svg'];
        
        // Размер
        if ($iconSize) {
            $classes[] = 'icon-svg-' . $iconSize;
        }
        
        // Стиль и цвет
        switch ($svgStyle) {
            case 'solid':
                $classes[] = 'solid';
                if ($iconColor) {
                    $classes[] = 'text-' . $iconColor;
                }
                break;
            case 'solid-mono':
                $classes[] = 'solid-mono';
                if ($iconColor) {
                    $classes[] = 'text-' . $iconColor;
                }
                break;
            case 'solid-duo':
                $classes[] = 'solid-duo';
                if ($iconColor && $iconColor2) {
                    $classes[] = 'text-' . $iconColor . '-' . $iconColor2;
                } else if ($iconColor) {
                    $classes[] = 'text-' . $iconColor;
                }
                break;
            case 'lineal':
            default:
                if ($iconColor) {
                    $classes[] = 'text-' . $iconColor;
                }
                break;
        }
        
        if ($iconClass) {
            $classes[] = $iconClass;
        }
        
        return implode(' ', array_filter($classes));
    }
}

// Функция для рендеринга простой иконки (без обёртки, только иконка с классом me-2)
if (!function_exists('render_contacts_simple_icon')) {
    function render_contacts_simple_icon($iconNameForContact, $iconType, $iconName, $svgIcon, $svgStyle, $iconSize, $iconColor, $iconColor2, $iconClass, $customSvgUrl) {
        // Если тип иконки none - не показываем
        if ($iconType === 'none') {
            return '';
        }
        
        // Font Icon
        if ($iconType === 'font') {
            $iconNameToUse = $iconName ? $iconName : $iconNameForContact;
            if (!$iconNameToUse) {
                return '';
            }
            
            $iconClasses = ['uil', 'uil-' . $iconNameToUse, 'me-2'];
            if ($iconColor) {
                $iconClasses[] = 'text-' . $iconColor;
            }
            if ($iconClass) {
                $iconClasses[] = $iconClass;
            }
            return '<i class="' . esc_attr(implode(' ', array_filter($iconClasses))) . '"></i>';
        }
        
        // SVG Icon
        if ($iconType === 'svg' && $svgIcon) {
            $svgClasses = get_contacts_svg_icon_classes(
                $svgStyle,
                $iconSize,
                $iconColor,
                $iconColor2,
                $iconClass . ' me-2'
            );
            $svgPath = get_contacts_svg_icon_path($svgIcon, $svgStyle);
            return '<img src="' . esc_url($svgPath) . '" class="' . esc_attr($svgClasses) . '" alt="" />';
        }
        
        // Custom SVG
        if ($iconType === 'custom' && $customSvgUrl) {
            $svgClasses = get_contacts_svg_icon_classes(
                'lineal',
                $iconSize,
                $iconColor,
                '',
                $iconClass . ' me-2'
            );
            return '<img src="' . esc_url($customSvgUrl) . '" class="' . esc_attr($svgClasses) . '" alt="" />';
        }
        
        return '';
    }
}

// Функция для рендеринга иконки контакта (для формата 'icon' - обёртка работает, но без mt-n1)
if (!function_exists('render_contacts_icon')) {
    function render_contacts_icon($iconNameForContact, $iconType, $iconName, $svgIcon, $svgStyle, $iconSize, $iconFontSize, $iconColor, $iconColor2, $iconClass, $iconWrapper, $iconWrapperStyle, $iconBtnSize, $iconBtnVariant, $iconWrapperClass, $iconGradientColor, $customSvgUrl) {
        // Если тип иконки none - не показываем
        if ($iconType === 'none') {
            return '';
        }
        
        $iconHtml = '';
        
        // Font Icon
        if ($iconType === 'font') {
            // Если пользователь выбрал иконку - используем её, иначе используем предустановленную для типа контакта
            $iconNameToUse = $iconName ? $iconName : $iconNameForContact;
            if (!$iconNameToUse) return '';
            
            // Классы для самой иконки
            $isButtonWrapper = $iconWrapper && ($iconWrapperStyle === 'btn' || $iconWrapperStyle === 'btn-circle');
            $shouldApplyColorToIcon = !$isButtonWrapper || $iconBtnVariant !== 'solid';
            
            $iconClasses = get_contacts_icon_font_classes(
                $iconNameToUse,
                $iconWrapper ? '' : $iconFontSize, // Размер на обёртке если wrapper
                $shouldApplyColorToIcon ? $iconColor : '', // Цвет только если не Solid-кнопка
                $iconClass
            );
            
            $iconHtml = '<i class="' . esc_attr($iconClasses) . '"></i>';
        }
        
        // SVG Icon
        if ($iconType === 'svg' && $svgIcon) {
            $isButtonWrapper = $iconWrapper && ($iconWrapperStyle === 'btn' || $iconWrapperStyle === 'btn-circle');
            $shouldApplyColorToIcon = !$isButtonWrapper || $iconBtnVariant !== 'solid';
            
            $svgClasses = get_contacts_svg_icon_classes(
                $svgStyle,
                $iconSize,
                $shouldApplyColorToIcon ? $iconColor : '',
                $shouldApplyColorToIcon ? $iconColor2 : '',
                $iconClass
            );
            
            $svgPath = get_contacts_svg_icon_path($svgIcon, $svgStyle);
            $iconHtml = '<img src="' . esc_url($svgPath) . '" class="' . esc_attr($svgClasses) . '" alt="" />';
        }
        
        // Custom SVG
        if ($iconType === 'custom' && $customSvgUrl) {
            $isButtonWrapper = $iconWrapper && ($iconWrapperStyle === 'btn' || $iconWrapperStyle === 'btn-circle');
            $shouldApplyColorToIcon = !$isButtonWrapper || $iconBtnVariant !== 'solid';
            
            $svgClasses = get_contacts_svg_icon_classes(
                'lineal', // Кастомные как lineal
                $iconSize,
                $shouldApplyColorToIcon ? $iconColor : '',
                '',
                $iconClass
            );
            
            $iconHtml = '<img src="' . esc_url($customSvgUrl) . '" class="' . esc_attr($svgClasses) . '" alt="" />';
        }
        
        if (!$iconHtml) {
            return '';
        }
        
        // Обёртка
        if ($iconWrapper) {
            // Для формата 'icon' с обёрткой: только me-4, без mt-n1 и без iconWrapperClass (он применяется к внешнему div)
            $wrapperClasses = get_contacts_icon_wrapper_classes(
                $iconColor,
                $iconFontSize,
                $iconWrapperStyle,
                $iconBtnSize,
                $iconBtnVariant,
                'me-4', // только me-4, без iconWrapperClass
                $iconGradientColor
            );
            return '<div class="' . esc_attr($wrapperClasses) . '">' . $iconHtml . '</div>';
        }
        
        // Без обёртки - me-4 и mt-n1
        $wrapperClassFinal = $iconWrapperClass ? $iconWrapperClass . ' me-4 mt-n1' : 'me-4 mt-n1';
        return '<div class="' . esc_attr($wrapperClassFinal) . '">' . $iconHtml . '</div>';
    }
}

$titleAttrs = [
    'titleColor' => $titleColor,
    'titleColorType' => $titleColorType,
    'titleSize' => $titleSize,
    'titleWeight' => $titleWeight,
    'titleTransform' => $titleTransform,
    'titleClass' => $titleClass,
    'titleTag' => $titleTag,
];
$textAttrs = [
    'textColor' => $textColor,
    'textColorType' => $textColorType,
    'textSize' => $textSize,
    'textWeight' => $textWeight,
    'textTransform' => $textTransform,
    'textClass' => $textClass,
    'textTag' => $textTag,
];
$titleClasses = get_contacts_title_classes($titleAttrs);
$textClasses = get_contacts_text_classes($textAttrs);
// Добавляем mb-0 для address
if ($textTag === 'address') {
    $textClasses = $textClasses ? $textClasses . ' mb-0' : 'mb-0';
}

// Проверяем наличие Redux Framework
if (!class_exists('Redux')) {
    // Если Redux не загружен, выводим сообщение для отладки
    echo '<!-- Redux Framework not loaded -->';
    return; // Просто прекращаем выполнение, буфер обработается в Plugin.php
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
    // Если нет включенных элементов, выводим сообщение для отладки
    echo '<!-- No enabled items. Total items: ' . count($items) . ' -->';
    return; // Просто прекращаем выполнение, буфер обработается в Plugin.php
}
?>

<?php foreach ($enabled_items as $item): ?>
        <?php
        $type = isset($item['type']) ? $item['type'] : '';
        $item_class_attr = $item_class ? ' class="' . esc_attr($item_class) . '"' : '';
        ?>
        <?php if ($item_class): ?><div<?php echo $item_class_attr; ?>><?php endif; ?>
        <?php if ($type === 'address'): ?>
            <?php
            $addressType = isset($item['addressType']) ? $item['addressType'] : 'legal';
            $address = get_contact_address($addressType, $opt_name);
            if (empty($address)) continue;
            ?>
            <?php if ($format === 'icon'): ?>
                <div class="d-flex flex-row <?php echo esc_attr($iconWrapperClass ? $iconWrapperClass : ''); ?>">
                    <div>
                        <?php echo render_contacts_icon('location-pin-alt', $iconType, $iconName, $svgIcon, $svgStyle, $iconSize, $iconFontSize, $iconColor, $iconColor2, $iconClass, $iconWrapper, $iconWrapperStyle, $iconBtnSize, $iconBtnVariant, '', $iconGradientColor, $customSvgUrl); ?>
                    </div>
                    <div>
                        <<?php echo esc_attr($titleTag); ?> class="<?php echo esc_attr($titleClasses); ?>"><?php echo esc_html__('Address', 'codeweber-gutenberg-blocks'); ?></<?php echo esc_attr($titleTag); ?>>
                        <<?php echo esc_attr($textTag); ?> class="<?php echo esc_attr($textClasses); ?>"><?php echo esc_html($address); ?></<?php echo esc_attr($textTag); ?>>
                    </div>
                </div>
            <?php elseif ($format === 'icon-simple'): ?>
                <div>
                    <<?php echo esc_attr($textTag); ?> class="<?php echo esc_attr($textClasses); ?>">
                        <?php echo render_contacts_simple_icon('location-pin-alt', $iconType, $iconName, $svgIcon, $svgStyle, $iconSize, $iconColor, $iconColor2, $iconClass, $customSvgUrl); ?>
                        <span><?php echo esc_html($address); ?></span>
                    </<?php echo esc_attr($textTag); ?>>
                </div>
            <?php else: ?>
                <div>
                    <<?php echo esc_attr($textTag); ?> class="pe-xl-15 pe-xxl-17 <?php echo esc_attr($textClasses); ?>"><?php echo esc_html($address); ?></<?php echo esc_attr($textTag); ?>>
                </div>
            <?php endif; ?>

        <?php elseif ($type === 'email'): ?>
            <?php
            $email = get_contact_email($opt_name);
            if (empty($email)) continue;
            ?>
            <?php if ($format === 'icon'): ?>
                <div class="d-flex flex-row <?php echo esc_attr($iconWrapperClass ? $iconWrapperClass : ''); ?>">
                    <div>
                        <?php echo render_contacts_icon('envelope', $iconType, $iconName, $svgIcon, $svgStyle, $iconSize, $iconFontSize, $iconColor, $iconColor2, $iconClass, $iconWrapper, $iconWrapperStyle, $iconBtnSize, $iconBtnVariant, '', $iconGradientColor, $customSvgUrl); ?>
                    </div>
                    <div>
                        <<?php echo esc_attr($titleTag); ?> class="<?php echo esc_attr($titleClasses); ?>"><?php echo esc_html__('E-mail', 'codeweber-gutenberg-blocks'); ?></<?php echo esc_attr($titleTag); ?>>
                        <p class="mb-0">
                            <a href="mailto:<?php echo esc_attr(antispambot($email)); ?>" class="link-body <?php echo esc_attr($textClasses); ?>">
                                <?php echo esc_html(antispambot($email)); ?>
                            </a>
                        </p>
                    </div>
                </div>
            <?php elseif ($format === 'icon-simple'): ?>
                <div>
                    <a href="mailto:<?php echo esc_attr(antispambot($email)); ?>" class="d-flex align-items-center <?php echo esc_attr($textClasses); ?>">
                        <?php echo render_contacts_simple_icon('envelope', $iconType, $iconName, $svgIcon, $svgStyle, $iconSize, $iconColor, $iconColor2, $iconClass, $customSvgUrl); ?>
                        <span><?php echo esc_html(antispambot($email)); ?></span>
                    </a>
                </div>
            <?php else: ?>
                <div>
                    <a href="mailto:<?php echo esc_attr(antispambot($email)); ?>" class="<?php echo esc_attr($textClasses); ?>">
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
                <div class="d-flex flex-row <?php echo esc_attr($iconWrapperClass ? $iconWrapperClass : ''); ?>">
                    <div>
                        <?php echo render_contacts_icon('phone-volume', $iconType, $iconName, $svgIcon, $svgStyle, $iconSize, $iconFontSize, $iconColor, $iconColor2, $iconClass, $iconWrapper, $iconWrapperStyle, $iconBtnSize, $iconBtnVariant, '', $iconGradientColor, $customSvgUrl); ?>
                    </div>
                    <div>
                        <<?php echo esc_attr($titleTag); ?> class="<?php echo esc_attr($titleClasses); ?>"><?php echo esc_html__('Phone', 'codeweber-gutenberg-blocks'); ?></<?php echo esc_attr($titleTag); ?>>
                        <?php foreach ($phone_values as $index => $phone_data): ?>
                            <a href="tel:<?php echo esc_attr($phone_data['clean']); ?>" class="<?php echo esc_attr($textClasses); ?>">
                                <?php echo esc_html($phone_data['display']); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php elseif ($format === 'icon-simple'): ?>
                <div>
                    <?php foreach ($phone_values as $index => $phone_data): ?>
                        <a href="tel:<?php echo esc_attr($phone_data['clean']); ?>" class="d-flex align-items-center <?php echo esc_attr($textClasses); ?>">
                            <?php echo render_contacts_simple_icon('phone-volume', $iconType, $iconName, $svgIcon, $svgStyle, $iconSize, $iconColor, $iconColor2, $iconClass, $customSvgUrl); ?>
                            <span><?php echo esc_html($phone_data['display']); ?></span>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div>
                    <?php foreach ($phone_values as $index => $phone_data): ?>
                        <a href="tel:<?php echo esc_attr($phone_data['clean']); ?>" class="<?php echo esc_attr($textClasses); ?>">
                            <?php echo esc_html($phone_data['display']); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

        <?php endif; ?>
        <?php if ($item_class): ?></div><?php endif; ?>
    <?php endforeach; ?>
</div>
