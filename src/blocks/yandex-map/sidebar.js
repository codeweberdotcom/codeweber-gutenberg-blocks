/**
 * Yandex Map Block - Sidebar Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TabPanel,
	ToggleControl,
	RangeControl,
	SelectControl,
	TextControl,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import { Icon, cog, mapMarker, listView, settings } from '@wordpress/icons';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { MarkerRepeaterControl } from './controls/MarkerRepeaterControl';
import { OfficesQueryControl } from './controls/OfficesQueryControl';
import { CoordinateControl } from './controls/CoordinateControl';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

export const YandexMapSidebar = ({ attributes, setAttributes }) => {
	const {
		dataSource,
		center,
		zoom,
		height,
		mapType,
		borderRadius,
		enableScrollZoom,
		enableDrag,
		enableDblClickZoom,
		autoFitBounds,
		searchControl,
		geolocationControl,
		routeButton,
		showSidebar,
		sidebarPosition,
		sidebarTitle,
		showFilters,
		filterByCity,
		filterByCategory,
		clusterer,
		clustererPreset,
		officesQuery,
		customMarkers,
		markerType,
		markerPreset,
		markerColor,
		markerAutoOpenBalloon,
		balloonMaxWidth,
		balloonCloseButton,
		balloonFields,
		sidebarFields,
		blockClass,
		blockId,
		blockData,
	} = attributes;

	const tabs = [
		{ name: 'main', title: <TabIcon icon={cog} label={__('Main', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'markers', title: <TabIcon icon={mapMarker} label={__('Markers', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'sidebar', title: <TabIcon icon={listView} label={__('Sidebar', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'controls', title: <TabIcon icon={settings} label={__('Controls', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'advanced', title: <TabIcon icon={cog} label={__('Advanced', 'codeweber-gutenberg-blocks')} /> },
	];

	const mapTypeOptions = [
		{ label: __('Map', 'codeweber-gutenberg-blocks'), value: 'yandex#map' },
		{ label: __('Satellite', 'codeweber-gutenberg-blocks'), value: 'yandex#satellite' },
		{ label: __('Hybrid', 'codeweber-gutenberg-blocks'), value: 'yandex#hybrid' },
	];

	const markerPresetOptions = [
		{ label: __('Red Dot', 'codeweber-gutenberg-blocks'), value: 'islands#redDotIcon' },
		{ label: __('Blue Dot', 'codeweber-gutenberg-blocks'), value: 'islands#blueDotIcon' },
		{ label: __('Dark Blue Dot', 'codeweber-gutenberg-blocks'), value: 'islands#darkBlueDotIcon' },
		{ label: __('Night Dot', 'codeweber-gutenberg-blocks'), value: 'islands#nightDotIcon' },
		{ label: __('Orange Dot', 'codeweber-gutenberg-blocks'), value: 'islands#orangeDotIcon' },
	];

	const clustererPresetOptions = [
		{ label: __('Violet Cluster', 'codeweber-gutenberg-blocks'), value: 'islands#invertedVioletClusterIcons' },
		{ label: __('Blue Cluster', 'codeweber-gutenberg-blocks'), value: 'islands#invertedBlueClusterIcons' },
		{ label: __('Red Cluster', 'codeweber-gutenberg-blocks'), value: 'islands#invertedRedClusterIcons' },
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{/* MAIN TAB */}
					{tab.name === 'main' && (
						<>
							<PanelBody title={__('Data Source', 'codeweber-gutenberg-blocks')} initialOpen={true}>
								<SelectControl
									label={__('Data Source', 'codeweber-gutenberg-blocks')}
									value={dataSource}
									options={[
										{ label: __('Offices from CPT', 'codeweber-gutenberg-blocks'), value: 'offices' },
										{ label: __('Custom Markers', 'codeweber-gutenberg-blocks'), value: 'custom' },
									]}
									onChange={(value) => setAttributes({ dataSource: value })}
									help={__('Select data source for markers', 'codeweber-gutenberg-blocks')}
								/>
							</PanelBody>

							<PanelBody title={__('Map Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
								<CoordinateControl
									label={__('Map Center', 'codeweber-gutenberg-blocks')}
									value={center}
									onChange={(value) => setAttributes({ center: value })}
								/>

								<RangeControl
									label={__('Zoom Level', 'codeweber-gutenberg-blocks')}
									value={zoom}
									onChange={(value) => setAttributes({ zoom: value })}
									min={1}
									max={19}
									step={1}
								/>

								<RangeControl
									label={__('Map Height', 'codeweber-gutenberg-blocks')}
									value={height}
									onChange={(value) => setAttributes({ height: value })}
									min={200}
									max={1000}
									step={50}
								/>

								<SelectControl
									label={__('Map Type', 'codeweber-gutenberg-blocks')}
									value={mapType}
									options={mapTypeOptions}
									onChange={(value) => setAttributes({ mapType: value })}
								/>

								<RangeControl
									label={__('Border Radius', 'codeweber-gutenberg-blocks')}
									value={borderRadius}
									onChange={(value) => setAttributes({ borderRadius: value })}
									min={0}
									max={20}
									step={1}
								/>
							</PanelBody>
						</>
					)}

					{/* MARKERS TAB */}
					{tab.name === 'markers' && (
						<>
							{dataSource === 'offices' ? (
								<PanelBody title={__('Offices Query', 'codeweber-gutenberg-blocks')} initialOpen={true}>
									<OfficesQueryControl
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</PanelBody>
							) : (
								<PanelBody title={__('Custom Markers', 'codeweber-gutenberg-blocks')} initialOpen={true}>
									<MarkerRepeaterControl
										markers={customMarkers || []}
										onChange={(markers) => setAttributes({ customMarkers: markers })}
									/>
								</PanelBody>
							)}

							<PanelBody title={__('Marker Display', 'codeweber-gutenberg-blocks')} initialOpen={false}>
								<SelectControl
									label={__('Marker Type', 'codeweber-gutenberg-blocks')}
									value={markerType}
									options={[
										{ label: __('Default', 'codeweber-gutenberg-blocks'), value: 'default' },
										{ label: __('Custom', 'codeweber-gutenberg-blocks'), value: 'custom' },
										{ label: __('Logo', 'codeweber-gutenberg-blocks'), value: 'logo' },
									]}
									onChange={(value) => setAttributes({ markerType: value })}
								/>

								{markerType === 'default' && (
									<SelectControl
										label={__('Marker Preset', 'codeweber-gutenberg-blocks')}
										value={markerPreset}
										options={markerPresetOptions}
										onChange={(value) => setAttributes({ markerPreset: value })}
									/>
								)}

								{markerType === 'custom' && (
									<TextControl
										label={__('Marker Color', 'codeweber-gutenberg-blocks')}
										value={markerColor}
										onChange={(value) => setAttributes({ markerColor: value })}
										type="color"
									/>
								)}

								<ToggleControl
									label={__('Auto Open Balloon', 'codeweber-gutenberg-blocks')}
									checked={markerAutoOpenBalloon}
									onChange={(value) => setAttributes({ markerAutoOpenBalloon: value })}
									__nextHasNoMarginBottom
								/>
							</PanelBody>
						</>
					)}

					{/* SIDEBAR TAB */}
					{tab.name === 'sidebar' && (
						<>
							<PanelBody title={__('Sidebar Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
								<ToggleControl
									label={__('Show Sidebar', 'codeweber-gutenberg-blocks')}
									checked={showSidebar}
									onChange={(value) => setAttributes({ showSidebar: value })}
									__nextHasNoMarginBottom
								/>

								{showSidebar && (
									<>
										<SelectControl
											label={__('Sidebar Position', 'codeweber-gutenberg-blocks')}
											value={sidebarPosition}
											options={[
												{ label: __('Left', 'codeweber-gutenberg-blocks'), value: 'left' },
												{ label: __('Right', 'codeweber-gutenberg-blocks'), value: 'right' },
											]}
											onChange={(value) => setAttributes({ sidebarPosition: value })}
										/>

										<TextControl
											label={__('Sidebar Title', 'codeweber-gutenberg-blocks')}
											value={sidebarTitle}
											onChange={(value) => setAttributes({ sidebarTitle: value })}
											placeholder={__('Enter sidebar title', 'codeweber-gutenberg-blocks')}
										/>

										<ToggleControl
											label={__('Show Filters', 'codeweber-gutenberg-blocks')}
											checked={showFilters}
											onChange={(value) => setAttributes({ showFilters: value })}
											__nextHasNoMarginBottom
										/>

										{showFilters && (
											<>
												<ToggleControl
													label={__('Filter by City', 'codeweber-gutenberg-blocks')}
													checked={filterByCity}
													onChange={(value) => setAttributes({ filterByCity: value })}
													__nextHasNoMarginBottom
												/>

												<ToggleControl
													label={__('Filter by Category', 'codeweber-gutenberg-blocks')}
													checked={filterByCategory}
													onChange={(value) => setAttributes({ filterByCategory: value })}
													__nextHasNoMarginBottom
												/>
											</>
										)}

										<PanelBody title={__('Sidebar Item Fields', 'codeweber-gutenberg-blocks')} initialOpen={false}>
											<ToggleControl
												label={__('Show City', 'codeweber-gutenberg-blocks')}
												checked={sidebarFields?.showCity !== false}
												onChange={(value) => setAttributes({ 
													sidebarFields: { ...sidebarFields, showCity: value }
												})}
												__nextHasNoMarginBottom
											/>

											<ToggleControl
												label={__('Show Address', 'codeweber-gutenberg-blocks')}
												checked={sidebarFields?.showAddress === true}
												onChange={(value) => setAttributes({ 
													sidebarFields: { ...sidebarFields, showAddress: value }
												})}
												__nextHasNoMarginBottom
											/>

											<ToggleControl
												label={__('Show Phone', 'codeweber-gutenberg-blocks')}
												checked={sidebarFields?.showPhone === true}
												onChange={(value) => setAttributes({ 
													sidebarFields: { ...sidebarFields, showPhone: value }
												})}
												__nextHasNoMarginBottom
											/>

											<ToggleControl
												label={__('Show Working Hours', 'codeweber-gutenberg-blocks')}
												checked={sidebarFields?.showWorkingHours !== false}
												onChange={(value) => setAttributes({ 
													sidebarFields: { ...sidebarFields, showWorkingHours: value }
												})}
												__nextHasNoMarginBottom
											/>

											<ToggleControl
												label={__('Show Description', 'codeweber-gutenberg-blocks')}
												checked={sidebarFields?.showDescription !== false}
												onChange={(value) => setAttributes({ 
													sidebarFields: { ...sidebarFields, showDescription: value }
												})}
												__nextHasNoMarginBottom
											/>
										</PanelBody>
									</>
								)}
							</PanelBody>
						</>
					)}

					{/* CONTROLS TAB */}
					{tab.name === 'controls' && (
						<>
							<PanelBody title={__('Map Controls', 'codeweber-gutenberg-blocks')} initialOpen={true}>
								<ToggleControl
									label={__('Search Control', 'codeweber-gutenberg-blocks')}
									checked={searchControl}
									onChange={(value) => setAttributes({ searchControl: value })}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Geolocation Control', 'codeweber-gutenberg-blocks')}
									checked={geolocationControl}
									onChange={(value) => setAttributes({ geolocationControl: value })}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Route Button', 'codeweber-gutenberg-blocks')}
									checked={routeButton}
									onChange={(value) => setAttributes({ routeButton: value })}
									__nextHasNoMarginBottom
								/>
							</PanelBody>

							<PanelBody title={__('Map Behavior', 'codeweber-gutenberg-blocks')} initialOpen={false}>
								<ToggleControl
									label={__('Scroll Zoom', 'codeweber-gutenberg-blocks')}
									checked={enableScrollZoom}
									onChange={(value) => setAttributes({ enableScrollZoom: value })}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Drag', 'codeweber-gutenberg-blocks')}
									checked={enableDrag}
									onChange={(value) => setAttributes({ enableDrag: value })}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Double Click Zoom', 'codeweber-gutenberg-blocks')}
									checked={enableDblClickZoom}
									onChange={(value) => setAttributes({ enableDblClickZoom: value })}
									__nextHasNoMarginBottom
								/>

								<ToggleControl
									label={__('Auto Fit Bounds', 'codeweber-gutenberg-blocks')}
									checked={autoFitBounds}
									onChange={(value) => setAttributes({ autoFitBounds: value })}
									help={__('Automatically adjust map bounds to fit all markers', 'codeweber-gutenberg-blocks')}
									__nextHasNoMarginBottom
								/>
							</PanelBody>
						</>
					)}

					{/* ADVANCED TAB */}
					{tab.name === 'advanced' && (
						<>
							<PanelBody title={__('Clustering', 'codeweber-gutenberg-blocks')} initialOpen={false}>
								<ToggleControl
									label={__('Enable Clustering', 'codeweber-gutenberg-blocks')}
									checked={clusterer}
									onChange={(value) => setAttributes({ clusterer: value })}
									__nextHasNoMarginBottom
								/>

								{clusterer && (
									<SelectControl
										label={__('Cluster Preset', 'codeweber-gutenberg-blocks')}
										value={clustererPreset}
										options={clustererPresetOptions}
										onChange={(value) => setAttributes({ clustererPreset: value })}
									/>
								)}
							</PanelBody>

							<PanelBody title={__('Balloon Settings', 'codeweber-gutenberg-blocks')} initialOpen={false}>
								<RangeControl
									label={__('Balloon Max Width', 'codeweber-gutenberg-blocks')}
									value={balloonMaxWidth}
									onChange={(value) => setAttributes({ balloonMaxWidth: value })}
									min={200}
									max={600}
									step={50}
								/>

								<ToggleControl
									label={__('Balloon Close Button', 'codeweber-gutenberg-blocks')}
									checked={balloonCloseButton}
									onChange={(value) => setAttributes({ balloonCloseButton: value })}
									__nextHasNoMarginBottom
								/>

								<PanelBody title={__('Balloon Fields', 'codeweber-gutenberg-blocks')} initialOpen={false}>
									<ToggleControl
										label={__('Show City', 'codeweber-gutenberg-blocks')}
										checked={balloonFields?.showCity !== false}
										onChange={(value) => setAttributes({ 
											balloonFields: { ...balloonFields, showCity: value }
										})}
										__nextHasNoMarginBottom
									/>

									<ToggleControl
										label={__('Show Address', 'codeweber-gutenberg-blocks')}
										checked={balloonFields?.showAddress !== false}
										onChange={(value) => setAttributes({ 
											balloonFields: { ...balloonFields, showAddress: value }
										})}
										__nextHasNoMarginBottom
									/>

									<ToggleControl
										label={__('Show Phone', 'codeweber-gutenberg-blocks')}
										checked={balloonFields?.showPhone !== false}
										onChange={(value) => setAttributes({ 
											balloonFields: { ...balloonFields, showPhone: value }
										})}
										__nextHasNoMarginBottom
									/>

									<ToggleControl
										label={__('Show Working Hours', 'codeweber-gutenberg-blocks')}
										checked={balloonFields?.showWorkingHours !== false}
										onChange={(value) => setAttributes({ 
											balloonFields: { ...balloonFields, showWorkingHours: value }
										})}
										__nextHasNoMarginBottom
									/>

									<ToggleControl
										label={__('Show Link', 'codeweber-gutenberg-blocks')}
										checked={balloonFields?.showLink !== false}
										onChange={(value) => setAttributes({ 
											balloonFields: { ...balloonFields, showLink: value }
										})}
										__nextHasNoMarginBottom
									/>

									<ToggleControl
										label={__('Show Description', 'codeweber-gutenberg-blocks')}
										checked={balloonFields?.showDescription === true}
										onChange={(value) => setAttributes({ 
											balloonFields: { ...balloonFields, showDescription: value }
										})}
										__nextHasNoMarginBottom
									/>
								</PanelBody>
							</PanelBody>

							<PanelBody title={__('Block Meta', 'codeweber-gutenberg-blocks')} initialOpen={false}>
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

