import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useMemo } from '@wordpress/element';
import { ImageSidebar } from './sidebar';
import { ImageRender } from './components/ImageRender';
import { VideoRender } from './components/VideoRender';
import { initLightbox } from '../../utilities/lightbox';
import { initPlyr, destroyPlyr } from '../../utilities/plyr';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		mediaType,
		image,
		imageSize,
		effectType,
		simpleEffect,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
		enableLightbox,
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

	// Генерируем уникальный ключ для форсирования ре-рендера при изменении hover эффектов или imageSize
	const hoverEffectsKey = useMemo(() => {
		return `${simpleEffect}-${effectType}-${tooltipStyle}-${overlayStyle}-${overlayGradient}-${overlayColor}-${cursorStyle}`;
	}, [
		simpleEffect,
		effectType,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
	]);

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
				// Очистка старых span.bg перед реинициализацией overlay
				const oldBgSpans = document.querySelectorAll(
					'.cwgb-media-block .overlay > a > span.bg, .cwgb-media-block .overlay > span > span.bg'
				);
				oldBgSpans.forEach((span) => span.remove());

				// Overlay (imageHoverOverlay) - добавляет <span class="bg"></span>
				if (
					mediaType === 'image' &&
					effectType === 'overlay' &&
					typeof window.theme?.imageHoverOverlay === 'function'
				) {
					window.theme.imageHoverOverlay();
				}

				// Tooltip (iTooltip)
				if (
					mediaType === 'image' &&
					effectType === 'tooltip' &&
					typeof window.theme?.iTooltip === 'function'
				) {
					window.theme.iTooltip();
				}

				// Lightbox (GLightbox) - для изображений и видео
				if (
					(mediaType === 'image' && enableLightbox) ||
					(mediaType === 'video' && videoLightbox)
				) {
					initLightbox();
				}

				// Plyr (Video Player) - инициализируем в редакторе для YouTube и Vimeo
				if (
					mediaType === 'video' &&
					!videoLightbox &&
					(videoType === 'youtube' || videoType === 'vimeo')
				) {
					// Дополнительная задержка для Plyr
					setTimeout(() => {
						initPlyr();
					}, 200);
				}
			} catch (error) {
				console.error('Library initialization failed (media):', error);
			}
		}, 300);

		return () => {
			clearTimeout(timer);
			destroyPlyr();
		};
	}, [
		mediaType,
		image.url,
		imageSize,
		effectType,
		simpleEffect,
		tooltipStyle,
		overlayStyle,
		overlayGradient,
		overlayColor,
		cursorStyle,
		enableLightbox,
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
			<ImageSidebar
				attributes={attributes}
				setAttributes={setAttributes}
			/>
			<div {...blockProps}>
				{mediaType === 'image' ? (
					image.url ? (
						<div key={`image-${hoverEffectsKey}-${imageSize}`}>
							<ImageRender
								attributes={attributes}
								isEditor={true}
							/>
						</div>
					) : (
						<div
							style={{
								padding: '40px',
								textAlign: 'center',
								background: '#f0f0f0',
								border: '2px dashed #ccc',
								borderRadius: '4px',
							}}
						>
							<p style={{ margin: 0, color: '#666' }}>
								Select an image from the sidebar
							</p>
						</div>
					)
				) : (
					<div
						key={`video-${videoType}-${videoLightbox}-${videoVimeoId}-${videoYoutubeId}-${videoVkId}-${videoRutubeId}-${videoUrl}`}
					>
						<VideoRender
							attributes={attributes}
							isEditor={true}
							setAttributes={setAttributes}
						/>
					</div>
				)}
			</div>
		</>
	);
}
