/**
 * Yandex Map v3 Block - Sidebar Component
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TabPanel,
	ToggleControl,
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { Icon, cog, mapMarker, settings } from '@wordpress/icons';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { MarkerRepeaterControl } from '../yandex-map/controls/MarkerRepeaterControl';
import { OfficesQueryControl } from '../yandex-map/controls/OfficesQueryControl';
import { CoordinateControl } from '../yandex-map/controls/CoordinateControl';

const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

export const YandexMapV3Sidebar = ({ attributes, setAttributes }) => {
	const {
		dataSource,
		center,
		zoom,
		height,
		mapType,
		colorScheme,
		customStyleJson,
		borderRadius,
		enableScrollZoom,
		enableDrag,
		autoFitBounds,
		officesQuery,
		customMarkers,
		markerColor,
		blockClass,
		blockId,
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
			name: 'advanced',
			title: (
				<TabIcon
					icon={settings}
					label={__('Advanced', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
	];

	const mapTypeOptions = [
		{ label: __('Map', 'codeweber-gutenberg-blocks'), value: 'normal' },
		{ label: __('Satellite', 'codeweber-gutenberg-blocks'), value: 'satellite' },
		{ label: __('Hybrid', 'codeweber-gutenberg-blocks'), value: 'hybrid' },
	];

	const colorSchemeOptions = [
		{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
		{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
		{ label: __('Grayscale', 'codeweber-gutenberg-blocks'), value: 'grayscale' },
		{ label: __('Pale', 'codeweber-gutenberg-blocks'), value: 'pale' },
		{ label: __('Sepia', 'codeweber-gutenberg-blocks'), value: 'sepia' },
		{ label: __('Custom JSON', 'codeweber-gutenberg-blocks'), value: 'custom' },
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{/* MAIN TAB */}
					{tab.name === 'main' && (
						<>
							<PanelBody
								title={__('Data Source', 'codeweber-gutenberg-blocks')}
								initialOpen={true}
							>
								<SelectControl
									label={__('Data Source', 'codeweber-gutenberg-blocks')}
									value={dataSource}
									options={[
										{ label: __('Offices from CPT', 'codeweber-gutenberg-blocks'), value: 'offices' },
										{ label: __('Custom Markers', 'codeweber-gutenberg-blocks'), value: 'custom' },
									]}
									onChange={(value) => setAttributes({ dataSource: value })}
								/>
							</PanelBody>

							<PanelBody
								title={__('Map Settings', 'codeweber-gutenberg-blocks')}
								initialOpen={true}
							>
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

								<SelectControl
									label={__('Color Scheme', 'codeweber-gutenberg-blocks')}
									value={colorScheme}
									options={colorSchemeOptions}
									onChange={(value) => setAttributes({ colorScheme: value })}
								/>

								{colorScheme === 'custom' && (
									<TextareaControl
										label={__('Custom Style JSON', 'codeweber-gutenberg-blocks')}
										value={customStyleJson}
										onChange={(value) => setAttributes({ customStyleJson: value })}
										rows={6}
										help={__('Yandex Maps v3 customization JSON array', 'codeweber-gutenberg-blocks')}
									/>
								)}

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
								<PanelBody
									title={__('Offices Query', 'codeweber-gutenberg-blocks')}
									initialOpen={true}
								>
									<OfficesQueryControl
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</PanelBody>
							) : (
								<PanelBody
									title={__('Custom Markers', 'codeweber-gutenberg-blocks')}
									initialOpen={true}
								>
									<MarkerRepeaterControl
										markers={customMarkers || []}
										onChange={(markers) => setAttributes({ customMarkers: markers })}
									/>
								</PanelBody>
							)}

							<PanelBody
								title={__('Marker Display', 'codeweber-gutenberg-blocks')}
								initialOpen={false}
							>
								<TextControl
									label={__('Marker Color', 'codeweber-gutenberg-blocks')}
									value={markerColor}
									onChange={(value) => setAttributes({ markerColor: value })}
									type="color"
								/>
							</PanelBody>
						</>
					)}

					{/* ADVANCED TAB */}
					{tab.name === 'advanced' && (
						<>
							<PanelBody
								title={__('Map Behavior', 'codeweber-gutenberg-blocks')}
								initialOpen={true}
							>
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
									label={__('Auto Fit Bounds', 'codeweber-gutenberg-blocks')}
									checked={autoFitBounds}
									onChange={(value) => setAttributes({ autoFitBounds: value })}
									help={__('Automatically adjust map to fit all markers', 'codeweber-gutenberg-blocks')}
									__nextHasNoMarginBottom
								/>
							</PanelBody>

							<PanelBody
								title={__('Block Meta', 'codeweber-gutenberg-blocks')}
								initialOpen={false}
							>
								<BlockMetaFields
									attributes={attributes}
									setAttributes={setAttributes}
									fieldKeys={{
										classKey: 'blockClass',
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
