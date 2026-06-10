import { useBlockProps } from '@wordpress/block-editor';
import { VideoRender } from './components/VideoRender';

export default function save({ attributes }) {
	const { blockClass, blockId, blockData } = attributes;

	const blockProps = useBlockProps.save({
		className: `cwgb-media-block ${blockClass || ''}`.trim(),
		id: blockId || undefined,
		'data-block': blockData || undefined,
	});

	return (
		<div {...blockProps}>
			<VideoRender attributes={attributes} isEditor={false} />
		</div>
	);
}
