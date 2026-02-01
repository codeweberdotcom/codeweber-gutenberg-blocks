/**
 * Social Icons Block - Edit Component
 *
 * Renders the same HTML as frontend via REST API (social-icons-preview).
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { RawHTML, useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { SocialIconsSidebar } from './sidebar';

const Edit = ({ attributes, setAttributes }) => {
	const {
		dataSource,
		styleType,
		size,
		buttonColor,
		buttonStyle,
		buttonForm,
		navClass,
		items,
		blockClass,
		blockId,
		blockData,
	} = attributes;

	const [previewHtml, setPreviewHtml] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const blockClasses = [
		'cwgb-social-icons-block',
		blockClass,
	]
		.filter(Boolean)
		.join(' ');

	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	const blockProps = useBlockProps({
		className: blockClasses,
		id: blockId || undefined,
		...dataAttributes,
	});

	// Fetch frontend HTML so editor preview matches frontend
	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		apiFetch({
			path: '/codeweber-gutenberg-blocks/v1/social-icons-preview',
			method: 'POST',
			data: {
				attributes: {
					dataSource,
					styleType,
					size,
					buttonColor,
					buttonStyle,
					buttonForm,
					navClass,
					themeEnabledSlugs: attributes.themeEnabledSlugs || [],
					items: items || [],
					blockClass,
					blockId,
					blockData,
				},
			},
		})
			.then((res) => {
				if (!cancelled && res && typeof res.html === 'string') {
					setPreviewHtml(res.html);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setPreviewHtml('');
				}
			})
			.finally(() => {
				if (!cancelled) {
					setIsLoading(false);
				}
			});
		return () => {
			cancelled = true;
		};
	}, [
		dataSource,
		styleType,
		size,
		buttonColor,
		buttonStyle,
		buttonForm,
		navClass,
		items ? JSON.stringify(items) : '',
		JSON.stringify(attributes.themeEnabledSlugs || []),
		blockClass,
		blockId,
		blockData,
	]);

	return (
		<>
			<InspectorControls>
				<SocialIconsSidebar attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>
			<div {...blockProps}>
				{isLoading ? (
					<div className="cwgb-social-icons-preview cwgb-social-icons-preview-loading">
						<span className="dashicons dashicons-update" />
						{__('Loading…', 'codeweber-gutenberg-blocks')}
					</div>
				) : previewHtml ? (
					<RawHTML>{previewHtml}</RawHTML>
				) : (
					<div className="cwgb-social-icons-preview cwgb-social-icons-preview-empty">
						<span className="dashicons dashicons-share" style={{ marginRight: 8, opacity: 0.7 }} />
						{dataSource === 'theme'
							? __('No social links in theme settings or theme not active.', 'codeweber-gutenberg-blocks')
							: __('Add links in the block settings.', 'codeweber-gutenberg-blocks')}
					</div>
				)}
			</div>
		</>
	);
};

export default Edit;
