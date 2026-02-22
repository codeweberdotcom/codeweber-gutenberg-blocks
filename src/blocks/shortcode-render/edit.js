/**
 * Shortcode Render Block - Edit
 * Sidebar: shortcode field. Editor: rendered via plugin REST endpoint (avoids core block-renderer 404).
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, Spinner } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const ShortcodeRenderEdit = ({ attributes, setAttributes }) => {
	const { shortcode } = attributes;
	const blockProps = useBlockProps({ className: 'wp-block-codeweber-blocks-shortcode-render' });
	const [rendered, setRendered] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!shortcode || !shortcode.trim()) {
			setRendered('');
			setError(false);
			return;
		}
		setLoading(true);
		setError(false);
		apiFetch({
			path: `codeweber-gutenberg-blocks/v1/render-shortcode?shortcode=${encodeURIComponent(shortcode.trim())}`,
		})
			.then((res) => {
				setRendered(res.rendered != null ? res.rendered : '');
			})
			.catch(() => {
				setRendered('');
				setError(true);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [shortcode]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Shortcode', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<TextControl
						label={__('Shortcode', 'codeweber-gutenberg-blocks')}
						value={shortcode || ''}
						onChange={(value) => setAttributes({ shortcode: value || '' })}
						placeholder={__('e.g. [my_shortcode]', 'codeweber-gutenberg-blocks')}
						help={__(
							'Enter the shortcode (with brackets) to display here.',
							'codeweber-gutenberg-blocks'
						)}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{!shortcode ? (
					<div className="codeweber-shortcode-render-placeholder">
						{__(
							'Enter a shortcode in the block settings (right sidebar).',
							'codeweber-gutenberg-blocks'
						)}
					</div>
				) : loading ? (
					<div className="codeweber-shortcode-render-placeholder">
						<Spinner />
					</div>
				) : error ? (
					<div className="codeweber-shortcode-render-placeholder">
						<code>{shortcode}</code>
					</div>
				) : (
					<div
						className="codeweber-shortcode-render-output"
						dangerouslySetInnerHTML={{ __html: rendered }}
					/>
				)}
			</div>
		</>
	);
};

export default ShortcodeRenderEdit;
