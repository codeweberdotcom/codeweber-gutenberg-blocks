import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { normalizeMinHeightClass, getContainerClassNames } from './utils';

const normalizeSectionId = (value = '') => value.replace(/^#/, '').trim();

const normalizeDataAttributeName = (key = '') => {
	if (!key) {
		return null;
	}
	const trimmed = key.trim();
	if (!trimmed) {
		return null;
	}
	const lower = trimmed.toLowerCase();
	if (lower.startsWith('data-') || lower.startsWith('aria-')) {
		return lower;
	}
	return `data-${lower}`;
};

const getSectionClasses = (attrs) => {
	const classes = [];

	// Background type classes
	switch (attrs.backgroundType) {
		case 'color':
			if (attrs.backgroundColorType === 'gradient' && attrs.backgroundGradient) {
				classes.push(attrs.backgroundGradient);
			} else if (attrs.backgroundColor) {
				if (attrs.backgroundColorType === 'soft') {
					classes.push(`bg-soft-${attrs.backgroundColor}`);
				} else if (attrs.backgroundColorType === 'pale') {
					classes.push(`bg-pale-${attrs.backgroundColor}`);
				} else {
					classes.push(`bg-${attrs.backgroundColor}`);
				}
			}
			break;
		case 'image':
			classes.push('image-wrapper bg-image');
			if (attrs.backgroundSize) {
				classes.push(attrs.backgroundSize);
			}
			if (attrs.backgroundOverlay) {
				if (attrs.backgroundOverlay === 'bg-overlay-300' || attrs.backgroundOverlay === 'bg-overlay-400') {
					classes.push('bg-overlay', attrs.backgroundOverlay);
				} else {
					classes.push(attrs.backgroundOverlay);
				}
			} else {
				classes.push('bg-overlay');
			}
			break;
		case 'pattern':
			classes.push('pattern-wrapper bg-image text-white');
			if (attrs.backgroundSize) {
				classes.push(attrs.backgroundSize);
			}
			break;
		case 'video':
			classes.push('video-wrapper ratio ratio-16x9');
			if (attrs.backgroundOverlay && attrs.backgroundOverlay !== '') {
				if (attrs.backgroundOverlay === 'bg-overlay-300' || attrs.backgroundOverlay === 'bg-overlay-400') {
					classes.push('bg-overlay', attrs.backgroundOverlay);
				} else {
					classes.push(attrs.backgroundOverlay);
				}
			} else if (attrs.backgroundOverlay !== '') {
				classes.push('bg-overlay');
			}
			break;
	}


	// Text color
	if (attrs.textColor) {
		classes.push(attrs.textColor);
	}

	return classes.join(' ');
};

const SectionSave = ({ attributes }) => {
	const {
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageUrl,
		backgroundImageSize,
		backgroundSize,
		backgroundVideoUrl,
		backgroundPatternUrl,
		backgroundOverlay,
		textColor,
		containerClass,
		containerType,
		containerTextAlign,
		containerAlignItems,
		containerJustifyContent,
		containerPosition,
		sectionFrame,
		overflowHidden,
		positionRelative,
		minHeight,
		sectionClass,
		sectionData,
		sectionId,
	} = attributes;

	const normalizedMinHeight = normalizeMinHeightClass(minHeight);
	const safeSectionId = normalizeSectionId(sectionId);
	const containerClassNames = getContainerClassNames({
		containerClass,
		containerTextAlign,
		containerAlignItems,
		containerJustifyContent,
		containerPosition,
	});

	const blockProps = useBlockProps.save({
		className: `wrapper ${getSectionClasses(attributes)} ${sectionFrame ? 'section-frame' : ''} ${overflowHidden ? 'overflow-hidden' : ''} ${positionRelative ? 'position-relative' : ''} ${normalizedMinHeight} ${sectionClass}`,
		id: safeSectionId || undefined,
	});

	const getSectionStyles = () => {
		// Don't render styles on server, let JavaScript handle it on frontend
		return undefined;
	};

	const parseDataAttributes = (dataString) => {
		if (!dataString || dataString.trim() === '') return {};

		const attributes = {};
		const pairs = dataString.split(',').map(pair => pair.trim());

		pairs.forEach(pair => {
			if (!pair) {
				return;
			}
			const [rawKey, ...rest] = pair.split('=');
			const value = (rest.join('=') || '').trim();
			const attrName = normalizeDataAttributeName(rawKey);
			if (attrName && value) {
				attributes[attrName] = value;
			}
		});

		return attributes;
	};

	const dataAttributes = parseDataAttributes(sectionData);

	return (
		<section
			{...blockProps}
			{...(backgroundType === 'image' && backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
			{...(backgroundType === 'pattern' && backgroundPatternUrl && { 'data-image-src': backgroundPatternUrl })}
			{...dataAttributes}
		>
			{backgroundType === 'video' ? (
				<>
					<video
						poster={backgroundVideoUrl ? `./assets/img/photos/movie2.jpg` : undefined}
						src={backgroundVideoUrl}
						autoPlay
						loop
						playsInline
						muted
					></video>
				<div className="video-content">
					<div className={`${containerType} ${containerClassNames}`.trim()}>
						<InnerBlocks.Content />
					</div>
				</div>
			</>
		) : (
			<div className={`${containerType} ${containerClassNames}`.trim()}>
				<InnerBlocks.Content />
			</div>
		)}
		</section>
	);
};

export default SectionSave;


