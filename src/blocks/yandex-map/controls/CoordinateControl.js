/**
 * Coordinate Control - Input for map center coordinates
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { BaseControl, TextControl } from '@wordpress/components';

export const CoordinateControl = ({ label, value, onChange }) => {
	const handleLatChange = (newLat) => {
		onChange({
			...value,
			lat: parseFloat(newLat) || 0,
		});
	};

	const handleLngChange = (newLng) => {
		onChange({
			...value,
			lng: parseFloat(newLng) || 0,
		});
	};

	return (
		<BaseControl label={label} __nextHasNoMarginBottom>
			<div style={{ display: 'flex', gap: '8px' }}>
				<TextControl
					label={__('Latitude', 'codeweber-gutenberg-blocks')}
					value={value?.lat || ''}
					onChange={handleLatChange}
					type="number"
					step="0.000001"
					placeholder="55.76"
					style={{ flex: 1 }}
				/>
				<TextControl
					label={__('Longitude', 'codeweber-gutenberg-blocks')}
					value={value?.lng || ''}
					onChange={handleLngChange}
					type="number"
					step="0.000001"
					placeholder="37.64"
					style={{ flex: 1 }}
				/>
			</div>
		</BaseControl>
	);
};























