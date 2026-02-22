# Анализ: иконка меню collapse «как в аккордеоне»

## 1. Как сделано в аккордеоне

### 1.1 Разметка (render.php)

- Для стилей **simple** и **background** в кнопке **нет** тега с иконкой в разметке.
- Кнопка получает класс **`collapsed`**, когда элемент закрыт:  
  `$buttonClasses[] = 'collapsed'` при `!$isOpen`.
- При открытии Bootstrap сам переключает класс `collapsed` на кнопке (accordion/collapse).

```php
// accordion/render.php
$buttonClasses = ['accordion-button'];
if ($accordionStyle !== 'plain') {
    $buttonClasses[] = 'accordion-item';
}
if (!$isOpen) {
    $buttonClasses[] = 'collapsed';
}
// ...
<button class="<?php echo esc_attr(implode(' ', $buttonClasses)); ?>" ...>
    <?php if ($accordionStyle === 'icon') : ?>
        <span class="icon"><i class="..."></i></span>  <!-- только в режиме "icon" -->
    <?php endif; ?>
    <?php echo esc_html($itemTitle); ?>
</button>
```

Итого: для обычного аккордеона иконка **не выводится в HTML** — только класс состояния на кнопке.

### 1.2 «Верхний уровень» = кнопка

Состояние открыто/закрыто задаётся **классом на самой кнопке**:

- Закрыто: **`button.collapsed`**
- Открыто: **`button:not(.collapsed)`**

Никакого отдельного класса на родительском `div` или `li` для смены иконки не используется — только кнопка.

### 1.3 Иконка только в CSS (тема)

**Переменные** (`_variables.scss`):

```scss
$accordion-icon-type: "two" !default;  // "one" — одна с поворотом, "two" — две разные
$accordion-icon-open: $icon-caret-up !default;
$accordion-icon-close: $icon-caret-down !default;
// + type-1, type-2, type-3 с разными кодами иконок
```

**Стили** (`_accordion.scss`): одна псевдо-иконка `::before` у кнопки, содержимое меняется от состояния:

```scss
.accordion-wrapper .card-header button {
  &:before {
    font-family: $font-family-unicons;
    content: $accordion-icon-close;  // по умолчанию
    // позиция, размер, цвет...
  }

  &.collapsed:before {
    content: $accordion-icon-close;   // закрыто
    transform: translateY(-50%);
  }

  &:not(.collapsed):before {
    content: $accordion-icon-open;    // открыто
    transform: translateY(-50%);
  }
}
```

Тип набора иконок задаётся классом на **обёртке** (`.accordion-wrapper.type-1`, `.type-2`, `.type-3`), а не в разметке кнопки.

### 1.4 Схема аккордеона

| Что | Где | Как |
|-----|-----|-----|
| Состояние | Кнопка | Класс `.collapsed` (закрыто) / `:not(.collapsed)` (открыто) |
| Иконка | Не в HTML | Один `::before` у кнопки |
| Какая иконка | Тема, CSS | `content` из переменных; выбор набора — класс на `.accordion-wrapper` (type-1/2/3) |

---

## 2. Что сейчас в меню collapse

- В разметке кнопки есть **жёстко заданная** иконка:
  - `<span class="toggle_block"><i class="uil uil-angle-down sidebar-catalog-icon"></i></span>`
- В теме для открытого состояния используется **поворот** одной иконки:
  - `&[aria-expanded="true"] .sidebar-catalog-icon { transform: rotate(180deg); }`

Отличия от аккордеона:

- Иконка **в верстке** (тег `<i>` с классом).
- Состояние можно понять только по `aria-expanded` у кнопки (класса типа `collapsed` нет).
- Одна иконка, вторая «получается» поворотом.

---

## 3. Как сделать в меню «как в аккордеоне»

### 3.1 Общий подход

Повторить идею аккордеона:

1. **Иконки не в разметке** — один псевдоэлемент `::before` у кнопки (или у обёртки иконки), содержимое из CSS.
2. **Состояние через класс на кнопке** — закрыто = класс (например `collapsed`), открыто = без него.
3. **Какие именно иконки** — переменные/классы в теме (как type-1/2/3 у аккордеона), без жёстких классов в PHP.

### 3.2 Разметка (render.php)

**Убрать** из кнопки меню текущую иконку:

```html
<!-- было -->
<span class="toggle_block" aria-hidden="true">
  <i class="uil uil-angle-down sidebar-catalog-icon"></i>
</span>
```

**Сделать** пустой контейнер для псевдо-иконки (чтобы не вешать `::before` на саму кнопку, если нужна своя обёртка) или вообще без контейнера:

Вариант A — только кнопка, иконка на кнопке:

```html
<button type="button" class="btn-collapse collapsed" ...>
  <!-- пусто, иконка в CSS ::before на .btn-collapse -->
</button>
```

