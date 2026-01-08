# План реализации универсальной системы шаблонов карточек для всех типов записей

## Общая концепция

Создание **универсальной централизованной системы шаблонов карточек**, которая будет работать с **любыми типами записей**:
- `post` (стандартные посты)
- `products` (WooCommerce)
- `projects` (проекты)
- `documents` (документы)
- `vacancies` (вакансии)
- `adresses` (адреса)
- И любые другие кастомные типы записей

Система будет использоваться:
1. В теме WordPress (Single Post, шорткоды, компоненты)
2. В Gutenberg блоках (Post Grid)

**Архитектурный подход:**
- **Единые универсальные шаблоны** (не отдельные для каждого типа)
- **Система адаптеров** для преобразования данных разных типов записей в единый формат
- **Расширяемая структура данных** с поддержкой специфичных полей для каждого типа
- **Централизованное управление элементами** с возможностью кастомизации для типов

---

## ЧАСТЬ 1: ИЗМЕНЕНИЯ В ТЕМЕ

### ⚠️ ВАЖНО: Обратная совместимость

**Все существующие файлы остаются без изменений:**
- `includes/blog.php` - шорткод `blog_posts_slider` остается как есть
- `templates/components/lastpostslider-blog.php` - остается без изменений
- Все существующие шаблоны и функции продолжают работать

**Новая система добавляется параллельно:**
- Новые файлы в отдельной папке `templates/post-cards/`
- Новые функции с префиксом `cw_` для избежания конфликтов
- Постепенная миграция через опциональное использование

### 1.1. Структура папок

```
wp-content/themes/{theme-name}/
├── includes/
│   └── blog.php                  # СУЩЕСТВУЮЩИЙ ФАЙЛ - НЕ ТРОГАЕМ
├── templates/
│   ├── components/
│   │   └── lastpostslider-blog.php  # СУЩЕСТВУЮЩИЙ ФАЙЛ - НЕ ТРОГАЕМ
│   └── post-cards/               # НОВАЯ ПАПКА - добавляется параллельно
│       ├── default.php          # Новый шаблон по умолчанию
│       ├── card.php             # Новый шаблон с карточкой
│       ├── card-alt.php         # Новый альтернативный шаблон
│       ├── slider.php           # Новый шаблон для слайдера
│       └── helpers.php          # Новые вспомогательные функции
└── functions/
    └── post-card-templates.php   # НОВЫЙ ФАЙЛ - добавляется параллельно
```

### 1.2. Создание системы управления элементами

**Файл: `templates/post-cards/helpers.php` (НОВЫЙ ФАЙЛ)**

⚠️ **Префикс `cw_` используется для избежания конфликтов с существующими функциями**

```php
<?php
/**
 * Post Card Templates Helpers
 * 
 * НОВАЯ система шаблонов карточек
 * Не конфликтует с существующими функциями темы
 */

/**
 * Получить настройки отображения элементов карточки
 * 
 * @param array $args {
 *     Массив настроек
 *     @type bool   $show_title     Показывать заголовок (по умолчанию true)
 *     @type bool   $show_date      Показывать дату (по умолчанию true)
 *     @type bool   $show_category  Показывать категорию (по умолчанию true)
 *     @type bool   $show_comments  Показывать комментарии (по умолчанию true)
 *     @type int    $title_length   Максимальная длина заголовка (0 = без ограничения)
 *     @type int    $excerpt_length Длина описания (0 = не показывать)
 *     @type string $title_tag      HTML тег для заголовка (h1, h2, h3, h4, h5, h6, p, div, span) (по умолчанию h2)
 *     @type string $title_class    Дополнительный CSS класс для заголовка (по умолчанию пусто)
 * }
 * @return array Массив настроек
 */
function cw_get_post_card_display_settings($args = []) {
    $defaults = [
        'show_title' => true,
        'show_date' => true,
        'show_category' => true,
        'show_comments' => true,
        'title_length' => 0,
        'excerpt_length' => 0,
        'title_tag' => 'h2', // h1, h2, h3, h4, h5, h6, p, div, span
        'title_class' => '', // Дополнительный класс для заголовка
    ];
    return wp_parse_args($args, $defaults);
}

/**
 * Получить данные поста для карточки
 * 
 * @param WP_Post|int $post Объект поста или ID
 * @param string $image_size Размер изображения
 * @return array Массив данных поста
 */
function cw_get_post_card_data($post, $image_size = 'full') {
    if (is_numeric($post)) {
        $post = get_post($post);
    }
    
    if (!$post) {
        return null;
    }
    
    setup_postdata($post);
    
    $thumbnail_id = get_post_thumbnail_id($post->ID);
    $image_url = '';
    if ($thumbnail_id) {
        $image = wp_get_attachment_image_src($thumbnail_id, $image_size);
        $image_url = $image ? $image[0] : '';
    }
    
    $categories = get_the_category($post->ID);
    $category = !empty($categories) ? $categories[0] : null;
    
    return [
        'id' => $post->ID,
        'title' => get_the_title($post->ID),
        'excerpt' => get_the_excerpt($post->ID),
        'link' => get_permalink($post->ID),
        'date' => get_the_date('d M Y', $post->ID),
        'date_format' => get_the_date(get_option('date_format'), $post->ID),
        'comments_count' => get_comments_number($post->ID),
        'category' => $category,
        'image_url' => $image_url,
        'image_alt' => get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true) ?: get_the_title($post->ID),
    ];
}
```

