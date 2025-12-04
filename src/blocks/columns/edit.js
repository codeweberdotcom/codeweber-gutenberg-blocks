import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Button,
	ButtonGroup,
	TextControl,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { Icon, column, positionCenter, resizeCornerNE, cog, justifySpaceBetween } from '@wordpress/icons';

import { PositioningControl } from '../../components/layout/PositioningControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { GridControl, getGridClasses } from '../../components/grid-control';
import { ResponsiveControl, createColumnWidthConfig } from '../../components/responsive-control';
import { getColumnsClassNames, normalizeColumnsData, normalizeColumnsId } from './utils';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span title={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<Icon icon={icon} size={20} />
	</span>
);

const GRID_TYPE_OPTIONS = [
	{ value: 'classic', label: __('Classic grid', 'codeweber-gutenberg-blocks') },
	{ value: 'columns-grid', label: __('Columns grid', 'codeweber-gutenberg-blocks') },
];

const GridTypeControl = ({ value, onChange, onTypeChange }) => (
	<div className="mb-3">
		<div className="component-sidebar-title">
			<label>{__('Grid type', 'codeweber-gutenberg-blocks')}</label>
		</div>
		<ButtonGroup>
			{GRID_TYPE_OPTIONS.map((option) => (
				<Button 
					key={option.value} 
					isPrimary={value === option.value} 
					onClick={() => {
						onChange(option.value);
						if (onTypeChange) {
							onTypeChange(option.value);
						}
					}}
				>
					{option.label}
				</Button>
			))}
		</ButtonGroup>
	</div>
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

	const { replaceInnerBlocks, insertBlocks, updateBlockAttributes } = useDispatch('core/block-editor');

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
		const clamped = Math.min(30, Math.max(0, normalized));
		if (clamped === columnsCount) return;
		const nextBlocks = innerBlocks.slice(0, clamped);
		while (nextBlocks.length < clamped) {
			nextBlocks.push(createBlock('codeweber-blocks/column'));
		}
		setAttributes({ columnsCount: clamped });
		replaceInnerBlocks(clientId, nextBlocks, false);
	};

	// Функция синхронизации ширины колонок для Classic Grid
	const syncColumnWidths = (attribute, value) => {
		if (columnsType !== 'classic') return;
		
		// Обновляем все дочерние Column блоки
		innerBlocks.forEach(block => {
			if (block.name === 'codeweber-blocks/column') {
				updateBlockAttributes(block.clientId, { [attribute]: value });
			}
		});
	};

	// Функция сброса ширины колонок при переключении на Columns Grid
	const resetColumnWidthsToNone = () => {
		innerBlocks.forEach(block => {
			if (block.name === 'codeweber-blocks/column') {
				updateBlockAttributes(block.clientId, {
					columnColXs: '',  // Нет (col) - растягивается
					columnColSm: '',
					columnColMd: '',
					columnColLg: '',
					columnColXl: '',
					columnColXxl: '',
				});
			}
		});
	};

	// Обработчик изменения типа сетки
	const handleGridTypeChange = (newType) => {
		setAttributes({ columnsType: newType });
		
		// Если переключились на Columns Grid, сбрасываем ширины колонок на None (col)
		if (newType === 'columns-grid') {
			resetColumnWidthsToNone();
		}
	};

	const tabs = [
		{ name: 'layout', title: <TabIcon icon={column} label={__('Layout', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'align', title: <TabIcon icon={positionCenter} label={__('Position', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'gap', title: <TabIcon icon={justifySpaceBetween} label={__('Gap', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'spacing', title: <TabIcon icon={resizeCornerNE} label={__('Spacing', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
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
									<GridTypeControl 
										value={columnsType} 
										onChange={(value) => setAttributes({ columnsType: value })}
										onTypeChange={handleGridTypeChange}
									/>
									<TextControl
										label={__('Columns count', 'codeweber-gutenberg-blocks')}
										type="number"
										value={columnsCount}
										min={0}
										max={30}
										step={1}
										onChange={adjustColumns}
									/>
									
									{/* Columns Grid - управление шириной на уровне контейнера */}
									{columnsType === 'columns-grid' && (
										<GridControl
											attributes={attributes}
											setAttributes={setAttributes}
											attributePrefix="columns"
											showRowCols={true}
											showGap={false}
											showSpacing={false}
											rowColsLabel={__('Columns Per Row', 'codeweber-gutenberg-blocks')}
										/>
									)}
									
									{/* Classic Grid - управление шириной дочерних Column блоков */}
									{columnsType === 'classic' && (
										<div style={{ 
											marginTop: '16px',
											padding: '12px',
											backgroundColor: '#f0f0f0',
											borderRadius: '4px'
										}}>
											<div style={{ 
												marginBottom: '8px',
												fontSize: '12px',
												fontWeight: '500',
												color: '#666'
											}}>
												{__('Apply column width to all child columns:', 'codeweber-gutenberg-blocks')}
											</div>
											<ResponsiveControl
												{...createColumnWidthConfig(
													{
														columnColXs: '',
														columnColSm: '',
														columnColMd: '',
														columnColLg: '',
														columnColXl: '',
														columnColXxl: '',
													},
													(attrs) => {
														// При изменении синхронизируем со всеми Column блоками
														Object.keys(attrs).forEach(attr => {
															syncColumnWidths(attr, attrs[attr]);
														});
													},
													'dropdown'
												)}
											/>
										</div>
									)}
								</div>
							)}
							{tab.name === 'align' && (
								<div style={{ padding: '16px' }}>
									<PositioningControl
										title={__('Columns align', 'codeweber-gutenberg-blocks')}
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
									<GridControl
										attributes={attributes}
										setAttributes={setAttributes}
										attributePrefix="columns"
										showRowCols={false}
										showGap={true}
										showSpacing={false}
									/>
								</div>
							)}
							{tab.name === 'spacing' && (
								<div style={{ padding: '16px' }}>
									<GridControl
										attributes={attributes}
										setAttributes={setAttributes}
										attributePrefix="columns"
										showRowCols={false}
										showGap={false}
										showSpacing={true}
									/>
								</div>
							)}
							{tab.name === 'settings' && (
								<div style={{ padding: '16px' }}>
									<BlockMetaFields
										attributes={attributes}
										setAttributes={setAttributes}
										fieldKeys={{
											classKey: 'columnsClass',
											dataKey: 'columnsData',
											idKey: 'columnsId',
										}}
										labels={{
											classLabel: __('Columns Class', 'codeweber-gutenberg-blocks'),
											dataLabel: __('Columns Data', 'codeweber-gutenberg-blocks'),
											idLabel: __('Columns ID', 'codeweber-gutenberg-blocks'),
										}}
									/>
								</div>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>
			<div {...blockProps}>
				<div {...editorWrapperProps}>
					<InnerBlocks
						template={Array.from({ length: columnsCount }, () => ['codeweber-blocks/column', {}])}
						templateLock={false}
					/>
				</div>
			</div>
		</>
	);
};

export default ColumnsEdit;


