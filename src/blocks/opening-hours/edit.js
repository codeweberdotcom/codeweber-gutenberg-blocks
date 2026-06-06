// Opening Hours Block — Edit Component

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

const DAY_FORMAT_OPTIONS = [
	{ label: __( 'Short (Mon)', 'codeweber-gutenberg-blocks' ), value: 'short' },
	{ label: __( 'Full (Monday)', 'codeweber-gutenberg-blocks' ), value: 'full' },
];

const BREAK_MODE_OPTIONS = [
	{
		label: __( 'Both intervals (10:00 – 14:00, 15:00 – 21:00)', 'codeweber-gutenberg-blocks' ),
		value: 'both',
	},
	{
		label: __( 'Single range (10:00 – 21:00)', 'codeweber-gutenberg-blocks' ),
		value: 'range',
	},
	{
		label: __( 'Second interval on a new line', 'codeweber-gutenberg-blocks' ),
		value: 'second-line',
	},
];

const SEPARATOR_OPTIONS = [
	{ label: __( 'En dash ( – )', 'codeweber-gutenberg-blocks' ), value: 'ndash' },
	{ label: __( 'Em dash ( — )', 'codeweber-gutenberg-blocks' ), value: 'mdash' },
	{ label: __( 'Word "to"', 'codeweber-gutenberg-blocks' ), value: 'to' },
];

const LAYOUT_OPTIONS = [
	{ label: __( 'List (rows)', 'codeweber-gutenberg-blocks' ), value: 'list' },
	{ label: __( 'Table', 'codeweber-gutenberg-blocks' ), value: 'table' },
];

const TEXT_SIZE_OPTIONS = [
	{ label: __( 'Default', 'codeweber-gutenberg-blocks' ), value: '' },
	{ label: __( 'Small', 'codeweber-gutenberg-blocks' ), value: 'fs-sm' },
	{ label: __( 'Large', 'codeweber-gutenberg-blocks' ), value: 'fs-lg' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		showTitle,
		title,
		showStatus,
		openLabel,
		closedLabel,
		highlightToday,
		todayLabel,
		dayFormat,
		dayoffLabel,
		breakMode,
		groupSameDays,
		timeSeparator,
		layout,
		alignTimeEnd,
		textSize,
	} = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Content', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Show title', 'codeweber-gutenberg-blocks' ) }
						checked={ showTitle }
						onChange={ ( val ) => setAttributes( { showTitle: val } ) }
					/>
					{ showTitle && (
						<TextControl
							label={ __( 'Title', 'codeweber-gutenberg-blocks' ) }
							value={ title }
							onChange={ ( val ) => setAttributes( { title: val } ) }
						/>
					) }
					<ToggleControl
						label={ __( 'Show open/closed status', 'codeweber-gutenberg-blocks' ) }
						checked={ showStatus }
						onChange={ ( val ) => setAttributes( { showStatus: val } ) }
					/>
					{ showStatus && (
						<>
							<TextControl
								label={ __( '"Open" label', 'codeweber-gutenberg-blocks' ) }
								value={ openLabel }
								onChange={ ( val ) => setAttributes( { openLabel: val } ) }
							/>
							<TextControl
								label={ __( '"Closed" label', 'codeweber-gutenberg-blocks' ) }
								value={ closedLabel }
								onChange={ ( val ) => setAttributes( { closedLabel: val } ) }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody
					title={ __( 'Format', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Day name format', 'codeweber-gutenberg-blocks' ) }
						value={ dayFormat }
						options={ DAY_FORMAT_OPTIONS }
						onChange={ ( val ) => setAttributes( { dayFormat: val } ) }
					/>
					<TextControl
						label={ __( 'Day off label', 'codeweber-gutenberg-blocks' ) }
						value={ dayoffLabel }
						onChange={ ( val ) => setAttributes( { dayoffLabel: val } ) }
					/>
					<SelectControl
						label={ __( 'Lunch break (2nd interval)', 'codeweber-gutenberg-blocks' ) }
						value={ breakMode }
						options={ BREAK_MODE_OPTIONS }
						onChange={ ( val ) => setAttributes( { breakMode: val } ) }
					/>
					<SelectControl
						label={ __( 'Time separator', 'codeweber-gutenberg-blocks' ) }
						value={ timeSeparator }
						options={ SEPARATOR_OPTIONS }
						onChange={ ( val ) => setAttributes( { timeSeparator: val } ) }
					/>
					<ToggleControl
						label={ __( 'Group days with identical hours', 'codeweber-gutenberg-blocks' ) }
						help={ __( 'e.g. "Mon–Thu 10:00 – 21:00"', 'codeweber-gutenberg-blocks' ) }
						checked={ groupSameDays }
						onChange={ ( val ) => setAttributes( { groupSameDays: val } ) }
					/>
				</PanelBody>

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
						label={ __( 'Text size', 'codeweber-gutenberg-blocks' ) }
						value={ textSize }
						options={ TEXT_SIZE_OPTIONS }
						onChange={ ( val ) => setAttributes( { textSize: val } ) }
					/>
					<ToggleControl
						label={ __( 'Align time to the right', 'codeweber-gutenberg-blocks' ) }
						checked={ alignTimeEnd }
						onChange={ ( val ) => setAttributes( { alignTimeEnd: val } ) }
					/>
					<ToggleControl
						label={ __( 'Highlight current day', 'codeweber-gutenberg-blocks' ) }
						checked={ highlightToday }
						onChange={ ( val ) => setAttributes( { highlightToday: val } ) }
					/>
					{ highlightToday && (
						<TextControl
							label={ __( 'Today label', 'codeweber-gutenberg-blocks' ) }
							value={ todayLabel }
							onChange={ ( val ) => setAttributes( { todayLabel: val } ) }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender
					block="codeweber-blocks/opening-hours"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
