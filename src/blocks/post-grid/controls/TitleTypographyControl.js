import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	SelectControl,
	TextControl,
	ComboboxControl,
	ToggleControl,
	ButtonGroup,
	Button,
} from '@wordpress/components';
import { TagControl } from '../../../components/tag';
import { ColorTypeControl } from '../../../components/colors/ColorTypeControl';
import { colors } from '../../../utilities/colors';
import {
	createSizeOptions,
	createWeightOptions,
	createTransformOptions,
} from '../../heading-subtitle/utils';

// Title / Subtitle (category) / Paragraph (excerpt) typography in one tab,
// switched by an inner ButtonGroup — mirrors HeadingTypographyControl
// (components/heading), the same pattern used by the "Title" block.
const ColorTypeOptions = [
	{ value: 'solid', label: __('Solid', 'codeweber-gutenberg-blocks') },
	{ value: 'soft', label: __('Soft', 'codeweber-gutenberg-blocks') },
	{ value: 'pale', label: __('Pale', 'codeweber-gutenberg-blocks') },
];

export const TitleTypographyControl = ({ attributes, setAttributes }) => {
	const {
		titleTag,
		titleColor,
		titleColorType,
		titleSize,
		titleWeight,
		titleTransform,
		titleClass,
		useAltTitle = false,
		categoryColor,
		categoryColorType,
		categorySize,
		categoryWeight,
		categoryTransform,
		categoryClass,
		excerptColor,
		excerptColorType,
		excerptSize,
		excerptWeight,
		excerptTransform,
		excerptClass,
	} = attributes;

	const [activeTab, setActiveTab] = useState('title');

	return (
		<>
			<ButtonGroup style={{ marginBottom: '16px' }}>
				<Button
					isPrimary={activeTab === 'title'}
					onClick={() => setActiveTab('title')}
				>
					{__('Title', 'codeweber-gutenberg-blocks')}
				</Button>
				<Button
					isPrimary={activeTab === 'subtitle'}
					onClick={() => setActiveTab('subtitle')}
				>
					{__('Subtitle', 'codeweber-gutenberg-blocks')}
				</Button>
				<Button
					isPrimary={activeTab === 'paragraph'}
					onClick={() => setActiveTab('paragraph')}
				>
					{__('Paragraph', 'codeweber-gutenberg-blocks')}
				</Button>
			</ButtonGroup>

			{activeTab === 'title' && (
				<>
					<TagControl
						label={__('Title Tag', 'codeweber-gutenberg-blocks')}
						value={titleTag}
						onChange={(value) => setAttributes({ titleTag: value })}
						type="heading"
					/>

					<ColorTypeControl
						label={__(
							'Title Color Type',
							'codeweber-gutenberg-blocks'
						)}
						value={titleColorType || 'solid'}
						onChange={(value) =>
							setAttributes({ titleColorType: value })
						}
						options={ColorTypeOptions}
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
						label={__(
							'Title Transform',
							'codeweber-gutenberg-blocks'
						)}
						value={titleTransform || ''}
						options={createTransformOptions()}
						onChange={(value) =>
							setAttributes({ titleTransform: value })
						}
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
						label={__(
							'Use Alternative Title',
							'codeweber-gutenberg-blocks'
						)}
						checked={useAltTitle}
						onChange={(value) =>
							setAttributes({ useAltTitle: value })
						}
						help={__(
							'Use the HTML-capable "Alternative Title" meta field instead of the post title. Edit it in the post sidebar.',
							'codeweber-gutenberg-blocks'
						)}
					/>
				</>
			)}

			{activeTab === 'subtitle' && (
				<>
					<ColorTypeControl
						label={__(
							'Subtitle Color Type',
							'codeweber-gutenberg-blocks'
						)}
						value={categoryColorType || 'solid'}
						onChange={(value) =>
							setAttributes({ categoryColorType: value })
						}
						options={ColorTypeOptions}
					/>

					<ComboboxControl
						label={__(
							'Subtitle Color',
							'codeweber-gutenberg-blocks'
						)}
						value={categoryColor || ''}
						options={colors}
						onChange={(value) =>
							setAttributes({ categoryColor: value })
						}
					/>

					<SelectControl
						label={__('Subtitle Size', 'codeweber-gutenberg-blocks')}
						value={categorySize || ''}
						options={createSizeOptions()}
						onChange={(value) =>
							setAttributes({ categorySize: value })
						}
					/>

					<SelectControl
						label={__(
							'Subtitle Weight',
							'codeweber-gutenberg-blocks'
						)}
						value={categoryWeight || ''}
						options={createWeightOptions()}
						onChange={(value) =>
							setAttributes({ categoryWeight: value })
						}
					/>

					<SelectControl
						label={__(
							'Subtitle Transform',
							'codeweber-gutenberg-blocks'
						)}
						value={categoryTransform || ''}
						options={createTransformOptions()}
						onChange={(value) =>
							setAttributes({ categoryTransform: value })
						}
					/>

					<TextControl
						label={__(
							'Subtitle Class',
							'codeweber-gutenberg-blocks'
						)}
						value={categoryClass || ''}
						onChange={(value) =>
							setAttributes({ categoryClass: value })
						}
						placeholder="text-uppercase fs-sm"
						help={__(
							'Styles the category/taxonomy text shown on the card. Only applied by templates that support it (currently: Post default/card, Modules).',
							'codeweber-gutenberg-blocks'
						)}
					/>
				</>
			)}

			{activeTab === 'paragraph' && (
				<>
					<ColorTypeControl
						label={__(
							'Paragraph Color Type',
							'codeweber-gutenberg-blocks'
						)}
						value={excerptColorType || 'solid'}
						onChange={(value) =>
							setAttributes({ excerptColorType: value })
						}
						options={ColorTypeOptions}
					/>

					<ComboboxControl
						label={__(
							'Paragraph Color',
							'codeweber-gutenberg-blocks'
						)}
						value={excerptColor || ''}
						options={colors}
						onChange={(value) =>
							setAttributes({ excerptColor: value })
						}
					/>

					<SelectControl
						label={__(
							'Paragraph Size',
							'codeweber-gutenberg-blocks'
						)}
						value={excerptSize || ''}
						options={createSizeOptions()}
						onChange={(value) =>
							setAttributes({ excerptSize: value })
						}
					/>

					<SelectControl
						label={__(
							'Paragraph Weight',
							'codeweber-gutenberg-blocks'
						)}
						value={excerptWeight || ''}
						options={createWeightOptions()}
						onChange={(value) =>
							setAttributes({ excerptWeight: value })
						}
					/>

					<SelectControl
						label={__(
							'Paragraph Transform',
							'codeweber-gutenberg-blocks'
						)}
						value={excerptTransform || ''}
						options={createTransformOptions()}
						onChange={(value) =>
							setAttributes({ excerptTransform: value })
						}
					/>

					<TextControl
						label={__(
							'Paragraph Class',
							'codeweber-gutenberg-blocks'
						)}
						value={excerptClass || ''}
						onChange={(value) =>
							setAttributes({ excerptClass: value })
						}
						placeholder="mb-0"
						help={__(
							'Additional CSS classes (appended to computed classes). Only applied by templates that support it (currently: Post default/card, Modules).',
							'codeweber-gutenberg-blocks'
						)}
					/>
				</>
			)}
		</>
	);
};
