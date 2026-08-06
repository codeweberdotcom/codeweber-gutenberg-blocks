import { __ } from '@wordpress/i18n';
import { SelectControl, TextControl, ComboboxControl } from '@wordpress/components';
import { ColorTypeControl } from '../../../components/colors/ColorTypeControl';
import { colors } from '../../../utilities/colors';
import {
	createSizeOptions,
	createWeightOptions,
	createTransformOptions,
} from '../../heading-subtitle/utils';

// Typography controls for the card's "subtitle" — the category/taxonomy
// term text shown near the title (post-category, etc.). Mirrors
// TitleControl/ParagraphControl.
export const SubtitleControl = ({ attributes, setAttributes }) => {
	const {
		categoryColor,
		categoryColorType,
		categorySize,
		categoryWeight,
		categoryTransform,
		categoryClass,
	} = attributes;

	return (
		<>
			<ColorTypeControl
				label={__('Subtitle Color Type', 'codeweber-gutenberg-blocks')}
				value={categoryColorType || 'solid'}
				onChange={(value) => setAttributes({ categoryColorType: value })}
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
				label={__('Subtitle Color', 'codeweber-gutenberg-blocks')}
				value={categoryColor || ''}
				options={colors}
				onChange={(value) => setAttributes({ categoryColor: value })}
			/>

			<SelectControl
				label={__('Subtitle Size', 'codeweber-gutenberg-blocks')}
				value={categorySize || ''}
				options={createSizeOptions()}
				onChange={(value) => setAttributes({ categorySize: value })}
			/>

			<SelectControl
				label={__('Subtitle Weight', 'codeweber-gutenberg-blocks')}
				value={categoryWeight || ''}
				options={createWeightOptions()}
				onChange={(value) => setAttributes({ categoryWeight: value })}
			/>

			<SelectControl
				label={__('Subtitle Transform', 'codeweber-gutenberg-blocks')}
				value={categoryTransform || ''}
				options={createTransformOptions()}
				onChange={(value) => setAttributes({ categoryTransform: value })}
			/>

			<TextControl
				label={__('Subtitle Class', 'codeweber-gutenberg-blocks')}
				value={categoryClass || ''}
				onChange={(value) => setAttributes({ categoryClass: value })}
				placeholder="text-uppercase fs-sm"
				help={__(
					'Styles the category/taxonomy text shown on the card. Only applied by templates that support it (currently: Post default/card, Modules).',
					'codeweber-gutenberg-blocks'
				)}
			/>
		</>
	);
};
