/**
 * IconRender - Компонент рендеринга иконки
 *
 * Поддерживает:
 * - Font Icons (Unicons)
 * - SVG Icons (lineal, solid, solid-mono, solid-duo)
 * - Кастомные SVG (из Media Library)
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { getSvgIconPath } from '../../utilities/svg_icons';
import { InlineSvg } from './InlineSvg';

/**
 * Генерация классов для Font Icon
 * @param {Object} props - Свойства иконки
 * @returns {string} - CSS классы
 */
const getFontIconClasses = ({
	iconName,
	iconFontSize = '',
	iconColor = '',
	iconClass = '',
}) => {
	const classes = ['uil', `uil-${iconName}`];

	// Размер через класс fs-* из темы
	if (iconFontSize) {
		classes.push(iconFontSize);
	}

	if (iconColor) {
		classes.push(`text-${iconColor}`);
	}

	if (iconClass) {
		classes.push(iconClass);
	}

	return classes.filter(Boolean).join(' ');
};

/**
 * Генерация классов для SVG Icon
 * @param {Object} props - Свойства иконки
 * @returns {string} - CSS классы
 */
const getSvgIconClasses = ({
	svgStyle = 'lineal',
	iconSize = 'xs',
	iconColor = '',
	iconColor2 = '',
	iconClass = '',
	isEditor = false,
}) => {
	// В редакторе НЕ добавляем svg-inject (иначе иконка скрыта через CSS)
	// На фронте svg-inject нужен для SVGInject библиотеки
	const classes = isEditor ? ['icon-svg'] : ['svg-inject', 'icon-svg'];

	// Размер
	if (iconSize) {
		classes.push(`icon-svg-${iconSize}`);
	}

	// Стиль и цвет
	switch (svgStyle) {
		case 'solid':
			classes.push('solid');
			if (iconColor) {
				classes.push(`text-${iconColor}`);
			}
			break;
		case 'solid-mono':
			classes.push('solid-mono');
			if (iconColor) {
				classes.push(`text-${iconColor}`);
			}
			break;
		case 'solid-duo':
			classes.push('solid-duo');
			if (iconColor && iconColor2) {
				classes.push(`text-${iconColor}-${iconColor2}`);
			} else if (iconColor) {
				classes.push(`text-${iconColor}`);
			}
			break;
		case 'lineal':
		default:
			if (iconColor) {
				classes.push(`text-${iconColor}`);
			}
			break;
	}

	if (iconClass) {
		classes.push(iconClass);
	}

	return classes.filter(Boolean).join(' ');
};

/**
 * Генерация классов для обёртки иконки
 * @param {Object} props - Свойства обёртки
 * @returns {string} - CSS классы
 */
const getWrapperClasses = ({
	iconColor = '',
	iconFontSize = '',
	wrapperStyle = '',
	btnSize = '',
	btnVariant = 'soft',
	wrapperClass = '',
	gradientColor = 'gradient-1',
}) => {
	const classes = ['icon'];

	// Стиль обёртки: кнопка
	if (wrapperStyle === 'btn' || wrapperStyle === 'btn-circle') {
		classes.push('btn');
		classes.push('btn-block');
		classes.push('flex-shrink-0'); // Предотвращаем сжатие в flex-контейнерах

		// Круглая кнопка
		if (wrapperStyle === 'btn-circle') {
			classes.push('btn-circle');
		}

		// Вариант кнопки с цветом
		if (iconColor) {
			if (btnVariant === 'soft') {
				classes.push(`btn-soft-${iconColor}`);
			} else if (btnVariant === 'outline') {
				classes.push(`btn-outline-${iconColor}`);
			} else {
				classes.push(`btn-${iconColor}`);
			}
		}

		// Размер кнопки
		if (btnSize) {
			classes.push(btnSize);
		}
	} else if (wrapperStyle === 'gradient') {
		// Градиентная кнопка
		classes.push('btn');
		classes.push('btn-block');
		classes.push('btn-gradient');
		classes.push('flex-shrink-0');
		
		// Добавляем класс градиента
		if (gradientColor.startsWith('gradient-')) {
			classes.push(gradientColor);
		} else {
			classes.push(`gradient-${gradientColor}`);
		}

		// Размер кнопки
		if (btnSize) {
			classes.push(btnSize);
		}
	} else {
		// Обычная обёртка div.icon
		if (iconColor) {
			classes.push(`text-${iconColor}`);
		}
	}

	// Размер fs-* для font иконок с обёрткой
	if (iconFontSize) {
		classes.push(iconFontSize);
	}

	if (wrapperClass) {
		classes.push(wrapperClass);
	}

	return classes.filter(Boolean).join(' ');
};

