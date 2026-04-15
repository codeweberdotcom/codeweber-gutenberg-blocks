// Copyright Block — Edit Component

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

const TEXT_COLOR_OPTIONS = [
	{ label: __( 'Default', 'codeweber-gutenberg-blocks' ), value: '' },
	{ label: __( 'Muted', 'codeweber-gutenberg-blocks' ), value: 'text-muted' },
	{ label: __( 'Body', 'codeweber-gutenberg-blocks' ), value: 'text-body' },
	{ label: __( 'White', 'codeweber-gutenberg-blocks' ), value: 'text-white' },
	{ label: __( 'Primary', 'codeweber-gutenberg-blocks' ), value: 'text-primary' },
	{ label: __( 'Secondary', 'codeweber-gutenberg-blocks' ), value: 'text-secondary' },
	{ label: __( 'Success', 'codeweber-gutenberg-blocks' ), value: 'text-success' },
	{ label: __( 'Info', 'codeweber-gutenberg-blocks' ), value: 'text-info' },
	{ label: __( 'Warning', 'codeweber-gutenberg-blocks' ), value: 'text-warning' },
	{ label: __( 'Danger', 'codeweber-gutenberg-blocks' ), value: 'text-danger' },
	{ label: __( 'Dark', 'codeweber-gutenberg-blocks' ), value: 'text-dark' },
	{ label: __( 'Light', 'codeweber-gutenberg-blocks' ), value: 'text-light' },
];

const LINK_COLOR_OPTIONS = [
	{ label: __( 'Default', 'codeweber-gutenberg-blocks' ), value: '' },
	{ label: __( 'Primary', 'codeweber-gutenberg-blocks' ), value: 'link-primary' },
	{ label: __( 'Secondary', 'codeweber-gutenberg-blocks' ), value: 'link-secondary' },
	{ label: __( 'Success', 'codeweber-gutenberg-blocks' ), value: 'link-success' },
	{ label: __( 'Info', 'codeweber-gutenberg-blocks' ), value: 'link-info' },
	{ label: __( 'Warning', 'codeweber-gutenberg-blocks' ), value: 'link-warning' },
	{ label: __( 'Danger', 'codeweber-gutenberg-blocks' ), value: 'link-danger' },
	{ label: __( 'Dark', 'codeweber-gutenberg-blocks' ), value: 'link-dark' },
	{ label: __( 'Light', 'codeweber-gutenberg-blocks' ), value: 'link-light' },
	{ label: __( 'Muted', 'codeweber-gutenberg-blocks' ), value: 'link-secondary text-muted' },
];

const ALIGNMENT_OPTIONS = [
	{ label: __( 'Left', 'codeweber-gutenberg-blocks' ), value: 'text-start' },
	{ label: __( 'Center', 'codeweber-gutenberg-blocks' ), value: 'text-center' },
	{ label: __( 'Right', 'codeweber-gutenberg-blocks' ), value: 'text-end' },
];

