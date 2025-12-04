/**
 * BorderRadiusControl Component
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { borderRadiusOptions } from '../../utilities/border-radius';

/**
 * BorderRadiusControl Component
 * 
 * @param {Object} props
 * @param {string} props.value - Current border radius value
 * @param {Function} props.onChange - Callback when value changes
 * @param {string} props.label - Label for the control
 * @param {string} props.help - Help text
 */
export const BorderRadiusControl = ({ 
	value = '', 
	onChange, 
	label = __('Border Radius', 'codeweber-gutenberg-blocks'),
	help = '' 
}) => {
	return (
		<SelectControl
			label={label}
			value={value}
			options={borderRadiusOptions}
			onChange={onChange}
			help={help}
		/>
	);
};

export default BorderRadiusControl;




