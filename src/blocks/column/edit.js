import { useState, useEffect } from '@wordpress/element';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, Button, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';
import { AdaptiveControl } from '../../components/adaptive/AdaptiveControl';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { getColumnClassNames, normalizeColumnId, getColumnStyles, getSpacingClasses } from './utils';

const tabs = [
	{ name: 'settings', title: 'Set' },
	{ name: 'align', title: 'Pos' },
	{ name: 'background', title: 'Bg' },
	{ name: 'adaptive', title: 'Resp' },
	{ name: 'spacing', title: 'Spc' },
];

const ALLOWED_BLOCKS = [];
const ColumnEdit = ({ attributes, setAttributes }) => {
	const {
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageUrl,
		backgroundSize,
		backgroundOverlay,
		backgroundImageId,
		backgroundPatternUrl,
		backgroundVideoId,
		backgroundVideoUrl,
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
	} = attributes;

	const [videoSize, setVideoSize] = useState('');

	useEffect(() => {
		if (backgroundVideoId && backgroundVideoId > 0 && wp?.apiFetch) {
			wp.apiFetch({ path: `/wp/v2/media/${backgroundVideoId}`, method: 'GET' })
				.then((attachment) => {
					const sizeInBytes = attachment?.media_details?.filesize;
					if (sizeInBytes) {
						setVideoSize(sizeInBytes < 1024 * 1024 ? `${(sizeInBytes / 1024).toFixed(1)} KB` : `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`);
					} else {
						setVideoSize('');
					}
				})
				.catch(() => setVideoSize(''));
		} else {
			setVideoSize('');
		}
	}, [backgroundVideoId]);

	const blockProps = useBlockProps({
		className: getColumnClassNames(attributes),
		id: normalizeColumnId(columnId) || undefined,
		style: getColumnStyles(attributes),
	});

	const handleVideoSelect = (media) => {
		setAttributes({
			backgroundVideoId: media?.id || 0,
			backgroundVideoUrl: media?.url || '',
		});
	};

	const handleVideoRemove = () => {
		setAttributes({
			backgroundVideoId: 0,
			backgroundVideoUrl: '',
		});
	};

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{tab.name === 'background' && (
								<div style={{ padding: '16px' }}>
									<BackgroundSettingsPanel
										attributes={attributes}
										setAttributes={setAttributes}
										allowVideo={true}
									/>
									{backgroundType === 'video' && (
										<>
											<div className="component-sidebar-title">
												<label>{__('Background Video', 'codeweber-blocks')}</label>
											</div>
											<MediaUploadCheck>
												<MediaUpload
													onSelect={handleVideoSelect}
													allowedTypes={['video']}
													value={backgroundVideoId}
													render={({ open }) =>
														backgroundVideoUrl ? (
															<div
																onClick={(event) => {
																	event.preventDefault();
																	open();
																}}
																style={{
																	marginTop: '12px',
																	marginBottom: '12px',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																	minHeight: '120px',
																	backgroundColor: '#000',
																	border: '1px solid #ddd',
																	borderRadius: '4px',
																	position: 'relative',
																	cursor: 'pointer',
																}}
															>
																<div
																	style={{
																		color: '#fff',
																		fontSize: '14px',
																		fontWeight: '500',
																		textAlign: 'center',
																		padding: '10px',
																	}}
																>
																	🎥 {__('Video loaded', 'codeweber-blocks')}
																</div>
																{videoSize && (
																	<div
																		style={{
																			position: 'absolute',
																			bottom: '6px',
																			right: '6px',
																			padding: '2px 6px',
																			backgroundColor: 'rgba(0, 0, 0, 0.7)',
																			color: '#fff',
																			borderRadius: '3px',
																			fontSize: '10px',
																		}}
																	>
																		{videoSize}
																	</div>
																)}
																<Button
																	isLink
																	onClick={(event) => {
																		event.stopPropagation();
																		handleVideoRemove();
																	}}
																	style={{
																		position: 'absolute',
																		top: '6px',
																		right: '6px',
																		backgroundColor: 'rgba(220, 53, 69, 0.8)',
																		borderRadius: '50%',
																		width: '20px',
																		height: '20px',
																		display: 'flex',
																		alignItems: 'center',
																	justifyContent: 'center',
																		color: '#fff',
																	}}
																>
																	<i className="uil uil-times" style={{ margin: 0, fontSize: '12px' }}></i>
																</Button>
															</div>
														) : (
															<div
																className="video-placeholder"
																onClick={open}
																style={{
																	width: '100%',
																	height: '100px',
																	backgroundColor: '#f0f0f0',
																	border: '2px dashed #ccc',
																	borderRadius: '4px',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																	cursor: 'pointer',
																	transition: 'all 0.2s ease',
																}}
															>
																<div style={{ textAlign: 'center', color: '#666' }}>
																	<div style={{ fontSize: '20px', marginBottom: '4px' }}>🎥</div>
																	<div style={{ fontSize: '12px', fontWeight: '500' }}>
																		{__('Select Video', 'codeweber-blocks')}
																	</div>
																</div>
															</div>
														)
													}
												/>
											</MediaUploadCheck>
										</>
									)}
								</div>
							)}
							{tab.name === 'align' && (
								<div style={{ padding: '16px' }}>
									<PositioningControl
										title={__('Column align', 'codeweber-blocks')}
										alignItems={columnAlignItems}
										onAlignItemsChange={(value) => setAttributes({ columnAlignItems: value })}
										justifyContent={columnJustifyContent}
										onJustifyContentChange={(value) => setAttributes({ columnJustifyContent: value })}
										textAlign={columnTextAlign}
										onTextAlignChange={(value) => setAttributes({ columnTextAlign: value })}
										position={columnPosition}
										onPositionChange={(value) => setAttributes({ columnPosition: value })}
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
											classLabel: __('Column Class', 'codeweber-blocks'),
											dataLabel: __('Column Data', 'codeweber-blocks'),
											idLabel: __('Column ID', 'codeweber-blocks'),
										}}
									/>
								</div>
							)}
							{tab.name === 'adaptive' && (
								<div style={{ padding: '16px' }}>
									<AdaptiveControl
										columnColXs={columnColXs}
										columnColSm={columnColSm}
										columnColMd={columnColMd}
										columnColLg={columnColLg}
										columnColXl={columnColXl}
										columnColXxl={columnColXxl}
										onChange={(key, value) => setAttributes({ [key]: value })}
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
										onChange={(key, value) => setAttributes({ [key]: value })}
									/>
								</div>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>
			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					template={[['core/html', { content: '' }]]}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default ColumnEdit;