/**
 * IconRender Component
 *
 * @param {Object} props
 * @param {string} props.iconType - Тип иконки: 'none', 'font', 'svg', 'custom'
 * @param {string} props.iconName - Имя Font иконки (без префикса uil-)
 * @param {string} props.svgIcon - Имя SVG иконки
 * @param {string} props.svgStyle - Стиль SVG: 'lineal', 'solid', 'solid-mono', 'solid-duo'
 * @param {string} props.iconSize - Размер SVG: 'xs', 'sm', 'md', 'lg'
 * @param {string} props.iconFontSize - Размер Font: 'fs-24', 'fs-28', etc.
 * @param {string} props.iconColor - Основной цвет из палитры
 * @param {string} props.iconColor2 - Второй цвет для solid-duo
 * @param {string} props.iconClass - Дополнительные классы
 * @param {boolean} props.iconWrapper - Обернуть в div.icon
 * @param {string} props.iconWrapperStyle - Стиль обёртки: '', 'btn', 'btn-circle'
 * @param {string} props.iconBtnSize - Размер кнопки: '', 'btn-sm', 'btn-lg'
 * @param {string} props.iconBtnVariant - Вариант кнопки: 'soft', 'outline', 'solid'
 * @param {string} props.iconWrapperClass - Классы обёртки
 * @param {string} props.customSvgUrl - URL кастомного SVG
 * @param {string} props.customSvgId - ID кастомного SVG из Media Library
 * @param {string} props.blockAlign - Выравнивание блока (для save.js)
 * @param {string} props.blockClass - Дополнительные классы блока (для save.js)
 * @param {string} props.blockData - Data-атрибуты блока (для save.js)
 * @param {string} props.blockId - ID блока (для save.js)
 * @param {boolean} props.isEditor - Рендеринг в редакторе (для edit.js)
 * @returns {JSX.Element|null}
 */
