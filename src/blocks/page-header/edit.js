import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';

const TEMPLATE_OPTIONS = [
	{ label: __( 'Auto (Redux setting)', 'codeweber-gutenberg-blocks' ), value: 'auto' },
	{ label: __( 'Model 1 — Breadcrumbs only', 'codeweber-gutenberg-blocks' ), value: '1' },
	{ label: __( 'Model 2 — Breadcrumbs + Title', 'codeweber-gutenberg-blocks' ), value: '2' },
	{ label: __( 'Model 3', 'codeweber-gutenberg-blocks' ), value: '3' },
	{ label: __( 'Model 4', 'codeweber-gutenberg-blocks' ), value: '4' },
	{ label: __( 'Model 5', 'codeweber-gutenberg-blocks' ), value: '5' },
	{ label: __( 'Model 6', 'codeweber-gutenberg-blocks' ), value: '6' },
	{ label: __( 'Model 7', 'codeweber-gutenberg-blocks' ), value: '7' },
	{ label: __( 'Model 8', 'codeweber-gutenberg-blocks' ), value: '8' },
	{ label: __( 'Model 9', 'codeweber-gutenberg-blocks' ), value: '9' },
];

const BREADCRUMBS_OPTIONS = [
	{ label: __( 'Auto (Redux setting)', 'codeweber-gutenberg-blocks' ), value: 'auto' },
	{ label: __( 'Show', 'codeweber-gutenberg-blocks' ), value: 'show' },
	{ label: __( 'Hide', 'codeweber-gutenberg-blocks' ), value: 'hide' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { templateModel, titleMode, customTitle, breadcrumbsMode } = attributes;

	const blockProps = useBlockProps();
	const isCustomTitle = titleMode === 'custom';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Template', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Template model', 'codeweber-gutenberg-blocks' ) }
						value={ templateModel }
						options={ TEMPLATE_OPTIONS }
						onChange={ ( val ) => setAttributes( { templateModel: val } ) }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Title', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Title mode', 'codeweber-gutenberg-blocks' ) }
						value={ titleMode }
						options={ [
							{
								label: __( 'Auto (from page/post)', 'codeweber-gutenberg-blocks' ),
								value: 'auto',
							},
							{
								label: __( 'Custom text', 'codeweber-gutenberg-blocks' ),
								value: 'custom',
							},
						] }
						onChange={ ( val ) => setAttributes( { titleMode: val } ) }
					/>
					{ isCustomTitle && (
						<TextControl
							label={ __( 'Custom title', 'codeweber-gutenberg-blocks' ) }
							value={ customTitle }
							onChange={ ( val ) => setAttributes( { customTitle: val } ) }
							placeholder={ __( 'Enter title…', 'codeweber-gutenberg-blocks' ) }
						/>
					) }
				</PanelBody>

				<PanelBody
					title={ __( 'Breadcrumbs', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Breadcrumbs', 'codeweber-gutenberg-blocks' ) }
						value={ breadcrumbsMode }
						options={ BREADCRUMBS_OPTIONS }
						onChange={ ( val ) => setAttributes( { breadcrumbsMode: val } ) }
						help={ __(
							'Auto — uses global Redux setting. Show/Hide overrides it for this block.',
							'codeweber-gutenberg-blocks'
						) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender
					block="codeweber-blocks/page-header"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
