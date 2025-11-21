import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

const createColumnOptions = (prefix = '') => [
	{ value: '', label: __('None', 'codeweber-blocks') },
	{ value: 'auto', label: prefix ? `${prefix}-auto` : 'col-auto' },
	{ value: '1', label: prefix ? `${prefix}-1` : 'col-1' },
	{ value: '2', label: prefix ? `${prefix}-2` : 'col-2' },
	{ value: '3', label: prefix ? `${prefix}-3` : 'col-3' },
	{ value: '4', label: prefix ? `${prefix}-4` : 'col-4' },
	{ value: '5', label: prefix ? `${prefix}-5` : 'col-5' },
	{ value: '6', label: prefix ? `${prefix}-6` : 'col-6' },
	{ value: '7', label: prefix ? `${prefix}-7` : 'col-7' },
	{ value: '8', label: prefix ? `${prefix}-8` : 'col-8' },
	{ value: '9', label: prefix ? `${prefix}-9` : 'col-9' },
	{ value: '10', label: prefix ? `${prefix}-10` : 'col-10' },
	{ value: '11', label: prefix ? `${prefix}-11` : 'col-11' },
	{ value: '12', label: prefix ? `${prefix}-12` : 'col-12' },
];

export const AdaptiveControl = ({
	columnColXs,
	columnColSm,
	columnColMd,
	columnColLg,
	columnColXl,
	columnColXxl,
	onChange,
}) => {
	return (
		<>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Extra small (xs)', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnColXs}
					options={createColumnOptions('col')}
					onChange={(value) => onChange('columnColXs', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Small (sm) ≥576px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnColSm}
					options={createColumnOptions('col-sm')}
					onChange={(value) => onChange('columnColSm', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Medium (md) ≥768px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnColMd}
					options={createColumnOptions('col-md')}
					onChange={(value) => onChange('columnColMd', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Large (lg) ≥992px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnColLg}
					options={createColumnOptions('col-lg')}
					onChange={(value) => onChange('columnColLg', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Extra large (xl) ≥1200px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnColXl}
					options={createColumnOptions('col-xl')}
					onChange={(value) => onChange('columnColXl', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Extra extra large (xxl) ≥1400px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnColXxl}
					options={createColumnOptions('col-xxl')}
					onChange={(value) => onChange('columnColXxl', value)}
				/>
			</div>
		</>
	);
};

export default AdaptiveControl;

