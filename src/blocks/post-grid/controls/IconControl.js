import { __ } from '@wordpress/i18n';
import { SelectControl, TextControl, ComboboxControl } from '@wordpress/components';
import { colors } from '../../../utilities/colors';
import { iconFontSizes } from '../../../utilities/icon_sizes';

// Icon styling for card templates that render a dynamic icon (currently:
// Modules — icon name/base color come from the module's own meta, this
// just overrides color/size/extra classes). Unlike the full Icon block
// control, there's no type/picker here — the icon itself is chosen per
// post, not per block.
export const IconControl = ({ attributes, setAttributes }) => {
	const { iconColor, iconFontSize, iconClass } = attributes;

	return (
		<>
			<ComboboxControl
				label={__('Icon Color', 'codeweber-gutenberg-blocks')}
				value={iconColor || ''}
				options={colors}
				onChange={(value) => setAttributes({ iconColor: value || '' })}
				help={__(
					'Leave empty to use each item’s own color.',
					'codeweber-gutenberg-blocks'
				)}
			/>

			<SelectControl
				label={__('Icon Size', 'codeweber-gutenberg-blocks')}
				value={iconFontSize || ''}
				options={iconFontSizes}
				onChange={(value) => setAttributes({ iconFontSize: value })}
			/>

			<TextControl
				label={__('Icon Class', 'codeweber-gutenberg-blocks')}
				value={iconClass || ''}
				onChange={(value) => setAttributes({ iconClass: value })}
				placeholder="me-2"
				help={__(
					'Additional CSS classes (appended to computed classes). Only applied by templates that support it (currently: Modules).',
					'codeweber-gutenberg-blocks'
				)}
			/>
		</>
	);
};
