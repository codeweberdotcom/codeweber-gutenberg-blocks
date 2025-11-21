import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { SectionSidebar } from './sidebar';
import { __ } from '@wordpress/i18n';
import { normalizeMinHeightClass, getContainerClassNames, getSpacingClasses } from './utils';

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

	classes.push(...getSpacingClasses(attrs));

	return classes.join(' ');
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


