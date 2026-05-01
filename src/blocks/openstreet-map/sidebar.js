import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TabPanel,
	ToggleControl,
	RangeControl,
	SelectControl,
	TextControl,
	ColorPicker,
	BaseControl,
} from '@wordpress/components';
import { Icon, cog, mapMarker, settings } from '@wordpress/icons';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { BorderRadiusControl } from '../../components/border-radius';
import { AnimationControl } from '../../components/animation/Animation';
import { MarkerRepeaterControl } from './controls/MarkerRepeaterControl';
import { CoordinateControl } from './controls/CoordinateControl';

const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

const tileLayerOptions = [
	{ label: __('OpenStreetMap', 'codeweber-gutenberg-blocks'), value: 'osm' },
	{ label: __('CartoDB Light', 'codeweber-gutenberg-blocks'), value: 'carto-light' },
	{ label: __('CartoDB Dark', 'codeweber-gutenberg-blocks'), value: 'carto-dark' },
	{ label: __('Topographic', 'codeweber-gutenberg-blocks'), value: 'topo' },
	{ label: __('Satellite (ESRI)', 'codeweber-gutenberg-blocks'), value: 'esri-sat' },
];

const sourceOptions = [
	{ label: __('Custom Markers', 'codeweber-gutenberg-blocks'), value: 'custom' },
	{ label: __('Offices', 'codeweber-gutenberg-blocks'), value: 'offices' },
	{ label: __('Staff', 'codeweber-gutenberg-blocks'), value: 'staff' },
	{ label: __('Any CPT', 'codeweber-gutenberg-blocks'), value: 'cpt' },
];

