import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl, ComboboxControl, ButtonGroup, Button, TextControl } from '@wordpress/components';
import { ColorTypeControl } from '../colors/ColorTypeControl';
import { TagControl } from '../tag';
import { colors } from '../../utilities/colors';
import {
	createSizeOptions,
	createWeightOptions,
	createTransformOptions,
	createLeadOptions,
} from '../../blocks/heading-subtitle/utils';

export const HeadingTypographyControl = ({ attributes, setAttributes, hideSubtitle = false }) => {
    const {
        titleTag,
        subtitleTag,
        textTag,
        titleColor,
        titleColorType,
        subtitleColor,
        subtitleColorType,
        textColor,
        textColorType,
        titleSize,
        subtitleSize,
        textSize,
        titleWeight,
        subtitleWeight,
        textWeight,
        titleTransform,
        subtitleTransform,
        textTransform,
        titleClass,
        subtitleClass,
        textClass,
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
                    {__('Title', 'codeweber-gutenberg-blocks')}
                </Button>
                {!hideSubtitle && (
                    <Button
                        isPrimary={activeTab === 'subtitle'}
                        onClick={() => setActiveTab('subtitle')}
                    >
                        {__('Subtitle', 'codeweber-gutenberg-blocks')}
                    </Button>
                )}
                <Button
                    isPrimary={activeTab === 'paragraph'}
                    onClick={() => setActiveTab('paragraph')}
                >
                    {__('Paragraph', 'codeweber-gutenberg-blocks')}
                </Button>
            </ButtonGroup>
            {activeTab === 'title' && (
                <>
                    <TagControl
                        label={__('Title Tag', 'codeweber-gutenberg-blocks')}
                        value={titleTag}
                        onChange={(value) => setAttributes({ titleTag: value })}
                        type="heading"
                    />
                    <ColorTypeControl
                        label={__('Title Color Type', 'codeweber-gutenberg-blocks')}
                        value={titleColorType}
                        onChange={(value) => setAttributes({ titleColorType: value })}
                        options={[
                            { value: 'solid', label: __('Solid', 'codeweber-gutenberg-blocks') },
                            { value: 'soft', label: __('Soft', 'codeweber-gutenberg-blocks') },
                            { value: 'pale', label: __('Pale', 'codeweber-gutenberg-blocks') },
                        ]}
                    />
                    <ComboboxControl
                        label={__('Title Color', 'codeweber-gutenberg-blocks')}
                        value={titleColor}
                        options={colors}
                        onChange={(value) => setAttributes({ titleColor: value })}
                    />
                    <SelectControl
                        label={__('Title Size', 'codeweber-gutenberg-blocks')}
                        value={titleSize}
                        options={createSizeOptions()}
                        onChange={(value) => setAttributes({ titleSize: value })}
                    />
                    <SelectControl
                        label={__('Title Weight', 'codeweber-gutenberg-blocks')}
                        value={titleWeight}
                        options={createWeightOptions()}
                        onChange={(value) => setAttributes({ titleWeight: value })}
                    />
                    <SelectControl
                        label={__('Title Transform', 'codeweber-gutenberg-blocks')}
                        value={titleTransform}
                        options={createTransformOptions()}
                        onChange={(value) => setAttributes({ titleTransform: value })}
                    />
                    <TextControl
                        label={__('Title Class', 'codeweber-gutenberg-blocks')}
                        value={titleClass}
                        onChange={(value) => setAttributes({ titleClass: value })}
                        placeholder="mb-4 custom-class"
                        help={__('Additional CSS classes', 'codeweber-gutenberg-blocks')}
                    />
                </>
            )}
            {activeTab === 'subtitle' && (
                <>
                    <TagControl
                        label={__('Subtitle Tag', 'codeweber-gutenberg-blocks')}
                        value={subtitleTag}
                        onChange={(value) => setAttributes({ subtitleTag: value })}
                        type="subtitle"
                    />
                    <ColorTypeControl
                        label={__('Subtitle Color Type', 'codeweber-gutenberg-blocks')}
                        value={subtitleColorType}
                        onChange={(value) => setAttributes({ subtitleColorType: value })}
                        options={[
                            { value: 'solid', label: __('Solid', 'codeweber-gutenberg-blocks') },
                            { value: 'soft', label: __('Soft', 'codeweber-gutenberg-blocks') },
                            { value: 'pale', label: __('Pale', 'codeweber-gutenberg-blocks') },
                        ]}
                    />
                    <ComboboxControl
                        label={__('Subtitle Color', 'codeweber-gutenberg-blocks')}
                        value={subtitleColor}
                        options={colors}
                        onChange={(value) => setAttributes({ subtitleColor: value })}
                    />
                    <SelectControl
                        label={__('Subtitle Size', 'codeweber-gutenberg-blocks')}
                        value={subtitleSize}
                        options={createSizeOptions()}
                        onChange={(value) => setAttributes({ subtitleSize: value })}
                    />
                    <SelectControl
                        label={__('Subtitle Weight', 'codeweber-gutenberg-blocks')}
                        value={subtitleWeight}
                        options={createWeightOptions()}
                        onChange={(value) => setAttributes({ subtitleWeight: value })}
                    />
                    <SelectControl
                        label={__('Subtitle Transform', 'codeweber-gutenberg-blocks')}
                        value={subtitleTransform}
                        options={createTransformOptions()}
                        onChange={(value) => setAttributes({ subtitleTransform: value })}
                    />
                    <SelectControl
                        label={__('Lead Style', 'codeweber-gutenberg-blocks')}
                        value={lead}
                        options={createLeadOptions()}
                        onChange={(value) => setAttributes({ lead: value })}
                    />
					<TextControl
                        label={__('Subtitle Class', 'codeweber-gutenberg-blocks')}
                        value={subtitleClass}
                        onChange={(value) => setAttributes({ subtitleClass: value })}
                        placeholder="mb-4 custom-class"
                        help={__('Additional CSS classes', 'codeweber-gutenberg-blocks')}
                    />
                </>
            )}
            {activeTab === 'paragraph' && (
                <>
                    <TagControl
                        label={__('Paragraph Tag', 'codeweber-gutenberg-blocks')}
                        value={textTag}
                        onChange={(value) => setAttributes({ textTag: value })}
                        type="text"
                    />
                    <ColorTypeControl
                        label={__('Paragraph Color Type', 'codeweber-gutenberg-blocks')}
                        value={textColorType}
                        onChange={(value) => setAttributes({ textColorType: value })}
                        options={[
                            { value: 'solid', label: __('Solid', 'codeweber-gutenberg-blocks') },
                            { value: 'soft', label: __('Soft', 'codeweber-gutenberg-blocks') },
                            { value: 'pale', label: __('Pale', 'codeweber-gutenberg-blocks') },
                        ]}
                    />
                    <ComboboxControl
                        label={__('Paragraph Color', 'codeweber-gutenberg-blocks')}
                        value={textColor}
                        options={colors}
                        onChange={(value) => setAttributes({ textColor: value })}
                    />
                    <SelectControl
                        label={__('Paragraph Size', 'codeweber-gutenberg-blocks')}
                        value={textSize}
                        options={createSizeOptions()}
                        onChange={(value) => setAttributes({ textSize: value })}
                    />
                    <SelectControl
                        label={__('Paragraph Weight', 'codeweber-gutenberg-blocks')}
                        value={textWeight}
                        options={createWeightOptions()}
                        onChange={(value) => setAttributes({ textWeight: value })}
                    />
                    <SelectControl
                        label={__('Paragraph Transform', 'codeweber-gutenberg-blocks')}
                        value={textTransform}
                        options={createTransformOptions()}
                        onChange={(value) => setAttributes({ textTransform: value })}
                    />
                    <TextControl
                        label={__('Paragraph Class', 'codeweber-gutenberg-blocks')}
                        value={textClass}
                        onChange={(value) => setAttributes({ textClass: value })}
                        placeholder="mb-4 custom-class"
                        help={__('Additional CSS classes', 'codeweber-gutenberg-blocks')}
                    />
                </>
            )}
        </div>
    );
};

