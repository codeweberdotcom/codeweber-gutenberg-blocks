import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	Icon,
	cog,
	positionCenter,
	mobile,
	resizeCornerNE,
	image,
} from '@wordpress/icons';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import {
	ResponsiveControl,
	createColumnWidthConfig,
} from '../../components/responsive-control';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';
import {
	getColumnClassNames,
	normalizeColumnId,
	getAdaptiveClasses,
	getColumnStyles,
} from './utils';

// Tab icon with native title tooltip
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

const tabs = [
	{
		name: 'settings',
		title: (
			<TabIcon
				icon={cog}
				label={__('Settings', 'codeweber-gutenberg-blocks')}
			/>
		),
	},
	{
		name: 'align',
		title: (
			<TabIcon
				icon={positionCenter}
				label={__('Position', 'codeweber-gutenberg-blocks')}
			/>
		),
	},
	{
		name: 'adaptive',
		title: (
			<TabIcon
				icon={mobile}
				label={__('Responsive', 'codeweber-gutenberg-blocks')}
			/>
		),
	},
	{
		name: 'background',
		title: (
			<TabIcon
				icon={image}
				label={__('Background', 'codeweber-gutenberg-blocks')}
			/>
		),
	},
	{
		name: 'spacing',
		title: (
			<TabIcon
				icon={resizeCornerNE}
				label={__('Spacing', 'codeweber-gutenberg-blocks')}
			/>
		),
	},
];