export const OpenStreetMapSidebar = ({ attributes, setAttributes }) => {
	const {
		dataSource,
		center,
		zoom,
		height,
		tileLayer,
		borderRadius,
		enableScrollZoom,
		enableDrag,
		autoFitBounds,
		clustering,
		markerColor,
		markerType,
		customMarkers,
		cptQuery,
		popupFields,
	} = attributes;

	const markerTypeOptions = [
		{ label: __('Dot + Label', 'codeweber-gutenberg-blocks'), value: 'dot-label' },
		{ label: __('Dot', 'codeweber-gutenberg-blocks'), value: 'dot' },
		{ label: __('Pin', 'codeweber-gutenberg-blocks'), value: 'pin' },
	];

	const tabs = [
		{
			name: 'main',
			title: <TabIcon icon={cog} label={__('Map', 'codeweber-gutenberg-blocks')} />,
		},
		{
			name: 'markers',
			title: <TabIcon icon={mapMarker} label={__('Markers', 'codeweber-gutenberg-blocks')} />,
		},
		{
			name: 'popup',
			title: <TabIcon icon={settings} label={__('Popup', 'codeweber-gutenberg-blocks')} />,
		},
		{
			name: 'advanced',
			title: <TabIcon icon={cog} label={__('Advanced', 'codeweber-gutenberg-blocks')} />,
		},
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{/* MAP TAB */}
					{tab.name === 'main' && (
						<>
							<PanelBody
								title={__('Map Style', 'codeweber-gutenberg-blocks')}
								initialOpen={true}
							>
								<SelectControl
									label={__('Tile Layer', 'codeweber-gutenberg-blocks')}
									value={tileLayer}
									options={tileLayerOptions}
									onChange={(value) => setAttributes({ tileLayer: value })}
									help={__('No API key required', 'codeweber-gutenberg-blocks')}
								/>

								<BorderRadiusControl
									value={borderRadius}
									onChange={(value) => setAttributes({ borderRadius: value })}
								/>
							</PanelBody>

							<PanelBody
								title={__('Map Settings', 'codeweber-gutenberg-blocks')}
								initialOpen={true}
							>
								<CoordinateControl
									label={__('Center', 'codeweber-gutenberg-blocks')}
									value={center}
									onChange={(value) => setAttributes({ center: value })}
								/>

								<RangeControl
									label={__('Zoom', 'codeweber-gutenberg-blocks')}
									value={zoom}
									onChange={(value) => setAttributes({ zoom: value })}
									min={1}
									max={19}
									step={1}
									__nextHasNoMarginBottom
								/>

								<RangeControl
									label={__('Height (px)', 'codeweber-gutenberg-blocks')}
									value={height}
									onChange={(value) => setAttributes({ height: value })}
									min={200}
									max={900}
									step={50}
									__nextHasNoMarginBottom
								/>
							</PanelBody>

							<PanelBody
								title={__('Behavior', 'codeweber-gutenberg-blocks')}
								initialOpen={false}
							>
								<ToggleControl
									label={__('Scroll Wheel Zoom', 'codeweber-gutenberg-blocks')}
									checked={enableScrollZoom}
									onChange={(value) => setAttributes({ enableScrollZoom: value })}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Drag to Pan', 'codeweber-gutenberg-blocks')}
									checked={enableDrag}
									onChange={(value) => setAttributes({ enableDrag: value })}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Auto Fit Bounds', 'codeweber-gutenberg-blocks')}
									checked={autoFitBounds}
									onChange={(value) => setAttributes({ autoFitBounds: value })}
									help={__('Adjust view to show all markers', 'codeweber-gutenberg-blocks')}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Cluster Markers', 'codeweber-gutenberg-blocks')}
									checked={clustering}
									onChange={(value) => setAttributes({ clustering: value })}
									__nextHasNoMarginBottom
								/>
							</PanelBody>
						</>
					)}

					{/* MARKERS TAB */}
					{tab.name === 'markers' && (
						<>
							<PanelBody
								title={__('Data Source', 'codeweber-gutenberg-blocks')}
								initialOpen={true}
							>
								<SelectControl
									label={__('Source', 'codeweber-gutenberg-blocks')}
									value={dataSource}
									options={sourceOptions}
									onChange={(value) => setAttributes({ dataSource: value })}
								/>

								<SelectControl
									label={__('Marker Type', 'codeweber-gutenberg-blocks')}
									value={markerType}
									options={markerTypeOptions}
									onChange={(value) => setAttributes({ markerType: value })}
									__nextHasNoMarginBottom
								/>
							</PanelBody>

							{/* Custom markers */}
							{dataSource === 'custom' && (
								<PanelBody
									title={__('Markers', 'codeweber-gutenberg-blocks')}
									initialOpen={true}
								>
									<BaseControl
										label={__('Default Marker Color', 'codeweber-gutenberg-blocks')}
										__nextHasNoMarginBottom
									>
										<ColorPicker
											color={markerColor}
											onChange={(value) => setAttributes({ markerColor: value })}
											enableAlpha={false}
										/>
									</BaseControl>

									<div style={{ marginTop: '12px' }}>
										<MarkerRepeaterControl
											markers={customMarkers || []}
											onChange={(markers) => setAttributes({ customMarkers: markers })}
										/>
									</div>
								</PanelBody>
							)}

							{/* Offices preset */}
							{dataSource === 'offices' && (
								<PanelBody
									title={__('Offices Settings', 'codeweber-gutenberg-blocks')}
									initialOpen={true}
								>
									<p style={{ fontSize: '12px', color: '#757575', margin: '0 0 12px' }}>
										{__(
											'Reads offices CPT with towns taxonomy, address, phone and linked staff.',
											'codeweber-gutenberg-blocks'
										)}
									</p>

									<RangeControl
										label={__('Offices Limit', 'codeweber-gutenberg-blocks')}
										value={cptQuery?.postsPerPage > 0 ? cptQuery.postsPerPage : 100}
										onChange={(value) =>
											setAttributes({ cptQuery: { ...cptQuery, postsPerPage: value } })
										}
										min={1}
										max={500}
										step={1}
										__nextHasNoMarginBottom
									/>

									<div style={{ marginTop: '12px' }}>
										<BaseControl
											label={__('Marker Color', 'codeweber-gutenberg-blocks')}
											__nextHasNoMarginBottom
										>
											<ColorPicker
												color={markerColor}
												onChange={(value) => setAttributes({ markerColor: value })}
												enableAlpha={false}
											/>
										</BaseControl>
									</div>
								</PanelBody>
							)}

							{/* Staff preset */}
							{dataSource === 'staff' && (
								<PanelBody
									title={__('Staff Settings', 'codeweber-gutenberg-blocks')}
									initialOpen={true}
								>
									<p style={{ fontSize: '12px', color: '#757575', margin: '0 0 12px' }}>
										{__(
											'Reads staff CPT. Each staff record needs _staff_latitude and _staff_longitude meta fields.',
											'codeweber-gutenberg-blocks'
										)}
									</p>

									<RangeControl
										label={__('Staff Limit', 'codeweber-gutenberg-blocks')}
										value={cptQuery?.postsPerPage > 0 ? cptQuery.postsPerPage : 100}
										onChange={(value) =>
											setAttributes({ cptQuery: { ...cptQuery, postsPerPage: value } })
										}
										min={1}
										max={500}
										step={1}
										__nextHasNoMarginBottom
									/>

									<div style={{ marginTop: '12px' }}>
										<BaseControl
											label={__('Marker Color', 'codeweber-gutenberg-blocks')}
											__nextHasNoMarginBottom
										>
											<ColorPicker
												color={markerColor}
												onChange={(value) => setAttributes({ markerColor: value })}
												enableAlpha={false}
											/>
										</BaseControl>
									</div>
								</PanelBody>
							)}

							{/* Any CPT — manual config */}
							{dataSource === 'cpt' && (
								<PanelBody
									title={__('CPT Settings', 'codeweber-gutenberg-blocks')}
									initialOpen={true}
								>
									<TextControl
										label={__('Post Type Slug', 'codeweber-gutenberg-blocks')}
										value={cptQuery?.postType || ''}
										onChange={(value) =>
											setAttributes({ cptQuery: { ...cptQuery, postType: value } })
										}
										placeholder="offices"
										help={__('e.g. offices, events, shops', 'codeweber-gutenberg-blocks')}
										__nextHasNoMarginBottom
									/>

									<RangeControl
										label={__('Posts Limit', 'codeweber-gutenberg-blocks')}
										value={cptQuery?.postsPerPage > 0 ? cptQuery.postsPerPage : 100}
										onChange={(value) =>
											setAttributes({ cptQuery: { ...cptQuery, postsPerPage: value } })
										}
										min={1}
										max={500}
										step={1}
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__('Latitude Meta Field', 'codeweber-gutenberg-blocks')}
										value={cptQuery?.latField || ''}
										onChange={(value) =>
											setAttributes({ cptQuery: { ...cptQuery, latField: value } })
										}
										placeholder="_office_latitude"
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__('Longitude Meta Field', 'codeweber-gutenberg-blocks')}
										value={cptQuery?.lngField || ''}
										onChange={(value) =>
											setAttributes({ cptQuery: { ...cptQuery, lngField: value } })
										}
										placeholder="_office_longitude"
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__('Address Meta Field', 'codeweber-gutenberg-blocks')}
										value={cptQuery?.addressField || ''}
										onChange={(value) =>
											setAttributes({ cptQuery: { ...cptQuery, addressField: value } })
										}
										placeholder="_office_street"
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__('Phone Meta Field', 'codeweber-gutenberg-blocks')}
										value={cptQuery?.phoneField || ''}
										onChange={(value) =>
											setAttributes({ cptQuery: { ...cptQuery, phoneField: value } })
										}
										placeholder="_office_phone"
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__('Description Meta Field', 'codeweber-gutenberg-blocks')}
										value={cptQuery?.descriptionField || ''}
										onChange={(value) =>
											setAttributes({ cptQuery: { ...cptQuery, descriptionField: value } })
										}
										placeholder="_office_description"
										__nextHasNoMarginBottom
									/>

									<BaseControl
										label={__('Marker Color', 'codeweber-gutenberg-blocks')}
										__nextHasNoMarginBottom
									>
										<ColorPicker
											color={markerColor}
											onChange={(value) => setAttributes({ markerColor: value })}
											enableAlpha={false}
										/>
									</BaseControl>
								</PanelBody>
							)}
						</>
					)}

					{/* POPUP TAB */}
					{tab.name === 'popup' && (
						<PanelBody
							title={__('Popup Fields', 'codeweber-gutenberg-blocks')}
							initialOpen={true}
						>
							<ToggleControl
								label={__('Title', 'codeweber-gutenberg-blocks')}
								checked={popupFields?.showTitle !== false}
								onChange={(value) =>
									setAttributes({ popupFields: { ...popupFields, showTitle: value } })
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__('Address', 'codeweber-gutenberg-blocks')}
								checked={popupFields?.showAddress !== false}
								onChange={(value) =>
									setAttributes({ popupFields: { ...popupFields, showAddress: value } })
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__('Phone', 'codeweber-gutenberg-blocks')}
								checked={popupFields?.showPhone !== false}
								onChange={(value) =>
									setAttributes({ popupFields: { ...popupFields, showPhone: value } })
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__('Description', 'codeweber-gutenberg-blocks')}
								checked={popupFields?.showDescription === true}
								onChange={(value) =>
									setAttributes({ popupFields: { ...popupFields, showDescription: value } })
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__('Link Button', 'codeweber-gutenberg-blocks')}
								checked={popupFields?.showLink !== false}
								onChange={(value) =>
									setAttributes({ popupFields: { ...popupFields, showLink: value } })
								}
								__nextHasNoMarginBottom
							/>

							{dataSource === 'offices' && (
								<ToggleControl
									label={__('Show Staff', 'codeweber-gutenberg-blocks')}
									checked={popupFields?.showStaff === true}
									onChange={(value) =>
										setAttributes({ popupFields: { ...popupFields, showStaff: value } })
									}
									help={__('Show staff members linked to each office', 'codeweber-gutenberg-blocks')}
									__nextHasNoMarginBottom
								/>
							)}
						</PanelBody>
					)}

					{/* ADVANCED TAB */}
					{tab.name === 'advanced' && (
						<>
							<div style={{ padding: '16px' }}>
								<AnimationControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</div>

							<PanelBody
								title={__('Block Meta', 'codeweber-gutenberg-blocks')}
								initialOpen={false}
							>
								<BlockMetaFields
									attributes={attributes}
									setAttributes={setAttributes}
									fieldKeys={{
										classKey: 'blockClass',
										dataKey: 'blockData',
										idKey: 'blockId',
									}}
								/>
							</PanelBody>
						</>
					)}
				</>
			)}
		</TabPanel>
	);
};
