import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl, ComboboxControl, ButtonGroup, Button } from '@wordpress/components';
import { ColorTypeControl } from '../colors/ColorTypeControl';
import { colors } from '../../utilities/colors';
import {
    createSizeOptions,
    createWeightOptions,
    createTransformOptions,
} from '../../blocks/heading-subtitle/utils';

export const HeadingTypographyControl = ({ attributes, setAttributes }) => {
    const {
        titleColor,
        titleColorType,
        subtitleColor,
        subtitleColorType,
        titleSize,
        subtitleSize,
        titleWeight,
        subtitleWeight,
        titleTransform,
        subtitleTransform,
        titleLine,
        subtitleLine,
        lead,
    } = attributes;

    const [activeTab, setActiveTab] = useState('title');

    return (
        <div style={{ padding: '16px' }}>
            <ButtonGroup>
                <Button
                    isPrimary={activeTab === 'title'}
                    onClick={() => setActiveTab('title')}
                >
                    {__('Title', 'codeweber-blocks')}
                </Button>
                <Button
                    isPrimary={activeTab === 'subtitle'}
                    onClick={() => setActiveTab('subtitle')}
                >
                    {__('Subtitle', 'codeweber-blocks')}
                </Button>
            </ButtonGroup>
            {activeTab === 'title' && (
                <>
                    <ColorTypeControl
                        label={__('Title Color Type', 'codeweber-blocks')}
                        value={titleColorType}
                        onChange={(value) => setAttributes({ titleColorType: value })}
                        options={[
                            { value: 'solid', label: __('Solid', 'codeweber-blocks') },
                            { value: 'soft', label: __('Soft', 'codeweber-blocks') },
                            { value: 'pale', label: __('Pale', 'codeweber-blocks') },
                        ]}
                    />
                    <ComboboxControl
                        label={__('Title Color', 'codeweber-blocks')}
                        value={titleColor}
                        options={colors}
                        onChange={(value) => setAttributes({ titleColor: value })}
                    />
                    <SelectControl
                        label={__('Title Size', 'codeweber-blocks')}
                        value={titleSize}
                        options={createSizeOptions()}
                        onChange={(value) => setAttributes({ titleSize: value })}
                    />
                    <SelectControl
                        label={__('Title Weight', 'codeweber-blocks')}
                        value={titleWeight}
                        options={createWeightOptions()}
                        onChange={(value) => setAttributes({ titleWeight: value })}
                    />
                    <SelectControl
                        label={__('Title Transform', 'codeweber-blocks')}
                        value={titleTransform}
                        options={createTransformOptions()}
                        onChange={(value) => setAttributes({ titleTransform: value })}
                    />
                    <ToggleControl
                        label={__('Title Line', 'codeweber-blocks')}
                        checked={titleLine}
                        onChange={(value) => setAttributes({ titleLine: value })}
                    />
                </>
            )}
            {activeTab === 'subtitle' && (
                <>
                    <ColorTypeControl
                        label={__('Subtitle Color Type', 'codeweber-blocks')}
                        value={subtitleColorType}
                        onChange={(value) => setAttributes({ subtitleColorType: value })}
                        options={[
                            { value: 'solid', label: __('Solid', 'codeweber-blocks') },
                            { value: 'soft', label: __('Soft', 'codeweber-blocks') },
                            { value: 'pale', label: __('Pale', 'codeweber-blocks') },
                        ]}
                    />
                    <ComboboxControl
                        label={__('Subtitle Color', 'codeweber-blocks')}
                        value={subtitleColor}
                        options={colors}
                        onChange={(value) => setAttributes({ subtitleColor: value })}
                    />
                    <SelectControl
                        label={__('Subtitle Size', 'codeweber-blocks')}
                        value={subtitleSize}
                        options={createSizeOptions()}
                        onChange={(value) => setAttributes({ subtitleSize: value })}
                    />
                    <SelectControl
                        label={__('Subtitle Weight', 'codeweber-blocks')}
                        value={subtitleWeight}
                        options={createWeightOptions()}
                        onChange={(value) => setAttributes({ subtitleWeight: value })}
                    />
                    <SelectControl
                        label={__('Subtitle Transform', 'codeweber-blocks')}
                        value={subtitleTransform}
                        options={createTransformOptions()}
                        onChange={(value) => setAttributes({ subtitleTransform: value })}
                    />
                    <ToggleControl
                        label={__('Subtitle Line', 'codeweber-blocks')}
                        checked={subtitleLine}
                        onChange={(value) => setAttributes({ subtitleLine: value })}
                    />
                    <ToggleControl
                        label={__('Lead Style', 'codeweber-blocks')}
                        checked={lead}
                        onChange={(value) => setAttributes({ lead: value })}
                    />
                </>
            )}
        </div>
    );
};

