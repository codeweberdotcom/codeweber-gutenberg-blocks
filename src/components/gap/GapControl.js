import { __ } from '@wordpress/i18n';
import { SelectControl, ButtonGroup, Button } from '@wordpress/components';

const GAP_TYPE_OPTIONS = [
	{ label: __('General', 'codeweber-blocks'), value: 'general' },
	{ label: __('Horizontal', 'codeweber-blocks'), value: 'x' },
	{ label: __('Vertical', 'codeweber-blocks'), value: 'y' },
];

const createGapOptions = (type, breakpoint = '') => {
	const prefix = type === 'general' ? 'g' : type === 'x' ? 'gx' : 'gy';
	const fullPrefix = breakpoint ? `${prefix}-${breakpoint}` : prefix;
	return [
		{ value: '', label: __('None', 'codeweber-blocks') },
		{ value: '0', label: `${fullPrefix}-0` },
		{ value: '1', label: `${fullPrefix}-1` },
		{ value: '2', label: `${fullPrefix}-2` },
		{ value: '3', label: `${fullPrefix}-3` },
		{ value: '4', label: `${fullPrefix}-4` },
		{ value: '5', label: `${fullPrefix}-5` },
	];
};

export const GapControl = ({
	columnsGapType,
	columnsGapXs,
	columnsGapSm,
	columnsGapMd,
	columnsGapLg,
	columnsGapXl,
	columnsGapXxl,
	onChange,
}) => {
	return (
		<>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Gap Type', 'codeweber-blocks')}</label>
				</div>
				<ButtonGroup>
					{GAP_TYPE_OPTIONS.map((option) => (
						<Button
							key={option.value}
							isPrimary={columnsGapType === option.value}
							onClick={() => onChange('columnsGapType', option.value)}
						>
							{option.label}
						</Button>
					))}
				</ButtonGroup>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Extra small (xs)', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnsGapXs}
					options={createGapOptions(columnsGapType, '')}
					onChange={(value) => onChange('columnsGapXs', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Small (sm) ≥576px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnsGapSm}
					options={createGapOptions(columnsGapType, 'sm')}
					onChange={(value) => onChange('columnsGapSm', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Medium (md) ≥768px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnsGapMd}
					options={createGapOptions(columnsGapType, 'md')}
					onChange={(value) => onChange('columnsGapMd', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Large (lg) ≥992px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnsGapLg}
					options={createGapOptions(columnsGapType, 'lg')}
					onChange={(value) => onChange('columnsGapLg', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Extra large (xl) ≥1200px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnsGapXl}
					options={createGapOptions(columnsGapType, 'xl')}
					onChange={(value) => onChange('columnsGapXl', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Extra extra large (xxl) ≥1400px', 'codeweber-blocks')}</label>
				</div>
				<SelectControl
					value={columnsGapXxl}
					options={createGapOptions(columnsGapType, 'xxl')}
					onChange={(value) => onChange('columnsGapXxl', value)}
				/>
			</div>
		</>
	);
};

export default GapControl;