const LAYOUT_OPTIONS = [
	{ label: __( 'Inline (one line)', 'codeweber-gutenberg-blocks' ), value: 'inline' },
	{ label: __( 'Stacked (two lines)', 'codeweber-gutenberg-blocks' ), value: 'stacked' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		showCopyright,
		showYear,
		copyrightText,
		showDeveloper,
		developerLabel,
		developerName,
		developerUrl,
		developerTarget,
		textColor,
		linkColor,
		alignment,
		separator,
		layout,
	} = attributes;

	const blockProps = useBlockProps( {
		className: [ alignment, textColor ].filter( Boolean ).join( ' ' ),
	} );

	const currentYear = new Date().getFullYear();

	// Build preview parts
	const copyrightPart =
		showCopyright
			? ( showYear ? `\u00A9 ${ currentYear } ` : '' ) + copyrightText
			: '';

	const developerPart = showDeveloper && developerName
		? ( developerLabel ? developerLabel + ' ' : '' ) + developerName
		: '';

	const parts = [ copyrightPart, developerPart ].filter( Boolean );

	return (
		<>
			<InspectorControls>
				{ /* Copyright section */ }
				<PanelBody
					title={ __( 'Copyright', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Show copyright', 'codeweber-gutenberg-blocks' ) }
						checked={ showCopyright }
						onChange={ ( val ) => setAttributes( { showCopyright: val } ) }
					/>
					{ showCopyright && (
						<>
							<ToggleControl
								label={ __( 'Show year', 'codeweber-gutenberg-blocks' ) }
								checked={ showYear }
								onChange={ ( val ) => setAttributes( { showYear: val } ) }
							/>
							<TextControl
								label={ __( 'Copyright text', 'codeweber-gutenberg-blocks' ) }
								value={ copyrightText }
								onChange={ ( val ) =>
									setAttributes( { copyrightText: val } )
								}
							/>
						</>
					) }
				</PanelBody>

				{ /* Developer section */ }
				<PanelBody
					title={ __( 'Developer credit', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Show developer credit', 'codeweber-gutenberg-blocks' ) }
						checked={ showDeveloper }
						onChange={ ( val ) => setAttributes( { showDeveloper: val } ) }
					/>
					{ showDeveloper && (
						<>
							<TextControl
								label={ __( 'Label', 'codeweber-gutenberg-blocks' ) }
								help={ __( 'Text before the link, e.g. "Developed by"', 'codeweber-gutenberg-blocks' ) }
								value={ developerLabel }
								onChange={ ( val ) =>
									setAttributes( { developerLabel: val } )
								}
							/>
							<TextControl
								label={ __( 'Developer name', 'codeweber-gutenberg-blocks' ) }
								value={ developerName }
								onChange={ ( val ) =>
									setAttributes( { developerName: val } )
								}
							/>
							<TextControl
								label={ __( 'URL', 'codeweber-gutenberg-blocks' ) }
								type="url"
								value={ developerUrl }
								onChange={ ( val ) =>
									setAttributes( { developerUrl: val } )
								}
							/>
							<ToggleControl
								label={ __( 'Open in new tab', 'codeweber-gutenberg-blocks' ) }
								checked={ developerTarget }
								onChange={ ( val ) =>
									setAttributes( { developerTarget: val } )
								}
							/>
							<SelectControl
								label={ __( 'Link color', 'codeweber-gutenberg-blocks' ) }
								value={ linkColor }
								options={ LINK_COLOR_OPTIONS }
								onChange={ ( val ) => setAttributes( { linkColor: val } ) }
							/>
						</>
					) }
				</PanelBody>

				{ /* Appearance */ }
				<PanelBody
					title={ __( 'Appearance', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Layout', 'codeweber-gutenberg-blocks' ) }
						value={ layout }
						options={ LAYOUT_OPTIONS }
						onChange={ ( val ) => setAttributes( { layout: val } ) }
					/>
					<SelectControl
						label={ __( 'Text color', 'codeweber-gutenberg-blocks' ) }
						value={ textColor }
						options={ TEXT_COLOR_OPTIONS }
						onChange={ ( val ) => setAttributes( { textColor: val } ) }
					/>
					<SelectControl
						label={ __( 'Alignment', 'codeweber-gutenberg-blocks' ) }
						value={ alignment }
						options={ ALIGNMENT_OPTIONS }
						onChange={ ( val ) => setAttributes( { alignment: val } ) }
					/>
					{ layout === 'inline' && showCopyright && showDeveloper && (
						<TextControl
							label={ __( 'Separator', 'codeweber-gutenberg-blocks' ) }
							help={ __( 'Text between copyright and developer credit', 'codeweber-gutenberg-blocks' ) }
							value={ separator }
							onChange={ ( val ) => setAttributes( { separator: val } ) }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ layout === 'stacked' ? (
					<>
						{ copyrightPart && (
							<p className="mb-0">{ copyrightPart }</p>
						) }
						{ developerPart && (
							<p className="mb-0">{ developerPart }</p>
						) }
					</>
				) : (
					<p className="mb-0">
						{ parts.join( separator ) }
					</p>
				) }
				{ ! showCopyright && ! showDeveloper && (
					<p className="text-muted fst-italic mb-0">
						{ __( '(both sections disabled)', 'codeweber-gutenberg-blocks' ) }
					</p>
				) }
			</div>
		</>
	);
}