### 1.3. Создание шаблонов карточек

**Файл: `templates/post-cards/default.php` (НОВЫЙ ФАЙЛ)**

```php
<?php
/**
 * Template: Default Post Card
 * 
 * НОВЫЙ шаблон - не конфликтует с существующими
 * 
 * @param array $post_data Данные поста (из cw_get_post_card_data)
 * @param array $display_settings Настройки отображения (из cw_get_post_card_display_settings)
 * @param array $template_args Дополнительные аргументы (hover classes, border radius и т.д.)
 */

if (!isset($post_data) || !$post_data) {
    return;
}

$display = cw_get_post_card_display_settings($display_settings ?? []);
$template_args = wp_parse_args($template_args ?? [], [
    'hover_classes' => 'overlay overlay-1',
    'border_radius' => 'rounded',
    'show_figcaption' => true,
]);

// Ограничение заголовка
$title = $post_data['title'];
if ($display['title_length'] > 0 && mb_strlen($title) > $display['title_length']) {
    $title = mb_substr($title, 0, $display['title_length']) . '...';
}
?>

<article>
    <?php if ($post_data['image_url']) : ?>
        <figure class="<?php echo esc_attr($template_args['hover_classes'] . ' ' . $template_args['border_radius']); ?> mb-5">
            <a href="<?php echo esc_url($post_data['link']); ?>">
                <img src="<?php echo esc_url($post_data['image_url']); ?>" alt="<?php echo esc_attr($post_data['image_alt']); ?>" />
            </a>
            <?php if ($template_args['show_figcaption']) : ?>
                <figcaption>
                    <h5 class="from-top mb-0"><?php esc_html_e('Read More', 'codeweber'); ?></h5>
                </figcaption>
            <?php endif; ?>
        </figure>
    <?php endif; ?>
    
    <div class="post-header">
        <?php if ($display['show_category'] && $post_data['category']) : ?>
            <div class="post-category text-line">
                <a href="<?php echo esc_url(get_category_link($post_data['category']->term_id)); ?>" class="hover" rel="category">
                    <?php echo esc_html($post_data['category']->name); ?>
                </a>
            </div>
        <?php endif; ?>
        
        <?php if ($display['show_title']) : ?>
            <?php
            $title_tag = isset($display['title_tag']) ? sanitize_html_class($display['title_tag']) : 'h2';
            $title_class = 'post-title';
            // Добавляем класс размера для h1-h6
            if (in_array($title_tag, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])) {
                $title_class .= ' ' . $title_tag;
            } else {
                $title_class .= ' h3'; // Fallback класс для p, div, span
            }
            $title_class .= ' mt-1 mb-3';
            // Добавляем кастомный класс если указан
            if (!empty($display['title_class'])) {
                $title_class .= ' ' . esc_attr($display['title_class']);
            }
            ?>
            <<?php echo esc_attr($title_tag); ?> class="<?php echo esc_attr(trim($title_class)); ?>">
                <a class="link-dark" href="<?php echo esc_url($post_data['link']); ?>">
                    <?php echo esc_html($title); ?>
                </a>
            </<?php echo esc_attr($title_tag); ?>>
        <?php endif; ?>
    </div>
    
    <?php if ($display['show_date'] || $display['show_comments']) : ?>
        <div class="post-footer">
            <ul class="post-meta">
                <?php if ($display['show_date']) : ?>
                    <li class="post-date">
                        <i class="uil uil-calendar-alt"></i>
                        <span><?php echo esc_html($post_data['date']); ?></span>
                    </li>
                <?php endif; ?>
                
                <?php if ($display['show_comments']) : ?>
                    <li class="post-comments">
                        <a href="<?php echo esc_url($post_data['link'] . '#comments'); ?>">
                            <i class="uil uil-comment"></i>
                            <?php echo esc_html($post_data['comments_count']); ?>
                        </a>
                    </li>
                <?php endif; ?>
            </ul>
        </div>
    <?php endif; ?>
</article>
```

**Файл: `templates/post-cards/card.php` (НОВЫЙ ФАЙЛ)**

