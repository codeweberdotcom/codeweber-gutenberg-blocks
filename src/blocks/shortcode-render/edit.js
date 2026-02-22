/**
 * Shortcode Render Block - Edit
 * Sidebar: shortcode field. Editor: rendered shortcode via ServerSideRender.
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

const hasServerSideRender =
	typeof ServerSideRender === 'function' || typeof ServerSideRender?.default === 'function';
const SSRComponent = typeof ServerSideRender === 'function' ? ServerSideRender : ServerSideRender?.default;

const ShortcodeRenderEdit = ({ attributes, setAttributes }) => {
	const { shortcode } = attributes;
	const blockProps = useBlockProps({ className: 'wp-block-codeweber-blocks-shortcode-render' });

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
				) : hasServerSideRender && SSRComponent ? (
					<SSRComponent
						block="codeweber-blocks/shortcode-render"
						attributes={{ shortcode: shortcode || '' }}
						httpMethod="GET"
					/>
				) : (
					<div className="codeweber-shortcode-render-placeholder">
						<code>{shortcode}</code>
					</div>
				)}
			</div>
		</>
	);
};

export default ShortcodeRenderEdit;