const ColumnEdit = ({ attributes, setAttributes }) => {
	const {
		columnAlignItems,
		columnJustifyContent,
		columnTextAlign,
		columnPosition,
		columnClass,
		columnData,
		columnId,
		columnColXs,
		columnColSm,
		columnColMd,
		columnColLg,
		columnColXl,
		columnColXxl,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		backgroundType,
		backgroundImageId,
		backgroundImageUrl,
		backgroundImageSize,
		backgroundSize,
	} = attributes;

	const [availableImageSizes, setAvailableImageSizes] = useState([]);
	const [imageSize, setImageSize] = useState('');

	// Fetch current background image data when component mounts or backgroundImageId changes
	useEffect(() => {
		if (backgroundImageId && backgroundImageId > 0) {
			apiFetch({
				path: `/wp/v2/media/${backgroundImageId}`,
				method: 'GET',
			})
				.then((attachment) => {
					// Get file size
					if (
						attachment &&
						attachment.media_details &&
						attachment.media_details.filesize
					) {
						const sizeInBytes = attachment.media_details.filesize;
						if (sizeInBytes < 1024 * 1024) {
							setImageSize(
								(sizeInBytes / 1024).toFixed(1) + ' KB'
							);
						} else {
							setImageSize(
								(sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB'
							);
						}
					} else {
						setImageSize('');
					}

					// Get available sizes from media_details
					if (
						attachment &&
						attachment.media_details &&
						attachment.media_details.sizes
					) {
						const sizes = Object.keys(
							attachment.media_details.sizes
						);
						sizes.push('full'); // Always include full size
						setAvailableImageSizes(sizes);
					} else {
						setAvailableImageSizes(['full']);
					}
				})
				.catch(() => {
					setImageSize('');
					setAvailableImageSizes([]);
				});
		} else {
			setImageSize('');
			setAvailableImageSizes([]);
		}
	}, [backgroundImageId]);

	// Update image URL when backgroundImageSize changes
	useEffect(() => {
		if (backgroundImageId && backgroundImageId > 0 && backgroundImageSize) {
			apiFetch({
				path: `/wp/v2/media/${backgroundImageId}`,
				method: 'GET',
			})
				.then((attachment) => {
					let newUrl = attachment.source_url; // Default to full size

					// Check if requested size exists in media_details
					if (
						backgroundImageSize !== 'full' &&
						attachment.media_details &&
						attachment.media_details.sizes &&
						attachment.media_details.sizes[backgroundImageSize]
					) {
						newUrl =
							attachment.media_details.sizes[backgroundImageSize]
								.source_url;
					}

					// Update URL if different
					if (newUrl !== backgroundImageUrl) {
						setAttributes({ backgroundImageUrl: newUrl });
					}
				})
				.catch((error) => {
					console.error('Failed to fetch image data:', error);
				});
		}
	}, [backgroundImageSize, backgroundImageId]);

	const blockProps = useBlockProps({
		className: getColumnClassNames(attributes, 'edit'),
		id: normalizeColumnId(columnId) || undefined,
		style: getColumnStyles(attributes),
	});

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{tab.name === 'align' && (
								<div style={{ padding: '16px' }}>
									<PositioningControl
										title={__(
											'Column align',
											'codeweber-gutenberg-blocks'
										)}
										alignItems={columnAlignItems}
										onAlignItemsChange={(value) =>
											setAttributes({
												columnAlignItems: value,
											})
										}
										justifyContent={columnJustifyContent}
										onJustifyContentChange={(value) =>
											setAttributes({
												columnJustifyContent: value,
											})
										}
										textAlign={columnTextAlign}
										onTextAlignChange={(value) =>
											setAttributes({
												columnTextAlign: value,
											})
										}
										position={columnPosition}
										onPositionChange={(value) =>
											setAttributes({
												columnPosition: value,
											})
										}
										noPanel={true}
									/>
								</div>
							)}
							{tab.name === 'settings' && (
								<div style={{ padding: '16px' }}>
									<BlockMetaFields
										attributes={attributes}
										setAttributes={setAttributes}
										fieldKeys={{
											classKey: 'columnClass',
											dataKey: 'columnData',
											idKey: 'columnId',
										}}
										labels={{
											classLabel: __(
												'Column Class',
												'codeweber-gutenberg-blocks'
											),
											dataLabel: __(
												'Column Data',
												'codeweber-gutenberg-blocks'
											),
											idLabel: __(
												'Column ID',
												'codeweber-gutenberg-blocks'
											),
										}}
									/>
								</div>
							)}
							{tab.name === 'adaptive' && (
								<div style={{ padding: '16px' }}>
									{/* Отображение классов Column Width */}
									{(() => {
										const columnWidthClasses =
											getAdaptiveClasses(attributes);
										const columnWidthClassesString =
											columnWidthClasses.length > 0
												? columnWidthClasses.join(' ')
												: __(
														'No Column Width Classes',
														'codeweber-gutenberg-blocks'
													);

										return (
											<div
												style={{
													marginBottom: '16px',
													padding: '8px 12px',
													backgroundColor:
														'rgb(240, 240, 241)',
													borderRadius: '4px',
													fontSize: '12px',
													fontFamily: 'monospace',
													color: 'rgb(30, 30, 30)',
												}}
											>
												<div
													style={{
														marginBottom: '4px',
														fontSize: '11px',
														fontWeight: '500',
														textTransform:
															'uppercase',
														color: 'rgb(117, 117, 117)',
													}}
												>
													{__(
														'Column Width Classes',
														'codeweber-gutenberg-blocks'
													)}
													:
												</div>
												<div
													style={{
														wordBreak: 'break-word',
													}}
												>
													{columnWidthClassesString}
												</div>
											</div>
										);
									})()}
									<ResponsiveControl
										{...createColumnWidthConfig(
											attributes,
											setAttributes,
											'dropdown'
										)}
									/>
								</div>
							)}
							{tab.name === 'background' && (
								<div style={{ padding: '16px' }}>
									<BackgroundSettingsPanel
										attributes={attributes}
										setAttributes={setAttributes}
										allowVideo={true}
										backgroundImageSize={
											backgroundImageSize
										}
										imageSizeLabel={imageSize}
										availableImageSizes={
											availableImageSizes
										}
									/>
								</div>
							)}
							{tab.name === 'spacing' && (
								<div style={{ padding: '16px' }}>
									<SpacingControl
										spacingType={spacingType}
										spacingXs={spacingXs}
										spacingSm={spacingSm}
										spacingMd={spacingMd}
										spacingLg={spacingLg}
										spacingXl={spacingXl}
										spacingXxl={spacingXxl}
										onChange={(key, value) =>
											setAttributes({ [key]: value })
										}
									/>
								</div>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>
			<div {...blockProps}>
				<InnerBlocks
					template={[['core/html', { content: '' }]]}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default ColumnEdit;
