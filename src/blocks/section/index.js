import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';

import metadata from './block.json';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import {
	normalizeMinHeightClass,
	getContainerClassNames,
	getSectionAlignClasses,
	getAngledClasses,
	getWaveConfig,
	WAVE_SVGS,
} from './utils';
import {
	generateBackgroundClasses,
	generateTextColorClass,
} from '../../utilities/class-generators';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';

const ALLOWED_SECTION_TAGS = [
	'section', 'header', 'footer', 'article', 'aside', 'address', 'nav',
];

const normalizeSectionId = ( v = '' ) => v.replace( /^#/, '' ).trim();

const normalizeDataAttributeName = ( key = '' ) => {
	if ( ! key ) return null;
	const trimmed = key.trim();
	if ( ! trimmed ) return null;
	const lower = trimmed.toLowerCase();
	if ( lower.startsWith( 'data-' ) || lower.startsWith( 'aria-' ) ) return lower;
	return `data-${ lower }`;
};

const getSectionClassesDeprecated = ( attrs ) => {
	const classes = [];
	classes.push( ...generateBackgroundClasses( attrs ) );
	classes.push( generateTextColorClass( attrs.textColor ) );
	classes.push( ...getAngledClasses( attrs ) );
	if ( attrs.borderRadius ) classes.push( attrs.borderRadius );
	if ( attrs.shadow ) classes.push( attrs.shadow );
	if ( attrs.borderAccent ) {
		classes.push( attrs.borderAccent );
		if ( attrs.borderColor ) {
			const colorType = attrs.borderColorType || 'solid';
			classes.push( colorType === 'soft' ? `border-soft-${ attrs.borderColor }` : `border-${ attrs.borderColor }` );
		}
	} else {
		if ( attrs.borderPosition ) classes.push( attrs.borderPosition );
		if ( ( attrs.borderColor || attrs.borderWidth ) && ! attrs.borderPosition ) classes.push( 'border' );
		if ( attrs.borderWidth ) classes.push( attrs.borderWidth );
		if ( attrs.borderColor ) {
			const colorType = attrs.borderColorType || 'solid';
			if ( colorType === 'soft' ) classes.push( `border-soft-${ attrs.borderColor }` );
			else if ( colorType === 'pale' ) classes.push( `border-pale-${ attrs.borderColor }` );
			else classes.push( `border-${ attrs.borderColor }` );
		}
	}
	return classes.filter( Boolean ).join( ' ' );
};

/**
 * Block Registration
 */

registerBlockType( metadata, {
	edit: Edit,
	save: Save,
	deprecated: [
		{
			// Hardcoded poster path instead of backgroundVideoPosterUrl attribute
			attributes: {
				...metadata.attributes,
				backgroundVideoPosterId: undefined,
				backgroundVideoPosterUrl: undefined,
			},
			save( { attributes } ) {
				const {
					backgroundType, backgroundImageUrl, backgroundPatternUrl,
					backgroundVideoUrl, backgroundOverlay, textColor,
					containerClass, containerType, containerTextAlign,
					containerAlignItems, containerJustifyContent, containerPosition,
					sectionTag, sectionFrame, overflowHidden, positionRelative,
					minHeight, sectionClass, sectionData, sectionId, anchor,
				} = attributes;

				const Tag = ALLOWED_SECTION_TAGS.includes( sectionTag ) ? sectionTag : 'section';
				const normalizedMinHeight = normalizeMinHeightClass( minHeight );
				const safeSectionId = normalizeSectionId( sectionId );
				const containerClassNames = getContainerClassNames( {
					containerClass, containerTextAlign, containerAlignItems,
					containerJustifyContent, containerPosition,
				} );
				const sectionAlignClassNames = getSectionAlignClasses( attributes ).join( ' ' );

				const blockProps = useBlockProps.save( {
					className: `wrapper ${ getSectionClassesDeprecated( attributes ) } ${ sectionFrame ? 'section-frame' : '' } ${ overflowHidden ? 'overflow-hidden' : '' } ${ positionRelative ? 'position-relative' : '' } ${ normalizedMinHeight } ${ sectionAlignClassNames } ${ sectionClass }`,
					id: safeSectionId || anchor || undefined,
					role: 'region',
					'aria-label': safeSectionId ? `Section ${ safeSectionId }` : 'Content section',
				} );

				const parseDataAttributes = ( dataString ) => {
					if ( ! dataString || dataString.trim() === '' ) return {};
					const result = {};
					dataString.split( ',' ).map( ( p ) => p.trim() ).forEach( ( pair ) => {
						if ( ! pair ) return;
						const [ rawKey, ...rest ] = pair.split( '=' );
						const value = ( rest.join( '=' ) || '' ).trim();
						const attrName = normalizeDataAttributeName( rawKey );
						if ( attrName && value ) result[ attrName ] = value;
					} );
					return result;
				};

				const dataAttributes = parseDataAttributes( sectionData );
				const waveConfig = getWaveConfig( attributes );

				const createWaveSvg = ( waveType, position ) => {
					if ( ! waveType || ! WAVE_SVGS[ waveType ] ) return null;
					const svgMatch = WAVE_SVGS[ waveType ].match( /viewBox="([^"]+)".*d="([^"]+)"/ );
					if ( ! svgMatch ) return null;
					const [ , viewBox, pathD ] = svgMatch;
					return (
						<div className={ `divider text-light${ position === 'top' ? ' divider-top' : '' }` }>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox={ viewBox } style={ position === 'top' ? { transform: 'rotate(180deg)' } : undefined }>
								<path fill="currentColor" d={ pathD } />
							</svg>
						</div>
					);
				};

				return (
					<Tag
						{ ...blockProps }
						{ ...( backgroundType === 'image' && backgroundImageUrl && { 'data-image-src': backgroundImageUrl } ) }
						{ ...( backgroundType === 'pattern' && backgroundPatternUrl && { 'data-image-src': backgroundPatternUrl } ) }
						{ ...dataAttributes }
					>
						{ waveConfig.hasTopWave && createWaveSvg( waveConfig.topType, 'top' ) }
						{ backgroundType === 'video' ? (
							<>
								<video
									poster={ backgroundVideoUrl ? '/wp-content/themes/codeweber/dist/assets/img/photos/movie2.jpg' : undefined }
									src={ backgroundVideoUrl }
									autoPlay loop playsInline muted disablePictureInPicture
								></video>
								<div className="video-content">
									<div className={ `${ containerType } ${ containerClassNames }`.trim() }>
										<InnerBlocks.Content />
									</div>
								</div>
							</>
						) : (
							<div className={ `${ containerType } ${ containerClassNames }`.trim() }>
								<InnerBlocks.Content />
							</div>
						) }
						{ waveConfig.hasBottomWave && createWaveSvg( waveConfig.bottomType, 'bottom' ) }
					</Tag>
				);
			},
		},
	],
} );
