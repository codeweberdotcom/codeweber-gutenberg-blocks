import { __ } from '@wordpress/i18n';
import { SelectControl, RangeControl, ToggleControl } from '@wordpress/components';

const animationOptions = [
    { value: '', label: __('None', 'codeweber-blocks') },
    { value: 'fadeInUp', label: __('Fade In Up', 'codeweber-blocks') },
    { value: 'fadeInDown', label: __('Fade In Down', 'codeweber-blocks') },
    { value: 'fadeInLeft', label: __('Fade In Left', 'codeweber-blocks') },
    { value: 'fadeInRight', label: __('Fade In Right', 'codeweber-blocks') },
    { value: 'slideInUp', label: __('Slide In Up', 'codeweber-blocks') },
    { value: 'slideInDown', label: __('Slide In Down', 'codeweber-blocks') },
    { value: 'slideInLeft', label: __('Slide In Left', 'codeweber-blocks') },
    { value: 'slideInRight', label: __('Slide In Right', 'codeweber-blocks') },
    { value: 'zoomIn', label: __('Zoom In', 'codeweber-blocks') },
    { value: 'zoomOut', label: __('Zoom Out', 'codeweber-blocks') },
    { value: 'bounceIn', label: __('Bounce In', 'codeweber-blocks') },
    { value: 'rotateIn', label: __('Rotate In', 'codeweber-blocks') },
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