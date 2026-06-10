import { useBlockProps } from '@wordpress/block-editor';
import { VideoRender } from './components/VideoRender';
import { buildLinkAttrs } from '../../utilities/buildLinkAttrs';

export default function save({ attributes }) {
	const { blockClass, blockId, blockData } = attributes;

	const blockProps = useBlockProps.save({
		className: `cwgb-media-block ${blockClass || ''}`.trim(),
		id: blockId || undefined,
		'data-block': blockData || undefined,
	});

	const linkBuildResult = buildLinkAttrs( attributes );

	const hiddenIframeEl = linkBuildResult?.videoFrameId ? (
		<div id={ linkBuildResult.videoFrameId } style={ { display: 'none' } }>
			<iframe
				src={ linkBuildResult.videoFrameSrc }
				allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write;"
				frameBorder="0"
				allowFullScreen
				style={ { width: '100%', height: '100%', aspectRatio: '16/9' } }
			/>
		</div>
	) : null;

	return (
		<div {...blockProps}>
			{ hiddenIframeEl }
			<VideoRender attributes={attributes} isEditor={false} />
		</div>
	);
}