```php
<?php
/**
 * Template: Card Post Card
 * 
 * НОВЫЙ шаблон - не конфликтует с существующими
 * 
 * @param array $post_data Данные поста
 * @param array $display_settings Настройки отображения
 * @param array $template_args Дополнительные аргументы
 */

if (!isset($post_data) || !$post_data) {
    return;
}

$display = cw_get_post_card_display_settings($display_settings ?? []);
$template_args = wp_parse_args($template_args ?? [], [
    'hover_classes' => 'overlay overlay-1',
    'border_radius' => 'rounded',
    'show_figcaption' => true,
]);

$title = $post_data['title'];
if ($display['title_length'] > 0 && mb_strlen($title) > $display['title_length']) {
    $title = mb_substr($title, 0, $display['title_length']) . '...';
}
?>

<article>
    <div class="card shadow-lg">
        <?php if ($post_data['image_url']) : ?>
            <figure class="<?php echo esc_attr($template_args['hover_classes'] . ' ' . $template_args['border_radius'] . ' card-img-top'); ?>">
                <a href="<?php echo esc_url($post_data['link']); ?>">
                    <img src="<?php echo esc_url($post_data['image_url']); ?>" alt="<?php echo esc_attr($post_data['image_alt']); ?>" />
                </a>
                <?php if ($template_args['show_figcaption']) : ?>
                    <figcaption>
                        <h5 class="from-top mb-0"><?php esc_html_e('Read More', 'codeweber'); ?></h5>
                    </figcaption>
                <?php endif; ?>
            </figure>
        <?php endif; ?>
        
        <div class="card-body p-6">
            <div class="post-header">
                <?php if ($display['show_category'] && $post_data['category']) : ?>
                    <div class="post-category">
                        <a href="<?php echo esc_url(get_category_link($post_data['category']->term_id)); ?>" class="hover" rel="category">
                            <?php echo esc_html($post_data['category']->name); ?>
                        </a>
                    </div>
                <?php endif; ?>
                
                <?php if ($display['show_title']) : ?>
                    <?php
                    $title_tag = isset($display['title_tag']) ? sanitize_html_class($display['title_tag']) : 'h2';
                    $title_class = 'post-title';
                    if (in_array($title_tag, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])) {
                        $title_class .= ' ' . $title_tag;
                    } else {
                        $title_class .= ' h3';
                    }
                    $title_class .= ' mt-1 mb-3';
                    // Добавляем кастомный класс если указан
                    if (!empty($display['title_class'])) {
                        $title_class .= ' ' . esc_attr($display['title_class']);
                    }
                    ?>
                    <<?php echo esc_attr($title_tag); ?> class="<?php echo esc_attr(trim($title_class)); ?>">
                        <a class="link-dark" href="<?php echo esc_url($post_data['link']); ?>">
                            <?php echo esc_html($title); ?>
                        </a>
                    </<?php echo esc_attr($title_tag); ?>>
                <?php endif; ?>
            </div>
            
            <?php if ($display['show_date'] || $display['show_comments']) : ?>
                <div class="post-footer">
                    <ul class="post-meta d-flex mb-0">
                        <?php if ($display['show_date']) : ?>
                            <li class="post-date">
                                <i class="uil uil-calendar-alt"></i>
                                <span><?php echo esc_html($post_data['date']); ?></span>
                            </li>
                        <?php endif; ?>
                        
                        <?php if ($display['show_comments']) : ?>
                            <li class="post-comments">
                                <a href="<?php echo esc_url($post_data['link'] . '#comments'); ?>">
                                    <i class="uil uil-comment"></i>
                                    <?php echo esc_html($post_data['comments_count']); ?>
                                </a>
                            </li>
                        <?php endif; ?>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
    </div>
</article>
```

**Файл: `templates/post-cards/slider.php` (НОВЫЙ ФАЙЛ)**

