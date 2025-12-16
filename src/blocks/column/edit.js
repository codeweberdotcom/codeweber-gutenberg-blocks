import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, cog, positionCenter, mobile, resizeCornerNE } from '@wordpress/icons';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { ResponsiveControl, createColumnWidthConfig } from '../../components/responsive-control';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { getColumnClassNames, normalizeColumnId, getAdaptiveClasses } from './utils';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span title={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<Icon icon={icon} size={20} />
	</span>
);

const tabs = [
	{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	{ name: 'align', title: <TabIcon icon={positionCenter} label={__('Position', 'codeweber-gutenberg-blocks')} /> },
	{ name: 'adaptive', title: <TabIcon icon={mobile} label={__('Responsive', 'codeweber-gutenberg-blocks')} /> },
	{ name: 'spacing', title: <TabIcon icon={resizeCornerNE} label={__('Spacing', 'codeweber-gutenberg-blocks')} /> },
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
	} = attributes;

	const blockProps = useBlockProps({
		className: getColumnClassNames(attributes, 'edit'),
		id: normalizeColumnId(columnId) || undefined,
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
										title={__('Column align', 'codeweber-gutenberg-blocks')}
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
											classLabel: __('Column Class', 'codeweber-gutenberg-blocks'),
											dataLabel: __('Column Data', 'codeweber-gutenberg-blocks'),
											idLabel: __('Column ID', 'codeweber-gutenberg-blocks'),
										}}
									/>
								</div>
							)}
							{tab.name === 'adaptive' && (
								<div style={{ padding: '16px' }}>
									{/* Отображение классов Column Width */}
									{(() => {
										const columnWidthClasses = getAdaptiveClasses(attributes);
										const columnWidthClassesString = columnWidthClasses.length > 0
											? columnWidthClasses.join(' ')
											: __('No Column Width Classes', 'codeweber-gutenberg-blocks');

										return (
											<div style={{
												marginBottom: '16px',
												padding: '8px 12px',
												backgroundColor: 'rgb(240, 240, 241)',
												borderRadius: '4px',
												fontSize: '12px',
												fontFamily: 'monospace',
												color: 'rgb(30, 30, 30)'
											}}>
												<div style={{
													marginBottom: '4px',
													fontSize: '11px',
													fontWeight: '500',
													textTransform: 'uppercase',
													color: 'rgb(117, 117, 117)'
												}}>
													{__('Column Width Classes', 'codeweber-gutenberg-blocks')}:
												</div>
												<div style={{ wordBreak: 'break-word' }}>
													{columnWidthClassesString}
												</div>
											</div>
										);
									})()}
									<ResponsiveControl
										{...createColumnWidthConfig(attributes, setAttributes, 'dropdown')}
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
					template={[['core/html', { content: '' }]]}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default ColumnEdit;
