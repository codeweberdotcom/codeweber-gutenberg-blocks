/**
 * ShadowControl Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { shadowOptions } from '../../utilities/shadows';

/**
 * ShadowControl Component
 *
 * @param {Object} props
 * @param {string} props.value - Current shadow value
 * @param {Function} props.onChange - Callback when value changes
 * @param {string} props.label - Label for the control
 * @param {string} props.help - Help text
 */
export const ShadowControl = ({
	value = '',
	onChange,
	label = __('Shadow', 'codeweber-gutenberg-blocks'),
	help = '',
}) => {
	return (
		<SelectControl
			label={label}
			value={value}
			options={shadowOptions}
			onChange={onChange}
			help={help}
		/>
	);
};

export default ShadowControl;