```php
<?php
/**
 * Template: Slider Post Card
 * 
 * НОВЫЙ шаблон - основан на логике из horizons/includes/blog.php
 * Но реализован в новой системе шаблонов
 * 
 * @param array $post_data Данные поста
 * @param array $display_settings Настройки отображения
 * @param array $template_args Дополнительные аргументы
 */

if (!isset($post_data) || !$post_data) {
    return;
}

$display = cw_get_post_card_display_settings($display_settings ?? []);
$template_args = wp_parse_args($template_args ?? [], [
    'hover_classes' => 'overlay overlay-1 hover-scale',
    'border_radius' => 'rounded',
    'show_figcaption' => true,
]);

$title = $post_data['title'];
if ($display['title_length'] > 0 && mb_strlen($title) > $display['title_length']) {
    $title = mb_substr($title, 0, $display['title_length']) . '...';
}

$excerpt = '';
if ($display['excerpt_length'] > 0) {
    $excerpt = wp_trim_words($post_data['excerpt'], $display['excerpt_length'], '...');
}
?>

<article>
    <div class="post-col">
        <?php if ($post_data['image_url']) : ?>
            <figure class="post-figure <?php echo esc_attr($template_args['hover_classes'] . ' ' . $template_args['border_radius']); ?> mb-5">
                <a href="<?php echo esc_url($post_data['link']); ?>">
                    <img src="<?php echo esc_url($post_data['image_url']); ?>" alt="<?php echo esc_attr($post_data['image_alt']); ?>" class="post-image" />
                    
                    <?php if ($display['show_category'] && $post_data['category']) : ?>
                        <div class="caption-wrapper p-7">
                            <div class="caption bg-matte-color mt-auto label-u text-neutral-50 px-4 py-2">
                                <?php echo esc_html($post_data['category']->name); ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <span class="bg"></span>
                </a>
                <?php if ($template_args['show_figcaption']) : ?>
                    <figcaption>
                        <div class="from-top mb-0 label-u"><?php esc_html_e('Read', 'horizons'); ?></div>
                    </figcaption>
                <?php endif; ?>
            </figure>
        <?php endif; ?>
        
        <div class="post-body mt-4">
            <?php if ($display['show_date'] || $display['show_comments']) : ?>
                <div class="post-meta d-flex mb-3 fs-16">
                    <?php if ($display['show_date']) : ?>
                        <span class="post-date"><?php echo esc_html($post_data['date']); ?></span>
                    <?php endif; ?>
                    
                    <?php if ($display['show_comments']) : ?>
                        <a href="<?php echo esc_url($post_data['link'] . '#comments'); ?>" class="post-comments">
                            <i class="uil uil-comment"></i>
                            <?php echo esc_html($post_data['comments_count']); ?>
                        </a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <?php if ($display['show_title']) : ?>
                <?php
                $title_tag = isset($display['title_tag']) ? sanitize_html_class($display['title_tag']) : 'h3';
                $title_class = 'post-title';
                if (in_array($title_tag, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])) {
                    $title_class .= ' h4'; // Сохраняем стиль h4 для совместимости
                }
                // Добавляем кастомный класс если указан
                if (!empty($display['title_class'])) {
                    $title_class .= ' ' . esc_attr($display['title_class']);
                }
                ?>
                <<?php echo esc_attr($title_tag); ?> class="<?php echo esc_attr(trim($title_class)); ?>" title="<?php echo esc_attr($post_data['title']); ?>">
                    <?php echo esc_html($title); ?>
                </<?php echo esc_attr($title_tag); ?>>
            <?php endif; ?>
            
            <?php if ($excerpt) : ?>
                <div class="body-l-l mb-4 post-excerpt">
                    <?php echo esc_html($excerpt); ?>
                </div>
            <?php endif; ?>
            
            <a href="<?php echo esc_url($post_data['link']); ?>" class="hover-8 link-body label-s text-charcoal-blue me-4 post-read-more">
                <?php esc_html_e('Read more', 'horizons'); ?>
            </a>
        </div>
    </div>
</article>
```

### 1.4. Создание функции-обертки для рендеринга

**Файл: `functions/post-card-templates.php` (НОВЫЙ ФАЙЛ)**

⚠️ **Новая функция с префиксом `cw_` для избежания конфликтов**

```php
<?php
/**
 * Post Card Templates System
 * 
 * НОВАЯ централизованная система для рендеринга карточек блога
 * Не конфликтует с существующими функциями темы
 */

/**
 * Рендерить карточку поста по шаблону
 * 
 * @param WP_Post|int $post Объект поста или ID
 * @param string $template_name Имя шаблона (default, card, card-alt, slider)
 * @param array $display_settings Настройки отображения элементов
 * @param array $template_args Дополнительные аргументы шаблона
 * @return string HTML карточки
 */
function cw_render_post_card($post, $template_name = 'default', $display_settings = [], $template_args = []) {
    // Загружаем helpers
    $helpers_path = get_template_directory() . '/templates/post-cards/helpers.php';
    if (file_exists($helpers_path)) {
        require_once $helpers_path;
    }
    
    // Получаем данные поста
    $post_data = cw_get_post_card_data($post, $template_args['image_size'] ?? 'full');
    if (!$post_data) {
        return '';
    }
    
    // Загружаем шаблон
    $template_path = get_template_directory() . '/templates/post-cards/' . sanitize_file_name($template_name) . '.php';
    if (!file_exists($template_path)) {
        // Fallback на default
        $template_path = get_template_directory() . '/templates/post-cards/default.php';
    }
    
    ob_start();
    include $template_path;
    return ob_get_clean();
}
```

### 1.5. Обновление шорткода `blog_posts_slider` (ОПЦИОНАЛЬНО)

**Файл: `includes/blog.php`**

⚠️ **ВАРИАНТ 1: Без изменений (рекомендуется для обратной совместимости)**
- Файл остается без изменений
- Существующий функционал продолжает работать
- Новая система доступна через новый шорткод `cw_blog_posts_slider`

**Файл: `functions/post-card-templates.php` (добавить новый шорткод)**

