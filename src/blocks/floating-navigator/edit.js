/**
 * Floating Navigator Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useMemo, useCallback } from '@wordpress/element';
import {
	PanelBody,
	SelectControl,
	TextControl,
	RangeControl,
	ColorPicker,
	TabPanel,
	Button,
	CheckboxControl,
	Flex,
	FlexItem,
	FlexBlock,
	__experimentalText as Text,
} from '@wordpress/components';
import { chevronUp, chevronDown, trash } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		items,
		position,
		buttonType,
		buttonText,
		buttonIcon,
		buttonColor,
		popupBgColor,
		popupTextColor,
		offsetXDesktop,
		offsetYDesktop,
		offsetXTablet,
		offsetYTablet,
		offsetXMobile,
		offsetYMobile,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'cwgb-floating-navigator-editor',
	} );

	// Get all blocks on the page that have an anchor set
	const pageBlocks = useSelect( ( select ) => {
		const allBlocks = select( 'core/block-editor' ).getBlocks();
		const flatBlocks = [];
		const flatten = ( blocks ) => {
			blocks.forEach( ( block ) => {
				if ( block.clientId !== clientId ) {
					flatBlocks.push( block );
				}
				if ( block.innerBlocks && block.innerBlocks.length ) {
					flatten( block.innerBlocks );
				}
			} );
		};
		flatten( allBlocks );
		return flatBlocks;
	}, [ clientId ] );

	const anchoredBlocks = useMemo( () => {
		return pageBlocks.filter(
			( block ) => block.attributes && block.attributes.anchor
		);
	}, [ pageBlocks ] );

	// Toggle item selection
	const toggleItem = useCallback(
		( block ) => {
			const anchor = block.attributes.anchor;
			const label =
				block.attributes.content ||
				block.attributes.text ||
				block.attributes.title ||
				block.name.replace( 'codeweber-blocks/', '' );
			const exists = items.some( ( i ) => i.anchor === anchor );
			if ( exists ) {
				setAttributes( {
					items: items.filter( ( i ) => i.anchor !== anchor ),
				} );
			} else {
				setAttributes( {
					items: [
						...items,
						{
							anchor,
							label:
								typeof label === 'string'
									? label.replace( /<[^>]+>/g, '' ).substring( 0, 60 )
									: anchor,
							clientId: block.clientId,
						},
					],
				} );
			}
		},
		[ items, setAttributes ]
	);

	const updateItemLabel = useCallback(
		( idx, label ) => {
			const updated = items.map( ( item, i ) =>
				i === idx ? { ...item, label } : item
			);
			setAttributes( { items: updated } );
		},
		[ items, setAttributes ]
	);

	const removeItem = useCallback(
		( idx ) => {
			setAttributes( { items: items.filter( ( _, i ) => i !== idx ) } );
		},
		[ items, setAttributes ]
	);

	const moveItem = useCallback(
		( idx, dir ) => {
			const newIdx = idx + dir;
			if ( newIdx < 0 || newIdx >= items.length ) return;
			const arr = [ ...items ];
			const [ removed ] = arr.splice( idx, 1 );
			arr.splice( newIdx, 0, removed );
			setAttributes( { items: arr } );
		},
		[ items, setAttributes ]
	);

	const selectedAnchors = useMemo(
		() => new Set( items.map( ( i ) => i.anchor ) ),
		[ items ]
	);

	const positionLabels = {
		'right-bottom': __( 'Bottom Right', 'codeweber-gutenberg-blocks' ),
		'right-top': __( 'Top Right', 'codeweber-gutenberg-blocks' ),
		'left-bottom': __( 'Bottom Left', 'codeweber-gutenberg-blocks' ),
		'left-top': __( 'Top Left', 'codeweber-gutenberg-blocks' ),
	};

	return (
		<>
			<InspectorControls>
				{ /* === CONTENT PANEL === */ }
				<PanelBody
					title={ __( 'Content', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<p style={ { fontSize: 12, color: '#757575', marginBottom: 8 } }>
						{ __(
							'Select blocks with anchors to include in the navigation. Set an anchor in each block\'s Advanced settings.',
							'codeweber-gutenberg-blocks'
						) }
					</p>

					{ anchoredBlocks.length === 0 ? (
						<p style={ { fontSize: 12, color: '#b0b0b0', fontStyle: 'italic' } }>
							{ __(
								'No blocks with anchors found on this page.',
								'codeweber-gutenberg-blocks'
							) }
						</p>
					) : (
						<div style={ { marginBottom: 16 } }>
							<Text
								size={ 11 }
								upperCase
								weight={ 600 }
								style={ { color: '#757575', display: 'block', marginBottom: 6 } }
							>
								{ __( 'Available blocks', 'codeweber-gutenberg-blocks' ) }
							</Text>
							{ anchoredBlocks.map( ( block ) => (
								<CheckboxControl
									key={ block.clientId }
									label={ `#${ block.attributes.anchor } (${ block.name.replace( 'codeweber-blocks/', '' ) })` }
									checked={ selectedAnchors.has( block.attributes.anchor ) }
									onChange={ () => toggleItem( block ) }
								/>
							) ) }
						</div>
					) }

					{ items.length > 0 && (
						<div>
							<Text
								size={ 11 }
								upperCase
								weight={ 600 }
								style={ { color: '#757575', display: 'block', marginBottom: 6 } }
							>
								{ __( 'Order & Labels', 'codeweber-gutenberg-blocks' ) }
							</Text>
							{ items.map( ( item, idx ) => (
								<div
									key={ item.anchor }
									style={ {
										border: '1px solid #ddd',
										borderRadius: 4,
										padding: '8px 10px',
										marginBottom: 6,
										background: '#fafafa',
									} }
								>
									<Flex align="center" gap={ 2 }>
										<FlexItem>
											<Flex direction="column" gap={ 1 }>
												<Button
													icon={ chevronUp }
													isSmall
													disabled={ idx === 0 }
													onClick={ () => moveItem( idx, -1 ) }
													label={ __( 'Move up', 'codeweber-gutenberg-blocks' ) }
												/>
												<Button
													icon={ chevronDown }
													isSmall
													disabled={ idx === items.length - 1 }
													onClick={ () => moveItem( idx, 1 ) }
													label={ __( 'Move down', 'codeweber-gutenberg-blocks' ) }
												/>
											</Flex>
										</FlexItem>
										<FlexBlock>
											<TextControl
												value={ item.label }
												onChange={ ( val ) => updateItemLabel( idx, val ) }
												placeholder={ item.anchor }
												hideLabelFromVision
												label={ __( 'Label', 'codeweber-gutenberg-blocks' ) }
												__nextHasNoMarginBottom
											/>
											<Text size={ 10 } style={ { color: '#aaa', display: 'block' } }>
												#{ item.anchor }
											</Text>
										</FlexBlock>
										<FlexItem>
											<Button
												icon={ trash }
												isSmall
												isDestructive
												onClick={ () => removeItem( idx ) }
												label={ __( 'Remove', 'codeweber-gutenberg-blocks' ) }
											/>
										</FlexItem>
									</Flex>
								</div>
							) ) }
						</div>
					) }
				</PanelBody>

				{ /* === APPEARANCE PANEL === */ }
				<PanelBody
					title={ __( 'Appearance', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Position', 'codeweber-gutenberg-blocks' ) }
						value={ position }
						options={ Object.entries( positionLabels ).map( ( [ value, label ] ) => ( {
							value,
							label,
						} ) ) }
						onChange={ ( val ) => setAttributes( { position: val } ) }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Button type', 'codeweber-gutenberg-blocks' ) }
						value={ buttonType }
						options={ [
							{
								value: 'icon',
								label: __( 'Icon only', 'codeweber-gutenberg-blocks' ),
							},
							{
								value: 'button',
								label: __( 'Icon + text', 'codeweber-gutenberg-blocks' ),
							},
						] }
						onChange={ ( val ) => setAttributes( { buttonType: val } ) }
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={ __( 'Button icon (Unicons class)', 'codeweber-gutenberg-blocks' ) }
						value={ buttonIcon }
						onChange={ ( val ) => setAttributes( { buttonIcon: val } ) }
						placeholder="list-ul"
						help={ __(
							'Unicons class without "uil-" prefix, e.g. list-ul, compass, map',
							'codeweber-gutenberg-blocks'
						) }
						__nextHasNoMarginBottom
					/>
					{ buttonType === 'button' && (
						<TextControl
							label={ __( 'Button text', 'codeweber-gutenberg-blocks' ) }
							value={ buttonText }
							onChange={ ( val ) => setAttributes( { buttonText: val } ) }
							__nextHasNoMarginBottom
						/>
					) }
					<SelectControl
						label={ __( 'Button color', 'codeweber-gutenberg-blocks' ) }
						value={ buttonColor }
						options={ [
							{ value: 'primary', label: __( 'Primary', 'codeweber-gutenberg-blocks' ) },
							{ value: 'secondary', label: __( 'Secondary', 'codeweber-gutenberg-blocks' ) },
							{ value: 'dark', label: __( 'Dark', 'codeweber-gutenberg-blocks' ) },
							{ value: 'light', label: __( 'Light', 'codeweber-gutenberg-blocks' ) },
							{ value: 'success', label: __( 'Success', 'codeweber-gutenberg-blocks' ) },
							{ value: 'danger', label: __( 'Danger', 'codeweber-gutenberg-blocks' ) },
							{ value: 'warning', label: __( 'Warning', 'codeweber-gutenberg-blocks' ) },
							{ value: 'info', label: __( 'Info', 'codeweber-gutenberg-blocks' ) },
						] }
						onChange={ ( val ) => setAttributes( { buttonColor: val } ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				{ /* === COLORS PANEL === */ }
				<PanelBody
					title={ __( 'Popup Colors', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<div>
						<Text
							size={ 12 }
							weight={ 600 }
							style={ { display: 'block', marginBottom: 8 } }
						>
							{ __( 'Popup background', 'codeweber-gutenberg-blocks' ) }
						</Text>
						<ColorPicker
							color={ popupBgColor }
							onChange={ ( val ) => setAttributes( { popupBgColor: val } ) }
							enableAlpha
							defaultValue="#ffffff"
						/>
					</div>
					<div style={ { marginTop: 16 } }>
						<Text
							size={ 12 }
							weight={ 600 }
							style={ { display: 'block', marginBottom: 8 } }
						>
							{ __( 'Popup text color', 'codeweber-gutenberg-blocks' ) }
						</Text>
						<ColorPicker
							color={ popupTextColor }
							onChange={ ( val ) => setAttributes( { popupTextColor: val } ) }
							enableAlpha
							defaultValue="#212529"
						/>
					</div>
				</PanelBody>

				{ /* === OFFSETS PANEL === */ }
				<PanelBody
					title={ __( 'Offsets', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<TabPanel
						tabs={ [
							{ name: 'desktop', title: __( 'Desktop', 'codeweber-gutenberg-blocks' ) },
							{ name: 'tablet', title: __( 'Tablet', 'codeweber-gutenberg-blocks' ) },
							{ name: 'mobile', title: __( 'Mobile', 'codeweber-gutenberg-blocks' ) },
						] }
					>
						{ ( tab ) => {
							if ( tab.name === 'desktop' ) {
								return (
									<>
										<RangeControl
											label={ __( 'Horizontal offset (px)', 'codeweber-gutenberg-blocks' ) }
											value={ offsetXDesktop }
											onChange={ ( val ) =>
												setAttributes( { offsetXDesktop: val } )
											}
											min={ 0 }
											max={ 120 }
											__nextHasNoMarginBottom
										/>
										<RangeControl
											label={ __( 'Vertical offset (px)', 'codeweber-gutenberg-blocks' ) }
											value={ offsetYDesktop }
											onChange={ ( val ) =>
												setAttributes( { offsetYDesktop: val } )
											}
											min={ 0 }
											max={ 200 }
											__nextHasNoMarginBottom
										/>
									</>
								);
							}
							if ( tab.name === 'tablet' ) {
								return (
									<>
										<RangeControl
											label={ __( 'Horizontal offset (px)', 'codeweber-gutenberg-blocks' ) }
											value={ offsetXTablet }
											onChange={ ( val ) =>
												setAttributes( { offsetXTablet: val } )
											}
											min={ 0 }
											max={ 120 }
											__nextHasNoMarginBottom
										/>
										<RangeControl
											label={ __( 'Vertical offset (px)', 'codeweber-gutenberg-blocks' ) }
											value={ offsetYTablet }
											onChange={ ( val ) =>
												setAttributes( { offsetYTablet: val } )
											}
											min={ 0 }
											max={ 200 }
											__nextHasNoMarginBottom
										/>
									</>
								);
							}
							return (
								<>
									<RangeControl
										label={ __( 'Horizontal offset (px)', 'codeweber-gutenberg-blocks' ) }
										value={ offsetXMobile }
										onChange={ ( val ) =>
											setAttributes( { offsetXMobile: val } )
										}
										min={ 0 }
										max={ 120 }
										__nextHasNoMarginBottom
									/>
									<RangeControl
										label={ __( 'Vertical offset (px)', 'codeweber-gutenberg-blocks' ) }
										value={ offsetYMobile }
										onChange={ ( val ) =>
											setAttributes( { offsetYMobile: val } )
										}
										min={ 0 }
										max={ 200 }
										__nextHasNoMarginBottom
									/>
								</>
							);
						} }
					</TabPanel>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="cwgb-floating-navigator-editor__preview">
					<span
						className={ `cwgb-floating-navigator-editor__btn btn btn-${ buttonColor } btn-circle` }
					>
						<i className={ `uil uil-${ buttonIcon }` } />
						{ buttonType === 'button' && (
							<span style={ { marginLeft: 6 } }>{ buttonText }</span>
						) }
					</span>
					<span className="cwgb-floating-navigator-editor__meta">
						{ __( 'Floating Navigator', 'codeweber-gutenberg-blocks' ) }
						{ ' — ' }
						{ positionLabels[ position ] }
						{ items.length > 0 && ` · ${ items.length } ${ __( 'items', 'codeweber-gutenberg-blocks' ) }` }
					</span>
				</div>
			</div>
		</>
	);
}
