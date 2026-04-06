import { __ } from '@wordpress/i18n';

/**
 * Map post type slug to Schema.org type name.
 * Mirrors the PHP function codeweber_schema_type_for_post_type().
 */
const SCHEMA_TYPE_MAP = {
	post: 'Article',
	page: 'WebPage',
	faq: 'FAQPage',
	staff: 'Person',
	events: 'Event',
	vacancies: 'JobPosting',
	offices: 'LocalBusiness',
	services: 'Service',
	projects: 'CreativeWork',
	testimonials: 'Review',
	legal: 'WebPage',
	documents: 'DigitalDocument',
	clients: 'Organization',
};

/**
 * Get Schema.org type for a post type.
 *
 * @param {string} postType WordPress post type slug.
 * @return {string|null} Schema.org type or null.
 */
export const getSchemaType = (postType) => {
	return SCHEMA_TYPE_MAP[postType] || null;
};

/**
 * SchemaTypeNotice — displays the Schema.org type badge in the Inspector sidebar.
 *
 * Usage:
 *   <SchemaTypeNotice mode={mode} postType={postType} />
 *
 * @param {Object} props
 * @param {string} props.mode    Block mode: 'custom' or 'post'.
 * @param {string} props.postType Post type slug (used when mode === 'post').
 */
export const SchemaTypeNotice = ({ mode, postType }) => {
	let schemaLabel = null;

	if (mode === 'custom') {
		schemaLabel = 'FAQPage (Q&A)';
	} else if (mode === 'post' && postType) {
		const schemaType = getSchemaType(postType);
		if (schemaType) {
			if (postType === 'faq') {
				schemaLabel = 'FAQPage';
			} else {
				schemaLabel = `ItemList → ${schemaType}`;
			}
		}
	}

	if (!schemaLabel) {
		return null;
	}

	return (
		<div
			style={{
				padding: '8px 12px',
				marginBottom: '12px',
				background: '#f0f6fc',
				border: '1px solid #c3d4e6',
				borderRadius: '4px',
				fontSize: '12px',
				lineHeight: '1.4',
			}}
		>
			<strong>Schema.org:</strong>{' '}
			<code
				style={{
					background: '#e7f0f9',
					padding: '2px 6px',
					borderRadius: '3px',
					fontSize: '11px',
				}}
			>
				{schemaLabel}
			</code>
		</div>
	);
};
