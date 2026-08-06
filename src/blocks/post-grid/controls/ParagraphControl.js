import { __ } from '@wordpress/i18n';
import { SelectControl, TextControl, ComboboxControl } from '@wordpress/components';
import { ColorTypeControl } from '../../../components/colors/ColorTypeControl';
import { colors } from '../../../utilities/colors';
import {
	createSizeOptions,
	createWeightOptions,
	createTransformOptions,
} from '../../heading-subtitle/utils';

export const ParagraphControl = ({ attributes, setAttributes }) => {
	const {
		excerptColor,
		excerptColorType,
		excerptSize,
		excerptWeight,
		excerptTransform,
		excerptClass,
	} = attributes;

	return (
		<>
			<ColorTypeControl
				label={__('Paragraph Color Type', 'codeweber-gutenberg-blocks')}
				value={excerptColorType || 'solid'}
				onChange={(value) => setAttributes({ excerptColorType: value })}
				options={[
					{
						value: 'solid',
						label: __('Solid', 'codeweber-gutenberg-blocks'),
					},
					{
						value: 'soft',
						label: __('Soft', 'codeweber-gutenberg-blocks'),
					},
					{
						value: 'pale',
						label: __('Pale', 'codeweber-gutenberg-blocks'),
					},
				]}
			/>

			<ComboboxControl
				label={__('Paragraph Color', 'codeweber-gutenberg-blocks')}
				value={excerptColor || ''}
				options={colors}
				onChange={(value) => setAttributes({ excerptColor: value })}
			/>

			<SelectControl
				label={__('Paragraph Size', 'codeweber-gutenberg-blocks')}
				value={excerptSize || ''}
				options={createSizeOptions()}
				onChange={(value) => setAttributes({ excerptSize: value })}
			/>

			<SelectControl
				label={__('Paragraph Weight', 'codeweber-gutenberg-blocks')}
				value={excerptWeight || ''}
				options={createWeightOptions()}
				onChange={(value) => setAttributes({ excerptWeight: value })}
			/>

			<SelectControl
				label={__('Paragraph Transform', 'codeweber-gutenberg-blocks')}
				value={excerptTransform || ''}
				options={createTransformOptions()}
				onChange={(value) => setAttributes({ excerptTransform: value })}
			/>

			<TextControl
				label={__('Paragraph Class', 'codeweber-gutenberg-blocks')}
				value={excerptClass || ''}
				onChange={(value) => setAttributes({ excerptClass: value })}
				placeholder="mb-0"
				help={__(
					'Additional CSS classes (appended to computed classes). Only applied by templates that support it (currently: Post default/card, Modules).',
					'codeweber-gutenberg-blocks'
				)}
			/>
		</>
	);
};
