import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { normalizeMinHeightClass, getContainerClassNames, getAngledClasses, getWaveConfig, WAVE_SVGS } from './utils';
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

	// Angled divider classes
	classes.push(...getAngledClasses(attrs));

	// Border classes
	if (attrs.borderRadius) {
		classes.push(attrs.borderRadius);
	}

	if (attrs.shadow) {
		classes.push(attrs.shadow);
	}

	if (attrs.borderPosition) {
		classes.push(attrs.borderPosition);
	}

	// Если выбраны цвет или ширина, но нет позиции - применяем обычный border
	if ((attrs.borderColor || attrs.borderWidth) && !attrs.borderPosition) {
		classes.push('border');
	}

	if (attrs.borderWidth) {
		classes.push(attrs.borderWidth);
	}

	if (attrs.borderColor) {
		const colorType = attrs.borderColorType || 'solid';
		if (colorType === 'soft') {
			classes.push(`border-soft-${attrs.borderColor}`);
		} else if (colorType === 'pale') {
			classes.push(`border-pale-${attrs.borderColor}`);
		} else {
			classes.push(`border-${attrs.borderColor}`);
		}
	}

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

	// Get wave configuration
	const waveConfig = getWaveConfig(attributes);

	// Create wave SVG element for React
	const createWaveSvg = (waveType, position) => {
		if (!waveType || !WAVE_SVGS[waveType]) return null;
		
		// Parse SVG string to get viewBox and path
		const svgMatch = WAVE_SVGS[waveType].match(/viewBox="([^"]+)".*d="([^"]+)"/);
		if (!svgMatch) return null;

		const [, viewBox, pathD] = svgMatch;

		return (
			<div className={`divider text-light${position === 'top' ? ' divider-top' : ''}`}>
				<svg 
					xmlns="http://www.w3.org/2000/svg" 
					viewBox={viewBox}
					style={position === 'top' ? { transform: 'rotate(180deg)' } : undefined}
				>
					<path fill="currentColor" d={pathD} />
				</svg>
			</div>
		);
	};

	return (
		<section
			{...blockProps}
			{...(backgroundType === 'image' && backgroundImageUrl && { 'data-image-src': backgroundImageUrl })}
			{...(backgroundType === 'pattern' && backgroundPatternUrl && { 'data-image-src': backgroundPatternUrl })}
			{...dataAttributes}
		>
			{/* Top Wave Divider */}
			{waveConfig.hasTopWave && createWaveSvg(waveConfig.topType, 'top')}

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

			{/* Bottom Wave Divider */}
			{waveConfig.hasBottomWave && createWaveSvg(waveConfig.bottomType, 'bottom')}
		</section>
	);
};

export default SectionSave;


