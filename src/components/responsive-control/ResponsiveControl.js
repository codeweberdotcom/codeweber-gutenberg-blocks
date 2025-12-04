/**
 * ResponsiveControl - универсальный компонент для адаптивных настроек
 * 
 * Поддерживает несколько вариантов UI:
 * - 'dropdown' - кнопки с выпадающими списками (как в Image Simple)
 * - 'select' - выпадающие списки SelectControl (как в Columns)
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { Icon, info } from '@wordpress/icons';
import { Tooltip } from '@wordpress/components';
import { ResponsiveDropdown } from './ResponsiveDropdown';
import { ResponsiveSelect } from './ResponsiveSelect';

/**
 * ResponsiveControl Component
 * 
 * @param {Object} props
 * @param {string} props.label - Заголовок контрола
 * @param {Array} props.breakpoints - Массив breakpoints с настройками
 * @param {string} props.variant - 'dropdown' | 'select' (по умолчанию 'dropdown')
 * @param {Function} props.onChange - Callback для изменения значений
 * @param {string} props.tooltip - Текст подсказки (опционально)
 * @param {boolean} props.showLabels - Показывать ли подписи (по умолчанию true)
 */
export const ResponsiveControl = ({
	label,
	breakpoints = [],
	variant = 'dropdown',
	onChange,
	tooltip,
	showLabels = true,
}) => {
	if (!breakpoints.length) {
		return null;
	}

	return (
		<div style={{ marginBottom: '16px' }}>
			{/* Заголовок с опциональным tooltip */}
			<div style={{ 
				marginBottom: '8px', 
				fontSize: '11px', 
				fontWeight: '500', 
				textTransform: 'uppercase', 
				color: '#1e1e1e',
				display: 'flex',
				alignItems: 'center',
				gap: '6px'
			}}>
				{label}
				{tooltip && (
					<Tooltip text={tooltip}>
						<span style={{ display: 'inline-flex', cursor: 'help' }}>
							<Icon icon={info} size={16} style={{ color: '#949494' }} />
						</span>
					</Tooltip>
				)}
			</div>

			{/* Рендер варианта UI */}
			{variant === 'dropdown' && (
				<ResponsiveDropdown
					breakpoints={breakpoints}
					onChange={onChange}
				/>
			)}

			{variant === 'select' && (
				<ResponsiveSelect
					breakpoints={breakpoints}
					onChange={onChange}
					showLabels={showLabels}
				/>
			)}
		</div>
	);
};