```php
/**
 * Новый шорткод для новой системы шаблонов
 * Старый шорткод blog_posts_slider остается без изменений
 */
add_shortcode('cw_blog_posts_slider', 'cw_blog_posts_slider_shortcode');

function cw_blog_posts_slider_shortcode($atts) {
    // Использует новую систему cw_render_post_card()
    // Параметры:
    // - show_title="true|false"
    // - show_date="true|false"
    // - show_category="true|false"
    // - show_comments="true|false"
    // - title_tag="h1|h2|h3|h4|h5|h6|p|div|span"
    // - title_class="custom-class"
    // - template="default|card|card-alt|slider"
}
```

⚠️ **ВАРИАНТ 2: Опциональное использование новой системы (если нужно)**

Если в шорткоде `blog_posts_slider` передан параметр `use_new_templates="true"`, использовать новую систему, иначе - старую:

```php
// В функции horizons_blog_posts_slider_shortcode добавить проверку:
if (isset($atts['use_new_templates']) && $atts['use_new_templates'] === 'true') {
    // Использовать cw_render_post_card()
} else {
    // Использовать существующий код (как сейчас)
}
```

### 1.6. Обновление компонента `lastpostslider-blog.php` (ОПЦИОНАЛЬНО)

**Файл: `templates/components/lastpostslider-blog.php`**

⚠️ **Файл остается без изменений для обратной совместимости**

**Альтернатива:** Создать новый компонент `templates/components/cw-lastpostslider-blog.php` который использует новую систему.

### 1.7. Обновление Single Post шаблона (ОПЦИОНАЛЬНО)

**Файл: `templates/content/single.php`**

⚠️ **Существующий код остается без изменений**

**Варианты использования:**

1. **Использовать новый шорткод:**
   ```php
   <?php echo do_shortcode('[cw_blog_posts_slider template="default" show_title="true" show_date="true" show_category="true" show_comments="true" title_tag="h3" title_class="custom-title-class"]'); ?>
   ```

2. **Использовать новую функцию напрямую:**
   ```php
   <?php
   $posts = get_posts(['post_type' => 'post', 'posts_per_page' => 6]);
   foreach ($posts as $post) {
       echo cw_render_post_card($post, 'default', [
           'show_title' => true,
           'show_date' => true,
           'title_tag' => 'h3',
           'title_class' => 'custom-title-class'
       ]);
   }
   ?>
   ```

3. **Старый шорткод продолжает работать как раньше:**
   ```php
   <?php echo do_shortcode('[blog_posts_slider posts_per_page="6"]'); ?>
   ```

---

## ЧАСТЬ 2: ИЗМЕНЕНИЯ В БЛОКЕ GUTENBERG

### ⚠️ ВАЖНО: Обратная совместимость

**Все существующие файлы остаются без изменений:**
- `src/blocks/post-grid/render.php` - функция `render_post_grid_item()` остается как есть
- `src/components/post-grid-item/PostGridItemRender.js` - остается без изменений
- Все существующие функции и компоненты продолжают работать

**Новая система добавляется параллельно:**
- Новые файлы в отдельной папке `src/templates/post-cards/`
- Новый класс `PostCardTemplates` с опциональным использованием
- Постепенная миграция через проверку наличия новой системы

### 2.1. Структура папок

```
wp-content/plugins/codeweber-gutenberg-blocks/
├── src/
│   ├── templates/                  # НОВАЯ ПАПКА
│   │   └── post-cards/              # НОВАЯ ПАПКА
│   │       ├── default.jsx         # React компонент для Default шаблона
│   │       ├── card.jsx            # React компонент для Card шаблона
│   │       ├── card-alt.jsx        # React компонент для Card Alt шаблона
│   │       ├── slider.jsx          # React компонент для Slider шаблона
│   │       └── PostCardRender.js   # Обертка для рендеринга шаблонов
│   │
│   └── blocks/post-grid/
│       ├── controls/
│       │   └── TemplateControl.js      # СУЩЕСТВУЮЩИЙ - расширяем опционально
│       ├── render.php                   # СУЩЕСТВУЮЩИЙ - расширяем опционально
│       └── edit.js                      # СУЩЕСТВУЮЩИЙ - расширяем опционально
│
└── inc/
    └── PostCardTemplates.php       # НОВЫЙ ФАЙЛ - PHP класс для шаблонов
```

### 2.2. Создание PHP класса для шаблонов

**Файл: `inc/PostCardTemplates.php`**

