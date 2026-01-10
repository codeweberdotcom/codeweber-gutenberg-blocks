import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	Button,
	SelectControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';

/**
 * VideoUpload - универсальный компонент для загрузки видео
 *
 * @param {Object} props
 * @param {string} props.videoType - Тип видео (html5, vimeo, youtube, embed)
 * @param {Function} props.onVideoTypeChange - Callback при смене типа видео
 * @param {string} props.videoUrl - URL HTML5 видео
 * @param {Function} props.onChange - Callback при выборе видео (получает URL)
 * @param {string} props.vimeoId - Vimeo ID
 * @param {Function} props.onVimeoIdChange - Callback при смене Vimeo ID
 * @param {string} props.youtubeId - YouTube ID
 * @param {Function} props.onYoutubeIdChange - Callback при смене YouTube ID
 * @param {string} props.embedCode - Embed код
 * @param {Function} props.onEmbedCodeChange - Callback при смене Embed кода
 * @param {string} props.label - Заголовок (опционально)
 * @param {string} props.buttonText - Текст кнопки (опционально)
 * @param {string} props.buttonVariant - Вариант кнопки (по умолчанию 'primary')
 * @param {boolean} props.showTypeSelector - Показывать выбор типа видео (по умолчанию true)
 */
export const VideoUpload = ({
	videoType = 'html5',
	onVideoTypeChange,
	videoUrl,
	onChange,
	vimeoId,
	onVimeoIdChange,
	youtubeId,
	onYoutubeIdChange,
	embedCode,
	onEmbedCodeChange,
	label,
	buttonText,
	buttonVariant = 'primary',
	showTypeSelector = true,
}) => {
	const handleSelectVideo = (media) => {
		if (onChange) {
			onChange(media.url);
		}
	};

	const defaultButtonText = videoUrl
		? __('Change Video', 'codeweber-gutenberg-blocks')
		: __('Upload Video', 'codeweber-gutenberg-blocks');

	return (
		<div className="cwgb-video-upload">
			{label && (
				<div
					className="component-sidebar-title"
					style={{ marginBottom: '8px' }}
				>
					<label>{label}</label>
				</div>
			)}

			{/* Video Type Selector */}
			{showTypeSelector && onVideoTypeChange && (
				<SelectControl
					label={__('Video Type', 'codeweber-gutenberg-blocks')}
					value={videoType}
					options={[
						{
							label: __(
								'HTML5 Video',
								'codeweber-gutenberg-blocks'
							),
							value: 'html5',
						},
						{
							label: __('Vimeo', 'codeweber-gutenberg-blocks'),
							value: 'vimeo',
						},
						{
							label: __('YouTube', 'codeweber-gutenberg-blocks'),
							value: 'youtube',
						},
						{
							label: __(
								'Embed Code',
								'codeweber-gutenberg-blocks'
							),
							value: 'embed',
						},
					]}
					onChange={onVideoTypeChange}
				/>
			)}

			{/* HTML5 Video Upload */}
			{videoType === 'html5' && (
				<MediaUploadCheck>
					<MediaUpload
						onSelect={handleSelectVideo}
						allowedTypes={['video']}
						value={videoUrl}
						render={({ open }) => (
							<>
								{!videoUrl && (
									<div
										onClick={open}
										style={{
											padding: '40px 20px',
											textAlign: 'center',
											background: '#f9f9f9',
											border: '2px dashed #ccc',
											borderRadius: '4px',
											cursor: 'pointer',
											marginBottom: '12px',
										}}
									>
										<div
											style={{
												fontSize: '48px',
												color: '#8b5cf6',
												marginBottom: '8px',
											}}
										>
											🎥
										</div>
										<div
											style={{
												color: '#666',
												fontSize: '14px',
											}}
										>
											{buttonText || defaultButtonText}
										</div>
									</div>
								)}

								{videoUrl && (
									<div
										style={{
											marginBottom: '12px',
											padding: '8px',
											background: '#f9f9f9',
											borderRadius: '4px',
											fontSize: '12px',
											color: '#666',
											wordBreak: 'break-all',
										}}
									>
										{videoUrl}
									</div>
								)}

								<div style={{ display: 'flex', gap: '8px' }}>
									<Button
										onClick={open}
										variant={buttonVariant}
									>
										{buttonText || defaultButtonText}
									</Button>

									{videoUrl && (
										<Button
											onClick={() => onChange('')}
											isDestructive
										>
											{__(
												'Remove',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
									)}
								</div>
							</>
						)}
					/>
				</MediaUploadCheck>
			)}

			{/* Vimeo */}
			{videoType === 'vimeo' && onVimeoIdChange && (
				<TextControl
					label={__('Vimeo Video ID', 'codeweber-gutenberg-blocks')}
					value={vimeoId || ''}
					onChange={onVimeoIdChange}
					help={__('Example: 15801179', 'codeweber-gutenberg-blocks')}
				/>
			)}

			{/* YouTube */}
			{videoType === 'youtube' && onYoutubeIdChange && (
				<TextControl
					label={__('YouTube Video ID', 'codeweber-gutenberg-blocks')}
					value={youtubeId || ''}
					onChange={onYoutubeIdChange}
					help={__(
						'Example: j_Y2Gwaj7Gs',
						'codeweber-gutenberg-blocks'
					)}
				/>
			)}

			{/* Embed */}
			{videoType === 'embed' && onEmbedCodeChange && (
				<TextareaControl
					label={__('Embed Code', 'codeweber-gutenberg-blocks')}
					value={embedCode || ''}
					onChange={onEmbedCodeChange}
					help={__(
						'Paste iframe or embed code',
						'codeweber-gutenberg-blocks'
					)}
					rows={5}
				/>
			)}
		</div>
	);
};
