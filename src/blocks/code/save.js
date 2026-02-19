/**
 * Code Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';
import { CodeRender } from '../../components/code';

const save = ({ attributes }) => {
	const { content, language, copyLabel, backgroundColor } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div {...blockProps}>
			<CodeRender
				content={content}
				language={language}
				copyLabel={copyLabel}
				backgroundColor={backgroundColor}
			/>
		</div>
	);
};

export default save;