```php
<?php
/**
 * Post Card Templates System for Gutenberg Blocks
 * 
 * Использует шаблоны из темы или собственные шаблоны плагина
 */

namespace Codeweber\Blocks;

class PostCardTemplates {
    
    /**
     * Получить путь к шаблонам темы
     */
    private static function get_theme_templates_path() {
        return get_template_directory() . '/templates/post-cards/';
    }
    
    /**
     * Получить путь к шаблонам плагина (fallback)
     */
    private static function get_plugin_templates_path() {
        return plugin_dir_path(__FILE__) . '../templates/post-cards/';
    }
    
    /**
     * Рендерить карточку поста
     * 
     * @param WP_Post|int $post Объект поста или ID
     * @param string $template_name Имя шаблона
     * @param array $display_settings Настройки отображения
     * @param array $template_args Дополнительные аргументы
     * @return string HTML
     */
    public static function render($post, $template_name = 'default', $display_settings = [], $template_args = []) {
        // Сначала пробуем загрузить из темы
        $theme_template = self::get_theme_templates_path() . sanitize_file_name($template_name) . '.php';
        
        if (file_exists($theme_template)) {
            // Используем функцию из темы (с префиксом cw_)
            if (function_exists('cw_render_post_card')) {
                return cw_render_post_card($post, $template_name, $display_settings, $template_args);
            }
        }
        
        // Fallback на собственные шаблоны плагина
        $plugin_template = self::get_plugin_templates_path() . sanitize_file_name($template_name) . '.php';
        if (file_exists($plugin_template)) {
            return self::render_plugin_template($post, $template_name, $display_settings, $template_args);
        }
        
        // Fallback на default
        return self::render_plugin_template($post, 'default', $display_settings, $template_args);
    }
    
    /**
     * Рендерить шаблон плагина
     */
    private static function render_plugin_template($post, $template_name, $display_settings, $template_args) {
        // Логика рендеринга собственных шаблонов плагина
        // (копия логики из render.php блока Post Grid)
    }
}
```

### 2.3. Создание React компонентов для редактора

**Файл: `src/templates/post-cards/PostCardRender.js`**

```javascript
import { DefaultPostCard } from './default';
import { CardPostCard } from './card';
import { CardAltPostCard } from './card-alt';
import { SliderPostCard } from './slider';

export const PostCardRender = ({
    post,
    template = 'default',
    displaySettings = {},
    templateArgs = {},
}) => {
    const settings = {
        showTitle: displaySettings.showTitle !== false,
        showDate: displaySettings.showDate !== false,
        showCategory: displaySettings.showCategory !== false,
        showComments: displaySettings.showComments !== false,
        titleLength: displaySettings.titleLength || 0,
        excerptLength: displaySettings.excerptLength || 0,
    };
    
    const commonProps = {
        post,
        displaySettings: settings,
        templateArgs,
    };
    
    switch (template) {
        case 'card':
            return <CardPostCard {...commonProps} />;
        case 'card-alt':
            return <CardAltPostCard {...commonProps} />;
        case 'slider':
            return <SliderPostCard {...commonProps} />;
        default:
            return <DefaultPostCard {...commonProps} />;
    }
};
```

**Файл: `src/templates/post-cards/default.jsx`**

```javascript
import { __ } from '@wordpress/i18n';

export const DefaultPostCard = ({ post, displaySettings, templateArgs }) => {
    const { showTitle, showDate, showCategory, showComments, titleLength } = displaySettings;
    
    // Ограничение заголовка
    let title = post.title || '';
    if (titleLength > 0 && title.length > titleLength) {
        title = title.substring(0, titleLength) + '...';
    }
    
    return (
        <article>
            {post.url && (
                <figure className={`${templateArgs.hoverClasses || 'overlay overlay-1'} ${templateArgs.borderRadius || 'rounded'} mb-5`}>
                    <a href={post.linkUrl || '#'}>
                        <img src={post.url} alt={post.alt || ''} />
                    </a>
                    {templateArgs.showFigcaption !== false && (
                        <figcaption>
                            <h5 className="from-top mb-0">{__('Read More', 'codeweber-gutenberg-blocks')}</h5>
                        </figcaption>
                    )}
                </figure>
            )}
            
            <div className="post-header">
                {showCategory && post.category && (
                    <div className="post-category text-line">
                        <a href={post.categoryLink || '#'} className="hover" rel="category">
                            {post.category}
                        </a>
                    </div>
                )}
                
                {showTitle && (() => {
                    const TitleTag = displaySettings.titleTag || 'h2';
                    let titleClassName = 'post-title';
                    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(TitleTag)) {
                        titleClassName += ' ' + TitleTag;
                    } else {
                        titleClassName += ' h3'; // Fallback для p, div, span
                    }
                    titleClassName += ' mt-1 mb-3';
                    if (displaySettings.titleClass) {
                        titleClassName += ' ' + displaySettings.titleClass;
                    }
                    return (
                        <TitleTag className={titleClassName.trim()}>
                            <a className="link-dark" href={post.linkUrl || '#'}>
                                {title}
                            </a>
                        </TitleTag>
                    );
                })()}
            </div>
            
            {(showDate || showComments) && (
                <div className="post-footer">
                    <ul className="post-meta">
                        {showDate && (
                            <li className="post-date">
                                <i className="uil uil-calendar-alt"></i>
                                <span>{__('Date', 'codeweber-gutenberg-blocks')}</span>
                            </li>
                        )}
                        
                        {showComments && (
                            <li className="post-comments">
                                <a href={(post.linkUrl || '#') + '#comments'}>
                                    <i className="uil uil-comment"></i>
                                    {post.commentsCount || 0}
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </article>
    );
};
```

