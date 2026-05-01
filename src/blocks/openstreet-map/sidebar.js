import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TabPanel,
	ToggleControl,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { Icon, cog, mapMarker, settings } from '@wordpress/icons';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { MarkerRepeaterControl } from './controls/MarkerRepeaterControl';
import { CoordinateControl } from './controls/CoordinateControl';

const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<Icon icon={icon} size={20} />
	</span>
);

const tileLayerOptions = [
	{
		label: __('OpenStreetMap', 'codeweber-gutenberg-blocks'),
		value: 'osm',
	},
	{
		label: __('CartoDB Light', 'codeweber-gutenberg-blocks'),
		value: 'carto-light',
	},
	{
		label: __('CartoDB Dark', 'codeweber-gutenberg-blocks'),
		value: 'carto-dark',
	},
	{
		label: __('Topographic', 'codeweber-gutenberg-blocks'),
		value: 'topo',
	},
	{
		label: __('Satellite (ESRI)', 'codeweber-gutenberg-blocks'),
		value: 'esri-sat',
	},
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
		customMarkers,
		cptQuery,
		popupFields,
		blockClass,
		blockId,
		blockData,
	} = attributes;

	const tabs = [
		{
			name: 'main',
			title: (
				<TabIcon
					icon={cog}
					label={__('Main', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'markers',
			title: (
				<TabIcon
					icon={mapMarker}
					label={__('Markers', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'popup',
			title: (
				<TabIcon
					icon={settings}
					label={__('Popup', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'advanced',
			title: (
				<TabIcon
					icon={cog}
					label={__('Advanced', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{/* MAIN TAB */}
					{tab.name === 'main' && (
						<>
							<PanelBody
								title={__(
									'Map Settings',
									'codeweber-gutenberg-blocks'
								)}
								initialOpen={true}
							>
								<SelectControl
									label={__(
										'Map Style',
										'codeweber-gutenberg-blocks'
									)}
									value={tileLayer}
									options={tileLayerOptions}
									onChange={(value) =>
										setAttributes({ tileLayer: value })
									}
									help={__(
										'No API key required for any style',
										'codeweber-gutenberg-blocks'
									)}
								/>

								<CoordinateControl
									label={__(
										'Map Center',
										'codeweber-gutenberg-blocks'
									)}
									value={center}
									onChange={(value) =>
										setAttributes({ center: value })
									}
								/>

								<RangeControl
									label={__(
										'Zoom Level',
										'codeweber-gutenberg-blocks'
									)}
									value={zoom}
									onChange={(value) =>
										setAttributes({ zoom: value })
									}
									min={1}
									max={19}
									step={1}
									__nextHasNoMarginBottom
								/>

								<RangeControl
									label={__(
										'Map Height (px)',
										'codeweber-gutenberg-blocks'
									)}
									value={height}
									onChange={(value) =>
										setAttributes({ height: value })
									}
									min={200}
									max={900}
									step={50}
									__nextHasNoMarginBottom
								/>

								<RangeControl
									label={__(
										'Border Radius (px)',
										'codeweber-gutenberg-blocks'
									)}
									value={borderRadius}
									onChange={(value) =>
										setAttributes({ borderRadius: value })
									}
									min={0}
									max={24}
									step={1}
									__nextHasNoMarginBottom
								/>
							</PanelBody>

							<PanelBody
								title={__(
									'Map Behavior',
									'codeweber-gutenberg-blocks'
								)}
								initialOpen={false}
							>
								<ToggleControl
									label={__(
										'Scroll Wheel Zoom',
										'codeweber-gutenberg-blocks'
									)}
									checked={enableScrollZoom}
									onChange={(value) =>
										setAttributes({ enableScrollZoom: value })
									}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__(
										'Drag to Pan',
										'codeweber-gutenberg-blocks'
									)}
									checked={enableDrag}
									onChange={(value) =>
										setAttributes({ enableDrag: value })
									}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__(
										'Auto Fit Bounds',
										'codeweber-gutenberg-blocks'
									)}
									checked={autoFitBounds}
									onChange={(value) =>
										setAttributes({ autoFitBounds: value })
									}
									help={__(
										'Adjust map to show all markers',
										'codeweber-gutenberg-blocks'
									)}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__(
										'Cluster Markers',
										'codeweber-gutenberg-blocks'
									)}
									checked={clustering}
									onChange={(value) =>
										setAttributes({ clustering: value })
									}
									__nextHasNoMarginBottom
								/>
							</PanelBody>
						</>
					)}

					{/* MARKERS TAB */}
					{tab.name === 'markers' && (
						<>
							<PanelBody
								title={__(
									'Data Source',
									'codeweber-gutenberg-blocks'
								)}
								initialOpen={true}
							>
								<SelectControl
									label={__(
										'Source',
										'codeweber-gutenberg-blocks'
									)}
									value={dataSource}
									options={[
										{
											label: __(
												'Custom Markers',
												'codeweber-gutenberg-blocks'
											),
											value: 'custom',
										},
										{
											label: __(
												'CPT (any post type)',
												'codeweber-gutenberg-blocks'
											),
											value: 'cpt',
										},
									]}
									onChange={(value) =>
										setAttributes({ dataSource: value })
									}
								/>
							</PanelBody>

							{dataSource === 'custom' && (
								<PanelBody
									title={__(
										'Custom Markers',
										'codeweber-gutenberg-blocks'
									)}
									initialOpen={true}
								>
									<TextControl
										label={__(
											'Default Marker Color',
											'codeweber-gutenberg-blocks'
										)}
										value={markerColor}
										onChange={(value) =>
											setAttributes({ markerColor: value })
										}
										type="color"
										__nextHasNoMarginBottom
									/>

									<div style={{ marginTop: '12px' }}>
										<MarkerRepeaterControl
											markers={customMarkers || []}
											onChange={(markers) =>
												setAttributes({
													customMarkers: markers,
												})
											}
										/>
									</div>
								</PanelBody>
							)}

							{dataSource === 'cpt' && (
								<PanelBody
									title={__(
										'CPT Settings',
										'codeweber-gutenberg-blocks'
									)}
									initialOpen={true}
								>
									<TextControl
										label={__(
											'Post Type Slug',
											'codeweber-gutenberg-blocks'
										)}
										value={cptQuery?.postType || ''}
										onChange={(value) =>
											setAttributes({
												cptQuery: {
													...cptQuery,
													postType: value,
												},
											})
										}
										placeholder="offices"
										help={__(
											'e.g. offices, events, shops',
											'codeweber-gutenberg-blocks'
										)}
										__nextHasNoMarginBottom
									/>

									<RangeControl
										label={__(
											'Posts Limit',
											'codeweber-gutenberg-blocks'
										)}
										value={
											cptQuery?.postsPerPage === -1
												? 100
												: cptQuery?.postsPerPage || 100
										}
										onChange={(value) =>
											setAttributes({
												cptQuery: {
													...cptQuery,
													postsPerPage: value,
												},
											})
										}
										min={1}
										max={500}
										step={1}
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__(
											'Latitude Meta Field',
											'codeweber-gutenberg-blocks'
										)}
										value={cptQuery?.latField || ''}
										onChange={(value) =>
											setAttributes({
												cptQuery: {
													...cptQuery,
													latField: value,
												},
											})
										}
										placeholder="_office_latitude"
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__(
											'Longitude Meta Field',
											'codeweber-gutenberg-blocks'
										)}
										value={cptQuery?.lngField || ''}
										onChange={(value) =>
											setAttributes({
												cptQuery: {
													...cptQuery,
													lngField: value,
												},
											})
										}
										placeholder="_office_longitude"
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__(
											'Address Meta Field',
											'codeweber-gutenberg-blocks'
										)}
										value={cptQuery?.addressField || ''}
										onChange={(value) =>
											setAttributes({
												cptQuery: {
													...cptQuery,
													addressField: value,
												},
											})
										}
										placeholder="_office_street"
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__(
											'Phone Meta Field',
											'codeweber-gutenberg-blocks'
										)}
										value={cptQuery?.phoneField || ''}
										onChange={(value) =>
											setAttributes({
												cptQuery: {
													...cptQuery,
													phoneField: value,
												},
											})
										}
										placeholder="_office_phone"
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__(
											'Description Meta Field',
											'codeweber-gutenberg-blocks'
										)}
										value={cptQuery?.descriptionField || ''}
										onChange={(value) =>
											setAttributes({
												cptQuery: {
													...cptQuery,
													descriptionField: value,
												},
											})
										}
										placeholder="_office_description"
										__nextHasNoMarginBottom
									/>

									<TextControl
										label={__(
											'Default Marker Color',
											'codeweber-gutenberg-blocks'
										)}
										value={markerColor}
										onChange={(value) =>
											setAttributes({ markerColor: value })
										}
										type="color"
										__nextHasNoMarginBottom
									/>
								</PanelBody>
							)}
						</>
					)}

					{/* POPUP TAB */}
					{tab.name === 'popup' && (
						<PanelBody
							title={__(
								'Popup Fields',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							<ToggleControl
								label={__(
									'Show Title',
									'codeweber-gutenberg-blocks'
								)}
								checked={popupFields?.showTitle !== false}
								onChange={(value) =>
									setAttributes({
										popupFields: {
											...popupFields,
											showTitle: value,
										},
									})
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__(
									'Show Address',
									'codeweber-gutenberg-blocks'
								)}
								checked={popupFields?.showAddress !== false}
								onChange={(value) =>
									setAttributes({
										popupFields: {
											...popupFields,
											showAddress: value,
										},
									})
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__(
									'Show Phone',
									'codeweber-gutenberg-blocks'
								)}
								checked={popupFields?.showPhone !== false}
								onChange={(value) =>
									setAttributes({
										popupFields: {
											...popupFields,
											showPhone: value,
										},
									})
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__(
									'Show Description',
									'codeweber-gutenberg-blocks'
								)}
								checked={popupFields?.showDescription === true}
								onChange={(value) =>
									setAttributes({
										popupFields: {
											...popupFields,
											showDescription: value,
										},
									})
								}
								__nextHasNoMarginBottom
							/>

							<ToggleControl
								label={__(
									'Show Link Button',
									'codeweber-gutenberg-blocks'
								)}
								checked={popupFields?.showLink !== false}
								onChange={(value) =>
									setAttributes({
										popupFields: {
											...popupFields,
											showLink: value,
										},
									})
								}
								__nextHasNoMarginBottom
							/>
						</PanelBody>
					)}

					{/* ADVANCED TAB */}
					{tab.name === 'advanced' && (
						<PanelBody
							title={__(
								'Block Meta',
								'codeweber-gutenberg-blocks'
							)}
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
					)}
				</>
			)}
		</TabPanel>
	);
};
