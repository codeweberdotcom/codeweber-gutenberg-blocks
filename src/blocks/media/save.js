import { useBlockProps } from '@wordpress/block-editor';
import { ImageRender } from './components/ImageRender';
import { VideoRender } from './components/VideoRender';

export default function save({ attributes }) {
	const { mediaType, blockClass, blockId, blockData } = attributes;

	const blockProps = useBlockProps.save({
		className: `cwgb-media-block ${blockClass || ''}`.trim(),
		id: blockId || undefined,
		'data-block': blockData || undefined,
	});

	return (
		<div {...blockProps}>
			{mediaType === 'image' ? (
				<ImageRender attributes={attributes} isEditor={false} />
			) : (
				<VideoRender attributes={attributes} isEditor={false} />
			)}
		</div>
	);
}
