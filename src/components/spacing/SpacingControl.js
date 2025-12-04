import { __ } from '@wordpress/i18n';
import { SelectControl, ButtonGroup, Button } from '@wordpress/components';

const SPACING_TYPE_OPTIONS = [
	{ label: __('Padding', 'codeweber-gutenberg-blocks'), value: 'padding' },
	{ label: __('Margin', 'codeweber-gutenberg-blocks'), value: 'margin' },
];

const createSpacingOptions = (type, breakpoint = '') => {
	const prefix = type === 'margin' ? 'm' : 'p';
	const fullPrefix = breakpoint ? `${prefix}-${breakpoint}` : prefix;
	return [
		{ value: '', label: __('None', 'codeweber-gutenberg-blocks') },
		{ value: '0', label: `${fullPrefix}-0` },
		{ value: '1', label: `${fullPrefix}-1` },
		{ value: '2', label: `${fullPrefix}-2` },
		{ value: '3', label: `${fullPrefix}-3` },
		{ value: '4', label: `${fullPrefix}-4` },
		{ value: '5', label: `${fullPrefix}-5` },
		{ value: '6', label: `${fullPrefix}-6` },
		{ value: '7', label: `${fullPrefix}-7` },
		{ value: '8', label: `${fullPrefix}-8` },
		{ value: '9', label: `${fullPrefix}-9` },
		{ value: '10', label: `${fullPrefix}-10` },
		{ value: '11', label: `${fullPrefix}-11` },
		{ value: '12', label: `${fullPrefix}-12` },
		{ value: '13', label: `${fullPrefix}-13` },
		{ value: '14', label: `${fullPrefix}-14` },
		{ value: '15', label: `${fullPrefix}-15` },
		{ value: '16', label: `${fullPrefix}-16` },
		{ value: '17', label: `${fullPrefix}-17` },
		{ value: '18', label: `${fullPrefix}-18` },
		{ value: '19', label: `${fullPrefix}-19` },
		{ value: '20', label: `${fullPrefix}-20` },
		{ value: '21', label: `${fullPrefix}-21` },
		{ value: '22', label: `${fullPrefix}-22` },
		{ value: '23', label: `${fullPrefix}-23` },
		{ value: '24', label: `${fullPrefix}-24` },
		{ value: '25', label: `${fullPrefix}-25` },
	];
};

export const SpacingControl = ({
	spacingType,
	spacingXs,
	spacingSm,
	spacingMd,
	spacingLg,
	spacingXl,
	spacingXxl,
	onChange,
}) => {
	return (
		<>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Spacing Type', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<ButtonGroup>
					{SPACING_TYPE_OPTIONS.map((option) => (
						<Button
							key={option.value}
							isPrimary={spacingType === option.value}
							onClick={() => onChange('spacingType', option.value)}
						>
							{option.label}
						</Button>
					))}
				</ButtonGroup>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Extra small (xs)', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={spacingXs}
					options={createSpacingOptions(spacingType, '')}
					onChange={(value) => onChange('spacingXs', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Small (sm) ≥576px', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={spacingSm}
					options={createSpacingOptions(spacingType, 'sm')}
					onChange={(value) => onChange('spacingSm', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Medium (md) ≥768px', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={spacingMd}
					options={createSpacingOptions(spacingType, 'md')}
					onChange={(value) => onChange('spacingMd', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Large (lg) ≥992px', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={spacingLg}
					options={createSpacingOptions(spacingType, 'lg')}
					onChange={(value) => onChange('spacingLg', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Extra large (xl) ≥1200px', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={spacingXl}
					options={createSpacingOptions(spacingType, 'xl')}
					onChange={(value) => onChange('spacingXl', value)}
				/>
			</div>
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>{__('Extra extra large (xxl) ≥1400px', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={spacingXxl}
					options={createSpacingOptions(spacingType, 'xxl')}
					onChange={(value) => onChange('spacingXxl', value)}
				/>
			</div>
		</>
	);
};

export default SpacingControl;

