import { __ } from '@wordpress/i18n';
import {
	TabPanel,
	ToggleControl,
	SelectControl,
	TextControl,
	RangeControl,
	Button,
	ComboboxControl,
} from '@wordpress/components';
import {
	Icon,
	edit,
	typography,
	update,
	cog,
	chevronUp,
	chevronDown,
} from '@wordpress/icons';
import { TagControl } from '../../components/tag';
import { ColorTypeControl } from '../../components/colors/ColorTypeControl';
import { colors } from '../../utilities/colors';
import {
	createSizeOptions,
	createWeightOptions,
	createTransformOptions,
} from '../heading-subtitle/utils';

const TabIcon = ( { icon, label } ) => (
	<span
		title={ label }
		style={ {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		} }
	>
		<Icon icon={ icon } size={ 20 } />
	</span>
);

const ANIMATION_TYPE_OPTIONS = [
	{
		value: 'rotator-fade',
		label: __( 'Rotator Fade', 'codeweber-gutenberg-blocks' ),
	},
	{
		value: 'rotator-zoom',
		label: __( 'Rotator Zoom', 'codeweber-gutenberg-blocks' ),
	},
	{ value: 'typer', label: __( 'Typer', 'codeweber-gutenberg-blocks' ) },
];

const ALIGN_OPTIONS = [
	{ value: '', label: __( 'Default', 'codeweber-gutenberg-blocks' ) },
	{ value: 'start', label: __( 'Left', 'codeweber-gutenberg-blocks' ) },
	{ value: 'center', label: __( 'Center', 'codeweber-gutenberg-blocks' ) },
	{ value: 'end', label: __( 'Right', 'codeweber-gutenberg-blocks' ) },
];

