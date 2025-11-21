import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import { createHeadingTagOptions, createSubtitleTagOptions } from '../../blocks/heading-subtitle/utils';

export const HeadingContentControl = ({ attributes, setAttributes }) => {
    const {
        enableTitle,
        enableSubtitle,
        title,
        subtitle,
        order,
        titleTag,
        subtitleTag,
    } = attributes;

    return (
        <PanelBody title={__('Content Settings', 'codeweber-blocks')} className="custom-panel-body">
            <ToggleControl
                label={__('Enable Title', 'codeweber-blocks')}
                checked={enableTitle}
                onChange={(value) => setAttributes({ enableTitle: value })}
            />
            <ToggleControl
                label={__('Enable Subtitle', 'codeweber-blocks')}
                checked={enableSubtitle}
                onChange={(value) => setAttributes({ enableSubtitle: value })}
            />
            <ToggleControl
                label={__('Subtitle First', 'codeweber-blocks')}
                checked={order === 'subtitle-first'}
                onChange={(value) => setAttributes({ order: value ? 'subtitle-first' : 'title-first' })}
            />
            {enableTitle && (
                <div className="mb-3">
                    <label>{__('Title Text', 'codeweber-blocks')}</label>
                    <RichText
                        tagName="div"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Enter title...', 'codeweber-blocks')}
                    />
                </div>
            )}
            {enableSubtitle && (
                <div className="mb-3">
                    <label>{__('Subtitle Text', 'codeweber-blocks')}</label>
                    <RichText
                        tagName="div"
                        value={subtitle}
                        onChange={(value) => setAttributes({ subtitle: value })}
                        placeholder={__('Enter subtitle...', 'codeweber-blocks')}
                    />
                </div>
            )}
        </PanelBody>
    );
};

