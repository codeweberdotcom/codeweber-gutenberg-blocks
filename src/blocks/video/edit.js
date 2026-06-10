import { useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { VideoSidebar } from './sidebar';
import { VideoRender } from './components/VideoRender';
import { initLightbox } from '../../utilities/lightbox';
import { initPlyr, destroyPlyr } from '../../utilities/plyr';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		videoType,
		videoLightbox,
		videoVimeoId,
		videoYoutubeId,
		videoVkId,
		videoRutubeId,
		videoUrl,
	} = attributes;

	const blockProps = useBlockProps({
		className: 'cwgb-media-block',
	});

	// Generate unique ID for lightbox (only once, to avoid validation errors)
	useEffect(() => {
		if (
			videoLightbox &&
			(videoType === 'vk' || videoType === 'rutube') &&
			!attributes.lightboxUniqueId
		) {
			const uniqueId = `video-${Math.random().toString(36).substr(2, 9)}`;
			setAttributes({ lightboxUniqueId: uniqueId });
		}
	}, [videoLightbox, videoType, attributes.lightboxUniqueId]);

	// Переинициализация библиотек при изменении настроек
	useEffect(() => {
		if (typeof window === 'undefined' || !window.theme) return;

		// Cleanup перед реинициализацией
		destroyPlyr();

		const timer = setTimeout(() => {
			try {
				// Lightbox (GLightbox) - для видео
				if (videoLightbox) {
					initLightbox();
				}

				// Plyr (Video Player) - инициализируем в редакторе для YouTube и Vimeo
				if (
					!videoLightbox &&
					(videoType === 'youtube' || videoType === 'vimeo')
				) {
					// Дополнительная задержка для Plyr
					setTimeout(() => {
						initPlyr();
					}, 200);
				}
			} catch (error) {
				console.error('Library initialization failed (video):', error);
			}
		}, 300);

		return () => {
			clearTimeout(timer);
			destroyPlyr();
		};
	}, [
		videoLightbox,
		videoType,
		videoVimeoId,
		videoYoutubeId,
		videoVkId,
		videoRutubeId,
		videoUrl,
		clientId,
	]);

	return (
		<>
			<VideoSidebar
				attributes={attributes}
				setAttributes={setAttributes}
			/>
			<div {...blockProps}>
				<div
					key={`video-${videoType}-${videoLightbox}-${videoVimeoId}-${videoYoutubeId}-${videoVkId}-${videoRutubeId}-${videoUrl}`}
				>
					<VideoRender
						attributes={attributes}
						isEditor={true}
						setAttributes={setAttributes}
					/>
				</div>
			</div>
		</>
	);
}
