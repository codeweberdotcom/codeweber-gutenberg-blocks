import { __ } from '@wordpress/i18n';
import {
	SelectControl,
	TextControl,
	ComboboxControl,
	ToggleControl,
} from '@wordpress/components';
import { TagControl } from '../../../components/tag';
import { ColorTypeControl } from '../../../components/colors/ColorTypeControl';
import { colors } from '../../../utilities/colors';
import {
	createSizeOptions,
	createWeightOptions,
	createTransformOptions,
} from '../../heading-subtitle/utils';

export const TitleControl = ({ attributes, setAttributes }) => {
	const {
		titleTag,
		titleColor,
		titleColorType,
		titleSize,
		titleWeight,
		titleTransform,
		titleClass,
		useAltTitle = false,
	} = attributes;

	return (
		<>
			<TagControl
				label={__('Title Tag', 'codeweber-gutenberg-blocks')}
				value={titleTag}
				onChange={(value) => setAttributes({ titleTag: value })}
				type="heading"
			/>

			<ColorTypeControl
				label={__('Title Color Type', 'codeweber-gutenberg-blocks')}
				value={titleColorType || 'solid'}
				onChange={(value) => setAttributes({ titleColorType: value })}
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
				label={__('Title Color', 'codeweber-gutenberg-blocks')}
				value={titleColor || ''}
				options={colors}
				onChange={(value) => setAttributes({ titleColor: value })}
			/>

			<SelectControl
				label={__('Title Size', 'codeweber-gutenberg-blocks')}
				value={titleSize || ''}
				options={createSizeOptions()}
				onChange={(value) => setAttributes({ titleSize: value })}
			/>

			<SelectControl
				label={__('Title Weight', 'codeweber-gutenberg-blocks')}
				value={titleWeight || ''}
				options={createWeightOptions()}
				onChange={(value) => setAttributes({ titleWeight: value })}
			/>

			<SelectControl
				label={__('Title Transform', 'codeweber-gutenberg-blocks')}
				value={titleTransform || ''}
				options={createTransformOptions()}
				onChange={(value) => setAttributes({ titleTransform: value })}
			/>

			<TextControl
				label={__('Title Class', 'codeweber-gutenberg-blocks')}
				value={titleClass || ''}
				onChange={(value) => setAttributes({ titleClass: value })}
				placeholder="mt-1 mb-3"
				help={__(
					'Additional CSS classes (appended to computed classes).',
					'codeweber-gutenberg-blocks'
				)}
			/>

			<ToggleControl
				label={__('Use Alternative Title', 'codeweber-gutenberg-blocks')}
				checked={useAltTitle}
				onChange={(value) => setAttributes({ useAltTitle: value })}
				help={__(
					'Use the HTML-capable "Alternative Title" meta field instead of the post title. Edit it in the post sidebar.',
					'codeweber-gutenberg-blocks'
				)}
			/>
		</>
	);
};