### 2.4. Обновление компонента управления шаблонами

**Файл: `src/components/post-grid-template/PostGridTemplateControl.js`**

Добавить:
- Управление элементами (ToggleControl для каждого элемента)
- Настройки длины заголовка и описания

```javascript
import { ToggleControl, PanelBody } from '@wordpress/components';

// Добавить в компонент:
import { ToggleControl, PanelBody, SelectControl, TextControl } from '@wordpress/components';

<PanelBody title={__('Display Elements', 'codeweber-gutenberg-blocks')} initialOpen={false}>
    <ToggleControl
        label={__('Show Title', 'codeweber-gutenberg-blocks')}
        checked={displaySettings?.showTitle !== false}
        onChange={(value) => setAttributes({ 
            templateDisplayTitle: value 
        })}
    />
    
    {displaySettings?.showTitle !== false && (
        <>
            <SelectControl
                label={__('Title Tag', 'codeweber-gutenberg-blocks')}
                value={attributes.templateTitleTag || 'h2'}
                options={[
                    { label: 'H1', value: 'h1' },
                    { label: 'H2', value: 'h2' },
                    { label: 'H3', value: 'h3' },
                    { label: 'H4', value: 'h4' },
                    { label: 'H5', value: 'h5' },
                    { label: 'H6', value: 'h6' },
                    { label: 'P', value: 'p' },
                    { label: 'DIV', value: 'div' },
                    { label: 'SPAN', value: 'span' },
                ]}
                onChange={(value) => setAttributes({ templateTitleTag: value })}
            />
            
            <TextControl
                label={__('Title CSS Class', 'codeweber-gutenberg-blocks')}
                value={attributes.templateTitleClass || ''}
                onChange={(value) => setAttributes({ templateTitleClass: value })}
                help={__('Additional CSS class for title element', 'codeweber-gutenberg-blocks')}
            />
        </>
    )}
    
    <ToggleControl
        label={__('Show Date', 'codeweber-gutenberg-blocks')}
        checked={displaySettings?.showDate !== false}
        onChange={(value) => setAttributes({ 
            templateDisplayDate: value 
        })}
    />
    <ToggleControl
        label={__('Show Category', 'codeweber-gutenberg-blocks')}
        checked={displaySettings?.showCategory !== false}
        onChange={(value) => setAttributes({ 
            templateDisplayCategory: value 
        })}
    />
    <ToggleControl
        label={__('Show Comments', 'codeweber-gutenberg-blocks')}
        checked={displaySettings?.showComments !== false}
        onChange={(value) => setAttributes({ 
            templateDisplayComments: value 
        })}
    />
</PanelBody>
```

### 2.5. Обновление block.json

**Файл: `src/blocks/post-grid/block.json`**

Добавить атрибуты:
```json
"templateDisplayTitle": {
    "type": "boolean",
    "default": true
},
"templateDisplayDate": {
    "type": "boolean",
    "default": true
},
"templateDisplayCategory": {
    "type": "boolean",
    "default": true
},
"templateDisplayComments": {
    "type": "boolean",
    "default": true
},
"templateTitleLength": {
    "type": "number",
    "default": 0
},
"templateExcerptLength": {
    "type": "number",
    "default": 0
},
"templateTitleTag": {
    "type": "string",
    "default": "h2"
},
"templateTitleClass": {
    "type": "string",
    "default": ""
}
```

### 2.6. Обновление render.php (ОПЦИОНАЛЬНО)

**Файл: `src/blocks/post-grid/render.php`**

⚠️ **ВАРИАНТ 1: Без изменений (рекомендуется для обратной совместимости)**
- Функция `render_post_grid_item()` остается без изменений
- Существующий функционал продолжает работать
- Новая система доступна опционально

**ВАРИАНТ 2: Опциональное использование новой системы**

Добавить проверку в начале функции `render_post_grid_item()`:

```php
function render_post_grid_item($post, $attributes, $image_url, $image_size, $grid_type, $col_classes) {
    // Опционально: использовать новую систему если доступна
    if (class_exists('Codeweber\Blocks\PostCardTemplates') && 
        \Codeweber\Blocks\PostCardTemplates::is_available() &&
        isset($attributes['useNewTemplates']) && 
        $attributes['useNewTemplates'] === true) {
        
        $display_settings = [
            'show_title' => $attributes['templateDisplayTitle'] ?? true,
            'show_date' => $attributes['templateDisplayDate'] ?? true,
            'show_category' => $attributes['templateDisplayCategory'] ?? true,
            'show_comments' => $attributes['templateDisplayComments'] ?? true,
            'title_tag' => $attributes['templateTitleTag'] ?? 'h2',
            'title_class' => $attributes['templateTitleClass'] ?? '',
            'title_length' => $attributes['templateTitleLength'] ?? 0,
        ];
        
        return \Codeweber\Blocks\PostCardTemplates::render(
            $post,
            $attributes['template'] ?? 'default',
            $display_settings,
            ['image_size' => $image_size]
        );
    }
    
    // Существующий код (как сейчас) - fallback
    // ... остальной код функции остается без изменений
}
```

