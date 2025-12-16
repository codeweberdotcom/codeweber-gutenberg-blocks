/**
 * Submit Button Block Save Component
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const {
		buttonText,
		buttonClass,
		blockClass,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `form-submit-wrapper mt-4 ${blockClass || ''}`,
	});

	return (
		<div {...blockProps}>
			<button
				type="submit"
				className={buttonClass || 'btn btn-primary'}
				data-loading-text="Sending..."
			>
				<i className="uil uil-send fs-13"></i>
				{buttonText || 'Send Message'}
			</button>
		</div>
	);
}

