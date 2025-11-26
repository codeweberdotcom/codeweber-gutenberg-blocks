import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { TabPanel, PanelBody, ButtonGroup, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { AnimationControl } from '../../components/animation/Animation';
import { getTitleClasses, getSubtitleClasses } from './utils';

const HeadingSubtitleEdit = ({ attributes, setAttributes }) => {
    const {
        enableTitle,
        enableSubtitle,
        title,
        subtitle,
        order,
        titleTag,
        subtitleTag,
        titleColor,
        titleColorType,
        subtitleColor,
        subtitleColorType,
        align,
        alignItems,
        justifyContent,
        position,
        spacing,
        animationEnabled,
        animationType,
        animationDuration,
        animationDelay,
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

    const elements = [];
    if (enableTitle) {
        elements.push(
            <RichText
                key="title"
                tagName={titleTag}
                value={title}
                onChange={(value) => setAttributes({ title: value })}
                className={getTitleClasses(attributes)}
                placeholder={__('Enter title...', 'codeweber-blocks')}
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
                placeholder={__('Enter subtitle...', 'codeweber-blocks')}
            />
        );
    }

    if (order === 'subtitle-first') {
        elements.reverse();
    }

    const tabs = [
        { name: 'content', title: 'Cnt' },
        { name: 'typography', title: 'Typ' },
        { name: 'align', title: 'Aln' },
        { name: 'spacing', title: 'Spc' },
        { name: 'animation', title: 'Ani' },
        { name: 'settings', title: 'Set' },
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
                                        title={__('Title Align', 'codeweber-blocks')}
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
                            {tab.name === 'animation' && (
                                <div style={{ padding: '16px' }}>
                                    <AnimationControl
                                        attributes={attributes}
                                        setAttributes={setAttributes}
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
                                            {__('Title', 'codeweber-blocks')}
                                        </Button>
                                        <Button
                                            isPrimary={activeElement === 'subtitle'}
                                            onClick={() => setActiveElement('subtitle')}
                                        >
                                            {__('Subtitle', 'codeweber-blocks')}
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
                                                classLabel: __('Title CSS Class', 'codeweber-blocks'),
                                                dataLabel: __('Title Data Attributes', 'codeweber-blocks'),
                                                idLabel: __('Title ID', 'codeweber-blocks'),
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
                                                classLabel: __('Subtitle CSS Class', 'codeweber-blocks'),
                                                dataLabel: __('Subtitle Data Attributes', 'codeweber-blocks'),
                                                idLabel: __('Subtitle ID', 'codeweber-blocks'),
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
                {elements.length > 0 ? elements : <div>{__('Title Block', 'codeweber-blocks')}</div>}
            </div>
        </>
    );
};

export default HeadingSubtitleEdit;