### 2.7. Обновление edit.js (ОПЦИОНАЛЬНО)

**Файл: `src/blocks/post-grid/edit.js`**

⚠️ **Существующий код остается без изменений**

**ВАРИАНТ: Опциональное использование новой системы**

Добавить проверку в компонент `PostGridItemRender`:

```javascript
// В edit.js, при рендеринге постов:
{template === 'default' || template === 'card' || template === 'card-alt' ? (
    // Проверяем доступность новой системы
    (window.cwPostCardTemplatesAvailable && attributes.useNewTemplates) ? (
        <PostCardRender
            post={post}
            template={template}
            displaySettings={{
                showTitle: attributes.templateDisplayTitle !== false,
                showDate: attributes.templateDisplayDate !== false,
                showCategory: attributes.templateDisplayCategory !== false,
                showComments: attributes.templateDisplayComments !== false,
                titleTag: attributes.templateTitleTag || 'h2',
                titleClass: attributes.templateTitleClass || '',
            }}
            templateArgs={templateArgs}
        />
    ) : (
        // Существующий компонент (как сейчас)
        <PostGridItemRender
            post={post}
            template={template}
            // ... остальные props
        />
    )
) : (
    // Существующий ImageSimpleRender
)}
```

### 2.8. Обновление LoadMoreAPI.php (ОПЦИОНАЛЬНО)

**Файл: `inc/LoadMoreAPI.php`**

⚠️ **ВАРИАНТ 1: Без изменений (рекомендуется)**
- Метод `render_post_grid_item_ajax()` остается без изменений
- Существующий функционал продолжает работать

**ВАРИАНТ 2: Опциональное использование новой системы**

Добавить проверку в начале метода `render_post_grid_item_ajax()`:

```php
private function render_post_grid_item_ajax($post, $attributes, $image_url, $image_size, $grid_type, $col_classes) {
    // Опционально: использовать новую систему если доступна
    if (class_exists('Codeweber\Blocks\PostCardTemplates') && 
        \Codeweber\Blocks\PostCardTemplates::is_available() &&
        isset($attributes['useNewTemplates']) && 
        $attributes['useNewTemplates'] === true) {
        
        $display_settings = [
            'show_title' => $attributes['templateDisplayTitle'] ?? true,
            'show_date' => $attributes['templateDisplayDate'] ?? true,
            'show_category' => $attributes['templateDisplayCategory'] ?? true,
            'show_comments' => $attributes['templateDisplayComments'] ?? true,
            'title_tag' => $attributes['templateTitleTag'] ?? 'h2',
            'title_class' => $attributes['templateTitleClass'] ?? '',
        ];
        
        return \Codeweber\Blocks\PostCardTemplates::render(
            $post,
            $attributes['template'] ?? 'default',
            $display_settings,
            ['image_size' => $image_size]
        );
    }
    
    // Существующий код (как сейчас) - fallback
    // ... остальной код метода остается без изменений
}
```

---

## ПРЕИМУЩЕСТВА АРХИТЕКТУРЫ

1. **Централизация**: Все шаблоны в одном месте
2. **Переиспользование**: Один шаблон для темы и блоков
3. **Гибкость**: Легко добавлять новые шаблоны
4. **Управляемость**: Централизованное управление элементами
5. **Расширяемость**: Легко добавить новые элементы (Author, Tags, Excerpt и т.д.)

---

## ПОРЯДОК РЕАЛИЗАЦИИ

### Этап 1: Подготовка инфраструктуры
1. Создать папку `templates/post-cards/` в теме
2. Создать `helpers.php` с функциями управления
3. Создать базовые шаблоны (default, card, card-alt, slider)

### Этап 2: Интеграция в тему
1. Создать `functions/post-card-templates.php`
2. Обновить шорткод `blog_posts_slider`
3. Обновить компонент `lastpostslider-blog.php`
4. Обновить Single Post шаблон

### Этап 3: Интеграция в Gutenberg блок
1. Создать `PostCardTemplates.php` в плагине
2. Создать React компоненты для редактора
3. Обновить `PostGridTemplateControl` с управлением элементами
4. Обновить `render.php` и `edit.js`
5. Обновить `LoadMoreAPI.php`

### Этап 4: Тестирование
1. Проверить работу в теме
2. Проверить работу в блоке
3. Проверить совместимость шаблонов

---

## ВОПРОСЫ ДЛЯ СОГЛАСОВАНИЯ

1. Где хранить шаблоны: только в теме или дублировать в плагине?
2. Формат управления элементами: отдельные toggle для каждого или группа?
3. Нужны ли дополнительные элементы (Author, Tags, Excerpt)?
4. Как обрабатывать отсутствие шаблонов в теме (fallback)?

