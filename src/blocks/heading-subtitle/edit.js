import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { TabPanel, PanelBody, ButtonGroup, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Icon, edit, typography, positionCenter, resizeCornerNE, cog } from '@wordpress/icons';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
    <span title={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon icon={icon} size={20} />
    </span>
);
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { getTitleClasses, getSubtitleClasses } from './utils';
import { ParagraphRender } from '../../components/paragraph';

const HeadingSubtitleEdit = ({ attributes, setAttributes }) => {
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
        textTag,
        titleColor,
        titleColorType,
        subtitleColor,
        subtitleColorType,
        align,
        alignItems,
        justifyContent,
        position,
        spacing,
        spacingType,
        spacingXs,
        spacingSm,
        spacingMd,
        spacingLg,
        spacingXl,
        spacingXxl,
    } = attributes;

    const [activeElement, setActiveElement] = useState('title');

    const blockProps = useBlockProps();

    // Функция для очистки тегов strong из HTML
    const cleanStrongTags = (html) => {
        if (!html) return html;
        // Удаляем все вложенные теги strong, сохраняя содержимое
        let cleaned = html;
        let previous = '';
        // Повторяем до тех пор, пока есть изменения
        while (cleaned !== previous) {
            previous = cleaned;
            cleaned = cleaned
                .replace(/<strong[^>]*>/gi, '')
                .replace(/<\/strong>/gi, '');
        }
        return cleaned;
    };

    // Очищаем title от strong тегов при загрузке блока
    useEffect(() => {
        if (title && title.includes('<strong')) {
            const cleaned = cleanStrongTags(title);
            if (cleaned !== title) {
                setAttributes({ title: cleaned });
            }
        }
    }, []); // Только при монтировании компонента

    const elements = [];
    if (enableTitle) {
        elements.push(
            <RichText
                key="title"
                tagName={titleTag}
                value={title}
                onChange={(value) => {
                    // Очищаем strong теги при изменении
                    const cleaned = cleanStrongTags(value);
                    setAttributes({ title: cleaned });
                }}
                className={getTitleClasses(attributes)}
                placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
                allowedFormats={[]}
                withoutInteractiveFormatting
            />
        );
    }
    if (enableSubtitle) {
        elements.push(
            <RichText
                key="subtitle"
                tagName={subtitleTag}
                value={subtitle}
                onChange={(value) => setAttributes({ subtitle: value })}
                className={getSubtitleClasses(attributes)}
                placeholder={__('Enter subtitle...', 'codeweber-gutenberg-blocks')}
                allowedFormats={[]}
                withoutInteractiveFormatting
            />
        );
    }
    if (order === 'subtitle-first') {
        elements.reverse();
    }

    // Paragraph всегда после title и subtitle
    if (enableText) {
        elements.push(
            <ParagraphRender
                key="text"
                attributes={attributes}
                setAttributes={setAttributes}
                prefix=""
                tag={textTag}
            />
        );
    }

    const tabs = [
        { name: 'content', title: <TabIcon icon={edit} label={__('Content', 'codeweber-gutenberg-blocks')} /> },
        { name: 'typography', title: <TabIcon icon={typography} label={__('Typography', 'codeweber-gutenberg-blocks')} /> },
        { name: 'align', title: <TabIcon icon={positionCenter} label={__('Align', 'codeweber-gutenberg-blocks')} /> },
        { name: 'spacing', title: <TabIcon icon={resizeCornerNE} label={__('Spacing', 'codeweber-gutenberg-blocks')} /> },
        { name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
    ];

    return (
        <>
            <InspectorControls>
                <TabPanel
                    tabs={tabs}
                >
                    {(tab) => (
                        <>
                            {tab.name === 'content' && (
                                <div style={{ padding: '16px' }}>
                                    <HeadingContentControl
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                    />
                                </div>
                            )}
                            {tab.name === 'typography' && (
                                <div style={{ padding: '16px' }}>
                                    <HeadingTypographyControl
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                    />
                                </div>
                            )}
                            {tab.name === 'align' && (
                                <div style={{ padding: '16px' }}>
                                    <PositioningControl
                                        title={__('Title Align', 'codeweber-gutenberg-blocks')}
                                        alignItems={alignItems}
                                        onAlignItemsChange={(value) => setAttributes({ alignItems: value })}
                                        justifyContent={justifyContent}
                                        onJustifyContentChange={(value) => setAttributes({ justifyContent: value })}
                                        textAlign={align}
                                        onTextAlignChange={(value) => setAttributes({ align: value })}
                                        position={position}
                                        onPositionChange={(value) => setAttributes({ position: value })}
                                        noPanel={true}
                                    />
                                </div>
                            )}
                            {tab.name === 'spacing' && (
                                <div style={{ padding: '16px' }}>
                                    <SpacingControl
                                        spacingType={spacingType}
                                        spacingXs={spacingXs}
                                        spacingSm={spacingSm}
                                        spacingMd={spacingMd}
                                        spacingLg={spacingLg}
                                        spacingXl={spacingXl}
                                        spacingXxl={spacingXxl}
                                        onChange={(key, value) => setAttributes({ [key]: value })}
                                    />
                                </div>
                            )}
                            {tab.name === 'settings' && (
                                <div style={{ padding: '16px' }}>
                                    <ButtonGroup style={{ marginBottom: '16px' }}>
                                        <Button
                                            isPrimary={activeElement === 'title'}
                                            onClick={() => setActiveElement('title')}
                                        >
                                            {__('Title', 'codeweber-gutenberg-blocks')}
                                        </Button>
                                        <Button
                                            isPrimary={activeElement === 'subtitle'}
                                            onClick={() => setActiveElement('subtitle')}
                                        >
                                            {__('Subtitle', 'codeweber-gutenberg-blocks')}
                                        </Button>
                                        <Button
                                            isPrimary={activeElement === 'paragraph'}
                                            onClick={() => setActiveElement('paragraph')}
                                        >
                                            {__('Paragraph', 'codeweber-gutenberg-blocks')}
                                        </Button>
                                    </ButtonGroup>
                                    {activeElement === 'title' && (
                                        <BlockMetaFields
                                            attributes={attributes}
                                            setAttributes={setAttributes}
                                            fieldKeys={{
                                                classKey: 'titleClass',
                                                dataKey: 'titleData',
                                                idKey: 'titleId',
                                            }}
                                            labels={{
                                                classLabel: __('Title CSS Class', 'codeweber-gutenberg-blocks'),
                                                dataLabel: __('Title Data Attributes', 'codeweber-gutenberg-blocks'),
                                                idLabel: __('Title ID', 'codeweber-gutenberg-blocks'),
                                            }}
                                        />
                                    )}
                                    {activeElement === 'subtitle' && (
                                        <BlockMetaFields
                                            attributes={attributes}
                                            setAttributes={setAttributes}
                                            fieldKeys={{
                                                classKey: 'subtitleClass',
                                                dataKey: 'subtitleData',
                                                idKey: 'subtitleId',
                                            }}
                                            labels={{
                                                classLabel: __('Subtitle CSS Class', 'codeweber-gutenberg-blocks'),
                                                dataLabel: __('Subtitle Data Attributes', 'codeweber-gutenberg-blocks'),
                                                idLabel: __('Subtitle ID', 'codeweber-gutenberg-blocks'),
                                            }}
                                        />
                                    )}
                                    {activeElement === 'paragraph' && (
                                        <BlockMetaFields
                                            attributes={attributes}
                                            setAttributes={setAttributes}
                                            fieldKeys={{
                                                classKey: 'textClass',
                                                dataKey: 'textData',
                                                idKey: 'textId',
                                            }}
                                            labels={{
                                                classLabel: __('Paragraph CSS Class', 'codeweber-gutenberg-blocks'),
                                                dataLabel: __('Paragraph Data Attributes', 'codeweber-gutenberg-blocks'),
                                                idLabel: __('Paragraph ID', 'codeweber-gutenberg-blocks'),
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </TabPanel>
            </InspectorControls>
            <div {...blockProps}>
                {elements.length > 0 ? elements : <div>{__('Title Block', 'codeweber-gutenberg-blocks')}</div>}
            </div>
        </>
    );
};

export default HeadingSubtitleEdit;

