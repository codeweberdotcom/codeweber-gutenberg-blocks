export const VideoRender = ({ attributes, isEditor = false }) => {
	const {
		videoType,
		videoUrl,
		videoVimeoId,
		videoYoutubeId,
		videoEmbed,
		videoPoster,
		videoAutoplay,
		videoLoop,
		videoMuted,
		videoControls,
		showPlayIcon,
	} = attributes;

	// HTML5 Video
	if (videoType === 'html5' && videoUrl) {
		return (
			<div className="video-wrapper">
				{showPlayIcon && videoPoster.url && (
					<div className="video-play-icon">
						<i className="uil uil-play"></i>
					</div>
				)}
				<video
					poster={videoPoster.url || ''}
					className="player"
					playsInline
					controls={videoControls}
					preload="none"
					autoPlay={videoAutoplay}
					loop={videoLoop}
					muted={videoMuted}
				>
					<source src={videoUrl} type="video/mp4" />
				</video>
			</div>
		);
	}

	// Vimeo
	if (videoType === 'vimeo' && videoVimeoId) {
		return (
			<div className="video-wrapper">
				{showPlayIcon && videoPoster.url && (
					<div className="video-play-icon">
						<i className="uil uil-play"></i>
					</div>
				)}
				<div
					className="player"
					data-plyr-provider="vimeo"
					data-plyr-embed-id={videoVimeoId}
				></div>
			</div>
		);
	}

	// YouTube
	if (videoType === 'youtube' && videoYoutubeId) {
		return (
			<div className="video-wrapper">
				{showPlayIcon && videoPoster.url && (
					<div className="video-play-icon">
						<i className="uil uil-play"></i>
					</div>
				)}
				<div
					className="player"
					data-plyr-provider="youtube"
					data-plyr-embed-id={videoYoutubeId}
				></div>
			</div>
		);
	}

	// Embed Code
	if (videoType === 'embed' && videoEmbed) {
		return (
			<div className="ratio ratio-16x9">
				<div dangerouslySetInnerHTML={{ __html: videoEmbed }} />
			</div>
		);
	}

	// Placeholder для редактора
	if (isEditor) {
		return (
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
					{videoType === 'html5' && 'Upload video file'}
					{videoType === 'vimeo' && 'Enter Vimeo video ID'}
					{videoType === 'youtube' && 'Enter YouTube video ID'}
					{videoType === 'embed' && 'Paste embed code'}
				</p>
			</div>
		);
	}

	return null;
};

