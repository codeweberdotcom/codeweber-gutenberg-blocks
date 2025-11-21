import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, Button, ButtonGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { PositioningControl } from '../../components/layout/PositioningControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { RangeControl } from '@wordpress/components';
import { getRowClassNames, normalizeRowData } from './utils';

const GRID_TYPE_OPTIONS = [
	{ value: 'classic', label: __('Classic grid', 'codeweber-blocks') },
	{ value: 'columns-grid', label: __('Columns grid', 'codeweber-blocks') },
];

const GUTTER_OPTIONS = [
	'',
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'lg-0',
	'lg-8',
];

const COL_OPTIONS = [
	'',
	'row-cols-1',
	'row-cols-2',
	'row-cols-3',
	'row-cols-4',
	'row-cols-5',
	'row-cols-6',
	'row-cols-md-2',
	'row-cols-md-3',
	'row-cols-lg-4',
	'row-cols-xl-5',
];

const GridTypeControl = ({ value, onChange }) => (
	<div className="mb-3">
		<div className="component-sidebar-title">
			<label>{__('Grid type', 'codeweber-blocks')}</label>
		</div>
		<ButtonGroup>
			{GRID_TYPE_OPTIONS.map((option) => (
				<Button
					key={option.value}
					isPrimary={value === option.value}
					onClick={() => onChange(option.value)}
				>
					{option.label}
				</Button>
			))}
		</ButtonGroup>
	</div>
);

const SelectGutter = ({ label, value, onChange }) => (
	<div className="mb-3">
		<div className="component-sidebar-title">
			<label>{label}</label>
		</div>
		<ButtonGroup>
			{GUTTER_OPTIONS.map((option) => (
				<Button
					key={option}
					isPrimary={value === option}
					onClick={() => onChange(option)}
				>
					{option === '' ? __('none', 'codeweber-blocks') : option}
				</Button>
			))}
		</ButtonGroup>
	</div>
);

const SelectRowCols = ({ value, onChange }) => (
	<div className="mb-3">
		<div className="component-sidebar-title">
			<label>{__('Row columns', 'codeweber-blocks')}</label>
		</div>
		<ButtonGroup>
			{COL_OPTIONS.map((option) => (
				<Button key={option} isPrimary={value === option} onClick={() => onChange(option)}>
					{option === '' ? __('default', 'codeweber-blocks') : option}
				</Button>
			))}
		</ButtonGroup>
	</div>
);

const RowEdit = ({ attributes, setAttributes }) => {
	const {
		rowType,
		rowGutterX,
		rowGutterY,
		rowCols,
		rowAlignItems,
		rowJustifyContent,
		rowTextAlign,
		rowPosition,
		rowClass,
		rowData,
		rowId,
	} = attributes;

	const blockProps = useBlockProps({
		className: `row ${getRowClassNames(attributes)}`,
		id: rowId || undefined,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Grid settings', 'codeweber-blocks')} className="custom-panel-body">
					<GridTypeControl value={rowType} onChange={(value) => setAttributes({ rowType: value })} />
					<SelectGutter label={__('Gutter X', 'codeweber-blocks')} value={rowGutterX} onChange={(value) => setAttributes({ rowGutterX: value })} />
					<SelectGutter label={__('Gutter Y', 'codeweber-blocks')} value={rowGutterY} onChange={(value) => setAttributes({ rowGutterY: value })} />
					<SelectRowCols value={rowCols} onChange={(value) => setAttributes({ rowCols: value })} />
					<RangeControl
						label={__('Columns count', 'codeweber-blocks')}
						value={rowColumnsCount}
						onChange={(value) => setAttributes({ rowColumnsCount: value })}
						min={0}
						max={6}
						step={1}
					/>
				</PanelBody>
				<PositioningControl
					title={__('Row positioning', 'codeweber-blocks')}
					alignItems={rowAlignItems}
					onAlignItemsChange={(value) => setAttributes({ rowAlignItems: value })}
					justifyContent={rowJustifyContent}
					onJustifyContentChange={(value) => setAttributes({ rowJustifyContent: value })}
					textAlign={rowTextAlign}
					onTextAlignChange={(value) => setAttributes({ rowTextAlign: value })}
					position={rowPosition}
					onPositionChange={(value) => setAttributes({ rowPosition: value })}
				/>
				<BlockMetaFields
					attributes={attributes}
					setAttributes={setAttributes}
					fieldKeys={{
						classKey: 'rowClass',
						dataKey: 'rowData',
						idKey: 'rowId',
					}}
					labels={{
						classLabel: __('Row Class', 'codeweber-blocks'),
						dataLabel: __('Row Data', 'codeweber-blocks'),
						idLabel: __('Row ID', 'codeweber-blocks'),
					}}
				/>
			</InspectorControls>
			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={['core/columns', 'core/group', 'codeweber-blocks/button']}
					template={[['core/columns', {}]]}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default RowEdit;


