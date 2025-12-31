import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { SectionSidebar } from './sidebar';
import { __ } from '@wordpress/i18n';
import { normalizeMinHeightClass, getContainerClassNames, getSpacingClasses, getAngledClasses, getWaveConfig, WAVE_SVGS } from './utils';
import { generateBackgroundClasses, generateTextColorClass } from '../../utilities/class-generators';

const normalizeSectionId = (value = '') => value.replace(/^#/, '').trim();

const TEMPLATE = [
	[
		'codeweber-blocks/columns',
		{ columnsCount: 4 },
		[
			['codeweber-blocks/column', {}, [['core/html', { content: '' }]]],
			['codeweber-blocks/column', {}, [['core/html', { content: '' }]]],
			['codeweber-blocks/column', {}, [['core/html', { content: '' }]]],
			['codeweber-blocks/column', {}, [['core/html', { content: '' }]]],
		],
	],
];

const getSectionClasses = (attrs) => {
	const classes = [];

	// Background classes
	classes.push(...generateBackgroundClasses(attrs));

	// Text color
	classes.push(generateTextColorClass(attrs.textColor));

	// Spacing classes
	classes.push(...getSpacingClasses(attrs));

	// Angled divider classes
	classes.push(...getAngledClasses(attrs));

	// Border classes
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

const SectionEdit = ({ attributes, setAttributes }) => {
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

	const blockProps = useBlockProps({
		className: `wrapper dash-border ${getSectionClasses(attributes)} ${sectionFrame ? 'section-frame' : ''} ${overflowHidden ? 'overflow-hidden' : ''} ${positionRelative ? 'position-relative' : ''} ${normalizedMinHeight} ${sectionClass}`,
		id: safeSectionId || undefined,
		role: 'region',
		'aria-label': safeSectionId ? `Section ${safeSectionId}` : 'Content section',
	});

	const getSectionStyles = () => {
		const styles = {};

		if (backgroundType === 'image' && backgroundImageUrl) {
			styles.backgroundImage = `url(${backgroundImageUrl})`;
			styles.backgroundRepeat = 'no-repeat';
			if (backgroundSize === 'bg-cover') {
				styles.backgroundSize = 'cover';
			} else if (backgroundSize === 'bg-full') {
				styles.backgroundSize = '100% 100%';
			} else {
				styles.backgroundSize = 'auto';
			}
			styles.backgroundPosition = 'center';
			styles.backgroundAttachment = backgroundSize === 'bg-full' ? 'scroll' : 'fixed';
		}

		if (backgroundType === 'pattern' && backgroundPatternUrl) {
			styles.backgroundImage = `url(${backgroundPatternUrl})`;
			styles.backgroundRepeat = 'repeat';
			if (backgroundSize === 'bg-cover') {
				styles.backgroundSize = 'cover';
			} else if (backgroundSize === 'bg-full') {
				styles.backgroundSize = '100% 100%';
			} else {
				styles.backgroundSize = 'auto';
			}
		}

		return Object.keys(styles).length > 0 ? styles : undefined;
	};

	// Get wave configuration
	const waveConfig = getWaveConfig(attributes);

	return (
		<>
			<InspectorControls>
				<SectionSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<section
				{...blockProps}
				style={getSectionStyles()}
			>
				{/* Top Wave Divider */}
				{waveConfig.hasTopWave && (
					<div 
						className="divider text-light"
						style={{ 
							position: 'absolute', 
							top: 0, 
							left: 0, 
							right: 0,
							transform: 'rotate(180deg)',
							zIndex: 1,
							lineHeight: 0
						}}
						dangerouslySetInnerHTML={{ __html: WAVE_SVGS[waveConfig.topType] }}
					/>
				)}

				{backgroundType === 'video' && backgroundVideoUrl ? (
					<video
						poster={backgroundVideoUrl ? `./assets/img/photos/movie2.jpg` : undefined}
						src={backgroundVideoUrl}
						autoPlay
						loop
						playsInline
						muted
						style={{ width: '100%', height: 'auto' }}
					></video>
				) : null}
				<div className={`${backgroundType === 'video' ? 'video-content' : ''} ${containerType} ${containerClassNames}`.trim()}>
					<InnerBlocks
						template={TEMPLATE}
						templateLock={false}
					/>
				</div>

				{/* Bottom Wave Divider */}
				{waveConfig.hasBottomWave && (
					<div 
						className="divider text-light"
						style={{ 
							position: 'absolute', 
							bottom: 0, 
							left: 0, 
							right: 0,
							zIndex: 1,
							lineHeight: 0
						}}
						dangerouslySetInnerHTML={{ __html: WAVE_SVGS[waveConfig.bottomType] }}
					/>
				)}
			</section>
		</>
	);
};

export default SectionEdit;