export const TextRotatorSidebar = ( { attributes, setAttributes } ) => {
	const {
		enablePrefix,
		enableSuffix,
		animationType,
		animationWords,
		animationColor,
		animationDelay,
		animationLoop,
		align,
		blockClass,
		blockId,
	} = attributes;

	const tabs = [
		{
			name: 'content',
			title: (
				<TabIcon
					icon={ edit }
					label={ __( 'Content', 'codeweber-gutenberg-blocks' ) }
				/>
			),
		},
		{
			name: 'typography',
			title: (
				<TabIcon
					icon={ typography }
					label={ __(
						'Typography',
						'codeweber-gutenberg-blocks'
					) }
				/>
			),
		},
		{
			name: 'animation',
			title: (
				<TabIcon
					icon={ update }
					label={ __(
						'Animation',
						'codeweber-gutenberg-blocks'
					) }
				/>
			),
		},
		{
			name: 'settings',
			title: (
				<TabIcon
					icon={ cog }
					label={ __(
						'Settings',
						'codeweber-gutenberg-blocks'
					) }
				/>
			),
		},
	];

	// Repeater helpers
	const updateWord = ( index, value ) => {
		const next = [ ...( animationWords || [] ) ];
		next[ index ] = value;
		setAttributes( { animationWords: next } );
	};

	const removeWord = ( index ) => {
		const next = ( animationWords || [] ).filter( ( _, i ) => i !== index );
		setAttributes( { animationWords: next } );
	};

	const addWord = () => {
		setAttributes( {
			animationWords: [ ...( animationWords || [] ), '' ],
		} );
	};

	const moveWord = ( idx, direction ) => {
		const newIdx = idx + direction;
		if ( newIdx < 0 || newIdx >= ( animationWords || [] ).length ) return;
		const arr = [ ...( animationWords || [] ) ];
		const [ removed ] = arr.splice( idx, 1 );
		arr.splice( newIdx, 0, removed );
		setAttributes( { animationWords: arr } );
	};

	return (
		<TabPanel tabs={ tabs }>
			{ ( tab ) => (
				<>
					{ tab.name === 'content' && (
						<div style={ { padding: '16px' } }>
							{ /* Prefix / Suffix toggles */ }
							<ToggleControl
								label={ __(
									'Enable prefix',
									'codeweber-gutenberg-blocks'
								) }
								checked={ !! enablePrefix }
								onChange={ ( value ) =>
									setAttributes( { enablePrefix: value } )
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={ __(
									'Enable suffix',
									'codeweber-gutenberg-blocks'
								) }
								checked={ !! enableSuffix }
								onChange={ ( value ) =>
									setAttributes( { enableSuffix: value } )
								}
								__nextHasNoMarginBottom
							/>

							{ /* Break before rotator */ }
							{ enablePrefix && (
								<ToggleControl
									label={ __(
										'Line break before rotator',
										'codeweber-gutenberg-blocks'
									) }
									checked={ attributes.breakBeforeRotator }
									onChange={ ( value ) =>
										setAttributes( {
											breakBeforeRotator: value,
										} )
									}
									__nextHasNoMarginBottom
								/>
							) }

							{ /* Words repeater */ }
							<p
								style={ {
									fontSize: '11px',
									fontWeight: 600,
									textTransform: 'uppercase',
									color: '#1e1e1e',
									margin: '16px 0 8px',
								} }
							>
								{ __(
									'Animated words',
									'codeweber-gutenberg-blocks'
								) }
							</p>
							{ ( animationWords || [] ).map( ( word, index ) => (
								<div
									key={ index }
									style={ {
										display: 'flex',
										gap: '4px',
										alignItems: 'center',
										marginBottom: '6px',
									} }
								>
									<div
										style={ {
											display: 'flex',
											flexDirection: 'column',
											gap: '2px',
											flexShrink: 0,
										} }
									>
										<Button
											icon={ chevronUp }
											iconSize={ 16 }
											disabled={ index === 0 }
											onClick={ () =>
												moveWord( index, -1 )
											}
											label={ __(
												'Move up',
												'codeweber-gutenberg-blocks'
											) }
										/>
										<Button
											icon={ chevronDown }
											iconSize={ 16 }
											disabled={
												index ===
												( animationWords || [] )
													.length -
													1
											}
											onClick={ () =>
												moveWord( index, 1 )
											}
											label={ __(
												'Move down',
												'codeweber-gutenberg-blocks'
											) }
										/>
									</div>
									<TextControl
										value={ word }
										onChange={ ( value ) =>
											updateWord( index, value )
										}
										placeholder={ `${ __(
											'Word',
											'codeweber-gutenberg-blocks'
										) } ${ index + 1 }` }
										style={ {
											flex: 1,
											marginBottom: 0,
										} }
										__nextHasNoMarginBottom
									/>
									<Button
										isSmall
										isDestructive
										onClick={ () => removeWord( index ) }
										style={ { flexShrink: 0 } }
									>
										✕
									</Button>
								</div>
							) ) }
							<Button
								variant="secondary"
								isSmall
								onClick={ addWord }
								style={ { marginTop: '4px' } }
							>
								+{ ' ' }
								{ __(
									'Add word',
									'codeweber-gutenberg-blocks'
								) }
							</Button>
						</div>
					) }

					{ tab.name === 'typography' && (
						<div style={ { padding: '16px' } }>
							<TagControl
								label={ __(
									'Title Tag',
									'codeweber-gutenberg-blocks'
								) }
								value={ attributes.titleTag }
								onChange={ ( value ) =>
									setAttributes( { titleTag: value } )
								}
								type="heading"
							/>
							<ColorTypeControl
								label={ __(
									'Title Color Type',
									'codeweber-gutenberg-blocks'
								) }
								value={ attributes.titleColorType }
								onChange={ ( value ) =>
									setAttributes( { titleColorType: value } )
								}
								options={ [
									{
										value: 'solid',
										label: __(
											'Solid',
											'codeweber-gutenberg-blocks'
										),
									},
									{
										value: 'soft',
										label: __(
											'Soft',
											'codeweber-gutenberg-blocks'
										),
									},
									{
										value: 'pale',
										label: __(
											'Pale',
											'codeweber-gutenberg-blocks'
										),
									},
								] }
							/>
							<ComboboxControl
								label={ __(
									'Title Color',
									'codeweber-gutenberg-blocks'
								) }
								value={ attributes.titleColor }
								options={ colors }
								onChange={ ( value ) =>
									setAttributes( { titleColor: value } )
								}
							/>
							<SelectControl
								label={ __(
									'Title Size',
									'codeweber-gutenberg-blocks'
								) }
								value={ attributes.titleSize }
								options={ createSizeOptions() }
								onChange={ ( value ) =>
									setAttributes( { titleSize: value } )
								}
							/>
							<SelectControl
								label={ __(
									'Title Weight',
									'codeweber-gutenberg-blocks'
								) }
								value={ attributes.titleWeight }
								options={ createWeightOptions() }
								onChange={ ( value ) =>
									setAttributes( { titleWeight: value } )
								}
							/>
							<SelectControl
								label={ __(
									'Title Transform',
									'codeweber-gutenberg-blocks'
								) }
								value={ attributes.titleTransform }
								options={ createTransformOptions() }
								onChange={ ( value ) =>
									setAttributes( { titleTransform: value } )
								}
							/>
							<TextControl
								label={ __(
									'Title Class',
									'codeweber-gutenberg-blocks'
								) }
								value={ attributes.titleClass }
								onChange={ ( value ) =>
									setAttributes( { titleClass: value } )
								}
								placeholder="mb-4 custom-class"
								help={ __(
									'Additional CSS classes for the heading',
									'codeweber-gutenberg-blocks'
								) }
							/>
						</div>
					) }

					{ tab.name === 'animation' && (
						<div style={ { padding: '16px' } }>
							<SelectControl
								label={ __(
									'Animation Type',
									'codeweber-gutenberg-blocks'
								) }
								value={ animationType }
								options={ ANIMATION_TYPE_OPTIONS }
								onChange={ ( value ) =>
									setAttributes( { animationType: value } )
								}
								help={
									animationType === 'typer'
										? __(
												'Types characters one by one (Typer.js)',
												'codeweber-gutenberg-blocks'
											)
										: __(
												'Cycles words with fade/zoom (ReplaceMe.js)',
												'codeweber-gutenberg-blocks'
											)
								}
							/>
							<ComboboxControl
								label={ __(
									'Animation Color',
									'codeweber-gutenberg-blocks'
								) }
								value={ animationColor }
								options={ colors }
								onChange={ ( value ) =>
									setAttributes( { animationColor: value } )
								}
							/>
							{ animationType === 'typer' && (
								<>
									<RangeControl
										label={ __(
											'Typing delay (ms)',
											'codeweber-gutenberg-blocks'
										) }
										value={ animationDelay }
										onChange={ ( value ) =>
											setAttributes( {
												animationDelay: value,
											} )
										}
										min={ 50 }
										max={ 500 }
										step={ 10 }
										help={ __(
											'Delay between each character',
											'codeweber-gutenberg-blocks'
										) }
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={ __(
											'Loop',
											'codeweber-gutenberg-blocks'
										) }
										checked={ animationLoop }
										onChange={ ( value ) =>
											setAttributes( {
												animationLoop: value,
											} )
										}
										help={ __(
											'Repeat words infinitely',
											'codeweber-gutenberg-blocks'
										) }
										__nextHasNoMarginBottom
									/>
								</>
							) }
						</div>
					) }

					{ tab.name === 'settings' && (
						<div style={ { padding: '16px' } }>
							<SelectControl
								label={ __(
									'Text Align',
									'codeweber-gutenberg-blocks'
								) }
								value={ align }
								options={ ALIGN_OPTIONS }
								onChange={ ( value ) =>
									setAttributes( { align: value } )
								}
							/>
							<TextControl
								label={ __(
									'Block Class',
									'codeweber-gutenberg-blocks'
								) }
								value={ blockClass }
								onChange={ ( value ) =>
									setAttributes( { blockClass: value } )
								}
								placeholder="custom-class"
							/>
							<TextControl
								label={ __(
									'Block ID',
									'codeweber-gutenberg-blocks'
								) }
								value={ blockId }
								onChange={ ( value ) =>
									setAttributes( { blockId: value } )
								}
								placeholder="my-id"
							/>
						</div>
					) }
				</>
			) }
		</TabPanel>
	);
};
