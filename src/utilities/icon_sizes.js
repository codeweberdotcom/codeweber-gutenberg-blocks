// icon_sizes.js
// Размеры иконок для темы Sandbox/codeweber
// Значения взяты из _icons.scss темы

/**
 * Размеры SVG иконок
 * Классы: icon-svg-{size}
 * Из темы _icons.scss:
 * - lg (default): 3rem (48px)
 * - md: 2.6rem (~42px)
 * - sm: 2.2rem (~35px)
 * - xs: 1.8rem (~29px)
 */
export const iconSvgSizes = [
	{ value: 'xs', label: 'XS (~29px)' },
	{ value: 'sm', label: 'SM (~35px)' },
	{ value: 'md', label: 'MD (~42px)' },
	{ value: 'lg', label: 'LG (48px) — default' },
];

/**
 * Стили SVG иконок
 * Классы добавляются к icon-svg
 */
export const svgIconStyles = [
	{ value: 'lineal', label: 'Lineal (outline)' },
	{ value: 'solid', label: 'Solid (filled)' },
	{ value: 'solid-mono', label: 'Solid Mono (monochrome)' },
	{ value: 'solid-duo', label: 'Solid Duo (two-color)' },
];

/**
 * Цвета иконок (из палитры темы)
 * Классы text-{color}
 */
export const iconColors = [
	{ value: '', label: 'No Color' },
	{ value: 'primary', label: 'Primary' },
	{ value: 'aqua', label: 'Aqua' },
	{ value: 'green', label: 'Green' },
	{ value: 'leaf', label: 'Leaf' },
	{ value: 'navy', label: 'Navy' },
	{ value: 'orange', label: 'Orange' },
	{ value: 'pink', label: 'Pink' },
	{ value: 'purple', label: 'Purple' },
	{ value: 'red', label: 'Red' },
	{ value: 'violet', label: 'Violet' },
	{ value: 'yellow', label: 'Yellow' },
	{ value: 'fuchsia', label: 'Fuchsia' },
	{ value: 'sky', label: 'Sky' },
	{ value: 'blue', label: 'Blue' },
	{ value: 'grape', label: 'Grape' },
	{ value: 'ash', label: 'Ash' },
	{ value: 'white', label: 'White' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'muted', label: 'Muted' },
	{ value: 'dewalt', label: 'Dewalt' },
	{ value: 'frost', label: 'Frost' },
];

/**
 * Комбинации цветов для solid-duo
 * Из _icons.scss темы
 */
export const iconDuoColors = [
	{ value: 'grape-fuchsia', label: 'Grape + Fuchsia' },
	{ value: 'grape-green', label: 'Grape + Green' },
	{ value: 'grape-yellow', label: 'Grape + Yellow' },
	{ value: 'purple-aqua', label: 'Purple + Aqua' },
	{ value: 'purple-pink', label: 'Purple + Pink' },
	{ value: 'navy-green', label: 'Navy + Green' },
	{ value: 'navy-sky', label: 'Navy + Sky' },
	{ value: 'blue-pink', label: 'Blue + Pink' },
	{ value: 'green-fuchsia', label: 'Green + Fuchsia' },
	{ value: 'green-red', label: 'Green + Red' },
	{ value: 'sky-pink', label: 'Sky + Pink' },
	{ value: 'red-yellow', label: 'Red + Yellow' },
];

/**
 * Размеры Font иконок
 * Классы fs-{число} из темы (_type.scss)
 * Формула: 0.05rem * число (при root 20px ≈ {число}px)
 */
export const iconFontSizes = [
	{ value: '', label: 'Default (inherits)' },
	{ value: 'fs-14', label: '14px' },
	{ value: 'fs-16', label: '16px' },
	{ value: 'fs-18', label: '18px' },
	{ value: 'fs-20', label: '20px' },
	{ value: 'fs-24', label: '24px' },
	{ value: 'fs-28', label: '28px' },
	{ value: 'fs-32', label: '32px' },
	{ value: 'fs-36', label: '36px' },
	{ value: 'fs-40', label: '40px' },
	{ value: 'fs-48', label: '48px' },
];

/**
 * Типы иконок
 */
export const iconTypes = [
	{ value: 'none', label: 'No Icon' },
	{ value: 'font', label: 'Font Icon (Unicons)' },
	{ value: 'svg', label: 'SVG Icon' },
	{ value: 'custom', label: 'Custom SVG' },
];

/**
 * Стили обёртки иконки
 */
export const iconWrapperStyles = [
	{ value: '', label: 'Div.icon' },
	{ value: 'btn', label: 'Square' },
	{ value: 'btn-circle', label: 'Round' },
	{ value: 'gradient', label: 'Gradient' },
];

/**
 * Размеры кнопки-обёртки
 */
export const iconBtnSizes = [
	{ value: '', label: 'Btn-md' },
	{ value: 'btn-sm', label: 'Btn-sm' },
	{ value: 'btn-lg', label: 'Btn-lg' },
];

/**
 * Варианты стиля кнопки
 */
export const iconBtnVariants = [
	{ value: 'soft', label: 'Soft' },
	{ value: 'outline', label: 'Outline' },
	{ value: 'solid', label: 'Solid' },
];