Вариант B — оставить обёртку для выравнивания (как сейчас), иконка на обёртке:

```html
<button type="button" class="btn-collapse collapsed" ...>
  <span class="toggle_block" aria-hidden="true"></span>
</button>
```

В обоих вариантах в HTML **нет** классов типа `uil uil-angle-down` — только семантика (`.btn-collapse`, при необходимости `.toggle_block`).

### 3.3 Класс состояния на кнопке

В аккордеоне состояние = **класс на кнопке** (`collapsed`).

В меню при первом рендере уже есть флаг `$expand`. Нужно:

- При **закрытом** по умолчанию: выводить кнопку с классом **`collapsed`**.
- При **открытом** по умолчанию: без `collapsed`.

При клике Bootstrap меняет только `aria-expanded` и класс `show` у блока collapse; класс `collapsed` на нашей кнопке сам по себе не переключается. Поэтому возможны два пути:

**Вариант 1 — только CSS по `aria-expanded` (без JS):**

- В разметке по желанию можно не добавлять `collapsed` вообще.
- В теме:
  - `.menu-collapse-nav .btn-collapse[aria-expanded="false"]::before { content: ... }` — закрыто,
  - `.menu-collapse-nav .btn-collapse[aria-expanded="true"]::before { content: ... }` — открыто.

Поведение как у аккордеона по смыслу (две разные иконки из CSS), но «верхний уровень» для состояния — сама кнопка через атрибут, а не класс.

**Вариант 2 — как в аккордеоне: класс `collapsed` на кнопке + JS:**

- В render при `!$expand` добавлять кнопке класс `collapsed`, при `$expand` — не добавлять.
- Подписаться на события Bootstrap:
  - при `shown.bs.collapse` у соответствующего `#menu-collapse-item-...` с кнопки снять `collapsed`;
  - при `hidden.bs.collapse` — добавить `collapsed`.
- В CSS использовать только класс:  
  `.menu-collapse-nav .btn-collapse.collapsed::before { ... }` и  
  `.menu-collapse-nav .btn-collapse:not(.collapsed)::before { ... }`.

Тогда механизм полностью совпадает с аккордеоном: состояние = класс на кнопке, без привязки к `aria-expanded` в стилях.

### 3.4 Тема: переменные и стили (как в аккордеоне)

В **`_variables.scss`** (или отдельный файл переменных темы) завести переменные для меню:

```scss
// Иконки collapse-меню (как в аккордеоне)
$menu-collapse-icon-open:  $icon-caret-up   !default;
$menu-collapse-icon-close: $icon-caret-down  !default;
// при необходимости тип: одна с поворотом / две разные
$menu-collapse-icon-type:  "two" !default;
```

В **`_blog.scss`** (или общий файл, где стилизуется `.menu-collapse-nav`):

- Один `::before` у `.btn-collapse` (или у `.toggle_block`, смотря куда решили вешать).
- Шрифт иконок, размер, позиция — по аналогии с аккордеоном.
- Содержимое в зависимости от состояния:
  - при **Варианте 1**: `[aria-expanded="false"]::before` / `[aria-expanded="true"]::before`;
  - при **Варианте 2**: `.collapsed::before` / `:not(.collapsed)::before`.

Иконки не прописываются в верстке — только в этих переменных и в CSS.

### 3.5 Опционально: типы иконок (type-1 / type-2)

По аналогии с аккордеоном можно на верхний уровень (например, на `nav.menu-collapse-nav`) вешать класс типа:

- `.menu-collapse-nav.icon-type-1` — один набор (caret up/down),
- `.menu-collapse-nav.icon-type-2` — другой (другие коды из переменных).

Тогда в разметке блока по-прежнему **никаких** классов иконок; выбор набора — класс контейнера + переменные/правила в теме.

---

## 4. Сводка: что брать из аккордеона

| Элемент | В аккордеоне | В меню collapse (цель) |
|--------|---------------|-------------------------|
| Иконка в HTML | Нет (кроме режима «icon» с кастомной иконкой) | Убрать, оставить пустой контейнер или ничего |
| Состояние | Класс `.collapsed` на кнопке | Либо тот же класс + JS, либо только `aria-expanded` в CSS |
| Где рисуется иконка | `::before` у кнопки | `::before` у `.btn-collapse` (или у `.toggle_block`) |
| Какие иконки | Переменные в теме + класс типа на wrapper | Те же переменные (или свои для меню) + при желании класс типа на `.menu-collapse-nav` |

Итог: «сделать как в аккордеоне» = убрать иконку из верстки, вешать одну псевдо-иконку в CSS, переключать её по классу на кнопке (или по `aria-expanded`), конкретные глифы задавать в теме переменными/классами верхнего уровня, без жёсткого прописывания иконки в разметке.
