import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

const TEMPLATES = [
	{
		value: 'default',
		label: __('Default', 'codeweber-gutenberg-blocks'),
		description: __('Simple layout with figure overlay and post header/footer', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'card',
		label: __('Card', 'codeweber-gutenberg-blocks'),
		description: __('Card layout with shadow and card body', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'card-content',
		label: __('Card Content', 'codeweber-gutenberg-blocks'),
		description: __('Card with excerpt and footer', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'slider',
		label: __('Slider', 'codeweber-gutenberg-blocks'),
		description: __('Slider layout with category on image and excerpt', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'default-clickable',
		label: __('Default Clickable', 'codeweber-gutenberg-blocks'),
		description: __('Fully clickable card with lift effect', 'codeweber-gutenberg-blocks'),
	},
];

export const PostGridTemplateControl = ({ value, onChange }) => {
	const selectedTemplate = TEMPLATES.find(t => t.value === value) || TEMPLATES[0];

	return (
		<>
			<SelectControl
				label={__('Template', 'codeweber-gutenberg-blocks')}
				value={value || 'default'}
				options={TEMPLATES.map(template => ({
					label: template.label,
					value: template.value,
				}))}
				onChange={(newValue) => onChange(newValue)}
				help={selectedTemplate.description}
			/>
		</>
	);
};

