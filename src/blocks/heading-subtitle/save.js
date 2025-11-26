import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getTitleClasses, getSubtitleClasses } from './utils';

const HeadingSubtitleSave = ({ attributes }) => {
    const {
        enableTitle,
        enableSubtitle,
        title,
        subtitle,
        order,
        titleTag,
        subtitleTag,
        animationEnabled,
        animationType,
        animationDuration,
        animationDelay,
    } = attributes;

    const blockProps = useBlockProps.save({
        ...(animationEnabled && animationType && {
            'data-cue': animationType,
            'data-duration': animationDuration,
            'data-delay': animationDelay,
        }),
    });

    const elements = [];
    if (enableTitle) {
        elements.push(
            <RichText.Content
                key="title"
                tagName={titleTag}
                value={title}
                className={getTitleClasses(attributes)}
            />
        );
    }
    if (enableSubtitle) {
        elements.push(
            <RichText.Content
                key="subtitle"
                tagName={subtitleTag}
                value={subtitle}
                className={getSubtitleClasses(attributes)}
            />
        );
    }

    if (order === 'subtitle-first') {
        elements.reverse();
    }

    return (
        <div {...blockProps}>
            {elements}
        </div>
    );
};

export default HeadingSubtitleSave;

