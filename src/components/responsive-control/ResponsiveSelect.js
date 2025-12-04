/**
 * ResponsiveSelect - вариант с выпадающими списками SelectControl
 * Используется в Columns для адаптивных колонок
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

/**
 * ResponsiveSelect Component
 * 
 * @param {Object} props
 * @param {Array} props.breakpoints - Массив breakpoints
 * @param {Function} props.onChange - Callback для изменения
 * @param {boolean} props.showLabels - Показывать ли лейблы
 */
export const ResponsiveSelect = ({ breakpoints, onChange, showLabels = true }) => {
	return (
		<div className="component-sidebar-group">
			{breakpoints.map((bp) => {
				// Нормализуем options - если это массив строк, конвертируем в объекты
				const normalizedOptions = bp.options.map(opt => {
					if (typeof opt === 'string') {
						return { value: opt, label: opt === '' ? (bp.defaultLabel || __('Default', 'codeweber-gutenberg-blocks')) : opt };
					}
					return opt;
				});

				return (
					<SelectControl
						key={bp.key}
						label={showLabels ? bp.label : undefined}
						value={bp.value}
						options={normalizedOptions}
						onChange={(value) => onChange(bp.attribute, value)}
					/>
				);
			})}
		</div>
	);
};

