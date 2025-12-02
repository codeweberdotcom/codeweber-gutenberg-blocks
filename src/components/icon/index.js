/**
 * Icon Component - Exports
 *
 * @package CodeWeber Gutenberg Blocks
 */

// Стили редактора
import './editor.scss';

// Компоненты
export { IconRender, IconRenderSave } from './IconRender';
export { IconPicker } from './IconPicker';
export { IconControl } from './IconControl';
export { InlineSvg } from './InlineSvg';

// Утилиты (реэкспорт для удобства)
export {
	svgIconsLineal,
	svgIconsSolid,
	allSvgIcons,
	getSvgIconPath,
} from '../../utilities/svg_icons';

export {
	iconSvgSizes,
	iconFontSizes,
	iconColors,
	iconDuoColors,
	iconTypes,
	svgIconStyles,
	iconWrapperStyles,
	iconBtnSizes,
	iconBtnVariants,
} from '../../utilities/icon_sizes';

export { fontIcons } from '../../utilities/font_icon';
export { fontIconsSocial } from '../../utilities/font_icon_social';

/**
 * Дефолтные атрибуты для блоков с иконкой
 *
 * Использование в block.json:
 * import { iconAttributes } from '../../components/icon';
 * attributes: { ...iconAttributes('icon'), ...otherAttributes }
 *
 * @param {string} prefix - Префикс атрибутов
 * @returns {Object} - Объект атрибутов
 */
export const iconAttributes = (prefix = '') => {
	const p = prefix ? `${prefix}` : '';
	const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
	const attr = (name) => (p ? `${p}${capitalize(name)}` : name);

	return {
		[attr('iconType')]: {
			type: 'string',
			default: 'none',
		},
		[attr('iconName')]: {
			type: 'string',
			default: '',
		},
		[attr('svgIcon')]: {
			type: 'string',
			default: '',
		},
		[attr('svgStyle')]: {
			type: 'string',
			default: 'lineal',
		},
		[attr('iconSize')]: {
			type: 'string',
			default: 'xs',
		},
		[attr('iconFontSize')]: {
			type: 'string',
			default: '',
		},
		[attr('iconColor')]: {
			type: 'string',
			default: '',
		},
		[attr('iconColor2')]: {
			type: 'string',
			default: '',
		},
		[attr('iconClass')]: {
			type: 'string',
			default: '',
		},
		[attr('iconWrapper')]: {
			type: 'boolean',
			default: false,
		},
		[attr('iconWrapperStyle')]: {
			type: 'string',
			default: '',
		},
		[attr('iconBtnSize')]: {
			type: 'string',
			default: '',
		},
		[attr('iconBtnVariant')]: {
			type: 'string',
			default: 'soft',
		},
		[attr('iconWrapperClass')]: {
			type: 'string',
			default: '',
		},
		[attr('customSvgUrl')]: {
			type: 'string',
			default: '',
		},
		[attr('customSvgId')]: {
			type: 'number',
			default: null,
		},
	};
};

/**
 * Генератор атрибутов для block.json (JSON-совместимый формат)
 */
export const iconAttributesJson = (prefix = '') => {
	const attrs = iconAttributes(prefix);
	// Преобразуем для JSON (убираем default: null -> default: 0)
	Object.keys(attrs).forEach((key) => {
		if (attrs[key].default === null) {
			attrs[key].default = 0;
		}
	});
	return attrs;
};

