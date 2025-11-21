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
    } = attributes;

    const blockProps = useBlockProps.save();

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

