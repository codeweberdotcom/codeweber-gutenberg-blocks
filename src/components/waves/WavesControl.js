/**
 * Waves Control Component
 * Based on Sandbox theme dividers: https://sandbox.elemisthemes.com/docs/elements/dividers.html
 */
import { __ } from '@wordpress/i18n';
import { Button, ToggleControl, SelectControl } from '@wordpress/components';

const WAVE_OPTIONS = [
	{ value: '', label: __('None', 'codeweber-gutenberg-blocks') },
	{ value: 'wave-1', label: __('Wave 1', 'codeweber-gutenberg-blocks') },
	{ value: 'wave-2', label: __('Wave 2', 'codeweber-gutenberg-blocks') },
	{ value: 'wave-3', label: __('Wave 3', 'codeweber-gutenberg-blocks') },
	{ value: 'wave-4', label: __('Wave 4', 'codeweber-gutenberg-blocks') },
	{ value: 'wave-5', label: __('Wave 5', 'codeweber-gutenberg-blocks') },
];

const WAVE_POSITION_OPTIONS = [
	{ value: 'top', label: __('Top', 'codeweber-gutenberg-blocks') },
	{ value: 'bottom', label: __('Bottom', 'codeweber-gutenberg-blocks') },
];

// Wave SVG paths from Sandbox theme
export const WAVE_SVGS = {
	'wave-1': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 70"><path fill="currentColor" d="M1440,70H0V45.16a5762.49,5762.49,0,0,1,1440,0Z"/></svg>',
	'wave-2': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60"><path fill="currentColor" d="M0,0V60H1440V0A5771,5771,0,0,1,0,0Z"/></svg>',
	'wave-3': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 92.26"><path fill="currentColor" d="M1206,21.2c-60-5-119-36.92-291-5C772,51.11,768,48.42,708,43.13c-60-5.68-108-29.92-168-30.22-60,.3-147,27.93-207,28.23-60-.3-122-25.94-182-36.91S30,5.93,0,16.2V92.26H1440v-87l-30,5.29C1348.94,22.29,1266,26.19,1206,21.2Z"/></svg>',
	'wave-4': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"><path fill="currentColor" d="M1260,1.65c-60-5.07-119.82,2.47-179.83,10.13s-120,11.48-180,9.57-120-7.66-180-6.42c-60,1.63-120,11.21-180,16a1129.52,1129.52,0,0,1-180,0c-60-4.78-120-14.36-180-19.14S60,7,30,7H0v93H1440V30.89C1380.07,23.2,1319.93,6.15,1260,1.65Z"/></svg>',
	'wave-5': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"><path fill="currentColor" d="M1260.2,37.86c-60-10-120-20.07-180-16.76-60,3.71-120,19.77-180,18.47-60-1.71-120-21.78-180-31.82s-120-10-180-1.7c-60,8.73-120,24.79-180,28.5-60,3.31-120-6.73-180-11.74s-120-5-150-5H0V100H1440V49.63C1380.07,57.9,1320.13,47.88,1260.2,37.86Z"/></svg>',
};

// Preview component for waves
const WavePreview = ({ waveType, position }) => {
	if (!waveType || !WAVE_SVGS[waveType]) return null;
	
	return (
		<div style={{
			width: '100%',
			height: '40px',
			overflow: 'hidden',
			background: '#f0f0f0',
			position: 'relative',
			borderRadius: '4px',
			marginTop: '8px',
		}}>
			<div 
				style={{
					position: 'absolute',
					left: '-4px',
					right: '-4px',
					[position]: 0,
					color: '#007cba',
					transform: position === 'top' ? 'rotate(180deg)' : 'none',
				}}
				dangerouslySetInnerHTML={{ __html: WAVE_SVGS[waveType] }}
			/>
		</div>
	);
};

export const WavesControl = ({
	waveTopEnabled,
	waveTopType,
	waveBottomEnabled,
	waveBottomType,
	onWaveTopEnabledChange,
	onWaveTopTypeChange,
	onWaveBottomEnabledChange,
	onWaveBottomTypeChange,
}) => {
	return (
		<>
			{/* Top Wave */}
			<ToggleControl
				label={__('Enable Top Wave', 'codeweber-gutenberg-blocks')}
				checked={waveTopEnabled}
				onChange={onWaveTopEnabledChange}
			/>

			{waveTopEnabled && (
				<>
					<SelectControl
						label={__('Top Wave Style', 'codeweber-gutenberg-blocks')}
						value={waveTopType}
						options={WAVE_OPTIONS}
						onChange={onWaveTopTypeChange}
					/>
					<WavePreview waveType={waveTopType} position="top" />
				</>
			)}

			<div style={{ marginTop: '16px' }} />

			{/* Bottom Wave */}
			<ToggleControl
				label={__('Enable Bottom Wave', 'codeweber-gutenberg-blocks')}
				checked={waveBottomEnabled}
				onChange={onWaveBottomEnabledChange}
			/>

			{waveBottomEnabled && (
				<>
					<SelectControl
						label={__('Bottom Wave Style', 'codeweber-gutenberg-blocks')}
						value={waveBottomType}
						options={WAVE_OPTIONS}
						onChange={onWaveBottomTypeChange}
					/>
					<WavePreview waveType={waveBottomType} position="bottom" />
				</>
			)}
		</>
	);
};

export default WavesControl;

