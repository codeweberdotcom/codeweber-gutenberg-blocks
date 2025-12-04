import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import { createHeadingTagOptions, createSubtitleTagOptions } from '../../blocks/heading-subtitle/utils';

export const HeadingContentControl = ({ attributes, setAttributes, hideSubtitle = false }) => {
    const {
        enableTitle,
        enableSubtitle,
        enableText,
        title,
        subtitle,
        text,
        order,
        titleTag,
        subtitleTag,
        subtitleLine,
    } = attributes;

    return (
        <>
            <ToggleControl
                label={__('Enable Title', 'codeweber-gutenberg-blocks')}
                checked={enableTitle}
                onChange={(value) => setAttributes({ enableTitle: value })}
            />
            {!hideSubtitle && (
                <>
                    <ToggleControl
                        label={__('Enable Subtitle', 'codeweber-gutenberg-blocks')}
                        checked={enableSubtitle}
                        onChange={(value) => setAttributes({ enableSubtitle: value })}
                    />
                </>
            )}
            <ToggleControl
                label={__('Enable Paragraph', 'codeweber-gutenberg-blocks')}
                checked={enableText}
                onChange={(value) => setAttributes({ enableText: value })}
            />
            {!hideSubtitle && (
                <>
                    <ToggleControl
                        label={__('Subtitle First', 'codeweber-gutenberg-blocks')}
                        checked={order === 'subtitle-first'}
                        onChange={(value) => setAttributes({ order: value ? 'subtitle-first' : 'title-first' })}
                    />
                    <ToggleControl
                        label={__('Subtitle Line', 'codeweber-gutenberg-blocks')}
                        checked={subtitleLine}
                        onChange={(value) => setAttributes({ subtitleLine: value })}
                    />
                </>
            )}
            {enableTitle && (
                <div className="mb-3">
                    <label>{__('Title Text', 'codeweber-gutenberg-blocks')}</label>
                    <div style={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px',
                        minHeight: '40px',
                        backgroundColor: '#fff'
                    }}>
                        <RichText
                            tagName="div"
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
                            allowedFormats={[]}
                            __unstableAllowHtml={true}
                        />
                    </div>
                </div>
            )}
            {!hideSubtitle && enableSubtitle && (
                <div className="mb-3">
                    <label>{__('Subtitle Text', 'codeweber-gutenberg-blocks')}</label>
                    <div style={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px',
                        minHeight: '40px',
                        backgroundColor: '#fff'
                    }}>
                        <RichText
                            tagName="div"
                            value={subtitle}
                            onChange={(value) => setAttributes({ subtitle: value })}
                            placeholder={__('Enter subtitle...', 'codeweber-gutenberg-blocks')}
                            allowedFormats={[]}
                            __unstableAllowHtml={true}
                        />
                    </div>
                </div>
            )}
            {enableText && (
                <div className="mb-3">
                    <label>{__('Paragraph Text', 'codeweber-gutenberg-blocks')}</label>
                    <div style={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px',
                        minHeight: '80px',
                        backgroundColor: '#fff'
                    }}>
                        <RichText
                            tagName="div"
                            value={text}
                            onChange={(value) => setAttributes({ text: value })}
                            placeholder={__('Enter paragraph...', 'codeweber-gutenberg-blocks')}
                            allowedFormats={[]}
                            __unstableAllowHtml={true}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

