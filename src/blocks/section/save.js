import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { normalizeMinHeightClass, getContainerClassNames } from './utils';
import { generateBackgroundClasses, generateTextColorClass } from '../../utilities/class-generators';

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

	// Background classes
	classes.push(...generateBackgroundClasses(attrs));

	// Text color
	classes.push(generateTextColorClass(attrs.textColor));

	return classes.filter(Boolean).join(' ');
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
		role: 'region',
		'aria-label': safeSectionId ? `Section ${safeSectionId}` : 'Content section',
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


