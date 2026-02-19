/**
 * Blockquote Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
	const { quote, caption, style } = attributes;

	const blockProps = useBlockProps();

	const figureClass = style === 'card' ? 'mb-0' : '';
	const blockquoteClass = style === 'card' ? 'icon fs-lg' : 'fs-lg';
	const figcaptionClass = style === 'card' ? 'blockquote-footer mb-0' : 'blockquote-footer';

	const innerContent = (
		<>
			<blockquote className={blockquoteClass}>
				<RichText
					tagName="p"
					value={quote}
					onChange={(value) => setAttributes({ quote: value })}
					placeholder={__(
						'Enter quote text...',
						'codeweber-gutenberg-blocks'
					)}
					className="mb-0"
				/>
			</blockquote>
			<RichText
				tagName="figcaption"
				className={figcaptionClass}
				value={caption}
				onChange={(value) => setAttributes({ caption: value })}
				placeholder={__(
					'Author or source (optional)',
					'codeweber-gutenberg-blocks'
				)}
			/>
		</>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Blockquote Settings', 'codeweber-gutenberg-blocks')}
					initialOpen={true}
				>
					<div className="component-sidebar-title" style={{ marginBottom: '8px' }}>
						<label>{__('Layout', 'codeweber-gutenberg-blocks')}</label>
					</div>
					<div className="button-group-sidebar_50">
						{[
							{
								label: __('Simple', 'codeweber-gutenberg-blocks'),
								value: 'simple',
							},
							{
								label: __('Card', 'codeweber-gutenberg-blocks'),
								value: 'card',
							},
						].map((opt) => (
							<Button
								key={opt.value}
								isPrimary={style === opt.value}
								onClick={() => setAttributes({ style: opt.value })}
							>
								{opt.label}
							</Button>
						))}
					</div>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{style === 'card' ? (
					<div className="card mb-0">
						<div className="card-body">
							<figure className={figureClass}>{innerContent}</figure>
						</div>
					</div>
				) : (
					<figure className={figureClass}>{innerContent}</figure>
				)}
			</div>
		</>
	);
};

export default Edit;
