/**
 * Post Grid Template Control
 *
 * Fetches available card templates for the current post type from the theme's registry
 * via /codeweber-gutenberg-blocks/v1/post-card-templates REST endpoint.
 */

import { __ } from '@wordpress/i18n';
import { SelectControl, Spinner } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const FALLBACK_TEMPLATES = [
	{
		value: 'default',
		label: __('Default', 'codeweber-gutenberg-blocks'),
		description: __('Default template', 'codeweber-gutenberg-blocks'),
	},
];

export const PostGridTemplateControl = ({
	value,
	onChange,
	postType = 'post',
	sourceType = 'post',
}) => {
	const [templates, setTemplates] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch templates from registry whenever postType/sourceType changes
	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);

		const params = { post_type: postType };
		if ( sourceType && sourceType !== 'post' ) {
			params.source_type = sourceType;
		}

		apiFetch({
			path: addQueryArgs(
				'/codeweber-gutenberg-blocks/v1/post-card-templates',
				params
			),
		})
			.then((data) => {
				if (cancelled) return;
				const list = Array.isArray(data) && data.length > 0 ? data : FALLBACK_TEMPLATES;
				setTemplates(list);
				setIsLoading(false);

				// Auto-select first template if current value doesn't exist in new list
				const exists = list.some((t) => t.value === value);
				if (!exists && list.length > 0) {
					onChange(list[0].value);
				}
			})
			.catch(() => {
				if (cancelled) return;
				setTemplates(FALLBACK_TEMPLATES);
				setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postType, sourceType]);

	if (isLoading) {
		return (
			<div style={{ padding: '8px 0' }}>
				<Spinner />
			</div>
		);
	}

	const selectedTemplate =
		templates.find((t) => t.value === value) || templates[0];

	// If only one template — show as info, no select
	if (templates.length === 1) {
		return (
			<>
				<div style={{ marginBottom: '8px' }}>
					<strong>
						{__('Template', 'codeweber-gutenberg-blocks')}:
					</strong>{' '}
					{selectedTemplate.label}
				</div>
				{selectedTemplate.description && (
					<p style={{ margin: 0, fontSize: '12px', color: '#757575' }}>
						{selectedTemplate.description}
					</p>
				)}
			</>
		);
	}

	return (
		<SelectControl
			label={__('Template', 'codeweber-gutenberg-blocks')}
			value={value || templates[0].value}
			options={templates.map((t) => ({
				label: t.label,
				value: t.value,
			}))}
			onChange={(newValue) => onChange(newValue)}
			help={selectedTemplate?.description}
		/>
	);
};
