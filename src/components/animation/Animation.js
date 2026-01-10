import { __ } from '@wordpress/i18n';
import {
	SelectControl,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';

const animationOptions = [
	{ value: '', label: __('None', 'codeweber-gutenberg-blocks') },
	{ value: 'fadeIn', label: __('Fade In', 'codeweber-gutenberg-blocks') },
	{
		value: 'slideInLeft',
		label: __('Slide In Left', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'slideInRight',
		label: __('Slide In Right', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'slideInDown',
		label: __('Slide In Down', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'slideInUp',
		label: __('Slide In Up', 'codeweber-gutenberg-blocks'),
	},
	{ value: 'zoomIn', label: __('Zoom In', 'codeweber-gutenberg-blocks') },
	{ value: 'zoomOut', label: __('Zoom Out', 'codeweber-gutenberg-blocks') },
	{ value: 'rotateIn', label: __('Rotate In', 'codeweber-gutenberg-blocks') },
	{ value: 'bounceIn', label: __('Bounce In', 'codeweber-gutenberg-blocks') },
	{
		value: 'bounceInLeft',
		label: __('Bounce In Left', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'bounceInRight',
		label: __('Bounce In Right', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'bounceInDown',
		label: __('Bounce In Down', 'codeweber-gutenberg-blocks'),
	},
	{
		value: 'bounceInUp',
		label: __('Bounce In Up', 'codeweber-gutenberg-blocks'),
	},
	{ value: 'flipInX', label: __('Flip In X', 'codeweber-gutenberg-blocks') },
	{ value: 'flipInY', label: __('Flip In Y', 'codeweber-gutenberg-blocks') },
];

export const AnimationControl = ({ attributes, setAttributes }) => {
	const {
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
	} = attributes;

	return (
		<div>
			<ToggleControl
				label={__('Enable Animation', 'codeweber-gutenberg-blocks')}
				checked={animationEnabled}
				onChange={(value) => setAttributes({ animationEnabled: value })}
				help={
					animationEnabled
						? __(
								'Scroll in editor to preview animation',
								'codeweber-gutenberg-blocks'
							)
						: ''
				}
			/>
			{animationEnabled && (
				<>
					<SelectControl
						label={__(
							'Animation Type',
							'codeweber-gutenberg-blocks'
						)}
						value={animationType}
						options={animationOptions}
						onChange={(value) =>
							setAttributes({ animationType: value })
						}
					/>
					<RangeControl
						label={__(
							'Duration (ms)',
							'codeweber-gutenberg-blocks'
						)}
						value={animationDuration}
						onChange={(value) =>
							setAttributes({ animationDuration: value })
						}
						min={0}
						max={5000}
						step={100}
					/>
					<RangeControl
						label={__('Delay (ms)', 'codeweber-gutenberg-blocks')}
						value={animationDelay}
						onChange={(value) =>
							setAttributes({ animationDelay: value })
						}
						min={0}
						max={5000}
						step={100}
					/>
				</>
			)}
		</div>
	);
};
