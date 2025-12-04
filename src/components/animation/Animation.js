import { __ } from '@wordpress/i18n';
import { SelectControl, RangeControl, ToggleControl } from '@wordpress/components';

const animationOptions = [
    { value: '', label: __('None', 'codeweber-blocks') },
    { value: 'fadeIn', label: __('Fade In', 'codeweber-blocks') },
    { value: 'slideInLeft', label: __('Slide In Left', 'codeweber-blocks') },
    { value: 'slideInRight', label: __('Slide In Right', 'codeweber-blocks') },
    { value: 'slideInDown', label: __('Slide In Down', 'codeweber-blocks') },
    { value: 'slideInUp', label: __('Slide In Up', 'codeweber-blocks') },
    { value: 'zoomIn', label: __('Zoom In', 'codeweber-blocks') },
    { value: 'zoomOut', label: __('Zoom Out', 'codeweber-blocks') },
    { value: 'rotateIn', label: __('Rotate In', 'codeweber-blocks') },
    { value: 'bounceIn', label: __('Bounce In', 'codeweber-blocks') },
    { value: 'bounceInLeft', label: __('Bounce In Left', 'codeweber-blocks') },
    { value: 'bounceInRight', label: __('Bounce In Right', 'codeweber-blocks') },
    { value: 'bounceInDown', label: __('Bounce In Down', 'codeweber-blocks') },
    { value: 'bounceInUp', label: __('Bounce In Up', 'codeweber-blocks') },
    { value: 'flipInX', label: __('Flip In X', 'codeweber-blocks') },
    { value: 'flipInY', label: __('Flip In Y', 'codeweber-blocks') },
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
                label={__('Enable Animation', 'codeweber-blocks')}
                checked={animationEnabled}
                onChange={(value) => setAttributes({ animationEnabled: value })}
                help={animationEnabled ? __('Scroll in editor to preview animation', 'codeweber-blocks') : ''}
            />
            {animationEnabled && (
                <>
                    <SelectControl
                        label={__('Animation Type', 'codeweber-blocks')}
                        value={animationType}
                        options={animationOptions}
                        onChange={(value) => setAttributes({ animationType: value })}
                    />
                    <RangeControl
                        label={__('Duration (ms)', 'codeweber-blocks')}
                        value={animationDuration}
                        onChange={(value) => setAttributes({ animationDuration: value })}
                        min={0}
                        max={5000}
                        step={100}
                    />
                    <RangeControl
                        label={__('Delay (ms)', 'codeweber-blocks')}
                        value={animationDelay}
                        onChange={(value) => setAttributes({ animationDelay: value })}
                        min={0}
                        max={5000}
                        step={100}
                    />
                </>
            )}
        </div>
    );
};