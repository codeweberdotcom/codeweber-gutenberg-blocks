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
import { AdaptiveControl } from '../../components/adaptive/AdaptiveControl';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { getColumnClassNames, normalizeColumnId } from './utils';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span title={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<Icon icon={icon} size={20} />
	</span>
);

const tabs = [
	{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-blocks')} /> },
	{ name: 'align', title: <TabIcon icon={positionCenter} label={__('Position', 'codeweber-blocks')} /> },
	{ name: 'adaptive', title: <TabIcon icon={mobile} label={__('Responsive', 'codeweber-blocks')} /> },
	{ name: 'spacing', title: <TabIcon icon={resizeCornerNE} label={__('Spacing', 'codeweber-blocks')} /> },
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
		className: getColumnClassNames(attributes),
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
					template={[['core/html', { content: '' }]]}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default ColumnEdit;


