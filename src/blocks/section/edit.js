import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { SectionSidebar } from './sidebar';
import { __ } from '@wordpress/i18n';
import { normalizeMinHeightClass, getContainerClassNames, getSpacingClasses } from './utils';
import { generateBackgroundClasses, generateTextColorClass } from '../../utilities/class-generators';

const normalizeSectionId = (value = '') => value.replace(/^#/, '').trim();

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/image',
	'core/list',
	'core/quote',
	'core/group',
	'codeweber-blocks/button',
	'codeweber-blocks/grid',
	'codeweber-blocks/row',
	'codeweber-blocks/columns',
	'codeweber-blocks/row',
	// Add more allowed blocks as needed
];

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
						allowedBlocks={ALLOWED_BLOCKS}
						template={TEMPLATE}
						templateLock={false}
					/>
				</div>
			</section>
		</>
	);
};

export default SectionEdit;


