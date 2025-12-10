import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

const POST_TEMPLATES = [
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
	{
		value: 'overlay-5',
		label: __('Overlay 5', 'codeweber-gutenberg-blocks'),
		description: __('Overlay effect with 90% opacity and bottom overlay for date', 'codeweber-gutenberg-blocks'),
	},
];

const CLIENT_TEMPLATES = [
	{
		value: 'client-simple',
		label: __('Client Simple', 'codeweber-gutenberg-blocks'),
		description: __('Simple logo for Swiper slider', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'client-grid',
		label: __('Client Grid', 'codeweber-gutenberg-blocks'),
		description: __('Logo in figure with adaptive padding for Grid layout', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'client-card',
		label: __('Client Card', 'codeweber-gutenberg-blocks'),
		description: __('Logo in card with shadow for Grid with cards', 'codeweber-gutenberg-blocks'),
	},
];

const TESTIMONIAL_TEMPLATES = [
	{
		value: 'default',
		label: __('Default', 'codeweber-gutenberg-blocks'),
		description: __('Basic testimonial card with rating, text, avatar and author', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'card',
		label: __('Card', 'codeweber-gutenberg-blocks'),
		description: __('Card with colored backgrounds (Sandbox style)', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'blockquote',
		label: __('Blockquote', 'codeweber-gutenberg-blocks'),
		description: __('Block with quote and icon', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'icon',
		label: __('Icon', 'codeweber-gutenberg-blocks'),
		description: __('Simple blockquote with icon, without rating', 'codeweber-gutenberg-blocks'),
	},
];

export const PostGridTemplateControl = ({ value, onChange, postType = 'post' }) => {
	// Определяем какие шаблоны показывать в зависимости от типа записи
	let templates;
	let defaultTemplate;
	
	if (postType === 'clients') {
		templates = CLIENT_TEMPLATES;
		defaultTemplate = 'client-simple';
	} else if (postType === 'testimonials') {
		templates = TESTIMONIAL_TEMPLATES;
		defaultTemplate = 'default';
	} else {
		templates = POST_TEMPLATES;
		defaultTemplate = 'default';
	}
	
	const selectedTemplate = templates.find(t => t.value === value) || templates[0];

	return (
		<>
			<SelectControl
				label={__('Template', 'codeweber-gutenberg-blocks')}
				value={value || defaultTemplate}
				options={templates.map(template => ({
					label: template.label,
					value: template.value,
				}))}
				onChange={(newValue) => onChange(newValue)}
				help={selectedTemplate.description}
			/>
		</>
	);
};