export const IconRender = ({
	iconType = 'none',
	iconName = '',
	svgIcon = '',
	svgStyle = 'lineal',
	iconSize = 'xs',
	iconFontSize = '',
	iconColor = '',
	iconColor2 = '',
	iconClass = '',
	iconWrapper = false,
	iconWrapperStyle = '',
	iconBtnSize = '',
	iconBtnVariant = 'soft',
	iconWrapperClass = '',
	iconGradientColor = 'gradient-1',
	customSvgUrl = '',
	customSvgId = null,
	blockAlign = '',
	blockClass = '',
	blockData = '',
	blockId = '',
	isEditor = false,
}) => {
	// Ничего не рендерим если тип none или нет данных
	if (iconType === 'none') {
		return null;
	}

	let iconElement = null;

	// Определяем, нужен ли цвет на иконке
	// Для Solid-кнопок иконка должна быть белой (без цвета)
	const isButtonWrapper = iconWrapper && (iconWrapperStyle === 'btn' || iconWrapperStyle === 'btn-circle');
	const shouldApplyColorToIcon = !isButtonWrapper || iconBtnVariant !== 'solid';

	// Font Icon
	if (iconType === 'font' && iconName) {
		const classes = getFontIconClasses({
			iconName,
			iconFontSize: iconWrapper ? '' : iconFontSize, // Размер на обёртке если wrapper
			iconColor: shouldApplyColorToIcon ? iconColor : '', // Цвет только если не Solid-кнопка
			iconClass: iconClass, // Всегда применяется к иконке
		});

		iconElement = <i className={classes}></i>;
	}

	// SVG Icon
	if (iconType === 'svg' && svgIcon) {
		const svgClasses = getSvgIconClasses({
			svgStyle,
			iconSize,
			iconColor: shouldApplyColorToIcon ? iconColor : '', // Цвет только если не Solid-кнопка
			iconColor2: shouldApplyColorToIcon ? iconColor2 : '',
			iconClass: iconClass, // Всегда применяется к иконке
			isEditor,
		});

		const svgPath = getSvgIconPath(svgIcon, svgStyle);

		// Для solid иконок нужно сохранять классы fill-primary/fill-secondary
		const isSolidStyle = svgStyle === 'solid' || svgStyle === 'solid-mono' || svgStyle === 'solid-duo';

		// В редакторе используем InlineSvg для поддержки CSS цветов
		if (isEditor) {
			iconElement = (
				<InlineSvg
					src={svgPath}
					className={svgClasses}
					alt={svgIcon}
					preserveFillClasses={isSolidStyle}
				/>
			);
		} else {
			// На фронте используем img с svg-inject для SVGInject библиотеки
			iconElement = (
				<img
					src={svgPath}
					className={svgClasses}
					alt=""
				/>
			);
		}
	}

	// Custom SVG
	if (iconType === 'custom' && customSvgUrl) {
		const svgClasses = getSvgIconClasses({
			svgStyle: 'lineal', // Кастомные как lineal
			iconSize,
			iconColor: shouldApplyColorToIcon ? iconColor : '', // Цвет только если не Solid-кнопка
			iconColor2: '',
			iconClass: iconClass, // Всегда применяется к иконке
			isEditor,
		});

		// В редакторе используем InlineSvg
		if (isEditor) {
			iconElement = (
				<InlineSvg
					src={customSvgUrl}
					className={svgClasses}
					alt="custom icon"
				/>
			);
		} else {
			iconElement = (
				<img
					src={customSvgUrl}
					className={svgClasses}
					alt=""
				/>
			);
		}
	}

	// Если нет элемента — выходим
	if (!iconElement) {
		return null;
	}

	// Парсим data-атрибуты блока (для save.js)
	const dataAttributes = {};
	if (!isEditor && blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	// Обёртка
	if (iconWrapper) {
		const wrapperClasses = getWrapperClasses({
			iconColor: iconColor,
			iconFontSize: iconType === 'font' ? iconFontSize : '',
			wrapperStyle: iconWrapperStyle,
			btnSize: iconBtnSize,
			btnVariant: iconBtnVariant,
			wrapperClass: iconWrapperClass, // Только классы обёртки, iconClass идёт на саму иконку
			gradientColor: iconGradientColor,
		});

		// Добавляем классы и атрибуты блока к обёртке (для save.js)
		const finalClasses = !isEditor && (blockAlign || blockClass)
			? [
				wrapperClasses,
				blockAlign ? `text-${blockAlign}` : '',
				blockClass,
			].filter(Boolean).join(' ')
			: wrapperClasses;

		return (
			<div 
				className={finalClasses}
				id={!isEditor && blockId ? blockId : undefined}
				{...(!isEditor ? dataAttributes : {})}
			>
				{iconElement}
			</div>
		);
	}

	// Без обёртки - применяем атрибуты блока к самой иконке (для save.js)
	if (!isEditor && (blockAlign || blockClass || blockId || Object.keys(dataAttributes).length > 0)) {
		// Для Font Icon (<i>)
		if (iconType === 'font' && iconName) {
			const classes = getFontIconClasses({
				iconName,
				iconFontSize,
				iconColor,
				iconClass: [iconClass, blockAlign ? `text-${blockAlign}` : '', blockClass].filter(Boolean).join(' '),
			});

			return (
				<i 
					className={classes}
					id={blockId || undefined}
					{...dataAttributes}
				></i>
			);
		}

		// Для SVG иконок обёртку в span
		return (
			<span
				className={[blockAlign ? `text-${blockAlign}` : '', blockClass].filter(Boolean).join(' ') || undefined}
				id={blockId || undefined}
				{...dataAttributes}
			>
				{iconElement}
			</span>
		);
	}

	return iconElement;
};

/**
 * IconRenderSave - Версия для save.js (статический HTML)
 * Идентична IconRender, но без React-специфичных особенностей
 */
export const IconRenderSave = (props) => {
	return <IconRender {...props} isEditor={false} />;
};

export default IconRender;

