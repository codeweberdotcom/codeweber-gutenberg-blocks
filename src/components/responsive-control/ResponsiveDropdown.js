/**
 * ResponsiveDropdown - вариант с кнопками и выпадающими списками
 * Используется в Image Simple для Items Per View
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { Button, Dropdown } from '@wordpress/components';
import { Icon, chevronDown } from '@wordpress/icons';

/**
 * ResponsiveDropdown Component
 * 
 * @param {Object} props
 * @param {Array} props.breakpoints - Массив breakpoints
 * @param {Function} props.onChange - Callback для изменения
 */
export const ResponsiveDropdown = ({ breakpoints, onChange }) => {
	return (
		<div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
			{breakpoints.map((bp) => {
				// Нормализуем options - если это массив строк, конвертируем в объекты
				const normalizedOptions = bp.options.map(opt => {
					if (typeof opt === 'string') {
						return { value: opt, label: opt === '' ? (bp.defaultLabel || __('Нет', 'codeweber-gutenberg-blocks')) : opt };
					}
					return opt;
				});

				return (
					<Dropdown
						key={bp.key}
						position="bottom center"
						renderToggle={({ isOpen, onToggle }) => (
							<Button
								variant={bp.value && bp.value !== '' ? 'primary' : 'secondary'}
								onClick={onToggle}
								aria-expanded={isOpen}
								style={{ 
									minWidth: '44px', 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'center', 
									gap: '2px' 
								}}
							>
								{bp.label}
								<span style={{ fontSize: '10px', opacity: 0.7 }}>
									{bp.value === '' ? (bp.defaultLabel || __('Нет', 'codeweber-gutenberg-blocks')) : bp.value}
								</span>
								<Icon icon={chevronDown} size={12} />
							</Button>
						)}
						renderContent={({ onClose }) => (
							<div style={{ padding: '8px', minWidth: '80px' }}>
								{normalizedOptions.map((opt) => (
									<Button
										key={opt.value}
										onClick={() => {
											onChange(bp.attribute, opt.value);
											onClose();
										}}
										variant={bp.value === opt.value ? 'primary' : 'tertiary'}
										style={{ 
											width: '100%', 
											marginBottom: '4px',
											justifyContent: 'flex-start'
										}}
									>
										{opt.label}
									</Button>
								))}
							</div>
						)}
					/>
				);
			})}
		</div>
	);
};

