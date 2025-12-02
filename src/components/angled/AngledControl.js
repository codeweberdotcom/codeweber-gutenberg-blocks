/**
 * Angled Control Component
 * Based on Sandbox theme dividers: https://sandbox.elemisthemes.com/docs/elements/dividers.html
 */
import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup, ToggleControl } from '@wordpress/components';

const UPPER_OPTIONS = [
	{ value: '', label: __('None', 'codeweber-blocks') },
	{ value: 'upper-start', label: __('Up.Start', 'codeweber-blocks') },
	{ value: 'upper-end', label: __('Up.End', 'codeweber-blocks') },
];

const LOWER_OPTIONS = [
	{ value: '', label: __('None', 'codeweber-blocks') },
	{ value: 'lower-start', label: __('Down.Start', 'codeweber-blocks') },
	{ value: 'lower-end', label: __('Down.End', 'codeweber-blocks') },
];

export const AngledControl = ({
	angledEnabled,
	angledUpper,
	angledLower,
	onAngledEnabledChange,
	onAngledUpperChange,
	onAngledLowerChange,
}) => {
	return (
		<>
			<ToggleControl
				label={__('Enable Angled Divider', 'codeweber-blocks')}
				checked={angledEnabled}
				onChange={onAngledEnabledChange}
			/>

			{angledEnabled && (
				<>
					<div className="component-sidebar-title">
						<label>{__('Upper', 'codeweber-blocks')}</label>
					</div>
					<div className="button-group-sidebar_33 mb-3">
						{UPPER_OPTIONS.map((option) => (
							<Button
								key={option.value || 'none-upper'}
								isPrimary={angledUpper === option.value}
								onClick={() => onAngledUpperChange(option.value)}
							>
								{option.label}
							</Button>
						))}
					</div>

					<div className="component-sidebar-title">
						<label>{__('Down', 'codeweber-blocks')}</label>
					</div>
					<div className="button-group-sidebar_33 mb-3">
						{LOWER_OPTIONS.map((option) => (
							<Button
								key={option.value || 'none-lower'}
								isPrimary={angledLower === option.value}
								onClick={() => onAngledLowerChange(option.value)}
							>
								{option.label}
							</Button>
						))}
					</div>

					{(angledUpper || angledLower) && (
						<div style={{ 
							padding: '10px', 
							background: '#f0f0f0', 
							borderRadius: '4px',
							marginTop: '12px',
							fontSize: '12px',
							color: '#666'
						}}>
							<strong>{__('Preview classes:', 'codeweber-blocks')}</strong>
							<code style={{ display: 'block', marginTop: '4px' }}>
								angled {angledUpper} {angledLower}
							</code>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default AngledControl;

