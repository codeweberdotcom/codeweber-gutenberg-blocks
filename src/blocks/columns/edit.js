import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	ButtonGroup,
	TextControl,
	SelectControl,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

import { PositioningControl } from '../../components/layout/PositioningControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { GapControl } from '../../components/gap/GapControl';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { getColumnsClassNames, normalizeColumnsData, normalizeColumnsId } from './utils';

const GRID_TYPE_OPTIONS = [
	{ value: 'classic', label: __('Classic grid', 'codeweber-blocks') },
	{ value: 'columns-grid', label: __('Columns grid', 'codeweber-blocks') },
];


const ROW_COLS_OPTIONS = [
	{ value: '', label: __('Default', 'codeweber-blocks') },
	{ value: 'auto', label: __('Auto', 'codeweber-blocks') },
	{ value: '1', label: __('1 column', 'codeweber-blocks') },
	{ value: '2', label: __('2 columns', 'codeweber-blocks') },
	{ value: '3', label: __('3 columns', 'codeweber-blocks') },
	{ value: '4', label: __('4 columns', 'codeweber-blocks') },
	{ value: '5', label: __('5 columns', 'codeweber-blocks') },
	{ value: '6', label: __('6 columns', 'codeweber-blocks') },
];

const GridTypeControl = ({ value, onChange }) => (
	<div className="mb-3">
		<div className="component-sidebar-title">
			<label>{__('Grid type', 'codeweber-blocks')}</label>
		</div>
		<ButtonGroup>
			{GRID_TYPE_OPTIONS.map((option) => (
				<Button key={option.value} isPrimary={value === option.value} onClick={() => onChange(option.value)}>
					{option.label}
				</Button>
			))}
		</ButtonGroup>
	</div>
);


const RowColsSelect = ({ label, value, onChange }) => (
	<SelectControl
		label={label}
		value={value}
		options={ROW_COLS_OPTIONS}
		onChange={onChange}
	/>
);

const ColumnsEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		columnsType,
		columnsGutterX,
		columnsGutterY,
		columnsCount,
		columnsAlignItems,
		columnsJustifyContent,
		columnsTextAlign,
		columnsPosition,
		columnsClass,
		columnsData,
		columnsId,
		columnsRowCols,
		columnsRowColsSm,
		columnsRowColsMd,
		columnsRowColsLg,
		columnsRowColsXl,
		columnsRowColsXxl,
		columnsGapType,
		columnsGapXs,
		columnsGapSm,
		columnsGapMd,
		columnsGapLg,
		columnsGapXl,
		columnsGapXxl,
		columnsSpacingType,
		columnsSpacingXs,
		columnsSpacingSm,
		columnsSpacingMd,
		columnsSpacingLg,
		columnsSpacingXl,
		columnsSpacingXxl,
	} = attributes;

	const { replaceInnerBlocks, insertBlocks } = useDispatch('core/block-editor');

	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId) || [],
		[clientId]
	);
	const blockProps = useBlockProps();
	const editorWrapperProps = {
		className: getColumnsClassNames(attributes, 'edit'),
		id: normalizeColumnsId(columnsId) || undefined,
		...normalizeColumnsData(columnsData),
	};

	const adjustColumns = (value) => {
		const count = Number(value);
		const normalized = Number.isNaN(count) ? 1 : count;
		const clamped = Math.min(30, Math.max(1, normalized));
		if (clamped === columnsCount) return;
		const nextBlocks = innerBlocks.slice(0, clamped);
		while (nextBlocks.length < clamped) {
			nextBlocks.push(createBlock('codeweber-blocks/column'));
		}
		setAttributes({ columnsCount: clamped });
		replaceInnerBlocks(clientId, nextBlocks, false);
	};

	const tabs = [
		{ name: 'layout', title: 'Lay' },
		{ name: 'align', title: 'Pos' },
		{ name: 'gap', title: 'Gap' },
		{ name: 'spacing', title: 'Spc' },
		{ name: 'settings', title: 'Set' },
	];

	return (
		<>
			<InspectorControls>
				<TabPanel
					tabs={tabs}
				>
					{(tab) => (
						<>
							{tab.name === 'layout' && (
								<div style={{ padding: '16px' }}>
									<GridTypeControl value={columnsType} onChange={(value) => setAttributes({ columnsType: value })} />
									<TextControl
										label={__('Columns count', 'codeweber-blocks')}
										type="number"
										value={columnsCount}
										min={1}
										max={30}
										step={1}
										onChange={adjustColumns}
									/>
									{columnsType === 'columns-grid' && (
										<div className="component-sidebar-group">
											<RowColsSelect
												label={__('Columns (base)', 'codeweber-blocks')}
												value={columnsRowCols}
												onChange={(value) => setAttributes({ columnsRowCols: value })}
											/>
											<RowColsSelect
												label={__('Columns SM (≥576px)', 'codeweber-blocks')}
												value={columnsRowColsSm}
												onChange={(value) => setAttributes({ columnsRowColsSm: value })}
											/>
											<RowColsSelect
												label={__('Columns MD (≥768px)', 'codeweber-blocks')}
												value={columnsRowColsMd}
												onChange={(value) => setAttributes({ columnsRowColsMd: value })}
											/>
											<RowColsSelect
												label={__('Columns LG (≥992px)', 'codeweber-blocks')}
												value={columnsRowColsLg}
												onChange={(value) => setAttributes({ columnsRowColsLg: value })}
											/>
											<RowColsSelect
												label={__('Columns XL (≥1200px)', 'codeweber-blocks')}
												value={columnsRowColsXl}
												onChange={(value) => setAttributes({ columnsRowColsXl: value })}
											/>
											<RowColsSelect
												label={__('Columns XXL (≥1400px)', 'codeweber-blocks')}
												value={columnsRowColsXxl}
												onChange={(value) => setAttributes({ columnsRowColsXxl: value })}
											/>
										</div>
									)}
								</div>
							)}
							{tab.name === 'align' && (
								<div style={{ padding: '16px' }}>
									<PositioningControl
										title={__('Columns align', 'codeweber-blocks')}
										alignItems={columnsAlignItems}
										onAlignItemsChange={(value) => setAttributes({ columnsAlignItems: value })}
										justifyContent={columnsJustifyContent}
										onJustifyContentChange={(value) => setAttributes({ columnsJustifyContent: value })}
										textAlign={columnsTextAlign}
										onTextAlignChange={(value) => setAttributes({ columnsTextAlign: value })}
										position={columnsPosition}
										onPositionChange={(value) => setAttributes({ columnsPosition: value })}
										noPanel={true}
									/>
								</div>
							)}
							{tab.name === 'gap' && (
								<div style={{ padding: '16px' }}>
									<GapControl
										columnsGapType={columnsGapType}
										columnsGapXs={columnsGapXs}
										columnsGapSm={columnsGapSm}
										columnsGapMd={columnsGapMd}
										columnsGapLg={columnsGapLg}
										columnsGapXl={columnsGapXl}
										columnsGapXxl={columnsGapXxl}
										onChange={(key, value) => setAttributes({ [key]: value })}
									/>
								</div>
							)}
							{tab.name === 'spacing' && (
								<div style={{ padding: '16px' }}>
									<SpacingControl
										spacingType={columnsSpacingType}
										spacingXs={columnsSpacingXs}
										spacingSm={columnsSpacingSm}
										spacingMd={columnsSpacingMd}
										spacingLg={columnsSpacingLg}
										spacingXl={columnsSpacingXl}
										spacingXxl={columnsSpacingXxl}
										onChange={(key, value) => setAttributes({ [key]: value })}
									/>
								</div>
							)}
							{tab.name === 'settings' && (
								<PanelBody
									title={__('Columns Block Settings', 'codeweber-blocks')}
									className="custom-panel-body"
									initialOpen={true}
								>
									<BlockMetaFields
										attributes={attributes}
										setAttributes={setAttributes}
										fieldKeys={{
											classKey: 'columnsClass',
											dataKey: 'columnsData',
											idKey: 'columnsId',
										}}
										labels={{
											classLabel: __('Columns Class', 'codeweber-blocks'),
											dataLabel: __('Columns Data', 'codeweber-blocks'),
											idLabel: __('Columns ID', 'codeweber-blocks'),
										}}
									/>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>
			<div {...blockProps}>
				<div {...editorWrapperProps}>
					<InnerBlocks
						allowedBlocks={['codeweber-blocks/column']}
						template={Array.from({ length: columnsCount }, () => ['codeweber-blocks/column', {}])}
						templateLock={false}
					/>
				</div>
			</div>
		</>
	);
};

export default ColumnsEdit;


