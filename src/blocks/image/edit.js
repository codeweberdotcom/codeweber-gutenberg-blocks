import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useMemo } from '@wordpress/element';
import { ImageSidebar } from './sidebar';
import { ImageRender } from './components/ImageRender';
import { VideoRender } from './components/VideoRender';
import { initLightbox } from '../../utilities/lightbox';

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
	} = attributes;

	const blockProps = useBlockProps({
		className: 'cwgb-image-block',
	});

	// Генерируем уникальный ключ для форсирования ре-рендера при изменении hover эффектов или imageSize
	const hoverEffectsKey = useMemo(() => {
		return `${simpleEffect}-${effectType}-${tooltipStyle}-${overlayStyle}-${overlayGradient}-${overlayColor}-${cursorStyle}`;
	}, [simpleEffect, effectType, tooltipStyle, overlayStyle, overlayGradient, overlayColor, cursorStyle]);

	// Переинициализация библиотек при изменении настроек
	useEffect(() => {
		if (typeof window === 'undefined' || !window.theme) return;

		const timer = setTimeout(() => {
			try {
				// Очистка старых span.bg перед реинициализацией overlay
				const oldBgSpans = document.querySelectorAll('.cwgb-image-block .overlay > a > span.bg, .cwgb-image-block .overlay > span > span.bg');
				oldBgSpans.forEach(span => span.remove());

				// Overlay (imageHoverOverlay) - добавляет <span class="bg"></span>
				if (mediaType === 'image' && effectType === 'overlay' && typeof window.theme?.imageHoverOverlay === 'function') {
					window.theme.imageHoverOverlay();
					console.log('✅ Overlay reinitialized (image)');
				}

				// Tooltip (iTooltip)
				if (mediaType === 'image' && effectType === 'tooltip' && typeof window.theme?.iTooltip === 'function') {
					window.theme.iTooltip();
					console.log('✅ iTooltip reinitialized (image)');
				}

				// Lightbox (GLightbox)
				if (mediaType === 'image' && enableLightbox && initLightbox()) {
					console.log('✅ GLightbox reinitialized (image)');
				}

				// Plyr для видео
				if (mediaType === 'video' && (videoType === 'html5' || videoType === 'vimeo' || videoType === 'youtube')) {
					if (typeof window.Plyr !== 'undefined') {
						// Уничтожаем старые экземпляры
						const existingPlayers = document.querySelectorAll('.cwgb-image-block .player');
						existingPlayers.forEach(player => {
							if (player.plyr) {
								player.plyr.destroy();
							}
						});

						// Инициализируем новые
						const players = Array.from(document.querySelectorAll('.cwgb-image-block .player')).map(p => new Plyr(p));
						console.log('✅ Plyr reinitialized (image)', players.length);
					}
				}
			} catch (error) {
				console.warn('⚠️ Library initialization failed (image):', error);
			}
		}, 300);

		return () => {
			clearTimeout(timer);
			// Cleanup при unmount
			if (mediaType === 'video' && typeof window.Plyr !== 'undefined') {
				const players = document.querySelectorAll('.cwgb-image-block .player');
				players.forEach(player => {
					if (player.plyr) {
						player.plyr.destroy();
					}
				});
			}
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
		videoType,
		clientId,
	]);

	return (
		<>
			<ImageSidebar attributes={attributes} setAttributes={setAttributes} />
			<div {...blockProps}>
				{mediaType === 'image' ? (
					image.url ? (
						<div key={`image-${hoverEffectsKey}-${imageSize}`}>
							<ImageRender attributes={attributes} isEditor={true} />
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
					<div key={`video-${videoType}`}>
						<VideoRender attributes={attributes} isEditor={true} />
					</div>
				)}
			</div>
		</>
	);
}
