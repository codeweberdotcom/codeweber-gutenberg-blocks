/**
 * Floating Navigator Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useMemo, useCallback, useState } from '@wordpress/element';
import {
	PanelBody,
	SelectControl,
	TextControl,
	RangeControl,
	ColorPalette,
	TabPanel,
	Button,
	ButtonGroup,
	ToggleControl,
	Flex,
	FlexItem,
	FlexBlock,
	BaseControl,
	__experimentalText as Text,
} from '@wordpress/components';
import { chevronUp, chevronDown, trash } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';

import { IconPicker } from '../../components/icon/IconPicker';

const BUTTON_TYPE_OPTIONS = [
	{ value: 'icon', label: __( 'Icon only', 'codeweber-gutenberg-blocks' ) },
	{ value: 'button', label: __( 'Icon + text', 'codeweber-gutenberg-blocks' ) },
];

const POSITION_LABELS = {
	'right-bottom': __( 'Bottom Right', 'codeweber-gutenberg-blocks' ),
	'right-top': __( 'Top Right', 'codeweber-gutenberg-blocks' ),
	'left-bottom': __( 'Bottom Left', 'codeweber-gutenberg-blocks' ),
	'left-top': __( 'Top Left', 'codeweber-gutenberg-blocks' ),
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		items,
		position,
		buttonTypeDesktop,
		buttonTypeTablet,
		buttonTypeMobile,
		buttonText,
		buttonIcon,
		buttonColor,
		buttonSize,
		buttonRotate,
		popupBgColor,
		popupTextColor,
		offsetXDesktop,
		offsetYDesktop,
		offsetXTablet,
		offsetYTablet,
		offsetXMobile,
		offsetYMobile,
	} = attributes;

	const [ isIconPickerOpen, setIsIconPickerOpen ] = useState( false );

	const blockProps = useBlockProps( {
		className: 'cwgb-floating-navigator-editor',
	} );

	// All blocks on the page that have an anchor
	const anchoredBlocks = useSelect(
		( select ) => {
			const allBlocks = select( 'core/block-editor' ).getBlocks();
			const result = [];
			const flatten = ( blocks ) => {
				blocks.forEach( ( block ) => {
					if ( block.clientId !== clientId && block.attributes?.anchor ) {
						result.push( block );
					}
					if ( block.innerBlocks?.length ) {
						flatten( block.innerBlocks );
					}
				} );
			};
			flatten( allBlocks );
			return result;
		},
		[ clientId ]
	);

	const selectedAnchors = useMemo(
		() => new Set( items.map( ( i ) => i.anchor ) ),
		[ items ]
	);

	const toggleItem = useCallback(
		( block ) => {
			const anchor = block.attributes.anchor;
			if ( selectedAnchors.has( anchor ) ) {
				setAttributes( { items: items.filter( ( i ) => i.anchor !== anchor ) } );
			} else {
				const rawLabel =
					block.attributes.content ||
					block.attributes.text ||
					block.attributes.title ||
					anchor;
				const label =
					typeof rawLabel === 'string'
						? rawLabel.replace( /<[^>]+>/g, '' ).substring( 0, 60 )
						: anchor;
				setAttributes( {
					items: [ ...items, { anchor, label, clientId: block.clientId } ],
				} );
			}
		},
		[ items, selectedAnchors, setAttributes ]
	);

	const updateItemLabel = useCallback(
		( idx, label ) => {
			setAttributes( {
				items: items.map( ( item, i ) => ( i === idx ? { ...item, label } : item ) ),
			} );
		},
		[ items, setAttributes ]
	);

	const removeItem = useCallback(
		( idx ) => setAttributes( { items: items.filter( ( _, i ) => i !== idx ) } ),
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

	// Find label for a selected item (may have been manually edited)
	const getItemForAnchor = ( anchor ) => items.find( ( i ) => i.anchor === anchor );

	return (
		<>
			<InspectorControls>

				{ /* ── CONTENT ── */ }
				<PanelBody
					title={ __( 'Content', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					{ anchoredBlocks.length === 0 ? (
						<p style={ { fontSize: 12, color: '#b0b0b0', fontStyle: 'italic', margin: 0 } }>
							{ __(
								'No blocks with anchors on this page. Set an anchor in Advanced settings of any block.',
								'codeweber-gutenberg-blocks'
							) }
						</p>
					) : (
						<>
							<Text
								size={ 11 }
								upperCase
								weight={ 600 }
								style={ { color: '#757575', display: 'block', marginBottom: 8 } }
							>
								{ __( 'Select blocks', 'codeweber-gutenberg-blocks' ) }
							</Text>

							{ anchoredBlocks.map( ( block ) => {
								const anchor = block.attributes.anchor;
								const isSelected = selectedAnchors.has( anchor );
								const item = getItemForAnchor( anchor );
								const itemIdx = items.findIndex( ( i ) => i.anchor === anchor );

								return (
									<div
										key={ block.clientId }
										style={ {
											border: `1px solid ${ isSelected ? '#007cba' : '#ddd' }`,
											borderRadius: 4,
											padding: '8px 10px',
											marginBottom: 6,
											background: isSelected ? '#f0f7fb' : '#fafafa',
										} }
									>
										<Flex align="center" gap={ 2 }>
											{ /* Checkbox */ }
											<FlexItem>
												<input
													type="checkbox"
													id={ `fn-block-${ block.clientId }` }
													checked={ isSelected }
													onChange={ () => toggleItem( block ) }
													style={ { marginTop: 2 } }
												/>
											</FlexItem>

											{ /* Anchor label + text input */ }
											<FlexBlock>
												<label
													htmlFor={ `fn-block-${ block.clientId }` }
													style={ {
														fontSize: 11,
														color: '#555',
														display: 'block',
														marginBottom: isSelected ? 4 : 0,
														cursor: 'pointer',
													} }
												>
													<code style={ { fontSize: 11 } }>#{ anchor }</code>
													{ ' ' }
													<span style={ { color: '#999' } }>
														{ block.name.replace( 'codeweber-blocks/', '' ) }
													</span>
												</label>

												{ isSelected && (
													<TextControl
														value={ item?.label || '' }
														onChange={ ( val ) => updateItemLabel( itemIdx, val ) }
														placeholder={ anchor }
														hideLabelFromVision
														label={ __( 'Label', 'codeweber-gutenberg-blocks' ) }
														__nextHasNoMarginBottom
													/>
												) }
											</FlexBlock>

											{ /* Reorder buttons (only when selected) */ }
											{ isSelected && (
												<FlexItem>
													<Flex direction="column" gap={ 1 }>
														<Button
															icon={ chevronUp }
															isSmall
															disabled={ itemIdx === 0 }
															onClick={ () => moveItem( itemIdx, -1 ) }
															label={ __( 'Move up', 'codeweber-gutenberg-blocks' ) }
														/>
														<Button
															icon={ chevronDown }
															isSmall
															disabled={ itemIdx === items.length - 1 }
															onClick={ () => moveItem( itemIdx, 1 ) }
															label={ __( 'Move down', 'codeweber-gutenberg-blocks' ) }
														/>
													</Flex>
												</FlexItem>
											) }

											{ /* Remove */ }
											{ isSelected && (
												<FlexItem>
													<Button
														icon={ trash }
														isSmall
														isDestructive
														onClick={ () => removeItem( itemIdx ) }
														label={ __( 'Remove', 'codeweber-gutenberg-blocks' ) }
													/>
												</FlexItem>
											) }
										</Flex>
									</div>
								);
							} ) }
						</>
					) }
				</PanelBody>

				{ /* ── APPEARANCE ── */ }
				<PanelBody
					title={ __( 'Appearance', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Position', 'codeweber-gutenberg-blocks' ) }
						value={ position }
						options={ Object.entries( POSITION_LABELS ).map( ( [ value, label ] ) => ( {
							value,
							label,
						} ) ) }
						onChange={ ( val ) => setAttributes( { position: val } ) }
						__nextHasNoMarginBottom
					/>

					{ /* Icon picker */ }
					<BaseControl
						label={ __( 'Button icon', 'codeweber-gutenberg-blocks' ) }
						__nextHasNoMarginBottom
					>
						<Flex align="center" gap={ 2 } style={ { marginTop: 4 } }>
							<FlexItem>
								<span
									style={ {
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: 36,
										height: 36,
										border: '1px solid #ddd',
										borderRadius: 4,
										background: '#f8f8f8',
										fontSize: 20,
									} }
								>
									<i className={ `uil uil-${ buttonIcon }` } />
								</span>
							</FlexItem>
							<FlexItem>
								<Button
									variant="secondary"
									isSmall
									onClick={ () => setIsIconPickerOpen( true ) }
								>
									{ __( 'Select icon', 'codeweber-gutenberg-blocks' ) }
								</Button>
							</FlexItem>
						</Flex>
					</BaseControl>

					<IconPicker
						isOpen={ isIconPickerOpen }
						onClose={ () => setIsIconPickerOpen( false ) }
						onSelect={ ( selection ) => {
							if ( selection.iconName ) {
								setAttributes( { buttonIcon: selection.iconName } );
							}
						} }
						selectedIcon={ buttonIcon }
						selectedType="font"
						initialTab="font"
						allowFont={ true }
						allowSvgLineal={ false }
						allowSvgSolid={ false }
					/>

					{ /* Button size */ }
					<BaseControl
						label={ __( 'Button size', 'codeweber-gutenberg-blocks' ) }
						__nextHasNoMarginBottom
					>
						<ButtonGroup>
							{ [
								{ value: 'sm',  label: 'S' },
								{ value: 'md',  label: 'M' },
								{ value: 'lg',  label: 'L' },
								{ value: 'elg', label: 'XL' },
							].map( ( { value, label } ) => (
								<Button
									key={ value }
									variant={ buttonSize === value ? 'primary' : 'secondary' }
									onClick={ () => setAttributes( { buttonSize: value } ) }
									size="compact"
								>
									{ label }
								</Button>
							) ) }
						</ButtonGroup>
					</BaseControl>

					{ /* Button type per device */ }
					<BaseControl
						label={ __( 'Button type', 'codeweber-gutenberg-blocks' ) }
						__nextHasNoMarginBottom
					>
						<TabPanel
							tabs={ [
								{ name: 'desktop', title: __( 'Desktop', 'codeweber-gutenberg-blocks' ) },
								{ name: 'tablet', title: __( 'Tablet', 'codeweber-gutenberg-blocks' ) },
								{ name: 'mobile', title: __( 'Mobile', 'codeweber-gutenberg-blocks' ) },
							] }
						>
							{ ( tab ) => {
								const attrMap = {
									desktop: 'buttonTypeDesktop',
									tablet: 'buttonTypeTablet',
									mobile: 'buttonTypeMobile',
								};
								const valueMap = {
									desktop: buttonTypeDesktop,
									tablet: buttonTypeTablet,
									mobile: buttonTypeMobile,
								};
								return (
									<SelectControl
										value={ valueMap[ tab.name ] }
										options={ BUTTON_TYPE_OPTIONS }
										onChange={ ( val ) =>
											setAttributes( { [ attrMap[ tab.name ] ]: val } )
										}
										hideLabelFromVision
										label={ __( 'Type', 'codeweber-gutenberg-blocks' ) }
										__nextHasNoMarginBottom
									/>
								);
							} }
						</TabPanel>
					</BaseControl>

					{ ( buttonTypeDesktop === 'button' ||
						buttonTypeTablet === 'button' ||
						buttonTypeMobile === 'button' ) && (
						<TextControl
							label={ __( 'Button text', 'codeweber-gutenberg-blocks' ) }
							value={ buttonText }
							onChange={ ( val ) => setAttributes( { buttonText: val } ) }
							__nextHasNoMarginBottom
						/>
					) }

					<ToggleControl
						label={ __( 'Rotate button 90°', 'codeweber-gutenberg-blocks' ) }
						help={ __(
							'Rotates the button sideways — useful for side-positioned widgets.',
							'codeweber-gutenberg-blocks'
						) }
						checked={ buttonRotate }
						onChange={ ( val ) => setAttributes( { buttonRotate: val } ) }
						__nextHasNoMarginBottom
					/>

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

				{ /* ── POPUP COLORS ── */ }
				<PanelBody
					title={ __( 'Popup Colors', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<BaseControl
						label={ __( 'Background', 'codeweber-gutenberg-blocks' ) }
						__nextHasNoMarginBottom
					>
						<ColorPalette
							value={ popupBgColor }
							onChange={ ( val ) => setAttributes( { popupBgColor: val || '#ffffff' } ) }
							enableAlpha={ false }
						/>
					</BaseControl>

					<BaseControl
						label={ __( 'Text color', 'codeweber-gutenberg-blocks' ) }
						__nextHasNoMarginBottom
						style={ { marginTop: 12 } }
					>
						<ColorPalette
							value={ popupTextColor }
							onChange={ ( val ) => setAttributes( { popupTextColor: val || '#212529' } ) }
							enableAlpha={ false }
						/>
					</BaseControl>
				</PanelBody>

				{ /* ── OFFSETS ── */ }
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
							const map = {
								desktop: { x: offsetXDesktop, y: offsetYDesktop, xAttr: 'offsetXDesktop', yAttr: 'offsetYDesktop' },
								tablet:  { x: offsetXTablet,  y: offsetYTablet,  xAttr: 'offsetXTablet',  yAttr: 'offsetYTablet'  },
								mobile:  { x: offsetXMobile,  y: offsetYMobile,  xAttr: 'offsetXMobile',  yAttr: 'offsetYMobile'  },
							};
							const { x, y, xAttr, yAttr } = map[ tab.name ];
							return (
								<>
									<RangeControl
										label={ __( 'Horizontal offset (px)', 'codeweber-gutenberg-blocks' ) }
										value={ x }
										onChange={ ( val ) => setAttributes( { [ xAttr ]: val } ) }
										min={ 0 }
										max={ 120 }
										__nextHasNoMarginBottom
									/>
									<RangeControl
										label={ __( 'Vertical offset (px)', 'codeweber-gutenberg-blocks' ) }
										value={ y }
										onChange={ ( val ) => setAttributes( { [ yAttr ]: val } ) }
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
						{ buttonTypeDesktop === 'button' && (
							<span style={ { marginLeft: 6 } }>{ buttonText }</span>
						) }
					</span>
					<span className="cwgb-floating-navigator-editor__meta">
						{ __( 'Floating Navigator', 'codeweber-gutenberg-blocks' ) }
						{ ' — ' }
						{ POSITION_LABELS[ position ] }
						{ items.length > 0 &&
							` · ${ items.length } ${ __( 'items', 'codeweber-gutenberg-blocks' ) }` }
					</span>
				</div>
			</div>
		</>
	);
}
