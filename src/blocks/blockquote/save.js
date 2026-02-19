/**
 * Blockquote Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';

const save = ({ attributes }) => {
	const { quote, caption, style } = attributes;

	const blockProps = useBlockProps.save();

	const figureClass = style === 'card' ? 'mb-0' : '';
	const blockquoteClass = style === 'card' ? 'icon fs-lg' : 'fs-lg';
	const figcaptionClass = style === 'card' ? 'blockquote-footer mb-0' : 'blockquote-footer';

	const innerContent = (
		<>
			<blockquote className={blockquoteClass}>
				<RichText.Content tagName="p" value={quote} className="mb-0" />
			</blockquote>
			{caption && (
				<RichText.Content
					tagName="figcaption"
					className={figcaptionClass}
					value={caption}
				/>
			)}
		</>
	);

	if (style === 'card') {
		return (
			<div {...blockProps}>
				<div className="card mb-0">
					<div className="card-body">
						<figure className={figureClass}>{innerContent}</figure>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<figure className={figureClass}>{innerContent}</figure>
		</div>
	);
};

export default save;
