import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';
import {
	getItemClassNames,
	getEditorItemStyle,
	getItemEditorBgStyle,
	normalizeItemId,
	normalizeItemData,
} from './utils';

const BPS = [
	{ key: '', label: 'Base' },
	{ key: 'Sm', label: 'SM' },
	{ key: 'Md', label: 'MD' },
	{ key: 'Lg', label: 'LG' },
	{ key: 'Xl', label: 'XL' },
	{ key: 'Xxl', label: 'XXL' },
	{ key: 'Xxxl', label: 'XXXL' },
];

const COL_SPANS = [
	{ label: '1', value: 'span 1' },
	{ label: '2', value: 'span 2' },
	{ label: '3', value: 'span 3' },
	{ label: '4', value: 'span 4' },
	{ label: '5', value: 'span 5' },
	{ label: '6', value: 'span 6' },
	{ label: 'full', value: '1 / -1' },
];

const SELF_OPTIONS = [
	{ value: '', label: '—' },
	{ value: 'auto', label: 'Auto' },
	{ value: 'start', label: 'Start' },
	{ value: 'end', label: 'End' },
	{ value: 'center', label: 'Center' },
	{ value: 'stretch', label: 'Stretch' },
];

function BpSwitcher( { active, onChange } ) {
	return (
		<ButtonGroup style={ { flexWrap: 'wrap', marginBottom: '8px' } }>
			{ BPS.map( ( { key, label } ) => (
				<Button
					key={ key }
					variant={ active === key ? 'primary' : 'secondary' }
					isSmall
					onClick={ () => onChange( key ) }
				>
					{ label }
				</Button>
			) ) }
		</ButtonGroup>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const [ posBp, setPosBp ] = useState( 'Md' );

	const {
		itemId,
		itemHtmlId,
		itemData,
		backgroundImageId,
		backgroundImageSize,
		alignSelf,
		justifySelf,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		spacingXxxl,
	} = attributes;

	const [ availableImageSizes, setAvailableImageSizes ] = useState( [] );
	const [ imageSize, setImageSize ] = useState( '' );

	// Generate unique itemId on first mount
	useEffect( () => {
		if ( ! itemId ) {
			setAttributes( {
				itemId: Math.random().toString( 36 ).substr( 2, 8 ),
			} );
		}
	}, [] );

	// Fetch image metadata when backgroundImageId changes
	useEffect( () => {
		if ( backgroundImageId && backgroundImageId > 0 ) {
			apiFetch( {
				path: `/wp/v2/media/${ backgroundImageId }`,
				method: 'GET',
			} )
				.then( ( attachment ) => {
					if (
						attachment &&
						attachment.media_details &&
						attachment.media_details.filesize
					) {
						const sizeInBytes = attachment.media_details.filesize;
						setImageSize(
							sizeInBytes < 1024 * 1024
								? ( sizeInBytes / 1024 ).toFixed( 1 ) + ' KB'
								: ( sizeInBytes / ( 1024 * 1024 ) ).toFixed( 1 ) +
										' MB'
						);
					} else {
						setImageSize( '' );
					}
					if (
						attachment &&
						attachment.media_details &&
						attachment.media_details.sizes
					) {
						const sizes = Object.keys( attachment.media_details.sizes );
						sizes.push( 'full' );
						setAvailableImageSizes( sizes );
					} else {
						setAvailableImageSizes( [ 'full' ] );
					}
				} )
				.catch( () => {
					setImageSize( '' );
					setAvailableImageSizes( [] );
				} );
		} else {
			setImageSize( '' );
			setAvailableImageSizes( [] );
		}
	}, [ backgroundImageId ] );

	// Update image URL when size selection changes
	useEffect( () => {
		if ( backgroundImageId && backgroundImageId > 0 && backgroundImageSize ) {
			apiFetch( {
				path: `/wp/v2/media/${ backgroundImageId }`,
				method: 'GET',
			} )
				.then( ( attachment ) => {
					let newUrl = attachment.source_url;
					if (
						backgroundImageSize !== 'full' &&
						attachment.media_details &&
						attachment.media_details.sizes &&
						attachment.media_details.sizes[ backgroundImageSize ]
					) {
						newUrl =
							attachment.media_details.sizes[ backgroundImageSize ]
								.source_url;
					}
					if ( newUrl !== attributes.backgroundImageUrl ) {
						setAttributes( { backgroundImageUrl: newUrl } );
					}
				} )
				.catch( ( error ) => {
					console.error( 'Failed to fetch image data:', error );
				} );
		}
	}, [ backgroundImageSize, backgroundImageId ] );

	const itemStyle = getEditorItemStyle( attributes );
	const bgStyle = getItemEditorBgStyle( attributes );
	const combinedStyle = Object.assign( {}, itemStyle, bgStyle );

	const blockProps = useBlockProps( {
		className: getItemClassNames( attributes, 'edit' ),
		id: normalizeItemId( itemHtmlId ) || undefined,
		style: Object.keys( combinedStyle ).length ? combinedStyle : undefined,
		...normalizeItemData( itemData ),
	} );

	const colAttr = `gridColumn${ posBp }`;
	const rowAttr = `gridRow${ posBp }`;
	const ordAttr = `order${ posBp }`;

	return (
		<>
			<InspectorControls>
				{ /* Grid Position */ }
				<PanelBody
					title={ __(
						'Grid Position',
						'codeweber-gutenberg-blocks'
					) }
					initialOpen={ true }
				>
					<BpSwitcher active={ posBp } onChange={ setPosBp } />
					<p style={ { fontSize: '11px', color: '#757575', margin: '0 0 4px' } }>
						{ __( 'grid-column', 'codeweber-gutenberg-blocks' ) }
					</p>
					<div style={ { display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' } }>
						{ COL_SPANS.map( ( s ) => (
							<Button
								key={ s.value }
								variant={
									attributes[ colAttr ] === s.value
										? 'primary'
										: 'secondary'
								}
								isSmall
								onClick={ () =>
									setAttributes( { [ colAttr ]: s.value } )
								}
							>
								{ s.label }
							</Button>
						) ) }
					</div>
					<TextControl
						value={ attributes[ colAttr ] || '' }
						onChange={ ( val ) =>
							setAttributes( { [ colAttr ]: val } )
						}
						placeholder="span 2 or 1 / 3"
						help={ __(
							'CSS grid-column value',
							'codeweber-gutenberg-blocks'
						) }
					/>
					<TextControl
						label={ __(
							'grid-row',
							'codeweber-gutenberg-blocks'
						) }
						value={ attributes[ rowAttr ] || '' }
						onChange={ ( val ) =>
							setAttributes( { [ rowAttr ]: val } )
						}
						placeholder="span 2 or 1 / 3"
					/>
					<TextControl
						label={ __( 'order', 'codeweber-gutenberg-blocks' ) }
						value={ attributes[ ordAttr ] || '' }
						onChange={ ( val ) =>
							setAttributes( { [ ordAttr ]: val } )
						}
						placeholder="0"
					/>
				</PanelBody>

				{ /* Self Alignment */ }
				<PanelBody
					title={ __(
						'Self Alignment',
						'codeweber-gutenberg-blocks'
					) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __(
							'align-self',
							'codeweber-gutenberg-blocks'
						) }
						value={ alignSelf || '' }
						options={ SELF_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { alignSelf: val } )
						}
					/>
					<SelectControl
						label={ __(
							'justify-self',
							'codeweber-gutenberg-blocks'
						) }
						value={ justifySelf || '' }
						options={ SELF_OPTIONS }
						onChange={ ( val ) =>
							setAttributes( { justifySelf: val } )
						}
					/>
				</PanelBody>

				{ /* Background */ }
				<PanelBody
					title={ __( 'Background', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<BackgroundSettingsPanel
						attributes={ attributes }
						setAttributes={ setAttributes }
						allowVideo={ true }
						backgroundImageSize={ backgroundImageSize }
						imageSizeLabel={ imageSize }
						availableImageSizes={ availableImageSizes }
					/>
				</PanelBody>

				{ /* Spacing */ }
				<PanelBody
					title={ __( 'Spacing', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<SpacingControl
						spacingType={ spacingType }
						spacingXs={ spacingXs }
						spacingSm={ spacingSm }
						spacingMd={ spacingMd }
						spacingLg={ spacingLg }
						spacingXl={ spacingXl }
						spacingXxl={ spacingXxl }
						spacingXxxl={ spacingXxxl }
						onChange={ ( key, val ) =>
							setAttributes( { [ key ]: val } )
						}
					/>
				</PanelBody>

				{ /* Advanced */ }
				<PanelBody
					title={ __( 'Advanced', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<BlockMetaFields
						attributes={ attributes }
						setAttributes={ setAttributes }
						fieldKeys={ {
							classKey: 'itemClass',
							dataKey: 'itemData',
							idKey: 'itemHtmlId',
						} }
						labels={ {
							classLabel: __(
								'Item Class',
								'codeweber-gutenberg-blocks'
							),
							dataLabel: __(
								'Item Data',
								'codeweber-gutenberg-blocks'
							),
							idLabel: __(
								'Item ID',
								'codeweber-gutenberg-blocks'
							),
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks templateLock={ false } />
			</div>
		</>
	);
}
